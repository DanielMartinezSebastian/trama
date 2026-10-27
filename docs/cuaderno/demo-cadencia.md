---
titulo: Cadencia reformada como estudio boutique
fecha: 2026-10-26
tipo: demo
estado: hecho
referencias: [https://fit-and-you.webflow.io/, https://coreatelierpilates.com/]
fichas: [docs/51, docs/50 §3.5]
ruta: /sitios/cadencia
codigo: [components/sites/cadencia/Site.tsx, components/sites/cadencia/redesign.css]
colores: [#173b33, #f6f4e9, #b9c9ba, #eed8a5, #274b40]
fuentes: [Fraunces, Manrope]
sector: [gimnasio]
guia: [estudio boutique]
tono: [cálido, cercano]
paleta: [fondo oscuro, tonos tierra]
tipografia: [serif con cursiva]
patrones: [lista gigante de nombres, foto fija, cinta de cifras, horario de clases, reserva propia, equipo con fotos]
movimiento: [foto fija, cinta que corre]
piezas: [ClassSchedule, Marquee, TeamSection, PricingSection, SectionHeader, FAQSection, Chart, QRCode]
piezas-nuevas: [ClassSchedule]
relacionados: [estudio-gimnasio, replica-vive, replica-nucleo, pieza-class-schedule, demo-forja]
---

## Concepto

El club de Codex (verde y vino, Fraunces, frecuencia de 1, 2 o 3 días) reformado con la guía «estudio boutique».

## Qué se midió

Nada nuevo. Se aplicaron las conclusiones de docs/50 §3.5.

## Qué se hizo

- Disciplinas como lista gigante con foto fija (de FIT AND YOU y Core Atelier).
- Cinta de cifras.
- Horario con `ClassSchedule`, que ganó `availableOn`, `defaultCategory`, `startOffset`, `bookedHref` y
  `waitlistedLabel`.
- Retratos en arcos con las imágenes de Codex.

## Diferencias con la referencia

No aplica.

## Aprendido

- Sacar una pieza de dos demos que ya la tenían a mano (horarios de Cadencia y Forja) da una API probada desde el
  primer día.

## Siguiente

Llamada principal «clase de prueba gratis» (pendiente según docs/50 §3.5).
