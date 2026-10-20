# Catálogo de Trama

> Generado por `scripts/build-catalog.mts` desde `lib/catalog/`. No editar a mano: `npm run catalog`.
> Versión en datos: [`catalog.json`](./catalog.json). Vista previa en vivo: `/componentes#<id>`.

Todos los componentes: `import X from "@/components/ui/X"`, CSS una vez con `import "@/components/ui/styles/kit.css"`,
tema con los tokens `--bg --fg --mut --acc --acc2 --card --ln --r` en cualquier contenedor, estilo con
`variant` (glass · solid · outline · neon · retro · terminal · minimal · dotmatrix · editorial). Las listas se pasan como texto (una entrada por línea o separadas por comas; campos con `|`), tal como muestran los defaults. Para escribir el separador dentro de un elemento, escápalo con barra invertida: `\,` (coma), `\|` (barra) o `\;` (punto y coma), p. ej. `badges="+12 proyectos, 99\,5 % disponibilidad"` (atributo JSX entre comillas; dentro de una cadena JS, `{"…"}`, la barra va doble: `"99\\,5 %"`).

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
| `cellSize` | number 0.1–24 | 8 |
| `maxCells` | number 0–160000 | 0 |
| `adaptive` | boolean | true |
| `colorMode` | `source` · `accent` · `gray` | "source" |
| `charset` | `detailed` · `standard` · `blocks` · `braille` · `technical` | "detailed" |
| `asciiHover` | `none` · `trail` · `water` · `contour` · `dissolve` · `silk` · `vortex` | "water" |
| `hoverStrength` | number 0–1 | 0.7 |
| `hoverRadius` | number 0.1–0.6 | 0.28 |
| `interaction` | `canvas` · `window` | "canvas" |
| `speed` | number 0.1–4 | 1 |
| `fps` | number 1–60 | 60 |
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
| `fontSize` | number 1–28 | 14 |
| `maxCells` | number 20000–1000000 | 250000 |
| `interaction` | `canvas` · `window` | "canvas" |
| `frameRate` | number 1–60 | 60 |
| `opacity` | number 0.1–1 | 1 |

- Cada celda es un carácter con su propio color.
- Cambiar sketch, tamaño o fps recrea el lienzo; la paleta y la opacidad no.

### Fondo de rejilla (CSS) — `GridBackground`

Puntos, líneas, cruces o diagonales con CSS puro. La opción más ligera para fondos discretos. Con kind="grain" es grano de papel (ruido SVG fijo, multiplicado) para poner sobre toda la página con position="fixed", como Sleep Well Creatives. Con kind="contour" son curvas de nivel (mapa topográfico) en SVG calculadas en el servidor, como el fondo de Lando Norris.

| prop | tipo | default |
|---|---|---|
| `kind` | `dots` · `lines` · `cross` · `diagonal` · `grain` · `contour` | "dots" |
| `seed` | number 1–99 | 7 |
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

### Escena 3D retro — `RetroCanvas`

Lienzo react-three-fiber con filtro de pixel art, ASCII y scanlines: cualquier escena 3D se ve como caracteres o píxeles con acabado de monitor CRT.

| prop | tipo | default |
|---|---|---|
| `mode` | `ascii` · `pixel` · `both` | "ascii" |
| `tint` | `mono` · `scene` · `gradient` | "mono" |
| `ramp` | `classic` · `dots` · `braille` · `blocks` · `binary` · `hex` · `code` · `hatch` · `circuit` | "dots" |
| `cellSize` | number 3–20 | 7 |
| `cellAspect` | number 1–2.4 | 1.4 |
| `pixelSize` | number 1–16 | 4 |
| `levels` | number 2–12 | 4 |
| `dither` | number 0–1 | 0.6 |
| `ditherPattern` | `bayer` · `hatch` · `halftone` · `noise` | "bayer" |
| `contrast` | number 0.5–2.5 | 1.25 |
| `invert` | boolean | false |
| `scanlines` | number 0–1 | 0.35 |
| `scanlineSize` | number 1–8 | 3 |
| `scanlineRoll` | number 0–1 | 0 |
| `vignette` | number 0–1 | 0.45 |
| `curvature` | number 0–1 | 0 |
| `noise` | number 0–0.3 | 0 |
| `flicker` | number 0–0.3 | 0.04 |
| `glow` | number 0–1 | 0 |
| `rain` | number 0–1 | 0 |
| `glitch` | number 0–1 | 0 |
| `aberration` | number 0–1 | 0 |
| `pointerFx` | `none` · `parallax` · `orbit` · `tilt` | "none" |
| `pointerStrength` | number 0.2–2.5 | 1 |
| `fps` | number 0–60 | 30 |
| `scrollFps` | number 0–60 | 20 |
| `adaptive` | boolean | true |
| `sceneScale` | number 0–1 | 0 |

- Requiere `three` y `@react-three/fiber` (dependencias opcionales de trama-ui). Importa `trama-ui/RetroCanvas`, no el barrel.
- Los hijos son la escena R3F (luces + mallas); sin hijos se muestra `RetroShapes`. Para un `<Canvas>` propio, `RetroFX` es solo el post-proceso.
- Rellena su contenedor (position: relative y tamaño). Pausa fuera de pantalla; con prefers-reduced-motion dibuja bajo demanda.
- Pensado para ir de fondo en móvil: 30 fps (`fps`), 20 durante el scroll (`scrollFps`), dpr ≤ 1,5 en táctil y bajada adaptativa (`adaptive`). No le pongas `backdrop-filter` encima (guía §22.1).
- Los colores salen de los tokens --fg, --bg y --acc; `fg`, `bg` y `accent` los sustituyen.

### Modelo 3D retro — `RetroModel`

Carga un modelo .glb, .gltf u .obj dentro de RetroCanvas: lo centra, lo escala y le pone un material mate que se lee bien como ASCII o píxeles. Con la cámara siguiendo al ratón.

| prop | tipo | default |
|---|---|---|
| `src` | `/models/turbina.obj` · `/models/asteroide.gltf` · `/models/ciudad.glb` · `/models/suzanne.glb` · `/models/farol.glb` | "/models/turbina.obj" |
| `material` | `clay` · `original` · `wire` | "clay" |
| `flat` | boolean | false |
| `extent` | number 1–7 | 4 |
| `spin` | number 0–30 | 6 |
| `spinAxis` | `x` · `y` · `z` | "y" |
| `float` | boolean | true |
| `rotation` | text | "0,0,0" |

- Va dentro de `RetroCanvas`: `<RetroCanvas pointerFx="orbit"><RetroModel src="/models/turbina.obj" /></RetroCanvas>`. Requiere `three` y `@react-three/fiber`; importa `trama-ui/RetroModel`.
- Modelos de ejemplo en `public/models/`: asteroide.gltf, turbina.obj y ciudad.glb (propios, `scripts/gen-retro-models.mts`) y suzanne.glb y farol.glb (Khronos glTF-Sample-Assets, CC0; créditos en `public/models/LICENSES.md`). Los de otro dominio necesitan CORS.
- `npx tsx scripts/strip-gltf.mts entrada.glb salida.glb` quita texturas, UV y animaciones: tras el filtro no se ven y el archivo baja mucho (el farol pasa de 9,5 MB a 131 KB).
- `material="clay"` (por defecto) sustituye los materiales por un gris mate: texturas y colores apenas se ven tras el filtro y la luz sí. `original` conserva los del archivo (útil con `tint="scene"`).
- Mientras carga no dibuja nada. glTF comprimido con Draco o meshopt no está soportado: expórtalo sin compresión.

### Fondo de color en WebGL (manchas, cinta, haces) — `GradientField`

Fondo de color animado en WebGL sin dependencias: manchas que se mezclan (mesh), la cinta iridiscente de Stripe (ribbon) o los haces de luz en diagonal de Raycast (beams). Usa los colores del tema (--bg, --acc, --acc2) y cambia con él. Media resolución, pausado fuera de pantalla; sin WebGL queda un degradado CSS.

| prop | tipo | default |
|---|---|---|
| `kind` | `mesh` · `ribbon` · `beams` | "mesh" |
| `speed` | number 0–3 | 1 |
| `intensity` | number 0.1–1.5 | 1 |
| `grain` | boolean | true |

- Rellena su contenedor (position: absolute; inset: 0) o la ventana con position="fixed".
- Con movimiento reducido o speed=0 pinta un solo fotograma.
- Pon el texto encima con contraste suficiente sobre la parte más clara del fondo; intensity baja el color.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "terminal" |
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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

### Separador — `Divider`

Separador con etiqueta. El modo texto dibuja la regla con caracteres.

| prop | tipo | default |
|---|---|---|
| `label` | text | "o continúa con" |
| `mode` | `line` · `text` | "line" |
| `pattern` | text | "-=" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

### Texto troceado (cinético) — `SplitText`

Titular o párrafo que entra por líneas, palabras o letras, con máscara de recorte. CSS puro: el estado oculto viene en el HTML del servidor. Espera a que termine el Preloader, si lo hay.

| prop | tipo | default |
|---|---|---|
| `text` | text | "Diseñamos webs que se sienten como una conversación y no como un folleto." |
| `by` | `lines` · `words` · `chars` | "lines" |
| `effect` | `rise` · `rotate` · `blur` · `fade` · `block` · `none` | "rise" |
| `emphasis` | boolean | false |
| `mask` | boolean | true |
| `trigger` | `mount` · `inview` | "mount" |
| `stagger` | number 0.01–0.4 | 0.1 |
| `duration` | number 0.2–2.5 | 0.9 |
| `delay` | number 0–2 | 0 |
| `elastic` | `off` · `pointer` · `scroll` | "off" |
| `stretch` | number 0.2–1.2 | 0.6 |

- by=lines mide cada palabra tras cargar las fuentes y al cambiar el ancho: la entrada es por línea real, no por saltos de línea escritos a mano.
- El lector de pantalla lee una copia del texto íntegro; las unidades visuales van aria-hidden.
- Solo admite un string (no trocea texto controlado por React, guía §10).
- effect="block": una barra del color de acento tapa cada palabra y se retira descubriéndola (Lando Norris); con by=lines o words. emphasis pone las palabras entre *asteriscos* en la fuente de acento (titular mixto palo seco + serifa). Ver /sitios/volt.

### Texto a todo el ancho — `FitText`

Una sola línea que llena exactamente el ancho del contenedor (titulares gigantes de pie de página). Se reajusta al cambiar el tamaño.

| prop | tipo | default |
|---|---|---|
| `text` | text | "Hablemos" |
| `max` | number 0–600 | 0 |

### Texto que se enciende con el scroll — `ScrubText`

Párrafo cuyas palabras pasan de apagadas a plenas según haces scroll. Un cálculo por fotograma, sin GSAP; el lector de pantalla lo lee entero.

| prop | tipo | default |
|---|---|---|
| `text` | text | "Una web es un lugar, no un folleto. Cuidamos cómo se entra, cómo se recorre y qué se s…" |
| `dim` | number 0.05–0.6 | 0.3 |
| `from` | number 0.4–1 | 0.85 |
| `to` | number 0–0.8 | 0.35 |

- Depende del scroll de la página: en el catálogo avanza al desplazar la ventana. Ver el efecto completo en /sitios/estudio.
- Dentro de un PinnedSection el párrafo no se mueve: usa scope=".ui-pin" y range={[a, b]} para que se encienda en ese tramo de la sección (portada de /sitios/plano).

### Texto que se dispersa con el scroll — `ScatterText`

Letras que se separan y se desvanecen al hacer scroll: la marca gigante de un hero que se disuelve (fórmula Belgrade Arbor). `scope` toma el progreso de la sección contenedora cuando el titular está en un contenedor sticky.

| prop | tipo | default |
|---|---|---|
| `text` | text | "ARBOR" |
| `mode` | `exit` · `enter` | "exit" |
| `spread` | number 40–600 | 220 |
| `lift` | number 0–200 | 40 |

- Depende del scroll de la página; con prefers-reduced-motion se ve entero y quieto.

## Tarjetas (`tarjetas`)

Superficies de contenido con capas ASCII.

### Tarjeta ASCII — `AsciiCard`

Número bitmap, fondo ASCII (15 campos procedurales animados × 8 juegos de caracteres, texto repetido o una escena de AsciiBackground), revelado e inclinación hacia el puntero. Siete estilos.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Iniciación" |
| `text` | text | "Grupos de seis, espuma blanda y mucha paciencia. Te levantas el primer día." |
| `meta` | text | "2 h · desde 35 €" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |
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
| `headingLevel` | number 2–6 | 3 |
| `body` | text | "Dos clases de iniciación el sábado por la mañana, con neopreno y tabla incluidos." |
| `footer` | text | "Cancelación gratuita hasta 24 h antes" |
| `bar` | text | "reserva.txt" |
| `cornerGlyph` | text | "" |
| `fill` | `surface` · `tint` · `gradient` · `accent` · `pattern` · `image` | "surface" |
| `pattern` | `dots` · `grid` · `diagonal` · `waves` · `checker` · `rays` | "dots" |
| `image` | text | "gen:3" |
| `tone` | `acc` · `acc2` | "acc" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Tarjeta de precios — `PricingCard`

Plan con precio, características (incluidas y no incluidas) y llamada a la acción. Tres maquetaciones, cuatro formas de destacar (halo, invertida, borde, luz cenital), insignia sobre el borde o junto al nombre, marcas + o ✓, precio tachado y nota.

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
| `highlight` | `glow` · `invert` · `border` · `lift` | "invert" |
| `badge` | text | "Más popular" |
| `badgePlacement` | `tab` · `inline` | "tab" |
| `planCase` | `upper` · `none` | "upper" |
| `marker` | `plus` · `check` | "plus" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |
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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

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
| `headingLevel` | number 2–6 | 3 |
| `excerpt` | text | "El remo cuenta más que la fuerza: la postura y el timing son lo que de verdad te sube …" |
| `author` | text | "Nora Vidal" |
| `date` | text | "12 mar 2026" |
| `readTime` | text | "4 min" |
| `href` | text | "#" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |
| `fill` | `surface` · `tint` · `gradient` · `accent` | "surface" |
| `tone` | `acc` · `acc2` | "acc" |

### Tarjetas apiladas — `StackedCards`

Cada tarjeta se pega arriba y la siguiente la cubre al hacer scroll. position: sticky puro; las cubiertas se encogen un poco donde hay animaciones ligadas al scroll.

Envuelve contenido (`children`), p. ej.: `<article>Tarjeta 1</article> <article>Tarjeta 2</article> <article>Tarjeta 3</article>`

| prop | tipo | default |
|---|---|---|
| `top` | number 0–200 | 24 |
| `step` | number 0–60 | 16 |
| `gap` | number 4–40 | 14 |
| `shrink` | boolean | true |

- Las tarjetas necesitan fondo opaco para tapar a las anteriores.

### Rejilla bento — `BentoGrid`

Celdas de distinto tamaño (1×1, 2×1, 1×2, 2×2) que encajan sin huecos. CSS puro; cada celda admite título, texto, cifra grande o imagen de fondo.

