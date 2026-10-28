# Trama · documentación

Librería de componentes React/Next.js (ASCII, textmode, pixel art y secciones de landing) + un sitio que la
enseña: portada (`/`), documentación (`/docs`, las páginas de esta carpeta), catálogo interactivo (`/componentes`),
índice de demos (`/demos`), landings de referencia (`/demo/<slug>`) y webs completas (`/sitios/<slug>`).

| Documento | Para qué |
|---|---|
| [00-empezar.md](./00-empezar.md) | **Primeros pasos**: instalar, tema, `variant`/`intent` y la primera página. Se publica en `/docs/empezar`. |
| [CATALOG.md](./CATALOG.md) | **Referencia rápida** (generada): cada componente con su import, props, tipos y defaults, y las landings de referencia con los componentes que usan. Es lo primero que debe leer un agente. |
| [catalog.json](./catalog.json) | Lo mismo en datos, para herramientas. |
| [02-guia-de-componentes.md](./02-guia-de-componentes.md) | Cómo **crear** componentes coherentes: tokens, sistema de estilos `--s-*`, reglas, trampas conocidas. |
| [01-evaluacion.md](./01-evaluacion.md) | Historial de decisiones: por qué el kit es como es. Los conteos de cada apartado son los de su fecha. |
| [05-transiciones-de-pagina.md](./05-transiciones-de-pagina.md) | **Transiciones de página y de elementos** (`PageTransition`, `ElementTransition`, `SharedTransition`, `Traveler`): la ventana entera al navegar con la View Transitions API (salvo la cabecera), elementos sueltos y compartidos, elementos que viajan entre rutas sin desaparecer, cómo colocarlas en el App Router de Next y elección por enlace. |
| [14-transiciones-entre-rutas.md](./14-transiciones-entre-rutas.md) | Ronda 6 de webs premiadas: continuidad entre rutas. 16 transiciones de Awwwards vistas fotograma a fotograma, sus patrones (vista previa → portada, texto palabra a palabra, siguiente en dos tiempos, luz ambiental), `Traveler`, `SharedText`, `AmbientLight`, la biblioteca de vídeo, la demo Travesía y cómo probar transiciones con Playwright. |
| [15-evaluacion-proximas-demos.md](./15-evaluacion-proximas-demos.md) | Ronda 7 (evaluación): SOTD de Awwwards aún sin revisar, conceptos nuevos candidatos y qué demos clonar a continuación. |
| [16-guias-de-estilo-plan.md](./16-guias-de-estilo-plan.md) | Ronda 8: constantes medidas de las webs premiadas (color, tipo, espacio, movimiento), composiciones, estructuras de relato y plan de guías de estilo con la página `/guias`. |
| [17-sectores-comerciales.md](./17-sectores-comerciales.md) | Ronda 8: **qué necesita la web de cada sector** (restaurante, pastelería, gimnasio, ropa, joyería, estética) con funciones prácticas (QR de mesa, alérgenos, reservas, horario de clases, guía de tallas, cita en taller), las piezas `OpeningHours`, `MenuList`, `DatePicker`, `ActionBar` y `QRCode`, y la pastelería Almíbar en tres versiones. |
| [18-redundancia-y-temas.md](./18-redundancia-y-temas.md) | **Redundancia y carga útil**: qué fusionar, extraer o atomizar en el kit (criterio por KB y dependencias), lo aplicado (Phosphor por peso, `CarouselLazy`, menos GSAP: −1,24 MB de JS en 30 páginas sin cambiar un píxel), el CSS y las fuentes como siguiente palanca, y un modelo de temas en tres capas que une `TokenSet`, `ThemeDef` y `StyleGuide`. |
| [19-joyeria.md](./19-joyeria.md) | Ronda 9: **joyería** — 12 joyerías españolas y 15 internacionales medidas (Cartier, Blue Nile, Jenn Zeiss…), relato contado solo con servicios (Sinek, StoryBrand, service blueprint), **luz por finalidad** con datos de GIA (`LightScroll`, `LIGHT_PRESETS`), `BeforeAfter`, y la web Quilate con configurador de alianza y de solitario en 3D. |
| [20-halloween.md](./20-halloween.md) | Ronda 10: **evento de Halloween** — la web Ánima, la noche contada en seis actos con una **calavera 3D modelada con una función de distancia** (MarchingCubes de three, oclusión por vértice con la propia SDF, mandíbula, trío, ojos que pasan a rojo), entradas y programa, y la pieza nueva **`Countdown`**. |
| [21-simulacion-fluidos-threejs.md](./21-simulacion-fluidos-threejs.md) | Tutorial: **simulación de fluido/humo con shaders en Three.js** (vídeo de Bandinopla, port del WebGL-Fluid-Simulation de Pavel Dobryakov) — texturas como rejilla, ping-pong, splat, curl, vorticidad, divergencia, presión (Jacobi), resta de gradiente, advección, parámetros y versiones WebGL/WebGPU (TSL). |
| [22-webs-3d-patron-y-briefing.md](./22-webs-3d-patron-y-briefing.md) | **Webs 3D e interactivas**: qué sabemos hacer, qué falta para alto impacto, el patrón de diseño y código, **qué preguntar al cliente antes de construir** (¿hace falta un relato?) y las cuatro vías para conseguir modelos (descargar, gltfjsx, partir a mano, generar, Blender MCP), con las trampas aprendidas. |
| [23-demo-escaner.md](./23-demo-escaner.md) | Ronda 11: evaluación de mercado para la siguiente demo 3D y la web **Cota** (topografía con dron) con la pieza nueva **`PointCloud`**. |
| [24-historia-interactiva-entre-rutas.md](./24-historia-interactiva-entre-rutas.md) | Ronda 12: **historia interactiva entre rutas** — la web **Maravillas**, un gabinete de curiosidades con cuatro piezas 3D reales (escaneos de museo incluidos) que viajan entre rutas (índice → sala → estante → vitrina), un juego por sala con pistas que pasan de una a otra, diseño editorial de letras enormes y la pieza nueva **`ScratchReveal`**. |
| [25-web-videojuego-runa.md](./25-web-videojuego-runa.md) | Ronda 13: **la web de un videojuego que se juega** — **Runa**, lanzamiento de un roguelite indie con pantalla de título, selección de héroe (modelos 3D con esqueleto), cofre que se abre forzando la cerradura y jefe con puntos débiles; transiciones duras (pixelado, glitch, barrido), HUD persistente y la pieza nueva **`SkillCheck`**. |
| [26-cine-3d-metodo-y-vocabulario.md](./26-cine-3d-metodo-y-vocabulario.md) | Ronda 14: **cine 3D** — capturar una web WebGL/WebGPU (gancho de three, firmas de shaders y del JS publicado, vídeo a fotograma exacto con reloj virtual), describirla con la **ficha de escena** (ocho ejes de vocabulario y rúbrica) y depurar una recreación en el banco `/lab/cine` hasta su calidad (`cine:capture`, `cine:analyze`, `cine:compare`). |
| [27-estudio-plain-sight.md](./27-estudio-plain-sight.md) | Ronda 15: **primer estudio real** con el método de cine 3D — Plain Sight (motion-pieces): ficha, siete vueltas de recreación guiadas por el comparador, la verificación de lo esperado frente a lo obtenido y la pieza nueva **`TypeField`** (campo de letras 3D con palabras escondidas) más `lib/postfx`. |
| [28-estudio-hublot-y-coste.md](./28-estudio-hublot-y-coste.md) | Ronda 17: **segundo estudio** — Hublot (darkroom.engineering, WebGPU + TSL, todo procedural): exploración gesto a gesto, siete vueltas (cámara 3 %, imagen 10 %), la pieza nueva **`Porthole`** (ventanilla de avión al alba) y **cuánto cuesta** estudiar una web 3D y sacar piezas (2–5 h por web). |
| [29-estudio-bruno-simon-y-acabado.md](./29-estudio-bruno-simon-y-acabado.md) | Ronda 18: encuesta al usuario, **eje de acabado** del comparador (Hublot 49 % → 11 %) y **tercer estudio** — Bruno Simon (física e interacción): dinámica medida desde la pose del chasis, física propia sin WebAssembly (`lib/physics`) y la pieza **`ToyDrive`**. |
| [30-relato-con-scroll-y-dom.md](./30-relato-con-scroll-y-dom.md) | Ronda 19: **medir el DOM** (texto sincronizado con el 3D) — el relato escrito de una web con scroll visto en los píxeles, eje de texto en el comparador, estudio de Meer Mohsin y la pieza **`ChapterStage`**. |
| [31-estudio-lusion-materiales.md](./31-estudio-lusion-materiales.md) | Ronda 20: **materiales premium** — la portada de Lusion (sombreado analítico entre vecinas sin luces ni entorno, traducido a TSL), dinámica de un grupo de cuerpos con **`cine:conjunto`**, `--recorte` en la captura y la pieza **`CrossCluster`**. |
| [32-estudio-chartogne-grabado.md](./32-estudio-chartogne-grabado.md) | Ronda 21: **ilustración en 3D** — Chartogne-Taillet: el grabado a lápiz (la escena guarda normal, lápiz y cercanía; la composición pinta papel, lápiz y contornos de Sobel), **`cine:tramo`** para cortar capturas con intro, curva de giro medida y la pieza **`EngravedMap`**. Imagen 8 %, acabado 7 %. |
| [33-revision-y-herramientas.md](./33-revision-y-herramientas.md) | Ronda 22: **revisión de todos los pendientes** y herramientas nuevas del inspector — `cine:explora` (primer vistazo y gestos), `cine:sonda` (volcado de escena y uniforms), `cine:vuelta` (el bucle en una orden, con recetas e historial), `cine:tramo movimiento` y `--movil`. |
| [34-api-grafica-flujo-y-ruido.md](./34-api-grafica-flujo-y-ruido.md) | Ronda 23: **gancho de la API gráfica** (`gl.js`: coste y pasadas con cualquier motor; la cadena de render leída sola), **`cine:flujo`** (movimiento de la imagen: la cámara de las webs sin three) y **el ruido de cada eje** (`cine:vuelta --ruido`): en webs vivas, comparar con el ruido y no con un umbral fijo. |
| [04-pendientes.md](./04-pendientes.md) | **Lista de trabajo**: lo que queda por hacer en la web y en la librería, con los pasos de cada punto. |

