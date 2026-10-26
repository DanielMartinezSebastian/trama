# Trabajo con Claude Code y Codex

`AGENTS.md` es la fuente de instrucciones compartida. `CLAUDE.md` la importa. Las decisiones estables se documentan en `docs/`; los chats no son el único registro de una tarea.

## Preparar un worktree

Antes de empezar, revisar `git status --short` y `git worktree list`. Para tareas simultáneas, crear una rama y un worktree por tarea desde el commit acordado; los cambios sin commit de otro directorio no aparecen automáticamente. Para alternar sobre el mismo directorio, dejar un traspaso y trabajar por turnos.

En un worktree nuevo:

```powershell
npm ci
npm run doctor
npm run doctor -- --cine --browser
npm run dev -- --port 3006
```

Elegir un puerto libre y registrar la URL. No compartir `node_modules` ni `.next` mediante enlaces. El diagnóstico no instala nada ni lee secretos. Si falta Chromium, instalarlo con `npx playwright install chromium`; cine también requiere `ffmpeg` en PATH. `doctor --cine` exige Chromium y ffmpeg; las referencias ausentes son avisos porque cada tarea puede necesitar solo algunos estudios.

`.refs3d/`, `public/lab-assets/` y `.env.scripts` están ignorados por Git. Copiar únicamente referencias y recursos necesarios desde un worktree conocido, conservando sus rutas relativas. No enlazar toda `.refs3d`: cada tarea debe escribir sus capturas e historiales propios. Si faltan referencias, consultar la receta y recapturar con `npm run cine:vuelta -- <estudio> --referencia` cuando proceda. Preparar `.env.scripts` localmente desde `.env.example` solo si se necesitan descargas con credenciales; no imprimir ni versionar sus valores.

## Iterar y validar

```powershell
npm run verify
npm run smoke -- http://localhost:3006/lab/cine/plain-sight
npm run cine:vuelta -- plain-sight --base-url http://localhost:3006 --nota "Descripción del cambio"
```

`verify` ejecuta typecheck, comprobación del catálogo, comprobación de sombras y las pruebas del cambio de origen (`cine:test`); se detiene ante el primer fallo. No regenera el catálogo automáticamente. Si las props cambian, regenerarlo conscientemente con `npm run catalog` y revisar el diff.

`smoke` visita una URL local con Chromium, guarda `pagina.png` y `resultado.json` en `.refs3d/smoke/<fecha>/`, y falla ante errores de JavaScript/consola o una respuesta HTTP fallida. Se puede elegir salida con `--out`. Inspeccionar la imagen generada: esta prueba no certifica interacciones, carga de modelos ni fidelidad visual. Para eso usar capturas y comparaciones de cine.

`--base-url` cambia solo el origen del banco: conserva la ruta, query y hash de la receta y no cambia las referencias externas. También se puede usar `CINE_BASE_URL`, heredada por procesos hijos como `cine:reestudio`; la opción explícita tiene prioridad. Sin configuración se mantienen las URLs originales, incluido el puerto 3005.

Si se tocaron rutas o CSS, ejecutar `npm run build` con el servidor dev de ese worktree parado. No detener servidores de otros trabajos. Los procesos de navegador o descargas pueden necesitar autorización del entorno de Codex; no desactivar el sandbox para evitarla.

## Traspaso por tarea

Usar un archivo con nombre propio, por ejemplo `docs/tareas/cine-plain-sight.md`, cuando haya que continuar en otra sesión. Evitar un único archivo de estado compartido por tareas simultáneas.

```markdown
# Tarea: <nombre>

- Objetivo y criterio de aceptación:
- Rama / commit / worktree:
- Servidor y URL (si sigue activo):
- Cambios realizados y archivos:
- Decisiones y motivos:
- Comprobaciones ejecutadas y resultado:
- Capturas o informes (ruta local; indicar si están ignorados):
- Fallos pendientes o limitaciones:
- Siguiente paso concreto:
```

Integrar cambios mediante revisión del diff y commits de la tarea. No incluir cambios ajenos ni sobrescribir trabajo sin commit durante un traspaso.
