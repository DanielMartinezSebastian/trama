# Ronda 6: transiciones entre rutas con elementos que no desaparecen (20-10-2026)

> Objetivo: atraer miradas con la navegación. No basta con animar la página entera (eso ya lo hacía `PageTransition`):
> las webs que más llaman la atención mantienen algo en pantalla entre una ruta y otra (la imagen de un proyecto que crece
> hasta ser la portada del caso, un reproductor que se encoge a una esquina, la marca que pasa del titular a la cabecera).
> Esta ronda investiga cómo se hace, lo lleva al kit con la View Transitions API y lo enseña en una demo: **Travesía**.

## 0. Conclusiones

1. **Lo que faltaba no era otra animación de página, sino continuidad.** El kit ya tenía 11 animaciones de ventana
   (`PageTransition`) y el morph de un par (`SharedTransition`). Faltaba un elemento que **sea el mismo** en todas las
   rutas y cambie de caja: ahora es `Traveler` (+ `TravelStage`, `TravelSlot`).
2. **El App Router lo hace mejor que una web multipágina.** En multipágina el elemento se destruye y se vuelve a crear:
   la demo «Video Zoom» de Chrome guarda `currentTime` en `pageswap` y lo restaura en `pagereveal` (se nota el salto). En
   una SPA el nodo vive en el layout: el vídeo no se corta y el navegador anima su caja con la imagen **en directo**.
3. **Las dos SOTD de transiciones revisadas no usan la API.** FORMAT (Obys) y Belgrade Arbor no tienen ningún
   `view-transition-name` propio; hacen sus transiciones con GSAP y capas fijas. La API da hoy lo mismo sin librería, y
   con mejor rendimiento (las capturas las compone el navegador).
4. **Dos reglas de React que condicionan el diseño:** un par compartido cuyo elemento de salida está fuera del viewport no
   se anima (React lo descarta), y un boundary que no cambia se «cancela». Por eso el viajero no es un boundary de React.
5. **Hacía falta vídeo de verdad.** La continuidad se aprecia sobre todo con algo en movimiento. Se añade una biblioteca de
   vídeo libre (`npm run videos:fetch`), con el mismo criterio que las fotos.

## 1. Fuentes y fiabilidad

