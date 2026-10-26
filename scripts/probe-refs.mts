/**
 * Sondeo de webs con Playwright (docs/16 §1 y §6 F4): mide librerías, fuentes, escala tipográfica, titulares, márgenes,
 * rejillas, superficies, elementos fijos y movimiento, en escritorio (1440×900) y móvil (390×844), con capturas.
 *
 *   npm run refs:probe -- https://ejemplo.com https://otra.com        → .refs/<fecha>/datos.json + capturas
 *   npm run refs:probe -- --guides http://localhost:3000               → mide las 8 guías de /guias y las compara con los
 *                                                                          rangos de las webs premiadas (docs/16 §2)
 * Opciones: --out <carpeta> (por defecto .refs/<fecha>), --wait <ms> (espera a la intro, 7000), --no-mobile, --no-shots.
 *
 * Navegador: el Chromium de Playwright si está instalado (`npx playwright install chromium`); si no, el más reciente que haya
 * en la caché de Playwright (%LOCALAPPDATA%\ms-playwright o ~/.cache/ms-playwright), o el de PLAYWRIGHT_CHROMIUM.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Browser } from "playwright";
import { STYLE_GUIDES } from "../lib/ui/guides";
import { chromiumPath } from "./chromium-path.mts";

const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(name);
const opt = (name: string, fallback: string) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const guidesBase = flag("--guides") ? opt("--guides", "http://localhost:3000") : null;
const WAIT = Number(opt("--wait", guidesBase ? "2500" : "7000"));
const OUT = opt("--out", join(".refs", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")));
const SHOTS = !flag("--no-shots");
const MOBILE = !flag("--no-mobile");
const skip = new Set(["--guides", "--out", "--wait"].flatMap((k) => (argv.includes(k) ? [argv[argv.indexOf(k) + 1]] : [])));

type Target = { url: string; label: string; guide?: (typeof STYLE_GUIDES)[number] };
const targets: Target[] = guidesBase
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
    .sort((a, b) => parseFloat(b.cs.fontSize) - parseFloat(a.cs.fontSize))
    .slice(0, 3)
    .map(({ el, cs }) => {
      const s = parseFloat(cs.fontSize);
      return { text: el.textContent!.trim().slice(0, 40), size: r1(s), vw: r1((s / W) * 100), weight: Number(cs.fontWeight), lh: r1(parseFloat(cs.lineHeight) / s || 0), ls: r1((parseFloat(cs.letterSpacing) / s) * 100 || 0), upper: cs.textTransform === "uppercase", family: fam(cs.fontFamily) };
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
    if (r.width >= 40 && r.height >= 8 && r.left >= 0) inc(lefts, Math.round(r.left));
  });
  let shadows = 0;
  let blend = 0;
  let gridCols = 0;
  const durs: Record<string, number> = {};
  const fixed: string[] = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.boxShadow !== "none") shadows++;
    if (cs.mixBlendMode !== "normal") blend++;
    if (cs.display === "grid") gridCols = Math.max(gridCols, cs.gridTemplateColumns.split(" ").length);
    if (cs.transitionDuration !== "0s") inc(durs, cs.transitionDuration.split(",")[0]);
    if (cs.position === "fixed" && el.getBoundingClientRect().height > 0) fixed.push(el.tagName.toLowerCase());
  });
  return {
    title: document.title.slice(0, 80),
    pageVh: r1(document.documentElement.scrollHeight / H),
    libs,
    fonts: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")))].slice(0, 10),
    families: top(fams, 5).filter(([, n]) => n > 50).map(([f]) => f),
    typeScale: top(sizes, 8).map(([s, n]) => [Number(s), Math.round((n / Math.max(chars, 1)) * 100)]),
    biggest,
    body: pcs ? { size: r1(parseFloat(pcs.fontSize)), lh: r1(parseFloat(pcs.lineHeight) / parseFloat(pcs.fontSize) || 0), measureEm: Math.round(p!.getBoundingClientRect().width / parseFloat(pcs.fontSize)) } : null,
    // margen lateral: el menor desplazamiento izquierdo que se repite (≥ 3 bloques de texto alineados ahí)
    margin: Math.min(...Object.entries(lefts).filter(([x, n]) => n >= 3 && Number(x) > 0).map(([x]) => Number(x)), 9999),
    bg: getComputedStyle(document.body).backgroundColor,
    surfaces: { shadows, blend, gridCols, fixed: fixed.length },
    transitions: top(durs, 4).map(([d]) => d),
  };
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
    if (SHOTS) await page.screenshot({ path: join(OUT, `${slug}_${tag}.jpg`), type: "jpeg", quality: 60 });
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, vp.height * 0.9);
      await page.waitForTimeout(400);
    }
    if (SHOTS && tag === "desk") await page.screenshot({ path: join(OUT, `${slug}_${tag}_scroll.jpg`), type: "jpeg", quality: 60 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(500);
    return (await page.evaluate(probe)) as Data;
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

if (guidesBase) {
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
