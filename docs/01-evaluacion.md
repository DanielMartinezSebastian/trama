# Evaluación e historial de decisiones

> Registro cronológico: cada apartado describe el estado **en su fecha** (los conteos de demos y componentes son
> los de entonces). Estado actual: [README](./README.md) y [CATALOG.md](./CATALOG.md).

Punto de partida antes de crear la sección de componentes. Los números salen del propio repositorio
(`app/`, `components/`, `lib/`: ~6.500 líneas de TS/TSX/CSS).

## 1. Qué hay

| Familia | Demos | Motor principal | Dónde vive |
|---|---|---|---|
| `textmode` | 10 | textmode.js (celdas de rejilla) | `lib/sketches/*.ts` |
| `asciify` | 15 | asciify-engine Studio y core | `lib/asciify/painters.ts`, `registry.ts` |
| `text` | 15 | textmode.js, asciify-engine o ambas | `lib/sketches/text-*.ts`, `lib/text/*` |
| `scroll` | 10 | GSAP ScrollTrigger + cualquiera de los dos | `lib/sketches/scroll-*.ts`, `components/ScrollStage.tsx` |
| `landing` | 6 | GSAP + asciify-engine + textmode.js | `components/ThemedLanding.tsx`, `lib/themes/themes.ts` |

Total: **56 demos** servidas por una sola ruta dinámica (`/demo/[slug]`) que elige el componente de render
según `demo.render` y `demo.family`.

## 2. Patrones que ya funcionan (y hay que conservar)

1. **Datos separados de la vista.** `lib/demos*.ts` y `lib/themes/themes.ts` son datos puros: sirven a
   servidor y cliente, la galería se genera sola y añadir una demo es añadir una entrada.
2. **Un contrato de "fondo".** Todo fondo es una función `(ctx, w, h, t, pointer) => void` (painters de
   asciify) o `(t: Textmodifier) => void` (sketches de textmode.js). El puntero se normaliza y, sin puntero
   real, vaga solo (`createPointer` / `createPointerTracker`): los fondos nunca se ven muertos en móvil.
3. **Tokens de color por CSS variables** en las landings (`--bg --fg --mut --acc --acc2 --card --ln --r`).
   Seis temas distintos comparten el mismo CSS de cards, títulos y botones.
4. **Variantes por dato, no por componente.** `cardStyle: glass | solid | outline`, `reveal: wipe | rise |
   dissolve`, `flash: sweep | iris | slices` cambian el aspecto sin duplicar código.
5. **Limpieza sistemática.** Cada efecto registra su cleanup (`cleanups[]`, `gsap.context().revert()`,
   `destroy()` de la librería) y los imports pesados son dinámicos, así que nada rompe el SSR.
6. **Sin estado oculto en el DOM.** El texto del usuario y el scroll se leen en cada fotograma desde un
   store (`textStore`, `scrollState`); teclear o desplazar no remonta nada.

## 3. Problemas detectados

| # | Problema | Impacto | Evidencia |
|---|---|---|---|
| P1 | **Acoplamiento a singletons globales** (`textStore`, `scrollState`). 26 módulos los importan. | Un componente no se puede usar dos veces con datos distintos, ni probar aislado. | `grep textStore\|scrollState` |
| P2 | **Componentes atados a la ventana.** `TextmodeCanvas`, `AsciifyCanvas` miden `window.innerWidth` (11 usos) y son `position: fixed`. | No se pueden colocar dentro de una card o de un panel. | `components/*Canvas.tsx` |
| P3 | **Lógica de card duplicada/embebida.** El efecto de card (fondo ASCII, disolución, tilt, scramble) vive dentro de un `useEffect` de 250 líneas en `ThemedLanding`. | No es reutilizable fuera de la landing. | `ThemedLanding.tsx` |
| P4 | **Registros que mezclan datos y funciones** (`asciify/registry.ts` incluye hooks `scroll`). | Ya no es serializable; el servidor no puede leerlo. | `registry.ts` |
| P5 | **Props sin esquema.** Cada demo se configura editando código. | Iterar exige tocar archivos. | — |
| P6 | **Sin pruebas automáticas.** Solo `tsc` y `next build`; lo visual se verificó a mano. | Regresiones silenciosas. | — |
| P7 | **Painters "con progreso" leen `scrollState.p` global.** | Fuera del scroll no hay forma de fijar el progreso. | `theme-painters.ts` |
| P8 | **Estilos repartidos** entre `globals.css` y `landings.css` con prefijos distintos (`.card`, `.tcard`, `.tl__`). | Costoso mantener la coherencia. | `app/*.css` |

## 4. Decisiones que se derivan

- **No reescribir las 56 demos.** Funcionan y son datos + sketches. La deuda P1/P2/P3 se paga
  **extrayendo componentes nuevos** con props explícitas y sin globales, y dejando las demos como
  consumidoras de cara a una migración gradual.
- **Nuevo espacio `components/ui/`** con prefijo CSS `ui-`, consumiendo los mismos tokens que las landings.
- **Un catálogo tipado** (`lib/catalog/catalog.tsx`) con esquema de props por componente: de él salen la
  vista previa en tiempo real, el panel de controles, los filtros y el código de ejemplo (resuelve P5).
- **Para P7** los componentes de fondo aceptan `progress` (0–1) y lo publican en `scrollState.p` solo mientras
  están montados. Es un compromiso consciente y queda documentado; la salida limpia sería pasar el progreso
  a los painters como argumento (siguiente paso).