| Fuente | Qué aportó | Fiabilidad |
|---|---|---|
| [Awwwards · Transitions](https://www.awwwards.com/websites/transitions/) (leída el 20-10-2026) | Las dos SOTD más recientes de la categoría: FORMAT (19-10) y Belgrade Arbor (17-10) | Alta |
| [FORMAT](https://format.obys.agency/) (Obys × DES) | Ficha de Awwwards: GSAP + Matter.js, nota de desarrollo 8,8 en animaciones. Inspección en Chrome: una sola página, sin `view-transition-name`; capas fijas para el logo, la navegación y el «splash» | Alta (ficha), media (inspección a 392 px: la web es solo de escritorio) |
| [Belgrade Arbor](https://belgradearbor.rs/en) | Inspección en Chrome: Next.js con Turbopack y Lenis, sin `view-transition-name`; un telón de color fijo (`bg-pine-green`, `inset-0`) que crece en `scaleY` al navegar y una cabecera fija que no se mueve | Media: se vio el arranque del telón; la navegación completa no se pudo observar |
| [view-transitions.chrome.dev](https://view-transitions.chrome.dev/) (Bramus, Chrome) | Catálogo de demos y código: «Video Zoom» (transferencia de estado en MPA), «Profiles» (lista → detalle), «Cards» (`match-element`), «Circle» (revelado circular), «Off the Beaten Path» (elementos en secuencia) | Alta: se leyó el código |
| Guía de Next 16 `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` | Patrones oficiales: morph de un par, revelado de `Suspense`, dirección por tipos, fundido en la misma ruta, `default="none"` | Alta |

**Lo que no se pudo ver.** El Chrome de pruebas tiene el viewport fijado a 392 px (aunque la ventana mida 1920), así que
las webs solo de escritorio no se ven bien, y la navegación de Belgrade Arbor no llegó a completarse en la prueba.
Los patrones de §2 marcados «conocido» vienen de webs premiadas de años anteriores, no de esta inspección.

## 2. Patrones de continuidad entre rutas

| Patrón | Dónde | En Trama |
|---|---|---|
| Miniatura del listado → portada del caso (crece y se recoloca) | Conocido (portfolios de agencia); guía de Next, paso 1 | `SharedTransition fit="cover"` |
| Elemento vivo que cambia de tamaño entre rutas (reproductor, lienzo WebGL) | Chrome «Video Zoom» (en MPA, con salto) | **`Traveler`** (nuevo) |
| La marca: titular gigante en la portada → logo de la cabecera | Conocido | `Traveler` con dos huecos y `priority` |
| Mini reproductor que se acopla en una esquina y vuelve a pantalla completa | Conocido (plataformas de vídeo) | `TravelSlot` con `position: fixed` + otro hueco en `startTransition` |
| Vídeo dentro de una píldora en mitad de un titular | Conocido (tendencia editorial) | `TravelSlot as="span"` |
| Tarjetas que se reordenan al filtrar deslizándose a su sitio | Chrome «Cards» | `SharedTransition layout` |
| Telón de color que tapa y destapa la página | Belgrade Arbor | Ya existía: `PageTransition kind="wipe"` / `stack` |
| Cabecera que no se mueve mientras cambia todo | Belgrade Arbor, FORMAT, guía de Next | Ya existía: `PageTransitionPersist` |

## 3. Qué se construyó

- **`Traveler`, `TravelStage`, `TravelSlot`, `useTraveler`** (`components/ui/Traveler.tsx`, CSS en
  `ui-view-transitions.css`). Guía de uso en [05-transiciones-de-pagina.md](./05-transiciones-de-pagina.md#elementos-que-viajan-entre-rutas-traveler).
  Ficha en `/componentes` («Elemento que viaja entre rutas») con una mini página de cuatro huecos.
- **`SharedTransition`**: `fit="cover"` (las dos capturas recortan si cambia la proporción) y `layout` (también se desliza
  al reordenar o filtrar en la misma vista, con fundido al entrar y salir).
- **`data-transition` en los enlaces de las webs de `/sitios`** (`components/sites/shared.tsx`): el marco que intercepta
  los `<a>` pasa esos tipos a `router.push(href, { transitionTypes })`. Así un enlace normal elige `nav-forward`/`nav-back`.
- **Biblioteca de vídeo** (`npm run videos:fetch`, `scripts/fetch-videos.mts`, `lib/sites/videos.ts`, créditos en
  `/creditos`): ver §5.
- **Demo Travesía** (`/sitios/travesia`, `components/sites/travesia/`): productora ficticia de documentales de mar, cinco
  rutas más seis fichas. El tráiler vive en el marco y viaja por cinco huecos (portada a sangre, ficha destacada a dos
  columnas del listado, mini reproductor fijo, retrato dentro de un `sticky`, píldora en el titular de contacto) más el
  modo cine dentro de la ficha. Su contador suma el tiempo reproducido desde que entras: **no se reinicia al navegar**, que
  es la prueba visible de que es el mismo nodo. La marca pasa del titular a la cabecera; póster y título de cada tarjeta se
  convierten en la cabecera de su ficha; el filtro desliza las tarjetas; «Anterior/Siguiente» llevan `nav-back`/`nav-forward`.

## 4. Lecciones técnicas

- **Dónde escribir para que entre en la captura nueva.** Los efectos de layout del commit de la navegación corren dentro
  del callback de `document.startViewTransition`. Una escritura directa en el DOM ahí (o en una microtarea lanzada desde
  ahí) llega antes de que el navegador capture el estado nuevo. Un `setState` no: re-renderiza después.
- **Decidir una sola vez.** En el mismo commit se desmonta el hueco viejo y se monta el nuevo: si se decide en cada
  evento, el viajero pasa un instante por «sin hueco» y la transición sale como `leave` + `arrive`. Se encola una microtarea.
- **`live` frente a `crossfade`.** Para algo que se mueve (vídeo), ocultar la captura vieja y dejar la nueva sin animación
  propia da un único vídeo que cambia de caja. Con fundido, se ven dos vídeos desfasados medio segundo.
- **La clase del grupo se lee del estado nuevo.** Por eso el componente puede cambiar `view-transition-class` según el caso
  (`move`, `arrive`, `leave`) justo antes de la captura.
- **React descarta pares fuera de pantalla.** Comprobado en Chrome: el título de una tarjeta a 974 px (viewport de 906) no
  formó pareja con el `<h1>` de la ficha; al desplazar la lista para que se viera, sí. Al filtrar, las tarjetas fuera de
  pantalla reciben un grupo de 0 ms.
- **Un boundary de React «sin cambios» se cancela y se oculta.** Igual que en `PageTransitionPersist` (0.6.2): el viajero
  lleva el nombre en línea y no está envuelto en `<ViewTransition>`. El que monta cada hueco (todo a `none`) solo sirve
  para que el cambio sea una View Transition.
- **Capas.** El grupo de los fijos de `PageTransitionPersist` va en `z-index: 100`; el del viaje, en 120, para poder volar
  hasta una cabecera fija sin pasar por debajo.
- **Probar en el Chrome de la extensión.** Sin fotogramas entre capturas, `requestAnimationFrame` se congela (las medidas
  de un hueco `sticky` llegan tarde) y los viajes de 640 ms terminan antes de la siguiente captura. Para verlos a mitad:
  `document.getAnimations()` durante `document.activeViewTransition` y `playbackRate = 0.08`. Para escritorio, la web en un
  `<iframe>` de 1280×800 del mismo origen escalado al 30 %.

## 5. Biblioteca de vídeo

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

## 6. Pendiente

- **Verificar fuera de Chrome**: Safari 18.2+ y Firefox (tipos y `view-transition-class`), y móvil real. En Chrome se
  verificó en 392 px y en 1280 px (iframe): portada, listado, ficha, modo cine (y Escape), productora, contacto y filtro.
- **`npm run build`** no se ejecutó en esta ronda: el `next dev` del usuario estaba en marcha (comparten `.next/`).
- **Rendimiento con vídeo**: Lighthouse de `/sitios/travesia` (dos `<video>` a la vez en la ficha: el tráiler y
  la cabecera; en la portada, solo el tráiler). Valorar `preload="metadata"` en los vídeos de las fichas.
- **Transiciones entre documentos** (`@view-transition { navigation: auto }`) para quien use el kit sin App Router: hoy no
  hay pieza; sería CSS y un `pageswap`/`pagereveal` para transferir el estado de un vídeo.
- **`Traveler` en más demos**: el lienzo WebGL de `ObjectStage` o un `GradientField` que viajen entre rutas (estudio,
  Volt) en lugar de reiniciarse.
- Ampliar la biblioteca de vídeo con temas que piden las demos (gente, interiores, producto) mirando las hojas antes.
