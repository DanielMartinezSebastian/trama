# Catálogo de Trama

> Generado por `scripts/build-catalog.mts` desde `lib/catalog/`. No editar a mano: `npm run catalog`.
> Versión en datos: [`catalog.json`](./catalog.json). Vista previa en vivo: `/componentes#<id>`.

Todos los componentes: `import X from "@/components/ui/X"`, CSS una vez con `import "@/components/ui/styles/kit.css"`,
tema con los tokens `--bg --fg --mut --acc --acc2 --card --ln --r` en cualquier contenedor, estilo con
`variant` (glass · solid · outline · neon · retro · terminal · minimal). Las listas se pasan como texto (una entrada por línea o separadas por comas; campos con `|`), tal como muestran los defaults.

## Fondos (`fondos`)

Escenas de caracteres que rellenan un contenedor.

### Fondo ASCII (Studio) — `AsciiBackground`

Escena procedural convertida en caracteres con asciify-engine. 15 estilos de render, hover, acabado óptico y paleta del tema.

| prop | tipo | default |
|---|---|---|
| `scene` | `lava` · `waves` · `plasma` · `synthwave` · `galaxy` · `rings` · `kaleido` · `torus` · `cube` · `pyramid` · `sphere` · `cylinder` · `cone` · `octahedron` · `tetrahedron` · `icosahedron` · `hexprism` · `diamond` · `torusknot` · `orbs` · `tide` · `wave` · `brew` · `bloom` · `arcade` | "lava" |
| `asciiStyle` | `ascii` · `braille` · `dots` · `lines` · `blocks` · `cross` · `diagonal` · `diamond` · `mixed` · `pixel` · `mosaic` · `lego` · `voxel` · `disco` · `dither` | "ascii" |
| `palette` | `original` · `tint` · `duotone` · `gradient` | "tint" |
| `tintAmount` | number 0–1 | 0.6 |
| `cellSize` | number 4–24 | 8 |
| `colorMode` | `source` · `accent` · `gray` | "source" |
| `charset` | `detailed` · `standard` · `blocks` · `braille` · `technical` | "detailed" |
| `asciiHover` | `none` · `trail` · `water` · `contour` · `dissolve` · `silk` · `vortex` | "water" |
| `hoverStrength` | number 0–1 | 0.7 |
| `hoverRadius` | number 0.1–0.6 | 0.28 |
| `speed` | number 0.1–4 | 1 |
| `fps` | number 10–60 | 60 |
| `bloom` | number 0–1 | 0.2 |
| `scanlines` | number 0–1 | 0 |
| `vignette` | number 0–1 | 0.3 |
| `grain` | number 0–1 | 0 |
| `glitch` | number 0–1 | 0 |
| `opacity` | number 0.1–1 | 1 |
| `progress` | number 0–1 | 0.3 |

- Rellena el contenedor: debe tener position: relative y tamaño.
- palette reinterpreta los colores con --bg, --acc y --acc2: cambia el tema y el fondo cambia.
- Las escenas marcadas con progreso cambian con la prop progress (0–1).
- Cambiar props no remonta: se aplican en caliente.

### Fondo generativo (textmode.js) — `TextmodeBackground`

Simulaciones por celda con textmode.js: plasma, lluvia, fuego, vida… El puntero interactúa y la paleta sigue el tema.

| prop | tipo | default |
|---|---|---|
| `sketch` | `plasma` · `matrix` · `starfield` · `ripples` · `life` · `flow` · `fire` · `ocean` · `tunnel` · `aurora` | "plasma" |
| `palette` | `original` · `tint` · `duotone` · `gradient` | "tint" |
| `tintAmount` | number 0–1 | 0.6 |
| `fontSize` | number 8–28 | 14 |
| `frameRate` | number 10–60 | 60 |
| `opacity` | number 0.1–1 | 1 |

- Cada celda es un carácter con su propio color.
- Cambiar sketch, tamaño o fps recrea el lienzo; la paleta y la opacidad no.

### Fondo de rejilla (CSS) — `GridBackground`

Puntos, líneas, cruces o diagonales con CSS puro. La opción más ligera para fondos discretos.

| prop | tipo | default |
|---|---|---|
| `kind` | `dots` · `lines` · `cross` · `diagonal` | "dots" |
| `cellSize` | number 12–80 | 28 |
| `opacity` | number 0.1–1 | 0.6 |
| `fade` | boolean | true |
| `drift` | boolean | false |

### Efecto CRT — `CrtOverlay`

Capa de monitor antiguo: líneas de barrido, viñeta, parpadeo y barra de refresco. Se superpone a cualquier contenido.

| prop | tipo | default |
|---|---|---|
| `scanlines` | number 0–0.8 | 0.3 |
| `vignette` | number 0–1 | 0.6 |
| `flicker` | number 0–1 | 0.4 |
| `sweep` | boolean | true |

- Se coloca como hijo de un contenedor con position: relative.
- No bloquea el puntero.

## Texto (`texto`)

Titulares y cintas con efectos de texto.

### Texto que se descifra — `ScrambleText`

Titular que se resuelve entre glifos aleatorios (GSAP ScrambleText). El texto real está siempre en el DOM.

| prop | tipo | default |
|---|---|---|
| `text` | text | "Aprende a leer el mar" |
| `chars` | text | "!<>-_\\/[]{}=+*^?#" |
| `duration` | number 0.3–4 | 1.2 |
| `speed` | number 0.2–2 | 0.6 |
| `trigger` | `mount` · `hover` · `loop` | "mount" |
| `tone` | `fg` · `acc` · `acc2` · `mut` · `gradient` | "fg" |
| `as` | `h1` · `h2` · `h3` · `p` · `span` | "h2" |
| `fontSize` | number 16–96 | 40 |
| `weight` | number 300–900 | 800 |
| `tracking` | number -0.05–0.3 | -0.02 |
| `align` | `left` · `center` · `right` | "center" |
| `uppercase` | boolean | false |

### Frases que se escriben — `Typewriter`

Titular de héroe con frases que se escriben y se borran en bucle.

| prop | tipo | default |
|---|---|---|
| `prefix` | text | "Aprende " |
| `phrases` | text | "surf en Cantabria\nolas para todos\nel mar te espera" |
| `typeSpeed` | number 4–40 | 14 |
| `deleteSpeed` | number 8–80 | 30 |
| `pause` | number 0–5 | 1.4 |
| `cursor` | `bar` · `block` · `underscore` · `none` | "bar" |
| `fontSize` | number 16–80 | 40 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Rótulo de neón — `NeonSign`

Tubo de neón, contorno o sombra de píxel, con parpadeo opcional. Usa --acc y --acc2.

| prop | tipo | default |
|---|---|---|
| `text` | text | "ABIERTO" |
| `mode` | `tube` · `outline` · `pixel` | "tube" |
| `tone` | `acc` · `acc2` · `fg` | "acc" |
| `fontSize` | number 24–120 | 64 |
| `flicker` | boolean | true |

### Titular ASCII (bitmap / FIGlet) — `BitmapText`

Arte de texto generado por asciify-engine: fuente bitmap 7×7 o 21 fuentes FIGlet.

| prop | tipo | default |
|---|---|---|
| `text` | text | "PIXEL" |
| `font` | `Bitmap` · `Standard` · `Slant` · `Small` · `Big` · `Banner` · `Block` · `Bubble` · `Digital` · `Doom` · `Lean` · `Mini` · `Script` · `Shadow` · `Speed` · `Starwars` · `Stop` · `Straight` · `Thin` · `ThreeD` · `Univers` · `Wavy` | "Bitmap" |
| `char` | text | "#" |
| `scale` | number 1–3 | 1 |
| `fontSize` | number 5–16 | 11 |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `align` | `left` · `center` · `right` | "left" |
| `glow` | boolean | true |
| `glowSize` | number 2–30 | 8 |
| `animate` | `none` · `flicker` · `scan` | "none" |

