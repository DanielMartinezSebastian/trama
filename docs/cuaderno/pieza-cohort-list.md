---
titulo: CohortList, programas por convocatoria
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: [https://surfing.academy/, https://futurelondonacademy.co.uk/, https://honhar.in/]
fichas: [docs/50 §3.7, docs/CATALOG.md]
ruta: /componentes
codigo: [components/ui/CohortList.tsx]
colores: []
fuentes: []
sector: [academia]
guia: []
tono: []
paleta: []
tipografia: []
patrones: [programas por convocatoria]
movimiento: []
piezas: [CohortList]
piezas-nuevas: [CohortList]
relacionados: [estudio-academia, replica-remada, replica-oficio]
---

## Concepto

Programas con convocatorias. Cada programa lleva nivel, formato, lo que incluye, fechas de cada promoción, estado
(abierta, últimas plazas, próximamente, cerrada) y una llamada a la acción. Se muestran en filas o en tarjetas.

## Qué se midió

Las tres academias lo tienen, con formas distintas:
- Surfing: destinos con convocatorias por mes;
- FLA: formato en chips;
- Honhar: promoción, duración y mentores.

## Qué se hizo

- `programs`: `CohortProgram[]` o texto.
- `layout`: `rows` o `cards`.
- `cta` y `statusLabels`.
- `variant`.

## Aprendido

- La pieza sirve fuera de las academias: viajes, talleres, retiros, cursos de cocina. El nombre habla de convocatorias,
  no de cursos.

## Siguiente

Llevarla a la receta de academia de E11.