| prop | tipo | default |
|---|---|---|
| `columns` | `2` · `3` · `4` | "4" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "editorial" |

### Tarjeta de producto — `ProductCard`

Imagen con segunda imagen al pasar el puntero, etiqueta, título, material y precio. Todo el cuadro es un único enlace con nombre claro. Sin JS: el cambio de imagen es CSS.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Jarrón Ola" |
| `price` | number 0–999 | 48 |
| `compareAt` | number 0–999 | 0 |
| `badge` | text | "Novedad" |
| `meta` | text | "Jarrones · gres" |
| `soldOut` | boolean | false |
| `ratio` | text | "4 / 5" |

### Marco de plano técnico — `BlueprintFrame`

Borde de línea fina con regla de marcas milimétricas y cruces «+» de registro en las esquinas: la piel de las webs de producto técnico (fórmula Heron AI). Decorativo, sin JS.

Envuelve contenido (`children`), p. ej.: `<h2>Contenido del plano</h2>`

| prop | tipo | default |
|---|---|---|
| `ticks` | boolean | true |
| `marks` | boolean | true |
| `inset` | number 0–40 | 6 |
| `padding` | number 0–80 | 32 |

### Rejilla de celdas con divisores — `CellGrid`

Celdas separadas por divisores de línea fina, continuos o discontinuos, sin tarjetas ni sombras. Los divisores se dibujan con el hueco de la rejilla: sin dobles bordes con cualquier número de celdas.

Envuelve contenido (`children`), p. ej.: `<div>Celda 1</div> <div>Celda 2</div>`

| prop | tipo | default |
|---|---|---|
| `columns` | `1` · `2` · `3` · `4` · `5` | "4" |
| `line` | `solid` · `dashed` | "solid" |
| `padding` | number 8–60 | 24 |

## Interacción (`interaccion`)

Respuestas al puntero.

### Botón — `Button`

Botón del sistema: 6 colores (acento, neutro, éxito, info, aviso, peligro) × 5 énfasis (relleno, superficie, borde, fantasma, enlace), estados pulsado, cargando y deshabilitado, solo icono y como enlace. Siete estilos.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Reservar clase" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "solid" |
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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "solid" |
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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- La mayoría de efectos son CSS puro; «tilt» y «glow» siguen el puntero con GSAP.
- Se puede combinar con Presence: HoverFX dentro, Presence fuera (o al revés) para tener entrada/salida y hover a la vez.
- Todo componente del catálogo puede envolverse así: activa el panel «FX» de la cabecera para probarlo con cualquier demo.

### Área con scroll — `ScrollArea`

Caja de contenido largo (registro de cambios, comentarios, salida de terminal…) con su propia barra de desplazamiento, distinta en cada estilo.

| prop | tipo | default |
|---|---|---|
| `content` | text | "Registro de cambios\nv1.4.0 — Panel de tokens con selector de tipografía y fuentes de …" |
| `height` | number 120–400 | 220 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- La barra de scroll no es exclusiva de este componente: cualquier superficie ui-s--<variante> la hereda automáticamente (ver components/ui/styles/ui-kit.css).

### Enlace que rueda — `RollLink`

Enlace o botón cuyo texto sube y es sustituido por una copia igual al pasar el puntero o enfocar. Solo CSS.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Ver proyectos" |
| `direction` | `up` · `down` | "up" |
| `href` | text | "#" |

### Cursor de página con estados — `CustomCursor`

Punto que persigue al puntero en toda la página y **se ve sobre cualquier fondo**: lee el fondo de debajo (claro, oscuro o imagen) y cambia de color, con un contorno de contraste. Se hace aro sobre enlaces (sin tapar el texto), muestra una etiqueta con data-cursor="Ver", una **imagen** con data-cursor-img="/foto.jpg" (así se compone el índice de proyectos con foto: ProjectList preview="cursor"), se oculta con data-cursor="hide" y es una barra en campos de texto. Solo con puntero fino.

| prop | tipo | default |
|---|---|---|
| `cursorSize` | number 6–40 | 14 |
| `follow` | number 0.05–1 | 0.18 |
| `blend` | `none` · `difference` | "none" |
| `hideNative` | boolean | false |
| `imageWidth` | number 120–420 | 260 |
| `tilt` | number 0–20 | 6 |

- Es global (position: fixed): en el catálogo actúa sobre toda la ventana mientras esta ficha está abierta.
- hideNative oculta el cursor del sistema, salvo en campos de texto.

### Scroll suave (Lenis) — `SmoothScroll`

Scroll con inercia de toda la página, sincronizado con ScrollTrigger. No pinta nada. Se apaga con prefers-reduced-motion y en táctil.

| prop | tipo | default |
|---|---|---|
| `lerp` | number 0.03–0.3 | 0.1 |
| `wheelMultiplier` | number 0.3–2.5 | 1 |
| `anchors` | boolean | true |
| `syncGsap` | boolean | true |

- Colócalo una vez, en el marco de la web. Pausar desde un menú o modal: lockScroll() de @/lib/motion/lenis.
- No está activo en el catálogo para no alterar su scroll; pruébalo en /sitios/estudio.

### Botón circular (también dentro de un titular) — `CircleButton`

Botón de icono circular. Con inline mide lo mismo que la letra y se coloca dentro de un titular («…interior design studio ⊙»). Enlace o botón real, con foco visible y nombre accesible.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Ver más" |
| `size` | `sm` · `md` · `lg` | "md" |
| `inline` | boolean | false |
| `look` | `outline` · `solid` | "outline" |

### Collage de pegatinas arrastrables — `StickerCollage`

Pegatinas vectoriales que flotan sobre un titular y se pueden arrastrar, apilar y mover con las flechas (Uncommon). Decorativo: el texto que importa va en el contenido, no en las pegatinas.

| prop | tipo | default |
|---|---|---|
| `float` | boolean | true |

### Estela de imágenes bajo el cursor — `ImageTrail`

Al mover el puntero por la zona van apareciendo fotos donde está, que crecen y se desvanecen: uno de los efectos más repetidos en portfolios premiados. Decorativa (las imágenes van aria-hidden); lo que cuenta va en el contenido, por encima.

| prop | tipo | default |
|---|---|---|
| `imageWidth` | number 100–400 | 220 |
| `threshold` | number 20–240 | 80 |
| `lifetime` | number 0.3–3 | 0.9 |
| `rotate` | number 0–30 | 8 |

- Solo con puntero fino y sin movimiento reducido; en táctil queda el contenido.
- Recicla 10 <img>: no crea nodos al mover el ratón.

## Transiciones (`transiciones`)

Cambios de escena y de sección.

### Transición de escena — `SceneFlash`

Barrido, iris, rebanadas, persianas o mosaico de píxeles para acompañar un cambio de sección. Usa --acc y --acc2.

| prop | tipo | default |
|---|---|---|
| `kind` | `sweep` · `iris` · `slices` · `blinds` · `pixels` | "sweep" |
| `duration` | number 0.3–3 | 1 |
| `loop` | boolean | false |

### Transición de página — `PageTransition`

Anima la ventana entera al navegar (todo salvo la cabecera y lo que envuelvas en PageTransitionPersist) con la View Transitions API y el <ViewTransition> de React, sin configurar en el App Router de Next: fundido, deslizamiento, barrido de color, línea de escaneo, pila de barras, persianas, disolución por píxeles, encendido CRT, glitch, iris o escritura de terminal. CSS puro con los tokens del tema; una animación fija o una por tipo de navegación.

Envuelve contenido (`children`), p. ej.: `{/* contenido de la página */}`

| prop | tipo | default |
|---|---|---|
| `kind` | `none` · `fade` · `slide` · `wipe` · `scan` · `stack` · `blinds` · `pixelate` · `scanline` · `glitch` · `iris` · `terminal` | "fade" |
| `direction` | `auto` · `left` · `right` · `up` · `down` | "auto" |
| `pace` | `fast` · `normal` · `slow` | "normal" |
| `tone` | `acc` · `acc2` · `fg` | "acc" |

- Anima la raíz del documento (::view-transition-old/new(root)): fondos fijos, pie y márgenes incluidos. En este ejemplo, al cambiar de página se anima toda la ventana del catálogo; las cabeceras quedan quietas.
- Va en cada page.tsx (o en un template.tsx), nunca en un layout. La animación la elige la página de destino. Sin nodos extra en el DOM.
- `scan`: una línea brillante del color `tone` recorre la pantalla (de arriba abajo por defecto) y deja detrás la página nueva, sin apagado CRT. `stack`: una pila de barras de grandes a pequeñas (--acc, --acc2 y su mezcla) tapa la página, se comprime y se va por el lado de `direction`.
- Tipos de navegación: `nav-forward` usa `kind` con `direction` y `nav-back` la dirección contraria (`slide`, `wipe`, `scan`, `stack`; sin `direction` —«auto» en este catálogo—, `down` en scan y `left` en el resto); `trama-<animación>` (p. ej. `trama-glitch`, o `pageTransitionType("glitch")`) elige la animación de esa navegación; `types={{ "mi-tipo": "iris" }}` añade los tuyos. En Next: `<Link transitionTypes={[NAV_FORWARD]}>`.
- Cabecera, barra o cualquier elemento fijo que deba quedarse quieto: envuélvelo en `<PageTransitionPersist name="cabecera">` (un `name` único por elemento).
- Los pseudo-elementos de la transición heredan de <html>: los tokens (--acc, --acc2, --fg, --bg) se leen de :root. Si tu tema vive en un contenedor, repite ahí --acc y el fondo (--ui-vt-page).
- Con «reducir movimiento», solo un fundido de 120 ms. Sin soporte (React sin ViewTransition, navegador sin la API) la página cambia sin animar.

### Transición de elemento — `ElementTransition`

Las mismas 11 animaciones de PageTransition, pero sobre la caja de un elemento suelto (una tarjeta, un panel, el contenido de una pestaña) cuando entra o sale dentro de una transición de React. Incluye SharedTransition para elementos compartidos que se transforman de una vista a otra.

Envuelve contenido (`children`), p. ej.: `{/* el elemento que entra o sale */}`

| prop | tipo | default |
|---|---|---|
| `kind` | `none` · `fade` · `slide` · `wipe` · `scan` · `stack` · `blinds` · `pixelate` · `scanline` · `glitch` · `iris` · `terminal` | "fade" |
| `direction` | `auto` · `left` · `right` · `up` · `down` | "auto" |
| `pace` | `fast` · `normal` · `slow` | "normal" |
| `tone` | `acc` · `acc2` · `fg` | "acc" |

- Anima al montarse o desmontarse dentro de `startTransition`, una navegación o un `<Suspense>`: para cambiar de contenido, cambia su `key`. Sin nodos extra en el DOM.
- Mismos `kind`, `direction`, `pace`, `tone` y `types` que PageTransition, y los mismos tipos de transición (`nav-forward`, `nav-back`, `trama-<animación>`).
- Elemento compartido: `<SharedTransition name={`foto-${id}`}>` en la miniatura del listado y en la imagen de la ficha; al navegar de una a otra, el navegador la transforma de una caja a la otra por encima de la animación de página. `fit="cover"` si las dos cajas tienen distinta proporción; `layout` para que también se deslice al reordenar o filtrar en la misma vista.
- React no forma la pareja si el elemento de la vista de salida estaba fuera del viewport (una tarjeta por debajo del pliegue): entonces solo cambia de página.
- Con «reducir movimiento», solo un fundido de 120 ms. Sin soporte, el cambio es inmediato.

### Elemento que viaja entre rutas — `Traveler`

Un elemento que no desaparece al navegar: vive en el layout (TravelStage) y cada página marca con TravelSlot la caja que ocupa en ella. Al cambiar de ruta, el navegador lo lleva de una caja a otra (posición, tamaño y proporción) con la View Transitions API, con el contenido en directo: un vídeo sigue sonando, un lienzo sigue animando. Para reproductores que se encogen a una esquina, marcas que pasan del titular a la cabecera o una imagen que crece hasta ser la portada.

Envuelve contenido (`children`), p. ej.: `{/* lo que viaja: un <video>, un lienzo, la marca… */}`

| prop | tipo | default |
|---|---|---|
| `fit` | `cover` · `stretch` | "cover" |
| `blend` | `live` · `crossfade` | "live" |
| `pace` | `fast` · `normal` · `slow` | "normal" |

- En una web: `<TravelStage>` en el layout envolviendo a los `<Traveler id="reel">` y a `{children}`; en cada página, `<TravelSlot id="reel" at="mini" className="…" />` con el tamaño y el sitio por CSS. La página que no tenga hueco lo deja invisible e inerte (sigue vivo).
- El viajero lleva `data-at` con el nombre del hueco: su CSS cambia de aspecto en cada sitio (esquinas, controles). `useTraveler(id)` da ese nombre en React; `onMove` avisa al cambiar.
- `blend="live"` (por defecto) muestra solo el estado nuevo, en directo, cambiando de caja: ideal para vídeo y lienzos. `crossfade` funde el viejo con el nuevo (si el contenido cambia de forma). `fit="cover"` recorta si cambia la proporción; `stretch` estira (texto o SVG con la misma proporción).
- Huecos `position: fixed` (mini reproductor en una esquina, cabecera fija) y dentro de `sticky` funcionan. Con varios huecos a la vez gana el de mayor `priority`.
- Dentro de una misma página (modo cine, ampliar): monta otro hueco dentro de `startTransition`, como en este ejemplo.
- Con «reducir movimiento», cambia de sitio con un fundido de 120 ms. Sin la API, salta de caja sin animar. Demo completa: /sitios/travesia.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

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
- 13 efectos, 8 estilos de superficie para el contenido de ejemplo: 104 combinaciones.

### Preloader — `Preloader`

Pantalla de entrada con contador, palabras o barra; bloquea el scroll, se salta con clic o Esc y avisa a SplitText para que sus textos entren al abrirse. Solo la primera visita de la pestaña por defecto.

| prop | tipo | default |
|---|---|---|
| `variant` | `counter` · `words` · `bar` · `fill` | "counter" |
| `brand` | text | "Estudio" |
| `meta` | text | "Madrid — 2026" |
| `duration` | number 0.5–5 | 2 |
| `exit` | `curtain` · `fade` | "curtain" |

- Cubre toda la ventana (position: fixed). En el catálogo se lanza al pulsar «Repetir animación» con once=always.

### Sección fijada con progreso — `PinnedSection`

Se queda fija mientras haces scroll y publica su progreso (0 → 1) en la variable CSS --pin-p para que los hijos se muevan, cambien de opacidad o se recorten con ella. position: sticky, sin GSAP.

Envuelve contenido (`children`), p. ej.: `<h2 className="titulo">Título</h2>`

| prop | tipo | default |
|---|---|---|
| `length` | number 1–8 | 2 |

- Ejemplo de CSS: .titulo { transform: translateX(calc(var(--pin-p) * -40vw)); }
- Ocupa (length + 1) alturas de ventana en el documento.

