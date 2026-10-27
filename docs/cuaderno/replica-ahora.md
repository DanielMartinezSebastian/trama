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
relacionados: [estudio-academia, pieza-team-section, replica-oficio, herramienta-probe-par]
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

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://futurelondonacademy.co.uk/ http://localhost:3020/lab/estudios/ahora --nombre ahora`
y la sonda de estilos. Informe en `.refs3d/pares/ahora/par.md`.

- **Antes, 10 de 19 medidas cerca.** Las secciones estaban todas, pero la escala y el apretado no:
  - OnyFuture va **siempre apretada**: titular a 6,7 vw/0,9 con −8 %, secciones a 66 px con −6 %, tarjetas a 40 px con
    −5 % y texto a 18/1,34 con −2 %;
  - la réplica iba a −3 % y con el texto a 12 px;
  - el margen es de 36 px;
  - el formato de los cursos va en gris #999.
- **Corregido**: las medidas, más aire entre secciones, la foto del grupo más alta y sin sombras.
- **Después, 18 de 19.** El largo de página no es comparable: la sonda mide FLA en 7,3 pantallas y el par en 22,4, porque
  la web no se desplaza bien con la rueda sintética (ya se vio en el estudio, docs/50 §3.6). La réplica tiene 8,4.

Segunda medida, con la sonda que solo mira lo visible: el titular de FLA entra palabra a palabra y va a −5 % con
interlineado 1 (10,8 vw en móvil), y la navegación cambia de color y saca un borde al pasar. Corregido: **19 de 20**.

## Aprendido en la iteración

- Un tracking negativo constante en todos los tamaños (−2 % en el texto, −8 % en el titular) es lo que hace reconocible
  una letra de marca como OnyFuture. Al sustituirla, hay que copiar el tracking además del tamaño.

## Siguiente

- El hover de las tarjetas solapadas, que se separan.
