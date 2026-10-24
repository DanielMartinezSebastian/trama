# 29 · Tercer estudio: Bruno Simon (física e interacción) y el eje de acabado

> Ronda 18 (24-10-2026). Empieza con una encuesta al usuario sobre las dos primeras webs: «el concepto sí, el acabado
> no»; mejorar es ir a **webs más difíciles**; el siguiente tipo, **físicas e interacción**. De ahí salen el eje de
> acabado del comparador (§1) y el estudio del portfolio de [Bruno Simon](https://bruno-simon.com/) (WebGPU + TSL, física
> con Rapier, se conduce con el teclado), que deja al kit una física propia sin WebAssembly (`lib/physics`) y la pieza
> **`ToyDrive`**.

## 0. Conclusiones

1. **El comparador no veía el acabado y ahora sí.** El eje nuevo (detalle fino, bordes, contraste local, brillos y
   grano) da 0 % al bloom idéntico, 15 % al bloom con errores a propósito y **49 % a Hublot**, justo lo que el usuario veía.
   Guió tres vueltas que lo dejaron en el **11 %** (rampa del cielo más fina junto al horizonte y grano de película).
2. **La física se puede medir sin tocar el motor de la web.** La pose de una pieza con nombre (el chasis) por
   fotograma da la aceleración (32 m/s², constante), la punta (13,8 m/s), la frenada al soltar (20 m/s²), el giro
   (~120°/s a cualquier velocidad: dirección arcade), el cabeceo y el autoenderezado. Con eso, un vehículo propio
   queda con la **dinámica al 12 %** (velocidad 7 %, guiñada 16 %, cabeceo 24 %, altura 5 %).
3. **La CSP de producción manda en la técnica**: no deja compilar WebAssembly, así que Rapier no sirve para el kit. La
   física es nuestra, en TypeScript: cuerpos hechos de esferas e impulsos secuenciales, y un vehículo por rayos.
4. **El mundo de la referencia no se recrea**: imagen 100 % y acabado 81 % porque el banco es un suelo con el coche,
   las letras y las cajas, y la referencia un decorado hecho a mano (hierba, árboles, agua, materiales estilizados). El
   eje lo dice con su sentido (más blando, más plano, sin grano). El concepto (la física y la cámara) sí está.
5. **Las webs vivas no son deterministas**: dos capturas con el mismo guion salieron una de día y otra de noche (ciclo
   de día y noche), y las letras de «SIMON» explotan siempre que el coche sale recto. Se compara por ventanas de tiempo.

## 1. El eje de acabado

Medido en doce pares de fotogramas a resolución completa (luminancia lineal): detalle (energía del laplaciano),
bordes (percentil 95 del gradiente), contraste local (desviación en bloques de 16 px), brillos (píxeles casi blancos) y
grano (residuo frente a la media 3 × 3 en zonas planas). Cada medida dice hacia dónde se va el banco.

| Comparación | Acabado | Lectura |
|---|---|---|
| bloom idéntico | 0 % | no inventa diferencias |
| bloom con errores a propósito | 15 % | más duro, más detalle |
| Hublot (antes) | 49 % | más blando, 90 % menos brillos, sin grano |
| Hublot (tres vueltas después) | **11 %** | brillos y grano iguales |
| Plain Sight | 5 % | casi igual |
| camera-scroll | 46 % | el banco es **más duro** que la referencia (no se había visto) |
| Bruno Simon | 81 % | el mundo no está recreado (§0.4) |

En Hublot, el núcleo casi blanco de la banda del horizonte se perdía en la mediana de franjas de 0,5°; con franjas de
0,15° junto al horizonte (`cine:rampa --franjas`) vuelve, y el grano de película (0,12) iguala el ruido de la referencia.

## 2. Bruno Simon: lo medido

- **Exploración**: textos y botones, clic («click to start»), flechas y WASD (se conduce), arrastre y rueda (mueven
  la cámara). La captura nueva `--teclas ArrowUp@6+3;…` mantiene teclas en fotogramas exactos.
- **Render**: WebGPURenderer (r183), sin tone mapping, sombras PCF; una direccional de 5 con sombra de 2048 (caja
  ±30,8); bloom 0,25.
- **Cámara**: isométrica fija, dirección (−0,585, −0,562, −0,585), fov 25, a 29,4 m del coche; lo sigue en el plano con
  **0,15 por fotograma** (0,22 m de error en el tramo limpio) y **no sube con sus saltos**.
- **Coche** (pieza `bodyPainted001`): batalla 1,8 m, vía 1,5 m; arranque a 32 m/s² constantes hasta ~80 % de la punta
  (13,8 m/s); al soltar frena solo a 20 m/s²; la flecha abajo es marcha atrás; gira a ~120°/s entre 5 y 13 m/s; el
  morro sube 6° al arrancar; boca abajo y quieto, se endereza en menos de un segundo.

