/**
 * Sondeo de webs con Playwright (docs/16 §1 y §6 F4): mide librerías, fuentes, escala tipográfica, titulares, márgenes,
 * rejillas, superficies, elementos fijos y movimiento, en escritorio (1440×900) y móvil (390×844), con capturas.
 *
 *   npm run refs:probe -- https://ejemplo.com https://otra.com        → .refs/<fecha>/datos.json + capturas
 *   npm run refs:probe -- --guides http://localhost:3000               → mide las 8 guías de /guias y las compara con los
 *                                                                          rangos de las webs premiadas (docs/16 §2)
 *   npm run refs:probe -- --par <url-original> <url-réplica> [--nombre q47]
 *                                                                      → mide las dos y escribe par.md con las diferencias
 *                                                                        (en .refs3d/pares/<nombre>/, se ve en /lab/cine/archivo)
 * Opciones: --out <carpeta> (por defecto .refs/<fecha>), --wait <ms> (espera a la intro, 7000), --no-mobile, --no-shots,
 * --no-hover (no pasa el ratón por enlaces y botones).
 *
 * Además de las constantes de docs/16 mide la paleta por superficie (fondos por área y textos por caracteres), los radios,
 * las curvas de las transiciones y qué cambia al pasar el ratón por los enlaces y botones del primer pantallazo
 * (docs/53 §3).
 *
 * Navegador: el Chromium de Playwright si está instalado (`npx playwright install chromium`); si no, el más reciente que haya
 * en la caché de Playwright (%LOCALAPPDATA%\ms-playwright o ~/.cache/ms-playwright), o el de PLAYWRIGHT_CHROMIUM.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { STYLE_GUIDES } from "../lib/ui/guides";
import { chromiumPath } from "./chromium-path.mts";
import { AVISO } from "./cine/navegador.mts";

const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(name);
const opt = (name: string, fallback: string) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const guidesBase = flag("--guides") ? opt("--guides", "http://localhost:3000") : null;
const parIdx = argv.indexOf("--par");
const par = parIdx >= 0 ? [argv[parIdx + 1], argv[parIdx + 2]] : null;
if (par && !par.every((u) => /^https?:\/\//.test(u ?? ""))) {
  console.log("Uso: npm run refs:probe -- --par <url-original> <url-réplica> [--nombre slug]");
  process.exit(1);
}
const HOVER = !flag("--no-hover");
const WAIT = Number(opt("--wait", guidesBase ? "2500" : "7000"));
const parNombre = par ? opt("--nombre", par[0].replace(/^https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40)) : "";
const OUT = opt("--out", par ? join(".refs3d", "pares", parNombre) : join(".refs", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")));
const SHOTS = !flag("--no-shots");
const MOBILE = !flag("--no-mobile");
const skip = new Set(["--guides", "--out", "--wait", "--nombre"].flatMap((k) => (argv.includes(k) ? [argv[argv.indexOf(k) + 1]] : [])));

type Target = { url: string; label: string; guide?: (typeof STYLE_GUIDES)[number] };
const targets: Target[] = par
  ? [{ url: par[0], label: "original" }, { url: par[1], label: "replica" }]
  : guidesBase
  ? STYLE_GUIDES.map((g) => ({ url: `${guidesBase.replace(/\/$/, "")}/guias/relato/${g.id}/${g.stories[0]}`, label: g.id, guide: g }))
  : argv.filter((a) => /^https?:\/\//.test(a) && !skip.has(a)).map((url) => ({ url, label: url.replace(/^https?:\/\/(www\.)?/, "") }));

if (!targets.length) {
  console.log("Uso: npm run refs:probe -- <url…>   ·   npm run refs:probe -- --guides http://localhost:3000");
  process.exit(1);
}

/** Se ejecuta dentro de la página (sin imports: Playwright la serializa). */
function probe() {
  const W = innerWidth;
  const H = innerHeight;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const inc = (m: Record<string, number>, k: string | number, v = 1) => (m[k] = (m[k] || 0) + v);
  const top = (m: Record<string, number>, n = 6) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const fam = (s: string) => s.split(",")[0].replace(/["']/g, "").trim();
  const w = window as unknown as Record<string, any>;

  const libs = {
    gsap: w.gsap?.version ?? null,
    lenis: document.documentElement.classList.contains("lenis") || !!w.lenis,
    three: w.__THREE__ ?? null,
    webflow: !!w.Webflow,
    framer: !!document.querySelector("[data-framer-root]"),
    next: !!w.__NEXT_DATA__ || !!document.querySelector('script[src*="/_next/"]'),
    nuxt: !!w.__NUXT__ || !!document.querySelector("#__nuxt"),
    barba: !!w.barba || !!document.querySelector("[data-barba]"),
    canvas: document.querySelectorAll("canvas").length,
    video: document.querySelectorAll("video").length,
  };

  const sizes: Record<string, number> = {};
  const fams: Record<string, number> = {};
  let chars = 0;
  const seen = new Set<Element>();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) {
    const t = tw.currentNode.textContent?.trim();
    const el = tw.currentNode.parentElement;
    if (!t || !el || seen.has(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || el.closest("[aria-hidden=true]")) continue;
    seen.add(el);
    inc(sizes, Math.round(parseFloat(cs.fontSize)), t.length);
    inc(fams, fam(cs.fontFamily), t.length);
    chars += t.length;
  }
  // el titular se mide en el primer pantallazo, como en las premiadas (la marca a todo el ancho del pie no cuenta)
  const biggest = [...seen]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4 && r.top < H && r.bottom > 0;
    })
    .map((el) => ({ el, cs: getComputedStyle(el) }))
    .map((x) => ({ ...x, pintado: parseFloat(x.cs.fontSize) * ((x.el as HTMLElement).offsetWidth > 0 ? x.el.getBoundingClientRect().width / (x.el as HTMLElement).offsetWidth : 1) }))
    .sort((a, b) => b.pintado - a.pintado)
    .slice(0, 3)
    .map(({ el, cs }) => {
      // tamaño pintado: Framer y otros escriben el titular grande y lo encogen con transform (397 px a 0,52)
      const he = el as HTMLElement;
      const escala = he.offsetWidth > 0 ? el.getBoundingClientRect().width / he.offsetWidth : 1;
      const s = parseFloat(cs.fontSize) * (escala > 0.05 && escala < 20 ? escala : 1);
      return { text: el.textContent!.trim().slice(0, 40), size: r1(s), vw: r1((s / W) * 100), weight: Number(cs.fontWeight), lh: r1(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 0), ls: r1((parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)) * 100 || 0), upper: cs.textTransform === "uppercase" || (/\p{Lu}/u.test(el.textContent!) && el.textContent!.trim() === el.textContent!.trim().toLocaleUpperCase()), family: fam(cs.fontFamily) };
    });
  // texto: el tamaño más repetido entre los párrafos largos (un párrafo con estilo de titular no cuenta)
  const paras = [...document.querySelectorAll("p")].filter((e) => (e.textContent?.trim().length ?? 0) > 60 && e.getBoundingClientRect().width > 0 && parseFloat(getComputedStyle(e).fontSize) <= 24);
  const bySize: Record<string, number> = {};
  paras.forEach((e) => inc(bySize, Math.round(parseFloat(getComputedStyle(e).fontSize)), e.textContent!.length));
  const bodySize = Number(top(bySize, 1)[0]?.[0] ?? 0);
  const p = paras.find((e) => Math.round(parseFloat(getComputedStyle(e).fontSize)) === bodySize);
  const pcs = p && getComputedStyle(p);
  const lefts: Record<string, number> = {};
  document.querySelectorAll("p, h1, h2, h3, li, a").forEach((el) => {
    const r = el.getBoundingClientRect();
    // solo lo que se ve: un menú cerrado o un aviso oculto siguen en la página con sus enlaces alineados (docs/53 §3)
    const visible = (el as Element & { checkVisibility?: (o: object) => boolean }).checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true;
    if (visible && !el.closest("[inert], [aria-hidden=true]") && r.width >= 40 && r.height >= 8 && r.left >= 0) inc(lefts, Math.round(r.left));
  });
  let shadows = 0;
  let blend = 0;
  let gridCols = 0;
  const durs: Record<string, number> = {};
  const fixed: string[] = [];
  // paleta por superficie (docs/53 §3): fondos por área visible en la página y textos por caracteres; radios y curvas
  const fondos: Record<string, number> = {};
  const tintas: Record<string, number> = {};
  const radios: Record<string, number> = {};
  const curvas: Record<string, number> = {};
  // rgb()/rgba() en 0–255; color(srgb r g b / a) —lo que da color-mix— en 0–1
  const hex = (c: string) => {
    const m = c.match(/[\d.]+/g);
    if (!m || m.length < 3 || (m.length > 3 && Number(m[3]) < 0.5)) return null;
    const k = c.startsWith("color(") ? 255 : 1;
    return "#" + m.slice(0, 3).map((x) => Math.min(255, Math.round(Number(x) * k)).toString(16).padStart(2, "0")).join("");
  };
  const docW = document.documentElement.clientWidth;
  // la base: el fondo opaco más profundo que cubre la página entera (en una página montada dentro de otra, el body queda tapado)
  const docH = document.documentElement.scrollHeight;
  const cubre = [document.documentElement, document.body, ...document.body.querySelectorAll("body > *, body > * > *, body > * > * > *")].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width >= docW * 0.95 && r.height >= docH * 0.9 && hex(getComputedStyle(e).backgroundColor);
  });
  const bodyBg = cubre.length ? hex(getComputedStyle(cubre[cubre.length - 1]).backgroundColor)! : "#ffffff";
  inc(fondos, bodyBg, docW * docH * 0.2);
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.boxShadow !== "none") shadows++;
    if (cs.mixBlendMode !== "normal") blend++;
    if (cs.display === "grid") gridCols = Math.max(gridCols, cs.gridTemplateColumns.split(" ").length);
    if (cs.transitionDuration !== "0s") {
      inc(durs, cs.transitionDuration.split(",")[0]);
      inc(curvas, cs.transitionTimingFunction.split(/,(?![^(]*\))/)[0].trim());
    }
    if (cs.position === "fixed" && el.getBoundingClientRect().height > 0) fixed.push(el.tagName.toLowerCase());
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
    // lo que no se ve no pinta: un menú cerrado o una capa recortada no cuentan en la paleta
    if (!((el as Element & { checkVisibility?: (o: object) => boolean }).checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true) || el.closest("[inert], [aria-hidden=true]")) return;
    const r = el.getBoundingClientRect();
    const area = Math.max(0, Math.min(r.right, docW) - Math.max(r.left, 0)) * Math.max(0, r.height);
    if (area < 400) return;
    const bg = hex(cs.backgroundColor);
    if (bg && !cubre.includes(el)) inc(fondos, bg, area);
    const rad = parseFloat(cs.borderTopLeftRadius);
    if (rad > 0 && (bg || cs.borderTopStyle !== "none" || el.tagName === "IMG" || el.tagName === "VIDEO")) inc(radios, rad >= Math.min(r.width, r.height) / 2 - 1 ? "píldora" : `${Math.round(rad)}`);
  });
  seen.forEach((el) => {
    const c = hex(getComputedStyle(el).color);
    if (c) inc(tintas, c, el.textContent?.trim().length ?? 0);
  });
  const reparto = (m: Record<string, number>, n: number) => {
    const total = Object.values(m).reduce((a, b) => a + b, 0) || 1;
    return top(m, n).map(([k, v]) => [k, Math.round((v / total) * 100)] as [string, number]).filter(([, p]) => p >= 1);
  };
  return {
    title: document.title.slice(0, 80),
    pageVh: r1(document.documentElement.scrollHeight / H),
    libs,
    fonts: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")))].slice(0, 10),
    families: [...new Map(top(fams, 6).filter(([, n]) => n > 50).map(([f]) => [f.toLowerCase(), f])).values()].slice(0, 5),
    typeScale: top(sizes, 8).map(([s, n]) => [Number(s), Math.round((n / Math.max(chars, 1)) * 100)]),
    biggest,
    body: pcs ? { size: r1(parseFloat(pcs.fontSize)), lh: r1(parseFloat(pcs.lineHeight) / parseFloat(pcs.fontSize) || 0), measureEm: Math.round(p!.getBoundingClientRect().width / parseFloat(pcs.fontSize)) } : null,
    // margen lateral: el menor desplazamiento izquierdo que se repite (≥ 3 bloques de texto alineados ahí)
    margin: Math.min(...Object.entries(lefts).filter(([x, n]) => n >= 3 && Number(x) > 0).map(([x]) => Number(x)), 9999),
    bg: getComputedStyle(document.body).backgroundColor,
    surfaces: { shadows, blend, gridCols, fixed: fixed.length },
    transitions: top(durs, 4).map(([d]) => d),
    /** [color, % de la superficie] y [color, % de los caracteres] */
    palette: { fondos: reparto(fondos, 8), tintas: reparto(tintas, 6) },
    radii: top(radios, 5).map(([k]) => k),
    easings: top(curvas, 4).map(([k]) => k),
    hover: [] as Hover[],
  };
}

