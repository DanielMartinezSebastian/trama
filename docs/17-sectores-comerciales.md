# Sectores comerciales: qué necesita cada web, con ejemplos prácticos (y la pastelería en tres versiones)

> Ronda 8 (20-10-2026). La [`11`](./11-estudio-sectores-2026.md) estudió **qué necesita el cliente de cada sector** y la
> [`15`](./15-evaluacion-proximas-demos.md) (rama `feat/motion-editorial`) eligió demos por referencia premiada. Esta ronda baja
> a lo **práctico**: los sectores que más encargan una web (restaurante, cafetería y pastelería, gimnasio, tienda de ropa,
> joyería, y de pasada peluquería y estética), las **funciones concretas** que cada uno tiene que tener funcionando el día
> uno, y qué pieza de Trama las cubre. Como prueba, una pastelería completa en **tres versiones** que aplican conceptos
> distintos de la librería (§8) y cinco piezas nuevas del kit que salen de ella (§9).
>
> **Método y límites.** Síntesis de la [`11`](./11-estudio-sectores-2026.md) (fuentes allí) y de práctica habitual del sector
> en España; **no se abrió ninguna web en vivo** en esta ronda. Las referencias normativas se citan por su nombre para
> confirmarlas en fuente primaria antes de llevarlas a un cliente (marcadas «confirmar»). No hay cifras nuevas: las que
> aparecen vienen de la `11`, con su fuente.

## 0. Conclusiones

1. **Cada sector tiene dos o tres funciones que deciden la venta**, y casi nunca son visuales: la carta con alérgenos y la
   reserva en el restaurante; el horario de clases y el precio con permanencia en el gimnasio; la guía de tallas y las
   devoluciones en ropa; la cita y la confianza (certificados, garantía) en joyería. La web que las resuelve en la primera
   pantalla del móvil gana a la que tiene mejores efectos (`11` §0).
2. **El público no es uno.** Un gimnasio vende a principiantes con miedo, a gente que vuelve tras una lesión, a mayores de
   50 y a quien entrena fuerte; una joyería, a quien se compra algo y a quien compra un anillo de compromiso una vez en la
   vida. La web los separa con **entradas por objetivo** («Empiezo de cero», «Busco un anillo de compromiso»), no con más
   secciones.
3. **El QR es la puerta del local a la web**: carta en la mesa, horario en el escaparate, reseña al pagar, ficha de la
   pieza en la vitrina de la joyería, alta al club en el mostrador. Por eso entra en el kit (`QRCode`, §9).
4. **El movimiento se gasta donde el producto se ve mejor moviéndose** (la tarta en despiece, la joya girando, el vídeo del
   obrador) y nunca sobre la carta, el horario, el precio o el formulario. Se mantiene el presupuesto de la `11` §2.
5. **Las cinco piezas nuevas** (`OpeningHours`, `MenuList`, `DatePicker`, `ActionBar`, `QRCode`) desbloquean restaurante,
   cafetería, pastelería, peluquería y clínica casi sin más código; gimnasio, ropa y joyería necesitan una pieza propia
   cada uno (§10).

## 1. Base común (recordatorio de la `11` §1)

Toda web de pyme de esta ronda cumple B1–B15 de la `11`. Las que más se olvidan, con la pieza que ya las resuelve:

| Id | Qué | Pieza |
|---|---|---|
| B1 | Acción principal persistente, en el pulgar en móvil | `ActionBar` (nueva) + CTA de la cabecera |
| B2 | Teléfono, WhatsApp y dirección a un toque | `ActionBar` (`tel:`, `https://wa.me/…`, enlace a mapa) |
| B3 | Horario con «abierto ahora» y festivos | `OpeningHours` (nueva) |
| B5 | Reseñas con número y fuente («4,8 · 642 en Google») | `TestimonialSection` con resumen (`rating`, `count`, `source`, `distribution`) |
| B10 | Cookies con «Rechazar» al mismo nivel y «Configurar cookies» en el pie | `CookieBanner` |
| B12 | `schema.org` coherente con la ficha de Google | `openingHoursSchema()` (nueva) + `JsonLd` |

## 2. Restaurante, bar y cafetería

**Público.** Vecinos (vuelven, quieren saber si hay mesa y qué hay hoy), turistas (llegan por Google Maps, miran fotos y
precios, a menudo en otro idioma), grupos y empresas (comidas de equipo, celebraciones: piden presupuesto cerrado).

