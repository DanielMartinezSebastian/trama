# Transiciones de página y de elementos

Trama anima la navegación con la [View Transitions API](https://developer.mozilla.org/es/docs/Web/API/View_Transition_API)
del navegador, a través del `<ViewTransition>` de React. Las animaciones son CSS puro con los tokens del tema y la
estética del kit: barrido de color, línea de escaneo, pila de barras, persianas, disolución por píxeles, encendido de
CRT, glitch, iris o escritura de terminal. Hay tres piezas:

| Componente | Qué anima |
|---|---|
| `PageTransition` | **La ventana entera** al llegar a la página: fondos fijos, pie, márgenes… todo salvo lo que envuelvas en `PageTransitionPersist` (la cabecera). Es la de siempre para una web. |
| `ElementTransition` | **Un elemento suelto** (una tarjeta, un panel, el contenido de una pestaña): la animación ocupa solo su caja. |
| `SharedTransition` | **Un elemento compartido** entre dos vistas (miniatura → imagen de la ficha): el navegador lo transforma de una caja a la otra. |

```tsx
import PageTransition, { PageTransitionPersist, NAV_FORWARD, NAV_BACK, pageTransitionType } from "trama-ui/PageTransition";
import ElementTransition, { SharedTransition } from "trama-ui/ElementTransition";
// o: import { PageTransition, PageTransitionPersist, ElementTransition, SharedTransition } from "trama-ui";
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

## Tema

Los pseudo-elementos de la transición cuelgan de `<html>`, no del contenedor donde pones el tema: leen los tokens de
`:root`. Si defines `--bg`, `--acc`… en `:root`, no hay nada que hacer. Si tu tema vive en un contenedor (un `<div>`
con `style={tokensToStyle(…)}`), repite en `:root` al menos el acento y el fondo:

```css
:root { --acc: #ff3b3b; --acc2: #8a8a8a; --ui-vt-page: #000; }
```

`--ui-vt-page` (por defecto `--bg`) es el color de fondo de la página: queda debajo de la animación de la raíz y hace
opaca la página nueva en los efectos que la tapan (`wipe`, `scan`, `stack`, `blinds`, `pixelate`, `scanline`, `iris`,
`terminal`); en `stack`, además, es el color de los huecos entre barras.

## Accesibilidad y soporte

- **Reducir movimiento**: con `prefers-reduced-motion: reduce`, ninguna animación se mueve, recorta ni enmascara: las
  páginas se cruzan con un fundido de 120 ms, y los elementos compartidos no viajan (solo se funden).
- **Sin destellos** (WCAG 2.3.1): `glitch` y `scanline` suben el brillo o desplazan como mucho una vez; lo que se muestra
  no se vuelve a ocultar y ninguna dura más de medio segundo.
- **Navegadores**: Chromium 125+, Safari 18.2+ y Firefox recientes (tipos de transición y `view-transition-class`). Sin
  la API, la página cambia sin animar. Sin `@property` (necesario para `wipe`, `scan`, `stack`, `blinds`, `pixelate`,
  `iris`), el efecto salta a mitad en vez de interpolar.
- **React**: `ViewTransition` está en el React que trae el App Router de Next y en React ≥ 19.3. En 19.0–19.2 estable
  (Pages Router, Vite…) no existe: los tres componentes devuelven sus hijos tal cual y `markPageTransition` no hace
  nada. `pageTransitionsSupported` dice si este React puede animar.
- Sin transición en curso (primera carga, un commit que no es una transición), `PageTransition` no toca `<html>`.

## En la web de Trama

La portada, `/demos` y `/docs` usan `PageTransition kind="wipe" pace="fast"`: el barrido rojo del acento cruza la
ventana entera; en las docs, «Anterior» y «Siguiente» llevan `NAV_BACK` / `NAV_FORWARD` y el barrido cambia de
sentido. La cabecera (`components/site/SiteChrome.tsx`) y el índice lateral de las docs van en `PageTransitionPersist`.
En `/componentes`, «Transición de página» (anima la ventana del catálogo) y «Transición de elemento» (solo la caja)
montan una mini web con todas las animaciones.
