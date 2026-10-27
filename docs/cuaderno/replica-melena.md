---
titulo: Melena, réplica de Hair Me Up
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://hairmeup.pl]
fichas: [docs/50 §3.2 E2c]
ruta: /inspiraciones/melena
codigo: [components/inspiraciones/melena/Melena.tsx, components/inspiraciones/melena/melena.css]
colores: [#ffffff, #2c2c2c, #feede4, #ffd5bf, #e9875a, #963e13]
fuentes: [DM Serif Display, Lora]
sector: [peluquería]
guia: [salón editorial claro]
tono: [comercial, cálido]
paleta: [fondo claro, pastel cálido]
tipografia: [serif con cursiva]
patrones: [arco detrás del titular, sello circular, servicios numerados, palabra de fondo, tienda, academia, reserva por salón, reserva fija, pestaña de reseñas fija, logos de marcas]
movimiento: [subrayado que crece]
piezas: [Carousel, LogoCloud, ProductCard, SectionHeader]
piezas-nuevas: [SectionHeader]
relacionados: [estudio-peluqueria, pieza-section-header, demo-hebra, herramienta-probe-par]
---

## Concepto

Salón, tienda y academia en una sola web:
- un arco melocotón detrás del nombre;
- cada sección con su nombre gigante y tenue detrás;
- dos píldoras de reserva fijas abajo, una por salón.

## Qué se midió

- Colores #feede4 y #ffd5bf, y botones teja #963e13.
- DM Serif Display (con cursiva para el énfasis) y Lora.

## Qué se hizo

- Arco y sello circular.
- Servicios numerados del 01 al 04 con filete.
- Palabras de fondo (`SectionHeader backdrop`).
- Productos con precio tachado (`ProductCard`).
- Cursos en `Carousel`.
- Pestaña de nota fija y dos píldoras de reserva.

## Diferencias con la referencia

- DM Serif y Lora están sustituidas por Gloock y Newsreader.

## Aprendido

- En desarrollo, Turbopack da 404 con un `lazy()` dentro de un `next/dynamic` (CarouselLazy). Por eso en las réplicas
  se usa `Carousel` directo.
- La palabra de fondo funciona como sistema de navegación: dice dónde estás sin otro título.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://hairmeup.pl http://localhost:3020/lab/estudios/melena --nombre melena` y la sonda de
estilos. Informe en `.refs3d/pares/melena/par.md`.

- **Antes, 10 de 20 medidas cerca.**
  - **Letras**: DM Serif Display y Lora, las del original, son **libres**; la réplica usaba Gloock y Newsreader.
  - **Escala**: las frases de sección van a 64 px/1,28 y la de la academia a 48 px; titular de 125 px; servicios a 56 px;
    botones de 55 px de alto en Lora 600 a 16 px.
  - **Final**: el original cierra en melocotón con «Bądź z nami na bieżąco» y el boletín; el pie de la réplica era gris
    oscuro.
  - **Hover**: once elementos con gesto:
    - la navegación con un **subrayado que crece** (`::after` de 0 al 100 % de ancho);
    - las píldoras de reserva, que cambian de fondo y suben;
    - la pestaña de la nota, que se desplaza.
  - El aviso de cookies en polaco no se aceptaba: la sonda ahora entiende polaco, neerlandés y sueco.
- **Corregido**: las letras del original cargadas en la réplica, las medidas, el final en melocotón con el boletín y los
  tres hovers.
- **Después, 15 de 20.** Quedan:
  - el texto a 14 px en líneas muy largas de las fichas de producto del original;
  - una tercera letra (Plus Jakarta Sans) en detalles;
  - el gris claro de las etiquetas.

## Aprendido en la iteración

- El subrayado que crece desde la izquierda al pasar es el hover de navegación más repetido en estas webs. Es CSS puro
  (`::after` con `width`), pero podría ser una opción de `NavBar`.

## Siguiente

- Comprobar si `NavBar` tiene un hover de subrayado que crece; si no, añadirlo como `linkHover="underline"`.
