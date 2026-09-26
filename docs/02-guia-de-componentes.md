# Guía para crear componentes coherentes y reutilizables

Resume lo aprendido en las demos de la galería y lo convierte en reglas. Para **usar** componentes (props, defaults,
imports) la referencia es [CATALOG.md](./CATALOG.md); esta guía es para **crearlos** o modificarlos. Cada componente nuevo debe poder describirse
con la misma ficha: **categoría · estilos · tokens · props · motor de render**.

## 1. Principios

1. **Un componente = una responsabilidad + sus props.** Todo lo configurable es una prop tipada con valor por defecto.
2. **Cero globales.** No leer `textStore`/`scrollState` dentro de un componente reutilizable: recibirlo por prop
   (p. ej. `progress` de `AsciiBackground`, que se pasa al painter como argumento, ver §7).
3. **El tamaño lo decide el contenedor.** Nada de `window.innerWidth` ni `position: fixed` dentro del componente;
   se rellena el padre (`position: absolute; inset: 0`) y se observa con `ResizeObserver`.
4. **El estilo es una variante**, no otro componente: `variant="glass|solid|outline|…"`.
5. **El color viene de tokens** (`var(--acc)`), no de valores fijos en el CSS del componente.
6. **Se limpia todo lo que se crea** (listeners, RAF, `gsap.context`, `destroy()` de las librerías).
7. **Sin JS, el contenido sigue ahí.** El texto real vive en el DOM; los efectos lo animan, no lo sustituyen.
8. **Respeta `prefers-reduced-motion`** y `pointer: coarse` (sin cursor personalizado en táctil).

## 2. Tokens de diseño

Todas las variables se definen en el contenedor (`.ui-stage`, `.tl`, `:root` o un tema) y los componentes solo las consumen.
`components/ui/styles/kit.css` fija un tema neutro oscuro por defecto con `:where(:root)` (especificidad 0: cualquier
tema del proyecto lo sobrescribe sin importar el orden de carga). El sitio usa estos mismos nombres también en su
propio CSS (`app/globals.css`): no hay un segundo vocabulario (`--muted`, `--line`… ya no existen).

| Token | Uso | Ejemplo (Maré) |
|---|---|---|
| `--bg` | Fondo base / color "vacío" de los efectos | `#04121c` |
| `--fg` | Texto principal | `#eaf6ff` |
| `--mut` | Texto secundario, trama ASCII de fondo | `#8fb3c9` |
| `--acc` | Acento principal (CTA, brillos, cursor) | `#ff8a5c` |
| `--acc2` | Acento secundario (metadatos, degradados) | `#3fd0c9` |
| `--card` | Superficie de tarjetas | `rgba(255,255,255,.07)` |
| `--ln` | Bordes | `rgba(255,255,255,.18)` |
| `--r` | Radio | `18px` |
| `font-family` | Tipografía del tema | `var(--font-manrope), sans-serif` |
| `--display` (opcional) | Tipografía de titulares `h1–h3`; la pone `tokensToStyle` si el tema trae `display` | `var(--font-doto), monospace` |

**Selección de texto**: `::selection` (en `kit.css`) usa `--acc` de fondo y `--bg` de texto, leídos del elemento seleccionado; cada tema tiene su selección y dentro de una tarjeta `fill="accent"` sale invertida sola. No añadas `::selection` por componente.

Regla: **un tema = un objeto de tokens**. Cambiar de tema no toca componentes (ver `lib/themes/themes.ts`).
Para leerlos desde canvas: `getComputedStyle(el).getPropertyValue("--acc")`.

### 2.1 Cómo responde cada tipo de componente al tema

Un tema o un color elegido en el catálogo llega a **todos** los componentes, pero por caminos distintos según
cómo pintan:

| Tipo | Mecanismo | Ejemplo | ¿Repite animaciones al cambiar de tema? |
|---|---|---|---|
| DOM + CSS | Leen `var(--acc)` directamente | `Button`, `Badge`, `Tabs`, `Marquee` | No |
| Canvas propio | `useTokens(ref)` observa los ancestros y devuelve los tokens vigentes; el efecto de dibujo lo usa como dependencia | `AsciiCard` (fondo de texto y disolución) | No: solo repinta |
| Fondos de escena (asciify / textmode.js) | Prop `palette`: capas CSS con `mix-blend-mode` reinterpretan los colores de la escena | `AsciiBackground`, `TextmodeBackground` | No: es CSS |

Paletas de fondo: `original` (colores de la escena) · `tint` (tiñe con `--acc`) · `duotone` (sombras `--bg`, luces
`--acc`) · `gradient` (sombras `--bg`, luces del degradado `--acc → --acc2`). `tintAmount` gradúa la fuerza.

El catálogo permite además editar los tokens uno a uno (`bg fg mut acc acc2 r font`); `card` y `ln` se derivan de
`fg` al cambiarlo (`applyOverrides` en `lib/ui/tokens.ts`).

### 2.2 Sistema de estilos (`--s-*`)

Las ocho variantes (`glass solid outline neon retro terminal minimal dotmatrix`) se definen **una sola vez** en `components/ui/styles/ui-kit.css`
como variables `--s-*` sobre la clase `ui-s ui-s--<variante>`. Los componentes no conocen el estilo: consumen las variables.

| Variable | Significado |
|---|---|
| `--s-bg` `--s-bd` `--s-r` `--s-sh` `--s-bf` | Fondo, borde, radio, sombra y `backdrop-filter` de la superficie |
| `--s-ff` `--s-tt` `--s-ls` `--s-fw` `--s-ts` | Tipografía: familia, transformación, espaciado, grosor y sombra del texto |
| `--s-pri-bg` `--s-pri-fg` `--s-pri-bd` `--s-pri-sh` `--s-pri-ts` | Aspecto de la acción primaria (botón, CTA) |

Uso: el raíz del componente lleva `vcls(variant)` (`ui-s ui-s--neon`) y, si es una superficie, `ui-surface`. Añadir un octavo
estilo es añadir un bloque `.ui-s--nuevo { … }` y su nombre en `VARIANTS`: **todos** los componentes lo soportan sin tocarlos.
Los detalles que un estilo necesita y no caben en una variable (p. ej. `[ON ]/[OFF]` en terminal) se resuelven con
reglas `.ui-s--terminal .ui-componente__parte`.

Colores semánticos (`--ok --info --warn --bad`) viven en `:root` (`kit.css`) y en `.ui-s`, y no forman parte del
tema: significan lo mismo en todos. **Nunca se usan por su nombre de token en una prop**: se eligen con `intent`
(§2.2.1), el mismo vocabulario en todo el kit.

**Glosario de props de apariencia** (para no mezclar conceptos al crear un componente):

| Prop | Qué decide | Valores |
|---|---|---|
| `variant` | el estilo visual de la superficie | `glass solid outline neon retro terminal minimal dotmatrix` |
| `intent` | el color semántico | `accent neutral success info warning danger` |
| `emphasis` (`Button`, `MagneticButton`) | el énfasis del botón | `primary secondary outline ghost link` |
| `tone` | qué token de color usa una pieza (decorativas y tarjetas) | `acc acc2 fg mut` |
| `fill` (tarjetas) | lo que hay detrás del contenido | `surface tint gradient accent pattern image` |
| `kind` | la forma o el tipo de dibujo de *ese* componente | propio de cada uno (`ring`, `bars`, `sweep`…) |

**Reglas de nombres** (cada nombre significa una sola cosa en todo el kit; `scripts/rename-prop.py` migra un
renombrado dejando el nombre viejo como alias `@deprecated`):

| Nombre | Significa siempre | Si es otra cosa, usa |
|---|---|---|
| `size` | un preset `sm \| md \| lg` | `fontSize` (letra, px) · `cellSize` (celda de rejilla, px) · `iconSize` · `cursorSize` |
| `speed` | un multiplicador (1 = normal) | `duration` (segundos) · `charsPerSecond` · `fps` |
| `trigger` | cuándo se anima (`mount`, `inview`, `hover`, `scroll`…) | `triggerLabel` (texto del botón que abre algo) |
| `style` | el `style` CSS de React, nunca otra cosa | `asciiStyle` (estilo de render ASCII) |
| `hover` | — (demasiado genérico) | `textHover`, `fieldHover`… según a qué capa afecte |
| `tone` | qué token de color (`acc acc2 fg mut`) | `intent` (color semántico) · `emphasis` (énfasis de botón) |

### 2.4 Fondos de tarjeta (`fill`)

La variante (§2.2) decide borde, radio, sombra y tipografía; **el fondo es otra capa**, independiente, para que dos
tarjetas del mismo estilo no sean siempre la misma superficie. Lo aportan `components/ui/fill.ts` (`fillProps()`) y
las reglas `.ui-cfill--*` / `.ui-pat--*` de `ui-kit.css`, y lo aceptan todas las tarjetas: `Panel`, `PricingCard`,
`BlogCard`, `Testimonial`, `AsciiCard` (props `fill`, `pattern`, `tone`, `image`).

| `fill` | Qué pone detrás | Cuándo |
|---|---|---|
| `surface` | el fondo de la variante (lo de siempre) | por defecto |
| `tint` | el acento mezclado con `--bg` | agrupar o marcar sin gritar |
| `gradient` | degradado `--acc` → `--acc2` | tarjetas protagonistas, CTA |
| `accent` | fondo de acento y **paleta invertida para los hijos** (un botón primario dentro pasa a oscuro solo) | el plan destacado, una tarjeta «nueva» |
| `pattern` | trama de CSS (`dots grid diagonal waves checker rays`) sobre un tinte leve | variedad en rejillas sin imágenes |
| `image` | imagen (`image`: URL o `gen:N`) con un velo de `--bg` (`--veil-top/-mid/-bottom`) | portadas; el velo garantiza la lectura |

`tone="acc2"` cambia el acento de la tarjeta al secundario. **Variedad automática**: las secciones con rejilla
(`ArticlesSection`, con `vary`) alternan trama y acento de tarjeta en tarjeta con `pick(lista, i)`; haz lo mismo en
una sección nueva en vez de repetir la misma tarjeta N veces.

Dos detalles de implementación que evitan errores:
- Se sobrescribe `--s-bg` (que `.ui-surface` usa como `background`), así que admite degradados e imágenes; las reglas
  van con dos clases (`.ui-s.ui-cfill--tint`) para ganar a `.ui-s--<variante>` sin depender del orden del CSS.
- La paleta invertida de `accent` se calcula en el raíz (`--inv-a`, `--inv-b`) y se aplica a los **hijos**:
  redefinir `--bg` con `var(--acc)` y `--fg` con `var(--bg)` en el mismo elemento sería un ciclo.
- `ui-fill` ya existía (los fondos de escena: `position: absolute; inset: 0`); por eso la clase de tarjeta es `ui-cfill`.

**`AsciiCard` tiene además su capa ASCII propia** (`background`), encima del `fill`:
- `field` (por defecto): campo de caracteres procedural de `lib/ui/card-fields.ts`, 15 campos (`plasma waves rings noise
  rain stars dither topo maze grid halftone vortex tunnel binary scan`) × 8 juegos de caracteres (`detailed standard
  blocks braille dots lines binary glyph`), color `mut | accent | gradient | value` y reacción al puntero
  `glow | ripple | repel | reveal`. Un canvas 2D de ~1.000 celdas, animado a ~30 fps solo mientras la tarjeta se ve:
  aguanta varias por página. `index` hace de semilla, así que tres tarjetas con el mismo campo no son iguales.
- `text`: el texto `tile` repetido con el hover de asciify-engine (lo que había antes).
- `scene`: un `AsciiBackground` dentro de la tarjeta (25 escenas × 15 estilos). El más vistoso y el más caro: úsalo
  en una o dos tarjetas, no en una rejilla entera.
- Para añadir un campo: una rama en `sample()` (valor 0..1) o en `directChar()` (carácter), y su nombre en `CARD_FIELDS`.

### 2.2.1 Color semántico (`intent`) y énfasis de los botones

**Un solo vocabulario de color en todo el kit** (`components/ui/intent.ts`): `accent neutral success info warning
danger`. Lo usan `Button`, `Badge`, `Alert`, `TextField` (estado de validación; `danger` pone `aria-invalid`), `Toast`
(`kind`, que añade `message` y `loading`) y `Modal` (color del botón de confirmar: `danger` para acciones
destructivas). Las clases `.ui-intent--*` (al final de `ui-kit.css`) fijan `--tone` y `--acc`; un componente nuevo
con color semántico recibe `intent`, pone `intentCls(intent)` en su raíz y lee `var(--tone)` o `var(--acc)`. Los
nombres antiguos (`warn`, `error`, y las props `tone` de Badge, `kind` de Alert y Toast y `state` de TextField) se siguen
aceptando con `toIntent()`, pero no los uses en código nuevo.

`Button` (y `MagneticButton`, que lo envuelve) separa además **color** y **énfasis**, al estilo de Bootstrap pero en
dos ejes independientes para que cualquier combinación funcione en los 7 estilos:

| Prop | Valores | Qué cambia |
|---|---|---|
| `intent` | `accent` (por defecto) · `neutral` · `success` · `info` · `warning` · `danger` | el color: sustituye `--acc` **solo dentro del botón** |
| `emphasis` | `primary` (relleno) · `secondary` (superficie) · `outline` (borde) · `ghost` (texto) · `link` (enlace subrayado) | el énfasis |
| estados | `active` (pulsado, `aria-pressed`) · `loading` (spinner, `aria-busy`, bloquea el clic) · `disabled` | |
| forma | `iconOnly` (cuadrado; `label` pasa a `aria-label`) · `href` (se pinta como `<a>`) · `fullWidth` · `size` | |

