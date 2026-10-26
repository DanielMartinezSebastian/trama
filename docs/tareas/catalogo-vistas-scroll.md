# Tarea: previsualizar los efectos de scroll en el catálogo

- Objetivo: que las demos de `/componentes` se puedan recorrer y respondan a las props, sin depender del scroll del panel del catálogo.
- Rama / base / worktree: `main`, `d502f63`, `C:/COMPARTIDO/trama-cine`. Árbol limpio al comenzar.
- Servidor del usuario: `http://localhost:3000`; no se ha detenido ni se ha ejecutado el build en ese worktree.

## Diagnóstico y solución

- El visor desplaza `.pg__main`, pero varios componentes escuchan `window.scroll` y calculan su recorrido con `innerHeight`, `100svh` y `position: sticky`. El escenario y algunos ejemplos tienen además recorte o scroll interno.
- Reproducción inicial: `PinnedSection` quedaba en `--pin-p: 0` después de mover el panel; su demo forzaba length=1 y no mostraba contenido. `HorizontalScroll`, `HideOnScroll` y `SmoothScroll` mostraban avisos o estaban desactivados. `SectionIndex` no tenía secciones que seguir. Reel y capítulos solo ofrecían progreso manual.
- Se crea una página de demostración real en `/componentes/preview/[id]`, sin el marco fijo del catálogo. `CatalogPreviewFrame` la incorpora con un iframe: los componentes mantienen sus medidas, eventos, sticky y comportamiento reales. No se modifica la API ni el motor de scroll del kit.
- Props, tema, iconos y repetición se sincronizan mediante mensajes comprobando origen y ventana emisora. La demo espera su configuración antes de montar los efectos. El recorrido informa su porcentaje; el visor permite buscar un punto, reiniciar y ampliar con la API de pantalla completa. Los saltos también sincronizan la instancia local de Lenis.
- `preview` en la entrada del catálogo elige una página con scroll o un ejemplo con recorrido previo/posterior para inview. Puede depender de las props. Hay 21 entradas automáticas, algunas solo en su modo de scroll: IslandNav, ExpandingPanels, ScatterText, AudioPlayer, LightScroll, SplitText, SmoothScroll, LineDraw, ThemeScroll, ScrubText, HideOnScroll, SectionIndex, PinnedSection, HorizontalScroll, StackedCards, Parallax, Reveal, TypeField, ProjectReel, ScrollExpand y ChapterStage.
- Los demás componentes ofrecen «Probar con scroll» y «Vista compacta». El comparador usa una ventana independiente por variante, cargada bajo demanda. Los FX globales de envoltorio se omiten en las demos de página para conservar el comportamiento original.
- Se reemplazan los avisos por ejemplos funcionales que respetan las props. Reel y capítulos permiten elegir recorrido real o progreso manual. Se actualizan las notas y el catálogo generado, y se documenta la opción en la guía §9.

## Comprobaciones

- `npm run doctor` y `npm run verify`: correctos.
- `npx tsx scripts/qa/catalog-scroll.mts`: pruebas de scroll real y aislamiento del panel, sticky, cambio de length, reinicio, teclado del recorrido, pantalla completa, palabras encendidas, movimiento horizontal, ocultación y regreso de cabecera, cambio de sección, parallax, Reveal, cambio de tema, expansión, reel/capítulos, comparación de variantes, modo opcional de página y props/tema sincronizados, modos condicionales, Lenis, movimiento reducido y móvil. Correctas en desarrollo.
- `npx tsx scripts/qa/link-preview.mts`: regresión de la funcionalidad anterior, correcta.
- Smoke de `/componentes#pinned-section` en desarrollo: HTTP 200 y sin errores.
- El mismo QA completo y smoke de `/componentes#pinned-section` pasan en el servidor de producción de validación, puerto 3041, con las cabeceras CSP activas. Smoke directo de `/componentes/preview/pinned-section`: también correcto.
- Build en worktree de validación separado: `C:/COMPARTIDO/trama-catalog-scroll-check`, detached en `d502f63`, con copia de los cambios, `npm ci` y `.next` propios. `npm run build` correcto; conserva avisos existentes de fuentes y del trazado de archivos del laboratorio.
- Capturas e informes locales ignorados: `.refs3d/catalog-scroll/`. Revisadas las imágenes de sección fijada, recorrido horizontal y Reveal.
- Comprobación adicional en producción: el reel cambia de proyecto 01 a 03 y los capítulos de Tension a Immersion al recorrerlos; se guardan capturas de ambos.
- Al terminar se ha detenido únicamente el servidor propio de validación del puerto 3041 y se ha retirado su worktree temporal. El dev del puerto 3000 permanece activo.

## Límites y decisiones

- El objetivo de la revisión son los efectos de scroll y el contexto del visor; no certifica todas las combinaciones posibles de las 175 APIs.
- El modo horizontal nativo en móvil o con movimiento reducido se conserva deliberadamente.
- Los componentes que dependen de datos propios siguen necesitando esos datos en su ejemplo. Una selección de props incompatible con el componente no se corrige cambiando su motor.
