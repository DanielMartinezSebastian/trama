import type { Ficha } from "@/lib/cine/schema";

/**
 * Segundo estudio real (docs/28): Hublot, de darkroom.engineering (portada de threejs.org). La vista desde la ventanilla
 * de un avión al alba: WebGPU + TSL, todo procedural (sin modelos; solo una textura de luces nocturnas), sin luces (la
 * escena se ilumina en nodos), bloom y SMAA. Arrastrar saca la cámara por la ventanilla. La recreación es nuestra: el
 * cielo es una rampa medida en la captura y el resto se escribe desde la ficha (`lib/porthole`).
 */
export const hublot: Ficha = {
  id: "hublot",
  titulo: "Hublot (darkroom.engineering) · ventanilla al alba",
  fuente: { url: "https://hublot.darkroom.engineering/", fecha: "2026-10-24", autor: "darkroom.engineering", licencia: "Estudio: concepto y medidas; geometría, shaders y cielo escritos de nuevo" },
  reloj: "puntero",
  duracion: 16,
  aspecto: 16 / 9,
  render: { renderer: "webgpu", toneMapping: "none", exposicion: 1, colorSpace: "srgb", dprMax: 1, sombras: "ninguna" },
  camara: {
    near: 0.02,
    far: 200000,
    dePieza: true,
    planos: [
      {
        id: "dentro",
        desde: 0,
        hasta: 0.5,
        tamano: "general",
        angulo: "normal",
        movimientos: ["fijo"],
        camara: { desde: { pos: [-1.369, 0, -1.6686], mira: [-1.678, 0, -2.62], fov: 54 }, hasta: { pos: [-1.369, 0, -1.6686], mira: [-1.678, 0, -2.62], fov: 54 }, curva: "linear" },
      },
      {
        id: "fuera",
        desde: 0.5,
        hasta: 1,
        tamano: "general",
        angulo: "normal",
        movimientos: ["dolly", "panoramica"],
        camara: { desde: { pos: [-1.369, 0, -1.6686], mira: [-1.678, 0, -2.62], fov: 54 }, hasta: { pos: [-1.465, 0.02, -1.995], mira: [-1.423, 0.072, -2.993], fov: 54 }, curva: "expo.out" },
      },
    ],
  },
  luz: { entorno: { tipo: "ninguno" }, luces: [] },
  materiales: [],
  atmosfera: {},
  post: [{ tipo: "bloom", fuerza: 0.35, radio: 0.05, umbral: 0.85 }, { tipo: "aa", metodo: "smaa" }],
  escena: [{ tipo: "componente", id: "ventanilla" }],
  presupuesto: { drawCalls: 68, pasadasPorFotograma: 36 },
  origen: { render: "medido", camara: "medido", luz: "medido", post: "medido", escena: "codigo", presupuesto: "medido" },
};
