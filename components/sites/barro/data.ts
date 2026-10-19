/** Barro — tienda de cerámica hecha a mano (ficticia). Datos puros: catálogo, variantes y filtros. */
import type { PotteryKind } from "@/lib/sites/art";

export const SLUG = "barro";

export const meta = {
  slug: SLUG,
  name: "Barro",
  title: "Barro · cerámica hecha a mano",
  blurb:
    "Tienda de cerámica con el flujo completo de comercio: listado con filtros y orden, ficha con galería y zoom, selector de color y tamaño, carrito lateral con envío gratis, y un pedido por pasos. Usa useCart (estado del carrito con persistencia), ProductCard, OptionPicker, FilterBar y CartDrawer.",
  accent: "#b5532f",
  tag: "tienda · comercio",
};

export type Glaze = { value: string; label: string; color: string; soldOut?: boolean };
export type Size = { value: string; label: string; extra: number };
export type Product = {
  slug: string;
  title: string;
  kind: PotteryKind;
  type: string;
  material: "gres" | "porcelana" | "terracota";
  price: number;
  compareAt?: number;
  badge?: string;
  seed: number;
  glazes: Glaze[];
  sizes: Size[];
  lead: string;
  details: string[];
};

const G = {
  terracota: { value: "terracota", label: "Terracota", color: "#b5532f" },
  salvia: { value: "salvia", label: "Salvia", color: "#7d8f69" },
  hueso: { value: "hueso", label: "Hueso", color: "#d9cdb8" },
  carbon: { value: "carbon", label: "Carbón", color: "#34322f" },
  azul: { value: "azul", label: "Azul humo", color: "#5d7690" },
};
const S = {
  single: [{ value: "unico", label: "Único", extra: 0 }],
  vase: [{ value: "s", label: "Pequeño", extra: 0 }, { value: "m", label: "Mediano", extra: 14 }, { value: "l", label: "Grande", extra: 32 }],
  bowl: [{ value: "m", label: "Mediano", extra: 0 }, { value: "l", label: "Grande", extra: 8 }],
};

export const PRODUCTS: Product[] = [
  { slug: "jarron-ola", title: "Jarrón Ola", kind: "vase", type: "Jarrones", material: "gres", price: 48, badge: "Novedad", seed: 0, glazes: [G.terracota, G.salvia, { ...G.hueso, soldOut: true }, G.carbon], sizes: S.vase, lead: "Un jarrón de cuello estrecho con el esmalte caído, como una ola al retirarse.", details: ["Gres esmaltado a mano", "Apto para agua", "Cada pieza es única: el esmalte varía"] },
  { slug: "cuenco-brisa", title: "Cuenco Brisa", kind: "bowl", type: "Cuencos", material: "porcelana", price: 28, compareAt: 34, seed: 1, glazes: [G.hueso, G.azul, G.salvia], sizes: S.bowl, lead: "Ligero y fino, para el desayuno o para llevar la fruta a la mesa.", details: ["Porcelana", "Apto para lavavajillas y microondas", "Diámetro 14–18 cm"] },
  { slug: "taza-alba", title: "Taza Alba", kind: "mug", type: "Tazas", material: "gres", price: 18, seed: 2, glazes: [G.terracota, G.carbon, G.hueso], sizes: S.single, lead: "La taza de todas las mañanas, con un asa que cabe de verdad en la mano.", details: ["Gres", "300 ml", "Apta para lavavajillas"] },
  { slug: "plato-marea", title: "Plato Marea", kind: "plate", type: "Platos", material: "gres", price: 24, seed: 3, glazes: [G.hueso, G.salvia, G.azul], sizes: [{ value: "m", label: "Postre · 20 cm", extra: 0 }, { value: "l", label: "Llano · 27 cm", extra: 8 }], lead: "Un plato de borde bajo que deja respirar la comida.", details: ["Gres", "Apto para lavavajillas", "Se puede apilar"] },
  { slug: "jarra-nube", title: "Jarra Nube", kind: "jug", type: "Jarras", material: "terracota", price: 42, seed: 4, glazes: [G.terracota, G.hueso], sizes: S.single, lead: "Para el agua, el vino o las flores del mercado. Pico que no gotea.", details: ["Terracota esmaltada por dentro", "1,2 litros", "Lavar a mano"] },
  { slug: "jarron-sal", title: "Jarrón Sal", kind: "vase", type: "Jarrones", material: "porcelana", price: 56, badge: "Últimas unidades", seed: 0, glazes: [G.hueso, G.azul], sizes: S.vase, lead: "Porcelana blanca y mate, como un guijarro de playa.", details: ["Porcelana", "Apto para agua", "Hecho en series de diez"] },
  { slug: "cuenco-arena", title: "Cuenco Arena", kind: "bowl", type: "Cuencos", material: "terracota", price: 32, seed: 1, glazes: [G.terracota, G.carbon], sizes: S.bowl, lead: "Terracota sin esmaltar por fuera: se siente el barro.", details: ["Terracota", "Interior esmaltado", "Lavar a mano"] },
  { slug: "taza-duna", title: "Taza Duna", kind: "mug", type: "Tazas", material: "porcelana", price: 20, compareAt: 24, seed: 2, glazes: [{ ...G.salvia, soldOut: true }, G.azul], sizes: S.single, lead: "Más ancha que alta, para el té que se toma despacio.", details: ["Porcelana", "250 ml", "Apta para lavavajillas"] },
];

export const TYPES = ["Jarrones", "Cuencos", "Tazas", "Platos", "Jarras"];
export const MATERIALS = ["gres", "porcelana", "terracota"] as const;
export const FREE_SHIPPING = 60;
export const SHIPPING = { estandar: 4.9, expres: 9.9 };

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "tienda", title: "Tienda" },
  ...PRODUCTS.map((p) => ({ path: `producto/${p.slug}`, title: p.title })),
  { path: "pedido", title: "Pedido" },
];