## 5. Lecciones técnicas de las librerías (verificadas)

**textmode.js 0.18**
- Con un `canvas` propio ignora `width/height`: hay que fijar `canvas.width/height` antes de `create()`.
- `t.grid` es `undefined` hasta el primer fotograma: inicializar estado en el primer `draw`, no en el setup.
- Las celdas son cuadradas (`cellWidth == cellHeight == fontSize`), pero se usa `aspect(t)` por si cambia la fuente.
- Sin `t.background()` o `t.clear()` el fotograma se acumula. `t.clear()` deja el canvas transparente.
- Coordenadas centradas en (0,0); `t.mouse` es `±Infinity` fuera del lienzo.

**asciify-engine 4.1**
- Los fondos procedurales **ya no vienen en el paquete** (son plantillas descargables); aquí se generan con
  canvas 2D y se pasan como fuente.
- `mountStudioMedia(canvas, media, opts)` admite un "medio" propio (`frame(time)` devuelve el canvas). Pausa
  en pestañas ocultas y con movimiento reducido.
- Los hover de `/core` (spotlight, magnify, repel, glow, colorShift, attract, shatter, trail, glitchText) y los de
  `/studio` (trail, water, contour, dissolve, silk, vortex) son **conjuntos distintos**.
- `createStudioText` devuelve un canvas con fondo `#080808`: hay que llevarlo a negro puro o aparece una rejilla de puntos.
- `renderTextBackground`, `asciifyText` (fuente 7×7) y `createStudioText` (21 fuentes FIGlet) resuelven texto sin imágenes.

**GSAP 3.15** — ScrollTrigger, SplitText y ScrambleText son gratuitos. `SplitText` sobre un nodo controlado por React
rompe la hidratación: no trocear texto editable. Desactivar `history.scrollRestoration` en páginas de scroll.

**Next.js 16** — con `dynamicParams = false` hay que reiniciar el servidor al añadir slugs. Con un store externo,
usar `useSyncExternalStore` con snapshot de servidor para no romper la hidratación.

## 6. Cómo se verificó (y sus límites)

- `tsc --noEmit` y `next build` en cada entrega.
- Capturas en Chrome. Las pestañas ocultas congelan `requestAnimationFrame`: se forzaron fotogramas
  (`redraw`, `gsap.ticker.tick`) y la visibilidad. Por eso hay efectos comprobados en fotogramas sueltos y no en
  movimiento fluido.
- Errores típicos evitados: no lanzar `next dev | head` (el pipe cerrado mata el servidor); en bash, no pegar
  bloques grandes con `heredoc` y comillas mezcladas (usar la herramienta de escritura de archivos).

## 7. Riesgos abiertos

1. Sin pruebas visuales automatizadas (P6).
2. Rendimiento en móviles de gama baja no medido (fondos Studio a 60 fps con bloom).
3. Migrar `ThemedLanding` para que use `AsciiCard` y demás componentes de `ui/` (P3) queda como siguiente paso.

## 8. Actualización: ampliación del kit

Tras la primera versión del catálogo se detectaron tres carencias, ya resueltas:

| Carencia | Solución |
|---|---|
| Los selectores de tema y color no llegaban a todos los componentes (fondos de escena con colores fijos; canvas que leían los tokens una sola vez). | Guía §2.1: `palette` para fondos (CSS `mix-blend-mode`), `useTokens` para canvas y `var()` en DOM. Panel de tokens completo en el catálogo. |
| Cada estilo tenía pocos componentes y con variantes distintas por componente. | Sistema de estilos `--s-*` (guía §2.2): siete variantes definidas una vez y soportadas por todos los componentes con `variant`. |
| Faltaban categorías completas (formularios, navegación, feedback) y opciones en los componentes existentes. | 36 componentes en 9 categorías (antes 11 en 6); `AsciiCard`, los fondos, `Marquee`, `StatCounter`… ganan entre 4 y 12 props nuevas. |

Riesgos que siguen abiertos: sin pruebas visuales automatizadas y las escenas «con progreso» aún dependen de `scrollState`.

## 9. Actualización: entrada/salida y hover para todo el catálogo

Se pidió que **todos** los componentes pudieran tener animación de entrada/salida y efectos de hover. Duplicar esa
lógica en 36+ componentes habría sido justo el tipo de deuda que este documento desaconseja (P1/P3). En su lugar:

- **Dos envoltorios genéricos** (`Presence`, ya existente con 13 efectos; `HoverFX`, nuevo, con 9 efectos) que
  aceptan cualquier `children` — ver guía §6.1.
- **`fill` en ambos**: modo `position: absolute; inset: 0` para envolver secciones enteras o demos cuyo render ya
  usa `position: absolute` (`.ui-center`, fondos), sin colapsar a tamaño 0. Sin este modo, envolver la salida de la
  mayoría de las entradas del catálogo (casi todas devuelven `.ui-center`, que es `position:absolute`) habría roto
  el layout — detectado y corregido antes de integrarlo, no después.
- **Botón «FX» global** en `/componentes`: envuelve el componente que se está viendo (y cada celda del comparador)
  con ambos, en caliente. Da la «posibilidad de usar» pedida a los 38 componentes sin tocar ninguno de ellos,
  excepto la categoría `fondos` (ya ocupa todo el escenario por sí misma; envolverla no aporta nada y se excluye
  explícitamente, con aviso en el propio panel).

