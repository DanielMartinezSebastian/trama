/* Datos de Alba Residencia (docs/58): promoción inventada en Nerja, tipologías, viviendas y entorno. Datos puros. */

const I = "/img/inspiraciones/alba/";

export const FOTOS = { cielo: `${I}portada-cielo.webp`, piscina: `${I}piscina.webp`, terraza: `${I}terraza.webp`, salon: `${I}salon.webp`, dormitorio: `${I}dormitorio.webp`, jardin: `${I}jardin.webp`, plaza: `${I}plaza.webp` };

export type Tipo = { id: string; nombre: string; dormitorios: number; desde: number; m2: string; img: string; texto: string };
export const TIPOS: Tipo[] = [
  { id: "bajo-jardin", nombre: "Bajo con jardín", dormitorios: 2, desde: 395000, m2: "92 m² + 60 m² de jardín", img: `${I}tipo-jardin.webp`, texto: "Sales descalza del dormitorio al césped. Jardín privado con riego y seto de jazmín." },
  { id: "terraza", nombre: "Planta con terraza", dormitorios: 3, desde: 465000, m2: "118 m² + 34 m² de terraza", img: `${I}tipo-terraza.webp`, texto: "La terraza es una habitación más, con cocina de verano y sombra hasta las dos." },
  { id: "atico", nombre: "Ático con solárium", dormitorios: 3, desde: 690000, m2: "126 m² + 88 m² de solárium", img: `${I}tipo-atico.webp`, texto: "Vistas al Balcón de Europa, piscina de inmersión y la mejor puesta de sol del edificio." },
];

export type Estado = "libre" | "reservada" | "vendida";
export type Vivienda = { id: string; bloque: string; planta: number; puerta: string; tipo: string; orientacion: string; precio: number; estado: Estado };

const ORIENTA = ["Sur", "Sureste", "Oeste", "Sur"];
/** cuatro bloques de tres plantas: bajo, primera y ático, cuatro puertas cada una */
export const VIVIENDAS: Vivienda[] = ["A", "B", "C", "D"].flatMap((bloque, b) =>
  [0, 1, 2].flatMap((planta) =>
    [1, 2, 3, 4].map((n, k): Vivienda => {
      const tipo = TIPOS[planta];
      const semilla = (b * 7 + planta * 5 + k * 3) % 9;
      return {
        id: `${bloque}${planta}${n}`,
        bloque,
        planta,
        puerta: String(n),
        tipo: tipo.id,
        orientacion: ORIENTA[(b + k) % 4],
        precio: tipo.desde + (planta + 1) * k * 7500 + b * 9000,
        estado: semilla < 2 ? "vendida" : semilla < 4 ? "reservada" : "libre",
      };
    }),
  ),
);

export const CERCA = [
  { t: "Playa de Burriana", d: "9 min a pie" },
  { t: "Balcón de Europa", d: "6 min a pie" },
  { t: "Aeropuerto de Málaga", d: "55 min en coche" },
  { t: "Colegio internacional", d: "12 min en coche" },
];

export const ETAPAS = [
  { t: "Licencia", f: "2025", ok: true },
  { t: "Cimentación", f: "2026", ok: true },
  { t: "Estructura", f: "2027", ok: false },
  { t: "Entrega de llaves", f: "Verano de 2028", ok: false },
];

export const PAGINAS = [
  { path: "viviendas", titulo: "Elige vivienda" },
  { path: "tipos", titulo: "Tipologías" },
  ...TIPOS.map((t) => ({ path: `tipos/${t.id}`, titulo: t.nombre })),
  { path: "nerja", titulo: "Nerja" },
  { path: "visita", titulo: "Reserva una visita" },
];
