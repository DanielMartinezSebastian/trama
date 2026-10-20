# Ronda 8: lo que tienen en común las webs premiadas y el plan de guías de estilo (20-10-2026)

> Objetivo: absorber los patrones, técnicas y medidas comunes a las webs que ganan en Awwwards (disposición, transiciones,
> recursos, tamaños, espacios, tipografía) y convertirlos en **guías de estilo listas para usar**: cuando haga falta algo
> rápido que funcione, elegir una guía y ver **varias versiones de cómo contar la misma historia**.
> Complementa la evaluación de demos de [`15`](./15-evaluacion-proximas-demos.md) y las rondas [`06`](./06-indice-replicar-webs-premiadas.md)–[`14`](./14-transiciones-entre-rutas.md).

## 0. Conclusiones

1. **Las ganadoras se parecen mucho más de lo que aparentan.** Paleta de dos tintas, dos familias tipográficas, titulares
   en peso 300–500 con interlineado 0,9–1, rejilla de 12 columnas con 10–24 px de separación, márgenes laterales de
   16–24 px, sin sombras y con fundidos `mix-blend-mode`. Eso es un **sistema**, y se puede fijar en tokens (§2).
2. **Lo que cambia entre una y otra es poco y se puede enumerar**: el par tipográfico, las dos tintas, la composición del
   primer pantallazo (§3) y la estructura del relato (§4). Ocho guías cubren casi todo lo visto (§5).
3. **Las fichas de Awwwards no cuentan la tecnología real.** Ninguna de las 114 fichas de SOTD nombra Lenis, pero lo
   llevan 21 de las 31 webs medidas (68 %). Para decisiones técnicas manda la medición, no la ficha.
4. **La accesibilidad es donde todas pierden puntos** (media 6,9 frente a 8,5 en animación, en 60 SOTM/SOTY). Las guías de
   Trama la traen de serie (movimiento reducido, contraste, teclado): es la diferencia más barata frente a las premiadas.
5. **Plan (§6):** convertir las guías en código (`lib/ui/styleguides.ts`: tokens + tipo + espacio + movimiento + composición
   + relato), una página **`/guias`** que pinta **la misma historia con cada guía y cada estructura** (concepto nuevo:
   comparador de relatos) y un sondeo con Playwright que mide nuestras guías con el mismo script que las premiadas.

## 1. Fuentes y método

| Fuente | Qué es | Fiabilidad |
|---|---|---|
| Fichas de 114 SOTD (29-may → 19-sep-2026) y 33 de la [`15`](./15-evaluacion-proximas-demos.md) | Categoría, tecnología declarada, paleta, elementos destacados, notas del Dev Award | Alta para lo que declaran; incompletas en tecnología y sin fuentes |
| Fichas de 34 SOTM/SOTY (2024–2026) + su CSS en vivo | Fuentes, tracking, interlineado y tamaños leídos del CSS de cada web | Alta (medido) |
| **31 webs medidas con Playwright** (1440×900 y 390×844, tras 7 s de intro y 6 pantallas de scroll) | Librerías, familias cargadas, escala tipográfica por caracteres, titulares, márgenes, rejillas, superficies, fijos, duraciones y curvas CSS y de GSAP; capturas | Alta; en 11 webs el scroll es virtual (`pageVh 1`) y sus márgenes y secciones no se usan. Cartier no cargó |
| 121 casos de estudio de Codrops (2025–2026) y 55 del blog de Awwwards | Estructuras narrativas, stack, duraciones, curvas, staggers, riesgos, con código del autor | Alta (código y texto del autor); los recuentos son de menciones |

El script de sondeo y los datos crudos están en el scratchpad de la sesión (`pw/probe.js`, `r1.json`); el plan propone
llevarlo al repo (§6, F4). Medidas de webs concretas citadas abajo entre paréntesis.

## 2. Constantes de ganador (los números)

### Color

