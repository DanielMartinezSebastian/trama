---
titulo: Tres estéticas para UMBRAL
fecha: 2026-10-30
tipo: demo
estado: hecho
referencias: []
fichas: [examples/demo-umbral/BRIEF.md]
ruta: http://127.0.0.1:3436
codigo: [examples/demo-umbral/variantes/README.md, examples/demo-umbral/app/variantes, scripts/prepare-umbral-variantes.mts]
colores: [#fff7f0, #2b1d1d, #2f5be0, #ffcf4a, #f4d4d4]
fuentes: [Georgia, Bricolage Grotesque, Instrument Sans]
sector: [cultura]
guia: [lúdico]
tono: [editorial, nocturno, festivo]
paleta: [fondo claro, pastel cálido, acento azul, acento amarillo, fondo oscuro]
tipografia: [serif editorial, titular gigante, etiquetas pixel]
patrones: [collage asimétrico, cartel tipográfico, programa filtrable, entrada con QR, portal geométrico]
movimiento: [marquesina lenta, movimiento reducido respetado]
piezas: [GuideFrame, Hero, Marquee, EventLineup, FAQSection, Footer, Button, TextField, QuantityStepper, Alert, QRCode, PageTransition]
piezas-nuevas: []
relacionados: [demo-umbral-skills]
---

## Concepto

Tres direcciones para el mismo festival inventado: Fanzine editorial, Club nocturno y Cartel constructivista. Se conservan el programa, la compra simulada, el motivo del portal y las visualizaciones conceptuales con asistentes.

## Qué se midió

Se construyeron tres consumidores separados con el mismo paquete local congelado y se probaron las rutas con smoke. Se revisaron capturas de escritorio; QA de axe y responsive encontró incidencias en las variantes fanzine/nocturno (contraste) y cartel (overflow de marquesina a 320 px), pendientes de corregir.

## Qué se hizo

Las hojas temáticas viven en `examples/demo-umbral/app/variantes/`; `scripts/prepare-umbral-variantes.mts` materializa copias aisladas en `.cache/`. Cada variante corre en su propio puerto y comparte el contenido y los assets de la demo base.

## Diferencias con la referencia

No hay referencia externa: son interpretaciones visuales del mismo brief de UMBRAL y conservan parte de la paleta corporativa.

## Aprendido

Smoke confirma HTTP 200 y ausencia de errores de navegador y sombras. Axe confirma que conviene revisar el contraste tras cambiar tokens; la marquesina infinita requiere una comprobación de overflow móvil en la variante cartel.

## Siguiente

Revisar las tres URLs y corregir contraste/overflow señalados por QA antes de considerar estas variantes cerradas.
