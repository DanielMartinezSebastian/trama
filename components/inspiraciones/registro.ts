/*
 * Inspiraciones (docs/55): webs premiadas estudiadas en el laboratorio y rehechas con piezas del kit, con marca inventada,
 * textos propios e imágenes generadas para su tema. Cada una sigue una guía de estilo (`guia`, id de STYLE_GUIDES) y se
 * publica en /inspiraciones/<slug> (grupo «Inspiraciones» de /demos). En /lab/estudios/<slug> se sigue midiendo el par
 * contra la web original (docs/53).
 */

import { PAGINAS as citaPaginas } from "./cita/data";
import { PAGINAS as matizPaginas } from "./matiz/data";
import { PAGINAS as patronPaginas } from "./patron/data";
import { PAGINAS as melenaPaginas } from "./melena/data";
import { PAGINAS as raizPaginas } from "./raiz/data";
import { PAGINAS as nuraPaginas } from "./nura/data";
import { PAGINAS as nucleoPaginas } from "./nucleo/data";
import { PAGINAS as impulsoPaginas } from "./impulso/data";
import { PAGINAS as vivePaginas } from "./vive/data";
import { PAGINAS as tallaPaginas } from "./talla/data";
import { PAGINAS as loboPaginas } from "./lobo/data";
import { PAGINAS as remadaPaginas } from "./remada/data";
import { PAGINAS as ahoraPaginas } from "./ahora/data";
import { PAGINAS as oficioPaginas } from "./oficio/data";

export type Replica = {
  slug: string;
  /** marca inventada de la réplica */
  nombre: string;
  /** web de referencia y su ficha en docs/50 */
  ref: string;
  url: string;
  ficha: string;
  sector: "peluquería" | "gimnasio" | "academia" | "producto" | "agencia" | "estudio creativo";
  /** lo que la hace reconocible, en una línea */
  firma: string;
  hecha: boolean;
  /** guía de estilo que sigue (id de STYLE_GUIDES) */
  guia: string;
  /** color de acento para su tarjeta en /demos */
  acento: string;
  /** páginas internas, además de la portada (docs/56): `/inspiraciones/<slug>/<path>` */
  paginas?: { path: string; titulo: string }[];
  /** sensación del scroll suave (docs/42); sin ella, scroll nativo (las anclas se animan igual) */
  scroll?: "cinematic" | "editorial" | "snappy" | "nativo";
  /** transición entre sus páginas (`PageTransition kind`) */
  transicion?: "fade" | "slide" | "wipe" | "scan" | "stack" | "blinds" | "stairs" | "iris";
};

/** todas las páginas de una inspiración, portada incluida */
export const rutasDe = (r: Replica) => [{ path: "", titulo: r.nombre }, ...(r.paginas ?? [])];
/** la página de una inspiración por su ruta (`[]` = portada) */
export const paginaDe = (r: Replica, ruta: string[]) => rutasDe(r).find((p) => p.path === ruta.join("/"));

