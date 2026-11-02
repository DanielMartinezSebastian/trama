import type { BriefService } from "@/components/ui/BriefFlow";

/* Datos de Marejada (docs/58): flota inventada de drones marinos, capacidades, misiones, equipo y prensa. Datos puros. */

const I = "/img/inspiraciones/marejada/";
export const V = "/video/";

export const FRASES = ["Las coordenadas de la flota fantasma.", "El camino de los huracanes.", "Dónde se pesca sin permiso.", "Cómo crece la marea tóxica.", "El rumor de un submarino.", "El estado de los cables."];

export type Dron = { id: string; nombre: string; lema: string; img: string; eslora: string; autonomia: string; carga: string; velocidad: string; despliegue: string; texto: string; precio: string };
export const DRONES: Dron[] = [
  { id: "boqueron", nombre: "Boquerón", lema: "Cabe en una furgoneta", img: `${I}boqueron.webp`, eslora: "2,4 m", autonomia: "6 meses", carga: "10 kg", velocidad: "4 nudos", despliegue: "A mano, dos personas", texto: "El más pequeño de la flota. Se lanza desde una playa y aguanta medio año con placas solares.", precio: "Desde 48.000 €" },
  { id: "bonito", nombre: "Bonito", lema: "Rápido cuando hace falta", img: `${I}bonito.webp`, eslora: "4,1 m", autonomia: "45 días", carga: "60 kg", velocidad: "22 nudos", despliegue: "Rampa o grúa", texto: "Solar y diésel. Patrulla despacio y acelera para llegar antes que el problema.", precio: "Desde 190.000 €" },
  { id: "atun", nombre: "Atún", lema: "Para mares de verdad", img: `${I}atun.webp`, eslora: "7,8 m", autonomia: "4 meses", carga: "400 kg", velocidad: "12 nudos", despliegue: "Puerto", texto: "Lleva sonar remolcado y sigue trabajando con olas de seis metros.", precio: "Consúltanos" },
];
export const CAMPOS: [keyof Dron, string][] = [["eslora", "Eslora"], ["autonomia", "Autonomía"], ["carga", "Carga útil"], ["velocidad", "Velocidad"], ["despliegue", "Despliegue"], ["precio", "Precio"]];

export const CAPACIDADES = [
  { t: "Se despliega a mano", d: "El Boquerón entra en una furgoneta y lo botan dos personas en cualquier rampa." },
  { t: "Llega a cualquier sitio", d: "Cabe en un contenedor o en un avión comercial, sin permisos especiales." },
  { t: "Se aprende en una tarde", d: "Sin especialistas ni semanas de curso: lo manejas desde el navegador." },
  { t: "Precio de flota", d: "Lo bastante barato para tener muchos, con repuestos en una semana." },
];

export type Mision = { id: string; lugar: string; ano: string; titulo: string; img: string; texto: string; datos: [string, string][] };
export const MISIONES: Mision[] = [
  { id: "cables-del-estrecho", lugar: "Estrecho de Gibraltar", ano: "2026", titulo: "Vigilar cables a 900 metros", img: `${I}mision-cables.webp`, texto: "Cuatro Bonitos revisaron durante 60 días la traza de dos cables de datos con mucho tráfico mercante encima.", datos: [["Días en el mar", "60"], ["Millas", "8.400"], ["Alertas útiles", "12"]] },
  { id: "marea-roja", lugar: "Ría de Arousa", ano: "2025", titulo: "La marea roja, una semana antes", img: `${I}mision-marea.webp`, texto: "Una red de Boquerones avisó de la proliferación de algas con siete días de adelanto a las bateas.", datos: [["Días de adelanto", "7"], ["Sensores", "18"], ["Bateas avisadas", "340"]] },
  { id: "huracan-nadia", lugar: "Atlántico central", ano: "2024", titulo: "Dentro del huracán Nadia", img: `${I}mision-huracan.webp`, texto: "Un Atún atravesó el ojo de una tormenta de categoría 4 y mandó datos de superficie cada diez minutos.", datos: [["Ola máxima", "14 m"], ["Viento", "210 km/h"], ["Paradas", "0"]] },
];

export const EQUIPO = [
  { n: "Berta Louzán", c: "Dirección", img: `${I}equipo-berta.webp`, d: "Veinte años en buques oceanográficos." },
  { n: "Iker Agirre", c: "Ingeniería", img: `${I}equipo-iker.webp`, d: "Diseñó cascos para vela de competición." },
  { n: "Samira Haddou", c: "Autonomía", img: `${I}equipo-samira.webp`, d: "Antes, robots en el fondo de una mina." },
];

export const PUESTOS = ["Ingeniería de control · Vigo", "Mecánica naval · Vigo", "Operaciones de flota · Cádiz", "Software de a bordo · remoto"];

export const PRENSA = [
  { m: "Diario del Mar", t: "Los drones gallegos que no vuelven a puerto", f: "Octubre de 2026" },
  { m: "Técnica Naval", t: "Marejada alcanza un millón de millas autónomas", f: "Junio de 2026" },
  { m: "El Observador", t: "Quién vigila los cables del Atlántico", f: "Febrero de 2026" },
];

export const DEMOS: BriefService[] = DRONES.map((d) => ({ label: d.nombre, hint: d.lema }));

export const PAGINAS = [
  { path: "capacidades", titulo: "Capacidades" },
  { path: "misiones", titulo: "Misiones" },
  ...MISIONES.map((m) => ({ path: `misiones/${m.id}`, titulo: m.titulo })),
  { path: "flota", titulo: "Flota" },
  ...DRONES.map((d) => ({ path: `flota/${d.id}`, titulo: d.nombre })),
  { path: "equipo", titulo: "Equipo" },
  { path: "empleo", titulo: "Empleo" },
  { path: "prensa", titulo: "Prensa" },
  { path: "contacto", titulo: "Contacto" },
];
