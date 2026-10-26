# NÁDIR — encuadre completo y coreografía del mecanismo

- Objetivo autorizado: corregir el corte del modelo al final de señal y descenso, y llevar la transición al objeto 3D como en Quilate. Aclaración del usuario: sin fundido ni desenfoque de las cards.
- Rama / base / worktree: `feat/cine-captura` / `01356ff` / `C:/COMPARTIDO/trama-cine`. Se conservan todos los cambios previos.
- URL: http://localhost:3000/sitios/nadir, servidor del usuario conservado.

## Resultado

- Se eliminaron los fondos opacos y degradados de continuación, pie y mensaje que ocultaban parte del modelo. Su centro al terminar los dos primeros capítulos conserva la misma posición lateral y vertical.
- La escala se limita según el volumen de los anillos abiertos, la perspectiva, los bordes del viewport y el espacio de la cabecera. Se conserva la posición del plano; se reduce el tamaño cuando es necesario para mostrarlo completo.
- Se estudió la tabla de poses y el recorrido de Quilate. NÁDIR tiene ahora cuatro poses por capítulo: posición, orientación, zoom, profundidad de separación, despiece de segmentos, torsión y tamaño del núcleo.
- Cada transición anticipa la apertura de las piezas, gira los anillos en sentidos diferentes, traslada el conjunto con una ligera elevación y modifica el acercamiento. Las piezas se reagrupan al llegar al siguiente plano. Los ocho segmentos de cada anillo y sus juntas se animan individualmente mediante sus matrices de instancia.
- Cámara y escala ya no se compensan entre sí: el dolly y el cambio de escala producen un acercamiento visible. Entre rutas la escena persiste y sus poses se interpolan.
- **No hay fundido ni desenfoque del texto al hacer scroll, ni fundido de página como sustituto de la transición física del modelo.** Las primeras pruebas de ese enfoque se retiraron tras la aclaración del usuario.
- Movimiento reducido y alternativa sin WebGL conservados. Pausa de la animación en pestaña oculta conservada.
- Se mantienen 20 llamadas de dibujo por fotograma y 33.296 triángulos en la nueva captura de descenso.

## Archivos

`components/sites/nadir/Scene.tsx`, `Site.tsx`, `nadir.css`; regresión nueva `scripts/qa/nadir-transiciones.mts`. Catálogo regenerado tras retirar el componente provisional de transición de texto; no cambian props públicas.

## Validación

- `npm run doctor -- --cine --browser`: correcto.
- `npm run verify`: correcto; aviso CJS de Three ya conocido.
- `node --import tsx scripts/qa/nadir.mts http://localhost:3000 .refs3d/nadir/transiciones/qa`: once comprobaciones correctas, sin errores JS/consola.
- `node --import tsx scripts/qa/nadir-transiciones.mts http://localhost:3000`: 24 encuadres (1873/1440/390 px, dos rutas, portada/segundo paso/continuación/pie), proyectando los vértices reales de los anillos. Todos dentro del lienzo y por debajo de la cabecera. También comprueba traslado, cambio de escala, separación de anillos, desplazamiento de segmentos, texto sin fundido/desenfoque, canvas persistente, historial y movimiento reducido.
- Revisión visual de las capturas finales y la secuencia de descenso, incluido el móvil.
- Cine: captura nueva de descenso, 175 fotogramas y 29 imágenes; análisis correcto, tres tramos de cámara. Evidencias ignoradas: `.refs3d/nadir/coreografia/captura/` (informe, vídeo y hoja de contacto).
- La captura al tamaño exacto 1873×883 no pudo codificar vídeo H.264 por dimensiones impares; la regresión visual sí usa ese tamaño. Las capturas de vídeo posteriores usan dimensiones pares. No se modificaron herramientas de cine por este motivo.
- `npm run smoke -- http://localhost:3000/sitios/nadir --out .refs3d/nadir/coreografia/smoke`: HTTP 200, sin errores.
- Build final correcto: 414 páginas, en copia aislada con dependencias y `.next` propios `C:/COMPARTIDO/trama-nadir-check-20261026`. Log ignorado: `.refs3d/nadir/coreografia/build.log`. Avisos de fuentes de reserva y trazado del lab ya conocidos. Se conserva el dev del usuario.
- `git diff --check`: correcto, salvo avisos informativos de CRLF en archivos preexistentes.
- Capturas y resultados de regresión: `.refs3d/nadir/transiciones/`; las pruebas y capturas finales reemplazan las pruebas anteriores del fundido descartado. La carpeta contiene también evidencia provisional; la fuente actual es `resultado.json`, `qa/` y las capturas `final-*.png`.

## Estado

Implementado, comprobado y disponible en la URL original. Sin commits ni despliegue. Siguiente paso: revisión del usuario de la coreografía con scroll y navegación entre los tres capítulos.

## Segmentos sólidos y despiece más marcado — 2026-10-26

- Petición: hacer más evidentes las alteraciones de los segmentos y eliminar superficies huecas y costuras visibles.
- Rama / base actual: `feat/cine-captura` / `bee917f`; mismo worktree y servidor del usuario, sin detenerlo. Se conservan cambios ajenos.
- `geometry.ts`: arcos macizos de 45 grados con ambas tapas integradas en la misma geometría. Normales planas en los cortes y continuidad de normales en la superficie curva. En reposo los ocho segmentos encajan exactamente, sin el hueco angular fijo anterior ni las marcas negras que ensuciaban las uniones.
- `Scene.tsx`: los segmentos quedan unidos al estabilizar cada pose. Durante el cambio, apertura de hasta 1.5, mayor separación radial, profundidad alterna y giro alrededor del centro de cada pieza. Al llegar se reagrupan. Menos alejamiento durante el traslado para que el despiece sea visible a mayor tamaño. Se mantiene el límite de encuadre, incluidas piezas abiertas y cabecera.
- Prueba nueva `scripts/qa/nadir-geometria.mts`: los cuatro tamaños no tienen aristas abiertas o no manifold, tienen volumen positivo, tapas orientadas hacia fuera y uniones coincidentes en posición y normales. Correcta.
- Regresión `nadir-transiciones.mts` actualizada: comprueba apertura evidente a mitad del tramo y cierre de los segmentos en ambas poses de reposo. Las 24 mediciones de encuadre y el resto de comprobaciones pasan, sin errores de JS/consola. Texto sin fundido ni desenfoque conservado.
- Revisión visual de anillos continuos, despiece con tapas visibles y móvil. Capturas actualizadas en `.refs3d/nadir/transiciones/`, especialmente `despiece-1440.png` y `final-*.png`.
- Cine: `.refs3d/nadir/segmentos/captura/`, 175 fotogramas, 29 imágenes, análisis correcto. 16 llamadas de dibujo y 42.128 triángulos por fotograma: las tapas siguen instanciadas; se eliminan cuatro familias de juntas. El último ajuste de altura y zoom de la transición está comprobado en las capturas de QA posteriores al vídeo.
- `doctor --cine --browser`, `verify`, prueba geométrica, smoke y `git diff --check`: correctos (avisos informativos preexistentes de Three y CRLF).
- Build final de 414 páginas correcto en copia aislada `C:/COMPARTIDO/trama-nadir-check-20261026`; log `.refs3d/nadir/segmentos/build.log`. No se comparte `.next` con el dev. Avisos de fuentes y trazado del lab ya conocidos.
- Estado: listo en http://localhost:3000/sitios/nadir. Sin commit ni despliegue.
