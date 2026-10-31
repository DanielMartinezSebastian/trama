---
name: trama-kit-evolution
description: Evolve Trama's own component library from one or more reference websites, visual guides, or a direct request for reusable components, guides, or techniques. Use for changes to the Trama source kit; not for consumer-only interface work.
---

# Evolucionar el kit de Trama

Decide qué conocimiento de una referencia merece convertirse en una capacidad reutilizable de Trama. Esta skill se usa
tanto después de `trama-research` como por encargo directo; no requiere que exista una demo previa. Si el usuario solo
pide analizar una web, construir una demo o adaptar un consumidor, conserva ese alcance y no cambies el kit.

## Comprueba dónde estás

- Confirma que trabajas en el repositorio fuente de Trama y en la versión/branch que el usuario indicó. Lee sus
  `AGENTS.md`, comprueba `git status --short` y `git worktree list`, conserva cambios existentes y no toques otros
  worktrees.
- Si solo tienes un consumidor con `trama-ui` instalado, no edites `node_modules` ni presentes una adaptación local
  como cambio de la librería fuente. Entrega un diagnóstico o propuesta para llevar al repositorio fuente.
- Respeta el alcance y autorización del encargo. Cambiar la librería no autoriza a publicar, desplegar ni hacer push.

## Reúne evidencia suficiente

Acepta un brief trazable de `trama-research` si documenta fuentes, estados, medidas, incertidumbre y huecos del kit.
Si la petición es directa, investiga solo lo necesario para decidir:

- Para inspirarse en una web completa, usa `npm run cine:web -- <url>` (y `--movil` cuando sea relevante): recorre
  secciones, páginas, técnica y transiciones. Para tipografía, paleta, espacio y superficies, añade
  `npm run refs:probe -- <url>`.
- Para varias webs, combina mapas con `npm run cine:sintesis -- <mapa-o-url> …`; separa patrones compartidos de firmas
  únicas. No conviertas cada rasgo singular en API global.
- Profundiza con `cine:explora`, `cine:sonda`, `cine:capture`, `cine:analyze`, `cine:flujo` o `cine:conjunto` cuando
  una decisión dependa de una escena gráfica, canvas, WebGL/WebGPU, movimiento o coste que no pueda resolverse con el
  mapa general. No exijas un estudio 3D para una referencia DOM convencional.
- Si hay una recreación que comparar, mide original y réplica con `npm run refs:probe -- --par <original> <réplica>`.

Registra lo observado, lo inferido y lo decidido por separado. Anota URL/archivo, fecha, viewport, estado y capturas;
explica qué no pudo observarse. No deduzcas comportamiento temporal de una imagen fija ni dependas de assets ajenos en
la solución final. Para el proceso completo, usa [docs/38-de-webs-a-demos.md](../../docs/38-de-webs-a-demos.md).

## Elige la capa antes de implementar

1. Revisa `docs/CATALOG.md`, exports y declaraciones públicas; busca componentes, guías, técnicas y ejemplos que ya
   resuelvan el problema. Comprueba dependencias y límites de la versión exacta. No dupliques una pieza por desconocer
   una API ya disponible. Para WebGL/Cine, cruza el atlas de `knowledge/references/cinematic-webgl.md` (o demos/estudios
   en el repositorio) con los motores `lib/` y el banco Cine; que no haya un componente con el nombre del efecto no
   significa que falte la técnica.
2. Formula la capacidad reusable y quién la usaría fuera de la referencia. Decide entre:
   - **Composición local/demo** si el patrón completo es una firma singular o depende demasiado del contenido de una sola web.
   - **Ajuste de componente existente** si el concepto encaja con una pieza pública y basta una mejora compatible.
   - **Componente público** si encapsula interacción o presentación útil en varios contextos y tiene API/configuración
     comprensible.
   - **Técnica/motor reusable** si varias piezas necesitan la misma capacidad de render, movimiento o cálculo; sigue el
     procedimiento de conceptos y bancos de `docs/35-procedimiento.md`, `docs/36-plan-de-mejora.md` y
     `docs/37-conceptos.md`.
   - **Guía visual** solo si hay una familia coherente de decisiones de color, tipografía, espacio y movimiento que se
     pueda medir y aplicar; una paleta o una página aislada no basta por sí sola.
   No concluyas que todo debe quedarse local porque la composición final sea singular: una técnica de cámara, partículas,
   transición o material puede ser reusable aun cuando la escena, el relato y los activos sean únicos. En encargos de
   referencia cinematográfica que pidan explícitamente evolucionar Trama, implementa la técnica reusable y deja la
   composición/arte de una sola marca en la demo.
3. Cuando la referencia revela un hueco pero no autoriza implementación, entrega la evidencia, las opciones de capa,
   sus ventajas y riesgos y el siguiente experimento. Si el usuario ya pidió evolucionar el kit, implementa la opción
   mínima bien sustentada sin pedir una aprobación rutinaria.

## Implementa y comprueba en el sistema real

- Componente o cambio de API: sigue `docs/02-guia-de-componentes.md` §§3 y 9 (accesibilidad, tokens, estados, cleanup,
  variantes y registro). El kit no importa catálogo, landings, demos ni `lib/themes`. Añade el componente a la tabla de
  su categoría en `docs/README.md`; ejecuta `npm run catalog` y revisa el diff generado.
- Guía: sigue `docs/54-guias-de-estilo-del-repo.md` §4. Mide las referencias, registra excepciones justificadas,
  comprueba con `npm run refs:probe -- --guides <base> --solo <id>` y revisa `/guias/<id>` en escritorio y móvil.
  Actualiza la descripción de GuideFrame en `lib/catalog/entries/guias.tsx` y `npm run catalog`. Mantén medidos los
  tokens y adapta contenido o ejemplos donde corresponda.
- Técnica/concepto visual: acompáñalo de una receta reproducible, objetivos comparables y referencia/banco cuando el
  procedimiento lo requiera. Mantén la técnica de bajo nivel separada de la composición de una demo.
- Revalida según impacto: `npm run typecheck`, `npm run catalog:check`, `npm run check:shadows`; `npm run verify` antes
  de entregar. Cambios de CSS/rutas requieren `npm run build` con el `next dev` de este worktree detenido. Cambios del
  kit requieren `npm run pkg:build && npm run pkg:pack && npm run agents:check-package`. Prueba `/componentes`, guías,
  smoke y contraste cuando la superficie lo pida; inspecciona las capturas, no des por aprobados casos automáticos
  `incomplete` sin revisión visual.
- Si es un ejercicio de referencia, pieza, guía o herramienta, actualiza o crea su ficha de Cuaderno y regenera el
  índice con `npm run lab:cuaderno`. Registra objetivo, evidencia, decisión de capa, cambios, comprobaciones y siguiente
  paso en `docs/tareas/`.

Entrega qué se añadió (o por qué se dejó en la demo), la evidencia que lo justifica, rutas de capturas/informes,
comprobaciones y límites pendientes. No publiques ni despliegues como parte implícita de este flujo.
