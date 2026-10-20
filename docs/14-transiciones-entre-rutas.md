# Ronda 6: transiciones entre rutas con elementos que no desaparecen (20-10-2026)

> Objetivo: atraer miradas con la navegación. No basta con animar la página entera (eso ya lo hacía `PageTransition`):
> las webs que más llaman la atención mantienen algo en pantalla entre una ruta y otra (la imagen de un proyecto que crece
> hasta ser la portada del caso, un reproductor que se encoge, la marca que se convierte en titular). Esta ronda estudia
> cómo se hace, lo lleva al kit con la View Transitions API y lo enseña en una demo: **Travesía** (`/sitios/travesia`).

## 0. Conclusiones

1. **Lo que faltaba no era otra animación de página, sino continuidad y coreografía.** El kit ya tenía 11 animaciones de
   ventana y el morph de un par. Faltaban un elemento que **sea el mismo** en todas las rutas y cambie de caja
   (`Traveler`), texto que viaje palabra a palabra (`SharedText`), retrasos para que no se mueva todo a la vez (`delay`) y
   la luz ambiental del vídeo (`AmbientLight`).
2. **La primera versión de la demo era técnica, no de diseño.** Una caja con el tráiler que cambiaba de tamaño, todo a la
   vez y con la misma curva, sobre páginas de plantilla. Funcionaba, pero no atraía miradas. Se rehízo con los patrones de
   §2, sacados de ver fotograma a fotograma 16 transiciones de Awwwards.
3. **El App Router lo hace mejor que una web multipágina.** En multipágina el elemento se destruye y se vuelve a crear: la
   demo «Video Zoom» de Chrome guarda `currentTime` en `pageswap` y lo restaura en `pagereveal` (se nota el salto). En una
   SPA el nodo vive en el layout: el vídeo no se corta y el navegador anima su caja con la imagen **en directo**.
4. **Casi nada de lo premiado usa la API.** Las dos SOTD de transiciones del 17 y el 19-10 (Belgrade Arbor, FORMAT) no
   tienen ningún `view-transition-name` propio: GSAP y capas fijas. Solo Cyd Stumpel (autora de guías sobre la API) la usa
   en su portfolio. La API da hoy lo mismo sin librería.
5. **Lo difícil es el momento de la captura.** La animación solo sale si, cuando el navegador captura el estado nuevo, la
   página nueva ya está montada y el viajero ya está en su hueco. Las tres averías de esta ronda (§5) fueron variantes de
   eso.

## 1. Fuentes y método

