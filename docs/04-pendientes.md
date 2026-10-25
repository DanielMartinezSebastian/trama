# Pendientes

Lista de trabajo para seguir iterando la librería y su web. Marca `[x]` al terminar cada punto y borra la sección
cuando quede vacía. Orden dentro de cada bloque: de más a menos importante.

Antes de dar un punto por hecho: `npm run typecheck`, `npm run catalog:check` y, si tocaste rutas o CSS,
`npm run build` (con el `next dev` parado).

## 0. Publicación del paquete

- [ ] **Publicar `trama-ui@0.6.2` en npm** (incluye lo de 0.3.0, 0.4.0, 0.5.0 y 0.6.0/0.6.1, que nunca se publicaron:
      transiciones de página a pantalla completa con `scan` y `stack`, transiciones de elementos, envío real de
      `ContactForm`, ayudas accesibles y la cabecera sin parpadeo). Está
      construido y empaquetado (rama `feat/view-transitions`, que sale de `fix/mejoras-desde-web`), pero no publicado:
      en el registro sigue la 0.2.0. Pasos (ver «Publicar en npm» en `README.md`):
  1. Fusionar la rama en `main` y comprobar que `package.json` dice `"version": "0.6.2"` y que `CHANGELOG.md` tiene su
     entrada (y las de 0.6.0, 0.5.0, 0.4.0 y 0.3.0).
  2. `npm login` (cuenta dueña de `trama-ui`; `npm whoami` para confirmarlo).
  3. `npm run pkg:build` (vacía y regenera `dist-npm/`).
  4. `cd dist-npm && npm publish --dry-run` para revisar la lista de archivos, y después `npm publish`.
  5. Comprobar con `npm view trama-ui version` (debe decir `0.6.2`).
  6. **Web martinezsebastian.com:** de momento usa el paquete desde un `.tgz` incluido en su propio repo, en `vendor/`
     (`dist-npm/trama-ui-0.6.2.tgz` copiado allí). Cuando esté publicada, volver a la versión del registro
     (`npm i trama-ui@^0.6.2` en ese proyecto), borrar el `.tgz` de su `vendor/` y comprobar que el `package-lock.json`
     apunta a `registry.npmjs.org`.

- [ ] **Comprobar a ojo las 11 animaciones de `PageTransition` a pantalla completa** en Chrome y Safari (pestaña
      visible): que las bandas, la línea de `scan`, las barras de `stack`, el aro del iris y el cursor de `terminal`
      cubren la ventana y que la cabecera queda quieta. `scan` y `stack` (0.6.0) solo se han revisado leyendo el CSS. Verificado por código y con instrumentación JS (estado de `<html>` y nombres capturados en cada
      navegación), no visualmente.

## 0a. La cabecera desaparecía durante la transición (arreglado en 0.6.2)

Reportado desde martinezsebastian.com: la cabecera «parpadeaba» o «se recargaba» al navegar, sobre todo con el botón
del Home hacia Contacto. **Causa real (verificada con un Chrome real, comparando píxeles fotograma a fotograma):**
`PageTransitionPersist` ponía `view-transition-name` en línea en el elemento y además lo envolvía en un
`<ViewTransition>` de React. React trata un boundary que no cambia en un commit como cancelable: lo restaura y oculta
su grupo con `documentElement.animate({ opacity: [0, 0] }, { pseudoElement: "::view-transition-group(nombre)" })`
(react-dom, `commitAfterMutationEffectsOnFiber`, caso de la raíz). Como el elemento seguía con el nombre, el navegador
no lo pintaba en el DOM real durante la transición y su grupo estaba a opacidad 0: **ausente entre 0,3 y 1 s**. Solo
pasaba en navegaciones donde nada cambiaba dentro de la cabecera (Home ↔ Contacto, legales, 404…); con un clic en el
menú, que cambia el enlace activo, el boundary sí «cambiaba» y no se ocultaba. De ahí que pareciera intermitente.
Además el boundary provocaba una segunda `document.startViewTransition` tras la de la navegación.

Corregido quitando el `<ViewTransition>` cuando el hijo es un elemento HTML (solo estilo en línea).

