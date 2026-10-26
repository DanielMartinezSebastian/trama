# 40 · Ronda 25: sensación y profundidad

> 25–26-10-2026. Trabajo por mi cuenta sobre el plan de docs/36 §7, con el criterio del usuario: «las demos deben ser
> lo más cercanas, al menos en sensación y profundidad». Lo que necesito del usuario está en docs/39.

## 0. Conclusiones

1. **El eje de profundidad encuentra lo que el ojo nota y las otras cifras no.**
   - Chartogne tenía la imagen al 8 % y el acabado al 7 %, pero la profundidad al 28 % con un ruido del 1 %.
   - De cerca, el paisaje era otro: líneas de viña continuas en lugar de cepas, árboles con tronco y casas grandes.
   - Tras cuatro vueltas, la profundidad está en el 16 % y la imagen en el 9 %.
2. **Con varias muestras, las webs vivas se pueden comparar.**
   - Lusion con cinco muestras por lado: imagen 57 % ± 25 frente a un ruido del 24 %, y acabado 34 % ± 9 frente a 10 %.
   - La distancia es real, no ruido. La causa la dicen los tonos: el banco tiene el doble de claros (0,17 frente a
     0,08).
3. **Meer Mohsin estaba lejos porque faltaba la escena, no el texto.**
   - Con el emblema, las llamas con manos, el papel rasgado, el reel de proyectos, la caligráfica de la referencia y su
     cámara:
     - la imagen pasa del 72 % al 31 %;
     - la cámara, del 100 % al 0 %;
     - la profundidad, del 57 % al 10 %;
     - el acabado, del 70 % al 30 %.
   - Cumple 5 de 9 ejes. Queda lejos la luz (75 %, otro número de luces), que es un dato de la escena más que de la
     imagen.
4. **El inspector tenía dos fallos que solo salieron con escenas nuevas.**
   - El gancho cogía la cámara cúbica con la que se genera un entorno de reflejos (`PMREMGenerator.fromScene`) en vez
     de la escena de la página.
   - Elegía escena solo por número de mallas: una pieza pesada de una sola malla perdía frente a una tarjeta de varias
     mallas planas.
5. **Cinco piezas nuevas en el kit, todas versátiles** (docs/36 §1):
   - `GravureCanvas`: grabado para cualquier escena;
   - `ThornEmblem`: emblema de púas procedural;
   - `FlameHorizon`: llamas con manos;
   - `TornPaper`: papel rasgado;
   - `ProjectReel`: reel de proyectos fijado al scroll con fondo desenfocado.

## 1. Chartogne: la profundidad del 28 % al 16 %

| Vuelta | Cambio | Profundidad | Imagen | Acabado |
|---|---|---|---|---|
| 7 | (control de la ronda 24) | 28 % | 8 % | 7 % |
| 8 | Cepas en trazos con huecos; árboles sin tronco y más pequeños; casas más pequeñas y apretadas; parcelas más alargadas | 12 % | 18 % | 11 % |
| 9 | Huecos más cortos; árboles algo mayores | 15 % | 14 % | 10 % |
| 10 | Terreno algo más oscuro (tono 0,22) | 16 % | 8 % | 10 % |
| 11 | Árboles pequeños con el terreno oscuro | 16 % | 9 % | 10 % |

- **Lo que dijo el eje**: el desenfoque (rango de nitidez entre bloques) era un 53 % mayor en el banco.
  - La referencia tiene detalle fino y parejo hasta el horizonte.
  - El banco tenía zonas lisas (parcelas sin trazo, copas grandes) junto a rayas muy nítidas.
- **Trampa**: más papel (los huecos entre cepas) aclara la imagen. Hay que compensar con el tono del terreno.
- **Pendiente**: el punto que falta está en el desenfoque (36 % de error en esa señal). Probablemente sean los caminos,
  que en la referencia forman una red y en el banco son el borde de las parcelas.

## 2. `cine:vuelta --muestras N` (docs/36 A2)

- N parejas de referencia y banco.
  - Las referencias de más se guardan en `<carpeta>/muestras/ref-k` y se reutilizan.
  - El ruido sale de compararlas entre sí y su mediana sustituye a `ruido.json` en el veredicto.
- Cada eje da su mediana y su dispersión (la mitad del rango): «57 % ± 25». Todo queda en `muestras.json`.
- **Coste en Lusion**: 20 minutos con 5 muestras, la primera vez (captura las 4 referencias de más).

## 3. `GravureCanvas` (docs/36 D1)

- Envuelve hijos de R3F y les pone el material de lápiz.
  - Cada malla elige su ajuste con `userData.lapiz` y se queda fuera con `userData.sinLapiz`.
