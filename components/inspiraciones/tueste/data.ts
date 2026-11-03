/* Datos de Tueste (docs/60): fabricante inventado de tostadoras de café industriales, en Vitoria, con siete máquinas
   para cafeterías, tostadores y fábricas. Datos puros. */

const I = "/img/inspiraciones/tueste/";

export const FOTOS = {
  portada: `${I}portada.webp`,
  fundador: `${I}fundador.webp`,
  cafe: `${I}cafe.webp`,
  cacao: `${I}cacao.webp`,
  frutos: `${I}frutos.webp`,
  fabrica: `${I}fabrica.webp`,
  blog1: `${I}blog-1.webp`,
  blog2: `${I}blog-2.webp`,
  blog3: `${I}blog-3.webp`,
};

export type Maquina = { id: string; n: string; serie: "Taller" | "Obrador" | "Industria"; kg: number; carga: string; gas: boolean; electrica: boolean; consumo: string; precio: number; img: string; nota: string };
export const MAQUINAS: Maquina[] = [
  { id: "t5", n: "Taller 5", serie: "Taller", kg: 5, carga: "1,5 kg", gas: true, electrica: true, consumo: "4 kW", precio: 18500, img: `${I}t5.webp`, nota: "Para la cafetería que quiere tostar lo suyo." },
  { id: "t12", n: "Taller 12", serie: "Taller", kg: 12, carga: "3 kg", gas: true, electrica: true, consumo: "7 kW", precio: 29800, img: `${I}t12.webp`, nota: "La más vendida: tostadores pequeños y obradores." },
  { id: "o30", n: "Obrador 30", serie: "Obrador", kg: 30, carga: "8 kg", gas: true, electrica: false, consumo: "14 kW", precio: 52000, img: `${I}o30.webp`, nota: "Con enfriador doble y control de curva desde el móvil." },
  { id: "o60", n: "Obrador 60", serie: "Obrador", kg: 60, carga: "15 kg", gas: true, electrica: false, consumo: "24 kW", precio: 78500, img: `${I}o60.webp`, nota: "Para tostadores que venden a cien cafeterías." },
  { id: "i120", n: "Industria 120", serie: "Industria", kg: 120, carga: "30 kg", gas: true, electrica: false, consumo: "45 kW", precio: 146000, img: `${I}i120.webp`, nota: "Línea completa con carga automática y destoner." },
  { id: "i240", n: "Industria 240", serie: "Industria", kg: 240, carga: "60 kg", gas: true, electrica: false, consumo: "80 kW", precio: 238000, img: `${I}i240.webp`, nota: "La de las fábricas: tres turnos sin parar." },
  { id: "e12", n: "Eléctrica 12", serie: "Taller", kg: 12, carga: "3 kg", gas: false, electrica: true, consumo: "9 kW", precio: 33600, img: `${I}e12.webp`, nota: "Sin gas ni chimenea: para locales en edificios de viviendas." },
];

export const PAGINAS = [
  { path: "catalogo", titulo: "Catálogo" },
  { path: "tecnologia", titulo: "Tecnología" },
  { path: "comparar", titulo: "Comparar" },
  { path: "contacto", titulo: "Contacto" },
  ...MAQUINAS.map((m) => ({ path: `catalogo/${m.id}`, titulo: m.n })),
];

export const ESPECIALIDADES = [
  { n: "Café", img: FOTOS.cafe },
  { n: "Cacao", img: FOTOS.cacao },
  { n: "Frutos secos", img: FOTOS.frutos },
];

export const OPINIONES = [
  { t: "La precisión y el control que tenemos con nuestras Tueste han subido nuestro café a otro nivel. Cada tueste sale exacto.", n: "Marta Ibarra", e: "Tostadores Ibarra" },
  { t: "Pasamos de tostar dos días a la semana a tostar a diario sin contratar a nadie. La curva se repite sola.", n: "Iñigo Salas", e: "Café Gasteiz" },
  { t: "La eléctrica nos dejó tostar en pleno centro, en un bajo, sin obra de chimenea.", n: "Lucía Varela", e: "Varela & Hijos" },
];

export const PILARES = [
  { id: "tecnologia", t: "Tecnología", texto: "Control de curva por perfiles, sonda en el grano y en el aire, y registro de cada tueste." },
  { id: "eficiencia", t: "Eficiencia", texto: "Recirculamos el aire caliente: hasta un 40 % menos de gas que una tostadora de tambor clásica." },
  { id: "sostenibilidad", t: "Sostenibilidad", texto: "Postcombustión catalítica de serie y piezas que se cambian, no máquinas que se tiran." },
];

export const BLOG = [
  { t: "Por qué el desarrollo después del crack decide el sabor", tipo: "Tueste", img: FOTOS.blog1 },
  { t: "Cómo empezar a tostar en tu cafetería", tipo: "Guía", img: FOTOS.blog2 },
  { t: "Tostar con menos humo: lo que cambia la postcombustión", tipo: "Sostenibilidad", img: FOTOS.blog3 },
];
