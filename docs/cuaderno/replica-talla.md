---
titulo: Talla, réplica de Skulpt Fitness
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.skulptfitness.nl]
fichas: [docs/50 §3.4 E3e]
ruta: /inspiraciones/talla
codigo: [components/inspiraciones/talla/Talla.tsx, components/inspiraciones/talla/talla.css]
colores: [#f5f5f5, #202020, #cef952]
fuentes: [Antonio, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [cercano, con humor]
paleta: [fondo claro, acento único saturado]
tipografia: [condensada en mayúsculas, titular gigante]
patrones: [clase de prueba gratis, bordes de sección curvos, frase con humor, ventajas con foto, cinta de texto, oferta numerada, planes con conmutador, menú en columnas verticales, horario de apertura, lista con foto fija, formulario de contacto]
movimiento: [cinta que corre]
piezas: [PricingSection, Marquee, OpeningHours, ContactForm]
piezas-nuevas: []
relacionados: [estudio-gimnasio, replica-vive, demo-forja, herramienta-probe-par]
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

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://www.skulptfitness.nl http://localhost:3020/lab/estudios/talla --nombre talla`, la
sonda de estilos y la tira del original. Informe en `.refs3d/pares/talla/par.md`.

- **Antes, 11 de 20 medidas cerca.**
  - **Letra**: Pilat Condensed **800**, y la réplica usaba Anton (400, un solo peso).
  - **Escala**: titular de 122 px (8,5 vw); la réplica iba a 7 vw.
  - **Texto**: 22/1,5 en columnas de 21 em; la réplica iba a 14 px.
  - **Sombras**: 7 en la réplica, ninguna en el original.
  - **Oferta**: cuatro filas de 98 px con mucho aire y la foto del servicio con su número grande; la réplica tenía tres
    filas pequeñas.
  - **Final**: faltaba el bloque oscuro de borde curvo con la cinta lima («MEER WETEN?») y el formulario de contacto.
- **Corregido**:
  - Antonio 700 (nueva en el kit, de la iteración de Vive);
  - las medidas;
  - sin sombras;
  - la oferta con foto fija que cambia al pasar;
  - el bloque de contacto con `ContactForm`;
  - el hover de «clase de prueba gratis».
- **Después, 18 de 20.** El texto dominante del original sale de sus tarjetas de precios (18 px, mucho texto); la
  réplica tiene menos texto en ellas.

## Aprendido en la iteración

- La oferta con la foto que cambia al pasar es el mismo gesto que el acordeón de Core Atelier (foto fija que acompaña a
  la lista). Si sale una tercera vez, merece pieza: lista con foto fija.

## Siguiente

- La foto de la portada que se abre con borde curvo.
- Las tarjetas de precio con más texto, como el original.
