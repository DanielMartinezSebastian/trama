# 35 · Procedimiento: inspirarse, copiar, evaluar, reproducir e iterar

> Ronda 24 (25-10-2026). El método estaba repartido en nueve documentos (26–34), cada uno con la parte que añadió su
> ronda. Este reúne en un solo sitio **qué se hace, en qué orden, con qué orden de consola y cuándo se para**. Los
> demás quedan como el porqué y el detalle. Incluye cómo **reestudiar** lo ya hecho cuando el inspector mejora (§5) y
> el estado de todos los estudios pasados de nuevo con el inspector de hoy (§6).

## 0. El ciclo

| Fase | Pregunta | Salida | Orden principal |
|---|---|---|---|
| 1. Inspirarse | ¿Esta web trae un concepto nuevo y medible? | `explora.md` y una frase con el concepto | `cine:explora` |
| 2. Copiar (entender) | ¿Cómo está hecho? | sonda, captura, ficha, cadena de render, shaders | `cine:sonda`, `cine:capture`, `cine:analyze` |
| 3. Evaluar la referencia | ¿Qué ejes aplican y cuánto ruido tienen? | `ruido.json`, objetivo por eje | `cine:vuelta --ruido` |
| 4. Reproducir | ¿Lo hemos recreado? | banco, receta, vueltas hasta el objetivo | `cine:vuelta` |
| 5. Iterar sobre el concepto | ¿Lo hemos aprendido? | pieza del kit, variaciones, documento | catálogo, `cine:vuelta` |

Todo lo que se genera se ve en el panel **http://localhost:3005/lab/cine** (solo en local).

## 1. Inspirarse

1. Buscar candidatas: los Sitios del Día de Awwwards (no repetir concepto, memoria «Awwwards primero»), las que proponga
   el usuario y las pendientes de las rondas anteriores.
2. `npm run cine:explora -- <url>` (y `--movil` si importa el móvil). Mirar en `explora.md`:
   - ¿hay three (escenas, mallas) o es otro motor? Sin three se puede igual (§2, «sin three»);
   - qué avisos hay que pasar (los pulsa solo);
   - qué gesto mueve la escena: rueda, puntero, arrastre, clic o teclas;
   - si se mueve sola (un fondo vivo tendrá ruido, §3).
3. **Decidir**: el estudio vale si trae un concepto que el kit no tiene y se puede medir. Escribir el concepto en una
   frase. Por ejemplo, «sombreado analítico entre vecinas sin luces» (Lusion) o «la escena guarda normal, lápiz y
   cercanía, y una pasada final la dibuja» (Chartogne).

## 2. Copiar: entender cómo está hecho

1. `npm run cine:sonda -- <url> --antes "avisos;rueda:400x8;espera:5"`. Da cámaras, luces, materiales con los
   **valores** de sus uniforms, instancias y pasadas: suele bastar para entender la técnica sin leer el JavaScript
   publicado.
2. `npm run cine:capture -- <url> …` con la orden que recomienda la exploración. Opciones según la web:

   | Si la web… | Opción |
   |---|---|
   | pasa por un cargador que cuenta con el reloj | `--clock-later --espera 8` |
   | vive en una tarjeta de la página | `--recorte x,y,ancho,alto` |
   | importa en móvil | `--movil` |
   | se juega con arrastres, teclas o clics | `--arrastre`, `--teclas`, `--clic` |

3. `npm run cine:tramo -- <captura> movimiento quieto <salida>` si hay intro (avisos, títulos) antes de lo que se va a
   recrear.
4. `npm run cine:analyze -- <captura>`. Mirar:
   - `informe.html`: tramos de cámara con su curva, imagen, notas;
   - `pasadas.md`: la cadena de render reconocida, con cualquier motor;
   - `ficha.auto.json`;
   - `shaders/` para la técnica.
5. **Sin three**: no hay cámara del gancho. `npm run cine:flujo -- <captura>` mide el movimiento de la imagen, y
   `pasadas.md` y el presupuesto salen de la API gráfica igual.
6. **Grupos de cuerpos** (racimos, enjambres): `npm run cine:conjunto -- <url>`.
7. Antes de reproducir, apuntar en el documento del estudio qué es el concepto, qué parámetros tiene (los de la sonda)
   y qué no se va a recrear (decorado, modelos de pago).

## 3. Evaluar la referencia: qué ejes aplican y cuánto ruido tienen

1. Escribir la **receta** en `scripts/cine/recetas.json`:
   - `url` (el banco);
   - `captura` (cómo se captura el banco);
   - `ref`;
   - `referencia` (cómo se captura la referencia);
   - `tramoReferencia`, `comparar`, `conjunto` y `flujo` si hacen falta.