Por qué funciona sin reglas por variante: `.ui-s` declara `--s-pri-bg: var(--acc)` (y el resto de `--s-pri-*`) **en el
propio botón**, así que `.ui-intent--danger { --acc: var(--bad) }` en ese mismo elemento cambia relleno, borde, halo
y texto a la vez. Los colores semánticos (`--ok --warn --bad --info`) viven en `.ui-s` y son los mismos que usan
`Badge`, `Alert` y los campos con error. Pasa `active` solo en botones conmutables: `active={false}` también pone
`aria-pressed` y el lector de pantalla lo anunciará como interruptor.

### 2.3 Tipografía

Por defecto el kit usa **fuentes de Google autoalojadas** (`next/font/google`, `lib/ui/fonts.ts`): se descargan en
build y se sirven desde este dominio, sin `<link>` a `fonts.googleapis.com` ni petición de red en runtime, con
`display: "swap"` y métricas de *fallback* automáticas (cero salto de layout). "De Google" y "en local" dejan de ser
cosas distintas — siempre se sirven en local, la fuente la elija Google o no.

Catálogo curado (11 familias base + las 46 de la categoría Pixel de Google Fonts — ver más abajo):

| Rol | Fuente | Variable CSS |
|---|---|---|
| Sans | Inter, Manrope | `--font-inter`, `--font-manrope` |
| Display | Space Grotesk, Syne | `--font-space-grotesk`, `--font-syne` |
| Serif | Fraunces, Instrument Serif | `--font-fraunces`, `--font-instrument-serif` |
| Mono | JetBrains Mono, Space Mono, IBM Plex Mono, Share Tech Mono | `--font-jetbrains-mono`, `--font-space-mono`, `--font-ibm-plex-mono`, `--font-share-tech-mono` |
| Display mono | Major Mono Display | `--font-major-mono-display` |
| Pixel | las 46 de Google Fonts › Appearance › Theme › Pixel (Press Start 2P, VT323, Silkscreen, Pixelify Sans, Jersey, Bitcount, Jacquard…) | `--font-press-start-2p`, `--font-vt323`, … (kebab-case del nombre) |

**Las fuentes Pixel** (`lib/ui/fonts.ts` + `FONT_PRESETS`, etiquetadas «Pixel — …» en el selector de `/componentes`) llevan `preload: false`, a diferencia de las 8 base: son 46 fuentes decorativas para elegir una a una, y con precarga cada carga de *cualquier* página del sitio encadenaría 46 `<link rel="preload">` aunque no use ninguna. Sin precarga el `@font-face` sigue disponible y se aplica al instante al elegirla. La lista sale de la propia página de Google Fonts (no de memoria) y cada nombre se comprobó contra los tipos instalados de `next/font/google`, que fijan qué `weight` es obligatorio y qué `subsets` existen. Al compilar salen 16 avisos «Failed to find font override values» (familias muy recientes, como Bitcount, sin métricas de *fallback* todavía): no rompen nada, solo omiten el ajuste anti-salto de layout de esas familias.

`app/layout.tsx` aplica todas las variables una sola vez en `<html>` (`fontVariables`); de ahí cuelgan:

- **`--mono`** (`app/globals.css`, `components/ui/styles/ui-kit.css`) — la monoespaciada global del sitio (HUD, galería, ASCII/terminal
  de todo el kit) apunta a `var(--font-jetbrains-mono)` con *fallback* de sistema.
- **`FONT_PRESETS`** (`lib/ui/tokens.ts`) — el selector "Tipografía" del panel de tokens en `/componentes`; cada
  entrada es `var(--font-x), <fallback de sistema>`. El preset neutro por defecto usa Inter.
- **`lib/themes/themes.ts`** — cada uno de los 6 temas de landing fija su `font` a la familia que le pega (Manrope
  para Maré, Fraunces para Grano, Space Grotesk para Órbita, JetBrains Mono para Pulso, Instrument Serif para Hoja,
  Space Mono para Pixel Club) en vez de una fuente de sistema.
- **`.ui-s--retro`** (`components/ui/styles/ui-kit.css`) — su `--s-ff` usa `var(--font-space-mono)` con `"Courier New"` como *fallback*,
  para un aspecto de máquina de escribir sin depender de que el sistema tenga Courier.
- **`.ui-s--dotmatrix`** — cuerpo en `var(--font-ibm-plex-mono)` y titulares (`h1–h3`, marca de `NavBar`) en
  `--dm-display` = Doto (matriz de puntos, de las Pixel) → Major Mono Display → `--mono`. IBM Plex Mono, Share Tech Mono y
  Major Mono Display también van con `preload: false`: solo se descargan donde se usan. Ojo: Doto es muy fina en pesos
  bajos; la variante la fuerza a 800 y solo en titulares, nunca en texto de cuerpo.

**Fuente local propia** (de marca, con licencia, no en Google Fonts): añade `next/font/local` en `lib/ui/fonts.ts`
exportando su propia variable igual que las de arriba, súmala a `fontVariables` y regístrala en `FONT_PRESETS` (o
referénciala directamente en el `font` de un tema). No hace falta tocar ningún componente: todos leen `font-family`
vía tokens, nunca una fuente concreta a pelo.

## 3. Contrato de un componente

```tsx
"use client";

export type Props = {
  // 1. contenido
  title: string;
  // 2. apariencia (siempre con union literal)
  variant?: "glass" | "solid" | "outline";
  // 3. comportamiento
  reveal?: "none" | "wipe" | "rise" | "dissolve";
  /** cambia para volver a lanzar la animación desde fuera */
  playKey?: number;
  className?: string;
};

export default function Component({ variant = "glass", reveal = "rise", playKey = 0, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    const cleanups: Array<() => void> = [];
    (async () => {
      const { gsap } = await import("gsap"); // dinámico: seguro para SSR
      if (disposed) return;
      // …crear efectos y registrar cleanups.push(...)
    })();
    return () => { disposed = true; cleanups.reverse().forEach((f) => f()); };
  }, [variant, reveal, playKey]);
  return <div ref={ref} className={`ui-x ui-x--${variant}`} />;
}
```

Checklist de un componente:
- [ ] Todas las props con default y tipo literal.
- [ ] Sin `window`/`document` fuera de un efecto.
- [ ] Cleanup completo; funciona con StrictMode (doble montaje).
- [ ] Prefijo de clase `ui-` y modificadores BEM (`ui-card--glass`).
- [ ] Estado inicial legible sin JS.
- [ ] Entrada en `lib/catalog/catalog.tsx` con esquema de props.

## 4. Elegir el motor de render

| Necesito… | Usar | Notas |
|---|---|---|
| Texto, botones, cards, layout | **DOM + CSS** | Accesible y indexable. Punto de partida. |
| Animar entrada/scroll/hover del DOM | **GSAP** (`quickTo`, ScrollTrigger, ScrambleText) | Carga dinámica; un `gsap.context` por componente. |
| Fondos de caracteres reactivos, por celda | **textmode.js** | Cada celda = un carácter con color propio; ideal para simulaciones. |
| Convertir una imagen/escena en caracteres con estilos (braille, lego, dither…) | **asciify-engine Studio** | 15 estilos, hover, bloom, CRT. Necesita una fuente (canvas 2D). |
| Trama de texto con hover, números o titulares bitmap | **asciify-engine core** | `renderTextBackground`, `asciifyText`, `createStudioText`. |
| Efecto de partículas/física sencillo | **canvas 2D propio** | Cuando no hace falta rejilla de caracteres. |
| Combinar | Apilar capas (`mix-blend-mode: screen`) o generar con una y dibujar con la otra | Ej.: FIGlet (asciify) animado por textmode.js. |

Regla: **DOM primero; canvas solo para lo decorativo.** Ningún contenido esencial dentro de un canvas.

## 5. Recetas de estilo (por caso)

Cada estilo fija: superficie, borde, radio, tipografía, efecto ASCII recomendado y qué evitar.

| Estilo | Cuándo usarlo | Superficie / borde / radio | Tipografía | Efecto ASCII recomendado | Evitar |
|---|---|---|---|---|---|
| **glass** | Marcas amables, naturaleza, deporte | `--card` translúcido + `backdrop-filter: blur(14px)` · 1 px `--ln` · radio 18–28 | Sans humanista | Trama de texto con hover `trail`/`glow` | Fondos muy claros (pierde contraste) |
| **solid** | Editorial, artesanal, retro | Fondo opaco · borde 3 px + sombra dura `6px 6px 0` · radio 0–6 | Serif o monoespaciada | Revelado `rise`; hover `magnify`/`shatter` | Blur y sombras suaves |
| **outline** | Técnico, espacial, nocturno | Casi transparente · 1 px `--acc` · sombra interior luminosa · radio 0–2 | Sans en mayúsculas o mono | Disolución ASCII; hover `attract`/`glitchText` | Rellenos opacos grandes |
| **neon** | Vida nocturna, gaming | Oscuro + halo `text-shadow`/`box-shadow` del acento | Mono | Bloom + glitch + parpadeo | Más de 2 colores de acento |
| **retro** | Arcade, píxel | Paleta cerrada (4 tonos), bordes gruesos, sin degradados | Monoespaciada gruesa | Estilo `pixel`/`dither`, scanlines | Antialias suave, sombras difuminadas |
| **terminal** | Herramientas para devs | Fondo oscuro, barra de título, cursor parpadeante | Mono | Escritura carácter a carácter, CRT | Iconos de color |
| **dotmatrix** | Tecnología, seguridad, IA, datos: hacker sobrio | Negro con trama de puntos (5 px) · borde 1 px punteado · radio 0 · sin sombras | Titulares Doto, cuerpo IBM Plex Mono en mayúsculas espaciadas (párrafos en minúscula) | `RetroCanvas` con rampa `dots` + scanlines; fondos en paleta `duotone` | Acentos saturados y degradados: es monocromo (tema `dotmatrixTokens`) |
| **minimal** | Contenido primero | Sin superficie ni borde (los campos de formulario conservan una línea inferior) | Sans neutra | Solo `ScrambleText` en el titular | Efectos en texto largo |

Convenciones de tema: **≤ 2 acentos**, un radio para todo el tema, una sola tipografía, y todo movimiento con
una curva coherente (`power3.out` para entradas, `power2.inOut` para transiciones).

## 6. Recetas de efectos

| Efecto | Cómo | Parámetros clave |
|---|---|---|
| **Revelado wipe** | `clip-path: inset(0 100% 0 0)` → `inset(0)` | duración 0.9 s, `power3.inOut` |
| **Revelado rise** | `autoAlpha 0→1` + `y 70→0` | 0.9 s, `power3.out`, escalonado 0.12 s |
| **Disolución ASCII** | Canvas por encima; cada celda tiene un umbral fijo por `hash(x,y)`; si `k < umbral` se pinta glifo opaco | celda 14 px, duración 1.4 s |
| **Scramble** | `gsap.to(el,{scrambleText:{text,chars,revealDelay,speed}})` | `chars` del tema, 0.6–1.5 s |
| **Tilt 3D** | `transformPerspective: 900` + `quickTo(rotationX/Y)` | ±10° / ±12° |
| **Botón magnético** | `quickTo(x,y)` hacia el puntero si `d < 160px` | fuerza 0.35 |
| **Cursor temático** | Carácter fijo con `quickTo` y retardo 0.45 s | oculto en táctil |
| **Paralaje por capas** | `data-depth` × posición normalizada del puntero | 34 px / 20 px máx. |
| **Transición de sección** | Overlay `sweep`/`iris`/`slices` al cambiar de escena | 0.5–1.1 s |
| **Fondo que muta con el scroll** | Painter que lee un progreso 0–1 y hace fundidos internos | + cambio de estilo Studio por tramos |

### 6.1 Entrada/salida y hover para *cualquier* componente

No se le añade animación a cada componente por separado: se **envuelve** con `Presence` (entrada/salida) y/o
`HoverFX` (hover), dos componentes genéricos de `components/ui/` que aceptan cualquier `children`. Es la vía
recomendada — nueva o existente, propia o del catálogo, con o sin variante de estilo.

```tsx
<Presence effect="ascii-rain" show={visible}>
  <HoverFX effect="glow">
    <PricingCard plan="Pro" />
  </HoverFX>
</Presence>
```

- `Presence`: 13 efectos (`ascii-random/sweep/rain/radial/rows`, `glitch`, `slices`, `shatter`, `crt`, `flicker`,
  `static`, `redact`, `boot`). Reproduce la entrada con `show`/`loop`, o pásale un `playKey` creciente para relanzarla.
- `HoverFX`: 9 efectos (`lift`, `scale`, `tilt`, `glow`, `shine`, `scanline`, `jitter`, `brackets`, `underline`).
  La mayoría son CSS puro; `tilt` y `glow` siguen el puntero con GSAP.
- Por defecto ambos son `display: inline-block` y se ajustan al tamaño de su contenido — así se comportan al
  envolver una tarjeta pequeña. Con **`fill`** pasan a `position: absolute; inset: 0` y ocupan todo su contenedor
  (que debe ser `position: relative` y tener tamaño): úsalo para envolver una sección entera o cualquier demo cuyo
  render ya use `position: absolute` internamente (como `.ui-center`).
- No los uses sobre la categoría **fondos** (`AsciiBackground`, `TextmodeBackground`…): al no tener tamaño propio
  fuera de `fill`, y al ya ocupar todo su contenedor por sí mismos, envolverlos no aporta nada.
