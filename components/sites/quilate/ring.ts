import manifest from "@/public/models/anillos/manifest.json";

/** Modelo de las joyas configurables de Quilate: la selección, las opciones, el precio y el plazo. Lo usan la escena 3D,
 * el dibujo plano (SVG), los dos configuradores y la cita (que se lleva la pieza). Sin React. Precios orientativos de demo. */

export type Metal = "amarillo" | "blanco" | "rosa" | "platino" | "vermeil";
export type Profile = "media-cana" | "plana" | "confort" | "afinado";
export type Finish = "pulido" | "satinado" | "martillado";
export type Setting = "clasico" | "garras4" | "garras6" | "bisel" | "halo" | "trilogia";
export type Stone = "diamante" | "diamante-lab" | "zafiro" | "esmeralda" | "rubi";
export type Shape = "redonda" | "oval" | "princesa" | "esmeralda" | "asscher" | "cojin" | "radiante" | "pera" | "marquesa";
export type EngraveFont = "romana" | "cursiva" | "palo";

/** Una pieza: la alianza usa los campos de aro; el solitario, además, los de piedra y montura. */
export type RingSel = {
  kind: "alianza" | "solitario";
  metal: Metal;
  /** ancho del aro en mm */
  width: number;
  profile: Profile;
  finish: Finish;
  setting: Setting;
  stone: Stone;
  shape: Shape;
  /** quilates de la piedra central */
  carat: number;
  /** pavé de diamantes en la mitad superior del aro */
  pave: boolean;
  /** talla española (circunferencia interior en mm − 40) */
  size: number;
  engraving: string;
  font: EngraveFont;
  /** aro del kit modelado en Blender (id del manifest) · "" = aro a medida (procedural: perfil y ancho) */
  shank?: string;
  /** cabeza del kit (id del manifest) · "" = montura procedural (`setting`) */
  head?: string;
};

export const DEFAULT_BAND: RingSel = { kind: "alianza", metal: "amarillo", width: 3.5, profile: "confort", finish: "pulido", setting: "garras4", stone: "diamante", shape: "redonda", carat: 0.5, pave: false, size: 14, engraving: "", font: "romana" };
/**
 * El solitario clásico deconstruido (docs/19 §6): aro fino afinado hacia la cabeza, pulido espejo, cuatro garras planas con
 * galería y un brillante de medio quilate montado bajo.
 */
export const CLASSIC_SOLITAIRE: RingSel = { kind: "solitario", metal: "vermeil", width: 2, profile: "afinado", finish: "pulido", setting: "clasico", stone: "diamante-lab", shape: "redonda", carat: 0.5, pave: false, size: 14, engraving: "", font: "romana" };

export const DEFAULT_SOLITAIRE: RingSel = { ...DEFAULT_BAND, kind: "solitario", metal: "blanco", width: 2, profile: "media-cana", setting: "garras6", carat: 0.7 };

type Opt<V extends string> = { value: V; label: string; note?: string; color?: string };

export const METALS: (Opt<Metal> & { color: string; ley: string; perGram: number; density: number; roughness: number })[] = [
  { value: "amarillo", label: "Oro amarillo", ley: "oro de 18 k (750 ‰)", color: "#e2b866", perGram: 92, density: 15.5, roughness: 0.16 },
  { value: "blanco", label: "Oro blanco", ley: "oro de 18 k (750 ‰) rodiado", color: "#dfe1e2", perGram: 96, density: 15.6, roughness: 0.14 },
  { value: "rosa", label: "Oro rosa", ley: "oro de 18 k (750 ‰)", color: "#e7ad94", perGram: 92, density: 15.2, roughness: 0.16 },
  { value: "platino", label: "Platino", ley: "platino (950 ‰)", color: "#cfd3d6", perGram: 64, density: 20.7, roughness: 0.2 },
  { value: "vermeil", label: "Plata bañada en oro", ley: "plata de ley (925 ‰) con baño de oro de 18 k", color: "#e6bd6e", perGram: 3, density: 10.4, roughness: 0.15 },
];

export const PROFILES: Opt<Profile>[] = [
  { value: "confort", label: "Confort", note: "redondeado por dentro y por fuera" },
  { value: "media-cana", label: "Media caña", note: "curvo por fuera, plano por dentro" },
  { value: "plana", label: "Plana", note: "cantos vivos, aire contemporáneo" },
  { value: "afinado", label: "Afinado", note: "se estrecha y adelgaza al subir hacia la piedra (hombros afinados)" },
];

