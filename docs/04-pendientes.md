# Pendientes

Lista de trabajo para seguir iterando la librería y su web. Marca `[x]` al terminar cada punto y borra la sección
cuando quede vacía. Orden dentro de cada bloque: de más a menos importante.

Antes de dar un punto por hecho: `npm run typecheck`, `npm run catalog:check` y, si tocaste rutas o CSS,
`npm run build` (con el `next dev` parado).

## 0. Publicación del paquete

- [ ] **Publicar `trama-ui@0.6.1` en npm** (incluye lo de 0.3.0, 0.4.0, 0.5.0 y 0.6.0, que nunca se publicaron:
      transiciones de página a pantalla completa con `scan` y `stack`, transiciones de elementos, envío real de
      `ContactForm`, ayudas accesibles y la cabecera sin parpadeo). Está
      construido y empaquetado (rama `feat/view-transitions`, que sale de `fix/mejoras-desde-web`), pero no publicado:
      en el registro sigue la 0.2.0. Pasos (ver «Publicar en npm» en `README.md`):
  1. Fusionar la rama en `main` y comprobar que `package.json` dice `"version": "0.6.1"` y que `CHANGELOG.md` tiene su
     entrada (y las de 0.6.0, 0.5.0, 0.4.0 y 0.3.0).
  2. `npm login` (cuenta dueña de `trama-ui`; `npm whoami` para confirmarlo).
  3. `npm run pkg:build` (vacía y regenera `dist-npm/`).
  4. `cd dist-npm && npm publish --dry-run` para revisar la lista de archivos, y después `npm publish`.
  5. Comprobar con `npm view trama-ui version` (debe decir `0.6.1`).
  6. **Web martinezsebastian.com:** de momento usa el paquete desde un `.tgz` incluido en su propio repo, en `vendor/`
     (`dist-npm/trama-ui-0.6.1.tgz` copiado allí). Cuando esté publicada, volver a la versión del registro
     (`npm i trama-ui@^0.6.1` en ese proyecto), borrar el `.tgz` de su `vendor/` y comprobar que el `package-lock.json`
     apunta a `registry.npmjs.org`.

- [ ] **Comprobar a ojo las 11 animaciones de `PageTransition` a pantalla completa** en Chrome y Safari (pestaña
      visible): que las bandas, la línea de `scan`, las barras de `stack`, el aro del iris y el cursor de `terminal`
      cubren la ventana y que la cabecera queda quieta. `scan` y `stack` (0.6.0) solo se han revisado leyendo el CSS. Verificado por código y con instrumentación JS (estado de `<html>` y nombres capturados en cada
      navegación), no visualmente.

## 0a. La cabecera parpadea: Next divide algunas navegaciones en dos commits (arreglado en 0.6.1, falta confirmar a ojo)

Reportado desde martinezsebastian.com: la cabecera (en `PageTransitionPersist`) "parpadea" o "se recarga" al navegar,
incluso con la cabecera excluida correctamente por nombre. Investigado por código e instrumentación JS en el navegador
(sin comprobación visual, a petición expresa). **Corregido con la opción 1** de abajo, en 0.6.1; solo falta que
alguien lo confirme a ojo en un navegador normal.

