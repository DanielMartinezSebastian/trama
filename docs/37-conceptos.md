# 37 · Conceptos replicables

> La tercera capa de la librería (docs/36 §1). Los componentes son una forma de aplicar un concepto; el concepto es lo
> que se aprende y se puede volver a hacer con otras piezas. Cada ficha sigue el mismo orden: qué es, cuándo usarlo
> (y cuándo no), la regla (los valores medidos en la referencia, como punto de partida), las piezas que lo implementan,
> cómo verificar una implementación y las webs de referencia.
>
> Se alimenta en cada ronda. Si una implementación nueva no reproduce la sensación y la profundidad de la referencia
> (docs/36 §0b), la ficha está incompleta: se apunta qué falta.

## 1. Cámara de autor con curva medida

- **Qué es**: la cámara no se mueve con una curva genérica, sino con la de la referencia, medida fotograma a fotograma.
  El avance y el giro tienen cada uno su propia curva.
- **Cuándo**: vuelos de entrada, transiciones entre planos y cámaras que siguen al scroll. **No** para cámaras libres
  que controla el usuario (órbita), donde manda la respuesta al gesto.
- **Regla**:
  - Separar posición y dirección: casi nunca comparten curva. En Chartogne el avance es una cuadrática que frena
    (power2.out exacta) y el giro, una curva propia (`GIRO`, 13 valores cada 0,25 s).
  - Si la curva no tiene nombre, **tabla medida**, no la S más parecida: con una S cúbica la dirección se apartaba 47°;
    con la tabla, 0,9°.
  - Medir desde el primer fotograma en movimiento (`cine:tramo movimiento`).
- **Piezas**: `lib/gravure/content.tsx` (vuelo de entrada); fichas del banco (`camara.planos` con curva);
  `lib/cine/curves.ts`.
- **Verificar**: eje de cámara ≤ 5 % con la misma entrada; la dirección, en grados, a lo largo del tramo.
- **Referencias**: Chartogne-Taillet (vuelo), Hublot (cámara que se asoma y sale), camera-scroll de pmndrs.

## 2. Respuesta al gesto con retraso de primer orden

- **Qué es**: lo que sigue al puntero, a la rueda o al arrastre no lo hace en el acto. Se acerca al objetivo con un
  retraso exponencial, y al soltar sigue un poco por inercia.
- **Cuándo**: paralajes, cabezas que se asoman, vistas que giran al arrastrar, grupos que siguen al puntero. Es lo que
  más pesa en la **sensación**.
- **Regla**:

  | Gesto | Valores |
  |---|---|
  | Asomarse con el puntero (Hublot) | seguimiento 0,03 por fotograma (unos 0,55 s) |
  | Pasar al otro lado al arrastrar (Hublot) | 0,088 por fotograma |
  | Girar la vista al arrastrar (Chartogne) | 128,9° por ancho de lienzo, τ 0,24 s |
  | Racimo que sigue al puntero (Lusion) | 31 % del recorrido, vuelta al centro con τ 0,43 s |

  Fórmula: `actual += (meta − actual) · (1 − e^(−dt/τ))`. No usar `lerp` con un factor fijo: depende de los
  fotogramas por segundo.
- **Piezas**: `Porthole` (`lib/porthole/rig.ts`), `EngravedMap` (giro por arrastre), `CrossCluster` (`seguir`, `retraso`,
  `vuelta`).
- **Verificar**: la serie del gesto frente a la de la referencia con la misma entrada (en Chartogne, dentro de 1,1° en
  todo el gesto); el retraso y la τ, con `cine:conjunto` o la serie de cámara.
- **Referencias**: Hublot, Chartogne-Taillet, Lusion.

## 3. Campo tipográfico con muelles

- **Qué es**: una rejilla de columnas o letras en 3D donde unas palabras escondidas suben y el resto se hunde en onda,
  todo con muelles.
- **Cuándo**: portadas tipográficas e índices de secciones (ABOUT, WORKS…). **No** para texto largo.
- **Regla**:
  - Suelo que baja −0,7 en onda radial desde el centro (1,7 fotogramas por unidad de distancia), con un muelle de k 0,034
    y c 0,14 por fotograma (ζ 0,38).
  - Palabras que suben +1,4 letra a letra en orden de lectura (3,75 fotogramas por letra), con un muelle más vivo
    (k 0,052) que rebota más al final (ζ de 0,52 a 0,34).
  - Vuelta desde la última letra.
  - Puntero que hunde 0,27 con caída (1 − d/2,5)^1,4 y levanta un anillo.
  - **Ajustar copia a copia, no con la envolvente.**
