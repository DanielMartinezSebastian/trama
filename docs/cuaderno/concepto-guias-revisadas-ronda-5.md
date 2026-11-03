---
titulo: Guías revisadas contra sus originales y la guía bloque nocturno
fecha: 2026-11-03
tipo: concepto
estado: hecho
referencias: [https://trucknroll.com/, https://glitchandgrit.com/, https://delice.ca/, https://ilcolorista.salon/, https://hairmeup.pl]
fichas: [docs/54, docs/60]
ruta: /guias
codigo: [lib/ui/guides.ts]
colores: [#131313, #3d2bb8, #b8202a, #f9d3c5]
fuentes: [Archivo]
sector: []
guia: [bloque nocturno, salón editorial claro, trattoria de barrio]
tono: []
paleta: []
tipografia: []
patrones: [afinidad de guía]
movimiento: []
piezas: [GuideFrame]
piezas-nuevas: []
relacionados: [herramienta-afinidad-de-guias, replica-bolo, replica-grano]
---

## Concepto

La quinta ronda se planteó para mejorar las guías y no solo para añadir una por web. Con la sonda corregida, se comparó
cada guía con sus webs originales y con sus réplicas. Solo se tocó una guía cuando el original estaba bien medido y la
diferencia era clara, y solo se creó una guía para una familia con más de una fuente.

## Qué se midió

- `salon`: Il Colorista y Hair Me Up tienen un salmón o melocotón saturado como superficie; la guía medía saturación 0,
  porque su salmón no llegaba al 2 % de superficie en el relato.
- `trattoria`: Délice y Bocado son rojo pleno por superficie, en la portada y en la página; la guía era crema.
- Familia sin guía: Truck'N Roll y Glitch&Grit (y K72, Essor, Runa, Silo, Nadir, Pulso Lento y Polaris en el repo): negro,
  titulares de palo de 900 a 10–36 vw y un acento saturado. Ninguna guía pasaba de 0,24.
- `electrico` no estaba mal: Brasa (la réplica de K72) estaba apuntada a ella sin ser de su familia.

## Qué se hizo

- `salon`: tarjetas en salmón claro (#f9d3c5) y el gris de texto más oscuro (#5a5a5a, 5:1 sobre el salmón).
- `trattoria`: fondo rojo (#b8202a), texto crema (5,6:1) y tarjetas en rojo oscuro.
- `bloque` («Bloque nocturno»), nueva: negro carbón, Archivo a 900 en mayúsculas a 12 vw con interlineado 0,84, tarjetas
  violeta (#3d2bb8) y portada con foto. Excepción medida de peso (900 en las dos referencias). Bolo, Grano, Brasa e
  Impulso pasan a ella.

## Diferencias con la referencia

Las guías miden familias, no webs: `bloque` toma de Truck'N Roll el acento como superficie y de las dos el peso y la escala.

## Aprendido

- La primera versión de `bloque` pasaba los once rangos y aun así no atraía a su familia (0,20–0,29): su relato pintaba
  el titular con el tamaño de `h2`, con una fuente declarada a 400 y el acento solo en botones. Pasar los rangos no basta:
  hay que medir la afinidad de la guía con sus fuentes. Rehecha, Bolo queda a 0,54, Grano a 0,45, Glitch&Grit a 0,40 y
  Truck'N Roll a 0,25.
- Para que un color cuente en una guía, tiene que ser superficie en su relato.

## Siguiente

- Una guía de color pleno si aparece una segunda fuente como Neue Montreal (Turia queda en `cartel` con afinidad baja).
