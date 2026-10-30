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

Se construyeron tres consumidores separados con el mismo paquete local congelado. QA completo comprobó rutas, imágenes, filtros, flujo y persistencia del pase, descarga, transiciones, axe WCAG 2.0 A/AA y anchos de 320/390/768/1440 px. `smoke` pasó en las tres portadas sin errores ni sombras.

## Qué se hizo

Cada dirección tiene una portada propia en `examples/demo-umbral/variantes/` además de su hoja temática en `examples/demo-umbral/app/variantes/`; `scripts/prepare-umbral-variantes.mts` materializa copias aisladas en `.cache/`. Fanzine organiza la historia como cubierta y columna editorial; Nocturno abre con una imagen a pantalla completa y estructura de sala; Cartel compone un afiche modular con fechas, fotografía y cartelera como bloques. Cada una corre en su propio puerto y comparte rutas, programa, compra de muestra y assets de la demo base.

## Diferencias con la referencia

No hay referencia externa: son interpretaciones visuales del mismo brief de UMBRAL y conservan parte de la paleta corporativa.

## Aprendido

La primera propuesta solo cambiaba la piel del mismo esqueleto y no satisfacía el encargo; las tres portadas nuevas sí parten de estructuras distintas. Las correcciones de color para sus fondos y componentes pasan axe, y los tres recorridos pasan responsive sin desbordamiento.

## Siguiente

Valorar las tres composiciones en `http://127.0.0.1:3436`, `:3437` y `:3438`.
