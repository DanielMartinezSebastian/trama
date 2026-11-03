---
titulo: Solera Arquitectura, a partir de LPAS
fecha: 2026-11-03
tipo: réplica
estado: hecho
referencias: [https://lpas.com/]
fichas: [docs/59]
ruta: /inspiraciones/solera
codigo: [components/inspiraciones/solera/Sitio.tsx, components/inspiraciones/solera/solera.css, components/inspiraciones/solera/data.ts]
colores: [#ffffff, #000000, #6e625a, #a65232, #c9d6e3, #737b6b, #e6b9a0]
fuentes: [Geist]
sector: [arquitectura]
guia: [estudio en tierras]
tono: [profesional, abierto]
paleta: [blanco, colores tierra]
tipografia: [grotesca neutra sin negritas]
patrones: [paneles por sector que se ensanchan, rejilla filtrable, noticias en filas]
movimiento: [paneles que crecen al pasar]
piezas: [ContactForm, FullscreenMenu]
piezas-nuevas: []
relacionados: [herramienta-probe-par, pieza-menus-y-transiciones-con-tema]
---

## Concepto

Estudio de arquitectura e interiores. Una fila de cinco paneles por sector, foto arriba y bloque de color tierra abajo, que se ensanchan al pasar; menú en panel negro desde una píldora oscura. Flujos: filtrar proyectos por sector y escribir al estudio.

## Qué se midió

Capturas y datos con Playwright el 03-11-2026 (`.refs/ronda-4/`): colores de fondo y texto, familia, peso, tamaño, interlineado y tracking del titular, largo de la página y menú móvil. Resumen en docs/59 §1.

## Qué se hizo

Marca, textos y datos propios; varias páginas, flujo de negocio y menú móvil propio. Guía `terracota` en docs/59 §2.

## Diferencias con la referencia

`refs:probe --par`: 8 de 20 medidas cerca; la portada mide 4.6 pantallas frente a 10.4 de la original. Medido otra vez con las fotos definitivas de Codex (commit 3c90d6c): mismo resultado.

## Aprendido

Ver docs/59 §6.

## Siguiente

Alargar la portada hacia el largo de la original.
