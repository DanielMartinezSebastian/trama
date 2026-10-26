# Tarea: miniaturas al pasar por las demos

- Objetivo: mostrar una miniatura de la demo o web al pasar el cursor por su enlace.
- Rama / base / worktree: `main`, `5aab370`, `C:/COMPARTIDO/trama-cine`. Árbol limpio al comenzar.
- Servidor existente: `http://localhost:3000`, proceso 2956; se ha utilizado sin detenerlo.
- Cambios: `components/site/DemoPreviewLink.tsx`, integración en `DemosIndex.tsx` y en las listas de landings y webs de `HomePage.tsx`, estilos en `site.css`.
- Decisión: vista real en iframe de 1280 × 800 escalado, cargada tras 240 ms de hover o foco de teclado; se desmonta al salir, perder foco, navegar, hacer scroll, redimensionar o pulsar Escape. Sin prefetch de todas las demos. No activa el hover en dispositivos táctiles. Portal con los tokens de Trama, sin interceptar clics ni introducir un foco adicional. Respeta movimiento reducido en la aparición de la miniatura.
- Comprobaciones: `npm run doctor`, `npm run verify`, `npm run smoke -- http://localhost:3000/demos --out .refs3d/demo-preview/smoke`, `git diff --check`: correctas.
- Navegador: comprobados hover, URL de la miniatura, foco/Tab, Escape, cierre por scroll, búsqueda sin resultados, listas de portada y anchura móvil de 390 px; sin errores JavaScript. Capturas revisadas visualmente.
- Evidencias locales ignoradas: `.refs3d/demo-preview/check.mjs`, `hover.png`, `web.png`, `mobile.png` y `smoke/`.
- Pendiente: `npm run build` cuando se haya detenido el dev de este worktree. Las instrucciones del repo prohíben ejecutarlo a la vez que el dev; el servidor existente no se ha detenido.
