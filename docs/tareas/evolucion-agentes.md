# Tarea: evolución de Trama para agentes

- Objetivo: contrastar capacidades/versiones/canales reales (P0), seleccionar piloto y concretar el contrato mínimo de P1; conservar trazabilidad y distinguir hallazgos de recomendaciones e hipótesis.
- Rama: `feat/evolucion-agentes`.
- Commit de partida: `2263365bc6b9485028ae7ce769fcf1fb5ba619ec` (`main` local).
- Worktree: `C:/COMPARTIDO/trama-evolucion-agentes`.
- Servidor y URL: no iniciado; no se ha reservado puerto.
- Cambios: documentos históricos en `docs/estudios/evolucion-agentes/`; plan en `docs/plan-evolucion-agentes.md`; este registro.
- Decisiones: dependencias y salidas propias; conservar el snapshot del estudio; empezar por contrato y consumidor piloto antes de CLI/MCP o rediseño amplio.
- Estado ajeno observado: `C:/COMPARTIDO/trama` tenía `.playwright-mcp/` y `output/` sin seguimiento; se conservan sin cambios. Los demás worktrees siguen registrados y no se han modificado.
- Comprobaciones: `npm ci` completado; `npm run doctor` y `npm run doctor -- --browser` correctos, incluido arranque real de Chromium. `npm run verify` correcto: TypeScript, catálogo (187 componentes, 14 categorías, 8 landings, 34 webs), sombras, pruebas de origen de cine e índice del cuaderno (40 fichas). `git diff --check` correcto. Las cinco copias del estudio se compararon byte a byte con los originales.
- Preparación necesaria para TypeScript: el primer `verify` falló por ausencia de `RouteContext` en el worktree recién creado. Se consultó `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`, se ejecutó `npx next typegen` y se repitió `verify` con éxito. No se modificó código para resolverlo; se generaron los tipos locales de Next.js.
- Avisos de entorno: faltan `.refs3d/`, `public/lab-assets/` y `.env.scripts`, esperable en un worktree aislado; no necesarios para esta preparación. `npm ci` notificó 6 vulnerabilidades en las dependencias instaladas (5 altas, 1 crítica); no se aplicó actualización automática del lockfile. La comprobación de catálogo emitió un aviso de deprecación de Three.js sin fallar.
- Limitaciones: no se han implementado skills ni ejecutado el piloto; las rutas del consumidor en los estudios archivados pertenecen a `martinezsebastian`.
- Siguiente paso: P2, distribución del conocimiento generado y prueba en consumidor limpio con `.tgz` exacto; sin publicación ni despliegue. P1 implementado en la continuación registrada abajo.

## Continuación: P0 y contrato de P1 (29 de octubre de 2026)

- Contexto confirmado: `git status --short` inicial solo mostró los estudios, plan y registro sin seguimiento; conservados. `git worktree list`, rama y HEAD confirman este worktree aislado y la base acordada. No se han modificado otros worktrees. Servidor no iniciado; sin URL/puerto asignado.
- Lecturas: `AGENTS.md`, flujo de agentes, tarea/plan y los cinco documentos del índice del estudio; fuentes del catálogo/generador, guías, recetas, tipos, exports, CLI, portada/metadata y reserva/lista/estado local. No se ha escrito código Next.js.
- Entregables: [matriz P0](../evolucion-agentes/p0-matriz.md), [contrato y encargo piloto](../evolucion-agentes/p1-contrato-piloto.md), [evidencia local con hashes](../evolucion-agentes/evidencia-p0.json), [respuesta npm](../evolucion-agentes/npm-registry-p0.json). Plan actualizado; estudios históricos intactos. Son documentos/evidencias de revisión, no nueva base manual del producto.
- Hallazgo de canal: consulta explícita de lectura al registro público devuelve `latest` 0.2.0 y versiones 0.1.0/0.2.0, repositorio declarado de Trama. 0.13.0 local no aparece publicado en esa respuesta; no se inspeccionó el paquete público. Web desplegada sin URL/commit verificado. 0.12.1 consumidor es evidencia histórica del estudio, no instalación local comprobada ahora.
- Decisión: piloto `salon` (guía y receta), F6 y recorrido reserva → mis citas → cambio/anulación con `BookingFlow`/`AppointmentList`; versión exacta mediante `.tgz` propio en P2. Dirección clara/editorial, fuentes declaradas y recorrido con estados sin WebGL o servicios externos. Alternativas y límites justificados en contrato.
- Decisión de contrato: derivar índice/fichas de las fuentes existentes; `PropSpec` solo como controles; firma por declaraciones y exports reales. Propuesta `docs/agents/` → `knowledge/` en paquete, JSON y Markdown derivados; aún no creados. No se añaden historiales de versiones inventados ni compatibilidad universal.
- Riesgos concretos: `onBooked` posterior a guardado local/confirmación, sin correo en `Appointment`; slots ficticios; hooks por instancia sin estado global compartido; Hebra usa implementación/CSS/tokens propios; contraste de `salon` pendiente de medir. No se presentan como servicios conectados o defectos ya resueltos.
- Comprobaciones nuevas: `npm run doctor` correcto (Node 24.13.1, Chromium y ffmpeg detectados, avisos esperables de recursos ausentes); `npm run verify` completo correcto (187 entradas, 14 categorías, 8 landings, 34 webs, sombras, cine:test, cuaderno 40). Aviso de Three.js sin fallo. `npm run pkg:build` correcto: 0.13.0, 706 archivos, 173 componentes de barrel; declaraciones y manifiesto inspeccionados. `node dist-npm/bin/trama-ui.mjs catalog` devuelve ruta correcta. Conteos/tamaños coinciden con estudio; hashes y versiones instaladas registrados.
- Salidas: `dist-npm/` regenerado solo aquí, ignorado por Git; no `.tgz` instalado, no consumidor ni smoke/capturas. No cambios de rutas/CSS que requieran build del sitio; esta revisión documental no es un ejercicio visual del cuaderno. `git diff --check` correcto; enlaces locales de los nuevos documentos revisados por script.
- Pendiente: implementación del generador/fixtures de P1, pruebas de consumo P2, habilidades y descubrimiento P3, recorrido visual/funcional y evaluación P4. Sin datos nuevos de ahorro o eficiencia. No se hizo commit ni publicación.

## Continuación: implementación P1 (29 de octubre de 2026)

