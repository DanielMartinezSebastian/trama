<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trama — cómo trabajar en este repo

**Trama** es el nombre de esta librería de componentes (el paquete se llama `trama`).

Este repo es una **librería de componentes** para proyectos Next.js (ASCII, textmode, pixel art y secciones de landing)
más un sitio que la enseña. Dos tipos de tarea:

## 1. Montar una página o un proyecto con el kit

1. Lee **`docs/CATALOG.md`** (generado; imports, props con tipos y defaults, y recetas de landings). No hace falta
   abrir los componentes para usarlos.
2. Compón con **Secciones** primero (`Hero`, `FeatureGrid`, `PricingSection`, `FAQSection`, `ContactForm`, `Footer`…)
   y baja a piezas sueltas solo para lo que falte.
3. Si el usuario da como referencia una demo (`/demo/th-folio`, «como CIPHERGRID»…), busca su receta en la sección
   «Landings de referencia» de `CATALOG.md` y abre el archivo de la landing solo para copiar estructura.
4. **Pasa siempre las props de texto**: los defaults son copy de demostración (escuela de surf…). Pasa `""` para
   ocultar un texto opcional.
5. Tema = tokens CSS `--bg --fg --mut --acc --acc2 --card --ln --r` en un contenedor; estilo = prop `variant`
   (`glass solid outline neon retro terminal minimal`); color semántico = prop `intent`
   (`accent neutral success info warning danger`), igual en Button, Badge, Alert, TextField, Toast y Modal.
   No añadas colores fijos.
6. En **otro proyecto**, dos opciones: `npm i trama` (imports `trama` / `trama/X`, CSS `trama/styles.css`,
   referencia en `node_modules/trama/CATALOG.md`), o `npm run kit:export -- <ruta> [--only A,B]` desde este repo
   para copiar el código y adaptarlo (`import "@/components/ui/styles/kit.css"` y `fontVariables` de `@/lib/ui/fonts`).

## 2. Cambiar o ampliar la librería

- Kit = `components/ui/` + `components/ui/styles/` + `lib/ui/` + motores (`lib/asciify`, `lib/sketches`, `lib/scroll`,
  `lib/text`). Catálogo `/componentes` = `lib/catalog/` + `components/playground/`. Galería y landings = el resto.
  El kit **no** puede importar del catálogo, de las landings ni de `lib/themes`/`lib/demos`.
- Componente nuevo o cambio de props: sigue `docs/02-guia-de-componentes.md` §3 y §9, regístralo en
  `lib/catalog/entries/<categoría>.tsx`, añádelo a la tabla de `docs/README.md` y ejecuta `npm run catalog`.
- Mejoras hechas en un proyecto: `npm run kit:pull -- <ruta>` (informe) y `--apply` (las trae); revisa `git diff`.
- Antes de terminar: `npm run typecheck`, `npm run catalog:check` y, si tocaste rutas o CSS, `npm run build`
  (**nunca** con el `next dev` del usuario en marcha: comparten `.next/` y lo deja roto).
- Paquete npm: `npm run pkg:build` (y `pkg:pack` para probar el `.tgz`); ver «Publicar en npm» en `docs/README.md`.
- Hay trampas documentadas (legibilidad sobre fondos, `min-width: 0` en grids anidados, glifos bitmap sin acentos…):
  `docs/02-guia-de-componentes.md` §10 y §16.