type Hover = { texto: string; cambia: string[] };

/**
 * Qué cambia al pasar el ratón (docs/53 §3): por cada enlace o botón visible en el primer pantallazo (hasta 12), el
 * estilo calculado del elemento, sus hijos y sus ::before/::after antes y 600 ms después; devuelve lo que cambia.
 */
async function hovers(page: Page): Promise<Hover[]> {
  const objetivos = await page.evaluate(() => {
    const vistos = new Set<string>();
    return [...document.querySelectorAll("a, button, [role=button]")]
      .map((e) => ({ e, r: e.getBoundingClientRect(), t: (e.textContent || e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 30) }))
      .filter(({ r, t }) => r.width > 8 && r.height > 8 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth && t && !vistos.has(t) && vistos.add(t))
      .slice(0, 12)
      .map(({ e, r, t }, i) => {
        e.setAttribute("data-sonda-hover", String(i));
        return { i, t, x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
  });
  const props = ["color", "background-color", "border-color", "transform", "scale", "translate", "opacity", "border-radius", "text-decoration-line", "letter-spacing", "filter", "clip-path", "width", "font-style", "font-weight"];
  const foto = (i: number) =>
    page.evaluate(
      ([i, props]) => {
        const raiz = document.querySelector(`[data-sonda-hover="${i}"]`);
        const out: Record<string, string> = {};
        if (!raiz) return out;
        [raiz, ...raiz.querySelectorAll("*")].slice(0, 25).forEach((el, k) => {
          const cs = getComputedStyle(el);
          for (const p of props) out[`${k}:${p}`] = cs.getPropertyValue(p);
          (["::before", "::after"] as const).forEach((ps) => {
            const c = getComputedStyle(el, ps);
            for (const p of ["transform", "translate", "scale", "width", "opacity", "background-color"]) out[`${k}${ps}:${p}`] = c.getPropertyValue(p);
          });
        });
        return out;
      },
      [i, props] as [number, string[]],
    );
  const res: Hover[] = [];
  for (const o of objetivos) {
    await page.mouse.move(2, 2);
    await page.waitForTimeout(250);
    const a = await foto(o.i);
    await page.mouse.move(o.x, o.y, { steps: 4 });
    await page.waitForTimeout(600);
    const b = await foto(o.i);
    // translate, scale y rotate son transform escritos de otra forma: se cuentan como transform
    const nombre = (k: string) => (k.startsWith("0:") ? k.slice(2) : k.startsWith("0::") ? k.slice(1) : `hijo ${k.replace(/^\d+:?/, "")}`).replace(/(translate|scale|rotate)$/, "transform");
    const cambia = [...new Set(Object.keys(a).filter((k) => a[k] !== b[k]).map(nombre))];
    if (cambia.length) res.push({ texto: o.t, cambia: cambia.slice(0, 8) });
  }
  await page.mouse.move(2, 2);
  return res;
}

type Data = ReturnType<typeof probe>;

async function measure(browser: Browser, t: Target, vp: { width: number; height: number }, tag: string) {
  const ctx = await browser.newContext({ viewport: vp, locale: "es-ES" });
  // tsx (esbuild con keepNames) envuelve las funciones con __name(); `probe` viaja serializada a la página y lo necesita allí
  await ctx.addInitScript({ content: "window.__name = (f) => f;" });
  const page = await ctx.newPage();
  const slug = t.label.replace(/[^a-z0-9]+/gi, "_").slice(0, 48);
  try {
    await page.goto(t.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(WAIT);
    // avisos de cookies o de edad: se aceptan antes de medir (si no, sus botones salen en el hover y tapan las capturas)
    for (let vuelta = 0; vuelta < 2; vuelta++) {
      const n = await page.evaluate((re) => {
        const aviso = new RegExp(re, "i");
        const bs = [...document.querySelectorAll("button, a, [role=button]")].filter((e) => (e as HTMLElement).offsetParent !== null && aviso.test((e.textContent || "").trim()));
        bs.slice(0, 1).forEach((e) => (e as HTMLElement).click());
        return bs.length;
      }, AVISO.source);
      if (!n) break;
      await page.waitForTimeout(900);
    }
    if (SHOTS) await page.screenshot({ path: join(OUT, `${slug}_${tag}.jpg`), type: "jpeg", quality: 60 });
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, vp.height * 0.9);
      await page.waitForTimeout(400);
    }
    if (SHOTS && tag === "desk") await page.screenshot({ path: join(OUT, `${slug}_${tag}_scroll.jpg`), type: "jpeg", quality: 60 });
    // de vuelta arriba también con la rueda: con un scroll suavizado (Lenis) `scrollTo` solo no basta, la página vuelve
    // a su objetivo en el siguiente fotograma
    for (let i = 0; i < 8; i++) await page.mouse.wheel(0, -vp.height * 1.2);
    await page.waitForTimeout(2500);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(800);
    // si aún no está arriba (suavizado lento), una vuelta más
    if ((await page.evaluate(() => scrollY)) > 4) {
      for (let i = 0; i < 4; i++) await page.mouse.wheel(0, -vp.height * 2);
      await page.waitForTimeout(2500);
    }
    const d = (await page.evaluate(probe)) as Data;
    if (HOVER && tag === "desk") d.hover = await hovers(page);
    return d;
  } catch (e) {
    return { error: (e as Error).message.split("\n")[0] };
  } finally {
    await ctx.close();
  }
}

/** Rangos de las webs premiadas (docs/16 §2). Cada regla devuelve null si cumple o el motivo si no. */
function check(d: Data, m: Data | null, g: Target["guide"]) {
  const h = d.biggest[0];
  const rules: [string, string | null][] = [
    ["familias ≤ 3", d.families.length <= 3 ? null : `${d.families.length}: ${d.families.join(", ")}`],
    // dos escalones medidos: titular 3–8 vw y marca 12–18 vw; una marca de borde a borde llega a 23–49 vw (Siena Film Foundation)
    ["titular 3–8 vw, marca 12–18 vw o de borde a borde ≤ 50 vw", h && ((h.vw >= 3 && h.vw <= 8.5) || (h.vw >= 11.5 && h.vw <= 50)) ? null : `${h?.vw} vw`],
    ["interlineado del titular 0,8–1", h && h.lh >= 0.78 && h.lh <= 1.05 ? null : `${h?.lh}`],
    ["peso del titular 300–500 (o condensada/lúdica)", h && ((h.weight >= 300 && h.weight <= 520) || ["electrico", "ludico"].includes(g?.id ?? "")) ? null : `${h?.weight}`],
    ["tracking del titular 0 a −5 %", h && h.ls <= 0.5 && h.ls >= -5.5 ? null : `${h?.ls} %`],
    // sin párrafos largos (p. ej. un relato de mapa o de juego) la regla no aplica
    ["texto 14–20 px", !d.body || (d.body.size >= 14 && d.body.size <= 20.5) ? null : `${d.body.size} px`],
    ["interlineado del texto 1,3–1,6", !d.body || (d.body.lh >= 1.28 && d.body.lh <= 1.62) ? null : `${d.body.lh}`],
    ["margen lateral 10–80 px o contenido centrado (escritorio)", (d.margin >= 10 && d.margin <= 80) || g?.space.margin.startsWith("max(") ? null : `${d.margin} px`],
    ["margen lateral 8–29 px (móvil)", !m || (m.margin >= 8 && m.margin <= 29) ? null : `${m?.margin} px`],
    ["titular móvil 8–16 vw (marca hasta 50)", !m || (m.biggest[0] && m.biggest[0].vw >= 7.5 && m.biggest[0].vw <= 50) ? null : `${m?.biggest[0]?.vw} vw`],
    ["sombras ≤ 2 (salvo lúdico)", d.surfaces.shadows <= 2 || g?.id === "ludico" ? null : `${d.surfaces.shadows}`],
  ];
  return rules.map(([rule, why]) => ({ rule, ok: why === null, got: why }));
}

mkdirSync(OUT, { recursive: true });
const exe = chromiumPath();
const browser = await chromium.launch({ executablePath: exe, args: ["--autoplay-policy=no-user-gesture-required"] });
console.log(`Chromium: ${exe ?? chromium.executablePath()} · ${targets.length} página(s) → ${OUT}`);

const results: Record<string, unknown>[] = [];
const queue = [...targets];
await Promise.all(
  Array.from({ length: Math.min(3, queue.length) }, async () => {
    for (let t = queue.shift(); t; t = queue.shift()) {
      const desk = await measure(browser, t, { width: 1440, height: 900 }, "desk");
      const mob = MOBILE ? await measure(browser, t, { width: 390, height: 844 }, "mob") : null;
      const row: Record<string, unknown> = { url: t.url, label: t.label, desk, mob };
      if (t.guide && !("error" in desk)) row.check = check(desk, mob && !("error" in mob) ? mob : null, t.guide);
      results.push(row);
      console.log(`· ${t.label}${"error" in desk ? ` — ${desk.error}` : ""}`);
    }
  }),
);
await browser.close();
writeFileSync(join(OUT, "datos.json"), JSON.stringify(results, null, 1));

/** ΔE (CIE76) entre dos colores hex: < 5 casi igual, < 12 de la misma familia */
function deltaE(a: string, b: string) {
  const lab = (h: string) => {
    const [r, g, bb] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92));
    const [x, y, z] = [(r * 0.4124 + g * 0.3576 + bb * 0.1805) / 0.95047, r * 0.2126 + g * 0.7152 + bb * 0.0722, (r * 0.0193 + g * 0.1192 + bb * 0.9505) / 1.08883].map((v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116));
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };
  const [p, q] = [lab(a), lab(b)];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

/**
 * Informe de un par original/réplica (docs/53 §3): cada medida con su valor en las dos, si están cerca (✓), lejos (✗) o
 * solo es informativa (·), y la lista de diferencias que mirar. Escribe par.md y par.json junto a las capturas.
 */
function informePar(o: Data, r: Data, om: Data | null, rm: Data | null) {
  type Fila = { grupo: string; medida: string; original: string; replica: string; cerca: boolean | null };
  const filas: Fila[] = [];
  const f = (grupo: string, medida: string, a: unknown, b: unknown, cerca: boolean | null) => filas.push({ grupo, medida, original: String(a ?? "—"), replica: String(b ?? "—"), cerca });
  const rel = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), 1e-6);
  const ho = o.biggest[0], hr = r.biggest[0];
  f("Titular", "tamaño (vw)", ho?.vw, hr?.vw, ho && hr ? rel(ho.vw, hr.vw, 0.15) : null);
  f("Titular", "peso", ho?.weight, hr?.weight, ho && hr ? Math.abs(ho.weight - hr.weight) <= 100 : null);
  f("Titular", "interlineado", ho?.lh, hr?.lh, ho && hr ? Math.abs(ho.lh - hr.lh) <= 0.08 : null);
  f("Titular", "tracking (%)", ho?.ls, hr?.ls, ho && hr ? Math.abs(ho.ls - hr.ls) <= 1.2 : null);
  f("Titular", "mayúsculas", ho?.upper, hr?.upper, ho && hr ? ho.upper === hr.upper : null);
  f("Titular", "letra", ho?.family, hr?.family, null);
  f("Texto", "cuerpo (px)", o.body?.size, r.body?.size, o.body && r.body ? Math.abs(o.body.size - r.body.size) <= 1.5 : null);
  f("Texto", "interlineado", o.body?.lh, r.body?.lh, o.body && r.body ? Math.abs(o.body.lh - r.body.lh) <= 0.12 : null);
  f("Texto", "medida (em)", o.body?.measureEm, r.body?.measureEm, o.body && r.body ? rel(o.body.measureEm, r.body.measureEm, 0.2) : null);
  f("Texto", "familias", o.families.join(", "), r.families.join(", "), o.families.length === r.families.length);
  f("Texto", "escala (px, % del texto)", o.typeScale.slice(0, 5).map(([s, p]) => `${s}:${p}`).join(" "), r.typeScale.slice(0, 5).map(([s, p]) => `${s}:${p}`).join(" "), null);
  // 9999 = no hay tres bloques alineados a la izquierda (portada centrada o sin texto): no se compara
  const mg = (m: number) => (m >= 9999 ? null : m);
  const cmpMg = (a: number, b: number, tol: number) => (mg(a) === null || mg(b) === null ? null : Math.abs(a - b) <= tol);
  f("Maquetación", "margen lateral (px)", mg(o.margin), mg(r.margin), cmpMg(o.margin, r.margin, 12));
  f("Maquetación", "largo de página (pantallas)", o.pageVh, r.pageVh, rel(o.pageVh, r.pageVh, 0.3));
  f("Maquetación", "columnas de rejilla", o.surfaces.gridCols, r.surfaces.gridCols, null);
  f("Maquetación", "elementos fijos", o.surfaces.fixed, r.surfaces.fixed, null);
  const cercano = (c: string, lista: [string, number][]) => Math.min(...lista.map(([x]) => deltaE(c, x)), 999);
  const fo = o.palette.fondos.slice(0, 4), fr = r.palette.fondos.slice(0, 4);
  f("Color", "fondos (% de superficie)", fo.map(([c, p]) => `${c} ${p}%`).join(" · "), fr.map(([c, p]) => `${c} ${p}%`).join(" · "), fo.length ? fo.every(([c, p]) => p < 8 || cercano(c, fr) < 12) : null);
  const to = o.palette.tintas.slice(0, 3), tr = r.palette.tintas.slice(0, 3);
  f("Color", "textos (% de caracteres)", to.map(([c, p]) => `${c} ${p}%`).join(" · "), tr.map(([c, p]) => `${c} ${p}%`).join(" · "), to.length ? to.every(([c, p]) => p < 10 || cercano(c, tr) < 12) : null);
  f("Superficie", "radios (px)", o.radii.join(", "), r.radii.join(", "), null);
  f("Superficie", "sombras", o.surfaces.shadows, r.surfaces.shadows, (o.surfaces.shadows > 2) === (r.surfaces.shadows > 2));
  f("Movimiento", "duraciones", o.transitions.join(", "), r.transitions.join(", "), null);
  f("Movimiento", "curvas", o.easings.join(", "), r.easings.join(", "), null);
  f("Movimiento", "librerías", Object.entries(o.libs).filter(([, v]) => v).map(([k, v]) => (v === true ? k : `${k} ${v}`)).join(", "), Object.entries(r.libs).filter(([, v]) => v).map(([k, v]) => (v === true ? k : `${k} ${v}`)).join(", "), null);
  f("Movimiento", "scroll suavizado (Lenis)", o.libs.lenis, r.libs.lenis, o.libs.lenis === r.libs.lenis);
  f("Hover", "elementos que cambian", o.hover.length, r.hover.length, o.hover.length === 0 ? null : r.hover.length >= o.hover.length / 2);
  const tipos = (d: Data) => [...new Set(d.hover.flatMap((h) => h.cambia.map((c) => c.replace(/^hijo /, ""))))];
  const faltan = tipos(o).filter((t) => !tipos(r).includes(t));
  f("Hover", "propiedades que cambian", tipos(o).join(", "), tipos(r).join(", "), faltan.length === 0);
  if (om && rm) {
    f("Móvil", "titular (vw)", om.biggest[0]?.vw, rm.biggest[0]?.vw, om.biggest[0] && rm.biggest[0] ? rel(om.biggest[0].vw, rm.biggest[0].vw, 0.2) : null);
    f("Móvil", "margen lateral (px)", mg(om.margin), mg(rm.margin), cmpMg(om.margin, rm.margin, 6));
    f("Móvil", "largo de página (pantallas)", om.pageVh, rm.pageVh, rel(om.pageVh, rm.pageVh, 0.3));
  }
  const lejos = filas.filter((x) => x.cerca === false);
  const medibles = filas.filter((x) => x.cerca !== null);
  const marca = (c: boolean | null) => (c === null ? "·" : c ? "✓" : "✗");
  const md = [
    `# Par: ${parNombre}`,
    "",
    `- Original: ${par![0]}`,
    `- Réplica: ${par![1]}`,
    `- ${new Date().toISOString().slice(0, 16).replace("T", " ")} · \`npm run refs:probe -- --par\` (docs/53 §3)`,
    "",
    `**Cerca en ${medibles.length - lejos.length} de ${medibles.length} medidas.** ✓ cerca · ✗ lejos · · informativa.`,
    "",
    "## Diferencias que mirar",
    "",
    ...(lejos.length ? lejos.map((x) => `- **${x.grupo} · ${x.medida}**: original ${x.original}, réplica ${x.replica}`) : ["Ninguna fuera de tolerancia."]),
    ...(faltan.length ? ["", `Al pasar el ratón, el original cambia y la réplica no: ${faltan.join(", ")}.`] : []),
    "",
    "## Medidas",
    "",
    "| Grupo | Medida | Original | Réplica | |",
    "|---|---|---|---|---|",
    ...filas.map((x) => `| ${x.grupo} | ${x.medida} | ${x.original} | ${x.replica} | ${marca(x.cerca)} |`),
    "",
    "## Hover",
    "",
    "| | Elemento | Cambia |",
    "|---|---|---|",
    ...o.hover.map((h) => `| original | ${h.texto} | ${h.cambia.join(", ")} |`),
    ...r.hover.map((h) => `| réplica | ${h.texto} | ${h.cambia.join(", ")} |`),
    "",
    "## Capturas",
    "",
    "| Original | Réplica |",
    "|---|---|",
    "| ![](original_desk.jpg) | ![](replica_desk.jpg) |",
    "| ![](original_desk_scroll.jpg) | ![](replica_desk_scroll.jpg) |",
    "| ![](original_mob.jpg) | ![](replica_mob.jpg) |",
    "",
  ].join("\n");
  writeFileSync(join(OUT, "par.md"), md);
  writeFileSync(join(OUT, "par.json"), JSON.stringify({ nombre: parNombre, original: par![0], replica: par![1], fecha: new Date().toISOString(), cerca: medibles.length - lejos.length, medibles: medibles.length, filas, faltanHover: faltan }, null, 1));
  console.log(`\nPar ${parNombre}: cerca en ${medibles.length - lejos.length} de ${medibles.length} medidas`);
  for (const x of lejos) console.log(`  ✗ ${x.grupo} · ${x.medida}: ${x.original} → ${x.replica}`);
  console.log(`Informe en ${join(OUT, "par.md")} · en el lab: /lab/cine/archivo/.refs3d/pares/${parNombre}`);
}

