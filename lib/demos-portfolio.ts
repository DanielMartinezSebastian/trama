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
  {
    slug: "polaris-archivo",
    family: "landing",
    render: "portfolio",
    title: "POLARIS · archivo de campo",
    blurb: "Relato de exploración polar con una imagen de hielo viva en WebGL, archivo de expediciones y fichas interactivas.",
    hint: "Mueve el puntero sobre la escena para refractar el hielo · desplázate para recorrer el archivo",
    reactive: true,
    lib: "three.js",
    accent: "#e75f3d",
  },
];