2. `npm run cine:vuelta -- <estudio> --ruido`: la referencia contra otra captura de sí misma. **Sin ruido medido no se
   da ningún eje por bueno.**

   | Web | Ruido de imagen | Ruido de acabado |
   |---|---|---|
   | Chartogne (con reloj virtual) | 0 % | 0 % |
   | Active Theory (se genera en cada carga) | 38 % | 16 % |
   | Lusion (física al azar) | 48 % | 26 % |

3. **Objetivo de cada eje** = el mayor entre su ruido (con un 10 % de margen y 2 puntos) y el umbral del concepto:

   | Eje | Umbral |
   |---|---|
   | cámara, coreografía, dinámica, texto, movimiento | ≤ 15 % |
   | imagen, acabado | ≤ 15 % si la web es determinista; el ruido si no |
   | presupuesto | unilateral: solo cuenta gastar de más |

4. Los ejes que no aplican se apuntan como tales. Por ejemplo, la escena 3D de Meer Mohsin, que no se recreó; o la
   coreografía de Chartogne, con un 90 % de ruido por los pájaros.

## 4. Reproducir

1. Ficha en `components/lab/cine/estudios/<id>.ts` y, si hace falta, una pieza en `components/lab/cine/piezas/`. El
   motor de la pieza va desde el principio en una carpeta del kit (`lib/<pieza>/`): así el banco prueba el código que
   se publica.
2. Banco en `http://localhost:3005/lab/cine/<id>`. Variantes rápidas con `?ajuste=<json>` sin tocar archivos.
3. **Cada cambio, una vuelta**: `npm run cine:vuelta -- <id> --nota "qué cambié"`. Da el cambio por eje respecto a la
   anterior, el par de fotogramas, el vídeo lado a lado y el reparto de tonos, y lo apunta en el historial.
4. **Depurar primero** el eje que la comparación pone arriba, salvo que esté en el ruido.
5. Parar cuando todos los ejes que aplican están en su objetivo (§3.3). Si un eje no baja tras tres vueltas, apuntarlo
   como pendiente con la causa, no insistir.
6. No editar el motor mientras corre una captura del banco (el `next dev` recompila y la captura falla).

## 5. Iterar sobre el concepto: comprobar que se ha aprendido

1. **Al kit**: componente en `components/ui/`, con tema (tokens), versión plana sin WebGL o con movimiento reducido,
   entrada en el catálogo, `npm run catalog`, tabla de `docs/README.md` y `scripts/build-package.mts`.
2. **Variar el concepto**: otro tema (claro y oscuro), otra semilla, otros parámetros. Si la pieza se rompe fuera de
   los valores de la referencia, no se había entendido el concepto, solo copiado el caso.
3. **Volver a la referencia con ojos nuevos**: `cine:explora` y `cine:sonda` encuentran lo que se escapó (en
   Chartogne, los pájaros y el giro al arrastrar, ronda 22).
4. **Reestudiar cuando el inspector mejora**: `npm run cine:reestudio`.
   - Por estudio: guarda la referencia vieja (`<ref>-antes-<fecha>`), la vuelve a capturar, mide el ruido y pasa una
     vuelta del banco.
   - Resultado en `.refs3d/reestudio/<fecha>/resumen.md`.
   - Con `--estudios a,b` solo esos, y con `--sin-referencia --sin-ruido` solo la vuelta.
5. **Cerrar la ronda** (lista de comprobación):
   - documento `docs/NN-*.md`: conclusiones, técnica, medidas, verificación, trampas, pendiente y coste;
   - entrada en `components/lab/cine/panel/rondas.ts` (el panel la enseña con todos sus archivos);
   - `docs/README.md`, `docs/04-pendientes.md`;
   - `npm run typecheck`, `npm run catalog:check`, `npm run check:shadows`; `npm run build` si hay rutas o CSS
     (parando antes el `next dev` y borrando después `.next/dev`);
   - commit;
   - `.refs3d/STATUS.md` y la memoria del plan.

## 6. Estado de los estudios con el inspector de hoy (reestudio del 25-10-2026)

`npm run cine:reestudio` en los siete estudios: referencia nueva capturada con su receta (la anterior queda como
`<ref>-antes-<fecha>`), ruido de cada eje con dos capturas nuevas y una vuelta del banco. Resumen en
`.refs3d/reestudio/2026-10-25-11-20/resumen.md` (Chartogne y Lusion, sin referencia ni ruido nuevos porque ya los tenían de la ronda 23: `.refs3d/reestudio/2026-10-25-12-22/`).

