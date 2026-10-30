# UMBRAL · decisiones de la demo

## Encargo

Crear un evento cultural ficticio con programa y entradas, con tres rutas enlazadas y un flujo de compra simulada que
se pueda probar de principio a fin. El producto debe dejar claro que ni los pases ni el pago son reales.

## Skills aplicadas

- `trama-build`: consultar el catálogo generado y sus recetas, partir de componentes públicos del paquete, y pasar el
  texto de cada demo como props en lugar de heredar el copy de ejemplo.
- `trama-style`: elegir la guía `ludico`, leer sus tokens y fuentes, mantener su paleta y usar `GuideFrame` con
  `textContrast` para el texto. Los colores adicionales solo aparecen como composición local derivada de esos tokens.
- `frontend-design`: dar al sitio una dirección propia y consistente: festival de sonido, portal geométrico SVG, bandas
  amarillas, tipografía grande y ritmo de cartel. El portal sigue siendo código vectorial; la portada añade
  visualizaciones conceptuales generadas para Nave 08, Nave A y el Patio.

No se copió una web de referencia ni se ejecutó una investigación externa. Las decisiones parten del concepto y de la
guía ya incluida en Trama.

## Imágenes del recinto

Las imágenes WebP de `public/espacios/` se generaron con Codex imagegen a partir de un brief común de arquitectura
industrial, luz azul, lámparas amarillas y ambiente rosado. Representan espacios inventados; no documentan un recinto
real. La galería los etiqueta de forma visible y cada imagen tiene texto alternativo que declara su carácter conceptual.

## Composición y piezas

La cabecera y el portal son composiciones locales. El resto reúne `GuideFrame`, `Hero`, `Marquee`, `EventLineup`,
`FAQSection`, `Footer`, `Button`, `TextField`, `QuantityStepper`, `Alert`, `QRCode` y las transiciones públicas
`PageTransition`/`PageTransitionPersist`.

`CheckoutFlow` no representa este caso: sus variantes actuales modelan entrega/recogida y pago. El paso de entradas se
compone con piezas públicas pequeñas, sin añadir props ni cambiar el kit. El nombre y el correo solo se guardan en
`localStorage`; la cantidad tiene un máximo de seis. El recibo se puede descargar como texto, muestra un QR de ejemplo
y lleva la marca `NO VÁLIDO PARA ACCESO`.

Las páginas envuelven el contenido con `PageTransition kind="wipe"`; los enlaces del App Router indican avance o
regreso y la cabecera usa `PageTransitionPersist`. El tema de `GuideFrame` vive en un contenedor, así que se repiten en
`:root` los tokens que leen los pseudo-elementos de la transición. Los enlaces `<a>` de `EventLineup` conservan un
fundido entre documentos del mismo origen.

## Paquete y evidencia

- Paquete local: `dist-npm/trama-ui-0.13.0.tgz`.
- SHA-256 registrado por el preparador en `demo-source.json` al materializar el proyecto.
- Consumidor y dependencias aislados en `.cache/demo-umbral/`.
- Guion de navegador: `scripts/qa/demo-umbral.mts`; evidencias ignoradas en `.refs3d/demo-umbral/recorrido/`.
