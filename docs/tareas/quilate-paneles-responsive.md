# Tarea: paneles de servicios de Quilate

- Objetivo: abrir los cuatro enlaces con el scroll móvil, mostrar el subtítulo solo en el panel abierto y mantener títulos completos con un máximo tipográfico configurable.
- Rama / worktree: `feat/quilate-galeria-refinada`, `C:/COMPARTIDO/trama-quilate-galeria`; base `a2ca8f3`.
- URL: `http://localhost:3008/sitios/quilate`.
- Componente reutilizable: `ExpandingPanels` incorpora `mobileScroll` (false), `metaVisibility` (always), `titleMaxSize` (28px) y `minPanelWidth` (120px, limitado por el espacio del conjunto). Quilate activa scroll y subtítulos del activo, con máximo de 36px y ancho mínimo de 144px.
- Decisiones: activación por tramos iguales del conjunto respecto al 55% de la altura visible; funciona en ambos sentidos sin depender de la altura animada de cada card. El foco de teclado tiene prioridad. Limpieza de RAF y listeners. La preferencia de movimiento reducido conserva la selección sin animaciones.
- Tipografía: unidades de contenedor y límite superior configurable; títulos multilínea sin elipsis; contenido en el flujo para que su altura mínima pueda crecer.
- Catálogo: controles añadidos a `lib/catalog/entries/formulas.tsx`, tabla de `docs/README.md` actualizada y artefactos regenerados con `npm run catalog`.
- Comprobaciones: doctor correcto; verify correcto; smoke HTTP 200 sin errores. Revisión de paneles en 1440, 800, 390 y 320px: títulos dentro de las cards, sin elipsis, subtítulos solo del activo. Scroll móvil comprobado en orden 0,1,2,3,2,1,0, también con movimiento reducido.
- Capturas y comprobaciones locales ignoradas: `.refs3d/quilate/panels-*.png`, `panels-motion-result.json`, `panels-smoke/`.
- Build correcto (`.refs3d/quilate/panels-build.log`), ejecutado con el dev de este worktree detenido; servidor reiniciado en 3008. La revisión con animaciones normales confirma también el recorrido 0,1,2,3,2,1,0 y los títulos completos.
- Siguiente paso: revisión del usuario.

## Continuidad de transiciones

- Se sustituyó el cambio discreto de `display` del subtítulo por opacidad y desplazamiento fuera del flujo, con entrada retrasada 200 ms y salida inmediata.
- En móvil con scroll, la altura total queda reservada y flex redistribuye el espacio de apertura; `overflow-anchor: none` evita el anclaje del navegador dentro del conjunto.
- Prueba por fotogramas con animaciones normales e interrupciones cada 350 ms: 548 px constantes y deriva de scroll de 0 px en 0,1,2,3,2,1,0,1,0. Escritorio: 76 fotogramas con opacidad intermedia confirmada.
- Se añadió la ficha «Quilate UI» a `/lab/cine`, enlazada al componente, la demo, los artefactos locales y `docs/48-quilate-paneles-responsive.md`. Describe interacción UI, sin atribuir un nuevo análisis 3D.
- `verify` y smoke de la demo y del panel correctos; informe de transición en `.refs3d/quilate/panels-transition-result.json`.
- Build final correcto en `.refs3d/quilate/panels-smooth-build.log`, con servidor propio detenido durante el build y reiniciado en el puerto 3008. `verify` repetido tras incorporar la ficha: correcto.
