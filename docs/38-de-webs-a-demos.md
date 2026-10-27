# 38 · De webs a demos: la fórmula para encargos de varias webs

> Ronda 24 (25-10-2026). El usuario pregunta cómo capturar para **inspirar webs completas**, usando todo lo que
> teníamos y lo que tenemos, y llegar a más cosas que pintan con canvas o con escenas complejas de WebGPU. Quiere una
> fórmula para encargos como «revisa esta web y saca conclusiones», «saca plantillas o componentes de estas cinco
> webs», «mejora la librería con lo que falte» o «créame demos funcionales basándote en ellas».

## 0. Conclusiones

1. **El repo tenía dos niveles de captura que nunca se habían juntado.**

   | Nivel | Qué mide | Herramientas | Documentos |
   |---|---|---|---|
   | **Web** | constantes de estilo (color, tipografía, rejilla, movimiento), estructuras de relato, fórmulas reutilizables, patrón y briefing de las webs 3D, guías de estilo | `refs:probe` | 07, 16, 22 |
   | **Escena** | cámara, materiales, cadena de render, física, texto sincronizado, ruido, con cualquier motor | `cine:*` | 26–37 |

   Faltaba el mapa de la web entera, y con él la forma de pasar de varias webs a decisiones.
2. **`cine:web` es ese mapa.**
   - Recorre la página de arriba abajo.
   - Por pantalla: secciones, si están fijadas, si el scroll es virtual, el 3D de fondo y su coste en la GPU.
   - De la página entera: librerías, fuentes, fijos, cursor, páginas internas y la transición al abrir una.
   - En Meer Mohsin descubrió en una pasada lo que la ronda 19 no vio: la portada con el emblema, una transición de papel
     rasgado, las tarjetas de proyectos con vídeo y la escena que baja de 274 000 a 103 000 triángulos a mitad de página.
3. **`cine:sintesis` cruza varias webs.**
   - Hace una matriz de rasgos con cuántas webs tienen cada uno y qué pieza del kit lo cubre.
   - Separa lo que se compone con el kit de lo que pide un estudio a fondo.
   - Con Meer Mohsin, Lusion y Active Theory: las tres tienen escena 3D detrás del contenido, portada 3D y escenas
     pesadas; dos de tres, scroll virtual, titulares gigantes y navegación fija.
4. **La regla de oro: se estudia un concepto, no una web.** Lo que se repite en varias webs es lo que más rinde en la
   librería. Lo que solo tiene una, y es su firma, va a una demo, no necesariamente a la librería.

## 1. Los cuatro encargos y su salida

| Encargo | Qué se entrega | Herramientas | Tiempo orientativo |
|---|---|---|---|
| **A. «Revisa esta web y saca conclusiones»** | informe: estructura (mapa), técnica (librerías, motor, cadena de render), estilo (constantes), conceptos que tiene (contra docs/37), qué hay en el kit y qué falta, coste de reproducirla | `cine:web`, `refs:probe`, `cine:explora`, `cine:sonda` en sus secciones 3D | 30–60 min |
| **B. «Saca plantillas o componentes de estas N webs»** | matriz de rasgos; plantilla común (secuencia de secciones + guía de estilo + fórmula); lista de componentes nuevos con su capa (técnica, componente o concepto) y prioridad | `cine:sintesis` (lanza `cine:web` en cada una) + A en las secciones marcadas para estudio | 1–2 h + una ronda de cine por concepto nuevo |
| **C. «Mejora la librería con lo que falte»** | componentes y técnicas nuevos con la lista de comprobación de versatilidad (docs/36 §1), catálogo, fichas de concepto | B + procedimiento completo (docs/35) por concepto | 2–5 h por concepto |
| **D. «Créame demos funcionales basándote en estas webs»** | una web funcional (portada, secciones, páginas) en `/sitios/<demo>` o `/demo/<demo>`, con las piezas 3D a la altura de la referencia en **sensación y profundidad** | B + guía de estilo (docs/16) + fórmula (docs/07) + patrón 3D (docs/22) + banco y vueltas para cada pieza 3D | 1–3 días |

## 2. Cómo capturar para inspirar webs completas

Por orden; cada paso decide si hace falta el siguiente.

1. **Mapa**: `npm run cine:web -- <url>` en escritorio, y `--movil` si importa.
   - Salida: secciones con su tipo y atributos (3D detrás, fijada, scroll virtual), la técnica de la página, la
     transición entre páginas y `tira.jpg` con una miniatura por sección.
   - Si la web tiene varias páginas, otro mapa de las dos o tres más importantes (`pagina.enlaces`).
2. **Estilo**: `npm run refs:probe -- <url>`. Da color, escala tipográfica, márgenes, rejilla, superficies y movimiento
   en escritorio y móvil, que son las constantes de docs/16. Sale la guía de estilo más cercana o una nueva.
3. **Por cada sección 3D o de canvas que importe** (las marcadas para estudio en la síntesis):
   1. `cine:explora` (gestos) y `cine:sonda` (técnica y parámetros reales);
   2. `cine:capture` de esa sección (`--recorte` si es una tarjeta, `cine:tramo` para cortarla) y `cine:analyze`, que
      da `pasadas.md` con la cadena de render con cualquier motor;
   3. sin three: `cine:flujo` para el movimiento;
   4. con grupos de cuerpos: `cine:conjunto`;
   5. `cine:vuelta --ruido` para saber cuánto varía.
