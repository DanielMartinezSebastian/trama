---
titulo: Astorga, telón de entrada y álbum para móvil
fecha: 2026-10-31
tipo: concepto
estado: hecho
referencias: []
fichas: [docs/tareas/circo-astorga.md]
ruta: https://drasw.tailf76b18.ts.net/circo-astorga/
codigo: [proyectos/circo-astorga/dist/index.html, proyectos/circo-astorga/dist/style.css, proyectos/circo-astorga/dist/app.js, proyectos/circo-astorga/qa-mobile.cjs]
colores: [#f2e4c4, #281d24, #9f2434, #e2b64d]
fuentes: [Georgia, Trebuchet MS]
sector: [cultura, eventos]
guia: [lúdico]
tono: [familiar, cinemático]
paleta: [fondo claro, acento rojo]
tipografia: [titular gigante, serif con cursiva]
patrones: [galería editorial, filtro por categoría, relato por scroll]
movimiento: [movimiento reducido respetado, transición de página]
piezas: []
piezas-nuevas: []
relacionados: [circo-astorga, circo-astorga-imagegen, circo-astorga-noche]
---

## Concepto

Recuperar el patrón del telón del kit y simplificar la galería del circo, dando prioridad a su uso en móvil.

## Qué se midió

Revisión de la variante curtain de PageTransition en components/ui/styles/ui-view-transitions.css y del catálogo. Pruebas de la página en 320, 390, 768 y 1440 px. Prueba móvil con eventos táctiles reales de Chromium: deslizamiento del visor, cierre, acceso HTTPS y posición estable de las fotos al cargar más. Capturas en proyectos/circo-astorga/qa/.

## Qué se hizo

Se adapta al sitio estático el patrón de dos paños que se abren desde el centro, con pliegues y colores de sus tokens. Se ejecuta una vez por sesión al entrar en portada y al pulsar la entrada al cómic. No depende de React, no bloquea la lectura y se omite con movimiento reducido.

El álbum elimina marcos y rótulos repetidos. Muestra imágenes completas en dos columnas en móvil, tres en tableta y cuatro en escritorio. Carga 12 al inicio y permite ampliar hasta las 49, conservando la posición de las fotos ya visibles. Los filtros mantienen sus grupos completos para recorrerlos desde el visor.

El visor ocupa toda la pantalla en móvil, mantiene flechas, teclado, Escape, retorno de foco y enlace al original; añade deslizamiento horizontal y bloquea el scroll de fondo mientras está abierto.

## Diferencias con la referencia

Es una adaptación del patrón de movimiento del kit al proyecto HTML independiente. No se ha importado ni cambiado el componente React de la librería. La galería mantiene su función de álbum familiar, sin convertir las fotos en tarjetas con información repetida.

## Aprendido

Las columnas CSS se reequilibran cuando se añaden fotos y pueden recolocar imágenes que el usuario ya ha visto. La distribución incremental por columnas mantiene sus posiciones y aprovecha las diferentes proporciones sin recortar las fotografías.

## Siguiente

Recoger la revisión del usuario en su móvil y ajustar el ritmo del telón si lo desea.

## Ampliación del álbum

Incorporadas 14 fotografías adicionales: 13 retratos sobre fondo negro y una foto de grupo, sin edición generativa. Total 63 (43 familia y 20 circo). Preparación reproducible mediante additional-photos.json. Pruebas responsive, HTTPS y móvil táctil pasan con el nuevo total.

## URL y vista previa definitivas

Publicación privada en GitHub y producción en https://circo-astorga.vercel.app/. La vista previa social usa la fotografía de entrada elegida por el usuario, WebP 1445 × 1088, servida desde su URL previa que se conserva. Comprobados Open Graph, canonical, acceso público y visor móvil en producción.
