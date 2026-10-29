# Reserva de cita

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./booking-flow.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/BookingFlow.d.ts)
- [Índice piloto](../README.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## component

BookingFlow

## description

Reserva de cita en pasos (peluquería, barbería, estética, consulta): local si hay varios, servicio y profesional (o «me da igual»); día y hueco con DatePicker; datos con validación; y confirmación con «Añadir al calendario». Los huecos dependen de la duración del servicio, del cierre de cada día y de las citas ya guardadas, y un resumen al lado sigue la elección. Guarda en localStorage con useAppointments (lib/commerce/booking); no envía nada.

## category

formularios

## import

import BookingFlow from "trama-ui/BookingFlow";

## api

```json
{
  "module": "trama-ui/BookingFlow",
  "props": "React.ComponentProps<typeof BookingFlow>",
  "declaration": "types/components/ui/BookingFlow.d.ts",
  "packageDeclaration": "./dist/components/ui/BookingFlow.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "places",
    "label": "Varios locales",
    "type": "boolean",
    "default": false,
    "noCode": true
  },
  {
    "key": "staffLabel",
    "label": "Título de la elección de profesional",
    "type": "text",
    "default": "¿Con quién?"
  },
  {
    "key": "anyStaffLabel",
    "label": "Opción «me da igual»",
    "type": "text",
    "default": "Me da igual"
  },
  {
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "minimal",
    "options": [
      "glass",
      "solid",
      "outline",
      "neon",
      "retro",
      "terminal",
      "minimal",
      "dotmatrix",
      "editorial"
    ],
    "hint": "Cambia superficie, borde, radio, sombra y tipografía"
  }
]
```

## notes

```json
[
  "Datos: `services` (id, name, minutes, price, description), `staff` (name, role, photo, `services` que hace, `places` donde trabaja) y `places` opcional. Huecos: `times`, `closedDays`, `closesAt` ({ 6: \"14:00\" }), `min` y `max`.",
  "Desde una carta o una ficha: `initialService`, `initialStaff` e `initialPlace` (de `?servicio=`); reprogramar con `editId` (de `?editar=`, el enlace «Cambiar» de AppointmentList).",
  "Misma `storageKey` en BookingFlow y AppointmentList. Ver /inspiraciones/cita/reservar (cinco locales) y docs/56."
]
```

## requirements

```json
[
  "import \"trama-ui/styles.css\" una vez; tema/guía en contenedor.",
  "services no vacío y staff compatible con sus servicios; mismos services/storageKey que AppointmentList.",
  "El adaptador de página lee query; pasar initialService, initialStaff y editId explícitamente."
]
```

## dependencies

```json
{
  "components": [
    "Button",
    "DatePicker",
    "Icon",
    "Stepper",
    "TextField"
  ],
  "packages": [
    {
      "name": "pixelarticons",
      "version": "^2.4.1"
    },
    {
      "name": "react",
      "version": "^19.3.0"
    }
  ]
}
```

## Ejemplos

### salon-booking

La generación no acredita compilación o navegador; validar tipos, build y recorrido en el proyecto consumidor. Los ensayos del paquete se registran en el informe de entrega.

```tsx
"use client";

import type { ComponentProps } from "react";
import BookingFlow from "trama-ui/BookingFlow";
import AppointmentList from "trama-ui/AppointmentList";

type BookingProps = ComponentProps<typeof BookingFlow>;
type Booked = Parameters<NonNullable<BookingProps["onBooked"]>>[0];

export const services = [
  { id: "consulta", name: "Consulta inicial", minutes: 15, price: 0 },
  { id: "corte", name: "Corte", minutes: 45, price: 35 },
  { id: "color", name: "Color", minutes: 90, price: 65, from: true },
] satisfies BookingProps["services"];
export const staff = [
  { name: "Alba", services: ["consulta", "corte", "color"] },
  { name: "Dani", services: ["consulta", "corte"] },
] satisfies BookingProps["staff"];
export const storageKey = "linde:pilot:v1";

// Muestras para dos rutas distintas: no montarlas esperando sincronización en vivo.
// El adaptador de /reservar valida la query y pasa estas props; no hay router aquí.
export function ReservationSample({ initialService, initialStaff, editId }: Pick<BookingProps, "initialService" | "initialStaff" | "editId">) {
  const booked = (_appointment: Booked) => { /* Solo notificación local; no confirma un servicio externo. */ };
  return <BookingFlow services={services} staff={staff} storageKey={storageKey}
    initialService={initialService} initialStaff={initialStaff} editId={editId}
    times="10:00,11:00,12:00,13:00,16:00,17:00,18:00" closedDays="0,1" closesAt={{ 6: "14:00" }} min={1} max={45}
    business="Linde (demostración)" location="Local ficticio" appointmentsHref="/mis-citas"
    serviceLabel="Elige tu servicio" staffLabel="Elige profesional" anyStaffLabel="Quien tenga hueco" placeLabel="El salón"
    note="Demostración: la cita solo se guarda en este navegador. No se envían correos ni se contacta con un salón."
    onBooked={booked} variant="editorial" />;
}

export function AppointmentsSample() {
  return <section aria-label="Citas de demostración">
    <p>Solo citas locales de prueba; sin agenda conectada.</p>
    <AppointmentList services={services} storageKey={storageKey} bookHref="/reservar" cutoffHours={24}
      business="Linde (demostración)" location="Local ficticio" emptyTitle="Aún no hay citas de prueba"
      emptyText="Reserva con datos ficticios. La cita se guarda en este navegador." variant="editorial" />
  </section>;
}
```

## limitations

```json
[
  "Solo reserva local; onBooked se invoca después de guardar y mostrar confirmación, sin transacción ni error asíncrono de agenda.",
  "El correo se valida pero no se guarda ni forma parte de Appointment/onBooked.",
  "La ocupación de demostración no acredita disponibilidad real ni concurrencia multiusuario."
]
```