| Estudio | Ejes en su objetivo | Ejes lejos (ahora · ruido) | Antes (comparación de cierre) | Ruido | Tiempo |
|---|---|---|---|---|---|
| Plain Sight | todos: coreografía 12 %, imagen 10 %, acabado 5 %, cámara 2 % | — | igual (presupuesto 13 % → 0 %) | 0–2 % | 6,8 min |
| Hublot | cámara 3 %, atmósfera 2 %, acabado 11 % | imagen 13 % · 2 % | igual (presupuesto 72 % → 0 %) | 0–2 % | 27,1 min |
| Bruno Simon | dinámica 11 % | imagen 100 % · 24 %, acabado 81 % · 4 %, atmósfera 55 % · 1 %, cámara 55 % · 7 %, luz 45 % · 0 % | igual (presupuesto 68 % → 0 %) | imagen 24 % (mundo vivo) | 16,6 min |
| Meer Mohsin (relato) | atmósfera 15 % | cámara 100 %, luz 85 %, imagen 72 %, acabado 70 %, texto 21 %, posprocesado 25 % (ruido 0 %) | igual (presupuesto 76 % → 0 %) | 0–1 % | 7,5 min |
| camera-scroll | dinámica 13 %, presupuesto 12 %, cámara 0 % | acabado 30 %, imagen 18 %, piezas 18 % | acabado 46 % → 30 %, cámara 12 % → 0 % | 0–1 % | 3,7 min |
| Chartogne-Taillet | todos: luz 10 %, posprocesado 10 %, imagen 8 %, acabado 7 %, cámara 7 %, presupuesto 5 % | — | igual (presupuesto 54 % → 5 %) | 0–1 % (ronda 23) | 2,9 min |
| Lusion | cámara 0 %, luz 10 %, conjunto 15 % | imagen 68 % · 48 %, acabado 40 % · 26 %, posprocesado 35 % | igual (imagen 66 % → 68 %) | imagen 48 %, acabado 26 % (ronda 23) | 2,8 min |

**Conclusiones del reestudio:**

1. **El método es reproducible.** Con referencias nuevas, un día después y con el inspector ampliado, todos los ejes
   dan lo mismo que al cerrar cada ronda. La única excepción es el presupuesto, que antes medía mal: con `renderer.info`
   daba 13–76 % y con la API gráfica da 0 % en todos. camera-scroll mejora en acabado y cámara.
2. **Las webs deterministas tienen un ruido casi nulo** (Plain Sight, Hublot, Meer Mohsin, camera-scroll y Chartogne,
   0–2 %): sus cifras son fiables y no hay excusa de ruido. Las vivas (Bruno, 24 % de imagen; Lusion, 48 %) necesitan
   varias muestras (docs/36 A2).
3. **Las demos que no se sienten como su referencia** son las que recortaron la escena o el decorado. Por orden de
   distancia:
   - **Meer Mohsin**: el banco solo tiene el relato del texto; falta el emblema 3D, las escenas rojas y la atmósfera.
     Cámara 100 %, luz 85 %, imagen 72 %.
   - **Bruno Simon**: falta el decorado (hierba, árboles, agua, sombreado). Imagen 100 %, acabado 81 %, atmósfera 55 %;
     la cámara, al 55 % por la intro.
   - **Lusion**: imagen 66 % y acabado 40 %, por encima de su ruido.
   - **camera-scroll** (calibración): acabado 30 %, imagen 18 %.
   - **Hublot**: imagen 13 % frente a un ruido del 2 %. Es lo poco que queda: pueblos más cálidos, puntos brillantes y
     el bisel.
4. **Algunos ejes no sirven en algunas webs.** El de piezas en Bruno tiene un 100 % de ruido (sucesos del mundo vivo) y
   el de coreografía en Chartogne un 90 % (los pájaros). La receta tiene que poder marcarlos como «no aplica»
   (docs/36 A1).

## 7. Lo que le falta al capturador (por prioridad)

| Prioridad | Mejora | Por qué |
|---|---|---|
| 1 | `cine:vuelta --muestras N`: N capturas por lado y la dispersión de cada eje | En webs vivas una comparación es una muestra (Lusion: 9 % o 48 % de ruido según la captura) |
| 2 | ~~Objetivo por eje escrito en la receta y veredicto automático~~ **hecho en la ronda 24** (docs/36 A1): «Cumple N de M» en cada vuelta, con un eje de profundidad (A8) y tu puntuación en el panel (A9) | El criterio de §3.3 ya no se aplica a mano |
| 3 | Flujo con perspectiva (homografía) | Los vuelos y cabeceos se leen mal con una semejanza |
| 4 | Ritmo: comparar cuándo pasan las cosas (picos de movimiento y cortes), no solo cuánto | Las transiciones de página y los cortes no tienen eje |
| 5 | `Ficha.relato` en la ficha y el informe | El relato escrito solo vive en `relato.json` |
| 6 | Sonido (si la web lo tiene): cuándo suena y con qué | Bruno Simon y Runa lo usan; no se mide |
