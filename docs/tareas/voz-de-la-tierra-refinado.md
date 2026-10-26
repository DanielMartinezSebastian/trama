# Voz de la Tierra — evaluación y refinado

- Objetivo autorizado: evaluar las cuatro rutas, rehacer lo necesario y añadir imágenes o vídeos con los fetch del repo.
- Restricción del usuario: trabajar en un worktree separado porque Claude trabaja en `trama-cine`.
- Rama / base / directorio: `feat/voz-de-la-tierra-refinado` / `3c9466e` / `C:/COMPARTIDO/trama-voz`.
- URL de revisión: http://localhost:3007/sitios/voz-de-la-tierra. Dev propio activo; no se detuvo ni modificó el servidor 3000.
- Preparación: worktree nuevo, `npm ci` propio y `.next` propio. Se copió la demo sin commit desde `trama-cine` y se registró en este worktree. También se trasladaron las instrucciones y herramientas de flujo pendientes de commit (`AGENTS.md`, `docs/flujo-agentes.md`, scripts doctor/smoke/base-url y sus entradas de package.json). Son preparación compartida, que habrá que distinguir de la tarea al integrar.

## Evaluación inicial

Las cuatro rutas respondían sin errores JS y sin overflow en móvil. La base tipográfica y el objeto persistente eran útiles, pero había problemas de acabado:

1. El objeto era un disco con una funda cuadrada inventada y etiqueta ficticia; no representaba con suficiente fidelidad el Disco de Oro.
2. La escena no variaba entre capítulos salvo su caja. En viaje quedaba reducida a una moneda muy pequeña.
3. Surcos repetía muchas tarjetas pequeñas y añadía música techno sintetizada del kit, ajena al tema.
4. La cabecera transparente se mezclaba con el texto al hacer scroll; algunos titulares grandes invadían la entradilla por su interlineado.
5. No había archivo visual real, y algunas descripciones de los contenidos eran inexactas.
6. El mensaje no validaba los datos restaurados de localStorage; «Escribir otra» no borraba la copia anterior, que reaparecía al recargar. Los errores de almacenamiento quedaban ocultos.

Evidencia original ignorada: `.refs3d/voz/antes/` (cuatro rutas, cuerpo y móvil; resultado.json).

## Cambios aplicados

- Dirección visual: archivo espacial, con oro, tinta, papel, Gloock, Instrument Sans y Martian Mono. Nueva portada «La voz de la Tierra», vídeo de contexto y secciones documentales con imágenes grandes. Se conserva el carácter de la demo.
- Disco y cubierta circulares con volumen, canto y bisel; disco con agujero real. Texturas históricas descargadas de NASA/Commons, sustituyendo los canvas inventados. Dos controles permiten inspeccionar disco y cubierta. Se separan en profundidad, varían de pose con el capítulo y con el scroll, y conservan el canvas al navegar.
- La escena solo dibuja cerca del viewport y con pestaña visible. DPR limitado a 1–1.5; alternativa fotográfica sin WebGL o con movimiento reducido. Preloader sin dependencia de un canvas que podría no crearse.
- Cabecera legible al desplazar, navegación en dos filas en móvil y mayor interlineado en titulares. Surcos cambia de tarjetas a filas de archivo. Viaje muestra un objeto mayor y la fotografía original Pale Blue Dot, preservando su baja resolución como documento histórico.
- Imágenes y película con pie y origen visible. Se distingue el material contemporáneo de la ISS del archivo de Voyager y de las 115 imágenes grabadas en el disco.
- Audio original de los 55 saludos en lugar de pistas sintetizadas. Reproducción voluntaria, controles de pausa/progreso y sin autoplay.
- Mensaje: límite de 280 caracteres, validación al restaurar, persistencia, borrado real, aviso si el dispositivo bloquea el guardado y descarga TXT. Se mantiene explícita la naturaleza imaginaria del ejercicio y que no se envía a ningún servidor.
- Navegación mediante Traveler/SharedText; sin fundidos de cards ni barridos que oculten el texto. El boundary de navegación vive en el Shell para que se active al cambiar de ruta.