export const FINISHES: (Opt<Finish> & { extra: number })[] = [
  { value: "pulido", label: "Pulido espejo", extra: 0 },
  { value: "satinado", label: "Satinado", note: "cepillado a mano", extra: 30 },
  { value: "martillado", label: "Martillado", note: "golpe a golpe; no hay dos iguales", extra: 60 },
];

export const SETTINGS: (Opt<Setting> & { extra: number; days: number })[] = [
  { value: "clasico", label: "Clásico", note: "cuatro garras planas y rectas, con galería y la piedra baja: el solitario de siempre", extra: 160, days: 0 },
  { value: "garras4", label: "Cuatro garras", note: "deja entrar más luz en la piedra", extra: 180, days: 0 },
  { value: "garras6", label: "Seis garras", note: "más sujeción, silueta redonda", extra: 220, days: 0 },
  { value: "bisel", label: "Bisel", note: "el metal abraza la piedra; para el día a día", extra: 260, days: 3 },
  { value: "halo", label: "Halo", note: "un círculo de diamantes de 1 mm", extra: 690, days: 5 },
  { value: "trilogia", label: "Trilogía", note: "dos piedras laterales de 0,15 ct", extra: 840, days: 5 },
];

export const STONES: (Opt<Stone> & { color: string; perCarat: number; exp: number; iridescence: number; cert: string; hard: string })[] = [
  { value: "diamante", label: "Diamante natural", color: "#f4f7fb", perCarat: 4200, exp: 1.55, iridescence: 1, cert: "GIA o IGI", hard: "10 (Mohs)" },
  { value: "diamante-lab", label: "Diamante de laboratorio", color: "#f2f6fb", perCarat: 1150, exp: 1.25, iridescence: 1, cert: "IGI, con inscripción láser", hard: "10 (Mohs)" },
  { value: "zafiro", label: "Zafiro azul", color: "#2c4fa8", perCarat: 1500, exp: 1.35, iridescence: 0.3, cert: "laboratorio gemológico con origen", hard: "9 (Mohs)" },
  { value: "esmeralda", label: "Esmeralda", color: "#1f8a5b", perCarat: 2200, exp: 1.45, iridescence: 0.15, cert: "laboratorio gemológico, con tratamiento declarado", hard: "7,5–8 (Mohs): mejor en bisel" },
  { value: "rubi", label: "Rubí", color: "#b0153a", perCarat: 2600, exp: 1.45, iridescence: 0.2, cert: "laboratorio gemológico con origen", hard: "9 (Mohs)" },
];

export const SHAPES: (Opt<Shape> & { factor: number })[] = [
  { value: "redonda", label: "Brillante", factor: 1 },
  { value: "oval", label: "Oval", factor: 0.96 },
  { value: "princesa", label: "Princesa", factor: 0.9 },
  { value: "esmeralda", label: "Esmeralda", note: "talla en escalera: enseña la limpieza de la piedra", factor: 0.88 },
  { value: "asscher", label: "Asscher", note: "escalera cuadrada de esquinas cortadas", factor: 0.86 },
  { value: "cojin", label: "Cojín", factor: 0.92 },
  { value: "radiante", label: "Radiante", factor: 0.9 },
  { value: "pera", label: "Pera", factor: 0.93 },
  { value: "marquesa", label: "Marquesa", factor: 0.9 },
];

/** Tallas que el generador procedural sabe dibujar; las demás solo existen con las piezas del kit. */
export const PROCEDURAL_SHAPES: Shape[] = ["redonda", "oval", "princesa", "esmeralda"];