### Cinta de texto — `Marquee`

Filas de texto en bucle, en CSS puro y sin JS. Siete estilos y color por token.

| prop | tipo | default |
|---|---|---|
| `text` | text | "NUEVA COLECCIÓN" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "terminal" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `direction` | `alternate` · `left` · `right` | "alternate" |
| `duration` | number 6–60 | 18 |
| `rows` | number 1–5 | 2 |
| `fontSize` | number 14–64 | 28 |
| `tilt` | number -8–8 | 0 |
| `separator` | text | "  //  " |
| `edgeFade` | boolean | false |
| `pauseOnHover` | boolean | true |

### Cabecera de sección — `SectionHeader`

Sobretítulo, titular, subtítulo y regla decorativa.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Cómo funciona" |
| `title` | text | "Tres pasos y estás en el agua" |
| `subtitle` | text | "Reserva, elige tu horario y nosotros nos ocupamos del resto." |
| `align` | `left` · `center` | "left" |
| `rule` | `none` · `line` · `ascii` · `dots` | "line" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Separador — `Divider`

Separador con etiqueta. El modo texto dibuja la regla con caracteres.

| prop | tipo | default |
|---|---|---|
| `label` | text | "o continúa con" |
| `mode` | `line` · `text` | "line" |
| `pattern` | text | "-=" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

## Tarjetas (`tarjetas`)

Superficies de contenido con capas ASCII.

### Tarjeta ASCII — `AsciiCard`

Número bitmap, fondo ASCII (15 campos procedurales animados × 8 juegos de caracteres, texto repetido o una escena de AsciiBackground), revelado e inclinación hacia el puntero. Siete estilos.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Iniciación" |
| `text` | text | "Grupos de seis, espuma blanda y mucha paciencia. Te levantas el primer día." |
| `meta` | text | "2 h · desde 35 €" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |
| `align` | `left` · `center` | "left" |
| `minHeight` | number 160–420 | 250 |
| `reveal` | `none` · `wipe` · `rise` · `dissolve` | "rise" |
| `revealDuration` | number 0.3–3 | 0.9 |
| `dissolveCell` | number 8–30 | 14 |
| `trigger` | `mount` · `inview` | "mount" |
| `background` | `field` · `text` · `scene` · `none` | "field" |
| `field` | `plasma` · `waves` · `rings` · `noise` · `rain` · `stars` · `dither` · `topo` · `maze` · `grid` · `halftone` · `vortex` · `tunnel` · `binary` · `scan` | "plasma" |
| `charset` | `detailed` · `standard` · `blocks` · `braille` · `dots` · `lines` · `binary` · `glyph` | "detailed" |
| `fieldColor` | `mut` · `accent` · `gradient` · `value` | "mut" |
| `fieldHover` | `none` · `glow` · `ripple` · `repel` · `reveal` | "glow" |
| `animate` | boolean | true |
| `speed` | number 0.1–3 | 1 |
| `scene` | `lava` · `waves` · `plasma` · `synthwave` · `galaxy` · `rings` · `kaleido` · `torus` · `cube` · `pyramid` · `sphere` · `cylinder` · `cone` · `octahedron` · `tetrahedron` · `icosahedron` · `hexprism` · `diamond` · `torusknot` · `orbs` · `tide` · `wave` · `brew` · `bloom` · `arcade` | "waves" |
| `sceneStyle` | `ascii` · `braille` · `dots` · `lines` · `blocks` · `cross` · `diagonal` · `diamond` · `mixed` · `pixel` · `mosaic` · `lego` · `voxel` · `disco` · `dither` | "braille" |
| `tile` | text | "OLA · MAR · SAL · " |
| `textHover` | `spotlight` · `magnify` · `repel` · `glow` · `colorShift` · `attract` · `shatter` · `trail` · `glitchText` | "trail" |
| `hoverStrength` | number 0–1 | 0.9 |
| `hoverRadius` | number 0.1–0.8 | 0.4 |
| `tileSize` | number 6–24 | 11 |
| `tileOpacity` | number 10–255 | 110 |
| `showNumeral` | boolean | true |
| `index` | number 1–9 | 1 |
| `glyph` | text | "#" |
| `glow` | boolean | true |
| `tilt` | boolean | true |
| `tiltMax` | number 2–25 | 10 |
| `scramble` | boolean | true |
| `chars` | text | "~-=^_" |
| `fill` | `surface` · `tint` · `gradient` · `accent` · `pattern` · `image` | "surface" |
| `pattern` | `dots` · `grid` · `diagonal` · `waves` · `checker` · `rays` | "dots" |
| `image` | text | "gen:3" |
| `tone` | `acc` · `acc2` | "acc" |

- El color sale de --bg, --mut, --acc y --acc2 y se actualiza al cambiar de tema sin repetir el revelado.
- reveal: dissolve dibuja celdas ASCII opacas que se apagan.
- Con movimiento reducido o táctil se desactivan tilt y scramble.
- El campo animado corre a ~30 fps y solo mientras la tarjeta está a la vista; «scene» monta un AsciiBackground por tarjeta (más pesado).
- index sirve de semilla: tres tarjetas con el mismo campo no salen iguales.

### Panel — `Panel`

Superficie genérica con barra opcional, título, cuerpo y pie. Base de cualquier tarjeta simple.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Resumen de reserva" |
| `body` | text | "Dos clases de iniciación el sábado por la mañana, con neopreno y tabla incluidos." |
| `footer` | text | "Cancelación gratuita hasta 24 h antes" |
| `bar` | text | "reserva.txt" |
| `cornerGlyph` | text | "" |
| `fill` | `surface` · `tint` · `gradient` · `accent` · `pattern` · `image` | "surface" |
| `pattern` | `dots` · `grid` · `diagonal` · `waves` · `checker` · `rays` | "dots" |
| `image` | text | "gen:3" |
| `tone` | `acc` · `acc2` | "acc" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Tarjeta de precios — `PricingCard`

Plan con precio, características (incluidas y no incluidas) y llamada a la acción. Tres maquetaciones, tres formas de destacar (halo, invertida, borde), precio tachado y nota.

| prop | tipo | default |
|---|---|---|
| `layout` | `classic` · `compact` · `horizontal` | "classic" |
| `plan` | text | "Pro" |
| `description` | text | "Para quien publica cada semana" |
| `price` | text | "29 €" |
| `originalPrice` | text | "" |
| `period` | text | "/ mes" |
| `note` | text | "" |
| `features` | text | "Proyectos ilimitados\nSoporte prioritario\nExportación a PNG y SVG\n-Facturación centr…" |
| `cta` | text | "Empezar ahora" |
| `highlighted` | boolean | true |
| `highlight` | `glow` · `invert` · `border` | "invert" |
| `badge` | text | "Más popular" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |
| `fill` | `surface` · `tint` · `gradient` · `accent` · `pattern` · `image` | "surface" |
| `pattern` | `dots` · `grid` · `diagonal` · `waves` · `checker` · `rays` | "dots" |
| `image` | text | "gen:3" |
| `tone` | `acc` · `acc2` | "acc" |

### Testimonio — `Testimonial`

Cita con avatar de iniciales, autor, cargo y valoración.

