/**
 * Descarga una biblioteca de fotos de Wikimedia Commons con licencias que permiten redistribuir (CC0, dominio público y CC BY),
 * las optimiza y guarda sus créditos. Es reproducible: `npm run images:fetch` vuelve a generar lo mismo (o actualiza lo que cambie).
 *
 *   npm run images:fetch            → todos los temas
 *   npm run images:fetch -- eventos → solo uno
 *
 * Salida:  public/img/<tema>/<n>-<slug>.jpg  +  lib/sites/photo-credits.json  (autor, licencia, URL de origen de cada foto)
 * Criterios: JPEG de ≥ 2400 px de ancho, licencia CC0 / dominio público / CC BY (se descartan SA, ND y NC), un máximo de 2 fotos por
 * autor y tema, y preferencia por las «Quality images» de Commons. Se reducen a 1600 px de ancho y se comprimen (calidad 76).
 * Las fotos NO se envían en el paquete npm (viven en `public/`, que el paquete no incluye); la atribución se muestra en `/creditos`.
 * Las que Commons conserva de Unsplash y Pexels (CC0) suelen ser las de mejor calidad: se priorizan por el título.
 * Para sustituir una foto que no guste, añade un fragmento de su título a `EXCLUDE` y vuelve a ejecutar.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const UA = "TramaUI-demo-images/1.0 (https://github.com/DanielMartinezSebastian/trama; demo assets)";
const OUT = "public/img";
const OK_LIC = /^(cc0|cc-zero|public domain|pd\b|cc by \d|cc-by-\d)/i;
const BAD_LIC = /\b(sa|nd|nc)\b/i;

/** Títulos (sin «File:») que no se quieren, por mala foto o por no encajar. */
const EXCLUDE: string[] = [
  "marakkanam", "salt-pans", "salt pans", "pachalik", "occupation and freedom", "strada lipscani", "conference organisers", "l-22-01-21", "i love you stage",
  "positivus", "snow covered saint charles", "cholla", "shoshone", "savyolovsky", "winnipeg", "wiener weltausstellung", "painting", "gemälde", "oil on canvas",
  "gov-ball",
  // joyería: texto religioso de fondo, retrato de moda y reloj con la marca a la vista
  "Wedding rings (Unsplash).jpg", "Woman in gold in front of graffiti (Unsplash).jpg", "Watch and wedding bands (Unsplash).jpg",
  "Thomas Rowlandson - Vaux-Hall - Dr. Johnson, Oliver Goldsmith, Mary Robinson, et al.jpg", "(Venice) French goldsmith, mechanical celestial and terrestrial globe, post 1565 - Correr Museum.jpg",
  "Residence of Hon. W.W. Sullivan, Charlottetown, P.E.I. E.W. Taylor's Jewelry Store, Interior & Exterior, Southside Queen Square (IA dr residence-of-hon-ww-sullivan-charlottetown-pei-ew-taylors-jewelr-4475021).jpg",
  "Paul Goldsmith 2024.jpg", "Metro Mall Jewelry Mall Downtown Miami FL September 2026 - 02.jpg",
  // retratos: animales, la cara tapada o de espaldas (la portada necesita un rostro de frente)
  "Posing for a portrait (Unsplash).jpg", "Portrait of a Giraffe (Unsplash).jpg", "Bundled Up (Unsplash).jpg", "Man in hat facing away (Unsplash).jpg",
  "Big Desert Wilderness Area, Victoria, Australia (Unsplash).jpg", "Coffee art and iphone (Unsplash).jpg", "Sambazon 2016 (Unsplash).jpg", "Tidal Basin, Washington, United States (Unsplash xVnPN3fVGfY).jpg", "West Rim Trail, Grand Canyon Village, United States (Unsplash).jpg", "plant-in-a-coworking", "paris-coffee", "man-in-cafe", "aerial-view-of-cape-town", "food-of-the-city",
];

