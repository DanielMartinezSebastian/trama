---
titulo: Siete guías de estilo de sector, de las familias del cuaderno
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/16 §5.1b, docs/50 E10]
ruta: /guias
codigo: [lib/ui/guides.ts, scripts/probe-refs.mts]
colores: []
fuentes: [Antonio, Cormorant Garamond, Manrope, Archivo, Inter, Onest, Space Grotesk, Playfair Display]
sector: [peluquería, barbería, gimnasio, academia, producto, agencia]
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [guides, GuideFrame]
piezas-nuevas: [guides]
relacionados: [herramienta-cuaderno, herramienta-probe-par, pieza-antonio, estudio-peluqueria, estudio-gimnasio, estudio-academia]
---

## Concepto

Las hojas de estilo que pedía el usuario: cada familia del cuaderno pasa a ser una guía del kit (`STYLE_GUIDES`), con
tintas, par tipográfico, escala, espacio, superficies y movimiento. Se aplica con `GuideFrame` y se prueba en `/guias`
con todas sus composiciones y relatos.

## Qué se midió

- Los valores de cada guía salen de las réplicas de su familia **después** de iterarlas con el par: titulares, texto,
  márgenes, tracking, radios y curvas medidos contra las webs de referencia.
- `refs:probe --guides` mide las quince guías en el navegador y las compara con los rangos de las premiadas.

## Qué se hizo

- Siete guías nuevas:
  - salón editorial claro (`salon`);
  - barbería de carácter (`barberia`);
  - club de alto contraste (`club`);
  - estudio boutique (`boutique`);
  - academia de autor (`autor`);
  - escuela amarilla (`escuela`);
  - producto de marca (`marca`).
- Las reglas de `--guides` ganan excepciones con nombre y con su web: condensadas a 700–800 y a 11 vw, sombra dura,
  texto de cartel.
- **Resultado: 15/15 dentro de rango.**

## Aprendido

- Los rangos de las premiadas generalistas no son una ley para los sectores. Tres rasgos de familia salen de ellos y son
  justo lo que la hace reconocible:
  - el texto grande y ligero de Il Colorista;
  - el margen de 120 px de la academia de autor;
  - el texto de cartel de Peppa Sauce.
- Una excepción tiene que llevar su medida y su web; si no, es un fallo.
- Los márgenes en móvil sí se corrigieron: ahí no había razón de sector para salirse.

## Siguiente

- E11: las recetas por sector en el catálogo, montadas sobre estas guías.