Verificado en Chrome: `HoverFX` con efecto `glow` (brillo que sigue al puntero) en su demo independiente; el panel
FX global aplicando `Presence` (lluvia de glifos, en bucle) + `HoverFX` (glow) sobre una tarjeta de precios sin
romper el layout; y la exclusión de `fondos` (el aviso cambia de texto y la escena se renderiza sin alteraciones).
`tsc --noEmit` y `next build` limpios.

## 10. Actualización: ver cada componente "en caso real"

Se pidió poder probar cualquier componente "como se vería en un caso real", no solo aislado en un escenario vacío.
En vez de una maqueta por componente (36+ que mantener y que se desincronizan), se construyó **una escena realista
por categoría** (`lib/catalog/scenarios.tsx`, guía §6.2) que reutiliza otras piezas del kit como decorado estático y
coloca ahí al componente que se está editando, con sus props en vivo — mismo principio de composición que `Presence`
/ `HoverFX`, aplicado ahora a "dónde se ve", no a "cómo entra o reacciona al hover".

Dos problemas de layout aparecieron y se corrigieron antes de dar la función por terminada:

1. **Huecos colapsados o descentrados.** La mayoría de `render()` del catálogo devuelven `.ui-center`
   (`position: absolute`), así que un hueco sin altura propia no los aloja bien. Solución: el hueco reutiliza
   `entry.stageHeight` (la altura ya calibrada de la vista aislada) en vez de un valor inventado por escena.
2. **Solape con la demo que el propio componente ya trae.** El hero de "fondos" añadía su propio titular sobre el
   fondo, que colisionaba con la tarjeta de ejemplo (`.ui-sample`) que `AsciiBackground`/`TextmodeBackground` ya
   superponen para probar legibilidad. Verificado con las coordenadas reales del DOM (`getBoundingClientRect`), no
   solo a ojo; se ocultó `.ui-sample` en el contexto de esa escena por CSS.

Verificado en Chrome: fondos (hero con navegación, sin solape tras la corrección), tarjetas (grid de 3 columnas),
navegación con Acordeón (el caso de mayor riesgo de desbordamiento vertical, sin recortes), formularios
(RangeSlider dentro de un alta de cuenta creíble) y datos (Table dentro de un panel de control con widgets
laterales). Sin errores de consola. `tsc --noEmit` y `next build` limpios.

## 11. Actualización: tipografía — Google por defecto, local si hace falta

Hasta ahora todas las fuentes del kit eran *stacks* de sistema (Trebuchet, Georgia, Segoe UI…): funcional pero
genérico, dos proyectos con temas distintos podían acabar viéndose tipográficamente iguales. Se sustituyó por un
catálogo curado de 8 fuentes de Google (Inter, Manrope, Space Grotesk, Syne, Fraunces, Instrument Serif, JetBrains
Mono, Space Mono) cargadas con `next/font/google` (guía §2.3): se autoalojan en build, cero petición a Google en
runtime, cero salto de layout.

Se propagó en tres sitios sin tocar ningún componente (todos leen `font-family` vía tokens, nunca una fuente a
pelo): el `--mono` global del sitio entero pasa a JetBrains Mono, el selector "Tipografía" del panel de tokens gana
8 opciones nuevas además de los dos *fallback* de sistema, y los 6 temas de landing migran cada uno a la fuente que
le pega a su estética (p. ej. Fraunces para Grano Tostadores, Space Mono para Pixel Club). La variante `retro`
(`--s-ff`) también sube de Courier New del sistema a Space Mono, con Courier como *fallback*.

Verificado: `tsc --noEmit` y `next build` limpios (el build descarga y autoaloja las 8 fuentes sin errores); en
Chrome, el selector de tokens aplica una fuente en vivo sobre el escenario (`getComputedStyle` confirma
`Fraunces, "Fraunces Fallback", Georgia, serif`) y la landing "Grano · café" resuelve su `font-family` de tema al
mismo valor, sin errores de consola.

Una fuente propia (de marca, con licencia) se añade con `next/font/local` en el mismo `lib/ui/fonts.ts`, sin tocar
componentes — documentado en la guía §2.3.

## 12. Actualización: componentes compuestos ("secciones")

El catálogo cubría piezas sueltas (un botón, una tarjeta, un campo) pero nada de lo que se pide al montar una
landing de verdad: un hero, un formulario de contacto, una sección de precios. Se añadió una décima categoría,
`secciones` (guía §11), con 8 bloques compuestos: `Hero`, `ContactForm`, `CTASection`, `FAQSection`, `StatsSection`,
`PricingSection`, `TestimonialSection`, `Footer` — 46 componentes en total (antes 38).

Ninguno reinventa lo que ya existía: `PricingSection` compone `SectionHeader` + `PricingCard`, `FAQSection` compone
`SectionHeader` + `Accordion`, etc. Dos ampliaciones pequeñas y no disruptivas hicieron falta como base, en vez de
crear componentes nuevos para ellas: `Button` ganó una prop `type` (`"submit"`, antes fijo a `"button"`) para que
`ContactForm` pudiera enviarse de forma nativa, y `TextField` ganó `name`/`multiline`/`rows` para dibujar un
`<textarea>` en vez de duplicar el componente como `Textarea`.

