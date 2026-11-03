---
titulo: La página nueva empieza arriba y la anterior recupera su altura al volver
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
la inercia de Lenis (`scrollTo(0, { immediate, force })`) y sube sin animar. No actúa con un `#ancla` ni si solo cambia
la consulta.

Al volver atrás o adelante, cada dirección recupera la altura en la que se dejó. La guarda al hacer scroll y al salir, y
la repite en cada fotograma hasta alcanzarla, durante al menos 0,4 s y como mucho 1,5 s, porque la página anterior tarda
en pintarse. Se suelta en cuanto el usuario mueve la rueda, toca o pulsa una tecla. Desactiva la restauración del
navegador (`history.scrollRestoration = "manual"`), que llegaba cuando aún estaba la página que se deja y se perdía.

No usa `next/navigation`, porque `next` es dependencia opcional del paquete.

## Diferencias con la referencia

Sin referencia.

## Aprendido

- Una prueba de navegación tiene que pulsar con la página aún en movimiento: con la página quieta, el fallo no aparece.
- Los 17 casos pasan a 0 tras el cambio. Desde el menú abierto a media página también acaba arriba, y después el scroll
  sigue respondiendo.
- Ir, bajar, volver atrás y adelante en Tierra Ancha, Vencejo, Bocado, Matiz y Ánima (tres en móvil y dos en escritorio): la página nueva
  empieza en 0, y atrás y adelante recuperan su altura con menos de 25 px de diferencia (la inercia que quedaba al medir).

## Siguiente

- Probar atrás y adelante en un móvil real, donde no hay Lenis y el scroll nativo tiene su propia inercia.