`CATALOG.md` y `catalog.json` salen de `lib/catalog/` con `npm run catalog`; `npm run catalog:check` falla si
se quedan atrás o si un componente no aparece en la tabla de abajo.

## Qué es librería y qué es sitio

| Parte | Carpeta | ¿Se exporta a otros proyectos? |
|---|---|---|
| **Kit** — componentes | `components/ui/*.tsx` | Sí |
| **Kit** — CSS (un solo punto de entrada) | `components/ui/styles/kit.css` (importa `ui-kit.css`, `ui-carousel.css`, `ui-video.css`, `ui-view-transitions.css`) | Sí |
| **Kit** — tokens, fuentes, iconos, utilidades | `lib/ui/` | Sí |
| **Kit** — motores de fondos | `lib/asciify/`, `lib/sketches/`, `lib/scroll/`, `lib/text/` | Sí, solo lo que usen los componentes elegidos |
| **Kit** — motores 3D y de relato | `lib/gems/` (gemas con trazado de rayos, HDR y tallas), `lib/story/` (`useScrollStory`, el motor de los recorridos por pasos), `lib/modelnav/` (la escena de `ModelNav`), `lib/object3d/` (la de `ObjectStage`), `lib/pointcloud/` (la de `PointCloud`), `lib/typefield/` (la de `TypeField`), `lib/porthole/` (la de `Porthole`: cielo, suelo y ala en TSL, WebGPU con reserva WebGL2), `lib/physics/` (física de cuerpos rígidos y vehículo, sin WebAssembly) y `lib/toydrive/` (la de `ToyDrive`), `lib/chapterstage/` (la de `ChapterStage`) `lib/crosscluster/` (la de `CrossCluster`: material analítico en TSL y física del racimo) y `lib/emblem/` (la de `ThornEmblem`: emblema de púas procedural) y `lib/gravure/` (la de `EngravedMap` y `GravureCanvas`: material de lápiz y composición de grabado en TSL, paisaje procedural) | Sí, solo lo que usen los componentes elegidos |
| Catálogo `/componentes` | `lib/catalog/` (esquema, entradas, escenas, presets), `components/playground/` | No |
| Web de la librería (portada, docs, demos) | `components/site/`, `lib/docs.ts`, `lib/site-data.ts` | No |
| Demos | `app/`, `components/*.tsx`, `lib/demos*.ts`, `lib/themes/` | No |
| Landings de referencia | `components/landings/` | No (son ejemplos para copiar ideas) |

