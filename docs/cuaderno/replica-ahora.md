---
titulo: Ahora, réplica de Future London Academy
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://futurelondonacademy.co.uk/]
fichas: [docs/50 §3.6 E5]
ruta: /lab/estudios/ahora
codigo: [components/lab/estudios/ahora/Ahora.tsx, components/lab/estudios/ahora/ahora.css]
colores: [#ffffff, #1a1a1a, #ffe32b, #f1f1f1]
fuentes: [Space Grotesk, Inter]
sector: [academia]
guia: [escuela amarilla]
tono: [institucional, editorial, enérgico]
paleta: [fondo claro, amarillo y negro]
tipografia: [una sola letra, grotesca en mayúsculas, letra de contorno]
patrones: [letra gigante de líneas, muro de profesores, tarjetas solapadas, lista de cursos a todo el ancho, testimonios, muro de logos, boletín]
movimiento: [trazo que se dibuja]
piezas: [LineDraw, TeamSection]
piezas-nuevas: [TeamSection]
relacionados: [estudio-academia, pieza-team-section, replica-oficio]
---

## Concepto

Una escuela de diseño y negocio:
- amarillo y negro;
- una sola letra en mayúsculas, y la misma en contorno para el formato;
- una letra gigante de líneas;
- 200 profesores en un muro.

## Qué se midió

- Amarillo #ffe32b, negro #1a1a1a y gris #f1f1f1.
- OnyFuture a 40 px con espaciado de −2 px.

## Qué se hizo

- Una A gigante de líneas que se dibuja (`LineDraw`).
- Muro de profesores (`TeamSection layout="wall"`, nuevo).
- Cursos destacados en tarjetas amarillas que se solapan.
- Lista de cursos con el formato en contorno.
- Testimonio, logos y boletín.

## Diferencias con la referencia

- La letra gigante es una A, no una F, porque la marca cambia.

## Aprendido

- El muro denso de retratos se repite en academias y equipos grandes: pasó a `TeamSection` como disposición.

## Siguiente

Medir el par.
