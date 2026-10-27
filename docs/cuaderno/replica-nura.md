---
titulo: Nura, réplica de ALICE Hair & Art
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.alicehairart.se/]
fichas: [docs/50 §3.2 E2a]
ruta: /inspiraciones/nura
codigo: [components/inspiraciones/nura/Nura.tsx, components/inspiraciones/nura/nura.css]
colores: [#f5f5f5, #121212, #5c5c5c, #dedede]
fuentes: [Geist, Inter]
sector: [peluquería]
guia: [salón editorial claro]
tono: [editorial, sobrio, artístico]
paleta: [fondo claro, grises con grano]
tipografia: [una sola letra, grotesca en mayúsculas]
patrones: [collage de fotos, equipo en filas, reserva por persona, barra inferior fija, sala de exposición]
movimiento: [desenfoque al bajar]
piezas: [GradientField, TeamSection]
piezas-nuevas: [TeamSection]
relacionados: [estudio-peluqueria, pieza-team-section, demo-hebra, herramienta-probe-par]
---

## Concepto

Un salón que también es galería. Una sola letra pequeña en mayúsculas para todo y grises con grano; el color lo ponen las
fotos y los cuadros. Las fotos del collage se desenfocan y se funden al bajar.

## Qué se midió

- Px Grotesk a 14 px, en mayúsculas, con espaciado de 0,1 em.
- Grises #f5f5f5, #f0f0f0 y #dedede; texto #121212.

## Qué se hizo

- Collage suelto con un desenfoque ligado al scroll.
- Manifiesto.
- Equipo en filas con biografía y reserva por persona (`TeamSection layout="rows"`).
- La sala con obras generativas hechas con `GradientField`.
- Barra inferior fija.

## Diferencias con la referencia

- Falta el conmutador «Hair / & Art» con la barra que se rellena.
- Px Grotesk está sustituida por Geist.

## Aprendido

- `RetroShapes` necesita lienzo propio. Para «arte» generativo dentro de una tarjeta basta `GradientField`.
- Una sola letra a 14 px aguanta una web entera si el contraste y el espaciado son buenos.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://www.alicehairart.se/ http://localhost:3020/lab/estudios/nura --nombre nura`, la
sonda de estilos y los bordes izquierdos de la réplica. Informe en `.refs3d/pares/nura/par.md`.

- **Antes, 6 de 11 medidas válidas.** La primera pantalla de ALICE es un collage sin titular, así que el titular no se
  compara.
  - **Margen**: ALICE pega todo a **8 px** del borde, y la réplica iba a 12.
  - **Equipo**: las filas van a todo el ancho, de 348 px de alto sobre #dedede, y cada fila **entera es un enlace** con el
    nombre que se subraya al pasar.
  - **Barra fija**: once elementos con hover; los seis accesos de la barra de abajo se rellenan (fondo y una raya que
    crece).
- **Corregido**: márgenes de 8 px, filas de 348 px (520 en móvil), los hovers de la barra, el nombre, «ver todo» y el
  botón del formulario.
- **Después, 7 de 11.** Quedan:
  - la letra (Px Grotesk es de pago);
  - el margen medido, que sale a 224 px porque en la réplica la biografía va en la segunda columna y el enlace es un
    botón, mientras que en ALICE la fila entera es el enlace pegado al borde;
  - el número de hovers (4 frente a 11).

## Aprendido en la iteración

- `TeamSection layout="rows"` no permite que la fila entera sea el enlace (`rowLink`). En las peluquerías con reserva por
  persona es lo natural: toda la fila lleva a reservar con esa persona.

## Después de ampliar el kit (27-10-2026)

`TeamSection rowLink` (nuevo): la fila entera es el enlace de reserva y el nombre se subraya al pasar. Con él, el margen
coincide (8 px) y el par sube a **8 de 11**.

## Revisión en móvil (27-10-2026)

- En móvil la réplica salía 760 px más abajo, con un hueco negro encima. El `margin-top: 90svh` del manifiesto (lo
  único que no es `absolute` en la portada) atravesaba la portada y `.nu`. Se arregla con `display: flow-root` en la
  portada. El par no lo detectaba: el margen y el largo de página daban cerca.
- La barra fija de cuatro accesos ocupaba dos filas en móvil y tapaba el texto. ALICE deja una sola línea, así que aquí
  quedan Info y Arriba.
- La letra (Px Grotesk) es de pago; Geist es la libre más cercana y la medida de familias seguirá en «lejos».
- Hover del primer pantallazo: Pelo y & Arte se rellenan de negro, como Hair e Info, y la calle es un enlace que se
  subraya. El par sube a **10 de 11**; solo queda la letra.

## Siguiente

- El conmutador «Hair / & Art» con la barra que se rellena.