### Parallax — `Parallax`

Mueve su contenido a distinto ritmo que el scroll (profundidad). Sin GSAP; se apaga con movimiento reducido. Para imágenes: el contenedor recorta y el hijo es más alto.

Envuelve contenido (`children`), p. ej.: `<img src="…" alt="" />`

| prop | tipo | default |
|---|---|---|
| `speed` | number -0.5–0.5 | 0.15 |

### Trazo que se dibuja (firma, subrayado, círculo) — `LineDraw`

Un trazo SVG que se dibuja solo al entrar en pantalla, al montar o siguiendo el scroll: firma, subrayado, círculo o flecha a mano alzada, o cualquier trazado propio (`d` + `viewBox`). La firma sobre la foto de Lando Norris. Decorativo (aria-hidden): el texto va aparte.

| prop | tipo | default |
|---|---|---|
| `shape` | `signature` · `underline` · `circle` · `arrow` | "signature" |
| `trigger` | `inview` · `mount` · `scroll` | "inview" |
| `duration` | number 0.3–5 | 1.6 |
| `strokeWidth` | number 1–12 | 3 |
| `tone` | `acc` · `acc2` · `fg` · `mut` | "acc" |

- Cada tramo (`M…`) se dibuja después del anterior, con el tiempo repartido por su longitud real.
- trigger="scroll" avanza entre el 90 % y el 35 % del alto de la ventana y se borra al subir.
- Sin JS o con movimiento reducido el trazo se ve completo.

### Tema que cambia por sección — `ThemeScroll`

Contenedor cuyo tema cambia según la sección que cruza el centro de la ventana (oliva → hueso → negro en Lando Norris). Cada sección elige su tema con data-theme; cambian los tokens, así que todo lo de dentro (también una cabecera fija) cambia con ellos, y el fondo se funde.

| prop | tipo | default |
|---|---|---|
| `duration` | number 0–2 | 0.7 |

- Depende del scroll de la página: en el catálogo, desplaza la ventana con la ficha a media altura. Ver /sitios/volt.
- Cada tema es parcial (bg, fg, mut, acc, acc2, card, ln): lo que no pongas se hereda.
- Elige colores que se lean en todos los temas: el contenido no cambia, solo sus tokens.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "terminal" |

### Terminal que escribe sola — `TerminalTyper`

Terminal con escritura carácter a carácter. En estilo retro es un monitor de fósforo con el color de --acc.

| prop | tipo | default |
|---|---|---|
| `lines` | text | "$ npx create-landing hoja-vivero\n[ok] plantilla descargada\n[ok] gsap ScrollTrigger c…" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "terminal" |
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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

### Tabla de datos — `Table`

Tabla a partir de texto CSV. La cabecera y las filas se adaptan a la variante.

| prop | tipo | default |
|---|---|---|
| `csv` | text | "Plan, Clases, Precio\nIniciación, 1, 35 €\nBono 5, 5, 150 €\nSurf trip, 6, 240 €" |
| `striped` | boolean | true |
| `width` | `full` · `auto` | "full" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "solid" |

### Bloque de código — `CodeBlock`

Código con cabecera, numeración de línea opcional y botón de copiar. Sin resaltado de sintaxis.

| prop | tipo | default |
|---|---|---|
| `code` | text | "export function greet(name: string) {\n  return `Hola, ${name}`;\n}" |
| `language` | text | "tsx" |
| `filename` | text | "" |
| `showLineNumbers` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "terminal" |

### Hora local — `LocalTime`

«Madrid 14:32»: la hora de una ciudad, detalle habitual en estudios. Se pinta al montar, sin desajuste de hidratación.

| prop | tipo | default |
|---|---|---|
| `city` | text | "Madrid" |
| `timeZone` | text | "Europe/Madrid" |
| `seconds` | boolean | false |

### Tarjeta de indicador (KPI) — `KpiCard`

Etiqueta, cifra, variación con color semántico y mini gráfica. El color nunca es la única señal: la variación lleva signo y flecha.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Ingresos recurrentes" |
| `value` | text | "71.000 €" |
| `delta` | text | "+7,6 %" |
| `trend` | `up` · `down` · `flat` | "up" |
| `lowerIsBetter` | boolean | false |
| `note` | text | "vs. mes anterior" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "editorial" |

- lowerIsBetter invierte los colores cuando que baje es bueno (bajas, tiempos de respuesta).

### Gráfico (líneas, áreas, barras) — `Chart`

Gráfico en SVG sin librerías: escala «bonita», animación de trazo, guía con valores al pasar el puntero o con las flechas. Los datos van además en una tabla oculta para lectores de pantalla.

| prop | tipo | default |
|---|---|---|
| `kind` | `line` · `area` · `bar` | "area" |
| `legend` | boolean | true |
| `unit` | text | " k€" |
| `height` | number 140–520 | 260 |

- Máximo recomendable: 4 series. Tonos: acc, acc2, fg, mut.

### Tabla de datos interactiva — `DataTable`

Ordena al pulsar la cabecera (aria-sort), busca en todas las columnas, selecciona filas y pagina. Datos como array de objetos; celdas a tu manera con render.

| prop | tipo | default |
|---|---|---|
| `searchable` | boolean | true |
| `selectable` | boolean | true |
| `pageSize` | number 0–20 | 4 |
| `striped` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "editorial" |

- Para datos estáticos en CSV, Table. La búsqueda, el orden y la página se anuncian con aria-live.

### Ficha de datos (clave-valor) — `MetaTable`

Datos clave-valor en una caja de línea fina (fechas, lugar, superficie, plazo). Es una lista de definiciones (<dl>): los lectores de pantalla leen cada pareja. Sin JS.

| prop | tipo | default |
|---|---|---|
| `columns` | `1` · `2` | "1" |
| `mono` | boolean | true |

## Navegación (`navegacion`)

Barras, pestañas y acordeones.

### Barra de navegación — `NavBar`

Barra de navegación completa: siete disposiciones (o piezas en el orden que quieras), seis formas de barra, submenús desplegables o mega menú con categorías, barra de búsqueda o paleta ⌘K, menú móvil propio, anuncio, dos llamadas a la acción y comportamiento al hacer scroll.

| prop | tipo | default |
|---|---|---|
| `layout` | `classic` · `left` · `right` · `center` · `split` · `stacked` · `minimal` | "classic" |
| `slots` | text | "" |
| `shape` | `island` · `full` · `contained` · `floating` · `transparent` · `underline` | "island" |
| `size` | `sm` · `md` · `lg` | "md" |
| `bleed` | boolean | false |
| `search` | `none` · `bar` · `inline` · `button` · `command` | "bar" |
| `searchPlaceholder` | text | "Buscar clases, tablas…" |
| `searchItems` | text | "Horarios, Mareas de hoy, Bonos regalo" |
| `brand` | text | "Maré" |
| `links` | text | "Clases > Iniciación\|Grupos de seis y espuma blanda\|icon:users; Perfeccionamiento\|Ví…" |
| `menuStyle` | `auto` · `dropdown` · `mega` | "auto" |
| `openOn` | `hover` · `click` | "hover" |
| `linksAlign` | `start` · `center` · `end` | "center" |
| `cta` | text | "Reservar" |
| `secondaryCta` | text | "Entrar" |
| `announcement` | text | "" |
| `utility` | text | "" |
| `collapseAt` | number 0–1400 | 760 |
| `mobileMenu` | `drawer` · `sheet` | "drawer" |
| `defaultActive` | number 0–5 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- Enlaces como texto, una sección por línea: `Sección > Hijo|descripción|icon:nombre; Hijo=/ruta`. Dentro de un submenú, `#Categoría` abre una columna con título. `Etiqueta=#id` es un enlace real y `Etiqueta [nuevo]` lleva insignia.
- layout elige una disposición; slots la sustituye pieza a pieza: brand, links, search, actions, spacer y menu separadas por espacios, `|` para otra fila y `/` para columnas alineadas a izquierda, centro y derecha. Ej.: "brand / links / search actions".
- Se pliega en menú móvil según el ancho de su contenedor (collapseAt), no de la ventana: baja «Ancho de la vista previa» para verlo.
- Con search="button" o "command" (y siempre en móvil), ⌘K / Ctrl+K y «/» abren la paleta; busca en los enlaces, sus categorías y searchItems.
- La paleta y el cajón móvil salen a document.body con los tokens copiados: un ancestro con backdrop-filter (glass, cabeceras con blur) atraparía su position: fixed.

### Pestañas — `Tabs`

Pestañas con teclado (←/→) y panel. El indicador de la activa cambia con el estilo.

| prop | tipo | default |
|---|---|---|
| `items` | text | "Resumen, Detalles, Reseñas" |
| `content` | text | "Una vista general del producto.\nEspecificaciones técnicas y medidas.\nLo que dicen qu…" |
| `defaultIndex` | number 0–5 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Acordeón — `Accordion`

Preguntas frecuentes con paneles animados por CSS.

| prop | tipo | default |
|---|---|---|
| `items` | text | "¿Necesito experiencia?\|Ninguna. Empezamos desde cero con material blando.\n¿Qué inclu…" |
| `multiple` | boolean | false |
| `defaultOpen` | number 0–5 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Migas de pan — `Breadcrumbs`

Ruta de navegación. El último elemento es la página actual, sin enlace.

| prop | tipo | default |
|---|---|---|
| `items` | text | "Inicio, Cursos, Iniciación al surf" |
| `separator` | text | "/" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

### Paginación — `Pagination`

Números de página con elipsis cuando hay muchas. Gestiona su propia página activa.

| prop | tipo | default |
|---|---|---|
| `total` | number 1–40 | 9 |
| `defaultPage` | number 1–40 | 4 |
| `siblingCount` | number 0–3 | 1 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Menú desplegable — `Dropdown`

Botón que abre una lista de acciones (⋮). Para elegir un valor de formulario, ver Select en Formularios.

| prop | tipo | default |
|---|---|---|
| `label` | text | "⋮" |
| `items` | text | "Editar, Duplicar, Archivar, Eliminar" |
| `align` | `left` · `right` | "right" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Progreso del scroll — `ScrollProgress`

Cuánto se ha leído de la página o de un contenedor con scroll. Se ancla a cualquier borde o esquina (de la ventana o de su contenedor) o va en el flujo, como barra, tramos, puntos, caracteres o anillo.

| prop | tipo | default |
|---|---|---|
| `placement` | `top` · `bottom` · `left` · `right` · `top-left` · `top-right` · `bottom-left` · `bottom-right` · `inline` | "top" |
| `kind` | `bar` · `segments` · `dots` · `ascii` · `ring` | "bar" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `size` | `sm` · `md` · `lg` | "md" |
| `steps` | number 4–60 | 24 |
| `chars` | text | "" |
| `showValue` | boolean | false |
| `smooth` | boolean | true |

- Por defecto mide la página y se fija arriba de la ventana: <ScrollProgress /> en el layout basta.
- target="parent" mide el ancestro con scroll más cercano; un selector ("#articulo") mide ese elemento. Con position="absolute" se ancla al contenedor con position: relative.
- El avance se escribe como variable CSS en un rAF, sin re-renderizar React; con prefers-reduced-motion no se suaviza.
- En la vista previa la barra sigue la caja con scroll, no la página.

### Menú a pantalla completa — `FullscreenMenu`

Botón [menu] que abre un menú de pantalla completa: la cortina baja y los enlaces suben uno a uno. Si el botón está en un <header>, la cabecera NO se mueve: el menú se abre debajo y el mismo botón pasa a [close] sin cambiar de sitio ni de tamaño. Cierra con Esc, pausa el scroll sin que salte la página y deja inerte lo que queda tapado.

| prop | tipo | default |
|---|---|---|
| `brand` | text | "Estudio" |
| `openLabel` | text | "menu" |
| `closeLabel` | text | "close" |
| `note` | text | "Madrid, ES" |

### Cabecera que se esconde al bajar — `HideOnScroll`

Envoltorio de cabeceras fijas: se esconde al bajar, vuelve al subir o llegar arriba, y no se esconde si un descendiente tiene el foco ni con movimiento reducido.

Envuelve contenido (`children`), p. ej.: `<nav>…tu cabecera…</nav>`

| prop | tipo | default |
|---|---|---|
| `offset` | number 0–600 | 120 |

- Va fijo arriba de la ventana; en el catálogo solo se muestra su uso. Ver en /sitios/estudio.

### Indicador de sección — `SectionIndex`

«02 / 05 · Servicios» fijo en una esquina, siguiendo la sección que cruza la mitad de la pantalla. Marca tus secciones con data-section.

| prop | tipo | default |
|---|---|---|
| `position` | `left` · `right` | "left" |
| `selector` | text | "[data-section]" |

- Necesita secciones con data-section en la página; en el catálogo no hay ninguna. Ver en /sitios/estudio.

### Marco de aplicación — `AppShell`

Barra lateral con grupos (plegable a iconos), barra superior y contenido con su propio scroll. En pantallas estrechas la barra pasa a panel con botón (Esc y fuera cierran). Los enlaces son <a href> reales con aria-current.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Resumen" |
| `collapsible` | boolean | true |
| `height` | text | "440px" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "editorial" |

- height admite 100svh (página entera) o un valor fijo cuando va dentro de otra cosa.

### Filtros y orden — `FilterBar`

Grupos de chips (aria-pressed) con contador, selector de orden, número de resultados anunciado con aria-live y «Quitar filtros». Controlada: el estado vive en tu página. Con layout="sentence" filtra con una frase («Fabricamos [qué] para [sector]», como Pentagram): un desplegable nativo por grupo dentro del texto.

| prop | tipo | default |
|---|---|---|
| `layout` | `chips` · `sentence` | "chips" |
| `total` | boolean | true |

- En frase, cada grupo admite un valor; `FilterGroup.any` es el texto de «sin filtro». Guarda el estado en la URL si el listado es largo (ver /sitios/vertice/soluciones).

### Navegación «isla» — `IslandNav`

Píldora flotante centrada arriba, con vidrio esmerilado, que agrupa menú, marca y acción (fórmula Belgrade Arbor). Deja pasar los clics fuera de la píldora. Con un FullscreenMenu en `leading`, el menú se abre debajo de la isla.

| prop | tipo | default |
|---|---|---|
| `hideOnScroll` | boolean | false |

- Es position: fixed; aquí va contenida en el recuadro de puntos. En una web real cuelga de la ventana.

### Pestaña de borde — `EdgeTab`

Pestaña fija pegada al borde de la ventana con el texto en vertical: una llamada a la acción siempre a mano que no ocupa la cabecera. Enlace o botón real con foco visible.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Agenda tu visita" |
| `side` | `right` · `left` | "right" |
| `mark` | text | "A." |
| `top` | text | "50%" |

- Es position: fixed; aquí va contenida en el recuadro de puntos.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Interruptor — `Toggle`

Interruptor accesible. Retro y terminal lo muestran como texto [ON ]/[OFF].