**Acción principal**: reservar mesa (restaurante) o pedir (cafetería, para llevar). Secundaria: pedir para grupos.

**Funciones prácticas que tienen que funcionar**

| Función | Cómo es en la práctica | Pieza |
|---|---|---|
| **Carta completa por QR** | Un QR por mesa abre **la carta en HTML** (no un PDF que hay que ampliar), ya filtrada por el turno (desayunos, menú del día, cena). El número de mesa viaja en la URL (`/mesa/7`), así el pedido o la llamada al camarero llegan a esa mesa | `QRCode` + `MenuList` (nuevas); ruta por mesa como en `almibar-barrio` |
| **Alérgenos en cada plato** | Los 14 del Reglamento UE 1169/2011 (en España, RD 126/2015 para alimentos sin envasar; confirmar). Filtro «Sin gluten / sin leche» que **oculta** lo que el cliente no puede tomar y aviso de trazas | `MenuList filter legend` |
| **Pedido en mesa** | Añadir desde la carta, notas («sin cebolla»), enviar a barra, «pedir la cuenta», «llamar al camarero». Sin registro | `MenuList onAdd` + `Drawer` + `ActionBar` |
| **Reserva en 2 pasos** | Día y personas → turno con huecos reales → datos mínimos. Política visible antes de confirmar (señal, cancelación, tiempo de mesa) | `DatePicker` con `slots` como función (nueva) + `Stepper` |
| **Lista de espera** | Si el turno está lleno: «avísame si se libera» con el móvil | `DatePicker` (hueco `disabled` + nota) + `TextField` |
| **Menú del día** | Lo que cambia cada día, arriba en la portada y en el QR, con precio cerrado y qué incluye | `MenuList` con una sección «Hoy» |
| **Grupos y eventos** | Menús cerrados por persona, mínimo de comensales, señal; formulario corto que pide fecha, personas y presupuesto | `PricingSection` + `ContactForm` |
| **Para llevar / recoger** | Pedido con franja de recogida y pago en tienda | `useCart` + `CartDrawer` + `DatePicker` |
| **Tarjeta regalo** | Importe libre, mensaje, envío por correo; canje en tienda | `OptionPicker` (importes) + pedido |
| **Horario y festivos** | Con estado «cierra a las 16:00» y los cierres de vacaciones anunciados | `OpeningHours` |

**Ejemplos prácticos.** *Bar de barrio*: portada con el menú del día y el horario, QR en las mesas a la carta, WhatsApp
para encargar raciones. *Restaurante de reservas*: la reserva en la cabecera de todas las páginas; la carta con
procedencia del producto; la sala privada como página propia. *Cadena de dos o tres locales*: localizador con ficha por
local (horario, carta propia, reserva de ese local; R4 de la `11`).

**Movimiento** nivel 2: fotografía a sangre, vídeo corto de cocina, relato de procedencia. Nunca animación sobre la carta.

## 3. Pastelería, panadería y obrador

**Público.** Diario (pan y bollería: quiere saber si abren y qué queda), ocasional (tarta de cumpleaños: precio, sabores,
antelación), celebraciones (bodas, comuniones: degustación y presupuesto), empresas (cajas regalo, desayunos de oficina).

**Acción principal**: encargar una tarta. Secundarias: pedir para recoger, ver la carta.

| Función | Cómo es en la práctica | Pieza |
|---|---|---|
| **Encargo de tarta a medida** | Tamaño → bizcocho → relleno → cobertura → decoración → fecha y franja de recogida. **Precio en vivo** y **alérgenos resultantes** de la combinación. Antelación mínima (48 h; 7 días con pisos) aplicada en el calendario, no en un texto | `OptionPicker`, `CheckboxGroup`, `DatePicker min={2}` |
| **Ver la tarta antes de encargarla** | Despiece por capas o tarta 3D que cambia con cada opción: reduce dudas («¿cómo queda la ganache con frambuesa?») | 3D propio de la web (`almibar-taller`), patrón de `ObjectStage` |
| **Pedido para recoger** | Bollería y porciones con franja de recogida y tienda; pago en tienda o señal | `useCart`, `CartDrawer`, `DatePicker` + `slots` |
| **Temporada** | Roscón, huesos de santo, monas: reserva con fecha límite y aviso cuando abre | `Badge` + `MenuList` sección de temporada |
| **Carta y alérgenos** | Igual que en restauración: la vitrina en HTML con los 14 alérgenos | `MenuList` |
| **Café en el local** | QR de mesa, pedido a barra, tarjeta de sellos | `QRCode`, `MenuList onAdd`, club (`almibar-barrio`) |
| **Señal y cancelación** | Encargos grandes con señal (p. ej. 30 %) devuelta si se cancela con 48 h: dicho antes de confirmar | texto en el último paso |

