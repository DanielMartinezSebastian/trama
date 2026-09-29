# Changelog de Trama

Formato: una entrada por versión publicada en npm (`npm run pkg:build` → `npm publish` desde `dist-npm/`). Sigue
[SemVer](https://semver.org/lang/es/): cambiar el nombre o el significado de una prop es un cambio mayor; los
renombrados de esta primera versión dejan el nombre antiguo como alias `@deprecated`.

## 0.6.1 — la cabecera ya no parpadea en navegaciones de dos commits

- **Corrección:** `PageTransitionRoot` solo armaba la raíz (`<html>`) al *montarse* la página de destino. El App
  Router de Next puede aplicar una navegación en dos commits independientes (uno que desmonta la página de origen sin
  que la de destino haya llegado aún, y otro que la monta); el commit de salida no tenía nada que lo armara, así que
  React lo cancelaba y caía al cross-fade por defecto del navegador —sin el CSS del kit— justo al lado de los
  elementos persistentes (`PageTransitionPersist`), que sí se quedan quietos. Se percibía como que la cabecera
  «parpadeaba». Ahora `PageTransitionRoot` también arma la raíz en la limpieza del efecto (al desmontarse), con la
  misma animación que tenía la página, así que ese commit de salida recibe el mismo tratamiento en vez del estilo por
  defecto del navegador.
- No cambia ninguna prop ni comportamiento visible cuando la navegación llega en un solo commit (el caso más común,
  con la ruta precargada).

## 0.6.0 — transiciones `scan` y `stack`

Incluye todo lo de 0.3.0, 0.4.0 y 0.5.0, que no llegaron a publicarse en npm: quien pase de 0.2.0 a 0.6.0 recibe los
cuatro bloques (abajo, como referencia).

- **Dos animaciones nuevas con dirección** en `PageTransition` y `ElementTransition` (`kind`, `pageTransitionType`,
  `types`), con `pace`, `tone` y el fundido de 120 ms de «reducir movimiento» como el resto:
  - `scan` (`scan-down` · `scan-up` · `scan-left` · `scan-right`): una línea brillante del color `tone`, con halo
    suave, recorre la página una vez; detrás ya está la nueva y delante sigue la vieja. Sin el apagado/encendido CRT de
    `scanline`. Por defecto baja (`down`); `left`/`right` barren en horizontal con la línea en vertical.
  - `stack` (`stack-left` · `stack-right` · `stack-up` · `stack-down`): una pila de 5 barras de grandes a pequeñas
    (`--acc`, `--acc2` y su mezcla, con huecos del color de la página) entra escalonada tapando la vieja; con la nueva
    ya debajo, se comprime hasta juntarse y sale por el lado de la dirección. Dura 1,6 veces el ritmo.
- `direction` ya no tiene un valor fijo por defecto: sin ella, `scan` usa `down` y el resto `left` (igual que antes).
  `nav-back` invierte la dirección que toque. Nuevas utilidades `DIRECTIONAL_TRANSITION_KINDS` y
  `defaultDirection(kind)`.
- CSS: `ui-view-transitions.css` añade `ui-vt-scan-*` y `ui-vt-stack-*` (pseudo-elementos de la transición, degradados y
  máscaras con propiedades registradas `@property`; sin JavaScript ni nodos extra).

## 0.5.0 — transiciones de página a pantalla completa

Incluye todo lo de 0.3.0 y 0.4.0, que no llegaron a publicarse en npm: quien pase de 0.2.0 a 0.5.0 recibe los tres
bloques (0.4.0 queda abajo como referencia; lo que cambia de su API se explica aquí).

- **`PageTransition` anima la ventana entera.** En 0.4.0 envolvía la página en un `<ViewTransition>` y el efecto solo
  ocupaba la caja del `<main>`: los fondos `position: fixed`, el pie y los márgenes cambiaban de golpe. Ahora anima la
  raíz del documento (`::view-transition-old/new(root)`): todo el viewport salvo lo envuelto en `PageTransitionPersist`.
  Su parte cliente pone en `<html>`, solo durante la navegación, `view-transition-name: root` en línea (React ya no
  cancela la raíz), un `view-transition-class` con la animación, el ritmo y el tono, y `data-ui-vt`; al terminar la
  transición lo retira. Mismas props (`kind`, `direction`, `pace`, `tone`, `types`) y mismas 9 animaciones, que ahora
  cubren la ventana (bandas de color, máscaras y recortes incluidos). La animación la decide la página de destino; si
  una navegación lleva varios tipos, se elige una (prioridad: `types` › `trama-*` › `nav-back` › `kind`).
- **`PageTransitionPersist` funciona también en un layout**: si su hijo es un elemento HTML, le pone
  `view-transition-name` en su `style` de forma permanente (React solo nombra los `<ViewTransition>` de las partes que
  cambian, y una cabecera en un layout no cambia al navegar). Todo lo que deba quedarse quieto lo necesita.
- **`ElementTransition`** (nuevo, `trama-ui/ElementTransition`): lo que era `PageTransition` en 0.4.0, la animación sobre
  la caja de un elemento suelto que entra o sale en una transición de React. Mismas props.
- **`SharedTransition`** (nuevo, en `trama-ui/ElementTransition`): elemento compartido entre dos vistas con el mismo
  `name`; el navegador lo transforma de una caja a otra (`pace` ajusta la duración). Con «reducir movimiento», solo
  funde.
- Nuevas utilidades: `pickTransitionAnimation(tipos, { kind, direction, types })` (la elección de animación como función
  pura) y los tipos `PageTransitionPace` / `PageTransitionTone`.
- Arreglado de paso: las navegaciones entre layouts distintos (`/docs` → `/demos` → `/` en la web de Trama) ahora
  animan igual que las de un mismo layout.
- CSS: `ui-view-transitions.css` añade la variante `ui-vt-root` (vieja y nueva en el mismo grupo, sin mezcla aditiva,
  fondo `--ui-vt-page` debajo) y `ui-vt-morph`. `PageTransition` ya no es solo de servidor: importa un componente
  cliente diminuto (se sigue pudiendo usar en páginas de servidor).
- Catálogo: «Transición de página» anima la ventana del catálogo; nueva entrada «Transición de elemento».

## 0.4.0 — transiciones de página (View Transitions)

Incluye todo lo de 0.3.0, que no llegó a publicarse en npm: quien pase de 0.2.0 a 0.4.0 recibe ambos bloques.

- `PageTransition` (categoría Transiciones): envuelve el contenido de una página y anima su entrada y salida al navegar
  con el `<ViewTransition>` de React sobre la View Transitions API del navegador. En el App Router de Next 16 funciona
  sin configurar. Props: `kind` (`none` · `fade` · `slide` · `wipe` · `blinds` · `pixelate` · `scanline` · `glitch` ·
  `iris` · `terminal`), `direction` (`left` · `right` · `up` · `down`, para `slide` y `wipe`), `pace` (`fast` ·
  `normal` · `slow`), `tone` (`acc` · `acc2` · `fg`) y `types` (tipo de transición → animación). Sin `"use client"`:
  vale en páginas y plantillas de servidor, y no añade nodos al DOM.
- Una animación por navegación: `nav-forward` / `nav-back` (constantes `NAV_FORWARD` / `NAV_BACK`) orientan `slide` y
  `wipe`; `trama-<animación>` (`pageTransitionType("glitch")`) elige la animación desde el enlace
  (`<Link transitionTypes={[…]}>` de Next o `router.push(url, { transitionTypes })`); `markPageTransition()` hace lo
  mismo dentro de `startTransition` con cualquier router. El kit no importa `next/link`.
- `PageTransitionPersist`: deja fuera de la animación la cabecera u otro elemento fijo (`name` único), que se queda quieto y
  por encima.
- CSS nuevo `components/ui/styles/ui-view-transitions.css`, importado por `kit.css` (y por tanto en
  `trama-ui/styles.css`): animaciones en CSS puro sobre `::view-transition-*`, con los tokens del tema leídos de `:root`
  y `--ui-vt-page` para el color que tapa la página vieja. Con `prefers-reduced-motion: reduce`, solo un fundido de 120 ms;
  `glitch` y `scanline` no parpadean (WCAG 2.3.1). Sin soporte (React sin `ViewTransition`, como 19.0–19.2 estable fuera
  del App Router, o navegador sin la API), la página cambia sin animar y nada se rompe.
- Web de Trama: la portada, `/demos` y `/docs` usan `PageTransition` (barrido con el acento; «Anterior» / «Siguiente» de
  las docs lo orientan) con la cabecera fija. Guía en `docs/05-transiciones-de-pagina.md`.
- Compatible con 0.3.0: no cambia ninguna prop existente. Nuevo en `trama-ui`: `PageTransition`,
  `PageTransitionPersist`, `pageTransitionType`, `markPageTransition`, `pageTransitionsSupported`, `NAV_FORWARD`,
  `NAV_BACK`, `PAGE_TRANSITION_KINDS`, `PAGE_TRANSITION_ANIMATIONS` y sus tipos.

## 0.3.0 — envío real en `ContactForm`, ayudas accesibles y listas con escape

Mejoras que salieron al montar martinezsebastian.com con el kit.

- `ContactForm`: `onSubmit` puede ser asíncrono y devolver el resultado
  (`((data) => void) | ((data) => ContactFormResult | Promise<void | ContactFormResult>)`, con
  `ContactFormResult = { ok: boolean; message?: string }`; cualquier objeto con `ok: false`, como una `Response` de
  `fetch`, cuenta como fallo). Mientras la promesa está pendiente el botón muestra `loading`; con `{ ok: false, message }` o
  una excepción pinta un `Alert` danger (`role="alert"`) y conserva lo escrito; con `ok: true` o sin retorno, el estado
  de éxito de siempre. Props nuevas `errorTitle` («No se pudo enviar») y `errorMessage` (texto si falla sin mensaje
  propio). Sin `onSubmit`, o con uno síncrono sin retorno, se comporta como en 0.2. Tipos exportados desde `trama-ui`.
- `TextField`: el `hint` (ayuda o error) se enlaza con `aria-describedby` (id de `useId`) en `<input>` y `<textarea>`,
  y el nombre accesible sale solo de la etiqueta (`aria-labelledby`), así el lector de pantalla anuncia el error.
  `Select`: la etiqueta se enlaza al botón y a la lista (`aria-labelledby`). `CheckboxGroup`, `RadioGroup` y
  `OtpInput` no tienen texto de ayuda: nada que enlazar.
- Listas en texto: el separador se puede escapar con barra invertida (`\,`, `\|`, `\;`), p. ej.
  `badges="+12 proyectos, 99\,5 % disponibilidad"`. Helper común `splitList`/`splitEscaped` en `lib/ui/list.ts`
  (exportado desde `trama-ui`), usado por todos los componentes que parten listas por `,`, `|` o `;`.
- Aviso `THREE.Clock … deprecated` con `RetroCanvas`: viene de `@react-three/fiber` 9.x (su store crea un
  `THREE.Clock`), no de Trama; anotado en `docs/04-pendientes.md`.
- Compatible con 0.2.0: ninguna prop cambia de nombre ni de significado. Cambios observables: una barra invertida
  justo delante del separador de una lista ya no se muestra (ahora es el escape), y un `onSubmit` que ya devolvía
  una promesa (p. ej. `() => fetch(…)` sin `await`) ahora se espera antes de mostrar el éxito.

## 0.2.0 — accesibilidad, audio, modelos 3D y markdown

- 82 componentes en 14 categorías (antes 72/13): `ScrollProgress`, `RetroFX`, `RetroShapes`, `RetroModel` (modelos
  glTF), `AudioPlayer` con motor propio (`lib/ui/audio.ts`, reproducción de archivo y síntesis), `ChatWidget`,
  y `Article`/`ArticleHeader`/`Callout`/`Prose`/`TableOfContents` con render de Markdown (`lib/ui/markdown.tsx`,
  `lib/ui/markdownInline.tsx`).
- Octava variante de estilo: `dotmatrix`.
- Accesibilidad: foco visible en toda interacción del kit; `prefers-reduced-motion` respetado (WCAG 2.3.3) en fondos
  generativos (`AsciiBackground`, `TextmodeBackground`), destellos (`SceneFlash`) y cursores/spinners; roles ARIA en
  `ChatWidget`, `Testimonial`, `Footer`, `ScrollArea`; texto para lectores de pantalla en `Typewriter`; nueva prop
  `headingLevel` en `BlogCard` y `Panel` para no romper el orden de encabezados de la página que los usa.
- Rework de `NavBar` (más variantes y comportamiento) y mejoras en `Tooltip`, `Toast`, `Toggle`, `PricingCard`/
  `PricingSection`, `GridBackground`, `CTASection` y formularios (`TextField`, `Select`, `RadioGroup`,
  `CheckboxGroup`, `Pagination`, `Table`, `Tabs`).
- Sin cambios de nombre o significado de props existentes: compatible con proyectos en `0.1.0`.

## 0.1.0 — primera versión publicable

- 72 componentes en 13 categorías (fondos, texto, tarjetas, interacción, transiciones, datos, navegación,
  formularios, feedback, galerías y vídeo, secciones, overlays, pixel art), 7 estilos (`variant`) y tema por tokens.
- Vocabulario común de props: `variant`, `intent`, `emphasis`, `tone`, `fill` (ver guía, glosario).
- Entradas: `trama-ui` (todos los componentes por nombre), `trama-ui/<Componente>`, `trama-ui/styles.css`, `trama-ui/fonts`,
  `trama-ui/tokens`, `trama-ui/assets/*`; CLI `npx trama-ui assets`.
- Probado en un proyecto Next.js 16 vacío instalando el `.tgz`: build con Turbopack y con webpack, sin configuración.
