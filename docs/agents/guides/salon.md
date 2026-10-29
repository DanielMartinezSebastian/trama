# Salón editorial claro

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./salon.json).

- [GuideFrame y API](../components/guide-frame.md)
- [Índice piloto](../README.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## guide

```json
{
  "id": "salon",
  "source": "sectores",
  "label": "Salón editorial claro",
  "note": "Blanco y gris claro con un pastel cálido, serifa muy fina y texto grande y ligero; formas o fotos de trabajos como único adorno.",
  "sectors": "Peluquería y color, estética, estudio de belleza, floristería",
  "refs": [
    "Il Colorista",
    "ALICE Hair & Art",
    "Hair Me Up"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#1f1f1f",
    "mut": "#868686",
    "acc": "#f5a490",
    "acc2": "#963e13",
    "card": "#f4f4f4",
    "ln": "rgba(31,31,31,0.14)",
    "r": 0,
    "font": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "accentFont": "var(--font-cormorant-garamond), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "body": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-cormorant-garamond), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3.5rem, 8.7vw, 8rem)",
    "h1": "clamp(2.5rem, 5vw, 4.5rem)",
    "h2": "clamp(2.25rem, 7.6vw, 6.875rem)",
    "body": "clamp(1rem, 0.8rem + 0.7vw, 1.5rem)",
    "label": "0.8125rem",
    "weight": 300,
    "lineHeight": 1.1,
    "tracking": 0,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.58
  },
  "space": {
    "margin": "24px",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(96px, 10vw, 160px)",
    "header": "138px",
    "measure": "28em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 1,
    "page": 0.9,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "asym-editorial",
    "collage-manifesto"
  ],
  "stories": [
    "service",
    "manifesto"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"salon\">",
  "css": "trama-ui/styles.css",
  "classes": [
    "ui-g-body",
    "ui-g-brand",
    "ui-g-btn",
    "ui-g-btn--ghost",
    "ui-g-card",
    "ui-g-grid",
    "ui-g-h1",
    "ui-g-h2",
    "ui-g-header",
    "ui-g-label",
    "ui-g-line",
    "ui-g-mono",
    "ui-g-muted",
    "ui-g-rise",
    "ui-g-section",
    "ui-g-wrap"
  ],
  "fontVariables": [
    "--font-cormorant-garamond",
    "--font-geist-mono",
    "--font-manrope"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,48:1 | texto normal |
| --fg | --card | 14,99:1 | texto normal |
| --mut | --bg | 3,64:1 | solo texto grande, iconos o bordes de control |
| --mut | --card | 3,31:1 | solo texto grande, iconos o bordes de control |
| --acc | --bg | 1,98:1 | decorativo: no usar para texto ni controles |
| --acc | --card | 1,80:1 | decorativo: no usar para texto ni controles |
| --acc2 | --bg | 7,01:1 | texto normal |
| --acc2 | --card | 6,37:1 | texto normal |

## requirements

```json
[
  "En Next.js: fuentes requeridas desde trama-ui/fonts en layout de servidor, transpilePackages: ['trama-ui']; verificar build y carga con next/font/google.",
  "Usar las clases ui-g-* para escala y composición; pasar variante sugerida a las piezas que la admitan.",
  "Nombrar las fuentes por su variable (`var(--font-cormorant-garamond)`, ver fontVariables) o heredarlas de ui-g-*; el nombre literal ('Cormorant') no coincide con la familia que registra next/font y cae a una fuente del sistema.",
  "Los pares de `contrast` por debajo de 4,5:1 no sirven para texto normal tal cual: oscurecer ese rol en un tema local (style con --mut/--acc) y registrar la razón; las piezas del kit usan --mut y --acc para etiquetas, metadatos y botones."
]
```

## Ejemplos

### salon-style

La generación no acredita compilación o navegador; validar tipos, build y recorrido en el proyecto consumidor. Los ensayos del paquete se registran en el informe de entrega.

```tsx
import GuideFrame from "trama-ui/GuideFrame";
import SectionHeader from "trama-ui/SectionHeader";
import Button from "trama-ui/Button";
import { guide } from "trama-ui";
import "trama-ui/styles.css";

export default function SalonStyleSample() {
  const selected = guide("salon");
  return (
    <GuideFrame guide={selected}>
      <main className="ui-g-wrap ui-g-section">
        <h1 className="ui-g-brand">Linde</h1>
        <p className="ui-g-body">Corte y color. Tiempo para escucharte.</p>
        <SectionHeader title="Oficio, sin prisa." kicker="EL SALÓN" subtitle="Un salón ficticio para probar Trama." backdrop="oficio" variant={selected.variant} />
        <Button label="Reservar una cita de prueba" href="/reservar" variant={selected.variant} />
      </main>
    </GuideFrame>
  );
}
```

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

### salon-fonts

La generación no acredita compilación o navegador; validar tipos, build y recorrido en el proyecto consumidor. Los ensayos del paquete se registran en el informe de entrega.

```tsx
// Muestra de layout de servidor para Next.js; el build del consumidor queda pendiente.
import type { ReactNode } from "react";
import { fontVariables } from "trama-ui/fonts";
import "trama-ui/styles.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es" className={fontVariables}><body>{children}</body></html>;
}
```

## limitations

```json
[
  "La tabla de contraste mide tokens sobre fondos lisos; revisar la aplicación visual en cada proyecto (imágenes, transparencias, estados). Una guía no certifica accesibilidad.",
  "Fotos, vídeos y fuentes Fontshare no se redistribuyen por esta ficha.",
  "No se declara soporte universal de Next.js o de React genérico a partir de un consumidor piloto."
]
```
