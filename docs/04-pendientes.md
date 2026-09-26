# Pendientes

Lista de trabajo para seguir iterando la librería y su web. Marca `[x]` al terminar cada punto y borra la sección
cuando quede vacía. Orden dentro de cada bloque: de más a menos importante.

Antes de dar un punto por hecho: `npm run typecheck`, `npm run catalog:check` y, si tocaste rutas o CSS,
`npm run build` (con el `next dev` parado).

## 1. Publicación de la web

- [ ] **Dominio.** Definir `NEXT_PUBLIC_SITE_URL` (p. ej. `https://trama.dev`) en el hosting. Sin ella, fuera de Vercel,
      `sitemap.xml`, `robots.txt` y la vista previa apuntan a `http://localhost:3000` (`lib/site-url.ts`).
- [ ] **Fuente de la imagen de vista previa.** `app/opengraph-image.tsx` usa Geist Regular (la que trae `next/og`); la
      portada usa Inter 900. En el PC:
  1. `npm i -D @fontsource/inter` y copiar `node_modules/@fontsource/inter/files/inter-latin-900-normal.woff` a
     `assets/fonts/inter-900.woff` (fuera de `public/`; `next/og` acepta ttf/otf/woff, **no** woff2).
  2. En `opengraph-image.tsx`: `const inter = await readFile(join(process.cwd(), "assets/fonts/inter-900.woff"))`
     (la función pasa a `async`) y `new ImageResponse(…, { ...size, fonts: [{ name: "Inter", data: inter, weight: 900 }] })`.
  3. Poner `fontFamily: "Inter"` y `letterSpacing: -18` en el «TRAMA». Comprobar en `/opengraph-image` tras `npm run build && npm start`.
  4. Desinstalar `@fontsource/inter` si solo servía para copiar el archivo.
- [ ] **Rendimiento en móvil.** Lighthouse (móvil) sobre `/`, `/docs/catalogo` y `/componentes` tras el primer despliegue.
      Si la portada va lenta: bajar `fps`/subir `cellSize` del `RetroCanvas` en pantallas estrechas, o sustituirlo por
      una imagen fija con `prefers-reduced-motion` (`components/site/HomePage.tsx`, `HomeStage`).
- [ ] **Navegadores.** Probar Safari (iOS y macOS) y Firefox. El scroll de las páginas de la web depende de
      `html:has(.tr…)` en `components/site/site.css` (Firefox ≥ 121, Safari ≥ 15.4).
- [ ] **Enlace a npm.** El pie enlaza a `npmjs.com/package/trama-ui`: publicar el paquete (`npm run pkg:build`, ver
      «Publicar en npm» en `README.md`) o quitar el enlace hasta entonces.
- [ ] **CI.** Una GitHub Action que ejecute `npm ci`, `typecheck`, `catalog:check` y `build` en cada PR y en `main`.

## 2. Web de la librería (`components/site/`)

- [x] **Foco visible** en los controles de la web y regla base en el kit; enlace «Saltar al contenido».
- [ ] **Recorrer la web solo con teclado** (Tab, Mayús+Tab, Intro, Esc) y con un lector de pantalla real (VoiceOver o
      NVDA): la auditoría automática no cubre el orden de foco ni lo que se anuncia.
- [ ] **`/componentes` en móvil.** No está revisado a 390 px (la barra lateral ocupa el 40 % de alto). Valorar un
      selector plegable en lugar de la lista.
- [ ] **Categoría en la URL.** El catálogo lee `?c=<categoría>` al entrar pero no la actualiza al cambiar de filtro
      (`components/playground/Playground.tsx`).
- [ ] **Miniaturas en `/demos`.** Las filas son solo texto. Generar capturas con Playwright (un script en `scripts/` que
      abra cada `/demo/<slug>` y `/sitios/<slug>` y guarde un `.webp` en `public/demos/`) y mostrarlas al pasar el ratón.
- [ ] **Buscador en la documentación.** Una paleta (⌘K) con títulos de docs y componentes; el `NavBar` del kit ya trae
      `search="command"` si se quiere reutilizar.
- [ ] **Enlaces «en vivo» en el catálogo de props.** Que cada componente de `/docs/catalogo` enlace a
      `/componentes#<id>` (se genera en `scripts/build-catalog.mts`).
