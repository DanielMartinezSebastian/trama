# VeraVeda · imágenes restantes con imagegen

- Petición: mejorar las imágenes pendientes, excepto las capturas de WhatsApp.
- Rama / directorio: feat/evolucion-agentes / C:/COMPARTIDO/trama-evolucion-agentes. Se preservan los cambios ajenos, incluidos los de Parla, catálogo y mapa de skills.
- Sitio: proyecto independiente proyectos/veraveda; servidor existente en http://localhost:3021/. No se modifica Next, `.next` ni el kit.
- Skill: imagegen, herramienta integrada; sin CLI ni claves API.
- Inventario: 20 pendientes, 4 fotos de origen ya restauradas y 2 ambientes generados anteriormente. Se excluyen diez capturas original-06 a original-15 y cuatro logotipos original-02, original-16, original-18 y original-32.
- Referencias: originales inspeccionados uno a uno. Prompts y resultados previstos en research/imagegen-remaining.json. Se solicita preservar composición, identidad, ropa, manos, alfa y textos incrustados. Graduación: «Nótese mi cara de felicidad» literal; infancia: misma edad y vestido; miniaturas: misma vista de espaldas, sin inventar caras; pie: recorte original sin inventar torso ni cabeza.
- Originales y seis ediciones previas protegidos mediante research/remaining-baseline.json, incluido el hash del JSON de contenido. Nuevas salidas en ediciones-imagegen/restantes y dist/assets/restored; sin sobrescribir recursos anteriores.
- Integración prevista: SourceImage y selector usarán el mapa src/restored-images.json. La petición actual autoriza las mejoras también en Origen; su estructura, colores y textos se conservan. Los originales quedan accesibles para comparar.
- Comprobaciones: doctor correcto, salvo recursos opcionales; verify lanzado. remaining-qa.mjs comprobará huellas, exclusiones, transparencia y presencia de las sustituciones en las cuatro versiones.
- Estado: veinte salidas generadas, revisadas e integradas en las cuatro versiones. El usuario pide expresamente aplicarlas a Fiel a VeraVeda: se sustituye la selección de fotos sin alterar textos, estructura o colores. Comparación actualizada a 26 pares en http://localhost:3021/imagenes.html; demo fiel en http://localhost:3021/origen/.
- Resultados: build de 21 páginas; remaining-qa, 84 casos y cero fallos; coverage-qa, doce páginas sin omisiones. SHA256 de los 38 originales, las seis ediciones anteriores y los textos sin cambios. `npm run verify` pasa. Smoke oficial de Origen pasa en la repetición; primer intento con cierre del navegador durante captura concurrente. Revisión visual de inicio, historia y consultas en escritorio/móvil realizada.
- Siguiente: revisión del usuario en las demos locales. No se publica ni se modifica la web remota.
- QA final adicional: veinte rutas a diecisiete anchos, cero errores y cero fallos de contraste; imágenes e interacciones correctas (`qa/report.json`).