## 3. La recreación

`lib/physics/world.ts`: cuerpos rígidos como grupos de esferas (una caja apoya plana en sus esferas del fondo), contacto
con el suelo y entre cuerpos, impulsos secuenciales con rozamiento de Coulomb, rebote, corrección de penetración y
cuerpos que se duermen; pasos fijos a 120 Hz. Pruebas sin pantalla: una caja que cae se asienta a 0,497 (0,5), una pila
de dos se sostiene, una columna empujada vuelca.

`lib/physics/vehicle.ts`: chasis rígido y cuatro rayos con muelle y amortiguador; motor, frenada sola, marcha atrás,
dirección arcade (el ángulo que da la velocidad angular pedida, ω = v·tan δ / batalla) y autoenderezado. Los ajustes que
lo dejaron como la referencia, en orden: calcular las cuatro ruedas con el mismo estado (aplicarlas una a una torcía el
coche 7°), empujar entre el suelo y el centro de masas (a ras de suelo volcaba al frenar), agarre lateral casi a la
altura del centro de masas (volcaba al girar), un suelo al tope de tracción (al arrancar el morro sube y las delanteras
se quedaban sin agarre) y una suspensión más blanda (con 4 cm de recorrido el cabeceo las despegaba).

`lib/toydrive/content.tsx`: el coche propio (cajas y cilindros, chasis con el nombre de la referencia para emparejar la
pieza), las letras de una palabra con física (fuente Anton), una pila de cajas, la cámara medida y el control por
teclado y por puntero (mantener pulsado lleva el coche hacia ese punto). El banco: `/lab/cine/bruno`.

## 4. Verificación

| Lo que se esperaba | Resultado |
|---|---|
| Que el comparador vea lo que el usuario ve | **Sí**: el eje de acabado da 49 % a Hublot y guía su arreglo hasta el 11 % |
| Medir la física de una web cerrada | **Sí**, desde la pose de una pieza con nombre, sin tocar Rapier |
| Recrear la física sin WebAssembly | **Sí**: dinámica al 12 % con `lib/physics` |
| Ningún eje del concepto por encima del 15 % | **Sí** para la dinámica (12 %); la cámara está medida y construida igual (0,22 m de error en el ajuste), pero el eje marca 55 % por la intro de la referencia |
| Acabado e imagen | **No**: el decorado de la referencia no se recrea (81 % y 100 %); queda como siguiente paso |
| Llevarlo al kit | **Sí**: `ToyDrive` en el catálogo, colores del tema, teclado y táctil, versión plana |

## 5. Lo que el estudio añadió a la herramienta

- `cine:compare`: eje de **acabado** y eje de **dinámica de una pieza** (`--pieza`, `--ventanas a-b,c-d`).
- `cine:capture`: **`--teclas`** (teclas mantenidas en fotogramas exactos).
- Kit: `lib/physics` (física sin WebAssembly) y `ToyDrive`.

## 6. Trampas

1. **La CSP de producción no deja compilar WebAssembly**: Rapier (y Draco o meshopt) no sirven en la web publicada.
2. **Una web viva cambia entre capturas** (día y noche, sucesos aleatorios): fijar la referencia y comparar por ventanas.
3. **El eje de piezas compara posiciones absolutas**: tras un suceso que la recreación no tiene (una explosión), todo
   se separa; la dinámica (velocidades y giros) sigue siendo comparable.
4. **La altura de una pieza, desde la ventana**: la intro puede tenerla en otro sitio.
5. **Un arcade no respeta la física de un neumático**: 3,2 g de arranque y 2,8 g de giro; el tope de tracción tiene que
   subir y no depender tanto de la carga, o el coche no llega.
6. **`--card` suele ser translúcida**: three no entiende el alfa de un `rgba`; hay que componerla sobre el fondo.

## 7. Coste

| Ronda | Qué incluye | Tiempo |
|---|---|---|
| Ronda 18 | encuesta, eje de acabado y tres vueltas de Hublot, exploración y dos capturas de Bruno Simon, física propia, eje de dinámica, `ToyDrive`, este documento | 3 h 18 de reloj, con una pausa por el límite de uso |

La física propia es la parte cara (es una pieza nueva del kit, no de este estudio): la siguiente web con física la
reutiliza y se queda en las vueltas.

## 8. Pendiente

- Decorado para subir el acabado de `ToyDrive`: hierba instanciada, árboles, agua y sombreado estilizado.
- El eje de cámara con ventanas (como la dinámica), para no contar la intro.
- Más cuerpos: rampas y cuerpos fijos (árboles, muros) y uniones, si una pieza las pide.
- Candidata siguiente, propuesta del usuario: [Chartogne-Taillet](https://chartogne-taillet.com/en) (mapa ilustrado
  de viñedos, three r122; se entra con `--clic` en «Enter»).