| prop | tipo | default |
|---|---|---|
| `quote` | text | "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla." |
| `author` | text | "Lucía Pardo" |
| `role` | text | "Alumna, curso de iniciación" |
| `rating` | number 0–5 | 5 |
| `fill` | `surface` · `tint` · `gradient` · `accent` · `pattern` · `image` | "surface" |
| `pattern` | `dots` · `grid` · `diagonal` · `waves` · `checker` · `rays` | "dots" |
| `image` | text | "gen:3" |
| `tone` | `acc` · `acc2` | "acc" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Tarjeta de artículo — `BlogCard`

Artículo con cabecera (imagen, trama de CSS o caracteres), categoría, titular, extracto, autor y meta. Cuatro maquetaciones: apilada, horizontal, superpuesta (imagen de fondo) y mínima. Con href, toda la tarjeta es un enlace.

| prop | tipo | default |
|---|---|---|
| `layout` | `stacked` · `horizontal` · `overlay` · `minimal` | "stacked" |
| `media` | `image` · `pattern` · `glyph` · `none` | "image" |
| `image` | text | "gen:1" |
| `pattern` | `dots` · `grid` · `diagonal` · `waves` · `checker` · `rays` | "waves" |
| `glyph` | text | "~" |
| `category` | text | "Técnica" |
| `title` | text | "Cinco errores al remar que te frenan la primera ola" |
| `excerpt` | text | "El remo cuenta más que la fuerza: la postura y el timing son lo que de verdad te sube …" |
| `author` | text | "Nora Vidal" |
| `date` | text | "12 mar 2026" |
| `readTime` | text | "4 min" |
| `href` | text | "#" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |
| `fill` | `surface` · `tint` · `gradient` · `accent` | "surface" |
| `tone` | `acc` · `acc2` | "acc" |

## Interacción (`interaccion`)

Respuestas al puntero.

### Botón — `Button`

Botón del sistema: 6 colores (acento, neutro, éxito, info, aviso, peligro) × 5 énfasis (relleno, superficie, borde, fantasma, enlace), estados pulsado, cargando y deshabilitado, solo icono y como enlace. Siete estilos.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Reservar clase" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "solid" |
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "accent" |
| `emphasis` | `primary` · `secondary` · `outline` · `ghost` · `link` | "primary" |
| `size` | `sm` · `md` · `lg` | "md" |
| `glyph` | text | "" |
| `glyphPosition` | `start` · `end` | "end" |
| `iconOnly` | boolean | false |
| `active` | boolean | false |
| `loading` | boolean | false |
| `disabled` | boolean | false |
| `href` | text | "" |
| `fullWidth` | boolean | false |

- intent cambia el color y tone el énfasis: son independientes, cualquier color con cualquier énfasis y estilo.
- active pone aria-pressed (botón conmutable); loading pone aria-busy y bloquea el clic; con href se pinta como <a>.
- iconOnly usa glyph como contenido y label como aria-label.

### Botón magnético — `MagneticButton`

Button que se desplaza (y gira un poco) hacia el puntero cuando se acerca. Sin efecto en táctil.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Reservar clase" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "solid" |
| `emphasis` | `primary` · `secondary` · `ghost` | "primary" |
| `size` | `sm` · `md` · `lg` | "md" |
| `glyph` | text | "" |
| `strength` | number 0–1 | 0.35 |
| `radius` | number 40–400 | 160 |
| `tilt` | number 0–20 | 0 |

### Cursor personalizado — `GlyphCursor`

Un carácter, un anillo o un punto que persigue al puntero dentro de su contenedor. Colócalo como hijo del área donde debe actuar.

| prop | tipo | default |
|---|---|---|
| `mode` | `glyph` · `ring` · `dot` | "glyph" |
| `glyph` | text | "*" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `cursorSize` | number 10–48 | 22 |
| `lag` | number 0.05–1.2 | 0.45 |
| `offset` | number 0–40 | 14 |
| `spin` | boolean | true |
| `glow` | boolean | true |

### Foco que sigue al puntero — `Spotlight`

Superficie con un foco de luz (y borde iluminado) bajo el puntero. Envuelve cualquier contenido.

Envuelve contenido (`children`), p. ej.: `<h3>Pasa el puntero</h3> <p>Un foco de luz sigue tu cursor.</p>`

| prop | tipo | default |
|---|---|---|
| `radius` | number 60–500 | 220 |
| `intensity` | number 5–80 | 30 |
| `border` | boolean | true |
| `tone` | `acc` · `acc2` · `fg` | "acc" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Efectos de hover — `HoverFX`

Envoltorio de hover reutilizable en cualquier contenido: elevación, escala, inclinación 3D, brillo que sigue al puntero, destello, barrido de escaneo, micro-glitch, corchetes de objetivo o subrayado.

Envuelve contenido (`children`), p. ej.: `<PricingCard plan="Pro" />`

| prop | tipo | default |
|---|---|---|
| `effect` | `lift` · `scale` · `tilt` · `glow` · `shine` · `scanline` · `jitter` · `brackets` · `underline` · `none` | "glow" |
| `strength` | number 0.1–1 | 0.6 |
| `tone` | `acc` · `acc2` · `fg` · `mut` | "acc" |
| `radius` | number 60–460 | 220 |
| `tiltMax` | number 2–25 | 10 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

- La mayoría de efectos son CSS puro; «tilt» y «glow» siguen el puntero con GSAP.
- Se puede combinar con Presence: HoverFX dentro, Presence fuera (o al revés) para tener entrada/salida y hover a la vez.
- Todo componente del catálogo puede envolverse así: activa el panel «FX» de la cabecera para probarlo con cualquier demo.

### Área con scroll — `ScrollArea`

Caja de contenido largo (registro de cambios, comentarios, salida de terminal…) con su propia barra de desplazamiento, distinta en cada estilo.

| prop | tipo | default |
|---|---|---|
| `content` | text | "Registro de cambios\nv1.4.0 — Panel de tokens con selector de tipografía y fuentes de …" |
| `height` | number 120–400 | 220 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

- La barra de scroll no es exclusiva de este componente: cualquier superficie ui-s--<variante> la hereda automáticamente (ver components/ui/styles/ui-kit.css).

## Transiciones (`transiciones`)

Cambios de escena y de sección.

### Transición de escena — `SceneFlash`

Barrido, iris, rebanadas, persianas o mosaico de píxeles para acompañar un cambio de sección. Usa --acc y --acc2.

| prop | tipo | default |
|---|---|---|
| `kind` | `sweep` · `iris` · `slices` · `blinds` · `pixels` | "sweep" |
| `duration` | number 0.3–3 | 1 |
| `loop` | boolean | false |

### Revelado de contenido — `Reveal`

Revela lo que envuelve al montar, al entrar en pantalla o siguiendo el scroll: 7 efectos × 4 direcciones, escalonado de hijos o de palabras/letras, curvas con rebote y repetición al volver a entrar.

Envuelve contenido (`children`), p. ej.: `<Card /> <Card /> <Card />`

| prop | tipo | default |
|---|---|---|
| `kind` | `fade` · `slide` · `scale` · `blur` · `wipe` · `flip` · `iris` | "slide" |
| `direction` | `up` · `down` · `left` · `right` | "up" |
| `distance` | number 0–160 | 40 |
| `trigger` | `mount` · `inview` · `scroll` | "inview" |
| `once` | boolean | true |
| `threshold` | number 0–1 | 0.2 |
| `duration` | number 0.2–3 | 0.8 |
| `delay` | number 0–2 | 0 |
| `easing` | `out` · `in-out` · `back` · `linear` | "out" |
| `stagger` | number 0–0.5 | 0.12 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

