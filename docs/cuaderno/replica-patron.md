---
titulo: Patrón, réplica de Don Barber & Groom
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://don-barber.gr/en]
fichas: [docs/50 §3.2 E2f]
ruta: /lab/estudios/patron
codigo: [components/lab/estudios/patron/Patron.tsx, components/lab/estudios/patron/patron.css]
colores: [#eceae0, #000000, #7e929c, #757171]
fuentes: [Anton, Archivo, Playfair Display]
sector: [barbería]
guia: [barbería de carácter]
tono: [clásico, familiar]
paleta: [fondo claro, apagada]
tipografia: [gótica condensada, grotesca ancha, titular gigante]
patrones: [portada partida, cinta de texto, el dueño como marca, tienda, servicios con óvalo central, noticias en rejilla, menú lateral, botones en óvalo]
movimiento: [cinta que corre]
piezas: [Marquee]
piezas-nuevas: []
relacionados: [estudio-peluqueria, demo-esparta]
---

## Concepto

Una barbería familiar con aire de letrero:
- gótica condensada enorme para servicios y títulos;
- la misma familia, ancha y pequeña, para el texto;
- azul gris y topo;
- una cinta que corre;
- el dueño, con su nombre gigante sobre el retrato.

## Qué se midió

- PF Grand Gothik: ancha a 12 px, y condensada a 100 px con interlineado de 0,8.
- Colores #7e929c, #757171 y #eceae0.
- Botones en óvalo de contorno.

## Qué se hizo

- Portada partida, con cuatro servicios en condensada.
- Cinta con `Marquee variant="minimal"`.
- «La familia» y shop in shop.
- Servicios con el óvalo en el centro.
- Noticias.
- Menú en panel lateral con la foto de portada.

## Diferencias con la referencia

- Usa Anton en lugar de la condensada de PF Grand Gothik, y queda más pesada.
- El menú lateral es propio de la réplica, no del kit.

## Aprendido

- `Marquee` es monoespaciada por defecto (variante terminal). En webs de marca va con `variant="minimal"`.
- El separador de `Marquee` es texto literal.

## Siguiente

Medir el par. Si el menú en panel lateral con foto se repite en otra web, pasarlo a `FullscreenMenu`.
