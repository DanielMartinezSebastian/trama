/**
 * Primer vistazo a una web 3D antes de capturarla (docs/33 §2): qué hay (three, escenas, mallas, scroll, textos, botones),
 * qué avisos hay que pasar y qué gesto mueve la cámara o la imagen. Termina con la orden de `cine:capture` recomendada.
 * Sustituye a los explora.mts de un uso de Hublot, Bruno Simon y Chartogne-Taillet.
 *
 *   npm run cine:explora -- <url> [--size 1280x720] [--movil] [--antes "clic:0.5,0.74"] [--out carpeta]
 *
 * Gestos que prueba, por orden, midiendo la cámara de la escena principal y cuánto cambian los píxeles: puntero a la
 * izquierda y a la derecha, rueda, arrastre, clic en el centro, flechas y tiempo quieto (lo que se mueve solo).
 * Salida: explora.md, explora.json y una imagen por gesto.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { AVISO, abrir, botones, camara, esperarEscena, pasos } from "./navegador.mts";

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.log('Uso: npm run cine:explora -- <url> [--size 1280x720] [--movil] [--antes "clic:0.5,0.74"] [--out carpeta]');
  process.exit(1);
}
const movil = argv.includes("--movil");
const size = opt("--size", "1280x720").split("x").map(Number) as [number, number];
const slug = url.replace(/^https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 50);
const OUT = resolve(opt("--out", join(".refs3d", "explora", slug)));
mkdirSync(OUT, { recursive: true });

const { browser, page, errores } = await abrir({ size, movil });
const vp = page.viewportSize()!;
console.log(`→ ${url} (${vp.width}×${vp.height}${movil ? ", móvil" : ""})`);
await page.goto(url, { waitUntil: "load", timeout: 120_000 });
await page.waitForTimeout(4000);
let mallas = await esperarEscena(page, 20_000);

type Foto = { nombre: string; buf: Buffer };
const fotos: Foto[] = [];
const foto = async (nombre: string) => {
  const buf = await page.screenshot({ path: join(OUT, `${String(fotos.length).padStart(2, "0")}-${nombre}.png`) });
  fotos.push({ nombre, buf });
  return buf;
};
/** cambio de imagen entre dos capturas: diferencia media por píxel (0–1) a 160 px de ancho */
const cambio = async (a: Buffer, b: Buffer) => {
  const lee = (x: Buffer) => sharp(x).resize(160).removeAlpha().raw().toBuffer();
  const [ra, rb] = await Promise.all([lee(a), lee(b)]);
  let s = 0;
  for (let i = 0; i < ra.length; i++) s += Math.abs(ra[i] - rb[i]);
  return s / ra.length / 255;
};

const info = async () =>
  page.evaluate(() => {
    const w = window as unknown as { __cine?: { state: { revision: string | null; renderers: { isWebGPURenderer?: boolean; isWebGLRenderer?: boolean; constructor: { name: string } }[]; scenes: { traverse(f: (o: { isMesh?: boolean; isInstancedMesh?: boolean; count?: number; isLight?: boolean; visible?: boolean }) => void): void }[] } } };
    const st = w.__cine?.state;
    const escenas = (st?.scenes ?? []).map((s) => {
      let mallas = 0, instancias = 0, luces = 0;
      s.traverse((o) => {
        if (o.isMesh && o.visible !== false) (mallas++, o.isInstancedMesh && (instancias += o.count ?? 0));
        if (o.isLight) luces++;
      });
      return { mallas, instancias, luces };
    }).filter((e) => e.mallas > 0);
    const de = document.documentElement, b = document.body;
    return {
      three: st?.revision ?? null,
      renderers: (st?.renderers ?? []).map((r) => (r.isWebGPURenderer ? "WebGPURenderer" : r.isWebGLRenderer ? "WebGLRenderer" : r.constructor.name)),
      escenas,
      lienzos: [...document.querySelectorAll("canvas")].map((c) => [c.width, c.height]),
      scroll: { alto: de.scrollHeight, ventana: innerHeight, overflow: [getComputedStyle(de).overflow, getComputedStyle(b).overflow] },
      texto: b.innerText.replace(/\s+/g, " ").trim().slice(0, 500),
    };
  });

const inicio = await info();
let antes = await foto("inicio");
const listaBotones = await botones(page);
const informe: string[] = [`# Exploración · ${url}`, "", `- three: ${inicio.three ?? "no detectado"} · ${inicio.renderers.join(", ") || "sin renderer de three"} · lienzos ${inicio.lienzos.map((l) => l.join("×")).join(", ") || "ninguno"}`, `- escenas con mallas: ${inicio.escenas.map((e) => `${e.mallas} mallas${e.instancias ? ` (${e.instancias} instancias)` : ""}, ${e.luces} luces`).join(" · ") || "ninguna"}`, `- scroll: ${inicio.scroll.alto} px de página en ${inicio.scroll.ventana} de ventana · overflow html/body ${inicio.scroll.overflow.join("/")}`, `- texto: «${inicio.texto.slice(0, 240)}»`, `- botones: ${listaBotones.map((b) => b.texto).slice(0, 20).join(" | ")}`, ""];