- Con «inview» y «scroll», desplaza el escenario: el contenido empieza debajo.
- «stagger» escalona los hijos directos (aquí, las tres tarjetas); «split» trocea un texto plano (aquí, el titular).
- El estado oculto viene en el HTML del servidor: no hay parpadeo antes de hidratar. Sin JS o con movimiento reducido se ve directamente.
- Al terminar no deja transform/filter/clip-path: un Modal o Drawer dentro sigue funcionando.

### Aparición / desaparición (hacker) — `Presence`

Envuelve cualquier contenido y anima su entrada y salida: capas de glifos que se descifran, glitch con separación RGB y corrupción, datamosh, fragmentos, encendido CRT, parpadeo de neón, estática de TV, censura o arranque de sistema.

Envuelve contenido (`children`), p. ej.: `<Panel title="ACCESO_CONCEDIDO.sh" body="usuario: root…" variant="terminal" />`

| prop | tipo | default |
|---|---|---|
| `effect` | `ascii-rain` · `ascii-random` · `ascii-sweep` · `ascii-radial` · `ascii-rows` · `glitch` · `slices` · `shatter` · `crt` · `flicker` · `static` · `redact` · `boot` | "ascii-rain" |
| `loop` | boolean | true |
| `show` | boolean | true |
| `hold` | number 0.2–4 | 1.2 |
| `duration` | number 0.3–3 | 1.2 |
| `intensity` | number 0.1–1 | 0.7 |
| `tone` | `acc` · `acc2` · `fg` | "acc" |
| `chars` | `symbols` · `binary` · `hex` · `code` · `blocks` · `dots` | "symbols" |
| `cell` | number 8–28 | 14 |
| `edge` | boolean | true |
| `tiles` | number 3–10 | 6 |
| `bands` | number 4–24 | 10 |
| `rowHeight` | number 12–40 | 22 |
| `redactLabel` | text | "REDACTED" |
| `bootLines` | text | "[ OK ] montando sistema de archivos\n[ OK ] iniciando servicios\n[ .. ] descifrando in…" |

- El contenido está siempre en el DOM; con movimiento reducido se muestra u oculta sin animar.
- Con «Bucle automático» activado se repite sola; desactívalo para controlarla con «Mostrar contenido».
- chars, celda y rastro solo aplican a los efectos «ascii-*»; columnas a fragmentos; bandas a datamosh; alto de barra y texto a censura; líneas a arranque.
- 13 efectos, 7 estilos de superficie para el contenido de ejemplo: 91 combinaciones.

## Datos (`datos`)

Cifras, gráficos, terminales y tablas.

### Cifra ASCII que cuenta — `StatCounter`

Número grande en fuente bitmap de asciify-engine que cuenta hacia arriba con GSAP.

| prop | tipo | default |
|---|---|---|
| `value` | number 0–9999999 | 250 |
| `format` | `int` · `decimal` · `compact` | "int" |
| `decimals` | number 0–3 | 1 |
| `prefix` | text | "" |
| `suffix` | text | "+" |
| `label` | text | "PROYECTOS" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `align` | `left` · `center` · `right` | "center" |
| `char` | text | "#" |
| `scale` | number 1–3 | 1 |
| `duration` | number 0.5–4 | 1.6 |
| `trigger` | `mount` · `inview` · `hover` | "mount" |

### Gráfico ASCII — `AsciiChart`

Barras verticales, horizontales, área o sparkline dibujados con caracteres, con animación de crecimiento.

| prop | tipo | default |
|---|---|---|
| `data` | text | "12, 18, 9, 24, 31, 27, 40, 36" |
| `labels` | text | "L,M,X,J,V,S,D,L" |
| `kind` | `bars` · `hbars` · `area` · `spark` | "bars" |
| `height` | number 4–20 | 10 |
| `fillChar` | text | "█" |
| `animate` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "terminal" |

### Terminal que escribe sola — `TerminalTyper`

Terminal con escritura carácter a carácter. En estilo retro es un monitor de fósforo con el color de --acc.

| prop | tipo | default |
|---|---|---|
| `lines` | text | "$ npx create-landing hoja-vivero\n[ok] plantilla descargada\n[ok] gsap ScrollTrigger c…" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "terminal" |
| `chrome` | boolean | true |
| `title` | text | "zsh — proyecto" |
| `cursor` | `block` · `bar` · `underscore` | "block" |
| `charsPerSecond` | number 8–120 | 32 |
| `prompt` | text | "$" |
| `loop` | boolean | true |

### Línea de pasos — `Timeline`

Proceso, hoja de ruta o historial en vertical, con marcadores numerados, punto o carácter.

| prop | tipo | default |
|---|---|---|
| `steps` | text | "Reserva\|Eliges día y nivel en menos de un minuto.\nLlegada\|Recibes neopreno y tabla …" |
| `marker` | `number` · `dot` · `glyph` | "number" |
| `glyph` | text | "*" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Tabla de datos — `Table`

Tabla a partir de texto CSV. La cabecera y las filas se adaptan a la variante.

| prop | tipo | default |
|---|---|---|
| `csv` | text | "Plan, Clases, Precio\nIniciación, 1, 35 €\nBono 5, 5, 150 €\nSurf trip, 6, 240 €" |
| `striped` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "solid" |

### Bloque de código — `CodeBlock`

Código con cabecera, numeración de línea opcional y botón de copiar. Sin resaltado de sintaxis.

| prop | tipo | default |
|---|---|---|
| `code` | text | "export function greet(name: string) {\n  return `Hola, ${name}`;\n}" |
| `language` | text | "tsx" |
| `filename` | text | "" |
| `showLineNumbers` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "terminal" |

## Navegación (`navegacion`)

Barras, pestañas y acordeones.

### Barra de navegación — `NavBar`

Marca, enlaces y llamada a la acción. El enlace activo se marca de forma distinta en cada estilo.

| prop | tipo | default |
|---|---|---|
| `brand` | text | "Maré" |
| `links` | text | "Clases, Tablas, Reservas, Contacto" |
| `cta` | text | "Reservar" |
| `defaultActive` | number 0–5 | 0 |
| `floating` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Pestañas — `Tabs`

Pestañas con teclado (←/→) y panel. El indicador de la activa cambia con el estilo.

| prop | tipo | default |
|---|---|---|
| `items` | text | "Resumen, Detalles, Reseñas" |
| `content` | text | "Una vista general del producto.\nEspecificaciones técnicas y medidas.\nLo que dicen qu…" |
| `defaultIndex` | number 0–5 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Acordeón — `Accordion`

Preguntas frecuentes con paneles animados por CSS.

| prop | tipo | default |
|---|---|---|
| `items` | text | "¿Necesito experiencia?\|Ninguna. Empezamos desde cero con material blando.\n¿Qué inclu…" |
| `multiple` | boolean | false |
| `defaultOpen` | number 0–5 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Migas de pan — `Breadcrumbs`

Ruta de navegación. El último elemento es la página actual, sin enlace.

| prop | tipo | default |
|---|---|---|
| `items` | text | "Inicio, Cursos, Iniciación al surf" |
| `separator` | text | "/" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Paginación — `Pagination`

Números de página con elipsis cuando hay muchas. Gestiona su propia página activa.

| prop | tipo | default |
|---|---|---|
| `total` | number 1–40 | 9 |
| `defaultPage` | number 1–40 | 4 |
| `siblingCount` | number 0–3 | 1 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Menú desplegable — `Dropdown`

Botón que abre una lista de acciones (⋮). Para elegir un valor de formulario, ver Select en Formularios.

| prop | tipo | default |
|---|---|---|
| `label` | text | "⋮" |
| `items` | text | "Editar, Duplicar, Archivar, Eliminar" |
| `align` | `left` · `right` | "right" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

