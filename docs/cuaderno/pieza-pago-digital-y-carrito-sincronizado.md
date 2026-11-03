---
titulo: Pago de productos digitales y carrito sincronizado entre instancias
fecha: 2026-11-03
tipo: pieza
estado: hecho
referencias: [https://neuemontreal.com/]
fichas: [docs/60]
ruta: /componentes
codigo: [components/ui/CheckoutFlow.tsx, lib/commerce/cart.ts]
colores: []
fuentes: []
sector: [tipografía, robótica, residencia]
guia: []
tono: []
paleta: []
tipografia: []
patrones: [pedido, señal de reserva]
movimiento: []
piezas: [CheckoutFlow, CartDrawer]
piezas-nuevas: []
relacionados: [replica-turia, replica-majo, replica-trocha, replica-llave]
---

## Concepto

Cuatro webs de la quinta ronda cobran algo que no se envía: licencias de una tipografía (Turia) y señales de reserva de un
robot, una moto y una habitación (Majo, Trocha, Llave). `CheckoutFlow` solo sabía de envío a casa y recogida en tienda.
Además, Turia lleva el contador del pedido en la cabecera, y dos llamadas a `useCart` con la misma clave no se enteraban
la una de la otra.

## Qué se midió

En Turia, añadir una licencia no cambiaba el contador de la cabecera hasta recargar la página.

## Qué se hizo

- `CheckoutFlow delivery="digital"`: dos pasos (datos y pago), sin gastos de envío, «Entrega: por correo, al momento» en
  el resumen y una confirmación de entrega por correo. `CheckoutOrder.delivery` admite `"digital"`.
- `useCart` avisa a las demás instancias con la misma clave: en la misma pestaña, por un evento propio; en otras, por
  `storage`. Recuerda lo último leído o escrito para no reescribir ni avisar en bucle.

## Diferencias con la referencia

Neue Montreal vende en otra tienda; el flujo de licencias de Turia es propio.

## Aprendido

- Una señal de reserva es un producto digital: lo que se entrega es el justificante.

## Siguiente

- Una prueba automática del evento entre instancias.