- En `/componentes`, el botón **«FX»** de la cabecera aplica exactamente este patrón (con `fill`) al componente que
  estés viendo, sin tocar su código — pruébalo ahí antes de decidir los parámetros para tu propio uso.

### 6.2 Ver un componente "en caso real"

Un componente aislado en un escenario vacío no dice cómo se comportará entre contenido real: si el texto de al lado
lo apretará, si necesita más o menos aire, si tres seguidos guardan ritmo. Por eso `/componentes` tiene un botón
**«Ver en caso real»** junto a «Comparar los 7 estilos».

No hay una maqueta por componente (sería 36+ maquetas que mantener). Hay **una escena por categoría**
(`lib/catalog/scenarios.tsx`, `SCENARIOS: Record<Category, (ctx) => ReactNode>`): un hero con navegación para *fondos*,
un formulario de alta para *formularios*, un grid de tres columnas para *tarjetas*, un panel de control con widgets
para *datos*, etc. La escena se construye con **otras piezas ya existentes del kit** (`Button`, `Badge`, `NavBar`…)
como decorado estático, y coloca al componente que se está editando —con sus props en vivo— en el sitio que le
correspondería en una página real:

```tsx
const live = ({ entry, values, replay }: ScenarioCtx) => entry.render(values, { replay });

formularios: (ctx) => (
  <div className="pg-scn pg-scn--form">
    <strong>Crear cuenta</strong>
    <div className="pg-scn__slot" style={slot(ctx.entry, 200)}>{live(ctx)}</div>
    <Toggle label="Acepto los términos" />
    <Button label="Crear cuenta" fullWidth />
  </div>
),
```

Dos reglas para que una escena no rompa el layout:

- **El hueco donde va el componente en vivo necesita una altura explícita.** Casi todos los `render()` del catálogo
  devuelven `.ui-center` (`position: absolute; inset: 0`), así que si el contenedor que los recibe no tiene una
  altura propia, colapsa a 0 o el contenido se sale sin que nada lo empuje. La función `slot(entry, fallback)`
  reutiliza `entry.stageHeight` — la misma altura ya calibrada para la vista aislada — así ningún componente queda
  recortado ni descentrado por un hueco improvisado.
- **No dupliques la demostración que el propio componente ya trae.** Los fondos, por ejemplo, ya superponen una
  tarjeta de ejemplo (`.ui-sample`) para probar la legibilidad del texto; si la escena añade su propio titular
  encima, las dos coinciden. Ocúltala con CSS en el contexto de la escena (`.pg-scn__bg .ui-sample { display: none; }`)
  en vez de tocar el componente.

Las escenas son solo para `/componentes`: viven en `lib/catalog/scenarios.tsx` y su CSS usa el prefijo `pg-scn-` (chrome
de catálogo, no parte del kit exportable — igual que `pg-fx`, `pg-tokens`).

### 6.3 Revelar al hacer scroll: `Reveal`

`Reveal` es el envoltorio para «que cada sección entre cuando llegas a ella» (`Presence` es para mostrar/ocultar
con efectos hacker; `Reveal`, para la entrada normal de contenido). Props en [CATALOG.md](./CATALOG.md); lo que
conviene saber para usarlo bien:

- **`trigger`**: `inview` (por defecto) al entrar en pantalla, `mount` al montar, `scroll` para atar el progreso al
  scroll (scrub). Con `inview`, `once={false}` lo repite cada vez que vuelve a entrar.
- **Escalonar**: `stagger` anima los **hijos directos**. Pon la clase de la rejilla en el propio `Reveal`
  (`<Reveal stagger={0.12} className="mi-grid">…tarjetas…</Reveal>`), no un `<div>` intermedio: con un solo hijo
  no hay nada que escalonar (era el caso de las tres landings kit hasta esta versión). `split="words" | "chars"`
  trocea un texto plano (titulares) sin tocar el DOM de React, con el texto completo para lectores de pantalla.
- **Cómo funciona**: una variable registrada `--rv-p` (0 → 1) que cada efecto traduce a CSS; la anima la Web
  Animations API. El estado oculto sale ya en el HTML del servidor (sin parpadeo al hidratar); sin JS (`<noscript>`)
  o con `prefers-reduced-motion` se ve directamente. No toca el `transition` de los hijos y, al terminar, retira
  transform/filter/clip-path (un `Modal` dentro sigue funcionando). Lo que queda por encima del viewport sin haberse
  visto (recarga a mitad de página, `#ancla`) se muestra sin animar.

## 7. Fondos (painters y sketches)

- **Painter (asciify):** `(ctx, w, h, t, p) => void`, `p = {x, y, down, active}` normalizado 0–1. Dibuja a ~640 px de
  ancho; el motor lo convierte. Fondo oscuro y colores saturados dan mejor resultado en caracteres.
- **Sketch (textmode.js):** `(t) => void`, registra `t.draw(...)`. Estado en el primer fotograma (la rejilla no existe antes).
- **Puntero:** usar siempre el helper (`createPointer` / `createPointerTracker`) para tener autopiloto sin ratón.
- **Progreso:** los painters "temáticos" reciben el progreso como sexto argumento (`(ctx, w, h, t, ptr, s)` con
  `s = { p, v }`). `AsciiBackground` pasa el suyo cuando recibe `progress`, así que dos fondos en la misma página no se
  pisan; sin `progress`, el painter cae al `scrollState` global (el que miden las demos de scroll).
- **Legibilidad:** el texto sobre un fondo de caracteres necesita `text-shadow` y, si el fondo es denso, una capa
  `--card` translúcida. Probar siempre contra el fotograma más brillante.
- **Coste:** limitar celdas (Studio ≤ ~16.000, adaptativo), 30 fps para `core`, un solo motor pesado por vista.

## 8. Rendimiento y accesibilidad

- `IntersectionObserver` / pausa cuando el componente no es visible (Studio ya lo hace).
- Canvas decorativos con `aria-hidden`; el contenido real es texto DOM.
- `prefers-reduced-motion`: fondos estáticos, sin scramble ni tilt.
- Táctil: sin cursor personalizado ni magnetismo; hover sustituido por el puntero automático del fondo.
- Contraste ≥ 4.5:1 para texto de cuerpo sobre cualquier fotograma del fondo.
- Fondos WebGL (react-three-fiber) detrás de una página con scroll: reglas en §22.1. La principal es que la GPU es compartida;
  si el lienzo la satura, el scroll va a tirones aunque el JavaScript esté libre.
- **`"use client"` solo donde hace falta.** Un componente es cliente si usa estado, efectos, refs, eventos que define él
  mismo o APIs del navegador. Uno que solo pinta props (aunque reciba un `onClick` para pasarlo a un `<button>`, como
  `Button`) no lo lleva: así funciona en páginas de servidor y no manda JavaScript propio. Un `useMemo` sobre las props
  no justifica la directiva: calcúlalo directamente.
- **Nada de «routers» con imports estáticos.** Un componente cliente que elige entre muchos (una demo por slug, una web
  por ruta) no importa todas las opciones arriba del archivo: cada página las descargaría todas. O decide en el servidor,
  o usa `next/dynamic` por opción (`components/DemoViewer.tsx`, `components/sites/SiteRouter.tsx`). Lo pesado que no hace
  falta para el primer pintado (un lienzo three.js de fondo), con `dynamic(…, { ssr: false })`.
- **Páginas de servidor con islas.** El texto de una página va en un componente de servidor; las partes interactivas son
  componentes cliente pequeños dentro (portada de la web: `components/site/HomePage.tsx` con `HomeStage`, `StartSteps`,
  `VariantLab` e `InstallChip`).

### 8.1. Accesibilidad y SEO: reglas del kit

Lo comprueba una auditoría con axe-core (WCAG 2.1 AA) sobre la web, las landings y las webs completas. Al crear o cambiar
un componente:

- **Un solo `h1` por página.** Solo `Hero` y `ArticleHeader` lo pintan. Un componente con título propio que puede ir a
  distintas profundidades acepta `headingLevel` (tipo `HeadingLevel` de `variants.ts`, h2–h6, por defecto 3) y pinta ese
  nivel con una clase propia (`.ui-panel__title`), nunca con el selector de etiqueta: el nivel no debe cambiar el aspecto.
  Así lo hacen `Panel` y `BlogCard`. En una página, los niveles no saltan (h1 → h2 → h3).
- **Texto animado letra a letra** (scramble, glitch, máquina de escribir): el texto legible va en un
  `<span className="ui-sr-only">` y la parte animada lleva `aria-hidden`. Nunca `aria-label` en un `<span>` o `<div>` sin
  `role`: los lectores de pantalla lo ignoran (así era `Typewriter`, y el texto no se leía).
- **Iconos y gráficos con significado** (estrellas de valoración, redes del pie): `role="img"` y `aria-label`. Decorativos:
  `aria-hidden`.
- **Lo que desplaza debe poder enfocarse.** Una caja con scroll propio (`CodeBlock`, `ScrollArea`, tablas de `Prose`) lleva
  `tabIndex={0}` y nombre (`aria-label`, o `role="group"` + `aria-label` si es un `<div>`) para poder desplazarla con el
  teclado.
- **Foco visible.** `ui-kit.css` trae una regla base (con `:where()`, especificidad cero) que da contorno de acento a
  cualquier control enfocado dentro de un componente del kit. Si un componente quita el `outline`, debe dar otro indicador
  (borde, subrayado) en `:focus-visible`.
- **Reducir movimiento.** En JS, `useReducedMotion()` de `lib/ui/useReducedMotion.ts` (se actualiza en vivo). Fondos
  continuos: más lentos y a pocos fps (`AsciiBackground`, `TextmodeBackground`) o bajo demanda (`RetroCanvas`). Destellos y
  barridos (`SceneFlash`), fuera. En CSS, el bloque «Reducir movimiento» del final de `ui-kit.css` para bucles y parpadeos.
- **Contraste.** `--mut` sobre `--bg` ≥ 4.5:1 en cada tema: es el color de etiquetas pequeñas y números de línea. Los grises
  por debajo de `#777` sobre negro no llegan.
- **Contenido en el HTML.** Los textos van en el DOM desde el servidor (los componentes con `"use client"` también se
  prerenderizan): nada de pintar texto importante solo en un canvas, porque ni buscadores ni lectores de pantalla lo ven.

## 9. Añadir un componente al catálogo

1. Crear `components/ui/MiComponente.tsx` siguiendo §3 (props con default, tokens, cleanup). Si tiene variantes de
   estilo, aceptar `variant?: Variant` y poner `vcls(variant)` (+ `ui-surface` si es superficie) en el raíz.
2. Añadir estilos en `components/ui/styles/ui-kit.css` con prefijo `ui-`, leyendo tokens y `--s-*` (nunca colores fijos).
3. Registrar en la lista de su categoría, `lib/catalog/entries/<categoria>.tsx`:
   - `id`, `name`, `component`, `path`, `category`, `styles[]` (`ALL_STYLES` si admite todas), `description`
   - `props[]`: `{ key, label, type: text|number|boolean|select, default, when? }`. Atajos en `entries/shared.tsx`:
     `variantProp("glass")` y `toneProp("acc")`.
   - `render(props, { replay })` que devuelve el componente con esas props (`replay` cambia al pulsar «Repetir animación»).
4. Abrir `/componentes`: aparece solo, con controles, filtros, comparador de estilos y código.
5. Añadirlo a la tabla de categorías de `docs/README.md` y ejecutar `npm run catalog` (regenera `CATALOG.md` y
   `catalog.json`; `npm run catalog:check` falla si falta cualquiera de los dos pasos).

Si el componente nació en un proyecto (copiado con `kit:export` y mejorado allí), `npm run kit:pull -- <proyecto> --apply`
lo trae a `components/ui/`; desde ahí, los pasos 3–5.

Categorías: `fondos`, `texto`, `tarjetas`, `interaccion`, `transiciones`, `datos`, `navegacion`, `formularios`, `feedback`, `galerias`, `secciones`, `contenido`, `overlays`, `pixel`.
Estilos: `glass`, `solid`, `outline`, `neon`, `retro`, `terminal`, `minimal`.

**Cobertura de estilos.** Cada estilo debe tener al menos un componente de cada grupo funcional (acción, entrada,
superficie, navegación, feedback, datos). Los componentes con `variant` cubren los ocho de golpe; los que solo tienen
sentido en algunos (fondos ASCII, CRT, neón) declaran en `styles[]` únicamente los que ilustran.

## 10. Trampas conocidas

