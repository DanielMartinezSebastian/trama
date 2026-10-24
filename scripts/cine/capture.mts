/**
 * Captura de una web 3D (docs/26 §2): estado de la escena por fotograma, shaders, recursos y vídeo a fotograma exacto.
 *
 *   npm run cine:capture -- <url> [opciones]
 *
 *   --drive time|scroll|pointer   qué la mueve (time)
 *   --seconds 4                   duración con --drive time o pointer
 *   --steps 40 --wheel 120        con --drive scroll: pasos de rueda y píxeles por paso
 *   --frames-per-step 6           fotogramas entre pasos de rueda (deja ver la inercia)
 *   --cola 1.5                    segundos sin tocar nada tras el último paso (cómo se asienta; da el amortiguado)
 *   --every 1                     un fotograma de vídeo cada n (1 = 60 fps)
 *   --size 1440x900               tamaño de la ventana
 *   --solo-lienzo                 oculta todo menos el lienzo mayor (créditos, paneles, indicador de Next)
 *   --real                        sin reloj virtual: tiempo real (el vídeo sale a la velocidad que dé la máquina)
 *   --clock-later                 el reloj virtual toma el control tras cargar (no desde el arranque): para saltarse la intro
 *   --assets                      descarga los recursos 3D (GLB, HDR, KTX2…) a la carpeta de la captura, solo para estudio
 *   --slug nombre --out carpeta   salida (por defecto .refs3d/<slug>/<fecha>)
 *
 * Salida: timeline.jsonl (un estado por fotograma), inventario.json (escena completa al principio, en medio y al final),
 * shaders/ (+ index.json), red.json (recursos), frames/, video.mp4, hoja.jpg (hoja de contacto) y ficha.auto.json.
 * Navegador: el Chromium de la caché de Playwright, que usa la GPU real también sin ventana (WebGL por ANGLE y WebGPU).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";
import { fichaDesdeCaptura, type Inventario, type Muestra } from "./lib.mts";

const argv = process.argv.slice(2);
const flag = (n: string) => argv.includes(n);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.log("Uso: npm run cine:capture -- <url> [--drive time|scroll|pointer] [--seconds 4] [--solo-lienzo] [--assets] …");
  process.exit(1);
}

const DRIVE = opt("--drive", "time") as "time" | "scroll" | "pointer";
const SECONDS = Number(opt("--seconds", "4"));
const STEPS = Number(opt("--steps", "40"));
const WHEEL = Number(opt("--wheel", "120"));
const PER_STEP = Number(opt("--frames-per-step", "6"));
const TAIL = Number(opt("--cola", "1.5"));
const EVERY = Math.max(1, Number(opt("--every", "1")));
const [W, H] = opt("--size", "1440x900").split("x").map(Number);
const EXACT = !flag("--real");
const FROM_START = !flag("--clock-later");
const FPS = 60;
const slug = opt("--slug", url.replace(/^https?:\/\/(www\.)?/, "").replace(/[?#].*$/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60));
const OUT = resolve(opt("--out", join(".refs3d", slug, new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-"))));
const HOOKS = resolve("scripts/cine/hooks");

mkdirSync(join(OUT, "frames"), { recursive: true });
mkdirSync(join(OUT, "shaders"), { recursive: true });

const ASSET = /\.(glb|gltf|bin|hdr|exr|ktx2|basis|drc|ktx|mp4|webm|mp3|ogg|wav|m4a)(\?|$)/i;
const red: { url: string; tipo: string; bytes: number; estado: number }[] = [];
// el JavaScript publicado, para las firmas de librerías (lib.mts, FIRMAS_JS)
let js = "";

const browser = await chromium.launch({
  executablePath: chromiumPath(),
  args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"],
});
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, bypassCSP: true });
const page = await context.newPage();
const errores: string[] = [];
page.on("pageerror", (e) => errores.push(e.message));
page.on("console", (m) => m.type() === "error" && errores.push(m.text().slice(0, 300)));
page.on("response", async (r) => {
  const u = r.url();
  const tipo = (u.match(/\.([a-z0-9]{2,5})(\?|$)/i)?.[1] ?? r.headers()["content-type"] ?? "?").toLowerCase();
  let bytes = Number(r.headers()["content-length"] ?? 0);
  if (/javascript|ecmascript/.test(r.headers()["content-type"] ?? "") && js.length < 40e6) {
    try {
      js += "\n" + (await r.text());
    } catch {
      /* sin cuerpo */
    }
  }
  if (ASSET.test(u)) {
    try {
      const body = await r.body();
      bytes = body.length;
      if (flag("--assets")) {
        mkdirSync(join(OUT, "assets"), { recursive: true });
        writeFileSync(join(OUT, "assets", decodeURIComponent(u.split("/").pop()!.split("?")[0]).replace(/[^\w.-]/g, "_")), body);
      }
    } catch {
      /* respuestas sin cuerpo (redirecciones, cancelaciones) */
    }
  }
  red.push({ url: u, tipo, bytes, estado: r.status() });
});

