/**
 * Almíbar — pastelería y obrador de barrio en Zaragoza (ficticia). Contenido COMPARTIDO por sus tres versiones:
 *
 *   /sitios/almibar         «Obrador editorial»   — procedencia, carta, pedido para recoger, encargos (nivel de movimiento 1–2)
 *   /sitios/almibar-taller  «Taller 3D»           — tartas a medida con configurador 3D, bodas y empresas (nivel 2–3)
 *   /sitios/almibar-barrio  «Café en puntos»      — QR de mesa, pedido en mesa, club de sellos (dot matrix, nivel 1)
 *
 * Mismo negocio, mismos datos (horario, carta, alérgenos, tiendas, precios): lo que cambia es el concepto de la librería que
 * aplica cada una. Ver docs/17-sectores-comerciales.md §8. Datos puros: sin React.
 */
import type { MenuSection } from "@/components/ui/MenuList";
import { openingHoursSchema } from "@/lib/ui/hours";

export const BRAND = {
  name: "Almíbar",
  legal: "Almíbar Obrador S. L. (empresa ficticia de demostración)",
  since: 1987,
  city: "Zaragoza",
  tagline: "Pastelería de obrador desde 1987",
  phone: "+34 976 000 000",
  phoneHref: "tel:+34976000000",
  whatsapp: "+34 600 000 000",
  whatsappHref: "https://wa.me/34600000000?text=Hola%2C%20quer%C3%ADa%20hacer%20un%20encargo",
  email: "hola@almibar.example",
  instagram: "@almibar.obrador",
  rating: { value: 4.8, count: 642, source: "Google" },
  sanitary: "RGSEAA 20.000000/Z (registro de ejemplo)",
};

export type Store = { id: string; name: string; address: string; zone: string; map: string; hours: string; exceptions: string; services: string[]; seats: number; note?: string };

/** Festivos de Zaragoza (2026–2027) y aperturas especiales de temporada. */
const EXCEPTIONS = "2026-10-12|Fiestas del Pilar\n2026-11-01|Todos los Santos|08:00-14:00\n2026-12-08|Inmaculada\n2026-12-24|Nochebuena|07:30-14:00\n2026-12-25|Navidad\n2027-01-01|Año Nuevo\n2027-01-05|Víspera de Reyes|07:00-21:00\n2027-01-06|Reyes|08:00-14:00";

export const STORES: Store[] = [
  {
    id: "centro",
    name: "Almíbar Centro · obrador",
    address: "Calle del Obrador 12, 50001 Zaragoza",
    zone: "Casco Histórico, a 3 min del Mercado Central",
    map: "https://www.openstreetmap.org/search?query=Mercado%20Central%20Zaragoza",
    hours: "L-V|07:30-14:00 17:00-20:30\nS|08:00-14:30 17:30-20:30\nD|08:30-14:00",
    exceptions: EXCEPTIONS,
    services: ["Obrador a la vista", "Café y 18 mesas", "Recogida de encargos", "Accesible en silla de ruedas", "Trona y cambiador"],
    seats: 18,
    note: "Aquí horneamos todo cada madrugada.",
  },
  {
    id: "delicias",
    name: "Almíbar Delicias",
    address: "Avenida de las Moreras 48, 50017 Zaragoza",
    zone: "Delicias, junto a la parada del tranvía",
    map: "https://www.openstreetmap.org/search?query=Delicias%20Zaragoza",
    hours: "L-S|07:30-20:30\nD|cerrado",
    exceptions: EXCEPTIONS,
    services: ["Para llevar", "Recogida de encargos", "Terraza de 6 mesas", "Aparcabicis"],
    seats: 6,
  },
];

/** Producto de la vitrina: lo que se vende por unidad (carta, pedido para recoger, mesa). */
export type Product = {
  id: string;
  name: string;
  cat: "Bollería" | "Panes" | "Tartas y porciones" | "Dulces de temporada" | "Café y bebidas";
  price: number;
  /** precio de la tarta entera, si se vende entera */
  whole?: { price: number; serves: number };
  desc: string;
  allergens: string[];
  tags?: string[];
  photo?: { topic: "pasteleria" | "gastronomia"; i: number };
  soldOut?: boolean;
  /** solo en temporada (no se puede pedir para recoger fuera de ella) */
  season?: string;
};