- **Piezas**: `TypeField` (`lib/typefield`).
- **Verificar**: eje de coreografía ≤ 12 % con la misma entrada; cada letra a 1–3 fotogramas.
- **Referencias**: Plain Sight (motion-pieces).

## 4. Cielo por rampa medida

- **Qué es**: el color del cielo no sale de un modelo de atmósfera, sino de una rampa medida por franjas de elevación,
  más el resplandor según el acimut.
- **Cuándo**: fondos de amanecer o atardecer, ventanillas, horizontes. **No** si hace falta un cielo físico que cambie
  de hora en tiempo real.
- **Regla**:
  - `cine:rampa` saca la rampa de la referencia.
  - Horizonte inclinado: −2,49° − 5,03°·sin(acimut).
  - Tres exponenciales analíticas dejaban un 37–41 % de error; la rampa, el tono exacto.
- **Piezas**: `Porthole` (`lib/porthole/sky.ts`). Pendiente: `SkyRamp` con presets de hora (docs/36 D6).
- **Verificar**: eje de imagen ≤ 10 %; ΔE de la paleta ≤ 2.
- **Referencias**: Hublot.

## 5. Física de juguete sin WebAssembly

- **Qué es**: cuerpos rígidos hechos de esferas, impulsos secuenciales a 120 Hz y un vehículo por rayos con dirección
  arcade y autoenderezado. Sin Rapier: la CSP de producción no deja compilar WebAssembly.
- **Cuándo**: portadas que se juegan (empujar letras, cajas, objetos), racimos y montones. **No** para física precisa
  (uniones, mallas de colisión).
- **Regla**:
  - Arranque 32 m/s², punta 13,8 m/s, frenada sola 20 m/s², unos 120°/s de giro (Bruno Simon).
  - El tope de tracción, alto y casi independiente de la carga (un arcade no respeta un neumático).
  - Los objetos se aproximan con varias esferas: una sola rueda o se encaja mal.
  - Los grupos que tienen que dejar huecos chocan como bolas (Lusion, §6).
- **Piezas**: `lib/physics` (`Mundo`, `cuerpo`, `esferasCaja`, vehículo), `ToyDrive`, `CrossCluster`. Pendiente:
  `PhysicsPile` (docs/36 D5).
- **Verificar**: eje de dinámica de la pieza (`--pieza`, `--ventanas`) ≤ 12 %; en grupos, `cine:conjunto`.
- **Referencias**: Bruno Simon, Lusion.

## 6. Relato por capítulos con palabra gigante

- **Qué es**: una sección fijada al scroll donde una palabra enorme por capítulo se releva (la saliente sube con curva en
  S y la entrante llega frenando), con una tarjeta que cambia de imagen con un fallo de señal en la frontera.
- **Cuándo**: secciones de servicios, capacidades o etapas.
- **Regla**:
  - Duraciones en pantallas de scroll.
  - Salida de 0,38 pantallas (power2.inOut) y entrada de 0,45 (power3.out); la primera palabra entra a las 0,41
    pantallas y casi de golpe (0,12).
  - El pico del fallo, en la frontera (±0,45).
  - Lo que se ve lo deciden los píxeles, no la pila del DOM.
- **Piezas**: `ChapterStage` (`lib/chapterstage/coreografia.ts`), fijado o controlado (`progress`). Pendiente: el fallo
  de señal como pieza suelta (docs/36 D4).
- **Verificar**: eje de texto ≤ 15 % (momento de entrada al 0–3 % del recorrido).
- **Referencias**: Meer Mohsin.

## 7. Sombreado analítico entre vecinas

- **Qué es**: sin luces ni mapa de entorno, cada píxel recorre los objetos vecinos y calcula de forma analítica (contra
  sus primitivas: cilindros, cápsulas, esferas) cuánto cielo le tapan, si le quitan la luz y qué color refleja. Encima,
  un matcap, la oclusión y la sombra propia horneadas y una curva fílmica.
