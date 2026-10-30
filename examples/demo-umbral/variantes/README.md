# Tres direcciones visuales para UMBRAL

Las variantes conservan el copy, las rutas, el programa, la compra de muestra, el portal SVG y las tres imágenes de los
espacios. Cada una altera jerarquía, composición, color de superficie y tipo para ensayar otra lectura del mismo evento.

- `fanzine`: portada de revista cultural, serif editorial, tinta y papel rosa/crema.
- `nocturno`: club después de medianoche, superficies oscuras y acentos de luz azul/amarilla.
- `cartel`: cartel constructivista, escala condensada, bloques cromáticos y recortes angulares.

Desde la raíz del repo, materializa cada consumidor en un destino nuevo dentro de `.cache/`:

```powershell
npm run umbral:variant -- fanzine .cache/umbral-fanzine
npm run umbral:variant -- nocturno .cache/umbral-nocturno
npm run umbral:variant -- cartel .cache/umbral-cartel
```

En cada destino ejecuta `npm install`, `npm run build` y `npm run start -- --hostname 127.0.0.1 --port <puerto-libre>`.
Cada consumidor tiene su propio `node_modules`, `.next` y puerto.

## Revisar las variantes

Con los servidores de producción locales levantados por esta sesión:

- Fanzine editorial: http://127.0.0.1:3436
- Club nocturno: http://127.0.0.1:3437
- Cartel constructivista: http://127.0.0.1:3438

La demo base permanece en http://127.0.0.1:3435.
