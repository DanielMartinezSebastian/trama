---
titulo: Astorga, el circo después de anochecer
fecha: 2026-10-31
tipo: concepto
estado: hecho
referencias: []
fichas: [docs/tareas/circo-astorga.md]
ruta: https://drasw.tailf76b18.ts.net/circo-astorga/
codigo: [proyectos/circo-astorga/apply-editions.cjs, proyectos/circo-astorga/ediciones-imagegen/prompts-circo.json, proyectos/circo-astorga/ediciones-imagegen/manifest.json]
colores: [#281d24, #9f2434, #e2b64d]
fuentes: [Georgia, Trebuchet MS]
sector: [cultura, eventos]
guia: [lúdico]
tono: [familiar, cinemático, nocturno]
paleta: [fondo oscuro, acento rojo]
tipografia: [titular gigante, serif con cursiva]
patrones: [collage de fotos, galería editorial, relato por scroll]
movimiento: [movimiento reducido respetado]
piezas: []
piezas-nuevas: []
relacionados: [circo-astorga, circo-astorga-imagegen]
---

## Concepto

El usuario pide hacer más sombrías las imágenes del circo y su interior después de las ediciones familiares. Se editan individualmente las 20 fotografías del decorado con la herramienta integrada OpenAI image_gen, conservando el montaje reconocible.

## Qué se midió

20 originales inspeccionados y 20 salidas revisadas visualmente. Total del proyecto: 49 fotografías editadas, 29 de familia y 20 de decorado, con PNG, WebP, miniatura, prompt y referencia al original. Comprobaciones de imágenes, filtros, ampliación, teclado, foco, contraste y adaptación a 320, 390, 768 y 1440 px. Revisión de las viñetas principales por HTTPS y acceso al original del decorado.

## Qué se hizo

La luz diurna pasa a iluminación nocturna: sombras frías, luz roja tenue, pequeños puntos cálidos y algo de neblina. Se mantienen la entrada, las telas, los árboles, los dibujos y los adornos del circo familiar. Cada foto se procesa por separado y se registra su prompt en prompts-circo.json y el manifiesto completo.

Las nuevas rutas se incorporan al álbum y a las viñetas sin sobrescribir las copias originales. El visor permite comparar mediante Ver original. El pie de la web identifica tanto los fondos familiares como el ambiente recreado.

## Diferencias con la referencia

Las imágenes nocturnas son recreaciones generativas de fotos tomadas de día. Hay pequeñas variaciones de textura y luces; no constituyen documentación del montaje tal como fue fotografiado. La dirección solicita preservar geometría y materiales y evitar añadir personajes o transformar el atrezo en elementos reales.

## Aprendido

Una iluminación consistente da continuidad al recorrido sin cambiar el decorado. Con sombras profundas hay que revisar las imágenes en el tamaño real de móvil: los adornos principales y las cartelas deben seguir siendo legibles.

## Siguiente

Recoger la revisión familiar y mantener el acceso a los originales para comparar cualquier detalle.
