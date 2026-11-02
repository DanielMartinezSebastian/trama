/**
 * Mide cuánto se parecen varias versiones de un mismo encargo (docs/evolucion-agentes/p6-variedad-claude.md).
 *
 *   npm run qa:variedad -- --nombre lucero <url> <url> <url> [--control]
 *
 * refs:probe compara dos páginas una a una, sobre todo en estilo. Esto añade lo que falta para esta pregunta: la
 * silueta de cada pantalla, con el color quitado, en tres encuadres y dos anchos, y rasgos de arquitectura. Con
 * --control mide además cada página contra sí misma con el tono girado 180°: una «variante» que solo cambia la paleta.
 * Esa cifra calibra el resultado, porque indica cuánto puntúa un cambio de pintura sin cambio de estructura.
 * Salida en .refs3d/variedad/<nombre>/ (capturas e informe.json); no sustituye a mirar las capturas.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Page } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const argv = process.argv.slice(2);
const at = argv.indexOf("--nombre");
const nombre = at >= 0 ? argv[at + 1] : "variedad";
const control = argv.includes("--control");
const urls = argv.filter((a) => /^https?:\/\//.test(a));
if (urls.length < 2) throw new Error("Uso: npm run qa:variedad -- --nombre <id> <url> <url> [...] [--control]");
const out = join(".refs3d", "variedad", nombre);
mkdirSync(out, { recursive: true });
const ANCHOS = [[1440, 900], [390, 844]] as const;
const ENCUADRES = [0, .5, 1];
const W = 48, H = 30;

/** Lleva la página a un punto de su recorrido, sea scroll de documento, de un contenedor o lateral. */
const mover = (page: Page, f: number) => page.evaluate((f) => {
  const nodos = [document.scrollingElement!, ...document.querySelectorAll<HTMLElement>("body *")];
  const v = nodos.filter((n) => n.scrollHeight - n.clientHeight > 40 && (n === document.scrollingElement || /auto|scroll/.test(getComputedStyle(n).overflowY)))
    .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
  const h = nodos.filter((n) => n.scrollWidth - n.clientWidth > 40 && /auto|scroll/.test(getComputedStyle(n).overflowX) && n.clientHeight > innerHeight * .3)
    .sort((a, b) => b.scrollWidth - a.scrollWidth)[0];
  if (v) v.scrollTop = f * (v.scrollHeight - v.clientHeight);
  else if (h) h.scrollLeft = f * (h.scrollWidth - h.clientWidth);
  return { eje: v ? "vertical" : h ? "lateral" : "ninguno" };
}, f);

/** Reduce una captura a una rejilla de luminancia: la silueta sin color. */
const rejilla = (page: Page, png: Buffer) => page.evaluate(async ({ b64, W, H }) => {
  const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
  const c = new OffscreenCanvas(W, H).getContext("2d")!;
  c.drawImage(img, 0, 0, W, H);
  const d = c.getImageData(0, 0, W, H).data, l: number[] = [], paleta: Record<string, number> = {};
  for (let i = 0; i < d.length; i += 4) {
    l.push(.2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]);
    const k = [d[i], d[i + 1], d[i + 2]].map((v) => (v >> 5) * 36).join(",");
    paleta[k] = (paleta[k] ?? 0) + 1;
  }
  return { l, paleta };
}, { b64: png.toString("base64"), W, H });

const correlacion = (a: number[], b: number[]) => {
  const m = (x: number[]) => x.reduce((s, v) => s + v, 0) / x.length;
  const ma = m(a), mb = m(b);
  let n = 0, da = 0, db = 0;
  a.forEach((v, i) => { n += (v - ma) * (b[i] - mb); da += (v - ma) ** 2; db += (b[i] - mb) ** 2; });
  return da && db ? n / Math.sqrt(da * db) : 0;
};
/* Parecido de bordes: dónde cambia la imagen, que es la composición aunque el relleno se invierta. */
const bordes = (l: number[]) => l.map((v, i) => (i % W === W - 1 || i + W >= l.length ? 0 : Math.abs(v - l[i + 1]) + Math.abs(v - l[i + W])));
const cruce = (a: Record<string, number>, b: Record<string, number>) => {
  const total = (x: Record<string, number>) => Object.values(x).reduce((s, v) => s + v, 0);
  const ta = total(a), tb = total(b);
  return Object.keys(a).reduce((s, k) => s + Math.min(a[k] / ta, (b[k] ?? 0) / tb), 0);
};
const r2 = (n: number) => Math.round(n * 100) / 100;