## Recursos reproducibles

- `npm run images:fetch -- voyager`: cuatro imágenes, añadidas a `lib/sites/photo-credits.json` y `public/img/voyager/`. El fetch admite títulos curados para archivo histórico, sin rebajar el filtro de las búsquedas normales ni ampliar originales pequeños. Licencia comprobada por la API de Commons.
- `npm run videos:fetch -- voyager`: película de NASA Johnson desde la ISS, 10 segundos a partir del segundo 24. Se revisó la hoja de contacto original con `--hojas voyager`. MP4 y póster en `public/video/voyager/`, atribución en `lib/sites/video-credits.json`.
- `node --import tsx scripts/fetch-voz-audio.mts`: grabación original de NASA, dominio público verificado en Commons. Audio mono a 96 kb/s en `public/audio/voyager/`; crédito junto al archivo. Se conservan sus 4:25 minutos.
- Los medios se sirven localmente; no hacen falta credenciales ni cambios de CSP. No se descargó ni redistribuyó la selección de 115 fotografías protegidas del disco.

Fuentes revisadas:

- [Cubierta del Disco de Oro](https://science.nasa.gov/mission/voyager/golden-record-cover/).
- [Contenido del disco](https://science.nasa.gov/mission/voyager/golden-record-contents/).
- [Saludos originales y traducciones](https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/).
- [NASA: hito de un día luz](https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/): 18-11-2026, 10:16:07 UTC.
- [Pale Blue Dot](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/).
- [Grabación en Commons](https://commons.wikimedia.org/wiki/File:Voyager_Golden_Record_-_Greetings_In_55_Languages.mp3).
- [Película original en Commons](https://commons.wikimedia.org/wiki/File:Earth_Illuminated-_ISS_Time-lapse_Photography.webm).

## Comprobaciones

- `npm run doctor -- --cine --browser`: correcto; avisos esperados de referencias de otros estudios ausentes y `.env.scripts` innecesario para estos fetch.
- `npm run verify`: correcto (typecheck, catálogo, sombras y cine:test). Catálogo regenerado.
- `node --import tsx scripts/qa/voz.mts http://localhost:3007`: ocho grupos de comprobaciones, sin errores JS/consola. Incluyen encuadre del disco y cubierta, reproducción del MP4 y del audio real, canvas persistente, fotografía original, cuenta atrás, guardar/restaurar/descargar/borrar mensaje, cuatro rutas a 320/390/768/1920 px, movimiento reducido, ausencia de WebGL, datos locales inválidos y guardado bloqueado.
- Revisión visual de escritorio, móvil, audio en pantalla estrecha y titulares finales. Evidencias en `.refs3d/voz/despues/` y `.refs3d/voz/qa/` (ignoradas).
- `cine:capture` y `cine:analyze` correctos: `.refs3d/voz/cine/informe.html`, vídeo y hoja de contacto. Escena de dos llamadas por fotograma y 6.908 triángulos. La captura precede a los últimos ajustes de caja y tipografía, revisados en las capturas finales de QA.
- `npm run build`: correcto, 414 páginas. Se paró únicamente el dev propio del worktree, se compiló y se reinició en 3007. Avisos ya conocidos de fuentes de reserva y trazado de archivos del lab. Log ignorado `.refs3d/voz/build.log`.
- `npm run smoke -- http://localhost:3007/sitios/voz-de-la-tierra --out .refs3d/voz/smoke`: HTTP 200, sin errores.
- `git diff --check`: correcto; avisos informativos de CRLF en archivos de preparación copiados.

## Estado y siguiente paso

Refinado aplicado, comprobado y disponible en 3007, sin commit ni integración en `trama-cine`. El otro agente ha seguido avanzando su rama mientras tanto. Revisar esta URL; al integrar, separar los cambios propios de Voz de la Tierra de las herramientas de flujo copiadas al preparar el worktree.
