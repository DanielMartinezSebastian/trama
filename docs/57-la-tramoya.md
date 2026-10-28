# 57 · La Tramoya: restaurante con espectáculo en Chiclana

> 28-10-2026. El usuario pide una web para un restaurante temático con actuaciones en directo en Chiclana de la Frontera
> (Cádiz), dentro de /demos: investigar, valorar, crear y después pedir las imágenes para Codex. Ruta:
> `/sitios/la-tramoya`. Ficha del cuaderno: `demo-la-tramoya`.

## 1. Investigación

**El lugar.** Los ganchos de Chiclana son:

- Sancti Petri, con el castillo y la leyenda del templo de Melkart;
- La Barrosa y el pinar;
- las salinas y las bodegas de fino y moscatel;
- el atún de almadraba;
- los chicharrones;
- la tradición de las ventas de carretera;
- el carnaval gaditano y el flamenco de la bahía.

No se encontró un tablao fijo en el pueblo. Hay flamenco puntual en chiringuitos, en el Teatro Moderno y en el festival de
Sancti Petri. El hueco de negocio es real.

**Referencias.** Son cuatro webs de bares y restaurantes de Awwwards de 2026, medidas con `refs:probe`. Los datos y las
capturas están en `.refs/restaurante-espectaculo/`.

| Web | Qué tiene | Qué se toma |
|---|---|---|
| Délice (Lévis, mención 09-2026) | Restaurante con «Programación» por meses; barra de cuatro accesos unidos; serif de gran personalidad | La idea de la cartelera y la barra de accesos. Su programación no tiene precio ni reserva por función: aquí sí |
| Da Maria (mención 04-2026) | Carta impresa: doble filete, nombre en marquesina, sellos, papel | El marco impreso, llevado a cartel de varietés y programa de mano |
| Studenterkilden (mención 08-2026) | Serif centrada, «Book a table» y paquetes para celebraciones | Los paquetes de eventos privados |
| Piranha Bar (mención 05-2026) | Vídeo 3D a pantalla completa con la marca encima | Nada concreto: aporta espectáculo, pero no información |

## 2. Valoración y concepto

**Qué es La Tramoya.** Una venta de carretera de 1962 convertida en teatro. Cena de venta gaditana y una función cada
noche:

- jueves, bulerías;
- viernes, copla (en diciembre, zambomba);
- sábados, chirigota o rumba;
- domingo a mediodía, guitarra;
- Nochevieja.

**La primera impresión.** La primera versión abría un telón sobre la sala y otro entre páginas
(`PageTransition kind="curtain"`). El usuario lo descartó el 28-10-2026: quería una entrada más moderna. Ahora:
- la portada es la sala a sangre, con un acercamiento lento;
- el titular en Fraunces entra por líneas, con dos acciones;
- abajo, una franja translúcida con las tres próximas funciones;
- entre páginas, un fundido.

Tras el héroe va «Una semana en La Tramoya», una tira con `HorizontalScroll`:
- al bajar, la página desplaza en horizontal ocho fotos de la semana: los carteles de cada noche, el patio, la barra y dos
  platos redondos;
- el primer panel es el título, con una barra de progreso;
- en el móvil también avanza con el scroll (`minWidth={1}`); solo con «reducir movimiento» pasa a ser un carrusel con imán.

Los cuatro accesos unidos (cartelera, reservar, carta y cómo llegar) bajan a después de la sala. La barra inferior del
móvil (`ActionBar`) se quitó: repetía los botones del héroe y de la cabecera.

El tipo `curtain` sigue en el kit como opción.

**La reserva** es lo que pide el negocio: noche → comensales y mesa en el plano → menú → datos → señal → entrada en QR.

**Estética.** Cartel de varietés y de carnaval:
- **colores:** papel crema #f3e7d0, tinta #1c1420, rojo telón #b3121f, oro viejo #d9a441 y la sala en penumbra #170a0e;
- **letras:** Ultra (slab de feria, propia de la web) para la marca y los títulos de función; Fraunces para lo editorial;
  Antonio para fechas y rótulos; Manrope para leer.

## 3. Lo que se hizo

**Páginas:**

- inicio;
- cartelera, con 31 funciones de jueves a domingo en noviembre y diciembre y filtro por género;
- ficha de cada función, con los menús de la noche y otras fechas;
- reservar;
- mis entradas, con QR, calendario y anulación hasta 24 horas antes;
- carta y menús;
- la sala, con el plano, las zonas y la historia;
- eventos privados, con paquetes y `BriefFlow`;
- cómo llegar.

**Piezas nuevas del kit:**

- `EventLineup`: cartelera por mes, con precio desde, estado y filtro;
- `SeatMap`: plano de sala accesible; sin `onChange` es de solo lectura;
- `ShowBookingFlow` con `useShowBookings` y `takenTables` (`lib/commerce/shows`);
- el tipo `curtain` de `PageTransition`.

**Arreglo de paso:** las reglas de los flujos del kit usaban `--font-display`, que no existe; ahora usan `--display`.

**Comprobado:**

- el flujo entero con Playwright: filtro, ficha, reserva con 4 comensales, mesas pequeñas apagadas, tarjeta mala, pago,
  QR, contador de la cabecera, mis entradas y anular;
- la mesa del plano de la portada lleva a la reserva con esa mesa elegida;
- el revisor de interacción, en las 10 páginas;
- el telón, a mitad de la transición.

## 4. Imágenes

El encargo para Codex está en `docs/encargo-imagenes-tramoya.md`. Codex entregó las 19 (8c88a89) y están revisadas en escritorio y móvil.

**Ajuste tras revisarlas:** en el móvil, la foto del héroe ocupa la mitad de arriba y el texto va debajo, para que la bailaora no quede detrás del titular.

**Sin halo de legibilidad.** `tokensToStyle` pone en línea un halo con el fondo del tema. Con el tema crema, sobre los botones oscuros (la barra «Reservar mesa») se veía como una sombra blanca. La web lo anula en sus tokens (`"--legibility-ts": "0 0 transparent"`), y ningún texto de la página tiene ya sombra.