## Formularios (`formularios`)

Campos, interruptores y deslizadores.

### Campo de texto — `TextField`

Entrada con etiqueta, ayuda, prefijo y estados de error o éxito. El foco usa --acc. Con multiline dibuja un textarea (ver Formulario de contacto).

| prop | tipo | default |
|---|---|---|
| `label` | text | "Correo electrónico" |
| `placeholder` | text | "tu@correo.com" |
| `defaultValue` | text | "" |
| `hint` | text | "Solo te escribiremos para confirmar la reserva." |
| `prefix` | text | "@" |
| `intent` | `none` · `success` · `info` · `warning` · `danger` | "none" |
| `size` | `sm` · `md` · `lg` | "md" |
| `type` | `text` · `email` · `password` · `search` | "text" |
| `multiline` | boolean | false |
| `rows` | number 2–10 | 4 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Interruptor — `Toggle`

Interruptor accesible. Retro y terminal lo muestran como texto [ON ]/[OFF].

| prop | tipo | default |
|---|---|---|
| `label` | text | "Notificaciones" |
| `defaultChecked` | boolean | true |
| `size` | `sm` · `md` · `lg` | "md" |
| `onText` | text | "ON " |
| `offText` | text | "OFF" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Deslizador — `RangeSlider`

Deslizador con pista y pulgar propios de cada estilo.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Intensidad" |
| `min` | number -100–100 | 0 |
| `max` | number 1–500 | 100 |
| `step` | number 1–20 | 1 |
| `defaultValue` | number 0–100 | 40 |
| `unit` | text | "%" |
| `showValue` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Desplegable — `Select`

Lista de opciones con estilo propio (no un <select> nativo): mismo aspecto en los 7 estilos, abierto o cerrado.

| prop | tipo | default |
|---|---|---|
| `label` | text | "País" |
| `options` | text | "España, Francia, Portugal, Italia, Alemania" |
| `defaultValue` | text | "" |
| `placeholder` | text | "Elige una opción" |
| `size` | `sm` · `md` · `lg` | "md" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Grupo de casillas — `CheckboxGroup`

Casillas independientes. Retro y terminal las muestran como texto [x]/[ ].

| prop | tipo | default |
|---|---|---|
| `label` | text | "Notificaciones" |
| `options` | text | "Email, SMS, Push, Newsletter" |
| `defaultValue` | text | "Email, Push" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Grupo de opciones — `RadioGroup`

Selección única entre varias opciones. Retro y terminal las muestran como texto (•)/( ).

| prop | tipo | default |
|---|---|---|
| `label` | text | "Plan" |
| `options` | text | "Mensual, Anual" |
| `defaultValue` | text | "Mensual" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Pasos — `Stepper`

Indicador de progreso por pasos (alta, checkout, onboarding…). No gestiona el contenido de cada paso.

| prop | tipo | default |
|---|---|---|
| `steps` | text | "Datos, Envío, Pago, Confirmación" |
| `current` | number 0–5 | 1 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Código de verificación — `OtpInput`

Casillas de código (SMS, autenticación en dos pasos): el foco avanza solo al escribir.

| prop | tipo | default |
|---|---|---|
| `length` | number 4–8 | 6 |
| `size` | `sm` · `md` · `lg` | "md" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "terminal" |

## Feedback (`feedback`)

Estados, avisos y carga.

### Insignia — `Badge`

Etiqueta de estado en cinco tonos, con punto opcional.

| prop | tipo | default |
|---|---|---|
| `text` | text | "Nuevo" |
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "accent" |
| `size` | `md` · `lg` | "md" |
| `dot` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Barra de progreso — `Progress`

Barra con franjas animadas o dibujada con caracteres. Retro la dibuja por bloques.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Subiendo" |
| `value` | number 0–100 | 62 |
| `showValue` | boolean | true |
| `striped` | boolean | false |
| `ascii` | boolean | false |
| `fillChar` | text | "#" |
| `emptyChar` | text | "-" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Aviso — `Alert`

Mensaje inline con icono según el tipo, permanente (no desaparece solo). Para una notificación temporal, ver Toast en Overlays.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Cambios guardados" |
| `message` | text | "Tu perfil se actualizó correctamente." |
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "success" |
| `dismissible` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Indicador de carga — `Spinner`

Anillo CSS o animaciones de texto: línea, braille, puntos, barra y bloques.

| prop | tipo | default |
|---|---|---|
| `kind` | `ring` · `line` · `braille` · `dots` · `bar` · `blocks` | "braille" |
| `label` | text | "Cargando…" |
| `fontSize` | number 12–48 | 20 |
| `fps` | number 2–30 | 12 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "terminal" |

### Esqueleto de carga — `Skeleton`

Placeholder con barrido animado mientras carga el contenido real: texto, tarjeta, avatar o filas de tabla.

| prop | tipo | default |
|---|---|---|
| `kind` | `text` · `card` · `avatar` · `table` | "text" |
| `lines` | number 1–6 | 3 |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "mut" |

## Galerías y vídeo (`galerias`)

Galerías de imágenes y carruseles sobre Swiper (coverflow, baraja, cubo, mosaico, cintas continuas) y reproductor de vídeo.

### Galería de imágenes — `ImageGallery`

Ocho presentaciones de las mismas fotos: imagen grande con miniaturas, coverflow 3D, baraja, fundido, cubo, creativa, tira libre y mosaico de dos filas. Táctil, con teclado y flechas; sin imágenes propias usa escenas pixel art generadas.

| prop | tipo | default |
|---|---|---|
| `layout` | `thumbs` · `coverflow` · `cards` · `fade` · `cube` · `creative` · `filmstrip` · `mosaic` | "thumbs" |
| `images` | text | "gen:0\|Amanecer\|Primera luz sobre la bahía\ngen:1\|Mediodía\|Mar limpio y viento suav…" |
| `ratio` | `4/3` · `16/9` · `21/9` · `1/1` · `3/4` | "4/3" |
| `captions` | boolean | true |
| `autoplay` | number 0–8 | 0 |
| `loop` | boolean | false |
| `zoom` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "retro" |

- Cada línea de «imágenes» es «imagen|título|texto». La imagen puede ser una URL o ruta, o `gen:N` (0, 1, 2…) para una escena de ejemplo generada, sin descargas.
- Las flechas, los puntos y las imágenes toman borde, radio y sombra de la variante de estilo (variables --s-*).
- El zoom (doble clic o pellizco) solo se aplica a los modos thumbs y fade.

### Carrusel — `Carousel`

Carrusel genérico sobre Swiper: cada hijo es una diapositiva. Diapositivas visibles responsivas, reproducción automática, bucle, fundido, baraja apilada o cinta continua, con flechas y puntos cuadrados del estilo activo.

| prop | tipo | default |
|---|---|---|
| `cards` | text | "Iniciación\|Grupos de seis y mucha paciencia.\nPrivadas\|Un monitor solo para ti.\nSur…" |
| `effect` | `slide` · `fade` · `cards` | "slide" |
| `perView` | number 1–5 | 3 |
| `gap` | number 0–40 | 20 |
| `autoplay` | number 0–8 | 0 |
| `loop` | boolean | true |
| `arrows` | boolean | true |
| `dots` | `none` · `bullets` · `progress` · `fraction` | "bullets" |
| `ticker` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

- Las secciones (testimonios, ventajas, precios, equipo, blog) lo usan por dentro con `layout="carousel"`; úsalo directamente para cualquier lista de tarjetas.
- En pantallas estrechas baja solo a 2 y a 1 diapositiva visible.

