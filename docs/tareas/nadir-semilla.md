# Tarea: Semilla articulada en NÁDIR

- Objetivo: esquemas, geometría 3D por piezas con texturas propias y sustitución del modelo de NÁDIR. Interior descubierto durante el segundo capítulo.
- Rama / base / worktree: `feat/cine-captura`, `baea28f`, `C:/COMPARTIDO/trama-estudios`. Servidor existente: http://localhost:3020/sitios/nadir. Se conservaron los cambios previos del satélite y Remada; no se detuvo el servidor.
- Cambios: `seed-model.ts` nuevo, `Scene.tsx` sustituye anillos por Semilla manteniendo poses/cámara/scroll, `Site.tsx` adapta la alternativa SVG. Exportador `scripts/gen-nadir-semilla.mts`; GLB, planos, texturas, manifiesto y README en `public/models/nadir-semilla/`. Prueba de rig `scripts/qa/nadir-semilla.mts`; prueba de transiciones adaptada para medir la nueva geometría. Ficha del cuaderno e índice.
- Decisiones: seis valvas con pivote propio inferior y tres materiales por casco; interiores con nervaduras físicas. Apertura por capítulo/progreso y despiece transitorio independiente. La demo construye directamente el modelo para animarlo; el GLB comparte geometría y dispone de clips Apertura/Despiece. Sin dependencias nuevas ni descargas de modelos.
- Comprobaciones: doctor --cine --browser, typecheck, prueba de geometría/rig/export, pruebas de transiciones (24 encuadres), QA completa de NÁDIR (audio, mensaje, descarga, rutas, móvil y alternativas). Smoke y captura/análisis de cine en `.refs3d/nadir/semilla/`. Ver ficha y resultados locales.
- No se tocaron rutas ni CSS. No se ejecutó build sobre el dev activo del usuario.
- Resultado final: verify pasa; apertura del segundo capítulo, entrada directa y regreso al primero comprobados. Cine: 51 fotogramas, sin cortes de cámara detectados; informe en `.refs3d/nadir/semilla/cine/informe.html`.
- Siguiente: listo para revisión visual; editar el constructor y ejecutar el exportador para iterar. Sin commits ni publicación.

## Ampliación: luz y mecánica (2026-10-28)

- Solicitud: luz interior, pausas abiertas y apertura creciente por URL, con mecánica que evite atravesar piezas.
- Archivos: seed-motion.ts nuevo; constructor, Scene, alternativa estática, exportador y pruebas actualizados.
- Solución: collar se retira primero; extracción radial, bisagras hacia fuera, topes y seis actuadores telescópicos. Rangos por capítulo sin solapamiento y pausas de 6 s cada 26 s. Luz puntual con sombras, filamentos y halo con oclusión.
- Pruebas: 324 configuraciones con holguras verificadas, GLB con luz y clips completos, navegador con reloj virtual y encuadres. Evidencias en .refs3d/nadir/mecanica/.
- Se trata de cinemática restringida, no de simulación de cuerpos libres. Se mantienen cámara, historial y soporte de movimiento reducido.

- Cierre de la ampliación: luz y pausa verificadas con reloj de cine; captura de 720 fotogramas, cero cortes y recorte 0,00 %. Remates del collar con 0,032 unidades de holgura; actuadores bajo la carcasa, longitud máxima 1,426. Envolventes y rig/exportación pasan.

## Ampliación: coreografía y lens flare

- Petición: transiciones con acciones visibles por sección y emisión mucho más fuerte con lens flare eventual.
- Cambios: seedStory con 12 poses mantenidas, despiece, energía y núcleo propios; descargas por entrada a sección, cada 18 s y al abrir el mensaje. seed-optics.ts nuevo: Lensflare de Three.js con oclusión, cinco elementos procedurales y preservación del alfa. Emisión máxima observada 125, comparada con 22 de reposo.
- Pruebas: nadir-destellos y nadir-destellos-browser, mecánica de 324 estados y encuadres de transiciones. Evidencias en .refs3d/nadir/destellos/.
- La escena no añade rutas, CSS, dependencias ni descargas externas; las ópticas son propias del render de la demo.

## Ampliación: escala y composición inspiradas en Quilate

- Referencia: /sitios/quilate; BEATS de Site.tsx y cámara de ringScene.tsx. Capturas en .refs3d/nadir/escala/quilate/.
- Cambios: seed-framing.ts y Scene.tsx. Se retira la esfera conservadora que anulaba el zoom y se miden cajas de las piezas. Generales grandes, macro del núcleo y transiciones centradas; recorte suave del lienzo para proteger el texto, ángulo móvil específico.
- Medición: macro 2,29× la escala de la lectura; núcleo 26% → 55% de la altura en 1440×1000.
- Verificación: nadir-encuadres (macro, interludio, móvil y movimiento reducido), 24 encuadres de nadir-transiciones con recortes intencionales diferenciados. Referencias y capturas en .refs3d/nadir/escala/.
- Se conservaron todos los cambios previos; no se cambiaron rutas ni hojas CSS ni se detuvo el servidor del usuario.

## Ampliación: rotación de reposo y ratón

- Petición: giro leve sobre sí misma cuando está quieta y reacción leve al ratón.
- Scene.tsx añade ángulos de reposo acotados, entrada suave al parar el scroll y seguimiento amortiguado del ratón a nivel de ventana. Menor amplitud en macros y móvil; retorno al centro con blur/salida y rechazo de eventos táctiles. El encuadre sigue anclado al núcleo.
- Prueba scripts/qa/nadir-reposo.mts: reloj virtual, giro, inercia, dos ejes, estabilidad del foco, reset, tacto y movimiento reducido. Capturas e informe en .refs3d/nadir/reposo/.

## Ampliación: Lenis del kit

- Petición: integrar nuestro componente Lenis para mejorar la inercia del scroll.
- Site.tsx: SmoothScroll con feel cinematic y syncGsap false, ciclo de vida por URL con clave propia, inicio de capítulo sincronizado mediante getLenis y scrollTo inmediato. Botón de entrada conectado a scrollToAnchor.
- Conservados los fragmentos iniciales, el canvas persistente, la alternativa táctil y movimiento reducido. Sin cambios en la API del kit ni dependencias. Catálogo regenerado para registrar el uso de SmoothScroll.
- Prueba de rueda real, anclas y navegación con inercia; informes y captura en .refs3d/nadir/lenis/.