`ContactForm` gestiona su propio estado de envío (mensaje de éxito con opción de "enviar otro"); el envío real se
conecta con su prop `onSubmit`, que la vista aislada no necesita para demostrar el flujo completo. Las secciones con
listas (`PricingSection`, `TestimonialSection`, `StatsSection`) generan su grid desde una prop de texto con el mismo
patrón que `Accordion` (una entrada por línea, campos separados por `|`), no desde children — así siguen siendo
editables por el panel de props genérico del catálogo sin necesitar un tipo de prop nuevo.

**Bug encontrado y corregido durante la verificación**: los datos de ejemplo de `StatsSection` usaban «★» y «años»
como *sufijo* de una cifra — ese sufijo se dibuja con la fuente bitmap 7×7 de `asciifyText` (asciify-engine), que
solo cubre ASCII básico, y ambos carácteres salían corruptos en pantalla (verificado visualmente en Chrome, con
`zoom` sobre la cifra). Corregido moviendo la palabra a `label` (texto normal, sin conversión) y dejando el sufijo
solo con símbolos seguros (`+`, vacío); documentado como trampa conocida en la guía §10.

Verificado: `tsc --noEmit` y `next build` limpios; en Chrome, las 8 secciones en su vista aislada, el comparador de
7 estilos sobre `Hero`, y el flujo de envío completo de `ContactForm` (rellenar → enviar → mensaje de éxito →
«Enviar otro mensaje»), sin errores de consola.

**Bug reportado por el usuario y corregido después**: los campos de `ContactForm`/`TextField` se veían con una
"caja doble" — un `<input>` con su propio fondo y borde, anidado dentro de la píldora `.ui-field__box`. Diagnosticado
con `getComputedStyle` en Chrome: no era el navegador pintando su apariencia nativa (la primera hipótesis, descartada
tras añadir `appearance: none` sin cambio visible), sino una regla del propio panel del catálogo,
`.pg input[type="text"]` (`components/playground/playground.css`), demasiado amplia — alcanzaba, por descendencia genérica, cualquier
`<input type="text">` que un componente pintara en vivo dentro de `.pg__stage`, con más especificidad que
`.ui-field input`. Corregido acotando esa regla a las clases propias del panel (`.pg__search`, `.pg__theme`,
`.pg-field`), que nunca existen dentro de la vista en vivo de un componente. Documentado como trampa conocida en la
guía §10. Verificado en Chrome (`getComputedStyle` antes/después) y con `tsc --noEmit` + `next build` limpios.

**Segundo bug reportado por el usuario, corregido en dos pasadas**: en «Comparar los 7 estilos», las celdas con un
componente alto mostraban scroll interno (`ContactForm`, `PricingSection`, `FAQSection`…) porque `Playground.tsx`
topaba su alto a `Math.min(entry.stageHeight, 460)`. Primera corrección: quitar el tope (`entry.stageHeight` a
secas) — resolvió el caso vertical, verificado sobre `ContactForm` (580px) y `PricingSection` (640px, la más alta
del catálogo) sin overflow en ninguna de las 7 variantes.

El usuario señaló que seguía sin corregirse en `/componentes#navbar`: ahí el problema no era de alto sino de
**ancho** — `.pg__compare` colocaba cada variante en una columna de ~280px (`grid-template-columns: repeat(auto-fill,
minmax(280px, 1fr))`), y `NavBar` (marca + 5 enlaces + botón, pensado para ocupar toda la barra superior) no cabe en
280px por mucho que se le dé de alto; su propio `.ui-nav__links{overflow:auto}` (pensado para móvil) entraba en
juego y aparecía con scroll horizontal y contenido recortado por ambos lados. Ensanchar la columna a un número fijo
no habría sido una solución real: `PricingSection`, con su rejilla interna de 3 tarjetas, necesita aún más, y
siempre habría un componente futuro que no cupiese. Corrección de fondo: `.pg__compare` pasa de rejilla de columnas
a **una sola columna a ancho completo** — cada variante se apila en su propia fila, con el mismo ancho que ya
funciona en la vista aislada, en vez de encogerse a un tamaño de tarjeta que solo le sirve a los componentes
pequeños. Verificado con `scrollWidth`/`clientWidth` en Chrome: `NavBar` (7/7 variantes sin overflow) y
`PricingSection` (7/7, su rejilla de 3 columnas visible completa en vez de recortada). Documentado en la guía §10.
`tsc --noEmit` y `next build` limpios en ambas pasadas.

Un barrido adicional sobre ocho componentes más (`Testimonial`, `Table`, `AsciiCard`, `Accordion`, `FAQSection`,
`TestimonialSection`, `Hero`, `Footer`) no encontró ningún otro caso real, salvo una diferencia de 6px en la
variante `retro` de `Testimonial` (su borde y sombra de 3-4px extra) — imperceptible y no relacionada, no se tocó.

## 13. Actualización: overlays, formularios, navegación y más secciones (19 componentes)

Se pidió evaluar qué tipos de componente faltaban y "darle caña a todo" — construir el lote completo. El hueco más
claro era **overlays**: el catálogo no tenía ni un `Modal`, ni un `Toast`, ni un `Tooltip`. Se añadió una categoría
nueva (guía §12) y se completaron los huecos más pequeños de otras cuatro categorías, 65 componentes en total
(antes 46):