### Reproductor de vídeo — `VideoPlayer`

Reproductor sobre el <video> nativo, sin dependencias, con controles propios del estilo: play, progreso arrastrable, volumen, velocidad, subtítulos, imagen en imagen, pantalla completa y atajos de teclado. Los enlaces de YouTube y Vimeo se cargan bajo demanda, sin cookies hasta pulsar play. El modo fondo rellena un contenedor, en bucle y sin controles.

| prop | tipo | default |
|---|---|---|
| `src` | `https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113097/samples/cld-sample-video.mp4` · `https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113091/samples/sea-turtle.mp4` · `/video/pixel-life.mp4` · `https://www.youtube.com/watch?v=aqz-KE-bpKQ` | "https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113097/samples/cld…" |
| `poster` | text | "" |
| `title` | text | "Vida en píxeles" |
| `ratio` | `16/9` · `21/9` · `4/3` · `1/1` · `9/16` | "16/9" |
| `controls` | `full` · `minimal` · `none` | "full" |
| `autoplay` | boolean | false |
| `muted` | boolean | false |
| `loop` | boolean | false |
| `startAt` | number 0–30 | 0 |
| `background` | boolean | false |
| `scanlines` | boolean | false |
| `ascii` | boolean | false |
| `asciiStyle` | `ascii` · `braille` · `dots` · `lines` · `blocks` · `cross` · `diagonal` · `diamond` · `mixed` · `pixel` · `mosaic` · `lego` · `voxel` · `disco` · `dither` | "ascii" |
| `asciiCell` | number 3–20 | 6 |
| `asciiColor` | `source` · `accent` · `gray` | "source" |
| `asciiHover` | `none` · `trail` · `water` · `contour` · `dissolve` · `silk` · `vortex` | "water" |
| `asciiHoverStrength` | number 0–1 | 0.7 |
| `asciiHoverRadius` | number 0.1–0.6 | 0.28 |
| `pauseOffscreen` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "retro" |

- «Fuente» admite un archivo (.mp4, .webm), un enlace de YouTube (watch, youtu.be, shorts) o de Vimeo. Con un enlace de YouTube/Vimeo solo aplican título, proporción y carátula.
- Atajos con el reproductor enfocado: espacio o K, ←/→ ±5 s (J/L ±10 s), ↑/↓ volumen, M silencio, F pantalla completa, C subtítulos, 0–9 salta al 0–90 %.
- Muestras: dos vídeos de Cloudinary (cld-sample-video y sea-turtle), uno local generado con ffmpeg (public/video/pixel-life.mp4, 8 s, sin audio) y un enlace de YouTube. La carátula de los de Cloudinary sale de un fotograma del propio vídeo (cloudinaryPoster).
- El efecto ASCII pinta el vídeo como caracteres encima del original (que sigue reproduciéndose debajo). Exige que el servidor del vídeo permita CORS: Cloudinary y los archivos del propio sitio sí; si no, avisa y muestra el vídeo normal.
- Con prefers-reduced-motion el autoplay y el modo fondo no arrancan; fuera de pantalla el vídeo se pausa solo (pauseOffscreen).

## Secciones (`secciones`)

Bloques compuestos, listos para pegar en una landing: hero, contacto, precios, FAQ…

### Hero — `Hero`

Cabecera de landing: sobretítulo, titular, subtítulo, una o dos llamadas a la acción e insignias de confianza. El fondo decorativo es CSS puro.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "ESCUELA DE SURF · CANTABRIA" |
| `title` | text | "Aprende a leer el mar" |
| `subtitle` | text | "Del primer remo a tu primera ola verde. Neopreno, tabla y monitores titulados incluidos." |
| `primaryCta` | text | "Reservar clase" |
| `secondaryCta` | text | "Ver horarios" |
| `badges` | text | "+500 alumnos, 4.9 ★ valoración, Grupos de 6" |
| `align` | `left` · `center` | "center" |
| `backdrop` | `none` · `grid` · `dots` · `glow` | "grid" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Formulario de contacto — `ContactForm`

Nombre, email y mensaje (o solo email, en línea, para un boletín) con estado de envío propio. Conecta el envío real con la prop `onSubmit`.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Escríbenos" |
| `subtitle` | text | "Te respondemos en menos de 24 horas." |
| `fields` | `name,email,message` · `email` | "name,email,message" |
| `layout` | `stacked` · `inline` | "stacked" |
| `submitLabel` | text | "Enviar mensaje" |
| `successMessage` | text | "Gracias, te contestaremos pronto." |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Banner de llamada a la acción — `CTASection`

Cierre de página: titular corto, una frase y uno o dos botones sobre una superficie destacada.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "" |
| `title` | text | "El swell llega el sábado" |
| `subtitle` | text | "Quedan doce plazas. Trae toalla, nosotros ponemos el resto." |
| `primaryCta` | text | "Apuntarme" |
| `secondaryCta` | text | "" |
| `align` | `left` · `center` | "center" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "neon" |

### Sección de FAQ — `FAQSection`

Cabecera de sección más acordeón: las preguntas frecuentes listas para el final de una landing.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Preguntas frecuentes" |
| `title` | text | "Todo lo que necesitas saber" |
| `items` | text | "¿Necesito experiencia?\|Ninguna. Empezamos desde cero con material blando.\n¿Qué inclu…" |
| `multiple` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Sección de cifras — `StatsSection`

Cabecera de sección más una fila de cifras ASCII que cuentan hacia arriba (StatCounter): la sección de «resultados» típica.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "En números" |
| `title` | text | "Diez años enseñando a leer el mar" |
| `stats` | text | "500\|+\|Alumnos formados\n4.9\|\|Valoración media\n12\|\|Años de experiencia" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |

### Sección de precios — `PricingSection`

Cabecera + planes (PricingCard) con selector mensual/anual, plan destacado (invertido, con halo o con borde) y características no incluidas. Rejilla, lista horizontal o carrusel.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Precios" |
| `title` | text | "Un plan para cada tamaño" |
| `subtitle` | text | "Cambia o cancela cuando quieras." |
| `plans` | text | "Básico\|9 €\|/ mes\|no\|Un proyecto;Exportación PNG;Soporte por email;-Dominio propio\…" |
| `layout` | `grid` · `list` · `carousel` | "grid" |
| `cardLayout` | `classic` · `compact` | "classic" |
| `highlight` | `invert` · `glow` · `border` | "invert" |
| `fill` | `surface` · `tint` · `gradient` · `pattern` | "surface" |
| `yearlyNote` | text | "2 meses gratis" |
| `perView` | number 1–4 | 3 |
| `autoplay` | number 0–8 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Sección de testimonios — `TestimonialSection`

Cabecera de sección más un grid de reseñas (Testimonial): prueba social lista para pegar.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Lo que dicen" |
| `title` | text | "Alumnos que ya cogieron su ola" |
| `items` | text | "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla.\|Lucía …" |
| `layout` | `grid` · `carousel` | "grid" |
| `perView` | number 1–4 | 3 |
| `autoplay` | number 0–8 | 0 |
| `effect` | `slide` · `fade` · `cards` | "slide" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Pie de página — `Footer`

Marca, columnas de enlaces, redes y línea de copyright: el cierre habitual de cualquier landing.

| prop | tipo | default |
|---|---|---|
| `brand` | text | "Maré Surf Club" |
| `tagline` | text | "Del primer remo a tu primera ola verde." |
| `columns` | text | "Escuela: Clases, Monitores, Ubicación; Ayuda: Reservas, Cancelaciones, FAQ; Legal: Pri…" |
| `social` | text | "X, IG, YT" |
| `copyright` | text | "© 2026 Maré Surf Club. Todos los derechos reservados." |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Rejilla de ventajas — `FeatureGrid`

