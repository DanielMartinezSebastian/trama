---
titulo: Bocado, a partir de Délice
fecha: 2026-11-03
tipo: réplica
estado: hecho
referencias: [https://delice.ca/]
fichas: [docs/59]
ruta: /inspiraciones/bocado
codigo: [components/inspiraciones/bocado/Sitio.tsx, components/inspiraciones/bocado/bocado.css, components/inspiraciones/bocado/data.ts]
colores: [#f8efdc, #cc2629, #7cc3bd, #2d3e2b, #6b1d24]
fuentes: [Fraunces, Manrope]
sector: [restaurante]
guia: [trattoria de barrio]
tono: [alegre, cercano]
paleta: [crema, rojo, turquesa, verde botella]
tipografia: [serifa blanda con cursiva, sans redonda en mayúsculas]
patrones: [bloques de color, platos en círculo, título en arco, programación]
movimiento: [color de fondo que cambia con el carrusel]
piezas: [BriefFlow, CheckoutFlow, ContactForm, EventLineup, FullscreenMenu, QuantityStepper, Reveal]
piezas-nuevas: []
relacionados: [herramienta-probe-par, pieza-menus-y-transiciones-con-tema]
---

## Concepto

Restaurante-pizzería de barrio. Bloques de color pleno que se suceden y platos del día en círculos crema bajo un título en arco. Flujos: reservar mesa (días cerrados, turnos, zona), pedido a domicilio con cesta y pago, tarjeta regalo con vista previa y salones privados.

## Qué se midió

Capturas y datos con Playwright el 03-11-2026 (`.refs/ronda-4/`): colores de fondo y texto, familia, peso, tamaño, interlineado y tracking del titular, largo de la página y menú móvil. Resumen en docs/59 §1.

## Qué se hizo

Marca, textos y datos propios; varias páginas, flujo de negocio y menú móvil propio. Guía `trattoria` en docs/59 §2.

## Diferencias con la referencia

`refs:probe --par`: 7 de 19 medidas cerca; la portada mide 6.9 pantallas frente a 16 de la original. Medido otra vez con las fotos definitivas de Codex (commit 3c90d6c): mismo resultado.

## Aprendido

Ver docs/59 §6.

## Siguiente

Alargar la portada hacia el largo de la original.
