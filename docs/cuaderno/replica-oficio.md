---
titulo: Oficio, réplica de Honhar
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://honhar.in/]
fichas: [docs/50 §3.6 E6]
ruta: /lab/estudios/oficio
codigo: [components/lab/estudios/oficio/Oficio.tsx, components/lab/estudios/oficio/oficio.css]
colores: [#ffcc00, #000000, #ffffff, #3a2500]
fuentes: [Anton, Manrope]
sector: [academia]
guia: [escuela amarilla]
tono: [enérgico, lúdico, comercial]
paleta: [amarillo y negro]
tipografia: [brocha, condensada en mayúsculas]
patrones: [neobrutalismo, sombra dura desplazada, recuadros con borde, pizarra con personajes, sellos de valoración, cifras, palabras tachadas, programas por convocatoria, talleres, lanzamos pronto, primera clase gratis, testimonios]
movimiento: []
piezas: [CohortList]
piezas-nuevas: [CohortList]
relacionados: [estudio-academia, pieza-cohort-list, replica-ahora, replica-remada]
---

## Concepto

Formación profesional con neobrutalismo amarillo:
- recuadros con borde;
- botones blancos con sombra negra desplazada;
- titulares de brocha en mayúsculas;
- principios con la palabra vieja tachada.

## Qué se midió

- Librerías: GSAP y Lottie.
- Amarillo #ffcc00 y negro.
- Magic Brush para titulares y Montserrat para el texto.
- La escena de pollitos de la portada es una animación, no WebGL.

## Qué se hizo

- Pizarra con personajes.
- Sellos y cifras en recuadros.
- Principios tachados.
- Programas por promoción (`CohortList layout="cards"`).
- Talleres, «lanzamos pronto» y la masterclass gratis.
- Resultados.

## Diferencias con la referencia

- Anton sustituye a la letra de brocha: falta el trazo irregular.

## Aprendido

- El neobrutalismo cabe en los tokens del kit: borde con `--ln` y una sombra dura sin desenfoque. No hace falta una
  variante nueva.

## Siguiente

Medir el par y buscar una letra de brocha libre.