| prop | tipo | default |
|---|---|---|
| `label` | text | "Notificaciones" |
| `defaultChecked` | boolean | true |
| `size` | `sm` · `md` · `lg` | "md" |
| `onText` | text | "ON " |
| `offText` | text | "OFF" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Desplegable — `Select`

Lista de opciones con estilo propio (no un <select> nativo): mismo aspecto en los 8 estilos, abierto o cerrado.

| prop | tipo | default |
|---|---|---|
| `label` | text | "País" |
| `options` | text | "España, Francia, Portugal, Italia, Alemania" |
| `defaultValue` | text | "" |
| `placeholder` | text | "Elige una opción" |
| `size` | `sm` · `md` · `lg` | "md" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Grupo de casillas — `CheckboxGroup`

Casillas independientes. Retro y terminal las muestran como texto [x]/[ ].

| prop | tipo | default |
|---|---|---|
| `label` | text | "Notificaciones" |
| `options` | text | "Email, SMS, Push, Newsletter" |
| `defaultValue` | text | "Email, Push" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Grupo de opciones — `RadioGroup`

Selección única entre varias opciones. Retro y terminal las muestran como texto (•)/( ).

| prop | tipo | default |
|---|---|---|
| `label` | text | "Plan" |
| `options` | text | "Mensual, Anual" |
| `defaultValue` | text | "Mensual" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Pasos — `Stepper`

Indicador de progreso por pasos (alta, checkout, onboarding…). No gestiona el contenido de cada paso.

| prop | tipo | default |
|---|---|---|
| `steps` | text | "Datos, Envío, Pago, Confirmación" |
| `current` | number 0–5 | 1 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Código de verificación — `OtpInput`

Casillas de código (SMS, autenticación en dos pasos): el foco avanza solo al escribir.

| prop | tipo | default |
|---|---|---|
| `length` | number 4–8 | 6 |
| `size` | `sm` · `md` · `lg` | "md" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "terminal" |

### Selector de cantidad — `QuantityStepper`

− y + con el producto nombrado en cada botón («Quitar una unidad de Taza») y el valor anunciado al cambiar.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Taza Alba" |
| `size` | `sm` · `md` | "md" |

### Selector de variante (color, talla) — `OptionPicker`

Círculos de color (con su nombre accesible) o chips de texto. Botones de radio nativos: flechas para moverse, la elegida se anuncia y las agotadas quedan tachadas y deshabilitadas.

| prop | tipo | default |
|---|---|---|
| `kind` | `swatch` · `chip` | "swatch" |
| `label` | text | "Esmalte" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Aviso — `Alert`

Mensaje inline con icono según el tipo, permanente (no desaparece solo). Para una notificación temporal, ver Toast en Overlays.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Cambios guardados" |
| `message` | text | "Tu perfil se actualizó correctamente." |
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "success" |
| `dismissible` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Indicador de carga — `Spinner`

Anillo CSS o animaciones de texto: línea, braille, puntos, barra y bloques.

| prop | tipo | default |
|---|---|---|
| `kind` | `ring` · `line` · `braille` · `dots` · `bar` · `blocks` | "braille" |
| `label` | text | "Cargando…" |
| `fontSize` | number 12–48 | 20 |
| `fps` | number 2–30 | 12 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "terminal" |

### Esqueleto de carga — `Skeleton`

Placeholder con barrido animado mientras carga el contenido real: texto, tarjeta, avatar o filas de tabla.

| prop | tipo | default |
|---|---|---|
| `kind` | `text` · `card` · `avatar` · `table` | "text" |
| `lines` | number 1–6 | 3 |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "mut" |

### Tecla (atajo) — `Kbd`

Una tecla o combinación en un recuadro (<kbd>): atajos en menús, paletas y ayudas.

Envuelve contenido (`children`), p. ej.: `⌘K`

| prop | tipo | default |
|---|---|---|
| `text` | text | "⌘K" |

### Avatar — `Avatar`

Imagen o iniciales con punto de estado opcional. El nombre y el estado van como texto accesible.

| prop | tipo | default |
|---|---|---|
| `name` | text | "Lucía Ferrer" |
| `size` | `sm` · `md` · `lg` | "md" |
| `status` | `none` · `online` · `away` · `busy` · `offline` | "online" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |

### Estado vacío — `EmptyState`

Qué pasa y qué puedes hacer cuando no hay datos, resultados o hay un error. Una sola acción principal.

Envuelve contenido (`children`), p. ej.: `<Button label="Conectar una integración" />`

| prop | tipo | default |
|---|---|---|
| `title` | text | "Aún no has conectado integraciones" |
| `text` | text | "Conecta tu pasarela de pago o tu CRM para que importemos los clientes." |
| `glyph` | text | "◌" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "editorial" |

### Precio con rebaja — `PriceTag`

Precio con precio anterior tachado y porcentaje de descuento. El tachado y la rebaja llevan texto accesible: no dependen del color ni del tachado.

| prop | tipo | default |
|---|---|---|
| `price` | number 0–999 | 28 |
| `compareAt` | number 0–999 | 34 |
| `size` | `sm` · `md` · `lg` | "lg" |
| `currency` | `EUR` · `USD` · `GBP` | "EUR" |

## Galerías, vídeo y audio (`galerias`)

Galerías de imágenes y carruseles sobre Swiper (coverflow, baraja, cubo, mosaico, cintas continuas), reproductor de vídeo y reproductor de música.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "retro" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- Las secciones (testimonios, ventajas, precios, equipo, blog) lo usan por dentro con `layout="carousel"`; úsalo directamente para cualquier lista de tarjetas.
- En pantallas estrechas baja solo a 2 y a 1 diapositiva visible.

### Mockup de dispositivo — `DeviceMockup`

Vista previa de una web dentro de un móvil, tablet, portátil, monitor o ventana de navegador dibujados con CSS: web real en un iframe a tamaño de viewport, captura (con recorrido de páginas largas), vídeo o contenido React. Sin WebGL ni dependencias; para enseñar proyectos en un portfolio o una landing.

| prop | tipo | default |
|---|---|---|
| `device` | `phone` · `tablet` · `laptop` · `desktop` · `browser` | "phone" |
| `platform` | `ios` · `android` | "ios" |
| `orientation` | `portrait` · `landscape` | "portrait" |
| `rotatable` | boolean | false |
| `rotateLabel` | text | "Girar el dispositivo" |
| `url` | text | "" |
| `image` | text | "" |
| `video` | text | "" |
| `alt` | text | "" |
| `urlLabel` | text | "" |
| `imageScroll` | `hover` · `auto` · `none` | "hover" |
| `interactive` | boolean | false |
| `viewportWidth` | number 0–1920 | 0 |
| `safeArea` | boolean | false |
| `systemNav` | boolean | false |
| `finish` | `theme` · `black` · `graphite` · `silver` · `white` · `gold` · `blue` · `rose` | "theme" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "mut" |
| `rotateX` | number -30–40 | 0 |
| `rotateY` | number -60–60 | 0 |
| `motion` | `none` · `float` · `sway` · `spin` · `pointer` | "float" |
| `pointerX` | number 0–45 | 16 |
| `pointerY` | number 0–30 | 10 |
| `pointerSide` | `both` · `left` · `right` | "both" |
| `speed` | number 0.2–3 | 1 |
| `shadow` | boolean | true |
| `glare` | boolean | true |
| `shine` | number 0–2 | 1 |
| `screenShine` | number 0–2 | 1 |
| `still` | boolean | false |

- `finish` elige el color de la carcasa: `theme` (por defecto) lo saca del tema con `tone`; `black`, `graphite`, `silver`, `white`, `gold`, `blue` y `rose` son colores de aparato, iguales en cualquier tema. El cristal y el marco de la pantalla son siempre negros.
- Contenido, por orden de preferencia: `url` (web real en un iframe), `video`, `children` (React) o solo `image` (captura). Con `url` o `video`, `image` es la imagen previa y la que queda en modo estático.
- La pantalla simula el viewport real del dispositivo (móvil 390 px, o 412 con `platform` android; tablet 820, portátil 1440, monitor 1920, navegador 1280) y lo reduce al tamaño del mockup: la web se ve como en ese aparato. `viewportWidth` lo cambia. Los `children` pueden responder a ese ancho con `@container`.
- Una web solo se puede incrustar si lo permite: `X-Frame-Options: DENY` o `frame-ancestors 'none'` la dejan en blanco, y tu propia CSP necesita `frame-src` con ese origen. Para webs de terceros, usa una captura.
- Ocupa el ancho de su contenedor (que debe tener ancho propio) hasta `--device-max`: 300 px el móvil, 460 la tablet, 860 el portátil, 900 el monitor y el navegador.
- `safeArea` (móvil): la web no se pinta bajo la isla sino debajo de ella, como el área segura de un teléfono real; la franja es negra o del color de `--device-safe` (p. ej. el de la cabecera de la web).
- `orientation` fija la orientación de móvil y tablet; `rotatable` añade debajo un botón para que el visitante lo gire (la web en vivo se adapta al nuevo viewport).
- `systemNav` (móvil y tablet): pinta la navegación del sistema y deja la web por encima; el indicador de inicio con `platform` ios, o los tres botones de Android (a la derecha con el móvil en horizontal). Color de los iconos: `--device-nav`.
- Con `motion` pointer, `pointerX` y `pointerY` son los grados máximos de giro horizontal e inclinación vertical (0 anula ese eje) y `pointerSide` deja girar solo hacia un lado: con `left`, el aparato solo se vuelve cuando el puntero está a su izquierda.
- Por defecto el contenido no es utilizable (no atrapa el scroll ni el foco); `interactive` lo activa.
- Con `prefers-reduced-motion` queda quieto y el vídeo no arranca. `still` lo fuerza y además muestra `image` en lugar de la web.

### Mockup de dispositivo 3D — `DeviceMockup3D`

El mismo mockup con volumen: carcasa three.js generada (canto, cristal, reflejos, sombra) y la pantalla como DOM real colocado en 3D, así la web en vivo sigue siendo utilizable. Si el equipo no puede con WebGL, va justo o pide reducir movimiento, pinta solo la versión CSS como imagen fija.

| prop | tipo | default |
|---|---|---|
| `render` | `auto` · `3d` · `flat` · `static` | "auto" |
| `device` | `phone` · `tablet` · `laptop` · `desktop` · `browser` | "phone" |
| `platform` | `ios` · `android` | "ios" |
| `orientation` | `portrait` · `landscape` | "portrait" |
| `rotatable` | boolean | false |
| `rotateLabel` | text | "Girar el dispositivo" |
| `url` | text | "" |
| `image` | text | "" |
| `video` | text | "" |
| `alt` | text | "" |
| `urlLabel` | text | "" |
| `imageScroll` | `hover` · `auto` · `none` | "hover" |
| `interactive` | boolean | false |
| `viewportWidth` | number 0–1920 | 0 |
| `safeArea` | boolean | false |
| `systemNav` | boolean | false |
| `finish` | `theme` · `black` · `graphite` · `silver` · `white` · `gold` · `blue` · `rose` | "theme" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "mut" |
| `rotateX` | number -30–40 | 0 |
| `rotateY` | number -60–60 | 0 |
| `motion` | `none` · `float` · `sway` · `spin` · `pointer` | "float" |
| `pointerX` | number 0–45 | 16 |
| `pointerY` | number 0–30 | 10 |
| `pointerSide` | `both` · `left` · `right` | "both" |
| `speed` | number 0.2–3 | 1 |
| `shadow` | boolean | true |
| `glare` | boolean | true |
| `shine` | number 0–2 | 1 |
| `screenShine` | number 0–2 | 1 |
| `still` | boolean | false |

- Requiere `three` y `@react-three/fiber` (opcionales en el paquete): importa `trama-ui/DeviceMockup3D`. three se descarga bajo demanda, al acercarse el mockup a la pantalla; mientras, se ve la versión CSS en la misma caja y con la misma pose.
- `render`: `auto` elige 3D salvo sin WebGL2, con `Save-Data`, ≤ 2 GB de memoria, ≤ 2 núcleos o `prefers-reduced-motion`, que caen a imagen fija; `3d` lo fuerza; `flat` es la versión CSS; `static`, la CSS quieta con `image` en lugar de la web.
- Cada mockup 3D es un contexto WebGL (los navegadores admiten unos 16): en una rejilla de proyectos usa 3D en uno o dos destacados y `DeviceMockup` en el resto. Dibuja bajo demanda y se detiene fuera de pantalla.
- `finish` elige el color de la carcasa: `theme` (por defecto) lo saca del tema con `tone`; `black`, `graphite`, `silver`, `white`, `gold`, `blue` y `rose` son colores de aparato, iguales en cualquier tema. El cristal y el marco de la pantalla son siempre negros.
- Contenido, por orden de preferencia: `url` (web real en un iframe), `video`, `children` (React) o solo `image` (captura). Con `url` o `video`, `image` es la imagen previa y la que queda en modo estático.
- La pantalla simula el viewport real del dispositivo (móvil 390 px, o 412 con `platform` android; tablet 820, portátil 1440, monitor 1920, navegador 1280) y lo reduce al tamaño del mockup: la web se ve como en ese aparato. `viewportWidth` lo cambia. Los `children` pueden responder a ese ancho con `@container`.
- Una web solo se puede incrustar si lo permite: `X-Frame-Options: DENY` o `frame-ancestors 'none'` la dejan en blanco, y tu propia CSP necesita `frame-src` con ese origen. Para webs de terceros, usa una captura.
- Ocupa el ancho de su contenedor (que debe tener ancho propio) hasta `--device-max`: 300 px el móvil, 460 la tablet, 860 el portátil, 900 el monitor y el navegador.
- `safeArea` (móvil): la web no se pinta bajo la isla sino debajo de ella, como el área segura de un teléfono real; la franja es negra o del color de `--device-safe` (p. ej. el de la cabecera de la web).
- `orientation` fija la orientación de móvil y tablet; `rotatable` añade debajo un botón para que el visitante lo gire (la web en vivo se adapta al nuevo viewport).
- `systemNav` (móvil y tablet): pinta la navegación del sistema y deja la web por encima; el indicador de inicio con `platform` ios, o los tres botones de Android (a la derecha con el móvil en horizontal). Color de los iconos: `--device-nav`.
- Con `motion` pointer, `pointerX` y `pointerY` son los grados máximos de giro horizontal e inclinación vertical (0 anula ese eje) y `pointerSide` deja girar solo hacia un lado: con `left`, el aparato solo se vuelve cuando el puntero está a su izquierda.
- Por defecto el contenido no es utilizable (no atrapa el scroll ni el foco); `interactive` lo activa.

### Logo giratorio 3D — `LogoCoin`

Un logo con volumen que gira sobre su eje vertical, como una moneda: la marca en las dos caras y canto visible. CSS 3D puro, sin WebGL ni dependencias: lo anima el compositor, no cuesta nada dentro de un contenedor oculto y no recibe toques. Para dar vida a un menú, una cabecera o una pantalla de carga.

