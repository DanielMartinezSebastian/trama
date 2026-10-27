---
titulo: Núcleo, réplica de Core Atelier Pilates
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://coreatelierpilates.com/]
fichas: [docs/50 §3.4 E3a]
ruta: /inspiraciones/nucleo
codigo: [components/inspiraciones/nucleo/Nucleo.tsx, components/inspiraciones/nucleo/nucleo.css]
colores: [#f7e7de, #25140c, #7c5a48, #744c32]
fuentes: [Crimson Pro, Albert Sans]
sector: [gimnasio]
guia: [estudio boutique]
tono: [cálido, editorial, lujo discreto]
paleta: [fondo claro, tonos tierra]
tipografia: [serif con cursiva, titular partido en cursiva]
patrones: [acordeón con foto fija, tarjetas de sesión, horario de clases, foto a sangre]
movimiento: [foto fija, scroll suavizado, subrayado que crece]
piezas: [FeatureExplorer, ClassSchedule, SmoothScroll]
piezas-nuevas: []
relacionados: [estudio-gimnasio, pieza-class-schedule, demo-cadencia, replica-matiz, herramienta-probe-par]
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

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://coreatelierpilates.com/ http://localhost:3020/lab/estudios/nucleo --nombre nucleo` y la
sonda de estilos. Informe en `.refs3d/pares/nucleo/par.md`.

- **Antes, 14 de 20 medidas cerca.**
  - **Escala**: titular a 9 vw frente a 4,9; texto a 15 px frente a 18.
  - **Scroll**: el original usa Lenis.
  - **Hover**: «Sign in» tiene un subrayado que crece (`::before`) y una flecha que se desplaza (`::after`).
  - **Letras**: Minion Pro (de pago) y Albert Sans (libre).
- **Corregido**:
  - Crimson Pro (la alternativa libre más cercana a Minion) y Albert Sans, cargadas en la réplica;
  - titulares de 80 px (5,6 vw)/0,85 con −1 %, secciones de 70 px y texto de 18/1,39 con +0,8 %;
  - `SmoothScroll`;
  - el subrayado y la flecha de «Entrar».
- **Después, 13 de 14 medidas válidas.** Al corregir la sonda, el titular dejó de compararse: el «titular» del original era
  «careers», del menú cerrado. La primera pantalla de Core Atelier es una foto.

La sonda mejoró: el titular se busca solo entre lo visible (`checkVisibility` con opacidad).

## Aprendido en la iteración

- La flecha que se desplaza junto al subrayado que crece es la variante con dirección del mismo hover de navegación
  (Hair Me Up, Marco Ambrosi): una sola opción del kit puede cubrir las dos.

## Siguiente

- El área de socio (reservas, paquetes y pedidos) como página aparte.
