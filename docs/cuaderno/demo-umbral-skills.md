---
titulo: UMBRAL, festival ficticio compuesto con las skills de Trama
fecha: 2026-10-30
tipo: demo
estado: hecho
referencias: []
fichas: [examples/demo-umbral/BRIEF.md]
ruta: http://127.0.0.1:3435
codigo: [examples/demo-umbral/app/page.tsx.txt, examples/demo-umbral/app/programa/page.tsx.txt, examples/demo-umbral/app/entradas/page.tsx.txt]
colores: [#f4d4d4, #2b1d1d, #2f5be0, #ffcf4a, #fff7f0]
fuentes: [Bricolage Grotesque, Instrument Sans, Silkscreen]
sector: [cultura]
guia: [lúdico]
tono: [festivo, lúdico]
paleta: [fondo claro, pastel cálido, acento azul, acento amarillo]
tipografia: [titular gigante, etiquetas pixel]
patrones: [cartelera por fechas, programa filtrable, entrada con QR, preguntas frecuentes, cinta de texto, portal geométrico]
movimiento: [marquesina lenta, movimiento reducido respetado]
piezas: [GuideFrame, Hero, Marquee, EventLineup, FAQSection, Footer, Button, TextField, QuantityStepper, Alert, QRCode]
piezas-nuevas: []
relacionados: [herramienta-skills-trama]
---

## Concepto

UMBRAL es un encuentro inventado de sonido y cultura digital en Nave 08, Madrid. La demo muestra cómo llevar una guía
de Trama a una landing cultural con cartelera navegable y un pase de muestra, sin integrar pagos ni servicios reales.

## Qué se midió

Tokens y tipos disponibles de `GuideFrame guide="ludico"`, nombres y límites de componentes en el paquete publicado
localmente, y legibilidad funcional a 320, 390, 768 y 1440 px. Se ejecutó axe WCAG 2.0 A/AA sobre portada, programa y
recibo; `smoke` sobre las tres rutas.

## Qué se hizo

Se aplicaron `trama-build` y `trama-style` para consultar receta, catálogo, guía y componentes públicos; `frontend-design`
sirvió para definir una dirección gráfica propia. Se crearon `/`, `/programa` y `/entradas`; filtros accesibles por día
y espacio; cantidad y total; validación de datos en navegador; persistencia local; y descarga de un recibo marcado como
muestra. La fuente del consumidor quedó conservada en `examples/demo-umbral/` y el preparador escribe solo en un destino
nuevo bajo `.cache/`.

## Diferencias con la referencia

No hay web de referencia: es una composición original basada en la guía Lúdico. No se alteraron la API, los tokens ni
el paquete de Trama. `CheckoutFlow` no encaja con una entrada digital de muestra porque su flujo representa opciones
de entrega y pago; se usaron piezas públicas más pequeñas.

## Aprendido

El catálogo y las skills bastaron para resolver la estructura sin tocar el kit. La primera comprobación visual halló
que el encabezado se desbordaba en 320 px y que un enlace del hero heredaba texto oscuro sobre azul; ambos ajustes
locales pasan ahora el barrido responsive y contraste. El almacenamiento local permite probar la recuperación, pero
el estado vacío y el aviso dejan claro que no existe un pedido real.

## Siguiente

Abrir la demo local en `http://127.0.0.1:3435` y revisar el concepto y el copy. Si se decide convertirla en muestra
integrada en el sitio, acordar una ruta pública y revisar su contenido antes de exponerla allí.
