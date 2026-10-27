---
titulo: Nura, réplica de ALICE Hair & Art
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.alicehairart.se/]
fichas: [docs/50 §3.2 E2a]
ruta: /lab/estudios/nura
codigo: [components/lab/estudios/nura/Nura.tsx, components/lab/estudios/nura/nura.css]
colores: [#f5f5f5, #121212, #5c5c5c, #dedede]
fuentes: [Geist, Inter]
sector: [peluquería]
guia: [salón editorial claro]
tono: [editorial, sobrio, artístico]
paleta: [fondo claro, grises con grano]
tipografia: [una sola letra, grotesca en mayúsculas]
patrones: [collage de fotos, equipo en filas, reserva por persona, barra inferior fija, sala de exposición]
movimiento: [desenfoque al bajar]
piezas: [GradientField, TeamSection]
piezas-nuevas: [TeamSection]
relacionados: [estudio-peluqueria, pieza-team-section, demo-hebra]
---

## Concepto

Un salón que también es galería. Una sola letra pequeña en mayúsculas para todo y grises con grano; el color lo ponen las
fotos y los cuadros. Las fotos del collage se desenfocan y se funden al bajar.

## Qué se midió

- Px Grotesk a 14 px, en mayúsculas, con espaciado de 0,1 em.
- Grises #f5f5f5, #f0f0f0 y #dedede; texto #121212.

## Qué se hizo

- Collage suelto con un desenfoque ligado al scroll.
- Manifiesto.
- Equipo en filas con biografía y reserva por persona (`TeamSection layout="rows"`).
- La sala con obras generativas hechas con `GradientField`.
- Barra inferior fija.

## Diferencias con la referencia

- Falta el conmutador «Hair / & Art» con la barra que se rellena.
- Px Grotesk está sustituida por Geist.

## Aprendido

- `RetroShapes` necesita lienzo propio. Para «arte» generativo dentro de una tarjeta basta `GradientField`.
- Una sola letra a 14 px aguanta una web entera si el contraste y el espaciado son buenos.

## Siguiente

Medir el par y probar el conmutador con barra como variante de `Tabs` o `SegmentedControl`.
