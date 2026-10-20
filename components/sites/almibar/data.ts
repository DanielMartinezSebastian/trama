/**
 * Almíbar · versión 1 «Obrador editorial» (relato de procedencia, movimiento nivel 1–2). El contenido del negocio (tiendas,
 * horario, carta, tartas) es común a las tres versiones y vive en `lib/sites/almibar.ts`; aquí solo lo propio de esta web.
 * Datos puros.
 */
export const SLUG = "almibar";

export const meta = {
  slug: SLUG,
  name: "Almíbar",
  title: "Almíbar · pastelería de obrador",
  blurb:
    "Pastelería de barrio con la fórmula «Obrador editorial» (relato de procedencia, nivel de movimiento 1–2): crema, tinta y frambuesa, serif grande, foto y vídeo del obrador a sangre. Resuelve lo que pide el sector: horario con estado «abierto ahora» en cada tienda, carta en HTML con los 14 alérgenos y filtro «sin…», pedido para recoger y tarta por encargo en UNA página cada uno (tienda, día con atajos «Hoy · Mañana», hora, nombre y teléfono; pago al recoger; precio y alérgenos en vivo, 48 h de antelación, señal del 30 %), reseñas con resumen y slider, transición de página en barrido frambuesa, barra de acciones en móvil y JSON-LD Bakery. Usa OpeningHours, MenuList, DatePicker (shortcuts), ActionBar, PageTransition, SplitText, ImageReveal, Timeline, OptionPicker, CartDrawer, TestimonialSection, FAQSection y CookieBanner.",
  accent: "#c2415d",
  tag: "pastelería · obrador",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "carta", title: "Carta" },
  { path: "tienda", title: "Pedir para recoger" },
  { path: "pedido", title: "Tu pedido" },
  { path: "encargos", title: "Tartas por encargo" },
  { path: "obrador", title: "El obrador" },
  { path: "tiendas", title: "Tiendas y horario" },
];

/** Navegación principal (la acción «Encargar» va aparte, como botón). */
export const NAV = [
  { label: "Carta", path: "carta" },
  { label: "Pedir para recoger", path: "tienda" },
  { label: "Encargos", path: "encargos" },
  { label: "El obrador", path: "obrador" },
  { label: "Tiendas", path: "tiendas" },
];

/** Foto de cada producto de la vitrina (solo los que tienen una que encaje; el resto lleva una ficha tipográfica). */
export const PRODUCT_PHOTO: Record<string, { topic: "pasteleria" | "gastronomia"; i: number; alt: string }> = {
  croissant: { topic: "pasteleria", i: 3, alt: "Croissant sobre papel blanco junto a una taza de café y una onza de chocolate" },
  hogaza: { topic: "pasteleria", i: 0, alt: "Vitrina de panadería con hogazas y panes rústicos con su precio" },
  barra: { topic: "gastronomia", i: 1, alt: "Panes recién horneados sobre una mesa" },
  queso: { topic: "pasteleria", i: 11, alt: "Porción de tarta en un plato junto a un café con leche en una mesa de madera" },
  chocolate: { topic: "pasteleria", i: 1, alt: "Porción de tarta de chocolate con una fresa encima" },
  almendra: { topic: "pasteleria", i: 9, alt: "Tartaletas sobre una tabla de madera con fruta alrededor" },
  bunuelos: { topic: "pasteleria", i: 4, alt: "Pastas redondas rellenas de chocolate en una bandeja" },
  "chocolate-taza": { topic: "pasteleria", i: 2, alt: "Taza de café con leche y galletas sobre un libro abierto" },
};

export const PROVENANCE =
  "Harina de Aragón|Trigo de secano de los Monegros, molido en piedra en un molino de Huesca. Sin mejorantes.\n" +
  "Mantequilla de verdad|De vacas de Soria, con un 82 % de grasa: la que hace que el hojaldre suba y cruja.\n" +
  "27 capas, a mano|Laminamos la masa tres veces y la dejamos reposar en frío toda la noche.\n" +
  "Horno a las 6:00|Lo que ves en la vitrina a las 7:30 salió del horno hace una hora. Lo que sobra se dona a las 20:30.";

export const VALUES = [
  { t: "Lo de hoy, hoy", d: "Nada de congelados ni de bollería industrial. Lo que no se vende, se dona cada noche al comedor social del barrio." },
  { t: "Producto de cerca", d: "Harina de Huesca, huevos de Ejea, fruta del mercado de abastos y aceite del Bajo Aragón." },
  { t: "Recetas de la casa", d: "La tarta de queso es la de Carmen, la fundadora, desde 1987. No la hemos cambiado." },
];

export const TEAM = "Carmen Lahoz|Fundadora · pastelera desde 1987\nNacho Lahoz|Obrador · bollería y masas madre\nIrene Sanz|Tartas por encargo y bodas\nAdrián Mur|Tienda Delicias · café";

export const HISTORY =
  "1987|Carmen abre un obrador de doce metros en el Casco Histórico con un horno de leña de segunda mano.\n" +
  "1999|Llega la tarta de queso. Diez años después sigue siendo lo más pedido.\n" +
  "2014|Nacho se une al obrador y recupera la masa madre que usaba su abuela.\n" +
  "2021|Abrimos Delicias, junto al tranvía, para que el pan llegue al otro lado de la ciudad.\n" +
  "2026|Encargos por WhatsApp y pedido para recoger: lo pides por la noche y lo recoges caliente.";

/** Palabra de la ficha tipográfica de los productos sin foto. */
export const TILE: Record<string, string> = { napolitana: "Chocolate", caracola: "Canela", ensaimada: "Ensaimada", centeno: "Centeno", zanahoria: "Zanahoria", limon: "Limón", huesos: "Mazapán" };