| Categoría | Añadidos |
|---|---|
| Overlays (nueva) | `Modal`, `Toast`, `Tooltip`, `Drawer` |
| Formularios | `Select`, `CheckboxGroup`, `RadioGroup`, `Stepper`, `OtpInput` |
| Navegación | `Breadcrumbs`, `Pagination`, `Dropdown` |
| Secciones | `FeatureGrid`, `TeamSection`, `LogoCloud`, `ArticlesSection` |
| Tarjetas / Datos / Feedback | `BlogCard`, `CodeBlock`, `Skeleton` |

**Decisiones destacadas** (desarrolladas en la guía §12–§13):

- **Toast sobre una librería consolidada (`sonner`)**, no reimplementado — instrucción explícita del usuario.
  Apilado, gestos táctiles, temporizador y accesibilidad los resuelve la librería; el kit solo le pone el aspecto
  propio (`unstyled: true` + clases `ui-toast*` que leen los mismos tokens y `--s-*`), con un `id` por instancia
  (`useId()` → `toasterId`) para que no se crucen varias a la vez (importa en «Comparar los 7 estilos»).
- **`Modal`/`Drawer` con `position: fixed`, sin `createPortal`** — escapan de cualquier `overflow` ancestro (incluido
  `.ui-center` y `.pg__cell` del propio catálogo) porque ningún contenedor del kit usa `transform`/`filter` (lo único
  que rompería ese escape). Verificado en Chrome con `getBoundingClientRect()`: el fondo cubre el viewport completo
  y el panel se centra respecto a él, no respecto al escenario donde vive el botón que lo abre.
- **`Select` es un botón + lista propia, no un `<select>` nativo** — un nativo no se puede reskinar por dentro (la
  lista abierta la pinta el sistema operativo); así tiene el mismo aspecto en los 7 estilos, abierto o cerrado.
  `Dropdown` (menú de acciones) sigue el mismo patrón.
- **Extensiones mínimas en vez de componentes nuevos**: `Button` ganó una prop `type` (`"submit"`, antes fijo a
  `"button"`) y `Alert` se renombró de "Aviso / toast" a "Aviso" para no confundirse con el `Toast` real, ahora que
  existe.

Verificado: `npm install sonner` sin conflictos de *peer dependencies* con React 19; `tsc --noEmit` y `next build`
limpios a la primera. En Chrome, sesión completa de pruebas sobre los 19 componentes nuevos: los 65 del catálogo
cargan sin errores de consola ni excepciones (barrido automatizado con listener de `error`/`unhandledrejection`),
y verificación interactiva específica de los casos de mayor riesgo — `Modal` (abre, `position:fixed` cubre el
viewport completo, cierra con Escape), `Toast` (dispara sobre `sonner`, clases y contenido correctos confirmados
por DOM), `Select` (abre, elige una opción, cierra), `Drawer` (abre con animación, ancla a la izquierda a todo el
alto), `CheckboxGroup`/`RadioGroup` (alternan estado, y su variante retro/terminal muestra `[x]`/`(•)` en texto),
`OtpInput` (el foco avanza solo al escribir) y `Pagination` (cambia de página). Sin errores en ningún caso.

## 14. Actualización: scrollbars personalizadas (66 componentes)

El usuario señaló un hueco que la revisión anterior no había cubierto: ninguna área con overflow del kit tenía una
barra de desplazamiento propia (la lista de `Select`, el `<pre>` de `CodeBlock`, el escenario `.ui-center`,
`Modal`/`Drawer`…), todas usaban la del sistema operativo. De paso se encontró que el único intento de scrollbar
personalizada que ya existía en el proyecto (`html.scrollable` en `app/globals.css`, para las páginas de demo de
scroll) solo funcionaba en Firefox — le faltaban las reglas `::-webkit-scrollbar-*`, así que en Chrome (el navegador
mayoritario) nunca se vio. Se corrigió también.

Resuelto en dos niveles (guía §14): una base neutra por tokens para lo que no vive dentro de una superficie con
estilo, y un tratamiento por cada uno de los 7 estilos (`--s-*`) para lo que sí — la barra de scroll pasa a ser una
pieza más del lenguaje visual de cada estilo, igual que el borde o la sombra. Se añadió `ScrollArea` (categoría
Interacción, 66º componente) para demostrarlo y darle un uso directo: una caja de contenido largo con altura fija,
pensada para un registro de cambios, comentarios o salida de terminal.

**Verificación**, con una particularidad: un pseudo-elemento como `::-webkit-scrollbar-thumb` no aparece en ninguna
captura del DOM ni en el árbol de accesibilidad, así que una revisión visual por capturas de pantalla no basta (y en
esta sesión la herramienta de zoom además falló varias veces con timeouts, un problema del entorno de pruebas, no
del código). Se verificó en su lugar con `getComputedStyle(el, "::-webkit-scrollbar-thumb")` en Chrome sobre las 7
variantes de `ScrollArea` en «Comparar los 7 estilos» — confirmando anchura, color, radio y sombra distintos en
cada una (10px translúcido en *glass*, 12px opaco en *solid*, 6px de acento sin radio en *outline*, 10px con
`box-shadow` de brillo en *neón*, 14px con pista oscura en *retro*, 8px cuadrado en *terminal*, 4px casi invisible
en *minimal*) — y sobre `CodeBlock`, confirmando que su `<pre>` interno hereda la barra de su categoría aunque él
mismo no lleve las clases de estilo (las lleva su contenedor `.ui-code`, y el selector con combinador descendiente
alcanza a los hijos). `tsc --noEmit` y `next build` limpios; sin errores de consola.

