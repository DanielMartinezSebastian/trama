# Tarea: reseñas y FAQ de Quilate

- Objetivo: variar el tratamiento de las reseñas, incorporar retratos circulares y repensar el FAQ en escritorio con respuestas a la izquierda.
- Rama / worktree: `feat/quilate-galeria-refinada`, `C:/COMPARTIDO/trama-quilate-galeria`. Se conservan los cambios previos de paneles y sus fichas.
- URL: `http://localhost:3008/sitios/quilate`.
- Cambios del kit: `Testimonial`, `TestimonialSection`, `Avatar`, `Accordion` y `FAQSection`; estilos en `ui-kit.css`, controles en sus entradas del catálogo y tabla de `docs/README.md`.
- Decisiones: variantes de superficie independientes del tema; `Avatar` compartido con respaldo de iniciales; formato de reseñas compatible con columna opcional para URL. FAQ lateral por prop, respuestas alineables y navegación accesible.
- Demo: reseñas con tratamiento suave y fuente display, retratos del banco existente; FAQ de líneas con cabecera lateral, una respuesta abierta y alineación izquierda.
- Evaluación registrada en `docs/42-quilate-resenas-faq.md` y en la ficha «Quilate-reviews» de `/lab/cine`.
- Comprobaciones iniciales: doctor y verify correctos. Revisión visual de reseñas y FAQ en 1440 y 390 px; retratos cargados, redondos y sin overflow. Prueba de fallo de imagen, teclado y asociaciones ARIA correcta. Los tres tratamientos funcionan desde el catálogo.
- Artefactos locales ignorados: `.refs3d/quilate/reviews-*.png`, `faq-*.png`, `reviews-faq-check.mjs`, `reviews-faq-interactions.mjs`.
- Siguiente paso: validación final y revisión del usuario.

- Ajuste tras pregunta de QA: las mejoras visuales quedan optativas. `avatarShape="theme"` conserva el markup y la forma anteriores; `circle` se activa en Quilate. `answerAlign="inherit"` mantiene la alineación del sitio consumidor. El acordeón de tarjetas conserva su máximo de 520 px; el ancho completo pertenece a `presentation="lines"`.
- Validación final: revisión en 320, 390, 800 y 1440 px sin overflow, fotos cargadas y respuestas a la izquierda. El catálogo conserva el avatar antiguo con sus defaults, el máximo de 520 px y la alineación centrada heredada del FAQ. Smoke de Quilate, Almíbar y `/lab/cine`: HTTP 200, sin errores. `verify` correcto. Los controles nuevos funcionan y las opciones visuales se activan explícitamente en Quilate.
- Build final correcto (`.refs3d/quilate/reviews-faq-build.log`), con servidor del worktree detenido durante el build. Servidor reiniciado en 3008. `verify` final correcto. Commit y push solicitados por el usuario en la rama de la tarea.