## Dos formas de llevar Trama a un proyecto

| | npm (`npm i trama-ui`) | copia (`npm run kit:export`) |
|---|---|---|
| Para qué | usar el kit tal cual y actualizarlo con `npm update` | adaptarlo a fondo en ese proyecto y devolver las mejoras con `kit:pull` |
| Imports | `import { Hero } from "trama-ui"` · `import Hero from "trama-ui/Hero"` | `import Hero from "@/components/ui/Hero"` |
| CSS | `import "trama-ui/styles.css"` | `import "@/components/ui/styles/kit.css"` |

### Publicar en npm

```bash
npm run pkg:build            # construye dist-npm/ desde el kit (alias @/ → rutas relativas, tsc → ESM + .d.ts)
cd dist-npm && npm publish   # requiere `npm login`; `npm publish --dry-run` para comprobar sin subir
```

`npm run pkg:pack` genera además el `.tgz` para probarlo en otro proyecto (`npm i ../TESTVISUAL/dist-npm/trama-ui-x.y.z.tgz`).
Antes de publicar: sube `version` en el `package.json` de la raíz y apunta los cambios en `CHANGELOG.md`. El script
comprueba que ningún archivo pierda `"use client"` y que todos los imports relativos lleven extensión (webpack exige
rutas completas en paquetes ESM). El paquete incluye `CATALOG.md` con los imports ya como `trama-ui/X`.