## 15. Actualización: una landing real construida con el kit (CIPHERGRID)

Se pidió un sitio de ejemplo que usara "todos los componentes aunque sea una landing", temática retrowave para un
producto de software ciberpunk inventado, con fondos reactivos al scroll, modal, mensajes y CTA — para la galería de
landings temáticas. Resultado: `components/landings/CyberpunkLanding.tsx`, demo `/demo/th-ciphergrid` ("CIPHERGRID"), una
landing de 300vh construida solo con `components/ui/` (no con el sistema bespoke de `ThemedLanding`), con prácticamente
todo el catálogo en una sola página — overlays, formulario multi-paso, panel de datos, precios, testimonios, equipo,
blog, FAQ, boletín y footer. Plumbing mínimo para encajarla en la galería existente: un nuevo `render: "kit"` en
`DemoMeta` (`lib/demos.ts`), una entrada en `lib/demos-kit-landing.ts` y una rama en `DemoViewer.tsx` que omite el
lienzo de fondo de siempre (`AsciifyCanvas`/`TextmodeCanvas`) porque la propia landing gestiona su fondo.

Construirla de verdad (no solo documentar el patrón) encontró y corrigió dos huecos reales en la **API** de
componentes ya existentes, no solo bugs de la página:

1. **`Modal` no se podía abrir desde fuera de sí mismo.** Solo pintaba su propio botón disparador y no avisaba de
   qué botón se había pulsado — imposible de conectar a "enviar un formulario → confirmar → hacer algo". Se le
   añadió un modo controlado opcional (`open` + `onOpenChange` + `onConfirm` + `onCancel`), retrocompatible: sin
   `open`, exactamente el mismo comportamiento de siempre.
2. **`Toast` se disparaba solo al montar**, a diferencia de `Modal`/`Drawer` (que ya exigían `playKey > 0`). Montar
   el componente solo para tener el `<Toaster>` listo (como hace falta aquí, para lanzar desde el `onConfirm` del
   modal) disparaba una notificación vacía de inmediato. Alineado con el mismo criterio, más `id` (para lanzar
   desde fuera en la misma instancia) y `showTrigger` (oculta su botón de demostración).

Dos bugs reales más, encontrados al verificar en Chrome (no solo mirando capturas):

- **Los marcadores que deciden qué fondo mostrar según el scroll llevaban `position: absolute; top: 0`** — los
  sacaba del flujo normal y los cinco acababan en el mismo punto, así que el fondo nunca cambiaba de la primera
  escena. Diagnosticado midiendo `getBoundingClientRect().top` de los cinco en Chrome (los cinco daban el mismo
  valor); corregido dejándolos como bloques normales del flujo, sin `position`.
- **Varios `SectionHeader` propios de la página no llevaban `subtitle`** y mostraban el subtítulo por defecto del
  componente — copy de la demo de surf del catálogo, en medio de una landing de cyberpunk. A diferencia de las
  "secciones" compuestas (`subtitle = ""` por defecto, a propósito), `SectionHeader` es un átomo con un valor por
  defecto pensado para su propia demo; usarlo directamente exige rellenar sus props de texto.

Verificado en Chrome con una sesión de scroll completa (no solo el primer pantallazo): las cinco escenas de fondo
cambian correctamente, las revelaciones por scroll (`Reveal trigger="inview"`) se disparan según toca, el flujo
completo formulario → `Modal` → confirmar → `Toast` funciona de punta a punta (confirmado por DOM y visualmente),
el `Drawer` del menú móvil abre y cierra bien. Sin errores de consola en toda la sesión (barrido con listener de
`error`/`unhandledrejection` instalado desde el principio). `tsc --noEmit` y `next build` limpios (61 páginas
estáticas, antes 60).

## 16. Actualización: mobile — desbordamiento y legibilidad sobre fondos

El usuario probó CIPHERGRID (y de paso el catálogo) en el móvil y reportó tres síntomas: componentes que se salen
de la pantalla, contenido no centrado y texto ilegible sobre el fondo. Los tres tenían la misma causa raíz en el
primer caso y una causa distinta, real, en el segundo — ninguno era un problema de "hay que forzar transparencia
u opacidad", como podría parecer a primera vista.

**Desbordamiento y descentrado (mismo bug).** Diagnosticado con un `<iframe>` de 375px apuntando a la misma
página — `resize_window` no cambia el viewport real en este entorno de pruebas (pantalla virtual fija), pero un
iframe sí tiene su propio viewport independiente para media queries y cálculos de `min-width: auto`. El `<body>`
medía 956px de ancho dentro de un viewport de 371px; el exceso quedaba invisible (`overflow-x: hidden` en
`html`/`body` ya lo recortaba, guía §14 — por eso "se salían de la pantalla" sin ni siquiera una barra de scroll
horizontal que lo delatase). Causa: los grids de tarjetas de las "secciones" compuestas (`.ui-feats__grid`,
`.ui-pricing__grid`, `.ui-testimonials__grid`, `.ui-team__grid`, `.ui-articles__grid`, y `.ui-sh` de
`SectionHeader`) son a su vez *items* de un grid exterior, y un grid-item no se encoge por debajo del ancho mínimo
de su propio contenido (`min-width: auto` por defecto) — como su contenido es OTRO grid con columnas
`minmax(220-240px, 1fr)`, su mínimo real es "nº de columnas × ese ancho", nunca menos. En pantallas anchas no se
nota (hay sitio de sobra); en un móvil, el grid interior nunca llegaba a colapsar a una columna. El "no centrado"
era un síntoma del mismo bug, no un problema aparte: contenido que se sale de su columna deja de estar centrado
por definición. Corregido con `min-width: 0` en los cinco `__grid` y en `.ui-sh` (guía §16). Verificado con la
misma técnica del iframe: 956px → 362px de ancho de `<body>` en un viewport de 371px, y visualmente — cada grid
de tarjetas pasa a una columna, centrada, legible — en la landing y en el catálogo (`PricingSection`,
`ArticlesSection`, `Tabla`, entre otros).

