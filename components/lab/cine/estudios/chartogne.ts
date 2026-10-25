import type { Ficha } from "@/lib/cine/schema";

/**
 * Quinto estudio real (docs/32): la portada en 3D de Chartogne-Taillet (three r122), un mapa de Merfy y sus viñas
 * dibujado como un grabado. Sin colores en la escena: el material deja normal, lápiz y cercanía, y una pasada final
 * pinta papel y lápiz con contornos de Sobel. Medido con cine:capture (clic en el aviso de edad y rueda) y una sonda de
 * los uniforms; el paisaje es procedural y propio (la referencia usa sus mapas de terreno y modelos).
 */
export const chartogne: Ficha = {
  id: "chartogne",
  titulo: "Chartogne-Taillet · paisaje grabado a lápiz",
  fuente: { url: "https://chartogne-taillet.com/en", fecha: "2026-10-25", autor: "Chartogne-Taillet", licencia: "Estudio: técnica del shader, parámetros y cámara; paisaje y código propios" },
  reloj: "tiempo",
  duracion: 6,
  aspecto: 16 / 9,
  render: { renderer: "webgpu", toneMapping: "none", exposicion: 1, colorSpace: "srgb", dprMax: 2, dprFijo: 2, sombras: "ninguna" },
  camara: {
    near: 0.0025,
    far: 40,
    dePieza: true,
    planos: [
      {
        id: "vuelo",
        desde: 0,
        hasta: 0.5,
        tamano: "general",
        angulo: "picado",
        movimientos: ["dolly", "inclinacion", "panoramica"],
        camara: { desde: { pos: [1.0078, 0.5042, 7.9357], mira: [1.0078, 0.5042, 6.9357], fov: 65 }, hasta: { pos: [1.7, 0.8353, 2.2002], mira: [0.9753, 0.3813, 1.6818], fov: 65 }, curva: "power2.out" },
      },
    ],
  },
  luz: {
    entorno: { tipo: "ninguno" },
    // cuatro en la escena de la referencia: dos parejas idénticas que se suman (el material de lápiz lleva su propia luz,
    // con el tono ajustado a la suma)
    luces: [
      { tipo: "direccional", color: "#ffffff", intensidad: 3.75, pos: [-0.9641, 1.6817, 4.609], papel: "principal" },
      { tipo: "direccional", color: "#ffffff", intensidad: 2.1, pos: [2.0754, 3.2009, -3.2322], papel: "relleno" },
      { tipo: "direccional", color: "#ffffff", intensidad: 3.75, pos: [-0.9641, 1.6817, 4.609], papel: "principal" },
      { tipo: "direccional", color: "#ffffff", intensidad: 2.1, pos: [2.0754, 3.2009, -3.2322], papel: "relleno" },
    ],
  },
  materiales: [],
  atmosfera: { fondo: "#fff5dd" },
  post: [],
  escena: [{ tipo: "componente", id: "grabado", props: { entrada: 3 } }],
  presupuesto: { drawCalls: 26, triangulos: 3268, pasadasPorFotograma: 2 },
  origen: { render: "medido", camara: "medido", luz: "medido", post: "medido", escena: "codigo", presupuesto: "medido" },
};
