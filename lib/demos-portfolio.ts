import type { DemoMeta } from "./demos";

/** Portfolios editoriales publicados en la galería con una ruta propia a pantalla completa. */
export const portfolioDemos: DemoMeta[] = [
  {
    slug: "ines-bruma",
    family: "landing",
    render: "portfolio",
    title: "Inés Bruma · portfolio de ilustración",
    blurb: "Un cuaderno editorial de obra ilustrada: archivo filtrable, fichas, WebGL y una escena que crece con el scroll.",
    hint: "",
    reactive: true,
    lib: "three.js",
    accent: "#b93228",
  },
];
