# Tarea: Skeleton visible y ligado al contenido

- Objetivo: corregir el Skeleton invisible y representar el estado de carga usando la estructura real del contenido.
- Rama / base / worktree: `main`, `46fb19a`, `C:/COMPARTIDO/trama-cine`. Árbol limpio al comenzar; servidor del usuario `http://localhost:3000`, proceso 2956, conservado.

## Diagnóstico y decisión

- La revisión anterior midió ancho 0 en texto, tarjeta y tabla, frente a 48 px del avatar. El grid centrado del catálogo resolvía porcentajes sin una anchura intrínseca. Evidencia ignorada en `.refs3d/skeleton-audit/`.
- La API anterior solo ofrecía dibujos genéricos con medidas prefijadas. No tenía `loading`, contenido ni dimensiones configurables.
- Se mantiene una implementación propia en React y CSS, sin instalar dependencias: conserva el servidor y no necesita hooks, mediciones del DOM, listeners ni un motor de animación. La investigación de [React Loading Skeleton](https://github.com/dvtng/react-loading-skeleton) y [Radix Skeleton](https://www.radix-ui.com/themes/docs/components/skeleton) respalda componer las piezas dentro del layout real y conservar la geometría del hijo. [React Content Loader](https://github.com/danilowoz/react-content-loader) sigue siendo una alternativa para plantillas SVG específicas.

## Implementación

- `Skeleton` admite `loading`, `children`, `width`, `height`, `borderRadius`, `animation` y `style`. Se conservan los formatos antiguos y se añade `kind="block"` para reservar un área explícita.
- Con texto, se usa una pieza inline que conserva las líneas y la tipografía. Con un elemento, se reutiliza su nodo, clase y estilo; `loading=false` devuelve el hijo original. Una tarjeta se compone por imagen/título/párrafo/acción, no envolviendo todo su contenido como un bloque único.
- Durante la carga, `aria-hidden`, `inert` y `tabIndex=-1` impiden exponer o activar controles. La región responsable usa `aria-busy`; la demo anuncia el estado fuera de esa región. Animación CSS por barrido, pulso o desactivada; movimiento reducido la detiene.
- Las formas vacías tienen anchura intrínseca y la demo tiene columnas `minmax(0, 1fr)` para evitar el colapso y el desbordamiento en móvil.
- La nueva demo del catálogo permite alternar entre carga y contenido en tarjeta, artículo con imagen y tabla por celdas. También permite revisar las formas antiguas, dimensiones y animaciones. La guía §8 y el catálogo generado explican el uso.
- `SkeletonProps` se exporta desde la raíz del paquete. No cambian `package.json` ni el lockfile.

## Validación

- `npm run doctor`, `npm run verify` y `npm run pkg:build`: correctos.
- `npx tsx scripts/qa/skeleton.mts`: comprueba SSR, devolución intacta del hijo, ausencia de mutación de sus props, conservación de las cajas de tarjeta/artículo/tabla, foto oculta durante la carga, foco, aria-busy, cinco formas visibles, dimensiones explícitas, animaciones, movimiento reducido y móvil. Pasa en desarrollo y producción.
- Las diferencias de posición/tamaño al alternar el mismo contenido deben ser inferiores a 0,6 px en el QA. Esto verifica esos ejemplos; no es una medición global de CLS de toda la web.
- Smoke de `/componentes#skeleton` en desarrollo y producción: HTTP 200 y sin errores de JavaScript/consola.
- Build de Next en copia aislada `C:/COMPARTIDO/trama-skeleton-check`, detached desde `46fb19a`, con `npm ci` y `.next` propios: correcto. Servidor de validación en puerto 3042; el dev del usuario no se detiene ni comparte el build.
- Capturas locales ignoradas en `.refs3d/skeleton/`: revisados tarjeta cargando/cargada, fotografía oculta/visible y móvil.
- El QA también comprueba el cambio de los colores del Skeleton al pasar del tema neutro oscuro a Editorial claro; captura `light-theme.png` revisada.
- Validación finalizada: se ha detenido únicamente el servidor propio del puerto 3042 y retirado el worktree temporal. El dev del puerto 3000 sigue activo.

## Límites de composición

- El contenido futuro desconocido no se puede deducir automáticamente: reservar dimensiones o usar una referencia y comprobar el ajuste final.
- Los hijos se montan mientras cargan. Para componentes con peticiones, vídeos o efectos costosos, usar una forma independiente en un fallback evita montarlos anticipadamente.
- Los componentes propios deben reenviar los atributos y clases a su raíz HTML. Envolver un bloque entero produce una sola silueta; cada pieza necesita su Skeleton para representar su estructura.
