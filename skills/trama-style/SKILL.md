---
name: trama-style
description: Elegir, aplicar, adaptar o revisar una guía visual de Trama en un proyecto trama-ui. Usar para tipografía, composición, espacio, superficies y movimiento; no impone una estética Trama a proyectos ajenos.
---

# Aplicar una dirección visual

Resuelve la versión del consumidor con `node <directorio-de-esta-skill>/scripts/context.mjs --cwd <proyecto>`. Consulta el índice y la guía de esa instalación. El piloto documenta salon; otras guías pueden existir en `STYLE_GUIDES` aunque no tengan ficha selectiva. No copies valores de `main` a una dependencia antigua.

Elige por público, contenido y acción principal; conserva una guía/adaptación ya definida salvo que el encargo pida cambiarla. Una guía es más que paleta: escala y peso tipográfico, espacio, medida de lectura, superficies y ritmo de movimiento. Aplica `GuideFrame` y clases `ui-g-*` donde corresponda, más `variant` en las piezas; tokens en un contenedor no rediseñan automáticamente su composición.

Comprueba fuentes disponibles y su carga. `trama-ui/fonts` depende de la transformación `next/font`; sigue la configuración comprobada del contexto. Las familias Fontshare no son archivos incluidos; declara sustituciones. Si una referencia externa determina la dirección, separa observación, inferencia y decisión; el [formato de brief](../trama-research/references/brief.md) es opcional si esa skill está instalada.

Propón una muestra representativa antes de extender una adaptación global. Revisa titulares y texto largo, botones, formularios y estados en móvil/escritorio. Mide contraste por uso: un token de guía no garantiza lectura; usa 4,5:1 para texto normal y 3:1 para texto grande/controles. Cambia roles en la adaptación local y registra la razón, sin modificar la guía global por un solo cliente. Comprueba foco, encuadres, desbordes, CTA persistente y movimiento reducido.

Conserva la identidad elegida entre rutas y estados. Entrega la decisión y sus fuentes junto a capturas e inspección visual; una puntuación de afinidad no sustituye revisión humana ni acredita funcionalidad.
