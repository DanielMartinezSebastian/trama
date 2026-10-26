# Revisión de NÁDIR — 2026-10-26

- Objetivo: revisar la experiencia actual y proponer mejoras; sin cambios de implementación.
- Rama / commit / worktree: `feat/cine-captura` / `01356ff` / `C:/COMPARTIDO/trama-cine`.
- URL: http://localhost:3000/sitios/nadir (servidor existente, sin reiniciar).
- Se conservan todos los cambios previos del worktree.
- Fuentes: revisión visual actual de las tres rutas en 1440×900 y de señal en 390×844; código de NÁDIR; informe `.refs3d/nadir/captura/informe.html` y `ficha.json`.
- Evidencias nuevas (ignoradas): `.refs3d/nadir/revision/`, capturas de apertura y segundo paso de cada capítulo, móvil y resultado smoke.

## Propuestas por prioridad

1. Proteger titulares, cuerpo y cifras de la geometría. En el segundo paso de señal el anillo claro cruza el inicio del titular y compite con −08°; también se acerca al texto en descenso. Ajustar escala, posición y límites de encuadre por paso; reservar un área de lectura. Comprobar también las transiciones entre lados.
2. Dar una dirección cinematográfica diferente a cada capítulo. La señal: objeto más oculto, contraluz y pulso. Descenso: aproximación y separación de anillos. Hallazgo: núcleo dominante, apertura y pausa. El informe mide cámara fija y FOV 46 en la captura del primer capítulo; el código cambia principalmente el objeto y solo aproxima ligeramente la cámara entre capítulos.
3. Afinar materiales e iluminación. Los tubos y núcleo aparecen muy brillantes y uniformes. Reducir luz de relleno y reflejos generales, introducir variación moderada de rugosidad y una luz de borde. Conservar la paleta actual y evaluar el resultado antes de añadir posprocesado.
4. Composición móvil específica. El panel oscuro garantiza lectura, pero oculta gran parte del objeto. Situar el mecanismo en una zona superior, recortarlo deliberadamente y colocar el texto debajo; permitir una pose distinta durante la lectura. Aumentar textos de navegación y datos útiles: hoy varios están entre 7 y 9 px.
5. Ajustar ritmo y cierre. Los pasos mantienen una estructura muy parecida, cada uno de al menos 115svh en escritorio. Variar duración según contenido, introducir una pausa de apertura y reforzar el desenlace. El progreso del hallazgo llega a 100% en el último paso antes del mensaje: incluir la revelación en el significado del indicador o explicitar que mide los registros.
6. Reducir coste de render. El informe previo registra 242–249 llamadas por fotograma y unos 35.000 triángulos: priorizar agrupar o instanciar marcas, piezas repetidas y fragmentos; compartir geometrías/materiales. Objetivo inicial de menos de 100 llamadas, a validar con nueva medición y sin asumir mejoras de FPS. Evaluar pausa de animación con pestaña oculta y calidad adaptativa.
7. Vincular audio al relato. Actualmente son tres tonos constantes; introducir un pulso reconocible y cambios suaves por capítulo, manteniendo activación voluntaria y sin depender del sonido para entender la historia.

## Comprobaciones

- `npm run doctor -- --cine --browser`: correcto; aviso de `.env.scripts` ausente, innecesario para esta revisión.
- `npm run smoke -- http://localhost:3000/sitios/nadir --out .refs3d/nadir/revision`: HTTP 200, sin errores JavaScript/consola.
- `npm run verify`: correcto. Aviso de deprecación de importación CJS de Three existente.
- Sin build: no se modifican rutas, CSS ni código; se conserva el servidor del usuario.
- Las cifras de render pertenecen al informe previo, no son un perfil de rendimiento nuevo. La captura del informe cubre el primer capítulo, no toda la expedición.
- Siguiente paso: corregir encuadres y definir tres momentos de cámara/luz antes de añadir efectos; volver a capturar las tres rutas y comparar.

