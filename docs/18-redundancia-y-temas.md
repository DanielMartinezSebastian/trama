# Redundancia en componentes, carga útil y construcción de temas (21-10-2026)

> Auditoría de los 157 archivos de `components/ui/` (más `lib/ui`, `lib/motion` y los estilos) en cinco frentes: texto y
> movimiento; fondos, canvas y 3D; secciones y tarjetas; navegación, formularios y medios; CSS, paquete y temas. La pregunta
> de partida: **¿qué se puede fusionar sin que el cliente pague variantes que no usa, qué conviene atomizar y cómo deberían
> construirse los temas con lo aprendido en las rondas 1–8 (docs 06–17)?** Rama `feat/redundancia-componentes`.
>
> **Método.** El peso se mide en el navegador, no en el build: Turbopack no da peso por ruta y las webs de `/sitios` cargan
> su código con `next/dynamic`, así que el HTML no lo nombra. Playwright abre cada página con `next start`, la recorre entera
> (para disparar lo diferido) y suma `encodedBodySize` de JS y CSS. 30 páginas: portada, catálogo, las 23 webs y seis landings.
> **Que no se rompe nada se comprueba píxel a píxel**: captura de página completa, con movimiento reducido, de la base y de la
> rama (`pixelmatch`, umbral 0,1), con dos pasadas de la base para conocer el ruido de cada página.

## 0. Conclusiones

1. **La redundancia que cuesta dinero no está en los componentes duplicados, sino en importaciones estáticas de cosas que
   casi nunca se usan.** El kit tiene poco código repetido entre componentes con el mismo papel (Table/DataTable,
   Footer/BigFooter, Typewriter/TerminalTyper… hacen cosas distintas). Lo que pesa son seis secciones que traían Swiper para
   un `layout="carousel"` que usan dos páginas, iconos con seis pesos cuando cada web usa uno, y GSAP cargado para tareas de
   diez líneas.
2. **Regla para fusionar o atomizar** (§2): fusiona cuando la variante extra cuesta menos de ~1–2 KB minificados y no
   arrastra una dependencia; atomiza, con el mismo import y las mismas props, cuando una variante trae una dependencia
   pesada o ≥ 3 KB que la mayoría no usa. La pieza pesada pasa a un fragmento diferido detrás de la misma API.
3. **Aplicado en esta rama, sin cambiar ni un píxel:** −1,24 MB de JS en total sobre las 30 páginas medidas. Las webs con
   Phosphor bajan entre 67 y 129 KB (vigia de 372 a 243 KB, −35 %), las landings con AsciiCard o secciones entre 33 y 47 KB.
   Ninguna página empeora más de 0,4 KB.
4. **El CSS es ahora el mayor coste fijo**: ~105–112 KB gz en *todas* las páginas, de los que ~50 KB son 449 reglas
   `@font-face` del registro global de fuentes y el resto el kit entero. Es la siguiente palanca (§5).
5. **Temas: hoy hay tres modelos que no se hablan** — `TokenSet` (color y fuente), `ThemeDef` de las landings `th-*` (con su
   traductor) y `StyleGuide` (escala, espacio, superficie y movimiento como `--g-*`). Los componentes del kit no leen ninguna
   `--g-*`, así que una guía cambia las utilidades `ui-g-*` pero no un `Button` ni un `SectionHeader`. Propuesta (§6): un
   solo emisor de tokens en tres capas, con **tokens semánticos que nacen con su valor actual como respaldo literal**, de
   modo que ningún tema existente cambie.

## 1. Lo que se ha cambiado en esta rama

