# Quilate: paneles de servicios y continuidad de la animación

Revisión de `ExpandingPanels` en `/sitios/quilate`. Se documenta la interacción de interfaz; no se realizó una comparación nueva de la escena 3D.

## Problemas y correcciones

El subtítulo cambiaba entre `display: none` y visible, provocando una entrada instantánea. Ahora vive encima del título, fuera del flujo, y aparece con opacidad y desplazamiento progresivos. La entrada espera 200 ms para acompañar la expansión; la salida comienza inmediatamente. El título conserva su adaptación al ancho del contenedor y el máximo configurado, sin elipsis.

En móvil, la animación de alturas independientes podía alterar la geometría durante cambios de sentido. Cuando `mobileScroll` está activo, el conjunto reserva una altura constante y flex distribuye el espacio de apertura entre los paneles. Se desactiva el anclaje de scroll dentro del conjunto. La selección sigue el recorrido en ambos sentidos y cede prioridad al foco del teclado.

## API del kit

- `mobileScroll`: apertura al recorrer el conjunto en móvil, desactivada por defecto.
- `metaVisibility`: `always` o `active`.
- `titleMaxSize`: máximo tipográfico CSS, `28px` por defecto; Quilate usa `36px`.
- `minPanelWidth`: mínimo en escritorio, limitado al espacio disponible.

## Evidencia local

Se observaron 76 fotogramas de la transición de escritorio, confirmando valores intermedios de opacidad. En móvil, el recorrido 0, 1, 2, 3, 2, 1, 0, 1, 0 interrumpió las transiciones a los 350 ms: el conjunto mantuvo 548 px y el scroll no se desplazó involuntariamente (0 px). Estas cifras corresponden al contenido y a la ventana de prueba, no son una garantía para cualquier composición.

La revisión responsive previa comprobó los títulos en 320, 390, 800 y 1440 px, y la selección con movimiento reducido. La preferencia de movimiento reducido elimina las transiciones.

Capturas e informe en `.refs3d/quilate/panels-smooth-desktop.png`, `panels-smooth-mobile.png` y `panels-transition-result.json`. Son artefactos locales ignorados por Git; el documento y la ficha del panel sí se versionan.
