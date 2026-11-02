---
titulo: VeraVeda, recuperar margen en las imágenes
fecha: 2026-11-01
tipo: concepto
estado: hecho
referencias: [https://www.veraveda.es/]
fichas: [docs/tareas/veraveda.md]
ruta: http://localhost:3021/imagenes.html
codigo: [proyectos/veraveda/research/apply-image-edits.mjs, proyectos/veraveda/research/integrate-image-edits.mjs, proyectos/veraveda/src/styles.css]
colores: [#f1f3dc, #163d32, #ffc4af, #e4e6fc]
fuentes: [Cormorant Garamond, DM Sans]
sector: [bienestar]
guia: [estudio boutique, academia de autor, lujo tranquilo]
tono: [sereno, cercano]
paleta: [fondo claro]
tipografia: [serif con cursiva, titular gigante]
patrones: [galería editorial]
movimiento: [movimiento reducido respetado]
piezas: []
piezas-nuevas: []
relacionados: [veraveda-herbario, veraveda-pulso, veraveda-marea]
---

## Concepto

El usuario señala imágenes cortadas y pide mejorarlas con imagegen. Se revisan los originales, las máscaras y los marcos de las tres propuestas. Se preparan ediciones independientes para recuperar resolución, margen y continuidad sin cambiar las personas de referencia.

## Qué se midió

Dimensiones y contenido de las fotografías originales; formatos de los marcos en portada, historia, escuela y selector. Los recortes personales son pequeños, con bordes dentados. El bodegón pierde la pera al entrar en su marco vertical.

## Qué se hizo

Seis ediciones con referencias locales: Mari en el columpio, grupo de formación, manos, foto de viaje, bodegón botánico y paisaje costero. Se preservan originales y se publica comparación antes/después en /imagenes.html. Los marcos usan contain en personas y objetos; el paisaje se centra con espacio alrededor de su roca. PNG finales y manifiesto en proyectos/veraveda/ediciones-imagegen, WebP versionados en dist/assets. Los retratos mantienen alfa y añaden margen en CSS. La vista local de PNG mostraba color en píxeles transparentes: se comprueba también el alfa y el resultado real en navegador.

Comprobación específica: seis recursos entre 1024 y 1774 px de ancho, dos con transparencia; 63 combinaciones de página y ancho, sin fallos de carga ni recorte por cover en personas/objetos. Capturas en proyectos/veraveda/qa/; revisión visual de portadas, escuela e historia. Build, tipos y sombras correctos. El verify global sigue bloqueado por las 39 fichas de catálogo desactualizadas de la sesión anterior.

## Diferencias con la referencia

La restauración generativa puede cambiar detalles finos de rostros o tejidos; los fondos reconstruidos no son evidencia del lugar. Se identifica la edición en los textos alternativos y la página de procedencia.

## Aprendido

Ampliar una imagen no resuelve por sí solo su encuadre: hay que conservar el margen también en el CSS. La fotografía completa y el marco deben revisarse juntos en móvil y escritorio.

## Siguiente

Revisión del usuario en la comparación antes/después. Conservar los originales para ajustar cualquier detalle de identidad o de la reconstrucción.
