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
import { PAGINAS as abuelaPaginas } from "./abuela-rosa/data";
import { PAGINAS as q47Paginas } from "./q47/data";
import { PAGINAS as cenitPaginas } from "./cenit/data";
import { PAGINAS as brasaPaginas } from "./brasa/data";
import { PAGINAS as polillaPaginas } from "./polilla/data";
import { PAGINAS as sesionPaginas } from "./sesion-doble/data";
import { PAGINAS as melosaPaginas } from "./casa-melosa/data";
import { PAGINAS as marejadaPaginas } from "./marejada/data";
import { PAGINAS as albaPaginas } from "./alba/data";
import { PAGINAS as abajoPaginas } from "./no-mires-abajo/data";
import { PAGINAS as canteraPaginas } from "./cantera/data";
import { PAGINAS as ultramarPaginas } from "./ultramar/data";
import { PAGINAS as zancoPaginas } from "./zanco/data";
import { PAGINAS as pulsoPaginas } from "./pulso-lento/data";
import { PAGINAS as anchaPaginas } from "./tierra-ancha/data";
import { PAGINAS as bocadoPaginas } from "./bocado/data";
import { PAGINAS as pausaPaginas } from "./pausa/data";
import { PAGINAS as soleraPaginas } from "./solera/data";
import { PAGINAS as vencejoPaginas } from "./vencejo/data";
import { PAGINAS as nacarPaginas } from "./nacar/data";
import { PAGINAS as nimboPaginas } from "./nimbo/data";
import { PAGINAS as plenoPaginas } from "./pleno/data";
import { PAGINAS as boloPaginas } from "./bolo/data";
import { PAGINAS as granoPaginas } from "./grano/data";
import { PAGINAS as turiaPaginas } from "./turia/data";
import { PAGINAS as majoPaginas } from "./majo/data";
import { PAGINAS as corrientePaginas } from "./corriente/data";
import { PAGINAS as tuestePaginas } from "./tueste/data";
import { PAGINAS as trochaPaginas } from "./trocha/data";
import { PAGINAS as llavePaginas } from "./llave/data";