if (EXACT && FROM_START) await page.addInitScript("window.__cineClockAuto = true;");
if (EXACT) await page.addInitScript({ path: join(HOOKS, "clock.js") });
await page.addInitScript({ path: join(HOOKS, "three.js") });
await page.addInitScript({ path: join(HOOKS, "shaders.js") });

console.log(`→ ${url}\n  ${DRIVE} · ${EXACT ? "reloj virtual" + (FROM_START ? " desde el arranque" : " tras cargar") : "tiempo real"} · ${W}×${H} · ${OUT}`);
await page.goto(url, { waitUntil: "load", timeout: 120_000 });

/*
 * Escena lista: hay mallas y su número no cambia en 1,5 s (tiempo real, sin avanzar el reloj virtual), con la red en calma.
 * Con el reloj desde el arranque, la página no ha animado nada todavía: la animación empieza con el primer paso.
 */
const t0 = Date.now();
let last = -1;
let stableSince = Date.now();
while (Date.now() - t0 < 60_000) {
  const n = await page.evaluate(() => (window as unknown as { __cine?: { meshes(): number } }).__cine?.meshes() ?? 0);
  if (n !== last) {
    last = n;
    stableSince = Date.now();
  }
  if (n > 0 && Date.now() - stableSince > 1500) break;
  await page.waitForTimeout(250);
}
await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
console.log(`  escena lista: ${last} mallas (${((Date.now() - t0) / 1000).toFixed(1)} s)`);

if (flag("--solo-lienzo")) {
  /*
   * Solo se ve el lienzo mayor, sobre negro: el resto se vuelve transparente (texto, fondos, bordes, imágenes y los demás
   * lienzos, que son interfaz: gráficos de FPS, paneles…) pero sigue en su sitio y recibiendo eventos. Con visibility:hidden
   * se perdía la rueda: drei ScrollControls y Lenis escuchan el scroll en capas que van encima del lienzo.
   */
  await page.evaluate(() => {
    const big = [...document.querySelectorAll("canvas")].sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
    big?.setAttribute("data-cine-lienzo", "");
  });
  const hide = "color:transparent!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important;text-shadow:none!important;outline-color:transparent!important;-webkit-text-stroke-color:transparent!important;text-decoration-color:transparent!important";
  await page.addStyleTag({
    content: `html,body{background:#000!important} *:not(html):not(body):not(canvas),*::before,*::after{${hide}} img,svg,video,picture,iframe,canvas:not([data-cine-lienzo]){opacity:0!important} nextjs-portal{display:none!important}`,
  });
}
if (EXACT && !FROM_START) await page.evaluate(() => (window as unknown as { __cineClock: { control(): void } }).__cineClock.control());

type Win = { __cineClock: { step(n: number): Promise<unknown> }; __cine: { snapshot(): unknown; inventory(): unknown }; __cineShaders: { list: unknown[] } };
const step = (n: number) => (EXACT ? page.evaluate((k) => (window as unknown as Win).__cineClock.step(k), n) : page.waitForTimeout((1000 / FPS) * n));
const snapshot = () => page.evaluate(() => (window as unknown as Win).__cine.snapshot());
const inventory = () => page.evaluate(() => (window as unknown as Win).__cine.inventory());

const timeline: Muestra[] = [];
const inventarios: Inventario[] = [];
let frame = 0;
let shot = 0;

async function sample(input: Muestra["input"]) {
  await step(1);
  frame++;
  const s = (await snapshot()) as Omit<Muestra, "t" | "i" | "input" | "shot">;
  const m: Muestra = { i: frame, t: +(frame / FPS).toFixed(4), input, shot: null, ...s };
  if (frame % EVERY === 0) {
    shot++;
    m.shot = shot;
    await page.screenshot({ path: join(OUT, "frames", `${String(shot).padStart(5, "0")}.png`) });
  }
  timeline.push(m);
}

