---
titulo: Astorga, fondos de circo tenebroso con imagegen
fecha: 2026-10-31
tipo: concepto
estado: hecho
referencias: []
fichas: [docs/tareas/circo-astorga.md]
ruta: https://drasw.tailf76b18.ts.net/circo-astorga/
codigo: [proyectos/circo-astorga/import-edition.cjs, proyectos/circo-astorga/apply-editions.cjs, proyectos/circo-astorga/ediciones-imagegen/manifest.json]
colores: [#9f2434, #e2b64d, #281d24]
fuentes: [Georgia, Trebuchet MS]
sector: [cultura, eventos]
guia: [lúdico]
tono: [familiar, festivo, cinemático]
paleta: [acento rojo, fondo oscuro]
tipografia: [titular gigante, serif con cursiva]
patrones: [collage de fotos, galería editorial, filtro por categoría]
movimiento: [movimiento reducido respetado]
piezas: []
piezas-nuevas: []
relacionados: [circo-astorga]
---

## Concepto

Editar una a una las 29 fotografías de la familia con la herramienta integrada OpenAI image_gen. Sustituir los fondos por un circo antiguo de ambiente tenebroso, conservando las personas, su maquillaje, disfraces, poses y accesorios en la medida que permite la edición generativa.

## Qué se midió

29 originales de la familia, 29 PNG editados, 29 WebP y sus miniaturas. La foto de grupo mantiene los 14 integrantes y el perro. Inspección visual individual de entradas y resultados. Pruebas del sitio en 320, 390, 768 y 1440 px; filtros, imágenes, modal, teclado, retorno de foco, movimiento reducido y contraste. Comprobación por HTTPS de las ediciones y del acceso al original.

## Qué se hizo

Fondos con lona crema y granate envejecida, terciopelo, bombillas ámbar, madera y niebla de fondo. Los preparativos de maquillaje usan una ambientación de camerino de la misma carpa. Se guardan los PNG, el manifiesto y los prompts por foto en ediciones-imagegen/. Las copias web tienen rutas nuevas; las originales se pueden abrir desde la vista ampliada. El pie identifica los fondos recreados con IA. Se ajustan los marcos del reparto a contain y se retira una cartela que tapaba el retrato del presentador.

## Diferencias con la referencia

No es documentación fotográfica del decorado real: los fondos son recreaciones. Las 20 fotos del montaje conservan sus fondos originales. La herramienta generativa no garantiza identidad píxel a píxel; se revisan caras, poses, vestuario y accesorios. Una generación del retrato 161537-3f8eaa73 fue rechazada durante la generación; la edición final acota el cambio a telones y luces.

## Aprendido

Los encuadres de una fotografía generada pueden variar aunque se solicite conservarlos. En viñetas estrechas o apaisadas, contain evita recortar las caras del grupo y accesorios. Conservar originalSrc permite ofrecer comparación sin duplicar todo el álbum.

## Siguiente

Revisión familiar de los rostros y de los detalles de cada edición. Cualquier variante posterior debe guardarse con otro nombre para mantener estas versiones.

## Ampliación posterior

Las 20 fotografías del decorado también se han ambientado de noche. Ejercicio y resultados en [circo-astorga-noche](circo-astorga-noche.md). El conjunto actual suma 49 imágenes editadas.