| Regla | Dato |
|---|---|
| Dos tintas | 97 de 114 SOTD declaran 2 colores, 13 uno, **ninguna 3 o más**. SOTM/SOTY: 33 de 34 con 1–2 |
| El oscuro casi nunca es `#000` | `#0A`–`#1A`, a menudo teñido: `#08090A` (Linear), `#151515` (CoMinVi), `#1E305E` marino (Odyssée), `#282C20` oliva (Lando) |
| El claro suele ser hueso, no blanco | 23 de 114; medidos: `#F5EEE9` (Tengile), `#FFFCF8` (Odyssée), `#FDFBEF` (Belgrade Arbor), `#F3EFEB` (Iventions), `#F4F2ED` (by-kin) |
| Un acento, si lo hay | rojo/naranja 14, cobalto 15, lima/ácido 8, amarillo 8 (de 114) |
| El texto secundario es la misma tinta con opacidad | `rgba(15,15,15,.4)` (Butter), `rgba(255,255,255,.4)` (Gil Huybrecht), grises de la misma familia (Linear, Stripe) |

### Tipografía

| Regla | Dato medido |
|---|---|
| Familias por web | **2** en 18 de 31 (y en 18 de 25 SOTM/SOTY); 1 en 7; 3 en 6 |
| Emparejamientos | grotesca + mono (Riotters, Heron, CoMinVi, Terminal, Linear, Raycast) · grotesca + serifa display (Odyssée, Tengile, Belgrade, Iventions, Signal-A, Akaru) · condensada display + grotesca (Lando, Nick Ho, Colonia Zacamil) |
| Peso del titular | **300–500** en 21 de 26; 700 solo en condensadas o deportivas (Lando, CoMinVi, Heron) |
| Interlineado del titular | **0,9–1** en 24 de 26 (0,8 en Lando y CoMinVi) |
| Tracking del titular | 0 a **−3 %** lo normal; −4/−5 % en grotescas gigantes (Huy Phan, bleibtgleich, Riotters); mono a 0 |
| Mayúsculas en el titular | 11 de 26 (casi siempre serifa fina o condensada) |
| Tamaño del titular, 1440 px | dos escalones: **titular 3–8 vw** (44–120 px, 19 webs) y **marca o portada 12–18 vw** (180–256 px, 7 webs) |
| Tamaño del titular, 390 px | **8–16 vw** (32–64 px) lo normal; la marca llega a 20–50 vw |
| Texto | **14–16 px** (hasta 18–20 en lujo), interlineado **1,3–1,5** (más prieto que el 1,6 de manual) |
| Etiquetas | 10–13 px, mayúsculas, tracking +2–3 % o mono a 0 (Odyssée `13px uppercase .39px`) |
| Medida del párrafo | **15–33 em** (mediana 22): párrafos estrechos, a menudo en una columna lateral |

Familias vistas y su alternativa libre para Trama: §5.2.

### Espacio y rejilla

| Regla | Dato medido |
|---|---|
| Margen lateral (escritorio) | **16–24 px** en 9 de 20 webs con scroll real; 48–80 px en 5 (Pensatori, Belgrade, LPAS, Nick Ho, Butter). El contenido «centrado con máximo» es minoría (Stripe, Raycast, Linear) |
| Margen lateral (móvil) | **10–24 px** (16 y 24 los más repetidos) |
| Rejilla | 12 columnas en 14 de 31, con separación de **10, 16, 20 o 24 px**; también 14, 16, 20, 22 y 24 columnas en agencias |
| Altura de página | 10–24 pantallas (mediana ~15) |
| Capítulo de relato | ~300 vh por escena fijada (Forged, Zero) |
| Cabecera | baja: **38–64 px** (Tengile 38, bleibtgleich 39, Odyssée 46, CoMinVi 48, Riotters 64), fija o `sticky`, sin fondo ni desenfoque salvo en producto (Linear `blur(20px)`) |

### Superficies

| Regla | Dato medido |
|---|---|
| Sombras | ≤ 2 elementos con sombra en 24 de 31 |
| Bordes | línea de 1 px como estructura (Stripe 126, Raycast 108, Linear 99, bleibtgleich 63); tarjetas sin borde ni sombra en lujo |
| Radios | 0 en 8 de 31; si hay, 2–8 px en datos y botones y **píldora** (`9999px`) en lo accionable |
| Fusión | `mix-blend-mode` en 24 de 31 (texto `difference` sobre vídeo o WebGL) |
| Marco | la imagen principal dentro de un marco con margen de 16–24 px (Riotters) o a sangre total (Tengile, CoMinVi, Moto) |

