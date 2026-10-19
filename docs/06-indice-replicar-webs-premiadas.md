# Índice: qué le falta a Trama para replicar webs premiadas

> Objetivo: poder montar **demos funcionales de nivel Awwwards** (solo la capa de UI) para enseñar a clientes y usarlas
> como referencia en proyectos futuros. Este documento es un **índice de trabajo**, no una especificación: cada fila es
> una pieza que hay que construir, con su estado frente al kit actual (0.12.0).
> Fecha: 19-10-2026. Estado del kit contrastado con `docs/CATALOG.md`.

Leyenda de estado: ✔ existe · ◐ existe pero incompleto · ✘ falta.

## Estado de avance (19-10-2026)

**Fase 1 en marcha** (rama `feat/motion-editorial`, sin commitear): `SmoothScroll`, `SplitText`, `RollLink`, `FitText`,
`Preloader`, `CustomCursor`, `ProjectList`, `FullscreenMenu` y `LocalTime`, más `lib/motion/` y `ui-motion.css`. Todas
con ficha en `/componentes`. La demo 1 (**Marea Studio**, `/sitios/estudio`) las usa juntas. Verificado: `typecheck`,
`catalog:check`, `build` y `pkg:build` en verde; revisada a mano en Chrome (escritorio): preloader, titular por líneas,
lista con vista previa y cursor, menú a pantalla completa, navegación y pie. **Sin verificar:** móvil a 390 px, Safari y
Firefox, teclado y lector de pantalla, rendimiento (Lighthouse).

**Fase 2 (parcial, 19-10-2026):** variante `editorial` (novena del sistema `--s-*`), `HideOnScroll`, `PinnedSection`,
`HorizontalScroll`, `StackedCards`, `Parallax`, `SectionIndex`, `ScrubText`, `ImageReveal`, `BentoGrid` y `BigFooter`,
todas con ficha en `/componentes` y usadas en `/sitios/estudio`. Dos fallos encontrados al probar en Chrome y
corregidos: `Parallax` se realimentaba con velocidad negativa (medía su propio rectángulo ya desplazado) e
`ImageReveal` no se abría porque Chrome cuenta el `clip-path` del elemento observado por `IntersectionObserver`
(el recorte va ahora en un hijo). **Pendiente de la fase:** `NavBar` con `hideOnScroll` integrado, cabecera que cambia
de tema por sección (E3), `MediaCover` (G2), `MasonryGrid`, 404 y contacto editoriales (H5, H6), escala tipográfica
fluida y fuentes (C8, decisión §7.2).

**Fase 3 (parcial, 19-10-2026), reutilizando `three` + `@react-three/fiber` sin dependencias nuevas:** `DistortImage`,
`DragGrid` y `ObjectStage`, con ficha en `/componentes` y uso en la página `/sitios/estudio/laboratorio`. `DistortImage` y
`ObjectStage` van por subruta (peer opcional), como `RetroCanvas`. **Pendiente de la fase:** `ShaderSlider` (G4),
`WebGLStage` con planos sincronizados con el DOM (G5), `ExplorableCanvas` (G8), `Toggle indicator` (F6) y `BackgroundVideo` (G10).
Aprendido: Chrome cuenta el `clip-path` del propio elemento en `IntersectionObserver`; con `setPointerCapture` el clic se
reenvía al elemento que captura (por eso `DragGrid` captura solo al empezar a arrastrar); y sobre un lienzo transparente
`transmission` da negro (el vidrio es translúcido con reflejos).

**Fase 4 (parcial, 19-10-2026): UI de producto.** `AppShell`, `CommandPalette`, `DataTable`, `Chart`, `KpiCard`, `Avatar`,
`Kbd` y `EmptyState`, con ficha en `/componentes` y usadas en la demo **Pulso** (`/sitios/pulso`: resumen con KPIs y
gráficos, clientes con tabla interactiva, informes, ajustes). Verificado en Chrome: paleta (filtra, navega con Intro y
devuelve el foco), orden y selección de la tabla, gráficos y marco. Lección: la variante `outline` impone mayúsculas y un
brillo interior que no sirven en un panel, así que estas piezas parten de `editorial`. **Pendiente de la fase:** `Kanban`
(I6), `Onboarding` (I8), `FeatureShowcase` (I9), `Combobox`/`DatePicker`/`Popover`, y todo el bloque de comercio (J1–J6).

