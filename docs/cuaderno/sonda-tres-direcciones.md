---
titulo: SONDA, tres direcciones de producto
fecha: 2026-10-31
tipo: demo
estado: hecho
referencias: [https://floema.com/en/products, https://magic.estudionk.com/, https://db-longbow.webflow.io/]
fichas: []
ruta: /producto/materia · /producto/ritual · /producto/esencial
codigo: [components/producto/ProductWorld.tsx, components/producto/WebGLStage.tsx]
colores: [#d7d7c9, #24473b, #11100f, #ffac65, #f6f5f1, #20201e]
fuentes: [Geist, Geist Mono, Georgia]
sector: [audio]
guia: [producto en tres actos]
tono: [sensorial, directo, material]
paleta: [mineral y bosque, negro cálido y ámbar, editorial neutra]
tipografia: [titulares de escala expresiva, ficha de compra legible]
patrones: [comparador de direcciones, compra junto a producto, objeto 3D explorable, galería editorial, prueba social ficticia señalada]
movimiento: [rotación de producto WebGL, capítulos por gesto, galería fotográfica]
piezas: []
piezas-nuevas: []
relacionados: []
---

## Concepto

Tres páginas de producto para el mismo altavoz ficticio SONDA 01, con sistemas de venta, composición y movimiento distintos. Dos tienen escena real en Three/WebGL; la tercera usa fotografía propia y CSS sin canvas. Todas muestran que el precio, las especificaciones y las reseñas son datos de ejemplo y no aceptan pagos.

## Qué se midió

Se recorrieron 12 pantallas de cada referencia con `npm run cine:web`: Floema Products, The Magic Bottle y Longbow. Magic Bottle muestra una escena 3D continua, cursor propio y titulares superpuestos al objeto. Longbow no detecta Three; combina vídeo/fotografía, galería fija, titular y llamada de reserva. Floema presenta un catálogo de producto y un relato de durabilidad/material, sin Three detectable en la sonda. Las capturas están en `.refs3d/sonda/` (ignorado por Git).

## Qué se hizo

- `/producto/materia`: paisaje mineral claro, explicación de materiales, WebGL de producto con control orbital y compra anclada al relato; dirección inspirada en el catálogo y materialidad de Floema.
- `/producto/ritual`: escenario oscuro, gesto y capítulos interactivos, WebGL con órbitas/luz/partículas y compra después del momento cinemático; dirección inspirada en la exploración lúdica de Magic Bottle.
- `/producto/esencial`: ficha editorial de venta, selector de imagen, detalles, preguntas y compra directa. No importa Three ni contiene canvas; parte de la claridad audiovisual y reserva directa de Longbow.
- Las tres rutas enlazan entre sí. Colores, reseñas y prestaciones son ficticios; el botón de compra responde localmente y declara que no procesa pagos. Las llamadas de compra quedan visibles en los primeros encuadres; la ficha sin WebGL muestra precio, color y CTA junto a la fotografía principal.
- Imagen de producto y foto de uso generadas específicamente para esta demo, en `public/images/sonda/`.

## Diferencias con la referencia

No es una réplica de ninguna referencia: producto, textos e imágenes son originales. Floema no expuso un renderer 3D en la sonda y su aporte fue la presentación del catálogo/materiales; la primera WebGL es una interpretación de esas ideas, no una atribución de tecnología a Floema. Se simplificó el mundo WebGL de Magic Bottle para mantener el objeto reconocible y colocar la compra después de la exploración.

## Aprendido

La misma oferta admite tres jerarquías distintas: explicar el porqué material antes de comprar, convertir la interacción en descubrimiento, o reducir fricción con una ficha directa. Separar las estructuras, no solo cambiar color y tipo, hace comprobable la variedad. En la inspección de 1280×720, el panel de compra de Materia quedaba demasiado bajo; reducir la escala del titular y compactar la ficha dejó el CTA dentro del primer encuadre. Las tres direcciones pasan contraste WCAG AA en 390, 768, 1080 y 1440 px, y el smoke no detectó enlaces o botones muertos.

## Siguiente

Revisar las tres URLs con el usuario y elegir una como base para iterar una página comercial más completa (checkout real fuera del alcance de esta demo).