### Movimiento

| Regla | Dato |
|---|---|
| Scroll suave | Lenis en 21 de 31 medidas (68 %); en Codrops, 41 de 44 casos con Lenis lo combinan con GSAP. **Desactivado en móvil** (Horeca) |
| Microinteracciones CSS | **0,2–0,6 s** (0,3 la más repetida); curvas `ease`, `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(.165,.84,.44,1)`, `cubic-bezier(.19,1,.22,1)` (= `expo.out`) |
| Revelados | **0,8–1,2 s**, `expo.out` o `power3.inOut`, stagger **0,04–0,1 s** por línea o palabra, 0,01–0,03 por letra (Codrops) |
| Animación ligada al scroll | curva `none` (GSAP medido: Nick Ho 49 de 66 tweens) |
| Transición de página | ~0,6–1 s en total, `power2.inOut` o `expo.inOut`; la carga de la siguiente empieza durante el fundido |
| Preloader | contador 0→100 en ~3 s (`steps`) y salida de 1 s; versión corta al volver (`sessionStorage`) |
| Parallax | `yPercent 0 → −10` con la imagen a `scale(1.1)` dentro de `overflow: hidden` |

### Tecnología (medida, 31 webs)

Lenis 21 · vídeo 18 · lienzo WebGL 18 · three 14 · Next 11 · GSAP visible en `window` 9 (más en módulos, no detectable) ·
Webflow 8 · Nuxt 4 · Barba 4 · View Transitions en CSS 4 · Swup 1 · Framer 1. Trama ya cubre todo esto salvo el control de
calidad por GPU (ver §6, F5).

## 3. Composiciones del primer pantallazo (medidas en las capturas)

| Id | Composición | Medidas | Webs | En Trama |
|---|---|---|---|---|
| C1 | **Vídeo a sangre + titular en dos líneas escalonadas** (la 1.ª sangrada a la izquierda, la 2.ª a la derecha), cuerpo y CTA abajo a la derecha, cabecera en tres puntos (Reservar · marca · Menú) | serifa fina 220, 8,3 vw, mayúsculas, interlineado 0,9; CTA rectangular + cuadrado con flecha | Tengile, Son Daven | `Hero` + `SplitText`; falta la cabecera de tres puntos como opción de `NavBar` |
| C2 | **Marco con objeto**: el visual dentro de un marco con margen de 24 px, marca gigante «fantasma» detrás, subtítulo en dos tonos abajo a la izquierda, «Scroll down» abajo a la derecha, cabecera en cuatro columnas (marca · proyecto · reloj · menú) | margen 24 px, marca 16,7 vw peso 300 | Riotters, Heron | `BlueprintFrame`, `LocalTime`, `FitText` |
| C3 | **Rótulo en movimiento con ventana**: frase gigante en cinta que atraviesa una foto centrada; debajo, frase centrada y chip con borde; barra inferior © · CTA · menú | 15,2 vw, peso 500, −2 % | Realevate | `Marquee` + `TravelSlot`/foto encima; **nuevo**: ventana de imagen sobre la cinta |
| C4 | **Asimétrico editorial**: foto grande sangrada a la derecha (6 de 12 columnas), pieza pequeña con pie en la columna 5, mucho vacío a la izquierda | 12 col, separación 10, margen 20 | Odyssée | `CellGrid`/CSS de rejilla; receta |
| C5 | **Producto con objeto colgante**: isla de navegación, objeto 3D que entra desde arriba, titular centrado en una línea, subtítulo y un botón | 7,5 vw, peso 400 | Butter, Raycast | `IslandNav`, `ObjectStage`, `Hero` centrado |
| C6 | **Objeto o collage a sangre + manifiesto abajo a la izquierda**: el visual ocupa 2/3 y el texto es un párrafo-titular de 2–3 líneas con etiqueta «+ (Atelier)» | párrafo 36 px, −4 % | Pensatori, Pangram | `Parallax`, `StickerCollage`; receta |
| C7 | **Foto oscura + titular a la izquierda + datos mono flotando + tarjetas de acceso abajo a la derecha** | 7,8 vw, peso 700, interlineado 0,8; mono 12 px | CoMinVi, Moto | `Hero` + `MetaTable`; tarjetas con `Panel` |
| C8 | **Wordmark de borde a borde** arriba o abajo (ya en Foro, Neutomni) | 12–18 vw | OFFFForum, Neutomni, Lando | `FitText` |

