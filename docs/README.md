# Trama · documentación

Librería de componentes React/Next.js (ASCII, textmode, pixel art y secciones de landing) + un sitio que la
enseña: galería de demos (`/`), catálogo interactivo (`/componentes`) y landings de referencia (`/demo/<slug>`).

| Documento | Para qué |
|---|---|
| [CATALOG.md](./CATALOG.md) | **Referencia rápida** (generada): cada componente con su import, props, tipos y defaults, y las landings de referencia con los componentes que usan. Es lo primero que debe leer un agente. |
| [catalog.json](./catalog.json) | Lo mismo en datos, para herramientas. |
| [02-guia-de-componentes.md](./02-guia-de-componentes.md) | Cómo **crear** componentes coherentes: tokens, sistema de estilos `--s-*`, reglas, trampas conocidas. |
| [01-evaluacion.md](./01-evaluacion.md) | Historial de decisiones: por qué el kit es como es. Los conteos de cada apartado son los de su fecha. |

`CATALOG.md` y `catalog.json` salen de `lib/catalog/` con `npm run catalog`; `npm run catalog:check` falla si
se quedan atrás o si un componente no aparece en la tabla de abajo.

## Qué es librería y qué es sitio

| Parte | Carpeta | ¿Se exporta a otros proyectos? |
|---|---|---|
| **Kit** — componentes | `components/ui/*.tsx` | Sí |
| **Kit** — CSS (un solo punto de entrada) | `components/ui/styles/kit.css` (importa `ui-kit.css`, `ui-carousel.css`, `ui-video.css`) | Sí |
| **Kit** — tokens, fuentes, iconos, utilidades | `lib/ui/` | Sí |
| **Kit** — motores de fondos | `lib/asciify/`, `lib/sketches/`, `lib/scroll/`, `lib/text/` | Sí, solo lo que usen los componentes elegidos |
| Catálogo `/componentes` | `lib/catalog/` (esquema, entradas, escenas, presets), `components/playground/` | No |
| Galería y demos | `app/`, `components/*.tsx`, `lib/demos*.ts`, `lib/themes/` | No |
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
| Fondos | `AsciiBackground` · `TextmodeBackground` · `GridBackground` · `CrtOverlay` |
| Texto | `ScrambleText` · `Typewriter` · `NeonSign` · `BitmapText` · `Marquee` · `SectionHeader` · `Divider` |
| Tarjetas | `AsciiCard` · `Panel` · `PricingCard` · `Testimonial` · `BlogCard` |
| Interacción | `Button` · `MagneticButton` · `GlyphCursor` · `Spotlight` · `HoverFX` · `ScrollArea` |
| Transiciones | `SceneFlash` · `Reveal` · `Presence` |
| Datos | `StatCounter` · `AsciiChart` · `TerminalTyper` · `Timeline` · `Table` · `CodeBlock` |
| Navegación | `NavBar` · `Tabs` · `Accordion` · `Breadcrumbs` · `Pagination` · `Dropdown` |
| Formularios | `TextField` · `Toggle` · `RangeSlider` · `Select` · `CheckboxGroup` · `RadioGroup` · `Stepper` · `OtpInput` |
| Feedback | `Badge` · `Progress` · `Alert` · `Spinner` · `Skeleton` |
| Galerías y vídeo | `ImageGallery` · `Carousel` · `VideoPlayer` |
| Secciones | `Hero` · `ContactForm` · `CTASection` · `FAQSection` · `StatsSection` · `PricingSection` · `TestimonialSection` · `Footer` · `FeatureGrid` · `TeamSection` · `LogoCloud` · `ArticlesSection` |
| Overlays | `Modal` · `Toast` · `Tooltip` · `Drawer` |
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
| `th-ciphergrid` | Retrowave/cyberpunk: casi todo el catálogo, fondo que cambia de escena con el scroll, formulario → `Modal` → `Toast` (guía §15). |
| `th-mycel` | Orgánica: `AsciiBackground` con `progress` atado al scroll, alternando con `GridBackground` y sketches de textmode.js. |
| `th-folio` | La única de tema claro: fondos de papelería, legibilidad en claro (guía §16). |
| `th-minimal` | MARÉ minimal: variante minimalista de la marca del tema «Maré» (fondo dither, tipografía pixel). |
| `th-geometry` | FORMAS: 2000dvh, el scroll cambia celda y geometría del fondo; hover por figura. |
| `th-faceta` | FACETA: landing larga que mezcla ese fondo con secciones del kit en estilo pixel duro. |

Las otras seis landings de la galería (`th-tide`, `th-brew`…) usan el sistema antiguo `ThemedLanding` (no el kit).

## Deuda conocida

- `ThemedLanding` y las demos de la galería siguen con su propia implementación de cards/efectos (evaluación P1–P3).
- Las escenas «con progreso» leen el `scrollState` global cuando **no** reciben `progress`; `AsciiBackground` con
  `progress` ya pasa su propio valor al painter (guía §7).
- Los textos por defecto de los componentes son copy de demostración (escuela de surf…): en un proyecto real hay que
  pasar siempre las props de texto (o `""`).
- Sin pruebas visuales automatizadas: la red de seguridad es `npm run typecheck`, `npm run catalog:check` y `next build`.