**Ejemplos prácticos.** *Panadería de barrio*: horario con estado, «hoy en el horno», encargo de pan por WhatsApp.
*Pastelería de encargo*: el configurador como portada. *Obrador con cafetería*: carta en mesa y club de sellos. Las tres a
la vez son Almíbar (§8).

**Movimiento** nivel 1–2 (comercio de procedencia); nivel 3 solo en el configurador, donde el 3D **es** la información.

## 4. Gimnasio, box y estudio (pilates, yoga, ciclo)

**Públicos y lo que pregunta cada uno**

| Segmento | Pregunta | Qué le enseña la web |
|---|---|---|
| Principiante con miedo a «no encajar» | ¿Hay gente como yo?, ¿me van a ayudar? | Fotos de socios reales, «Tu primera semana», clase de prueba, entrenador asignado |
| Vuelve tras una lesión o embarazo | ¿Me adaptan el entrenamiento? | Equipo con titulación (fisio, readaptación), clases de baja intensidad |
| Mayores de 50 | ¿Es seguro?, ¿hay horario de mañana? | Clases específicas, horario filtrable, accesibilidad del centro |
| Entrena fuerte | ¿Qué material hay?, ¿a qué hora está vacío? | Ficha de la sala y del material, **ocupación por horas** |
| Familias | ¿Hay actividades para niños a la misma hora? | Clases infantiles en paralelo, bono familiar |
| Empresas | ¿Hay convenio? | Página de empresa, precio por empleado |

**Acción principal**: clase de prueba o primera semana gratis, en ≤ 3 clics (F3 de la `11`).

| Función | Cómo es en la práctica | Pieza |
|---|---|---|
| **Horario semanal de clases** | Columnas por día en escritorio y **lista por día en móvil**, filtro por actividad, nivel y sala, plazas libres por clase y reserva en un toque | ✘ `ScheduleGrid` (falta, §10) |
| **Reserva de plaza** | La plaza se guarda con la cuenta del socio; lista de espera si está llena; cancelación hasta X horas antes | `DatePicker` + huecos con plazas como `note` |
| **Tarifas con letra pequeña a la vista** | Precio, matrícula, permanencia, cómo darse de baja (en el estudio de 36 gimnasios de la `11`, el 94 % no explica la permanencia) | `PricingSection` con nota por plan |
| **Prueba gratis** | Formulario de 3 campos + elegir la clase de prueba en el horario | `ContactForm` + horario |
| **Ocupación por horas** | Gráfico «suele estar lleno de 19 a 21 h» | `Chart` (barras) |
| **Entrada por objetivo** | «Perder peso», «Ganar fuerza», «Volver tras una lesión»: cada una lleva a sus clases y su entrenador | `FeatureExplorer` o tarjetas |
| **Acceso con QR** | El socio enseña su QR en el torno (o la app lo da) | `QRCode` |
| **Transformación real** | Antes/después con permiso y con contexto (tiempo, constancia), sin promesas | ✘ `BeforeAfter` (falta, propuesto en la `15`) |

**Ejemplo práctico.** *Estudio de pilates de barrio*: horario como portada en móvil, tres tarifas con permanencia dicha,
clase de prueba elegida en el propio horario, WhatsApp. *Box de entrenamiento funcional*: ocupación por horas, vídeo de
la sala, comunidad (eventos, retos). **Movimiento** nivel 1–2: vídeo de la sala, nunca sobre el horario o el precio.

## 5. Tienda de ropa (marca propia o multimarca)

**Público.** Quien ya conoce la marca (compra rápida, quiere su talla), quien llega por una foto en redes (quiere ver la
prenda puesta y el precio), quien compra para regalar (quiere saber si se puede cambiar).

**Acción principal**: añadir a la cesta con la talla correcta.

