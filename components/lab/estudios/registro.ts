/*
 * Réplicas de las webs estudiadas por sector (docs/50 §2 E13): cada una reproduce la estructura, el tono y la estética de
 * su referencia con piezas del kit, con una marca inventada y textos propios. Solo en local (/lab).
 */

export type Replica = {
  slug: string;
  /** marca inventada de la réplica */
  nombre: string;
  /** web de referencia y su ficha en docs/50 */
  ref: string;
  url: string;
  ficha: string;
  sector: "peluquería" | "gimnasio" | "academia" | "producto" | "agencia";
  /** lo que la hace reconocible, en una línea */
  firma: string;
  hecha: boolean;
};

export const REPLICAS: Replica[] = [
  { slug: "matiz", nombre: "Matiz", ref: "Il Colorista", url: "https://ilcolorista.salon/", ficha: "§3.1", sector: "peluquería", firma: "mosaico de formas salmón con fotos que se disuelven en color", hecha: true },
  { slug: "nura", nombre: "Nura", ref: "ALICE Hair & Art", url: "https://www.alicehairart.se/", ficha: "§3.2", sector: "peluquería", firma: "collage suelto que se desenfoca y una sola letra en mayúsculas", hecha: true },
  { slug: "cita", nombre: "Cita Barbers", ref: "Rendezvous", url: "https://www.myrendezvous.ca/", ficha: "§3.2", sector: "peluquería", firma: "naranja, serif con cursiva y palabras gigantes", hecha: true },
  { slug: "melena", nombre: "Melena", ref: "Hair Me Up", url: "https://hairmeup.pl", ficha: "§3.2", sector: "peluquería", firma: "arco melocotón y palabras de fondo; salón, tienda y academia", hecha: true },
  { slug: "raiz", nombre: "Raíz", ref: "Marco Ambrosi", url: "https://www.marcoambrosi.salon/", ficha: "§3.2", sector: "peluquería", firma: "oscuro y cobre, antes y después", hecha: true },
  { slug: "patron", nombre: "Patrón", ref: "Don Barber & Groom", url: "https://don-barber.gr/en", ficha: "§3.2", sector: "peluquería", firma: "gótica condensada, cinta y la familia", hecha: false },
  { slug: "nucleo", nombre: "Núcleo", ref: "Core Atelier Pilates", url: "https://coreatelierpilates.com/", ficha: "§3.4", sector: "gimnasio", firma: "acordeón de aparatos con la foto fija", hecha: false },
  { slug: "impulso", nombre: "Impulso", ref: "Essor Fitness", url: "https://coachsportifecublens.com/", ficha: "§3.4", sector: "gimnasio", firma: "negro absoluto y titular a todo el ancho", hecha: false },
  { slug: "vive", nombre: "Vive", ref: "FIT AND YOU", url: "https://fit-and-you.webflow.io/", ficha: "§3.4", sector: "gimnasio", firma: "condensada naranja, damero y tarjetas ladeadas", hecha: false },
  { slug: "talla", nombre: "Talla", ref: "Skulpt Fitness", url: "https://www.skulptfitness.nl", ficha: "§3.4", sector: "gimnasio", firma: "lima, bordes curvos y menú en columnas verticales", hecha: false },
  { slug: "lobo", nombre: "Lobo", ref: "Fenriz Gym", url: "https://www.fenriz-gym.com/", ficha: "§3.4", sector: "gimnasio", firma: "B/N con un degradado de marca", hecha: false },
  { slug: "remada", nombre: "Remada", ref: "Surfing Academy", url: "https://surfing.academy/", ficha: "§3.6", sector: "academia", firma: "minúsculas, ilustración de línea y viajes por convocatoria", hecha: false },
  { slug: "ahora", nombre: "Ahora", ref: "Future London Academy", url: "https://futurelondonacademy.co.uk/", ficha: "§3.6", sector: "academia", firma: "amarillo, muro de profesores y tarjetas solapadas", hecha: false },
  { slug: "oficio", nombre: "Oficio", ref: "Honhar", url: "https://honhar.in/", ficha: "§3.6", sector: "academia", firma: "neobrutalismo amarillo y programas por promoción", hecha: false },
  { slug: "abuela-rosa", nombre: "Abuela Rosa", ref: "Peppa Sauce", url: "https://www.peppasauce.love/", ficha: "§3.8", sector: "producto", firma: "el bote fijo y dos tintas", hecha: false },
  { slug: "q47", nombre: "Q47", ref: "K72", url: "https://k72.ca/en", ficha: "§3.9", sector: "agencia", firma: "menú de filas con marquesina y transición en escalera", hecha: false },
];

export const replica = (slug: string) => REPLICAS.find((r) => r.slug === slug);
