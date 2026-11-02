# VeraVeda · recuperación de contenido y cuarta versión Origen

- Petición: volver a revisar la fuente, recuperar imágenes y textos omitidos y crear una cuarta versión estricta con estructura, colores y contenido originales, formalizando la lectura.
- Rama / commit / directorio: feat/evolucion-agentes / 5410a6f / C:/COMPARTIDO/trama-evolucion-agentes. Se conservan los cambios previos del mapa de skills, manifiestos y Circo Astorga.
- Servidor: el existente de proyectos/veraveda/server.mjs en http://localhost:3021/. No se modifica Next ni `.next`, ni se detienen servidores ajenos.
- Nueva versión: http://localhost:3021/origen/. Inicio, consultas, historia, escuela/recursos y contacto; las dos últimas se componen del material publicado en las páginas originales, sin inventar oferta.
- Skills: trama-research, trama-style, trama-build y frontend-design. El contrato real es el kit fuente 0.13.0; context.mjs no encuentra una instalación consumidora de trama-ui en este proyecto.

## Evidencia

Las tres páginas originales se vuelven a visitar con HTTP 200. Snapshot de DOM, capturas 1440/390, colores, bloques y recursos en proyectos/veraveda/research/source-audit/. HTML y PNG ignorados; inventarios JSON versionables. 38 imágenes originales únicas guardadas en dist/assets/original, sin recortes ni ediciones generativas. Se descargan Bastoni y Lora cursiva del original y Lora romana para los párrafos.

Se comprueba el comportamiento de Test y Meditación: abren un aviso de suscripción sin formulario ni destino verificable. Se conserva el mensaje y se ofrece el correo real. La escuela sigue enlazando a un marcador sin resolver en la fuente; se dirige a los recursos locales, sin temario ficticio.

## Cambios

- src/original-content.json: contenido íntegro obtenido del DOM con saneamiento de HTML. Incluye etiquetas de servicio, preguntas, precios, duración, imágenes y acciones.
- src/CompleteContent.tsx: lectura compartida, secciones completas, capturas ampliables, carrusel de las cuatro historias, FAQ íntegras y diálogos de recursos. Adaptación local para devolver foco; no se cambia el kit.
- src/Origin.tsx y complete-content.css: cuarta versión con la misma secuencia de nueve/catorce/siete secciones, columnas y colores exactos. Texto de 18/17 px, Lora romana e interlineado 1,8–1,85. Sobre rosa/dorado se usa tinta #1b022f de la paleta original, porque el claro original no cumple contraste. No se prometen métricas idénticas cuando se han cambiado para leer mejor.
- App.tsx: las tres propuestas conservan sus portadas y temas, pero recuperan el contenido completo de las tres páginas. Se incluye el pie original y se evita duplicar su contenido con el de navegación. Selector ampliado a cuatro.
- dist/contenido.html: inventario de textos e imágenes, procedencia y decisiones de lectura. dist/investigacion.html actualizado para no seguir afirmando que se omiten los testimonios.
- Build estático de 21 páginas. Recursos y fuentes locales; sin nuevas dependencias de manifiesto.

## Comprobaciones

- Doctor correcto, salvo avisos opcionales ya conocidos. Build y typecheck correctos.
- coverage-qa.mjs: doce páginas principales cotejadas; cero párrafos, imágenes, secciones o llamadas ausentes. Cada propuesta conserva las nueve secciones de inicio, catorce de consultas y siete de historia.
- qa.mjs: veinte páginas a diecisiete anchos de 320 a 1920, incluidos ambos lados de los breakpoints; imágenes, overflow, menú, filtros y FAQ. Informes en qa/, ignorados.
- repo-qa.mjs: herramientas oficiales de contraste y texto para las cuatro propuestas. Un intento de captura de Pulso/consultas abortó al navegar; repetido con éxito. Se revisan aparte las diapositivas inactivas del carrusel, ocultas por diseño.
- reading-states-qa.mjs: recursos abiertos, foco, las cuatro historias, diez opiniones ampliables, preguntas completas y menú; contraste en cada estado. La fracción del carrusel interceptaba inicialmente la flecha: corregido localmente.
- refs:probe original–Origen: 15/20 medidas cercanas; archivo .refs3d/pares/veraveda-origen/par.md. Diferencias de lectura explícitas: cursiva sostenida a romana, interlineado, parejas de color de texto y margen móvil. La estructura, fondos, activos y textos se conservan.
- verify global: se detiene en las mismas 39 fichas docs/agents desactualizadas, sin relación con estas rutas. No se regeneran archivos ajenos.
- Resultado final: qa.mjs pasa en veinte rutas a diecisiete anchos, sin errores ni incumplimientos de contraste. coverage-qa.mjs confirma cero ausencias de texto, imagen, sección o llamada en doce páginas. reading-states-qa.mjs pasa sus 33 estados, incluido el foco después de requestAnimationFrame. Smoke de inicio, consultas e historia de Origen: HTTP 200, sin errores ni sombras oscuras. Tipos y check:shadows correctos. Los avisos geométricos de encabezados source-sr-only se clasifican como contenido de accesibilidad deliberadamente recortado, no como texto visible; las capturas se inspeccionan a escala real.
- Concurrencia detectada al cerrar: aparecen cambios ajenos nuevos de Parla en componentes/DemoViewer.tsx, components/site/guias/GuideIndex.tsx, components/ui/GuideFrame.tsx, lib/demos-kit-landing.ts, lib/ui/guides.ts, scripts/build-catalog.mts, public/img/parla/ y scripts/inspect-preply.mjs. Se conservan. lab:cuaderno --check señala temporalmente docs/cuaderno/demo-parla.md sin título; no se edita esa ficha ajena. Origen tiene ficha completa y el índice se regenera con los contenidos existentes.

## Siguiente paso

Revisión del usuario en /origen/ y /contenido.html. Revisión de la titular antes de cualquier publicación e integración real de escuela/recursos. No se ha publicado ni modificado veraveda.es.
