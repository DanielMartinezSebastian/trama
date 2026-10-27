# 53 · El cuaderno del laboratorio: ejercicios, pares medidos y relaciones

> 27-10-2026. El usuario pide iterar los estudios en profundidad dentro del lab para mejorar la librería y la fuente de
> conocimiento. Las herramientas que ya existen se amplían si aportan y quedan documentadas; se tienen que poder usar de
> forma continuada. Cada ejercicio (inspirar y crear a partir de conceptos, ideas o demos sencillas para mejorarlas) se
> anota siempre en el lab, para encontrar relaciones y sacar de ellas guías de estilo y patrones de diseño.

## 0. Conclusiones

1. **Ya teníamos las herramientas de medir; faltaba juntarlas en un bucle y dejar rastro.**
   - Medir: `refs:probe` para el estilo, `cine:web` para el mapa y `cine:capture`/`cine:compare` para el movimiento.
   - Dejar rastro: no había un sitio común para lo que se hace con esas medidas.
   - Lo nuevo:
     - el **cuaderno** (`docs/cuaderno/`, `/lab/cuaderno`, `npm run lab:cuaderno`);
     - el **modo par** de `refs:probe` (original frente a réplica), que convierte la revisión a ojo en una lista de
       diferencias.
2. **El primer par lo demostró.**
   - Q47 frente a K72 empezó cerca en 10 de 20 medidas.
   - Las diferencias eran reales y a ojo no se veían:
     - el titular de K72 es **ligero (300)**, no medio;
     - el párrafo va a 14/21 px y no a 11;
     - el botón del menú se **rellena de lima desde arriba** en 0,15 s.
   - Tras corregirlo quedó cerca en 19 de 20, y la que falta es una medida sin dato.
   - De paso salió una pieza versátil para el kit: `FullscreenMenu triggerHover="fill"`.
3. **Las relaciones salen de las etiquetas, y las etiquetas valen si se reutilizan.**
   - El índice del cuaderno lista el vocabulario con cuántas fichas lleva cada etiqueta.
   - Antes de inventar una, se reutiliza la que existe.
   - Las familias de estilo (`guia`) reúnen colores, letras, tono y patrones: son la semilla de las guías de docs/16
     (E10 de docs/50).

## 1. El bucle de un ejercicio

Cualquier ejercicio del lab sigue estos pasos:
- una réplica de una web;
- una demo reformada;
- una pieza del kit;
- un concepto probado en pequeño;
- una herramienta.

| Paso | Qué | Con qué |
|---|---|---|
| 1. Ficha | Crear la ficha antes de empezar, con el concepto en dos líneas | `npm run lab:cuaderno -- --nueva <id> --tipo réplica` |
| 2. Medir el original | Mapa, estilo, movimiento y lo que haga falta | `cine:web`, `refs:probe`, `cine:capture`… (docs/38 §2) |
| 3. Hacer | Componer con el kit; si falta algo versátil, ampliar el kit (docs/02 §3 y §9) | — |
| 4. Medir el par | Original frente a réplica: lista de diferencias | `npm run refs:probe -- --par <original> <réplica> --nombre <id>` |
| 5. Iterar | Corregir lo que salga en ✗ y volver a medir; mirar las capturas lado a lado | `.refs3d/pares/<id>/par.md` |
| 6. Cerrar la ficha | Qué se midió, qué se hizo, diferencias que quedan, aprendido, siguiente; etiquetas; estado | `npm run lab:cuaderno` |

Una captura no sustituye a mirar: el par da números, y las capturas lado a lado dicen si se parece.

## 2. El cuaderno

- **Fichas**: `docs/cuaderno/<id>.md`. Se versionan y viajan con la rama.
- **Índice generado**: `docs/cuaderno/README.md`. Lo escribe `npm run lab:cuaderno`; `npm run verify` comprueba que esté
  al día y que las fichas sean válidas.
- **Lectura en local**: `/lab/cuaderno`, con filtro por etiqueta (`?f=campo:valor`), familias con sus colores, patrones que
  van juntos y vocabulario. Cada ficha está en `/lab/cuaderno/<id>`, con sus etiquetas enlazadas, las fichas
  relacionadas y las parecidas.