if (par) {
  const [ro, rr] = [results.find((x) => x.label === "original"), results.find((x) => x.label === "replica")];
  const ok = (d: unknown): d is Data => !!d && !("error" in (d as object));
  if (ro && rr && ok(ro.desk) && ok(rr.desk)) informePar(ro.desk, rr.desk, ok(ro.mob) ? ro.mob : null, ok(rr.mob) ? rr.mob : null);
  else (console.log("No se pudo medir el par:", (ro?.desk as { error?: string })?.error ?? "", (rr?.desk as { error?: string })?.error ?? ""), (process.exitCode = 1));
} else if (guidesBase) {
  let fails = 0;
  for (const r of results) {
    const err = (r.desk as { error?: string }).error;
    if (err) {
      fails++;
      console.log(`\n${r.label}: no se pudo medir (${err})`);
      continue;
    }
    const c = (r.check as { rule: string; ok: boolean; got: string | null }[] | undefined) ?? [];
    const bad = c.filter((x) => !x.ok);
    fails += bad.length;
    console.log(`\n${r.label}: ${c.length - bad.length}/${c.length} dentro de rango`);
    for (const b of bad) console.log(`  ✗ ${b.rule} → ${b.got}`);
  }
  console.log(`\n${fails ? `${fails} valor(es) fuera de rango` : "Todas las guías dentro de los rangos de las premiadas"} · detalle en ${join(OUT, "datos.json")}`);
  process.exitCode = fails ? 1 : 0;
} else {
  console.log(`\nDatos en ${join(OUT, "datos.json")}`);
}
