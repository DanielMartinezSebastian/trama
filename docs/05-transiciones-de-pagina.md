# Transiciones de página

`PageTransition` anima el cambio de página al navegar: la página que sale y la que entra se animan con la
[View Transitions API](https://developer.mozilla.org/es/docs/Web/API/View_Transition_API) del navegador, a través del
`<ViewTransition>` de React. Las animaciones son CSS puro con los tokens del tema, con la estética del kit: barrido de
color, persianas, disolución por píxeles, encendido de CRT, glitch, iris o escritura de terminal.

```tsx
import PageTransition, { PageTransitionPersist, NAV_FORWARD, NAV_BACK, pageTransitionType } from "trama-ui/PageTransition";
// o: import { PageTransition, PageTransitionPersist } from "trama-ui";
// en este repo o con kit:export: "@/components/ui/PageTransition"
```

El CSS va dentro de `trama-ui/styles.css` (`kit.css` importa `ui-view-transitions.css`): no hay que importar nada más.

## Cómo funciona

- En el **App Router de Next 16** cada navegación es una transición de React, y React la envuelve en
  `document.startViewTransition`. Un `<ViewTransition>` que se monta en esa navegación hace *enter* y uno que se
  desmonta hace *exit*. `PageTransition` es ese `<ViewTransition>` con las clases de animación del kit: la página vieja
  recibe `ui-vt-out`, la nueva `ui-vt-in`, y el CSS anima los pseudo-elementos `::view-transition-old/new/group`.
- No añade nodos al DOM ni lleva `"use client"`: se puede poner en una página de servidor.
- El navegador hace una captura de la página vieja y otra de la nueva; mientras dura la animación (240–560 ms) ninguna
  de las dos es interactiva, pero los clics pasan a la página nueva (`::view-transition { pointer-events: none }`).

## Dónde colocarlo en Next (App Router)

**En cada `page.tsx`**, envolviendo el contenido. Es lo más fiable: cada navegación desmonta una página y monta otra,
así que siempre hay salida y entrada.

```tsx
// app/proyectos/page.tsx
import PageTransition from "trama-ui/PageTransition";

export default function Proyectos() {
  return (
    <PageTransition kind="wipe">
      <main>…</main>
    </PageTransition>
  );
}
```

**En un `template.tsx`**, si quieres una sola línea para toda una sección. Un template se vuelve a montar cuando cambia
*su* segmento, no los de más abajo: `app/template.tsx` anima `/` → `/blog`, pero no `/blog/a` → `/blog/b` (para eso,
otro `template.tsx` en `app/blog/` o el wrapper en la página).

```tsx
// app/template.tsx
import PageTransition from "trama-ui/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition kind="fade">{children}</PageTransition>;
}
```

**Nunca en un `layout.tsx`**: el layout persiste entre navegaciones, no se desmonta y no hay entrada ni salida.
Tampoco cambian de página los `searchParams` (`/tienda?p=2`): no remontan ni la página ni el template.

**Comprobado en Chrome** (web de Trama, `next start`): entre páginas bajo el **mismo layout** (`/docs/a` → `/docs/b`)
la página vieja recibe `ui-vt-out …` y la nueva `ui-vt-in …`, y corren las animaciones del kit. Entre páginas con
**layouts distintos** (`/docs` → `/demos` → `/`) solo se vio el fundido de la raíz y la cabecera fija: React no marcó
salida ni entrada en los `PageTransition`. Si tu web tiene un solo layout con la cabecera y las páginas debajo (lo
habitual), estás en el primer caso.

## Animaciones

`kind` elige la familia; `slide` y `wipe` usan además `direction` (hacia dónde se mueve el contenido).

| `kind` | Qué hace |
|---|---|
| `fade` | Fundido cruzado; la salida es más rápida que la entrada. Por defecto. |
| `slide` | Desplazamiento corto (48 px en horizontal, 32 px en vertical) con fundido. |
| `wipe` | Una banda del color `tone` barre la página: la vieja se recorta delante y la nueva aparece detrás. |
| `blinds` | Persianas horizontales de 28 px que se abren sobre la página vieja. |
| `pixelate` | Disolución por bloques de 12 px en tramado ordenado 2×2: cuatro pasos, como un dither de pixel art. |
| `scanline` | CRT: la vieja se deshace en líneas de barrido y la nueva se enciende desde una línea horizontal. |
| `glitch` | La nueva entra por franjas que crecen, con saltos laterales y separación RGB (`--acc` / `--acc2`). |
| `iris` | Un círculo se abre desde el centro de la pantalla con un aro del color `tone`. |
| `terminal` | La vieja se apaga y la nueva se escribe por líneas (12 pasos) tras un cursor de bloque. |
| `none` | Sin animación (las navegaciones con tipo siguen animando, ver abajo). |

Otras props: `pace` (`fast` ≈ 240 ms · `normal` ≈ 380 ms · `slow` ≈ 560 ms), `tone` (`acc` · `acc2` · `fg`: color de
la banda, el aro, el cursor y la separación RGB) y `types`. Todas las duraciones son de navegación: cortas.

## Una animación por navegación

Next etiqueta una navegación con `transitionTypes` en `<Link>` (o en `router.push(url, { transitionTypes })`), y
`PageTransition` elige la animación según esos tipos:

| Tipo | Animación |
|---|---|
| (ninguno) | `kind` con `direction` |
| `nav-forward` (`NAV_FORWARD`) | `kind` con `direction` |
| `nav-back` (`NAV_BACK`) | `kind` con la dirección contraria (`slide`/`wipe`); el resto, igual |
| `trama-<animación>` (`pageTransitionType("glitch")`) | esa animación, sea cual sea `kind`: `trama-iris`, `trama-slide-up`, `trama-wipe`… |
| los de `types` | lo que digas: `types={{ "abrir-ficha": "iris" }}` |

```tsx
import Link from "next/link";
import { NAV_BACK, NAV_FORWARD, pageTransitionType } from "trama-ui/PageTransition";

<Link href="/docs/2" transitionTypes={[NAV_FORWARD]}>Siguiente →</Link>
<Link href="/docs/1" transitionTypes={[NAV_BACK]}>← Anterior</Link>
<Link href="/contacto" transitionTypes={[pageTransitionType("terminal")]}>Contacto</Link>
```

La animación la decide el `PageTransition` de cada página (el de la que sale y el de la que entra), no el enlace: los
tipos solo dicen qué clase de navegación es. Usa **un tipo por navegación**: si coinciden varios, React junta sus clases
y las animaciones se pisan.

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

## Cabecera fija

Si la cabecera está dentro de lo que se anima (la repites en cada página, o el `PageTransition` la envuelve), se
movería con la página. Envuélvela en `PageTransitionPersist`: tiene su propio `view-transition-name`, así que sale de la
captura de la página, se queda quieta y por encima, y cambia sin animación (el enlace activo, por ejemplo).

```tsx
// app/layout.tsx
import { PageTransitionPersist } from "trama-ui/PageTransition";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <PageTransitionPersist name="cabecera">
          <header>…</header>
        </PageTransitionPersist>
        {children}
      </body>
    </html>
  );
}
```

Un `name` distinto por cada elemento fijo (cabecera, barra lateral, reproductor) y único en la página: dos elementos
con el mismo nombre a la vez hacen que el navegador cancele la transición. En un layout, la cabecera ya no se anima
con la página, pero `PageTransitionPersist` evita que se funda con el resto de la página cuando cambia algo fuera del
`PageTransition` (el pie, el enlace activo).

## Tema

Los pseudo-elementos de la transición cuelgan de `<html>`, no del contenedor donde pones el tema: leen los tokens de
`:root`. Si defines `--bg`, `--acc`… en `:root`, no hay nada que hacer. Si tu tema vive en un contenedor (un `<div>`
con `style={tokensToStyle(…)}`), repite en `:root` al menos el acento y el fondo:

```css
:root { --acc: #ff3b3b; --acc2: #8a8a8a; --ui-vt-page: #000; }
```

`--ui-vt-page` (por defecto `--bg`) es el color que hace opaca la página nueva en los efectos que la tapan (`wipe`,
`blinds`, `pixelate`, `scanline`, `iris`, `terminal`); tiene que ser el fondo real de la página.

## Accesibilidad y soporte

- **Reducir movimiento**: con `prefers-reduced-motion: reduce`, ninguna animación se mueve, recorta ni enmascara: las
  páginas se cruzan con un fundido de 120 ms.
- **Sin destellos** (WCAG 2.3.1): `glitch` y `scanline` suben el brillo o desplazan como mucho una vez; lo que se muestra
  no se vuelve a ocultar y ninguna dura más de medio segundo.
- **Navegadores**: Chromium 125+, Safari 18.2+ y Firefox recientes (tipos de transición y `view-transition-class`). Sin
  la API, la página cambia sin animar. Sin `@property` (necesario para `wipe`, `blinds`, `pixelate`, `iris`), el efecto
  salta a mitad en vez de interpolar.
- **React**: `ViewTransition` está en el React que trae el App Router de Next y en React ≥ 19.3. En 19.0–19.2 estable
  (Pages Router, Vite…) no existe: `PageTransition` y `PageTransitionPersist` devuelven sus hijos tal cual y
  `markPageTransition` no hace nada. `pageTransitionsSupported` dice si este React puede animar.
- Las páginas muy altas: los efectos que tienen un centro (`iris`, `scanline`, `glitch`, `terminal`) lo calculan sobre
  la pantalla visible (`vh`), suponiendo que la página nueva empieza arriba, que es lo que hace Next al navegar.

## En la web de Trama

La portada, `/demos` y `/docs` usan `PageTransition kind="wipe" pace="fast"` (barrido rojo del acento); en las docs,
«Anterior» y «Siguiente» llevan `NAV_BACK` / `NAV_FORWARD` y el barrido cambia de sentido. La cabecera
(`components/site/SiteChrome.tsx`) y el índice lateral de las docs van en `PageTransitionPersist`. En `/componentes`,
«Transición de página» monta una mini web con todas las animaciones.