| prop | tipo | default |
|---|---|---|
| `src` | text | "" |
| `diameter` | number 40–320 | 120 |
| `thickness` | number 2–48 | 12 |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `faceTone` | `bg` · `fg` · `acc` · `acc2` · `mut` | "bg" |
| `fit` | `cover` · `contain` | "cover" |
| `speed` | number -4–4 | 1 |
| `tilt` | number -40–40 | 10 |
| `draggable` | boolean | false |
| `glare` | boolean | true |
| `still` | boolean | false |
| `alt` | text | "" |

- La marca va en `src` (URL, ruta o `gen:N`) o como `children` (un SVG, un `Icon`, texto), que se pinta en las dos caras. Con un logo ya redondo, `fit` cover; con uno suelto, contain.
- Decorativo por defecto: `aria-hidden` y sin eventos. `alt` le da nombre accesible. `draggable` deja girarlo arrastrando, con inercia (entonces sí recibe toques, pero el scroll vertical pasa).
- Sin `draggable` no ejecuta JavaScript por fotograma: es una animación CSS de `transform`. Con `prefers-reduced-motion` o `still` queda quieto y ladeado, con el canto a la vista.
- Color del canto: `tone`. Fondo de las caras: `faceTone`.

### Logo 3D — `Logo3D`

La marca como objeto 3D: un trazado SVG extruido que gira, se balancea, flota o sigue al puntero, pintado como sólido, malla de alambre, caracteres ASCII o pixel art con el mismo filtro que RetroCanvas (rampas de glifos, dither, scanlines, glow, glitch). Decorativo, para un menú, una cabecera o un hero.

| prop | tipo | default |
|---|---|---|
| `path` | text | "M78 62 44 96l34 34M114 62l34 34-34 34" |
| `viewBox` | text | "0 0 192 192" |
| `strokeWidth` | number 0–60 | 16 |
| `depth` | number 2–120 | 22 |
| `bevel` | number 0–12 | 3 |
| `base` | `none` · `plate` · `ring` | "none" |
| `renderStyle` | `solid` · `wire` · `ascii` · `pixel` · `both` | "ascii" |
| `ramp` | `classic` · `dots` · `braille` · `blocks` · `binary` · `hex` · `code` · `hatch` · `circuit` | "classic" |
| `chars` | text | "" |
| `cellSize` | number 3–20 | 6 |
| `pixelSize` | number 2–16 | 4 |
| `levels` | number 2–8 | 4 |
| `dither` | number 0–1 | 0.6 |
| `ditherPattern` | `bayer` · `hatch` · `halftone` · `noise` | "bayer" |
| `tint` | `mono` · `scene` · `gradient` | "mono" |
| `scanlines` | number 0–1 | 0.2 |
| `glow` | number 0–1 | 0 |
| `glitch` | number 0–1 | 0 |
| `invert` | boolean | false |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "fg" |
| `baseTone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `motion` | `spin` · `sway` · `float` · `pointer` · `none` | "spin" |
| `axis` | `y` · `x` · `z` | "y" |
| `speed` | number -4–4 | 1 |
| `tilt` | number -45–45 | 8 |
| `draggable` | boolean | false |
| `paused` | boolean | false |
| `charge` | number 0–1 | 0 |
| `explode` | boolean | false |
| `explodeDuration` | number 0.3–4 | 1.2 |
| `particles` | number 0–6000 | 1800 |
| `particleSize` | number 1–12 | 3 |
| `fill` | boolean | false |
| `markSize` | number 0–400 | 0 |
| `markPosition` | text | "0.5,0.5" |
| `height` | number 80–480 | 160 |
| `fps` | number 0–60 | 30 |
| `render` | `auto` · `3d` · `static` | "auto" |
| `alt` | text | "" |

- Requiere `three` y `@react-three/fiber` (opcionales en el paquete): importa `trama-ui/Logo3D`. Se descargan bajo demanda; mientras, y si el equipo no puede con WebGL, va justo, pide ahorrar datos o reducir movimiento, se ve la marca plana en SVG.
- La marca es `path` (el atributo `d` de un SVG) con su `viewBox`. Con `strokeWidth` > 0 el trazado es una línea de ese grosor con extremos redondos; con 0, una forma rellena. No acepta imágenes: de un PNG no se puede sacar volumen.
- `renderStyle` ascii, pixel y both usan `RetroFX`: `ramp`, `chars`, `cellSize`, `pixelSize`, `levels`, `dither`, `ditherPattern`, `tint`, `scanlines`, `glow`… Con ellos el lienzo se pinta sobre `--bg` (opaco); `solid` y `wire` son transparentes.
- Colores por tokens: `tone` (marca y caracteres) y `baseTone` (placa o aro, y el acento de `tint` gradient). `tint` scene conserva los colores de la escena en vez de monocromo.
- Partículas: `charge` (0–1) hace que la marca suelte partículas de su superficie, y `explode` la deshace entera (`onExploded` avisa al terminar; al volver a false se recompone). Pasan por el mismo filtro, así que en ASCII se ven como caracteres. Para que tengan sitio, `fill` rellena el contenedor y `markSize` / `markPosition` colocan la marca dentro.
- Decorativo por defecto (`aria-hidden`, sin eventos). `draggable` deja girarlo arrastrando, con inercia. Dibuja a `fps` solo mientras se mueve, y nada fuera de pantalla o dentro de un contenedor oculto.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "retro" |

- «Fuente» admite un archivo (.mp4, .webm), un enlace de YouTube (watch, youtu.be, shorts) o de Vimeo. Con un enlace de YouTube/Vimeo solo aplican título, proporción y carátula.
- Atajos con el reproductor enfocado: espacio o K, ←/→ ±5 s (J/L ±10 s), ↑/↓ volumen, M silencio, F pantalla completa, C subtítulos, 0–9 salta al 0–90 %.
- Muestras: dos vídeos de Cloudinary (cld-sample-video y sea-turtle), uno local generado con ffmpeg (public/video/pixel-life.mp4, 8 s, sin audio) y un enlace de YouTube. La carátula de los de Cloudinary sale de un fotograma del propio vídeo (cloudinaryPoster).
- El efecto ASCII pinta el vídeo como caracteres encima del original (que sigue reproduciéndose debajo). Exige que el servidor del vídeo permita CORS: Cloudinary y los archivos del propio sitio sí; si no, avisa y muestra el vídeo normal.
- Con prefers-reduced-motion el autoplay y el modo fondo no arrancan; fuera de pantalla el vídeo se pausa solo (pauseOffscreen).

### Reproductor de música — `AudioPlayer`

Lista de pistas con visualizador (barras, onda o puntos), repetición, volumen y teclado (espacio, flechas, M). Reproduce archivos o música sintetizada en el navegador (`synth:estilo:bpm:semilla`) para demos sin audio.

| prop | tipo | default |
|---|---|---|
| `tracks` | text | "Mar de fondo\|Maré Surf Club\|synth:ambient:80:2\|1:40\nSerie grande\|Maré Surf Club\|…" |
| `layout` | `full` · `bar` · `minimal` | "full" |
| `visualizer` | `bars` · `wave` · `dots` · `none` | "bars" |
| `showPlaylist` | boolean | true |
| `repeat` | `off` · `all` · `one` | "all" |
| `defaultVolume` | number 0–1 | 0.8 |
| `dock` | `none` · `bottom` · `top` · `bottom-left` · `bottom-right` | "none" |
| `dockDraggable` | boolean | true |
| `dockVisualizer` | `bars` · `wave` · `dots` · `none` | "bars" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Scroll horizontal — `HorizontalScroll`

El scroll vertical de la página desplaza una fila de paneles en horizontal. En pantallas estrechas y con movimiento reducido pasa a ser un carrusel nativo con imán, sin secuestrar el scroll.

Envuelve contenido (`children`), p. ej.: `<article>Panel 1</article> <article>Panel 2</article> <article>Panel 3</article>`

| prop | tipo | default |
|---|---|---|
| `heading` | text | "Cómo trabajamos" |
| `gap` | number 0–80 | 24 |
| `minWidth` | number 320–1400 | 860 |

- Cada hijo directo es un panel. Ver en /sitios/estudio (sección «Cómo trabajamos»).
- También publica --hs-p (0 → 1).

### Imagen que se descubre — `ImageReveal`

Imagen que se abre con una máscara (clip-path) mientras se asienta de una ampliación a su tamaño. Reserva su hueco con ratio y espera al Preloader.

| prop | tipo | default |
|---|---|---|
| `from` | `bottom` · `top` · `left` · `right` · `center` | "bottom" |
| `ratio` | text | "4 / 5" |
| `zoom` | number 1–2 | 1.25 |
| `duration` | number 0.3–3 | 1.2 |

### Imagen con distorsión (WebGL) — `DistortImage`

Imagen que se deforma con un shader alrededor del puntero: ondas, líquido, separación RGB o lupa. Es un <img> normal; el lienzo WebGL se crea al pasar el puntero y se destruye al apagarse, así que una rejilla de muchas imágenes no agota los contextos.

| prop | tipo | default |
|---|---|---|
| `effect` | `ripple` · `liquid` · `rgb` · `lens` | "ripple" |
| `strength` | number 0.2–3 | 1 |
| `radius` | number 0.1–1 | 0.45 |
| `ratio` | text | "4 / 5" |

- Requiere three y @react-three/fiber: se importa por subruta, trama-ui/DistortImage.
- Sin WebGL, en táctil, en equipos modestos y con movimiento reducido se queda la imagen plana.

### Rejilla infinita arrastrable — `DragGrid`

Rejilla que se arrastra en cualquier dirección sin fin, con inercia, táctil y teclado (flechas). Un grupo fijo de celdas se recoloca en cada fotograma: no hay miles de nodos. Un arrastre no dispara el clic de las celdas.

| prop | tipo | default |
|---|---|---|
| `cellWidth` | number 100–420 | 200 |
| `ratio` | number 0.5–1.6 | 0.8 |
| `gap` | number 0–40 | 14 |
| `inertia` | number 0.8–0.98 | 0.93 |
| `drift` | number 0–80 | 0 |
| `wheel` | boolean | false |

- En táctil captura el gesto dentro del visor: dale un alto razonable para que se pueda seguir desplazando la página.
- Para el lector de pantalla hay una lista oculta con cada elemento una vez.

### Objeto 3D con materiales físicos — `ObjectStage`

Un objeto 3D con metal, vidrio, plástico barnizado o mate y reflejos de estudio, sin cargar ningún HDR (RoomEnvironment de three). El color sale de los tokens del tema. Sin WebGL o con movimiento reducido, una esfera plana con degradado.

| prop | tipo | default |
|---|---|---|
| `shape` | `knot` · `sphere` · `torus` · `capsule` · `gem` | "knot" |
| `material` | `metal` · `glass` · `gloss` · `matte` | "metal" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |
| `motion` | `pointer` · `spin` · `float` · `none` | "pointer" |
| `speed` | number 0.2–3 | 1 |
| `height` | number 160–700 | 340 |

- Requiere three y @react-three/fiber: se importa por subruta, trama-ui/ObjectStage.
- Es el contrapunto limpio de RetroCanvas: misma tecnología, sin filtro retro.

### Galería de producto — `ProductGallery`

Imagen principal con zoom que sigue al puntero y miniaturas que son botones reales (aria-pressed). En táctil no hay zoom: la imagen se ve entera.

| prop | tipo | default |
|---|---|---|
| `thumbs` | `below` · `side` | "below" |
| `zoom` | number 1–3 | 1.8 |
| `ratio` | text | "4 / 5" |

### Paneles que se expanden — `ExpandingPanels`

Columnas verticales que se reparten el ancho; al pasar el puntero o enfocar con teclado una se expande y las demás se estrechan (fórmula LPAS). Cada panel es un enlace real; en estrechas se apilan en filas.

| prop | tipo | default |
|---|---|---|
| `height` | text | "320px" |
| `grow` | number 1.5–8 | 4 |

### Lienzo explorable por arrastre — `ExplorableCanvas`

Un mundo más grande que la ventana con puntos clicables (Overworld Audio): se arrastra con inercia, se mueve con flechas, cada punto centra la vista y abre su ficha. Incluye vista de lista como alternativa accesible. Con depth="3d" el mundo es una maqueta de papel en three.js (cartón, metacrilato, madera y árboles de espuma, sombras suaves) con una intro que pasa del plano a la maqueta; con nav="scroll" dentro de un PinnedSection, el scroll lleva la cámara por una ruta de paradas (Oryzo, Primland). Usa el arrastre de DragGrid (lib/ui/dragPan.ts), un OptionPicker para «Mapa / Lista» y la carga diferida de los componentes 3D (lib/ui/gl.tsx).

| prop | tipo | default |
|---|---|---|
| `depth` | `flat` · `3d` | "3d" |
| `tilt` | number 0–70 | 52 |
| `intro` | boolean | true |
| `explode` | number 0–160 | 0 |
| `frame` | boolean | true |
| `listToggle` | boolean | true |
| `hint` | text | "Arrastra para explorar · pulsa un punto" |

- depth="3d" carga three solo si el equipo puede y el mapa está en pantalla; mientras tanto (y con movimiento reducido) se ve el plano 2D con las huellas de los volúmenes.
- La maqueta puede ser un modelo real (`model`: GLB por capas). `scripts/maqueta/` convierte un IFC (`ifc_to_glb.py`, la clínica de /sitios/plano) o un barrio de OpenStreetMap (`osm_to_glb.py`, el Eixample de este ejemplo) con su planta en SVG para el tablero y la vista 2D. Los datos de OpenStreetMap piden la atribución a la vista (ODbL).
- También acepta volúmenes generados (`blocks`); `lib/sites/maqueta.ts` trae `city()` (manzanas con plazas) y `walls()` (muros a partir de un plano).
- nav="scroll" necesita un PinnedSection alrededor: ver la portada de la demo Alzado.
- Cada parada de `path` puede separar las capas (`explode`, con `MapBlock.layer`), dejar una sólida y el resto en alambre (`focusLayer`), barrer la maqueta con un plano de luz que descubre los puntos (`scan`), resaltar un punto (`focus`) y cambiar el fondo (`bg`). Con captions={false} y onStop la web pinta sus propios capítulos: ver la portada de /sitios/plano.
- `MapBlock.z` levanta un volumen del tablero (vigas, conductos) y mat="wire" lo dibuja solo en aristas.

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

### Formulario de contacto — `ContactForm`

Nombre, email y mensaje (o solo email, en línea, para un boletín) con estado de envío propio (carga, error y éxito). Conecta el envío real con la prop `onSubmit`.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Escríbenos" |
| `subtitle` | text | "Te respondemos en menos de 24 horas." |
| `fields` | `name,email,message` · `email` | "name,email,message" |
| `layout` | `stacked` · `inline` | "stacked" |
| `submitLabel` | text | "Enviar mensaje" |
| `successMessage` | text | "Gracias, te contestaremos pronto." |
| `errorTitle` | text | "No se pudo enviar" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- `onSubmit(data)` puede ser `async`: mientras la promesa está pendiente el botón muestra la carga; si resuelve `{ ok: false, message }` o lanza, sale un `Alert` danger (`role="alert"`) con `errorTitle` y el mensaje (o `errorMessage`) y lo escrito se conserva; si resuelve `{ ok: true }` o nada, el estado de éxito. Sin `onSubmit`, o con uno síncrono sin retorno, siempre éxito (como la demo).
- Ej.: `onSubmit={async (d) => { const r = await fetch("/api/contacto", { method: "POST", body: JSON.stringify(d) }); return r.ok ? { ok: true } : { ok: false, message: "El servidor no respondió." }; }}`

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "neon" |

### Sección de FAQ — `FAQSection`

Cabecera de sección más acordeón: las preguntas frecuentes listas para el final de una landing.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Preguntas frecuentes" |
| `title` | text | "Todo lo que necesitas saber" |
| `items` | text | "¿Necesito experiencia?\|Ninguna. Empezamos desde cero con material blando.\n¿Qué inclu…" |
| `multiple` | boolean | true |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Sección de cifras — `StatsSection`

Cabecera de sección más una fila de cifras ASCII que cuentan hacia arriba (StatCounter): la sección de «resultados» típica.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "En números" |
| `title` | text | "Diez años enseñando a leer el mar" |
| `stats` | text | "500\|+\|Alumnos formados\n4.9\|\|Valoración media\n12\|\|Años de experiencia" |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |

### Sección de precios — `PricingSection`

Cabecera + planes (PricingCard) con selector mensual/anual, plan destacado (invertido, con halo, con borde o con luz cenital) y características no incluidas. Rejilla, una sola pieza con columnas (joined, como Linear o Vercel), lista horizontal o carrusel.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Precios" |
| `title` | text | "Un plan para cada tamaño" |
| `subtitle` | text | "Cambia o cancela cuando quieras." |
| `plans` | text | "Básico\|9 €\|/ mes\|no\|Un proyecto;Exportación PNG;Soporte por email;-Dominio propio\…" |
| `layout` | `grid` · `joined` · `list` · `carousel` | "grid" |
| `cardLayout` | `classic` · `compact` | "classic" |
| `highlight` | `invert` · `glow` · `border` · `lift` | "invert" |
| `badge` | text | "Más popular" |
| `planCase` | `upper` · `none` | "upper" |
| `marker` | `plus` · `check` | "plus" |
| `toggle` | `accent` · `neutral` | "accent" |
| `fill` | `surface` · `tint` · `gradient` · `pattern` | "surface" |
| `yearlyNote` | text | "2 meses gratis" |
| `cta` | text | "Empezar ahora" |
| `perView` | number 1–4 | 3 |
| `autoplay` | number 0–8 | 0 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- Fórmula de producto (Linear, Vercel; /sitios/faro): layout="joined", highlight="lift", planCase="none", marker="check", toggle="neutral" y variant="editorial" (botón principal sólido en el color del texto).
- Un precio anual igual al mensual («A medida», «0 €») mantiene su periodo y no muestra «equivale a».

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Pie de página — `Footer`

Marca, columnas de enlaces, redes y línea de copyright: el cierre habitual de cualquier landing.

| prop | tipo | default |
|---|---|---|
| `brand` | text | "Maré Surf Club" |
| `tagline` | text | "Del primer remo a tu primera ola verde." |
| `columns` | text | "Escuela: Clases, Monitores, Ubicación; Ayuda: Reservas, Cancelaciones, FAQ; Legal: Pri…" |
| `social` | text | "X, IG, YT" |
| `copyright` | text | "© 2026 Maré Surf Club. Todos los derechos reservados." |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Tira de marcas — `LogoCloud`

«Con la confianza de…»: marcas en texto, sin depender de imágenes que el kit no tiene.

| prop | tipo | default |
|---|---|---|
| `label` | text | "Con la confianza de" |
| `brands` | text | "Nautilus, Costa Brava FM, Surfrider, Deporte Norte, Vela & Mar" |
| `layout` | `row` · `ticker` | "row" |
| `awards` | text | "" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

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
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Proyectos: lista, cuadrícula o índice con vista previa — `ProjectList`

Tres vistas (filas con título enorme, cuadrícula de imágenes o índice de texto) que se animan al cambiar (GSAP Flip, 'kin). En lista e índice, al pasar el puntero el resto se atenúa y aparece la foto: propia, que sigue al puntero con inclinación, o dentro de CustomCursor (preview="cursor"). Con teclado se coloca en la fila enfocada; en táctil, miniatura bajo el título. El selector de vista no va dentro: se compone con un OptionPicker.

| prop | tipo | default |
|---|---|---|
| `view` | `list` · `grid` · `index` | "list" |
| `picker` | boolean | true |
| `preview` | `follow` · `cursor` · `none` | "follow" |
| `numbered` | boolean | true |
| `follow` | number 0.05–1 | 0.14 |
| `tilt` | number 0–20 | 8 |
| `cursorLabel` | text | "Ver" |

### Pie de página grande — `BigFooter`

Correo grande, enlaces que ruedan y un titular que llena el ancho, con los colores del tema invertidos. Compone FitText, RollLink y LocalTime.

| prop | tipo | default |
|---|---|---|
| `heading` | text | "Hablemos." |
| `lead` | text | "¿Tienes un proyecto?" |
| `email` | text | "hola@estudio.example" |
| `note` | text | "© 2026 Estudio" |
| `credit` | text | "Hecho con Trama" |
| `city` | text | "Madrid" |

### Hero con fundido de fotografías — `CrossfadeHero`

Hero a sangre con fotografías que se funden, titular centrado y botón-píldora (fórmula OFFFForum). Accesible: botón de pausa visible (WCAG 2.2.2), se detiene al pasar el puntero o enfocar, con la pestaña oculta y con movimiento reducido.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Montreal · septiembre 2027" |
| `title` | text | "Una semana de diseño, arte y cultura digital" |
| `interval` | number 2–12 | 5 |
| `shade` | number 0–0.9 | 0.38 |
| `drift` | boolean | true |

### Explorador de ventajas con imagen — `FeatureExplorer`

Lista de píldoras con «+» (páginas de producto de Apple): la elegida se abre en una tarjeta con su texto y cambia la imagen de al lado con un fundido. Una abierta cada vez; cada píldora es un botón con aria-expanded.

| prop | tipo | default |
|---|---|---|
| `items` | text | "Tabla blanda\|Espuma de 8 pies para las primeras olas: flota de sobra y no hace daño s…" |
| `defaultIndex` | number 0–5 | 0 |
| `mediaSide` | `right` · `left` | "right" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "editorial" |

- Una ventaja por línea: «Título|Texto|imagen|texto alternativo» (imagen: URL, ruta o gen:N).
- En móvil la imagen va encima de la lista.

## Contenido (`contenido`)

Texto largo con formato para documentación y blogs: prosa desde Markdown, avisos, índice de la página, cabecera de artículo y el artículo completo.

### Texto con formato (Prose) — `Prose`

La tipografía de un artículo o una página de documentación: títulos con ancla, párrafos, listas anidadas y de tareas, citas con firma, avisos, código, tablas, imágenes con pie, resaltado y teclas. Desde Markdown o desde tu propio HTML/MDX.

| prop | tipo | default |
|---|---|---|
| `markdown` | text | "# Tu primera clase de surf\n\nTodo lo que necesitas saber **antes de meterte al agua**…" |
| `size` | `sm` · `md` · `lg` | "md" |
| `measure` | `narrow` · `normal` · `wide` · `full` | "normal" |
| `dropCap` | boolean | false |
| `anchors` | boolean | true |
| `tone` | `acc` · `acc2` · `fg` | "acc" |
| `codeVariant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` | "terminal" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

- Markdown → elementos React, sin HTML crudo: un texto de un CMS o de un usuario no puede inyectar marcado, y los enlaces solo admiten http(s), mailto, rutas y anclas.
- Avisos al estilo GitHub: `> [!NOTE] Título`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`. Código: ```lenguaje archivo. Imágenes: `![alt](url "pie")`, con `gen:N` para las de ejemplo.
- Con children en lugar de markdown, cualquier HTML o MDX recibe la misma tipografía.
- Los títulos llevan id (los mismos que calcula TableOfContents con el mismo Markdown).

### Aviso de documentación — `Callout`

Nota, consejo, importante, cuidado o peligro dentro de un texto largo. Es contenido (lleva párrafos y no se descarta), no un estado de la interfaz como Alert. Puede plegarse.

| prop | tipo | default |
|---|---|---|
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "info" |
| `title` | text | "Antes de entrar al agua" |
| `text` | text | "Revisa el **parte de olas** del día y avisa al monitor si es tu primera clase. Tienes …" |
| `kind` | `bar` · `soft` · `outline` | "bar" |
| `icon` | text | "" |
| `collapsible` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

- En Prose se escribe `> [!NOTE] Título` (o TIP, IMPORTANT, WARNING, CAUTION) seguido de las líneas del aviso.
- El texto admite Markdown de línea; una línea en blanco separa párrafos. Con children se pinta lo que pases.

### Índice de la página — `TableOfContents`

«En esta página»: las secciones de un texto largo, con la que se está leyendo marcada. Sale del mismo Markdown que Prose, de los títulos de un contenedor de la página o de una lista a mano.

| prop | tipo | default |
|---|---|---|
| `title` | text | "En esta página" |
| `kind` | `rail` · `list` · `numbered` | "rail" |
| `depth` | `2` · `3` | "3" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

- markdown = mismos ids que Prose con ese texto · target = selector de un contenedor ya pintado (lee sus h2/h3 con id) · items = a mano, `## Título` por línea.
- En la vista previa, desplaza el texto: el índice marca la sección visible.

