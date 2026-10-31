---
titulo: POLARIS, archivo ficticio de expedición inspirado en Igloo Inc.
fecha: 2026-10-31
tipo: demo
estado: hecho
referencias: [https://www.igloo.inc/, https://www.awwwards.com/igloo-inc-case-study.html]
fichas: [docs/estudios/igloo-inc-webgl.md]
ruta: /demo/polaris-archivo
codigo: [components/landings/polaris/PolarisLanding.tsx, components/landings/polaris/polaris.css]
colores: [#101821, #e9edf0, #e75f3d, #83cbd9]
fuentes: [Inter, Newsreader, JetBrains Mono]
sector: [ciencia, exploración, cultura]
guia: [producto nocturno]
tono: [cinemático, exploratorio, humano]
paleta: [azul glaciar oscuro, hielo claro, naranja de expedición]
tipografia: [grotesca contenida, serif en cursiva, mono técnico]
patrones: [relato de una página, escena WebGL sobre fotografía, archivo filtrable, ficha modal, lectura en capas]
movimiento: [refracción GLSL al puntero, aberración cromática, escarcha reactiva al scroll, osciloscopio animado, movimiento reducido respetado]
piezas: [GuideFrame, Button]
piezas-nuevas: []
relacionados: []
---

## Concepto

POLARIS es un archivo ficticio de expediciones antárticas, inspirado en el uso de WebGL de Igloo Inc. para comprobar si las skills pueden investigar una escena con shaders y traducirla a una experiencia original. Awwwards documenta en Igloo una introducción en tiempo real, transiciones de escarcha/desplazamiento, bloques de hielo procedurales y partículas. La demo usa otra metáfora: observar lo que las personas registran bajo el hielo.

## Qué se midió

La web original se abrió en 390×844 y 1440×900 con `cine:web` (32 pasos por viewport), `refs:probe`, `cine:explora` y `cine:sonda`. La página oculta el scroll normal y representa el contenido visualmente: el mapa DOM encontró una sola superficie y ningún titular, así que se revisaron las capturas. La sonda observó Three.js r165, 9 escenas gráficas, shaders, targets y posprocesado; la exploración registró cambios ante puntero, rueda y clic. El caso oficial de Awwwards completa lo que no revela el DOM: navegación de tres secciones, shaders propios, ice blocks procedurales y simulación interactiva de partículas. Informes y SHA-256 de capturas en `docs/estudios/igloo-inc-webgl.md`.

## Qué se hizo

- Se integró `/demo/polaris-archivo` en `/demos` en una categoría WebGL.
- Se creó un relato de una página con portada, valores de muestra, sección explicativa, archivo filtrable, fichas modales y un formulario sin envío.
- Un shader GLSL WebGL 1 desplaza la fotografía, separa los canales RGB y suma ruido/escarcha según posición del cursor y scroll. La capa de texto continúa como HTML.
- Se generaron tres imágenes originales con personas investigando hielo y se sirvieron como WebP. Marca, expediciones, datos y copy son ficticios.
- `GuideFrame` y `Button` son las piezas Trama; shader y composición quedan locales por ser una firma de la demo.

## Diferencias con la referencia

Igloo usa una escena 3D continua, objetos de hielo modelados proceduralmente, partículas con formas de volumen y UI con efectos WebGL. POLARIS no reutiliza su código, activos ni estructura de portfolio: transforma solo la relación entre escena, scroll y cambio de imagen en una refracción sobre arte original, y organiza el sitio como archivo de ciencia ciudadana. El shader de POLARIS es una lámina visual en WebGL, no una escena 3D ni una simulación científica.

## Aprendido

La extracción automática del sitio premiado no alcanzó para entenderlo: el DOM queda vacío porque la interfaz está dibujada en WebGL, así que `trama-research` necesitó Cine por gesto y por shader, además del caso de Awwwards. El primer QA se lanzó por error contra la raíz porque `qa:visual-text` usa `--path`; al auditar la ruta correcta aparecieron desbordes en 320 px y contraste en el folio sobre fondo claro. Se corrigieron ambos antes de cerrar. El shader local cumple la prueba de WebGL, pero no pretende igualar una escena tridimensional, la generación procedural de hielo ni el volumen de partículas de Igloo.

## Siguiente

Revisión del usuario en `http://127.0.0.1:3450/demo/polaris-archivo`; si pide otra pasada, conservar el concepto y cambiar los aspectos que señale. Sin push ni publicación.