| Síntoma | Causa | Solución |
|---|---|---|
| Canvas de textmode.js borroso/estirado | Ignora `width/height` con canvas propio | Fijar `canvas.width/height` antes de `create()` |
| `t.grid` indefinido | No existe antes del primer `draw` | Inicializar en el primer fotograma |
| Rejilla de puntos donde debería haber negro | `createStudioText` pinta `#080808` | Restar 14 a cada canal al cargar |
| Error de hidratación en un título editable | Se leyó el store fuera de `useSyncExternalStore` | Usar el snapshot |
| `SplitText` rompe React | Ambos escriben el mismo nodo | No trocear texto controlado por React |
| La página de scroll arranca a mitad | Restauración de scroll del navegador | `history.scrollRestoration = "manual"` |
| Ruta nueva da 404 en dev | `dynamicParams = false` cachea slugs | Reiniciar `next dev` |
| El servidor de dev se cuelga | `next dev \| head` cierra el pipe | Redirigir a un archivo |
| Animaciones "paradas" al probar | Pestañas ocultas pausan RAF | Forzar `redraw()` / `gsap.ticker.tick()` |
| Texto corrupto en `StatCounter`/cifras ASCII | La fuente bitmap 7×7 de `asciifyText` no cubre letras acentuadas ni símbolos como «★» | Usar solo dígitos y símbolos simples (`+ % / -`) en lo que se convierte a bitmap; cualquier palabra va en un `label` de texto normal |
| Un componente no llega al ancho de su contenedor en un proyecto | Un tope de ancho pensado para la vista previa del catálogo (`Table` tenía `width: min(100%, 520px)`) | Los componentes llenan su contenedor; si la vista previa necesita un tope, se lo pone el `render` de su entrada en `lib/catalog/entries/`, nunca el CSS del componente. `Table` tiene `width="full"` (defecto) o `"auto"` |
| El scroll va a tirones en móvil con un fondo 3D, aunque en escritorio vaya fino | El compositor del navegador (el que mueve el scroll) comparte la GPU con el WebGL: lienzo a pantalla completa a dpr 2–3, MSAA en el render target, 60–120 fps y `backdrop-filter` encima la saturan | §22.1: `RetroCanvas` ya limita fps, dpr y resolución interna; no pongas `backdrop-filter` sobre el lienzo ni vuelvas a renderizar la página al cambiar de escena |
| Una barra de borde a borde se queda con márgenes | El layout que la contiene tiene `max-width` o `padding` | `NavBar bleed` ocupa el ancho de la ventana desde cualquier contenedor; `shape="contained"` alinea su contenido con `--nav-max` |
| Doble caja en un `<input>`/`<textarea>` del catálogo | Una regla `.pg` demasiado amplia (pensada para el propio panel) alcanza con descendientes genéricos (`.pg input[type="text"]`) el `<input>` que un componente del catálogo pinta en vivo dentro de `.pg__stage`, y le gana en especificidad a `.ui-field input` | El CSS del panel (`components/playground/playground.css`) nunca usa selectores genéricos `.pg <elemento>`: se ata a clases propias (`.pg__search`, `.pg__theme`, `.pg-field`) que no existen dentro de `.pg__stage` |
| Scroll o recorte en una celda de «Comparar los 7 estilos» | La celda topaba su alto en `Math.min(stageHeight, 460)` y además vivía en una rejilla de columnas de ~280px — ambos límites pensados para componentes pequeños (botón, campo, tarjeta), que un componente ancho por diseño (`NavBar`, cualquier "sección") o con rejilla propia (`PricingSection`) no puede respetar | Sin alto tope (`entry.stageHeight` a secas) y sin columnas: `.pg__compare` es una sola columna a ancho completo, el mismo que ya funciona en la vista aislada |

## 11. Secciones: componentes compuestos

Categoría `secciones` (`lib/catalog/entries/secciones.tsx`, `components/ui/{Hero,ContactForm,CTASection,FAQSection,
StatsSection,PricingSection,TestimonialSection,Footer}.tsx`): bloques de página **enteros**, no piezas sueltas —
la respuesta a "necesito un hero / un formulario de contacto / una sección de precios", no a "necesito un botón".

**Principio: componer, no reinventar.** Una sección nunca redefine lo que ya existe — importa y ensambla componentes
de otras categorías con sus props en vivo:

| Sección | Compone |
|---|---|
| `Hero` | `Button` + `Badge` (fondo decorativo es CSS puro, sin motor de render) |
| `ContactForm` | `TextField` (con su nuevo `multiline`) + `Button` (con su nuevo `type="submit"`) |
| `CTASection` | `Button` sobre una superficie `ui-surface` |
| `FAQSection` | `SectionHeader` + `Accordion` |
| `StatsSection` | `SectionHeader` + `StatCounter` (una fila generada desde una cadena de datos) |
| `PricingSection` | `SectionHeader` + `PricingCard` (un grid generado desde una cadena de datos) |
| `TestimonialSection` | `SectionHeader` + `Testimonial` (un grid generado desde una cadena de datos) |
| `Footer` | Marca + columnas de enlaces, sin dependencias nuevas |

Por eso `Button` ganó una prop `type` (`"submit"` para que `ContactForm` pueda enviarse de forma nativa) y `TextField`
ganó `name`/`multiline`/`rows` (para el campo de mensaje) en vez de crear un `Textarea` aparte: extender lo que ya
existe, no duplicar.

**Listas como datos, no como children.** Igual que `Accordion` (`"Pregunta|Respuesta"` por línea) o `Tabs`, las
secciones con varias tarjetas codifican la lista en una prop de texto con un formato simple y la parten en el
componente: `PricingSection.plans` es `"nombre|precio|periodo|destacado(si/no)|características;separadas"` por línea,
`Footer.columns` es `"Título: enlace, enlace; Título: enlace"`. Así siguen siendo editables desde el panel de props
del catálogo (que solo sabe generar controles para `text|number|boolean|select`, guía §3) sin necesitar un tipo de
prop nuevo, y el código de uso (`snippet()`) sigue siendo una sola línea de JSX copiable.

**Encajan en el resto del sistema sin código extra.** Al no excluirse de `canWrapFx` (Playground.tsx), cualquier
sección admite entrada/salida y hover por el panel «FX» igual que cualquier otro componente (§6.1); al llevar
`variant`, entran en el comparador de los 7 estilos. No tienen escena en `lib/catalog/scenarios.tsx` porque ya SON la
escena — envolver un `Hero` en un hero de demostración no aporta nada.

**`ui-center--top` en vez de `ui-center`.** Los demás componentes se ven bien centrados en su escenario; una sección
de ancho completo (`width: 100%`) no: se envuelve en `<div className="ui-center ui-center--top" style={{ padding: 0,
justifyItems: "stretch" }}>` para que se ancle arriba y ocupe todo el ancho, en vez de flotar centrada con el padding
por defecto de 24px.

### 11.1 Tarjetas y secciones de precios y artículos

- **`PricingCard`**: `layout` `classic | compact | horizontal`; el plan destacado se marca con `highlight`
  `invert` (fondo de acento, por defecto en `PricingSection`) · `glow` · `border`; `originalPrice` tachado, `note`,
  `description`, y características no incluidas empezando la línea por `-`.
- **`PricingSection`**: `layout` `grid | list | carousel`. Si algún plan trae precio anual (7.º campo), aparece el
  selector **Mensual / Anual** (`yearlyNote` para la etiqueta de ahorro).
- **`BlogCard`**: cabecera de imagen (`image`, URL o `gen:N`), trama o caracteres; `layout`
  `stacked | horizontal | overlay | minimal`; `author` con avatar; `href` convierte toda la tarjeta en enlace. Siempre
  alineada a la izquierda, aunque la sección centre su texto.
- **`ArticlesSection`**: `layout` `grid | featured | list | carousel` (`featured`: el primero grande con la imagen de
  fondo y el resto en columna); 6.º campo imagen y 7.º enlace; `vary` alterna trama y acento.
- Los datos por defecto se exportan (`DEFAULT_PLANS`, `DEFAULT_ARTICLES`) y el catálogo los reutiliza: no copies
  los mismos textos en `lib/catalog/entries/`, se desincronizan.

## 12. Overlays: diálogos, notificaciones y ayuda contextual

Categoría `overlays` (`lib/catalog/entries/overlays.tsx`, `components/ui/{Modal,Toast,Tooltip,Drawer}.tsx`): lo único del
catálogo que aparece *encima* de la página en vez de dentro de su flujo normal.

**`position: fixed`, no portal.** `Modal` y `Drawer` gestionan su propio `open` (un botón lo activa, Escape o el
fondo lo cierran) y pintan un fondo + panel con `position: fixed`. Al ser `fixed`, escapan de cualquier ancestro con
`overflow` — incluido `.ui-center` (`overflow: auto`) y `.pg__cell` (`overflow: hidden`) del propio catálogo — sin
necesitar `createPortal`: verificado en Chrome, el fondo cubre el viewport completo y el panel se centra respecto a
él, no respecto al escenario donde vive el botón que lo abre. Sí haría falta un portal si contenedores intermedios
usaran `transform`/`filter`/`backdrop-filter`/`will-change` (crean un nuevo *containing block* que `fixed` no puede
atravesar). Ojo: la variante `glass` lleva `backdrop-filter`, igual que muchas cabeceras con blur. Un overlay que viva
*dentro* de una superficie así (la paleta ⌘K y el cajón móvil de `NavBar`) sale a `document.body` con `createPortal` y
lleva los tokens copiados en línea con `themeSnapshot(el)` (`lib/ui/themeSnapshot.ts`), para no perder el tema.

**`Toast` se apoya en una librería consolidada (`sonner`) en vez de reimplementarla.** Apilado de varias
notificaciones, gestos táctiles para descartar, temporizador de autocierre, pausa al pasar el ratón y accesibilidad
son un problema ya resuelto por una librería con mucho uso real detrás; reimplementarlo no habría añadido nada al
kit. Lo que sí es del kit es el aspecto: `<Toaster toastOptions={{ unstyled: true, classNames: {...} }}>` apaga los
estilos propios de sonner y les pone las clases `ui-toast*`, que leen los mismos tokens y `--s-*` que todo lo demás
— por fuera es indistinguible de un componente nativo del kit, por dentro delega en sonner. Cada instancia lleva su
propio `id` (`useId()`) pasado como `toasterId` en cada llamada a `toast()`, para no cruzarse con otras instancias:
importa en «Comparar los estilos», donde conviven varios `<Toaster>` a la vez.

**Toast en cualquier tema** — tres trampas resueltas en el componente, no en cada proyecto:
- `unstyled` no quita la fuente que sonner fija en `[data-sonner-toaster]` (sans del sistema): `Toast` pasa
  `style={{ fontFamily: "inherit" }}` al `<Toaster>` y `.ui-toast` usa `--s-ff`, así sale en la fuente de la variante o del tema.
- Un toast flota sobre contenido arbitrario, pero `outline`/`minimal` tienen `--s-bg` transparente y `glass`/`neon` casi:
  `.ui-toast` redefine `--s-bg` opaco en esas variantes (glass al 72 % para que se note el blur) y el tinte de
  `intentStyle="tint"` es una capa de gradiente más del `background`. **Nunca `::before`/`::after` en el toast**: sonner
  los usa como zona de gesto (al arrastrar los estira a 3× y al cerrar a 2×) y lo que se pinte ahí se desborda. Tampoco se
  toca `position`: sonner necesita el toast en `absolute` para apilarlo y animarlo.
- El color de estado choca en temas monocromos: `intentStyle` = `bar` (barra con el estilo de borde de la variante,
  punteada en dotmatrix) · `icon` · `tint` · `mono` (sin color de estado). `icons` = `auto` (glifos de texto `✓ i ! ×` en
  terminal, retro y dotmatrix; svg en el resto) · `svg` · `glyph` · `none`. Además `closeButton`, `duration` (s),
  `actionLabel` + `onAction` y `expand`.

**Cuándo usar cada uno.** `Alert` (Feedback) es inline y permanente — vive en el sitio, no desaparece solo. `Toast`
(Overlays) es flotante y temporal — se autodestruye. `Modal` interrumpe y exige una decisión antes de seguir.
`Drawer` es un `Modal` con forma de panel lateral, para listas más largas (menú, filtros, carrito) que un cuadro de
diálogo no aloja bien. `Tooltip` no interrumpe nada: aparece con `:hover`/`:focus-visible`, es CSS puro sin JS.

## 13. Listas como datos: el mismo patrón en formularios y navegación

`Select`, `CheckboxGroup`, `RadioGroup`, `Breadcrumbs` y `Dropdown` seleccionan/muestran varias opciones a partir de
una prop de texto simple (`"España, Francia, Portugal"`, separada por comas) en vez de recibir `children` — el
mismo principio que `Accordion`/`PricingSection` (guía §11): el panel de props del catálogo solo sabe generar
controles para tipos primitivos, así que una lista sigue siendo editable como texto plano. `Select` es un ejemplo de
cuándo NO usar el elemento nativo: un `<select>` no se puede reskinar por dentro (la lista abierta la pinta el
sistema operativo), así que es un botón + una lista absoluta con `role="listbox"`, para tener el mismo aspecto en
los 7 estilos abierto o cerrado — `Dropdown` (menú de acciones, no de valores) sigue el mismo patrón.

**Listas que avisan.** Los campos siguen gestionando su propio estado (el catálogo no necesita cablear nada), pero ya no
son solo decorativos: `TextField`, `Select`, `CheckboxGroup`, `RadioGroup`, `Tabs` y `Pagination` aceptan `onChange`, y
`TextField`/`Select` también `value` para controlarlos desde fuera. `Hero` y `CTASection` llevan `primaryHref`/`secondaryHref`
(u `onPrimary`/`onSecondary`), `Footer` admite `Etiqueta=/ruta` en sus columnas y `PricingSection`, `cta`, `ctaHref` y
`onSelectPlan`. Es lo que usan las webs completas (`docs/03-webs-completas.md`) para buscar, filtrar, paginar y navegar.

**`NavBar` lleva la sintaxis más completa del patrón**, porque una barra moderna necesita jerarquía: enlaces simples
separados por comas (lo de siempre) o una sección por línea con submenú, `Sección > Hijo; Hijo|descripción|icon:nombre`
(hijos por `;`, campos por `|`). Dentro de un submenú, `#Categoría` abre una columna con título (mega menú por
categorías; en móvil, subtítulos dentro del acordeón). `Etiqueta=/ruta` o `=#id` lo convierte en enlace real (sin `=`,
un botón que solo marca el activo) y `Etiqueta [nuevo]` le pone insignia.