## Desplegar la web

`npm run build && npm start` (o cualquier hosting de Next.js). Define `NEXT_PUBLIC_SITE_URL` con el dominio público
(p. ej. `https://trama.dev`): de ella salen las URL absolutas de `sitemap.xml`, `robots.txt` y la vista previa al
compartir (`metadataBase`). En Vercel no hace falta: se usa su dominio de producción. Icono (`app/icon.svg`,
`app/favicon.ico`, `app/apple-icon.tsx`), imagen de vista previa (`app/opengraph-image.tsx`) y 404 (`app/not-found.tsx`)
van en `app/`.

## Usar el kit en otro proyecto Next.js

```bash
npm run kit:export -- ../mi-proyecto                                  # kit completo
npm run kit:export -- ../mi-proyecto --only Hero,PricingSection,Footer # solo eso y sus dependencias
```

Copia los archivos con las mismas rutas (si el proyecto usa `src/`, debajo de `src/`), dice qué paquetes npm faltan
y deja un `.kit.json` con el commit de origen. En el `app/layout.tsx` del proyecto:

```tsx
import "@/components/ui/styles/kit.css";
import { fontVariables } from "@/lib/ui/fonts";
// <html className={fontVariables}>
```

Tema: define `--bg --fg --mut --acc --acc2 --card --ln --r` en `:root` o en cualquier contenedor (sin ellos se usa el
neutro oscuro de `kit.css`).

