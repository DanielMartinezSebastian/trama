---
titulo: Raíz, réplica de Marco Ambrosi
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.marcoambrosi.salon/]
fichas: [docs/50 §3.2 E2e]
ruta: /lab/estudios/raiz
codigo: [components/lab/estudios/raiz/Raiz.tsx, components/lab/estudios/raiz/raiz.css]
colores: [#141618, #f2f0ed, #9aa0a6, #e0b183, #c98e58]
fuentes: [Playfair Display, Outfit]
sector: [peluquería]
guia: [barbería de carácter]
tono: [lujo discreto, especialista]
paleta: [fondo oscuro, acento metálico]
tipografia: [serif con cursiva]
patrones: [sellos de valoración, razones en tarjetas, comparación, servicios numerados, antes y después, rejilla de trabajos, clips verticales, reseñas, reserva por WhatsApp, reserva fija, titular con palabra en cursiva]
movimiento: [subrayado que crece]
piezas: [BeforeAfter, TestimonialSection]
piezas-nuevas: []
relacionados: [estudio-peluqueria, demo-esparta, herramienta-probe-par]
---

## Concepto

Un salón especialista en extensiones que vende confianza:
- oscuro con cobre;
- por qué ir a un profesional;
- la comparación «lo barato / lo bien hecho»;
- el antes y el después con tirador.

## Qué se midió

- Fondos #141618 y #1a1d20, tarjetas #202428 y cobre #e0b183.
- Playfair Display y Outfit 300.
- Tarjetas con borde fino y radio de 12 px.

## Qué se hizo

- Portada con una palabra en cobre y cursiva.
- Sellos y cuatro razones.
- Comparación con ✗ y ✓.
- Servicios con «desde».
- Antes y después con `BeforeAfter`.
- Trabajos y clips verticales.
- Reseñas con `TestimonialSection`.
- Reserva por WhatsApp, fija.

## Diferencias con la referencia

- Los clips no suenan al tocarlos.

## Aprendido

- `BeforeAfter` pone `before` a la izquierda: hay que pasar las fotos en ese orden. En la primera versión se cruzaron.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://www.marcoambrosi.salon/ http://localhost:3020/lab/estudios/raiz --nombre raiz` y la
sonda de estilos. Informe en `.refs3d/pares/raiz/par.md`.

- **Antes, 12 de 20 medidas cerca.**
  - **Letra**: Outfit 300, la del original, es libre; la réplica usaba Manrope.
  - **Escala**: Playfair va en peso 600, con titular de 69 px y secciones de 46 px; el texto, a 15–19 px con interlineado
    1,65 (la réplica iba a 13 px).
  - **Margen**: el contenido va en una columna de 1132 px (154 px a cada lado).
  - **Ritmo**: más aire entre secciones; la réplica tenía 7,8 pantallas frente a 11,5.
  - **Hover**: la navegación con el **subrayado que crece** (igual que Hair Me Up) y los botones que suben.
- **Corregido**: Outfit cargada en la réplica, las medidas, la columna de 1132 px, 130 px entre secciones y los hovers.
- **Después, 19 de 20.** Solo queda Arial, que el original usa en un detalle.

## Aprendido en la iteración

- El subrayado que crece ya está en dos peluquerías (Hair Me Up y Marco Ambrosi): pasa a candidato para `NavBar`.
- En webs oscuras de lujo discreto el texto va claro pero apagado (#9aa0a6, #c3c8cc), y solo los titulares en blanco
  roto: tres grises con papel propio.

## Siguiente

- Que los clips del salón en movimiento suenen al tocarlos.