### Cabecera de artículo — `ArticleHeader`

Categoría, título, entradilla, autor con cargo, fecha, tiempo de lectura, etiquetas y portada de una entrada de blog o una página de documentación.

| prop | tipo | default |
|---|---|---|
| `kicker` | text | "Guías" |
| `title` | text | "Tu primera clase de surf" |
| `subtitle` | text | "Qué traer, cómo es la clase y qué hacer si algo sale mal. Todo en cinco minutos." |
| `author` | text | "Lucía Ferrán" |
| `authorRole` | text | "Monitora jefe" |
| `date` | text | "12 sep 2026" |
| `readTime` | text | "5 min" |
| `tags` | text | "Iniciación, Seguridad, Material" |
| `cover` | text | "gen:1" |
| `align` | `left` · `center` | "left" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

### Artículo completo — `Article`

La sección lista para un blog o una documentación: cabecera, índice lateral que sigue la lectura, cuerpo en Markdown con formato y barra de progreso de lectura opcional. En contenedores estrechos el índice sube sobre el texto.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Tu primera clase de surf" |
| `kicker` | text | "Guías" |
| `markdown` | text | "# Tu primera clase de surf\n\nTodo lo que necesitas saber **antes de meterte al agua**…" |
| `toc` | `right` · `left` · `none` | "right" |
| `tocKind` | `rail` · `list` · `numbered` | "rail" |
| `cover` | text | "gen:1" |
| `dropCap` | boolean | false |
| `progress` | boolean | false |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

- Un «# Título» al principio del Markdown se quita: el título ya lo pone la cabecera.
- readTime="auto" calcula los minutos del propio texto.
- progress pinta una barra fija arriba de la ventana: en la vista previa la sigue la página, no la caja.

## Overlays (`overlays`)

Elementos que aparecen encima de la página: diálogos, notificaciones, ayuda.

### Modal — `Modal`

Diálogo modal: un botón lo abre, el fondo o Escape lo cierran; pausa el scroll y el tabulador no sale de él. Con size="full" es una pantalla de entrada a toda la ventana («Entrar con sonido / sin sonido», «¿Eres mayor de edad?»); con actions lleva botones propios y con dismissible={false} obliga a elegir. position: fixed, sin portal.

| prop | tipo | default |
|---|---|---|
| `triggerLabel` | text | "Eliminar cuenta" |
| `title` | text | "¿Seguro que quieres continuar?" |
| `body` | text | "Esta acción no se puede deshacer. Se borrarán todos tus datos y no podrás recuperarlos." |
| `confirmLabel` | text | "Sí, eliminar" |
| `cancelLabel` | text | "Cancelar" |
| `size` | `sm` · `md` · `lg` · `full` | "md" |
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "accent" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Notificación (Toast) — `Toast`

Notificación temporal apilable, construida sobre sonner (apilado, gestos y temporizador ya resueltos) con el aspecto del kit por encima.

| prop | tipo | default |
|---|---|---|
| `intent` | `accent` · `neutral` · `success` · `info` · `warning` · `danger` | "success" |
| `loading` | boolean | false |
| `title` | text | "Cambios guardados" |
| `description` | text | "Tu perfil se actualizó correctamente." |
| `position` | `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right` | "bottom-right" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |
| `intentStyle` | `bar` · `icon` · `tint` · `mono` | "bar" |
| `icons` | `auto` · `svg` · `glyph` · `none` | "auto" |
| `actionLabel` | text | "" |
| `closeButton` | boolean | false |
| `duration` | number 1–20 | 4 |
| `expand` | boolean | false |

- Se adapta a cualquier tema: hereda la tipografía del contenedor, lleva siempre una base opaca bajo la superficie de la variante y el color de estado se puede atenuar (intentStyle=mono) en temas monocromos.
- Usa la librería sonner (toast/Toaster): sin ella habría que reimplementar apilado, gestos táctiles, temporizador y accesibilidad.
- Cada instancia lleva un id propio para no cruzarse con otras — importante en «Comparar los estilos», donde conviven varios Toaster a la vez.

### Tooltip — `Tooltip`

Texto de ayuda al posar el ratón o el foco. Envuelve el disparador real (botón, icono, enlace) o pinta un texto subrayado. Por defecto flota junto al ratón y lo sigue con inercia; con follow={false} queda fijo sobre el disparador y funciona solo con CSS.

Envuelve contenido (`children`), p. ej.: `<Button label="Exportar" glyph="icon:download" />`

| prop | tipo | default |
|---|---|---|
| `label` | text | "Pasa el ratón por aquí" |
| `content` | text | "Descarga el informe en CSV." |
| `side` | `top` · `right` · `bottom` · `left` | "top" |
| `follow` | boolean | true |
| `align` | `start` · `center` · `end` | "center" |
| `gap` | number 0–80 | 16 |
| `offsetX` | number -80–80 | 0 |
| `offsetY` | number -80–80 | 0 |
| `inertia` | number 0–0.95 | 0.72 |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- Con un único elemento como hijo, este recibe aria-describedby apuntando al tooltip; el foco lo pone el propio botón, sin paradas de tabulador extra.
- Con follow, el tooltip sigue al ratón (se da la vuelta en los bordes de la ventana y sin inercia con prefers-reduced-motion). Con teclado o en táctil se coloca sobre el disparador, como con follow={false}.

### Panel lateral (Drawer) — `Drawer`

