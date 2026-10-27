---
titulo: Melena, réplica de Hair Me Up
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://hairmeup.pl]
fichas: [docs/50 §3.2 E2c]
ruta: /lab/estudios/melena
codigo: [components/lab/estudios/melena/Melena.tsx, components/lab/estudios/melena/melena.css]
colores: [#ffffff, #2c2c2c, #feede4, #ffd5bf, #e9875a, #963e13]
fuentes: [Gloock, Newsreader, Playfair Display]
sector: [peluquería]
guia: [salón editorial claro]
tono: [comercial, cálido]
paleta: [fondo claro, pastel cálido]
tipografia: [serif con cursiva]
patrones: [arco detrás del titular, sello circular, servicios numerados, palabra de fondo, tienda, academia, reserva por salón, reserva fija, pestaña de reseñas fija, logos de marcas]
movimiento: []
piezas: [Carousel, LogoCloud, ProductCard, SectionHeader]
piezas-nuevas: [SectionHeader]
relacionados: [estudio-peluqueria, pieza-section-header, demo-hebra]
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

## Siguiente

Medir el par.