/* ---------- kit de piezas modeladas en Blender (public/models/anillos, manifest.json, CC0) ---------- */
export const KIT_BASE = "/models/anillos/";
/** La piedra del kit de cada talla. */
export const STONE_PIECE: Record<Shape, string> = {
  redonda: "piedra-brillante",
  oval: "piedra-oval",
  princesa: "piedra-princesa",
  esmeralda: "piedra-esmeralda",
  asscher: "piedra-asscher",
  cojin: "piedra-cojin",
  radiante: "piedra-radiante",
  pera: "piedra-pera",
  marquesa: "piedra-marquesa",
};
export const PIECE_SHAPE: Record<string, Shape> = Object.fromEntries(Object.entries(STONE_PIECE).map(([k, v]) => [v, k as Shape]));
/** Sobreprecio de cada aro y cabeza del kit (hechura; las piedras de pavé, halo y laterales van aparte). */
export const SHANK_EXTRA: Record<string, number> = { "aro-liso-confort": 0, "aro-afinado": 40, "aro-filo-cuchillo": 60, "aro-catedral": 120, "aro-bypass": 120, "aro-partido": 140, "aro-torsade": 160, "aro-pave": 380, "aro-canal": 420 };
export const HEAD_EXTRA: Record<string, number> = { "cabeza-4-garras": 180, "cabeza-6-garras": 220, "cabeza-garras-dobles": 260, "cabeza-garras-pico": 220, "cabeza-bisel": 260, "cabeza-medio-bisel": 240, "cabeza-halo-redondo": 420, "cabeza-halo-oval": 450, "cabeza-oval-4-garras": 190, "cabeza-oval-6-garras": 230, "cabeza-trilogia": 300 };
/** Aros del kit que tienen sentido sin cabeza (alianzas). */
export const BAND_SHANKS = ["aro-liso-confort", "aro-filo-cuchillo", "aro-torsade", "aro-pave", "aro-canal"];

export const FONTS: (Opt<EngraveFont> & { css: string })[] = [
  { value: "romana", label: "Romana", css: 'var(--font-cormorant-garamond), Georgia, serif' },
  { value: "cursiva", label: "Cursiva", css: 'var(--font-instrument-serif), Georgia, serif' },
  { value: "palo", label: "Palo seco", css: 'var(--font-inter), ui-sans-serif, sans-serif' },
];

/** Tallas españolas habituales (la talla es la circunferencia interior en mm menos 40). */
export const SIZES = Array.from({ length: 21 }, (_, i) => i + 6);
export const ENGRAVE_MAX = 24;

export const metalOf = (m: Metal) => METALS.find((x) => x.value === m)!;
export const stoneOf = (s: Stone) => STONES.find((x) => x.value === s)!;
export const labelOf = <V extends string>(list: Opt<V>[], v: V) => list.find((o) => o.value === v)?.label ?? v;

/** Circunferencia y diámetro interiores (mm) de una talla española. */
export const sizeToMm = (size: number) => ({ circ: size + 40, diam: (size + 40) / Math.PI });
/** Talla española más cercana a un diámetro interior en mm. */
export const mmToSize = (diam: number) => Math.round(diam * Math.PI - 40);

/** Gramos de metal del aro: volumen aproximado (circunferencia × ancho × grueso) por la densidad. */
export function grams(sel: RingSel) {
  const { circ } = sizeToMm(sel.size);
  const thick = sel.profile === "plana" ? 1.8 : 1.6;
  const fill = sel.profile === "media-cana" ? 0.78 : sel.profile === "confort" ? 0.85 : sel.profile === "afinado" ? 0.74 : 0.95;
  const mm3 = (circ + Math.PI * thick) * sel.width * thick * fill;
  return (mm3 / 1000) * metalOf(sel.metal).density + (sel.kind === "solitario" ? 0.6 : 0);
}

export type PriceLine = { label: string; amount: number };