**Temas.** Un tema es un objeto de tokens; el kit trae `neutralTokens`, `dotmatrixTokens`, `editorialTokens` y `editorialDarkTokens`
en el registro `TOKEN_THEMES` (`lib/ui/tokens.ts`, también en `trama-ui/tokens`). No hay límite: añadir uno es una entrada nueva en
ese registro y aparece solo en el selector de `/componentes` (guía §2.5). Fuentes y pares tipográficos: guía §2.3 (`FONT_PAIRINGS`).

**Traer de vuelta lo que mejores en el proyecto:** `npm run kit:pull -- ../mi-proyecto` enseña qué componentes del
kit cambiaste allí, cuáles son nuevos y cuáles chocan con cambios de la librería; con `--apply` los copia aquí.
Después: registrar los nuevos en `lib/catalog/entries/`, `npm run catalog`, revisar `git diff` y hacer commit. Una
re-exportación nunca pisa un archivo modificado en el proyecto sin `--force`.

## Catálogo interactivo: `/componentes`

Vista previa en tiempo real, props editables (controles generados del esquema), código de uso, **selector de tema y
panel de tokens** (`bg fg mut acc acc2 r font`), filtros por **categoría** y **estilo**, y un **comparador de los 7
estilos** para cualquier componente con variante. La URL guarda el componente abierto (`/componentes#ascii-card`).

- **Tema y color** llegan a todos los componentes (guía §2.1): `var()` en DOM, `useTokens` en canvas y `palette` en
  los fondos de escena.
- **Tipografía**: 8 fuentes de Google + 46 pixel, autoalojadas con `next/font` (guía §2.3).
- **Botón «FX»**: envuelve el componente con `Presence` (entrada/salida) y `HoverFX` (hover) sin tocar su código
  (guía §6.1). No aplica a Fondos.
- **«Ver en caso real»**: una escena creíble por categoría con el componente en vivo dentro (`lib/catalog/scenarios.tsx`,
  guía §6.2). Todas las categorías la tienen salvo **Secciones**, que ya son la escena.