- [x] Arreglo en `components/ui/PageTransition.tsx` (`PageTransitionPersist`), documentado en `docs/05` y `CHANGELOG.md`.
- [x] Revertida la 0.6.2, que armaba la raíz al desmontar: partía de un diagnóstico equivocado (dos commits sin armar)
      y no arreglaba nada.
- [ ] **Prueba de regresión automática.** Se validó con `puppeteer-core` + Chrome headless: clic real, `Page.startScreencast`
      y un detector por píxeles del botón de la cabecera (presente/ausente por fotograma). No está en el repo porque
      pide `puppeteer-core` y un Chrome; valdría un script en `scripts/` para el catálogo de `/componentes`.
- [ ] Comprobar a ojo, en un navegador normal, Home → Contacto y una navegación con clic en el menú.

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

- [ ] **`AsciiBackground` con `palette="duotone"` (o `gradient`) tiñe toda la pantalla.** El motor dibuja los caracteres
      sobre fondo transparente, y la capa `.ui-pal__a` (acento en `multiply`) rellena de color todo el hueco entre
      caracteres: con `position="fixed"` queda un velo del color de acento sobre la página. `TextmodeBackground` no lo
      sufre porque sus bocetos pintan un fondo opaco. Arreglo posible: pintar `--bg` bajo el lienzo dentro de `.ui-fill`
      cuando hay paleta, o aplicar la paleta solo a los caracteres. Visto en martinezsebastian.com (`/herramientas`), que de
      momento usa `palette="original"` con `colorMode="accent"`.
- [ ] **Prueba del arreglo de Markdown.** `lib/ui/markdown.tsx` ya acepta la continuación sangrada de un ítem de lista
      (`- texto\n  sigue`); falta un caso de prueba que lo fije (ver el punto siguiente).
- [ ] **Pruebas.** No hay pruebas automáticas: empezar por las funciones puras (`lib/ui/markdown.tsx`,
      `lib/ui/markdownInline.tsx`, `snippet` de `lib/catalog/schema.ts`) con Vitest, y capturas visuales con Playwright
      de `/componentes#<id>` en las 8 variantes.
- [ ] **Deuda conocida** (ver «Deuda conocida» en `README.md`): `ThemedLanding` y las seis landings temáticas antiguas
      no usan el kit; migrarlas o retirarlas (junto con `app/landings.css`) si ya no aportan.
- [ ] **Aviso `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.`** en la consola al
      montar `RetroCanvas` (o cualquier `<Canvas>`) con three ≥ 0.18x. No es código de Trama: lo lanza
      `@react-three/fiber` 9.x, cuyo store crea `clock: new THREE.Clock()` al montar el `<Canvas>`
      (`node_modules/@react-three/fiber/dist/events-*.js`). Trama solo *lee* `state.clock.elapsedTime` en `useFrame`
      (`RetroFX`, `RetroShapes`, `RetroModel`), que no dispara el aviso. Es inofensivo (Clock sigue funcionando) y no se
      parchea. La 9.8.1 (última estable a 28-09-2026, la instalada) aún lo tiene; la línea 10 (`10.0.0-alpha.5`,
      `canary`) ya no usa `THREE.Clock`, pero es una versión mayor en alfa con cambios de API (planificador `@pmndrs/scheduler`;
      el tiempo pasa a `elapsed` del estado del frame, sin `state.clock`). Al pasar a R3F 10 estable: subir el peer
      `@react-three/fiber` en `scripts/build-package.mts` y cambiar esos `clock.elapsedTime` por el tiempo de la nueva
      API (o acumular el `delta` de `useFrame`).
- [ ] **Imágenes ASCII sin JS.** Los componentes con lienzo no tienen alternativa estática cuando falla WebGL o está
      activo `prefers-reduced-motion`; revisar `RetroCanvas`, `AsciiBackground` y `TextmodeBackground`.

## 4b. Cine 3D: capturar y recrear webs WebGL/WebGPU (docs/26, 23-10-2026)

- [x] **Camera-scroll, quinta vuelta** (24-10-2026): flotación, transición de material y cámara de autor; SSIM 0,921,
      ningún eje por encima del 18 % (docs/26 §6).
