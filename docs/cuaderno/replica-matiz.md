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
relacionados: [estudio-peluqueria, pieza-shape-mosaic, pieza-fullscreen-menu, demo-hebra]
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

## Siguiente

Medir el par con `refs:probe` y añadir la transición con marca (`PageTransition`).