| Cambio | Archivos | Efecto medido |
|---|---|---|
| **Phosphor por peso.** `scripts/build-icon-sets.mjs` genera `lib/ui/icons-phosphor-<peso>.ts` (los mismos trazos, serializados con react-dom) y `lib/ui/phosphorSvg.tsx` pinta el mismo `<svg>` que el `SSRBase` de Phosphor. Las 13 webs importan `phosphorLight`/`phosphorThin`/… El set completo `phosphor` sigue igual, para mezclar pesos o para el catálogo | generador, 6 módulos, 13 `Site.tsx`, `build-package.mts` (export `trama-ui/icons/phosphor-*`) | −67 a −129 KB por web; capturas al 0,000 % |
| **`CarouselLazy`**: el mismo `Carousel` con el JS de Swiper aparte (el CSS de Swiper va estático: sin parpadeo). Lo usan FeatureGrid, TeamSection, ArticlesSection, LogoCloud, PricingSection y TestimonialSection | `components/ui/CarouselLazy.tsx` y las seis secciones | ~33 KB menos en las páginas que pintan rejilla; Faceta y Almíbar (carruseles reales) sin cambio visual |
| **AsciiCard** carga `AsciiBackground` (y sus painters) solo con `background="scene"`, que no usa ninguna demo | `AsciiCard.tsx` | parte de los −33 a −47 KB de las landings ASCII |
| **StatCounter sin GSAP**: rAF con la misma curva (`power2.out` = 1 − (1 − t)²) | `StatCounter.tsx` | sin GSAP en las landings que solo lo usaban para contar |
| **HoverFX** solo descarga GSAP con `fx="tilt"`; `glow` son dos variables CSS | `HoverFX.tsx` | — |
| **SmoothScroll** con `syncGsap={false}` en las 7 webs que no usan GSAP (alzado, arbor, estudio, foro, mota, plano, sonar) | 7 `Site.tsx` | GSAP + ScrollTrigger fuera de esas webs |
| **Movimiento reducido en un sitio**: `prefersReducedMotion()` (lectura puntual) junto a `useReducedMotion()`; 24 componentes dejan de escribir el `matchMedia` a mano; Carousel e ImageGallery usan el hook común | `lib/ui/useReducedMotion.ts` y 26 componentes | mismo comportamiento |
| **`pinProgress(r, vh)`** en `lib/motion/progress.ts` para PinnedSection, HorizontalScroll, ScrubText y ScatterText; ScrollProgress usa el `clamp01` común | 5 componentes | corrige la división entre cero de PinnedSection cuando la sección mide lo mismo que la ventana |
| BigFooter sin `"use client"` (no tiene estado; sus hijos ya son cliente) | `BigFooter.tsx` | — |
| CookieBanner abajo a la derecha por defecto, también en las webs que lo fijaban a la izquierda | `CookieBanner.tsx`, almibar, almibar-taller, vertice, ficha del catálogo | petición del 21-10 |

**Comprobación visual.** 30 páginas: todas al 0,000 % salvo las que ya tienen ruido propio entre dos pasadas de la base
(travesía 7–11 %, kernel-log ~1,5 %, almíbar y silo ~0,2 %), que quedan dentro de ese ruido. **th-faceta** da 4,555 % en
algunas secuencias: la base hace exactamente lo mismo (estudio → faro → foro → Faceta). Es una inestabilidad previa de su
coreografía por scroll, que depende de la temporización; queda en §7.

## 2. Fusionar, extraer, mantener o atomizar: el criterio

- **Fusionar** (una API absorbe a la otra) solo si la variante extra cuesta **< ~1–2 KB min** y no trae dependencias. La API
  absorbida queda como alias.
- **Extraer** (hook o utilidad en `lib/`) cuando dos o más componentes repiten la misma mecánica: coste cero o negativo.
- **Mantener** cuando el parecido es de nombre y no de código, o cuando fusionar volvería cliente un componente de servidor.
  Por ejemplo, Table (servidor, 10 usos) dentro de DataTable (cliente) haría pagar JS a diez páginas.
- **Atomizar** cuando una variante trae una **dependencia pesada o ≥ 3 KB** que la mayoría no usa. El import y las props no
  cambian: la parte pesada va en un fragmento diferido o en una isla cliente dentro de un componente de servidor.

## 3. Redundancias por familia