4. **Si se hace una réplica o una demo a partir de la web**: medir el par original/réplica con
   `npm run refs:probe -- --par <original> <réplica>` e iterar hasta cerrar las ✗, y dejar la ficha del ejercicio en el
   cuaderno del lab (`npm run lab:cuaderno -- --nueva <id>`, `/lab/cuaderno`). Método en docs/53.
5. **Transiciones entre páginas**: el mapa mide la primera. Para estudiarla, capturar con `--clic` en el enlace y
   comparar con el flujo (eje de movimiento) o con el ritmo (docs/36 A3, pendiente).
6. **Escenas complejas de WebGPU**:
   - el gancho de three ve las escenas de `WebGPURenderer` igual que las de WebGL;
   - `gl.js` cuenta los render pass, cada uno con su codificador;
   - `shaders.js` guarda el WGSL, con los nombres de las funciones si las dejaron: Hublot y Tidewater los dejan, y son
     la mejor fuente.

   Si la escena no se ve (motor propio, sin `__THREE_DEVTOOLS__`), quedan la cadena de render, los shaders, el flujo y
   el vídeo.

## 3. De la síntesis a decisiones

`cine:sintesis` ordena los rasgos de más a menos repetidos. La regla:

| Rasgo | Decisión |
|---|---|
| En la mitad de las webs o más, y el kit lo cubre | Entra en la plantilla común con la pieza del kit |
| En la mitad o más, y el kit **no** lo cubre | Ronda de cine (docs/35) **por concepto**, con la referencia que mejor lo haga; sale técnica + componente + ficha de concepto (docs/36 §1) |
| En una sola web y es su firma | Demo de esa web (encargo D); a la librería solo si es versátil |
| 3D o canvas en cualquier caso | Estudio a fondo antes de decidir: lo que parece «una escena 3D» puede ser un concepto reutilizable (el grabado de Chartogne) o un decorado que no lo es |

**La plantilla común** sale de tres fuentes:
- la secuencia de secciones que se repite (la síntesis la saca de los mapas);
- la guía de estilo más cercana (docs/16, `refs:probe`);
- la fórmula de docs/07 que encaje: plano técnico, evento con wordmark, arquitectura tranquila, estudio editorial,
  producto o tienda; o una nueva si no encaja ninguna.

Se monta con Secciones del kit (`Hero`, `FeatureGrid`, `PinnedSection`, `ChapterStage`…) y las piezas 3D.

## 4. Demos funcionales: el listón

1. **Funcional**: navegación real, varias páginas si la referencia las tiene, contenido de la marca inventada (no
   «lorem ipsum»), formularios que no envían nada, versión sin WebGL y móvil.
2. **Sensación y profundidad** (docs/36 §0b), para cada pieza 3D o de canvas:
   - banco, receta y vueltas hasta el objetivo de cada eje (docs/35 §3);
   - las mismas capas de profundidad;
   - la misma respuesta al gesto;
   - el decorado que haga falta;
   - la puntuación del usuario en el panel.
3. **Con piezas de la librería**: lo que la demo necesite y no esté en el kit se hace como técnica o componente
   versátil (docs/36 §1) y la demo lo usa. No se hacen piezas de un solo uso dentro de la demo.
4. **Documentada**: un documento corto por demo (qué webs, qué conceptos, qué piezas, qué cifras) y su entrada en el
   panel.

## 5. Ejemplo: tres webs ya mapeadas

`npm run cine:sintesis -- .refs3d/webs/meermohsin https://lusion.co/ https://activetheory.net/` (resultado en
`.refs3d/sintesis/prueba/sintesis.md`):

- **Plantilla común**: portada 3D a pantalla completa → titular gigante sobre el 3D → secciones que alternan titular y
  escena (fijadas o con scroll virtual) → trabajos → cierre.
- **En el kit**: titulares gigantes (`FitText`, `SplitText`), navegación fija (`IslandNav`, `HideOnScroll`), relato
  fijado (`PinnedSection`, `ChapterStage`), cursor y scroll suave.
- **Para estudiar por concepto**:
  - el **scroll virtual con escena** (Lusion y Active Theory), con `useScrollStory`, `ScrollStage` y el reel;
  - la **cadena de agencia** (bloom, anamórfico, partículas: Active Theory);
  - la **transición de papel rasgado** y las **tarjetas de proyecto con vídeo** (Meer Mohsin);
  - la **transición entre páginas** (Lusion).

## 6. Herramientas nuevas de esta ronda

| Orden | Qué hace |
|---|---|
| `npm run cine:web -- <url>` | Mapa de la web entera: secciones (tipo, 3D detrás, fijada, scroll virtual, coste en la GPU), técnica, fuentes, fijos, cursor, páginas, transición; `web.md`, `web.json` y `tira.jpg`. Visibilidad real: oculto por `clip-path`, tapado por otra capa o transparente no cuenta |
| `npm run cine:sintesis -- <url o mapa> …` | Matriz de rasgos de N webs contra el kit, qué estudiar y la plantilla común; `sintesis.md` |
| `npm run cine:reestudio` | Vuelve a pasar todos los estudios con el inspector de hoy (docs/35 §5) |
| `cine:vuelta` con objetivos | «Cumple N de M» por eje con su objetivo; eje de profundidad; tu puntuación en `/lab/cine` (docs/36 A1, A8, A9) |

## 7. Pendiente

- Mapear las páginas internas además de la portada (hoy, solo la transición a la primera).
- Clasificar mejor las secciones con texto partido en `span` (el relato de Meer Mohsin sale como «escena 3D sola»
  porque sus palabras no son titulares).
- Enlazar la síntesis con `refs:probe` en una sola tabla de estilo.
- El panel `/lab/cine` con una pestaña de webs mapeadas y síntesis.