- Contexto: status y worktrees revisados al empezar; se conservaron los documentos previos sin commit en esta rama/worktree. No se arrancó servidor, no hay URL/puerto reservado y no se modificaron otros worktrees.
- Cambios principales: `scripts/agent-knowledge.mts` integra el contrato en `scripts/build-catalog.mts`; `scripts/package-surface.mts` comparte exports/peers con el empaquetador; `scripts/check-agent-package.mts` comprueba los ejemplos contra el paquete construido. `scripts/agent-knowledge.test.mts` se integra en `npm run verify` mediante `agents:test`.
- Fuentes: `CatalogEntry.consumption` añade requisitos/límites de reserva/lista junto a sus entradas; `RecetaSector.pilot` declara selección de apoyo, fixtures, rutas, estados, integraciones y assets pendientes. Los valores de la guía siguen exclusivamente en `lib/ui/guides.ts`; no se creó otra base de guías/recetas/componentes.
- Salidas: `docs/agents/` contiene 94 archivos generados: índice, 18 fichas de componentes, guía/receta, tres ejemplos y 49 declaraciones transitivas. El índice JSON ocupa 12.505 bytes y su README 5.720; son tamaños de documentos, sin inferir ahorro de tokens o ejecución. Las declaraciones se emiten con TypeScript y se contrastan con el paquete. El cierre de metadatos de catálogo también se incluye en los hashes de procedencia.
- Corrección concreta: `title`/`lead` de la ficha GuideFrame eran controles para la muestra, no props; ahora tienen `noCode` y su snippet contiene hijos reales. Regenerados `docs/CATALOG.md` y `catalog.json` conscientemente. No cambió API ni código de los componentes del kit.
- Ejemplos: `scripts/fixtures/agents/salon-*.tsx.txt` fija muestras de estilo, reserva/lista y layout de fuentes usando imports públicos. Se consultaron antes `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` y `13-fonts.md`. No se implementaron rutas del consumidor ni su adaptador de query.
- Decisiones: `catalog:check` cubre datos, ejemplos y tipos, y rechaza salidas extra sin borrarlas. Procedencia conserva la foto de generación cuando contenido y hashes no cambian, para evitar deriva causada por commits de las propias salidas. `tsconfig.json` excluye solo salidas (`dist-npm`, `docs/agents`, `.cache`), comprobadas por herramientas específicas.
- Incidencias corregidas: el primer typecheck coincidió con la limpieza/recreación de `dist-npm` y vio declaraciones ausentes; se separaron comprobaciones y salidas del sitio. Se corrigieron los tipos del resolvedor y el tratamiento del CSS como recurso (no TS) en el checker. La comparación completa detectó un import lateral sin extensión; el snapshot ahora conserva la misma resolución ESM que el paquete. También se corrigió una ruta de procedencia `.ts` a la fuente real `.tsx`.
- Comprobaciones finales: `npm run doctor` correcto; `npm run catalog` y `npm run verify` completos correctos (incluye nuevas pruebas de conocimiento; cuaderno 41 fichas). `npm run pkg:build` y `npm run agents:check-package` correctos: tres ejemplos compilados mediante exports públicos, CSS existente y cierre completo de 49 declaraciones coincidente. Aviso de deprecación de Three.js sin fallo. `git diff --check` correcto; enlaces generados comprobados por las pruebas.
- Documentación: [implementación y reproducción](../evolucion-agentes/p1-implementacion.md), plan actualizado, enlace desde `docs/README.md` y [ficha de herramienta](../cuaderno/herramienta-conocimiento-agentes.md) con índice regenerado. El estudio original y evidencia P0 se mantienen como snapshots históricos.
- Límites: P1 no distribuye todavía `knowledge/` en el paquete, no instala `.tgz`, no certifica build Next/fuentes o recorrido visual/funcional del consumidor. Sin skills, publicación, despliegue, commit ni medición de eficiencia. `dist-npm/` sigue ignorado y regenerable; sin capturas o smoke porque no se ha construido interfaz del consumidor ni cambiado rutas/CSS.
- Siguiente paso concreto: P2, copiar `docs/agents/` a `knowledge/` al empaquetar, verificar el contenido del `.tgz` e instalarlo en un consumidor limpio aislado con versión fijada. Probar especialmente `next/font` dentro del paquete antes de declarar el camino Next compatible; después continuar las rutas y estados del contrato piloto.

## Continuación: P2–P6 en curso (29 de octubre de 2026)

- Encargo ampliado por el usuario: continuar hasta acabar, sin publicar, desplegar ni modificar otros worktrees. Status/worktrees revisados y cambios previos conservados. Se aplican skill-creator y frontend-design; docs oficiales y locales de Next consultadas.
- P2: knowledge y skills incluidos en .tgz; dos consumidores nuevos bajo .cache, sin enlaces de dependencias o .next. `.cache/agent-pilot-final` usa el artefacto SHA-256 `e238839e470ed732c8f5d661d2613edc5e4715fddde15aadf6254dc40c81ea93`. Build Next16.3.5/Turbopack y fuentes correctos con transpilePackages y raíz propia. Plantilla en examples/agent-pilot; el preparador rechaza destinos existentes.
- P3: tres skills en skills/, helper de contexto único y adaptadores Codex/Claude. Instalación idempotente, preflight de conflictos, conservación de instrucciones y rechazo de destinos enlazados. Validator upstream correcto con PyYAML6.0.3 aislado en .cache, sin instalación global.
- Descubrimiento real: CodexCLI0.165.0 y ClaudeCode2.1.302 encontraron y leyeron las tres skills. Resumen sin datos personales en discovery-evidencia.json. Hubo fallos de ejecución Windows/267 y un Glob denegado en Claude, con lectura posterior recuperada. No se certifican otros clientes ni equivalencia de modelos.
- P3b: captura, URL local y brief de marca externo al kit en research-piloto.md/research-evidencia.json. Sonda refs:probe ejecutada; evidencia regenerable .refs3d/agent-research. Caso ficticio/local declarado, sin presentarlo como tres webs externas. Las variantes desde captura se construyen en P4.
- Consumidor: tres rutas móvil/escritorio, errores, persistencia, .ics, cambio, colisión, anulación, corte24h, query inválida, teclado/reduced-motion y almacenamiento bloqueado aprobados. Axe sin violaciones automáticas WCAG2A/AA en estados iniciales; algunos contrastes incompletos se declaran. Capturas revisadas en .refs3d/agent-pilot.
- Correcciones del ejemplo: tokens locales mediante style, guion ASCII en horarios, icono propio, carga de lazy images antes de capturar y retirada de backdrop que interfería con contraste. Sin cambios en guía global o kit. Test distingue alert de formulario y announcer de Next.
- P4: cohorte de doce ensayos en curso en .cache/agent-evaluation-json, con modelo/configuración heredados sin overrides y salida JSON. Directorios/repos de prueba nuevos, secuenciales y con copia propia del paquete. Fuentes/eventos/uso reales conservados; adjudicación central separada. Primer intento opaco interrumpido tras unos179s sin entrega, conservado aparte en .cache/agent-evaluation/interrupted-run.json con uso no disponible; no se atribuye a las skills.
- P5: mensaje, metadata, instalación, contadores y navegación a /docs/agentes alineados; sin rediseño amplio. Pendientes adjudicación P4, decisión P6, build/smoke y verify finales.
- Servidores: los tests crean y cierran solo sus procesos propios en3417; no queda servidor permanente. Registro de cierre pendiente.

## Cierre: P4–P6 (29 de octubre de 2026)

- Contexto: status y worktrees revisados; cambios previos conservados; otros worktrees intactos. Servidores propios: `next start` del consumidor en 3421 (validador) y del sitio en 3431 (smoke), ambos cerrados.
- P4: los 12 ensayos habían terminado; `booking-docs-2` falló a los 3 s por límite de uso de Codex («usage limit»), sin turno ni tokens: `not-run-infrastructure`, no fallo del agente. Adjudicación: skills 6/6, documentación 2/5. Tiempo +46 %, entrada +58 % con skills. Informe y datos en `docs/evolucion-agentes/p4-evaluacion.md` y `evaluacion-evidencia.json`; validación original conservada en `.cache/agent-evaluation-json/validation-paquete-original.json`.
- Defecto del kit encontrado por la cohorte: `Button` con `glyph` desde un Server Component fallaba porque `renderGlyph` vivía en `Icon.tsx` («use client»). Movido a `components/ui/glyph.ts` (sin JSX para no exigir ficha de catálogo); `Icon` lo reexporta; importadores del kit y dos webs actualizados. Comprobado con un consumidor nuevo `.cache/agent-pilot-glyph`: `composition-docs-1` pasa.
- Conocimiento: la ficha de guía incluye `contrast` medido (salon: `--mut` 3,64:1, `--acc` 1,98:1) y la regla de nombrar fuentes por variable; `CATALOG.md` añade la nota de fuentes y contraste (6 de 19 guías tienen `--mut` o `--acc` < 4,5:1). El validador registra nodos de axe y separa ensayos sin turno.
- P5: sección «Qué mostró la evaluación» en `docs/57-agentes.md`; creada `docs/evolucion-agentes/entrega-final.md`, que ya estaba enlazada. P6: no se añaden MCP, registro ni consulta CLI (razones en la entrega).
- Cuaderno: nueva ficha `herramienta-evaluacion-agentes`; `herramienta-skills-trama` pasa a hecho; índice regenerado (44 fichas).
- Comprobaciones: `npm run typecheck`, `catalog`, `verify` (tras regenerar el cuaderno) y `build` correctos; smoke de `/`, `/docs/agentes` y `/sitios/pixelforge` sin errores ni sombras, capturas revisadas. `pkg:build`, `pkg:pack` (SHA-256 `ea7c7d08…`) y `agents:check-package` correctos. `.tgz` evaluado (`e238839e…`) guardado en `.cache/paquetes/`. `git diff --check` correcto.
- Sin commit, publicación ni despliegue.
- Siguiente paso: repetir `booking-docs-2` cuando haya cuota (instrucciones en P4), revisión visual humana de las capturas y, antes de generalizar `knowledge/`, una segunda cohorte con otra guía.

