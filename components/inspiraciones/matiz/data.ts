import type { MenuSection } from "@/components/ui/MenuList";
import type { BookingService, BookingStaff } from "@/lib/commerce/booking";

/* Datos de Matiz (docs/56): carta, equipo, noticias y páginas. Datos puros: los lee también el registro. */

const I = "/img/inspiraciones/matiz/";

export const CARTA: MenuSection[] = [
  { title: "Los rubios a medida", note: "Cada rubio tiene un nombre y una luz", items: [
    { name: "Rubio Valencia", description: "Consulta + mechas al aire + matiz + reconstrucción + peinado", price: 169 },
    { name: "Rubio Menorca", description: "Consulta + balayage + matiz + peinado", price: 145 },
    { name: "Rubio Lisboa", description: "Consulta + iluminación de contorno + peinado", price: 98 },
  ] },
  { title: "Coloraciones", items: [
    { name: "Castaño de otoño", description: "Consulta + color de raíz a puntas + baño de brillo + peinado", price: 92 },
    { name: "Cobre", description: "Consulta + color + matiz cobrizo + peinado", price: 96 },
  ] },
  { title: "Bienestar", items: [
    { name: "Pausa", description: "Diagnóstico del cuero cabelludo + masaje + tratamiento + peinado", price: 48 },
  ] },
  { title: "Corte", items: [
    { name: "Corte de autor", description: "Consulta + lavado + corte + peinado", price: 55 },
  ] },
];

/** la carta como servicios reservables (con la duración de cada uno) y la consulta del método */
const MINUTOS: Record<string, number> = { "Rubio Valencia": 180, "Rubio Menorca": 150, "Rubio Lisboa": 105, "Castaño de otoño": 120, Cobre: 120, Pausa: 60, "Corte de autor": 60 };
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
export const SERVICIOS: BookingService[] = [
  { id: "consulta", name: "Consulta rostro a medida", minutes: 45, price: 29, category: "Método", description: "Estudio del color de tu piel, tus ojos y tu pelo. Gratis si después pides el servicio." },
  ...CARTA.flatMap((sec) => sec.items.map((it) => ({ id: slug(it.name), name: it.name, minutes: MINUTOS[it.name] ?? 90, price: it.price as number, category: sec.title, description: it.description }))),
];

export const EQUIPO: (BookingStaff & { bio: string })[] = [
  { name: "Lidia", role: "Especialista en rubios · Encargada", photo: `${I}equipo-lidia.webp`, bio: "Quince años pintando luz. Los rubios con nombre de ciudad son suyos.", services: ["consulta", "rubio-valencia", "rubio-menorca", "rubio-lisboa", "pausa"] },
  { name: "Marcos", role: "Colorista · Estilista", photo: `${I}equipo-marcos.webp`, bio: "Castaños, cobres y todo lo que pida un color profundo.", services: ["consulta", "castano-de-otono", "cobre", "corte-de-autor", "pausa", "rubio-lisboa"] },
  { name: "Alba", role: "Corte y textura", photo: `${I}equipo-alba.webp`, bio: "Corta en seco, mira cómo cae el pelo y luego decide.", services: ["consulta", "corte-de-autor", "pausa"] },
];

export type Noticia = { slug: string; titulo: string; img: string; fecha: string; entradilla: string; cuerpo: string[] };

