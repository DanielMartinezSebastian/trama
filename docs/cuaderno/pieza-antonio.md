---
titulo: Antonio en el kit, y las letras propias de cada réplica
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: [https://fit-and-you.webflow.io/, https://www.skulptfitness.nl, https://www.fenriz-gym.com/, https://don-barber.gr/en]
fichas: [docs/53 §5]
ruta: /componentes
codigo: [lib/ui/fonts.ts]
colores: []
fuentes: [Antonio]
sector: [gimnasio, barbería]
guia: [club de alto contraste, barbería de carácter]
tono: []
paleta: []
tipografia: [condensada en mayúsculas]
patrones: []
movimiento: []
piezas: [fonts]
piezas-nuevas: [fonts]
relacionados: [replica-vive, replica-talla, replica-lobo, replica-patron, replica-oficio, replica-melena, replica-raiz, replica-nucleo]
---

## Concepto

Qué letras entran en el kit y cuáles se quedan en una réplica.

## Qué se midió

- El peso del titular en los pares separó letras que a ojo se confunden. Cuatro webs usan una condensada de varios
  pesos:
  - Antonio 700 en FIT AND YOU;
  - Pilat Condensed 800 en Skulpt;
  - Kenyan Coffee 700 en Fenriz;
  - la gótica de Don Barber, en 400.
- El kit solo tenía Anton, de un único peso (400) y más pesada.

## Qué se hizo

- **Al kit**: Antonio (`--font-antonio`, variable de 100 a 700, libre). Sirve a dos familias de estilo («club de alto
  contraste» y «barbería de carácter») y la usan Vive, Talla, Lobo y Patrón.
- **A cada réplica**, con `next/font` en el componente:
  - Oficio: Permanent Marker y Montserrat;
  - Melena: DM Serif Display y Lora;
  - Raíz: Outfit;
  - Núcleo: Crimson Pro y Albert Sans.

## Aprendido

- Una letra entra en el kit si sirve a varias familias de estilo. Si es la firma de una sola web, se carga en la réplica.
- Al sustituir una letra no basta el tamaño: hay que copiar el tracking (OnyFuture va siempre apretada) y vigilar la
  altura de las mayúsculas (Antonio a 0,8 se monta donde la gótica de Don no).

## Siguiente

- Si una serif de texto (Lora, Crimson Pro) aparece en una tercera web, valorar subirla al kit.