## Continuación: segunda cohorte con Claude Code (29 de octubre de 2026)

- Encargo del usuario: seguir sin Codex («a tope»): commits, cohorte con Claude Code y fichas de todas las guías. Cuatro commits previos en la rama, sin push.
- Fichas: `knowledge/guides/` cubre las 19 guías con tabla de contraste (Markdown legible); skills y docs ajustados. Índice 17,7 kB.
- `evaluate-agents.mts` admite `--client claude`, `--conditions docs,updated,pilot` y `--model`. Ensayos en `%TEMP%/trama-eval/` (Claude Code carga `CLAUDE.md` de los padres) y copiados a `.cache/agent-evaluation-claude/`. Sondas: `--restricted` ocultaba las skills del proyecto y el modelo por defecto en `-p` era Haiku; se usa `--setting-sources project,local`, `--strict-mcp-config`, herramientas de lectura y Opus fijado.
- 7 ensayos chocaron con el límite de sesión; apartados en `.cache/agent-evaluation-claude-sin-cuota/` y repetidos tras el reinicio. El validador reconoce ese límite y excluye del contraste el texto decorativo `aria-hidden` (anotado).
- Resultados: base 4/6, actualizada 4/6, skills 5/6; todos los fallos en reserva. Informe `docs/evolucion-agentes/p4b-evaluacion-claude.md`, datos `evaluacion-claude-evidencia.json`.
- Kit: tipos de reserva exportados desde `BookingFlow`, `AppointmentList` y la raíz (`build-package.mts`); ejemplo de reserva simplificado. Paquete `769cb1a5…`, consumidor `.cache/agent-pilot-v3`; readjudicación en `.cache/agent-evaluation-claude-v3/` (13/18, mismo recuento por condición).
- Propuesta sin aplicar: corrección de contraste de `--mut`/`--acc` en `GuideFrame` (decisión de producto).

## Continuación: completar Codex (29 de octubre de 2026)

- Objetivo: cerrar `booking-docs-2` con las condiciones originales y actualizar las cifras.
- Rama / partida / worktree: `feat/evolucion-agentes`, `2c7d04c`, `C:/COMPARTIDO/trama-evolucion-agentes`.
  Status inicial limpio y worktrees revisados; no se modificaron otros worktrees.
- Cambios: intento inicial preservado en `.cache/agent-evaluation-json-sin-cuota/booking-docs-2`, quitado de
  `runs.json` antes del reintento. `agents:evaluate` usó `.cache/agent-pilot-final/node_modules/trama-ui`, sin
  regenerar los otros once. Resumen reproducible en `scripts/summarize-agent-evaluation.mts`, informes P4/P4b,
  entrega, docs de agentes y ficha de evaluación actualizados.
- Resultado: 12/12 ejecutados; nuevo ensayo 98 s, 205.249 tokens de entrada, 3.492 de salida. Compila y falla por
  contraste de `--mut`/`--acc`; capturas de escritorio/móvil revisadas por Codex. Original: documentación 2/6,
  skills 6/6; con arreglo de glyph: 3/6 y 6/6. Sobrecoste de skills: tiempo +40 %, entrada +64 %, salida +38 %.
- Comprobaciones: adjudicación completa con `agent-pilot-final` y `agent-pilot-glyph`; fuentes y `runs.json`
  iguales en ambas salidas. Validación original anterior conservada, además de la nueva completa. Typecheck correcto.
  Servidores propios de adjudicación en 3421 cerrados por el validador.
- Decisiones: hashes/paquetes de P4 conservados, sin atribuir al paquete nuevo las cifras históricas. Revisión
  humana pendiente; las capturas automáticas no la sustituyen. Sin publicación, despliegue ni push.
- Siguiente paso: cerrar la revisión visual del arreglo de SectionHeader y comprobar sitio/paquete finales.

## Cierre: SectionHeader legible y validación final (29 de octubre de 2026)

- Objetivo: evitar que la palabra decorativa de SectionHeader interfiera con el subtítulo, sin cambiar su API.
- Rama / worktree: `feat/evolucion-agentes`, `C:/COMPARTIDO/trama-evolucion-agentes`; evaluación cerrada en `7a372a6`.
- Cambios: `.ui-sh__word` ocupa una fila recortada de 64–140 px sobre el texto; `min-width: 0` evita ensanchar el
  grid. Conserva escala, tokens y `aria-hidden`. Actualizados comentario de prop, hint y escenario del catálogo
  (crece con el contenido), catálogo/conocimiento generado y ficha `pieza-section-header-legible`; cuaderno con 45 fichas.
- Decisiones: separar físicamente la decoración evita depender del fondo o del contraste. La cabecera con
  `backdrop` gana altura; sin esa prop conserva la composición del kit. GuideFrame y `lib/ui/guides.ts` no cambian:
  el opt-in de contraste continúa pendiente de aprobación expresa, según la instrucción del usuario.
- Comprobaciones correctas: `doctor`, `catalog`, `verify` completo, build del sitio sin dev de este worktree,
  `smoke` en `http://127.0.0.1:3431/componentes#section-header` (HTTP 200, sin errores ni sombras oscuras), revisión
  visual de las ocho capturas de 1440/390 px × izquierda/centro × md/giant y separación geométrica sin desborde.
  Artefactos ignorados en `.refs3d/section-header/`; palabra separada 12 px del texto en variante editorial.
- Paquete: `pkg:build`, `pkg:pack` y `agents:check-package` correctos (tres ejemplos e imports públicos).
  Nuevo `.tgz` local SHA-256 `411ab1dc315f32ef3e3a95deae451c40268fff00619b3827d03fa91ceac8ce07`.
  Artefacto previo `769cb1a5…` conservado en `.cache/paquetes/trama-ui-0.13.0-antes-section-header.tgz`;
  consumidores y paquetes históricos de evaluación intactos. No se instaló el nuevo `.tgz` en otro consumidor.
- Avisos sin fallo: Three.js deprecado y 22 avisos de métricas fallback de fuentes en build; no se cambian dependencias.
- Servidores: solo `next start` propio en 3431 y validador en 3421; ambos cerrados, puertos comprobados libres.
  Sin publicación npm, despliegue ni push; otros worktrees intactos. `git diff --check` correcto.