/** `match`: el título tiene que encajar (temas en los que la búsqueda de Commons trae mucho ruido). */
const TOPICS: Record<string, { n: number; queries: string[]; match?: RegExp }> = {
  arquitectura: { n: 7, queries: ["unsplash modern architecture", "unsplash building facade", "pexels architecture glass building", "modern architecture building facade"] },
  interiores: { n: 6, queries: ["unsplash interior design", "unsplash modern interior living room", "pexels interior lobby", "interior design modern living room"] },
  eventos: { n: 6, queries: ["unsplash concert crowd", "unsplash festival stage lights", "pexels conference audience", "music festival crowd stage"] },
  objetos: { n: 6, queries: ["unsplash vase", "unsplash ceramic", "unsplash minimal still life", "unsplash glass bottle", "unsplash candle", "unsplash tea cup", "unsplash wooden bowl", "unsplash product flatlay", "pexels pottery"] },
  estudio: { n: 5, queries: ["unsplash creative workspace desk", "unsplash designer laptop", "pexels studio workspace", "unsplash architect model"] },
  naturaleza: { n: 5, queries: ["unsplash forest trees", "unsplash sunlight forest", "pexels green forest", "unsplash garden plants"] },
  ciudad: { n: 5, queries: ["unsplash city street night", "unsplash urban skyline", "pexels city lights evening", "unsplash street architecture"] },
  gastronomia: { n: 5, queries: ["unsplash restaurant food", "unsplash coffee cafe", "pexels plated dish", "unsplash bread bakery"] },
  deporte: { n: 8, queries: ["unsplash racing car", "unsplash motorsport", "pexels race car", "unsplash athlete portrait", "unsplash cyclist road", "unsplash helmet"] },
  pasteleria: { n: 14, queries: ["unsplash cake", "unsplash pastry", "unsplash croissant", "unsplash bakery", "unsplash macarons", "unsplash cupcake", "pexels cake", "pexels pastry", "unsplash dessert", "unsplash tart", "unsplash cheesecake", "unsplash donut", "unsplash cinnamon roll", "unsplash wedding cake", "unsplash strawberry cake", "pexels bakery"] },
  joyeria: { n: 14, queries: ["jewelry store interior", "jewellery shop window", "jewelry display case", "jeweller workshop", "goldsmith workbench", "goldsmith at work", "jeweler hands", "gemstones loose", "cut gemstones", "diamond loose", "jewelry unsplash", "gold necklace unsplash", "engagement ring box", "earrings unsplash", "jewellery making"], match: /\b(rings?|jewel\w*|necklace|earrings?|bracelets?|gold\w*|diamonds?|gem\w*|pendant|jeweller\w*|jeweler\w*|workshop|workbench)\b/i },
  // retratos de cerca y con poca luz: la portada de meermohsin.me (un rostro sobre negro con luz roja, docs/40 §4)
  retratos: { n: 12, queries: ["portrait unsplash", "man portrait unsplash", "male portrait", "portrait of a man", "headshot man unsplash", "man portrait studio unsplash", "portrait of young man unsplash", "man black shirt portrait", "man portrait dark background", "young man portrait", "pexels portrait", "man face portrait"] },
  verano: { n: 6, queries: ["unsplash swimming pool", "unsplash palm trees", "unsplash beach summer", "pexels pool summer", "unsplash sunset beach"] },
};

