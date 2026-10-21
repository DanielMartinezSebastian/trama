/** Quilate — taller de joyería en Valencia (ficticio). La casa se cuenta solo con sus servicios y su filosofía, nunca con su
 * historia (docs/19 §4): siete capítulos-servicio, cada uno con su luz (§5). Datos puros. */
import type { LightPresetName } from "@/lib/ui/light";
import { openingHoursSchema } from "@/lib/ui/hours";
import type { RingLook } from "./ringScene";

export const SLUG = "quilate";

export const meta = {
  slug: SLUG,
  name: "Quilate",
  title: "Quilate · taller de joyería",
  blurb:
    "Taller de joyería contado solo con sus servicios: siete capítulos (escuchar, elegir, dar forma, ajustar, cuidar, transformar, heredar) con un anillo 3D procedural que cambia de estado y una luz que cambia de finalidad en cada uno (LightScroll: vitrina, fuego, luz de día honesta, rasante, lámpara). Configurador de alianza (metal, ancho, perfil, acabado, grabado con luz rasante) y de solitario por pasos (montura, piedra con conmutador de luz, quilates, metal, pavé, talla), con precio desglosado y plazo; medidor de talla en pantalla, servicios del taller con antes/después (BeforeAfter) y cita que se lleva la pieza diseñada.",
  accent: "#c9a46a",
  tag: "joyería · luz · 3D",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "alianzas", title: "Alianzas" },
  { path: "compromiso", title: "Compromiso" },
  { path: "taller", title: "Taller" },
  { path: "talla", title: "Tu talla" },
  { path: "cita", title: "Cita" },
];

export const BRAND = {
  name: "Quilate",
  legal: "Quilate Taller de Joyería S. L. (empresa ficticia de demostración)",
  city: "Valencia",
  address: "Calle del Contraste 7, 46003 Valencia",
  zone: "Ciutat Vella, a 4 min del Mercado Central",
  map: "https://www.openstreetmap.org/search?query=Mercado%20Central%20Valencia",
  phone: "+34 960 000 000",
  phoneHref: "tel:+34960000000",
  whatsapp: "+34 600 000 000",
  whatsappHref: "https://wa.me/34600000000?text=Hola%2C%20quer%C3%ADa%20pedir%20cita%20en%20el%20taller",
  email: "taller@quilate.example",
  // punzón de identificación del fabricante (Ley 17/1985 de objetos fabricados con metales preciosos; registro de ejemplo)
  hallmark: "QLT · V-0000 (punzón de ejemplo)",
  rating: { value: 4.9, count: 318, source: "Google" },
  hours: "L-V|10:00-14:00 17:00-20:30\nS|10:30-14:00\nD|cerrado",
  exceptions: "2026-11-01|Todos los Santos\n2026-12-08|Inmaculada\n2026-12-24|Nochebuena|10:00-14:00\n2026-12-25|Navidad\n2027-01-01|Año Nuevo\n2027-01-06|Reyes",
};

export type Chapter = {
  id: string;
  k: string;
  /** el servicio */
  title: string;
  /** la frase-tesis: el porqué (Sinek), con el cliente como sujeto (StoryBrand) */
  thesis: string;
  /** el cómo: lo que normalmente no se ve del taller (cruzar la línea de visibilidad, Shostack) */
  how: string;
  /** el qué: el servicio concreto, con su dato */
  what: string;
  cta: { label: string; href: string };
  light: LightPresetName;
  /** para qué es esa luz (se enseña en el rótulo de luz) */
  why: string;
  look: RingLook;
  framing?: "ring" | "head";
  /** el interludio que sigue al capítulo: sus dos cintas, sin cuadro, mientras el anillo pasa al plano siguiente */
  interlude: Ribbons;
};

/**
 * Dos cintas de texto en letra gruesa que corren de lado por el escenario, en sentidos contrarios, durante un interludio
 * (nunca a la vez que un cuadro): `back` va detrás del lienzo 3D (el anillo pasa por delante) y `front` delante (el anillo
 * pasa por detrás). Siempre van en pareja y a alturas fijas (arriba y abajo; `flip` las intercambia), así que nunca se pisan.
 */
