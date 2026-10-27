<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trama — cómo trabajar en este repo

**Trama** es el nombre de esta librería de componentes (el paquete se llama `trama-ui`).

## Trabajo con Claude Code y Codex

- Estas instrucciones son la fuente común; `CLAUDE.md` las importa. Flujo y preparación: `docs/flujo-agentes.md`.
- Al comenzar, revisa `git status --short` y `git worktree list`. Conserva los cambios existentes y registra qué tarea, rama y URL estás usando.
- Para tareas simultáneas usa un worktree por tarea, con dependencias, `.next`, puerto y salidas propios. Si se comparte directorio, trabaja por turnos.
- Ejecuta `npm run doctor` para diagnosticar el entorno; `npm run doctor -- --cine --browser` comprueba también el navegador y los requisitos de cine.
- Ejecuta `npm run verify` antes de entregar. El build va aparte y nunca se ejecuta junto al dev del mismo worktree. No detengas servidores ajenos.
- Comprueba cambios visuales con `npm run smoke -- <url-local>` y las herramientas de cine cuando corresponda. Una captura no sustituye la revisión visual.
- **Cuaderno del lab**: cada ejercicio (estudio de una web, réplica, demo, pieza nueva o ampliada, concepto, herramienta) deja su ficha en `docs/cuaderno/` (`npm run lab:cuaderno -- --nueva <id>`), con las etiquetas del vocabulario existente, y se regenera el índice con `npm run lab:cuaderno`. En réplicas, mide el par con `npm run refs:probe -- --par <original> <réplica>` antes de darla por buena. Método en `docs/53-cuaderno-del-laboratorio.md`; se lee en `/lab/cuaderno`.
- Al cambiar de agente deja un registro por tarea con objetivo, rama, cambios, decisiones, comprobaciones y siguiente paso; plantilla en `docs/flujo-agentes.md`.

Este repo es una **librería de componentes** para proyectos Next.js (ASCII, textmode, pixel art y secciones de landing)
más un sitio que la enseña. Dos tipos de tarea:

## 1. Montar una página o un proyecto con el kit

1. Lee **`docs/CATALOG.md`** (generado; imports, props con tipos y defaults, y recetas de landings). No hace falta
   abrir los componentes para usarlos.
2. Compón con **Secciones** primero (`Hero`, `FeatureGrid`, `PricingSection`, `FAQSection`, `ContactForm`, `Footer`…)
   y baja a piezas sueltas solo para lo que falte.
3. Si el usuario da como referencia una demo (`/demo/th-folio`, «como CIPHERGRID»…), busca su receta en la sección
   «Landings de referencia» de `CATALOG.md` y abre el archivo de la landing solo para copiar estructura. Para una web
   de varias páginas (blog, tienda con carrito, servicios con chatbot, fabricante, portfolio minimalista) parte de
   «Webs completas de referencia» (`/sitios/<slug>`, `components/sites/`; ver `docs/03-webs-completas.md`).
   Para un **negocio de un sector** (peluquería, barbería, gimnasio, estudio boutique, academia, producto de marca,
   agencia), parte de «Recetas por sector» de `CATALOG.md`: guía de estilo, orden de secciones con sus piezas, llamada
   fija y lo que no hay que olvidar, medido en las réplicas del laboratorio.
4. **Pasa siempre las props de texto**: los defaults son copy de demostración (escuela de surf…). Pasa `""` para
   ocultar un texto opcional.
5. Tema = tokens CSS `--bg --fg --mut --acc --acc2 --card --ln --r` en un contenedor; estilo = prop `variant`
   (`glass solid outline neon retro terminal minimal dotmatrix`); color semántico = prop `intent`
   (`accent neutral success info warning danger`), igual en Button, Badge, Alert, TextField, Toast y Modal.
   No añadas colores fijos.
6. En **otro proyecto**, dos opciones: `npm i trama-ui` (imports `trama-ui` / `trama-ui/X`, CSS `trama-ui/styles.css`,
   referencia en `node_modules/trama/CATALOG.md`), o `npm run kit:export -- <ruta> [--only A,B]` desde este repo
   para copiar el código y adaptarlo (`import "@/components/ui/styles/kit.css"` y `fontVariables` de `@/lib/ui/fonts`).

## 2. Cambiar o ampliar la librería

- Kit = `components/ui/` + `components/ui/styles/` + `lib/ui/` + motores (`lib/asciify`, `lib/sketches`, `lib/scroll`,
  `lib/text`, `lib/gems`, `lib/story`, `lib/modelnav`, `lib/object3d`, `lib/typefield`, `lib/porthole`, `lib/physics`, `lib/toydrive`, `lib/chapterstage`, `lib/crosscluster`, `lib/gravure`, `lib/postfx`, `lib/cine`). Catálogo `/componentes` = `lib/catalog/` + `components/playground/`. Web de la librería (`/`, `/docs`, `/demos`) = `components/site/` + `lib/docs.ts`
  (las páginas de `/docs` son los `.md` de `docs/`). Demos y landings = el resto.
  El kit **no** puede importar del catálogo, de las landings ni de `lib/themes`/`lib/demos`.
- Componente nuevo o cambio de props: sigue `docs/02-guia-de-componentes.md` §3 y §9, regístralo en
  `lib/catalog/entries/<categoría>.tsx`, añádelo a la tabla de `docs/README.md` y ejecuta `npm run catalog`.
- Mejoras hechas en un proyecto: `npm run kit:pull -- <ruta>` (informe) y `--apply` (las trae); revisa `git diff`.
- Antes de terminar: `npm run typecheck`, `npm run catalog:check`, `npm run check:shadows` (sin sombras de texto negras ni brillos sin `--glow`: guía §8.0) y, si tocaste rutas o CSS, `npm run build`
  (**nunca** con el `next dev` del usuario en marcha: comparten `.next/` y lo deja roto).
- Paquete npm: `npm run pkg:build` (y `pkg:pack` para probar el `.tgz`); ver «Publicar en npm» en `docs/README.md`.
- Estudiar una web 3D de referencia (cámara, luz, posprocesado, movimiento) o depurar una recreación: `npm run
  cine:capture -- <url>`, `cine:analyze`, `cine:compare` y `cine:rampa` (`scripts/cine/`, ficha en `lib/cine/`, banco en `/lab/cine/[estudio]`);
  método, vocabulario y trampas en `docs/26-cine-3d-metodo-y-vocabulario.md`.
- Hay trampas documentadas (legibilidad sobre fondos, `min-width: 0` en grids anidados, glifos bitmap sin acentos…):
  `docs/02-guia-de-componentes.md` §10 y §16.
