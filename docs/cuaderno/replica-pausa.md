---
titulo: Pausa, a partir de Odyssée
fecha: 2026-11-03
tipo: réplica
estado: hecho
referencias: [https://www.odysseeclinic.com.au/]
fichas: [docs/59]
ruta: /inspiraciones/pausa
codigo: [components/inspiraciones/pausa/Sitio.tsx, components/inspiraciones/pausa/pausa.css, components/inspiraciones/pausa/data.ts]
colores: [#fffcf8, #1e305e, #a9b4d6]
fuentes: [Newsreader, Inter]
sector: [clínica, salud]
guia: [clínica serena]
tono: [sereno, médico]
paleta: [marfil, azul tinta]
tipografia: [serifa de libro, grotesca diminuta en mayúsculas]
patrones: [duotono que recupera el color, sangría, razones numeradas, preocupaciones]
movimiento: [color al pasar]
piezas: [BookingFlow, FAQSection, FullscreenMenu, Reveal]
piezas-nuevas: []
relacionados: [herramienta-probe-par, pieza-menus-y-transiciones-con-tema]
---

## Concepto

Clínica de medicina estética. Todo lo que se lee va en una serifa de libro; la navegación, en una grotesca de 10 px. Las fotos van en duotono azul y recuperan el color al pasar. Flujos: buscar por preocupación y reservar consulta con tratamiento y profesional (BookingFlow).

## Qué se midió

Capturas y datos con Playwright el 03-11-2026 (`.refs/ronda-4/`): colores de fondo y texto, familia, peso, tamaño, interlineado y tracking del titular, largo de la página y menú móvil. Resumen en docs/59 §1.

## Qué se hizo

Marca, textos y datos propios; varias páginas, flujo de negocio y menú móvil propio. Guía `clinica` en docs/59 §2.

## Diferencias con la referencia

`refs:probe --par`: 8 de 14 medidas cerca; la portada mide 5.7 pantallas frente a 10.1 de la original. Las fotos son provisionales hasta que Codex entregue `docs/encargo-imagenes-inspiraciones-4.md`.

## Aprendido

Ver docs/59 §6.

## Siguiente

Volver a medir el par con las fotos reales.
