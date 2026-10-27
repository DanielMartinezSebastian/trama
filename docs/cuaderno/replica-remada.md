---
titulo: Remada, réplica de Surfing Academy
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://surfing.academy/]
fichas: [docs/50 §3.6 E4]
ruta: /lab/estudios/remada
codigo: [components/lab/estudios/remada/Remada.tsx, components/lab/estudios/remada/remada.css]
colores: [#ededed, #17191a, #ff4f28, #39be91]
fuentes: [Onest, Inter, Playfair Display]
sector: [academia]
guia: [academia de autor]
tono: [cercano, personal, lúdico]
paleta: [fondo claro, dos acentos]
tipografia: [minúsculas, títulos entre paréntesis]
patrones: [autor como marca fija, ilustración de línea, programas por convocatoria, billete troquelado, principios con foto, cifras, primera clase gratis, sombra dura desplazada, testimonios]
movimiento: [trazo que se dibuja]
piezas: [CohortList, LineDraw]
piezas-nuevas: [CohortList]
relacionados: [estudio-academia, pieza-cohort-list, replica-oficio]
---

## Concepto

La academia de una persona: la marca es la autora, con su avatar fijo arriba. Todo va en minúsculas, con títulos entre
paréntesis y asteriscos, garabatos a mano y viajes por convocatoria.

## Qué se midió

- Librería: Lenis.
- Colores #ededed, naranja #ff4f28 y verde #39be91.
- Hauora en minúsculas a 16 px, con titulares de 40 a 64 px.
- Botones con sombra dura desplazada.
- En móvil, el avatar fijo tapa el contenido: es un fallo del original.

## Qué se hizo

- Avatar fijo.
- Dibujo de línea con `LineDraw`.
- Viajes por convocatoria con `CohortList layout="rows"`.
- «Sobre mí» como billete troquelado.
- Principios, cifras y la primera clase regalada.
- Opiniones.
- Chat flotante abajo a la derecha.

## Diferencias con la referencia

- El dibujo de cuatro surfistas es más simple: son trazos de `LineDraw`, no una ilustración.

## Aprendido

- La convocatoria (destino, nivel, fechas por mes, estado) se repetía en las tres academias. Merecía pieza: `CohortList`.
- El avatar fijo no debe tapar el contenido en móvil. La réplica lo encoge a 46 px y lo arrima a la esquina (27-10-2026).

## Siguiente

Medir el par.