## 4. Estructuras de relato

Del recuento de Codrops y Awwwards (casos con código del autor). Cada una se puede montar con piezas que ya existen.

| Id | Estructura | Orden | Paso entre secciones | Ejemplos | Piezas de Trama |
|---|---|---|---|---|---|
| R1 | Capítulos fijados con «puertas» | intro → N escenas de ~300 vh → interacción que frena → cierre | progreso 0–1 por tramo; la «puerta» es un gesto (mantener, dibujar) | Zero, Forged, EXAT | `PinnedSection`, `ScrubText`; puerta = **nuevo** `HoldButton` |
| R2 | Un objeto que guía | portada con el objeto → estados del mismo objeto → salida | el objeto no se va, cambia la capa de encima | Heron, Trionn, Igloo, Nick Ho | `ObjectStage` (+ `scroll="turntable"` de la `15`), `Traveler` |
| R3 | Producto en escena / despiece | emoción → comprensión (despiece) → compra | despiece en Z con el scroll; galería ⇄ 360° | iyO, Aether 1, Moto | `ObjectStage`, `FeatureExplorer`, `PricingSection` |
| R4 | Manifiesto tipográfico | prólogo o preloader con frases → titular → contenido | el preloader se funde con la portada | Obys, Jason Bergh | `Preloader` + `SplitText trigger="mount"` |
| R5 | Índice primero | lista o slider de proyectos → ampliada → «siguiente» continuo | cambio de vista lista/rejilla; siguiente proyecto sin corte | Kononenko, Bisous, Partizan | `ProjectList view`, `SharedTransition`, `NextPage` (de la `15`) |
| R6 | Mundo explorable | mapa o escena distribuidora → zonas → páginas | navegar dentro del mundo | San Rita, Messenger, Overworld | `ExplorableCanvas` |
| R7 | Línea de tiempo | un capítulo por año → transición → siguiente | fondo que se disuelve; audio que funde | Ten Years Away, House of Yellow, Tengile | `Timeline`, `HorizontalScroll`, `ThemeScroll` |
| R8 | Antes / después | boceto → acabado con el scroll | máscara SVG con borde de tinta (`feTurbulence`), no fundido | Heron, Colonia Zacamil | **nuevo** `BeforeAfter` (de la `15`) |
| R9 | Webfilm o juego | billete de entrada → escenas → elecciones → final | escenas con decisiones en botones reales | Chasing the Moment, Tie-break | `RetroCanvas`, `Modal size="full"` |
| R10 | Servicio claro (pyme) | promesa → prueba (cifras, reseñas) → oferta → acción | secciones normales, una idea por pantalla | [`11`](./11-estudio-sectores-2026.md) | Secciones del kit |

## 5. Guías de estilo propuestas

Cada guía fija **tinta + papel (+ acento)**, **par tipográfico**, **escala**, **espacio**, **superficies**, **movimiento**,
**composición del primer pantallazo** y **relatos que le van**. Se apoyan en los temas que ya existen cuando encajan.

### 5.1 Las ocho guías