- Siguiente paso: revisión humana opcional de capturas y decisión del usuario sobre el opt-in de GuideFrame;
  probar otra guía antes de generalizar las cifras. No queda ensayo pendiente en ninguna de las dos cohortes.

## Continuación: GuideFrame con contraste optativo aprobado (29 de octubre de 2026)

- Objetivo y autorización: el usuario aprobó expresamente implementar el opt-in de contraste propuesto en P4b.
- Rama / partida / worktree: `feat/evolucion-agentes`, `f180f0d`, `C:/COMPARTIDO/trama-evolucion-agentes`.
  Status inicial limpio y worktrees revisados; cambios limitados a este worktree.
- Implementación del kit y catálogo: commit `886d321` (`feat(ui): añade contraste optativo de texto a GuideFrame`).
- Kit: `GuideFrame textContrast?: boolean = false` calcula en servidor `--mut-text`/`--acc-text` a 4,5:1 sobre
  `--bg`, con guía y overrides de `style`. Helper en `lib/ui/text-contrast.ts`; colores sRGB opacos hex/rgb.
  Ajuste hacia negro/blanco con comprobación del hex final sin redondear el ratio; no muta guías ni cambia colores
  que ya cumplen. `lib/ui/guides.ts` permanece idéntico.
- CSS: textos secundarios/de acento usan los alias con fallback; fondos, bordes, sombras y decoración mantienen
  los tokens originales. Reinicio de ámbitos de guía, paletas invertidas, PixelFrame e intenciones semánticas.
  En `salon`: `#767676`/`#9e695d` para texto; `#868686`/`#f5a490` originales conservados.
- API/conocimiento: prop y límites registrados en catálogo; `npm run catalog`; tabla de `docs/README.md`, guía de
  componentes, docs de agentes, ejemplo de estilo y consejo de trama-style actualizados. Skill-creator aplicado a
  esa revisión puntual; `quick_validate.py` correcto con PyYAML local. Ficha `pieza-guide-frame-contraste` e índice
  del cuaderno regenerados (46 fichas).
- Pruebas: `ui:test` integrado en `verify` comprueba las 19 guías, fondos claros/oscuros, umbral sin redondear,
  colores ya válidos, overrides, formatos no resolubles y ausencia de mutación. `doctor`, `verify` completo,
  build del sitio, `pkg:build`, `pkg:pack` y `agents:check-package` correctos. Avisos conocidos de Three.js y 22
  métricas fallback de fuentes; no se actualizan dependencias.
- Navegador: smoke en `http://127.0.0.1:3431/componentes#guide-frame` correcto, sin errores ni sombras oscuras.
  Con/sin opt-in, móvil/escritorio, guía anidada, color semántico y paleta invertida comprobados; capturas con
  reduced-motion revisadas por Codex en `.refs3d/guide-contrast/` (no revisión humana).
- Paquete/consumidor: `.cache/agent-pilot-contrast` nuevo, dependencias y `.next` propios; `.tgz` local SHA-256
  `28d62a4f55ce7a38a3f5856052e2970992e8427f4ca84fa77775fdbec9aea3d3`. Copia de `booking-docs-2` en
  `.cache/agent-evaluation-contrast` con solo `textContrast` añadido: adjudicación completa correcta (tipos,
  build, axe inicial, error de formulario, confirmación, persistencia y anulación), capturas revisadas.
  Es una regresión posterior, no otra cohorte; fuentes/cifras/paquetes de P4 y P4b intactos.
- Límites: no certifica otros fondos, transparencias, imágenes, opacidades, estados ni colores semánticos.
  CSS propio debe consumir los alias; expresiones dinámicas (`var()`, hsl, etc.) no se resuelven en servidor.
  Para un tema anidado nuevo se usa otro GuideFrame o se reinician/recalculan los alias.
- Servidores: propios en 3431 (sitio) y 3421 (validador), cerrados; puertos libres comprobados. Sin dev del
  worktree durante el build. Sin publicación npm, despliegue ni push; `git diff --check` correcto.
- Siguiente paso: revisión humana opcional de capturas, uso opt-in en proyectos y otra guía/cohorte antes de
  generalizar las cifras. No queda pendiente la aprobación ni la implementación de la propuesta de P4b.

## Validación visual del usuario (29 de octubre de 2026)

- Objetivo: registrar la aceptación visual de `GuideFrame textContrast`.
- Rama / partida / worktree: `feat/evolucion-agentes`, `52fd49e`, `C:/COMPARTIDO/trama-evolucion-agentes`.
  Status inicial limpio y worktrees revisados; ningún otro worktree modificado.
- Validación: el usuario respondió «valido» después de recibir `/componentes#guide-frame` con la comparación de
  `salon` y las capturas de antes/después y móvil. Revisión visual de este ajuste aceptada; no se extiende a todas
  las capturas ni a las cifras de las cohortes históricas.
- Cambios: aceptación registrada aquí y en `pieza-guide-frame-contraste`; sin cambios de código ni paquete.
- Servidor de revisión propio en `http://127.0.0.1:3431`, abierto a petición del usuario, cerrado al terminar la revisión.
- Comprobaciones: `verify` completo y `git diff --check`. Sin push, publicación ni despliegue.
- Siguiente paso: otra guía/cohorte si el usuario decide continuar la evaluación; no se inicia automáticamente.

## Continuación: protocolo de boutique (29 de octubre de 2026)

- Objetivo aprobado por el usuario: evaluar otra guía con composición, referencia y reserva, documentación actual
  frente a skills. Rama `feat/evolucion-agentes`, partida `5abd496`, mismo worktree; status inicial limpio y
  worktrees revisados. Ningún otro worktree modificado.
- Diseño fijado antes de generar: `docs/evolucion-agentes/p4c-evaluacion-boutique.md`, 12 ensayos con Codex CLI
  0.165.0 heredado, condiciones `updated,pilot`, paquete congelado `28d62a4f…`. Compás es un estudio ficticio de
  pilates. Se evalúa adaptación de contenido/flujo con la ficha boutique y ejemplos/receta todavía de salon.
- Herramientas: suites explícitas, selección estricta, manifiesto con contrato y hash del paquete completo,
  referencia y configuración; resume con preflight que rechaza mezclas. Versión de Codex leída del ejecutable,
  detención ante falta de cuota. Defaults/encargos de P4 comprobados contra su fuente histórica, sin cambios.
- Referencia: fixtures propios `scripts/fixtures/evaluation-boutique/`, consumidor limpio `.cache/agent-pilot-boutique`
  con `.next` y dependencias propios, host sin guía heredada y con reset de box-sizing. Frontend-design aplicado
  a la muestra GuideFrame/Hero; Cormorant/Inter, colores de boutique e ilustración SVG original. No es web externa.
- Comprobaciones de preparación: `doctor`, typecheck y `verify` completos correctos; build del consumidor,
  captura con medidas de fuentes/tokens, dos columnas/apilado y ausencia de desborde; capturas revisadas por Codex.
  Smoke en `http://127.0.0.1:3433/` correcto, sin errores ni sombras. Paquete/kit sin cambios; no se recompila
  el .tgz para medir esta cohorte. Ficha `herramienta-evaluacion-boutique` e índice (47 fichas).
- Artefactos: `.refs3d/agent-boutique/`, hash de referencia `ea7bf75e…`; consumidores y cohortes anteriores intactos.
  Servidor de referencia propio en 3433 cerrado tras el smoke. Sin publicación, despliegue ni push.
- Siguiente paso: generar en `.cache/agent-evaluation-boutique`, adjudicar con el consumidor nuevo y revisar
  las capturas antes de interpretar resultados. Las cifras históricas permanecen separadas.

## Cierre: resultados boutique (29 de octubre de 2026)

