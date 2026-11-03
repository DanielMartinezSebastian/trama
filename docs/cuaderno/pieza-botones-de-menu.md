---
titulo: Botones de menú móvil sin corchetes y efectos de enlace nuevos
fecha: 2026-11-03
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/05, docs/59]
ruta: /componentes
codigo: [components/ui/FullscreenMenu.tsx, components/ui/styles/ui-motion.css]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: [menú a pantalla completa, botón de menú]
movimiento: [texto que rueda, icono que se cruza]
piezas: [FullscreenMenu]
piezas-nuevas: []
relacionados: [pieza-menus-y-transiciones-con-tema]
---

## Concepto

El usuario vio los menús móviles todavía repetitivos, sobre todo el `[Menú]` entre corchetes. Además de las nueve webs
con `trigger="label"`, todas las de hoja, persiana e isla mostraban `[Cerrar]` en su fila de cierre, fuera cual fuera
su botón.

## Qué se midió

Recuento de las 36 llamadas a `FullscreenMenu`: 9 con `label`, 12 con `burger`, 5 con `plus` y 6 con `pill`. El cierre
interior era siempre el texto entre corchetes.

## Qué se hizo

- Cinco botones nuevos: `text` (el texto sin corchetes, que rueda hacia arriba al cambiar), `count` (el texto con el
  número de enlaces volado), `lines` (tres rayas desiguales que se igualan al pasar y se cruzan en ✕), `dots` (nueve
  puntos que giran al pasar y se quedan en ✕) y `ring` (dos rayas en un círculo fino).
- El cierre de la fila propia del menú repite el botón elegido, ya abierto. Sobre un panel del acento o invertido, la
  píldora se invierte para no fundirse con el fondo.
- Dos efectos de enlace: `slide` (el enlace se desplaza y asoma una flecha) y `dim` (los demás se apagan).
- Reparto en las webs: corchetes solo en Matiz; `text` en Alba, Pausa y Tierra Ancha; `count` en Melena y Sesión Doble;
  `lines` en Pulso Lento, Impulso y Bocado; `dots` en Remada y Vive; `ring` en Nimbo y Nura. `slide` en Pulso Lento,
  Remada, Impulso, Tierra Ancha y Nimbo; `dim` en Alba, Pausa y Sesión Doble.

## Diferencias con la referencia

Sin referencia única: cada botón sale de la estética de su web.

## Aprendido

- Los estilos de abierto se escriben con `:is([aria-expanded="true"], .ui-fsm__close)`, para que el cierre interior
  los use sin declarar `aria-expanded` en un botón que no despliega nada.
- Con `tone="fg"` o `acc`, el subrayado al pasar alcanzaba también al número de `numbered`; `slide` lo quita porque ya
  marca el enlace con la flecha.

## Siguiente

- Revisar en el móvil real el texto que rueda con tipografías de interlineado muy corto.
