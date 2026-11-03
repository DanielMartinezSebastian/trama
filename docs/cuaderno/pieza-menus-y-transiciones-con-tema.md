---
titulo: Menús móviles distintos y transiciones con el color de cada web
fecha: 2026-11-03
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/05, docs/58]
ruta: /componentes
codigo: [components/ui/FullscreenMenu.tsx, components/ui/styles/ui-motion.css, components/ui/PageTransition.tsx, lib/ui/pageTransitionRoot.tsx, components/ui/styles/ui-view-transitions.css]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: [menú a pantalla completa, panel lateral, isla flotante]
movimiento: [transición de página, círculo desde el botón]
piezas: [FullscreenMenu, PageTransition]
piezas-nuevas: []
relacionados: [replica-zanco, replica-polilla]
---

## Concepto

El usuario revisó las inspiraciones en el móvil y encontró dos fallos de la librería, no de cada web. Las transiciones
de página barrían con el color del sitio de Trama y no con el de la web. Además, todos los menús de hamburguesa eran el
mismo: cortina a pantalla completa con letra enorme.

## Qué se midió

- Transiciones: las capas `::view-transition-*` heredan de `<html>`, y cada inspiración declara sus tokens en su
  contenedor. Navegando dentro de Polilla, `--acc` en `<html>` era `#7cc4ff`, el del sitio, y en la web, `#ff0a9c`.
- Menús: 23 de las 28 inspiraciones usaban `FullscreenMenu`, 22 con la configuración por defecto. Solo Q47 usaba
  opciones. El componente solo cambiaba alineación, filetes, vidrio y la apertura en escalera.

## Qué se hizo

- `PageTransition` copia en `<html>`, mientras dura cada navegación, el tema de la página nueva (`--ui-vt-acc`,
  `--ui-vt-acc2`, `--ui-vt-fg`, `--ui-vt-mut`, `--ui-vt-bg`). Lo lee en el elemento del centro de la ventana o en el de
  `themeFrom`. El CSS los usa antes que los de `:root`. Al terminar, `<html>` queda limpio.
- `FullscreenMenu` añade `layout` (`full`, `sheet`, `drop`, `island`, `split` con `aside`) y aperturas nuevas (`circle`,
  `slide`, `fade`). También `tone` (`acc` con texto calculado por contraste, `fg` invertido), `size` (`lg`, `md`,
  `sm`), `numbered` y dos botones nuevos, `plus` y `pill`. Las opciones anteriores siguen igual.
- Las 21 inspiraciones con menú por defecto tienen ahora uno propio, elegido por su estética: por ejemplo, persiana
  numerada en Cantera, panel lateral en Marejada, isla en Ahora, Polilla y Ultramar, dos columnas con foto en Alba,
  Casa Melosa y Raíz, y acento con círculo en Abuela Rosa y Cita.
- Las webs que escondían el botón en escritorio lo hacían por `.ui-fsm__btn--burger`: ahora vale para cualquier botón.

## Diferencias con la referencia

No hay una referencia única: cada menú sale de la estética de su web, no de medir el menú de la original.

## Aprendido

- Durante una View Transition, `elementFromPoint` devuelve `<html>`, porque la capa de la transición cubre la ventana.
  Para encontrar el contenedor hay que recorrer las cajas, saltando los nodos con `display: contents`.
- El fondo que importa es el opaco más externo por debajo de `<body>`, no el primero: en el centro suele haber una
  tarjeta.
- Una web que fuerza `color` en el botón del menú anula la tinta calculada de `pill`. Les pasaba a Abuela Rosa y
  Oficio.
- Un velo que empieza debajo de la cabecera deja un corte: arriba la página se ve clara y debajo, oscurecida. El usuario
  lo vio en el móvil. Los menús que dejan ver la página (sheet, drop, island) velan ahora la ventana entera y llevan su
  propia fila de cierre. Los opacos, como el de Casa Melosa, siguen abriendo bajo la cabecera.

## Siguiente

- Revisar en el móvil real las combinaciones con `cover` y cabeceras que cambian de alto.