| Función | Cómo es en la práctica | Pieza |
|---|---|---|
| **Guía de tallas útil** | Medidas de la prenda (no solo S/M/L), «la modelo mide 1,72 y lleva una S», recomendación por altura y talla habitual («¿te queda grande o pequeña tu talla de siempre?») | ✘ `SizeGuide` (falta: `Modal` + `Table` + 2 preguntas, §10) |
| **Filtro por talla disponible** | Filtrar por «tengo una M» oculta lo agotado en esa talla | `FilterBar` |
| **Ficha con todo junto al botón** | Composición y cuidado, envío (plazo y coste), **devoluciones** (plazo y si son gratis), stock en tienda física | `ProductGallery`, `OptionPicker`, `PriceTag` + bloque de envío (falta en la ficha, C4 de la `11`) |
| **Aviso de reposición** | «Avísame cuando vuelva mi talla» en la talla agotada | `OptionPicker` (agotada) + `TextField` |
| **Recogida en tienda y stock por tienda** | «Disponible hoy en Centro» | `OpeningHours` por tienda |
| **Lookbook comprable** | La foto del look con las prendas enlazadas | `ImageGallery` + `ProductCard` |
| **Lista de deseos y carrito persistente** | Sin cuenta (en el navegador) | `useCart` (mismo patrón) |
| **Pago corto con métodos locales** | Invitado, 12–14 campos, tarjeta, PayPal (Bizum para comercios en Europa anunciado para 2027, `11` C3) | pedido en pasos de Barro |
| **Desistimiento** | 14 días para devolver una compra a distancia (confirmar redacción con la normativa de consumo) | página legal + bloque en la ficha |

**Ejemplo práctico.** *Marca pequeña de punto*: ficha editorial con materiales y origen, guía de tallas con medidas,
lista de espera de la próxima colección. *Multimarca de barrio*: stock por tienda, recogida en 2 horas, WhatsApp para
preguntar por una prenda. **Movimiento** nivel 2 (Clara Vidal y Barro como base): ficha editorial, nunca tapar el botón.

## 6. Joyería (artesana, de compromiso, relojería)

**Público.** Autorregalo y regalo (precio, entrega, envoltorio, cambio), **compromiso y boda** (compra única, alta
implicación, quiere ver la pieza en persona y hablar con alguien), clientes de reparación, tasación o compra de oro.

**Acción principal**: pedir cita (en el taller o por videollamada) para alto valor; comprar para el resto.

| Función | Cómo es en la práctica | Pieza |
|---|---|---|
| **Configurador de anillo** | Metal (oro amarillo, blanco, rosa, platino), piedra y quilates, forma, **talla** y grabado, con precio que se actualiza | `OptionPicker` + precio en vivo (patrón del encargo de tarta) |
| **Ver la pieza girando** | 360° o 3D con material de metal y gema que reflejan; zoom real en la foto | `ObjectStage material="metal" shape="gem"` como base; modelo propio para el anillo |
| **Medidor de talla** | Guía imprimible a escala o medir un anillo que ya tienes; tabla de equivalencias; ajuste de talla gratis tras la compra | ✘ `RingSizer` (falta, propia de la web) |
| **Cita en el taller o videollamada** | Día y hora con el joyero; motivo (compromiso, reparación, tasación) | `DatePicker` + `slots` + `RadioGroup` |
| **Confianza** | Certificado de la piedra (laboratorio), **contraste y punzón** del metal (Ley 17/1985 de objetos fabricados con metales preciosos; confirmar), garantía, taller propio con nombre y cara | `MetaTable` + `TeamSection` |
| **Pieza personalizada** | Las piezas a medida o grabadas no se pueden devolver por desistimiento (excepción de bienes personalizados; confirmar) y se dice **antes** de pagar | aviso en el configurador |
| **Financiación y regalo** | Pago aplazado, envoltorio, mensaje, entrega asegurada | pedido en pasos |
| **QR en la vitrina** | Cada pieza del escaparate lleva un QR a su ficha (precio, materiales, cita) aunque la tienda esté cerrada | `QRCode` |

**Ejemplo práctico.** *Joyería artesana*: el taller como relato (procedencia), colección con fichas, cita para encargos.
*Joyería de compromiso*: configurador + 3D + cita como portada; guía «cómo elegir un diamante» (4C) como contenido.
**Movimiento** nivel 2–3 (lujo: Cartier en la `15`), pero precio y cita visibles siempre.

