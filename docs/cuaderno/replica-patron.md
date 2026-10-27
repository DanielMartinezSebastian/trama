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
fuentes: [Antonio, Archivo, Playfair Display]
sector: [barbería]
guia: [barbería de carácter]
tono: [clásico, familiar]
paleta: [fondo claro, apagada]
tipografia: [gótica condensada, grotesca ancha, titular gigante]
patrones: [portada partida, cinta de texto, el dueño como marca, tienda, servicios con óvalo central, noticias en rejilla, menú lateral, botones en óvalo]
movimiento: [cinta que corre]
piezas: [Marquee]
piezas-nuevas: []
relacionados: [estudio-peluqueria, demo-esparta, herramienta-probe-par]
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

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://don-barber.gr/en http://localhost:3020/lab/estudios/patron --nombre patron`. Informe
en `.refs3d/pares/patron/par.md`.

- **Antes, 12 de 17 medidas cerca.**
  - **Letra**: la gótica condensada de Don (PF Grand Gothik Compressed, 400) es más **ligera y blanca** que Anton, que
    oscurecía la portada.
  - **Escala**: los servicios van a 6,9 vw (17,9 vw en móvil); la réplica iba a 5,6 y 11,8.
  - **Cinta**: «Welcome to Don's world» corre **al pie de la columna derecha, dentro de la primera pantalla**; en la
    réplica salía debajo.
  - **Margen**: 44 px.
- **Corregido**:
  - Antonio 400 en blanco;
  - 6,6 vw (15 vw en móvil);
  - la cinta en la portada, en negro;
  - margen de 44 px;
  - dos rótulos acortados sin cambiar el sentido («Cuidado y spa», «Manos y pies»), porque en español no cabían en una
    línea.
- **Después, 16 de 17**, y la que falta es la letra. El interlineado queda a 0,92 frente a 0,8: Antonio tiene las
  mayúsculas más altas, y a 0,8 las líneas se montaban. Se prefirió que se leyera bien.

## Aprendido en la iteración

- Las medidas se trasladan a otra letra con criterio: el mismo interlineado numérico no da el mismo resultado visual si
  cambia la altura de las mayúsculas. Hay que mirar las capturas, no solo el ✓.
- Traducir cambia la longitud: un rótulo que en inglés cabe en una línea puede no caber en español a la misma escala.

## Siguiente

- El menú en panel lateral con la foto de portada (propio de la réplica): pasarlo a `FullscreenMenu` si aparece en otra web.
