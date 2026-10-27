# Transiciones de página y de elementos

Trama anima la navegación con la [View Transitions API](https://developer.mozilla.org/es/docs/Web/API/View_Transition_API)
del navegador, a través del `<ViewTransition>` de React. Las animaciones son CSS puro con los tokens del tema y la
estética del kit: barrido de color, línea de escaneo, pila de barras, persianas, disolución por píxeles, encendido de
CRT, glitch, iris o escritura de terminal. Hay cinco piezas:

| Componente | Qué anima |
|---|---|
| `PageTransition` | **La ventana entera** al llegar a la página: fondos fijos, pie, márgenes… todo salvo lo que envuelvas en `PageTransitionPersist` (la cabecera). Es la de siempre para una web. |
| `ElementTransition` | **Un elemento suelto** (una tarjeta, un panel, el contenido de una pestaña): la animación ocupa solo su caja. |
| `SharedTransition` | **Un elemento compartido** entre dos vistas (miniatura → imagen de la ficha): el navegador lo transforma de una caja a la otra. |
| `SharedText` | **Un texto que viaja palabra a palabra** entre dos vistas (la marca pequeña de la cabecera → el titular gigante de otra página): cada palabra vuela a su sitio, escalonada. |
| `Traveler` (+ `TravelStage`, `TravelSlot`) | **Un elemento que viaja entre rutas sin desaparecer** (un reproductor que se encoge a una esquina, la marca que pasa del titular a la cabecera): es el mismo nodo, vivo, que cambia de caja en cada página. |

```tsx
import PageTransition, { PageTransitionPersist, NAV_FORWARD, NAV_BACK, pageTransitionType } from "trama-ui/PageTransition";
import ElementTransition, { SharedTransition } from "trama-ui/ElementTransition";
import SharedText from "trama-ui/SharedText";
import Traveler, { TravelStage, TravelSlot, useTraveler } from "trama-ui/Traveler";
// o: import { PageTransition, PageTransitionPersist, ElementTransition, SharedTransition, SharedText, Traveler, TravelStage, TravelSlot } from "trama-ui";
// en este repo o con kit:export: "@/components/ui/PageTransition", "@/components/ui/ElementTransition"
```

El CSS va dentro de `trama-ui/styles.css` (`kit.css` importa `ui-view-transitions.css`): no hay que importar nada más.

> **Cambio en 0.5.0.** En 0.4.0 (no publicada) `PageTransition` envolvía la página en un `<ViewTransition>` y la
> animación ocupaba solo la caja del `<main>`: los fondos fijos, el pie y los márgenes cambiaban de golpe. Ahora anima la
> raíz (el viewport entero). La animación sobre una caja sigue existiendo como `ElementTransition`, con las mismas props.

## Ejemplo completo en Next 16 (App Router)

**`app/layout.tsx`**: la cabecera, envuelta en `PageTransitionPersist`, y el CSS del kit. Nada de `PageTransition` aquí.

```tsx
// app/layout.tsx
import Link from "next/link";
import { PageTransitionPersist } from "trama-ui/PageTransition";
import "trama-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <PageTransitionPersist name="cabecera">
          <header className="cabecera">
            <Link href="/">Inicio</Link>
            <Link href="/proyectos">Proyectos</Link>
            <Link href="/contacto">Contacto</Link>
          </header>
        </PageTransitionPersist>
        {children}
        <footer>…</footer>
      </body>
    </html>
  );
}
```

**Cada `app/**/page.tsx`**: el contenido de la página dentro de `PageTransition`. La animación la decide la página de
**destino** (la que se monta).

```tsx
// app/proyectos/page.tsx
import PageTransition from "trama-ui/PageTransition";

export default function Proyectos() {
  return (
    <PageTransition kind="wipe" pace="fast">
      <main>…</main>
    </PageTransition>
  );
}
```

Eso es todo: al pulsar un `<Link>` se anima la ventana entera (pie, fondos fijos y márgenes incluidos) y la cabecera se
queda quieta encima. `PageTransition` no lleva `"use client"` (vale en una página de servidor) y no añade nodos al DOM.

Si prefieres una sola línea para una sección entera, ponlo en un **`template.tsx`** en lugar de en cada página. Un
template se vuelve a montar cuando cambia *su* segmento, no los de más abajo: `app/template.tsx` anima `/` → `/blog`,
pero no `/blog/a` → `/blog/b` (para eso, otro `template.tsx` en `app/blog/` o el componente en la página).

```tsx
// app/template.tsx
import PageTransition from "trama-ui/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition kind="fade">{children}</PageTransition>;
}
```

**Nunca en un `layout.tsx`**: el layout persiste entre navegaciones, no se vuelve a montar. Tampoco cambian de página
los `searchParams` (`/tienda?p=2`): no remontan ni la página ni el template, así que no animan.

## Cómo funciona

- En el App Router de Next 16 cada navegación es una transición de React. Si en ella se monta un `<ViewTransition>`,
  React la envuelve en `document.startViewTransition`. `PageTransition` monta uno «vacío» (todas sus clases a `none`:
  no captura nada por su cuenta), solo para que la navegación sea una View Transition.
- El navegador captura la **raíz** (`::view-transition-old(root)` y `::view-transition-new(root)`: el viewport entero)
  salvo los elementos con su propio `view-transition-name`, que se capturan y pintan aparte, encima. Eso es lo que hace
  `PageTransitionPersist`.
- **Por qué hace falta algo más.** Cuando todo lo que cambia en un commit está dentro de boundaries `<ViewTransition>`,
  React «cancela» la animación de la raíz: pone `view-transition-name: none` en línea en `<html>` (solo si ese estilo
  en línea está vacío) y oculta su grupo. Esa comprobación ocurre al final del commit, dentro del callback de la
  transición, después de los efectos de layout. `PageTransition` lleva una parte cliente mínima
  que, en un efecto de layout **al montarse** la página nueva, arma `<html>`:
  1. lee la transición en curso (`document.activeViewTransition`, o la que registra React) y sus tipos;
  2. pone en `<html>`, en línea, `view-transition-name: root` (así React ya no la cancela) y un
     `view-transition-class` con la animación, el ritmo y el tono (`ui-vt ui-vt-root ui-vt-wipe-left ui-vt--fast
     ui-vt--acc`), más `data-ui-vt="wipe-left"`;
  3. cuando esa transición termina (`finished`), deja `<html>` como estaba.
- Mientras dura la animación (240–560 ms) las capturas no son interactivas, pero los clics pasan a la página nueva
  (`::view-transition { pointer-events: none }`).

## Animaciones

`kind` elige la familia; `slide`, `wipe`, `scan` y `stack` usan además `direction` (hacia dónde se mueve el contenido,
la banda, la línea o la pila). Sin `direction`, `scan` baja (`down`) y el resto va a la izquierda (`left`); `nav-back`
invierte la que toque. Todas cubren la ventana entera con `PageTransition` y la caja del elemento con
`ElementTransition`.

| `kind` | Qué hace |
|---|---|
| `fade` | Fundido cruzado; la salida es más rápida que la entrada. Por defecto. |
| `slide` | Desplazamiento corto (48 px en horizontal, 32 px en vertical) con fundido. |
| `wipe` | Una banda del color `tone` barre la ventana: la vieja se recorta delante y la nueva aparece detrás. |
| `scan` | Una línea brillante del color `tone` (con halo suave) recorre la ventana una vez: detrás ya está la nueva, delante sigue la vieja. Sin apagado ni encendido CRT. `down` (por defecto) de arriba abajo, `up` de abajo arriba; `left`/`right` barren en horizontal con la línea en vertical. |
| `stack` | Una pila de 5 barras de grandes a pequeñas (`--acc`, `--acc2` y su mezcla, separadas por el fondo) entra escalonada tapando la vieja; con la nueva ya debajo, las barras se comprimen hasta juntarse y salen todas por el lado de `direction`. Dura 1,6 veces `pace`. |
| `blinds` | Persianas horizontales de 28 px que se abren sobre la página vieja. |
| `stairs` | Cinco columnas que bajan en escalera desde la derecha, cada una con retraso, como en K72 (docs/50 §3.9). Luce más con `pace="slow"`. |
| `pixelate` | Disolución por bloques de 12 px en tramado ordenado 2×2: cuatro pasos, como un dither de pixel art. |
| `scanline` | CRT: la vieja se deshace en líneas de barrido y la nueva se enciende desde una línea horizontal. |
| `glitch` | La nueva entra por franjas que crecen, con saltos laterales y separación RGB (`--acc` / `--acc2`). |
| `iris` | Un círculo se abre desde el centro de la pantalla con un aro del color `tone`. |
| `terminal` | La vieja se apaga y la nueva se escribe por líneas (12 pasos) tras un cursor de bloque. |
| `none` | Sin animación: la ventana cambia de golpe (las navegaciones con tipo siguen animando, ver abajo). |

Otras props (iguales en `PageTransition` y `ElementTransition`): `pace` (`fast` ≈ 240 ms · `normal` ≈ 380 ms · `slow`
≈ 560 ms), `tone` (`acc` · `acc2` · `fg`: color de la banda, el aro, el cursor y la separación RGB) y `types`.

## Una animación por navegación

Next etiqueta una navegación con `transitionTypes` en `<Link>` (o en `router.push(url, { transitionTypes })`), y el
componente de la página de destino elige la animación según esos tipos, por este orden:

| Tipo | Animación |
|---|---|
| los de `types` | lo que digas: `types={{ "abrir-ficha": "iris" }}` |
| `trama-<animación>` (`pageTransitionType("glitch")`) | esa animación, sea cual sea `kind`: `trama-iris`, `trama-slide-up`, `trama-scan-up`, `trama-stack`… |
| `nav-back` (`NAV_BACK`) | `kind` con la dirección contraria (`slide`/`wipe`/`scan`/`stack`); el resto, igual |
| `nav-forward` (`NAV_FORWARD`) o ninguno | `kind` con `direction` |

```tsx
import Link from "next/link";
import { NAV_BACK, NAV_FORWARD, pageTransitionType } from "trama-ui/PageTransition";

<Link href="/docs/2" transitionTypes={[NAV_FORWARD]}>Siguiente →</Link>
<Link href="/docs/1" transitionTypes={[NAV_BACK]}>← Anterior</Link>
<Link href="/contacto" transitionTypes={[pageTransitionType("terminal")]}>Contacto</Link>
```

Con `PageTransition` se elige **una** animación aunque la navegación lleve varios tipos (gana el primero según la tabla).
`pickTransitionAnimation(tipos, { kind, direction, types })` es esa elección como función pura, por si la necesitas.

El kit no importa `next/link`. Con otro router, marca la transición a mano dentro de `startTransition`:

```tsx
import { startTransition } from "react";
import { markPageTransition } from "trama-ui/PageTransition";

startTransition(() => {
  markPageTransition("glitch"); // = addTransitionType("trama-glitch"); también acepta NAV_FORWARD o tu tipo
  navigate("/contacto");
});
```

Los botones atrás/adelante del navegador no llevan tipo: usan `kind`.

## Cabecera y otros elementos fijos

Todo lo que deba **quedarse quieto** mientras la ventana transiciona (cabecera, barra de navegación, índice lateral,
reproductor, botón flotante…) va envuelto en `PageTransitionPersist`, con un `name` distinto por elemento. Sin él, forma
parte de la captura de la raíz y se anima con el resto.

```tsx
<PageTransitionPersist name="cabecera">
  <header>…</header>
</PageTransitionPersist>
```

- Si el hijo es **un elemento HTML** (`<header>`, `<nav>`, `<aside>`…), `PageTransitionPersist` le pone
  `view-transition-name` y `view-transition-class: ui-vt-persist` en su `style`, de forma permanente, y **nada más**.
  Así funciona también en un **layout**, que React no vuelve a tocar en la navegación.
- **No lo envuelve en un `<ViewTransition>` de React, a propósito** (0.6.2). Un boundary que no cambia en un commit se
  considera «cancelable»: React lo restaura y oculta su grupo con una animación de opacidad 0. Con el nombre ya puesto
  en el elemento, el navegador sigue sin pintarlo en el DOM real mientras dura la transición y su grupo está oculto:
  la cabecera **desaparecía hasta que terminaba**, en toda navegación que no cambiaba nada dentro de ella (en una web
  con menú, las que no cambian el enlace activo: Home ↔ Contacto, legales, 404…). Sin boundary, React no la ve y el
  navegador la pinta en su grupo, quieta.
- Si el hijo es un componente o varios nodos, no hay dónde poner el nombre en línea y solo actúa el `<ViewTransition>`
  de React: no la deja quieta en un layout. **Pásale siempre un solo elemento HTML.**
- Cada `name`, único en la página: dos elementos con el mismo nombre a la vez hacen que el navegador cancele la
  transición. Se captura aparte, no se mueve ni se funde y queda por encima (el enlace activo cambia sin animar).

## Elementos sueltos: `ElementTransition`

Mismas props que `PageTransition`, pero la animación ocupa la caja de lo que envuelve. Anima cuando se **monta o
desmonta dentro de una transición de React** (`startTransition`, una navegación, `<Suspense>`); para cambiar de
contenido, cambia su `key`.

```tsx
"use client";
import { startTransition, useState } from "react";
import ElementTransition from "trama-ui/ElementTransition";
import { markPageTransition } from "trama-ui/PageTransition";

const [tab, setTab] = useState(0);
const go = (i: number) => startTransition(() => { markPageTransition(i > tab ? "nav-forward" : "nav-back"); setTab(i); });

<ElementTransition key={tab} kind="slide">
  <section>{contenido[tab]}</section>
</ElementTransition>
```

Dentro de una página con `PageTransition`, un `ElementTransition` que se monta en la misma navegación anima su caja
aparte, por encima de la animación de la ventana.

## Elementos compartidos: `SharedTransition`

Para que un elemento «viaje» de una vista a otra (la miniatura de un listado a la imagen grande de la ficha), envuélvelo
en las dos páginas con el mismo `name`. Si en una transición desaparece uno y aparece el otro, el navegador los
transforma de una caja a la otra (posición, tamaño y fundido cruzado), por encima de la animación de página. `pace`
ajusta la duración.

```tsx
// app/proyectos/page.tsx (listado)
<SharedTransition name={`foto-${p.id}`}>
  <img src={p.thumb} alt="" />
</SharedTransition>

// app/proyectos/[id]/page.tsx (ficha)
<SharedTransition name={`foto-${p.id}`}>
  <img src={p.foto} alt={p.titulo} />
</SharedTransition>
```

El `name` tiene que ser único en cada página (una sola miniatura con `foto-3` a la vez).

- **`fit="cover"`** si las dos cajas tienen distinta proporción (miniatura 4:5 → cabecera apaisada): las dos imágenes del
  morph se recortan en vez de deformarse o asomar por debajo. Para texto, deja `auto`.
- **`layout`**: además del morph entre vistas, anima los cambios de sitio **dentro de la misma vista** (reordenar,
  filtrar, cambiar de columnas dentro de `startTransition`): se desliza a su caja nueva y, si entra o sale, se funde.
- **Fuera de pantalla no hay pareja.** React descarta el par si el elemento de la vista de salida estaba fuera del
  viewport (una tarjeta por debajo del pliegue; lo mismo al filtrar): ese elemento cambia sin animar. Es a propósito
  (no anima lo que no se ve), pero en móvil pasa a menudo: no cuentes con que el título de una tarjeta baja siempre viaje.
- **`delay`** (ms, en pasos de 40 hasta 800): coreografía. En las transiciones premiadas nada se mueve a la vez (docs/14
  §2): primero la imagen, después el título, al final el resto. `Traveler` y `SharedText` aceptan lo mismo.

## Texto que viaja palabra a palabra: `SharedText`

El mismo texto en dos vistas, con el mismo `name`: cada palabra es un elemento compartido propio (`${name}-0`,
`${name}-1`…) y vuela de su caja vieja a la nueva con un retraso escalonado (`stagger`). Es el gesto de Mario Roudil o Cyd
Stumpel (docs/14): el nombre pequeño de una esquina se convierte en el titular gigante de la página siguiente.

```tsx
import SharedText from "trama-ui/SharedText";

// en la cabecera (layout) de todas las páginas menos la productora
<SharedText name="marca" text="Travesía Documental" />
// en la página de la productora, como titular
<h1 className="gigante"><SharedText name="marca" text="Travesía Documental" stagger={70} /></h1>
```

- El tamaño, el sitio y el color los pone el CSS de cada vista; cada palabra lleva `ui-stext__w--<n>` (desde 0) para darle
  estilo propio (la segunda en cursiva y en `--acc`, por ejemplo).
- **El mismo `name` no puede estar dos veces en una página**: si la marca va en la cabecera y en el titular, quítala de la
  cabecera en esa página (dos `view-transition-name` iguales cancelan la transición entera).
- Las palabras vuelan con `z-index: 130`, por encima de la página, de los fijos y de un `Traveler`: un titular no queda
  tapado por el vídeo sobre el que aterriza.
- A mitad de vuelo, la palabra que crece se ve algo borrosa (es su captura pequeña escalada) y queda nítida al llegar.
  Es lo esperable en un morph de texto.

## Elementos que viajan entre rutas: `Traveler`

`SharedTransition` une **dos elementos distintos** (la miniatura se desmonta, la imagen de la ficha se monta). Un
`Traveler` es **el mismo elemento** en todas las páginas: vive en el layout, no se desmonta al navegar, y cada página dice
con un `TravelSlot` qué caja ocupa en ella. Al cambiar de ruta se recoloca sobre el hueco nuevo en el mismo commit y el
navegador anima su caja (posición, tamaño y proporción) con el contenido **en directo**: un vídeo no se corta, un lienzo
no se reinicia, un estado no se pierde.

Es lo que una web multipágina tiene que imitar guardando el estado: la demo «Video Zoom» de Chrome
([view-transitions.chrome.dev](https://view-transitions.chrome.dev/)) guarda `currentTime` en `pageswap` y lo restaura en
`pagereveal`, con un pequeño salto. Con el App Router no hace falta: el nodo es el mismo.

```tsx
// app/layout.tsx (o el Shell de la web): el escenario envuelve a los viajeros Y a la página
import Traveler, { TravelStage, TravelSlot } from "trama-ui/Traveler";

<TravelStage>
  <header className="cabecera">
    <TravelSlot id="marca" at="cabecera" className="cabecera__marca" />   {/* prioridad 0 */}
  </header>
  <Traveler id="marca" fit="stretch" blend="crossfade"><Logo /></Traveler>
  <Traveler id="reel"><video src="/video/oceano/01-arrecife.mp4" muted loop autoPlay playsInline /></Traveler>
  {children}
</TravelStage>

// app/page.tsx (portada): la marca a todo el ancho y el vídeo a sangre
<TravelSlot id="marca" at="portada" priority={1} className="hero__marca" />
<TravelSlot id="reel" at="portada" className="hero__video" />

// app/proyectos/[id]/page.tsx: el vídeo, en una esquina
<TravelSlot id="reel" at="mini" className="mini" />
/* .mini { position: fixed; right: 16px; bottom: 16px; width: 320px; aspect-ratio: 16 / 9 } */
```

- **El hueco manda.** Tamaño y sitio son los del `TravelSlot` (un elemento vacío al que das ancho, `aspect-ratio`,
  `position: fixed`…). Si el hueco o un antecesor es `fixed`, el viajero pasa a `fixed`; si hay un `sticky`, lo sigue al
  hacer scroll; en el resto, va en `absolute` dentro del escenario y hace scroll con la página sin escuchar el scroll.
  `as="span"` sirve para un hueco dentro de un texto (un titular con el vídeo en una píldora). Lo que pongas dentro del
  hueco (un póster) se ve hasta que llega el viajero y luego queda oculto.
- **El viajero cambia de aspecto por CSS**: lleva `data-at="<at del hueco>"` (`.reel[data-at="mini"] .controles { … }`).
  En React, `useTraveler(id)` da ese nombre y `onMove(at)` avisa al cambiar (para pausar un vídeo, por ejemplo). En una
  página sin hueco para él queda con `data-away`: invisible e inerte, pero vivo.
- **`blend`**: `live` (por defecto) muestra solo el estado nuevo, en directo, estirándose de caja a caja (vídeo, lienzos:
  no se duplica ni parpadea). `crossfade` funde la captura vieja con la nueva: mejor si el contenido cambia de forma.
- **`fit`**: `cover` recorta las capturas si cambia la proporción (fotos, vídeo); `stretch` las estira (texto o SVG con la
  misma proporción, como una marca que solo cambia de escala).
- **`pace`**: 420 / 640 / 900 ms, con una curva lenta al principio y al final. Un viaje tiene que verse; por eso dura más
  que la transición de página, que puede ir a la vez (`PageTransition kind="fade"` funde el resto).
- **Varios huecos a la vez** (el de la cabecera, que está siempre, y el de la portada): gana el de mayor `priority`; a
  igualdad, el último montado.
- **Dentro de la misma página** (modo cine, ampliar una tarjeta): monta otro hueco dentro de `startTransition`, con otra
  `key` para que sea un hueco nuevo:
  `startTransition(() => setCine(true))` → `<TravelSlot key={cine ? "cine" : "mini"} id="reel" at={cine ? "cine" : "mini"} />`.
- **Capas**: durante el viaje el grupo va con `z-index: 120`, por encima de los fijos de `PageTransitionPersist` (100), así
  que puede volar hacia una cabecera fija. En reposo manda `--ui-travel-z` (30) en el viajero.

**Cómo funciona.** Los huecos se registran en efectos de layout, dentro del commit de la navegación. Con una View
Transition en curso, el escenario decide cuando esta termina de actualizar el DOM (`updateCallbackDone`), justo antes de
que el navegador capture el estado nuevo, y escribe `left`/`top`/`width`/`height` en el viajero. No basta con una
microtarea: React no siempre monta la página nueva de una vez (espera, por ejemplo, a que carguen sus imágenes), y
decidir antes dejaba al viajero sin hueco, invisible, en la captura. Sin transición en curso, decide en una microtarea. El viajero lleva `view-transition-name: ui-travel-<id>` en línea y **no** es un boundary de React (mismo motivo que
`PageTransitionPersist`: así React no lo cancela ni lo oculta). La clase del viaje depende del caso: `move` (de un hueco a
otro), `arrive` (aparece sin trayectoria: fundido con un leve zoom) o `leave` (la página no tiene hueco: se funde). Cada
`TravelSlot` monta un `<ViewTransition>` vacío para que el cambio sea una View Transition aunque la página no lleve
`PageTransition`.

**Trampas.**
- **Accesibilidad**: el viajero está en el DOM del layout, no donde se ve. Dale un nombre accesible propio (`aria-label`
  en el vídeo) y no metas en él contenido que deba leerse en el orden de la página.
- Un `id` repetido en dos escenarios a la vez (dos copias del mismo componente) da dos `view-transition-name` iguales y el
  navegador cancela la transición entera: usa `useId()` si el componente puede repetirse.
- Un hueco dentro de algo que se anima con `transform` al entrar (un `Reveal`) se mide a mitad de animación: deja los huecos
  fuera de esos envoltorios.
- Con `prefers-reduced-motion` cambia de sitio con un fundido de 120 ms, sin recorrer la pantalla.
- **La página de destino tiene que montarse en el commit de la navegación.** Si se queda cargando (sin precargar) o si su
  hueco aparece un render después, la transición ya capturó el estado nuevo y el viajero salta a su sitio al terminar.
  Precarga las rutas (`router.prefetch`, o `<Link>`) y no hagas depender un hueco de un estado que se resetea en un
  `useEffect` tras navegar. Caso real en Travesía: la ventana de «siguiente» dependía de un booleano del layout; la ficha
  siguiente (el mismo componente) también la pintaba durante el commit y la pantalla no iba a la portada. Se arregló
  guardando qué ficha inicia el acoplamiento.
- **Coreografía en dos tiempos** (encoger a una ventana y luego expandir a la página siguiente, como Ciel Rose): primero
  un hueco nuevo dentro de `startTransition`, y la navegación tras un temporizador algo más largo que el viaje. En las webs
  de `/sitios`, ese enlace lleva `data-navigate="manual"` para que el marco (`SiteFrame`) no navegue al instante.

Demo completa: **Travesía** (`/sitios/travesia`). La «pantalla» vive en el layout: en el índice reproduce el título que
señalas (y tiñe la página con `AmbientLight`); al abrirlo se expande a la portada mientras el título vuela con
`SharedText`; «Siguiente documental» la encoge a una ventana, cambia de película y la expande como portada nueva; en la
productora es un retrato dentro de un `sticky` y en contacto, una píldora dentro del titular.

## Tema

Los pseudo-elementos de la transición cuelgan de `<html>`, no del contenedor donde pones el tema: leen los tokens de
`:root`. Si defines `--bg`, `--acc`… en `:root`, no hay nada que hacer. Si tu tema vive en un contenedor (un `<div>`
con `style={tokensToStyle(…)}`), repite en `:root` al menos el acento y el fondo:

```css
:root { --acc: #ff3b3b; --acc2: #8a8a8a; --ui-vt-page: #000; }
```

`--ui-vt-page` (por defecto `--bg`) es el color de fondo de la página: queda debajo de la animación de la raíz y hace
opaca la página nueva en los efectos que la tapan (`wipe`, `scan`, `stack`, `blinds`, `stairs`, `pixelate`, `scanline`, `iris`,
`terminal`); en `stack`, además, es el color de los huecos entre barras.

## Accesibilidad y soporte

- **Reducir movimiento**: con `prefers-reduced-motion: reduce`, ninguna animación se mueve, recorta ni enmascara: las
  páginas se cruzan con un fundido de 120 ms, y los elementos compartidos, los textos y los viajeros no viajan (solo se
  funden); sin retrasos.
- **Sin destellos** (WCAG 2.3.1): `glitch` y `scanline` suben el brillo o desplazan como mucho una vez; lo que se muestra
  no se vuelve a ocultar y ninguna dura más de medio segundo.
- **Navegadores**: Chromium 125+, Safari 18.2+ y Firefox recientes (tipos de transición y `view-transition-class`). Sin
  la API, la página cambia sin animar. Sin `@property` (necesario para `wipe`, `scan`, `stack`, `blinds`, `pixelate`,
  `iris`), el efecto salta a mitad en vez de interpolar.
- **React**: `ViewTransition` está en el React que trae el App Router de Next y en React ≥ 19.3. En 19.0–19.2 estable
  (Pages Router, Vite…) no existe: los componentes devuelven sus hijos tal cual (`Traveler` sigue cambiando de caja, sin animar) y `markPageTransition` no hace
  nada. `pageTransitionsSupported` dice si este React puede animar.
- Sin transición en curso (primera carga, un commit que no es una transición), `PageTransition` no toca `<html>`.

## En la web de Trama

La portada, `/demos` y `/docs` usan `PageTransition kind="wipe" pace="fast"`: el barrido rojo del acento cruza la
ventana entera; en las docs, «Anterior» y «Siguiente» llevan `NAV_BACK` / `NAV_FORWARD` y el barrido cambia de
sentido. La cabecera (`components/site/SiteChrome.tsx`) y el índice lateral de las docs van en `PageTransitionPersist`.
En `/componentes`, «Transición de página» (anima la ventana del catálogo) y «Transición de elemento» (solo la caja)
montan una mini web con todas las animaciones.