- [x] **Primer estudio real** (24-10-2026): Plain Sight → `TypeField` y `lib/postfx` (docs/27).
- [x] `TypeField` en tema oscuro y la coreografía letra a letra (docs/27 §3b, ronda 16).
- [x] **Segundo estudio** (24-10-2026): Hublot → `Porthole` y `lib/porthole`; cámara 3 %, imagen 10 %; coste del método (docs/28).
- [x] **Tercer estudio** (24-10-2026): Bruno Simon → `ToyDrive` y `lib/physics`; dinámica 12 %; eje de acabado (docs/29).
- [x] **Relato con scroll y medida del DOM** (24-10-2026): Meer Mohsin → `ChapterStage`; eje de texto 21 % (docs/30).
- [x] **Ronda 20, materiales** (24-10-2026): Lusion → `CrossCluster` (material analítico en TSL) y `cine:conjunto`; dinámica 17,6 %, acabado 27 % (docs/31).
- [x] **Ronda 21, ilustración en 3D** (25-10-2026): Chartogne-Taillet → `EngravedMap` y `lib/gravure` (grabado a lápiz); imagen 8 %, acabado 7 %, cámara 5 %; `cine:tramo` (docs/32).
- [x] **Ronda 22, revisión y herramientas** (25-10-2026): `cine:explora`, `cine:sonda`, `cine:vuelta` (recetas de los siete estudios), `cine:tramo movimiento`, `--movil`; pájaros y giro por arrastre en `EngravedMap` (docs/33).
- [ ] Decorado de `ToyDrive` para subir el acabado y eje de cámara por ventanas (docs/29 §8).
- [ ] Lo pendiente de Hublot: pueblos más cálidos, puntos muy brillantes, bisel, destello de lente con sol (docs/28 §8).
- [ ] **Candidatas para próximos estudios**: Bruno Simon (bruno-simon.com: WebGPU + TSL, físicas con Rapier, conducción con teclado; ronda 18) y Chartogne-Taillet (chartogne-taillet.com/en, propuesta del usuario 24-10-2026: three r122, mapa ilustrado de viñedos con 145 mallas, puntos y líneas, GSAP + ScrollTrigger, sonido; aviso de edad «Enter»: capturar con `--clic`).
- [ ] **Motores sin three**: flujo óptico para la cámara, WebGPU Inspector y Spector.js para las pasadas.
- [ ] **Extraer al kit** la pila TSL del banco (`lib/postfx`, componente `PostFX`) y añadir el campo `cine` a las guías.
- [ ] **Más pases en el banco**: GTAO, SSR, LUT, desenfoque de movimiento, niebla por altura, partículas.

## 5. Auditoría de calidad de las demos nuevas (19-10-2026)

Webs revisadas: `/sitios/estudio`, `/sitios/pulso` y `/sitios/barro` (todas sus páginas, a 1280 y a 390 px reales) con
`axe-core`, recorrido con teclado de los overlays y revisión visual a 390 px. Método (sin dependencias en el repo): abrir cada
página en un `<iframe>` del ancho deseado desde la misma origen, inyectar `axe.min.js` (copiado temporalmente a `public/`) y
leer `axe.run`; los desbordes se miden comparando `scrollWidth` con `clientWidth`.

- [x] **Sin infracciones de axe** en las tres webs, salvo las de `ScrubText` (abajo). Sin desbordes horizontales a 390 px.
- [x] **Corregido en la auditoría:** cabecera y `SectionIndex` con `mix-blend-mode` (axe no puede calcular el contraste y sobre
      imágenes medias se leía mal) → colores sólidos con fondo; acento de `editorialTokens` oscurecido (≥ 4,5:1);
      carrusel nativo de `HorizontalScroll` sin foco de teclado; encabezados saltados; `th` vacío en la tabla oculta de `Chart`;
      `EmptyState` con nivel de encabezado configurable.
- [x] **Teclado:** `CartDrawer` y `FullscreenMenu` abren con Intro, llevan el foco dentro, lo atrapan con Tab, cierran con Esc,
      devuelven el foco al botón y (el menú) bloquean y liberan el scroll. `CommandPalette` filtra, navega con flechas e Intro.
- [ ] **Conocido y deliberado:** las palabras «apagadas» de `ScrubText` bajan de contraste hasta que el scroll las enciende
      (axe lo marca). Se ve entero con `prefers-reduced-motion`, `prefers-contrast: more` y colores forzados, y el lector de
      pantalla lee el texto íntegro. Úsalo solo en frases de énfasis, no en información imprescindible.
