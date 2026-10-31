---
titulo: Inés Bruma, portfolio de ilustradora digital
fecha: 2026-10-30
tipo: demo
estado: hecho
referencias: [https://www.granyon.com/work/aurelia-durand, https://www.aurelia-studio.com/, https://www.torebentsen.com/]
fichas: [examples/demo-ines/README.md]
ruta: /demo/ines-bruma
codigo: [components/landings/ines-bruma/InesBrumaLanding.tsx, components/landings/ines-bruma/ines-bruma.css, lib/demos-portfolio.ts, examples/demo-ines/app/page.tsx.txt, examples/demo-ines/app/studio.css.txt, public/images/ines-bruma/ines-bruma-sheet.webp, public/images/ines-bruma/ines-bruma-night-garden.webp, public/images/ines-bruma/ines-bruma-rooftop-kite.webp]
colores: [#f4efdf, #202221, #b93228, #273f9b, #f2bd48]
fuentes: [Instrument Serif, Instrument Sans, JetBrains Mono]
sector: [ilustración, cultura]
guia: [editorial]
tono: [cálido, curioso, artesanal]
paleta: [papel cálido, tomate, azul ultramar, amarillo mantequilla, verde]
tipografia: [serif expresiva en titulares, mono en metadatos]
patrones: [portfolio asimétrico, archivo filtrable, ficha de obra modal, contacto local]
movimiento: [shader WebGL en hover, escena expandida con scroll, reflejo desenfocado de la escena, revelado por recorte, movimiento reducido respetado]
piezas: [GuideFrame, Button, DistortImage, ScrollExpand, Reveal]
piezas-nuevas: []
relacionados: [demo-rizo-empresa-tecnologica]
---

## Concepto

Una ilustradora digital ficticia enseña su archivo como un cuaderno desplegado: las piezas ocupan composiciones con escalas y ritmos distintos y se abren en una ficha para ampliar contexto. Encargo de prueba para observar si las skills convierten una referencia premiada en una dirección concreta sin calcar su interfaz.

## Qué se midió

Se revisaron el caso de estudio del estudio que diseñó el sitio de Aurélia Durand, su web y el artículo editorial de Communication Arts. El caso acredita Site of the Day de Awwwards. La web original no se pudo inspeccionar de forma interactiva desde el navegador de esta sesión; las decisiones de detalle se basan en descripciones publicadas y se etiquetan como interpretación, no como medición directa.

## Qué se hizo

- Se creó un portfolio de una sola página con introducción, archivo filtrable, presentación, formulario local y fichas de obra modales.
- Se generó una serie original de seis ilustraciones conceptuales en una plancha común y se usa con recortes CSS. La artista, obras, editoriales y campañas son ficticias.
- Se compuso una dirección editorial de papel cálido, serif de titulares, folio mono, piezas rotadas y una cuadrícula asimétrica. GuideFrame y Button aportan piezas del kit Trama.
- La ilustración principal tiene distorsión WebGL al puntero; una segunda escena se expande desde una tarjeta inclinada hasta ocupar la ventana con ScrollExpand; el archivo revela las imágenes con Reveal. El texto de las fichas permanece visible durante el movimiento.
- La escena expandida usa una ilustración distinta de la portada: dos personas remontan una cometa sobre los tejados junto al mar. La misma imagen cubre y desenfoca a 42 px todo el fondo del área sticky, de modo que llena el hueco que deja la tarjeta mientras crece; la obra frontal mantiene su proporción y queda nítida. El brillo del fondo se conserva para que la escena siga adaptándose a la imagen en vez de verse oscura.
- Se guardaron los dos originales en PNG y se sirven como WebP de 367 KB y 450 KB para reducir la descarga de esas imágenes de 6,3 MB a unos 817 KB.
- El preparador materializa un consumidor Next aislado en `.cache/demo-ines-review/`, copia dependencias locales y assets.
- Se integró en la galería de Trama como portfolio editorial independiente, accesible desde `/demos` y directamente en `/demo/ines-bruma`; el CSS quedó limitado al marco `.ines-frame` y los medios se sirven desde el repositorio.

## Diferencias con la referencia

**Observado en fuentes:** el sitio de Aurélia Durand fue concebido como un universo lúdico donde obra, color y movimiento se trasladan a la interacción; se mencionan personajes animados, detalles ampliables, exploración y filtros por palabras clave. El diseñador/desarrollador del proyecto registra Site of the Day y Developer Award de Awwwards en 2021. [Portfolio de Tore S. Bentsen, sección de premios](https://www.torebentsen.com/), [Granyon, caso de Aurélia Durand](https://www.granyon.com/work/aurelia-durand), [Communication Arts, entrevista al estudio](https://www.commarts.com/webpicks/aurelia-durand).

**Inferido:** una interacción que emerge de la obra puede hacer que un portfolio se sienta propio y ayude a explorar, mientras el filtro y el contacto conservan una ruta clara para potenciales clientes.

**Decidido para esta demo:** en vez de reproducir el universo de personajes danzantes o la navegación descrita, las ilustraciones se presentan como hojas impresas y el movimiento crece desde las imágenes: distorsión de shader bajo el puntero, escena expandida con scroll y recorte revelado en el archivo. Se conservan exploración y filtro, se cambia el sistema visual, la geometría, el relato y la interacción.

## Aprendido

Una referencia específica vinculada al sector hace que el brief de estilo parta de evidencia contextual y no de una receta corporativa. La creación de arte original es crucial aquí: sin las ilustraciones el sistema editorial perdería su razón de ser. La primera pasada reveló dos errores de integración: `overflow:hidden` en el lienzo general cancelaba el sticky de ScrollExpand, y Reveal en modo self se ocultaba a su propio IntersectionObserver con clip-path. El lienzo pasó a `overflow:clip`; Reveal envuelve la imagen y anima su hijo, dejando intactos textos y controles. El recorte llega ahora a pantalla completa en móvil y escritorio. La revisión automática encontró texto blanco sobre el sello rojo y titulares rojos sobre fondo arena por debajo del umbral; se oscureció el rojo y quedaron en cero las infracciones de contraste en 320, 390, 768, 1024 y 1440 px. Axe no puede resolver el texto sobre el gradiente de la escena; las capturas de escritorio y móvil se inspeccionaron y el scrim conserva una lectura clara. La escena expandida tiene obra propia; la misma imagen ocupa, con blur, toda el área sticky detrás de la tarjeta y rellena el hueco durante su expansión, sin oscurecerlo. La revisión geométrica también marca cajas de titulares que se cruzan, pero las formas de las letras se leen sin tocarse. Filtros, ficha, Escape, retorno del foco, menú, formulario, shader en escritorio, fallback plano en tacto y movimiento reducido y ausencia de overflow se probaron en navegador.

## Revisión con `trama-kit-evolution` (31 de octubre de 2026)

Se volvió a clasificar la demo desde el catálogo público del kit. `ScrollExpand` ya cubre el movimiento principal; `DistortImage`, `Reveal`, `GuideFrame` y `Button` cubren las otras interacciones. El fondo borroso que llena el hueco es una composición del consumidor sobre `.ui-sxp__stage`, coherente con el patrón de fondo de `ProjectReel`, pero no hay un segundo uso que justifique todavía una prop pública o un componente nuevo. Se mantiene fuera del kit para evitar fijar en su API una dirección visual de una sola demo. Si aparece otro consumidor que necesite una superficie de fondo independiente de la tarjeta, volver a valorar una prop de fondo para `ScrollExpand`.

La referencia de Aurélia Durand no pudo inspeccionarse de forma interactiva en esta sesión: `cine:web` falló con `ERR_NAME_NOT_RESOLVED`. Por ello, los rasgos atribuidos a la fuente siguen etiquetados como descripción publicada e inferencia, no como medición de movimiento. La captura local `http://127.0.0.1:3451/` pasó `npm run smoke` (200, sin errores ni sombras); se revisó además el estado expandido de escritorio en `.refs3d/ines-motion/adaptive/desktop-150.png`.

## Siguiente

Portfolio integrado en la galería: `/demos` → «Portfolios editoriales» → Inés Bruma, o directamente `/demo/ines-bruma`. La portada conserva el jardín nocturno y la escena expandida presenta la cometa con su reflejo desenfocado.
