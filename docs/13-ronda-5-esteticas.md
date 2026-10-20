# Ronda 5: sitios del año, webs de producto y estéticas nuevas (20-10-2026)

> Hasta la ronda 4 las referencias salían casi todas de los «Sites of the Day» de octubre de Awwwards. Esta ronda amplía la
> búsqueda a otras fuentes: la lista de **Sites of the Year** de Awwwards, **webs de producto** que llevaban pendientes desde la
> [`07`](./07-formulas-webs-top.md) §5 (Linear, Raycast, Stripe, Apple) y **estéticas que el kit no tenía** (Y2K, tienda
> industrial, fundición tipográfica). Diez webs **abiertas en Chrome** (escritorio, 1516–1568 px), con captura en reposo y tras
> hacer scroll y sondeo por JavaScript (librerías, tipografía del titular, elementos fijos, lienzos). Lo que no se pudo medir va
> marcado. Método: [`07`](./07-formulas-webs-top.md) §4.

## 0. Conclusiones

1. **Cinco estéticas nuevas**, todas fuera del eje «editorial en blanco y negro» de las rondas anteriores: *atleta en voltaje*
   (Lando Norris), *producto nocturno* (Linear, Raycast), *escritorio Y2K* (Poolsuite), *iridiscente claro* (Stripe, Apple) y
   *tienda industrial* (Teenage Engineering). Las tres primeras tienen tema, demo y receta; las dos últimas, solo receta (§3).
2. **Lo que más impacto da por línea de código**, por este orden: el cambio de tema por sección (`ThemeScroll`), el titular
   que mezcla palo seco y serifa con barras de color (`SplitText effect="block" emphasis`), la interfaz real como imagen
   principal con luz desde arriba (receta de Faro, sin componente nuevo) y la firma que se dibuja (`LineDraw`).
3. **El 3D no es obligatorio para ganar.** Lando Norris (sitio del año 2025) usa three.js solo en el retrato del casco; todo lo
   demás es tipografía, color, fotos y movimiento CSS. Linear no tiene ni un `<canvas>` en la portada.
4. **Modularidad (guía §12):** de 9 ideas, 4 son opciones de piezas que ya existían o recetas de demo, y 5 son componentes nuevos
   porque no encajaban en ninguno (§4).

## 1. Fuentes

