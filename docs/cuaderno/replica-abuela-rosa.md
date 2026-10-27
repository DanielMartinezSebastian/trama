---
titulo: Abuela Rosa, réplica de Peppa Sauce
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.peppasauce.love/]
fichas: [docs/50 §3.8]
ruta: /lab/estudios/abuela-rosa
codigo: [components/lab/estudios/abuela-rosa/AbuelaRosa.tsx, components/lab/estudios/abuela-rosa/abuela-rosa.css]
colores: [#141329, #feeee2, #8f93b8, #e8612c]
fuentes: [Archivo]
sector: [producto]
guia: [producto de marca]
tono: [descarado, con humor, familiar]
paleta: [dos tintas, fondo oscuro]
tipografia: [grotesca ancha, grotesca en mayúsculas, titular gigante]
patrones: [producto fijo, marcos de etiqueta, sello circular, cinta de compra fija, palabras gigantes con ilustración, lo que no, origen y familia]
movimiento: [producto fijo, cinta que corre]
piezas: [Marquee]
piezas-nuevas: []
relacionados: [replica-q47]
---

## Concepto

Un producto de consumo vendido con origen, maridajes y tono, no con funciones:
- el bote se queda fijo en el centro mientras toda la página pasa por detrás;
- dos tintas, como una serigrafía;
- humor («compra la maldita salsa»).

## Qué se midió

- `div.bottle` fijo.
- Azul noche #141329 y crema #feeee2.
- Obviously (grotesca ancha, de 50 a 245 px) y Vulf Sans.
- Hay pantalla de carga, cortinilla, cursor propio y la cinta «BUY NOW» fija.

## Qué se hizo

- Bote dibujado en CSS, fijo.
- Tres tarjetas con marco de etiqueta antigua.
- Cinta de compra con `Marquee`.
- «Un sabor de Canarias».
- Maridajes en palabras gigantes con ilustración, y lo que no.
- «Compra la maldita salsa».

## Diferencias con la referencia

- El bote es CSS hasta que llegue la foto de Codex.
- No hay cortinilla, cursor propio ni el apartado del bote a un lado en alguna sección.

## Aprendido

- La fórmula de producto de docs/07 (SaaS) no sirve para consumo. Esta web es la semilla de la guía «producto de marca»:
  `--bg` y `--fg`, y nada más; el color lo pone el producto.
- El producto fijo se resuelve con `position: fixed` y la página por detrás. Falta decidir si `ObjectStage` admite una
  imagen con posiciones por sección (E12).

## Siguiente

Medir el par, mover el bote a un lado por sección y añadir la foto.