const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
type Muestra = { url: string; vista: string; l: number[]; paleta: Record<string, number> };
const muestras: Muestra[] = [], rasgos: Record<string, unknown>[] = [];

async function capturar(url: string, etiqueta: string, tono: boolean) {
  for (const [w, h] of ANCHOS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(url, { waitUntil: "load", timeout: 90000 });
    await page.addStyleTag({ content: `[data-nextjs-toast], nextjs-portal { display: none !important; } html { scroll-behavior: auto !important; }${tono ? " html { filter: hue-rotate(180deg); }" : ""}` });
    await page.waitForTimeout(2500);
    if (w === 1440 && !tono) rasgos.push({ url, ...(await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const fuentes: Record<string, number> = {};
      document.querySelectorAll("h1,h2,h3,p,li,td,th,button,a,label").forEach((n) => { const f = getComputedStyle(n).fontFamily.split(",")[0].replace(/["']/g, "").replace(/^__|_[a-z0-9]+$/gi, ""); fuentes[f] = (fuentes[f] ?? 0) + 1; });
      return {
        canvas: document.querySelectorAll("canvas").length, img: document.images.length, formularios: document.querySelectorAll("form").length,
        tablas: document.querySelectorAll("table").length, secciones: document.querySelectorAll("section").length, botones: document.querySelectorAll("button").length,
        h1: h1 ? { px: parseFloat(getComputedStyle(h1).fontSize), y: Math.round(h1.getBoundingClientRect().top) } : null,
        fuentes: Object.entries(fuentes).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => f),
      };
    })) });
    for (const f of ENCUADRES) {
      const { eje } = await mover(page, f);
      if (w === 1440 && !tono && f === 0) Object.assign(rasgos.at(-1)!, { eje });
      // el WebGL va por software en headless: necesita más tiempo para asentar la cámara
      await page.waitForTimeout((await page.locator("canvas").count()) ? 9000 : 1600);
      const png = await page.screenshot({ path: join(out, `${etiqueta}-${w}-${Math.round(f * 100)}.png`), timeout: 120000 });
      muestras.push({ url: etiqueta, vista: `${w}-${f}`, ...(await rejilla(page, png)) });
    }
    await page.close();
  }
}

const etiquetas = urls.map((u) => new URL(u).pathname.split("/").filter(Boolean).pop() ?? "portada");
for (const [i, u] of urls.entries()) { await capturar(u, etiquetas[i], false); if (control) await capturar(u, `${etiquetas[i]}+tono`, true); }
await browser.close();

function par(a: string, b: string) {
  const v = muestras.filter((m) => m.url === a), s: number[] = [], e: number[] = [], p: number[] = [];
  for (const m of v) {
    const o = muestras.find((x) => x.url === b && x.vista === m.vista)!;
    s.push(Math.abs(correlacion(m.l, o.l)));
    e.push(correlacion(bordes(m.l), bordes(o.l)));
    p.push(cruce(m.paleta, o.paleta));
  }
  const media = (x: number[]) => r2(x.reduce((t, n) => t + n, 0) / x.length);
  return { a, b, silueta: media(s), bordes: media(e), paleta: media(p), primerEncuadre: { silueta: r2(s[0]), bordes: r2(e[0]) } };
}
const pares = etiquetas.flatMap((a, i) => etiquetas.slice(i + 1).map((b) => par(a, b)));
const controles = control ? etiquetas.map((e) => par(e, `${e}+tono`)) : [];
const informe = { nombre, fecha: new Date().toISOString(), anchos: ANCHOS, encuadres: ENCUADRES, rejilla: [W, H], rasgos, pares, controles };
writeFileSync(join(out, "informe.json"), JSON.stringify(informe, null, 1));
console.table(pares.map(({ primerEncuadre, ...p }) => ({ ...p, silueta0: primerEncuadre.silueta })));
if (controles.length) { console.log("Control (misma página, solo otro tono):"); console.table(controles.map(({ primerEncuadre, ...p }) => p)); }
console.log(JSON.stringify(rasgos, null, 1));
console.log(`Capturas e informe en ${out}`);