| Fuente | Qué aportó | Fiabilidad |
|---|---|---|
| [Awwwards · Transitions](https://www.awwwards.com/websites/transitions/) y la colección de elementos [`/elements/transitions/`](https://www.awwwards.com/elements/transitions/) (leídas el 20-10-2026) | Más de 100 «elementos» de transición, cada uno con un MP4 de la animación. Se eligieron 18 de índice → caso, siguiente proyecto y lista → detalle | Alta |
| Los 18 MP4 de esos elementos | **Hojas de fotogramas** (20 por vídeo, en rejilla, con `ffmpeg`): se ve qué se mueve primero, cuánto dura y qué persiste. Se revisaron 16 (§2); las de Stas Bondar y 197 Historias Ilustradas se descargaron pero no se miraron | Alta para lo que se ve en el vídeo; no dice la técnica |
| [FORMAT](https://format.obys.agency/) y [Belgrade Arbor](https://belgradearbor.rs/en), en Chrome | FORMAT: una página, GSAP y Matter.js según su ficha, sin `view-transition-name`. Belgrade Arbor: Next.js con Lenis, telón fijo `bg-pine-green` que crece en `scaleY`, cabecera fija | Media: el Chrome de la extensión tenía el viewport fijado a 392 px |
| [view-transitions.chrome.dev](https://view-transitions.chrome.dev/) (Bramus, Chrome) | Código de «Video Zoom» (transferencia de estado en MPA), «Profiles», «Cards» (`match-element`), «Circle» | Alta: se leyó el código |
| Guía de Next 16 (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`) | Morph de un par, `default="none"`, tipos de navegación y el aviso clave: el morph solo sale si el destino se pinta en el mismo commit (página precargada) | Alta |

Los elementos no son todos de 2026: la fecha va en la URL de su vídeo (`/awards/element/2024/08/…`). Van de 2024 a
octubre de 2026.

## 2. Qué hace cada transición (fotograma a fotograma)

| Web | Qué se ve | Patrón |
|---|---|---|
| **The Art of Documentary** | Lista de cursos; al señalar uno, aparece su vista previa a la derecha. Al pulsar, la lista sube y esa misma vista previa crece desde abajo hasta ser la portada, con el título encima | Vista previa del índice → portada |
| **Ciel Rose** (siguiente proyecto) | El vídeo, a sangre, se **encoge** a una ventana pequeña centrada, se queda un instante y se **expande** (con el borde abombado, efecto lente) ya como el proyecto siguiente | Siguiente en dos tiempos |
| **Mario Roudil** | Índice con una tira vertical de miniaturas en el centro y el nombre partido en dos esquinas de abajo. Al ir a «About», las miniaturas salen volando escalonadas y las dos palabras del nombre crecen hasta un titular gigante | Texto que viaja palabra a palabra |
| **Cyd Stumpel** (API nativa) | Su nombre, enorme y rojo en «About», reaparece pequeño abajo a la izquierda en el archivo del blog; el título de sección se queda en su sitio y cambia de color | Texto persistente entre páginas |
| **Studio Foundry** | La imagen del proyecto se ve por una ventana **inclinada** (recorte en polígono) que se abre hasta ocupar la pantalla; el título del proyecto no se mueve y pasa a blanco | Ventana recortada que se abre |
| **We Go Again** | Fondo = el propio vídeo muy desenfocado. Al cambiar de proyecto, la ventana del vídeo se encoge, el color ambiente cambia y crece el vídeo nuevo | Luz ambiental + encoger/crecer |
| **Giordano Betti** | Igual de ambiental (fondo desenfocado del vídeo) y burbujas con efecto lente que revelan otros planos; el título fijo en el centro | Luz ambiental |
| **Xanvier Allison** | Vídeos a sangre que entran por la derecha como paneles verticales; la página entera va enmarcada por una versión borrosa del vídeo | Luz ambiental + barrido |
| **G. Colombel** | Un objeto 3D (WebGL) que persiste: en la portada, centrado detrás del nombre; en el proyecto, a la derecha con otra luz | Objeto que persiste y cambia de sitio |
| **P10** (Pesquera Diez) | Rendijas horizontales sobre las imágenes al pasar; al pulsar, una banda amarilla de marca invade la pantalla y la página nueva se abre por una rendija | Telón de marca por rendijas |
| **Monogrid** | Al final del caso, «Next project»: la pantalla se llena de bloques del azul de marca en rejilla, que luego se vacían revelando la imagen siguiente; el título queda fijo abajo | Telón de bloques (pixelado) |
| **Pier Gorelli** | Entre páginas, un monograma («P» → «PG.») sobre una rejilla de construcción; después el titular se escribe en contorno, se rellena y la entradilla se teclea | Telón con monograma |
| **Creative Reference Library** | Portadas inclinadas como polaroids; al pasar de carrusel a lista vuelan en abanico a una pila en una esquina, y vuelven | Tarjetas que se apilan |
| **Remy Shoots** | Galería horizontal del caso; al final, «Next project» con dos fotos y el título; el siguiente entra deslizando sin perder el título | Siguiente proyecto horizontal |
| **Gionatan Nese** | Índice como nube circular de miniaturas; al pulsar, tres paneles y luego un producto a pantalla completa, con paneles que se deslizan | Índice en nube → detalle |
| **Grande Charte** | Telón verde con el borde superior en arco que sube y descubre la página siguiente | Telón con forma |

## 3. Lo que se repite (las reglas de esta ronda)

1. **Lo que mirabas al hacer clic es lo que llega.** La vista previa del índice no se sustituye por una portada: se
   convierte en ella (Art of Documentary, Studio Foundry).
2. **La tipografía también viaja**, y por palabras (Mario Roudil, Cyd Stumpel).
3. **«Siguiente» es un bucle sin cortes**: encoger, cambiar, expandir (Ciel Rose, We Go Again, Remy Shoots).
4. **El color del vídeo es el fondo**: luz ambiental desenfocada que cambia con lo que se reproduce (We Go Again, Giordano
   Betti, Xanvier Allison).
5. **Algo persiste siempre**: la cabecera, el título, un objeto 3D (todas).
6. **Nada se mueve a la vez.** Primero la imagen, después el título, al final el resto, con curvas lentas al principio y
   al final.

## 4. Qué se construyó

**Kit**
- **`Traveler`, `TravelStage`, `TravelSlot`, `useTraveler`** (`components/ui/Traveler.tsx`): el mismo elemento, vivo,
  cambia de caja entre rutas (reglas 1, 3 y 5). Guía en [05](./05-transiciones-de-pagina.md#elementos-que-viajan-entre-rutas-traveler).
- **`SharedText`** (`components/ui/SharedText.tsx`): texto que viaja palabra a palabra, escalonado y por encima de todo
  (regla 2).
- **`AmbientLight`** (`components/ui/AmbientLight.tsx`): la luz ambiental de un vídeo de la página, sin decodificarlo dos
  veces (regla 4).
- **`delay`** en `SharedTransition`, `SharedText` y `Traveler` (regla 6), y `fit="cover"` y `layout` en
  `SharedTransition`.
- En `/sitios`: `data-transition` (los tipos de una navegación en un enlace normal) y `data-navigate="manual"` (el enlace
  navega por su cuenta, tras su animación).
- **`catalog:check`** ahora falla si un componente del kit no tiene ficha ni mención en la tabla del README: `AmbientLight`
  se había colado sin ficha.

**Demo Travesía**, rehecha con §3: el índice es una lista tipográfica enorme con la «pantalla» a la derecha, que reproduce
el documental que señalas y tiñe la página con su luz; al abrir uno, la pantalla (el mismo `<video>`, sin cortarse) se
expande a la portada mientras las palabras del título bajan hasta el titular; «Siguiente documental» la encoge a una
ventana, cambia de película por el camino y la expande como portada nueva; la marca de la cabecera («Travesía
Documental») se convierte, palabra a palabra, en el titular gigante de la productora; en contacto, la pantalla es una
píldora dentro del titular.

## 5. Lecciones técnicas

- **Decidir al terminar la actualización, no antes.** El escenario de `Traveler` decidía el hueco en una microtarea, y
  React no siempre monta la página nueva de una vez: la captura salía con el viajero «sin hueco» (invisible) y la pantalla
  desaparecía al abrir un documental. Ahora espera a `updateCallbackDone` de la transición en curso, justo antes de la
  captura.
- **El destino tiene que montarse en el commit de la navegación.** En «siguiente», la ventana dependía de un booleano del
  layout; la ficha siguiente es el mismo componente y también la pintaba durante el commit (con prioridad 2), así que la
  pantalla no iba a la portada hasta que un `useEffect` reseteaba el booleano, ya fuera de la transición. Se guarda qué
  ficha inicia el acoplamiento. Y se precargan las fichas (`router.prefetch`), como pide la guía de Next.
- **Un marco que intercepta enlaces puede romper una coreografía.** `SiteFrame` navega en fase de captura en cuanto se
  pulsa un `<a href="/sitios/…">`, antes del `onClick` del enlace: el tiempo 1 de «siguiente» no llegaba a verse. De ahí
  `data-navigate="manual"`.
- **El texto vuela por encima.** Los viajeros van con `z-index: 120` (sobre los fijos, 100) y el titular que aterriza
  sobre su vídeo quedaba tapado: `SharedText` va con 130.
- **`live` frente a `crossfade`**: para vídeo, ocultar la captura vieja y dejar la nueva en directo da un único vídeo que
  cambia de caja; con fundido se ven dos vídeos desfasados.
- **React descarta pares fuera de pantalla**: el título de una tarjeta a 974 px (viewport de 906) no formó pareja; al
  filtrar, las tarjetas fuera de pantalla reciben un grupo de 0 ms.
- **Comprobaciones que se saltaban archivos.** La regla de nombres de props del catálogo partía cada archivo por `\n` y
  exigía que la línea acabara en `;`: en los archivos con CRLF (141 en la carpeta de trabajo) no se aplicaba nunca. Al
  arreglarlo apareció `Modal size="full"`, que la regla ahora admite.
- **Cómo probar transiciones.** El Chrome de la extensión congela `requestAnimationFrame` entre capturas y puede tener el
  viewport fijado: sirve para el estado final, no para el vuelo. Con **Playwright** (Chromium sin interfaz, 1440×900 y
  390 px) sí: se ralentizan las animaciones de la transición (`playbackRate = 0.1` en `document.getAnimations()` mientras
  `document.activeViewTransition`), se capturan fotogramas a mitad de vuelo y se lee el estilo calculado de
  `::view-transition-group(…)` / `-new(…)`. Una coreografía con temporizadores reales (dos tiempos) se prueba a velocidad
  normal, capturando en varios instantes y registrando cada `startViewTransition` y su `updateCallbackDone`. Desde esta
  ronda hay un MCP de Playwright en la configuración de usuario para las próximas sesiones.

## 6. Biblioteca de vídeo

Mismo criterio que las fotos (`images:fetch`): Wikimedia Commons, licencias CC0, dominio público o CC BY (sin SA, ND ni NC),
atribución en `lib/sites/video-credits.json` y en `/creditos`, nada en el paquete npm.

- **Por qué lista curada y no búsqueda automática.** En Commons no hay vídeos de Pexels ni de Unsplash (sí fotos), y la
  búsqueda trae sobre todo timelapses de satélite, ruedas de prensa y tutoriales. El script tiene `--buscar "<texto>"` para
  encontrar candidatos aptos y `--hojas` para generar hojas de contacto (12 fotogramas a lo largo de cada original) y
  elegir el tramo a mano. Se descartaron tres por la hoja: un plano casi fijo de una tortuga en la arena, una cámara de
  surf sumergida y temblorosa, y un vuelo de dron con el HUD (mapa y brújula) incrustado.
- **Proceso.** `ffmpeg` (en el PATH) lee por HTTP el derivado 1080p VP9 que Commons genera de cada vídeo, saltando al tramo
  (`-ss`): no baja originales 4K de varios minutos. Tramo de 7–12 s, 1280 px, 30 fps, sin audio, H.264 CRF 27 con tope de
  2 Mb/s, `faststart` y fundido de 0,4 s al principio y al final (para el bucle). Póster `.jpg` del tramo.
- **Resultado:** 13 clips en 5 temas (océano 4, costa 3, naturaleza 2, ciudad 3, cielo 1), 20,6 MB en total, ninguno por
  encima de 2,7 MB. Sin el tope de bitrate, el agua y el oleaje llegaban a 7–8 MB por clip.
- Uso: `import { video, videos } from "@/lib/sites/videos"` → `<video src={v.src} poster={v.posterSrc} aria-label={v.alt} muted loop playsInline autoPlay />`.

## 7. Pendiente

- **Verificar fuera de Chromium**: Safari 18.2+ y Firefox (tipos y `view-transition-class`), y un móvil real.
- **`npm run build`** de esta rama, cuando no haya un `next dev` en marcha sobre la misma carpeta.
- **Rendimiento con vídeo**: Travesía monta siete `<video>` apilados en la pantalla (uno activo, el resto con
  `preload="metadata"`). Medir con Lighthouse y, si pesa, montar solo el activo y el siguiente.
- **Patrones de §2 sin pieza todavía**: ventana recortada en polígono que se abre (Studio Foundry), telón de bloques de
  marca (Monogrid: parecido a `kind="pixelate"`, pero en el color de la marca y con rejilla grande), telón con monograma
  (Pier Gorelli), borde abombado en la expansión (Ciel Rose: necesita WebGL o un filtro SVG), tarjetas que se apilan en
  abanico (Creative Reference Library).
- **Transiciones entre documentos** (`@view-transition { navigation: auto }`) para quien use el kit sin App Router.
- **`Traveler` con WebGL**: el objeto 3D de `ObjectStage` o un `GradientField` que persistan entre rutas (G. Colombel).
