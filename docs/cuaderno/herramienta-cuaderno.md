---
titulo: El cuaderno del laboratorio
fecha: 2026-10-27
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/53 §2]
ruta: /lab/cuaderno
codigo: [components/lab/cuaderno/datos.ts, scripts/cuaderno.mts, app/lab/cuaderno/page.tsx]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: []
piezas-nuevas: []
relacionados: [herramienta-probe-par]
---

## Concepto

Cada ejercicio del lab deja una ficha con etiquetas comunes. De las etiquetas salen las familias de estilo, los patrones
que van juntos y las obras parecidas: la base para escribir guías de estilo y patrones de diseño con lo que ya tenemos.

## Qué se hizo

- Las fichas viven en `docs/cuaderno/`.
- `npm run lab:cuaderno` revisa las fichas y escribe el índice con las relaciones. Con `--check` entra en `verify`, y
  `--nueva` crea una ficha.
- `/lab/cuaderno` las enseña con filtro por etiqueta; `/lab/cuaderno/<id>` enseña cada ficha.
- Se rellenaron 31 fichas:
  - los 3 estudios por sector;
  - las 16 réplicas;
  - las 4 demos reformadas;
  - las 7 piezas;
  - esta herramienta.

## Aprendido

- Las relaciones solo salen bien entre obras (réplicas, demos, conceptos). Si se cuentan los estudios y las piezas, que
  agregan etiquetas de otras fichas, las parejas de patrones se inflan.
- Al escribir las fichas de memoria se colaron dos afirmaciones falsas en Remada. Toda afirmación sobre el código se
  comprueba antes de escribirla.

## Siguiente

Cuando haya diez fichas o más por familia, sacar la guía de cada una (E10).
