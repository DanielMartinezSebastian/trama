---
titulo: Núcleo, réplica de Core Atelier Pilates
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://coreatelierpilates.com/]
fichas: [docs/50 §3.4 E3a]
ruta: /lab/estudios/nucleo
codigo: [components/lab/estudios/nucleo/Nucleo.tsx, components/lab/estudios/nucleo/nucleo.css]
colores: [#f7e7de, #25140c, #7c5a48, #744c32]
fuentes: [Cormorant Garamond, Inter]
sector: [gimnasio]
guia: [estudio boutique]
tono: [cálido, editorial, lujo discreto]
paleta: [fondo claro, tonos tierra]
tipografia: [serif con cursiva, titular partido en cursiva]
patrones: [acordeón con foto fija, tarjetas de sesión, horario de clases, foto a sangre]
movimiento: [foto fija]
piezas: [FeatureExplorer, ClassSchedule]
piezas-nuevas: []
relacionados: [estudio-gimnasio, pieza-class-schedule, demo-cadencia, replica-matiz]
---

## Concepto

El «salón editorial» llevado al pilates:
- rosa empolvado, marrón y casi negro;
- titulares en serif con la mitad en cursiva;
- un acordeón de aparatos en el que cada pestaña abierta cambia la foto fijada al lado.

## Qué se midió

- Librerías: GSAP, Lenis y Barba.
- Colores #f7e7de, #744c32 y #25140c.
- Minion Pro con la mitad del titular en cursiva; Albert Sans de 16 a 18 px; etiquetas en mayúsculas de 13 px.

## Qué se hizo

- Acordeón con `FeatureExplorer`.
- Sesiones privadas en tres tarjetas.
- Horario con reserva (`ClassSchedule`).

## Diferencias con la referencia

- No tiene la transición de Barba entre páginas.
- La réplica es una sola página; el original tiene área de socio.

## Aprendido

- `FeatureExplorer` ya cubre el acordeón que cambia la foto fija: no hizo falta pieza nueva.

## Siguiente

Medir el par.