**Legibilidad sobre el fondo (bug real, no capricho de diseño).** Ni `SectionHeader`, ni `Hero` con
`backdrop="none"`, ni `LogoCloud`, ni `Divider`, ni `Typewriter` tenían ninguna protección de contraste — su
legibilidad dependía por completo de que lo que hubiera detrás fuera el `--bg` liso de un tema, y estos
componentes están explícitamente pensados para poder sentarse encima de un fondo de la categoría "Fondos"
(un fondo puede ser literalmente cualquier cosa, ese es su propósito). El usuario pidió, explícitamente, que
siguieran pudiendo ser transparentes (no quitarles esa capacidad) pero que fueran legibles *por defecto* salvo
ajuste deliberado. Se añadió `--legibility` (`components/ui/styles/ui-kit.css`, token en `:root`): un halo con el propio `--bg`
del tema vía `filter: drop-shadow(...)`. Se descartó `text-shadow` tras comprobar con `getComputedStyle` que
`text-shadow: var(--s-ts), <sombra>` invalida toda la declaración cuando `--s-ts` vale `"none"` (el caso de la
mayoría de los 7 estilos) — mezclar `none` con una sombra real en la misma lista no es válido, aunque a simple
vista pareciera que sí debería serlo. El halo es del mismo color que el fondo liso (invisible ahí, confirmado
visualmente en el catálogo: cero cambio) y se vuelve un contraste real en cuanto el fondo deja de ser liso
(confirmado en CIPHERGRID: halo visible alrededor del título del hero y de las marcas de `LogoCloud` sobre el
patrón braille del fondo). Quien quiera el look sin halo, a propósito, sobrescribe `--legibility: none` — sigue
siendo una elección explícita del proyecto, no el comportamiento por defecto.

`tsc --noEmit` y `next build` limpios tras ambos arreglos.

**El usuario probó el resultado y el primer arreglo de legibilidad no bastaba** ("tenemos un serio problema de
legibilidad") — tenía razón: una sola capa de `drop-shadow` ancho se perdía contra un fondo denso (escena "galaxy"
en braille), y el halo solo se había puesto en el texto suelto, no en las tarjetas con variante `outline`
(`FeatureGrid`, `TeamSection`) que también son transparentes (`--s-bg: transparent`) y dependen igual de lo que
haya detrás. Corregido de fondo, no con un parche: `--legibility` pasó a varias capas de radio pequeño (un trazo
casi sólido alrededor de cada glifo) y se aplicó **por estilo**, no por componente — `.ui-s--outline,
.ui-s--minimal { filter: var(--legibility); }`, las dos únicas variantes sin `--s-bg` real — así cubre cualquier
componente presente o futuro que use esos dos estilos, sin tener que acordarse de añadirlo cada vez. Verificado
antes/después sobre la escena más exigente del sitio: de "apenas legible" a nítido, confirmado visualmente y con
`getComputedStyle` (el filtro llega también a los descendientes que no llevan la clase de variante ellos mismos,
como cada pregunta de un `Accordion` dentro de un `FAQSection` en outline, porque `filter` compone el subárbol
entero). Guía §16 actualizada con el detalle completo. `tsc --noEmit` y `next build` limpios.

## 17. Actualización: más landings del kit, legibilidad revisada, fuentes pixel y pixel art

**Dos landings más con el kit** (además de CIPHERGRID), cada una con un fondo distinto y sin que el fondo tape
contenido: **MYCEL** (`components/landings/MycelLanding.tsx`, red de sensores orgánica: el héroe usa la escena `bloom` de
`AsciiBackground` con `progress` atado a la posición de esa sección — germina de verdad al hacer scroll —, y el
resto alterna `GridBackground` con los sketches `life` y `flow` de textmode.js; un aclarado radial
`.myc__bg::after` atenúa el fondo justo detrás de la columna de texto) y **FOLIO** (`components/landings/FolioLanding.tsx`,
la única de **tema claro**: fondos en patrones de papelería real —cuaderno, puntos, rayado de corrección— y
`NeonSign` en modo `pixel`, porque el modo `tube` mezcla con blanco y desaparece sobre papel). `DemoViewer` despacha
la landing «kit» por slug (`KIT_LANDINGS`).

