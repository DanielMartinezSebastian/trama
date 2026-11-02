---
titulo: VeraVeda, restaurar las imágenes pendientes sin tocar las conversaciones
fecha: 2026-11-01
tipo: concepto
estado: hecho
referencias: [https://www.veraveda.es/]
fichas: [docs/tareas/veraveda-imagenes-completas.md]
ruta: http://localhost:3021/imagenes.html
codigo: [proyectos/veraveda/research/imagegen-remaining.json, proyectos/veraveda/research/apply-remaining.mjs, proyectos/veraveda/research/integrate-remaining.mjs, proyectos/veraveda/remaining-qa.mjs]
colores: [#074a3f, #c09ca3, #e8e4ac]
fuentes: [Bastoni, Lora]
sector: [bienestar]
guia: [academia de autor]
tono: [cercano, personal]
paleta: [fondo oscuro, acento verde]
tipografia: [serif con cursiva]
patrones: [galería editorial, relato por scroll]
movimiento: [movimiento reducido respetado]
piezas: []
piezas-nuevas: []
relacionados: [veraveda-origen, veraveda-imagenes, veraveda-herbario, veraveda-pulso, veraveda-marea]
---

## Concepto

Tras recuperar el contenido completo, el usuario pide mejorar con imagegen las imágenes aún pendientes, excluyendo expresamente las capturas de WhatsApp. Se identifican 20 fotos e ilustraciones sin restaurar; se mantienen intactas las diez capturas de opiniones y los cuatro logotipos.

## Qué se midió

38 archivos originales clasificados por uso, resolución y transparencia. Cuatro fotos de origen ya tenían restauración en el ejercicio anterior; otras dos ediciones anteriores eran ambientes nuevos. Se guardan huellas de los 38 originales, las seis ediciones y el JSON de contenido para comprobar que no cambian los archivos protegidos ni los textos.

## Qué se hizo

Se preparan veinte llamadas independientes de edición con referencia original, composición conservada, alfa cuando lo tenía y restricciones de identidad. En el retrato de graduación se exige conservar «Nótese mi cara de felicidad». Las miniaturas del carrusel permanecen de espaldas; no se generan rostros nuevos. La imagen del pie mantiene su recorte deliberado sin inventar cabeza o torso.

## Diferencias con la referencia

La restauración generativa puede introducir variaciones en detalles, especialmente en las imágenes de 95 px. No se convierten estas imágenes en pruebas de resultados ni en documentación nueva. Las capturas con testimonios y los logotipos no pasan por imagegen.

## Aprendido

El inventario debe distinguir fotografías de opinión y capturas de conversaciones: restaurar una imagen de contexto no autoriza a regenerar el texto de una reseña. La conservación de los archivos protegidos se comprueba además por su huella digital.

## Siguiente

Integradas las veinte restauraciones tras revisar cada salida, también en Origen —Fiel a VeraVeda—, por petición expresa del usuario. Se mantiene el tamaño de presentación de las miniaturas y la composición de cada página. Comparación ampliada a veintiséis pares.

Validación: build de 21 documentos; 84 combinaciones de ruta y ancho con todas las sustituciones correctas y cero fallos; cotejo íntegro de textos, imágenes, secciones y llamadas en doce páginas. Huellas de los 38 originales, las seis ediciones anteriores y el JSON de textos sin cambios. Las diez capturas y los cuatro logotipos permanecen intactos. Revisión visual de inicio, historia y consultas en escritorio/móvil. Smoke oficial de Origen y `npm run verify` correctos. Un primer smoke cerró el navegador durante la captura; su repetición tras las otras capturas pasó sin errores ni sombras.
