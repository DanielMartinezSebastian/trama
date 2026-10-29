# Mis citas

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./appointment-list.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/AppointmentList.d.ts)
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

AppointmentList

## description

Las citas guardadas por BookingFlow en este navegador, por fecha: añadir al calendario, cambiar de día y anular con confirmación. Dentro de cutoffHours los cambios se cierran, como en una agenda real. Con la lista vacía, una invitación a reservar.

## category

formularios

## import

import AppointmentList from "trama-ui/AppointmentList";

## api

```json
{
  "module": "trama-ui/AppointmentList",
  "props": "React.ComponentProps<typeof AppointmentList>",
  "declaration": "types/components/ui/AppointmentList.d.ts",
  "packageDeclaration": "./dist/components/ui/AppointmentList.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "cutoffHours",
    "label": "Horas antes en que se cierran los cambios",
    "type": "number",
    "default": 24,
    "min": 0,
    "max": 72,
    "step": 1
  },
  {
    "key": "emptyTitle",
    "label": "Título sin citas",
    "type": "text",
    "default": "Aún no tienes citas"
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
  "Reserva una cita en la ficha de BookingFlow y aparece aquí (comparten `storageKey`).",
  "`bookHref` es la página de la reserva; «Cambiar» le añade `?editar=<id>`."
]
```

## requirements

```json
[
  "import \"trama-ui/styles.css\" una vez; tema/guía en contenedor.",
  "Misma clave y catálogo de servicios que BookingFlow; montar por navegación/remonte para releer citas."
]
```

## dependencies

```json
{
  "components": [
    "Button",
    "Icon"
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

import BookingFlow, { type Appointment, type BookingFlowProps, type BookingService, type BookingStaff } from "trama-ui/BookingFlow";
import AppointmentList from "trama-ui/AppointmentList";

export const services = [
  { id: "consulta", name: "Consulta inicial", minutes: 15, price: 0 },
  { id: "corte", name: "Corte", minutes: 45, price: 35 },
  { id: "color", name: "Color", minutes: 90, price: 65, from: true },
] satisfies BookingService[];
export const staff = [
  { name: "Alba", services: ["consulta", "corte", "color"] },
  { name: "Dani", services: ["consulta", "corte"] },
] satisfies BookingStaff[];
export const storageKey = "linde:pilot:v1";

// Muestras para dos rutas distintas: no montarlas esperando sincronización en vivo.
// El adaptador de /reservar valida la query y pasa estas props; no hay router aquí.
export function ReservationSample({ initialService, initialStaff, editId }: Pick<BookingFlowProps, "initialService" | "initialStaff" | "editId">) {
  const booked = (_appointment: Appointment) => { /* Solo notificación local; no confirma un servicio externo. */ };
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
  "useAppointments mantiene estado por instancia; no es un almacén reactivo compartido.",
  "Sin almacenamiento, la memoria de una instancia no garantiza persistencia al navegar a otra ruta."
]
```