**La legibilidad se revisó dos veces más, y este apartado sustituye el mecanismo descrito en §16.** (1) El usuario
rechazó el halo fuerte de varias capas («no es una solución limpia, mete fondos más sencillos»): se simplificaron
los fondos (celdas grandes, `dots`/`lines`, opacidades bajas) y el halo volvió a ser un toque ligero. (2) FOLIO,
el primer tema claro, destapó que `filter: drop-shadow()` sobre texto **emborrona los glifos** en Chromium por
pequeño que sea el radio (se comprobó anulando `--legibility` desde la consola: al desactivarlo el texto quedaba
nítido). Con texto claro sobre fondo oscuro no se nota, por eso el sistema pasó por dos rondas de revisión sin
que apareciera. Se pasó a `text-shadow` (`--legibility-ts`); lo que había obligado a usar `filter` —que
`text-shadow: var(--s-ts), …` se invalida si `--s-ts` vale `none`— se resolvió en la raíz haciendo que `--s-ts`
sea siempre un `<shadow>` válido (`0 0 transparent`). `outline` y `minimal` pasaron también a `text-shadow`
heredado. El token `--legibility` (filtro) se eliminó. Detalle y lecciones en la guía §16.

**Errores del kit que solo aparecieron al usar el kit en páginas reales** (guía §16): arte en `<pre>`
(`BitmapText`, `AsciiChart`, número grande de `StatCounter`) que empujaba la página en móvil; grid items y flex
items sin `min-width: 0` (`.ui-alert__body`, hijos de las columnas del panel). `TextmodeBackground` mide ahora su
tamaño al montarse en vez de depender solo del primer aviso del `ResizeObserver` (endurecimiento razonable, pero
**no** era la causa de la pantalla negra que se veía al saltar a más de ~9000 px de scroll: esa pantalla negra
salía igual en CIPHERGRID, sin tocar, así que es un artefacto del entorno de capturas — muchos canvas + salto de
scroll instantáneo —, no un fallo de las páginas).

**Tipografía Pixel.** Las 46 familias de Google Fonts › Appearance › Theme › Pixel se añadieron a
`lib/ui/fonts.ts` y a `FONT_PRESETS` («Pixel — …»), con `preload: false` para no cargar 46 precargas en todas las
páginas (guía §2.3).

**Pixel art: iconos, marcos y sprites.** Investigados los packs que existen (Pixelarticons, HackerNoon Pixel Icon
Library, NES.icons, Kenney «Pixel UI») y elegidos Pixelarticons (SVG que se tiñe con el tema, MIT) y Kenney
(CC0, marcos de 9 cortes y hoja de sprites). Nueva categoría `pixel` del catálogo con `Icon`, `PixelFrame` y
`Sprite`; los glifos de texto de `Button`, `FeatureGrid`, `Timeline` y `Footer` aceptan `icon:nombre`. Dos problemas
reales que solo se ven probando: rendijas de 1 px en el `border-image` con escala de pantalla fraccionaria
(110 %–150 %), tapadas con el color de relleno detrás del marco; y la legibilidad del contenido *dentro* de un
marco, resuelta sustituyendo la paleta del kit por una de tinta sobre papel dentro de `.ui-pframe` (guía §17).
`tsc --noEmit` y `next build` limpios.

## 18. Revisión: del catálogo a una librería reutilizable

Revisión pedida para que el kit sirva como librería de proyectos Next.js que agentes de IA puedan montar rápido, y que
se pueda iterar en cada proyecto y devolver las mejoras. Lo que faltaba no eran componentes, sino todo lo que rodea a
una librería:

| Problema | Solución |
|---|---|
| Sin control de versiones | Repositorio git; un commit por paso de esta revisión. |
| No se podía sacar el kit: CSS en `app/`, catálogo mezclado con `lib/ui/`, `tokens.ts` importando los temas de las landings | Kit = `components/ui/` (con `styles/kit.css` como único CSS) + `lib/ui/` + motores. Catálogo → `lib/catalog/`. Presets de temas fuera del kit. Landings → `components/landings/`. |
| Copiar a mano qué archivos hacen falta | `npm run kit:export` (cierre de dependencias, paquetes que faltan, `.kit.json`) y `npm run kit:pull` (trae cambios y componentes nuevos, detecta conflictos). Probado exportando `Hero`, `PricingSection`, `FAQSection` y `PixelFrame` a un Next vacío: `next build` limpio y render correcto con los tokens por defecto. |
| Un agente tenía que leer miles de líneas para saber qué hay | `docs/CATALOG.md` y `docs/catalog.json` generados desde el catálogo (imports, props, tipos, defaults, recetas de landings). |
| Documentación que se quedaba atrás (56 demos, 66 componentes, categorías sin listar) | `npm run catalog:check` valida catálogo ↔ archivos ↔ README y que los generados estén al día. |
| Dos vocabularios de tokens (`--muted/--line` en el sitio, `--mut/--ln` en el kit) | Uno solo. `kit.css` fija además un tema por defecto con `:where(:root)`. |
| `AsciiBackground` escribía `progress` en el `scrollState` global | El progreso se pasa al painter como argumento; dos fondos ya no se pisan. |
| Rutas duplicadas (`/minimal`, `/faceta`, `/geometria` y `/demo/th-*`), metadata «1000dvh» frente a 2000dvh reales | Redirecciones a `/demo/th-*`. |
| CSS de cada landing cargado en todas las páginas | Cada landing y el catálogo importan su CSS. |
| «Ver en caso real» anunciado para todo pero sin escena en galerías, overlays y pixel | Escenas añadidas. |
| Imports sin usar | Quitados; `noUnusedLocals`/`noUnusedParameters` activados. |