| Guía | Tintas | Par tipográfico (libre) | Titular | Espacio | Movimiento | Composición · relato | Referencias medidas | Tema actual |
|---|---|---|---|---|---|---|---|---|
| **G1 Lujo tranquilo** | hueso `#F5EEE9` + oliva, marino o tinta | serifa display fina (Cormorant 300 / Instrument Serif) + grotesca (Inter 400) | 8 vw, 300, mayúsculas, 0,9, −2 % | margen 16, rejilla 12×16, cabecera 38 px | revelados 1,2 s `expo.out`, vídeo lento | C1 · R7, R10 | Tengile, Odyssée, Son Daven, White Desert | `bosque` (ampliar) |
| **G2 Monocromo de agencia** | blanco o `#0E0E0E` + su contraria | una grotesca (Inter Tight / Geist) en 400–500 | 12–17 vw, 400, 0,9, −4 % | margen 10–20, rejilla 12×10 | rodillo de enlaces, transición 0,8 s `expo.inOut` | C8, C6 · R4, R5 | twks, bleibtgleich, Huy Phan, Obys, Signal-A | `editorial` / `editorial-oscuro` |
| **G3 Técnico de producto** | blanco o gris frío + pizarra, acento único | grotesca (Switzer→Inter) + mono (Geist Mono) | 16 vw marca / 4 vw titular, 300, −5 % | marco 24, rejilla 12 | datos que cuentan, barrido de escaneo | C2, C7 · R2, R3 | Riotters, Heron, CoMinVi, Terminal | `blueprint` |
| **G4 Producto nocturno** | `#08090A` + grises de la misma tinta | Inter 510 + mono | 5 vw, 510, 1, −2,2 % | centrado 1200, separación 128 | microinteracción 0,1–0,3 s | C5 · R3, R10 | Linear, Raycast | `nocturno` |
| **G5 Acento eléctrico** | casi negro + un acento saturado (ácido, amarillo, rojo) | condensada display (Anton / Bebas) + grotesca (Mona Sans) | 7–8 vw, 700, 0,8, mayúsculas | margen 16–80 | marquees opuestos, GSAP rápido 0,5 s | C7, C8 · R2 | Lando, Nick Ho, Neutomni | `voltaje` |
| **G6 Rótulo cinético** | blanco + un azul o rojo profundo | grotesca geométrica (Manrope / Onest) + extendida para chips (Archivo Expanded) | 15 vw, 500, −2 % | barra inferior fija | cinta de texto con ventana de imagen | C3 · R5, R10 | Realevate, Pensatori | — (nuevo) |
| **G7 Editorial cálido** | crema `#FDFBEF` + tinta verde o marrón | serifa display (Gloock / Fraunces) + grotesca (Work Sans / Inter) | 16 vw marca, 300, mayúsculas | margen 48–64 | `ScatterText`, telón de color | C8, C1 · R7, R1 | Belgrade Arbor, Akaru, David Whyte, Iventions | `bosque` / `editorial` |
| **G8 Lúdico** | pareja de vivos o pastel (lila + rosa, azul + amarillo) | redondeada (Nunito / Bricolage) + pixel o mono | 10–12 vw | libre | juego, pegatinas, sonido opcional | C6 · R9, R6 | Ponpon Mania, Bruno Simon, Lacoste, Hamaca | `piscina` |

### 5.2 Fuentes: de las premiadas a libres

Trama solo usa fuentes libres (`lib/ui/fonts.ts`). Lo que ya está cubre G2, G4 y parte de G1, G3 y G7. Faltan:

| Rol | Vista en | Libre propuesta | Estado |
|---|---|---|---|
| Condensada display | Anton (Nick Ho), Brier (Lando), Bayon, Heathergreen | **Anton**, **Bebas Neue**, Big Shoulders Display (Google) | falta |
| Grotesca neutra suiza | Switzer, Suisse, Neue Haas, Söhne, Basel | Inter / Geist (hay); **Switzer** (Fontshare, revisar licencia) | ◐ |
| Extendida | Monument Extended, Maison Neue Extended | **Archivo** con eje de anchura (Google) | falta |
| Serifa display fina | PP Fragment (Tengile), PP Editorial, TT Ramillas, Editorial Old | Instrument Serif, Cormorant (hay); **Gloock** (Google) | ◐ |
| Serifa de lectura | psTimes (Odyssée), Literata (Oryzo) | Newsreader (hay); **Literata** | ◐ |
| Grotesca con carácter | Aeonik, Neue Montreal, General Sans, Apercu | Manrope, Space Grotesk (hay); **Onest**, **Hanken Grotesk** | ◐ |
| Mono | Geist Mono, Berkeley, PP Supply, Proto Mono, Fira Code | Geist Mono, JetBrains, IBM Plex (hay); **Martian Mono** | ◐ |

