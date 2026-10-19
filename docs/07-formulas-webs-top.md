# Fórmulas de webs top: qué se midió y dónde está en Trama

> Segunda ronda de investigación (19-10-2026). Cada web se abrió en un Chrome real, se hizo una captura en reposo y otra tras
> hacer scroll, y se midió con JavaScript (librerías cargadas, tipografía del titular, elementos fijos, fondos). Lo que sigue es
> **observado**; lo que no se pudo confirmar va marcado. Complementa el [índice de piezas](./06-indice-replicar-webs-premiadas.md).

## 1. Qué se vio en cada web

| Web (SOTD de octubre de 2026) | Tecnología medida | Fórmula distintiva | En Trama |
|---|---|---|---|
| [Heron AI](https://heronaiapp.com/) (Bearplus) | Webflow, GSAP 3.12.5, **Lenis**, un `<canvas>` | **Plano técnico**: marco de línea fina con regla de marcas y cruces «+», celdas con divisores continuos y discontinuos, etiquetas mono en mayúsculas, titulares gruesos en mayúsculas con tracking −2 %, **un solo acento naranja**, círculo naranja sobre dibujo de línea, módulo «Clientes» con flechas en celda, pestaña lateral fija | `BlueprintFrame`, `CellGrid`, `EdgeTab`, `blueprintTokens`, demo **Plano** |
| [LPAS](https://lpas.com/) | no se pudo sondear (la pestaña se congeló) | Foto a sangre; titular enorme en claro con un **botón-icono dentro de la frase**; microtextos repartidos en el eje del hero; píldora «Menu»; el hero se oscurece con el scroll y da paso a **columnas verticales de proyectos** | `CircleButton inline`, `ExpandingPanels`, demo **Arbor** |
| [OFFFForum](https://www.offforum.com/) | no sondeado | **Wordmark de borde a borde** en dos tipografías (geométrica negra + serif de remate) arriba y en el pie; hero a sangre con fotos que cambian y titular en serif mayúsculas con botón-píldora; **ficha de datos en caja fina**; chips-píldora | `FitText` con varias piezas, `CrossfadeHero`, `MetaTable`, `Preloader fill`, demo **Foro** |
| [Belgrade Arbor](https://belgradearbor.rs/en) | no sondeado | **Navegación «isla»**: una píldora de vidrio centrada con menú · marca · «Inquire →»; render a sangre; **marca en serif gigante que se disuelve con el scroll**; verde profundo, crema y oro | `IslandNav`, `ScatterText`, `forestTokens`, demo **Arbor** |
| [Huy Phan](https://huyml.co/) | Framer, 2 `<canvas>`, barra de blend `difference` | **Preloader narrativo**: el nombre en serif enorme y una ilustración que «empuja» una cortina negra a la vez que avanza la carga. No se pudo ver la web tras la intro (la animación depende de la carga de ~27 imágenes y no terminó en una pestaña en segundo plano) | variante `fill` del `Preloader` (la marca gigante se rellena con el progreso) |
| [Signal-A](https://signal-a.studio) (ronda anterior) | lectura de HTML | Palabras sueltas animadas, `[menu]`/`[close]`, rejilla numerada «A — 1», marquee de pie, hora y ciudad | `SplitText`, `FullscreenMenu`, `LocalTime`, `ProjectList` (ya hechos) |

### Lo que se repite en todas (reglas de oro)

1. **Lenis + GSAP** como base del movimiento (Heron lo confirma con GSAP 3.12.5 y Lenis): ya está en `SmoothScroll`.
2. **Una sola idea tipográfica por web** y a tamaño enorme: wordmark (Foro), serif elegante (Arbor), mayúsculas gruesas (Plano).
3. **Un único acento de color** (naranja, oro, rojo) sobre una base casi monocroma.
4. **Estructura visible**: líneas finas, celdas y marcas de registro en lugar de tarjetas con sombra.
5. **Microcopy en mono y mayúsculas** para etiquetas, datos y botones (Heron, Signal-A).
6. **Formas en píldora** para lo accionable (isla, CTA, chips) y **cajas de línea fina** para los datos.
7. **El contenido de marca ocupa el borde**: wordmark de borde a borde, foto a sangre, pestaña pegada al borde.

## 2. Fórmulas como recetas reutilizables

| Fórmula | Ingredientes | Cuándo usarla |
|---|---|---|
| **Plano técnico** | `blueprintTokens` + `BlueprintFrame` + `CellGrid` + `MetaTable` + `EdgeTab` + par tipográfico «técnico» | Software o servicios técnicos: ingeniería, arquitectura, herramientas, B2B |
| **Evento con wordmark** | `Preloader fill` + `FitText` (dos fuentes) + `MetaTable` + `CrossfadeHero` + `FilterBar` + `ProjectList` + `BigFooter` | Festivales, congresos, ferias, lanzamientos con fecha |
| **Arquitectura tranquila** | `forestTokens` + `IslandNav` + `FullscreenMenu` + `ScatterText` (con `scope`) + `ExpandingPanels` + `CircleButton inline` + `EdgeTab` | Inmobiliario, estudios de arquitectura, hostelería y marcas de lujo discreto |
| **Estudio editorial** (ronda anterior) | `editorialTokens` + `SplitText` + `ProjectList` + `StackedCards` + `HorizontalScroll` | Agencias, portfolios |
| **Producto SaaS** (ronda anterior) | `AppShell` + `CommandPalette` + `DataTable` + `Chart` + `KpiCard` | Dashboards |
| **Tienda** (ronda anterior) | `ProductCard` + `ProductGallery` + `OptionPicker` + `CartDrawer` + `useCart` | Comercio |

## 3. Lecciones técnicas de esta ronda

- **`position: sticky` y progreso de scroll.** Un titular dentro de un contenedor sticky no se mueve, así que su propia
  posición no sirve de progreso: `ScatterText` acepta `scope` (selector del ancestro cuyo recorrido manda).
- **Los estilos de la web no pisan al kit.** Un `a { color: inherit }` global gana en especificidad al color de un componente
  (la píldora del hero perdió el texto). Las demos usan `:where(.prefijo) a` (especificidad 0).
- **El «grano» del SVG oscurece el fondo** si se superpone a un dibujo con fondo transparente: en `blueprintArt` no hay grano
  ni `multiply`, y el dibujo es transparente sobre el papel de la web.
- **`size` es solo `sm | md | lg`** (regla del kit): «dentro de un titular» es la prop booleana `inline`.

## 4. Cómo repetir la investigación (sin dependencias)

1. Abrir la web en Chrome, esperar a que acabe la intro, captura en reposo y otra tras `scroll`.
2. Sondear por JavaScript: `window.gsap`, clase `lenis` en `<html>`, `document.querySelectorAll('canvas')`, `[data-framer-root]`,
   `window.Webflow`; tamaño/peso/tracking/fuente del primer `h1`; elementos `position: fixed` (anchura, `z-index`,
   `mix-blend-mode`, `pointer-events`).
3. Anotar la **fórmula** (qué la hace reconocible) separada de la **tecnología** (cómo se hace), y pasarla a receta.
4. Una web que se congela o no termina su intro se anota como «no sondeada»: no se inventa lo que no se vio.

## 5. Pendiente de esta ronda

- Probar a fondo LPAS, OFFFForum y Belgrade Arbor (no se pudieron sondear por JS) y confirmar sus librerías.
- Preloader narrativo con ilustración que empuja la cortina (Huy Phan): hoy solo hay la variante `fill`.
- Ronda siguiente de referencias de **producto** (Linear, Stripe, Vercel, Raycast) con el mismo método.