Cabecera de sección + rejilla de «por qué elegirnos» (glifo + título + texto): la sección más pedida en cualquier landing.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Por qué nosotros" |
| `title` | text | "Lo que nos hace distintos" |
| `items` | text | "~\|Monitores titulados\|Todo el equipo tiene titulación oficial de escuela de surf y p…" |
| `layout` | `grid` · `carousel` | "grid" |
| `perView` | number 1–4 | 3 |
| `autoplay` | number 0–8 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Sección de equipo — `TeamSection`

Cabecera de sección + grid de perfiles con avatar de iniciales: la página «sobre nosotros» lista para pegar.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "El equipo" |
| `title` | text | "Quién te va a enseñar" |
| `people` | text | "Marta Solé\|Directora y monitora\nEnzo Rial\|Monitor de iniciación\nCarla Duque\|Monit…" |
| `layout` | `grid` · `carousel` | "grid" |
| `perView` | number 1–4 | 3 |
| `autoplay` | number 0–8 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Tira de marcas — `LogoCloud`

«Con la confianza de…»: marcas en texto, sin depender de imágenes que el kit no tiene.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Con la confianza de" |
| `brands` | text | "Nautilus, Costa Brava FM, Surfrider, Deporte Norte, Vela & Mar" |
| `layout` | `row` · `ticker` | "row" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "minimal" |

### Sección de blog — `ArticlesSection`

Cabecera + artículos (BlogCard) en rejilla, destacado (el primero grande con imagen de fondo), lista o carrusel. Cada tarjeta varía trama y acento sola.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "El blog" |
| `title` | text | "Últimas entradas" |
| `articles` | text | "Técnica\|Cinco errores al remar que te frenan la primera ola\|El remo cuenta más que l…" |
| `layout` | `grid` · `featured` · `list` · `carousel` | "grid" |
| `cardLayout` | `stacked` · `overlay` · `minimal` | "stacked" |
| `fill` | `surface` · `tint` · `gradient` | "surface" |
| `vary` | boolean | true |
| `perView` | number 1–4 | 3 |
| `autoplay` | number 0–8 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

## Overlays (`overlays`)

Elementos que aparecen encima de la página: diálogos, notificaciones, ayuda.

### Modal — `Modal`

Diálogo modal: un botón lo abre, el fondo o Escape lo cierran. position: fixed, sin portal.

| prop | tipo | default |
|---|---|---|
| `triggerLabel` | text | "Eliminar cuenta" |
| `title` | text | "¿Seguro que quieres continuar?" |
| `body` | text | "Esta acción no se puede deshacer. Se borrarán todos tus datos y no podrás recuperarlos." |
| `confirmLabel` | text | "Sí, eliminar" |
| `cancelLabel` | text | "Cancelar" |
| `size` | `sm` · `md` · `lg` | "md" |
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "accent" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

### Notificación (Toast) — `Toast`

Notificación temporal apilable, construida sobre sonner (apilado, gestos y temporizador ya resueltos) con el aspecto del kit por encima.

| prop | tipo | default |
|---|---|---|
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "success" |
| `loading` | boolean | false |
| `title` | text | "Cambios guardados" |
| `description` | text | "Tu perfil se actualizó correctamente." |
| `position` | `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right` | "bottom-right" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

- Usa la librería sonner (toast/Toaster): sin ella habría que reimplementar apilado, gestos táctiles, temporizador y accesibilidad.
- Cada instancia lleva un id propio para no cruzarse con otras — importante en «Comparar los 7 estilos», donde conviven 7 Toaster a la vez.

### Tooltip — `Tooltip`

Texto de ayuda al posar el ratón o el foco. Envuelve el disparador real (botón, icono, enlace) o pinta un texto subrayado. Solo CSS, sin JavaScript.

Envuelve contenido (`children`), p. ej.: `<Button label="Exportar" glyph="icon:download" />`

| prop | tipo | default |
|---|---|---|
| `label` | text | "Pasa el ratón por aquí" |
| `content` | text | "Descarga el informe en CSV." |
| `side` | `top` · `right` · `bottom` · `left` | "top" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

- Con un único elemento como hijo, este recibe aria-describedby apuntando al tooltip; el foco lo pone el propio botón, sin paradas de tabulador extra.

### Panel lateral (Drawer) — `Drawer`

Panel deslizante desde un lateral (menú móvil, carrito, filtros). Se cierra con el fondo, Escape o su botón.

| prop | tipo | default |
|---|---|---|
| `triggerLabel` | text | "Abrir menú" |
| `side` | `left` · `right` | "left" |
| `title` | text | "Menú" |
| `body` | text | "Clases, Tablas, Reservas, Contacto, Ayuda." |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` | "glass" |

## Pixel art (`pixel`)

Iconos SVG que se tiñen con el tema, marcos de 9 cortes y sprites: píxeles hechos a mano, no filtros.

### Icono pixel art — `Icon`

Icono SVG de Pixelarticons sobre rejilla de 24 px. Se tiñe con un token del tema o con el color del texto que lo rodea.

| prop | tipo | default |
|---|---|---|
| `name` | `plus` · `minus` · `close` · `check` · `pencil` · `trash` · `copy` · `save` · `download` · `upload` · `reload` · `search` · `filter` · `link` · `share` · `send` · `arrow-left` · `arrow-right` · `arrow-up` · `arrow-down` · `chevron-left` · `chevron-right` · `chevron-up` · `chevron-down` · `menu` · `home` · `external-link` · `more-horizontal` · `more-vertical` · `login` · `logout` · `circle-info` · `warning-diamond` · `circle-question` · `bell` · `heart` · `star` · `bookmark` · `flag` · `lock` · `unlock` · `eye` · `eye-off` · `shield` · `user` · `users` · `mail` · `message` · `phone` · `at-sign` · `terminal` · `code` · `cpu` · `database` · `server` · `cloud` · `wifi` · `battery-full` · `zap` · `power` · `settings-cog` · `bug` · `git-branch` · `globe` · `github` · `discord` · `linkedin` · `instagram` · `youtube` · `mastodon` · `bluesky` · `react` · `npm` · `vercel` · `file` · `file-text` · `folder` · `image` · `camera` · `video` · `music` · `play` · `pause` · `volume` · `mic` · `headphone` · `gamepad` · `joystick` · `sword` · `skull` · `bomb` · `trophy` · `crown` · `coins` · `potion` · `robot` · `alien` · `castle` · `chess` · `fire` · `sparkles` · `leaf` · `tree` · `sun` · `moon` · `snowflake` · `calendar` · `clock` · `map-pin` · `shopping-cart` · `gift` · `key` · `lightbulb` · `coffee` · `compass` · `target` · `hourglass` · `feather` · `wand` | "heart" |
| `iconSize` | number 16–120 | 48 |
| `sharp` | boolean | false |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |

- Sin `tone` el icono hereda el color del texto (`currentColor`): dentro de un Button o un Badge toma el color de ese componente.
- Sin `label` es decorativo (aria-hidden); con `label` se anuncia como imagen.
- Para un icono fuera del set: `import { Zap } from "pixelarticons/react/Zap"` y `<Icon icon={Zap} />` (también valen las variantes …Solid y …Glyph).
- Iconos de Pixelarticons, licencia MIT (© Gerrit Halfmann).

### Marco pixel art — `PixelFrame`

Panel de 9 cortes (border-image) con las piezas de Kenney «Pixel UI». Trae fondo propio y una paleta de tinta local: se lee igual sobre cualquier tema.

| prop | tipo | default |
|---|---|---|
| `skin` | `colored` · `outline` · `ancient` | "colored" |
| `color` | `blue` · `green` · `grey` · `red` · `yellow` · `brown` · `tan` · `white` | "blue" |
| `pressed` | boolean | false |
| `scale` | `1` · `2` · `3` · `4` | "2" |
| `title` | text | "Sala del archivo" |
| `text` | text | "Cada marco trae su propio fondo: el texto no depende de lo que haya detrás." |

- El marco sustituye la paleta del kit por una de tinta sobre papel (fondo, texto y acentos): los componentes de dentro se leen sobre el marco, no sobre la página. La variante neon no es legible ahí dentro; usa solid, outline, minimal, glass o retro.
- Piezas de Kenney «Pixel UI» (CC0, sin atribución obligatoria): public/pixel/kenney-pixel-ui/. Las versiones «inlay» del pack (44 px) no se usan.

### Sprite pixel art — `Sprite`

Una baldosa 16×16 de la hoja de Kenney «Pixel UI»: flechas, casillas, punteros. Píxeles ya coloreados, no se tiñen con el tema.

| prop | tipo | default |
|---|---|---|
| `col` | number 0–29 | 16 |
| `row` | number 0–32 | 23 |
| `scale` | number 1–12 | 6 |

- La hoja tiene 30 columnas × 33 filas de baldosas de 16 px con 2 px de margen; la que eliges sale enmarcada abajo. Las baldosas vacías simplemente no dibujan nada.
- Piezas de Kenney «Pixel UI» (CC0): public/pixel/kenney-pixel-ui/spritesheet/sheet.png.

## Landings de referencia

Componentes del kit que usa cada una, en orden de aparición. Pídelas como plantilla por su slug.

### CIPHERGRID · producto ciberpunk — `/demo/th-ciphergrid`

Landing retrowave completa construida solo con components/ui/: fondos reactivos al scroll, modal, notificaciones, formulario y prácticamente todo el catálogo.

Archivo: `components/landings/CyberpunkLanding.tsx`

`GridBackground` ×3 → `AsciiBackground` ×2 → `SceneFlash` → `CrtOverlay` → `GlyphCursor` → `Toast` → `NavBar` → `Drawer` → `Hero` → `Reveal` ×19 → `TerminalTyper` → `Typewriter` → `StatsSection` → `FeatureGrid` → `BitmapText` → `Spotlight` → `AsciiCard` ×3 → `SectionHeader` ×5 → `Tabs` → `CodeBlock` ×2 → `Table` → `Timeline` → `HoverFX` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Skeleton` → `StatCounter` → `PricingSection` → `NeonSign` → `Stepper` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `RangeSlider` → `Toggle` → `OtpInput` → `Tooltip` → `MagneticButton` → `Modal` → `Breadcrumbs` → `Panel` → `Dropdown` → `Pagination` → `ScrollArea` → `TestimonialSection` → `TeamSection` → `LogoCloud` → `ArticlesSection` → `FAQSection` → `ScrambleText` → `ContactForm` → `CTASection` → `Divider` → `Footer`

