---
titulo: VeraVeda Origen, fidelidad y lectura completa
fecha: 2026-11-01
tipo: réplica
estado: hecho
referencias: [https://www.veraveda.es/, https://www.veraveda.es/consultas-y-tratamientos, https://www.veraveda.es/sobre-mi]
fichas: [docs/tareas/veraveda-origen.md]
ruta: http://localhost:3021/origen/
codigo: [proyectos/veraveda/src/Origin.tsx, proyectos/veraveda/src/CompleteContent.tsx, proyectos/veraveda/src/original-content.json, proyectos/veraveda/src/complete-content.css]
colores: [#074a3f, #c09ca3, #e8e4ac, #fff7e1, #1b022f, #ecac48]
fuentes: [Bastoni, Lora]
sector: [bienestar]
guia: [academia de autor]
tono: [cercano, personal]
paleta: [fondo oscuro, acento verde]
tipografia: [serif con cursiva]
patrones: [relato por scroll, galería editorial, preguntas frecuentes]
movimiento: [movimiento reducido respetado]
piezas: [Button, Accordion, Carousel, Modal]
piezas-nuevas: []
relacionados: [veraveda-herbario, veraveda-pulso, veraveda-marea, veraveda-imagenes]
---

## Concepto

El usuario señala que faltaban imágenes y, especialmente, textos. Se corrige esa pérdida en las tres propuestas previas y se añade una cuarta fiel a estructura, paleta y activos de VeraVeda, con ajustes de lectura explícitos.

## Qué se midió

Navegador a 1440 y 390 px sobre las tres páginas originales. Inventario de 38 imágenes únicas; nueve secciones de inicio, catorce de consultas y siete de historia. Se extraen también las etiquetas que la fuente no marca como encabezados y las preguntas del acordeón.

Cotejo automático de las doce páginas principales de las cuatro versiones: 35, 56 y 22 bloques de texto por página, incluido el pie, sin omisiones; siete y doce llamadas en inicio y consultas, ninguna en historia. Las imágenes se contrastan por identificador de origen, no solo por número.

Veinte rutas a diecisiete anchos: cero errores, imágenes rotas, overflow o fallos de contraste. Treinta y tres estados de lectura con cero fallos: diálogos, retorno de foco, menú, FAQ abiertas y todas las historias del carrusel. Smoke oficial de las tres páginas principales de Origen con HTTP 200, sin errores ni sombras oscuras. La revisión de texto distingue las cabeceras solo para lector de pantalla de los textos visibles; las diapositivas inactivas están ocultas por diseño.

Par medido con refs:probe: 15 de 20 medidas cercanas. Informe en .refs3d/pares/veraveda-origen/par.md. Coinciden titular de 32 px, peso 600, tracking y fondos; diferencias restantes: interlineado 1,3 a 1,8, Lora romana en lugar de cursiva sostenida y alias de las familias, peso de los colores de texto, medidas de margen agregadas y margen móvil de 5 a 23 px. Son las diferencias de lectura declaradas, no una réplica píxel a píxel.

## Qué se hizo

Se conserva el orden de franjas verde/rosa/amarillo, columnas, tarjetas de acceso, mandala, retrato botánico, diez capturas de opiniones, siete servicios, cuatro historias en carrusel y biografía íntegra con infancia, universidad, hospital y viaje. Origen utiliza los originales; las otras propuestas mantienen las seis restauraciones aprobadas donde corresponden y recuperan el resto.

Texto de 18 px en escritorio y 17 px en móvil, interlineado de 1,8–1,85, contenido de lectura contenido y fotografías completas. Sobre rosa y dorado se usa la tinta de la paleta original para cumplir contraste. Se recuperan todos los párrafos, precios y duraciones, sin resumirlos.

El carrusel no avanza solo; sus flechas quedan fuera de la columna de texto y la fracción no captura clics. Los recursos mantienen el texto del aviso original y ofrecen el correo real porque la fuente no proporciona un formulario verificable. Los diálogos devuelven el foco al disparador mediante una adaptación local.

## Diferencias con la referencia

Se formaliza tipografía, semántica y espaciado; el color claro sobre rosa se reemplaza por tinta original. Se añade navegación móvil y una zona de comparación externa al contenido de marca. El enlace roto de escuela se dirige a los recursos locales. No se inventan cursos ni envíos.

Las afirmaciones de salud e historias se reproducen como contenido de la web original, sin verificarlas clínicamente ni añadir nuevas. Las capturas de opiniones se conservan como imágenes y se pueden ampliar; no se reescriben ni se editan con IA.

## Aprendido

Una reinterpretación visual puede perder la voz del autor si se reduce el texto antes de inventariarlo. La cobertura se debe comprobar por párrafos, imágenes, acciones y secciones. Una captura bonita no demuestra que la biografía, las respuestas y los servicios estén completos.

## Siguiente

Revisión del usuario en /origen/ y /contenido.html. Conservar el cotejo como control ante cualquier edición posterior de los textos.
