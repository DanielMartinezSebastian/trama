import type { Ficha } from "@/lib/cine/schema";

/**
 * Tercer estudio real (docs/29): el portfolio de Bruno Simon (WebGPU + TSL, física con Rapier). Se conduce un coche que
 * empuja objetos, con una cámara isométrica que lo persigue. Medido con cine:capture (`--clic` para empezar, `--teclas`
 * para conducir): cámara, luz, dinámica del coche. La recreación es nuestra: coche, letras y cajas propios, y la física
 * de `lib/physics` (sin WebAssembly, como pide la CSP de producción) calibrada contra la serie del coche.
 */
export const bruno: Ficha = {
  id: "bruno",
  titulo: "Bruno Simon · coche de juguete con física",
  fuente: { url: "https://bruno-simon.com/", fecha: "2026-10-24", autor: "Bruno Simon", licencia: "Estudio: concepto y medidas; modelos, escena y física propios" },
  reloj: "tiempo",
  duracion: 14,
  aspecto: 16 / 9,
  render: { renderer: "webgpu", toneMapping: "none", exposicion: 1, colorSpace: "srgb", dprMax: 1, sombras: "pcf" },
  camara: {
    near: 0.1,
    far: 200,
    dePieza: true,
    planos: [
      {
        id: "persecucion",
        desde: 0,
        hasta: 1,
        tamano: "general",
        angulo: "picado",
        movimientos: ["truck"],
        camara: { desde: { pos: [54.44, 14.33, 52.74], mira: [39.62, 0.44, 37.85], fov: 25 }, hasta: { pos: [54.44, 14.33, 52.74], mira: [39.62, 0.44, 37.85], fov: 25 }, curva: "linear" },
      },
    ],
  },
  luz: {
    entorno: { tipo: "ninguno" },
    luces: [{ tipo: "direccional", color: "#ffffff", intensidad: 5, pos: [51.09, 26.85, 27.39], papel: "principal", sombra: { mapa: 2048, sesgo: -0.001, sesgoNormal: 0.1, radio: 3 } }],
  },
  materiales: [],
  atmosfera: { fondo: "#2a1c2e" },
  post: [{ tipo: "bloom", fuerza: 0.25, radio: 0, umbral: 1 }],
  escena: [
    {
      tipo: "componente",
      id: "cochecito",
      props: {
        palabra: "BRUNO",
        colores: { suelo: "#b8582a", coche: "#b81d24", letras: "#c9c0dc", cajas: "#c7c0d8", acento: "#ff3b3b" },
        inicio: { pos: [39.6201, 1.2133, 37.8466], rumbo: 0.2306 },
        suelo: 0.441,
      },
    },
  ],
  presupuesto: { drawCalls: 259, triangulos: 459214, pasadasPorFotograma: 6 },
  origen: { render: "medido", camara: "medido", luz: "medido", post: "medido", escena: "codigo", presupuesto: "medido" },
};