Las de Fontshare se añaden con `next/font/local` solo tras confirmar su licencia; las de Google, con `next/font/google`
sin precarga (como las editoriales).

### 5.3 Qué se copia y qué no

Se copian **medidas y mecánicas**: rejilla, márgenes, escalas, pesos, interlineados, composición, orden del relato,
duraciones y curvas. No se copian marcas, textos, fotos, ilustraciones ni fuentes de pago (se usa su alternativa libre).
Una demo hecha con una guía no debe ser reconocible como la web de la que salió (criterio de la [`06`](./06-indice-replicar-webs-premiadas.md) §7.3).

## 6. Plan

| Fase | Entrega | Detalle | Criterio de cierre |
|---|---|---|---|
| **F1 · Guía como dato** | `lib/ui/styleguides.ts` + tokens CSS nuevos | Cada guía = `{ id, tokens (TokenSet existente), pairing (FONT_PAIRINGS), type: { display, h1, h2, body, label } con clamp(), space: { margin, gutter, cols, section }, surface: { radius, line, shadow }, motion: { fast, reveal, page, ease, stagger }, hero: C1–C8, stories: R1–R10 }`. Resuelve la escala fluida pendiente (C8 de la `06`): `--fs-display`, `--fs-h1`…, `--space-margin`, `--space-gutter`, `--ease-reveal`, `--dur-reveal`. Componente `StyleGuide` que las aplica a un contenedor, como `ThemeScroll` | Las 8 guías definidas; `typecheck`; ficha en `/componentes` |
| **F2 · Fuentes** | 6–8 familias libres en `lib/ui/fonts.ts` y `FONT_PAIRINGS` | Anton, Bebas Neue, Archivo, Gloock, Literata, Onest, Martian Mono; Switzer solo si la licencia lo permite | Cada guía con su par sin fuentes de sistema |
| **F3 · Comparador de relatos** (concepto nuevo) | Página **`/guias`** | Un mismo contenido (una marca ficticia con titular, tres ventajas, una prueba, una oferta y una acción) pintado con **cada guía × cada composición C1–C8**, y una vista por **estructura R1–R10** con el mismo contenido. Selector de guía, composición y relato; vista lado a lado en miniatura (iframe escalado, como en la `14` §4). Cada combinación genera el código para copiar | Las 8 guías × 8 composiciones se ven y se copian; móvil 390 px |
| **F4 · Sondeo en el repo** | `scripts/probe-refs.mts` + `npm run refs:probe -- <url…>` | El script de esta ronda (Playwright como dependencia de desarrollo, Chromium en caché) con salida JSON y capturas. Mide también **nuestras** guías en `/guias` y compara cada valor con los rangos de §2 | Informe «dentro / fuera de rango» por guía |
| **F5 · Piezas que faltan** | Opciones y componentes pequeños | `NavBar layout="split3"` (C1), cinta con ventana de imagen (C3), `HoldButton` (puerta de R1), `BeforeAfter` (R8), calidad por GPU en `lib/ui/capability.ts` (niveles 0–3, como Shopify Editions) | Ficha en `/componentes`; `catalog:check` |
| **F6 · Demos con guía** | Las de la [`15`](./15-evaluacion-proximas-demos.md) | Clínica = G1 + C4 + R10; Lodge = G1 + C1 + R7; Escáner = G3 + C2 + R2 | Criterio de demo terminada de la [`11`](./11-estudio-sectores-2026.md) §7 |

Orden recomendado: **F1 → F2 → F3** (con ellas ya se puede «hacer algo rápido que funcione»), después F4 para vigilar la
fidelidad y F5–F6 en paralelo con las demos.

## 7. Decisiones abiertas

1. ¿`/guias` vive en la web de la librería (pública) o solo en local como herramienta interna?
2. ¿Fontshare (Switzer, General Sans) entra si su licencia permite uso comercial en webs de cliente, o solo Google Fonts?
3. ¿Playwright como dependencia de desarrollo del repo (F4)? Pesa poco porque reutiliza el Chromium en caché, pero obliga a
   fijar versión.
