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
relacionados: [replica-q47, herramienta-probe-par]
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

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://www.peppasauce.love/ http://localhost:3020/lab/estudios/abuela-rosa --nombre abuela-rosa`
y la sonda de estilos. Informe en `.refs3d/pares/abuela-rosa/par.md`.

- **Antes, 12 de 17 medidas cerca.** La diferencia de fondo era de letra:
  - las dos de Peppa Sauce son **estrechas**, y la réplica usaba Archivo ancha;
  - el texto de las tarjetas va a **36 px/1,2** (el 92 % del texto de la página), y la réplica iba a 14–18 px.
- Lo corregido:
  - Archivo a `wdth` 62 para titulares y cintas, y Space Grotesk 400 en mayúsculas para el texto (dos letras, como el
    original);
  - tarjetas de 288 px con texto a 2,5 vw;
  - títulos de tarjeta a 50 px/0,94;
  - palabras gigantes a 17 vw/0,82 (−2,9 %) y 13 vw/0,85 (−3,8 %);
  - márgenes de 36 px;
  - bote más grande;
  - en móvil, el sello arriba a todo el ancho y el resto en dos columnas, con el bote centrado;
  - el anillo del sello con letra grande.
- **Después, 17 de 17.**

## Aprendido en la iteración

- Una «grotesca ancha» medida resultó estrecha: la referencia de memoria (Obviously es ancha en su corte normal) engaña.
  Se mide la letra que usa la web, no la familia.
- El tamaño dominante del texto (el 92 % de los caracteres a 36 px) define la página más que los titulares: con texto
  pequeño, la réplica parecía otra web.

## Siguiente

- Cinta vertical en los lados del marco («WTF IS PEPPA SAUCE»).
- La foto del bote de Codex.
- Que el bote se aparte a un lado en alguna sección.
