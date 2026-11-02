---
titulo: El circo de Halloween de los Astorga
fecha: 2026-10-31
tipo: concepto
estado: hecho
referencias: []
fichas: [docs/tareas/circo-astorga.md]
ruta: http://localhost:3018
codigo: [proyectos/circo-astorga/dist/index.html, proyectos/circo-astorga/dist/style.css, proyectos/circo-astorga/dist/app.js]
colores: [#f2e4c4, #281d24, #9f2434, #e2b64d]
fuentes: [Georgia, Trebuchet MS]
sector: [cultura, eventos]
guia: [lúdico]
tono: [familiar, festivo, con humor]
paleta: [fondo claro, acento rojo, papel cálido]
tipografia: [titular gigante, serif con cursiva]
patrones: [collage de fotos, galería editorial, filtro por categoría, relato por scroll, billete troquelado, sombra dura desplazada]
movimiento: [movimiento reducido respetado, scroll suavizado]
piezas: []
piezas-nuevas: []
relacionados: []
---

## Concepto

Cómic fotográfico del circo que la familia Astorga montó para un concurso de Halloween. El usuario pide un proyecto desde cero con sus imágenes. Se crea una web estática independiente y portable; no se modifica el kit ni la aplicación Next.

## Qué se midió

49 originales y sus 49 copias web con miniaturas. Comprobaciones de referencias a fotos, enlaces internos y sintaxis. Revisión visual con capturas de escritorio y móvil; los resultados definitivos quedan en el registro de tarea.

## Qué se hizo

Portada de cartel, entrada al circo, maquillaje, reparto, foto familiar final y álbum con filtros. Ampliación con dialog nativo, flechas, Escape y retorno de foco. Fuentes del sistema y tokens de color; no hay recursos de terceros ni sonido automático.

## Diferencias con la referencia

No es una réplica de una web. Las referencias son fotografías familiares y los bocadillos son ficción editorial identificada en el pie. Se conservan los originales y se generan copias optimizadas.

## Aprendido

La secuencia de maquillaje permite contar una historia con fotografías reales, además de mostrarlas como álbum. La foto colectiva necesita conservar el encuadre completo. Un proyecto estático permite continuar pese al fallo de tsx al consultar os.userInfo en este entorno Windows; los generadores compatibles también pueden ejecutarse con el soporte TypeScript nativo de Node.

## Siguiente

Recoger los nombres de los personajes si la familia quiere personalizarlos. Publicar solo cuando el usuario solicite compartir el proyecto local.

## Revisión del reparto

Se añaden al capítulo los retratos del personaje con falda azul, el personaje vestido de blanco y el forzudo. Habían quedado únicamente en el álbum. Revisión del reparto frente a la foto colectiva: 14 integrantes en 11 fotografías del capítulo, con una foto de tres y otra de dos. Comprobados los encuadres completos en móvil y escritorio y la ampliación de los tres nuevos retratos por Tailscale HTTPS.