| Fuente | Qué aportó | Fiabilidad |
|---|---|---|
| [Awwwards · Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/) (leída 20-10-2026) | Lista de los 30 últimos sitios del año (Lando Norris, Igloo Inc, Lusion v3, Messenger, Opal Tadpole…) | Alta |
| Las 10 webs de §2, abiertas en Chrome | Medidas propias (ver cada fila) | Alta para lo medido; «inferido» donde se dice |
| [setproduct · retro and brutalist UI 2026](https://setproduct.com/blog/retro-brutalist-ui-design-2026), [theplusaddons · neo-brutalism](https://theplusaddons.com/blog/neo-brutalism-web-design/), [daisyUI · UI trends 2026](https://trends.daisyui.com/ui-design-trends-2026/) | Contexto de tendencias (Y2K de vuelta, el neobrutalismo queda como acento) | **Baja**: artículos de tendencias; se usan solo como pista. Gumroad, el ejemplo clásico de neobrutalismo, **ya no** usa sombras duras en su web (medido, §2) |

**Límite:** Godly redirige ahora a otra galería y no se usó. Igloo Inc, Messenger, Lusion v3 y Bruno Simon (sitios del año) no se
abrieron en esta ronda: quedan en §6.

## 2. Qué se vio en cada web

| Web | Tecnología medida | Fórmula distintiva | En Trama |
|---|---|---|---|
| [Lando Norris](https://landonorris.com/) (OFF+BRAND, **sitio del año 2025** con Developer Award) | Webflow, **Lenis**, three r174 (21 lienzos: el casco del hero), sin GSAP en `window`. Mona Sans Variable + Brier (serifa). Barra de scroll fija con `mix-blend-mode: difference` | Oliva casi negro (`#282c20`) y **un amarillo ácido**; **curvas de nivel** finas detrás de todo; marca en dos tipografías («LANDO» serifa / «NORRIS» palo seco); **dos cintas en sentidos opuestos** (serifa en acento y palo seco) que pasan por detrás de una foto con **firma que se dibuja**; titular en mayúsculas con **palabras sueltas en serifa** que entran tapadas por **barras de color**; **collage** de fotos sueltas con «lugar, año» y parallax distinto; el **fondo cambia por sección** (oliva → hueso → negro); cascos en **fichas con la esquina recortada** y la etiqueta en el hueco | `GridBackground kind="contour"`, `Marquee` ×2, `LineDraw`, `SplitText effect="block" emphasis`, `Parallax`, `ThemeScroll`, `voltTokens`, demo **Volt** |
| [Pangram Pangram](https://pangrampangram.com/) (fundición) | Shopify, sin Lenis ni GSAP, sin lienzos. Neue Montreal y una fuente por tarjeta | Pila de **tarjetas redondeadas a todo el ancho**: foto a sangre + nombre de la fuente gigante + dos píldoras; rejilla de **«Aa»** por familia con insignia «New»; aviso de cookies en el amarillo de la marca | Receta (§3): `StackedCards` + `FitText`; el «Aa» es `ProductCard` con texto. Sin pieza nueva |
| [Linear](https://linear.app/) | Next.js, **0 lienzos**, 0 vídeos. Inter Variable a **510** de peso, 64 px, tracking −1,4 px; Berkeley Mono en etiquetas; cabecera con `backdrop-filter: blur(20px)` | Negro `#08090a`; **la propia aplicación es el hero**, con luz cenital y fundido al suelo; logos de clientes con etiqueta mono; **párrafo en dos tonos** (frase en blanco, resto en gris); secciones **título a la izquierda, texto a la derecha** + «Learn more →»; tablero kanban y conversación dibujados con la UI real | Receta de **Faro** con `AppShell` real dentro de un marco con máscara; `nightTokens` |
| [Raycast](https://www.raycast.com/) | three r186, **1 lienzo** (el hero), Inter 600 + GeistMono | **Haces de luz rojos en diagonal**, desenfocados, detrás del titular; cabecera en isla con borde fino; la app dentro de una barra de menú de macOS dibujada; **pestañas segmentadas**; tarjetas de extensión con un **brillo del color de cada marca** abajo | `GradientField kind="beams"`; las tarjetas son `Panel` + CSS de la demo |
| [Stripe](https://stripe.com/) | Lienzo `single-wave__canvas` (la cinta) + otro de carrusel; sohne-var a 300 de peso, tracking −0,88 px; el titular es **un párrafo** con la primera frase en tinta y el resto en gris | **Cinta iridiscente** (naranja, rosa, violeta) que cruza en diagonal; rejilla bento con un botón ⤢ en cada tarjeta; tarjeta de crédito con degradado; globo de partículas | `GradientField kind="ribbon"`; el resto es `BentoGrid` (ya existía) |
| [Apple · AirPods Pro 3](https://www.apple.com/airpods-pro/) | 16 `<video>`, 0 lienzos, varios `position: sticky` (barra de producto con «Buy» y secciones de 2.000–2.500 px) | **Explorador de ventajas**: píldoras con «+»; la abierta crece a tarjeta con su texto y la imagen de al lado cambia. «Get the highlights»: carrusel de vídeos con **puntos de progreso** y pausa | `FeatureExplorer` (nuevo); el carrusel con puntos-progreso queda pendiente (§6) |
| [Teenage Engineering](https://teenage.engineering/) | no sondeado por JS | Navegación como **fila de iconos de línea** con subenlaces debajo; fotos en blanco y negro a sangre; **aviso de cookies en un triángulo de señal de peligro** (amarillo, mano) | Receta «tienda industrial» (§3), sin demo |
| [Gumroad](https://gumroad.com/) | ABC Favorit; la única sombra medida es un brillo interior; bordes de 1 px | Negro + rosa; monedas 3D que flotan; tarjetas oscuras redondeadas con ilustraciones planas **con sombra dura**. El neobrutalismo queda **solo en las ilustraciones** | Confirma que el neobrutalismo es acento, no página (lo cubre la variante `retro`) |
| [Poolsuite](https://poolsuite.net/) | no sondeado por JS | Escritorio de sistema operativo antiguo sobre **papel cuadriculado rosa**: barra de menú con la fecha, **ventana del reproductor** con vídeo en **semitono**, **dock** de iconos abajo | `poolTokens`, demo **Hamaca** (ventanas que se arrastran, dock, `AudioPlayer retro`) |
| [Godly](https://godly.website/) | redirige a otra galería | — | No se usó |

### Lo que se repite (reglas de esta ronda)

1. **Un acento que manda** sigue siendo la norma (amarillo ácido, violeta, rojo, rosa). Lo nuevo: el acento puede **cambiar de tono
   con la sección** (Lando: amarillo sobre oscuro, oliva sobre claro) para seguir leyéndose.
2. **Dos tipografías en el mismo titular** (palo seco grueso + serifa fina) es la forma más barata de dar carácter: Lando, y antes
   OFFFForum y Arbor.
3. **El producto real como imagen** (Linear, Raycast, Stripe): ni ilustración ni mockup de dispositivo; la interfaz, con luz.
4. **El texto gris como segundo nivel** dentro del mismo párrafo (Linear, Stripe): una frase en tinta y el resto en `--mut`.
5. **Fondos con movimiento lento y barato**: curvas de nivel (SVG), haces o cintas (un shader), sin escenas 3D.

## 3. Estéticas como recetas

| Estética | Tema | Ingredientes | Demo | Para quién |
|---|---|---|---|---|
| **Atleta en voltaje** | `voltTokens` («Voltaje») | `GridBackground kind="contour"` fijo + `ThemeScroll` (oliva → hueso → negro) + marca en dos tipografías + `SplitText effect="block" emphasis` + `Marquee` ×2 en sentidos opuestos + `LineDraw` (firma) + collage con `Parallax` + `ImageTrail` + fichas recortadas (CSS de la demo) + `BigFooter` | `/sitios/volt` | Deportistas, equipos, motor, marcas personales con mucha foto |
| **Producto nocturno** | `nightTokens` («Producto nocturno») | `GradientField kind="beams"` detrás del titular + `AppShell` real en un marco con luz cenital y `mask-image` hacia abajo + `LogoCloud` + párrafo en dos tonos + secciones título-texto + `FeatureExplorer` + `Kbd` + `PricingSection` + `GradientField kind="mesh"` de cierre | `/sitios/faro` | SaaS, herramientas para desarrolladores, IA |
| **Escritorio Y2K** | `poolTokens` («Escritorio Y2K», variante `retro`) | `GridBackground kind="lines"` sobre rosa + barra de menú con `LocalTime` + ventanas con barra rayada que se arrastran (CSS y 40 líneas de la demo) + `AudioPlayer variant="retro"` + foto en semitono (`mask-image` de puntos) + dock con `Icon` pixel | `/sitios/hamaca` | Radios, sellos, festivales pequeños, comunidades, marcas con humor |
| **Iridiscente claro** | (tema claro del proyecto; acento violeta y segundo acento cálido) | `GradientField kind="ribbon"` a un lado del titular + titular-párrafo en dos tonos + `BentoGrid` + `FeatureExplorer` | — | Pagos, fintech, producto de consumo premium |
| **Tienda industrial** | `editorialDarkTokens` con acento amarillo | Navegación como fila de iconos de línea (`NavBar slots` + `Icon`), fotos B/N a sangre, `CookieBanner` (forma triangular: pendiente), `ProductCard` | — | Fabricantes de hardware, diseño industrial |

## 4. Qué se construyó y por qué así (modularidad)

| Idea | Decisión | Por qué |
|---|---|---|
| Curvas de nivel de fondo | **Opción** `GridBackground kind="contour"` (+ `seed`) | Es un fondo de rejilla más: CSS/SVG, sin JS. `lib/ui/contours.ts` hace ruido + *marching squares* en el servidor (≈ 17 KB de trazado) |
| Barras de color que descubren el texto | **Opción** `SplitText effect="block"` | Es otra entrada por líneas o palabras; la barra es un `::after` por palabra que tapa también el espacio siguiente, así la línea se lee continua |
| Palabras en serifa dentro del titular | **Opción** `SplitText emphasis` (`*así*`) | `SplitText` solo admite un string; los asteriscos marcan los tramos y el lector de pantalla recibe el texto sin ellos |
| Ficha con la esquina recortada | **Receta de la demo** (`vt-notch` en `volt.css`) | Solo tiene sentido en esta estética; hecha como opción de `Panel`, el `clip-path` cortaría el borde de todas las variantes |
| Firma, subrayado o flecha que se dibujan | **Nuevo** `LineDraw` | Ningún componente dibujaba trazos; vale para firmas, subrayados de titular y flechas de «mira aquí» |
| Manchas, cinta y haces en WebGL | **Nuevo** `GradientField` | Los fondos existentes son de caracteres (ASCII, textmode), de rejilla CSS o escenas 3D; faltaba color puro y barato (un triángulo, WebGL 1, sin three) |
| Tema por sección | **Nuevo** `ThemeScroll` | Resuelve también el pendiente E3 del [índice](./06-indice-replicar-webs-premiadas.md) («cabecera que cambia de tema por sección»): una cabecera fija dentro del contenedor hereda los tokens |
| Estela de fotos bajo el cursor | **Nuevo** `ImageTrail` | `CustomCursor` es un cursor (uno, global); la estela es una zona con muchas imágenes. Reutilizar el cursor obligaría a mezclar dos responsabilidades |
| Precios de producto (Linear, Vercel) | **Opciones** de `PricingSection` y `PricingCard`: `layout="joined"`, `highlight="lift"`, `planCase`, `marker="check"`, `badgePlacement`, `toggle="neutral"` | La rejilla de tarjetas con el plan invertido en violeta no encajaba en Faro; con opciones, cualquier web de producto lo tiene sin un segundo componente de precios. De paso: un precio anual igual al mensual («A medida», «0 €») ya no se marca como anual |
| Explorador de ventajas | **Nuevo** `FeatureExplorer` | `Accordion` es solo texto y `Tabs` cambia un panel entero; aquí la lista y la imagen viven juntas y cambian a la vez |

Todas las piezas nuevas están en `components/ui/` con ficha en `/componentes` (`lib/catalog/entries/ronda5.tsx`) y estilos en
`components/ui/styles/ui-impact.css`. Temas nuevos en `TOKEN_THEMES` (`lib/ui/tokens.ts`). Fotos nuevas: temas `deporte` y
`verano` de la biblioteca (`npm run images:fetch -- deporte`), con créditos en `/creditos`.

## 5. Lecciones técnicas

- **En el Chrome controlado por la extensión, las animaciones CSS y de Web Animations no avanzan** entre capturas
  (`animation.currentTime` se queda en 0 aunque `document.timeline` avance; ni un `el.animate()` trivial progresa). Para ver un
  estado intermedio: `el.getAnimations().forEach(a => { a.pause(); a.currentTime = 300 })` y captura. Así se comprobaron la
  estela de `ImageTrail` y las barras de `SplitText block`. Se suma a la trampa «Animaciones paradas al probar» de la guía §10.
- **`stroke-dasharray` con remate redondo:** con `pathLength=1` y patrón `1 1`, en `dashoffset: 1` el remate pinta un punto al
  principio. `LineDraw` usa patrón `1 2` y oculta con `1.01`.
- **`ThemeScroll` solo funde el fondo y el texto del contenedor.** Lo que dentro pinta `var(--card)` o `var(--acc)` cambia de
  golpe: suficiente con el fundido de fondo (es lo que más superficie ocupa). Registrar los tokens con `@property` permitiría
  fundirlo todo, a cambio de declarar su tipo.
- **El acento de un tema claro no puede ser el del oscuro.** El amarillo `#d2ff00` sobre hueso no llega a 1,5:1; en el tema
  «hueso» de Volt el acento es un oliva oscuro y la barra de `block` hereda ese color.
- **Abrir `next dev` desde el móvil por la red local** (192.168.x.y) dejaba las webs en el fondo: Next 16 bloquea `/_next/…`
  a orígenes que no están en `allowedDevOrigins`. Añadida la LAN en `next.config.ts`. Al investigarlo salieron dos cosas: el
  CSS de cada web no viene en el HTML (pendiente en [`04`](./04-pendientes.md) §5b) y Faro y Foro compartían el prefijo
  `.fr-` (Faro pasa a `.fa-`).
- **`next dev` puede quedar roto en todas las páginas** («Jest worker encountered 2 child process exceptions») sin que el código
  tenga errores: reiniciarlo lo arregla. Pasó al añadir tres rutas nuevas de `/sitios`.

## 6. Pendiente

- Abrir los sitios del año que faltan: Igloo Inc (abeto), Lusion v3, Messenger, Opal Tadpole, Bruno Simon.
- Carrusel de vídeos con puntos que hacen de barra de progreso (Apple «Get the highlights»): opción de `Carousel` o `VideoPlayer`.
- `CookieBanner` con forma (triángulo de Teenage Engineering) y la navegación en fila de iconos: demo «tienda industrial».
- Teclas 3D de Raycast y las tarjetas con brillo del color de cada marca.
- Demo «iridiscente claro» con `GradientField kind="ribbon"`.
- Revisar Volt, Faro y Hamaca a 390 px, con teclado (las ventanas de Hamaca son diálogos no modales) y con axe; Safari y Firefox.
