/*
 * Contenido común de las tres landings de Lucero. Es la parte innegociable del encargo: mismo servicio, mismas paradas,
 * mismas plazas y mismos precios. Lo que cambia entre versiones es la arquitectura, nunca estos datos.
 */
export type Parada = { id: string; nombre: string; hora: string; minutos: number; nota?: string; escena: string };
export type Plaza = { id: "butaca" | "litera" | "cabina"; nombre: string; base: number; porTramo: number; resumen: string; libres: number };

export const PARADAS: Parada[] = [
  { id: "bilbao", nombre: "Bilbao-Abando", hora: "21:40", minutos: 0, escena: "Sale con la última luz sobre la ría." },
  { id: "miranda", nombre: "Miranda de Ebro", hora: "22:35", minutos: 55, escena: "Empieza la meseta. Abren el vagón cafetería." },
  { id: "burgos", nombre: "Burgos Rosa de Lima", hora: "23:20", minutos: 100, nota: "bici", escena: "Suben cuatro peregrinos y una bicicleta." },
  { id: "valladolid", nombre: "Valladolid", hora: "00:30", minutos: 170, escena: "Medianoche pasada. Se apagan las luces de pasillo." },
  { id: "salamanca", nombre: "Salamanca", hora: "01:50", minutos: 250, escena: "Última parada con gente despierta." },
  { id: "plasencia", nombre: "Plasencia", hora: "03:40", minutos: 360, nota: "tecnica", escena: "Parada técnica. Nadie sube, nadie baja, nadie se entera." },
  { id: "caceres", nombre: "Cáceres", hora: "04:30", minutos: 410, escena: "La hora más oscura. El tren va a 90 por la dehesa." },
  { id: "merida", nombre: "Mérida", hora: "05:05", minutos: 445, escena: "Las primeras cafeteras se encienden en el vagón 4." },
  { id: "sevilla", nombre: "Sevilla-Santa Justa", hora: "07:05", minutos: 565, nota: "desayuno", escena: "Amanece. Llaman a la puerta con el desayuno." },
  { id: "jerez", nombre: "Jerez de la Frontera", hora: "08:00", minutos: 620, escena: "Campiña blanca y el primer olor a sal." },
  { id: "cadiz", nombre: "Cádiz", hora: "08:40", minutos: 660, escena: "Fin de línea, a doscientos metros del mar." },
];

export const PLAZAS: Plaza[] = [
  { id: "butaca", nombre: "Butaca reclinable", base: 24, porTramo: 3, resumen: "Reclina 140°, manta y antifaz. Coche 1.", libres: 12 },
  { id: "litera", nombre: "Litera compartida", base: 39, porTramo: 5, resumen: "Compartimento de cuatro, con cortina y enchufe. Coche 2.", libres: 7 },
  { id: "cabina", nombre: "Cabina doble", base: 79, porTramo: 9, resumen: "Puerta con llave, lavabo y desayuno en cama. Coche 3.", libres: 3 },
];

export const CONDICIONES = [
  { id: "bici", marca: "a", titulo: "Bicicletas", texto: "Viajan montadas en el furgón por 8 €. Se cargan solo en Bilbao, Burgos y Sevilla." },
  { id: "equipaje", marca: "b", titulo: "Equipaje", texto: "Dos bultos por persona, sin peso máximo, en el maletero de cada coche." },
  { id: "mascotas", marca: "c", titulo: "Mascotas", texto: "Admitidas en cabina doble, sin suplemento y con cama de la casa." },
  { id: "tecnica", marca: "d", titulo: "Parada técnica", texto: "En Plasencia no se abren las puertas: el tren espera su cruce unos veinte minutos." },
  { id: "desayuno", marca: "e", titulo: "Desayuno", texto: "Incluido en todas las plazas: se sirve desde Sevilla, o en el trayecto si bajas antes." },
  { id: "cambios", marca: "f", titulo: "Cambios", texto: "Gratis hasta las 18:00 del día de salida. Después se conserva el 50 % como crédito." },
] as const;

export const AVISO = "Lucero es un servicio ficticio creado para una demo: no hay trenes, plazas ni cobros reales.";
export const AVISO_RESERVA = "Es una simulación: no se envía ningún dato ni se cobra nada.";

export function tramos(origen: string, destino: string) {
  return Math.max(0, PARADAS.findIndex((p) => p.id === destino) - PARADAS.findIndex((p) => p.id === origen));
}

export function precio(plaza: Plaza, origen: string, destino: string) {
  return plaza.base + plaza.porTramo * tramos(origen, destino);
}

export function duracion(origen: string, destino: string) {
  const a = PARADAS.find((p) => p.id === origen);
  const b = PARADAS.find((p) => p.id === destino);
  if (!a || !b) return "";
  const m = b.minutos - a.minutos;
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`;
}

export function localizador(nombre: string, plaza: string) {
  let h = 7;
  for (const c of `${nombre}${plaza}`) h = (h * 31 + c.charCodeAt(0)) % 46656;
  return `LU-${h.toString(36).toUpperCase().padStart(3, "0")}`;
}