**Fase 4, comercio (19-10-2026):** `ProductCard`, `ProductGallery`, `OptionPicker`, `QuantityStepper`, `PriceTag`, `FilterBar`
y `CartDrawer`, más `useCart` y `money()` (`lib/commerce`, exportados por el paquete) y la demo **Barro**
(`/sitios/barro`: inicio, tienda con filtros, 8 fichas, carrito lateral con envío gratis y pedido por pasos). El pedido es de
prueba: no pide datos de pago ni envía nada. Verificado en Chrome: ficha con selector de esmalte y tamaño, carrito (tema,
barra de envío, subtotal), paso a pedido con resumen, y filtro por tipo con contador. Lección: dos clases nuevas
(`ui-price`, `ui-chart`) chocaban con las del kit; ver la trampa nueva en la guía §10.

**Segunda ronda (19-10-2026):** investigación de cinco webs más y nuevas fórmulas en [`07-formulas-webs-top.md`](./07-formulas-webs-top.md):
`BlueprintFrame`, `CellGrid`, `IslandNav`, `CrossfadeHero`, `ExpandingPanels`, `ScatterText`, `EdgeTab`, `MetaTable`, `CircleButton`, la
variante `fill` del `Preloader`, los temas `blueprintTokens` y `forestTokens` y las demos **Plano**, **Foro** y **Arbor**.

## 0. Resumen ejecutivo

1. **El kit ya cubre ~60 % de las piezas sueltas** (reveal, marquee, cursor, magnético, transiciones de página, 3D,
   carrusel, secciones de landing). Lo que falta no son componentes aislados, sino **la capa que los une**.
2. **Brechas grandes, por orden de impacto:**
   1. **Scroll suave + scroll narrativo** (Lenis + GSAP sincronizados, secciones fijadas, scroll horizontal, tarjetas apiladas).
   2. **Tipografía cinética** (texto troceado por líneas/palabras/letras, máscaras, fuentes variables).
   3. **Preloader y entrada de página** coordinados con el contenido.
   4. **Menú a pantalla completa** y cabeceras que se esconden/reaparecen.
   5. **Cursor contextual** (etiqueta, vista previa de imagen que sigue al puntero, estados por elemento).
   6. **Imágenes con efecto WebGL** (distorsión al hover, transiciones con shader) y rejillas arrastrables.
   7. **Una estética moderna/editorial**: hoy las 8 variantes son retro/pixel/ASCII; las webs premiadas de 2026 son
      tipografía enorme, blanco y negro, mucho espacio vacío y fotografía. Falta una variante `editorial` y un set de fuentes.
   8. **UI de aplicación** (sidebar, paleta de comandos, tablas ordenables, gráficos reales) para las demos tipo SaaS.
3. **Camino corto:** 4 fases (§6). La Fase 1 (motor de movimiento + tipografía + preloader) desbloquea el 70 % de las réplicas.

## 1. Qué se investigó y con qué fiabilidad

