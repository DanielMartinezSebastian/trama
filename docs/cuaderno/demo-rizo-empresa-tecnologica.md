---
titulo: RIZO, cinco experiencias para una empresa ficticia de software
fecha: 2026-10-30
tipo: demo
estado: hecho
referencias: []
fichas: [examples/demo-rizo/README.md]
ruta: http://127.0.0.1:3441
codigo: [examples/demo-rizo/app/page.tsx.txt, examples/demo-rizo/app/campaign/page.tsx.txt, examples/demo-rizo/app/system/page.tsx.txt, examples/demo-rizo/app/forum/page.tsx.txt, examples/demo-rizo/app/archive/page.tsx.txt, examples/demo-rizo/app/navigator/page.tsx.txt, examples/demo-rizo/app/ui/archive-grid.tsx.txt, examples/demo-rizo/app/ui/impact-navigator.tsx.txt, examples/demo-rizo/app/rizo.css.txt, examples/demo-rizo/public/images]
colores: [#f2f1eb, #151922, #2839dd, #d7ff39, #ff693e]
fuentes: [Space Grotesk, Instrument Sans, JetBrains Mono]
sector: [empresa, tecnología, marketing, eventos]
guia: [electrico, tecnico, nocturno]
tono: [cinemático, estratégico, experimental]
paleta: [papel mineral, tinta, azul eléctrico, lima, coral]
tipografia: [titulares de escala, datos monoespaciados]
patrones: [relato de campaña, dashboard filtrable, ficha de iniciativa, programa interactivo, reserva local, archivo filtrable, diagnóstico interactivo]
movimiento: [órbitas animadas, transición entre páginas, movimiento reducido respetado]
piezas: [GuideFrame, PageTransition, Button]
piezas-nuevas: []
relacionados: [demo-umbral-skills, herramienta-skills-trama]
---

## Concepto

RIZO UX Systems S.L. es una compañía ficticia que diseña y construye software transversal para grandes organizaciones. El encargo se convirtió en cinco micrositios con estructuras, públicos y acciones distintas, reunidos en un único consumidor aislado para revisar sus recorridos.

## Qué se midió

Se consultaron catálogo y guías del paquete local trama-ui 0.13.0 y los documentos de navegación de Next 16.3.5. Se recorrieron 16 anchos de 320 a 1920 px en campaña, producto y foro; y 14 anchos en las fichas secundarias. El detector encontró dos problemas móviles iniciales: el gráfico de Señal rozaba texto y el título/claim del foro se salían o se acercaban demasiado. Se corrigieron antes de repetir los barridos. La pequeña intersección de cajas entre las dos líneas «FORO / 10» es tipografía de cartel intencional; revisada visualmente, las letras tienen espacio y se leen con claridad.

## Qué se hizo

- `/campaign`: relato audiovisual «Señal», experiencia de marca y caso de campaña con imagen generada y declarada conceptual; CTA a brief local.
- `/system`: dirección de producto clara y operativa, tablero de iniciativas ficticias con filtro, búsqueda, selección/detalle y guardar vista; servicio y contacto local.
- `/forum`: sitio de encuentro de estética de cartel, visualización generada del recinto, espacios, programa seleccionable y reserva de visita local.
- `/archive`: archivo editorial monocromo con filtros de casos que enlazan a las experiencias.
- `/navigator`: herramienta interactiva de diagnóstico que recomienda un primer camino según el reto elegido.
- Páginas secundarias `/campaign/story` y `/system/blueprint`; página índice para elegir cada aproximación. Se usa `PageTransition` en rutas y `transitionTypes` de Next en navegación.
- Formularios y estado de agenda guardan datos de muestra en `localStorage`. No hay backend, correo, pagos, identidad ni reserva real. Todos los nombres, casos, métricas, testimonios, lugares y evento son ficticios.
- Los originales visuales se generaron con Codex imagegen y se incorporaron en `public/images/`; los alt y los pies aclaran que son visualizaciones conceptuales.

## Diferencias con la referencia

No hay una referencia única: son cinco expresiones deliberadamente divergentes de la misma firma. Señal es una narración audiovisual; Rizo OS, una consola de operación; FORO / 10, un cartel y programa de encuentro; Archivo, un índice editorial; y Navegador, una herramienta de diagnóstico. Comparten identidad y tokens, pero no navegación, jerarquía, estructura ni composición. No se cambió la API de Trama.

## Aprendido

El tablero del producto transmite una experiencia distinta porque sus controles responden de verdad y el contenido cambia, mientras que las otras dos demos traducen marca y espacio. Las imágenes sintéticas funcionan cuando su naturaleza está declarada. El detector de texto sirve como lista de inspección: las líneas comprimidas de un titular de cartel pueden generar intersecciones geométricas sin que las letras se toquen, por lo que la última palabra la tiene la lectura visual a tamaño real.

Una revisión posterior de contraste encontró texto auxiliar del tablero por debajo de 4,5:1 (el peor caso era 3,05:1 sobre papel). La skill nombraba el umbral, pero no lo convertía en una condición de cierre por cada superficie. Se oscurecieron los textos, se quitaron transparencias sobre texto funcional y se añadió una puerta de axe; los textos sobre imagen quedan señalados para inspección manual con scrim opaco.

La revisión de diferencia visual encontró otra causa: las tres primeras rutas compartían navegación, jerarquía tipográfica y el ritmo hero → secciones → contacto. Además, `GuideFrame` ocupa la variable CSS `--display` en su alcance; por eso los titulares de RIZO computaban 16 px aunque el CSS pidiera escalas grandes. Se renombraron los tokens tipográficos con el prefijo `--rizo-` y se añadieron cabeceras y composiciones propias: campaña cinematográfica, consola de producto, cartel de feria, archivo editorial y diagnóstico interactivo. Las skills ahora exigen comparar estructura, navegación, tipografía, paleta y movimiento antes de construir varias demos; no se consideran diferentes por solo cambiar textos o colores.

La repetición a 16 anchos no encontró incumplimientos automáticos en las tres rutas originales. Axe todavía marca los chips de estado del tablero como `incomplete` entre 390 y 720 px porque no puede resolver su fondo en esa composición; sus fondos son sólidos, se inspeccionó la cobertura de elementos y se revisaron las capturas. El checker ahora deja esos casos pendientes de revisión en vez de darlos por aprobados silenciosamente.

La revisión de similitud posterior mostró que cambiar el asunto de cada página no basta: las tres primeras compartían navegación, escala tipográfica y ritmo de landing. Además, `GuideFrame` reserva `--display` en su ámbito y el token homónimo de la demo hacía que los titulares computaran a 16 px. Se renombró el grupo de tokens como `--rizo-*` y se amplió a cinco estructuras autónomas. En móvil, la cabecera de Archivo también necesitó mantener su marca sin salto de línea.

La captura del tablero a 390 px también reveló que las flechas redundantes rozaban los estados de las filas; al ocultarlas en móvil, la fila completa conserva su interacción y deja respirar la etiqueta.

## Siguiente

Revisión humana en `http://127.0.0.1:3441/`, con acceso a las cinco experiencias: campaña, producto, foro, archivo y navegador. Si se aprueban como muestra, decidir si se conservan como consumidor independiente o se integran en `/demos`; no publicar, desplegar ni conectar reservas en esta prueba.
