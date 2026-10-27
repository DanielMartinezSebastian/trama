---
titulo: Matiz, réplica de Il Colorista
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://ilcolorista.salon/]
fichas: [docs/50 §3.1]
ruta: /lab/estudios/matiz
codigo: [components/lab/estudios/matiz/Matiz.tsx, components/lab/estudios/matiz/matiz.css]
colores: [#ffffff, #2b2b2b, #f5a490, #f8c4b6, #1e1e1e]
fuentes: [Cormorant Garamond, Manrope]
sector: [peluquería]
guia: [salón editorial claro]
tono: [editorial, cálido, artesanal]
paleta: [fondo claro, pastel cálido]
tipografia: [serif fina, minúsculas]
patrones: [mosaico de formas, menú a pantalla completa, carrusel de tratamientos, equipo con fotos, retratos B/N, noticias en rejilla, carta de servicios]
movimiento: [fotos que se disuelven, filetes que se dibujan, enlaces que suben escalonados]
piezas: [ShapeMosaic, FullscreenMenu, MenuList, TeamSection]
piezas-nuevas: [ShapeMosaic, FullscreenMenu]
relacionados: [estudio-peluqueria, pieza-shape-mosaic, pieza-fullscreen-menu, demo-hebra, herramienta-probe-par]
---

## Concepto

Un atelier de color que se presenta con geometría: círculos y cuadrados salmón con fotos de trabajos dentro. Al bajar,
las fotos se disuelven en color liso. Serif fina, mucho aire y la carta de servicios como menú de restaurante.

## Qué se midió

- Mapa de escritorio y móvil, y `refs:probe`.
- Interacción: scroll, menú, transición de Highway y páginas internas.
- Escala tipográfica 14 · 21 · 24 · 40 · 72–110.
- Cormorant 200 en titulares, a 5 vw con interlineado 1,1.

## Qué se hizo

- Portada con `ShapeMosaic` (nueva).
- Manifiesto en gris.
- Carrusel de tratamientos.
- Equipo en círculos en blanco y negro (`TeamSection shape="circle" photoTone="mono"`).
- Noticias en una rejilla de 4.
- Carta de paquetes con `MenuList`.
- Menú oscuro con filetes (`FullscreenMenu rules`).

## Diferencias con la referencia

- Falta la transición entre páginas con el mechón de la marca en el centro. Está pendiente en el kit (E12).
- No están las pinceladas de acuarela de la cabecera de servicios: son decorado de la marca.
- Las fotos son provisionales, del repo, hasta que lleguen las de Codex.

## Aprendido

- `FullscreenMenu` copia los tokens del botón que lo abre. Los tokens oscuros del menú van en un antepasado del botón, no
  en el menú.
- La firma de una web única puede merecer pieza si es versátil: el mosaico vale para cualquier marca geométrica.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://ilcolorista.salon/ http://localhost:3020/lab/estudios/matiz --nombre matiz` y la sonda
de estilos. Informe en `.refs3d/pares/matiz/par.md`.

- **Antes, 13 de 20 medidas cerca.** Lo que fallaba era la escala:
  - el texto del original va a **24 px**/1,58 (Karla 200), y la réplica a 11 px;
  - los títulos de sección van a 110 px y los nombres del equipo a 60 px;
  - la cabecera mide 138 px, con el logo grande;
  - el mosaico de la portada tiene celdas de unos **350 px** en tres columnas que se salen por la derecha, y la réplica
    hacía cuatro columnas de 210 px.
- Lo corregido:
  - esas medidas, con Manrope 200 como sustituta de Karla;
  - el mosaico geométrico entero sobre el gris #f4f4f4;
  - los colores de texto #1f1f1f y #868686;
  - la portada fija a una pantalla con el titular centrado;
  - en móvil, el mosaico en dos columnas bajo el titular;
  - hover en los enlaces.
- **Después, 16 de 19.** Lo que queda:
  - **Familias**: la réplica tiene Manrope y Cormorant, y el original solo cuenta Karla porque los nombres en Cormorant
    no llegan al mínimo de caracteres.
  - **Margen**: es una medida débil en esta página.
  - **Fondos**: la réplica lleva en la portada la carta crema, que en el original vive en otra página (servizi).

La sonda mejoró al medir este par:
- acepta los avisos de cookies antes de medir (el hover del original era el del aviso);
- lee los colores `color(srgb …)` que da `color-mix`, que salían como negro;
- toma como base el fondo que cubre la página, no el `body` tapado.

## Aprendido en la iteración

- La medida se puede equivocar de forma convincente: un 12 % de «negro» resultó ser un color mal leído y el fondo de la
  página anfitriona. Antes de corregir la réplica, hay que buscar qué elemento da cada valor.

## Movimiento por scroll (E14e, 27-10-2026)

**No medible con las herramientas actuales.** El relato del original salió primero lleno del panel de cookies, y después,
al filtrar lo invisible, vacío.
- Las herramientas ganaron tres arreglos con esta web:
  - `--avisos`, que espera al aviso que sale con temporizador y lo pulsa con un clic real;
  - `dom.js` descarta los bloques con opacidad efectiva 0 o dentro de algo oculto;
  - el análisis borra el relato anterior si el nuevo sale vacío.
- Pero en Il Colorista todos los bloques salen con opacidad efectiva 0 aunque se vean, probablemente por la envoltura de
  su librería de transiciones (Highway).
- Queda para una sonda propia de esa web.

## Siguiente

- La transición entre páginas con la marca en el centro (E12).
- Separar la carta en su propia página, como el original, si la réplica pasa a varias páginas.