- Objetivo completado: 12/12 ensayos con fuente y brief, sin incidencias de cuota, en la rama/worktree acordados.
  Protocolo anterior a los ensayos en `ed144d2`; resumen reproducible probado en `3c83fed`.
- Adjudicación inicial: 5/6 por condición. `booking-updated-1` tenía dos enlaces válidos a «Ver mis citas» y
  Playwright exigía uno; `booking-pilot-1` usaba «Anular cita»/«Sí, anular cita» y el selector exigía el texto corto.
  Conservado `validation-protocolo-original.json` antes de ajustar el validador.
- Herramienta: `--robust-selectors` en `33a55eb` admite enlaces repetidos y esas etiquetas equivalentes sin cambiar
  los defaults de P4. Repetida la adjudicación de los doce ensayos, mismas fuentes y mismo paquete: **6/6 con
  documentación actual y 6/6 con skills**, incluidos error de datos, confirmación, persistencia y anulación.
  Evidencia conserva ambos resultados; no se atribuyen los falsos fallos al agente ni se corrige su código.
- Generación media: documentación 83 s / 259 k entrada (51 k sin caché) / 3,3 k salida; skills 107 s / 252 k
  (46 k sin caché) / 3,8 k. Skills: entrada −2 % (−8 % sin caché), tiempo +29 %, salida +16 %. No hay ahorro global
  ni ventaja funcional demostrados en esta muestra; modelo heredado no informado y n=2 por celda.
- Revisión visual: Codex inspeccionó las 24 capturas de 1440/390 px. Las cuatro referencias conservan disposición,
  ilustración y CTA; sin fallback de fuentes observado. Cuatro respuestas de documentación adaptan rosa/tierra
  a crema/verde; las seis de skills conservan la paleta medida. Se registra como observación visual, no se altera
  retrospectivamente la tasa automática. Ilustraciones ornamentales de varias reservas quedan recortadas en móvil.
- Hallazgo de reutilización: una respuesta con skills rehace la lista para evitar el texto fijo «llámanos» de
  AppointmentList. Funciona, pero añade código y acoplamiento. Otra reutiliza la pieza y aclara que es texto de demo.
  Se propone valorar texto configurable; no se cambia la API ni el kit por esta evaluación.
- Entregables: `p4c-evaluacion-boutique.md`, `evaluacion-boutique-evidencia.json`, entrega y docs de agentes actualizados;
  ficha `herramienta-evaluacion-boutique` cerrada e índice regenerado (47 fichas). Artefactos ignorados en
  `.cache/agent-evaluation-boutique/` y `.refs3d/agent-boutique/`; resúmenes conservan hashes de fuentes y entradas.
- Comprobaciones: `doctor`, `verify` completo (incluye compatibilidad del protocolo P4 y denominadores del resumen),
  build del sitio y del consumidor, smoke de la referencia y revisión de capturas correctos. Preflight probado:
  reanudar con otro orden de condiciones se rechaza antes de generar. `git diff --check` correcto.
- Paquete congelado `28d62a4f55ce7a38a3f5856052e2970992e8427f4ca84fa77775fdbec9aea3d3` intacto; no se recompila
  porque no se toca el kit. Cohortes originales sin cambios. Avisos conocidos de Three.js y fuentes fallback,
  sin fallo. Sin publicación npm, despliegue ni push; ningún otro worktree modificado.
- Servidores propios de referencia/smoke en 3433 y adjudicación en 3421 cerrados; puertos comprobados libres.
  Build del sitio sin dev de este worktree.
- Decisiones y siguiente paso: no añadir MCP ni una receta boutique por estos datos. Antes conviene probar una nota
  de fidelidad de paleta y valorar personalización del mensaje de cierre de AppointmentList. Valoración visual
  del usuario opcional; no se presenta esta revisión por Codex como aprobación humana.

## Demo nueva: UMBRAL con las skills de Trama (30 de octubre de 2026)

- Objetivo: crear una demo cultural distinta a las cohortes de peluquería y boutique, aplicando las skills existentes
  a un festival con programa filtrable y pases. Rama `feat/evolucion-agentes`, partida `0ea641d`, worktree
  `C:/COMPARTIDO/trama-evolucion-agentes`; estado inicial limpio y worktrees revisados.
- Cambios: fuente de consumidor en `examples/demo-umbral/`, materializador `scripts/prepare-demo-umbral.mts`,
  recorrido QA en `scripts/qa/demo-umbral.mts`, ficha `docs/cuaderno/demo-umbral-skills.md`. Las fuentes `.tsx`,
  `.ts` y `.css` llevan `.txt` para que no entren en el build del sitio; el materializador retira ese sufijo al copiar.
- Skills: `trama-build` para catálogo, recetas y componentes; `trama-style` para `GuideFrame`/guía `ludico`; y
  `frontend-design` para la dirección gráfica. No se usaron MCP ni webs externas. Se conservó la paleta medida y no se
  modificó el paquete de Trama. Hash del `.tgz` local congelado: `28d62a4f55ce7a38a3f5856052e2970992e8427f4ca84fa77775fdbec9aea3d3`.
- Decisiones: UMBRAL es ficticio, con portada, programa filtrable por día/espacio y flujo de tres pasos. El pase solo
  usa almacenamiento local y un QR de ejemplo; el archivo descargable dice `NO VÁLIDO PARA ACCESO`. No se solicita
  pago ni se envía correo. `CheckoutFlow` está orientado a entrega/recogida y pago, por eso se compuso la selección
  de entradas con piezas públicas más pequeñas. La cabecera propia enlaza a inicio porque `NavBar` no ofrece ese
  `href` de marca. Las transiciones reutilizan `PageTransition` y `PageTransitionPersist`, ya existentes en Trama; los
  enlaces del App Router marcan `NAV_FORWARD`/`NAV_BACK` y la cabecera queda fija. Los enlaces HTML de cartelera añaden
  un fundido entre documentos del mismo origen. No se añadieron ni cambiaron componentes del kit.
- Comprobaciones: typecheck y build de producción del consumidor; flujo de día enlazado, cantidad y precio, errores de
  formulario, guardado y recuperación tras recarga, descarga y estado vacío. Axe WCAG 2.0 A/AA sin violaciones en
  portada, programa y recibo; selección comprobada de `wipe-left` al avanzar y `wipe-right` al volver, cabecera
  persistente, sin errores de navegador ni desbordamiento a 320/390/768/1440 px. `npm run smoke` en
  `/`, `/programa` y `/entradas`: HTTP 200, sin errores ni sombras. Capturas de producción revisadas en
  `.refs3d/demo-umbral/recorrido/` (ignoradas); no equivalen a validación visual del usuario.
- Consumidor aislado en `.cache/demo-umbral/`; el preparador se probó además con destino nuevo
  `.cache/demo-umbral-preflight/` y anotó el hash del paquete. Vista previa propia en `http://127.0.0.1:3435`, dejada
  abierta para revisión del usuario. Sin publicación npm, despliegue ni push; sin cambios en otros worktrees.
- Comprobaciones de repo: `npm run doctor` correcto (Chromium y ffmpeg presentes; avisos por `.env.scripts` y
  `public/lab-assets` ausentes), `npm run verify` correcto (48 fichas al día), build del sitio correcto y
  `git diff --check` limpio. El build conserva avisos conocidos de métricas de fuentes pixel y acceso dinámico de
  filesystem en el panel de cine; no se originan en esta demo.
- Siguiente paso: valoración del usuario sobre la demo cultural en 3435; decidir después si se integra en una ruta
  del sitio. El servidor de revisión se deja abierto para esa valoración.