- **Lo aprendido al sacarlo del paisaje**:
  - **La densidad del rayado depende del tamaño en pantalla.** Con los ajustes de Chartogne, pensados para piezas de
    20 px, un jarrón de 250 px salía con manchas.
  - **El tono tiene que ser gradual.** El lápiz casi binariza: el ancho de la línea es 1 + (1 − luz · tono +
    desplazamiento) · multiplicador. Con los valores de la referencia, un objeto grande sale todo tinta o todo papel.
    Ajustes genéricos: tono 0,25, desplazamiento −1,1 y multiplicador 1 (líneas finas en la luz, tinta casi llena en la
    sombra).
  - **Para objetos sueltos, planos diagonales del mundo** (`direccion: "diagonal"`). Los anillos alrededor del origen
    de cada malla dejan dianas en las caras planas y en las esferas.
- Variación fuera de la referencia: el bodegón de `lib/gravure/muestra.tsx`, en el catálogo.

## 4. Meer Mohsin (B1)

### Coreografía medida

Scroll de la referencia en una vista de 720 px de alto:

| Scroll | Qué pasa |
|---|---|
| 0 | El emblema sobre la cara, en la portada |
| 1066 | El emblema baja y gira de canto |
| 1692 | Suben las llamas rojas con manos negras |
| 2320 | Todo rojo |
| 2987 | Se invierte: llamas negras con manos sobre rojo; el emblema, vertical |
| 3625–4919 | El emblema, apagado, sube sobre el relato |
| 8787 | El papel rasgado |

### Piezas

| Pieza | Qué es | Versatilidad |
|---|---|---|
| `ThornEmblem` (`lib/emblem`) | Alas de púas. Por ala: un brazo del que brotan púas alternas (cuernos arriba, garfios abajo), un cuerno y un garfio grandes junto al centro y púas secundarias; extruido con bisel, laca roja con reflejos de estudio | Semilla, número de púas, ramas, curva, color, cámara, tone mapping, `progress` para la coreografía o balanceo con el puntero |
| `FlameHorizon` | Un único shader en WebGL a pelo. Llamas: ruido fractal estirado que sube. Manos: siluetas por distancia (antebrazo, palma, cuatro dedos de dos falanges en garra y pulgar) que asoman del borde. Una inversión cambia qué es fondo y qué es llama | `progress` (coreografía) o `level`/`invert` a mano, número de manos, velocidad, color del tema; sin dependencias |
| `TornPaper` | Dos SVG con semilla: el corte con dientes y el canto blanco que asoma por partes | Envuelve cualquier contenido; bordes arriba, abajo o los dos |

### Banco y cifras

En el banco, la caligráfica Ruthie (la de la referencia) va en las palabras gigantes y la tarjeta va virada a rojo.

| Vuelta | Cambio | Imagen | Cámara | Luz | Posprocesado | Profundidad | Texto |
|---|---|---|---|---|---|---|---|
| 1 | Solo el relato (ronda 19) | 72 % | 100 % | 85 % | 25 % | — | 21 % |
| 2 | Emblema, llamas y papel | 42 % | 100 % (el cubo del entorno) | 100 % | 25 % | 57 % | 21 % |
| 3 | Cámara de la referencia; el gancho ya no coge el cubo | 42 % | 100 % (la tarjeta) | 75 % | 0 % | 52 % | 21 % |
| 4 | Ruthie, tarjeta roja; el gancho elige por mallas y triángulos | 44 % | **0 %** | 75 % | 0 % | 49 % | 50 % |
| 5 | Reel de proyectos (`ProjectReel`) tras el papel rasgado | 38 % | 0 % | 75 % | 0 % | **10 %** | 50 % |
| 6 | Fondo del reel más tenue (0,32) | **31 %** | 0 % | 75 % | 0 % | 10 % | 48 % |

**El reel resolvió la profundidad**: del 49 % al 10 %, con el acabado del 68 % al 30 %. Los medios tonos de la
referencia salían de su sección de proyectos (fotos de pantallas y un fondo desenfocado), que el banco no tenía.

**El texto empeora por la medida, no por lo que se ve.** La palabra en Ruthie, ancha y con grandes rasgos, tapa parte de
la caja del párrafo de la lista. La visibilidad por píxeles (docs/30) da el párrafo por visible más tarde. Queda
anotado como límite de la medida de texto.

### Pendiente

- ~~Medios tonos~~: resuelto con el reel de proyectos (vueltas 5 y 6).
- **Detalles**: el logotipo blanco de arriba a la izquierda y la barra inferior (TENSION · IMMERSION · IMPACT) con sus
  cruces.
