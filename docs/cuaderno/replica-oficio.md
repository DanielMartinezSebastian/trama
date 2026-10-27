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
fuentes: [Permanent Marker, Montserrat]
sector: [academia]
guia: [escuela amarilla]
tono: [enérgico, lúdico, comercial]
paleta: [amarillo y negro]
tipografia: [brocha, espaciado abierto]
patrones: [neobrutalismo, sombra dura desplazada, recuadros con borde, pizarra con personajes, sellos de valoración, cifras, palabras tachadas, programas por convocatoria, talleres, lanzamos pronto, primera clase gratis, testimonios]
movimiento: []
piezas: [CohortList]
piezas-nuevas: [CohortList]
relacionados: [estudio-academia, pieza-cohort-list, replica-ahora, replica-remada, herramienta-probe-par]
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

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://honhar.in/ http://localhost:3020/lab/estudios/oficio --nombre oficio --limite 150`,
la sonda de estilos y la tira del original. Informe en `.refs3d/pares/oficio/par.md`.

- **Medir esta web costó tres arreglos en la sonda.** Las tres mejoras sirven para cualquier web:
  1. **Se colgaba más de 20 minutos**: al cerrar el contexto con la página colgada, el cierre esperaba para siempre.
     Ahora hay un límite por página (`--limite`, 180 s por defecto), el cierre no espera más de 5 s y el proceso sale al
     terminar.
  2. **Navegaba fuera**: aceptar avisos con la lista `AVISO` del cine («explore», «start»…) pulsaba «Explore programs».
     Ahora `refs:probe` solo acepta avisos de cookies y solo en botones o enlaces que no navegan.
  3. **Comparaba un titular que no existe**: la primera pantalla de Honhar es una escena animada, y lo mayor es la
     navegación a 16 px. Si el original no tiene titular de 24 px o más, la comparación pasa a informativa.
- **La letra estaba al revés.** Honhar usa una brocha (Magic Brush) con espaciado **abierto** (del 2 al 8,7 %), y la
  réplica usaba Anton, condensada.
  - Se cargan **en la réplica, no en el kit**, Permanent Marker (rotulador de trazo seco) y Montserrat, como el original.
  - Medidas: titulares de 60–64 px, tarjetas de 34 px, texto a 20 px y botones en brocha a 22 px con radio de 8 px.
- **Faltaba el final**:
  - «Hemos estado presentes en», en negro con foto;
  - «Sé mentor»;
  - «Aprendizaje sin límites», con una tarjeta blanca y otra negra;
  - el lema con las dos **señales de flecha** sobre «Inscríbete» en contorno gigante;
  - el pie oscuro con mapa.
- Hover de los enlaces y margen de 42 px.
- **Después, 9 de 12 medidas válidas.** Quedan la letra, el ancho que cambia en el hover del original y el logo en móvil.

## Aprendido en la iteración

- Una letra propia de una sola web se carga en la réplica (`next/font` en el componente), no en el kit: el kit solo
  recibe letras que sirvan a varias familias de estilo, como Antonio.
- Un botón blanco con texto que hereda el color sale blanco sobre blanco en las secciones oscuras: en neobrutalismo, el
  color del botón se fija.

## Siguiente

- La escena de los pollitos (Lottie en el original) como animación CSS.
- El muro de vídeos de los alumnos en blanco y negro.
