import type { Ruta } from "./Globo";

/* Datos de Ultramar (docs/58): empresa de logística inventada: rutas, servicios, envíos de muestra y tarifas. Datos puros. */

const I = "/img/inspiraciones/ultramar/";

export const PUERTOS: { id: string; n: string; c: [number, number]; z: number }[] = [
  { id: "algeciras", n: "Algeciras", c: [-5.4, 36.1], z: 0 },
  { id: "rotterdam", n: "Róterdam", c: [4.4, 51.9], z: 0 },
  { id: "santos", n: "Santos", c: [-46.3, -23.9], z: 2 },
  { id: "singapur", n: "Singapur", c: [103.8, 1.3], z: 3 },
  { id: "shanghai", n: "Shanghái", c: [121.5, 31.2], z: 3 },
  { id: "houston", n: "Houston", c: [-95.3, 29.7], z: 2 },
  { id: "mombasa", n: "Mombasa", c: [39.7, -4], z: 1 },
];
const P = Object.fromEntries(PUERTOS.map((p) => [p.id, p.c]));

export const RUTAS: Ruta[] = [
  { de: P.algeciras, a: P.santos },
  { de: P.rotterdam, a: P.houston },
  { de: P.algeciras, a: P.mombasa },
  { de: P.mombasa, a: P.singapur },
  { de: P.singapur, a: P.shanghai },
  { de: P.rotterdam, a: P.shanghai },
];

export const NOTICIAS = ["Aviso: el ciclón Arnau retrasa dos días las salidas desde Mombasa", "Abierta la nueva ruta directa Algeciras–Santos", "El puerto de Róterdam amplía su horario de carga nocturna"];

export type Servicio = { id: string; n: string; lema: string; img: string; texto: string; cifras: [string, string][] };
export const SERVICIOS: Servicio[] = [
  { id: "maritimo", n: "Marítimo", lema: "Un contenedor o un barco entero", img: `${I}maritimo.webp`, texto: "Contenedor completo o grupaje, con salidas semanales desde siete puertos propios.", cifras: [["Puertos", "7"], ["Salidas al mes", "64"]] },
  { id: "aereo", n: "Aéreo", lema: "Cuando el reloj manda", img: `${I}aereo.webp`, texto: "Vuelo de carga con recogida y aduana incluidas. Lo urgente llega en 72 horas.", cifras: [["Plazo máximo", "72 h"], ["Aeropuertos", "21"]] },
  { id: "carretera", n: "Carretera", lema: "La última milla también es nuestra", img: `${I}carretera.webp`, texto: "Flota propia en la península y red de socios en toda Europa.", cifras: [["Camiones", "340"], ["Países", "18"]] },
  { id: "aduanas", n: "Aduanas", lema: "Un solo responsable", img: `${I}aduanas.webp`, texto: "Despacho, licencias e impuestos, sin que tengas que hablar con cinco empresas.", cifras: [["Trámites al año", "48.000"], ["Rechazos", "0,2 %"]] },
];

export type Hito = { t: string; d: string; f: string; ok: boolean };
export type Envio = { codigo: string; origen: string; destino: string; carga: string; eta: string; hitos: Hito[] };
export const ENVIOS: Envio[] = [
  { codigo: "UM-2041", origen: "Algeciras", destino: "Santos", carga: "2 contenedores, 18 t de aceite", eta: "14 de noviembre", hitos: [{ t: "Recogido", d: "Almacén de Jaén", f: "24 oct", ok: true }, { t: "En puerto", d: "Algeciras", f: "26 oct", ok: true }, { t: "En el mar", d: "Atlántico, a 1.100 millas", f: "2 nov", ok: true }, { t: "Aduana", d: "Santos", f: "12 nov", ok: false }, { t: "Entregado", d: "São Paulo", f: "14 nov", ok: false }] },
  { codigo: "UM-3390", origen: "Shanghái", destino: "Róterdam", carga: "1 contenedor, electrónica", eta: "28 de noviembre", hitos: [{ t: "Recogido", d: "Suzhou", f: "20 oct", ok: true }, { t: "En puerto", d: "Shanghái", f: "22 oct", ok: true }, { t: "En el mar", d: "Mar Arábigo", f: "2 nov", ok: true }, { t: "Aduana", d: "Róterdam", f: "26 nov", ok: false }, { t: "Entregado", d: "Tilburgo", f: "28 nov", ok: false }] },
];

export const TARIFAS: Record<string, { base: number; kilo: number; dias: string }> = {
  Marítimo: { base: 380, kilo: 0.28, dias: "18–32 días" },
  Aéreo: { base: 240, kilo: 3.4, dias: "2–3 días" },
  Carretera: { base: 120, kilo: 0.6, dias: "3–6 días" },
};

export const CIFRAS: [string, string][] = [
  ["2.500+", "envíos al mes"],
  ["98,2 %", "entregas en plazo"],
  ["42", "países con equipo propio"],
];

export const PAGINAS = [
  { path: "servicios", titulo: "Servicios" },
  ...SERVICIOS.map((s) => ({ path: `servicios/${s.id}`, titulo: s.n })),
  { path: "seguimiento", titulo: "Seguimiento" },
  { path: "presupuesto", titulo: "Presupuesto" },
  { path: "empresa", titulo: "Empresa" },
];