| Categoría | Componentes (`components/ui/`) |
|---|---|
| Fondos | `AsciiBackground` · `TextmodeBackground` · `GridBackground` · `GradientField` · `FlameHorizon` (llamas con manos, coreografía por scroll) · `FluidCursor` (humo que sigue al puntero) · `AmbientLight` · `CrtOverlay` · `RetroCanvas` (+ `RetroFX`, `RetroShapes`, `RetroModel`) |
| Texto | `ScrambleText` · `Typewriter` · `NeonSign` · `BitmapText` · `Marquee` · `SectionHeader` (titular gigante y palabra de fondo) · `Divider` · `SplitText` · `FitText` · `ScrubText` · `ScatterText` |
| Tarjetas | `AsciiCard` · `Panel` · `PricingCard` · `Testimonial` (tarjeta, suave o cita abierta; retrato circular) · `BlogCard` · `StackedCards` · `BentoGrid` · `ProductCard` · `BlueprintFrame` · `CellGrid` |
| Interacción | `Button` · `MagneticButton` · `GlyphCursor` · `Spotlight` · `BeforeAfter` · `HoverFX` · `ScratchReveal` · `SkillCheck` · `SoundToggle` · `ScrollArea` · `RollLink` · `CustomCursor` · `SmoothScroll` · `CircleButton` · `StickerCollage` · `ImageTrail` |
| Transiciones | `SceneFlash` · `Preloader` · `PinnedSection` · `ChapterStage` (capítulos con palabra gigante y tarjeta con fallo de señal) · `ScrollExpand` (tarjeta de medios que crece con el scroll) · `Parallax` · `Reveal` · `Presence` · `LineDraw` · `ThemeScroll` · `LightScroll` (luz por finalidad; + `useLight`, `LIGHT_PRESETS`) · `PageTransition` (ventana entera; + `PageTransitionPersist`) · `ElementTransition` (un elemento; + `SharedTransition`) · `SharedText` (palabra a palabra) · `Traveler` (viaja entre rutas; + `TravelStage`, `TravelSlot`, `useTraveler`) |
| Datos | `StatCounter` · `LocalTime` · `KpiCard` · `Chart` · `DataTable` · `MetaTable` · `OpeningHours` · `ClassSchedule` (horario de clases con plazas, espera y reservas) · `CohortList` (programas por convocatoria: nivel, formato, fechas y estado) · `EventLineup` (cartelera de funciones por mes, con precio y estado) · `QRCode` · `AsciiChart` · `TerminalTyper` · `Timeline` · `Countdown` · `Table` · `CodeBlock` |
| Navegación | `NavBar` · `Tabs` · `Accordion` · `Breadcrumbs` · `Pagination` · `Dropdown` · `ScrollProgress` · `FullscreenMenu` · `HideOnScroll` · `SectionIndex` · `AppShell` · `FilterBar` · `IslandNav` · `ModelNav` · `EdgeTab` · `ActionBar` |
| Formularios | `TextField` · `Toggle` · `RangeSlider` · `Select` · `CheckboxGroup` · `RadioGroup` · `Stepper` · `OtpInput` · `QuantityStepper` · `OptionPicker` · `DatePicker` · `BookingFlow` · `AppointmentList` · `CheckoutFlow` · `EnrollmentFlow` · `BriefFlow` · `SeatMap` (plano de sala) · `ShowBookingFlow` (cena con espectáculo) · `MembershipFlow` · `MemberArea` |
| Feedback | `Badge` · `Progress` · `Alert` · `Spinner` · `Skeleton` (carga por piezas, conserva el contenido y sus dimensiones) · `Kbd` · `Avatar` · `EmptyState` · `PriceTag` |
| Galerías, vídeo y audio | `ImageGallery` · `Carousel` (+ `CarouselLazy`, el mismo con Swiper bajo demanda) · `HorizontalScroll` · `ImageReveal` · `DistortImage` · `DragGrid` · `ObjectStage` · `ProductGallery` · `ExpandingPanels` (scroll móvil opcional, subtítulos del activo y límite tipográfico configurable sin truncar títulos) · `PointCloud` · `TypeField` · `Porthole` · `ToyDrive` · `CrossCluster` · `EngravedMap` · `GravureCanvas` · `ThornEmblem` · `ProjectReel` (reel de proyectos fijado con fondo desenfocado) · `DeviceMockup` · `DeviceMockup3D` · `LogoCoin` · `Logo3D` · `VideoPlayer` · `FloatingVideo` (vídeo flotante que crece al pulsarlo) · `AudioPlayer` · `ExplorableCanvas` · `ShapeMosaic` (círculos y cuadrados del acento con fotos que se disuelven al bajar) |
| Secciones | `Hero` · `ContactForm` · `CTASection` · `FAQSection` (cabecera lateral o superior, respuestas alineables) · `StatsSection` · `PricingSection` · `TestimonialSection` (tres tratamientos y fotos de perfil por reseña) · `Footer` · `FeatureGrid` · `TeamSection` (fotos con marco y tratamiento B/N, biografía, reserva por persona, filas) · `LogoCloud` · `ArticlesSection` · `ProjectList` · `BigFooter` · `CrossfadeHero` · `FeatureExplorer` · `TornPaper` (franja de papel rasgado) · `GuideFrame` (guías de estilo, ver `/guias` y [16](./16-guias-de-estilo-plan.md)) |
| Contenido | `Prose` · `Callout` · `TableOfContents` · `ArticleHeader` · `Article` · `MenuList` |
| Overlays | `Modal` · `Toast` · `Tooltip` · `LinkPreview` · `Drawer` · `ChatWidget` · `CommandPalette` · `CartDrawer` · `CookieBanner` |
| Pixel art | `Icon` · `PixelFrame` · `Sprite` |

