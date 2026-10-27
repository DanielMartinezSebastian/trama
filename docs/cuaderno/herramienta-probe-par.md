---
titulo: refs:probe con par, paleta, radios, curvas y hover
fecha: 2026-10-27
tipo: herramienta
estado: hecho
referencias: [https://k72.ca/en]
fichas: [docs/53 §3, docs/16 F4]
ruta: /lab/cine/archivo/.refs3d/pares
codigo: [scripts/probe-refs.mts]
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
relacionados: [herramienta-cuaderno, replica-q47]
---

## Concepto

Comparar un original con su réplica con números, en vez de a ojo: `npm run refs:probe -- --par <original> <réplica>`.

## Qué se hizo

- Se amplió `refs:probe` en vez de crear otra herramienta. Ahora mide también:
  - la paleta por superficie;
  - los radios;
  - las curvas;
  - el hover de enlaces y botones, incluidos los pseudoelementos.
- Dos correcciones de medida:
  - las mayúsculas escritas cuentan como mayúsculas;
  - el margen se mide solo con lo visible.
- El modo par escribe `par.md` y `par.json`, con tolerancias por medida y la lista de diferencias.

## Aprendido

- Las medidas tienen fallos que solo salen al usarlas:
  - un menú cerrado contaba como margen;
  - un titular escrito en mayúsculas daba «no»;
  - `translate` y `transform` parecían cosas distintas;
  - 9999 («sin dato») se comparaba como si fuera un número.
- Cada fallo se arregla en la herramienta, no en la lectura.
- El hover de los pseudoelementos es donde viven muchos gestos de marca: el relleno del botón de K72 es un `::after`.

## Siguiente

Pasar el par a todas las réplicas. Para el movimiento por scroll, juntar el par con `cine:compare`.