export const REPLICAS: Replica[] = [
  { slug: "matiz", nombre: "Matiz", ref: "Il Colorista", url: "https://ilcolorista.salon/", ficha: "§3.1", sector: "peluquería", firma: "mosaico de formas salmón con fotos que se disuelven en color", hecha: true, guia: "salon", acento: "#f5a490", paginas: matizPaginas, transicion: "fade" },
  { slug: "nura", nombre: "Nura", ref: "ALICE Hair & Art", url: "https://www.alicehairart.se/", ficha: "§3.2", sector: "peluquería", firma: "collage suelto que se desenfoca y una sola letra en mayúsculas", hecha: true, guia: "salon", acento: "#121212", paginas: nuraPaginas, transicion: "fade" },
  { slug: "cita", nombre: "Cita Barbers", ref: "Rendezvous", url: "https://www.myrendezvous.ca/", ficha: "§3.2", sector: "peluquería", firma: "naranja, serif con cursiva y palabras gigantes", hecha: true, guia: "barberia", acento: "#ff622b", scroll: "snappy", paginas: citaPaginas, transicion: "wipe" },
  { slug: "melena", nombre: "Melena", ref: "Hair Me Up", url: "https://hairmeup.pl", ficha: "§3.2", sector: "peluquería", firma: "arco melocotón y palabras de fondo; salón, tienda y academia", hecha: true, guia: "salon", acento: "#f4b39a", paginas: melenaPaginas, transicion: "fade" },
  { slug: "raiz", nombre: "Raíz", ref: "Marco Ambrosi", url: "https://www.marcoambrosi.salon/", ficha: "§3.2", sector: "peluquería", firma: "oscuro y cobre, antes y después", hecha: true, guia: "barberia", acento: "#b87333", paginas: raizPaginas, transicion: "fade" },
  { slug: "patron", nombre: "Patrón", ref: "Don Barber & Groom", url: "https://don-barber.gr/en", ficha: "§3.2", sector: "peluquería", firma: "gótica condensada, cinta y la familia", hecha: true, guia: "barberia", acento: "#c9a227", paginas: patronPaginas, transicion: "slide" },
  { slug: "nucleo", nombre: "Núcleo", ref: "Core Atelier Pilates", url: "https://coreatelierpilates.com/", ficha: "§3.4", sector: "gimnasio", firma: "acordeón de aparatos con la foto fija", hecha: true, guia: "boutique", acento: "#744c32", scroll: "snappy", paginas: nucleoPaginas, transicion: "fade" },
  { slug: "impulso", nombre: "Impulso", ref: "Essor Fitness", url: "https://coachsportifecublens.com/", ficha: "§3.4", sector: "gimnasio", firma: "negro absoluto y titular a todo el ancho", hecha: true, guia: "club", acento: "#f2f2f2", scroll: "snappy", paginas: impulsoPaginas, transicion: "slide" },
  { slug: "vive", nombre: "Vive", ref: "FIT AND YOU", url: "https://fit-and-you.webflow.io/", ficha: "§3.4", sector: "gimnasio", firma: "condensada naranja, damero y tarjetas ladeadas", hecha: true, guia: "club", acento: "#ff6a1a", paginas: vivePaginas, transicion: "wipe" },
  { slug: "talla", nombre: "Talla", ref: "Skulpt Fitness", url: "https://www.skulptfitness.nl", ficha: "§3.4", sector: "gimnasio", firma: "lima, bordes curvos y menú en columnas verticales", hecha: true, guia: "club", acento: "#cef952", paginas: tallaPaginas, transicion: "stack" },
  { slug: "lobo", nombre: "Lobo", ref: "Fenriz Gym", url: "https://www.fenriz-gym.com/", ficha: "§3.4", sector: "gimnasio", firma: "B/N con un degradado de marca", hecha: true, guia: "club", acento: "#e2462b", paginas: loboPaginas, transicion: "slide" },
  { slug: "remada", nombre: "Remada", ref: "Surfing Academy", url: "https://surfing.academy/", ficha: "§3.6", sector: "academia", firma: "minúsculas, ilustración de línea y viajes por convocatoria", hecha: true, guia: "autor", acento: "#ff4f28", scroll: "snappy", paginas: remadaPaginas, transicion: "fade" },
  { slug: "ahora", nombre: "Ahora", ref: "Future London Academy", url: "https://futurelondonacademy.co.uk/", ficha: "§3.6", sector: "academia", firma: "amarillo, muro de profesores y tarjetas solapadas", hecha: true, guia: "escuela", acento: "#ffe32b", paginas: ahoraPaginas, transicion: "fade" },
  { slug: "oficio", nombre: "Oficio", ref: "Honhar", url: "https://honhar.in/", ficha: "§3.6", sector: "academia", firma: "neobrutalismo amarillo y programas por promoción", hecha: true, guia: "escuela", acento: "#ffaf2e", paginas: oficioPaginas, transicion: "fade" },
  { slug: "abuela-rosa", nombre: "Abuela Rosa", ref: "Peppa Sauce", url: "https://www.peppasauce.love/", ficha: "§3.8", sector: "producto", firma: "el bote fijo y dos tintas", hecha: true, guia: "marca", acento: "#e8612c" },
  { slug: "q47", nombre: "Q47", ref: "K72", url: "https://k72.ca/en", ficha: "§3.9", sector: "agencia", firma: "menú de filas con marquesina y transición en escalera", hecha: true, guia: "club", acento: "#ffffff" },
  // las dos anteriores, del laboratorio de cine (docs/41–43): webs 3D enteras
  { slug: "cenit", nombre: "Cénit", ref: "Lusion", url: "https://lusion.co/", ficha: "docs/43", sector: "estudio creativo", firma: "racimo de cruces en 3D, cintas que se dibujan con el scroll y un reel que crece hasta llenar la pantalla", hecha: true, guia: "monocromo", acento: "#2f3cff", scroll: "cinematic" },
  { slug: "brasa", nombre: "Brasa", ref: "Meer Mohsin", url: "https://www.meermohsin.me/", ficha: "docs/41", sector: "estudio creativo", firma: "retrato en rojo, llamas que suben con el scroll y palabras caligráficas gigantes", hecha: true, guia: "electrico", acento: "#e60000", scroll: "cinematic" },
];

export const replica = (slug: string) => REPLICAS.find((r) => r.slug === slug);
