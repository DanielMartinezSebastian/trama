import type { DemoMeta } from "./demos";

/**
 * Landing de ejemplo construida enteramente con `components/ui/` (el kit del catálogo
 * `/componentes`), a diferencia de las seis landings temáticas de `demos-themes.ts` (bespoke,
 * canvas a medida). Vive en la misma sección "Landings temáticas" de la galería.
 */
export const kitLandingDemos: DemoMeta[] = [
  {
    slug: "th-ciphergrid",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "ambas",
    title: "CIPHERGRID · producto ciberpunk",
    blurb:
      "Landing retrowave completa construida solo con components/ui/: fondos reactivos al scroll, modal, notificaciones, formulario y prácticamente todo el catálogo.",
    hint: "Desplaza para cambiar de fondo y revelar secciones · pasa el puntero por las tarjetas",
    accent: "#ff2fd0",
  },
  {
    slug: "th-mycel",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "ambas",
    title: "MYCEL · red micelar orgánica",
    blurb:
      "Segunda landing completa construida solo con components/ui/, opuesta a CIPHERGRID: una red de sensores de campo que germina de verdad al hacer scroll por el héroe, sin que el fondo tape nunca el contenido.",
    hint: "Desplaza para ver germinar el héroe y cambiar de fondo · pasa el puntero por las tarjetas",
    accent: "#67e38a",
  },
  {
    slug: "th-folio",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "ambas",
    title: "FOLIO · editorial de tema claro",
    blurb:
      "Tercera landing completa construida solo con components/ui/, la única de tema claro: papel, tinta y tipografía para una herramienta editorial, con fondos en patrones de papelería real en vez de escenas cargadas.",
    hint: "Desplaza para cambiar de fondo · pasa el puntero por las tarjetas",
    accent: "#a3311f",
  },
  {
    slug: "th-dotmatrix",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "three.js",
    title: "SIGNAL · dot matrix",
    blurb:
      "Landing de referencia del tema dot matrix: monocromo, variante dotmatrix en todo el kit y un único RetroCanvas (react-three-fiber con filtro ASCII y scanlines) de fondo que cambia de figura en cada acto.",
    hint: "Desplaza para cambiar la figura del fondo · pasa el puntero por las tarjetas",
    accent: "#ff3b3b",
  },
  {
    slug: "th-silo",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "three.js",
    title: "SILO · hard techno minimal",
    blurb:
      "Landing de un productor de hard techno con minimalismo extremo: negro, blanco y un gris, tipografía enorme y un único RetroCanvas de fondo (ASCII de puntos invertido, scanlines de 1 px en barrido y glitch leve) que cambia de figura en cada sección.",
    hint: "Desplaza: cada sección cambia la figura del fondo",
    accent: "#f2f2f2",
  },
  {
    slug: "th-minimal",
    family: "landing",
    render: "kit",
    reactive: false,
    lib: "asciify",
    title: "MARÉ · minimal pixel",
    blurb:
      "Landing mínima de Maré Surf Club: fondo dither de cuadrados duros que evoluciona de amanecer a noche con el scroll, tipografía pixel, titulares con aparición glitch y palabra rotativa.",
    hint: "Desplaza para que el fondo pase de amanecer a noche",
    accent: "#ff8a5c",
  },
  {
    slug: "th-geometry",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "asciify",
    title: "FORMAS · 2000dvh",
    blurb:
      "Demo de 2000dvh en ocho capítulos: el scroll interpola el tamaño de celda (fino casi siempre), bloom, grano y tinte; en cada cambio la imagen se rompe en bloques y salta de cubo a pirámide, esfera, octaedro, icosaedro, prisma, nudo toroidal y cono. Varias figuras se colocan al borde de la página y cada una tiene su propio hover.",
    hint: "Desplaza despacio y mueve el puntero sobre cada figura: cada una reacciona distinto",
    accent: "#3fd0c9",
  },
  {
    slug: "th-faceta",
    family: "landing",
    render: "kit",
    reactive: true,
    lib: "asciify",
    title: "FACETA · landing larga con kit",
    blurb:
      "Landing de prueba de más de 3000dvh: dieciséis actos con el fondo de formas 3D evolucionando con el scroll (celda fina, figuras al borde, hover propio) y, entre carteles con aparición distinta, componentes del kit en estilo pixel duro: características, cifras, marquesina, proceso, pestañas, precios, opiniones, FAQ, galerías de imágenes con Swiper, carrusel de opiniones, cinta de marcas, formulario y pie.",
    hint: "Desplaza: alternan carteles y bloques de componentes · mueve el puntero sobre la figura del fondo",
    accent: "#ff4fa3",
  },
];
