---
titulo: Vive Club, réplica de FIT AND YOU
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://fit-and-you.webflow.io/]
fichas: [docs/50 §3.4 E3d]
ruta: /lab/estudios/vive
codigo: [components/lab/estudios/vive/Vive.tsx, components/lab/estudios/vive/vive.css]
colores: [#000000, #ffffff, #fb5607]
fuentes: [Anton, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [enérgico, comercial]
paleta: [fondo oscuro, acento único saturado]
tipografia: [condensada en mayúsculas, espaciado negativo, titular gigante]
patrones: [menú en isla, damero de fotos y círculos, círculo de llamada, lista gigante de nombres, cinta de cifras, tarjetas ladeadas, planes con conmutador, enlaces con corchetes]
movimiento: [cinta que corre]
piezas: [PricingSection]
piezas-nuevas: []
relacionados: [estudio-gimnasio, replica-talla, demo-cadencia]
---

## Concepto

Una cadena de clubes con lema de anuncio:
- condensada naranja en mayúsculas enormes;
- «[+]» como firma de los enlaces;
- un damero de fotos y círculos;
- las clases como lista de nombres gigantes.

## Qué se midió

- Hecha con Webflow y GSAP.
- Antonio 700 a 158 px, con espaciado de −9,5 px; Inter de 12 a 14 px.
- Naranja #fb5607.

## Qué se hizo

- Menú en isla.
- Damero de fotos y círculos.
- «Membresía» con el círculo naranja.
- Clases por zona como lista gigante.
- Cinta de cifras.
- Ventajas en tarjetas ladeadas alrededor del titular.
- Planes de cuatro columnas con `PricingSection`.

## Diferencias con la referencia

- La lista de clases no tiene el vídeo en blanco y negro detrás.

## Aprendido

- `PricingSection` aguanta cuatro columnas sin tocar nada.

## Siguiente

Medir el par y probar el vídeo detrás de la lista.