export type Ribbons = { back: string; front: string; flip?: boolean };

export const CHAPTERS: Chapter[] = [
  {
    id: "escuchar",
    k: "01",
    title: "Escuchar",
    thesis: "El primer boceto sale de una conversación.",
    how: "Una mesa, un cuaderno y una hora sin prisa. Nos cuentas para quién es, cómo vive con las manos, qué guarda en un cajón. De ahí sale el primer trazo del anillo, no de un catálogo.",
    what: "Cita de 60 minutos en el taller o por videollamada. Sin compromiso y sin coste.",
    cta: { label: "Pedir cita", href: "cita" },
    light: "lampara",
    why: "lámpara cálida y baja · 2600 K · para conversar",
    look: "boceto",
    interlude: { back: "Una mesa · un cuaderno · una hora", front: "Para quién es · cómo vive con las manos" },
  },
  {
    id: "elegir",
    k: "02",
    title: "Elegir",
    thesis: "El brillo lo decide la talla, no el tamaño.",
    how: "Un brillante tiene 57 facetas. Bien proporcionadas, la luz que entra por arriba rebota dentro y sale hacia ti abierta en colores: es el fuego. Mal talladas, se escapa por abajo. Te enseñamos cada piedra con un foco, que saca ese fuego, y con luz de día, que no perdona el color.",
    what: "Diamantes naturales y de laboratorio con certificado (GIA o IGI); zafiros, rubíes y esmeraldas con origen y tratamiento declarados.",
    cta: { label: "Ver piedras en el configurador", href: "compromiso" },
    light: "fuego",
    why: "foco duro que sigue al puntero · 4800 K · para ver el fuego",
    look: "gema",
    framing: "head",
    interlude: { back: "Diamante · zafiro · esmeralda", front: "Origen y tratamiento, por escrito" },
  },
  {
    id: "forma",
    k: "03",
    title: "Dar forma",
    thesis: "Un solitario son tres piezas hechas a mano.",
    how: "El aro y la montura se tallan en cera y se funden en oro o platino por separado; luego se sueldan, se liman y la piedra se engasta al final, garra a garra. Cada paso se puede ver: te mandamos fotos del banco.",
    what: "Alianzas en 12 días laborables; solitarios en 4 a 6 semanas. El plazo se dice antes de encargar, no después.",
    cta: { label: "Diseñar una alianza", href: "alianzas" },
    light: "taller",
    why: "flexo cenital neutro · 4200 K · para trabajar",
    look: "final",
    interlude: { back: "Cera · fundición · lima · pulido", front: "Engaste garra a garra" },
  },
  {
    id: "ajustar",
    k: "04",
    title: "Ajustar",
    thesis: "Por dentro: tu talla, tu grabado y nuestra firma.",
    how: "Medimos el dedo a la temperatura del día, ajustamos la talla en el banco y grabamos por dentro a buril. Con luz rasante se lee el grabado y el punzón de la casa, que firma cada pieza.",
    what: "Ajuste de talla gratis el primer año. El primer grabado, gratis. Mide tu talla en pantalla si no puedes venir.",
    cta: { label: "Medir mi talla", href: "talla" },
    light: "rasante",
    why: "luz rasante a 8° · 4000 K · para leer un grabado",
    look: "final",
    interlude: { back: "Grabado a buril · el punzón de la casa", front: "Medimos el dedo a la temperatura del día", flip: true },
  },
  {
    id: "cuidar",
    k: "05",
    title: "Cuidar",
    thesis: "Una piedra sucia no brilla: la luz no entra.",
    how: "La grasa de la piel tapa la parte de abajo de la piedra y la luz ya no rebota dentro. Limpiamos con ultrasonidos, revisamos garras y cierres, y repulimos. Lo comparas con la misma luz antes y después: pulsa «Limpiar la pieza».",
    what: "Limpieza y revisión de por vida para todo lo que sale del taller, en 20 minutos mientras esperas.",
    cta: { label: "Ver el taller", href: "taller" },
    light: "honesta",
    why: "luz de día difusa · 6500 K · la misma antes y después",
    look: "apagado",
    interlude: { back: "Ultrasonidos · garras · cierres", front: "Lo que sale de aquí vuelve aquí" },
  },
  {
    id: "transformar",
    k: "06",
    title: "Transformar",
    thesis: "La piedra de tu abuela, en un bisel de hoy.",
    how: "Desmontamos la pieza, recuperamos las piedras y refinamos el oro. Aquí, la piedra de un anillo antiguo pasa a un bisel en oro rosa: un aro de metal que la rodea entera y la protege para llevarla a diario.",
    what: "Boceto gratis. Te decimos cuánto oro aprovechamos y qué cuesta antes de tocar nada.",
    cta: { label: "Traer una pieza", href: "cita?motivo=transformar" },
    light: "memoria",
    why: "cálida y suave · 3100 K · la luz de una casa",
    look: "final",
    interlude: { back: "Desmontar · recuperar · refinar", front: "La piedra de antes, en un anillo de hoy" },
  },
  {
    id: "heredar",
    k: "07",
    title: "Heredar",
    thesis: "Cada pieza sale con su ficha, y la ficha viaja con ella.",
    how: "Cada pieza tiene una ficha en el archivo del taller: el boceto, la piedra con su certificado, el peso del metal, la ley, el punzón y la fecha. La ficha viaja con la joya, de mano en mano.",
    what: "Garantía transmisible y ficha de archivo con QR en el estuche.",
    cta: { label: "Pedir cita", href: "cita" },
    light: "vitrina",
    why: "foco de vitrina con destellos · 3600 K · para emocionar",
    look: "final",
    interlude: { back: "Boceto · certificado · ley · punzón · fecha", front: "De mano en mano" },
  },
];

