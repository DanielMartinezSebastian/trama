---
titulo: Inés Bruma, portfolio de ilustradora digital
fecha: 2026-10-30
tipo: demo
estado: en curso
referencias: [https://www.granyon.com/work/aurelia-durand, https://www.aurelia-studio.com/, https://www.torebentsen.com/]
fichas: [examples/demo-ines/README.md]
ruta: http://127.0.0.1:3451/
codigo: [examples/demo-ines/app/page.tsx.txt, examples/demo-ines/app/studio.css.txt, examples/demo-ines/public/images/ines-bruma-sheet.png]
colores: [#f4efdf, #202221, #e14d35, #273f9b, #f2bd48]
fuentes: [Instrument Serif, Instrument Sans, JetBrains Mono]
sector: [ilustración, cultura]
guia: [editorial]
tono: [cálido, curioso, artesanal]
paleta: [papel cálido, tomate, azul ultramar, amarillo mantequilla, verde]
tipografia: [serif expresiva en titulares, mono en metadatos]
patrones: [portfolio asimétrico, archivo filtrable, ficha de obra modal, contacto local]
movimiento: [rotación editorial, acercamiento de ilustraciones, movimiento reducido respetado]
piezas: [GuideFrame, Button]
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
- El preparador materializa un consumidor Next aislado en `.cache/demo-ines/`, copia dependencias locales y assets.

## Diferencias con la referencia

**Observado en fuentes:** el sitio de Aurélia Durand fue concebido como un universo lúdico donde obra, color y movimiento se trasladan a la interacción; se mencionan personajes animados, detalles ampliables, exploración y filtros por palabras clave. El diseñador/desarrollador del proyecto registra Site of the Day y Developer Award de Awwwards en 2021. [Portfolio de Tore S. Bentsen, sección de premios](https://www.torebentsen.com/), [Granyon, caso de Aurélia Durand](https://www.granyon.com/work/aurelia-durand), [Communication Arts, entrevista al estudio](https://www.commarts.com/webpicks/aurelia-durand).

**Inferido:** una interacción que emerge de la obra puede hacer que un portfolio se sienta propio y ayude a explorar, mientras el filtro y el contacto conservan una ruta clara para potenciales clientes.

**Decidido para esta demo:** en vez de reproducir el universo de personajes danzantes o la navegación descrita, las ilustraciones se presentan como hojas impresas y el movimiento se limita a giros, zoom y fichas superpuestas. Se conservan exploración y filtro, se cambia el sistema visual, la geometría, el relato y la interacción.

## Aprendido

Una referencia específica vinculada al sector hace que el brief de estilo parta de evidencia contextual y no de una receta corporativa. La creación de arte original es crucial aquí: sin las ilustraciones el sistema editorial perdería su razón de ser. La revisión automática encontró texto blanco sobre el sello rojo y titulares rojos sobre fondo arena por debajo del umbral; se oscureció el rojo y quedaron en cero las infracciones de contraste en 320, 390, 768, 1024 y 1440 px. Axe conserva un caso incompleto en el sello que se superpone a la ilustración; se inspeccionó visualmente: el texto está dentro de un círculo rojo opaco y el rojo actual cumple el contraste con blanco. La revisión geométrica también marca cajas de líneas de titulares que se cruzan; en las capturas inspeccionadas a 320 y 1440 px las formas de las letras no se tocan y la lectura es clara. Se retiró una nota manuscrita que quedaba parcialmente encima del arte y no aportaba a la lectura. Filtros, apertura/cierre de ficha, tecla Escape, retorno del foco, menú, formulario y ausencia de overflow a 390 px se probaron en navegador.

## Siguiente

Revisar la preview en `http://127.0.0.1:3451/`, incluida la ficha de obra, filtros y formulario, en escritorio y móvil; decidir si se aprueba la dirección y qué parte se itera.
