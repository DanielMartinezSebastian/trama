# Diagnóstico de enlaces de demos en 3020

- Objetivo: reproducir y localizar el fallo de navegación en http://localhost:3020/demos.
- Workspace revisado: C:/COMPARTIDO/trama, rama main, commit cd243dc. Se conservan los cambios locales previos.
- Servidor afectado: C:/COMPARTIDO/trama-estudios, rama feat/cine-captura, commit ef85182; Next dev en 3020, proceso 32520, padre 21208 al realizar la revisión.
- Reproducción: Chromium pulsa las filas de CIPHERGRID y FOLIO y permanece en /demos. Las peticiones HTTP directas a /demo/th-ciphergrid y /demo/th-folio devuelven 500. El error embebido en __NEXT_DATA__ es `Jest worker encountered 2 child process exceptions, exceeding retry limit`.
- /sitios/kernel-log, /sitios/esparta y /inspiraciones/cita devuelven 404. Las rutas dinámicas correspondientes existen en el worktree del servidor; el motivo concreto de estos 404 requiere más comprobaciones.
- Log del servidor: .next/dev/logs/next-development.log en trama-estudios. Contiene fallos repetidos de workers, errores write EPIPE y fallos de descarga de RSC.
- Diferencia entre worktrees: trama usa Next Link directamente en DemosIndex; trama-estudios conserva DemoPreviewLink y miniaturas iframe. No se atribuye el fallo al adaptador: abrir directamente el destino también falla.
- Comprobaciones: doctor correcto; smoke de /demos correcto (200, sin errores JS), pero esta prueba no comprueba los destinos. Artefactos ignorados en .refs3d/smoke/demos-links y script temporal .refs3d/check-demos-links.mjs.
- El usuario autorizó el reinicio. Tras reiniciar aparecieron errores de JSON: se localizó el archivo generado .next/dev/prerender-manifest.json corrupto (caracteres adicionales tras el JSON, posición 3099).
- Se detuvo únicamente la instancia 3020 y se conservó su caché en C:/COMPARTIDO/trama-estudios/.next/dev-backup-demos-20261027-194729. Se reinició Next desde el mismo worktree y puerto con una caché nueva. Proceso lanzador: 10128. No se modificó código de aplicación.
- Resultado final: /demos, /demo/th-folio, /demo/th-ciphergrid, /sitios/kernel-log, /sitios/esparta y /inspiraciones/cita devuelven 200. Chromium confirma navegación por clic a CIPHERGRID, Kernel Log y FOLIO. Smoke final: 200 y sin errores JS/consola. npm run verify pasa en trama.
- Artefactos finales: .refs3d/demos-links-clean.log, .refs3d/demos-3020-clean.stdout.log, .refs3d/demos-3020-clean.stderr.log y .refs3d/smoke/demos-links-final.
- Pendientes: ninguno para los enlaces comprobados. No se ha determinado qué evento original corrompió el manifiesto; no atribuirlo a un componente sin más pruebas.