export type Service = { id: string; title: string; price: string; time: string; text: string; light: LightPresetName };

export const SERVICES: Service[] = [
  { id: "talla", title: "Ajuste de talla", price: "gratis el primer año · después desde 25 €", time: "3 a 5 días", text: "Agrandar o reducir hasta tres tallas sin tocar el grabado. En anillos con piedras alrededor del aro, te decimos antes si se puede.", light: "taller" },
  { id: "grabado", title: "Grabado a buril", price: "el primero gratis · después 18 €", time: "2 días", text: "Por dentro o por fuera, a mano. Hasta 24 caracteres; fechas, iniciales o una frase corta. Te enseñamos la prueba antes.", light: "rasante" },
  { id: "limpieza", title: "Limpieza y revisión", price: "de por vida en piezas del taller · otras, 15 €", time: "20 minutos", text: "Ultrasonidos, vapor, revisión de garras y cierres y repulido. Te avisamos si una garra está gastada antes de que se pierda una piedra.", light: "honesta" },
  { id: "reparacion", title: "Reparación", price: "presupuesto gratis en 48 h · desde 20 €", time: "según pieza", text: "Cadenas, cierres, garras, piedras sueltas, soldaduras y rodiado de oro blanco. Reparamos piezas de cualquier casa.", light: "taller" },
  { id: "transformar", title: "Transformar joyas heredadas", price: "boceto gratis · hechura desde 180 €", time: "3 a 6 semanas", text: "Rediseñamos con tu oro y tus piedras. Pesamos el oro delante de ti y te damos un recibo.", light: "memoria" },
  { id: "tasacion", title: "Tasación con informe", price: "45 € por pieza", time: "en el momento", text: "Para seguros, herencias o reparto de bienes: metal, ley, piedras y valor de reposición, con fotos.", light: "lupa" },
];

/** Una ficha de archivo de ejemplo (capítulo «Heredar» y página del taller). */
export const ARCHIVE_SAMPLE =
  "Pieza|Solitario «Clara», oro blanco de 18 k\nPiedra|Diamante natural 0,70 ct, brillante, color F, pureza VS1\nCertificado|GIA nº 0000000000 (ejemplo)\nMetal|3,9 g de oro de 750 milésimas\nContraste y punzón|750 · QLT · V-0000\nTaller|boceto 14-03, cera 21-03, engaste 02-04\nEntrega|09-04, talla 13";

