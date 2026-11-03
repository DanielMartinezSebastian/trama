---
titulo: Tierra Ancha, a partir de Tengile MalaMala
fecha: 2026-11-03
tipo: réplica
estado: hecho
referencias: [https://tengilemalamala.com/]
fichas: [docs/59]
ruta: /inspiraciones/tierra-ancha
codigo: [components/inspiraciones/tierra-ancha/Sitio.tsx, components/inspiraciones/tierra-ancha/tierra-ancha.css, components/inspiraciones/tierra-ancha/data.ts]
colores: [#f5eee9, #373f1d, #8b5a2b, #c8b48a]
fuentes: [Cormorant Garamond, Inter Tight]
sector: [safari, hotel]
guia: [sabana tranquila]
tono: [sereno, cálido]
paleta: [crema, verde oliva]
tipografia: [serifa finísima en mayúsculas]
patrones: [titular desplazado, collage suelto, cartas de alojamiento, cita grande]
movimiento: [parallax a distintas velocidades]
piezas: [ContactForm, FullscreenMenu, Parallax, QuantityStepper, Reveal]
piezas-nuevas: []
relacionados: [herramienta-probe-par, pieza-menus-y-transiciones-con-tema]
---

## Concepto

Colección de campamentos de safari. Portada a sangre con el titular en dos líneas desplazadas y una serifa de peso 300; después, párrafos enormes en serifa y fotos de fauna sueltas que flotan a distinta velocidad. Flujo: planificar la estancia combinando campamentos y noches, con presupuesto al momento.

## Qué se midió

Capturas y datos con Playwright el 03-11-2026 (`.refs/ronda-4/`): colores de fondo y texto, familia, peso, tamaño, interlineado y tracking del titular, largo de la página y menú móvil. Resumen en docs/59 §1.

## Qué se hizo

Marca, textos y datos propios; varias páginas, flujo de negocio y menú móvil propio. Guía `sabana` en docs/59 §2.

## Diferencias con la referencia

`refs:probe --par`: 11 de 20 medidas cerca; la portada mide 7.3 pantallas frente a 12.8 de la original. Medido otra vez con las fotos definitivas de Codex (commit 3c90d6c): mismo resultado.

## Aprendido

Ver docs/59 §6.

## Siguiente

Alargar la portada hacia el largo de la original.