Tres ejes independientes de aspecto, además de la variante:
- **`layout`** (disposición): `classic` · `left` · `right` · `center` · `split` (marca centrada) · `stacked` (dos filas:
  marca, búsqueda ancha y acciones; debajo las secciones) · `minimal` (marca + menú, siempre plegada).
- **`slots`** (orden libre, sustituye a `layout`): piezas `brand links search actions spacer menu` separadas por espacios;
  `|` abre otra fila y `/` separa columnas (grid `1fr auto 1fr`: izquierda · centro · derecha). `layout` no es más que
  un nombre para un `slots` (`LAYOUTS` en `NavBar.tsx`); una disposición nueva es una línea ahí.
- **`shape`**: `island` (por defecto: el aspecto de siempre, con el radio de la variante) · `full` · `contained` (contenido
  a `--nav-max`) · `floating` (píldora) · `transparent` (sin fondo hasta bajar) · `underline`. Y `size` = densidad.

Búsqueda: `search` = `bar` (barra ancha) · `inline` (campo compacto) · `button` / `command` (paleta ⌘K y «/»); busca en
secciones, hijos, categorías y `searchItems`. Plegada, cualquier búsqueda pasa a icono → paleta y además aparece como
campo arriba del menú móvil. Resto: `onNavigate`, `onSearch`, `activeOn="scroll"`, CTA secundaria, `announcement`,
`sticky` + `scrollFx`, `children` para acciones propias. El plegado mide el **contenedor** (`collapseAt`), no la ventana,
y deja una sola fila (marca · búsqueda · menú); el menú móvil (`drawer` o `sheet`) lleva búsqueda, secciones en acordeón
y botones a todo el ancho. El activo se marca con `[data-current]` (vale para `<a>` y `<button>`): no uses
`aria-current` en CSS.

## 14. Scrollbars personalizadas

Cualquier área con overflow del kit (la lista de `Select`, el `<pre>` de `CodeBlock`, el body de `Modal`/`Drawer`,
el propio escenario `.ui-center`…) pintaba con la barra de desplazamiento del sistema operativo — desentona con el
resto, que no tiene ni un solo color o forma sin pasar por un token. Está resuelto a dos niveles, en `components/ui/styles/ui-kit.css`:

1. **Base neutra**, para lo que no vive dentro de una superficie con estilo (`.ui-center`, el body de un `Modal`
   largo): usa tokens (`--ln`, `--acc`) pero no `--s-*`, así que es la misma en los 7 estilos.
2. **Por estilo**, bajo cada `.ui-s--<variante>`: la barra de scroll es una pieza más del lenguaje visual de ese
   estilo, igual que `--s-bd`/`--s-sh` — *glass* es fina y translúcida, *solid* gruesa y opaca con borde, *outline*
   un hilo de acento sin radio, *neón* brilla (`box-shadow` con `--acc`), *retro* es gruesa con textura de rayas y
   pista oscura, *terminal* es fina y cuadrada, *minimal* casi invisible.

**Dos capas de CSS necesarias, no una.** Firefox usa las propiedades heredadas `scrollbar-width`/`scrollbar-color`
(dos colores, sin más control); Chrome, Edge y Safari solo entienden los pseudo-elementos `::-webkit-scrollbar-*`,
que **no se heredan** — hay que declararlos con el propio selector (`.ui-s--neon::-webkit-scrollbar-thumb`, para
cuando la superficie misma scrollea, como `.ui-select__list`) **y** con el combinador descendiente
(`.ui-s--neon ::-webkit-scrollbar-thumb`, para cuando lo que scrollea es un hijo suyo, como el `<pre>` de
`CodeBlock` dentro de `.ui-code`). Se verificó con `getComputedStyle(el, "::-webkit-scrollbar-thumb")` en Chrome
— el único modo fiable de comprobar un pseudo-elemento así, ya que no aparece en ninguna captura del DOM ni en el
árbol de accesibilidad — que las 7 variantes producen anchura, color, radio y sombra distintos.

**`ScrollArea`** (categoría Interacción) es el componente que lo demuestra y lo deja listo para usar directamente:
una caja de contenido largo (registro de cambios, comentarios, salida de terminal) con altura fija. No inventa la
barra — cualquier superficie `ui-s--<variante>` ya la hereda sin este componente — es solo el envoltorio con overflow
y una altura para el caso de uso real más común (una lista larga en un hueco corto).

## 15. Una página real con el kit: CIPHERGRID

`components/landings/CyberpunkLanding.tsx` (demo `/demo/th-ciphergrid`, familia `landing`, `render: "kit"` en
`lib/demos-kit-landing.ts`) es una landing de 300vh construida solo con `components/ui/`, sin recurrir al sistema
bespoke de `ThemedLanding`. Sirve como caso de prueba real: componer una página entera con el kit sacó a la luz dos
huecos reales en la propia API de los componentes, corregidos aquí (no solo documentados):

- **`Modal` ganó un modo controlado** (`open` + `onOpenChange` + `onConfirm` + `onCancel`, todos opcionales). Sin
  `open`, se comporta exactamente igual que antes (pinta su propio botón `triggerLabel`, lleva su estado). Con `open`,
  dejó de pintar ese botón — es el proyecto quien decide cuándo se abre (p. ej. al enviar un formulario) — y
  avisa de cada acción por los callbacks. Sin este cambio no había forma de abrir el diálogo desde un botón que no
  fuera el suyo propio, ni de reaccionar a "confirmar" (el caso de uso real más común: confirmar y luego hacer algo).
- **`Toast` dejó de dispararse solo al montar.** Igual que `Modal`/`Drawer` ya exigían `playKey > 0` para abrirse
  desde fuera, `Toast` ahora sigue el mismo criterio: sin él, montar el componente para tener el `<Toaster>` listo
  disparaba una notificación vacía en cuanto cargaba la página. También ganó `id` (para que código externo lance en
  la misma instancia con `toast.success(msg, { toasterId })`) y `showTrigger` (oculta el botón de demostración
  cuando el disparo lo controla el proyecto, no el propio componente).

**Fondo reactivo al scroll, sin montar cinco motores a la vez.** En vez de tener las cinco escenas de fondo
montadas en todo momento (caro: cada `AsciiBackground` corre su propio bucle de dibujo), solo hay una activa —
mismo principio que `ThemedLanding.setScene()`, con piezas del kit en vez de canvas a medida: un único
`IntersectionObserver` observa marcadores al principio de cada tramo de la página y decide qué escena mostrar;
`SceneFlash` disimula el cambio con una transición corta (`playKey={act}`, se dispara solo con que el número cambie).