export type Replica = {
  slug: string;
  /** marca inventada de la réplica */
  nombre: string;
  /** web de referencia y su ficha en docs/50 */
  ref: string;
  url: string;
  ficha: string;
  sector: "peluquería" | "gimnasio" | "academia" | "producto" | "agencia" | "estudio creativo" | "club de suscripción" | "cine" | "interiorismo" | "robótica" | "inmobiliaria" | "videojuego" | "selección de personal" | "logística" | "mueble" | "música" | "safari" | "restaurante" | "clínica" | "arquitectura" | "automoción" | "finanzas" | "software" | "conferencia" | "tipografía" | "maquinaria" | "residencia";
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
  { slug: "impulso", nombre: "Impulso", ref: "Essor Fitness", url: "https://coachsportifecublens.com/", ficha: "§3.4", sector: "gimnasio", firma: "negro absoluto y titular a todo el ancho", hecha: true, guia: "bloque", acento: "#f2f2f2", scroll: "snappy", paginas: impulsoPaginas, transicion: "slide" },
  { slug: "vive", nombre: "Vive", ref: "FIT AND YOU", url: "https://fit-and-you.webflow.io/", ficha: "§3.4", sector: "gimnasio", firma: "condensada naranja, damero y tarjetas ladeadas", hecha: true, guia: "club", acento: "#ff6a1a", paginas: vivePaginas, transicion: "wipe" },
  { slug: "talla", nombre: "Talla", ref: "Skulpt Fitness", url: "https://www.skulptfitness.nl", ficha: "§3.4", sector: "gimnasio", firma: "lima, bordes curvos y menú en columnas verticales", hecha: true, guia: "club", acento: "#cef952", paginas: tallaPaginas, transicion: "stack" },
  { slug: "lobo", nombre: "Lobo", ref: "Fenriz Gym", url: "https://www.fenriz-gym.com/", ficha: "§3.4", sector: "gimnasio", firma: "B/N con un degradado de marca", hecha: true, guia: "club", acento: "#e2462b", paginas: loboPaginas, transicion: "slide" },
  { slug: "remada", nombre: "Remada", ref: "Surfing Academy", url: "https://surfing.academy/", ficha: "§3.6", sector: "academia", firma: "minúsculas, ilustración de línea y viajes por convocatoria", hecha: true, guia: "autor", acento: "#ff4f28", scroll: "snappy", paginas: remadaPaginas, transicion: "fade" },
  { slug: "ahora", nombre: "Ahora", ref: "Future London Academy", url: "https://futurelondonacademy.co.uk/", ficha: "§3.6", sector: "academia", firma: "amarillo, muro de profesores y tarjetas solapadas", hecha: true, guia: "escuela", acento: "#ffe32b", paginas: ahoraPaginas, transicion: "fade" },
  { slug: "oficio", nombre: "Oficio", ref: "Honhar", url: "https://honhar.in/", ficha: "§3.6", sector: "academia", firma: "neobrutalismo amarillo y programas por promoción", hecha: true, guia: "escuela", acento: "#ffaf2e", paginas: oficioPaginas, transicion: "fade" },
  { slug: "abuela-rosa", nombre: "Abuela Rosa", ref: "Peppa Sauce", url: "https://www.peppasauce.love/", ficha: "§3.8", sector: "producto", firma: "el bote fijo y dos tintas", hecha: true, guia: "marca", acento: "#e8612c", paginas: abuelaPaginas, transicion: "fade" },
  { slug: "q47", nombre: "Q47", ref: "K72", url: "https://k72.ca/en", ficha: "§3.9", sector: "agencia", firma: "menú de filas con marquesina y transición en escalera", hecha: true, guia: "club", acento: "#ffffff", paginas: q47Paginas, transicion: "stairs" },
  // las dos anteriores, del laboratorio de cine (docs/41–43): webs 3D enteras
  { slug: "cenit", nombre: "Cénit", ref: "Lusion", url: "https://lusion.co/", ficha: "docs/43", sector: "estudio creativo", firma: "racimo de cruces en 3D, cintas que se dibujan con el scroll y un reel que crece hasta llenar la pantalla", hecha: true, guia: "monocromo", acento: "#2f3cff", scroll: "cinematic", paginas: cenitPaginas, transicion: "fade" },
  { slug: "brasa", nombre: "Brasa", ref: "Meer Mohsin", url: "https://www.meermohsin.me/", ficha: "docs/41", sector: "estudio creativo", firma: "retrato en rojo, llamas que suben con el scroll y palabras caligráficas gigantes", hecha: true, guia: "bloque", acento: "#e60000", scroll: "cinematic", paginas: brasaPaginas, transicion: "fade" },
  // tercera ronda (docs/58): sectores nuevos y estéticas lejos de las anteriores
  { slug: "polilla", nombre: "Polilla", ref: "Aardvark Book Club", url: "https://aardvarkbookclub.com/", ficha: "docs/58", sector: "club de suscripción", firma: "amarillo con manchas orgánicas, ultranegra y libros con volumen que caen con el scroll", hecha: true, guia: "manchas", acento: "#ffd24a", scroll: "snappy", paginas: polillaPaginas, transicion: "wipe" },
  { slug: "sesion-doble", nombre: "Sesión Doble", ref: "A24 de Ravi Klaassens", url: "https://a24.raviklaassens.com/", ficha: "docs/58", sector: "cine", firma: "catálogo en discos que giran y una didona apretada con estrellas", hecha: true, guia: "filmoteca", acento: "#c9c46a", paginas: sesionPaginas, transicion: "fade" },
  { slug: "casa-melosa", nombre: "Casa Melosa", ref: "House of Honey", url: "https://www.houseofhoney.com/", ficha: "docs/58", sector: "interiorismo", firma: "rosa y chocolate, ultranegra de borde a borde cruzada por una caligráfica", hecha: true, guia: "goloso", acento: "#edccbe", scroll: "snappy", paginas: melosaPaginas, transicion: "wipe" },
  { slug: "marejada", nombre: "Marejada", ref: "Seasats", url: "https://www.seasats.com/", ficha: "docs/58", sector: "robótica", firma: "web en tarjeta con columna de menú en degradado de arena a bosque y serifa fina sobre el mar", hecha: true, guia: "sereno", acento: "#6d7763", scroll: "snappy", paginas: marejadaPaginas, transicion: "fade" },
  { slug: "alba", nombre: "Alba Residencia", ref: "ERA Residence", url: "https://www.era-residence.com/", ficha: "docs/58", sector: "inmobiliaria", firma: "burdeos con caligrafía fantasma, marco biselado que se abre y selector de viviendas", hecha: true, guia: "burdeos", acento: "#340c24", scroll: "snappy", paginas: albaPaginas, transicion: "fade" },
  { slug: "no-mires-abajo", nombre: "No mires abajo", ref: "Don't Look Up", url: "https://www.dontlookup.app/", ficha: "docs/58", sector: "videojuego", firma: "juego satírico jugable a tinta: dos zapatos gigantes y una multitud que se enfada", hecha: true, guia: "tinta", acento: "#c0342a", paginas: abajoPaginas, transicion: "fade" },
  { slug: "cantera", nombre: "Cantera", ref: "Aspen Search", url: "https://www.aspensearch.com/", ficha: "docs/58", sector: "selección de personal", firma: "mosaico de baldosas con semitono, menta y reloj de cada ciudad en la cabecera", hecha: true, guia: "baldosa", acento: "#a1ffcb", scroll: "snappy", paginas: canteraPaginas, transicion: "fade" },
  { slug: "ultramar", nombre: "Ultramar", ref: "United Carriers", url: "https://unitedcarriers.com/", ficha: "docs/58", sector: "logística", firma: "globo de puntos con rutas, titular extendido y un contenedor que cruza al bajar", hecha: true, guia: "orbital", acento: "#ff6e28", scroll: "snappy", paginas: ultramarPaginas, transicion: "wipe" },
  { slug: "zanco", nombre: "Zanco", ref: "Noho", url: "https://noho.ink/", ficha: "docs/58", sector: "mueble", firma: "muro escalonado de baldosas de color con muebles dibujados y tienda con color real", hecha: true, guia: "catalogo", acento: "#f4d21f", scroll: "snappy", paginas: zancoPaginas, transicion: "fade" },
  { slug: "pulso-lento", nombre: "Pulso Lento", ref: "Paul Kalkbrenner", url: "https://www.paulkalkbrenner.net/", ficha: "docs/58", sector: "música", firma: "blanco suizo con foto dentro del nombre, vinilo que gira, años gigantes y reproductor que suena", hecha: true, guia: "cartel", acento: "#a7ff9c", scroll: "snappy", paginas: pulsoPaginas, transicion: "wipe" },
  // cuarta ronda (docs/59): ocho sectores más
  { slug: "tierra-ancha", nombre: "Tierra Ancha", ref: "Tengile MalaMala Collection", url: "https://tengilemalamala.com/", ficha: "docs/59", sector: "safari", firma: "crema y oliva, serifa finísima en mayúsculas y un collage de fauna que flota a distintas velocidades", hecha: true, guia: "sabana", acento: "#8b5a2b", scroll: "editorial", paginas: anchaPaginas, transicion: "fade" },
  { slug: "bocado", nombre: "Bocado", ref: "Délice", url: "https://delice.ca/", ficha: "docs/59", sector: "restaurante", firma: "bloques de rojo, turquesa, verde y granate, serifa blanda y platos del día en círculos bajo un título en arco", hecha: true, guia: "trattoria", acento: "#cc2629", scroll: "snappy", paginas: bocadoPaginas, transicion: "wipe" },
  { slug: "pausa", nombre: "Pausa", ref: "Odyssée", url: "https://www.odysseeclinic.com.au/", ficha: "docs/59", sector: "clínica", firma: "marfil y azul tinta, fotos en duotono que recuperan el color al pasar y párrafos de serifa con sangría", hecha: true, guia: "clinica", acento: "#1e305e", scroll: "editorial", paginas: pausaPaginas, transicion: "fade" },
  { slug: "solera", nombre: "Solera Arquitectura", ref: "LPAS", url: "https://lpas.com/", ficha: "docs/59", sector: "arquitectura", firma: "fila de cinco paneles por sector, foto arriba y color tierra abajo, que se ensanchan al pasar", hecha: true, guia: "terracota", acento: "#a65232", scroll: "snappy", paginas: soleraPaginas, transicion: "slide" },
  { slug: "vencejo", nombre: "Vencejo", ref: "Spyker Cars", url: "https://www.spykercars.com/", ficha: "docs/59", sector: "automoción", firma: "penumbra azul petróleo, condensada en mayúsculas, detalles dispersos y un configurador con el coche dibujado", hecha: true, guia: "motor", acento: "#1f4a4f", scroll: "cinematic", paginas: vencejoPaginas, transicion: "fade" },
  { slug: "nacar", nombre: "Nácar", ref: "Moto", url: "https://www.moto-card.com/", ficha: "docs/59", sector: "finanzas", firma: "piedra negra, tarjeta de acero en 3D sobre un pedestal y una galería que se recorre en profundidad", hecha: true, guia: "obsidiana", acento: "#e1e5e5", scroll: "cinematic", paginas: nacarPaginas, transicion: "fade" },
  { slug: "nimbo", nombre: "Nimbo", ref: "Cerebrium", url: "https://cerebrium.ai/", ficha: "docs/59", sector: "software", firma: "negro violáceo con una cinta de luz magenta que se dibuja sola y tarjetas blancas con barras, mapa y gráfica en directo", hecha: true, guia: "cinta", acento: "#ff3d8b", scroll: "snappy", paginas: nimboPaginas, transicion: "fade" },
  { slug: "pleno", nombre: "PLENO", ref: "OFFF Forum", url: "https://www.offforum.com/", ficha: "docs/59", sector: "conferencia", firma: "blanco y negro, fotos de escenario que se funden bajo un titular en serifa mayúscula y un logotipo de formas ultranegras", hecha: true, guia: "foro", acento: "#000000", paginas: plenoPaginas, transicion: "stairs" },
  { slug: "bolo", nombre: "Bolo", ref: "Truck'N Roll", url: "https://trucknroll.com/", ficha: "docs/60", sector: "logística", firma: "negro carbón, condensada de 900 a toda la pantalla con fotos entre las palabras, pegatina girada y pie violeta con cintas cruzadas", hecha: true, guia: "bloque", acento: "#5a3ff2", scroll: "snappy", paginas: boloPaginas, transicion: "wipe" },
  { slug: "grano", nombre: "Grano", ref: "Glitch&Grit", url: "https://glitchandgrit.com/", ficha: "docs/60", sector: "estudio creativo", firma: "muro de proyectos fijado al scroll: dos mitades por proyecto y su nombre en grotesca de 900 y color pastel que salta con un glitch", hecha: true, guia: "bloque", acento: "#9be59a", scroll: "snappy", paginas: granoPaginas, transicion: "blinds" },
  { slug: "turia", nombre: "Turia Grotesk", ref: "PP Neue Montreal", url: "https://neuemontreal.com/", ficha: "docs/60", sector: "tipografía", firma: "una tipografía presentada como guía de viaje: bloques de color pleno, el nombre a todo lo ancho, carta de pesos en franjas de colores y cintas de acentos", hecha: true, guia: "senal", acento: "#f0523a", scroll: "snappy", paginas: turiaPaginas, transicion: "slide" },
  { slug: "majo", nombre: "Majo", ref: "Fauna Robotics", url: "https://faunarobotics.com", ficha: "docs/60", sector: "robótica", firma: "crema cálido, titulares centrados en grotesca de 500, tarjetas muy redondeadas y figuras de formas geométricas de colores", hecha: true, guia: "papel", acento: "#e8572f", paginas: majoPaginas, transicion: "fade" },
  { slug: "corriente", nombre: "Nada Corriente", ref: "Normal is Boring", url: "https://normalisboring.es/", ficha: "docs/60", sector: "inmobiliaria", firma: "serifa editorial ultrafina en mayúsculas escalonada por la pantalla, marca partida entre dos esquinas, bloques azul claro y coral y palabras gigantes cortadas", hecha: true, guia: "tinta", acento: "#e4685a", scroll: "editorial", paginas: corrientePaginas, transicion: "fade" },
  { slug: "tueste", nombre: "Tueste", ref: "CoffeeTech", url: "https://coffee-tech.com/", ficha: "docs/60", sector: "maquinaria", firma: "portada negra con grotesca enorme, cuerpo crema con catálogo de máquinas en tarjetas grises, sobretítulos entre corchetes y naranja solo en las llamadas", hecha: true, guia: "senal", acento: "#e0552b", paginas: tuestePaginas, transicion: "slide" },
  { slug: "trocha", nombre: "Trocha", ref: "Radian", url: "https://www.rideradian.com/", ficha: "docs/60", sector: "automoción", firma: "gris cálido y fotos de campo a sangre, grotesca contenida y un amarillo de reserva; visor de la moto en cuatro ángulos con puntos de detalle", hecha: true, guia: "nocturno", acento: "#f2d21b", scroll: "snappy", paginas: trochaPaginas, transicion: "fade" },
  { slug: "llave", nombre: "Llave", ref: "Units", url: "https://units.gr/en/homepage/", ficha: "docs/60", sector: "residencia", firma: "rejilla de tarjetas de color pleno muy redondeadas, letra gruesa y redonda, lateral de pestañas de colores y aviso amarillo de oferta", hecha: true, guia: "manchas", acento: "#2f5bea", paginas: llavePaginas, transicion: "iris" },
];

export const replica = (slug: string) => REPLICAS.find((r) => r.slug === slug);