- [ ] **Cifras coherentes.** La portada dice «64 demos + 5 webs» y `/demos` «69»: unificar el criterio.
- [ ] **Imagen de vista previa por página** (opcional): `opengraph-image.tsx` dentro de `app/docs/[[...slug]]/` y
      `app/demo/[slug]/` con el título de cada una.
- [ ] **Banco de variantes.** Añadir un selector de tema (preset de tokens) junto a `variant` e `intent` para enseñar
      también el tercer eje.

## 2b. SEO y accesibilidad (seguimiento)

Hecho: título, descripción y URL canónica por página; un solo `h1` por página; JSON-LD (`WebSite`, `SoftwareSourceCode`,
`TechArticle`, `BreadcrumbList`) en `lib/seo.tsx`; manifiesto; reglas del kit en la guía §8.1. Para repetir la auditoría:
axe-core con Playwright sobre `npm start` (ver «Pruebas» más abajo).

- [ ] **Google Search Console.** Dar de alta el dominio y enviar `/sitemap.xml`; revisar «Páginas» y «Experiencia» al
      cabo de unos días.
- [ ] **`StatCounter`:** el número ASCII (`.ui-stat__art`, `role="img"`) tiene scroll horizontal si no cabe, y una imagen
      no debería desplazarse. Escalarlo al ancho disponible en lugar de desplazarlo.
- [ ] **Elementos fijos fuera de un landmark** (aviso menor de axe): barra de `ScrollProgress` en SILO, botón del carrito
      de Pixelforge y marquesina de Onda.
- [ ] **Landings temáticas antiguas** (`th-tide`, `th-brew`…, `ThemedLanding`): títulos vacíos al cargar y contenido
      fuera de landmarks. Se arreglan solos si se migran al kit o se retiran (ver «Deuda conocida»).
- [ ] **Contraste decorativo:** las reglas de `Divider` y las iniciales del avatar de `Testimonial` son decorativas
      (`aria-hidden`) pero axe las marca en temas oscuros; valorar subir su contraste igualmente.
- [ ] **Clara Vidal:** la etiqueta de `LogoCloud` («Me han leído en…») no llega a 4.5:1; axe mide contra el halo de
      `--legibility-ts`, pensado para fondos oscuros. Probar `--legibility-ts: 0 0 transparent` en el tema claro de esa web.

- [ ] **Peso de `/componentes`** (≈ 620 KB de JS comprimido, three.js incluido): el catálogo importa todas sus entradas.
      Cargar con `next/dynamic` las más pesadas (fondos 3D, `RetroCanvas`, `AsciiBackground`) solo al seleccionarlas.

## 3. Documentación (`docs/`)

- [ ] **`README.md` desactualizado:** dice «comparador de los 7 estilos» (son 8) y «Seis landings construidas solo con
      el kit», pero su tabla no incluye `th-dotmatrix` (SIGNAL) ni `th-silo` (SILO).
- [ ] **Código ancho en `Prose`.** `.ui-code` tiene `max-width: 640px`: dentro de la documentación queda más estrecho
      que el texto y obliga a desplazar líneas que cabrían. Valorar `max-width: none` dentro de `.ui-prose`.
- [ ] **`CATALOG.md` es muy largo** para una sola página web (≈ 1500 líneas): valorar una página por categoría en `/docs`.
- [ ] **Versión en inglés** de la web y de `00-empezar.md`, si la librería va a tener público fuera de España.

## 4. Librería (`components/ui/`, `lib/`)

- [ ] **Prueba del arreglo de Markdown.** `lib/ui/markdown.tsx` ya acepta la continuación sangrada de un ítem de lista
      (`- texto\n  sigue`); falta un caso de prueba que lo fije (ver el punto siguiente).
- [ ] **Pruebas.** No hay pruebas automáticas: empezar por las funciones puras (`lib/ui/markdown.tsx`,
      `lib/ui/markdownInline.tsx`, `snippet` de `lib/catalog/schema.ts`) con Vitest, y capturas visuales con Playwright
      de `/componentes#<id>` en las 8 variantes.
- [ ] **Deuda conocida** (ver «Deuda conocida» en `README.md`): `ThemedLanding` y las seis landings temáticas antiguas
      no usan el kit; migrarlas o retirarlas (junto con `app/landings.css`) si ya no aportan.
- [ ] **Imágenes ASCII sin JS.** Los componentes con lienzo no tienen alternativa estática cuando falla WebGL o está
      activo `prefers-reduced-motion`; revisar `RetroCanvas`, `AsciiBackground` y `TextmodeBackground`.