export const PRODUCTS: Product[] = [
  { id: "croissant", name: "Croissant de mantequilla", cat: "Bollería", price: 1.9, desc: "27 capas de hojaldre con mantequilla de Soria, horneado a las 6:00.", allergens: ["gluten", "huevo", "leche"], tags: ["el de siempre"], photo: { topic: "pasteleria", i: 3 } },
  { id: "napolitana", name: "Napolitana de chocolate", cat: "Bollería", price: 2.2, desc: "Con dos barritas de chocolate negro al 70 %.", allergens: ["gluten", "huevo", "leche", "soja"] },
  { id: "caracola", name: "Caracola de canela", cat: "Bollería", price: 2.6, desc: "Masa brioche, canela de Ceilán y glaseado de queso.", allergens: ["gluten", "huevo", "leche"], tags: ["nuevo"] },
  { id: "ensaimada", name: "Ensaimada", cat: "Bollería", price: 2.4, desc: "Fermentada 14 horas, con azúcar glas.", allergens: ["gluten", "huevo"] },
  { id: "hogaza", name: "Hogaza de masa madre", cat: "Panes", price: 4.5, desc: "750 g · harina de trigo de Aragón y 24 horas de fermentación.", allergens: ["gluten"], tags: ["vegano"], photo: { topic: "pasteleria", i: 0 } },
  { id: "centeno", name: "Pan de centeno y semillas", cat: "Panes", price: 3.8, desc: "500 g · centeno integral, lino, pipas y sésamo.", allergens: ["gluten", "sesamo"], tags: ["vegano"] },
  { id: "barra", name: "Barra de leña", cat: "Panes", price: 1.4, desc: "Corteza fina y crujiente; sale del horno a las 7:30 y a las 18:00.", allergens: ["gluten"], tags: ["vegano"] },
  { id: "queso", name: "Tarta de queso al horno", cat: "Tartas y porciones", price: 4.8, whole: { price: 32, serves: 8 }, desc: "Cremosa por dentro, tostada por fuera. La que más nos piden.", allergens: ["leche", "huevo", "gluten"], tags: ["la más pedida"], photo: { topic: "pasteleria", i: 11 } },
  { id: "chocolate", name: "Tarta de chocolate y frambuesa", cat: "Tartas y porciones", price: 4.9, whole: { price: 34, serves: 8 }, desc: "Bizcocho de cacao, ganache al 64 % y frambuesa fresca.", allergens: ["gluten", "huevo", "leche", "soja"], photo: { topic: "pasteleria", i: 1 } },
  { id: "zanahoria", name: "Tarta de zanahoria", cat: "Tartas y porciones", price: 4.5, whole: { price: 30, serves: 8 }, desc: "Con nueces, especias y crema de queso.", allergens: ["gluten", "huevo", "leche", "frutos-cascara"] },
  { id: "almendra", name: "Tarta de almendra", cat: "Tartas y porciones", price: 4.5, whole: { price: 30, serves: 8 }, desc: "Sin harina de trigo: almendra marcona, huevo y limón.", allergens: ["huevo", "frutos-cascara"], tags: ["sin gluten"] },
  { id: "limon", name: "Bizcocho de aceite y limón", cat: "Tartas y porciones", price: 3.2, whole: { price: 18, serves: 10 }, desc: "Con aceite de oliva del Bajo Aragón. Sin lácteos.", allergens: ["gluten", "huevo"], tags: ["sin lactosa"] },
  { id: "huesos", name: "Huesos de santo (caja de 6)", cat: "Dulces de temporada", price: 9.5, desc: "Mazapán relleno de yema. Solo hasta el 2 de noviembre.", allergens: ["huevo", "frutos-cascara"], tags: ["temporada"], season: "Todos los Santos" },
  { id: "bunuelos", name: "Buñuelos de viento (docena)", cat: "Dulces de temporada", price: 8.4, desc: "Rellenos de crema, nata o trufa. Hasta el 2 de noviembre.", allergens: ["gluten", "huevo", "leche"], tags: ["temporada"], season: "Todos los Santos" },
  { id: "cafe", name: "Café de especialidad", cat: "Café y bebidas", price: 1.6, desc: "Tueste medio de Huesca. Solo, cortado o con leche (+0,30 € avena).", allergens: [], tags: ["vegano si lo pides con avena"] },
  { id: "chocolate-taza", name: "Chocolate a la taza", cat: "Café y bebidas", price: 2.8, desc: "Espeso, con cacao al 60 %. Con churros, +2,20 €.", allergens: ["leche"] },
  { id: "zumo", name: "Zumo de naranja natural", cat: "Café y bebidas", price: 2.9, desc: "Recién exprimido.", allergens: [] },
];

export const CATEGORIES = ["Bollería", "Panes", "Tartas y porciones", "Dulces de temporada", "Café y bebidas"] as const;