- **Código**: `components/lab/cuaderno/datos.ts` (lectura, revisión y relaciones) y `scripts/cuaderno.mts`.

### 2.1 La cabecera

```yaml
---
titulo: Q47, réplica de K72
fecha: 2026-10-27            # AAAA-MM-DD
tipo: réplica                # estudio | réplica | demo | pieza | concepto | herramienta
estado: en curso             # hecho | en curso | pendiente
referencias: [https://k72.ca/en]
fichas: [docs/50 §3.9]       # dónde está el estudio largo
ruta: /lab/estudios/q47      # dónde se ve
codigo: [components/lab/estudios/q47/Q47.tsx]
colores: [#000000, #ffffff, #d3fd50]   # hex, del fondo al acento
fuentes: [Inter Tight]
sector: [agencia]
guia: [club de alto contraste]          # familia de estilo
tono: [seguro, descarado]
paleta: [fondo oscuro, acento único saturado]
tipografia: [grotesca en mayúsculas, titular gigante]
patrones: [portada sin scroll, reel de vídeo, …]     # estructura y contenido
movimiento: [transición en escalera, …]
piezas: [FullscreenMenu, LineDraw]      # del kit, por su nombre en components/ui o lib/ui
piezas-nuevas: [FullscreenMenu]         # creadas o ampliadas en este ejercicio
relacionados: [pieza-fullscreen-menu]   # ids de otras fichas
---
```

### 2.2 El cuerpo

Lleva estas secciones:
- `## Concepto` (obligatoria);
- `## Qué se midió`;
- `## Qué se hizo`;
- `## Diferencias con la referencia`;
- `## Aprendido` (obligatoria);
- `## Siguiente`.

Escribe solo lo comprobado. Las afirmaciones sobre el código se verifican antes de escribirlas: al rellenar las primeras
fichas salieron dos falsas en Remada, «no hay chat» y «el avatar se encoge en móvil».

### 2.3 Qué revisa `lab:cuaderno`

- Campos obligatorios, fecha, tipo y estado.
- Colores en hex.
- Que las piezas existan en `components/ui` o `lib/ui`.
- Que los relacionados y las rutas de código existan.
- Que estén las secciones obligatorias.
- Al regenerar, avisa de las etiquetas que solo usa una ficha (¿errata o nueva?).

### 2.4 Las relaciones

Salen solo de las **obras** (réplica, demo, concepto). Las fichas de estudio y de pieza agregan etiquetas de otras y las
inflarían.

- **Familias**: por cada `guia`, sus colores, letras, tipografía, paleta, tono y patrones con cuántas obras los llevan.
- **Patrones que van juntos**: parejas de `patrones` que aparecen en dos obras o más.
- **Parecidas**: obras con tres etiquetas o más en común, sin contar piezas.

Las familias alimentan las hojas de estilo de `/guias/<id>` (docs/54): una ficha entra en la hoja de su guía cuando su
etiqueta `guia` es el nombre de la guía en minúsculas («salón editorial claro», «terminal de neón»…).

## 3. `refs:probe` ampliado

Lo de siempre (docs/16 F4) y, desde el 27-10-2026:

| Medida | Cómo | Para qué |
|---|---|---|
| **Paleta por superficie** | Fondos por área visible (el del `body` cuenta como base) y textos por caracteres, en hex con su porcentaje | Comparar color por peso, no por lista |
| **Radios** | Los más repetidos en elementos con fondo, borde, imagen o vídeo (`píldora` si el radio es la mitad del lado) | Forma de botones y tarjetas |
| **Curvas** | `transition-timing-function` más usadas | Carácter del movimiento (easeOut frente a easeInOut) |
| **Hover** | Hasta 12 enlaces y botones del primer pantallazo: estilo calculado del elemento, sus hijos y `::before`/`::after` antes y 600 ms después; `translate`, `scale` y `rotate` cuentan como `transform` | Saber qué gesto tiene cada botón sin mirarlo uno a uno |
| **Mayúsculas** | Por `text-transform` o porque el texto está escrito en mayúsculas | Antes daba «no» a un titular escrito en mayúsculas |
| **Margen** | Solo con lo que se ve (`checkVisibility`, sin `inert` ni `aria-hidden`) | Un menú cerrado contaba como margen |
| **Repo entero** (`--repo <base>`) | Mide las webs y landings de `CATALOG.md`, las réplicas y las guías, y calcula la afinidad de cada página con cada guía (`scripts/guias-afinidad.mts`) | Clasificar el repo por guía y encontrar estéticas sin guía; escribe `components/site/guias/repo.json` (docs/54) |

