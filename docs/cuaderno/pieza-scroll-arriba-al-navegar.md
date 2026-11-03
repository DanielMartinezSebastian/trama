---
titulo: La página nueva empieza arriba aunque se navegue a media inercia
fecha: 2026-11-03
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/56]
ruta: /inspiraciones
codigo: [components/ui/SmoothScroll.tsx]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: [navegación entre páginas]
movimiento: [scroll suave]
piezas: [SmoothScroll]
piezas-nuevas: []
relacionados: [pieza-menus-y-transiciones-con-tema]
---

## Concepto

El usuario vio que, a media página, un enlace a otra ruta abría la página nueva a media altura en vez de arriba.

## Qué se midió

Barrido con Playwright de las inspiraciones y las webs de `/sitios`, en 1280 y 390 px: bajar al 30–60 % de la página,
pulsar el primer enlace interno visible y leer `scrollY` en la ruta nueva. 17 de 117 casos acababan a media altura, todos
en webs con scroll suave (Lenis): Cita, Impulso, Remada, Cénit, Brasa, Tierra Ancha, Pausa, Solera, Vencejo y Ánima.

La causa: el router de Next sube al principio, pero si la página aún se desliza, Lenis sigue persiguiendo la altura de
antes y la devuelve allí. Con las sensaciones de cola larga (`editorial`, `cinematic`) basta con pulsar un segundo
después de girar la rueda.

## Qué se hizo

`SmoothScroll` tiene `resetOnNavigate` (activado por defecto): envuelve `history.pushState` y, cuando cambia la ruta, corta
la inercia de Lenis (`scrollTo(0, { immediate, force })`) y sube sin animar. No actúa al volver atrás o adelante, con un
`#ancla` ni si solo cambia la consulta. No usa `next/navigation`, porque `next` es dependencia opcional del paquete.

## Diferencias con la referencia

Sin referencia.

## Aprendido

- Una prueba de navegación tiene que pulsar con la página aún en movimiento: con la página quieta, el fallo no aparece.
- Los 17 casos pasan a 0 tras el cambio. Desde el menú abierto a media página también acaba arriba, y después el scroll
  sigue respondiendo.

## Siguiente

- Al volver atrás, la página anterior no recupera la altura en la que se dejó: queda en la de la página de la que se
  vuelve. Ya pasaba antes de este cambio.
