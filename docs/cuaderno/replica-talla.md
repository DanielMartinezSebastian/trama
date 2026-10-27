---
titulo: Talla, réplica de Skulpt Fitness
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.skulptfitness.nl]
fichas: [docs/50 §3.4 E3e]
ruta: /lab/estudios/talla
codigo: [components/lab/estudios/talla/Talla.tsx, components/lab/estudios/talla/talla.css]
colores: [#f5f5f5, #202020, #cef952]
fuentes: [Anton, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [cercano, con humor]
paleta: [fondo claro, acento único saturado]
tipografia: [condensada en mayúsculas, titular gigante]
patrones: [clase de prueba gratis, bordes de sección curvos, frase con humor, ventajas con foto, cinta de texto, oferta numerada, planes con conmutador, menú en columnas verticales, horario de apertura]
movimiento: [cinta que corre]
piezas: [PricingSection, Marquee, OpeningHours]
piezas-nuevas: []
relacionados: [estudio-gimnasio, replica-vive, demo-forja]
---

## Concepto

Un gimnasio de barrio sin florituras:
- gris claro, casi negro y lima;
- humor («tu sofá se está mucho mejor si llegas reventado»);
- café gratis;
- la clase de prueba siempre a la vista;
- un menú en columnas verticales con la palabra girada.

## Qué se midió

- Colores #f5f5f5, #202020 y lima #cef952.
- Pilat Condensed 800 y Suisse Intl.
- Bordes de sección curvos.

## Qué se hizo

- Titular con botón redondo.
- Foto con borde curvo.
- Frase de humor escalonada.
- Tres ventajas.
- Cinta lima.
- Lo que incluye.
- Oferta 01–03.
- Planes con conmutador mes/año (`PricingSection highlight="border"`).
- Menú en columnas.
- Horario con `OpeningHours`.

## Diferencias con la referencia

- No tiene los planes Hyrox aparte.

## Aprendido

- Con un acento lima de fondo, el plan destacado relleno se hace ilegible: `highlight="border"`.
- El menú en columnas verticales vive en la réplica, no en el kit. Pasará a `FullscreenMenu` si aparece en otra web
  (E12).

## Siguiente

Medir el par.
