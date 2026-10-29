# Peluquería y color, estética

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./salon.json).

- [Guía seleccionada](../guides/salon.md)
- [ActionBar](../components/action-bar.md)
- [AppointmentList](../components/appointment-list.md)
- [ArticlesSection](../components/articles-section.md)
- [BeforeAfter](../components/before-after.md)
- [BookingFlow](../components/booking-flow.md)
- [Footer](../components/footer.md)
- [GuideFrame](../components/guide-frame.md)
- [ImageGallery](../components/image-gallery.md)
- [ImageReveal](../components/image-reveal.md)
- [MenuList](../components/menu-list.md)
- [NavBar](../components/navbar.md)
- [OpeningHours](../components/opening-hours.md)
- [PricingSection](../components/pricing-section.md)
- [ProductCard](../components/product-card.md)
- [SectionHeader](../components/section-header.md)
- [ShapeMosaic](../components/shape-mosaic.md)
- [TeamSection](../components/team-section.md)
- [TestimonialSection](../components/testimonial-section.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## recipe

```json
{
  "id": "salon",
  "sector": "Peluquería y color, estética",
  "guia": "salon",
  "cuando": "Un salón que vende oficio y calma: el equipo y los trabajos son el producto.",
  "secciones": [
    [
      "cabecera con la navegación que se subraya",
      [
        "NavBar"
      ]
    ],
    [
      "portada: titular fino y mosaico o collage de trabajos",
      [
        "ShapeMosaic",
        "ImageReveal"
      ]
    ],
    [
      "manifiesto corto",
      [
        "SectionHeader"
      ]
    ],
    [
      "carta de servicios en paquetes con lo que incluyen y el precio",
      [
        "MenuList",
        "PricingSection"
      ]
    ],
    [
      "equipo en filas: la fila entera lleva a reservar con esa persona",
      [
        "TeamSection"
      ]
    ],
    [
      "trabajos y antes y después",
      [
        "ImageGallery",
        "BeforeAfter"
      ]
    ],
    [
      "reseñas con nota",
      [
        "TestimonialSection"
      ]
    ],
    [
      "horario y locales",
      [
        "OpeningHours"
      ]
    ],
    [
      "noticias o tienda",
      [
        "ArticlesSection",
        "ProductCard"
      ]
    ],
    [
      "pie",
      [
        "Footer"
      ]
    ]
  ],
  "llamada": "Reservar (una píldora por local si hay varios), fija abajo con ActionBar",
  "noOlvidar": [
    "texto grande y ligero (24 px en Il Colorista), no 14",
    "consulta inicial gratis si luego reservas",
    "las palabras de fondo de cada sección (SectionHeader backdrop)"
  ],
  "replicas": [
    "matiz",
    "nura",
    "melena"
  ],
  "webs": [
    "hebra"
  ]
}
```

## sections

```json
[
  {
    "title": "cabecera con la navegación que se subraya",
    "components": [
      "navbar"
    ]
  },
  {
    "title": "portada: titular fino y mosaico o collage de trabajos",
    "components": [
      "shape-mosaic",
      "image-reveal"
    ]
  },
  {
    "title": "manifiesto corto",
    "components": [
      "section-header"
    ]
  },
  {
    "title": "carta de servicios en paquetes con lo que incluyen y el precio",
    "components": [
      "menu-list",
      "pricing-section"
    ]
  },
  {
    "title": "equipo en filas: la fila entera lleva a reservar con esa persona",
    "components": [
      "team-section"
    ]
  },
  {
    "title": "trabajos y antes y después",
    "components": [
      "image-gallery",
      "before-after"
    ]
  },
  {
    "title": "reseñas con nota",
    "components": [
      "testimonial-section"
    ]
  },
  {
    "title": "horario y locales",
    "components": [
      "opening-hours"
    ]
  },
  {
    "title": "noticias o tienda",
    "components": [
      "articles-section",
      "product-card"
    ]
  },
  {
    "title": "pie",
    "components": [
      "footer"
    ]
  }
]
```

## flow

F6: encargo sin referencias; elegir servicio y profesional, reservar y consultar/cambiar/anular una cita local.

## pages

```json
[
  {
    "path": "/",
    "purpose": "Presentación editorial de Linde y CTA a reservar; sin noticias ni tienda",
    "states": [
      "escritorio",
      "móvil",
      "teclado",
      "movimiento reducido"
    ]
  },
  {
    "path": "/reservar",
    "purpose": "Adaptar servicio/profesional/editar de query a props de BookingFlow",
    "states": [
      "selección",
      "sin hueco",
      "datos inválidos",
      "confirmación local"
    ]
  },
  {
    "path": "/mis-citas",
    "purpose": "AppointmentList con la misma clave y servicios; navegación/remonte entre rutas",
    "states": [
      "carga",
      "vacío",
      "citas",
      "cambio",
      "confirmar anulación",
      "cambios cerrados a 24 horas"
    ]
  }
]
```

## integrations

```json
[
  {
    "capability": "Persistencia",
    "status": "local",
    "note": "localStorage por origen; memoria temporal si no está disponible; sin sincronización entre instancias."
  },
  {
    "capability": "Disponibilidad, agenda, identidad, correo y cobro",
    "status": "pending",
    "note": "No hay servicios conectados. Slots de demostración incluyen ocupación ficticia."
  }
]
```

## assets

```json
[
  {
    "status": "pending",
    "note": "Dos imágenes propias o con licencia y dimensiones/alt fijados antes del consumidor visual; no usar /img/hebra/*."
  }
]
```

## requirements

```json
[
  "Versión exacta del paquete; leer guía y declaraciones antes de componer. Recursos y copy del consumidor fijados antes de medir."
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
  "Los ejemplos son muestras de API; las tres páginas y su recorrido aún no están construidos ni validados.",
  "Las referencias Hebra y las inspiraciones no son assets ni plantillas incluidas en npm."
]
```
