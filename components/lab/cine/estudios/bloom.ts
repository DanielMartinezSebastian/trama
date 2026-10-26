import type { Ficha } from "@/lib/cine/schema";

/**
 * Calibración (docs/26 §6): el ejemplo `webgpu_postprocessing_bloom` de three.js r186, con los valores de su código
 * fuente, que coinciden con los que mide `cine:capture`. Sirve para comprobar que el banco reproduce una escena conocida.
 * El modelo (PrimaryIonDrive.glb, de los ejemplos de three.js) se descarga a public/lab-assets/ solo para estudio local.
 */
export const bloom: Ficha = {
  id: "bloom",
  titulo: "three.js · webgpu_postprocessing_bloom",
  fuente: { url: "https://threejs.org/examples/webgpu_postprocessing_bloom.html", fecha: "2026-10-23", autor: "three.js", licencia: "Código MIT; modelo de los ejemplos de three.js, solo estudio local" },
  reloj: "tiempo",
  duracion: 4,
  aspecto: 16 / 9,
  render: { renderer: "webgpu", toneMapping: "reinhard", exposicion: 1, colorSpace: "srgb", dprMax: 1 },
  camara: {
    near: 1,
    far: 100,
    planos: [
      {
        id: "fijo",
        desde: 0,
        hasta: 4,
        tamano: "general",
        angulo: "picado",
        movimientos: ["fijo"],
        camara: { desde: { pos: [-5, 2.5, -3.5], mira: [0, 0, 0], fov: 40 }, hasta: { pos: [-5, 2.5, -3.5], mira: [0, 0, 0], fov: 40 }, curva: "linear" },
      },
    ],
  },
  luz: {
    entorno: { tipo: "ninguno" },
    luces: [
      { tipo: "ambiente", color: "#cccccc", intensidad: 1, papel: "ambiente" },
      { tipo: "puntual", color: "#ffffff", intensidad: 100, pos: [0, 0, 0], decaimiento: 2, deCamara: true, papel: "principal" },
    ],
  },
  materiales: [],
  atmosfera: {},
  post: [{ tipo: "bloom", fuerza: 1, radio: 0, umbral: 0 }],
  escena: [{ tipo: "gltf", src: "/lab-assets/three/PrimaryIonDrive.glb", animacion: "*" }],
  presupuesto: { drawCalls: 19, pasadasPorFotograma: 14 },
  origen: { render: "codigo", camara: "codigo", luz: "codigo", post: "codigo", escena: "codigo", presupuesto: "medido" },
};

/** Prueba del comparador: la misma escena con errores a propósito en la lente (fov 50), el tone mapping y los tres
 * parámetros del bloom. `cine:compare` los señala todos, con la cámara primero (10° de fov es un 25 % de la lente). */
export const bloomDesviado: Ficha = {
  ...bloom,
  id: "bloom-desviado",
  titulo: "three.js · webgpu_postprocessing_bloom (desviado a propósito)",
  render: { ...bloom.render, toneMapping: "aces" },
  camara: {
    ...bloom.camara,
    planos: bloom.camara.planos.map((p) => ({ ...p, camara: { ...p.camara, desde: { ...p.camara.desde, fov: 50 }, hasta: { ...p.camara.hasta, fov: 50 } } })),
  },
  post: [{ tipo: "bloom", fuerza: 2.5, radio: 0.4, umbral: 0.2 }],
};
