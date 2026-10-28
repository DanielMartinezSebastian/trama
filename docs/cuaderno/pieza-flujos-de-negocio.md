---
titulo: Flujos de negocio en pasos (reserva, compra, plaza, alta y propuesta)
fecha: 2026-10-28
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/56, docs/CATALOG.md]
ruta: /componentes
codigo: [components/ui/BookingFlow.tsx, components/ui/AppointmentList.tsx, components/ui/CheckoutFlow.tsx, components/ui/EnrollmentFlow.tsx, components/ui/MembershipFlow.tsx, components/ui/MemberArea.tsx, components/ui/BriefFlow.tsx, lib/commerce/booking.ts, lib/commerce/card.ts, lib/commerce/membership.ts]
colores: []
fuentes: []
sector: [peluquería, gimnasio, academia, producto, agencia, estudio creativo]
guia: []
tono: []
paleta: []
tipografia: []
patrones: [reserva en pasos, compra en pasos, solicitud de plaza, lista de espera, alta de socio, petición de propuesta, resumen lateral, confirmación con referencia]
movimiento: []
piezas: [BookingFlow, AppointmentList, CheckoutFlow, EnrollmentFlow, MembershipFlow, MemberArea, BriefFlow, Stepper, TextField, Button]
piezas-nuevas: [BookingFlow, AppointmentList, CheckoutFlow, EnrollmentFlow, MembershipFlow, MemberArea, BriefFlow]
relacionados: [pieza-class-schedule, pieza-cohort-list, replica-cita, replica-melena, replica-nucleo, replica-ahora, replica-q47]
---

## Concepto

Las 18 inspiraciones necesitaban su flujo de negocio para poder enseñarse como plantillas (docs/56). Cinco flujos
cubren todos los sectores:

- **reservar** una cita;
- **comprar**;
- **pedir plaza** en una convocatoria;
- **darse de alta** en un plan;
- **pedir propuesta** o presupuesto.

Todos comparten la misma forma (`ui-book`):

- un `Stepper` arriba;
- un paso cada vez, con validación y error en `role="alert"`;
- el resumen al lado;
- una confirmación con referencia;
- el guardado en `localStorage` con `try/catch`;
- un `on…` para mandarlo a un servidor.

## Qué se hizo

| Pieza | Pasos | Dónde se probó |
|---|---|---|
| `BookingFlow` + `AppointmentList` | servicio → profesional → día y hora → datos; mis citas con anulación | Cita, Matiz, Patrón, Nura, Impulso |
| `CheckoutFlow` | bolsa → datos → envío o recogida → pago con tarjeta de prueba | Patrón, Melena, Lobo, Abuela Rosa |
| `EnrollmentFlow` | convocatoria → datos con nivel → señal; las completas y próximas, a lista de espera | Melena, Lobo, Remada, Ahora, Oficio |
| `MembershipFlow` + `MemberArea` | plan → datos con edad mínima → primer mes; pase QR, plazas y baja | Núcleo, Vive, Talla, Lobo |
| `BriefFlow` | qué necesitas (servicios, presupuesto, plazo) → el proyecto → datos | Ahora, Oficio, Q47, Cénit, Brasa |

## Aprendido

- Un solo juego de clases (`ui-book__options`, `__choices`, `__summary`) para todos los flujos hace que cada nuevo cueste
  poco y que el tema de cada inspiración los vista igual.
- `BriefFlow` salió al ver cuatro webs seguidas (Ahora, Oficio, Q47, Brasa) con un formulario de «cuéntanos» que
  `ContactForm` no cubría: elegir uno o varios servicios, un rango de presupuesto y un plazo.
- Los tests de flujo deben buscar los botones por un nombre exacto. «Añadir» casa con el «Añadir una unidad» de
  `QuantityStepper`, y una fecha casa con otra que la contiene («17.12» está dentro de «10.12 – 17.12»).

## Siguiente

Candidatas de docs/56 §7:

- ficha de caso;
- filtro de chips;
- subida de archivo con vista previa.
