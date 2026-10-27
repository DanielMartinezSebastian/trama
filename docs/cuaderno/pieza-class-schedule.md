---
titulo: ClassSchedule, horario de clases con reserva
fecha: 2026-10-26
tipo: pieza
estado: hecho
referencias: [https://www.fenriz-gym.com/, https://coreatelierpilates.com/]
fichas: [docs/50 §2 E12, docs/CATALOG.md]
ruta: /componentes
codigo: [components/ui/ClassSchedule.tsx]
colores: []
fuentes: []
sector: [gimnasio]
guia: []
tono: []
paleta: []
tipografia: []
patrones: [horario de clases]
movimiento: []
piezas: [ClassSchedule]
piezas-nuevas: [ClassSchedule]
relacionados: [estudio-gimnasio, demo-cadencia, demo-forja, replica-lobo, replica-nucleo]
---

## Concepto

El horario de clases en días a partir de hoy, con filtros de disciplina y nivel, plazas, lista de espera y reservas. Se
muestra en lista o por semana.

## Qué se midió

- Tres gimnasios tienen horario de clases: Kursplan, Book y otro.
- Cadencia y Forja ya tenían el suyo hecho a mano.

## Qué se hizo

- `classes`, `daysAhead`, `startOffset`, `layout` (`list` o `week`).
- `filters`, `bookings`, `availableOn`, `defaultCategory`.
- `bookedHref`, `freePlaces`, `onBook` y las etiquetas.

## Aprendido

- Una pieza sacada de dos demos que ya la resolvían a mano nace con una API probada.

## Siguiente

Nada pendiente.