export const FAQ =
  "¿Cuánto tarda una pieza a medida?|Una alianza, 12 días laborables; un solitario, de 4 a 6 semanas. Si tienes una fecha, dínosla en la cita y te decimos si llegamos.\n¿Puedo ver la piedra antes de encargar?|Sí, y te lo recomendamos: en la cita te la enseñamos con varias luces y con su certificado. Si la eliges en la web, la reservamos 7 días para que vengas a verla.\n¿Y si me equivoco de talla?|El ajuste es gratis durante el primer año. Si no sabes tu talla, mídela en pantalla o te mandamos un medidor de plástico a casa.\n¿Se puede devolver una pieza hecha a medida?|Las piezas a medida o grabadas no entran en el desistimiento de 14 días (son bienes personalizados); por eso te enseñamos el boceto y el render antes de empezar. Las piezas de la vitrina sí se pueden devolver.\n¿Puedo pagar a plazos?|Sí: señal del 30 % al aprobar el boceto y el resto a la entrega, o financiación de 3 a 12 meses sin intereses con la entidad de la tienda (demo: no se cobra nada).\n¿Qué es el punzón?|La marca grabada que identifica al fabricante, junto a la contrastación de la ley del metal (750 en oro de 18 k, 950 en platino). Lo pide la ley española de metales preciosos.";

export const REVIEWS =
  "Nos sentamos una hora con un boceto en blanco y salimos con el anillo dibujado. Llegó en el plazo que nos dijeron, ni un día más.|Lucía M.|Solitario de compromiso|5\nLlevé las alianzas de mis padres y ahora son un solo anillo con su diamante. Me pesaron el oro delante.|Javier R.|Transformación de una herencia|5\nMe ajustaron la talla en tres días y me limpiaron un collar que ni era suyo. Sin cobrarme la limpieza.|Carmen S.|Ajuste y limpieza|5";

export const LEGAL = [
  { label: "Aviso legal", href: "#legal" },
  { label: "Privacidad", href: "#privacidad" },
  { label: "Condiciones de encargo", href: "#condiciones" },
];

/** Motivos de la cita (se pueden pasar con `?motivo=`). */
export const REASONS = [
  { value: "compromiso", label: "Anillo de compromiso" },
  { value: "alianzas", label: "Alianzas" },
  { value: "transformar", label: "Transformar una herencia" },
  { value: "reparacion", label: "Reparación o ajuste" },
  { value: "tasacion", label: "Tasación" },
];

/** Huecos de cita: mañana y tarde según el horario; los sábados solo mañana. */
export function appointmentSlots(date: string) {
  const d = new Date(`${date}T12:00:00`);
  const dow = d.getDay();
  const morning = ["10:00", "11:15", "12:30"];
  const evening = ["17:00", "18:15", "19:30"];
  const base = dow === 6 ? morning : [...morning, ...evening];
  // ocupación de ejemplo, estable por fecha
  const seed = Number(date.replace(/-/g, "")) % 7;
  return base.map((time, i) => ({ time, disabled: (i + seed) % 5 === 0, note: (i + seed) % 5 === 0 ? "ocupado" : undefined }));
}

export function jewelryJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${url}#taller`,
    name: BRAND.name,
    url,
    telephone: BRAND.phone,
    priceRange: "€€€",
    address: { "@type": "PostalAddress", streetAddress: BRAND.address.split(",")[0], postalCode: "46003", addressLocality: BRAND.city, addressCountry: "ES" },
    openingHoursSpecification: openingHoursSchema(BRAND.hours, BRAND.exceptions),
    aggregateRating: { "@type": "AggregateRating", ratingValue: BRAND.rating.value, reviewCount: BRAND.rating.count },
    makesOffer: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
  };
}
