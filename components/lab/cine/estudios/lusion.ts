import type { Ficha } from "@/lib/cine/schema";

const AZUL = "#061dfb", BLANCA = "#ffffff", NEGRA = "#111111";
/** las 24 cruces de la portada (sonda de la escena): azules 4 mates y 2 pulidas, blancas 6 y 2, negras 6 y 2, y dos de cristal */
const PIEZAS = [
  ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((k) => [AZUL, BLANCA, NEGRA].map((color) => ({ color, pulida: k % 4 === 3 }))).filter((p, i) => !(p.color === AZUL && i >= 15 && !p.pulida)),
  { color: "#eeeeee", cristal: true },
  { color: "#9da6fd", cristal: true },
];

/**
 * Cuarto estudio real (docs/31): la portada de Lusion (three r158 con un motor propio que pinta en 11 escenas y compone
 * con un cuadrado a pantalla completa). Un racimo de 24 cruces que siguen al puntero, sin luces ni entorno: cada píxel
 * calcula la oclusión, la sombra y el reflejo de las otras 23 de forma analítica. Medido con cine:capture (`--recorte`
 * en la tarjeta de la portada) y una sonda de la escena (posiciones de las cruces); material traducido de sus shaders.
 */
export const lusion: Ficha = {
  id: "lusion",
  titulo: "Lusion · racimo de cruces con sombreado analítico",
  fuente: { url: "https://lusion.co/", fecha: "2026-10-24", autor: "Lusion", licencia: "Estudio: concepto, medidas y técnica del shader; geometría, física y código propios" },
  reloj: "tiempo",
  duracion: 8,
  aspecto: 1152 / 480,
  render: { renderer: "webgpu", toneMapping: "none", exposicion: 1, colorSpace: "srgb", dprMax: 1, sombras: "ninguna" },
  camara: {
    near: 1,
    far: 60,
    dePieza: true,
    planos: [
      {
        id: "fija",
        desde: 0,
        hasta: 1,
        tamano: "general",
        angulo: "normal",
        movimientos: [],
        camara: { desde: { pos: [0, 0, 17.5], mira: [0, 0, 0], fov: 18 }, hasta: { pos: [0, 0, 17.5], mira: [0, 0, 0], fov: 18 }, curva: "linear" },
      },
    ],
  },
  luz: { entorno: { tipo: "ninguno" }, luces: [] },
  materiales: [],
  atmosfera: { fondo: "#141518" },
  // el grano es el del ruido azul de la referencia (cambia en cada fotograma) y su tramado final
  post: [
    { tipo: "grano", intensidad: 0.06 },
    { tipo: "aa", metodo: "smaa" },
  ],
  // la cámara de la referencia tal cual: fov 18 y la vista desplazada 67,8 px, recortada a la tarjeta (64, 187) de la
  // ventana de 1280 × 720
  escena: [{ tipo: "componente", id: "racimo", props: { piezas: PIEZAS, vista: { fov: 18, desplazamiento: [1280, 720, 64, 187 - 67.78, 1152, 480] } } }],
  presupuesto: { drawCalls: 41, triangulos: 59291, pasadasPorFotograma: 11 },
  origen: { render: "medido", camara: "medido", luz: "codigo", post: "medido", escena: "codigo", presupuesto: "medido" },
};
