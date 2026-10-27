---
titulo: Remada, réplica de Surfing Academy
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://surfing.academy/]
fichas: [docs/50 §3.6 E4]
ruta: /inspiraciones/remada
codigo: [components/inspiraciones/remada/Remada.tsx, components/inspiraciones/remada/remada.css]
colores: [#ededed, #17191a, #ff4f28, #39be91]
fuentes: [Onest, Inter, Playfair Display]
sector: [academia]
guia: [academia de autor]
tono: [cercano, personal, lúdico]
paleta: [fondo claro, dos acentos]
tipografia: [minúsculas, títulos entre paréntesis]
patrones: [autor como marca fija, ilustración de línea, programas por convocatoria, billete troquelado, principios con foto, cifras, primera clase gratis, sombra dura desplazada, testimonios, vlogs, preguntas frecuentes, formulario de contacto]
movimiento: [trazo que se dibuja, scroll suavizado]
piezas: [CohortList, LineDraw, FAQSection, ContactForm, SmoothScroll]
piezas-nuevas: [CohortList]
relacionados: [estudio-academia, pieza-cohort-list, replica-oficio, herramienta-probe-par]
---

## Concepto

La academia de una persona: la marca es la autora, con su avatar fijo arriba. Todo va en minúsculas, con títulos entre
paréntesis y asteriscos, garabatos a mano y viajes por convocatoria.

## Qué se midió

- Librería: Lenis.
- Colores #ededed, naranja #ff4f28 y verde #39be91.
- Hauora en minúsculas a 16 px, con titulares de 40 a 64 px.
- Botones con sombra dura desplazada.
- En móvil, el avatar fijo tapa el contenido: es un fallo del original.

## Qué se hizo

- Avatar fijo.
- Dibujo de línea con `LineDraw`.
- Viajes por convocatoria con `CohortList layout="rows"`.
- «Sobre mí» como billete troquelado.
- Principios, cifras y la primera clase regalada.
- Opiniones.
- Chat flotante abajo a la derecha.

## Diferencias con la referencia

- El dibujo de cuatro surfistas es más simple: son trazos de `LineDraw`, no una ilustración.

## Aprendido

- La convocatoria (destino, nivel, fechas por mes, estado) se repetía en las tres academias. Merecía pieza: `CohortList`.
- El avatar fijo no debe tapar el contenido en móvil. La réplica lo encoge a 46 px y lo arrima a la esquina (27-10-2026).

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://surfing.academy/ http://localhost:3020/lab/estudios/remada --nombre remada`, la sonda
de estilos y la tira del original. Informe en `.refs3d/pares/remada/par.md`.

- **Antes, 6 de 16 medidas cerca, y 5,5 pantallas frente a 13,9.** Faltaba la segunda mitad de la web:
  - los vlogs;
  - «freedom, humor, friendship», con fotos sueltas y un trazo;
  - las preguntas frecuentes;
  - «contacts» gigante con el formulario sobre naranja;
  - el pie con la navegación y los destinos.
- **Otras diferencias**:
  - Hauora va en peso **400 sin tracking** (titular de 100 px, 6,9 vw), y la réplica usaba 600 con −3 %;
  - los destinos van a 45 px;
  - el margen es de 120 px (34 en móvil);
  - el original usa Lenis.
- **Corregido**: el final completo con `FAQSection`, `ContactForm` y `LineDraw`; las medidas; `SmoothScroll`; y el avatar
  fijo más pequeño en móvil.
- **Después, 15 de 16.** Solo queda la letra (Hauora es de pago; Onest la sustituye).

## Aprendido en la iteración

- La academia de autor alarga la web con contenido personal (vlogs, fotos de grupo, preguntas): la marca es la persona y
  su comunidad. En la plantilla de academia de autor, ese tramo es obligatorio.

## Siguiente

- La tarjeta verde de «mi misión» con la foto de la ola.
