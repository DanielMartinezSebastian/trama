---
titulo: RIZO, tres experiencias para una empresa ficticia de software
fecha: 2026-10-30
tipo: demo
estado: hecho
referencias: []
fichas: [examples/demo-rizo/README.md]
ruta: http://127.0.0.1:3441
codigo: [examples/demo-rizo/app/page.tsx.txt, examples/demo-rizo/app/campaign/page.tsx.txt, examples/demo-rizo/app/system/page.tsx.txt, examples/demo-rizo/app/forum/page.tsx.txt, examples/demo-rizo/app/rizo.css.txt, examples/demo-rizo/public/images]
colores: [#f2f1eb, #151922, #2839dd, #d7ff39, #ff693e]
fuentes: [Space Grotesk, Instrument Sans, JetBrains Mono]
sector: [empresa, tecnología, marketing, eventos]
guia: [electrico, tecnico, nocturno]
tono: [cinemático, estratégico, experimental]
paleta: [papel mineral, tinta, azul eléctrico, lima, coral]
tipografia: [titulares de escala, datos monoespaciados]
patrones: [relato de campaña, dashboard filtrable, ficha de iniciativa, programa interactivo, reserva local]
movimiento: [órbitas animadas, transición entre páginas, movimiento reducido respetado]
piezas: [GuideFrame, PageTransition, Button]
piezas-nuevas: []
relacionados: [demo-umbral-skills, herramienta-skills-trama]
---

## Concepto

RIZO UX Systems S.L. es una compañía ficticia que diseña y construye software transversal para grandes organizaciones. El encargo se convirtió en tres webs con estructuras, públicos y acciones diferentes, reunidas en un único consumidor aislado para revisar la navegación entre ellas.

## Qué se midió

Se consultaron catálogo y guías del paquete local trama-ui 0.13.0 y los documentos de navegación de Next 16.3.5. Se recorrieron 16 anchos de 320 a 1920 px en campaña, producto y foro; y 14 anchos en las fichas secundarias. El detector encontró dos problemas móviles iniciales: el gráfico de Señal rozaba texto y el título/claim del foro se salían o se acercaban demasiado. Se corrigieron antes de repetir los barridos. La pequeña intersección de cajas entre las dos líneas «FORO / 10» es tipografía de cartel intencional; revisada visualmente, las letras tienen espacio y se leen con claridad.

## Qué se hizo

- `/campaign`: relato audiovisual «Señal», experiencia de marca y caso de campaña con imagen generada y declarada conceptual; CTA a brief local.
- `/system`: dirección de producto clara y operativa, tablero de iniciativas ficticias con filtro, búsqueda, selección/detalle y guardar vista; servicio y contacto local.
- `/forum`: sitio de encuentro de estética de cartel, visualización generada del recinto, espacios, programa seleccionable y reserva de visita local.
- Páginas secundarias `/campaign/story` y `/system/blueprint`; página índice para elegir cada aproximación. Se usa `PageTransition` en rutas y `transitionTypes` de Next en navegación.
- Formularios y estado de agenda guardan datos de muestra en `localStorage`. No hay backend, correo, pagos, identidad ni reserva real. Todos los nombres, casos, métricas, testimonios, lugares y evento son ficticios.
- Los originales visuales se generaron con Codex imagegen y se incorporaron en `public/images/`; los alt y los pies aclaran que son visualizaciones conceptuales.

## Diferencias con la referencia

No hay una referencia única: son tres expresiones deliberadamente divergentes de la misma firma. Señal habla de participación pública con fotografía y órbitas; Rizo OS funciona como herramienta de operación; FORO / 10 usa escala tipográfica, recinto y programa. Se reutilizan identidad, tipografías y tokens, no la composición. No se cambió la API de Trama.

## Aprendido

El tablero del producto transmite una experiencia distinta porque sus controles responden de verdad y el contenido cambia, mientras que las otras dos demos traducen marca y espacio. Las imágenes sintéticas funcionan cuando su naturaleza está declarada. El detector de texto sirve como lista de inspección: las líneas comprimidas de un titular de cartel pueden generar intersecciones geométricas sin que las letras se toquen, por lo que la última palabra la tiene la lectura visual a tamaño real.

## Siguiente

Revisión humana en `http://127.0.0.1:3441/`, con accesos directos a campaña, producto y foro. Si se aprueban como muestra, decidir si se conservan como consumidor independiente o se integran en `/demos`; no publicar, desplegar ni conectar reservas en esta prueba.
