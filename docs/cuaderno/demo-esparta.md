---
titulo: Esparta reformada como barbería de carácter
fecha: 2026-10-26
tipo: demo
estado: hecho
referencias: [https://don-barber.gr/en, https://www.myrendezvous.ca/]
fichas: [docs/51, docs/50 §3.3]
ruta: /sitios/esparta
codigo: [components/sites/esparta/Site.tsx, components/sites/esparta/redesign.css]
colores: [#eee8db, #1f2e3a]
fuentes: [Anton, Archivo, Instrument Serif]
sector: [barbería]
guia: [barbería de carácter]
tono: [clásico, urbano]
paleta: [fondo claro, apagada]
tipografia: [gótica condensada, titular gigante]
patrones: [cinta de texto, equipo con fotos, retratos B/N, reserva por persona, botones en óvalo, reserva propia, menú lateral]
movimiento: [cinta que corre]
piezas: [TeamSection, Marquee, PricingSection, Stepper, DatePicker, ActionBar, OpeningHours]
piezas-nuevas: [TeamSection]
relacionados: [estudio-peluqueria, replica-patron, replica-cita, demo-hebra]
---

## Concepto

La barbería de Codex (navegación lateral azul tinta, fondo de papel, ticket del ritual) reformada con la guía «barbería
de carácter».

## Qué se midió

Nada nuevo. Se aplicaron las conclusiones de docs/50 §3.3.

## Qué se hizo

- Titulares en gótica condensada (Anton).
- Cintas de texto.
- «La familia» en óvalos en blanco y negro, con biografía y reserva por barbero (`TeamSection shape="oval"`).
- Botones en óvalo.
- Imágenes de Codex: navaja y sillón.

## Diferencias con la referencia

No aplica.

## Aprendido

- Una letra con carácter cambia la demo más que cualquier efecto.
- `TeamSection shape="oval"` nació aquí y en Don Barber.

## Siguiente

Comparar con Patrón.
