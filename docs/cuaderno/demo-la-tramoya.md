---
titulo: La Tramoya, venta-teatro con espectáculo en Chiclana
fecha: 2026-10-28
tipo: demo
estado: hecho
referencias: [https://delice.ca/, https://damaria-roma.webflow.io, https://studenterkilden.dk/en, https://piranhabar.ie/]
fichas: [docs/57]
ruta: /sitios/la-tramoya
codigo: [components/sites/la-tramoya/Site.tsx, components/sites/la-tramoya/data.ts, components/sites/la-tramoya/tramoya.css, components/ui/EventLineup.tsx, components/ui/SeatMap.tsx, components/ui/ShowBookingFlow.tsx, lib/commerce/shows.ts]
colores: [#f3e7d0, #1c1420, #b3121f, #d9a441, #170a0e]
fuentes: [Ultra, Fraunces, Antonio, Manrope]
sector: [restaurante]
guia: []
tono: [cálido, festivo, popular]
paleta: [fondo claro, acento rojo, oro]
tipografia: [slab de cartel, serif con cursiva]
patrones: [foto a sangre, franja de próximas funciones, galería horizontal, cartelera por fechas, ficha de función, plano de sala, reserva propia, entrada con QR, programa de mano, barra de accesos unida, cinta que corre, eventos privados, formulario de contacto]
movimiento: [acercamiento lento, titular por líneas, transición de página, scroll suavizado, cinta que corre]
piezas: [EventLineup, SeatMap, ShowBookingFlow, BriefFlow, HorizontalScroll, QRCode, Marquee, OpeningHours, FullscreenMenu, ActionBar, CookieBanner, ContactForm, PageTransition, SmoothScroll]
piezas-nuevas: [EventLineup, SeatMap, ShowBookingFlow, PageTransition]
relacionados: [pieza-flujos-de-negocio, demo-cadencia, replica-abuela-rosa]
---

## Concepto

Restaurante temático con actuaciones en directo en Chiclana de la Frontera (Cádiz), pedido por el usuario el 28-10-2026.
La marca es inventada:

- **La Tramoya**, una venta de carretera de 1962 convertida en teatro;
- **cocina de venta gaditana**: chicharrones, tortillitas, atún de almadraba de Sancti Petri, fino y moscatel de Chiclana;
- **una función cada noche**: bulerías, copla, chirigota, rumba, guitarra el domingo a mediodía y zambomba en diciembre.

La estética es de cartel de varietés y de carnaval: papel crema, rojo telón, oro viejo, una slab negra de feria (Ultra) y
programas de mano. La portada es moderna: la sala a sangre con el titular en Fraunces. Un telón animado en la portada y
entre páginas se probó y el usuario lo descartó.

## Qué se midió

`refs:probe` sobre cuatro referencias de Awwwards de 2026 (`.refs/restaurante-espectaculo/`):

- **Délice**, restaurante con «Programación»: Ivy Mode y Filson Soft; ocho colores; una barra de cuatro accesos unidos.
  Su programación no lleva precio ni reserva por función.
- **Da Maria**: carta impresa con doble filete, nombre en marquesina, sellos, Playfair y Bitter; GSAP, Lenis y Barba.
- **Studenterkilden**: serif centrada y paquetes para eventos.
- **Piranha Bar**: vídeo a pantalla completa.

## Qué se hizo

Páginas:

- portada con telón que se abre;
- cartelera de noviembre y diciembre con filtro por género, y la ficha de cada función;
- reserva con plano de sala, menú y entrada en QR;
- mis entradas, con anulación hasta 24 horas antes;
- carta y menús;
- la sala;
- eventos privados con `BriefFlow`;
- cómo llegar.

Piezas nuevas del kit:

- `EventLineup`;
- `SeatMap`;
- `ShowBookingFlow`, con `lib/commerce/shows`;
- el tipo `curtain` de `PageTransition`.

## Diferencias con la referencia

No replica una web. Toma de Délice la idea de la programación, pero le añade precio, estado y reserva por función. De Da
Maria toma el marco impreso, llevado al cartel de varietés.

## Aprendido

- El token de letra de titulares del tema es `--display`, no `--font-display`. Cinco reglas de los flujos del kit
  apuntaban a la variable inexistente y caían en la letra del texto.
- Un plano sin `onChange` no debe pintar botones: el revisor los marca como botones sin efecto. `SeatMap` lo pinta de
  solo lectura.
- Las fechas de la cartelera son fijas, y «lo que aún no ha pasado» se filtra en el navegador tras montar, para que el
  servidor y el navegador pinten lo mismo.
- Un telón literal resulta antiguo como primera impresión. La temática va en la foto, la cartelera y los carteles de
  función; la entrada, limpia.
- `tokensToStyle` fija el halo de legibilidad en línea: para quitarlo en una web hay que sobrescribirlo en sus tokens, no
  con una clase.

## Siguiente

Las 19 imágenes de Codex están entregadas y revisadas (8c88a89). Queda medir la web con `refs:probe -- --repo` para
su afinidad con las guías.