### 3.0 Lo que aprendió la sonda al medir las 16 réplicas

Cada fallo se arregló en la herramienta, no en la lectura:

| Fallo | Dónde salió | Arreglo |
|---|---|---|
| El hover del original era el del aviso de cookies | Il Colorista | acepta los avisos antes de medir; solo los de cookies (en varios idiomas) y solo en botones o enlaces que no navegan |
| Un color de `color-mix` se leía como negro | Matiz | lee `color(srgb …)` en 0–1 |
| La base de la paleta era el `body` de la página anfitriona, tapado | Matiz | la base es el fondo opaco más profundo que cubre la página |
| Con Lenis, `scrollTo(0, 0)` no volvía arriba | Impulso | vuelve con la rueda y espera a que se asiente |
| Framer escribe el titular a 397 px y lo encoge con `transform` | Impulso | mide el tamaño pintado; el interlineado y el tracking, con el declarado |
| «Inter Display» e «inter display» contaban como dos familias | Impulso | junta las familias sin distinguir mayúsculas |
| Una página pesada colgaba la sonda más de 20 minutos | Oficio (Honhar) | límite por página (`--limite`, 180 s), cierre que no espera y salida al terminar |
| Aceptar «Explore programs» sacaba la sonda de la página | Oficio (Honhar) | ver la primera fila |
| Se comparaba un titular que no existe (escena, foto) | Oficio, Nura, Núcleo | sin texto de 24 px o más en la primera pantalla del original, el titular es informativo |
| Una letra girada del logo (la «C» de Oficio) salía como titular de 11 vw | Oficio | la escala pintada sale de las matrices `transform` y `scale` del elemento y sus antepasados, no de la caja, que crece al girar |
| Una raya que crece en un hijo y la misma raya en `::after` contaban como gestos distintos | Oficio | al comparar el hover no cuenta si la propiedad está en un hijo o en un pseudoelemento |
| El «titular» era un enlace del menú cerrado | Núcleo (Core Atelier) | el titular se busca solo entre lo visible (`checkVisibility` con opacidad) |
| 9999 («sin dato») se comparaba como un número | Q47 | el margen sin tres bloques alineados no se compara |

### 3.1 El modo par

```bash
npm run refs:probe -- --par https://k72.ca/en http://localhost:3020/lab/estudios/q47 --nombre q47
```

Mide las dos, en escritorio y en móvil y con hover, y escribe en `.refs3d/pares/<nombre>/`:
- `par.md`: la lista de diferencias, la tabla completa (✓ cerca · ✗ lejos · · informativa), el hover de las dos y las
  capturas en dos columnas;
- `par.json`: lo mismo, como datos;
- `datos.json` y las capturas.

En local se lee en `/lab/cine/archivo/.refs3d/pares/<nombre>`.

Tolerancias:

| Grupo | Medida | Tolerancia |
|---|---|---|
| Titular | tamaño | ±15 % |
| Titular | peso | ±100 |
| Titular | interlineado | ±0,08 |
| Titular | tracking | ±1,2 % |
| Titular | mayúsculas | igual |
| Texto | cuerpo | ±1,5 px |
| Texto | interlineado | ±0,12 |
| Texto | medida | ±20 % |
| Maquetación | margen | ±12 px (±6 en móvil) |
| Maquetación | largo de página | ±30 % |
| Color | fondos y textos que pesen | ΔE < 12 con alguno de la réplica |
| Hover | número de elementos | la réplica cambia en al menos la mitad que el original |
| Hover | propiedades | todas las del original |

Lo que no mide el par, y se mira con otras herramientas:
- el movimiento ligado al scroll (`cine:capture --drive scroll` + `cine:compare`);
- el menú abierto y las transiciones (fotogramas con Playwright, como en `.refs3d/webs/k72-ca-en/nav/`);
- las páginas internas (otro par con sus URL).