- **Luz**: la referencia tiene 2 hemisféricas y 6 direccionales.
- La figura que cae en el papel rasgado.

## 4b. La portada de Meer Mohsin: la foto

A petición del usuario, con `npm run images:fetch -- retratos`:

- es un tema nuevo del script, con fotos CC0 de Unsplash en Wikimedia Commons;
- los créditos quedan en `lib/sites/photo-credits.json`;
- los descartes (animales, caras tapadas, de espaldas) quedan en `EXCLUDE` por su título exacto.

En el banco va `public/img/retratos/01-a-friend-unsplash.jpg`, un rostro de frente en blanco y negro. Está virado a rojo
oscuro, fundido con el negro por una máscara radial y con los ojos bajo el emblema.

## 4c. Lusion (B3): los claros de más

La sonda mide el blanco de las cruces en #ffffff, pero con el material del banco salen el doble de claros que en la
referencia. Se baja hasta igualar el reparto de tonos:

| Vuelta | Blanco | Muestras | Imagen | Acabado | Claros (ref. 0,08) |
|---|---|---|---|---|---|
| 3 | #ffffff | 5 | 57 % ± 25 | 34 % ± 9 | 0,17 |
| 5 | #d4d4d4 | 3 | 41 % ± 6 | 25 % ± 5 | 0,13 |
| 6 | #bcbcbc | 3 | **23 % ± 15** (ruido 21 %: cumple) | 25 % ± 6 | 0,10 |

Lusion cumple 6 de 9 ejes. Queda el posprocesado (35 %), que es un dato de la cadena de render y no de la imagen, y
el acabado (25 %, frente a un objetivo del 15 %).

## 4d. Bruno (B2): decorado e intro

- **`lib/toydrive/decorado.tsx`** (prop `decorado` de `ToyDriveContent`):
  - matas de hierba a rodales, con hojas que van de oscuro en la raíz a claro en la punta;
  - árboles de copa con bultos facetados, más claros arriba;
  - estanques de borde irregular con orilla de espuma, y piedras;
  - todo con semilla e instanciado, con materiales estándar (vale en WebGL y en WebGPU);
  - deja libres la salida del coche y la palabra.
- **Intro** (prop `intro`):
  - el mundo, oculto bajo un vacío morado con una rejilla de cruces, salvo una isla con un borde que brilla;
  - la cámara se aleja de 0,82 a 1 entre 0,8 y 2 s, con curva `sine.in`, como en la referencia;
  - un clic abre el vacío desde la isla, acelerando; hasta entonces no se conduce.

| Vuelta | Cambio | Imagen | Acabado | Atmósfera | Profundidad | Cámara |
|---|---|---|---|---|---|---|
| 1 | Reestudio: plano naranja | 100 % | 81 % | 55 % | — | 55 % |
| 2 | Decorado | 100 % | **34 %** | 48 % | 61 % | 55 % |
| 3 | Intro | **80 %** | 39 % | **18 %** | 50 % | 50 % |
| 4 | Alejamiento `sine.in`, más hierba (1 600 matas), vacío más oscuro | **65 %** | **25 %** | **14 %** | **39 %** | 50 % |

**Pendiente en Bruno**:
- La cámara (50 %) sigue al coche, y el coche gira distinto tras el clic (69° de diferencia en las piezas): es la dinámica de la salida, no la cámara.
- La luz (45 %).
- La imagen (65 %): falta la sombra del mundo. La referencia tiene oscuros también fuera de la intro.

Lo que dicen los tonos: la referencia tiene un 38 % de oscuros (la intro y las sombras del mundo) y el banco no tenía
ninguno. Con la intro sube al 22 %.

## 5. Inspector

- **`hooks/three.js`**:
  - ignora los renders de seis caras (cámara de fov 90 y aspecto 1 hacia un búfer: `PMREMGenerator`, `CubeCamera`);
  - mide lo poblada que está una escena por mallas más triángulos (uno por cada 2000).
- **Controles tras el cambio**: Plain Sight, Chartogne y Lusion (§6).

## 6. Controles

Vueltas tras el cambio del gancho:

| Estudio | Antes | Después |
|---|---|---|
| Plain Sight | 9 de 9 | 9 de 9; todos los ejes iguales |
| Chartogne | 7 de 8 | 7 de 8; todos los ejes iguales |
| Lusion (una muestra) | imagen 57 % ± 25 · acabado 34 % ± 9 (cinco muestras) | imagen 55 % · acabado 37 %, dentro de su dispersión |
