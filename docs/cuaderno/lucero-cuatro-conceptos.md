---
titulo: Lucero, cuatro conceptos para un mismo encargo
fecha: 2026-11-02
tipo: demo
estado: en curso
referencias: [https://pmndrs.github.io/examples/night-train/]
fichas: [docs/evolucion-agentes/p6-variedad-claude.md]
ruta: /lucero/horario · /lucero/vagon · /lucero/ventanilla · /lucero/maqueta
codigo: [components/lucero/, app/lucero/[version]/page.tsx, scripts/qa/variedad.mts, public/models/night-train/]
colores: [#ffd60a, #0a0a0a, #0f6e6e, #b5361c, #fbefd5, #521828, #faecd6, #17171b, #f4b483]
fuentes: [Archivo, Onest, Bricolage Grotesque, Newsreader, Geist Mono, Instrument Sans]
sector: [transporte]
guia: []
tono: [cívico, lúdico, contemplativo, técnico]
paleta: [amarillo de horario, ilustración plana, atardecer a amanecer, naranja sobre azul noche]
tipografia: [cifras tabulares gigantes, grotesca con carácter, serif cursiva de subtítulo, mono técnica]
patrones: [tabla como interfaz, notas al pie como condiciones, corte lateral del producto, scroll lateral, plano fijo con el tiempo en el scroll, maqueta 3D, selección de plaza en la escena]
movimiento: [sin movimiento, desplazamiento lateral, día y noche por scroll, tren instanciado con ScrollControls]
piezas: [TextField, Button]
piezas-nuevas: []
relacionados: [sonda-tres-direcciones, umbral-tres-esteticas, herramienta-mapa-decision-skills]
---

## Concepto

Lucero es un tren nocturno ficticio entre Bilbao y Cádiz. Sirve para probar si Claude, siguiendo las skills, separa de
verdad conceptos para un mismo encargo. Los datos, las plazas y la reserva son comunes (`data.ts`, `ReservaCampos.tsx`);
cada versión nace de un eje distinto: datos (Horario), espacio (Vagón), tiempo (Ventanilla). Maqueta es la cuarta,
pedida después, y reinterpreta Night Train de pmndrs.

## Qué se midió

`npm run qa:variedad -- --nombre lucero <urls> --control`: silueta, bordes y paleta en tres encuadres y dos anchos, con
un control que solo gira el tono. Resultado y lectura en [p6](../evolucion-agentes/p6-variedad-claude.md). De Night Train
se leyó la fuente publicada y su miniatura oficial; su demo no llegó a pintarse en Chromium headless con SwiftShader,
así que no hay comparación lado a lado con el mismo gesto y la puerta de fidelidad queda abierta.

## Qué se hizo

- `/lucero/horario`: la página es la tabla. Sin imágenes ni movimiento; tramo y tarifa se eligen en línea y las
  condiciones son notas al pie.
- `/lucero/vagon`: corte lateral dibujado con CSS y SVG. Se recorre de lado y se toca el asiento.
- `/lucero/ventanilla`: plano fijo con R3F. El scroll hace pasar las once horas y la pared cambia con la luz.
- `/lucero/maqueta`: conserva `Merged`, `ScrollControls`, cámara, niebla, suelo reflectante y GLB del original; añade
  que los asientos son plazas reales que se tocan en 3D.

## Diferencias con la referencia

Maqueta conserva escena Three, gesto de scroll, encuadre y modelos. Cambia marca, textos y función del asiento. Tres
sustituciones vienen de la CSP: los GLB se descomprimen (Draco pide WebAssembly), `Environment preset` pasa a
`Lightformer` y `Text` a una textura de canvas (los dos descargaban de un CDN). El color es aproximado.

## Aprendido

`ScrollControls` pierde su escucha de scroll si `<Canvas>` se vuelve a renderizar: el primer salto funciona y el segundo
no, sin ningún error en consola. Hay que aislar el lienzo con `memo` y sacar de él el estado que cambia. El aviso de
«botón sin efecto» de `smoke` aparece en botones de desplazamiento (Inicio y Taquilla en Vagón, la primera parada en
Ventanilla); no se revisó uno a uno si es falso positivo.

## Siguiente

Rehacer la prueba sin pedir «diferentes» y con Codex, según p6. Comprobar Maqueta en una GPU real y hacer `npm run build`
cuando el servidor de desarrollo esté parado.
