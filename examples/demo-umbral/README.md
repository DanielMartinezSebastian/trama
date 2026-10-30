# UMBRAL · demo de festival

Demo independiente construida con el paquete local `trama-ui` 0.13.0 y las skills `trama-build` y `trama-style`.
El programa, el festival, el recinto y los artistas son inventados. No hay pagos, reservas reales ni envío de correo.

## Prepararla desde el repo

Desde la raíz del repositorio, con el `.tgz` local disponible:

```powershell
npx tsx scripts/prepare-demo-umbral.mts
cd .cache/demo-umbral
npm install
node node_modules/trama-ui/bin/trama-ui.mjs skills install --client codex
npm run dev -- --hostname 127.0.0.1 --port 3435
```

Abre `http://127.0.0.1:3435`. Usa otro puerto libre si 3435 está ocupado. La materialización falla si el destino ya
existe; no borra ni reemplaza una demo anterior. Para trabajar sin Codex, omite el paso de instalar las skills.

## Rutas

- `/`: concepto del festival, cartel destacado, fechas y preguntas frecuentes.
- `/programa`: sesiones filtrables por día y espacio.
- `/entradas`: selección de pase, cantidad, datos de muestra, recibo descargable y recuperación desde el mismo navegador.

Las rutas usan `PageTransition` de Trama: barrido rápido al avanzar, sentido inverso al volver y cabecera persistente.
Los enlaces de cartelera que genera `EventLineup` mantienen además un fundido entre documentos del mismo origen.

Las fichas conservadas en `app/*.txt` son las fuentes: el sufijo evita que el TypeScript del sitio raíz las compile.
El preparador las copia al consumidor y elimina `.txt`. `BRIEF.md` registra las decisiones de diseño y ensamblado.
