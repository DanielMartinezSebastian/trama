---
titulo: UMBRAL, festival ficticio compuesto con las skills de Trama
fecha: 2026-10-30
tipo: demo
estado: hecho
referencias: []
fichas: [examples/demo-umbral/BRIEF.md]
ruta: http://127.0.0.1:3435
codigo: [examples/demo-umbral/app/page.tsx.txt, examples/demo-umbral/app/ui/spaces-gallery.tsx.txt, examples/demo-umbral/app/programa/page.tsx.txt, examples/demo-umbral/app/entradas/page.tsx.txt, examples/demo-umbral/public/espacios]
colores: [#f4d4d4, #2b1d1d, #2f5be0, #ffcf4a, #fff7f0]
fuentes: [Bricolage Grotesque, Instrument Sans, Silkscreen]
sector: [cultura]
guia: [lúdico]
tono: [festivo, lúdico]
paleta: [fondo claro, pastel cálido, acento azul, acento amarillo]
tipografia: [titular gigante, etiquetas pixel]
patrones: [cartelera por fechas, programa filtrable, entrada con QR, preguntas frecuentes, cinta de texto, portal geométrico]
movimiento: [marquesina lenta, movimiento reducido respetado]
piezas: [GuideFrame, Hero, Marquee, EventLineup, FAQSection, Footer, Button, TextField, QuantityStepper, Alert, QRCode, PageTransition]
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
sirvió para definir una dirección gráfica propia. Se usaron `PageTransition` y `PageTransitionPersist` ya existentes
en el kit: barrido rápido hacia delante, dirección inversa al volver y cabecera fija. Se crearon `/`, `/programa` y
`/entradas`; filtros accesibles por día
y espacio; cantidad y total; validación de datos en navegador; persistencia local; y descarga de un recibo marcado como
muestra. La fuente del consumidor quedó conservada en `examples/demo-umbral/` y el preparador escribe solo en un destino
nuevo bajo `.cache/`.

Después de revisar la demo, se generaron visualizaciones conceptuales del recinto ficticio y sus espacios con Codex
imagegen. Tras valoración del usuario, una segunda pasada incorporó personas en movimiento y reemplazó las tres tarjetas
iguales por un collage asimétrico de recorrido con Nave A enmarcada como un arco. Los WebP llevan alt descriptivo y
aviso visible de ficción.

## Diferencias con la referencia

No hay web de referencia: es una composición original basada en la guía Lúdico. No se alteraron la API, los tokens ni
el paquete de Trama. `CheckoutFlow` no encaja con una entrada digital de muestra porque su flujo representa opciones
de entrega y pago; se usaron piezas públicas más pequeñas.

## Revisión de solapamientos

Tres capturas del usuario revelaron límites de la revisión visual anterior: solo inspeccionaba 390/1440 px y etiquetas semánticas, por lo que no cubría anchos intermedios ni texto en `span`/`div` dentro de capas decorativas `aria-hidden`. La nueva herramienta `npm run qa:visual-text -- <url> --widths ...` recorre rangos de texto renderizados, señala posibles cruces entre textos y medios, microtexto y clipping, y guarda capturas/informe. Es un detector de candidatos; las decisiones siguen dependiendo de revisar la captura, porque el interlineado compacto y los textos colocados deliberadamente sobre imágenes generan cruces geométricos.

La revisión encontró tres problemas reales: el titular editorial de Fanzine invadía la fotografía en anchos intermedios; el sello vertical de Cartel cruzaba el titular a 1072–1151 px; y las coordenadas del portal en móvil tenían poco tamaño/contraste. Se amplió el layout de dos columnas de Fanzine hasta 1280 px y se redujo el titular de escritorio estrecho hasta 1440 px, se retiró el sello superpuesto de Cartel y las coordenadas móviles pasaron a una etiqueta oscura de 12 px. Una revisión posterior de la marca UMBRAL contra el kicker encontró una proximidad incómoda entre columnas: las cajas no se cruzaban (14,8 px de separación diagonal), así que el detector anterior no la marcaba. Se añadió detección de pares entre bloques próximos y se redujo la marca con más separación en escritorio. Las capturas alrededor de esos anchos y a cada lado de los breakpoints se volvieron a revisar manualmente.

## Aprendido

El catálogo y las skills bastaron para resolver la estructura sin ampliar el kit. La primera comprobación visual halló
que el encabezado se desbordaba en 320 px y que un enlace del hero heredaba texto oscuro sobre azul; ambos ajustes
locales pasan ahora el barrido responsive y contraste. La galería hace tangibles los espacios y, al mismo tiempo,
explicita que las vistas y asistentes son generados y ficticios. El arco de Nave A conecta las escenas con el motivo del
portal. El almacenamiento local permite probar la recuperación, pero el
estado vacío y el aviso dejan claro que no existe un pedido real.

## Siguiente

Abrir la demo local en `http://127.0.0.1:3435` y revisar el concepto, el copy y las transiciones. Si se decide convertirla en muestra
integrada en el sitio, acordar una ruta pública y revisar su contenido antes de exponerla allí.
