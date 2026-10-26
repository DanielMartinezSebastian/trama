> Traspaso histórico. Estado actual en [negocios-reestudio.md](./negocios-reestudio.md).

# Tarea: Esparta y Forja

- Objetivo: añadir dos webs completas con la estructura funcional de Hebra y Cadencia: barbería masculina clásica con inspiración espartana vintage y gimnasio oscuro/energético con una sección 3D interactiva.
- Rama / origen / worktree: continuación en `feat/demos-peluqueria-gimnasio`, origen `c7b9c1c`, `C:/COMPARTIDO/trama-cine`. Se conservaron todos los cambios sin commit de la primera pareja de demos. No se han modificado sus carpetas ni sus claves de almacenamiento.
- URLs: `http://localhost:3000/sitios/esparta` y `/sitios/forja`, servidor del usuario conservado. Producción de validación en `http://localhost:3012` desde `C:/COMPARTIDO/trama-negocios-check`, con dependencias y `.next` independientes.
- Cambios: nuevas carpetas `components/sites/esparta/` y `components/sites/forja/`; registro en `SiteRouter.tsx` y `lib/sites/index.ts`; catálogo regenerado (33 webs); filas en `docs/README.md`; campañas WebP en `public/img/esparta` y `public/img/forja`; declaración de imágenes generadas en `/creditos`; documentación `docs/47-esparta-y-forja.md`.
- Diseño Esparta: carbón, marfil y latón; Cormorant Garamond y Manrope; tres personajes barbudos de campaña, marca lambda, retrato a sangre, entrada de titulares, revelado al hacer scroll, cinta y selector Corte/Barba/Ritual. Cinco páginas, servicios y barberos propios, precios cerrados, reservas y agenda local.
- Diseño Forja: grafito, naranja y pistacho de luz; Anton, Archivo y Manrope; fotografía de atleta generada; programas Fuerza/Motor/Base, cinco páginas y funciones de reservas/espera/planes. Explorador 3D con barra olímpica, cargas 20/60/100 kg, giro con arrastre, despiece y pausa.
- Escena: geometrías procedurales, colores desde tokens, RoomEnvironment sin archivos remotos; carga diferida con las utilidades del kit. SVG funcional con movimiento reducido o sin WebGL. No se requiere descarga de modelos ni Wasm.
- Imágenes: herramienta integrada `image_gen`, dos originales conservados fuera del proyecto y copias optimizadas dentro. Prompts finales y rutas de recursos documentados en `47`. No representan clientes ni empleados reales.
- Comprobaciones: doctor correcto; `npm run verify` correcto; build aislado correcto, 435 páginas estáticas; smoke de portadas con HTTP 200 y cero errores; pruebas de negocios y de movimiento/3D también contra el servidor de producción.
- Pruebas: `scripts/negocios-oscuros.test.mts` (reservas, cambios, calendario, persistencia, espera, planes, diez rutas en 1440/390 px) y `scripts/negocios-motion.test.mts` (animación, WebGL real, cargas, despiece, arrastre, pausa, movimiento reducido y WebGL desactivado).
- Capturas e informes: `.refs3d/negocios-oscuros/`, ignorado por Git; smoke inicial en `.refs3d/negocios/esparta-smoke` y `forja-smoke`. Log de build `.build-negocios-oscuros.log` en el worktree de validación.
- Límites: datos y disponibilidad simulados en el navegador, sin cobros, correos ni reservas reales. El 3D demuestra equipamiento; no recomienda una carga de entrenamiento. Se conservan las advertencias previas de fuentes y trazado de archivos del laboratorio durante el build.
- Siguiente paso: revisar con el cliente las dos nuevas variantes; adaptar marca y contenido si se elige una. No se ha publicado ni creado un commit.