### MYCEL · red micelar orgánica — `/demo/th-mycel`

Segunda landing completa construida solo con components/ui/, opuesta a CIPHERGRID: una red de sensores de campo que germina de verdad al hacer scroll por el héroe, sin que el fondo tape nunca el contenido.

Archivo: `components/landings/MycelLanding.tsx`

`AsciiBackground` → `GridBackground` ×2 → `TextmodeBackground` ×2 → `SceneFlash` → `GlyphCursor` → `Toast` → `NavBar` → `Drawer` → `Hero` → `Reveal` ×19 → `TerminalTyper` → `Typewriter` → `StatsSection` → `FeatureGrid` → `BitmapText` → `Spotlight` → `AsciiCard` ×3 → `SectionHeader` ×5 → `Tabs` → `CodeBlock` ×2 → `Table` → `Timeline` → `HoverFX` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Skeleton` → `StatCounter` → `PricingSection` → `NeonSign` → `Stepper` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `RangeSlider` → `Toggle` → `OtpInput` → `Tooltip` → `MagneticButton` → `Modal` → `Breadcrumbs` → `Panel` → `Dropdown` → `Pagination` → `ScrollArea` → `TestimonialSection` → `TeamSection` → `LogoCloud` → `ArticlesSection` → `FAQSection` → `ScrambleText` → `ContactForm` → `CTASection` → `Divider` → `Footer`

### FOLIO · editorial de tema claro — `/demo/th-folio`

Tercera landing completa construida solo con components/ui/, la única de tema claro: papel, tinta y tipografía para una herramienta editorial, con fondos en patrones de papelería real en vez de escenas cargadas.

Archivo: `components/landings/FolioLanding.tsx`

`GridBackground` ×4 → `TextmodeBackground` → `SceneFlash` → `GlyphCursor` → `Toast` → `NavBar` → `Drawer` → `Hero` → `Reveal` ×19 → `TerminalTyper` → `Typewriter` → `StatsSection` → `FeatureGrid` → `BitmapText` → `Spotlight` → `AsciiCard` ×3 → `SectionHeader` ×5 → `Tabs` → `CodeBlock` ×2 → `Table` → `Timeline` → `HoverFX` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Skeleton` → `StatCounter` → `PricingSection` → `NeonSign` → `Stepper` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `RangeSlider` → `Toggle` → `OtpInput` → `Tooltip` → `MagneticButton` → `Modal` → `Breadcrumbs` → `Panel` → `Dropdown` → `Pagination` → `ScrollArea` → `TestimonialSection` → `TeamSection` → `LogoCloud` → `ArticlesSection` → `FAQSection` → `ScrambleText` → `ContactForm` → `CTASection` → `Divider` → `Footer`

### MARÉ · minimal pixel — `/demo/th-minimal`

Landing mínima de Maré Surf Club: fondo dither de cuadrados duros que evoluciona de amanecer a noche con el scroll, tipografía pixel, titulares con aparición glitch y palabra rotativa.

Archivo: `components/landings/minimal/MinimalLanding.tsx`

`AsciiBackground`

### FORMAS · 2000dvh — `/demo/th-geometry`

Demo de 2000dvh en ocho capítulos: el scroll interpola el tamaño de celda (fino casi siempre), bloom, grano y tinte; en cada cambio la imagen se rompe en bloques y salta de cubo a pirámide, esfera, octaedro, icosaedro, prisma, nudo toroidal y cono. Varias figuras se colocan al borde de la página y cada una tiene su propio hover.

Archivo: `components/landings/minimal/GeometryLanding.tsx`

`AsciiBackground`

### FACETA · landing larga con kit — `/demo/th-faceta`

Landing de prueba de más de 3000dvh: dieciséis actos con el fondo de formas 3D evolucionando con el scroll (celda fina, figuras al borde, hover propio) y, entre carteles con aparición distinta, componentes del kit en estilo pixel duro: características, cifras, marquesina, proceso, pestañas, precios, opiniones, FAQ, galerías de imágenes con Swiper, carrusel de opiniones, cinta de marcas, formulario y pie.

Archivo: `components/landings/minimal/FacetaLanding.tsx`

`FeatureGrid` → `StatsSection` → `SectionHeader` ×18 → `VideoPlayer` ×9 → `Marquee` → `Timeline` → `Stepper` → `Tabs` → `Progress` ×3 → `Badge` ×4 → `ImageGallery` ×8 → `LogoCloud` → `PricingSection` → `TestimonialSection` → `FAQSection` → `CTASection` → `ContactForm` → `Accordion` → `Button` → `Footer`