**Secciones** son bloques compuestos (hero, contacto, precios, FAQ, cifras, testimonios, equipo, marcas, blog, pie)
listos para pegar en una landing; combinan las piezas de arriba (guía §11). **Overlays**: `Modal`/`Drawer` con
`position: fixed`, `Toast` sobre `sonner` (guía §12). **Galerías** sobre Swiper y vídeo nativo (guía §18–19).
**Pixel art**: iconos Pixelarticons (MIT) y marcos/sprites Kenney (CC0) (guía §17).

## Landings de referencia

Seis landings construidas **solo** con `components/ui/`, en `components/landings/` y servidas en `/demo/<slug>`.
`CATALOG.md` lista qué componentes usa cada una y en qué orden, para pedirlas como plantilla.

| Slug | Qué demuestra |
|---|---|
| `esparta` | Barbería de barrio: navegación lateral, fotografías de oficio, ticket del ritual y carta de servicios reservables. Revisión en [51](./51-negocios-con-identidad.md). |
| `forja` | Cuaderno de entrenamiento oscuro: fotografía de grupo, sesión explicada en tres capítulos 3D, horario, espera y lista de cuotas. Revisión en [51](./51-negocios-con-identidad.md). |
| Iteración de las cuatro demos | Revisión visual y de competencia en [51](./51-negocios-con-identidad.md): cuatro composiciones distintas, doce fotografías generadas del oficio y entrenamiento, 3D narrativo y `PricingSection` con carta de servicios y tabla comparativa. |
| `th-ciphergrid` | Retrowave/cyberpunk: casi todo el catálogo, fondo que cambia de escena con el scroll, formulario → `Modal` → `Toast` (guía §15). |
| `th-mycel` | Orgánica: `AsciiBackground` con `progress` atado al scroll, alternando con `GridBackground` y sketches de textmode.js. |
| `th-folio` | La única de tema claro: fondos de papelería, legibilidad en claro (guía §16). |
| `th-minimal` | MARÉ minimal: variante minimalista de la marca del tema «Maré» (fondo dither, tipografía pixel). |
| `th-geometry` | FORMAS: 2000dvh, el scroll cambia celda y geometría del fondo; hover por figura. |
| `th-faceta` | FACETA: landing larga que mezcla ese fondo con secciones del kit en estilo pixel duro. |

Las otras seis landings de la galería (`th-tide`, `th-brew`…) usan el sistema antiguo `ThemedLanding` (no el kit).

## Webs completas de referencia

Sitios **de varias páginas** hechos con el kit, en `components/sites/<slug>/` y servidos en `/sitios/<slug>/…`
(arquitectura y plan en [`03-webs-completas.md`](./03-webs-completas.md); páginas y componentes de cada una en `CATALOG.md`).

| Slug | Qué demuestra |
|---|---|
| `hebra` | Estudio de pelo editorial: collage rosa, índice Forma/Textura/Color, carta, reserva y agenda persistente. Diseño en [51](./51-negocios-con-identidad.md). |
| `cadencia` | Club social de movimiento: planificador semanal, fotografía cotidiana, horario y espera, comparación de planes y área personal. Diseño en [51](./51-negocios-con-identidad.md). |
| `kernel-log` | Blog de tecnología: `Article` con índice y barra de lectura, búsqueda y filtro por temas, paginación, newsletter con archivo. |
| `pixelforge` | Tienda de assets: filtros y orden, fichas con licencias, **carrito** en `localStorage`, cupón, pago en pasos, FAQ y legales. |
| `vigia` | Seguridad: `ChatWidget` en todas las páginas, planes → presupuesto con el plan elegido, presupuesto en 4 pasos con estimación. |
| `onda` | Fabricante musical: mega menú por categorías, catálogo con `Tabs`, fichas con especificaciones y descargas, registro de producto. |
| `clara-vidal` | Estilista, estética minimalista en claro: bandas alternas, tipografía grande, lookbook, diario y reserva con huecos + `Modal`. |