export const NOTICIAS: Noticia[] = [
  { slug: "matiz-busca-talento", titulo: "Matiz busca talento", img: `${I}blog-talento.webp`, fecha: "20 oct 2026", entradilla: "Buscamos una colorista con ganas de aprender el método y de enseñar lo que sabe.", cuerpo: ["Crecemos: a partir de enero, el atelier abre también los lunes y necesitamos una persona más en el equipo de color.", "Buscamos a alguien con al menos tres años de oficio, curiosidad por la armocromía y paciencia para escuchar. El método se aprende aquí, con Lidia, durante las primeras seis semanas.", "Escríbenos desde la página de contacto con dos o tres trabajos tuyos y cuéntanos qué color te gustaría aprender a hacer."] },
  { slug: "mi-rubio-perfecto", titulo: "Mi rubio perfecto", img: `${I}blog-rubio.webp`, fecha: "6 oct 2026", entradilla: "No existe un rubio para todas. Existe el tuyo, y se encuentra mirando la piel antes que el pelo.", cuerpo: ["El error más común es elegir un rubio por una foto. La foto no tiene tu piel ni tu luz: un rubio ceniza que favorece a una piel rosada apaga a una piel dorada.", "Por eso cada rubio de la carta lleva un nombre: Valencia es cálido y luminoso; Menorca, más arenoso; Lisboa, apenas un reflejo alrededor de la cara.", "En la consulta probamos los tres con mechones de muestra junto a tu rostro. Casi siempre acaba ganando el que no esperabas."] },
  { slug: "mechas-al-aire", titulo: "El método de las mechas al aire", img: `${I}blog-mechas.webp`, fecha: "22 sep 2026", entradilla: "Sin papel de aluminio: el color se pinta a mano y se seca al aire. El resultado crece sin raya.", cuerpo: ["Las mechas al aire se pintan mechón a mechón, con pincel, y se dejan secar sin envolver. Así el aclarado es más suave y la transición con la raíz, invisible.", "La ventaja se nota a los dos meses: no aparece la línea de crecimiento y el rubio parece tuyo desde siempre.", "Pide más tiempo que unas mechas clásicas: el pincel es lento. Pero vuelves al salón la mitad de veces."] },
  { slug: "mi-castano-perfecto", titulo: "Mi castaño perfecto", img: `${I}blog-castano.webp`, fecha: "8 sep 2026", entradilla: "Un castaño con brillo no es un castaño plano: tiene tres tonos aunque no se vean.", cuerpo: ["El castaño de otoño de la carta se hace con tres tonos que solo se distinguen a la luz del sol: más oscuro en la raíz, más cálido en el medio y un punto de brillo en las puntas.", "El baño de brillo del final sella el color y le da el reflejo que dura entre lavados.", "Para mantenerlo, champú sin sulfatos y agua tibia. El agua muy caliente es la que más apaga un castaño."] },
  { slug: "que-es-la-armocromia", titulo: "Qué es la armocromía", img: `${I}blog-armocromia.webp`, fecha: "25 ago 2026", entradilla: "La teoría que ordena los colores según tu piel, tus ojos y tu pelo. Y por qué la usamos en cada consulta.", cuerpo: ["La armocromía clasifica los colores en cuatro estaciones según su temperatura, su intensidad y su contraste. Tu piel, tus ojos y tu pelo natural también tienen estación.", "En la consulta colocamos telas de colores junto a tu cara. No se trata de reglas fijas: se trata de ver qué tonos te iluminan y cuáles te restan.", "El color de pelo que elegimos después sale de ahí. Por eso no trabajamos con cartas de color cerradas."] },
  { slug: "colorear-y-nutrir", titulo: "Colorear y nutrir", img: `${I}blog-nutrir.webp`, fecha: "11 ago 2026", entradilla: "Teñir no tiene por qué castigar el pelo. Lo que hacemos antes y después del color.", cuerpo: ["Antes del color, un diagnóstico del cuero cabelludo y del grado de porosidad: un pelo poroso absorbe el tinte de forma desigual.", "Durante, reconstrucción con proteínas en las zonas más castigadas. Después, una mascarilla de pH ácido que cierra la cutícula.", "En casa, una mascarilla a la semana y protector térmico siempre que haya secador o plancha."] },
  { slug: "el-color-perfecto-existe", titulo: "El color perfecto existe", img: `${I}blog-color-perfecto.webp`, fecha: "28 jul 2026", entradilla: "Nuestro muestrario tiene ochenta mechones. Y aun así, cada color se mezcla para una sola persona.", cuerpo: ["El muestrario es el punto de partida, no el destino. Cada fórmula se apunta en tu ficha para poder repetirla o corregirla.", "Así, si en primavera quieres un punto más de luz, sabemos exactamente de dónde partimos.", "Pide tu ficha cuando quieras: es tuya."] },
  { slug: "amoniaco-si-o-no", titulo: "Amoniaco: ¿sí o no?", img: `${I}blog-amoniaco.webp`, fecha: "14 jul 2026", entradilla: "Sin amoniaco no siempre es mejor. Depende de lo que le pidas al color.", cuerpo: ["El amoniaco abre la cutícula para que el color entre. Sin él, los tintes usan otras bases alcalinas que hacen lo mismo con menos olor.", "Para cubrir canas o aclarar varios tonos, a veces la fórmula clásica es la más fiable y la que menos repeticiones necesita.", "Lo importante no es la etiqueta, sino el diagnóstico y el cuidado posterior. Pregúntanos en la consulta."] },
];

export const PAGINAS = [
  { path: "servicios", titulo: "Servicios" },
  { path: "metodo", titulo: "Método rostro a medida" },
  { path: "noticias", titulo: "Noticias" },
  ...NOTICIAS.map((n) => ({ path: `noticias/${n.slug}`, titulo: n.titulo })),
  { path: "reservar", titulo: "Reservar" },
  { path: "mis-citas", titulo: "Mis citas" },
  { path: "contacto", titulo: "Contacto" },
];