- **Causa raíz encontrada.** Una navegación con `<Link>` del App Router puede llegar a React como **dos commits
  independientes**, cada uno disparando su propio `document.startViewTransition`: uno que desmonta la página de origen
  (nada nuevo aparece todavía) y otro, después, que monta la de destino. Confirmado interceptando
  `document.startViewTransition` y contando llamadas: **2 por clic**, siempre, incluso esperando varios segundos (link
  ya precargado) antes de pulsar. Coincide con lo que documenta la propia guía de Next
  (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`): "the destination suspends into a fallback
  first, no pair forms".
- **Por qué eso rompe el estilo.** `PageTransitionRoot` (`lib/ui/pageTransitionRoot.tsx`) solo arma `<html>`
  (`view-transition-name: root` + clases) en el efecto de montaje de la página de DESTINO. El commit de SALIDA (la
  página de origen desmontándose, sin que nada nuevo se monte en el mismo commit) no tiene ningún `PageTransitionRoot`
  nuevo que lo arme. Sin nadie que lo arme, React cancela nuestra raíz personalizada (dessarma `<html>`, ver el
  comentario de cabecera del propio archivo) y ese commit cae al **cross-fade por defecto del navegador, sin nuestro
  CSS**, sobre un contenido que en ese instante está vacío (la página vieja ya no está, la nueva aún no ha llegado).
  Ese destello sin estilo, pegado a una cabecera que sí se queda quieta, es lo que se percibe como que "la cabecera
  parpadea o se recarga".
- **Descartado como causa:** la exclusión de la cabecera en sí. `PageTransitionPersist` le pone
  `view-transition-name`/`-class` como prop de JSX en cada render, sin depender de ningún efecto ni de timing; y el
  bloque `@media (prefers-reduced-motion: reduce)` de `ui-view-transitions.css` selecciona el token `.ui-vt`, que
  `.ui-vt-persist` no lleva, así que tampoco le afecta. La cabecera en sí está bien excluida en ambos commits; el
  problema es el *contenido* del commit de salida, no la cabecera.
- **Sin confirmar:** en algunas pruebas también salió `InvalidStateError: ... aborted ... Document hidden` en las dos
  transiciones; React trata ese error como esperado (lo traga y aplica el cambio sin animar). Puede ser un artefacto
  del entorno de automatización de este agente (la pestaña pierde el foco durante la prueba) más que algo que le pase
  a un usuario real con la pestaña activa; no descartarlo del todo, pero es secundario frente al punto de arriba, que
  se reprodujo de forma consistente y no depende de ningún acto de automatización.

**Plan de arreglo** (de la opción recomendada a las alternativas; una sola implementación, no las cuatro):

1. **[x] (Recomendada, implementada en 0.6.1) Armar también al desmontar.** `pageTransitionRoot.tsx` ahora tiene una
   función `arm()` compartida que se llama tanto al montar como en la limpieza del mismo `useLayoutEffect` al
   desmontar: si en ese momento hay una transición activa sin armar todavía (el commit de salida aislado), la arma
   con la misma `kind`/`direction`/`pace`/`tone` que tenía la página. Si ya había una armada (la del propio montaje,
   o una de una instancia anterior sin terminar), no se pisa. Sin cambios en la API pública.
2. **Alternativa más simple (no usada):** si no se puede saber con fiabilidad qué animación traerá la página de destino en ese
   momento, usar siempre un `fade` corto (120–160 ms) como tratamiento neutro para ese commit aislado. Menos coherente
   visualmente que la opción 1, pero más simple y con menos superficie de fallo.
3. **Alternativa arquitectónica (mayor cambio; valorar solo si 1 no basta):** disparar la transición desde un único
   componente cliente en el layout raíz (que nunca se desmonta) reaccionando a `usePathname()`, en vez de desde cada
   `page.tsx`/`template.tsx`. Investigar primero si es viable engancharse a la actualización de Next sin duplicar
   trabajo; no emprenderlo sin haber probado antes la opción 1.
4. **Endurecimiento independiente (hacerlo de todos modos, sea cual sea la causa):** hoy `PageTransitionPersist` solo
   excluye vía `style` en línea puesto por React. En la práctica es estable porque se aplica en cada render y el
   layout donde vive no se desmonta, pero no cuesta nada documentar/ofrecer también la exclusión como clase CSS
   reutilizable para quien envuelva algo que no sea "un solo elemento HTML". Prioridad baja: es un extra de
   robustez, no la causa del bug.

**Verificación:**

- [x] `npm run typecheck`, `npm run catalog:check`, `npm run build` — pasan con el cambio.
- [ ] Repetir la instrumentación con el nuevo código: interceptar `document.startViewTransition`, contar llamadas por
      navegación y comprobar que `<html>` lleva `data-ui-vt` y `view-transition-class` en **las dos**, no solo en la
      segunda.
- [ ] **Confirmación visual final:** la tiene que hacer una persona con los ojos, en un navegador normal (no en la
      herramienta de automatización de un agente) — todavía no se ha visto el efecto, solo inferido y verificado por
      código.

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