/** Desglose del precio (IVA incluido). El primer grabado es gratis. */
export function priceLines(sel: RingSel): PriceLine[] {
  const m = metalOf(sel.metal);
  const g = grams(sel);
  const lines: PriceLine[] = [{ label: `${m.label}, ${g.toLocaleString("es-ES", { maximumFractionDigits: 1 })} g`, amount: Math.round(g * m.perGram) }];
  lines.push({ label: "Hechura en el taller", amount: sel.kind === "solitario" ? 380 : 190 });
  const fin = FINISHES.find((f) => f.value === sel.finish)!;
  if (fin.extra) lines.push({ label: `Acabado ${fin.label.toLowerCase()}`, amount: fin.extra });
  if (sel.kind === "solitario") {
    const st = stoneOf(sel.stone);
    const sh = SHAPES.find((s) => s.value === sel.shape)!;
    lines.push({ label: `${st.label}, ${sel.carat.toLocaleString("es-ES")} ct, ${sh.label.toLowerCase()}`, amount: Math.round(st.perCarat * Math.pow(sel.carat, st.exp) * sh.factor) });
    if (sel.head) {
      const k = kitPiece(sel.head);
      lines.push({ label: `Montura ${(k?.nombre ?? sel.head).toLowerCase()}`, amount: HEAD_EXTRA[sel.head] ?? 200 });
      const seats = k?.asientos?.cantidad ?? 0;
      if (seats) lines.push({ label: `Halo de ${seats} diamantes de 1,1 mm`, amount: seats * 22 });
      if (sel.head === "cabeza-trilogia") lines.push({ label: "Dos diamantes laterales (2 × 0,25 ct)", amount: 980 });
    } else {
      const se = SETTINGS.find((s) => s.value === sel.setting)!;
      lines.push({ label: `Montura ${se.label.toLowerCase()}`, amount: se.extra });
    }
  }
  if (sel.shank) {
    const k = kitPiece(sel.shank);
    const extra = SHANK_EXTRA[sel.shank] ?? 0;
    if (extra) lines.push({ label: `Aro ${(k?.nombre ?? sel.shank).toLowerCase()}`, amount: extra });
    const seats = k?.asientos?.cantidad ?? 0;
    if (seats) lines.push({ label: `${seats} diamantes de 1,3 mm en el aro`, amount: seats * 30 });
  } else if (sel.pave) lines.push({ label: "Pavé de 14 diamantes (0,14 ct)", amount: 520 });
  if (sel.engraving.trim()) lines.push({ label: "Grabado a mano (el primero, gratis)", amount: 0 });
  return lines;
}

export const priceOf = (sel: RingSel) => priceLines(sel).reduce((n, l) => n + l.amount, 0);

/** Días laborables de taller. */
export function workDays(sel: RingSel) {
  let d = sel.kind === "solitario" ? 22 : 12;
  if (sel.finish === "martillado") d += 2;
  if (sel.pave) d += 4;
  if (sel.kind === "solitario") d += SETTINGS.find((s) => s.value === sel.setting)!.days;
  return d;
}

export function describe(sel: RingSel) {
  const m = metalOf(sel.metal).label.toLowerCase();
  const band = sel.shank
    ? `${(kitPiece(sel.shank)?.nombre ?? sel.shank).toLowerCase()}, ${labelOf(FINISHES, sel.finish).toLowerCase()}`
    : `${sel.width.toLocaleString("es-ES")} mm, ${labelOf(PROFILES, sel.profile).toLowerCase()}, ${labelOf(FINISHES, sel.finish).toLowerCase()}`;
  const mount = sel.head ? (kitPiece(sel.head)?.nombre ?? sel.head).toLowerCase() : labelOf(SETTINGS, sel.setting).toLowerCase();
  const eng = sel.engraving.trim() ? `; grabado «${sel.engraving.trim()}»` : "";
  if (sel.kind === "alianza") return `Alianza de ${m}, ${band}${sel.pave ? ", con pavé" : ""}, talla ${sel.size}${eng}.`;
  return `Solitario de ${m} con ${labelOf(STONES, sel.stone).toLowerCase()} de ${sel.carat.toLocaleString("es-ES")} ct en talla ${labelOf(SHAPES, sel.shape).toLowerCase()}, montura ${mount}, aro ${sel.shank ? "" : "de "}${band}${sel.pave ? " con pavé" : ""}, talla ${sel.size}${eng}.`;
}

/** Aviso legal antes de pagar (docs/17 §6): lo hecho a medida o grabado no se devuelve por desistimiento. */
export const CUSTOM_NOTICE =
  "Es una pieza hecha a tu medida: no entra en el derecho de desistimiento de 14 días (excepción de bienes personalizados; confirmar redacción con la normativa de consumo). Sí tiene garantía, ajuste de talla gratis el primer año y limpieza de por vida.";

export type KitPiece = {
  id: string;
  archivo: string;
  nombre: string;
  tipo: "aro" | "cabeza" | "piedra";
  miniatura: string;
  compatibles?: string[];
  asientos?: { tipo: string; cantidad: number; diametro_piedra: number; prefijo: string };
  aros_no_recomendados?: string[];
  quilates_ref?: number;
};
/** Las piezas del kit (manifest.json de la sesión de Blender). */
export const KIT = (manifest as { piezas: KitPiece[] }).piezas;
export const kitPiece = (id: string) => KIT.find((p) => p.id === id);
/** Tallas que admite una cabeza del kit. */
export const headShapes = (id: string): Shape[] => (kitPiece(id)?.compatibles ?? []).map((c) => PIECE_SHAPE[c]).filter(Boolean);
