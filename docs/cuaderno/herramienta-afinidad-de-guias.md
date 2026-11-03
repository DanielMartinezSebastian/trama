---
titulo: La afinidad entre páginas y guías, medida como se ve
fecha: 2026-11-03
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/54, docs/60]
ruta: /guias
codigo: [scripts/probe-refs.mts, scripts/guias-afinidad.mts]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: [afinidad de guía]
movimiento: []
piezas: []
piezas-nuevas: []
relacionados: [herramienta-probe-par]
---

## Concepto

Antes de buscar webs para la quinta ronda, se midió el repo con `refs:probe --repo` para elegir por los huecos de las
guías. Salían 28 páginas sin guía afín (por debajo de 0,25), y 22 de las 36 réplicas se parecían más a otra guía que a la
suya. Antes de crear guías había que saber si el hueco era real o de la medida.

## Qué se midió

- Desglose de la distancia, rasgo a rasgo, entre cada réplica y su guía: el tamaño del titular y el fondo explicaban la
  mayor parte.
- Las 36 webs originales, medidas otra vez con la sonda, para separar dos casos: la guía lejos de su original o la
  réplica apartada de una guía que sí se parece al original.

## Qué se hizo

Cuatro correcciones, todas en la medida y no en las guías:

1. **El titular de las portadas con foto.** Lo mayor de la primera pantalla era la navegación (1–2 vw). Ahora, por debajo
   de 2,5 vw, cuenta lo mayor de las tres primeras pantallas, sin el pie.
2. **La marca de los relatos.** Siete guías (`club`, `foro`, `burdeos`, `cartel`…) abren su relato con la marca de borde a
   borde, a 27–47 vw, y se medían por ella. Ahora la guía da su titular (`h1` o `h2` del relato) y su marca
   (`.ui-g-brand`), y la página se compara con el más cercano de los dos.
3. **Las serifas de fundición.** PP Fragment, Ivy Mode, psTimes, Forvm o Canora se clasificaban como grotescas por su
   nombre. Ahora cuenta también la familia genérica de la pila CSS, y la lista de nombres conocidos crece.
4. **El fondo de la primera pantalla.** Una portada negra sobre una página clara (Cerebrium, CoffeeTech) se comparaba solo
   por la superficie total. Ahora se mide también el fondo de la primera pantalla y cuenta el más cercano.

## Diferencias con la referencia

Sin referencia.

## Aprendido

- Páginas por debajo de 0,25: de 28 a 14. Por encima de 0,35: de 27 a 40.
- Con la medida corregida, `foro` se parece a OFFF con 0,81 y `sabana`, `filmoteca` y `clinica` encajan con sus originales.
  Quedaron tres guías lejos de originales bien medidos: `salon`, `trattoria` y la familia sin guía de Truck'N Roll.
- Siguen sin medirse bien los originales con aviso de cookies (ERA, Spyker) o titular en canvas o letra a letra
  (ALICE, Don't Look Up): la sonda no pasa avisos.

## Siguiente

- Que la sonda acepte el aviso de cookies, como `cine:web --antes`.
