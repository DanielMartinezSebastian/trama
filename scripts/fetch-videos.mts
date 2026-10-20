/**
 * Biblioteca de vídeos de las demos: clips cortos, sin audio y en bucle, sacados de Wikimedia Commons con licencias que
 * permiten redistribuir (CC0, dominio público y CC BY). Es la versión en vídeo de `images:fetch`, con una diferencia: la
 * búsqueda automática en Commons trae mucho ruido con vídeo (timelapses de satélite, ruedas de prensa, tutoriales), así
 * que aquí la lista es CURADA: cada clip es un archivo concreto con el tramo elegido a mano (`start`).
 *
 *   npm run videos:fetch                        → descarga y procesa toda la lista
 *   npm run videos:fetch -- oceano              → solo un tema
 *   npm run videos:fetch -- --buscar "surfing"  → candidatos aptos de Commons (licencia, ≥ 1280 px, apaisado) para ampliar la lista
 *   npm run videos:fetch -- --hojas [tema]      → hojas de contacto (12 fotogramas a lo largo de cada original) en
 *                                                 .cache/videos/hojas/, para elegir `start` mirando el vídeo entero
 *
 * Salida:  public/video/<tema>/<n>-<slug>.mp4 (+ .jpg, el póster: primer fotograma del clip)  +  lib/sites/video-credits.json
 * Proceso (ffmpeg en el PATH): ffmpeg lee por HTTP el derivado 1080p VP9 de Commons saltando al tramo [start, start + dur]
 * (no baja el original entero, que puede durar minutos y ser 4K), se escala a 1280 px de ancho, se quita el audio, se codifica en H.264 (CRF 27 con tope de 2 Mb/s: el agua y el follaje disparan el peso; `faststart`
 * para que empiece a reproducirse antes de bajar entero) y se añade un fundido de 0,4 s al principio y al final para que el
 * bucle no dé un salto brusco. Un clip de 10 s pesa como mucho ~2,5 MB. Como las fotos, no van en el paquete npm (viven en `public/`), y la
 * atribución se muestra en `/creditos`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UA = "TramaUI-demo-videos/1.0 (https://github.com/DanielMartinezSebastian/trama; demo assets)";
const OUT = "public/video";
const CACHE = ".cache/videos";
const CREDITS = "lib/sites/video-credits.json"; // fuente de verdad de la atribución (la lee /creditos)
const OK_LIC = /^(cc0|cc-zero|public domain|pd\b|cc by \d)/i;
const BAD_LIC = /\b(sa|nd|nc)\b/i;

type Clip = {
  /** nombre exacto del archivo en Commons, sin «File:» */
  title: string;
  /** segundo del original donde empieza el clip (elegido con `--hojas`) */
  start: number;
  /** duración del clip en segundos (por defecto 10) */
  dur?: number;
  /** nombre corto del archivo de salida */
  name: string;
  /** descripción en español (texto alternativo y créditos) */
  alt: string;
};

/** Lista curada por tema. Para cambiar un clip: busca con `--buscar`, mira su hoja con `--hojas` y ajusta `start`. */
const CLIPS: Record<string, Clip[]> = {
  oceano: [
    { title: "Aerial view of a green sea turtle (Chelonia mydas) swimming in the reef at Lady Musgrave Island, Queensland, Australia.webm", start: 21, dur: 12, name: "arrecife", alt: "Los canales turquesa de un arrecife de coral, vistos desde el aire" },
    { title: "Aerial view of a blacktip reef shark (Carcharhinus melanopterus) at Lady Musgrave Island, Queensland, Australia.webm", start: 7, dur: 10, name: "tiburon-puntas-negras", alt: "Un tiburón de puntas negras patrulla el agua clara sobre la arena, visto desde el aire" },
    { title: "Spinner dolphins in Hawaii.webm", start: 17, dur: 10, name: "delfines-hawai", alt: "Un grupo de delfines girador nada bajo el agua azul en Hawái" },
    { title: "Aerial views of seals and dolphins at Barrack Point, NSW, Australia.webm", start: 146, dur: 10, name: "delfines-barrack-point", alt: "Un grupo de delfines nada en agua verde, visto desde el aire" },
  ],
  costa: [
    { title: "Ocean waves at Lækjavik beach, Iceland.webm", start: 0, dur: 8, name: "olas-islandia", alt: "Olas rompiendo en una playa de arena negra bajo un acantilado en Islandia" },
    { title: "Oregon Coast Odyssey- FPV Drone Captures Stunning Ocean Views.webm", start: 22, dur: 10, name: "costa-oregon", alt: "Vuelo de dron a ras de los acantilados y el oleaje de la costa de Oregón" },
    { title: "Aerial views of Chat Mami beach in Ras Jebel, Tunisia.webm", start: 2, dur: 10, name: "playa-tunez", alt: "Una playa de Túnez al atardecer, con la orilla rosada, vista desde el aire" },
  ],
  naturaleza: [
    { title: "Delaneys Falls.webm", start: 6, dur: 10, name: "cascada", alt: "Una cascada estrecha cae por una pared de roca entre árboles" },
    { title: "From the mountain high, the forest stretches like a green ocean, kissed by mist and rain — a silent breath of nature, and continue with move on.webm", start: 1, dur: 7, name: "bosque-montana", alt: "Montañas cubiertas de bosque bajo un cielo nublado" },
  ],
  ciudad: [
    { title: "Charlotte By Night - 4K Drone Footage.webm", start: 78, dur: 10, name: "rascacielos-noche", alt: "Rascacielos iluminados de colores de noche, vistos desde un dron" },
    { title: "City at night.webm", start: 4, dur: 10, name: "avenida-noche", alt: "Una avenida llena de tráfico cruza una ciudad de noche" },
    { title: "Aerial views of Budapest, Hungary.webm", start: 58, dur: 10, name: "budapest", alt: "Los baños termales y el parque de la ciudad de Budapest, vistos desde el aire" },
  ],
  cielo: [{ title: "2011-09-05 22-54-01-timelapse-clouds-evening.ogv", start: 0, dur: 10, name: "nubes-atardecer", alt: "Nubes que pasan rápido al anochecer sobre los tejados, a cámara rápida" }],
};