### Texto y movimiento
| Solape | Decisión |
|---|---|
| `matchMedia("(prefers-reduced-motion…)")` a mano en 24 componentes | **Hecho** (§1) |
| Fórmula de sección fijada ×4, `clamp01` ×4 | **Hecho** (`pinProgress`, `clamp01` común) |
| Bucle scroll + resize + rAF propio en LineDraw (calcula también fuera de pantalla) y Reveal (escucha en captura) | Extraer: `trackScroll(el, cb, { capture })` |
| IntersectionObserver de «lanzar al entrar» ×4 (SplitText, Reveal, LineDraw, StatCounter); solo Reveal muestra lo que ya quedó por encima (recarga a mitad, `#ancla`) | Extraer `observeInView()` con el caso «por encima» de Reveal; SplitText y LineDraw lo ganan |
| `Reveal split` frente a SplitText | Mantener; marcar `split` como `@deprecated` (solo lo usa el catálogo) |
| ScrambleText, SceneFlash: GSAP para efectos triviales | Reescribir sin GSAP con la misma API (rAF y WAAPI); revisar a ojo Cyberpunk, Folio y Mycel |
| Typewriter / TerminalTyper | Mantener: sin código común relevante |
| **Presence** (432 líneas, 13 efectos y GSAP en un bloque; 0 usos en demos) | Atomizar: `PresenceCore` + efectos en `lib/ui/presence/*`, con un registro para la API actual |

### Fondos, canvas, 3D, cursores
| Solape | Decisión |
|---|---|
| Bucle rAF «solo en pantalla y con pestaña visible» ×4 (GradientField, LogoCoin, AsciiCard, AmbientLight, que además no pausa); **TextmodeBackground no pausa nunca** (va contra guía §8) | Extraer `runWhileVisible(el, tick, { fps })` en `lib/ui/loop.ts` |
| `Pacer` de RetroCanvas y `Ticker` de Logo3D (con `fps=0` hacen cosas opuestas); el tope de densidad `coarse ? 1.5 : 2` ×4 | Extraer en `lib/retro3d/pacer.tsx` (vive en el fragmento de three) |
| Inclinación + brillo al puntero casi idénticos en HoverFX y AsciiCard; Spotlight recalcula `--mx/--my` | Extraer `attachPointerVars` y `attachTilt` |
| RetroCanvas sin `GLBoundary`/`hasWebGL` (sin versión plana si falla WebGL) | Envolverlo como los otros cinco componentes WebGL |
| AsciiBackground y TextmodeBackground importan **todas** las escenas (≈55 KB y ≈70 KB de fuente) aunque pinten una | Atomizar: `painterLoaders`/`load()` diferidos. `start()` ya es asíncrono, pero hay dos llamadas síncronas (`AsciiBackground.tsx:214`, `:251`) que reordenar |
| CustomCursor / GlyphCursor | Mantener: alcance y semántica distintos; la curva de GSAP es parte de la estética |
| GridBackground, CellGrid, BlueprintFrame, CrtOverlay frente a RetroFX, LogoCoin frente a Logo3D | Mantener: papel distinto, casi todo CSS y de servidor |

### Secciones y tarjetas
| Solape | Decisión |
|---|---|
| Swiper estático en seis secciones | **Hecho** (`CarouselLazy`) |
| LogoCloud `layout="ticker"` (Swiper) frente a Marquee (CSS) | Fusionar: el ticker en CSS; revisar Faceta, que es su único uso |
| Iniciales ×5 (Avatar, ArticleHeader, BlogCard, TeamSection, Testimonial); estrellas ×2 (Testimonial enteras, TestimonialSection parciales) | Extraer `lib/ui/initials.ts` y un `RatingStars` de servidor |
| SectionHeader siempre pinta `<h2>` aunque llegue vacío; no acepta `headingLevel` | Arreglar: hay webs con `title=""`, así que comparar capturas antes |
| Callout / Alert, Table / DataTable / MetaTable, Footer / BigFooter, Timeline / Stepper, Hero / CrossfadeHero | Mantener |
| **TestimonialSection y PricingSection**: cliente enteras por el filtro, «Ver más», el carrusel o el selector anual | Atomizar: envoltorio de servidor + isla cliente solo si hay `distribution`, `pageSize`, `layout="carousel"` o precio anual. Sin esas props, 0 KB de JS |
| StatsSection siempre ASCII con JS | `display="plain"` de servidor (además pinta bien «,9 %», que la fuente bitmap no tiene) |
| OpeningHours y MenuList hidratan enteras | Tabla de servidor + islas («abierto ahora», filtro de alérgenos) |