| Fuente | Qué aportó | Fiabilidad |
|---|---|---|
| [Awwwards · Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/) (leída 19-10-2026) | Lista real de las 10 últimas webs premiadas | Alta |
| [Awwwards · Colecciones](https://www.awwwards.com/awwwards/collections/) | Taxonomía de patrones que la propia Awwwards cataloga (preloaders, cursores, menús, transiciones, scroll horizontal, tipografía, galerías, WebGL, footers, 404…) | Alta |
| [Signal-A Studio](https://signal-a.studio) y [Overworld Audio](https://overworldaudio.com/) | Lectura del HTML de dos SOTD recientes | Media: es el texto, no la animación; lo marcado «inferido» no está confirmado |
| [Hon Tran · portfolio premiado](https://www.hontran.dev/blog/how-to-build-an-award-winning-portfolio-site) y [Codrops · GSAP en un portfolio](https://tympanus.net/codrops/2026/05/06/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio/) | Stack habitual: Next.js + **Lenis** + **GSAP/ScrollTrigger** + Three.js u OGL | Media: casos individuales (uno es jurado de Awwwards) |
| [Digital Strategy Force](https://digitalstrategyforce.com/journal/why-are-immersive-experiences-dominating-the-2026-awwwards/) | Cifra de «61 % de SOTD con 3D inmersivo» | **Baja, no verificada**: no la uses de cara al cliente |

**Límite de esta investigación:** no se abrió cada web en un navegador; los patrones salen de la taxonomía de Awwwards,
dos lecturas de HTML y casos de estudio publicados. Antes de replicar una web concreta conviene verla en el navegador
(hay herramientas de Chrome disponibles) y anotar tiempos, easings y breakpoints.

### Sites of the Day recientes (candidatos a réplica)

| Fecha | Sitio | Tipo | Patrón que enseña |
|---|---|---|---|
| 18-10 | [Signal-A Studio](https://signal-a.studio) | Estudio / agencia | Titular con palabras sueltas animadas, corchetes `[menu]`, rejilla numerada «A — 1», marquee de pie, reloj y ciudad, cursor con vista previa (inferido) |
| 15-10 | [Overworld Audio](https://overworldaudio.com/) | Estudio de audio | Navegación explorable por arrastre, control de sonido ON/OFF, instrucciones distintas según dispositivo |
| 17-10 | [Belgrade Arbor](https://belgradearbor.rs/en) | Inmobiliario | Por revisar |
| 16-10 | [OFFFForum](https://www.offforum.com/) | Evento | Por revisar |
| 14-10 | [Huy Phan Vol.2](https://huyml.co/) | Portfolio personal | Por revisar |
| 12-10 | [Heron AI](https://heronaiapp.com/) | Producto IA / app | Por revisar (candidata a demo SaaS) |
| 10-10 | [LPAS](https://lpas.com/) | Corporativo | Por revisar |

## 2. Patrones de UX que se repiten

Agrupados como los cataloga Awwwards. Cada patrón apunta a las piezas del §3. En qué sectores cabe cada uno y con qué condición: [`11` §10](./11-estudio-sectores-2026.md#10-cruce-con-la-investigación-de-ux-rondas-0610) (allí se citan como `06·P1`…, porque `P1`–`P5` son también los ids de despachos).

| # | Patrón | Qué hace al usuario sentir | Piezas (§3) |
|---|---|---|---|
| P1 | Scroll suave con inercia | Peso y fluidez | A1, A2 |
| P2 | Scroll narrativo (secciones fijadas, escenas) | «Me cuentan algo» | D1–D5 |
| P3 | Tipografía como protagonista, animada | Carácter de marca | C1–C6 |
| P4 | Preloader + entrada coreografiada | Expectativa, oculta carga | B1, B2 |
| P5 | Menú a pantalla completa con revelado | Navegación como momento | E1–E3 |
| P6 | Cursor propio con estados | Respuesta a cada gesto | F1–F4 |
| P7 | Imágenes que reaccionan (clip-path, distorsión WebGL) | Materialidad | G1–G5 |
| P8 | Rejillas y galerías no convencionales (arrastrables, infinitas, bento) | Descubrimiento | G6–G9 |
| P9 | Transiciones entre páginas con elemento compartido | Continuidad | B3–B5 |
| P10 | Microinteracciones (botones, enlaces, toggles) | Calidad percibida | F5–F8 |
| P11 | Pie de página memorable, 404 y contacto con personalidad | Cierre de marca | H4–H6 |
| P12 | Detalles «de estudio»: reloj local, toggle de sonido, corchetes, numeración | Tono editorial | C7, K4 |
| P13 | Producto digital: UI de app, dashboards, comando ⌘K | Credibilidad SaaS | I1–I9 |
| P14 | Comercio: ficha, carrito, filtros | Conversión | J1–J6 |

## 3. Índice de piezas

### A. Motor de movimiento (infraestructura, va primero)

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| A1 | `SmoothScroll` (Lenis) con proveedor y hook `useLenis` | Stack de casi todos los SOTD | ✔ | `SmoothScroll` (Lenis), apagado en táctil y con reduced-motion
| A2 | Sincronía Lenis ↔ GSAP ticker ↔ ScrollTrigger | Hon Tran, Codrops | ✔ | Hecho dentro de `SmoothScroll` (`syncGsap`); `lib/motion/lenis.ts` expone `getLenis` y `lockScroll`
| A3 | Registro de plugins GSAP (SplitText, Flip, Draggable, Observer, ScrollTrigger) | — | ◐ | `lib/scroll/` ya usa ScrollTrigger; centralizar en `lib/motion/gsap.ts` (GSAP 3.15: plugins gratuitos) |
| A4 | Tokens de movimiento: duraciones, easings, distancias | Todas | ◐ | Tokens `--ease-out`, `--ease-io`, `--dur-*` en `ui-motion.css`; falta leerlos desde JS
| A5 | Hook `useInView` / `useScrollProgress` sin GSAP para piezas ligeras | — | ◐ | `Reveal` existe; extraer el observador |
| A6 | Detección de capacidades (puntero fino, hover, GPU, ahorro de datos) | Overworld (instrucciones por dispositivo) | ◐ | `lib/ui/capability.ts` existe; ampliar con `pointer: fine`, `hover`, memoria del dispositivo |
| A7 | Modo `reduced-motion` unificado | A11y | ◐ | `useReducedMotion` existe; que **todas** las piezas nuevas lo respeten por contrato |

### B. Entrada, carga y transiciones de página

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| B1 | `Preloader` (contador %, logo que se dibuja, cortina) con variantes | Colección «Loading Animations» | ✔ | `Preloader` (contador, palabras o barra; salida cortina o fade; una vez por sesión)
| B2 | Entrada coreografiada del hero (`useIntro` / línea de tiempo) | Signal-A (palabras sueltas) | ◐ | `SplitText trigger="mount"` ya espera al preloader (`lib/motion/intro.ts`); falta hacerlo con `Reveal`
| B3 | Transición de página a pantalla completa | Colección «Transitions» | ✔ | `PageTransition` (11 animaciones) |
| B4 | Transición con **elemento compartido** (miniatura → cabecera de proyecto) | Portfolios | ◐ | `ElementTransition` y `viewTransitions.ts` existen; falta la receta lista-a-detalle |
| B5 | Cortina por columnas/barras con título de la página destino | Estudios | ◐ | Parte cubierta por `scan`/`stack`; añadir variante con nombre de la ruta |

### C. Tipografía cinética y editorial

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| C1 | `SplitText` propio: líneas / palabras / letras, con máscara de recorte | Signal-A, la mayoría | ✔ | `SplitText`: líneas, palabras o letras, con máscara; sin GSAP SplitText
| C2 | `TextReveal` al hacer scroll (por línea, por palabra con opacidad progresiva) | Párrafos que se «encienden» | ✔ | `ScrubText`: palabras que se encienden con el scroll
| C3 | `ScrambleText` | — | ✔ | Ya existe |
| C4 | `Marquee` con **velocidad ligada al scroll** y cambio de sentido | Footer de Signal-A | ◐ | `Marquee` existe; añadir `velocityByScroll` |
| C5 | Titular gigante que llena el ancho (`fit text`) | Pies y héroes | ✔ | `FitText`
| C6 | Rodillo de texto en enlaces (la palabra sube y entra otra igual) | Menús y botones | ✔ | `RollLink`
| C7 | Elementos de tono editorial: `[corchetes]`, numeración «A — 1», reloj y ciudad, signos `×` | Signal-A | ◐ | `LocalTime` hecho; faltan numeración y corchetes como componentes (hoy van en CSS de la demo)
| C8 | Escala tipográfica fluida + fuentes variables | Tendencia 2026 | ✘ | Tokens `--fs-display`, `--fs-h1`… con `clamp()`; **decidir fuentes (§7)** |
| C9 | Fuente variable que reacciona al puntero/scroll (peso, anchura) | Experimentales | ✘ | Opcional, tras C8 |

### D. Scroll narrativo

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| D1 | `PinnedSection` (sección fijada con escenas por progreso) | Productos, scrollytelling | ✔ | `PinnedSection` (sticky + variable `--pin-p`, sin GSAP)
| D2 | `HorizontalScroll` (scroll vertical → desplazamiento horizontal) | Colección «Horizontal Scrolling» | ✔ | `HorizontalScroll` (carrusel nativo en pantallas estrechas y con reduced-motion)
| D3 | `StackedCards` (tarjetas que se apilan al subir) | Portfolios, procesos | ✔ | `StackedCards` (CSS sticky; encoge las cubiertas con `animation-timeline` donde existe)
| D4 | `Parallax` (capas y imágenes con desplazamiento relativo) | Casi todas | ✔ | `Parallax`
| D5 | `ScrollProgress` y marcador de sección (índice lateral «01 / 05») | Editorial | ✔ | `SectionIndex` («02 / 06 · Nombre»); `ScrollProgress` ya existía
| D6 | `CounterOnScroll` | — | ✔ | `StatCounter` |
| D7 | Scroll-snap por secciones (opcional) | Presentaciones | ✘ | CSS `scroll-snap` y desactivar con Lenis activo |

### E. Navegación

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| E1 | `FullscreenMenu` (botón `[menu]` ⇄ `[close]`, enlaces con revelado, pie con redes) | Signal-A, colección «Menu Inspiration» | ✔ | `FullscreenMenu`
| E2 | `NavBar` que se esconde al bajar y vuelve al subir | Estándar | ✔ | `HideOnScroll`
| E3 | Cabecera con modo «sobre imagen» que cambia de color según la sección | Estudios | ✘ | `data-theme` por sección + observador |
| E4 | Navegación explorable por arrastre con marcadores | Overworld Audio | ✘ | Ver G8 |
| E5 | Paleta de comandos ⌘K | SaaS | ✔ | `CommandPalette` (ver I3)
| E6 | Índice lateral / «saltar a sección» | Documentación y editorial | ✔ | `TableOfContents` |

### F. Cursor e interacción

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| F1 | `CustomCursor` con círculo que sigue con inercia y estados (`link`, `drag`, `view`, `text`) | Colección «Hovers, Cursors…» | ✔ | `CustomCursor` (modos link, etiqueta, texto, oculto)
| F2 | **Vista previa que sigue al puntero** sobre listas de proyectos | Portfolios (Signal-A, inferido) | ✔ | Dentro de `ProjectList`
| F3 | Botón magnético | — | ✔ | `MagneticButton` |
| F4 | Foco que sigue al puntero | — | ✔ | `Spotlight` |
| F5 | Botón con relleno que entra desde el lado del cursor | Estándar | ◐ | Añadir como efecto de `HoverFX` |
| F6 | Toggle de sonido ON/OFF con ecualizador animado | Overworld Audio | ✔ | `Toggle` con `indicator` (ecualizador en la demo Sonar) + `lib/ui/audio.ts`; **sonido siempre desactivado por defecto** |
| F7 | Efectos de hover | — | ✔ | `HoverFX` (9 efectos) |
| F8 | Detección táctil: sin cursor propio, sin hover «pegajoso» | Responsive | ◐ | Apoyarse en A6 |

### G. Imagen, vídeo y WebGL

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| G1 | `ImageReveal` (clip-path / cortina al entrar) | Todas | ✔ | `ImageReveal` (máscara + asentado de la imagen)
| G2 | `MediaCover` con carga diferida, `blur-up` y relación de aspecto fija | Rendimiento | ✘ | Integrar con `next/image`; evita saltos de layout |
| G3 | Imagen con **distorsión al hover** (shader de ondas/desplazamiento) | Codrops, portfolios | ✔ | `DistortImage` (shader propio sobre r3f; ondas, líquido, RGB, lupa; el lienzo solo vive mientras dura el efecto)
| G4 | Transición entre imágenes con shader (disolución, ruido) | Sliders premiados | ✘ | `ShaderSlider`, como alternativa al `Carousel` (G9) |
| G5 | Planos WebGL sincronizados con el DOM (imágenes como texturas que siguen el scroll) | Patrón clásico | ✘ | Capa `WebGLStage` fija + `<img>` reales debajo; coste alto, hacer al final |
| G6 | Galería con **rejilla infinita arrastrable** | Colección «Galleries» | ✔ | `DragGrid` (rejilla infinita con inercia, táctil y teclado; sin WebGL ni miles de nodos)
| G7 | Rejilla bento y masonry | SaaS y portfolios | ◐ | `BentoGrid` hecho; falta `MasonryGrid`
| G8 | Lienzo explorable por arrastre con puntos clicables | Overworld Audio | ✘ | `ExplorableCanvas` |
| G9 | Carrusel | — | ✔ | `Carousel` (Swiper) |
| G10 | Vídeo con reproductor propio y vídeo de fondo | — | ✔ | `VideoPlayer`; añadir `BackgroundVideo` (autoplay mudo, `playsInline`, póster) |
| G11 | Escena 3D / mockups / logo 3D | — | ✔ | `ObjectStage`: objeto 3D con materiales físicos y reflejos de estudio, sin HDR (la escena no retro)

### H. Secciones y páginas completas

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| H1 | Hero, FeatureGrid, Pricing, FAQ, Stats, Testimonios, CTA, Equipo, LogoCloud | — | ✔ | Existen; falta que luzcan en la variante `editorial` (§7) |
| H2 | `ProjectList` (filas con título enorme, año, categoría + `HoverPreview`) | Portfolios | ✔ | `ProjectList`
| H3 | `CaseStudyCard` numerada con etiquetas «reconocimientos» y «alcance» | Signal-A | ✘ | Variante de `BlogCard` |
| H4 | `BigFooter` (titular gigante, marquee, reloj, redes, «volver arriba») | Colección «Footer Design» | ✔ | `BigFooter`
| H5 | Página 404 con personalidad | Colección «404» | ✘ | `NotFound` con interacción mínima |
| H6 | Página de contacto: formulario con campos de línea, correo grande copiable | Colección «Contact Pages» | ◐ | `ContactForm` existe; añadir variante `editorial` y «copiar correo» |
| H7 | Equipo / «sobre nosotros» con retratos que reaccionan | Colección «Team & About» | ◐ | `TeamSection` |
| H8 | Premios y reconocimientos (logos + contador) | Signal-A | ✘ | `AwardsStrip` |
| H9 | Cookies y avisos legales | Obligatorio en la UE | ✘ | `CookieBanner` con rechazo igual de visible que aceptar |
| H10 | Selector de idioma / tema claro-oscuro | Estándar | ◐ | Hay tokens; falta el `ThemeToggle` con transición |

### I. UI de producto / aplicación (demos tipo SaaS)

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| I1 | `AppShell` (sidebar plegable + cabecera + contenido) | Linear, Vercel, Notion | ✔ | `AppShell` (barra lateral plegable; en móvil, panel con botón)
| I2 | `DataTable` con orden, filtro, selección, paginación | Dashboards | ✔ | `DataTable` (orden con `aria-sort`, búsqueda, selección, paginación)
| I3 | `CommandPalette` (⌘K) con búsqueda difusa y atajos | SaaS | ✔ | `CommandPalette` (combobox + listbox ARIA, búsqueda sin acentos, Ctrl/⌘ K)
| I4 | Gráficos reales (líneas, barras, áreas, dona) | Dashboards | ✔ | `Chart` (líneas, áreas, barras en SVG; tabla oculta para lectores) y `KpiCard` con sparkline
| I5 | `Combobox`, `DatePicker`, `Avatar`, `Tag`, `Kbd`, `Menu contextual`, `Popover` | Cualquier app | ◐ | `Avatar` y `Kbd` hechos; faltan `Combobox`, `DatePicker`, menú contextual y `Popover`
| I6 | `Kanban` con arrastrar y soltar | Gestores de proyectos | ✘ | Con teclado accesible (mover con flechas) |
| I7 | `EmptyState`, `ErrorState`, `Skeleton` por pantalla | Pulido | ◐ | `EmptyState` hecho; falta `ErrorState` por pantalla
| I8 | `Onboarding` / tour guiado con resaltado | SaaS | ✘ | Opcional |
| I9 | Páginas de producto: hero con captura animada, bloques alternos, comparativa, integraciones | Heron AI y similares | ◐ | `DeviceMockup`, `FeatureGrid`; falta `FeatureShowcase` (pestañas con vista previa) |

### J. Comercio

| ID | Pieza | Referencia | Estado | Qué hacer |
|---|---|---|---|---|
| J1 | Ficha de producto con galería, variantes, cantidad | Tiendas | ✔ | `ProductGallery` (zoom + miniaturas), `OptionPicker`, `QuantityStepper`, `PriceTag`; ficha completa en `/sitios/barro/producto/…`
| J2 | Carrito lateral (`CartDrawer`) | Tiendas | ✔ | `CartDrawer` + `useCart` (estado con persistencia, exportado por el paquete)
| J3 | Filtros y orden con chips y contador de resultados | Colección «Search Filters» | ✔ | `FilterBar` (chips con contador, orden, resultados con `aria-live`)
| J4 | Selector de color/talla con vista previa 3D o imagen | Tiendas premiadas | ◐ | `OptionPicker` (color/talla) hecho; la vista 3D del producto puede apoyarse en `ObjectStage`
| J5 | Proceso de compra por pasos | Tiendas | ◐ | Pedido por pasos con `Stepper` en la demo Barro; falta un componente `Checkout` reutilizable
| J6 | Estados de stock, precios tachados, etiquetas | Tiendas | ◐ | `PriceTag` (rebaja) y `ProductCard` (`soldOut`, etiqueta); faltan avisos de stock bajo

### K. Transversales (no son componentes, son reglas)

| ID | Tema | Regla |
|---|---|---|
| K1 | Accesibilidad | Foco visible, `Esc`, orden de tabulación, texto troceado con `aria-label`, `aria-live` en el preloader, cursor propio **nunca** sustituye al nativo en elementos de texto/formulario |
| K2 | `prefers-reduced-motion` | Cada pieza define su versión estática; el scroll suave y los efectos WebGL se apagan |
| K3 | Rendimiento | Objetivo: LCP < 2,5 s en móvil de gama media; WebGL y GSAP con `next/dynamic`; sin cargar three en páginas sin escena; pausar `rAF` en pestañas ocultas |
| K4 | Detalles de marca | Reloj local, numeración, corchetes: opt-in, con datos por props |
| K5 | SSR / hidratación | Nada de `window` en el render; texto troceado solo en cliente tras montar |
| K6 | Móvil primero | Cada pieza se revisa a 390 px; hover y cursor no existen en táctil |
| K7 | Peso del paquete | Subrutas (`trama-ui/X`) para que lo pesado sea opt-in |
| K8 | Pruebas | Capturas con Playwright por pieza y variante (ya figura en `04-pendientes.md` §4); sin ello, estas piezas se romperán sin avisar |

## 4. Demos de réplica a construir

Cada demo se monta en `components/sites/<slug>/` (como las cinco webs completas existentes) y se registra en
`/sitios/<slug>`. Orden = prioridad comercial y reutilización.

| # | Demo | Inspirada en | Para qué cliente | Piezas clave | Dificultad |
|---|---|---|---|---|---|
| 1 | **Estudio / agencia** | Signal-A | Estudios, consultoras, creativos | A1–A3, B1, B2, C1, C4, C7, E1, F2, H2, H3, H4 | Media |
| 2 | **Portfolio personal** | Huy Phan, Mia Renard | Freelances | Lo de 1 + B4, G1, D3 | Media |
| 3 | **SaaS / producto IA** | Heron AI, Linear | Startups | I1–I3, I9, G7, D1, C2 | Media-alta |
| 4 | **Landing de evento** | OFFFForum | Eventos, ferias | D2, C5, G6, H8 | Media |
| 5 | **Corporativo sobrio** | LPAS | Pymes, industria | E2, E3, D4, H7 | Baja |
| 6 | **Inmobiliario / arquitectura** | Belgrade Arbor | Inmobiliarias | G1, G2, D2, G10 | Media |
| 7 | **Tienda con producto en 3D** | Tiendas premiadas | E-commerce | J1–J6, G3, G11 | Alta |
| 8 | **Experiencia explorable** | Overworld Audio | Música, juegos, museos | G8, F6, A6, E4 | Alta |
| 9 | **Dashboard** | Vercel, Notion | Software a medida | I1–I7 | Media-alta |
| 10 | **Restaurante / local** | Colección «Galleries» | Hostelería | G1, G10, H6, H9 | Baja |

Por demo, el entregable mínimo es: versión escritorio y móvil, `reduced-motion`, tema claro/oscuro y una receta en
`CATALOG.md` («Webs completas de referencia») para que yo pueda reutilizarla.

## 5. Dependencias previstas

| Necesidad | Opción | Nota |
|---|---|---|
| Scroll suave | `lenis` | Pequeña; sincronizar con el ticker de GSAP |
| Animación | `gsap` (ya) + plugins SplitText, Flip, Draggable, Observer | Gratuitos desde 3.13; verificar licencia vigente antes de publicar |
| WebGL ligero | `ogl` | Más ligero que three para planos con shader; three se queda para 3D real |
| Gráficos | SVG propio o `visx` | Evitar librerías de 300 KB para cuatro gráficas |
| Arrastrar y soltar accesible | `@dnd-kit/core` | Para Kanban |
| Iconos | El kit ya tiene `Icon` pixel; para demos modernas, SVG a medida | Decidir si las demos no retro usan otro set |

Antes de añadir cualquiera, consulta su versión actual y la compatibilidad con React 19 / Next 16.

## 6. Fases propuestas

| Fase | Contenido | Desbloquea | Criterio de cierre |
|---|---|---|---|
| **1 · Motor** | A1–A7, C1, C2, C4–C6, B1, B2, F1, F2 | Demos 1, 2, 5 | `/componentes` enseña cada pieza; reduced-motion probado |
| **2 · Navegación y secciones** | E1–E3, D1–D5, H2–H6, G1, G2, G7 + variante `editorial` | Demos 1, 2, 4, 5, 6, 10 | Dos demos terminadas y revisadas a 390 px |
| **3 · WebGL y media** | G3–G6, G8, G10, F6 | Demos 4, 6, 8 | Fallback sin WebGL verificado; peso medido |
| **4 · Producto y comercio** | I1–I9, J1–J6 | Demos 3, 7, 9 | Dashboard y tienda navegables con teclado |

## 7. Decisiones que necesito de ti

1. **Identidad visual de las demos.** *(Hecho: la variante `editorial` ya existe; falta que confirmes si va por defecto en las demos de cliente.)* El kit es retro/pixel/ASCII; casi todos los SOTD no lo son. Propuse una novena
   variante `editorial` (tipografía grande, mucho blanco, rejilla fina, monocromo + un acento) sin tocar las 8 actuales.
   ¿Las demos de cliente van con `editorial` por defecto y lo retro queda como seña propia?
2. **Fuentes.** Hay que elegir 2–3 familias (una display, una de texto, una mono) con licencia que permita el uso
   comercial en demos de cliente. Hoy el kit usa `fontVariables` de `lib/ui/fonts`.
3. **Qué hacer con las réplicas «al detalle».** Replicar la *estructura y los patrones de interacción* es práctica
   normal; copiar tal cual el diseño, textos o imágenes de una web ajena no lo es. Propongo que cada demo use contenido
   propio y copie solo mecánicas. Si una demo se va a enseñar a un cliente como «tu web», conviene que no sea
   reconocible como la de otro estudio.
4. **Dónde vive cada cosa.** ¿Todo en `components/ui/` (y en el paquete `trama-ui`) o las piezas pesadas (WebGL, Kanban)
   en un segundo paquete opcional para no engordar el principal?

## 8. Primer paso inmediato (si das el visto bueno)

1. Crear `lib/motion/` (A1–A4) y probarlo en `/componentes`.
2. Construir `SplitText`, `Preloader` y `CustomCursor` con `HoverPreview`.
3. Montar la demo 1 («Estudio») como banco de pruebas, anotando en este documento qué pieza faltaba de verdad.

Al cerrar cada pieza: ficha en `lib/catalog/entries/`, fila en la tabla de `docs/README.md`, `npm run catalog`,
`npm run typecheck` y `npm run catalog:check`.