## 7. Peluquería, barbería y centro de estética (resumen)

Catálogo de servicios **con duración y precio** → profesional (opcional) → hueco (F5 de la `11`). Es `MenuList` (servicios
con precio y nota de duración) + `DatePicker` con `slots` por profesional + `OpeningHours` + `ActionBar` con WhatsApp: el
sector que más se beneficia de las piezas nuevas sin nada más. Clara Vidal es la base visual.

## 8. La pastelería en tres versiones (Almíbar)

Un mismo negocio ficticio —**Almíbar**, pastelería y obrador en Zaragoza desde 1987, dos tiendas— con los mismos datos
(`lib/sites/almibar.ts`: marca, tiendas con horario y festivos, vitrina con precios y alérgenos, opciones de tarta, precio
y alérgenos de la combinación, huecos de recogida, reseñas, FAQ y JSON-LD `Bakery`), contado con tres conceptos distintos de
la librería. Sirve para enseñar a un cliente **tres direcciones** sobre su propio contenido.

| | `almibar` · Obrador editorial | `almibar-taller` · Taller 3D | `almibar-barrio` · Café en puntos |
|---|---|---|---|
| Relato (`11` §4) | Procedencia | Demostración | Guía (del día a día) |
| Movimiento | 1–2 | 2–3 (solo en la tarta) | 1 |
| Estética | Crema, tinta y frambuesa; serif; foto y vídeo a sangre | Rubor claro; la tarta 3D como protagonista sobre `GradientField` | Papel crema y tinta con la variante `dotmatrix` del kit; vídeo en puntos en el hero |
| Para quién | El cliente diario y el del encargo | El que celebra algo (cumpleaños, boda, empresa) | El que se sienta en el local |
| Acción principal | Encargar una tarta | Diseñar tu tarta | Pedir desde la mesa |
| Páginas | inicio · carta · tienda · pedido · encargos · obrador · tiendas | inicio · diseña · bodas · empresas | inicio · carta (+ QR imprimibles) · mesa/1–12 · club · visítanos |
| Compra | Pedido y encargo en una página: tienda, día con atajos («Hoy · Mañana…», calendario solo si hace falta), hora, nombre y teléfono; pago al recoger | Se encarga desde el propio diseñador (sin página de solicitud): recogida con atajos, nombre y teléfono, señal del 30 % | Pedido en mesa sin registro: añadir, nota, «Enviar a barra» |
| Transición entre páginas | `PageTransition kind="wipe"` hacia arriba, en frambuesa | `kind="iris"` y la tarta que viaja de la portada al diseñador (`SharedTransition`) | `kind="pixelate"`, rápida |
| 3D | — | Tarta torneada con miga, crema, cobertura con grosor, porción que se saca («Ver por dentro»), ganache con goterones, frutos rojos de granitos, velas, placa con el mensaje y peana | — |
| Piezas nuevas | `MenuList`, `DatePicker` + huecos, `OpeningHours`, `ActionBar` | `DatePicker`, `ActionBar`; tarta 3D propia (`CakeStage`) | `QRCode` en puntos, `MenuList onAdd`, `OpeningHours`, `ActionBar` de mesa |
| Reutiliza | Barro (carrito y pedido), `SplitText`, `Timeline`, `ImageReveal`, vídeo `obrador` | `ObjectStage`/`lib/object3d` (patrón), `PinnedSection` (despiece), `ExpandingPanels`, `RangeSlider` | `VideoPlayer ascii`, `Drawer`, `QuantityStepper`, `Toast` |

**Cómo elegir entre las tres con un cliente**: si su venta es diaria y de barrio, la editorial; si el ticket medio sube
con la personalización, el taller 3D; si el local tiene mesas y quiere quitar trabajo a la barra, la de puntos (y se pueden
combinar: el QR de mesa de la tercera sirve en cualquiera de las otras dos).

## 9. Piezas nuevas del kit en esta ronda

