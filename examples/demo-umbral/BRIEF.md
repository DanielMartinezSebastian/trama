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
  amarillas, tipografía grande y ritmo de cartel. La ilustración es código vectorial, sin imágenes de stock.

No se copió una web de referencia ni se ejecutó una investigación externa. Las decisiones parten del concepto y de la
guía ya incluida en Trama.

## Composición y piezas

La cabecera y el portal son composiciones locales. El resto reúne `GuideFrame`, `Hero`, `Marquee`, `EventLineup`,
`FAQSection`, `Footer`, `Button`, `TextField`, `QuantityStepper`, `Alert` y `QRCode`.

`CheckoutFlow` no representa este caso: sus variantes actuales modelan entrega/recogida y pago. El paso de entradas se
compone con piezas públicas pequeñas, sin añadir props ni cambiar el kit. El nombre y el correo solo se guardan en
`localStorage`; la cantidad tiene un máximo de seis. El recibo se puede descargar como texto, muestra un QR de ejemplo
y lleva la marca `NO VÁLIDO PARA ACCESO`.

## Paquete y evidencia

- Paquete local: `dist-npm/trama-ui-0.13.0.tgz`.
- SHA-256 registrado por el preparador en `demo-source.json` al materializar el proyecto.
- Consumidor y dependencias aislados en `.cache/demo-umbral/`.
- Guion de navegador: `scripts/qa/demo-umbral.mts`; evidencias ignoradas en `.refs3d/demo-umbral/recorrido/`.
