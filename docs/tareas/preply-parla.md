# Tarea: inspección de Preply, guía y demo Parla

- Objetivo: inspeccionar Preply y extraer una guía reutilizable y una nueva demo integrada en Trama.
- Rama / worktree: `feat/evolucion-agentes`, commit base `5410a6f`, `C:/COMPARTIDO/trama-evolucion-agentes`.
- Cambios existentes conservados: mapa de decisión de skills, package.json/lock y proyectos/fichas de Astorga y VeraVeda.
- URLs: `/demo/th-parla`, `/guias/cercano`, `/docs/preply`; preview de producción en `http://localhost:3461`.
- Salida aislada: `TRAMA_DIST_DIR=.cache/parla-next`; no usa `.next` de los servidores anteriores. Se añadió la opción
  a `next.config.ts`. El servidor dev propio se detuvo comprobando PID y puerto antes del build final.
- Cambios: `components/landings/parla/`, registro de demos y catálogo, guía `cercano` en `lib/ui/guides.ts`, retratos
  locales con fuentes, estudio y ficha `demo-parla`, índice de medidas y documentación generada con `npm run catalog`.
- Decisiones: marca y contenidos ficticios; conservar rosa/negro y la relación entre personas; usar Inter Tight/Inter
  en lugar de las fuentes del original. Los favoritos duran la visita y la reserva no envía datos ni cobra.
- Referencia: dos variantes de portada en cargas separadas; inspección sin cookies registrada aparte de la primera sonda.
- Sonda de guía: 11/11. Par final: 15/19 medidas próximas; diferencias intencionales en medida de texto, margen y longitud.
- Capturas e informes ignorados en `.refs3d/preply/` y `.refs3d/pares/preply-parla/`.
- Navegador: filtros, favoritos, vacío, reserva con horario obligatorio, confirmación, Escape y retorno de foco comprobados;
  sin desbordes a 320/390/768/1440; contraste sin violaciones. La etiqueta amarilla se revisó como superficie opaca.
- `npm run verify` completo: correcto (66 fichas). `npm run build`: correcto (974 páginas). Smoke de guía y demo:
  HTTP 200, sin errores ni sombras oscuras. `/docs/preply` y `/demos` responden 200 y la revisión de interacciones pasa.
- La hoja usa `textContrast` en esta guía, precios destacados con borde y ejemplos en tinta neutra para evitar rosa sobre
  blanco; no se ha cambiado la presentación de las otras guías.
- Contraste final de la hoja a 390 y 1440: cero violaciones. Se inspeccionaron las capturas específicas de cabecera,
  tipografía y ejemplos para los casos incompletos por solapamiento de la navegación fija. QA final sin fallos de carga.
- Preview final activo con `node node_modules/next/dist/bin/next start --port 3461` y `TRAMA_DIST_DIR=.cache/parla-next`.
- Siguiente: conservar el preview para revisión del usuario. No se ha creado commit ni desplegado fuera del equipo.
