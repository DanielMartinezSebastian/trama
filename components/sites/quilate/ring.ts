/** Modelo de las joyas configurables de Quilate: la selección, las opciones, el precio y el plazo. Lo usan la escena 3D,
 * el dibujo plano (SVG), los dos configuradores y la cita (que se lleva la pieza). Sin React. Precios orientativos de demo. */

export type Metal = "amarillo" | "blanco" | "rosa" | "platino";
export type Profile = "media-cana" | "plana" | "confort";
export type Finish = "pulido" | "satinado" | "martillado";
export type Setting = "garras4" | "garras6" | "bisel" | "halo" | "trilogia";
export type Stone = "diamante" | "diamante-lab" | "zafiro" | "esmeralda" | "rubi";
export type Shape = "redonda" | "oval" | "princesa" | "esmeralda";
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
};

export const DEFAULT_BAND: RingSel = { kind: "alianza", metal: "amarillo", width: 3.5, profile: "confort", finish: "pulido", setting: "garras4", stone: "diamante", shape: "redonda", carat: 0.5, pave: false, size: 14, engraving: "", font: "romana" };
export const DEFAULT_SOLITAIRE: RingSel = { ...DEFAULT_BAND, kind: "solitario", metal: "blanco", width: 2, profile: "media-cana", setting: "garras6", carat: 0.7 };

type Opt<V extends string> = { value: V; label: string; note?: string; color?: string };

export const METALS: (Opt<Metal> & { color: string; ley: string; perGram: number; density: number; roughness: number })[] = [
  { value: "amarillo", label: "Oro amarillo", ley: "oro de 18 k (750 ‰)", color: "#e2b866", perGram: 92, density: 15.5, roughness: 0.16 },
  { value: "blanco", label: "Oro blanco", ley: "oro de 18 k (750 ‰) rodiado", color: "#dfe1e2", perGram: 96, density: 15.6, roughness: 0.14 },
  { value: "rosa", label: "Oro rosa", ley: "oro de 18 k (750 ‰)", color: "#e7ad94", perGram: 92, density: 15.2, roughness: 0.16 },
  { value: "platino", label: "Platino", ley: "platino (950 ‰)", color: "#cfd3d6", perGram: 64, density: 20.7, roughness: 0.2 },
];

export const PROFILES: Opt<Profile>[] = [
  { value: "confort", label: "Confort", note: "redondeado por dentro y por fuera" },
  { value: "media-cana", label: "Media caña", note: "curvo por fuera, plano por dentro" },
  { value: "plana", label: "Plana", note: "cantos vivos, aire contemporáneo" },
];

export const FINISHES: (Opt<Finish> & { extra: number })[] = [
  { value: "pulido", label: "Pulido espejo", extra: 0 },
  { value: "satinado", label: "Satinado", note: "cepillado a mano", extra: 30 },
  { value: "martillado", label: "Martillado", note: "golpe a golpe; no hay dos iguales", extra: 60 },
];

export const SETTINGS: (Opt<Setting> & { extra: number; days: number })[] = [
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
];

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
  const fill = sel.profile === "media-cana" ? 0.78 : sel.profile === "confort" ? 0.85 : 0.95;
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
    const se = SETTINGS.find((s) => s.value === sel.setting)!;
    lines.push({ label: `Montura ${se.label.toLowerCase()}`, amount: se.extra });
  }
  if (sel.pave) lines.push({ label: "Pavé de 14 diamantes (0,14 ct)", amount: 520 });
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
  const band = `${sel.width.toLocaleString("es-ES")} mm, ${labelOf(PROFILES, sel.profile).toLowerCase()}, ${labelOf(FINISHES, sel.finish).toLowerCase()}`;
  const eng = sel.engraving.trim() ? `; grabado «${sel.engraving.trim()}»` : "";
  if (sel.kind === "alianza") return `Alianza de ${m}, ${band}${sel.pave ? ", con pavé" : ""}, talla ${sel.size}${eng}.`;
  return `Solitario de ${m} con ${labelOf(STONES, sel.stone).toLowerCase()} de ${sel.carat.toLocaleString("es-ES")} ct en talla ${labelOf(SHAPES, sel.shape).toLowerCase()}, montura ${labelOf(SETTINGS, sel.setting).toLowerCase()}, aro de ${band}${sel.pave ? " con pavé" : ""}, talla ${sel.size}${eng}.`;
}

/** Aviso legal antes de pagar (docs/17 §6): lo hecho a medida o grabado no se devuelve por desistimiento. */
export const CUSTOM_NOTICE =
  "Es una pieza hecha a tu medida: no entra en el derecho de desistimiento de 14 días (excepción de bienes personalizados; confirmar redacción con la normativa de consumo). Sí tiene garantía, ajuste de talla gratis el primer año y limpieza de por vida.";
