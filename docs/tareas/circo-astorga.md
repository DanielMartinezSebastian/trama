# Tarea: circo de Halloween de la familia Astorga

- Objetivo: proyecto web independiente, en forma de cómic fotográfico, con las imágenes del circo y la familia aportadas por el usuario.
- Rama / commit / worktree: feat/evolucion-agentes / 0869858 / C:/COMPARTIDO/trama-evolucion-agentes. Árbol limpio al iniciar; sin cambios ajenos.
- Proyecto: proyectos/circo-astorga. Sitio estático en dist/. No necesita build ni dependencias para servirlo con su servidor Node. Los scripts de preparación y QA usan sharp y Playwright del repositorio padre.
- URL local: http://localhost:3018. Servidor propio: node proyectos/circo-astorga/server.cjs. Puerto por defecto 3018, configurable con PORT.
- Cambios: portada, capítulos de decorado, maquillaje y personajes, foto final, álbum completo con filtros y ampliación accesible. Las dos últimas fotos se incluyen en una nueva fila del reparto: el dúo de circo y el bebé con disfraz de mono.
- Recursos: 49 fotografías optimizadas a WebP y sus miniaturas en dist/assets/. Los JPEG de .ovis se conservan. Clasificación: 20 imágenes del decorado y 29 de la familia.
- Decisiones: proyecto local independiente pedido por el usuario, sin modificar Next ni el kit. Paleta mediante tokens, fuentes del sistema, sin servicios externos ni publicación. Los diálogos son ficción editorial señalada en el pie, sin nombres individuales ni resultados del concurso inventados.
- Comprobaciones: check.cjs valida archivos, escenas, enlaces y sintaxis; qa.cjs revisa 320, 390, 768 y 1440 px, carga de imágenes, desbordamiento, filtros, modal, flechas, Escape, retorno del foco, movimiento reducido y contraste con axe. Informes y capturas en proyectos/circo-astorga/qa/ (ignorados).
- Verificación del repositorio: npm run verify pasó typecheck y falló en catalog:check por os.userInfo / uv_os_get_passwd ENOMEM dentro de tsx. npm run doctor y npm run smoke fallaron por la misma causa. La ejecución equivalente nativa de doctor y smoke con node --experimental-strip-types funciona; smoke devuelve HTTP 200, cero errores y cero sombras oscuras. También pasan check-text-shadow.mts y cuaderno.mts --check en ejecución nativa.
- Cuaderno: docs/cuaderno/circo-astorga.md; generado el índice con node --experimental-strip-types scripts/cuaderno.mts después de que npm run lab:cuaderno fallase por tsx.
- Límite: la verificación global del repositorio no queda completada por el fallo de tsx. Este proyecto estático no usa el build de Next ni su .next.
- Siguiente paso: revisión del usuario; personalizar nombres y narración si se solicitan.

## Acceso Tailscale

Servidor adicional enlazado exclusivamente a 100.105.191.78:3018 mediante HOST. URL: http://100.105.191.78:3018. Comprobado HTTP 200 desde el equipo anfitrión; acceso desde otro dispositivo pendiente de la conexión a la misma red Tailscale. El servidor local en 127.0.0.1:3018 se conserva.

## Corrección del acceso remoto

El usuario indica que el enlace directo al puerto 3018 no carga. Se comprueba HTTP 200 en loopback y en IP Tailscale local, sin confirmar acceso remoto. Tailscale está Running. Se añade Tailscale Serve privado en /circo-astorga hacia http://127.0.0.1:3018, conservando la raíz existente hacia 7317. Nueva URL: https://drasw.tailf76b18.ts.net/circo-astorga/. Se verifica HTTP 200 por HTTPS en página, CSS, manifiesto de fotos y una fotografía. No se modifica firewall ni se activa Funnel.

## Reparto completo

Corrección solicitada por el usuario: faltaban en el capítulo del reparto el personaje de la falda azul, el vestido de blanco y el forzudo; solo estaban en el álbum. Se añaden tres viñetas con las fotos 161524-9c8dd499, 161526-be6ac03b y 161528-bff811d8. El capítulo tiene ahora 11 fotos de reparto que representan a los 14 integrantes (una foto de tres personas y otra de dos). Revisadas las capturas de 1440 y 390 px con encuadres completos; comprobadas las tres ampliaciones a través de la URL HTTPS real. check.cjs, qa.cjs y smoke nativo pasan. npm run verify vuelve a pasar typecheck y falla por el mismo error previo de tsx/os.userInfo.

## Ediciones imagegen de toda la familia

Solicitud: mejorar una a una las imágenes con un fondo de circo tenebroso usando imagegen de OpenAI. Completadas 29 ediciones individuales con la herramienta integrada, revisando cada original y cada resultado. Guardadas en proyectos/circo-astorga/ediciones-imagegen/ con prompts.json y manifest.json; versiones web en dist/assets/circo-tenebroso/. Fotos originales preservadas y enlace Ver original en el visor. Todas incorporadas a la web; se mantienen las 20 fotos del decorado real. Ajustados los retratos del reparto para evitar recortes y cartelas sobre las caras.

Validación: check.cjs y qa.cjs pasan; prueba HTTPS confirma 29 ediciones y acceso al original. Smoke nativo sin errores ni sombras. npm run verify pasa typecheck y vuelve a fallar en catalog:check por el error previo tsx/os.userInfo ENOMEM. Ficha de este ejercicio: docs/cuaderno/circo-astorga-imagegen.md.