Panel deslizante desde un lateral (menú móvil, carrito, filtros). Se cierra con el fondo, Escape o su botón.

| prop | tipo | default |
|---|---|---|
| `triggerLabel` | text | "Abrir menú" |
| `side` | `left` · `right` | "left" |
| `title` | text | "Menú" |
| `body` | text | "Clases, Tablas, Reservas, Contacto, Ayuda." |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

### Chat de ayuda (chatbot) — `ChatWidget`

Asistente flotante en una esquina: responde por reglas (palabras clave → respuesta, con respuestas rápidas) o, con onMessage, conectado a un modelo o servicio real. Indicador de escritura, aviso de no leídos y teclado.

| prop | tipo | default |
|---|---|---|
| `title` | text | "Asistente Maré" |
| `subtitle` | text | "Responde al momento · o te pasa con el equipo" |
| `greeting` | text | "¡Hola! Soy el asistente de la escuela. Pregúntame por **clases**, **precios** o **mate…" |
| `quickReplies` | text | "Precios, Horarios, Reservar, Hablar con una persona" |
| `launcherLabel` | text | "¿Te ayudo?" |
| `position` | `bottom-right` · `bottom-left` | "bottom-right" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "glass" |

- Reglas, una por línea: `precio, cuesta => Cuesta **35 €**. || Reservar, Horarios`. Gana la que tiene más claves en el mensaje (sin tildes ni mayúsculas); tras `||`, las respuestas rápidas siguientes.
- onMessage(texto, historial) → texto o { text, quickReplies } (puede ser async): sustituye a las reglas para usar un backend.
- Flota sobre la ventana (portal a document.body con los tokens copiados): en la vista previa aparece en la esquina de la pantalla, no en el escenario.

### Paleta de comandos (⌘K) — `CommandPalette`

Caja de búsqueda sobre la página con lista filtrada por varias palabras (sin acentos ni mayúsculas), agrupada y navegable con flechas, Intro y Esc. Patrón ARIA combobox + listbox; atrapa el foco y lo devuelve al cerrar.

| prop | tipo | default |
|---|---|---|
| `trigger` | boolean | true |
| `hotkey` | boolean | true |
| `triggerLabel` | text | "Buscar" |
| `placeholder` | text | "Escribe un comando o busca…" |

- Se abre con el botón o con Ctrl/⌘ + K. Se pinta en un portal con los tokens del tema.

### Carrito lateral — `CartDrawer`

Líneas con cantidad y quitar, subtotal, barra de envío gratis y botón de pedir. Diálogo modal: atrapa el foco, Esc y el fondo cierran, devuelve el foco. Pensado para usarse con useCart.

| prop | tipo | default |
|---|---|---|
| `freeShippingFrom` | number 0–300 | 60 |
| `empty` | boolean | false |

- El estado del carrito lo trae useCart (de trama-ui), con persistencia en localStorage; este componente solo lo pinta.

### Aviso de cookies — `CookieBanner`

Aviso con la marca de la web (Neutomni). «Rechazar» pesa lo mismo que «Aceptar», hay vista «Personalizar» con categorías y recuerda la elección. No bloquea la página. Está hecho con Button y Toggle: para teñirlo, redefine --bg, --fg y --acc sobre .ui-cook.

| prop | tipo | default |
|---|---|---|
| `position` | `bottom-left` · `bottom-right` · `bottom` | "bottom-left" |
| `title` | text | "¿Qué te parecen las cookies?" |
| `variant` | `glass` · `solid` · `outline` · `neon` · `retro` · `terminal` · `minimal` · `dotmatrix` · `editorial` | "minimal" |

## Pixel art (`pixel`)

Iconos SVG que se tiñen con el tema, marcos de 9 cortes y sprites: píxeles hechos a mano, no filtros.

### Icono (pixel art, Phosphor o Lucide) — `Icon`

Los mismos 119 nombres en tres familias: pixel art (Pixelarticons), Phosphor (seis pesos dibujados a mano, de fino a bitono: editorial, corporativo, lujo) y Lucide (trazo técnico de grosor ajustable). Se tiñe con un token del tema o con el color del texto. Una web fija familia y peso para todo el kit con IconSet (o SiteFrame icons).

| prop | tipo | default |
|---|---|---|
| `name` | `plus` · `minus` · `close` · `check` · `pencil` · `trash` · `copy` · `save` · `download` · `upload` · `reload` · `search` · `filter` · `link` · `share` · `send` · `arrow-left` · `arrow-right` · `arrow-up` · `arrow-down` · `chevron-left` · `chevron-right` · `chevron-up` · `chevron-down` · `menu` · `home` · `external-link` · `more-horizontal` · `more-vertical` · `login` · `logout` · `circle-info` · `warning-diamond` · `circle-question` · `bell` · `heart` · `star` · `bookmark` · `flag` · `lock` · `unlock` · `eye` · `eye-off` · `shield` · `user` · `users` · `mail` · `message` · `phone` · `at-sign` · `terminal` · `code` · `cpu` · `database` · `server` · `cloud` · `wifi` · `battery-full` · `zap` · `power` · `settings-cog` · `bug` · `git-branch` · `globe` · `github` · `discord` · `linkedin` · `instagram` · `youtube` · `mastodon` · `bluesky` · `react` · `npm` · `vercel` · `file` · `file-text` · `folder` · `image` · `camera` · `video` · `music` · `play` · `pause` · `volume` · `mic` · `headphone` · `gamepad` · `joystick` · `sword` · `skull` · `bomb` · `trophy` · `crown` · `coins` · `potion` · `robot` · `alien` · `castle` · `chess` · `fire` · `sparkles` · `leaf` · `tree` · `sun` · `moon` · `snowflake` · `calendar` · `clock` · `map-pin` · `shopping-cart` · `gift` · `key` · `lightbulb` · `coffee` · `compass` · `target` · `hourglass` · `feather` · `wand` | "heart" |
| `iconSize` | number 16–120 | 48 |
| `sharp` | boolean | false |
| `tone` | `fg` · `acc` · `acc2` · `mut` | "acc" |

- Sin `tone` el icono hereda el color del texto (`currentColor`): dentro de un Button o un Badge toma el color de ese componente.
- Sin `label` es decorativo (aria-hidden); con `label` se anuncia como imagen.
- Para un icono fuera del set: `import { Zap } from "pixelarticons/react/Zap"` y `<Icon icon={Zap} />` (también valen las variantes …Solid y …Glyph).
- Para toda una web: `<IconSet set={phosphor} weight="light">` (import de `@/lib/ui/icons-phosphor`) o `SiteFrame icons`. Los glifos `icon:…` de Button, NavBar, FeatureGrid o Footer también cambian.
- Cada familia vive en su módulo (`icons-phosphor`, `icons-lucide`) y solo la descarga la web que la usa. Lucide no dibuja marcas: las suyas salen de Phosphor.
- Licencias: Pixelarticons MIT (© Gerrit Halfmann), Phosphor MIT, Lucide ISC.

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

`GridBackground` ×3 → `AsciiBackground` ×2 → `SceneFlash` → `CrtOverlay` → `GlyphCursor` → `Toast` → `NavBar` → `Hero` → `Reveal` ×19 → `TerminalTyper` → `Typewriter` → `StatsSection` → `FeatureGrid` → `BitmapText` → `Spotlight` → `AsciiCard` ×3 → `SectionHeader` ×5 → `Tabs` → `CodeBlock` ×2 → `Table` → `Timeline` → `HoverFX` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Skeleton` → `StatCounter` → `PricingSection` → `NeonSign` → `Stepper` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `RangeSlider` → `Toggle` → `OtpInput` → `Tooltip` → `MagneticButton` → `Modal` → `Breadcrumbs` → `Panel` → `Dropdown` → `Pagination` → `ScrollArea` → `TestimonialSection` → `TeamSection` → `LogoCloud` → `ArticlesSection` → `FAQSection` → `ScrambleText` → `ContactForm` → `CTASection` → `Divider` → `Footer`

### MYCEL · red micelar orgánica — `/demo/th-mycel`

Segunda landing completa construida solo con components/ui/, opuesta a CIPHERGRID: una red de sensores de campo que germina de verdad al hacer scroll por el héroe, sin que el fondo tape nunca el contenido.

Archivo: `components/landings/MycelLanding.tsx`

`AsciiBackground` → `GridBackground` ×2 → `TextmodeBackground` ×2 → `SceneFlash` → `GlyphCursor` → `Toast` → `NavBar` → `Hero` → `Reveal` ×19 → `TerminalTyper` → `Typewriter` → `StatsSection` → `FeatureGrid` → `BitmapText` → `Spotlight` → `AsciiCard` ×3 → `SectionHeader` ×5 → `Tabs` → `CodeBlock` ×2 → `Table` → `Timeline` → `HoverFX` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Skeleton` → `StatCounter` → `PricingSection` → `NeonSign` → `Stepper` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `RangeSlider` → `Toggle` → `OtpInput` → `Tooltip` → `MagneticButton` → `Modal` → `Breadcrumbs` → `Panel` → `Dropdown` → `Pagination` → `ScrollArea` → `TestimonialSection` → `TeamSection` → `LogoCloud` → `ArticlesSection` → `FAQSection` → `ScrambleText` → `ContactForm` → `CTASection` → `Divider` → `Footer`

### FOLIO · editorial de tema claro — `/demo/th-folio`

Tercera landing completa construida solo con components/ui/, la única de tema claro: papel, tinta y tipografía para una herramienta editorial, con fondos en patrones de papelería real en vez de escenas cargadas.

Archivo: `components/landings/FolioLanding.tsx`