## Skills: generación de imagen opcional (30 de octubre de 2026)

- Objetivo: aclarar si las skills de Trama pueden aprovechar generación de imágenes de Codex cuando esté disponible, sin hacerla requisito.
- Cambios: `trama-style` contempla un brief visual y generación opcional de fotos, ilustraciones o texturas raster originales. `trama-build` prioriza recursos aportados/licenciados o SVG/CSS si la capacidad no existe, y pide revisar recorte, alt y representación responsive. Se actualizó la ficha `herramienta-skills-trama`.
- Decisiones: las instrucciones son neutrales al cliente y citan Codex imagegen como ejemplo. Iconos, logotipos, diagramas y patrones simples siguen siendo código; las imágenes generadas no se presentan como evidencia de personal, instalaciones o resultados reales.
- Comprobaciones: `npm run verify`, `npm run pkg:build`, `npm run pkg:pack` y `npm run agents:check-package`; `git diff --check`. `quick_validate.py` no pudo ejecutarse porque el Python disponible carece de `PyYAML`; se conservaron los frontmatters existentes y el empaquetado incluyó ambas skills. El paquete previo quedó guardado en `.cache/package-skill-imagegen-baseline/`.
- Siguiente paso: instalar/actualizar las skills en un consumidor y comprobar su uso en una demo que realmente se beneficie de una imagen. No publicar ni hacer push.

## Revisión de necesidad de imágenes en UMBRAL (30 de octubre de 2026)

- Objetivo: comprobar en las tres rutas si una imagen raster resolvería una necesidad visual o de contenido.
- Evidencia revisada: capturas de `/`, `/programa` y `/entradas` en escritorio; portada y programa también en móvil, en `.refs3d/demo-umbral/recorrido/`.
- Decisión: no añadir imágenes raster ahora. El portal SVG del hero ya expresa la idea de cruzar un umbral y mantiene el lenguaje gráfico de cartel. Programa y entradas priorizan exploración y selección; más imágenes reducirían espacio y jerarquía, especialmente en móvil. El recinto y los artistas son ficticios, así que fotos podrían sugerir hechos que la demo no representa.
- Siguiente paso: reconsiderar si UMBRAL recibe material real autorizado de artistas o recinto, o si una sección concreta queda sin comunicar algo que el SVG no resuelve. La vista previa local sigue en `http://127.0.0.1:3435`.

## Imágenes del recinto ficticio y sus espacios (30 de octubre de 2026)

- Objetivo: incorporar imágenes de Nave 08, Nave A y el Patio para hacer reconocibles los espacios del festival inventado.
- Cambios: tres visualizaciones conceptuales generadas con Codex imagegen, convertidas a WebP optimizado y añadidas a `examples/demo-umbral/public/espacios/`. Galería responsive en la portada con `next/image`, alt descriptivo y una nota visible que aclara que el recinto es ficticio.
- Decisiones: se conserva el portal geométrico SVG como motivo de identidad y las nuevas imágenes se concentran en la galería, donde ayudan a distinguir lugar y espacios. No se presentan como fotos de una ubicación real.
- Comprobaciones: build y pruebas de recorrido de un consumidor aislado, `npm run smoke`, revisión visual en escritorio y móvil, `npm run verify`, `npm run lab:cuaderno` y `git diff --check`.
- Siguiente paso: revisión del usuario en `http://127.0.0.1:3436/`, con el preview de producción disponible para abrirlo en navegador. El servidor anterior en 3435 sigue intacto.

## Revisión de dirección visual de UMBRAL (30 de octubre de 2026)

- Objetivo: responder a la valoración de que las imágenes y su disposición se sentían genéricas, y mostrar más acción humana en los espacios.
- Cambios: se generaron nuevas visualizaciones con asistentes entrando y encontrándose en Nave 08, bailando en Nave A y alternando baile/conversación en el Patio. La galería pasa de tres tarjetas iguales a un collage de recorrido: Nave A domina en un arco; entrada y patio se escalonan a su lado, con marcas 00–02 que señalan la ruta real del recinto.
- Decisiones: el arco enlaza la sala principal con el portal geométrico del hero; el azul y amarillo vienen de la guía elegida. Se conserva el aviso de que personas y lugares son generados y ficticios.
- Comprobaciones: typecheck y build del consumidor aislado correctos; QA completo del recorrido, filtros, compra de muestra y transiciones; axe sin violaciones; las tres imágenes cargan con alt y aviso ficticio; sin overflow a 320/390/768/1440 px; `smoke` en las tres rutas sin errores ni sombras; revisión de capturas de escritorio y móvil. `npm run verify` y `git diff --check` correctos.
- Comprobación adicional: el preview de referencia en `http://127.0.0.1:3435/` también sirve la nueva portada y los tres assets; `smoke` vuelve a pasar en ese puerto. Se deja 3435 como URL única de revisión y se cierra el servidor duplicado 3436.
- Siguiente paso: revisión del usuario en `http://127.0.0.1:3435/`.

## Tres direcciones visuales para UMBRAL (30 de octubre de 2026)

- Objetivo: crear tres demostraciones estéticas basadas en el contenido generado para UMBRAL, manteniendo el programa, flujo de pase, portal SVG, imágenes conceptuales y una parte de los colores corporativos.
- Cambios: se añadieron tres portadas React propias —cubierta editorial Fanzine (3436), escena inmersiva de Club nocturno (3437) y afiche modular Cartel (3438)— además de hojas CSS aisladas en `examples/demo-umbral/app/variantes/`; materializador a `.cache/` en `scripts/prepare-umbral-variantes.mts`.
- Decisiones: cada copia usa el paquete local ya congelado y conserva `node_modules` y `.next` propios; no se tocó el consumidor base 3435 ni se alteró la API del kit. Se dejan los tres servidores abiertos para revisión.
- Decisión tras valoración del usuario: la primera versión parecía la misma maqueta con otra piel; se rehizo la estructura de cada portada y se mantuvo el contenido, las rutas y las imágenes compartidas.
- Comprobaciones: `npm run build` de producción en los tres consumidores; QA completo de `scripts/qa/demo-umbral.mts` en los tres: filtros, compra de muestra, validación, persistencia, descarga, transiciones, axe WCAG 2.0 A/AA y 320/390/768/1440 px; todos pasan. `npm run smoke` devuelve HTTP 200 sin errores ni sombras. Capturas revisadas en `.refs3d/demo-umbral/entrega-*`.
- Verificación del repo: `typecheck`, `ui:test`, `check:shadows`, `cine:test`, cuaderno y `git diff --check` pasan. `npm run verify` queda bloqueado por 39 JSON de `docs/agents/` que `catalog:check` considera desactualizados; al ejecutar `agents:test` de forma aislada también falla la instantánea de conocimiento por metadatos de commit/hash anteriores. No se regeneraron datos del catálogo ajenos a esta demo.
- Siguiente paso: valoración del usuario en `http://127.0.0.1:3436`, `:3437` y `:3438`; se mantienen las tres vistas previas levantadas.

## Criterio de revisión de solapamientos en skills (30 de octubre de 2026)