// pasos previos: los de --antes y los avisos que se reconozcan
const previos: string[] = [];
if (opt("--antes", "")) previos.push(...(await pasos(page, opt("--antes", ""))));
const avisos = listaBotones.filter((b) => AVISO.test(b.texto));
if (avisos.length) {
  previos.push(...(await pasos(page, "avisos")));
  await page.waitForTimeout(3000);
  mallas = await esperarEscena(page, 15_000);
  antes = await foto("tras-avisos");
}
if (previos.length) informe.push(`**Pasos previos**: ${previos.join(" · ")}`, "");

type Resultado = { gesto: string; camara: number; giro: number; scroll: number; imagen: number };
const resultados: Resultado[] = [];
const gestos: [string, string][] = [
  ["puntero a la izquierda", "mueve:0.15,0.5;espera:1.2"],
  ["puntero a la derecha", "mueve:0.85,0.5;espera:1.2"],
  ["rueda", "mueve:0.5,0.5;rueda:400x10;espera:3"],
  ["arrastre", "arrastre:0.35,0.5>0.65,0.5;espera:1.2"],
  ["clic en el centro", "clic:0.5,0.5;espera:2"],
  ["flechas", "tecla:ArrowUp;tecla:ArrowRight;espera:1"],
  ["tiempo quieto (3 s)", "espera:3"],
];
for (const [nombre, linea] of gestos) {
  const c0 = await camara(page);
  try {
    await pasos(page, linea);
  } catch (e) {
    informe.push(`- ${nombre}: falló (${(e as Error).message})`);
    continue;
  }
  const c1 = await camara(page);
  const despues = await foto(nombre.replace(/[^a-z]+/gi, "-"));
  const d = c0?.cam && c1?.cam ? Math.hypot(...c0.cam.pos.map((v, i) => v - c1.cam!.pos[i])) : 0;
  const g = c0?.cam && c1?.cam ? (Math.acos(Math.min(1, c0.cam.dir.reduce((s, v, i) => s + v * c1.cam!.dir[i], 0))) * 180) / Math.PI : 0;
  const r: Resultado = { gesto: nombre, camara: +d.toFixed(4), giro: +g.toFixed(2), scroll: (c1?.scrollY ?? 0) - (c0?.scrollY ?? 0), imagen: +(await cambio(antes, despues)).toFixed(4) };
  resultados.push(r);
  antes = despues;
  console.log(`  ${nombre}: cámara ${r.camara} m, ${r.giro}°, scroll ${r.scroll} px, imagen ${(r.imagen * 100).toFixed(1)} %`);
}
await browser.close();

informe.push("| Gesto | Cámara (m) | Giro (°) | Scroll (px) | Cambio de imagen |", "|---|---|---|---|---|");
for (const r of resultados) informe.push(`| ${r.gesto} | ${r.camara} | ${r.giro} | ${r.scroll} | ${(r.imagen * 100).toFixed(1)} % |`);

// la recomendación: el gesto que más mueve (cámara o imagen), descontando lo que se mueve solo
const solo = resultados.find((r) => r.gesto.startsWith("tiempo"))?.imagen ?? 0;
const mueve = (r: Resultado) => r.camara > 0.01 || r.giro > 0.5 || r.scroll !== 0 || r.imagen > solo * 1.5 + 0.01;
const vivos = resultados.filter((r) => !r.gesto.startsWith("tiempo") && mueve(r));
const clics = previos.map((p) => p.match(/en ([\d.]+),([\d.]+)/)).filter(Boolean).map((m, i) => `${m![1]},${m![2]}@${(0.1 + i * 0.3).toFixed(1)}`);
const base = `npm run cine:capture -- ${url} --size ${vp.width}x${vp.height}${movil ? " --movil" : ""}${clics.length || mallas === 0 ? " --clock-later --espera 6" : ""}${clics.length ? ` --clic "${clics.join(";")}"` : ""}`;
const recomendadas: string[] = [];
if (vivos.some((r) => r.gesto === "rueda")) recomendadas.push(`${base} --drive scroll --steps 30 --wheel 200`);
if (vivos.some((r) => r.gesto.startsWith("puntero"))) recomendadas.push(`${base} --drive pointer --seconds 6 --cola 2`);
if (vivos.some((r) => r.gesto === "arrastre")) recomendadas.push(`${base} --drive time --seconds 8 --arrastre "0.3,0.5>0.7,0.5@2+0.6"`);
if (vivos.some((r) => r.gesto === "flechas")) recomendadas.push(`${base} --drive time --seconds 8 --teclas "ArrowUp@1+3;ArrowLeft@2+1"`);
if (solo > 0.01 || !recomendadas.length) recomendadas.push(`${base} --drive time --seconds 6`);
informe.push("", `Se mueve sola: ${solo > 0.01 ? "sí" : "no"} (${(solo * 100).toFixed(1)} % de cambio en 3 s). Gestos que la mueven: ${vivos.map((r) => r.gesto).join(", ") || "ninguno"}.`, "", "**Capturas recomendadas**", "", ...recomendadas.map((r) => "    " + r));
if (errores.length) informe.push("", `Errores de la página (${errores.length}): ${errores.slice(0, 5).join(" · ")}`);
if (mallas === 0) informe.push("", "No hay escena de three a la vista: puede ser otro motor (docs/26 §8) o una escena que espera a un gesto.");

writeFileSync(join(OUT, "explora.md"), informe.join("\n") + "\n");
writeFileSync(join(OUT, "explora.json"), JSON.stringify({ url, inicio, previos, resultados, recomendadas, errores }, null, 1));
console.log(`\n${recomendadas.map((r) => "  " + r).join("\n")}\n  ${join(OUT, "explora.md")}`);