## Deuda conocida

- `ThemedLanding` y las demos de la galería siguen con su propia implementación de cards/efectos (evaluación P1–P3).
- Las escenas «con progreso» leen el `scrollState` global cuando **no** reciben `progress`; `AsciiBackground` con
  `progress` ya pasa su propio valor al painter (guía §7).
- Los textos por defecto de los componentes son copy de demostración (escuela de surf…): en un proyecto real hay que
  pasar siempre las props de texto (o `""`).
- Sin pruebas visuales automatizadas: la red de seguridad es `npm run typecheck`, `npm run catalog:check` y `next build`.

## Fotografías de las demos

`public/img/<tema>/` guarda fotos reales con licencia libre (CC0, dominio público o CC BY) de Wikimedia Commons. Se usan con
`photo(tema, i)` / `photos(tema)` de `lib/sites/photos.ts`. La atribución (autor, licencia, origen) está en
`lib/sites/photo-credits.json` y se muestra en `/creditos`, enlazada discretamente desde el pie de las demos. Para regenerarlas:
`npm run images:fetch [-- tema]`. No viajan en el paquete npm. Al usar una foto nueva en una demo, enlaza `/creditos` en su pie.

Los **vídeos** siguen el mismo criterio: `public/video/<tema>/` (clips de 7–12 s, 1280 px, sin audio, en bucle, con póster),
`video(tema, i)` / `videos(tema)` de `lib/sites/videos.ts`, créditos en `lib/sites/video-credits.json` y en `/creditos`. La lista es
curada (cada clip con su tramo) en `scripts/fetch-videos.mts`: `npm run videos:fetch [-- tema]` (necesita `ffmpeg`),
`-- --buscar "texto"` para candidatos y `-- --hojas` para hojas de contacto con las que elegir el tramo ([14](./14-transiciones-entre-rutas.md) §5).

Los **modelos 3D**, también: `npm run models:fetch` (`scripts/fetch-models.mts`) busca y baja GLB con licencia CC0 o CC BY
(sin SA, ND ni NC) a `public/models/<nombre>/`, apunta autor, licencia y origen en `public/models/credits.json` y en
`public/models/LICENSES.md`, y mide cuánto está **articulado** (esqueleto, animaciones, piezas con nombre).
- **Buscar**: `-- buscar "texto" [--articulado] [--fuente …] [--n 12]`.
- **Bajar**: `-- bajar fuente:id nombre [--partes] [--res 1k]`.
- **Revisar**: `-- revisar archivo.glb [nombre] [--partes]`.
- **Fuentes**:
  - Sketchfab: buscar no pide nada; bajar pide `SKETCHFAB_TOKEN`. Es la que más modelos animados y con esqueleto tiene.
  - Las claves van en **`.env.scripts`** (raíz del repo, ignorado por git; Next.js no lo lee). Copia `.env.example` y
    rellénalo; el script lo carga solo. Nunca en `.env.example` ni en el código.
  - Poly Pizza: low poly, pide `POLY_PIZZA_KEY`.
  - Poly Haven: atrezo CC0, sin clave.
  - Khronos: modelos de muestra de glTF, sin clave.
- **`--partes`** usa [gltfjsx](https://github.com/pmndrs/gltfjsx) para generar `components/models/<Nombre>.tsx`, con cada
  pieza como nodo propio y, si hay animaciones, una prop `play`.
  - Pasa siempre `--keepmeshes`: el `--transform` no junta mallas, así que la articulación se conserva.
  - Optimiza el GLB (texturas WebP) y, en vez de Draco, lo **cuantiza** (`KHR_mesh_quantization`): la CSP de producción
    no deja compilar WebAssembly, que es lo que usan los decodificadores de Draco y de meshopt. `-- sin-draco archivo.glb`
    lo hace con cualquier GLB. Guarda solo el optimizado.
  - El componente usa `useGLTF` y `useAnimations` de `@react-three/drei`.
