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
patrones: [relato por scroll, escena Three.js procedural, partículas en profundidad, cambio de cámara, archivo filtrable, ficha modal, lectura en capas]
movimiento: [malla de fragmentos instanciados que se abre con scroll, cámara con profundidad y paralaje de puntero, núcleo 3D, partículas en volumen, corte de luz entre capítulos, movimiento reducido respetado]
piezas: [Button]
piezas-nuevas: []
relacionados: []
---

## Concepto

POLARIS es un archivo ficticio de expediciones antárticas, inspirado en el uso de WebGL de Igloo Inc. La primera versión no conservó la firma de la fuente: el filtro GLSL sobre una foto sustituyó una escena 3D y se registra aquí como falla de fidelidad, no como resultado logrado. La versión revisada reemplaza ese filtro por una escena R3F/Three original. Awwwards documenta en Igloo una introducción en tiempo real, transiciones de escarcha/desplazamiento, bloques de hielo procedurales y partículas. La demo usa otra metáfora: observar lo que las personas registran bajo el hielo.

## Qué se midió

La web original se abrió en 390×844 y 1440×900 con `cine:web` (32 pasos por viewport), `refs:probe`, `cine:explora` y `cine:sonda`. La página oculta el scroll normal y representa el contenido visualmente: el mapa DOM encontró una sola superficie y ningún titular, así que se revisaron las capturas. La sonda observó Three.js r165, 9 escenas gráficas, shaders, targets y posprocesado; la exploración registró cambios ante puntero, rueda y clic. El caso oficial de Awwwards completa lo que no revela el DOM: navegación de tres secciones, shaders propios, ice blocks procedurales y simulación interactiva de partículas. Informes y SHA-256 de capturas en `docs/estudios/igloo-inc-webgl.md`.

## Qué se hizo

- Se integró `/demo/polaris-archivo` en `/demos` en una categoría WebGL.
- Se creó un relato de una página con portada, valores de muestra, sección explicativa, archivo filtrable, fichas modales y un formulario sin envío.
- La escena Three propia contiene un núcleo cristalino, 96 fragmentos instanciados que se separan y vuelven a agruparse según el recorrido, 420 puntos de corriente y cámara con profundidad/paralaje al puntero. Los actos enlazan con el scroll y un corte de luz marca el relevo. La capa de texto continúa como HTML.
- Se generaron tres imágenes originales con personas investigando hielo y se sirvieron como WebP. Marca, expediciones, datos y copy son ficticios.
- `Button` es la pieza Trama reutilizada; la escena y composición quedan locales porque describen esta expedición. Se retiró `GuideFrame`: no aportaba al encuadre de lienzo cinemático.

## Diferencias con la referencia

Igloo usa una escena 3D continua, objetos de hielo modelados proceduralmente, partículas con formas de volumen y UI con efectos WebGL. POLARIS mantiene la relación entre scroll, objeto/cámara, profundidad y cambio de actos, con núcleo, formas y partículas propios; no reutiliza código, assets, marca ni textos de Igloo. La investigación no certifica una réplica fotograma a fotograma: los reportes están en `docs/estudios/igloo-inc-webgl.md`.

## Aprendido

La extracción automática no bastó para entender el sitio; Cine por gesto y shader, además del caso de Awwwards, aportó la técnica. El fallo inicial sucedió después: se clasificó la fidelidad como inspiración temática, dejando que la estructura de archivo y la guía del kit desplazaran el medio estudiado. Para que no se repita, `trama-research` define como predeterminado «inspiración con fidelidad de firma» para webs premiadas/pseudo-clon; la matriz marca medio y coreografía como decisiones verificables; `trama-build` exige capturar el momento de firma antes de construir el resto. Los atlas `knowledge/references/cinematic-webgl.md` y `design-directions.md` se distribuyen con el conocimiento de agente. El piloto histórico P4/P4c midió salon/boutique, no WebGL ni variedad; no demuestra que agentes externos ya hayan aprendido el arreglo.

## Siguiente

Revisión del usuario en `http://127.0.0.1:3450/demo/polaris-archivo`; si pide otra pasada, conservar el concepto y cambiar los aspectos que señale. Sin push ni publicación.