### Navegación, overlays, formularios, medios
| Solape | Decisión |
|---|---|
| Iconos Phosphor con los seis pesos | **Hecho** |
| **Pixelarticons siempre cargados**: `Icon.tsx` importa los 119 (≈11,6 KB gz) aunque la web use Phosphor o Lucide | Atomizar con cuidado: el pixel art es el valor por defecto sin `IconSet`; un periodo con los dos caminos |
| Trampa de foco + Escape + bloqueo de scroll ×4 (Modal, CartDrawer, FullscreenMenu, CommandPalette); **el cajón móvil y la paleta de NavBar tienen `aria-modal` sin trampa ni bloqueo**; Drawer solo cierra con Escape | Extraer `useModalFocus()`; corrige NavBar y Drawer |
| Portal con tokens (`themeSnapshot` + `createPortal`) ×6 | Extraer `<ThemedPortal>`. Además, el snapshot no copia `--font-accent`, `--glow`, `--legibility-ts` ni `--sel-*` |
| Cerrar al pulsar fuera ×3 (NavBar, Select, Dropdown); Select y Dropdown no cierran con Escape; Dropdown no tiene `onSelect` | Extraer `useDismiss()` (Escape incluido); añadir `onSelect` |
| **NavBar** (777 líneas) lleva su propia paleta y su buscador (~3,5 KB) que usan 6 de 12 páginas; el resto de modos son clases CSS o < 1 KB | Atomizar solo la búsqueda: `CommandPalette` diferida y controlada. `sticky`/`scrollFx` no los usa nadie |
| RadioGroup (`<button role="radio">`, sin flechas ni `name`) frente a OptionPicker (inputs nativos) | Fusionar por dentro: RadioGroup pinta inputs nativos sin cambiar su API |
| Etiqueta, ayuda y error solo en TextField; ningún otro campo acepta `name` (no entran en el `FormData` de ContactForm) | Extraer `<FieldShell>`; añadir `name`, `hint` e `intent` opcionales |
| AudioPlayer: el dock (arrastre, portal, `localStorage`; ~3–4 KB) solo lo usa Silo | Atomizar: `AudioDock` diferido si `dock !== "none"` |
| AudioPlayer / VideoPlayer | Mantener; compartir `formatTime` |

## 4. Atomizar: forma común

El patrón sirve igual para TestimonialSection, PricingSection, NavBar, AudioPlayer, Presence y los fondos:

```tsx
// Componente.tsx — mismo nombre, mismas props
export default function Seccion(props) {
  const datos = parsear(props);                       // servidor: SectionHeader, tarjetas, resumen…
  if (!necesitaInteraccion(props)) return <Rejilla {...datos} />;  // 0 KB de JS
  return <SeccionInteractiva {...datos} />;           // isla "use client", o lazy() de la parte pesada
}
```

- **La API pública no cambia**: el usuario del kit no elige entre `X` y `XLite`.
- **La parte pesada se renderiza igual en servidor** (`lazy` + `Suspense` se resuelve en el prerender). En cliente se hidrata
  cuando llega el fragmento. El CSS de esa parte va estático para que no haya un instante sin estilos.
- **Respaldo del mismo tamaño** en una navegación en cliente (CarouselLazy pinta la rejilla), para no mover la maquetación.

## 5. CSS y fuentes (siguiente palanca)

- **Todo el CSS va a todas las páginas**: `app/layout.tsx` importa `kit.css`, que encadena 12 parciales (≈268 KB min, 48,6 KB
  gz). Ningún componente importa su CSS, salvo Swiper.
- **Fuentes**: `fontVariables` pone las 66 familias en `<html>`. `preload:false` evita bajar los woff2, pero las 449 reglas
  `@font-face` (~207 KB min, ~50 KB gz) viajan igual. En la portada pesa más el CSS de fuentes que el del kit. **Propuesta**:
  `coreFontVariables` (las del tema neutro y las variantes) y conjuntos por guía o web; el catálogo y `/guias` cargan todas.
  Ahorro estimado ~45 KB gz por página. Hay que comprobar con capturas cada web, porque una fuente que falte cae al respaldo.
