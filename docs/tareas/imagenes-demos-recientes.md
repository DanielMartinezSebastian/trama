# Imágenes acordes a las demos recientes

- Objetivo: revisar las demos recientes y aportar imágenes específicas donde la fotografía genérica o repetida no explica la página. Ampliación del encargo: fotografías comparables para limpieza y revisión de Quilate.
- Rama: `feat/imagenes-demos-recientes`, desde `main` en `f10999f`.
- Worktree: `C:/COMPARTIDO/trama-imagenes-negocios`. URL de revisión: `http://localhost:3031` (servidor propio, detenido antes del build).

## Revisión y decisiones

Revisado el historial y las referencias visuales del código de Hebra, Esparta, Cadencia, Forja, Quilate, Voz de la Tierra, Nadir, Runa, Maravillas, Cota y Ánima. Revisión de navegador a 1440 y 390 px en Hebra/equipo, Forja/club, Quilate/taller y las portadas de Cadencia y Esparta.

- Hebra: la página del equipo repetía el corte de portada. Se añade un interior del salón en color cálido, con arcos y materiales coherentes con los retratos existentes.
- Forja: la página del espacio repetía Recovery. Se añade la sala industrial vacía, en blanco y negro, para mostrar los racks y la circulación del local.
- Quilate: ajuste de talla, reparación y transformación usaban fotos genéricas. La transformación mostraba una cadena histórica sobre blanco. Se sustituyen por el ajuste sobre mandril, la reparación de un cierre y el banco de rediseño con una piedra recuperada. La imagen de reparación anterior sí carga al recorrer la página; la primera captura antes del recorrido no había activado su carga diferida.
- Quilate, limpieza: el comparador pasa de ilustraciones de anillo a una pareja de fotografías generadas. El después se edita a partir del antes para conservar la pieza, pose, luz y fondo. Se identifica como comparación ilustrativa en la página y se registra en créditos.
- Cadencia y Esparta: la selección recién integrada ya explica sus disciplinas y oficios; no se añaden imágenes redundantes.
- Voz de la Tierra conserva el material de archivo identificado; Nadir, Runa, Maravillas, Cota y Ánima mantienen la dirección de sus piezas y escenas 3D.

## Archivos y generación

Siete archivos nuevos en `public/img/`: `hebra/salon.webp`, `forja/sala.webp`, `quilate/14-ajuste-talla.webp`, `15-reparacion-cadena.webp`, `16-transformar-herencia.webp`, `17-limpieza-antes.webp` y `18-limpieza-despues.webp`.

Herramienta integrada `image_gen`, una generación por escena y edición referenciada para el después. Prompts completos en [imagenes-demos-recientes-prompts.json](imagenes-demos-recientes-prompts.json). WebP calidad 80; escenas 1800 × 1200, comparación 1200 × 1200; cada archivo por debajo de 300 KB. Los archivos anteriores se conservan. Se actualizan las rutas, textos alternativos y pies correspondientes, además del registro de arte generado y créditos.

El catálogo generado estaba desactualizado en la base tras la integración de Forja y Cadencia. `npm run catalog` actualiza únicamente sus recuentos de componentes; no cambia APIs del kit.

## Evidencias locales

`.refs3d/demos-imagenes/` (ignorado): originales enlazados en `generaciones.json`, capturas antes/después en escritorio y móvil, resultados de navegador y pruebas smoke. No se usan servicios externos ni servidores de otros worktrees.

## Comprobaciones

- `npm run doctor`, `npx next typegen` y `npm run verify`: correctos.
- `npm run smoke` en Hebra/equipo, Forja/club y Quilate/taller: HTTP 200, sin errores de JavaScript o consola.
- Navegador a 1440 y 390 px: imágenes cargadas y sin desbordamiento horizontal en las cinco páginas revisadas. Revisión visual de las capturas y de cada imagen generada.
- Comparador de limpieza a 1440 y 390 px: ambas imágenes 1200 × 1200, cajas cuadradas alineadas, extremos Inicio/Fin y flechas correctos; registro de ambas imágenes en créditos verificado. Evidencias `limpieza-50-*`, `limpieza-antes-*` y `limpieza-despues-*`.
- Siete WebP verificados con Pillow: dimensiones, formato e integridad correctos; entre 63.572 y 200.990 bytes, calidad 80.
- `npm run build`: correcto, 435 páginas generadas. Avisos de fuentes de respaldo y trazado de archivos del laboratorio de cine, sin cambios en esos módulos.
- `git diff --check`: correcto. Se detuvo únicamente el servidor propio del puerto 3031 antes del build.

## Siguiente paso

Integrar el commit de esta rama en `main` después de revisar las capturas. No se modifica `main` desde este worktree.
