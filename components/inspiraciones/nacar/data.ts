/* Datos de Nácar (docs/59): tarjeta privada inventada con red de socios y conserjería. Datos puros. */

const I = "/img/inspiraciones/nacar/";

export const FOTOS = { piedra: `${I}piedra.webp`, conserje: `${I}conserje.webp`, luna: `${I}luna.webp` };

export const GALERIA = ["hotel", "mesa", "avion", "spa", "abrigo", "yate", "suite", "galeria"].map((n) => `${I}${n}.webp`);

export type Categoria = { id: string; n: string; texto: string; img: string; lugares: { n: string; ciudad: string; ventaja: string }[] };
export const RED: Categoria[] = [
  { id: "hoteles", n: "Hoteles", texto: "Mejora de habitación, desayuno y salida tardía en hoteles elegidos uno a uno.", img: `${I}suite.webp`, lugares: [{ n: "Casa Lumbre", ciudad: "Madrid", ventaja: "Suite garantizada" }, { n: "Hotel Orilla", ciudad: "Lisboa", ventaja: "Salida a las 16 h" }, { n: "Villa Cerro", ciudad: "Mallorca", ventaja: "Tercera noche gratis" }] },
  { id: "mesas", n: "Mesas", texto: "La mesa que no aparece en ninguna aplicación, con veinticuatro horas de antelación.", img: `${I}mesa.webp`, lugares: [{ n: "Brasa Negra", ciudad: "San Sebastián", ventaja: "Mesa de la cocina" }, { n: "Ostra", ciudad: "París", ventaja: "Reserva en 24 h" }, { n: "Kaito", ciudad: "Londres", ventaja: "Barra reservada" }] },
  { id: "viajes", n: "Viajes", texto: "Vuelos privados por plaza, traslados y salas de espera en ochenta aeropuertos.", img: `${I}avion.webp`, lugares: [{ n: "Salas Nácar", ciudad: "80 aeropuertos", ventaja: "Acceso con un invitado" }, { n: "Plaza en vuelo privado", ciudad: "Europa", ventaja: "Desde 1.900 €" }] },
  { id: "experiencias", n: "Experiencias", texto: "Visitas privadas a museos fuera de hora, ensayos generales y talleres que no abren al público.", img: `${I}galeria.webp`, lugares: [{ n: "Museo de noche", ciudad: "Madrid", ventaja: "Dos veces al año" }, { n: "Ensayo general", ciudad: "Viena", ventaja: "Butaca de patio" }] },
  { id: "bienestar", n: "Bienestar", texto: "Spas y médicos de confianza con cita en la semana, en cualquier ciudad de la red.", img: `${I}spa.webp`, lugares: [{ n: "Termas Ura", ciudad: "Ourense", ventaja: "Circuito privado" }, { n: "Clínica Pausa", ciudad: "Madrid", ventaja: "Consulta en 48 h" }] },
];

export const DIVISAS = ["€20.000", "$12.500", "CHF 40.000", "¥28.000", "£9.800", "€4.200", "$31.000", "¥20.000", "CHF 7.500", "£2.400", "€12.500", "$6.900"];

export const PLANES = [
  { id: "nacar", n: "Nácar", cuota: 1200, rasgos: ["Tarjeta de acero cepillado", "0 % de comisión de cambio", "Conserjería por chat las 24 horas", "Red de hoteles y mesas"] },
  { id: "negra", n: "Nácar Negra", cuota: 4800, rasgos: ["Todo lo de Nácar", "Gestor con nombre y teléfono", "Plazas en vuelo privado", "Experiencias fuera de horario", "Dos tarjetas adicionales"] },
];

export const FAQ = [
  "¿Qué es Nácar?|Una forma de moverse por el mundo: una tarjeta sin comisión de cambio, una red de lugares elegidos y una conserjería que responde a cualquier hora.",
  "¿Cómo funciona?|Pides acceso, revisamos la solicitud en una semana y, si encaja, recibes la tarjeta y la invitación a la aplicación.",
  "¿Necesito criptomonedas?|No. Nácar funciona con tu cuenta en euros y cobra en la moneda local, sin recargo.",
  "¿Cuánto cuesta?|La cuota de Nácar es de 1.200 € al año y la de Nácar Negra, de 4.800 €. No hay comisiones por pago ni por cambio.",
  "¿Dónde se acepta?|En cualquier comercio que acepte las redes de tarjetas habituales, en más de doscientos países.",
].join("\n");

export const PAGINAS = [
  { path: "membresia", titulo: "Membresía" },
  { path: "red", titulo: "La red" },
  { path: "socios", titulo: "Para socios" },
  { path: "preguntas", titulo: "Preguntas" },
  { path: "acceso", titulo: "Solicitar acceso" },
];
