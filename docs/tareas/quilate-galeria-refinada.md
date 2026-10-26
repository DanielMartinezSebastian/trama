# Tarea: galería de Quilate

- Objetivo: reemplazar la galería inconexa de `/sitios/quilate` por una serie editorial coherente que parta del solitario 3D de la demo y lo muestre sobre distintas materias.
- Rama / commit / worktree: `feat/quilate-galeria-refinada` / parte de `15153a9` / `C:/COMPARTIDO/trama-quilate-galeria`.
- Servidor y URL: `http://localhost:3008/sitios/quilate`.
- Cambios: cuatro tomas generadas del solitario de referencia en mármol, arena, pizarra y papel con lino; galería reducida a esas cuatro imágenes, con encuadre apaisado uniforme, textos alternativos y pies revisados. La secuencia ahora habla de cómo la luz y la superficie revelan la pieza, no de un proceso de taller que las fotos antiguas no mostraban.
- Archivos: `components/sites/quilate/Site.tsx`, `components/sites/quilate/quilate.css`, `public/img/quilate/*.webp`.
- Decisiones: se usó la captura del configurador 3D como referencia de la silueta (solitario blanco, brillante redondo y seis garras); todas las imágenes se generaron con el mismo diseño como guía. No se añadieron a `photo-credits.json` porque son imágenes nuevas generadas para la demo, no fotos externas. PNG originales optimizados a WebP, máximo 1600 px de ancho.
- Imágenes: generador integrado `image_gen`, modo generar, caso `product-mockup`; prompt común: fotografía editorial de lujo, mismo solitario blanco realista con brillante redondo de 0,7 ct y seis garras discretas, proporciones de joyería auténticas, imagen apaisada 3:2, sin texto ni utilería. Variantes de escena: mármol Carrara con luz de ventana; arena ondulada con luz cálida rasante; pizarra volcánica con contraste controlado; papel de boceto sobre lino con luz de ventana.
- Capturas visuales ignoradas por Git: `.refs3d/quilate/galeria-inicio.png`, `galeria-final.png`, `galeria-movil-1.png`, `galeria-movil-4.png`.
- Comprobaciones: `npm run doctor` y `npm run verify` correctos; smoke HTTP 200 sin errores; `npm run build` correcto (414 páginas). Revisión visual de escritorio y móvil en los cuatro extremos del carrusel; cuatro imágenes cargan al recorrerlo.
- Capturas ignoradas por Git: `.refs3d/quilate/galeria-inicio.png`, `galeria-final.png`, `galeria-movil-1.png`, `galeria-movil-4.png`; smoke en `.refs3d/quilate/smoke/`; log de build en `.refs3d/quilate/build.log`.
- Siguiente paso: revisión del usuario en `http://localhost:3008/sitios/quilate`.

## Ampliacion de galeria (2026-10-26)

- Se amplio la secuencia a ocho propuestas: solitario en cuatro superficies, alianza pavé de oro rosa, trilogia de zafiro, bisel con esmeralda y halo de oro rosa.
- Se mantuvo el formato editorial 3:2, se ajusto el ancho de tarjetas para acomodar la tira mas larga y se añadieron pies y textos alternativos especificos.
- Las cuatro nuevas imagenes se generaron con image_gen usando capturas del configurador como inspiracion y se optimizaron a WebP de hasta 1600 px. No requieren attribution externa.
- QA: `npm run verify`, smoke HTTP 200 sin errores y `npm run build`; revision de capturas de escritorio y movil. URL de revision: http://localhost:3008/sitios/quilate.

- Segunda ampliacion: imagenes propias para las cuatro tarjetas de «Cuatro maneras de empezar» (alianzas, compromiso, a medida y transformar), generadas con image_gen y optimizadas a WebP. QA visual desktop/movil; `npm run verify`, smoke sin errores y `npm run build` correctos.

- Tercera pasada de galeria: se sustituyeron seis tomas redundantes. La secuencia ahora combina solitario, toi-et-moi, anillo sello, perla escultorica, alianza pavé, banda ancha de platino, vintage con granate y Art Deco; pies y alt revisados. Assets WebP mantienen el mismo encuadre editorial.

- Cuarta pasada: se sustituyo el bento de garantias por una seccion editorial con foto generada del punzonado y cinco compromisos numerados, con version apilada para movil. Se regenero catalogo porque verify detecto los artefactos desactualizados; catalog:check vuelve a pasar.
