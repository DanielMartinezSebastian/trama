/** Modelo de la tarta de Almíbar Taller: la selección y lo que se deriva de ella (pisos, colores). Lo usan la escena 3D,
 * el dibujo plano (SVG) y las páginas. Sin React. */
import { CAKE } from "@/lib/sites/almibar";

export type CakeSel = { size: string; sponge: string; filling: string; covering: string; toppings: string[]; message: string };

export const DEFAULT_CAKE: CakeSel = { size: "10", sponge: "chocolate", filling: "frambuesa", covering: "desnuda", toppings: ["frutos-rojos"], message: "" };

/** Pisos según el tamaño: hasta 16 raciones uno; 24, dos; 40, tres. */
export const tiersOf = (size: string) => (size === "40" ? 3 : size === "24" ? 2 : 1);
/** Escala del piso de abajo según raciones (16 cm → 0,82 … 24 cm → 1,12). */
export const baseScale = (size: string) => ({ "6": 0.82, "10": 0.96, "16": 1.12, "24": 1.12, "40": 1.18 })[size] ?? 1;

const find = (list: { value: string; color?: string }[], v: string) => list.find((o) => o.value === v);
export const colorsOf = (sel: CakeSel) => ({
  sponge: find(CAKE.sponges, sel.sponge)?.color || "#f1dcae",
  filling: find(CAKE.fillings, sel.filling)?.color || "#f4d27a",
  covering: find(CAKE.coverings, sel.covering)?.color || "",
});

export const labelOf = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;

export function describe(sel: CakeSel) {
  const t = tiersOf(sel.size);
  return `${labelOf(CAKE.sizes, sel.size)}: bizcocho de ${labelOf(CAKE.sponges, sel.sponge).toLowerCase()}, relleno de ${labelOf(CAKE.fillings, sel.filling).toLowerCase()}, cobertura ${labelOf(CAKE.coverings, sel.covering).toLowerCase()}${sel.toppings.length ? `, con ${sel.toppings.map((x) => labelOf(CAKE.toppings, x).toLowerCase()).join(", ")}` : ""}${t > 1 ? ` (${t} pisos)` : ""}.`;
}

/** Días de antelación: 7 para las de pisos, 2 para el resto. */
export const leadDaysOf = (size: string) => (tiersOf(size) > 1 ? 7 : CAKE.leadDays);
