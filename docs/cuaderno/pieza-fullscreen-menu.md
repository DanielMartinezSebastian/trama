---
titulo: FullscreenMenu con filetes, marquesina y escalera
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: [https://ilcolorista.salon/, https://k72.ca/en]
fichas: [docs/50 §3.1, docs/50 §3.9, docs/CATALOG.md]
ruta: /componentes
codigo: [components/ui/FullscreenMenu.tsx]
colores: []
fuentes: []
sector: [peluquería, agencia]
guia: []
tono: []
paleta: []
tipografia: []
patrones: [menú a pantalla completa]
movimiento: [filetes que se dibujan, fila que gira a marquesina, transición en escalera]
piezas: [FullscreenMenu]
piezas-nuevas: [FullscreenMenu]
relacionados: [replica-matiz, replica-q47, pieza-page-transition-stairs]
---

## Concepto

Tres comportamientos nuevos para el menú a pantalla completa:
- **filetes** entre enlaces que se dibujan (Il Colorista);
- **la fila que gira** a una banda del acento con una marquesina de su frase e imágenes (K72);
- **la apertura en escalera** (K72).

## Qué se midió

Fotogramas del menú de K72 cada 100–150 ms, en `.refs3d/webs/k72-ca-en/nav/`.

## Qué se hizo

- `rules`.
- `linkHover="marquee"`, con `marquee` e `images` en cada enlace.
- `reveal="stairs"`.
- `triggerHover="fill"` (27-10-2026, del par de K72): el relleno del acento que baja sobre el botón.

## Aprendido

- El menú copia los tokens del botón que lo abre (`themeSnapshot`): los tokens del menú van en un antepasado del botón.
- `cover` hace que tape la cabecera.

## Siguiente

Si el menú en columnas verticales (Skulpt) o el panel lateral con foto (Don Barber) se repiten, entran aquí como
`layout`.
