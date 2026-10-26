/**
 * El mapa de una web entera (docs/38 §2): el nivel que faltaba entre `refs:probe` (constantes de estilo) y `cine:*` (una
 * escena). Recorre la página de arriba abajo y apunta, sección a sección, qué hay y cuánto pesa, para decidir qué
 * estudiar a fondo, qué plantilla sale y qué le falta a la librería.
 *
 *   npm run cine:web -- <url> [--size 1440x900] [--movil] [--antes "…"] [--pasos 40] [--out carpeta]
 *
 * Por cada pantalla:
 *   - captura reducida;
 *   - scroll real (o virtual: webs que mueven la escena con la rueda sin desplazar la página);
 *   - lo que se pinta en la GPU (gancho gl.js: llamadas, triángulos, pasadas);
 *   - cuánto ocupan los lienzos;
 *   - titulares visibles, imágenes y vídeos;
 *   - si la sección está fijada (la página baja y lo de dentro no se mueve).
 * Con eso clasifica cada sección (escena 3D, relato fijado, texto, galería, vídeo, pie…) y las agrupa.
 * De la página entera:
 *   - librerías (three y su versión, GSAP, ScrollTrigger, Lenis, Barba, Swup, Pixi, Babylon, OGL, Spline,
 *     Rive, Lottie);
 *   - fuentes cargadas;
 *   - elementos fijos;
 *   - cursor propio;
 *   - páginas internas enlazadas;
 *   - la transición al abrir una de ellas.
 * Salida: web.json, web.md y tira.jpg (una miniatura por sección).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { abrir, esperarEscena, pasos } from "./navegador.mts";

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.log('Uso: npm run cine:web -- <url> [--size 1440x900] [--movil] [--antes "…"] [--pasos 40] [--out carpeta]');
  process.exit(1);
}
const slug = url.replace(/^https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 50);
const OUT = resolve(opt("--out", join(".refs3d", "webs", slug)));
mkdirSync(join(OUT, "pantallas"), { recursive: true });
const PASOS = Number(opt("--pasos", "40"));

const { browser, page, errores } = await abrir({ size: opt("--size", "1440x900").split("x").map(Number) as [number, number], movil: argv.includes("--movil"), gl: true });
const vp = page.viewportSize()!;
const scripts: string[] = [];
page.on("response", (r) => /\.m?js(\?|$)/.test(r.url()) && scripts.push(r.url()));
console.log(`→ ${url} (${vp.width}×${vp.height})`);
await page.goto(url, { waitUntil: "load", timeout: 120_000 });
await page.waitForTimeout(4000);
await esperarEscena(page, 15_000);
const previos = await pasos(page, `avisos${opt("--antes", "") ? ";" + opt("--antes", "") : ""}`);
await page.waitForTimeout(2500);

type Pantalla = {
  i: number;
  scrollY: number;
  lienzo: number;
  gl: { calls: number; tris: number; pasadas: number } | null;
  titulares: string[];
  imagenes: number;
  videos: number;
  textoGrande: number;
  firma: string;
  cambio: number;
  tipo?: string;
};

const muestra = () =>
  page.evaluate(() => {
    const w = window as unknown as { __cineGL?: { frame(): { calls: number; tris: number; pasadas: unknown[] } | null } };
    const vis = (r: DOMRect) => Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
    const area = innerWidth * innerHeight;
    const lienzo = [...document.querySelectorAll("canvas")].reduce((s, c) => s + vis(c.getBoundingClientRect()), 0) / area;
    // visible de verdad: en la ventana y sin un padre oculto o transparente (ventanas modales escondidas, menús)
    const enPantalla = (e: Element) => {
      const r = e.getBoundingClientRect();
      if (!(r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width > 0 && r.height > 0)) return false;
      const cv = (e as Element & { checkVisibility?: (o: object) => boolean }).checkVisibility;
      if (cv && !cv.call(e, { checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true })) return false;
      // un padre recortado del todo (las ventanas modales de Meer Mohsin: clip-path: inset(100% 0 0)) lo esconde
      for (let p: Element | null = e; p; p = p.parentElement) {
        const m = /inset\(([^)]*)\)/.exec(getComputedStyle(p).clipPath);
        if (!m) continue;
        const v = m[1].split(/\s+/).map((x) => parseFloat(x) || 0);
        const [t, rr = t, b = t, l = rr] = v;
        if (t + b >= 99 || l + rr >= 99) return false;
      }
      // tapado por otra capa: lo que hay en su centro tiene que ser él, un padre, un hijo o un lienzo (los lienzos
      // suelen ser transparentes y van encima del texto)
      const c = document.elementFromPoint(r.left + Math.min(r.width, innerWidth) / 2, Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1));
      return !c || c === e || e.contains(c) || c.contains(e) || c.tagName === "CANVAS";
    };
    const titulares = [...document.querySelectorAll("h1,h2,h3")].filter(enPantalla).map((e) => (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60)).filter(Boolean).slice(0, 4);
    const imagenes = [...document.querySelectorAll("img,picture")].filter((e) => enPantalla(e) && e.getBoundingClientRect().width > 80).length;
    const videos = [...document.querySelectorAll("video")].filter(enPantalla).length;
    // texto grande: el cuerpo más grande visible (titulares gigantes, palabras de relato)
    let textoGrande = 0;
    for (const e of document.querySelectorAll("h1,h2,h3,p,span,div")) {
      if (!e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) continue;
      if (!enPantalla(e)) continue;
      textoGrande = Math.max(textoGrande, parseFloat(getComputedStyle(e).fontSize) || 0);
    }
    // firma de la maqueta: dónde están los titulares (si la página baja y la firma no cambia, la sección está fijada)
    const firma = [...document.querySelectorAll("h1,h2,h3,p")]
      .filter(enPantalla)
      .slice(0, 6)
      .map((e) => Math.round(e.getBoundingClientRect().top / 20))
      .join(",");
    const g = w.__cineGL?.frame();
    return { scrollY: Math.round(scrollY), lienzo: +lienzo.toFixed(2), gl: g ? { calls: g.calls, tris: g.tris, pasadas: g.pasadas.length } : null, titulares, imagenes, videos, textoGrande: Math.round(textoGrande), firma };
  });

const pantallas: Pantalla[] = [];
let anterior: Buffer | null = null;
let quietas = 0;
await page.mouse.move(vp.width / 2, vp.height / 2);
for (let i = 0; i < PASOS; i++) {
  const m = await muestra();
  const buf = await page.screenshot({ type: "jpeg", quality: 70 });
  const peq = await sharp(buf).resize(360).jpeg({ quality: 72 }).toBuffer();
  writeFileSync(join(OUT, "pantallas", `${String(i).padStart(2, "0")}.jpg`), peq);
  let cambio = 1;
  if (anterior) {
    const [a, b] = await Promise.all([sharp(anterior).resize(96).removeAlpha().raw().toBuffer(), sharp(peq).resize(96).removeAlpha().raw().toBuffer()]);
    let s = 0;
    for (let k = 0; k < a.length; k++) s += Math.abs(a[k] - b[k]);
    cambio = +(s / a.length / 255).toFixed(3);
  }
  anterior = peq;
  pantallas.push({ i, ...m, cambio });
  // se para al llegar abajo: tres pasos sin scroll ni cambio de imagen
  const p = pantallas[pantallas.length - 2];
  if (p && p.scrollY === m.scrollY && cambio < 0.01) quietas++;
  else quietas = 0;
  if (quietas >= 3) break;
  await page.mouse.wheel(0, Math.round(vp.height * 0.8));
  await page.waitForTimeout(900);
}

// clasificación: el tipo sale del contenido (el DOM); el 3D de fondo y el fijado son atributos, no el tipo (un lienzo fijo
// que cubre toda la página no hace que todo sea «escena 3D»)
const tipoDe = (s: Pantalla) => (s.videos > 0 ? "vídeo" : s.imagenes >= 4 ? "galería" : s.textoGrande >= 80 ? "titular gigante" : s.titulares.length ? "texto" : s.lienzo > 0.5 && (s.gl?.calls ?? 0) > 0 ? "escena 3D sola" : "vacía o de transición");
const parecido = (a: string[], b: string[]) => {
  const A = new Set(a), B = new Set(b);
  const comun = [...A].filter((x) => B.has(x)).length;
  return A.size + B.size ? (2 * comun) / (A.size + B.size) : 1;
};
type Seccion = { tipo: string; desde: number; hasta: number; titulares: string[]; gl: string; fondo3d: boolean; fijada: boolean; virtual: boolean };
const secciones: Seccion[] = [];
for (let k = 0; k < pantallas.length; k++) {
  const s = pantallas[k];
  s.tipo = tipoDe(s);
  const prev = pantallas[k - 1];
  const u = secciones[secciones.length - 1];
  // otra sección: cambian los titulares o el tipo, o la imagen salta mucho
  const nueva = !u || !prev || s.tipo !== prev.tipo || parecido(s.titulares, prev.titulares) < 0.5 || s.cambio > 0.25;
  const fijada = !!prev && s.scrollY > prev.scrollY && s.firma === prev.firma && s.firma !== "";
  const virtual = !!prev && s.scrollY === prev.scrollY && s.cambio > 0.02;
  if (nueva) secciones.push({ tipo: s.tipo, desde: s.i, hasta: s.i, titulares: [...s.titulares], gl: s.gl ? `${s.gl.calls} llamadas, ${s.gl.tris.toLocaleString("es")} triángulos, ${s.gl.pasadas} pasadas` : "sin GPU", fondo3d: s.lienzo > 0.5 && (s.gl?.calls ?? 0) > 0, fijada: false, virtual });
  else {
    u.hasta = s.i;
    u.fijada ||= fijada;
    u.virtual ||= virtual;
    for (const t of s.titulares) if (!u.titulares.includes(t) && u.titulares.length < 4) u.titulares.push(t);
  }
}

// la página entera: librerías, fuentes, fijos, cursor, enlaces internos
const pagina = await page.evaluate(() => {
  const w = window as unknown as Record<string, unknown> & { __cine?: { state: { revision: string | null } } };
  const fijos = [...document.querySelectorAll("body *")].filter((e) => ["fixed", "sticky"].includes(getComputedStyle(e).position) && e.getBoundingClientRect().width > 40).map((e) => `${e.tagName.toLowerCase()}${e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""}`).slice(0, 12);
  const cursor = getComputedStyle(document.body).cursor === "none" || [...document.querySelectorAll("[class*=cursor]")].length > 0;
  const enlaces = [...document.querySelectorAll("a[href]")]
    .map((a) => (a as HTMLAnchorElement).href)
    .filter((h) => h.startsWith(location.origin) && !h.includes("#") && h !== location.href && !/\.(pdf|jpg|png|mp4)$/i.test(h));
  return {
    three: w.__cine?.state.revision ?? null,
    globales: ["gsap", "ScrollTrigger", "Lenis", "lenis", "barba", "swup", "PIXI", "BABYLON", "Rive", "lottie", "Spline", "Matter", "THREE"].filter((k) => k in w),
    fuentes: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, "")))].slice(0, 10),
    fijos,
    cursor,
    enlaces: [...new Set(enlaces)].slice(0, 30),
    titulo: document.title,
  };
});
const firmasJs = ["three", "gsap", "ScrollTrigger", "lenis", "barba", "swup", "pixi", "babylon", "ogl", "spline", "rive", "lottie", "theatre", "matter", "rapier", "cannon"].filter((k) => scripts.some((s) => s.toLowerCase().includes(k)));

// la transición a la primera página interna (cuánto cambia la imagen y cuánto tarda en asentarse)
let transicion: { a: string; ms: number; pasos: number[] } | null = null;
if (pagina.enlaces.length && !argv.includes("--sin-transicion")) {
  const destino = pagina.enlaces[0];
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(800);
  const enlace = await page.$(`a[href="${new URL(destino).pathname}"], a[href="${destino}"]`);
  if (enlace) {
    const t0 = Date.now();
    const serie: number[] = [];
    let ant = await page.screenshot({ type: "jpeg", quality: 50 });
    await enlace.click({ force: true }).catch(() => {});
    for (let k = 0; k < 16; k++) {
      await page.waitForTimeout(150);
      const b = await page.screenshot({ type: "jpeg", quality: 50 });
      const [x, y] = await Promise.all([sharp(ant).resize(64).removeAlpha().raw().toBuffer(), sharp(b).resize(64).removeAlpha().raw().toBuffer()]);
      let s = 0;
      for (let q = 0; q < x.length; q++) s += Math.abs(x[q] - y[q]);
      serie.push(+(s / x.length / 255).toFixed(3));
      ant = b;
    }
    transicion = { a: destino, ms: Date.now() - t0, pasos: serie };
  }
}
await browser.close();

// tira de contacto: una miniatura por sección
const tiles = await Promise.all(secciones.map((s) => sharp(join(OUT, "pantallas", `${String(s.desde).padStart(2, "0")}.jpg`)).resize(360, Math.round((360 * vp.height) / vp.width), { fit: "cover" }).toBuffer()));
const th = Math.round((360 * vp.height) / vp.width);
if (tiles.length)
  await sharp({ create: { width: 360 * Math.min(6, tiles.length), height: th * Math.ceil(tiles.length / 6), channels: 3, background: "#000" } })
    .composite(tiles.map((b, k) => ({ input: b, left: (k % 6) * 360, top: Math.floor(k / 6) * th })))
    .jpeg({ quality: 80 })
    .toFile(join(OUT, "tira.jpg"));

const md = [
  `# Mapa de la web · ${pagina.titulo || url}`,
  "",
  `${url} · ${vp.width}×${vp.height} · ${pantallas.length} pantallas${previos.length ? ` · pasos previos: ${previos.join(" · ")}` : ""}`,
  "",
  "## Técnica",
  "",
  `- three: ${pagina.three ?? "no"} · librerías en la página: ${pagina.globales.join(", ") || "ninguna a la vista"} · en el JavaScript: ${firmasJs.join(", ") || "—"}`,
  `- fuentes: ${pagina.fuentes.join(", ") || "—"}`,
  `- elementos fijos: ${pagina.fijos.join(", ") || "ninguno"} · cursor propio: ${pagina.cursor ? "sí" : "no"}`,
  `- páginas internas: ${pagina.enlaces.length}${pagina.enlaces.length ? ` (${pagina.enlaces.slice(0, 6).map((h) => new URL(h).pathname).join(", ")}…)` : ""}`,
  transicion ? `- transición al abrir ${new URL(transicion.a).pathname}: cambio de imagen cada 150 ms ${transicion.pasos.join(" · ")}` : "- transición entre páginas: no medida",
  "",
  "## Secciones",
  "",
  "| # | Tipo | Pantallas | Atributos | Titulares | GPU |",
  "|---|---|---|---|---|---|",
  ...secciones.map((s, k) => `| ${k + 1} | ${s.tipo} | ${s.desde}–${s.hasta} | ${[s.fondo3d && "3D detrás", s.fijada && "fijada", s.virtual && "scroll virtual"].filter(Boolean).join(", ") || "—"} | ${s.titulares.join(" · ").slice(0, 120)} | ${s.gl} |`),
  "",
  "Miniaturas: `tira.jpg` (una por sección) y `pantallas/` (todas).",
  errores.length ? `\nErrores de la página: ${errores.slice(0, 3).join(" · ")}` : "",
];
writeFileSync(join(OUT, "web.md"), md.join("\n"));
writeFileSync(join(OUT, "web.json"), JSON.stringify({ url, previos, pagina, firmasJs, transicion, secciones, pantallas }, null, 1));
console.log(md.slice(4, 12 + secciones.length).join("\n"));
console.log(`  ${join(OUT, "web.md")}`);