/** La carta para `MenuList` (mismo orden y precios que la vitrina). */
export function menuSections(opts: { exclude?: Product["cat"][] } = {}): MenuSection[] {
  const NOTES: Record<string, string> = {
    Bollería: "Del horno, cada mañana desde las 6:00",
    Panes: "Masa madre propia; pregunta por el pan del día",
    "Tartas y porciones": "Por porción en tienda; enteras por encargo",
    "Dulces de temporada": "Hasta el 2 de noviembre",
    "Café y bebidas": "Leche entera, sin lactosa o avena",
  };
  return CATEGORIES.filter((c) => !opts.exclude?.includes(c)).map((c) => ({
    id: c,
    title: c,
    note: NOTES[c],
    items: PRODUCTS.filter((p) => p.cat === c).map((p) => ({ id: p.id, name: p.name, description: p.desc, price: p.price, priceNote: p.whole ? `Entera (${p.whole.serves} raciones) ${p.whole.price.toFixed(2).replace(".", ",")} €` : undefined, allergens: p.allergens as never, tags: p.tags, soldOut: p.soldOut })),
  }));
}

/* ---------- tartas por encargo ---------- */
export type CakeOption = { value: string; label: string; price: number; color?: string; note?: string; allergens?: string[] };

export const CAKE = {
  /** antelación mínima en días (el obrador planifica con 48 h) */
  leadDays: 2,
  sizes: [
    { value: "6", label: "6 raciones · 16 cm", price: 28 },
    { value: "10", label: "10 raciones · 20 cm", price: 38 },
    { value: "16", label: "16 raciones · 24 cm", price: 54 },
    { value: "24", label: "24 raciones · 2 pisos", price: 85 },
    { value: "40", label: "40 raciones · 3 pisos", price: 140, note: "con 7 días de antelación" },
  ] as CakeOption[],
  sponges: [
    { value: "vainilla", label: "Vainilla de Madagascar", price: 0, color: "#f1dcae", allergens: ["gluten", "huevo", "leche"] },
    { value: "chocolate", label: "Chocolate negro", price: 2, color: "#5a3424", allergens: ["gluten", "huevo", "leche", "soja"] },
    { value: "redvelvet", label: "Red velvet", price: 3, color: "#a3313a", allergens: ["gluten", "huevo", "leche"] },
    { value: "zanahoria", label: "Zanahoria y nueces", price: 3, color: "#c98a4b", allergens: ["gluten", "huevo", "frutos-cascara"] },
    { value: "almendra", label: "Almendra (sin gluten)", price: 4, color: "#e6c896", allergens: ["huevo", "frutos-cascara"] },
  ] as CakeOption[],
  fillings: [
    { value: "pastelera", label: "Crema pastelera", price: 0, color: "#f4d27a", allergens: ["huevo", "leche"] },
    { value: "frambuesa", label: "Frambuesa", price: 3, color: "#c8324f" },
    { value: "trufa", label: "Trufa", price: 3, color: "#3d2318", allergens: ["leche", "soja"] },
    { value: "dulce-leche", label: "Dulce de leche", price: 2, color: "#b9783d", allergens: ["leche"] },
    { value: "limon", label: "Crema de limón", price: 2, color: "#f2e27a", allergens: ["huevo", "leche"] },
  ] as CakeOption[],
  coverings: [
    { value: "desnuda", label: "Desnuda (naked)", price: 0, color: "", note: "se ven las capas" },
    { value: "nata", label: "Nata montada", price: 0, color: "#fbf6ee", allergens: ["leche"] },
    { value: "buttercream", label: "Buttercream rosa", price: 4, color: "#efc2c8", allergens: ["leche"] },
    { value: "ganache", label: "Ganache de chocolate", price: 5, color: "#3a2118", allergens: ["leche", "soja"] },
    { value: "pistacho", label: "Crema de pistacho", price: 6, color: "#b9c98a", allergens: ["leche", "frutos-cascara"] },
  ] as CakeOption[],
  toppings: [
    { value: "frutos-rojos", label: "Frutos rojos", price: 4 },
    { value: "flores", label: "Flores comestibles", price: 6 },
    { value: "velas", label: "Velas", price: 0 },
    { value: "mensaje", label: "Mensaje escrito", price: 2 },
  ] as CakeOption[],
  /** franjas de recogida en tienda */
  pickup: ["09:00", "10:30", "12:00", "13:30", "18:00", "19:30"],
};

export function cakePrice(sel: { size: string; sponge: string; filling: string; covering: string; toppings: string[] }) {
  const pick = (list: CakeOption[], v: string) => list.find((o) => o.value === v)?.price ?? 0;
  const size = CAKE.sizes.find((s) => s.value === sel.size) ?? CAKE.sizes[0];
  const k = Number(size.value) / 10; // los extras escalan con el tamaño
  const extras = pick(CAKE.sponges, sel.sponge) + pick(CAKE.fillings, sel.filling) + pick(CAKE.coverings, sel.covering) + sel.toppings.reduce((n, t) => n + pick(CAKE.toppings, t), 0);
  return Math.round(size.price + extras * Math.max(1, k));
}