### 3.2 El movimiento por scroll de un par (E14e)

El par de `refs:probe` mira la página quieta. Para saber **cuándo y cómo entra cada texto** al bajar se usan las
herramientas de cine, con tres ampliaciones para webs sin 3D y réplicas traducidas:

```bash
C="--drive scroll --steps 40 --wheel 120 --frames-per-step 6 --cola 1.5 --every 2 --clock-later --espera 6 --avisos"
npm run cine:capture -- <original> $C --out .refs3d/movimiento/<ref>
npm run cine:capture -- http://localhost:3020/lab/estudios/<réplica> $C --out .refs3d/movimiento/<réplica>
npm run cine:analyze -- .refs3d/movimiento/<ref>        # y lo mismo con la réplica: relato.json
npm run cine:compare -- .refs3d/movimiento/<ref> .refs3d/movimiento/<réplica> --emparejar posicion
```

| Ampliación | Por qué |
|---|---|
| `cine:compare --emparejar posicion` | el relato se emparejaba por texto literal, y una réplica traducida salía «falta» en todo; ahora cada texto se empareja con el más cercano en el recorrido (≤ 12 %) y de cuerpo parecido (≤ 1,6 veces) |
| `cine:capture --avisos` | el aviso de cookies salía en el relato de Il Colorista y tapaba la página |
| sin escena, sin espera | una web sin lienzo esperaba 60 s a una escena 3D que no llega; ahora sigue a los 3 s |

La lista de avisos de cookies es una sola (`COOKIES` y `aceptarCookies` en `scripts/cine/navegador.mts`) y la usan las
dos herramientas. Para que acepte de verdad:
- solo pulsa un botón que esté de verdad en pantalla (lo que hay en su centro es él), con un clic de ratón real;
- en la captura, espera hasta 8 s al aviso que sale con temporizador.

**Resultados (E14e):**

| Par | Error medio del momento de entrada | Lo que salió |
|---|---|---|
| Abuela Rosa / Peppa Sauce | 3 % | los maridajes entran en el mismo punto; tres textos suben en el original |
| Impulso / Essor | 2 % | los titulares que cruzan, en su sitio |
| Cita / Rendezvous | 5 % | Rendezvous sube sus gigantes al entrar: añadido con `Reveal` |
| Matiz / Il Colorista | — | no medible: el gancho del DOM ve la página con opacidad 0 |

Arreglos en `scripts/cine/hooks/dom.js`:
- la expresión que leía la transparencia del fondo había perdido sus barras y nunca coincidía;
- descarta los bloques con opacidad efectiva 0 o dentro de algo oculto, inerte o `hidden`.

`cine:analyze` borra el relato anterior si el nuevo sale vacío: antes se quedaba el viejo, y la comparación leía datos de
otra captura.

## 4. Primer ejercicio completo: Q47 frente a K72

| Medida | K72 | Q47 antes | Q47 después |
|---|---|---|---|
| Titular | 9,5 vw, 300, interlineado 0,87, tracking 0 | 7,6 vw, 500, tracking −3,5 % | 9,5 vw, 300, 0,87, 0 |
| Párrafo | 14/21 px, 276 px, sangría de 70 px | 11/1,3 | 14/21, 276 px, sangría de 70 px |
| Píldoras | 7 vw, 400, borde de 3 px, a 10 px del borde | 5,6 vw, 600, 1,5 px | 7 vw, 400, 3 px, 10 px |
| Botón del menú | caja de 224 × 50 en la esquina; lima que baja en 0,15 s, easeOutCubic | 120 × 36, sin hover | 224 × 50 con `triggerHover="fill"` |
| Móvil | titular a media pantalla, párrafo debajo, píldoras al ancho, sin hora | titular arriba, píldoras desbordadas | igual que K72 |
| **Par** | | **10 de 20** | **19 de 20** (la que falta es el margen móvil sin dato) |

La ficha está en [replica-q47](cuaderno/replica-q47.md).

## 4b. Las 16 réplicas medidas (E14d, 27-10-2026)

