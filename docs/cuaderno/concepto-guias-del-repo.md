---
titulo: Las guías de estilo sacadas del repo
fecha: 2026-10-27
tipo: concepto
estado: hecho
referencias: []
fichas: [docs/54, docs/16 §5.1c]
ruta: /guias
codigo: [lib/ui/guides.ts, scripts/guias-afinidad.mts, scripts/probe-refs.mts, components/site/guias/fuentes.ts, components/site/guias/GuideSheet.tsx, components/site/guias/GuideIndex.tsx, app/guias/(lab)/[guia]/page.tsx]
colores: [#08020f, #ff2fd0, #140b26, #ffcc4d, #000000, #ff3b3b, #f2efe9, #b9501d]
fuentes: [JetBrains Mono, Silkscreen, Space Mono, Doto, IBM Plex Mono, Inter Tight, Inter]
sector: []
guia: [terminal de neón, arcade pixel, matriz de puntos, estudio en papel]
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [GuideFrame]
piezas-nuevas: []
relacionados: [concepto-guias-de-sector, herramienta-probe-par, herramienta-cuaderno]
---

## Concepto

El repo ya es lo bastante grande para sacar guías de estilo de sí mismo. `refs:probe --repo` mide en el navegador todas
las webs, landings y réplicas, y las compara con las guías medidas igual. Cada página queda asignada a su guía más afín.
Las que no se parecen a ninguna señalan una estética propia de Trama que todavía no tenía guía.

## Qué se hizo

- `refs:probe --repo <base>` mide las páginas de `docs/CATALOG.md` y las réplicas del registro, además de las guías. Escribe
  `components/site/guias/repo.json` con las medidas, los rasgos y las tres guías más afines de cada página.
- La afinidad (`scripts/guias-afinidad.mts`) es `1 / (1 + distancia)`. La distancia suma diferencias ponderadas de:
  - luminancia del fondo;
  - saturación y tono del acento;
  - categoría de la letra (pixel, mono, condensada, serifa, redonda o grotesca);
  - tamaño, peso, tracking, mayúsculas e interlineado del titular;
  - tamaño del texto;
  - píldoras.
- La primera medida dejó una docena de páginas con una afinidad menor de 0,25. De ellas salen cuatro guías nuevas con
  `source: "repo"`:
  - `terminal`: CIPHERGRID, MYCEL, Kernel Log;
  - `pixel`: Pixelforge, Hamaca, MINIMAL;
  - `puntos`: DOTMATRIX, Almíbar Barrio;
  - `papel`: Alzado, Estudio, Barro, Plano.
- Cada guía tiene su hoja de estilo en `/guias/<id>`. Junta en un sitio:
  - la medida;
  - el contraste de cada pareja de colores;
  - los especímenes de letra;
  - el espacio, el movimiento y los gestos del kit;
  - los componentes con la guía;
  - las fichas y la receta de su familia;
  - las páginas del repo afines;
  - las reglas con sus excepciones;
  - el código.
- `GUIDE_RULES` y `GUIDE_EXCEPTIONS` pasan a `lib/ui/guides.ts`. La sonda las lee de ahí, así que hay una sola fuente.

## Aprendido

- El peso alto es lo que define la mono y la letra de puntos: con menos de 800 los puntos de Doto no forman letras. Va
  como excepción medida, no como fallo.
- Los titulares en letra de píxel salen mal medidos si la página no tiene un titular grande en el primer pantallazo
  (MINIMAL, FACETA y GEOMETRY dan 1 vw). Para clasificarlos pesan más el fondo y la categoría de la letra.
- Quilate tumba el navegador headless al medirlo (`Target crashed`); queda en `fallidas`.

## Siguiente

Volver a medir con `--repo` cada vez que entre una web o una guía. Si una página baja de 0,25 de afinidad, o es una
estética nueva (otra guía) o una página que se ha desviado de la suya.