export function cakeAllergens(sel: { sponge: string; filling: string; covering: string }) {
  const all = [CAKE.sponges, CAKE.fillings, CAKE.coverings].flatMap((list, i) => list.find((o) => o.value === [sel.sponge, sel.filling, sel.covering][i])?.allergens ?? []);
  return [...new Set(all)];
}

/** Huecos de recogida de un día (en una demo: lo que «queda» varía con la fecha para que se vea el estado). */
export function pickupSlots(date: string) {
  const d = Number(date.slice(8));
  const sat = new Date(`${date}T12:00:00`).getDay() === 6;
  return CAKE.pickup.filter((t) => !(sat && t >= "18:00")).map((time, i) => ({ time, disabled: (d * 3 + i) % 5 === 0, note: (d + i) % 4 === 0 ? "último" : undefined }));
}

/* ---------- confianza ---------- */
export const REVIEWS = [
  { quote: "La tarta de queso es la mejor de Zaragoza y no exagero. Encargamos la del cumpleaños por WhatsApp y estaba lista a la hora.", name: "Marta G.", role: "Reseña de Google · septiembre 2026", rating: 5 },
  { quote: "Croissant de verdad, de los que dejan migas en el jersey. El café también está muy bien.", name: "Javier L.", role: "Reseña de Google · octubre 2026", rating: 5 },
  { quote: "Hicieron la tarta de la boda de tres pisos sin gluten y nadie lo notó. Atentas a cada detalle.", name: "Lucía y Pablo", role: "Boda en junio de 2026", rating: 5 },
  { quote: "Vamos cada sábado a por la hogaza. Si llegas después de las doce ya no queda, así que madruga.", name: "Andrés P.", role: "Reseña de Google · agosto 2026", rating: 5 },
  { quote: "Muy rica la caracola de canela. El local de Delicias es pequeño y a media mañana hay que esperar un poco.", name: "Elena R.", role: "Reseña de Google · octubre 2026", rating: 4 },
  { quote: "Los huesos de santo como los de antes. Caros, pero lo valen.", name: "Carmen V.", role: "Reseña de Google · noviembre 2025", rating: 4 },
  { quote: "Nos prepararon la mesa dulce del bautizo con dos días de margen. Repetiremos.", name: "Familia Sanz", role: "Encargo en mayo de 2026", rating: 5 },
  { quote: "Buen pan, pero el sábado por la tarde la napolitana estaba algo seca. Por la mañana, otra cosa.", name: "Raúl M.", role: "Reseña de Google · julio 2026", rating: 3 },
];

/** Reparto de las reseñas de Google por estrellas (suma `BRAND.rating.count`). */
export const RATING_DISTRIBUTION = "5:528, 4:84, 3:19, 2:6, 1:5";

export const FAQ = [
  { q: "¿Con cuánta antelación tengo que encargar una tarta?", a: "Con 48 horas para tartas de hasta 24 raciones y con 7 días para las de pisos. Si lo necesitas antes, llámanos: muchas veces hay hueco." },
  { q: "¿Tenéis opciones sin gluten o sin lactosa?", a: "Sí: tarta de almendra y bizcocho de almendra sin gluten, y bizcocho de aceite sin lactosa. Todo se hace en un obrador donde se manipulan los 14 alérgenos, así que no podemos garantizar la ausencia de trazas." },
  { q: "¿Puedo pagar al recoger?", a: "Sí. Los encargos de más de 60 € llevan una señal del 30 % que se descuenta al recoger; se devuelve si cancelas con 48 horas." },
  { q: "¿Hacéis envíos?", a: "Solo tartas, en Zaragoza capital, con un recargo de 8 €. La bollería y el pan, mejor recién salidos en tienda." },
];

/* ---------- legales y datos estructurados ---------- */
export const LEGAL = [
  { label: "Aviso legal", href: "#legal" },
  { label: "Privacidad", href: "#privacidad" },
  { label: "Cookies", href: "#cookies" },
  { label: "Accesibilidad", href: "#accesibilidad" },
  { label: "Alérgenos", href: "#alergenos" },
];

/** JSON-LD `Bakery` con las dos tiendas (horario de schema.org salido del mismo texto que pinta `OpeningHours`). */
export function bakeryJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@graph": STORES.map((s) => ({
      "@type": "Bakery",
      "@id": `${url}#${s.id}`,
      name: s.name,
      url,
      telephone: BRAND.phone,
      servesCuisine: "Pastelería y panadería",
      priceRange: "€",
      address: { "@type": "PostalAddress", streetAddress: s.address.split(",")[0], postalCode: s.address.match(/\d{5}/)?.[0], addressLocality: BRAND.city, addressCountry: "ES" },
      openingHoursSpecification: openingHoursSchema(s.hours, s.exceptions),
      aggregateRating: { "@type": "AggregateRating", ratingValue: BRAND.rating.value, reviewCount: BRAND.rating.count },
      acceptsReservations: false,
    })),
  };
}
