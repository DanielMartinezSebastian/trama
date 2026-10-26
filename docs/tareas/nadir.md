# NÁDIR: una expedición contada con scroll

- Objetivo: web de ficción de tres rutas con un objeto Three.js que une y acompaña el relato; composición cinematográfica, móvil y movimiento reducido.
- Rama y worktree: `feat/cine-captura`, `C:/COMPARTIDO/trama-cine`, base `01356ff`. Se conservan los cambios anteriores de Voz de la Tierra y las herramientas de Codex.
- Rutas: `/sitios/nadir`, `/sitios/nadir/descenso`, `/sitios/nadir/hallazgo`.
- Implementación: `components/sites/nadir/`, registro en `lib/sites/index.ts` y carga dinámica en `components/sites/SiteRouter.tsx`.
- Diseño: azul abisal, mineral, hielo y cobre; Archivo para titulares, Instrument Sans para lectura e IBM Plex Mono para datos.
- Objeto: cuatro anillos segmentados con marcas de medición y núcleo facetado. Geometría y entorno de iluminación procedurales, sin descargas externas. El motor `useScrollStory` controla su apertura y pose; la escena persiste al cambiar de ruta.
- Interacciones: navegación por capítulos, desplazamiento al primer paso, audio sintetizado opcional, revelado del mensaje y descarga real del diario como TXT.
- Accesibilidad: enlace para saltar al relato, foco visible, capítulos con `aria-current`, ilustración estática sin WebGL o con movimiento reducido.
- Servidor usado para revisión: `http://localhost:3000` (servidor existente del usuario; no se detuvo ni reinició). El intento de iniciar 3006 se cerró al detectar ese servidor.
- Verificación: `npm run verify` correcto, incluido typecheck, catálogo de 29 webs, sombras y pruebas de cine. `git diff --check` correcto.
- Build: compilación de producción correcta, 414 páginas generadas. El primer intento dentro del sandbox no pudo descargar Google Fonts; con acceso de red pasó. Avisos de fuentes de reserva y trazado de archivos del laboratorio ya existentes. Después se afinó tipografía y desplazamiento lateral, comprobados en dev y con typecheck; no se repitió el build al detectar el dev activo.
- Prueba reproducible: `node --import tsx scripts/qa/nadir.mts http://localhost:3000`. Nueve comprobaciones correctas: audio, scroll, navegación conservando canvas, mensaje y descarga, entradas directas, móvil, movimiento reducido, anchuras 320/768/1920 y ausencia de WebGL. Cero errores de JavaScript o consola en el recorrido principal.
- Evidencia local (ignorada por Git): `.refs3d/nadir/qa/` contiene ocho capturas, el diario descargado y `resultado.json`. Las imágenes se revisaron visualmente; el objeto se desplaza hacia el lado opuesto al texto para mejorar la lectura.
- Cine: `cine:capture` con scroll, 95 fotogramas y 15 imágenes; `cine:analyze` correcto. Informe en `.refs3d/nadir/captura/informe.html`.
- Estado: implementación terminada; lista para revisión visual del usuario. No se han hecho commits ni despliegues.

## Actualización visual posterior

Las propuestas de revisión se aplicaron por petición del usuario. Registro, decisiones, pruebas y mediciones antes/después en `docs/tareas/nadir-revision.md`, sección «Mejoras aplicadas». El primer capítulo baja de 247 a 20 llamadas de dibujo por fotograma; las once comprobaciones de QA y el build aislado pasan. El servidor de revisión continúa en http://localhost:3000/sitios/nadir.