**Trampa real encontrada al verificar**: los marcadores llevaban `position: absolute; top: 0`, que los saca del
flujo normal — los cinco acababan en el mismo punto (el `top: 0` de su ancestro posicionado más cercano, no "donde
están en el documento"), así que el fondo nunca cambiaba de la primera escena. Se corrigió dejándolos como bloques
normales del flujo (`display: block`, sin `position`), cada uno en su sitio real de la página. Verificado midiendo
`getBoundingClientRect().top` de los cinco marcadores en Chrome antes y después.

**Otra trampa real, de contenido**: varios `SectionHeader` propios de la página no llevaban `subtitle`, así que
mostraban el subtítulo por defecto del componente (copy de la demo de surf del catálogo) en medio de una landing de
cyberpunk. `SectionHeader` es un componente atómico con un valor por defecto pensado para su propia demo — a
diferencia de las "secciones" compuestas (`Hero`, `FAQSection`…), que se diseñaron con `subtitle = ""` por defecto
para evitar justo este problema. Al usar un átomo directamente (no envuelto en una sección compuesta), hay que
rellenar sus props de texto explícitamente o pasar cadena vacía — no dar por hecho que "no pasar la prop" es
inofensivo.

## 16. Mobile: dos reglas para cualquier grid o texto "sin superficie" nuevo

El usuario probó CIPHERGRID en el móvil y encontró dos problemas reales, de los que no libra ningún componente
nuevo que se salte estas dos reglas — quedan aquí para no repetirlos:

**1. Todo grid con `minmax(Npx, 1fr)` que pueda acabar como hijo de otro grid necesita `min-width: 0`.** Un grid
que a su vez es *item* de un grid exterior tiene, por defecto, `min-width: auto` — el navegador no lo encoge por
debajo del ancho mínimo de SU PROPIO contenido, y si ese contenido es otro grid con columnas `minmax(220px, 1fr)`,
su mínimo es `nº de columnas × 220px`, no `0`. Resultado: en pantallas estrechas, el grid interior nunca colapsa a
una columna — se sale del contenedor entero, silenciosamente (`overflow-x: hidden` en `html`/`body`, guía §14, lo
recorta en vez de mostrar una barra), así que ni siquiera se nota con una barra de scroll horizontal. Le pasaba a
`.ui-feats__grid`, `.ui-pricing__grid`, `.ui-testimonials__grid`, `.ui-team__grid`, `.ui-articles__grid` — todas
las "secciones" con un grid de tarjetas — y a `.ui-sh` (`SectionHeader`, cuyo `width: min(100%, 560px)` tampoco
se libra del mismo problema). Corregido añadiendo `min-width: 0` a los cinco `__grid` y a `.ui-sh`. Cualquier grid
o flex nuevo que pueda anidarse dentro de otro (prácticamente cualquier "sección" o layout de página) debe llevar
`min-width: 0` por la misma razón, aunque hoy no se note en ningún sitio — no se nota hasta que alguien lo usa en
un contexto más estrecho.

**Cómo se depuró sin un viewport móvil real**: `resize_window` no cambia el viewport real en este entorno de
pruebas (pantalla virtual fija; `window.innerWidth` no se movía por mucho que se le pidiera). En su lugar, un
`<iframe>` de 375px de ancho apuntando a la misma URL SÍ tiene su propio viewport independiente para media
queries y para `min-width: auto` — `iframe.contentDocument.body.scrollWidth` frente a
`iframe.contentWindow.innerWidth` dio la prueba exacta (956px de contenido en un viewport de 371px) y, tras la
corrección, la confirmación (362px, ya sin desbordar). Vale la pena recordar esta técnica para la próxima vez que
haga falta depurar responsive sin una ventana redimensionable de verdad.

*Tres casos más de la misma familia, encontrados al construir MYCEL y FOLIO* (todos con la técnica del `<iframe>`
de 375 px, que además mostraba qué elemento se salía):
- **`min-width: 0` en el contenedor no basta: cada hijo directo de un grid es a su vez un *grid item* con su propio
  `min-width: auto`.** Un `Alert` dentro de una columna de panel (`.x-dash-col`) seguía saliéndose 16 px con la
  columna ya corregida. Las columnas de panel de las tres landings llevan ahora `min-width: 0` y
  `.x-dash-col > * { min-width: 0 }`.
- **Un hijo flex con `flex: 1` y sin `min-width: 0` tampoco encoge** (`.ui-alert__body`).
- **El arte en `<pre>` (`BitmapText`, `AsciiChart`, el número grande de `StatCounter`) no puede reflotar**, y
  `overflow: hidden` no basta: recorta lo pintado pero la caja sigue midiendo su ancho natural y empuja la
  página (un `BitmapText` de 17 letras medía 838 px en un móvil de 372). Llevan `max-width: 100%` +
  `overflow-x: auto`: no se sale de la página y el texto completo sigue accesible con scroll horizontal.

- **`position: sticky` deja de pegarse si el `body` es un contenedor de scroll.** `html.scrollable body` tenía
  `overflow-x: hidden; overflow-y: auto` para recortar el desborde horizontal; con la altura de todo el contenido
  el body nunca scrollea, pero pasa a ser el ancestro respecto al que se calcula el `sticky`, y las cabeceras de
  CIPHERGRID/MYCEL/FOLIO se iban con la página. Se detecta con `getBoundingClientRect().top` de la cabecera tras
  hacer scroll (valía `-scrollY` en vez de `0`). Ahora el body usa `overflow-x: clip` (recorta sin crear contenedor
  de scroll) y solo `html` scrollea. En móvil, además, el HUD de la demo (`.hud__title`) se partía en cuatro
  líneas: ahora una fila con el título recortado con puntos suspensivos; y los rótulos `BitmapText` de las
  landings escalan con el ancho de la ventana (`clamp(6px, 1.7vw, 11px)`).

**2. Ningún texto "sin superficie" ni ninguna variante "transparente" tiene por qué ser legible por sí sola contra
cualquier fondo — necesita una red de seguridad, y la primera línea de defensa es el fondo, no la red.**
`SectionHeader`, `Hero` (con `backdrop="none"`), `LogoCloud`, `Divider`, `Typewriter`… están pensados para poder
sentarse encima de un componente de la categoría **Fondos** (es el caso de uso que los justifica, guía §7), y un
fondo puede ser cualquier cosa — no solo el `--bg` liso de un tema. Y `outline` y `minimal` son las dos únicas
variantes con `--s-bg: transparent`: cualquier cosa que las use (tarjetas, pestañas, acordeones, paginación…)
depende igual de por completo de lo que haya detrás.

*Qué se hace.* Un token `--legibility-ts` (`:root`, `components/ui/styles/ui-kit.css`): un halo con el propio `--bg` del tema, dos
capas (1 px y 3 px de desenfoque, con alfa reducida), como lista de `text-shadow`. Lo llevan los textos sueltos
(`.ui-sh`, `.ui-hero`, `.ui-logos`, `.ui-div`, `.ui-type`) y, una sola vez, las propias variantes
(`.ui-s--outline, .ui-s--minimal { text-shadow: var(--legibility-ts); }`): `text-shadow` es una propiedad
heredada, así que alcanza a todo el texto de dentro sin añadir la clase componente a componente — que es como
se olvidó primero en `FeatureGrid` y `TeamSection` en variante `outline`. Un componente nuevo con texto pintado
directamente sobre el fondo de la página (sin `ui-surface` propio) tiene que llevar
`text-shadow: var(--legibility-ts)` él mismo. Invisible sobre un `--bg` liso (la sombra es del color de lo que
hay detrás — por eso no cambia nada en el catálogo). Quien quiera el look sin halo, a propósito, sobrescribe
`--legibility-ts: 0 0 transparent` en su contenedor.

*Lo que NO funcionó, en el orden en que se descubrió — para no repetirlo.*
1. **Halo fuerte (6 capas de `drop-shadow`) para compensar un fondo cargado.** Legible, pero el usuario lo rechazó
   con razón: «no es una solución limpia, mete fondos más sencillos». El halo agresivo tapando un fondo demasiado
   denso se ve peor que el problema. La solución fue cambiar el fondo (celdas grandes, `dots`/`lines`,
   `GridBackground` alternado con `AsciiBackground` en su estilo más simple, opacidades 0,22–0,5), y dejar el halo
   como toque final ligero.
2. **`filter: drop-shadow()` sobre texto.** En Chromium el filtro fuerza un compositado que suaviza los glifos:
   con texto oscuro sobre un tema claro (FOLIO) se leía borroso por pequeño que fuese el radio, y solo desaparecía
   quitando el filtro por completo (comprobado activando y desactivando `--legibility` desde la consola). Con
   texto claro sobre fondo oscuro no se nota — el halo oscuro casi no se ve sobre los glifos —, por eso no salió
   antes. `text-shadow` no tiene ese efecto. `filter` se había elegido en su día porque
   `text-shadow: var(--s-ts), <sombra>` se invalida si `--s-ts` vale la palabra clave `none`; se resolvió en la
   raíz: **`--s-ts` es siempre un `<shadow>` válido** (`0 0 transparent` cuando el estilo no tiene sombra), nunca
   `none`, así que la lista se puede combinar.
3. **Antes de dar por buena una corrección de legibilidad, mírala con un tema claro Y uno oscuro.** El sistema
   entero se había afinado solo con fondos oscuros; FOLIO existe como prueba de que no basta.

## 17. Pixel art: iconos, marcos y sprites

Categoría `pixel` del catálogo (`lib/catalog/entries/pixel.tsx`): tres componentes que traen pixel art hecho a mano en
lugar de imitarlo con filtros. Se eligieron tras comparar los packs que existen de verdad (no todo lo que se llama
«pixel» sirve para un kit basado en tokens):

| Pack | Licencia | Formato | Veredicto |
|---|---|---|---|
| **Pixelarticons** (`pixelarticons`) | MIT, sin atribución | SVG puro + React + webfont | **Elegido** para `Icon`: `fill="currentColor"`, se tiñe con el tema |
| HackerNoon Pixel Icon Library | CC BY 4.0 (atribución obligatoria salvo pago) | SVG + webfont | Descartado: obliga a acreditar en cada sitio que lo use |
| NES.icons / NES.css | MIT | PNG (`background-image`) | Descartado: un PNG no se puede teñir con `--acc`; solo decorativo |
| **Kenney «Pixel UI»** | CC0 | PNG (9 cortes + hoja de sprites) | **Elegido** para `PixelFrame` y `Sprite`: es UI ya dibujada, no un set de iconos |

**`Icon`** (`components/ui/Icon.tsx`). Registro **curado** de 119 de los ~640 iconos base (`lib/ui/icons.ts`, agrupados
en `ICON_GROUPS`; claves = kebab-case del nombre en Pixelarticons). Dos razones para curar y para importar cada icono
por su ruta profunda (`pixelarticons/react/Heart`) en vez del barrel `pixelarticons/react`: el paquete no declara
`sideEffects: false`, así que el barrel puede meter los 1037 componentes en el bundle de cualquier página que use uno;
y un `select` de 640 nombres no es un selector. Lo que no esté en el registro no necesita tocarlo: `<Icon icon={Zap} />`
acepta cualquier componente del paquete (también las variantes `…Solid` y `…Glyph`). Props: `name`, `icon`, `iconSize`
(número o longitud CSS, `"1.25em"` para seguir al texto), `sharp` (esquinas duras; solo 52 de los 119 tienen esa
variante, el resto se queda como está), `tone` (token del kit; sin él hereda `currentColor`) y `label` (sin él es
decorativo, `aria-hidden`). Se dibujan sobre una rejilla de 24: múltiplos de 24 px dan píxeles del mismo tamaño;
`shape-rendering: crispEdges` mantiene los bordes nítidos con cualquier otro tamaño (con píxeles algo desiguales).

**Iconos donde antes había glifos de texto.** Los componentes del kit que reciben un carácter como texto aceptan
también un icono con la sintaxis `icon:nombre` (o `icon:nombre:sharp`), resuelta por `renderGlyph()` (en `Icon.tsx`):
`Button`/`MagneticButton` (`glyph`), `FeatureGrid` (el primer campo de cada `item`), `Timeline` (`glyph`, con
`marker="glyph"`) y `Footer` (`social`). Cualquier otra cadena pasa tal cual, así que nada de lo existente cambia; un
nombre que no está en el set se pinta como texto para que el error de tecleo se vea. Ejemplos vivos: CIPHERGRID
(`icon:lock:sharp`, `icon:terminal:sharp`, `icon:zap`, `icon:arrow-right`, `icon:github`) y FOLIO
(`icon:hourglass:sharp`, `icon:file-text:sharp`, `icon:pencil`, `icon:bluesky`). Coste asumido: como `Button` lo
importa, toda página que use un botón carga el registro de iconos (~110 KB sin minificar, unos 35 KB comprimidos).

**`PixelFrame`** (`components/ui/PixelFrame.tsx`). Panel de 9 cortes con `border-image` y las piezas de Kenney
(`public/pixel/kenney-pixel-ui/9-slice/`, tres pieles —`colored`, `outline`, `ancient`— y 13 combinaciones de
color, cada una con versión `pressed`). El marco ocupa `16 × escala` px por lado (`scale` 1–4; con enteros cada
píxel del sprite son exactamente N píxeles CSS). Tres decisiones que no son obvias:
- **Legibilidad por defecto:** el relleno de las 13 combinaciones es opaco y de tono medio o claro (medido con
  `sharp` en el centro de cada PNG; negro sobre ellas da ≥ 4,5:1), así que el texto no depende de lo que haya
  detrás. `.ui-pframe` **sustituye la paleta del kit** por una de tinta sobre papel dentro del marco
  (`--bg: #eee; --fg: #000; --acc: #111…`): los componentes de dentro leen esos tokens y se leen sobre el marco, no
  sobre la página. Los acentos también pasan a tinta a propósito — un acento de tema (cian, rosa neón…) sobre un
  marco azul u ocre no llega a contraste, y la legibilidad manda. La variante `neon` no es legible ahí dentro
  (su fondo es `rgba(0,0,0,.42)` fijo); usa `solid`, `outline`, `minimal`, `glass` o `retro`.
- **Rendijas con escala de pantalla fraccionaria.** Con 110 %, 125 %, 150 % (lo normal en Windows) el navegador
  deja una línea de 1 px entre las 9 regiones del `border-image` y se ve la página a través de ellas — lo vimos
  sobre un fondo magenta de prueba con `devicePixelRatio` 1,1. Se tapan pintando el color de relleno de cada
  marco (`PIXEL_FRAME_SKINS[skin].fills`) DETRÁS del `border-image`, recortado 3 píxeles de sprite hacia dentro
  para no invadir el aro exterior ni sus esquinas redondeadas. Si añades una piel nueva, mide su color de relleno
  y añádelo ahí, o volverán las rendijas.
- **Las imágenes llegan por variable inline** (`--pf-img`, `--sp-img`), no con `url()` en `ui-kit.css`, para que
  el empaquetador de CSS no intente resolver una ruta de `/public`.

**`Sprite`** (`components/ui/Sprite.tsx`). Una baldosa 16×16 de la hoja `spritesheet/sheet.png` (30 columnas × 33
filas, 16 px con 2 px de margen). Son píxeles ya coloreados: **no se tiñen** con el tema (a diferencia de `Icon`).
El catálogo (`/componentes#sprite`) dibuja la hoja entera con la baldosa elegida enmarcada, que es la forma de
encontrar las coordenadas. Las versiones «inlay» (44 px) del pack de 9 cortes no se usan.

**Licencias y créditos.** Pixelarticons: MIT, © Gerrit Halfmann. Kenney «Pixel UI»: CC0 (el crédito no es
obligatorio; el `License.txt` original vive en `public/pixel/kenney-pixel-ui/`). Ninguna de las dos exige
atribución visible; si algún día se sustituye por un pack CC BY, habrá que acreditarlo en el pie.

**Añadir un icono al registro:** un `import` profundo, una línea en `ICONS` y su clave en `ICON_GROUPS`
(`lib/ui/icons.ts`). Para comprobar que el nombre existe: `ls node_modules/pixelarticons/react/<Nombre>.js`.

## 18. Galerías y carruseles (Swiper)

`swiper` (https://swiperjs.com/) es la dependencia para todo lo que se desliza. Se usa a través de dos componentes; el resto del kit
nunca importa `swiper` directamente.

| Componente | Para qué |
|---|---|
| `Carousel` | Carrusel genérico: cada hijo es una diapositiva. `perView` (baja solo a 2 y 1 en pantallas estrechas), `gap`, `loop`, `autoplay` (segundos), `arrows`, `dots` (`bullets` · `progress` · `fraction`), `effect` (`slide` · `fade` · `cards`) y `ticker` (cinta continua sin controles). |
| `ImageGallery` | Ocho presentaciones de las mismas imágenes: `thumbs`, `coverflow`, `cards`, `fade`, `cube`, `creative`, `filmstrip` y `mosaic`. Imágenes como «imagen\|título\|texto»; `gen:N` da una escena pixel art generada (`lib/ui/placeholder.ts`) para no depender de archivos. |

**Las secciones lo reutilizan con una prop.** `TestimonialSection` (con `effect`), `FeatureGrid`, `PricingSection`, `TeamSection` y
`ArticlesSection` aceptan `layout="carousel"` (más `perView` y `autoplay`); `LogoCloud` acepta `layout="ticker"`. Con `layout="grid"`
(el valor por defecto) el resultado es el de siempre. Para dar carrusel a otra sección, construye su lista de tarjetas y pásala a
`<Carousel>` en vez de a la rejilla.

**Estilo.** Las flechas, los puntos y las imágenes leen las variables `--s-*` de la variante (borde, radio, sombra) y los tokens
(`--acc` para el activo, `--fg` para el inactivo): se define en `components/ui/styles/ui-carousel.css`, una vez, con los prefijos `ui-car` y `ui-gal`.
Las variables propias de Swiper (`--swiper-navigation-color`, `--swiper-pagination-*`) se fijan ahí a los tokens; no las cambies por
componente. El CSS base de Swiper se importa en `components/ui/swiperCss.ts`.

**Detalles que evitan sorpresas**
- Cambiar módulos o efecto exige montar de nuevo el `<Swiper>`: ambos componentes lo hacen con una `key` calculada.
- `overflow: hidden` de Swiper recortaría la sombra dura de las tarjetas: `.ui-car .swiper` lleva relleno para dejarla respirar.
- El bucle solo se activa si hay más diapositivas que visibles; la cinta continua triplica las suyas para no dejar huecos.
- Con `prefers-reduced-motion` la reproducción automática y la cinta se detienen (los carruseles y galerías siguen siendo arrastrables y con flechas; la cinta queda fija).
- `thumbs` no admite `loop` (Swiper no sincroniza miniaturas con bucle) y el zoom solo existe en `thumbs` y `fade`.

## 19. Vídeo: por qué un componente propio y no una librería

`VideoPlayer` está hecho desde cero sobre el `<video>` nativo. Se valoraron las alternativas:

| Opción | Veredicto |
|---|---|
| `<video>` nativo + controles propios (elegida) | 0 kB de dependencias, el archivo `.mp4`/`.webm` cubre héroes, demos y testimonios, y los controles salen del propio kit (cuadrados, `--s-*`, tokens). Coste: unas 300 líneas que mantener. |
| `react-player` | Un solo componente para muchas fuentes, pero trae los reproductores de cada proveedor y sus controles no se adaptan al estilo. Sobra para lo que se necesita. |
| Vidstack / Media Chrome | Muy buenos y themables (Media Chrome, con variables CSS y piezas web-component), pero añaden una capa de abstracción y ~30–60 kB para conseguir algo que aquí ya son unos pocos botones. Serían la opción si hicieran falta analíticas, listas de reproducción o DRM. |
| Video.js / Plyr | Tema propio difícil de encajar en el sistema `--s-*`; Plyr apenas se mantiene. |
| `lite-youtube-embed` | Hace justo lo que hace la carátula de YouTube del componente (imagen hasta pulsar, iframe sin cookies después), pero son ~10 líneas: se escribieron en `EmbedFrame`. |

**Cuándo replantearlo:** si se necesita streaming adaptativo (HLS/DASH) — Chrome y Firefox no lo reproducen nativamente: añadir `hls.js` con
`import("hls.js")` dinámico solo cuando `src` acabe en `.m3u8` (y Safari sigue usando el nativo) — o vídeo con DRM, o más de un proveedor
externo con API de control (ahí sí compensa `react-player` o Vidstack).

**Cómo se usa.** `src` puede ser un archivo o un enlace de YouTube/Vimeo (`parseEmbed` los reconoce). Con `background` rellena su contenedor
(mismo patrón que los fondos de escena: `position: absolute; inset: 0`), mudo, en bucle y decorativo. Sigue las reglas del kit: se pausa fuera
de pantalla (`pauseOffscreen`), respeta `prefers-reduced-motion` (no hace autoplay ni arranca el fondo), el texto real está en el DOM y es
operable con teclado (espacio/K, ←/→, J/L, ↑/↓, M, F, C y 0–9). Estilos en `components/ui/styles/ui-video.css` (prefijo `ui-vid`).

**Muestras.** El visor cambia entre dos vídeos de Cloudinary (`cld-sample-video`, `sea-turtle`), uno local (`public/video/pixel-life.mp4`, 8 s,
sin audio, generado con ffmpeg y el filtro `life`, para poder trabajar sin red) y un enlace de YouTube. Para un vídeo de Cloudinary la carátula sale
de un fotograma del propio vídeo con `cloudinaryPoster(src)`.

**Efecto ASCII opcional (`ascii`).** `asciify-engine` (Studio) toma el propio `<video>` como fuente y pinta el resultado en un lienzo encima; el
vídeo original sigue reproduciéndose debajo, sin ocultar. Se elige el estilo (`asciiStyle`, los mismos que `AsciiBackground`), la celda
(`asciiCell`) y el color (`asciiColor`). Detalles que importan:
- El motor lee píxeles del vídeo, así que el `<video>` se monta con `crossOrigin="anonymous"` y el servidor debe enviar CORS (Cloudinary y los archivos
  del propio sitio lo hacen). Si no, el componente lo detecta, avisa y reproduce el vídeo normal.
- El lienzo se pausa con el vídeo (y se repinta al saltar con la barra) para no gastar CPU en un fotograma que no cambia.
- **Hover** (`asciiHover`, `asciiHoverStrength`, `asciiHoverRadius`): los mismos efectos que los fondos (`trail`, `water`, `contour`, `dissolve`, `silk`, `vortex`). El
  motor lee el puntero del propio lienzo, así que con hover activo el lienzo recibe los eventos del puntero y reenvía el clic al reproductor. El lienzo corre
  solo si está a la vista y hay algo que animar (vídeo en marcha o hover), no mientras está parado sin efecto.
- No aplica a YouTube/Vimeo (el iframe no da acceso a los píxeles).
- La capa superpuesta deja pasar los clics, así que el vídeo original está listo para revelarse en una iteración futura (por ejemplo, con una máscara
  radial que siga al puntero sobre el lienzo).

## 20. Fondo de página detrás del contenido (`position` e `interaction`)

Caso de uso habitual: un fondo (`TextmodeBackground`, `AsciiBackground`, `GridBackground`) que cubre toda una página larga, con secciones
y tarjetas encima. Con el comportamiento por defecto choca con dos cosas, y las dos son **normales, no un fallo de uso**:

1. **Colocación.** Por defecto un fondo es `position: absolute; inset: 0` y rellena su contenedor. Dentro de un contenedor que no mide
   lo que la página (un flex centrado, un `<main>` sin altura), se queda corto o desplazado. Un `z-index: -1` lo mete detrás del fondo
   del `<body>`, y un `bg-white` en el `<main>` lo tapa.
2. **Puntero.** Los motores (textmode.js y asciify-engine) escuchan el puntero **en su propio lienzo**. Si hay contenido encima, el
   lienzo no es el elemento bajo el puntero y no recibe nada: el fondo «no reacciona». Antes había que reenviar los eventos a mano
   desde la aplicación, con un selector interno (`.mi-fondo canvas`) y una página cliente solo para eso.

**Receta:**

```tsx
<div className="relative isolate">
  <TextmodeBackground sketch="starfield" position="fixed" />   {/* interaction pasa a "window" solo */}
  <main className="relative z-10">…contenido, sin fondo opaco…</main>
</div>
```

- **`position="fixed"`** (`absolute` por defecto): cubre la ventana y no se mueve con el scroll, sin depender del alto de ningún
  contenedor. Usa `z-index: 0`: el contenido debe llevar `position: relative` (y `z-index: 10` si hace falta) y ningún fondo opaco.
  Está en `TextmodeBackground`, `AsciiBackground` y `GridBackground` (este último es CSS puro y no recibe puntero).
- **`interaction`** (`canvas` | `window`): con `window` el fondo escucha el puntero en toda la ventana y se lo reenvía al lienzo
  (`lib/ui/pointerBridge.ts`), así reacciona aunque haya botones, tarjetas o texto encima, y **no bloquea ningún clic ni hover** (el
  lienzo pasa a `pointer-events: none`). Por defecto es `window` si `position="fixed"` y `canvas` en el resto.
- **Cómo funciona el puente:** escucha `pointermove/down/up/cancel` en la ventana y reenvía al lienzo, con `bubbles: false` y solo si
  el puntero está dentro de él, cada evento en su forma `pointer*` (asciify-engine) y `mouse*` (textmode.js). Al salir manda un solo
  `pointerleave`/`mouseleave`. Se limpia al desmontar y no duplica listeners si la prop cambia. Con dedo o lápiz reenvía también, pero
  textmode.js lee el táctil por sus propios eventos `touch*`, que no se reenvían.
- **Comprobado** (Chrome, con un elemento opaco encima del lienzo): `interaction="canvas"` → 0 eventos recibidos; `interaction="window"` →
  llegan `pointermove` y `mousemove`.

**Sigue siendo tu responsabilidad:** cargar el CSS del kit (`trama-ui/styles.css`) y el de tu aplicación, y no dar fondo opaco a las
capas de contenido. Con `interaction="window"` un fondo detrás no captura nada, pero las capas de contenido siguen recibiendo su hover.

## 21. Resolución de los fondos de caracteres (celda fina y decimales)

`cellSize` (`AsciiBackground`) y `fontSize` (`TextmodeBackground`) son **px CSS reales** y admiten decimales: desde 0,1 en la celda ASCII (suelo absoluto) y desde 1 en textmode.js.
Pasarle al motor el número tal cual no bastaba, porque asciify-engine (Studio) lo modifica sin avisar:

| Límite del motor | Efecto | Qué hace el componente |
|---|---|---|
| `cellSize` se recorta a **3–60** | «celda 1» se quedaba en 3 | **Sobremuestrea**: el motor pinta en un lienzo `s` veces mayor y el CSS lo reduce, así `unit / s` es la celda pedida. |
| Con `dither` se ignora `cellSize`; manda `dither.scale` (**entero 1–12**) | En dither la celda pedida no tenía efecto | Manda `dither.scale` y sobremuestrea para los decimales. |
| Lienzo interno de **960 px** (`maxDimension`) | En pantalla completa la celda salía ~1,8× mayor | Pasa `maxDimension: 4096`. |
| Rejilla de **12 000 celdas** (`maxCells`, máximo **160 000**) | Una celda «de 4 px» a pantalla completa acababa siendo de ~11 px | Sube `maxCells` lo justo para que quepa la celda pedida, hasta 160 000. Prop `maxCells` para acotarlo. |
| Modo adaptativo: baja el presupuesto (hasta 3 000 celdas) si el fotograma pasa de 13 ms | La resolución cae en equipos justos | Prop `adaptive` (por defecto sí, se lee al montar). |

**El límite real es el tope de 160 000 celdas:** la celda mínima alcanzable es √(ancho·alto / 160 000) px (×√1,65 en estilos de texto, que usan
celdas más altas que anchas): ≈ 3 px a pantalla completa (1736×808), ≈ 1,5 px en un escenario de 1390×420 y 1 px solo en elementos de
unos 400×400. Pedir menos no da error: la celda se agranda hasta ese mínimo. `lib/asciify/resolution.ts` (`planResolution`) hace la cuenta.

**Ver lo que pasa:** la vista previa de `/componentes` (Fondo ASCII) muestra «Celda X px pedida → Y px real», la rejilla resultante y un aviso
si el motor la ha limitado o si el modo adaptativo ha bajado el presupuesto (`onResolution` da esos datos a cualquier componente).

**Coste.** Con la celda fina hay más celdas por fotograma y las escenas se dibujan en un lienzo fuente más ancho (480 → hasta 1024 px). Antes, el
límite de 12 000 celdas y los 960 px hacían que el coste fuera casi el mismo con cualquier `cellSize`; ahora, celdas pequeñas = más GPU/CPU. Para
acotar: `maxCells`, o `adaptive` (dejar que el motor baje solo).

**textmode.js:** `fontSize` desde 1 con decimales; el componente agranda la celda si la rejilla pasaría de `maxCells` (por defecto 250 000) para no
congelar la página. La celda es unos 0,6× más ancha que alta.

## 22. Escenas 3D con filtro retro (react-three-fiber)

`RetroCanvas` convierte cualquier escena de react-three-fiber en pixel art, ASCII o ambos, con scanlines, viñeta, curvatura y
ruido de monitor CRT. Es la única parte del kit que usa `three` y `@react-three/fiber`; en el paquete npm son **dependencias
opcionales** y estos cuatro componentes (`RetroCanvas`, `RetroFX`, `RetroShapes`, `RetroModel`) quedan fuera del barrel: se importan por
subruta (`trama-ui/RetroCanvas`).

| Pieza | Para qué |
|---|---|
| `RetroCanvas` | `<Canvas>` + `RetroFX` + tokens del tema + pausa fuera de pantalla + `prefers-reduced-motion`. Lo normal. |
| `RetroFX` | Solo el post-proceso, para meterlo en un `<Canvas>` que ya tengas. |
| `RetroShapes` | Escenas de ejemplo con la iluminación que mejor se lee como caracteres: `chevrons`, `knot`, `cube`, `icosahedron`, `torus`, `pyramid`, `cage` (jaula), `helix` (ADN), `rings` (giroscopio), `terrain` (relieve animado), `globe` (globo facetado) y `tunnel` (túnel de marcos). |
| `RetroModel` | Un modelo `.glb`, `.gltf` u `.obj`: lo carga, lo centra, lo escala a `extent` y le pone material `clay` (gris mate), `original` o `wire`. Trae luces (`lights={false}` si pones las tuyas). |

```tsx
<div style={{ position: "relative", height: 480 }}>
  <RetroCanvas mode="ascii" ramp="dots" cellSize={7} scanlines={0.35}>
    <ambientLight intensity={0.3} />
    <directionalLight position={[3, 4, 5]} intensity={2.5} />
    <mesh><torusKnotGeometry args={[1.2, 0.4, 160, 24]} /><meshStandardMaterial color="white" /></mesh>
  </RetroCanvas>
</div>
```

Rampas de glifos: `classic`, `dots`, `braille`, `blocks`, `binary`, `hex`, `code`, `hatch` (trama diagonal) y `circuit` (pistas de placa); las dibujadas a mano no dependen de ninguna fuente. Patrones de dither (`ditherPattern`): `bayer`, `hatch`, `halftone`, `noise`. Efectos: `scanlines`, `scanlineRoll`, `vignette`, `curvature`, `noise`, `flicker`, `glow` (halo de fósforo), `rain` (lluvia de código), `glitch` y `aberration`. Sobrios por defecto (todos a 0 salvo los del CRT básico); en un fondo de landing conviene `glow` ≤ 0.4, `rain` ≤ 0.3 y sin `glitch` permanente.

Cómo funciona (`lib/retro3d/`): `RetroFX` se engancha a `useFrame` con prioridad 1 —R3F deja de renderizar solo—, dibuja la
escena en un `WebGLRenderTarget` y un quad de pantalla completa la pasa por `shader.ts`. La rampa de glifos es un atlas
(`glyphAtlas.ts`, canvas 2D) con un glifo por nivel de luz; los colores CSS de los tokens se resuelven con `color.ts`.

**Modelos y ratón.** `<RetroCanvas pointerFx="orbit"><RetroModel src="/models/turbina.obj" /></RetroCanvas>`.
`pointerFx` mueve la cámara hacia el puntero con suavizado: `parallax` (se desplaza), `orbit` (gira alrededor del origen) o
`tilt` (solo apunta); `pointerStrength` escala el recorrido. Escucha en la ventana, como los demás fondos (§20), así que
funciona con contenido encima; `interaction="canvas"` (por defecto si no es fixed) solo cuenta el puntero sobre el lienzo y,
al salir, la cámara vuelve al centro. Con `prefers-reduced-motion` queda quieta. Modelos de ejemplo en `public/models/`
(`asteroide.gltf` ~19k triángulos, `turbina.obj` ~9k en piezas, `ciudad.glb`), generados con `scripts/gen-retro-models.mts`
(geometría propia, sin licencias), más `suzanne.glb` y `farol.glb` de Khronos glTF-Sample-Assets (CC0, créditos en
`public/models/LICENSES.md`). `scripts/strip-gltf.mts <entrada> <salida.glb>` deja solo la geometría (sin texturas, UV ni
animaciones): el farol baja de 9,5 MB a 131 KB. No descarta modelos con licencia no comercial por ti: revísala antes. Tras el filtro, texturas y colores casi no se ven: lo que se lee es la luz sobre la forma,
por eso `clay` es el material por defecto. glTF con Draco/meshopt no está soportado (no se incluye el decodificador).

Trampas: la luz importa más que el material (contraste alto y una luz direccional fuerte; con luz plana todo sale del mismo
carácter); los sólidos de aristas vivas se leen mejor que las esferas; los cálculos van en espacio lineal y la luminosidad se
pasa a perceptual antes de elegir glifo — si añades pasos al shader, mantén esa conversión. Un solo `RetroCanvas` pesado por vista.

### 22.1 Rendimiento: un fondo 3D que no frene el scroll (móvil y GPU modesta)

**Por qué pasa.** En móvil el scroll lo mueve el compositor del navegador, que usa la **misma GPU** que el WebGL. Si un fotograma
del lienzo tarda más que un refresco de pantalla, el compositor también pierde fotogramas y el scroll va a saltos aunque el hilo
principal esté libre. El cuello de botella casi nunca son los triángulos, sino la **cantidad de píxeles** (fill-rate): un lienzo a
pantalla completa a dpr 2 ronda 1,5 millones de píxeles, y la pasada ASCII lee 5 veces la textura por cada uno. Caso real:
`/demo/th-silo` iba a tirones en un Android de gama alta hasta aplicar lo de abajo.

**Lo que ya hace el kit (no lo deshagas):**

| Medida | Dónde | Por qué |
|---|---|---|
| Escena intermedia **sin MSAA** | `RetroFX` (`WebGLRenderTarget` sin `samples`) | En GPUs móviles resolver MSAA ×4 cuesta más que el filtro entero; el ASCII/pixel art ya disimula los bordes. |
| Escena intermedia a **la resolución que el filtro lee** | `RetroFX`, prop `sceneScale` (0 = auto) | ~3 muestras por celda ASCII o 2 por bloque de pixel art. Con celdas de 3 px a dpr 2 es 1/3 por lado, ~9× menos píxeles. |
| **30 fps** (`fps`) en vez de los 60–120 Hz de la pantalla | `RetroCanvas` (`frameloop="demand"` + `Pacer`) | Un fondo no necesita más; en una pantalla de 120 Hz es 4× menos trabajo. `fps={0}` = sin límite. |
| **20 fps durante el scroll** (`scrollFps`) y 200 ms después | `RetroCanvas` | Deja la GPU al compositor justo cuando la necesita. `scrollFps={0}` congela el fondo mientras se desplaza. |
| **dpr ≤ 1,5 en pantallas táctiles** (2 con ratón) | `RetroCanvas`, `maxDpr` | Con celdas de caracteres la diferencia no se ve. |
| **Densidad adaptativa** (`adaptive`) | `RetroCanvas` | Si en una ventana de 2 s se consigue menos del 80 % de los fps pedidos, baja el dpr 0,25 (hasta 1). La primera ventana no cuenta (compilación de shaders). |
| Pausa fuera de pantalla y con `prefers-reduced-motion` | `RetroCanvas` | `IntersectionObserver` → `frameloop="never"`. |
| Deformaciones en el **vertex shader**, no en la CPU | `RetroShapes` `terrain` (`onBeforeCompile`) | Antes eran 1.681 vértices + `computeVertexNormals()` por fotograma en el hilo principal. Con `flatShading` la normal sale de derivadas: no hace falta recalcularla. |
| Piezas repetidas **fundidas** en una geometría | `RetroShapes` `cage`, `helix`, `tunnel` (`mergeGeometries`) | De ~80 llamadas de dibujo a 1–9. Si cada pieza se mueve por separado, `InstancedMesh`. |

**Lo que depende de la página que monta el fondo:**

1. **Nada de `backdrop-filter`, `filter` ni `mix-blend-mode` encima de un lienzo animado** (docks, navbars, tarjetas `glass`): el
   desenfoque se recalcula en cada fotograma del fondo. Usa un fondo casi opaco (`color-mix(in srgb, var(--bg) 94%, transparent)`).
2. **Cambiar de escena no debe volver a renderizar la página.** El estado «sección activa» va en un componente pequeño que
   contiene el lienzo (patrón `SiloStage` en `components/landings/SiloLanding.tsx`): el `IntersectionObserver` lo actualiza por un ref.
3. **Monta todas las escenas desde el principio y alterna `visible`** (lo invisible no se dibuja) y **precompila** una vez con
   `gl.compile(scene, camera)`, escena a escena (el número de luces forma parte del shader). Así los modelos se descargan al cargar y
   la GPU no compila en mitad del scroll (patrón `SiloScenes`).
4. **Nunca `setState` dentro de `useFrame`**; lo que cambia cada fotograma va en refs o uniforms.
5. Un solo lienzo WebGL pesado por vista; si hacen falta dos fondos, que uno sea CSS o 2D.
6. `position: fixed` para el fondo (el compositor lo trata como una capa aparte) y sin transforms ligados al scroll.

**Cómo comprobarlo.** El Chrome de escritorio no reproduce el problema (GPU potente, 60 Hz). Usa un móvil real con depuración
remota (`chrome://inspect`) y mira en *Performance* los fotogramas perdidos durante el scroll. Para contar los fotogramas del
lienzo desde la consola, envuelve `gl.bindFramebuffer` y cuenta las llamadas con `null` (una por fotograma de `RetroFX`).
Esperado: 30/s en reposo y 20/s mientras se desplaza.

**Más allá, si aún no basta:** `@react-three/offscreen` (render en un worker; libera el hilo principal, **no** la GPU), detectar
gama baja (`navigator.hardwareConcurrency <= 4`, `deviceMemory <= 4`, cabecera `Save-Data`) para servir `fps={20}` o una imagen
estática, o `scrollFps={0}`.

## 23. Tema y variante «dot matrix»

La estética de `RetroCanvas` (puntos blancos sobre negro, scanlines) como sistema completo, en las dos capas del kit:

- **Tema** `dotmatrixTokens` (`lib/ui/tokens.ts`, exportado también en `trama-ui/tokens`): `--bg #000`, `--fg #e6e6e6`,
  `--mut #8c8c8c`, `--acc #fff`, `--acc2 #a3a3a3`, radio 0, fuente IBM Plex Mono. En `/componentes` es el preset
  «Dot matrix (mono)». Aplicarlo: `<div style={tokensToStyle(dotmatrixTokens)}>`.
  Trae `display` (Doto): los titulares `h1–h3` de cualquier componente pasan a matriz de puntos sea cual sea la variante
  (regla `:where(h1, h2, h3)` de especificidad 0 en `ui-kit.css`, prioridad `--s-df` de la variante → `--display` del tema →
  heredada). Por eso llega también a titulares sin raíz `.ui-s`, como el de `Hero` o el `SectionHeader` fijado a `minimal`
  dentro de las secciones.
- **Variante** `variant="dotmatrix"` (`.ui-s--dotmatrix` en `ui-kit.css`): la aceptan todos los componentes con `variant`
  porque solo fija `--s-*`, más un bloque de detalles al final del CSS (marcadores `•`/`○`/`[•]` en pestañas, navegación,
  checkboxes, radios, precios y paginación; badges y alertas con borde punteado; cursor `_` parpadeante en el botón activo).
  Los componentes sin `variant` (fondos, pixel, texto decorativo) la «aceptan» por tokens: llevan la etiqueta en el catálogo.

Las dos capas son independientes: `dotmatrix` sobre el tema Neutro toma su acento azul; el tema mono con `terminal` o
`outline` también funciona. La combinación de referencia es tema + variante + `RetroCanvas mode="ascii" ramp="dots"`.

## 24. Contenido: texto largo con formato (docs y blog)

Categoría `contenido` (`lib/catalog/entries/contenido.tsx`): lo que hace falta para una página de documentación o una
entrada de blog. De menor a mayor:

| Pieza | Para qué |
|---|---|
| `Prose` | La tipografía del texto largo. `markdown="…"` o `children` (HTML/MDX propio): los dos reciben el mismo estilo. |
| `Callout` | Nota, consejo, importante, cuidado o peligro (`intent`), en `bar`, `soft` u `outline`; plegable. Contenido, no estado (eso es `Alert`). |
| `TableOfContents` | «En esta página», con la sección que se lee marcada. Estilos `rail`, `list` y `numbered`. |
| `ArticleHeader` | Categoría, título, entradilla, autor, fecha, tiempo de lectura, etiquetas y portada (`gen:N` o URL). |
| `Article` | Todo junto: cabecera + índice lateral (sube sobre el texto en contenedores de menos de 860 px) + cuerpo + barra de lectura opcional. |

**Markdown sin HTML crudo.** `lib/ui/markdown.tsx` (bloques) y `lib/ui/markdownInline.tsx` (línea) construyen elementos
React: un texto de un CMS o de un usuario no puede inyectar marcado, y los enlaces solo admiten http(s), mailto, rutas y
anclas (el resto pasa a `#`). Soporta títulos `#`–`####` con id, listas anidadas (2 espacios) y de tareas `- [x]`, citas
con firma (última línea `— Autor`), avisos al estilo GitHub `> [!NOTE] Título` (NOTE · TIP · IMPORTANT · WARNING ·
CAUTION → `Callout`), código ```` ```lenguaje archivo ```` (→ `CodeBlock`), tablas con alineación (`|:--|:--:|--:|`),
imágenes con pie `![alt](url "pie")`, `---`, y en línea `**negrita**`, `*cursiva*`, `~~tachado~~`, `==resaltado==`,
`` `código` ``, `[[Tecla]]` y `[enlaces](…)`. Para algo que no cubre (componentes a medida, MDX), pasa `children`.

**Ids compartidos.** `Prose` y `TableOfContents` usan el mismo generador de ids (`createSlugger`): con el mismo Markdown,
el índice apunta a los títulos sin configurar nada. Con `target` el índice lee los h2/h3 con id de un contenedor ya
pintado; con `items`, una lista a mano. La sección activa se mide respecto a lo que se desplaza (la ventana o el
contenedor con scroll del texto), así que funciona también dentro de una caja con scroll.

Trampas: el cuerpo nunca toma `--s-tt`/`--s-ls` (mayúsculas espaciadas de outline o dotmatrix se leerían mal en un
párrafo), los títulos sí. La columna del índice en `Article` se estira a todo el alto (`align-self: stretch`): sin
recorrido, un `position: sticky` no se queda fijo. `Prose`, `Callout`, `ArticleHeader` y `Article` no llevan
`"use client"`: se renderizan en el servidor (el texto llega indexable); solo el índice es de cliente.


## 25. Audio: `AudioPlayer` y la música sintetizada

`AudioPlayer` (`@/components/ui/AudioPlayer`) es un reproductor de lista con tres disposiciones (`full` tarjeta, `bar`
barra, `minimal` botón + título + línea) y un visualizador en canvas (`bars`, `wave`, `dots`) que toma los colores de
los tokens con `useTokens`. Los motores están en `lib/ui/audio.ts`:

- **Archivos** (`src` = URL): un `<audio>` conectado a un `AnalyserNode` por `createMediaElementSource`. Si el archivo
  está en otro dominio necesita CORS (`Access-Control-Allow-Origin`); sin él suena, pero el visualizador queda plano.
- **Sintetizada** (`src` = `synth:<estilo>:<bpm>:<semilla>`, estilos `hardtechno`, `techno`, `ambient`): música
  generada con Web Audio (bombo distorsionado, rumble, hats, palmas, pads) con un planificador de 25 ms y 120 ms de
  margen. Sirve para demos sin archivos; la semilla cambia el patrón y la tonalidad. Exige la duración en la pista
  (`Título|Artista|synth:hardtechno:156:3|3:40`).

Trampas:

1. **Gesto del usuario.** Los navegadores no dejan sonar audio sin un clic previo. El reproductor nunca arranca solo;
   para lanzarlo desde fuera (una lista de discos de la página) usa `track` + `playKey` (un contador que el clic
   incrementa): el `play()` ocurre justo después de ese clic y cuenta como gesto.
2. **Un solo `AudioContext`** compartido (`audioContext()`): crear uno por pista agota el límite del navegador.
3. **Pestaña en segundo plano:** el reloj va por `setInterval` (sigue contando) y el visualizador por rAF (se para).
4. Teclado con el foco dentro: espacio/K reproduce o pausa, flechas ±5 s, M silencia. Integra Media Session (teclas
   multimedia y pantalla de bloqueo).
5. **Dock** (`dock="bottom" | "top" | "bottom-left" | "bottom-right"`): cuando el reproductor sale de la pantalla y ya
   ha sonado, aparece un mini reproductor fijo (pausa, pista siguiente, silencio, parar y cerrar; el título vuelve al
   reproductor). Es el mismo motor, no una copia: no se corta el audio. Sale en un portal a `body` con
   `themeSnapshot` (§12), así que para estilarlo desde la página usa `dockClassName`; `dockOffset` lo separa del
   borde si la página tiene otra barra fija ahí.
6. **Dock arrastrable** (`dockDraggable`): añade un asa de puntos; al arrastrarla, la barra se convierte en una píldora
   flotante que se queda donde la sueltes (siempre dentro de la pantalla, también al cambiar el tamaño de la ventana).
   La posición se guarda en `localStorage` (`trama-audio-dock`, envuelto en try/catch: sin almacenamiento, vuelve a su
   sitio). Con el asa enfocada, flechas ±16 px (Mayús ±64); doble clic o Supr la devuelven a la posición de `dock`.
7. **Visualizador mini** (`dockVisualizer`, por defecto el mismo que el reproductor): el dock lleva su propio lienzo
   pequeño que pinta la misma señal en el mismo bucle de rAF (un solo `getByteFrequencyData` por fotograma para los dos).
   Con menos de 40 px de alto la densidad se adapta (puntos cada 4 px, barras de 5 px).
8. **Pistas sintetizadas distintas:** la semilla fija tonalidad, bombo, patrones (hats, rumble, acid, acordes,
   percusión), timbres y el orden en que entran las capas; `semilla % 4` elige la entrada (0 bombo y rumble, 1 acid sola,
   2 acordes con eco, 3 percusión). Para una lista de demo, usa semillas con restos distintos (4, 5, 14…): si todas
   tienen el mismo resto, empiezan igual.