async function keyInventory() {
  inventarios.push({ frame, t: frame / FPS, inv: (await inventory()) as Inventario["inv"] });
}

const total = DRIVE === "scroll" ? STEPS * PER_STEP : Math.round(SECONDS * FPS);
await sample({});
await keyInventory();
if (DRIVE === "time") {
  for (let i = 1; i < total; i++) {
    await sample({});
    if (i === Math.floor(total / 2)) await keyInventory();
  }
} else if (DRIVE === "scroll") {
  await page.mouse.move(W / 2, H / 2);
  for (let s = 0; s < STEPS; s++) {
    await page.mouse.wheel(0, WHEEL);
    for (let k = 0; k < PER_STEP; k++) await sample({ wheel: k === 0 ? WHEEL : 0, step: s });
    if (s === Math.floor(STEPS / 2)) await keyInventory();
  }
  // cola sin tocar nada: cómo se asienta la página (y cómo frena la cámara: de ahí sale el amortiguado del scroll)
  for (let k = 0; k < Math.round(TAIL * FPS); k++) await sample({});
} else {
  // barrido del puntero: un ocho tumbado (lemniscata) que recorre el 70 % del lienzo
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2;
    const x = W / 2 + Math.sin(a) * W * 0.35;
    const y = H / 2 + Math.sin(a * 2) * H * 0.25;
    await page.mouse.move(x, y);
    await sample({ pointer: [Math.round(x), Math.round(y)] });
    if (i === Math.floor(total / 2)) await keyInventory();
  }
}
await keyInventory();

const shaders = (await page.evaluate(() => (window as unknown as Win).__cineShaders.list)) as { id: string; lang: string; stage: string; label: string | null; length: number; code: string }[];
for (const s of shaders) writeFileSync(join(OUT, "shaders", `${s.id}.${s.lang}`), s.code);
writeFileSync(join(OUT, "shaders", "index.json"), JSON.stringify(shaders.map(({ code, ...rest }) => ({ ...rest, lineas: code.split("\n").length })), null, 1));

writeFileSync(join(OUT, "timeline.jsonl"), timeline.map((m) => JSON.stringify(m)).join("\n") + "\n");
writeFileSync(join(OUT, "inventario.json"), JSON.stringify(inventarios, null, 1));
writeFileSync(join(OUT, "red.json"), JSON.stringify(red, null, 1));
const meta = { url, slug, fecha: new Date().toISOString(), drive: DRIVE, exacto: EXACT, desdeArranque: FROM_START, fps: FPS / EVERY, size: [W, H], frames: frame, imagenes: shot, errores: errores.slice(0, 30), chromium: browser.version() };
writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 1));
writeFileSync(join(OUT, "ficha.auto.json"), JSON.stringify(fichaDesdeCaptura(meta, timeline, inventarios, shaders, js), null, 1));
await browser.close();

// vídeo a la frecuencia de captura (60 fps / every) y hoja de contacto de 12 fotogramas
const fps = FPS / EVERY;
const ff = (args: string[]) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
if (shot > 1) {
  ff(["-framerate", String(fps), "-i", join(OUT, "frames", "%05d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow", join(OUT, "video.mp4")]);
  const stepN = Math.max(1, Math.floor(shot / 12));
  ff(["-i", join(OUT, "frames", "%05d.png"), "-vf", `select='not(mod(n\\,${stepN}))',scale=480:-2,tile=4x3`, "-frames:v", "1", "-q:v", "3", join(OUT, "hoja.jpg")]);
}
console.log(`  ${frame} fotogramas, ${shot} imágenes, ${shaders.length} shaders, ${red.length} respuestas${errores.length ? `, ${errores.length} errores de la página` : ""}`);
// sin renderer de three a la vista: three empaquetado sin sus efectos globales, otro motor o three en un worker (docs/26 §7)
if (!timeline.some((m) => m.renderer)) console.log("  ⚠ sin escena: three no avisó a __THREE_DEVTOOLS__. Quedan shaders (con sus etiquetas), red, firmas y vídeo. Si el vídeo se oscurece o se congela, repite con --real (lecturas asíncronas de la GPU que el reloj virtual no deja avanzar).");
console.log(`  ${OUT}`);