- Objetivo: evaluar solapamientos según si construyen la composición o si interfieren con la lectura y el uso.
- Cambios: `trama-style` pide clasificarlos por efecto y revisar capas, jerarquía, recortes y textos en imágenes a tamaños reales; `trama-build` define como fallo el texto oculto/ilegible o la capa que intercepta controles.
- Decisión: una colisión gráfica puede ser deliberada; que sea intencional no exime de legibilidad. Texto informativo y acciones deben seguir claros.
- Comprobaciones: revisión de ambos `SKILL.md` y `git diff --check`. `npm run pkg:pack` no pudo continuar porque el preflight `catalog:check` detecta los mismos 39 JSON desactualizados de `docs/agents/`; no se regeneró ese catálogo ajeno a este cambio.
- Prueba en las demos: inspección de capturas desktop/móvil y geometría de texto en 3436–3438. Se halló y corrigió la fecha del afiche Cartel sobre el titular a 390 px; QA completo del flujo en Cartel pasó tras el ajuste. Las intersecciones de FAQ eran respuestas cerradas del acordeón, sin colisión visible.
- URLs para revisión del usuario: Fanzine `http://127.0.0.1:3436`, Nocturno `http://127.0.0.1:3437`, Cartel `http://127.0.0.1:3438`.
- Siguiente paso: recibir feedback visual del usuario; regenerar/revisar el catálogo de agentes en una tarea propia y volver a empaquetar para validar la copia instalada.

## Detección y corrección de solapamientos no vistos (30 de octubre de 2026)

- Objetivo: investigar tres capturas donde el criterio de solapamientos no detectó texto interferido y evitar que el flujo de skills vuelva a omitir casos equivalentes.
- Causa: el chequeo previo se limitaba a dos anchos responsive y a elementos semánticos. No veía capas de texto en `div`/`span` ni el texto dentro de elementos `aria-hidden`; tampoco comparaba geometría con las imágenes.
- Cambios: nuevo `npm run qa:visual-text -- <url> --widths ...`, que recorre rangos de todos los nodos de texto visibles, informa intersecciones texto/texto y texto/imagen/SVG/canvas/video, clipping y texto menor de 12 px, y guarda capturas e informe JSON. Se amplió el método en las skills `trama-style` y `trama-build` para probar el ancho de referencia y ambos lados de breakpoints, clasificar candidatos con inspección visual y no declarar fallo solo por geometría. Fanzine usa composición en dos columnas hasta 1280 px y titular escalado entre 1281 y 1440 px; Cartel ya no coloca el sello vertical sobre el título; coordenadas móviles del portal usan una etiqueta oscura legible.
- Decisiones: las intersecciones geométricas son señales, no veredictos: el interlineado editorial y el texto intencional sobre fotos/SVG dan positivos esperados. La inspección de las capturas es obligatoria para decidir si la composición afecta lectura. No cambia la API ni los tokens de Trama.
- Comprobaciones: capturas y JSON de QA en `.refs3d/visual-text/` para Fanzine 800/830/1000/1001/1150/1200/1201/1280/1281/1400/1440/1441, Cartel 1072/1150/1151/1200/1440 y móvil base 440; revisión manual de capturas 1001/1201/1281, 1072/1151 y 440. `scripts/qa/demo-umbral.mts` pasa en base, Fanzine y Cartel; `npm run smoke` pasa en puertos 3435–3438; builds de consumidores y del sitio, `typecheck`, `ui:test`, `check:shadows`, `cine:test` y cuaderno correctos. `npm run verify` se detiene en `catalog:check` por 39 JSON desactualizados en `docs/agents/`; `agents:test` también falla en su snapshot por metadatos/hash que aún refieren a `ff57bdd` mientras el código está modificado. No se regeneraron los datos del catálogo ajenos a esta tarea. Sin push, publicación o despliegue.
- Rama: `feat/evolucion-agentes`; vista previa de producción conservada en `http://127.0.0.1:3435` y variantes en 3436–3438.
- Siguiente paso: revisión del usuario en las vistas locales de UMBRAL; cuando confirme, incorporar el resultado al flujo de habilidades. Las vistas previas de producción siguen activas en 3435–3438.

## Proximidad entre la marca y el kicker en Fanzine (30 de octubre de 2026)

- Objetivo: depurar la captura donde la marca «UMBRAL» del índice parece invadir el kicker «MADRID · NAVE 08».
- Causa: la skill y `qa:visual-text` valoraban cajas que se intersectan, pero esta pareja de bloques vecinos conservaba un hueco positivo muy pequeño. En la geometría reproducida a 1441 px, la separación diagonal era 14,8 px: suficiente para no contar como colisión, insuficiente para una lectura holgada junto a una marca en cursiva.
- Cambios: `qa:visual-text` registra candidatos entre bloques con poco margen para cubrir salientes de cursiva y tracking negativo; se acotó el margen máximo para no elevar como problema toda proximidad con titulares grandes. La skill ahora requiere verificar el viewport CSS cuando la captura incluye navegador/zoom y revisar marcas, índices y kickers entre columnas. Fanzine reduce la marca del índice en escritorio y separa mejor la primera columna entre 1281–1440 px.
- Decisión: conservar el formato editorial, con un gutter tipográfico mayor; el detector informa proximidad para revisión humana, no la clasifica automáticamente como fallo.
- Comprobaciones: `qa:visual-text` en 1281/1400/1440/1441/1536 px; antes del ajuste señalaba la marca contra el bloque vecino con 14,8 px de distancia; tras el ajuste, esa pareja deja de aparecer como candidata. Capturas de 1281 y 1441 px revisadas manualmente. Build del consumidor Fanzine, build del sitio, typecheck, flujo completo de la demo, `smoke`, cuaderno y `git diff --check` correctos. `npm run verify` vuelve a detenerse en los 39 JSON obsoletos de `docs/agents/` ya documentados. Puerto 3436 mantenido como preview.
- Rama: `feat/evolucion-agentes`.
- Siguiente paso: revisión del usuario en `http://127.0.0.1:3436`; el preview se mantiene activo.

## Solapamiento del índice en escritorio 1080p (30 de octubre de 2026)

- Objetivo: reproducir la nueva captura de Fanzine y corregir el cruce de «UMBRAL» con la regla vertical en una pantalla de escritorio común.
- Causa: 1080p describe la altura, no el ancho CSS. La captura mide 1918×985 y el layout usa viewport ancho (>1440 px), donde volvía al tamaño de marca de 23 px dentro de una columna de 100 px. El texto excedía el límite interior y cruzaba el borde. La corrección anterior solo cubría hasta 1440 px.
- Cambios: `qa:visual-text` ahora informa cuando un rango de texto rebasa el borde de su contenedor flex/grid, además de colisiones y proximidad entre bloques. La skill distingue resolución física de viewport CSS y pide comprobar el ancho completo en escritorio 1080p. Fanzine mantiene la marca del índice entre 17 y 18 px en el layout de escritorio para que quepa con margen en la columna.
- Decisiones: preservar el layout de tres columnas; ajustar el tamaño de una etiqueta de índice es menos disruptivo que mover la regla o ensanchar la columna a costa del titular y la fotografía.
- Comprobaciones: antes del arreglo `qa:visual-text` reprodujo el desborde de «UMBRAL» por 8,8 px a 1918 px; después, sin desbordes de esa marca en 1281/1440/1441/1918/1920/2560 px. Informe y capturas en `.refs3d/visual-text/3436-1793358056337/`; revisión visual a 1281 y 1918 px. Build del consumidor y del sitio, typecheck, recorrido funcional de Fanzine, smoke, cuaderno y `git diff --check` correctos. `npm run verify` continúa bloqueado por los 39 JSON desactualizados de `docs/agents/` ya documentados.
- Siguiente paso: revisión del usuario en `http://127.0.0.1:3436` con viewport CSS de 1918 px.

## Siguiente prueba de skills: tres demos para una empresa tecnológica (30 de octubre de 2026)

