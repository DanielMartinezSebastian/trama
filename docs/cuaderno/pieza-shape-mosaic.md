---
titulo: ShapeMosaic, mosaico de formas con fotos que se disuelven
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: [https://ilcolorista.salon/]
fichas: [docs/50 §2 E12, docs/CATALOG.md]
ruta: /componentes
codigo: [components/ui/ShapeMosaic.tsx]
colores: []
fuentes: []
sector: [peluquería]
guia: [salón editorial claro]
tono: []
paleta: [pastel cálido]
tipografia: []
patrones: [mosaico de formas]
movimiento: [fotos que se disuelven]
piezas: [ShapeMosaic]
piezas-nuevas: [ShapeMosaic]
relacionados: [replica-matiz]
---

## Concepto

Una rejilla de círculos y cuadrados con los tonos del tema. Cada forma puede llevar una foto dentro. Con el scroll, las
formas derivan y las fotos se funden en color liso.

## Qué se midió

En Il Colorista, las formas llevan `is-scroll-animated`: se desplazan con el scroll y la foto se funde.

## Qué se hizo

- Las props:
  - `items`: lista, o líneas `circle|tone|src|alt`;
  - `columns`, `gap`;
  - `dissolve`;
  - `drift`.
- Los tonos se sacan de `color-mix` entre `--acc` y `--bg`.
- `trackScroll` escribe `--sm-p` y la opacidad de la foto se calcula con `clamp` en CSS.

## Aprendido

- En la síntesis de peluquería se decidió **no** hacerla porque solo la tenía una web. Al reproducir Matiz, la portada
  no se sostenía sin ella. Regla: una firma única merece pieza si es versátil, aunque no se repita.

## Siguiente

Usarla fuera de peluquería (una marca geométrica, un estudio de arquitectura) para probar que es versátil.