- **Cuándo**: grupos de pocos objetos (≤ 30) que se tocan y tienen que leerse como un render caro. **No** con cientos
  de objetos: el coste crece con el número de vecinas por píxel.
- **Regla**:
  - 23 vecinas por píxel.
  - Matcap oscuro en los costados: con uno claro, el doble de píxeles gris claro.
  - Reflejos de estudio en tiras finas.
  - El cristal refracta lo pintado detrás, con un fondo claro de respaldo.
  - Choque como bolas de radio 1,05 para que el grupo quede suelto (dispersión de 2,44 radios).
- **Piezas**: `CrossCluster` (`lib/crosscluster/material.ts`). Pendiente: cualquier forma (docs/36 D2).
- **Verificar**: imagen y acabado **contra el ruido** (Lusion: 48 % y 26 %; hacen falta varias muestras), dinámica del
  conjunto ≤ 20 %.
- **Referencias**: Lusion.

## 8. Grabado a lápiz (ilustración en 3D)

- **Qué es**: la escena no pinta colores, sino que guarda normal, fuerza del lápiz y cercanía. Una pasada final dibuja
  papel, lápiz y contornos (Sobel sobre la normal).
- **Cuándo**: marcas que quieren un 3D que no parezca 3D (bodegas, territorio, editoriales, arquitectura). **Funciona
  con cualquier escena**: es la técnica más reutilizable que hemos sacado.
- **Regla**:
  - Bandas `|fract(distancia · subdivisión) − 0,5| · 2` sumadas a la oscuridad, desplazada (−0,5 / −0,7) y multiplicada
    (×3), y casi binarizadas con `pow(x, 0,1)`.
  - Las bandas, **en las coordenadas del modelo** (70 por metro en el terreno; 7–9 por unidad en los objetos).
  - Papel #fff5dd, lápiz #8c887d; viñeta de 1,8 con −0,28; grano de 0,123; papel al 25 %.
  - **Pintar siempre a 2×.**
- **Piezas**: `lib/gravure` (`materialLapiz`, `pilaGrabado`), `EngravedMap`. Pendiente: `GravureCanvas` para cualquier
  escena (docs/36 D1).
- **Verificar**: imagen ≤ 10 %, acabado ≤ 10 % (Chartogne: 8 % y 7 %; ruido de 0 %).
- **Referencias**: Chartogne-Taillet.

## 9. La cadena de render como firma

- **Qué es**: el aspecto «de agencia» sale de la cadena de pasadas más que de la escena. Que una web lleve
  **destellos anamórficos** (reducción solo del ancho), una **pirámide de bloom**, una **simulación en la GPU** de ida
  y vuelta o un millón de partículas se lee en sus pasadas, con cualquier motor.
- **Cuándo**: para elegir qué pase añadir a una recreación, y para entender una web sin three.
- **Regla**:

  | Firma | Ejemplo |
  |---|---|
  | Anamórfico | Active Theory: de 1280×360 a 10×360, dos cadenas |
  | Bloom | Active Theory: de 192×108 a 48×27 |
  | Simulación | 256², 11 pasadas |
  | Partículas | 1 048 576 puntos = una textura de 1024² |
  | Máscara de resaltado | Chartogne: 256×144 |

  `pasadas.md` lo da solo.
- **Piezas**: `lib/postfx` (`pilaTSL`). Pendiente: el pase anamórfico y el componente `PostFX` (docs/36 D7).
- **Verificar**: eje de posprocesado; presupuesto unilateral (sin pasadas de más).
- **Referencias**: Active Theory, Chartogne-Taillet, Hublot.

## 10. Aparición por baldosas (pendiente de estudiar a fondo)

- **Qué es**: un elemento (escena, título, imagen) entra a trozos. Cada píxel aparece cuando
  `1 + azar(celda) + ruido − (1 − progreso)·3 > 0,5`.
- **Cuándo**: entradas de sección, transiciones entre escenas y títulos con textura de papel.
- **Regla** (provisional, de los uniforms de Chartogne): frecuencias del ruido 2 × 6 y rejilla de azar 3,8 × 10 (escena);
  1,2 × 1,7 y 5 × 2,6 (textos).
- **Piezas**: la composición de `lib/gravure` (`progreso`). Pendiente: `TileReveal` para DOM e imágenes (docs/36 D3).
- **Referencias**: Chartogne-Taillet (todo su DOM es WebGL con esta aparición).