- **Partir `ui-kit.css` por tramos contiguos sin reordenar**: `tokens.css`, `base.css` (sistema `--s-*`, superficie, intent,
  foco), `c/<Componente>.css` por cada cabecera `---------- X ----------` y los retoques de dotmatrix al final. `kit.css` los
  importa en el mismo orden, así que la cascada no cambia. **Sin `@layer`**: las capas pierden contra el CSS sin capa de las
  webs y cambiaría lo que hoy gana por orden.
- **Paquete**: `trama-ui/styles/ui-kit.css` cae hoy en el patrón `"./*"` y no resuelve. Añadir `"./styles/*"` y un
  `kit:css -- --only Button,Hero` que use `closure()`.
- **Duplicados**: 67 bloques idénticos (~7 KB), sobre todo el anillo de foco (`outline: 2px solid var(--acc)` ×32): mejor
  una variable `--focus-ring`. Además, 231 reglas `.ui-s--<variante>` de retoque por componente (24 KB, 16 % de `ui-kit.css`):
  con tres o cuatro variables más en la capa de variante (`--s-sel-bg`, `--s-sel-fg`, `--s-mark`, `--s-ctrl-r`) caería buena
  parte.
- **Fronteras**: `.ui-center*`, `.ui-sample`, `.ui-icongal*`, `.ui-sheet*` y `.ui-stage` son del catálogo y se publican en
  npm; van a `components/playground/`. No se han encontrado clases muertas: las 312 que solo aparecen por plantilla son
  dinámicas.

## 6. Construcción de temas

### 6.1 Estado
- **`TokenSet`** (`lib/ui/tokens.ts`): 7 colores, `r`, `font`, `display`, `accentFont` y `glow`; 9 temas. `tokensToStyle`
  deriva `--glow` y `--legibility-ts`. `card` y `ln` son casi siempre `fg` con alfa (0,035–0,08 y 0,09–0,22), y `acc2 = fg`
  en cuatro temas. `kit.css` repite `neutralTokens` a mano.
- **`ThemeDef`** (`lib/themes/themes.ts`, landings `th-*`): `palette {muted, accent, line}`, `cardStyle` y `radius`, que
  `lib/catalog/presets.ts` traduce a `TokenSet`.
- **`StyleGuide`** (`lib/ui/guides.ts`, en `main` desde la ronda 8): tema + `type`, `space`, `surface` y `motion` como `--g-*`,
  que solo leen las clases `ui-g-*`.
- **Lo que cada web resuelve a mano** (31 hojas, 184 KB): 117 `font-size: clamp()` con 102 valores distintos, `--st-max` y
  `--st-gutter` definidos 12 veces, 0 usos de `--ease-*`/`--dur-*` y curvas fijas. Dentro del kit: 69 tamaños de letra, 60
  duraciones, 8 `cubic-bezier` y 51 radios distintos.

### 6.2 Lo que dicen las investigaciones (constantes para tokens)
- **Color** (docs 13 §5, 16 §2): dos tintas (97 de 114 SOTD); el oscuro no es negro (`#0A`–`#1A`, teñido) y el claro es hueso;
  el texto secundario es la misma tinta con alfa; el acento de un tema claro no puede ser el del oscuro; AA es obligatorio
  (Ley 11/2023, doc 11). El acento más justo de los temas actuales es **piscina, 4,12:1**.
- **Tipo** (16 §2, 06 C8): dos escalones de titular (marca 12–18 vw y titular 3–8 vw); peso 300–500; interlineado del
  titular 0,9–1; tracking de 0 a −3 %; texto de 14–16 px a 1,3–1,5; etiquetas de 10–13 px en mayúsculas a +2–3 %; medida de
  15–33 em.
- **Espacio** (16 §2): margen lateral de 16–24 px, 12 columnas con 10–24 px de separación, cabecera de 38–64 px.
- **Superficies** (16 §2, 07 §1): ≤ 2 sombras, línea de 1 px como estructura, radio 0 o 2–8 px más píldora para lo accionable.
- **Movimiento** (16 §2, 11 §2): microinteracciones de 0,2–0,6 s con `cubic-bezier(.4,0,.2,1)` o expo.out; revelados de
  0,8–1,2 s con stagger de 0,04–0,1 s por palabra; página de 0,6–1 s; presupuesto de movimiento por sector (niveles 0–3).