## Circo e interior más sombríos

Solicitud adicional: editar también las imágenes del circo y su interior. Completadas 20 ediciones individuales de iluminación nocturna con OpenAI image_gen integrado, inspeccionando cada original y salida. Se mantienen reconocibles la entrada, los materiales, los dibujos y las decoraciones del montaje. Son recreaciones generativas, con sombras frías, luz roja tenue y puntos cálidos.

Las 20 salidas PNG y versiones web se incorporan al manifiesto junto a las 29 familiares: total 49. Prompts específicos en ediciones-imagegen/prompts-circo.json y conjunto completo en prompts.json. apply-editions.cjs aplica todas las imágenes y mantiene originalSrc. El visor permite abrir también el original del decorado. Se identifica la recreación del ambiente en el pie.

Validación: check.cjs comprueba 29 cambios de fondo y 20 de iluminación, y sus originales; qa.cjs pasa en cuatro anchos. Inspección visual de las viñetas de entrada, pasillo y cartel a 1440 y 390 px. Prueba por HTTPS confirma las 20 ediciones del circo y acceso a su original. Ficha: docs/cuaderno/circo-astorga-noche.md.

## Telón y galería minimalista para móvil

El usuario recuerda una animación de telón y pide mejorar la galería para móvil. Encontrada la variante curtain de PageTransition en el catálogo y ui-view-transitions.css. Se adapta su apertura central con dos paños plegados al proyecto estático, una vez por sesión al entrar en portada y al pulsar la entrada al cómic, respetando movimiento reducido y trasladando el foco al capítulo.

Álbum sin marcos ni rótulos repetidos; fotografías completas, dos columnas móviles y carga inicial de 12 con Ver más fotos. La distribución incremental conserva posiciones. Visor móvil de pantalla completa con gesto horizontal, bloqueo del fondo, flechas, Escape, cierre y retorno de foco; se conserva Ver original.

Validación: qa.cjs pasa en cuatro anchos. qa-mobile.cjs pasa por HTTPS con eventos táctiles de Chromium, telón, columnas, estabilidad al cargar más, swipe y cierre. Capturas revisadas en qa/telon-mobile.png, album-minimal-mobile.png y visor-minimal-mobile.png. El kit y Next no se modifican. Ficha: docs/cuaderno/circo-astorga-galeria-telon.md.

## Ampliación y publicación privada

Incorporadas las 14 fotos nuevas, incluida 185123-9a0e4587. Total 63: 43 familia y 20 circo; las últimas 14 preservan su fondo original. Preparación reproducible con additional-photos.json; comprobaciones y QA actualizados. Open Graph y Twitter Card con JPEG 1200 × 630, canonical y URL configurados durante build para Vercel. Repositorio de publicación independiente en .cache/publicacion-circo-astorga, sin incluir la librería Trama ni PNG maestros.

Publicación completada: repositorio privado DanielMartinezSebastian/circo-astorga (main), Vercel conectado a GitHub, producción https://publicacion-circo-astorga.vercel.app/. HTTP 200 público; Open Graph y Twitter Card usan URL absoluta de producción e imagen JPEG 1200 × 630. QA de producción confirma 43 familiares, última foto grupal en visor móvil, sin errores. Servidor local reiniciado: sesión 98473, puerto 3018; Tailscale intacto. npm run verify pasa typecheck y vuelve a fallar por el problema previo de tsx/os.userInfo ENOMEM. Smoke y doctor nativos pasan.

## URL definitiva e imagen Open Graph elegida

Proyecto Vercel renombrado a circo-astorga y dominio permanente https://circo-astorga.vercel.app/. Se mantiene publicacion-circo-astorga.vercel.app para preservar la URL exacta de la imagen elegida: assets/circo-tenebroso/161201-29f51391.webp. Open Graph y Twitter usan esa URL exacta, MIME image/webp y dimensiones 1445 × 1088. Canonical y og:url apuntan al dominio corto. Commit b5bac92 subido al repositorio privado. Despliegue dpl_AXfoRGofMmXJcey1DbNpjQMr7wYP READY; comprobaciones HTTP 200 de web e imagen, QA móvil de producción completa sin errores.

## Historia ampliada con el interior

Solicitud: intercalar imágenes del circo con mensajes para alargar el cómic. Diez fotos distribuidas en cinco escenas: pasillo secreto tras maquillaje, ruidos entre los dos actos del reparto, público de huesos antes de más personajes, última curva antes del dúo y bebé, secreto del circo antes del final. Cartelas y diálogos ficticios. Fotografías completas y ampliables, con texto fuera de la imagen. Layout móvil de una columna; todos los personajes y metadatos se conservan. QA local y smoke pasan. npm run verify pasa typecheck y falla nuevamente en tsx/os.userInfo ENOMEM; doctor nativo funciona.

Publicación: commit d8f266b en main del repositorio privado; despliegue dpl_BGw2KrAjH4xLxM3ZBgcXQ4XXEt4j READY y alias https://circo-astorga.vercel.app/. Inspección visual de las nuevas escenas a 1440 y 390 px: fotos completas y textos legibles, sin recortes ni superposiciones.
