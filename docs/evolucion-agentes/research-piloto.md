# P3b: tres entradas y un brief de construcción

29-10-2026. Se aplica el procedimiento de `trama-research` a entradas del piloto local. No es una importación universal
ni una investigación de un negocio real. La captura, URL y guía son **fuentes distintas del mismo caso ficticio**, no
tres webs externas independientes. El evaluador de P4 construye variantes del hero desde la captura adjunta.

## Captura → adaptación del hero

Fuente: `.refs3d/agent-pilot/reference-hero.png`, 1440×900, captura de Chromium del consumidor construido con el `.tgz`
0.13.0. La [evidencia de fuentes](./research-evidencia.json) conserva hashes y condiciones. Modo: adaptar, sin buscar
igualdad de píxeles.

| Tipo | Hallazgo y razón | Traducción |
| --- | --- | --- |
| Observado en la imagen | Titular de tres líneas a la izquierda, ilustración cálida a la derecha, amplios espacios blancos y una llamada subrayada | Mantener jerarquía y dos columnas en escritorio |
| Inferido | Apariencia de serifa fina, sans pequeña y proporción de columnas cercana a 55/45; una imagen aislada no revela familias exactas o CSS | Elegir Cormorant/Manrope por la guía disponible, sin atribuir su identificación a la imagen |
| No observado en esta captura | Móvil, foco, estados de formulario, animación y regiones bajo el viewport | Diseñar texto antes de imagen en móvil; revisar teclado/movimiento aparte |
| Decidido | Usar guía salon con acento legible, ilustración propia recibida por prop y CTA de reserva | `GuideFrame` + HTML de composición o piezas adecuadas, sin usar una foto de demo |

Brief: hero para Linde, público de salón, objetivo reservar; texto «Un corte. Un color. Tu manera.», introducción propia,
CTA mediante `bookHref`, SVG mediante `artSrc` con alt. Comprobaciones: fuente compilable con API pública, layout en
1440×900 y 390×844, sin desborde, título antes de imagen en móvil y contraste. El criterio es adaptación; no se exige
coincidencia píxel a píxel. La construcción independiente y sus fallos se registran en P4.

## URL → mapa de decisiones

Fuente local: `http://127.0.0.1:3417`, servidor del consumidor iniciado y cerrado por el test. Observación del
29-10-2026 a las 10:31 UTC. No es una URL de producción persistente. Se recorrieron portada/reserva/citas en
escritorio y móvil, y se ejecutó la sonda existente `scripts/probe-refs.mts` sobre la portada.

Evidencias ignoradas/regenerables: `.refs3d/agent-research/url-evidence.json`, `probe/datos.json`, capturas escritorio,
móvil y scroll. La sonda es herramienta del repo, no un comando que la skill prometa al consumidor npm.

| Tipo | Hallazgo y método | Decisión |
| --- | --- | --- |
| Observado por DOM | Guía `salon`; título Cormorant Garamond, 110,88 px y peso 300 en 1440 px | Mantener roles y escala fluida; estos valores corresponden a este viewport, no una constante universal |
| Observado por DOM | Rejilla de portada 642,391 / 525,609 px, margen inicial del título x=100 | Conservar prioridad del texto y dar a la ilustración espacio propio |
| Observado por recorrido | Reserva guarda localmente; lista relee tras navegar; cambio/anulación y calendario funcionan en las condiciones registradas | Comunicar el alcance local; no trasladarlo como prueba de backend |
| Inferido | Un ritmo más compacto puede convenir a otra longitud de contenido | No cambiar escala global sin probar ese contenido |
| Decidido | Adaptar estructura y estados, sin copiar credibilidad o clientes de una referencia | Textos ficticios, imágenes originales y avisos de demostración |

Brief: tres rutas del [contrato piloto](./p1-contrato-piloto.md); selección de componentes según versión; datos propios,
storageKey por proyecto y fechas de test fijadas. Cierre por HTTP/render, recorrido, móvil, teclado, fuentes y contraste;
sin certificación completa de accesibilidad a partir de una auditoría automática.

## Guía externa al kit → adaptación local

Fuente: [brief de marca Linde](../../examples/agent-pilot/references/linde-brand.md), creado para el experimento y
declarado ficticio. No se presenta como un documento de cliente ni como evidencia de lectura de PDF.

| Regla explícita | Correspondencia | Vacío/decisión |
| --- | --- | --- |
| Blanco, tinta oscura, superficie cálida y rosa decorativo | Roles `bg`, `fg`, `card`, `acc2` de adaptación salon | El rosa no se usa como texto pequeño sobre blanco |
| Serifa para titular, sans para texto; preferencia Cormorant/Manrope | Familias ya declaradas en la guía/carga de fuentes del paquete | Se comprobó build y carga; no basta nombrarlas |
| Texto antes de imagen en móvil, foco visible, reducción de movimiento | Composición responsive, foco local y `prefers-reduced-motion` | La guía no define escala o duraciones completas; se toman de salon, como decisión |
| Sin agenda/correos reales ni recursos externos | SVG propios, datos ficticios y notas de demostración | Integraciones pendientes, sin ampliar el encargo hacia backend |

La adaptación refuerza `mut` y `acc` desde `GuideFrame.style`: una clase sobre el mismo nodo no prevalecía ante sus
valores inline. Se retiró una palabra de fondo decorativa que interfería con lectura/comprobación de contraste en móvil.
Es una variación del piloto, no una modificación global de `STYLE_GUIDES`.

## Casos de incertidumbre y cierre

Captura sin móvil: lo móvil es decisión posterior. Familias no identificadas: sustitución declarada. URL inaccesible:
no hay observación DOM válida y se continúa solo con evidencias disponibles. Guía sin movimiento: se registra el vacío,
no se le atribuyen las duraciones de Trama. Pieza ausente: contrastar exports/tipos de esa versión y proponer composición
local, sin inventar una API. No se han ensayado aquí PDFs, importación de tokens, referencias 3D o marcas reales.

La ficha de investigación conserva fuentes, observado/inferido/decidido, compatibilidad, assets, rutas/estados y criterios
de validación. Las capturas y la sonda no se empaquetan como requisitos de las skills. La construcción/validación de
variantes desde captura está separada en la evaluación; no se marca completada por escribir este brief.