## Mejoras aplicadas — 2026-10-26

- Autorización: «aplicala», después de la revisión. Se conserva rama, worktree y servidor `http://localhost:3000`; no se modifican trabajos ajenos.
- Archivos: `components/sites/nadir/Scene.tsx`, `Site.tsx`, `nadir.css`; prueba ampliada en `scripts/qa/nadir.mts`.
- Encuadre: objeto dimensionado según el viewport, área de lectura reservada, cifras junto a su texto y reducción del objeto mientras cambia de lado. Móvil y tablet usan objeto superior y lectura inferior, sin panel opaco sobre el mecanismo. Navegación y datos más legibles.
- Puesta en escena: cámara con dolly por capítulo y scroll, luz de relleno reducida, contraluz que pasa del cobre al color de señal, rugosidad distinta por anillo y núcleo más presente al abrir el mensaje. Fondos diferenciados por capítulo; cierre continuo con el pie.
- Ritmo: alturas de pasos diferentes y mesetas de reposo. Hallazgo incluye el mensaje en el recorrido y conserva 99% hasta abrirlo; la prueba comprueba el salto a 100%.
- Audio opcional: pulso cada 38 segundos, primera entrada al activar, y frecuencias que evolucionan suavemente con capítulo, avance y revelación. Se conserva la activación voluntaria y el cierre del AudioContext al salir.
- Render: segmentos, juntas, marcas y fragmentos instanciados. El bucle se pausa con la pestaña oculta y el tiempo de animación evita saltos grandes al volver. DPR limitado a 1–1.5; sin adaptación automática de calidad ni efectos de posprocesado adicionales.
- Medición del primer capítulo, misma orden de captura que la referencia: **247 → 20 llamadas/fotograma (~92% menos)**, **34.768 → 33.296 triángulos**, una pasada. No implica un incremento de FPS medido. La cámara pasa de fija a dos tramos detectados con dolly; altas luces recortadas de ~0,18% a ~0%.
- Evidencias (ignoradas): `.refs3d/nadir/mejoras/captura/`, `descenso/`, `hallazgo/` (vídeo, hoja de contacto, ficha e informe); `comparacion/` (antes/después); `qa/` (capturas, diario y resultado); `smoke/` y `produccion/`. La captura original de cine se conserva en `.refs3d/nadir/captura/`. Las imágenes de `.refs3d/nadir/revision/` se actualizaron durante la iteración.
- El comparador describe cambios, no una puntuación de calidad: los alejamientos de cámara, luz y composición son intencionales. Los textos señalados como ausentes por el muestreo siguen presentes en DOM y en las pruebas funcionales.
- Verificación: `doctor --cine --browser`, `verify`, once comprobaciones Playwright de NÁDIR y smoke de dev correctos; cero errores JS/consola. Revisión visual de capturas y secuencias de las tres rutas, móvil 390px, 320/768/1920px, movimiento reducido y ausencia de WebGL.
- Producción: build de 414 páginas en copia aislada `C:/COMPARTIDO/trama-nadir-check-20261026`, con `npm ci`, dependencias y `.next` propios. Smoke en puerto temporal 3016 correcto; servidor temporal cerrado. Se conservó el dev del usuario. Avisos ya conocidos de fuentes de reserva y trazado del lab. Log en `.refs3d/nadir/mejoras/build.log`.
- Estado: cambios aplicados, sin commit ni despliegue. Siguiente paso: revisión del usuario en la URL original.

## Coreografía y corrección del recorte

El usuario pidió sustituir los fundidos de texto por transformaciones físicas del mecanismo. Estado actual y pruebas en `docs/tareas/nadir-coreografia.md`: poses, zoom, despiece y reagrupación por segmentos, textos sin fundido, modelo completo y centro conservado en los finales. Esta decisión prevalece sobre las propuestas previas de ocultación del modelo con degradados.
