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

## Ampliación: componente público LinkPreview

- Base: `45c455e`, rama y worktree anteriores; árbol limpio al empezar esta ampliación.
- `components/ui/LinkPreview.tsx` incorpora las vistas en vivo e imagen estática, ancho máximo, retardo, resolución y variantes. Puede envolver cualquier enlace, incluido `next/link`, o crear un enlace HTML con `href` y `label`.
- El portal usa `themeSnapshot` del kit para heredar los tokens del disparador. `DemoPreviewLink` queda como adaptador pequeño de Next.js, con variante editorial para conservar la presentación de la web.
- La miniatura se cancela también durante el retardo y solo puede quedar una activa, aunque se combinen teclado y ratón. La ventana limita sus dimensiones; se limpian temporizadores y listeners.
- Estilos trasladados a `ui-kit.css`, entrada `link-preview` en overlays, tabla README y catálogo regenerado. El esquema del visor permite marcar una prop como obligatoria para que el ejemplo copiado incluya siempre `href`.
- El paquete exporta `LinkPreview` y `LinkPreviewProps`; `npm run pkg:build` pasa y genera ambos en `dist-npm/dist/index.d.ts` (salida ignorada; no se publica en npm).
- QA reproducible: `npx tsx scripts/qa/link-preview.mts http://localhost:3000`. Comprueba vista en vivo, imagen, tema, ancho, movimiento reducido, cancelación antes del retardo, imagen fallida, exclusión entre vistas, límites de ventana y teclado. Resultado correcto.
- También pasan `npm run verify`, smoke de `/demos` y el recorrido previo por portada, demos, filtros y móvil. Capturas de `.refs3d/link-preview/` revisadas visualmente.
- Sigue pendiente el build de Next.js por el servidor dev existente; no se ha detenido.