- [ ] **Sin cubrir todavía:** Safari y Firefox, VoiceOver/NVDA, Lighthouse móvil, y las cinco webs anteriores (`kernel-log`,
      `pixelforge`, `vigia`, `onda`, `clara-vidal`) con este mismo método. Pasos 2 y 3 del pedido de Barro con datos reales.

### Revisión de las cinco webs anteriores y de las sombras de texto (19-10-2026)

`kernel-log`, `pixelforge`, `vigia`, `onda` y `clara-vidal` pasadas con el mismo método (1280 y 390 px). Corregido: botón de búsqueda
de `NavBar` (el nombre accesible no contenía el texto visible), avatar de `Testimonial` (contraste), `Stepper` que se desplazaba en
horizontal (ahora parte en líneas), carrito de Pixelforge y cinta de Onda fuera de un landmark, y carrusel móvil de Clara sin foco de
teclado. Resultado: 0 infracciones de axe en las cinco.

**Hallazgo importante:** `--legibility-ts` se definía en `:root` con `var(--bg, #000)` y se resolvía allí, así que en los temas
claros el texto oscuro llevaba un halo **negro** (visible en Clara Vidal, Barro y Marea). Ahora `tokensToStyle` lo fija en el
contenedor con el fondo del tema. Comprobación repetible en el navegador: recorrer los elementos con texto y verificar que
ninguno tenga un `text-shadow` oscuro cuando su texto es oscuro (resultado actual: 0 casos en las 11 webs). Un contraste de axe que
mide un fondo «más oscuro del real» suele delatar justo una sombra de texto oscura.

## 5b. Las webs de `/sitios` llegan sin su CSS en el HTML (anotado el 20-10-2026)

Cada web se carga con `next/dynamic` dentro de un componente cliente (`components/sites/SiteRouter.tsx`): el código va
separado por web, pero **su hoja de estilos** (`faro.css`, `vertice.css`…) no viene enlazada en el HTML del servidor; la
inyecta el JavaScript de la web al cargar. Comprobado en desarrollo y en el build de producción (`next start`).

Consecuencias: sin JavaScript la web sale sin estilos, el fondo decorativo (posicionado) tapa el contenido y no hay scroll
(`html.scrollable` lo pone un efecto de `SiteFrame`); con red lenta puede verse un instante sin estilo. Con JavaScript, en
producción, funciona bien. Se descubrió al abrir Faro desde un móvil por la red local contra `next dev`: ver la trampa de
`allowedDevOrigins` en la guía §10.

- [ ] **Decidir si se arregla.** Probado (y revertido): elegir la web en el servidor (`SiteShell`/`SitePage` como componentes
      de servidor con un `import()` por web) hace que Next enlace la hoja en el HTML, pero **junta el CSS de las 18 webs** en
      una sola (≈ 127 KB sin minificar) que se descarga en todas las páginas de `/sitios`. Alternativas: una ruta por web
      (`app/sitios/faro/…`) para que cada una tenga su propia hoja, o aceptar la hoja común si su peso comprimido es pequeño.
- [ ] **Scroll sin JavaScript:** que `html:has(.st-page)` dé el mismo scroll que `html.scrollable` en `app/globals.css`, como
      ya hace `html:has(.tr)` en `components/site/site.css`.
- [x] Prefijos de clase únicos por web: Faro usaba `.fr-`, igual que Foro, y al navegar de una a otra sin recargar sus
      estilos se pisaban. Faro pasa a `.fa-`; comprobado que no hay más prefijos repetidos entre webs (salvo los de estado `is-`).

## 6. Control de la biblioteca: modularidad antes que cantidad (anotado el 19-10-2026)

**El riesgo (palabras de Daniel):** al crear piezas para cada web nueva, la biblioteca se llena de componentes muy explícitos
(sirven para una estética concreta) o que montan algo muy complejo y muy concreto. Hay que mantenerla **modular**, con diseño
atómico, y **no acumular cientos de componentes** que podrían beber unos de otros.

**Regla para todo componente nuevo** (también en `docs/02-guia-de-componentes.md`, §12):