| Componente | Qué resuelve | Ids (`11`) | Detalle |
|---|---|---|---|
| `OpeningHours` | «Abierto ahora · cierra a las 20:30» en la zona del negocio, tramos partidos, festivos y aperturas especiales | B3, B12 | La semana se pinta en servidor; el estado, al montar. La lógica pura vive en `lib/ui/hours.ts` (`openingHoursSchema()` para el JSON-LD, también desde el servidor) |
| `MenuList` | Carta en HTML con los 14 alérgenos, filtro «Sin…», agotados y botón de añadir | R1, F5 | Carta como texto (`#Sección`, `Nombre\|desc\|precio\|alérgenos\|etiquetas`) o como `MenuSection[]` |
| `DatePicker` | Un día o un rango, antelación mínima, días cerrados, huecos del día | R2, H1, S1, F1 | Cuadrícula ARIA con teclado completo; `slots` como función para la disponibilidad real |
| `ActionBar` | Llamar · WhatsApp · Cómo llegar · acción principal, fija en móvil | B1, B2 | Objetivos de 56 px, `safe-area-inset-bottom`, hueco al final de la página |
| `QRCode` | QR en SVG sin dependencias (versiones 1–10, L/M/Q/H), en cuadrados, puntos o redondeado | — | Codificador en `lib/ui/qr.ts`, comprobado con un decodificador real (OpenCV) en las 10 versiones y los 4 niveles, y en el navegador en las tres formas. Dos hallazgos: los buscadores de las esquinas tienen que ser cuadrados (en círculo no se leen) y en tema oscuro hay que invertir (`contrast="auto"`) |

**Compra en una página (ronda del 21-10-2026).** Los dos flujos de Almíbar tenían pasos con «Continuar» y pedían correo y
forma de pago. Ahora: una página, solo nombre y teléfono, pago al recoger por defecto y el botón con el total siempre a
la vista. La pieza que más clics ahorra es `DatePicker shortcuts={4} calendar="collapsed"`: casi todo el que recoge un
pedido elige hoy o mañana, así que el calendario solo aparece si lo pide («Otro día…»).

## 10. Lo que falta, por sector (regla de modularidad: primero opción, luego pieza)

| Falta | Sector | Propuesta |
|---|---|---|
| Horario semanal de clases con plazas | Gimnasio, academia | `ScheduleGrid`: columnas por día en escritorio, lista por día en móvil, filtro, plazas y reserva (reutiliza la cuadrícula ARIA de `DatePicker`) |
| Guía de tallas | Ropa | Receta, no componente: `Modal` + `Table` + dos preguntas; si se repite en dos demos, `SizeGuide` |
| Antes / después | Gimnasio, estética, clínica, reformas | `BeforeAfter` (ya propuesto en la `15`) |
| ~~Resumen de reseñas~~ **hecho** | Todos | `TestimonialSection` con `rating`, `count`, `source`, `distribution` (filtra las citas), `pageSize`, `align` y `quoteFont`; citas a la misma altura en rejilla y slider |
| Medidor de talla de anillo | Joyería | Propio de la web (no del kit) |
| Bloque «envío y devoluciones» en la ficha | Ropa, joyería, comercio | Opción de la ficha de producto (C4 de la `11`) |
| Generadores de JSON-LD por tipo | Todos | `Restaurant`, `ExerciseGym`, `ClothingStore`, `JewelryStore` sobre el mismo patrón que `bakeryJsonLd` |

## 11. Demos siguientes que salen de aquí

| Demo | Sector | Reutiliza de esta ronda | Pieza nueva |
|---|---|---|---|
| **Brasa** (de la `11`) | Restaurante con dos locales | `MenuList`, `QRCode` de mesa, `DatePicker` (turnos), `OpeningHours`, `ActionBar` | Localizador por local |
| **Núcleo** (de la `11`) | Gimnasio / estudio | `DatePicker` (prueba), `ActionBar`, `QRCode` (acceso) | `ScheduleGrid` |
| **Hilo** | Tienda de ropa de marca propia | Barro (carrito), `OpeningHours` (stock por tienda) | Guía de tallas (receta) |
| **Quilate** | Joyería artesana y de compromiso | Configurador de Almíbar Taller (patrón), `ObjectStage`, `DatePicker` (cita), `QRCode` (vitrina) | Anillo 3D y medidor de talla (propios) |

## 12. Criterio de terminada

El de la `11` §7, más: la carta y el horario se leen sin JS; los QR se escanean en papel (impresos a 2 cm) y en pantalla;
el encargo o el pedido se completa en móvil a 390 px solo con teclado y con movimiento reducido.
