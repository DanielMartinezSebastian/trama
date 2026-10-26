> Traspaso histórico. Estado actual en [negocios-reestudio.md](./negocios-reestudio.md).

# Tarea: demos de peluquería y gimnasio

- Objetivo: dos webs completas que permitan enseñar a clientes diseño y funciones de negocio con Trama, sin backend.
- Rama / origen / worktree: `feat/demos-peluqueria-gimnasio`, desde `c7b9c1c` de `feat/cine-captura`, en `C:/COMPARTIDO/trama-cine`. Estado inicial limpio. Se conserva el servidor del usuario.
- URL de trabajo: `http://localhost:3000/sitios/hebra` y `/sitios/cadencia`, usando el servidor existente sin detenerlo.
- Validación aislada: `C:/COMPARTIDO/trama-negocios-check`, checkout separado desde `c7b9c1c` con copia de los archivos de esta tarea y `npm ci` propio. Producción en `http://localhost:3012`, con `npm run start -- --port 3012`. `.next` independiente.
- Archivos principales: `components/sites/hebra/`, `components/sites/cadencia/`, `components/sites/business-demo/state.ts`, registro en `lib/sites/index.ts` y `SiteRouter.tsx`; fotos y créditos; catálogo regenerado; prueba en `scripts/negocios.test.mts`.
- Investigación, decisiones, límites y guion para enseñar: `docs/46-hebra-y-cadencia.md`. Referencias primarias Blue Tit, Fresha y David Lloyd; lectura externa, sin reservas reales.
- Diseño: Hebra lavanda/ciruela/lima con Bricolage y Manrope; Cadencia cobalto/naranja con Anton, Archivo y Manrope. Temas locales; no se han cambiado componentes del kit.
- Funciones: Hebra reserva por servicio y profesional, reprogramación, cancelación y calendario. Cadencia filtros, plazas, espera, planes, área personal, objetivo, QR de muestra y calendario. Estado local validado; correos descartados; sin pagos ni envío de mensajes.
- Comprobaciones: `npm run doctor` correcto; `npm run verify` correcto; prueba Chromium completa de reservas/persistencia/cambios/bajas y diez rutas en 1440 y 390 px; smoke de ambas portadas con HTTP 200 y cero errores. Build con 425 páginas estáticas generado en worktree aislado, seguido de pruebas contra `next start` con CSP de producción.
- Ajustes durante QA: acento de texto accesible en Hebra; fines de semana del gimnasio ajustados; encabezado h1 de planes; contraste del CTA en plan invertido; `Suspense` local en las páginas de Hebra que leen parámetros de búsqueda para permitir prerenderizado.
- Capturas e informe: `.refs3d/negocios/` en `trama-cine`, ignorado por Git. Informe de recorridos `recorridos.json`; capturas por ruta y anchura; smoke en `hebra-produccion` y `cadencia-produccion`. Log de build en `.build-negocios.log` del worktree de validación.
- Límites: aforo y disponibilidad simulados, sin sincronización entre navegadores ni cuentas; los planes no descuentan saldo de clases; la espera no envía avisos ni asigna plazas; el QR no sirve para acceder a un club. El build conserva advertencias previas de fuentes y trazado de archivos del laboratorio de cine.
- Siguiente paso: enseñar las demos siguiendo el guion de cinco minutos y adaptar marca, servicios y tarifas al cliente. No se ha publicado ni creado un commit.