`GridBackground` ×4 → `TextmodeBackground` → `SceneFlash` → `GlyphCursor` → `Toast` → `NavBar` → `Hero` → `Reveal` ×19 → `TerminalTyper` → `Typewriter` → `StatsSection` → `FeatureGrid` → `BitmapText` → `Spotlight` → `AsciiCard` ×3 → `SectionHeader` ×5 → `Tabs` → `CodeBlock` ×2 → `Table` → `Timeline` → `HoverFX` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Skeleton` → `StatCounter` → `PricingSection` → `NeonSign` → `Stepper` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `RangeSlider` → `Toggle` → `OtpInput` → `Tooltip` → `MagneticButton` → `Modal` → `Breadcrumbs` → `Panel` → `Dropdown` → `Pagination` → `ScrollArea` → `TestimonialSection` → `TeamSection` → `LogoCloud` → `ArticlesSection` → `FAQSection` → `ScrambleText` → `ContactForm` → `CTASection` → `Divider` → `Footer`

### SIGNAL · dot matrix — `/demo/th-dotmatrix`

Landing de referencia del tema dot matrix: monocromo, variante dotmatrix en todo el kit y un único RetroCanvas (react-three-fiber con filtro ASCII y scanlines) de fondo que cambia de figura en cada acto.

Archivo: `components/landings/DotmatrixLanding.tsx`

`RetroCanvas` → `SceneFlash` → `Toast` → `NavBar` → `ScrollProgress` → `Hero` → `Reveal` ×13 → `TerminalTyper` → `Marquee` → `StatsSection` → `FeatureGrid` → `AsciiCard` ×3 → `SectionHeader` ×4 → `Tabs` → `CodeBlock` ×2 → `Timeline` → `AsciiChart` → `Progress` → `Badge` ×3 → `Alert` → `Spinner` → `Table` → `PricingSection` → `TextField` → `Select` → `CheckboxGroup` → `RadioGroup` → `Toggle` → `MagneticButton` → `Modal` → `TestimonialSection` → `LogoCloud` → `FAQSection` → `CTASection` → `Divider` → `Footer`

### SILO · hard techno minimal — `/demo/th-silo`

Landing de un productor de hard techno con minimalismo extremo: negro, blanco y un gris, tipografía enorme y un único RetroCanvas de fondo (ASCII de puntos invertido, scanlines de 1 px en barrido y glitch leve) que cambia de figura en cada sección.

Archivo: `components/landings/SiloLanding.tsx`

`ScrollProgress` → `Toast` → `NavBar` → `Marquee` → `Reveal` ×2 → `Button` → `AudioPlayer` → `Table` → `ContactForm` → `Footer` → `RetroCanvas` → `RetroModel`

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

## Webs completas de referencia

Sitios de varias páginas (`/sitios/<slug>/…`) con navegación, estado compartido y contenido propio. Marco común en `components/sites/shared.tsx` (tema, enlaces sin recarga, cabecera de página) y registro en `lib/sites/index.ts`. Componentes del kit por número de usos.

### Kernel Log · blog de tecnología — `/sitios/kernel-log`

El blog de una ingeniera de plataformas: artículos largos con código, índice y barra de lectura, buscador por temas, newsletter con archivo y página personal.

Carpeta: `components/sites/kernel-log/` · 10 páginas: Inicio · Artículos · Lo que aprendí migrando 40 servicios a Kubernetes · Cómo bajé el tiempo de carga de una SPA de 6 s a 1,4 s · Server Components sin mitos: cuándo sí y cuándo no · RAG en producción: los tres fallos que nadie te cuenta · Escribir un informe de incidentes que alguien quiera leer · SQLite es suficiente (hasta que deja de serlo) · Newsletter · Sobre mí

`SectionHeader` ×5 · `Button` ×5 · `ContactForm` ×4 · `Table` ×2 · `TextmodeBackground` · `BlogCard` · `Timeline` · `NavBar` · `Pagination` · `TextField` · `StatsSection` · `Footer` · `FeatureGrid` · `Prose` · `Article` · `Toast`

### Pixelforge · tienda de assets — `/sitios/pixelforge`

Tienda de assets para videojuegos: catálogo con filtros, orden y búsqueda, fichas con licencias, carrito que se guarda entre páginas, cupón, pago en pasos, FAQ y páginas legales.

Carpeta: `components/sites/pixelforge/` · 15 páginas: Inicio · Tienda · Héroes 16-bit · Mazmorra modular · Retro SFX · 300 · Pixel Sans · Interfaz RPG · Magia y partículas · Bosque encantado · Monstruos vol. 1 · Carrito · Preguntas frecuentes · Términos y condiciones · Política de privacidad · Licencias

`Button` ×13 · `TextField` ×4 · `SectionHeader` ×3 · `Badge` ×3 · `Select` ×2 · `RadioGroup` ×2 · `Stepper` ×2 · `Alert` ×2 · `NavBar` · `Tabs` · `Accordion` · `Breadcrumbs` · `ImageGallery` · `Hero` · `CTASection` · `TestimonialSection` · `Footer` · `LogoCloud` · `Prose` · `TableOfContents` · `Toast`

### Vigía · videovigilancia — `/sitios/vigia`

Empresa de seguridad con chatbot en todas las páginas: servicios con ficha propia, planes mensual/anual que llevan al presupuesto, formulario de presupuesto en cuatro pasos con estimación y contacto.

Carpeta: `components/sites/vigia/` · 9 páginas: Inicio · Servicios · Videovigilancia CCTV · Alarmas conectadas · Control de accesos · Central receptora 24 h · Planes y precios · Pide tu presupuesto · Contacto

`Button` ×8 · `SectionHeader` ×5 · `TextField` ×4 · `Table` ×2 · `Stepper` ×2 · `Timeline` · `NavBar` · `Accordion` · `Select` · `CheckboxGroup` · `RadioGroup` · `Alert` · `Hero` · `ContactForm` · `CTASection` · `FAQSection` · `StatsSection` · `PricingSection` · `TestimonialSection` · `Footer` · `FeatureGrid` · `Toast` · `ChatWidget`

### Onda Instruments · equipos para DJ y músicos — `/sitios/onda`

Fabricante de controladoras, sintetizadores, cajas de ritmos, monitores y auriculares: catálogo por categorías, fichas con especificaciones y descargas, artistas y soporte con registro de producto.

Carpeta: `components/sites/onda/` · 12 páginas: Inicio · Productos · Polar 8 · DX-2 · DX-4 Pro · MX-4 · Nano · Pulse 16 · S5 · H1 · Artistas · Soporte

`Button` ×7 · `SectionHeader` ×6 · `Table` ×3 · `TextField` ×2 · `ImageGallery` ×2 · `CTASection` ×2 · `FeatureGrid` ×2 · `Marquee` · `NavBar` · `Tabs` · `Select` · `Badge` · `Carousel` · `ContactForm` · `FAQSection` · `TestimonialSection` · `Footer` · `Toast`

### Clara Vidal · estilismo — `/sitios/clara-vidal`

Web de una estilista con estética minimalista (fondo claro, mucho aire, tipografía grande): servicios con precios, lookbook, diario con artículos, página personal y reserva de cita con huecos disponibles.

Carpeta: `components/sites/clara-vidal/` · 9 páginas: Inicio · Servicios · Lookbook · Diario · Treinta prendas, cien combinaciones · Cómo elegir un abrigo que dure diez años · Los colores que te favorecen, sin test de estaciones · Sobre mí · Reservar

`Button` ×6 · `TextField` ×2 · `BlogCard` · `NavBar` · `Select` · `RadioGroup` · `ImageGallery` · `FAQSection` · `Footer` · `LogoCloud` · `Prose` · `Article` · `Modal` · `Toast`

### Marea Studio · estudio creativo — `/sitios/estudio`

Web de un estudio creativo con los patrones de las webs premiadas: scroll suave, preloader con contador, titulares que entran por líneas, menú a pantalla completa, cursor con etiqueta, lista de proyectos con vista previa y pie con titular a todo el ancho.

Carpeta: `components/sites/estudio/` · 5 páginas: Inicio · Proyectos · Estudio · Laboratorio · Contacto

`SplitText` ×8 · `ProjectList` ×2 · `Parallax` ×2 · `ImageReveal` ×2 · `ObjectStage` ×2 · `Marquee` · `RollLink` · `CustomCursor` · `SmoothScroll` · `Preloader` · `FullscreenMenu` · `LocalTime` · `ScrubText` · `HideOnScroll` · `SectionIndex` · `HorizontalScroll` · `StackedCards` · `BentoGrid` · `BigFooter` · `DistortImage` · `DragGrid`

### Pulso · panel de métricas — `/sitios/pulso`

Panel de un SaaS con los patrones de producto: marco de aplicación con barra lateral plegable, paleta de comandos ⌘K, tarjetas de indicadores con mini gráficas, gráficos de líneas, áreas y barras en SVG, y una tabla de datos con búsqueda, orden, selección y paginación.

Carpeta: `components/sites/pulso/` · 4 páginas: Resumen · Clientes · Informes · Ajustes

`KpiCard` ×4 · `Chart` ×4 · `Avatar` ×2 · `DataTable` ×2 · `Button` · `Badge` · `CommandPalette` · `AppShell` · `EmptyState`

### Barro · cerámica hecha a mano — `/sitios/barro`

Tienda de cerámica con el flujo completo de comercio: listado con filtros y orden, ficha con galería y zoom, selector de color y tamaño, carrito lateral con envío gratis, y un pedido por pasos. Usa useCart (estado del carrito con persistencia), ProductCard, OptionPicker, FilterBar y CartDrawer.

Carpeta: `components/sites/barro/` · 11 páginas: Inicio · Tienda · Jarrón Ola · Cuenco Brisa · Taza Alba · Plato Marea · Jarra Nube · Jarrón Sal · Cuenco Arena · Taza Duna · Pedido

`TextField` ×4 · `RollLink` ×2 · `EmptyState` ×2 · `OptionPicker` ×2 · `RadioGroup` · `Stepper` · `SplitText` · `PriceTag` · `QuantityStepper` · `ProductCard` · `ProductGallery` · `FilterBar` · `CartDrawer`

### Plano · revisión de modelos de edificación — `/sitios/plano`

Web de producto técnico con la fórmula «plano»: marco de línea fina con regla de marcas y cruces de registro, navegación en celdas, etiquetas mono en mayúsculas, titulares gruesos y apretados, rejillas de celdas con divisores discontinuos, un único acento naranja sobre blanco y negro y la maqueta 3D de un edificio real (la clínica de muestra de buildingSMART, convertida de IFC) con cuatro incidencias medidas en su modelo. En «Recorrido», un relato 3D: la foto se disuelve en la planta, un barrido de luz encuentra las incidencias, el edificio se separa por capas en cuatro pasos y la cámara visita cada incidencia como una sala con su ficha. Usa BlueprintFrame, CellGrid, EdgeTab, MetaTable, ExplorableCanvas (despiece, barrido, foco y fondo por parada), PinnedSection, ScrubText, FitText, ImageReveal y GridBackground (grano).

Carpeta: `components/sites/plano/` · 7 páginas: Inicio · Producto · Recorrido: así revisa Cota un modelo · Incidencia: Colisión · Incidencia: Altura libre · Incidencia: Escalera · Incidencia: Nomenclatura

`SplitText` ×8 · `CellGrid` ×5 · `ExplorableCanvas` ×3 · `ScrubText` ×2 · `MetaTable` ×2 · `GridBackground` · `FitText` · `RollLink` · `SmoothScroll` · `PinnedSection` · `ImageReveal` · `BlueprintFrame` · `EdgeTab`

### ArcoForo · una semana de diseño, arte y cultura digital — `/sitios/foro`

Web de un festival con la fórmula «evento»: preloader con la marca que se rellena, wordmark de borde a borde en dos tipografías, hero a sangre con fotografías que se funden (con botón de pausa), ficha de datos en caja de línea fina, programa con filtros por día y pie con la marca gigante. Usa Preloader (fill), FitText, CrossfadeHero, MetaTable, FilterBar y ProjectList.

Carpeta: `components/sites/foro/` · 2 páginas: Inicio · Programa

`ProjectList` ×2 · `FitText` · `CustomCursor` · `SmoothScroll` · `Preloader` · `BigFooter` · `FilterBar` · `CrossfadeHero` · `MetaTable`

### Arbor · residencias entre árboles — `/sitios/arbor`

Web de un complejo residencial con la fórmula «arquitectura de lujo tranquilo»: navegación en forma de isla (píldora de vidrio) con el menú a pantalla completa debajo, hero a sangre con la marca en serif que se dispersa al hacer scroll, paneles verticales que se expanden, ficha de datos, botón circular dentro del titular y pestaña lateral de visita. Usa IslandNav, ScatterText, ExpandingPanels, MetaTable, CircleButton, EdgeTab y el tema forestTokens.

Carpeta: `components/sites/arbor/` · 2 páginas: Inicio · Residencias

`SplitText` ×2 · `FitText` · `SmoothScroll` · `FullscreenMenu` · `IslandNav` · `ExpandingPanels` · `ScatterText` · `EdgeTab` · `MetaTable` · `CircleButton`

### Sonar · estudio de identidad sonora — `/sitios/sonar`

Web de un estudio de sonido con la fórmula «experiencia explorable»: pantalla de entrada «con sonido / sin sonido», titular serif que se estira con el puntero, mapa de proyectos que se arrastra con inercia (con vista de lista alternativa), interruptor de sonido con ecualizador y cambio de vista animado en la página de proyectos. Usa Modal (pantalla completa), Toggle con indicador, SplitText (elastic), ExplorableCanvas, ProjectList con OptionPicker y BigFooter.

Carpeta: `components/sites/sonar/` · 2 páginas: Inicio · Proyectos

`SplitText` ×3 · `RollLink` ×3 · `Toggle` · `Modal` · `SmoothScroll` · `ProjectList` · `BigFooter` · `OptionPicker` · `CellGrid` · `ExplorableCanvas`

### Mota · interiorismo y marca con carácter — `/sitios/mota`

Web de un estudio de interiorismo con la fórmula «estudio con personalidad»: wordmark monoespaciado gigante en una sola pantalla, collage de pegatinas arrastrables, frase con letras elásticas que reaccionan al scroll, proyectos con cambio de vista animado (lista, cuadrícula, índice) y aviso de cookies con la marca. Usa FitText, StickerCollage, SplitText (elastic), ProjectList con OptionPicker, CookieBanner y CustomCursor (con imagen).

Carpeta: `components/sites/mota/` · 2 páginas: Inicio · Proyectos

`SplitText` ×3 · `RollLink` ×3 · `ProjectList` ×2 · `FitText` · `CustomCursor` · `SmoothScroll` · `BigFooter` · `OptionPicker` · `StickerCollage` · `CookieBanner`

### Alzado · arquitectura que se entiende en maqueta — `/sitios/alzado`

Web de un estudio de arquitectura con la fórmula «maqueta que se recorre»: preloader con la marca, portada fijada en la que el scroll lleva la cámara de la planta con cotas a la maqueta 3D de madera y metacrilato (three.js), proyectos con la foto dentro del cursor y cambio de vista, y mapa 3D de obras que se arrastra. Usa Preloader, PinnedSection, ExplorableCanvas (depth="3d", nav="scroll" y "drag"), SplitText, ProjectList con OptionPicker, CustomCursor, CellGrid y BigFooter.

Carpeta: `components/sites/alzado/` · 2 páginas: Inicio · Proyectos

`SplitText` ×5 · `RollLink` ×3 · `ProjectList` ×2 · `ExplorableCanvas` ×2 · `CustomCursor` · `SmoothScroll` · `Preloader` · `PinnedSection` · `BigFooter` · `OptionPicker` · `CellGrid`

### Vértice · grupo industrial — `/sitios/vertice`

Web corporativa de un grupo industrial con la fórmula «Corporativo claro»: barra de utilidades (inversores, prensa, empleo, proveedores), megamenú con una línea por enlace y buscador, una frase en el hero, cifras con fuente y fecha, entrada por sector, soluciones filtradas con una frase («Fabricamos [qué] para [sector]»), clientes y premios con laureles, inversores con cotización e informes, sala de prensa, empleo y contacto por área. Movimiento mínimo. Usa NavBar (utility, mega, search), FilterBar (sentence), LogoCloud (awards), KpiCard, DataTable, Breadcrumbs, ContactForm, Footer y CookieBanner.

Carpeta: `components/sites/vertice/` · 11 páginas: Inicio · Sectores · Movilidad · Energía · Agua · Soluciones · Sostenibilidad · Inversores · Sala de prensa · Empleo · Contacto

`Breadcrumbs` ×8 · `FilterBar` ×3 · `DataTable` ×2 · `NavBar` · `ContactForm` · `Footer` · `LogoCloud` · `KpiCard` · `CookieBanner`

### Nora Vidal · ciclista profesional — `/sitios/volt`

Web personal de una ciclista con la fórmula «Atleta en voltaje» (Lando Norris, sitio del año 2025): oliva y amarillo ácido, curvas de nivel de fondo, titular con palabras en serifa que entran tapadas por barras de color, firma que se dibuja sobre la foto, collage con lugar y fecha, estela de fotos bajo el cursor, el tema de la página cambia por sección (oliva → hueso → negro) y fichas de palmarés con la esquina recortada. Usa GridBackground (contour), SplitText (block, emphasis), LineDraw, ThemeScroll, ImageTrail, Marquee, Parallax, MetaTable y BigFooter.

Carpeta: `components/sites/volt/` · 1 páginas: Inicio

`SplitText` ×3 · `LineDraw` ×3 · `Marquee` ×2 · `Button` ×2 · `GridBackground` · `FitText` · `Parallax` · `BigFooter` · `MetaTable` · `ThemeScroll` · `ImageTrail`

### Faro · soporte para equipos y agentes — `/sitios/faro`

Landing de producto con la fórmula «Producto nocturno» (Linear, Raycast): negro casi puro, titular en Inter 510 con tracking negativo, haces de luz en WebGL detrás, la propia aplicación como imagen principal con un foco desde arriba y fundido al suelo, logos de clientes, párrafo en dos tonos, secciones título-texto, explorador de funciones con capturas, atajos con teclas, ⌘K que busca en la página, precios y un cierre con manchas de color. Usa GradientField (beams, mesh), AppShell, FeatureExplorer, Kbd, CommandPalette, LogoCloud, PricingSection, Badge y Footer.

Carpeta: `components/sites/faro/` · 1 páginas: Inicio

`Button` ×3 · `Kbd` ×3 · `GradientField` ×2 · `NavBar` · `Badge` · `PricingSection` · `Footer` · `LogoCloud` · `AppShell` · `FeatureExplorer`

### Hamaca · radio de verano — `/sitios/hamaca`

Radio de verano con la fórmula «Escritorio Y2K» (Poolsuite): papel cuadriculado rosa, barra de menú con la hora, ventanas de sistema antiguo que se arrastran, se apilan y se cierran, reproductor de música sintetizada como ventana principal, foto en semitono y un dock de iconos pixel que abre la agenda, las postales y el club. Con teclado: cada ventana es un diálogo no modal con su botón de cerrar. Usa AudioPlayer (retro), GridBackground, Icon (pixel), LocalTime, TextField y Button.

Carpeta: `components/sites/hamaca/` · 1 páginas: Inicio

`Icon` ×2 · `GridBackground` · `Button` · `TextField` · `AudioPlayer` · `LocalTime`

### Travesía · documentales de mar — `/sitios/travesia`

Productora de documentales con la coreografía de las webs de cine premiadas (docs/14): la portada es un índice tipográfico con una ventana de vídeo que reproduce el título que señalas y tiñe la página con su luz; al abrirlo, esa misma ventana —sin cortar el vídeo— se expande a pantalla completa mientras las palabras del título vuelan hasta el titular; «Siguiente documental» encoge el vídeo a una ventana, cambia de película y lo vuelve a expandir; y la marca de la cabecera se convierte, palabra a palabra, en el titular gigante de la productora. Usa Traveler, TravelSlot, SharedText, AmbientLight, MetaTable y PageTransition.

Carpeta: `components/sites/travesia/` · 9 páginas: Índice · Puntas negras · Marea rosa · Giradores · Barrack Point · Arena negra · El borde del mapa · Productora · Contacto

`MetaTable` ×2 · `PageTransition` · `Traveler` · `BigFooter`