- Estado: implementada y disponible para revisión en `http://127.0.0.1:3441/`.
- Objetivo: probar las skills de revisión actualizadas construyendo tres demos funcionales para la misma propuesta de una SL de servicios tecnológicos. Deben diferenciarse en enfoque y estructura, aprovechar la librería y ofrecer experiencias efectistas pero útiles para explicar y convertir.
- Prompt recibido:

```text
Con todos los cambios realizados en esta sesion sobre las skills de revision. Voy a solicitar tres demos funcionales al 100% que incluyan imagenes si es necesario, animaciones, transiciones entre paginas y un abanico amplio de opciones para mostrar la potencia y alcance de la libreria para generar diferentes demostraciones con aproximaciones y puntos de vista totalmente diferentes entre si para una misma propuesta. Objetivo: 3 Webs para una SL que ofrece servicios tecnologicos de desarrollo de software a medida con enfoque en la UX de alto impacto. La empresa se dedica a crear soluciones digitales transversales para grandes empresas. Las demos deben impactar en el uso de tecnicas modernas con una UI efectista en todas ellas aportando cierto valor cinematico en sus narativas pero efectivas a la hora de convertir las explicaciones en acciones para el usuario. La empresa actualmente debe simular haber participado en campañas de marketing, aplicaciones, webs, y ferias donde la tecnologia y efectismo digital es la base y core de la personalidad de los trabajos realizados.
```

- Siguiente paso: revisión humana de las tres experiencias en producción local. Mantener pendiente la regeneración de los 39 JSON de `docs/agents/` hasta una tarea específica.

## Tres experiencias RIZO para una empresa tecnológica (30 de octubre de 2026)

- Objetivo: llevar el prompt guardado a tres webs navegables para la SL ficticia RIZO UX Systems, con aproximaciones diferentes a campañas, producto/software y ferias.
- Cambios: nueva fuente en `examples/demo-rizo/`; materializador seguro en `scripts/prepare-demo-rizo.mts`; tablero operativo filtrable y buscable, ficha secundaria de producto, caso secundario de campaña, programa interactivo, registro de brief y visita en `localStorage`; imágenes conceptuales generadas para Señal y FORO / 10; ficha `docs/cuaderno/demo-rizo-empresa-tecnologica.md` e índice actualizado. El root del sitio permite elegir las tres rutas bajo `/campaign`, `/system` y `/forum`.
- Decisiones: una app Next aislada y un origen compartido simplifican la navegación/transición y dejan cada web en su espacio de rutas; el landing index funciona como selector, con links cruzados. Las acciones muestran estado y guardan solo datos locales. Las imágenes, clientes, campañas, personas, resultados y evento se presentan como ficticios. No se altera el kit ni se conectan sistemas externos.
- Comprobaciones: `typecheck` y build de producción del consumidor RIZO correctos; build del sitio de la librería correcto (advierte por el tracing dinámico existente de cine y fuentes sin override); `smoke --auditar` en índice y cinco rutas sin errores de consola, sombras oscuras ni controles/enlaces sin efecto; Playwright recorre navegación, briefs, filtros, búsqueda, detalle, agenda y reserva local. `qa:visual-text` sin desbordes ni texto recortado en las rutas principales a 16 anchos (320–1920 px), y sin marcas en las dos fichas secundarias a 14 anchos. En `/forum`, solo queda la intersección geométrica de los bounding boxes de las dos líneas del titular «FORO / 10»; inspeccionadas en capturas a 320 y 556 px, las letras no se tocan y el titular mantiene lectura. Evidencias ignoradas en `.refs3d/visual-text/3441-1793359766417`, `...9773220`, `...9778417` y `.refs3d/smoke/`.
- Estado de `verify`: ejecutado; pasa `typecheck` y se detiene en `catalog:check` por los 39 JSON obsoletos de `docs/agents/` que el usuario pidió dejar sin regenerar. `agents:test` también señala la huella/fuente obsoleta. `ui:test`, `check:shadows`, `cine:test` y `lab:cuaderno -- --check` pasan por separado.
- Rama/worktree: `feat/evolucion-agentes`, `C:/COMPARTIDO/trama-evolucion-agentes`; paquete instalado trama-ui 0.13.0, consumidor aislado en `.cache/demo-rizo`.
- Servidor de revisión: `http://127.0.0.1:3441/` (producción local, iniciado por esta tarea y conservado para revisión).
- Siguiente paso: recibir observaciones de la revisión humana; mantener la deuda de los JSON pendiente y no publicar ni desplegar.

## Texto legible sobre superficies reales (30 de octubre de 2026)

- Objetivo: corregir el contraste insuficiente de algunos textos de Rizo OS y hacer que las skills bloqueen futuros entregables con texto ilegible sobre fondos propios, tarjetas, estados e imágenes.
- Causa: las skills mencionaban el 4,5:1, pero el flujo no exigía medir cada pareja efectiva ni dejar incompletos como tareas abiertas. El tablero aplicaba `#777d80` a estados pálidos (3,66:1), `#767c7b` sobre la ficha (3,8:1) y opacidad .72 al texto de ayuda (3,05:1). `smoke` y `qa:visual-text` no miden contraste.
- Cambios: `trama-style` y `trama-build` ahora hacen del contraste WCAG AA una puerta de salida por ruta/superficie/estado, prescriben tamaños mínimos de lectura, y exigen revisión manual de `incomplete` sobre imágenes/gradientes. Nuevo `npm run qa:contrast`, con axe-core, recorre página completa por scroll, comprueba anchos indicados e informa violaciones y casos no resueltos. README y flujo documentan su uso. Rizo OS oscurece y agranda metadatos; los formularios eliminan opacidad sobre texto; campaña y foro ponen rótulos sobre scrims opacos.
- Decisiones: 4,5:1 para texto normal; 3:1 solo para texto grande/gráfico. Ni `GuideFrame textContrast` ni el cálculo de tokens certifican CSS propio o fondos anidados. El checker no finge medir píxeles sobre imagen: marca esos casos para revisión y pide un scrim o una medida visual documentada.
- Comprobaciones: el checker detectó los casos bajos originales y, tras corregirlos, registra cero violaciones automáticas en `/system`, `/campaign` y `/forum` a 16 anchos (320–1920 px); las capturas de las leyendas de imagen y del tablero móvil/escritorio se revisaron visualmente. `qa:visual-text` no registra colisiones, texto fuera de contenedor, clipping ni cruces con medios en las rutas principales; marca textos ornamentales de 8–10 px para revisión, conservados por ser kickers de apoyo. `smoke` pasa en las tres rutas y el recorrido Playwright de campaña, tablero, búsqueda, agenda y reservas locales termina sin errores. Axe deja 10 casos `incomplete` en `/system` para los chips de dos estados entre 390 y 720 px: inspección manual con `elementFromPoint` confirmó que los chips no están cubiertos y sus fondos sólidos conservan contraste suficiente; se documentan como limitación del análisis automático. `typecheck`, `ui:test`, `check:shadows`, `cine:test`, `lab:cuaderno -- --check` y build de producción del consumidor pasan. `npm run verify` pasó `typecheck` y se detuvo en `catalog:check` por los 39 JSON de `docs/agents/` aplazados; no se modificaron. Evidencia axe en `.refs3d/contrast/3441-1793361814511`, `...14507` y `...14515`; capturas revisadas en `.refs3d/contrast/review/`; todos ignorados.
- Rama/worktree: `feat/evolucion-agentes`, `C:/COMPARTIDO/trama-evolucion-agentes`; el commit previo es `1a09310`. Sin push.
- Servidor: RIZO continúa disponible en `http://127.0.0.1:3441/`.
- Siguiente paso: revisar las tres demos y el criterio de contraste; conservar pendientes los 39 JSON de `docs/agents/` para una tarea específica.