type Cand = { title: string; w: number; h: number; lic: string; licUrl: string; author: string; thumb: string; page: string; quality: boolean };
const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function search(q: string, quality: boolean): Promise<Cand[]> {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrsearch: `${q} filetype:bitmap${quality ? ' incategory:"Quality images"' : ""}`, gsrnamespace: "6", gsrlimit: "50",
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "1600", origin: "*",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons ${res.status}`);
  const json = (await res.json()) as { query?: { pages: Record<string, any> } };
  return Object.values(json.query?.pages ?? {})
    .map((p: any): Cand | null => {
      const ii = p.imageinfo?.[0];
      const m = ii?.extmetadata ?? {};
      const lic = String(m.LicenseShortName?.value ?? "");
      if (!ii || ii.mime !== "image/jpeg" || ii.width < 2400 || !OK_LIC.test(lic) || BAD_LIC.test(lic)) return null;
      return { title: String(p.title).replace(/^File:/, ""), w: ii.width, h: ii.height, lic, licUrl: String(m.LicenseUrl?.value ?? ""), author: strip(String(m.Artist?.value ?? "Desconocido")).slice(0, 80) || "Desconocido", thumb: String(ii.thumburl), page: String(ii.descriptionurl), quality };
    })
    .filter((x): x is Cand => x !== null);
}

async function pick(topic: string, cfg: { n: number; queries: string[]; match?: RegExp }): Promise<Cand[]> {
  const pool = new Map<string, Cand>();
  for (const q of cfg.queries) {
    for (const quality of [true, false]) {
      try {
        for (const c of await search(q, quality)) if (!pool.has(c.title) && !EXCLUDE.includes(c.title)) pool.set(c.title, c);
      } catch (e) {
        console.warn(`  ! ${q}: ${(e as Error).message}`);
      }
      await wait(400);
    }
  }
  // calidad primero, luego resolución; máximo 2 por autor y sin dibujos/mapas por el título
  const ranked = [...pool.values()].filter((c) => !cfg.match || cfg.match.test(c.title)).filter((c) => !/\b(map|drawing|plan|diagram|logo|poster|stamp|coat of arms|screenshot)\b/i.test(c.title)).sort((a, b) => Number(/unsplash|pexels/i.test(b.title)) - Number(/unsplash|pexels/i.test(a.title)) || Number(b.quality) - Number(a.quality) || b.w * b.h - a.w * a.h);
  const per = new Map<string, number>();
  const out: Cand[] = [];
  for (const c of ranked) {
    const k = c.author.toLowerCase();
    if ((per.get(k) ?? 0) >= 2) continue;
    per.set(k, (per.get(k) ?? 0) + 1);
    out.push(c);
    if (out.length >= cfg.n) break;
  }
  console.log(`${topic}: ${pool.size} candidatas → ${out.length} elegidas`);
  return out;
}

const only = process.argv[2];
const creditsPath = "lib/sites/photo-credits.json"; // fuente de verdad de la atribución (la lee la página /creditos)
const credits: Record<string, unknown>[] = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf8")) : [];
const keep = credits.filter((c) => only && c.topic !== only);
const next: Record<string, unknown>[] = [...keep];

for (const [topic, cfg] of Object.entries(TOPICS)) {
  if (only && topic !== only) continue;
  rmSync(join(OUT, topic), { recursive: true, force: true }); // sin restos de descargas anteriores
  mkdirSync(join(OUT, topic), { recursive: true });
  const chosen = await pick(topic, cfg);
  let i = 0;
  for (const c of chosen) {
    i += 1;
    const file = `${topic}/${String(i).padStart(2, "0")}-${slug(c.title)}.jpg`;
    try {
      let buf: Buffer | null = null;
      for (let t = 0; t < 4 && !buf; t++) {
        const r = await fetch(c.thumb, { headers: { "User-Agent": UA } });
        if (r.ok) buf = Buffer.from(await r.arrayBuffer());
        else await wait(2500 * (t + 1)); // Commons limita el ritmo (429): se reintenta con espera creciente
      }
      if (!buf) throw new Error("sin respuesta");
      const img = sharp(buf).rotate();
      const meta = await img.metadata();
      const data = await img.resize({ width: Math.min(1600, meta.width ?? 1600), withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toBuffer();
      const info = await sharp(data).metadata();
      writeFileSync(join(OUT, file), data);
      next.push({ file, topic, title: c.title, author: c.author, license: c.lic, licenseUrl: c.licUrl, source: "Wikimedia Commons", page: c.page, width: info.width, height: info.height, bytes: data.length });
      console.log(`  ✓ ${file} ${info.width}x${info.height} ${(data.length / 1024).toFixed(0)} KB · ${c.lic} · ${c.author.slice(0, 30)}`);
    } catch (e) {
      console.warn(`  ✗ ${c.title}: ${(e as Error).message}`);
    }
    await wait(1200);
  }
}

writeFileSync(creditsPath, JSON.stringify(next, null, 2));
const total = next.reduce((n, c) => n + Number(c.bytes ?? 0), 0);
console.log(`\n${next.length} fotos · ${(total / 1048576).toFixed(1)} MB → ${OUT}/ (créditos en ${creditsPath})`);