- **Doc 17 §8** (Almíbar en tres direcciones) demuestra el modelo: el mismo contenido con tres guías y tres niveles de
  movimiento.

### 6.3 Modelo propuesto: un emisor, tres capas
1. **Primitivas = el tema como dato.** `TokenSet` crece con grupos opcionales, que son exactamente los de `StyleGuide`: `type`,
   `space`, `surface`, `motion` e `image` (filtro, mezcla, grano). Una guía *es* un `TokenSet` completo más composiciones y
   relatos. Los grupos de `StyleGuide` se mueven al tema, y `guideToStyle` llama a `tokensToStyle`.
2. **Semánticas**, las que leen los componentes: `--fs-brand --fs-h1 --fs-h2 --fs-body --fs-label`, `--lh-*`, `--ls-*`,
   `--space-margin --space-gutter --space-section --space-max`, `--r --r-sm --r-pill`,
   `--dur-fast --dur-reveal --dur-page --ease-out --ease-reveal --stagger`, `--focus-ring`, `--grain`, además de las de hoy
   (`--ok`… `--glow` `--legibility-ts` `--sel-*`). Las `--g-*` actuales quedan como alias durante la transición.
3. **Por componente**: `--s-*` (variante) y las locales (`--nav-px`, `--split-dur`…), cada una con respaldo en la semántica.

**Compatibilidad, la clave.** Cada lectura nueva nace con su valor actual como respaldo literal:
`font-size: var(--fs-label, 12px)`, `transition: opacity var(--dur-fast, .25s) var(--ease-out)`. `tokensToStyle` solo emite
los grupos que el tema define. Los 9 temas actuales no definen ninguno, así que no cambia un píxel, y se puede migrar regla a
regla con la comparación de capturas de esta ronda (`scratchpad/pw/capturas.mjs` → script del repo).

**Temas como datos que generan CSS.** `npm run themes:css` genera, desde `TOKEN_THEMES` y `STYLE_GUIDES`, el `:root` de
`kit.css` (que deja de copiarse a mano) y un `styles/themes.css` con `[data-theme="…"]`, para usar un tema sin JS. El mismo
script valida el contraste: fg/bg y mut/bg ≥ 4,5, acc/bg ≥ 3, y el texto del botón primario (bg sobre acc) ≥ 4,5. Hoy
saltaría piscina. `ThemeDef` se reescribe como `TokenSet` + `variant` y desaparece el traductor de `presets.ts`.
`themeSnapshot` y `useTokens` leen una lista común de nombres exportada desde `tokens.ts`.

**Las webs** (`almibar`, `barro`, `foro`… con `{...editorialTokens, …}`) pasan a ser **guía + overrides**, y su `--st-max`
y sus `clamp()` dejan de escribirse a mano.

## 7. Plan

| Fase | Contenido | Riesgo visual |
|---|---|---|
| **Hecha** | §1 | nulo (capturas) |
| 1 | Fuentes por conjunto; CSS partido por tramos sin reordenar; export `./styles/*`; `--focus-ring` | nulo / bajo |
| 2 | `useModalFocus`, `ThemedPortal`, `useDismiss`, `FieldShell` (accesibilidad de NavBar, Drawer, Select y Dropdown); `runWhileVisible` (pausa de TextmodeBackground y AmbientLight); `trackScroll({capture})`, `observeInView` | bajo |
| 3 | Islas: TestimonialSection, PricingSection, StatsSection `plain`, OpeningHours/MenuList, búsqueda de NavBar, AudioDock; escenas diferidas de AsciiBackground y TextmodeBackground | bajo-medio |
| 4 | Tokens semánticos con respaldo literal, `themes:css` con validación de contraste, `StyleGuide` sobre `TokenSet`; migrar regla a regla | medio, controlado con capturas |
| 5 | ScrambleText y SceneFlash sin GSAP, ticker de LogoCloud en CSS, Pixelarticons opcional, Presence atomizado | medio: revisar a ojo Cyberpunk, Folio, Mycel y Faceta |

**Pendiente aparte**: th-faceta deja paneles sin revelar en algunas secuencias de navegación, también en la base (§1). Hay
que revisar su coreografía `data-blk` (probablemente un observer que no se reengancha si la página carga desplazada o con
la caché caliente).