1. **Buscar primero.** Antes de crear nada, buscar en `components/ui/` y en el catálogo si algo ya hace algo parecido.
2. **Ampliar antes que duplicar.** Si lo existente casi lo cubre, se le añade una opción (`mode`, `variant`, una prop) en vez de
   crear un segundo componente. Ejemplo: no habrá un «cursor que arrastra una imagen» aparte; `CustomCursor` gana la opción de
   mostrar una imagen y el índice de proyectos con imagen al pasar el puntero se **compone** con él.
3. **Átomos → moléculas → secciones.** Un componente complejo está bien si está hecho de átomos del kit. Si una pieza solo
   tiene sentido en una web, **vive en esa web** (`components/sites/<web>/`), no en `components/ui/`.
4. **Una pregunta de control** al crear: «¿puede usarlo otra web con otra estética cambiando tokens o props?». Si no, no entra.

**Revisión de la ronda 3 — hecha el 19-10-2026.** De 7 componentes nuevos quedan 3; el catálogo baja de 141 a 137.

| Pieza nueva | Se solapaba con | Qué se hizo |
|---|---|---|
| `WorkViews` | `ProjectList` | **Borrado.** `ProjectList` gana `view` (`list` / `grid` / `index`, con GSAP Flip) y `preview`. El selector «① ② ③» es un `OptionPicker` (gana `short` y `hideLabel`): no hizo falta un `ViewSwitch` nuevo |
| Cursor con imagen (idea) | `CustomCursor`, `ProjectList` | `CustomCursor` gana `data-cursor-img`, `imageWidth`, `imageRatio` y `tilt`; `ProjectList preview="cursor"` lo usa. Ningún componente nuevo |
| `EntryGate` | `Modal` | **Borrado.** `Modal` gana `size="full"`, `children`, `actions`/`onAction`, `dismissible`, foco atrapado y pausa del scroll (mejora para todos los modales). Recordar la elección es cosa de la web (Sonar, 10 líneas) |
| `SoundToggle` | `Toggle` | **Borrado.** `Toggle` gana `checked`/`onChange` (modo controlado), `disabled` e `indicator`. El ecualizador vive en la demo Sonar |
| `ElasticText` | `SplitText` | **Borrado.** `SplitText` gana `elastic`, `stretch`, `radius` y `effect="none"`; la lógica está en `lib/ui/elastic.ts` |
| `ExplorableCanvas` | `DragGrid` | Se queda (mundo con límites y fichas), pero el arrastre con inercia es `lib/ui/dragPan.ts`, el mismo que usa `DragGrid`. «Mapa / Lista» es un `OptionPicker` |
| `CookieBanner` | `Button`, `Toggle` | Se queda (lo necesita cualquier web de cliente), pero ya es composición de `Button` y `Toggle`; se tiñe redefiniendo tokens sobre `.ui-cook` |
| `StickerCollage` | — | Se queda: mueve piezas sueltas, no la vista, así que no encaja en `dragPan`. Las pegatinas (`lib/sites/stickers.ts`) son de las demos |

**Ronda 4 (19-10-2026, three.js):** el 3D entró como **opciones** de un componente existente, no como componentes nuevos:
`ExplorableCanvas` gana `depth="3d"`, `nav="scroll"`, `path`, `blocks`, `dims`, `tilt`, `intro`, `paper` y `groundImage`
(ver [`09-ronda-4-threejs.md`](./09-ronda-4-threejs.md)). Además se fundió la carga diferida de WebGL que repetían
`ObjectStage`, `Logo3D`, `DeviceMockup3D` y `DistortImage` en `lib/ui/gl.tsx` (`GLBoundary`, `useGLGate`).
El estudio se amplió con Cartier, Sleep Well Creatives y Atlas Motion, y de ahí sale el **plan de remodelación de Plano**
([`10-plan-plano.md`](./10-plan-plano.md)): relato por capítulos sobre un solo lienzo, maqueta por capas en despiece,
barrido de revisión y ficha por incidencia. **Aplicado** el mismo día; quedan axe y el build.

**Auditoría periódica:** cada vez que se cierre una ronda de webs, revisar `components/ui/` buscando pares que se puedan
fundir, y anotar aquí lo que se funda. La biblioteca debería crecer en **opciones**, no en **nombres**.