type Info = { title: string; lic: string; licUrl: string; author: string; page: string; width: number; height: number; duration: number; src: string; preview: string };
const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const safe = (s: string) => s.replace(/[^\w.-]+/g, "_").slice(0, 120);

/** GET a la API de Commons con reintentos: limita el ritmo (429) y hay que esperar cada vez más. */
async function api(params: Record<string, string>) {
  const q = new URLSearchParams({ action: "query", format: "json", origin: "*", ...params });
  for (let t = 0; t < 6; t++) {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${q}`, { headers: { "User-Agent": UA } });
    if (res.ok) return (await res.json()) as { query?: { pages: Record<string, any> } };
    await wait(5000 * (t + 1));
  }
  throw new Error("Commons no responde (429)");
}

const licOk = (lic: string) => OK_LIC.test(lic) && !BAD_LIC.test(lic);

function toInfo(p: any): Info | null {
  const v = p.videoinfo?.[0];
  if (!v) return null;
  const m = v.extmetadata ?? {};
  const derivs: { src: string; type: string; height: number }[] = v.derivatives ?? [];
  // el derivado VP9 más grande hasta 1080p (Commons transcodifica todo a VP9; el original puede ser 4K y pesar cientos de MB)
  const webm = derivs.filter((d) => d.type.startsWith("video/webm")).sort((a, b) => b.height - a.height);
  const best = webm.find((d) => d.height <= 1080);
  const small = webm.find((d) => d.height <= 480);
  return {
    title: String(p.title).replace(/^File:/, ""),
    lic: String(m.LicenseShortName?.value ?? ""),
    licUrl: String(m.LicenseUrl?.value ?? ""),
    author: strip(String(m.Artist?.value ?? "Desconocido")).slice(0, 80) || "Desconocido",
    page: String(v.descriptionurl),
    width: v.width,
    height: v.height,
    duration: Number(v.duration ?? 0),
    src: best?.src ?? String(v.url),
    preview: small?.src ?? best?.src ?? String(v.url),
  };
}

async function info(title: string): Promise<Info> {
  const json = await api({ titles: `File:${title}`, prop: "videoinfo", viprop: "url|size|mime|extmetadata|derivatives" });
  const page = Object.values(json.query?.pages ?? {})[0];
  const i = page && toInfo(page);
  if (!i) throw new Error("no está en Commons (¿título exacto?)");
  if (!licOk(i.lic)) throw new Error(`licencia no apta: ${i.lic}`);
  return i;
}

/** Derivado pequeño (480p) en la caché local, para las hojas de contacto: hay que leerlo entero. */
async function preview(i: Info) {
  mkdirSync(CACHE, { recursive: true });
  const file = join(CACHE, safe(i.title) + ".480p.webm");
  if (existsSync(file) && statSync(file).size > 0) return file;
  for (let t = 0; t < 4; t++) {
    const r = await fetch(i.preview, { headers: { "User-Agent": UA } });
    if (r.ok) {
      writeFileSync(file, Buffer.from(await r.arrayBuffer()));
      return file;
    }
    await wait(4000 * (t + 1));
  }
  throw new Error("no se pudo descargar");
}

const ffmpeg = (args: string[]) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

function ensureFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    console.error("Hace falta ffmpeg en el PATH (Windows: winget install Gyan.FFmpeg · macOS: brew install ffmpeg).");
    process.exit(1);
  }
}

/** `--buscar "<texto>"`: candidatos aptos para ampliar la lista. */
async function searchMode(q: string) {
  const json = await api({ generator: "search", gsrsearch: `${q} filetype:video`, gsrnamespace: "6", gsrlimit: "50", prop: "videoinfo", viprop: "url|size|extmetadata" });
  const rows = Object.values(json.query?.pages ?? {})
    .map(toInfo)
    .filter((i): i is Info => !!i && licOk(i.lic) && i.width >= 1280 && i.width > i.height && i.duration >= 6);
  console.log(`${rows.length} candidatos aptos para «${q}»:`);
  for (const r of rows) console.log(`  ${r.width}px · ${Math.round(r.duration)} s · ${r.lic} · ${r.title}`);
}

/** `--hojas`: 12 fotogramas repartidos por el original, en una rejilla de 4×3 con el segundo de cada uno en el nombre. */
async function sheetsMode(only?: string) {
  ensureFfmpeg();
  const dir = join(CACHE, "hojas");
  mkdirSync(dir, { recursive: true });
  for (const [topic, list] of Object.entries(CLIPS)) {
    if (only && topic !== only) continue;
    for (const c of list) {
      try {
        const i = await info(c.title);
        const src = await preview(i);
        const step = Math.max(1, i.duration / 12);
        const out = join(dir, `${topic}-${c.name}-cada-${step.toFixed(1)}s.jpg`);
        ffmpeg(["-i", src, "-vf", `fps=1/${step.toFixed(3)},scale=320:-2,tile=4x3`, "-frames:v", "1", "-q:v", "5", out]);
        console.log(`  ✓ ${out} (${Math.round(i.duration)} s)`);
      } catch (e) {
        console.warn(`  ✗ ${c.title}: ${(e as Error).message}`);
      }
      await wait(1500);
    }
  }
}

async function fetchMode(only?: string) {
  ensureFfmpeg();
  const credits: Record<string, unknown>[] = existsSync(CREDITS) ? JSON.parse(readFileSync(CREDITS, "utf8")) : [];
  const next = credits.filter((c) => only && c.topic !== only);
  for (const [topic, list] of Object.entries(CLIPS)) {
    if (only && topic !== only) continue;
    rmSync(join(OUT, topic), { recursive: true, force: true }); // sin restos de descargas anteriores
    mkdirSync(join(OUT, topic), { recursive: true });
    let n = 0;
    for (const c of list) {
      n += 1;
      const base = `${topic}/${String(n).padStart(2, "0")}-${c.name}`;
      try {
        const i = await info(c.title);
        const dur = Math.min(c.dur ?? 10, Math.max(2, i.duration - c.start));
        const fade = 0.4;
        const mp4 = join(OUT, `${base}.mp4`);
        ffmpeg([
          "-user_agent", UA, "-ss", String(c.start), "-t", String(dur), "-i", i.src, "-an",
          "-vf", `scale=1280:-2:flags=lanczos,fps=30,fade=t=in:st=0:d=${fade},fade=t=out:st=${(dur - fade).toFixed(2)}:d=${fade},format=yuv420p`,
          "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-maxrate", "2M", "-bufsize", "4M", "-profile:v", "high", "-movflags", "+faststart", mp4,
        ]);
        // póster: un fotograma pasado el fundido de entrada
        const jpg = join(OUT, `${base}.jpg`);
        ffmpeg(["-ss", String(fade + 0.1), "-i", mp4, "-frames:v", "1", "-q:v", "4", jpg]);
        const probe = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", mp4]).toString().trim().split(",");
        const bytes = statSync(mp4).size;
        next.push({ file: `${base}.mp4`, poster: `${base}.jpg`, topic, alt: c.alt, title: i.title, author: i.author, license: i.lic, licenseUrl: i.licUrl, source: "Wikimedia Commons", page: i.page, start: c.start, duration: Number(dur.toFixed(2)), width: Number(probe[0]), height: Number(probe[1]), bytes });
        console.log(`  ✓ ${base}.mp4 ${probe.join("x")} ${dur.toFixed(1)} s ${(bytes / 1048576).toFixed(1)} MB · ${i.lic} · ${i.author.slice(0, 30)}`);
      } catch (e) {
        console.warn(`  ✗ ${c.title}: ${(e as Error).message}`);
      }
      await wait(1500);
    }
  }
  writeFileSync(CREDITS, JSON.stringify(next, null, 2) + "\n");
  const total = next.reduce((s, c) => s + Number(c.bytes ?? 0), 0);
  console.log(`\n${next.length} vídeos · ${(total / 1048576).toFixed(1)} MB → ${OUT}/ (créditos en ${CREDITS})`);
}

const args = process.argv.slice(2);
if (args[0] === "--buscar") await searchMode(args.slice(1).join(" "));
else if (args[0] === "--hojas") await sheetsMode(args[1]);
else await fetchMode(args[0]);
