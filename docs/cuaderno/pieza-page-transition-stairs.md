---
titulo: PageTransition en escalera
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: [https://k72.ca/en]
fichas: [docs/50 §3.9, docs/05]
ruta: /componentes
codigo: [lib/ui/viewTransitions.ts]
colores: []
fuentes: []
sector: [agencia]
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: [transición en escalera]
piezas: [viewTransitions]
piezas-nuevas: [viewTransitions]
relacionados: [replica-q47, pieza-fullscreen-menu]
---

## Concepto

Cinco columnas bajan en escalera desde la esquina superior derecha hasta tapar la pantalla. En la página nueva se retiran
igual. Dura unos 600 ms en cada sentido.

## Qué se midió

Fotogramas del paso a Work en K72, en `.refs3d/webs/k72-ca-en/nav/04-a-work-*`.

## Qué se hizo

`kind: "stairs"` en View Transitions: cinco capas de máscara animadas con `@property --ui-vt-s0..s4`. Está documentado
en docs/05.

## Aprendido

- Cuando el cambio de vista no es un cambio de ruta (la réplica Q47), la escalera se hace con capas propias. El concepto
  es una cortinilla, no una transición de ruta.

## Siguiente

Una versión con la marca en el centro durante el cambio (Il Colorista, E12).