«Antes» es la primera medida de cada par, con la sonda de ese momento. «Después» es la medida final de las 16, en una
sola pasada con la sonda definitiva (`.refs3d/pares/resumen.tsv`). Cada iteración está detallada en su ficha.

| Réplica | Referencia | Antes | Después | Lo principal de la iteración |
|---|---|---|---|---|
| Q47 | K72 | 10/20 | **18/18** | titular ligero (300), botón de menú que se rellena (`triggerHover`), móvil |
| Abuela Rosa | Peppa Sauce | 12/17 | **16/16** | las dos letras son estrechas; texto de tarjeta a 36 px |
| Lobo | Fenriz | 11/20 | **20/20** | media web: bandas de foto, socios, preguntas, tienda, pie; Antonio; `RollLink fade` |
| Raíz | Marco Ambrosi | 12/20 | **19/20** | Outfit, columna de 1132 px, subrayado que crece |
| Impulso | Essor | 10/20 | **19/20** | media web (5 frente a 26 pantallas): nueve secciones, titulares que cruzan fijados, Lenis, `RollLink` |
| Ahora | Future London Academy | 10/19 | **19/20** | tracking negativo constante; escala |
| Cita | Rendezvous | 10/20 | **18/20** | el final en negro (preguntas, reserva, pie con foto); escala 124/340 px |
| Talla | Skulpt | 11/20 | **18/20** | Antonio, oferta con foto fija, contacto en bloque curvo |
| Vive | FIT AND YOU | 8/17 | **16/17** | Antonio (al kit), el final (mapa, «pon tu forma física primero», pie), hovers de la isla |
| Matiz | Il Colorista | 13/20 | **16/19** | escala (texto a 24 px), mosaico de 350 px, cabecera de 138 px |
| Remada | Surfing Academy | 6/16 | **15/16** | media web: vlogs, collage, preguntas, contacto, pie; Lenis |
| Patrón | Don Barber | 12/17 | **15/17** | gótica más ligera (Antonio 400), cinta dentro de la portada |
| Melena | Hair Me Up | 10/20 | **15/20** | DM Serif y Lora, final en melocotón, subrayado que crece |
| Núcleo | Core Atelier | 14/20 | **13/14** | Crimson Pro y Albert Sans, Lenis; el titular dejó de compararse (menú cerrado) |
| Oficio | Honhar | — | **9/12** → 11/12 | brocha con espaciado abierto (no condensada); el final completo |
| Nura | ALICE | 6/11 | **8/11** → 10/11 | 8 px al borde, filas de 348 px; `TeamSection rowLink` |

**Siete réplicas eran media web** (Impulso, Cita, Vive, Talla, Lobo, Remada, Oficio): el largo de página del par lo
delató en todas. Lo que queda en ✗ es sobre todo la letra cuando la del original es de pago; está anotado en cada ficha.

## 5. Piezas que salen de medir pares

Ficha común en [pieza-hovers-de-enlace](cuaderno/pieza-hovers-de-enlace.md) y [pieza-antonio](cuaderno/pieza-antonio.md).

- `FullscreenMenu triggerHover="fill"`: el relleno del acento que baja sobre el botón y pasa el contenido al color del
  fondo (K72).
- `NavBar linkHover="underline"`: la raya que crece bajo los enlaces. Sale en tres webs: Hair Me Up, Marco Ambrosi y
  Core Atelier.
- `RollLink fade`: el texto que rueda y se funde (Fenriz; el rodar solo, en Essor y K72).
- `TeamSection rowLink`: la fila entera como enlace de la persona (ALICE).
- **Antonio** en `lib/ui/fonts.ts`: condensada libre de varios pesos para el «club de alto contraste» y la «barbería de
  carácter». Las letras propias de una sola web se cargan en su réplica.

## 6. Siguiente

- Medir el movimiento por scroll en las que lo tienen (Rendezvous, Essor, Il Colorista, Peppa Sauce) con
  `cine:capture` + `cine:compare`.
- ~~Con las familias del cuaderno, escribir las guías de docs/16 (E10).~~ Hecho: siete guías de sector y cuatro del
  repo, cada una con su hoja en `/guias/<id>` (docs/54).
- Volver a medir con `refs:probe --repo` cada vez que entre una web, una réplica o una guía.
