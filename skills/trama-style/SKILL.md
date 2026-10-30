---
name: trama-style
description: Elegir, aplicar, adaptar o revisar una guía visual de Trama en un proyecto trama-ui. Usar para tipografía, composición, espacio, superficies y movimiento; no impone una estética Trama a proyectos ajenos.
---

# Aplicar una dirección visual

Resuelve la versión del consumidor con `node <directorio-de-esta-skill>/scripts/context.mjs --cwd <proyecto>`. Consulta el índice y la guía de esa instalación. Cada guía tiene ficha en `knowledge/guides/<id>` con tokens, fuentes y una tabla de contraste medida; úsala para decidir qué roles sirven para texto. Receta, piezas y ejemplos selectivos son solo los de salon. No copies valores de `main` a una dependencia antigua.

Elige por público, contenido y acción principal; conserva una guía/adaptación ya definida salvo que el encargo pida cambiarla. Una guía es más que paleta: escala y peso tipográfico, espacio, medida de lectura, superficies y ritmo de movimiento. Aplica `GuideFrame` y clases `ui-g-*` donde corresponda, más `variant` en las piezas; tokens en un contenedor no rediseñan automáticamente su composición.

Comprueba fuentes disponibles y su carga. `trama-ui/fonts` depende de la transformación `next/font`; sigue la configuración comprobada del contexto. Las familias Fontshare no son archivos incluidos; declara sustituciones. Si una referencia externa determina la dirección, separa observación, inferencia y decisión; el [formato de brief](../trama-research/references/brief.md) es opcional si esa skill está instalada.

Propón una muestra representativa antes de extender una adaptación global. Revisa titulares y texto largo, botones, formularios y estados en móvil/escritorio. Mide contraste por uso: un token de guía no garantiza lectura; usa 4,5:1 para texto normal y 3:1 para texto grande/controles. Si la API de la versión instalada ofrece `GuideFrame textContrast`, puede ajustar el texto del kit sobre `--bg` opaco sin cambiar los tokens decorativos; consulta sus límites. Para CSS propio usa `var(--mut-text, var(--mut))` y `var(--acc-text, var(--acc))`. Comprueba aparte superficies, estados y colores semánticos; adapta roles localmente cuando haga falta y registra la razón, sin modificar la guía global por un solo cliente. Comprueba foco, encuadres, desbordes, CTA persistente y movimiento reducido.

Decide si una imagen raster aporta algo concreto a la dirección visual. Para una foto, ilustración o textura original, prepara un brief con sujeto, tono, encuadre, proporción y paleta; si el cliente actual ofrece generación de imágenes (por ejemplo, Codex imagegen), puedes usarla. Es opcional: no la supongas disponible ni fuerces imágenes donde basten componentes, SVG o CSS. Evita texto y logotipos incrustados salvo que el usuario los haya proporcionado. Revisa el resultado y su recorte en los tamaños de uso.

Conserva la identidad elegida entre rutas y estados. Entrega la decisión y sus fuentes junto a capturas e inspección visual; una puntuación de afinidad no sustituye revisión humana ni acredita funcionalidad.
