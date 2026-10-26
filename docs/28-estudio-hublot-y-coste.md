# 28 · Segundo estudio: Hublot (ventanilla al alba) y cuánto cuesta el método

> Ronda 17 (24-10-2026). Segunda web real con el método de cine 3D (docs/26): [Hublot](https://hublot.darkroom.engineering/),
> de darkroom.engineering (portada de threejs.org), WebGPU + TSL. Captura, recreación en el banco, pieza nueva del kit
> (**`Porthole`**), utilidades nuevas del método y la cuenta de lo que cuesta estudiar una web 3D y sacar piezas de ella.

## 0. Conclusiones

1. **El método vale también para una web WebGPU sin modelos ni luces.** De Hublot salieron, medidos: la cámara (cabeza
   que se asoma con el puntero y transición al arrastrar, r² 1,000), el horizonte (−2,49° − 5,03°·sin acimut), la rampa
   de color del cielo, el resplandor por acimut, la ventanilla, el ala y la cadena de posprocesado. La recreación quedó
   con **la cámara al 3 %** (dirección a 0,33°, los mismos movimientos), **la imagen al 10 %** (luminancia +0,005, ΔE de
   la paleta 1,3) y la atmósfera al 1 %, en siete vueltas.
2. **El concepto no estaba donde se buscaba**: la primera captura (scroll) no movía nada. Hubo que explorar la página
   gesto a gesto para saber que se arrastra. Desde ahora, el primer paso de un estudio es esa exploración (§1).
3. **El código publicado puede ser la mejor fuente**: las funciones WGSL de Hublot llevan sus comentarios (luces de
   ciudad prefiltradas por la huella del píxel, estrellas por magnitud). Se estudian como técnica y se escriben de nuevo
   en TSL portable; no se copian.
4. **Una web nueva sigue destapando fallos de la herramienta**: la escala de la escena con objetos a kilómetros, el
   dolly a lo largo de la mirada y el arranque de los tramos. Están corregidos (los dos primeros) y comprobados contra las
   capturas de calibración: camera-scroll sigue saliendo «órbita + dolly».
5. **El kit gana `Porthole`** (WebGPU con reserva WebGL2, versión plana sin WebGL) y el método, tres utilidades:
   `cine:rampa`, la respuesta al puntero en `cine:analyze` y las entradas `--clic` y `--arrastre` en `cine:capture`.
6. **El coste baja con cada estudio** (§7): Plain Sight, unas 5 h; Hublot, más difícil, 1 h 08. Una web de este
   nivel cuesta ya entre 2 y 5 h hasta tener la pieza en el kit, más 1–3 h si destapa algo que la herramienta aún no mide.

## 1. Qué es Hublot y cómo se exploró

La vista desde la ventanilla de un avión al alba: el ala con la punta roja, el horizonte encendido y, debajo, el suelo de
noche con ciudades y ríos. **No hay scroll** (la página no se desplaza ni responde a la rueda): la cámara se asoma con el
puntero y, al **arrastrar** (no al hacer clic), sale por la ventanilla; otro arrastre la devuelve.

Cómo se averiguó, en este orden (cada paso, una captura corta de Playwright en tiempo real):

1. Captura con scroll (la de la fase 4): la cámara no se movía. La hoja de contacto enseñaba la escena, no el concepto.
2. Exploración de la página entera (sin `--solo-lienzo`): textos («click anywhere for sound»), botones (un panel de
   ajustes) y una ronda de gestos: puntero, rueda, arrastre, clic y espera.
3. Gesto por gesto: el clic solo activa el sonido; el arrastre (horizontal o vertical, de 40 px o de 200 px) saca la
   cámara al soltar; la rueda no hace nada.
4. Con eso, `cine:capture` aprendió dos entradas nuevas (§5): `--clic` y `--arrastre`, con el reloj virtual.

## 2. La ficha

- **Render**: WebGPURenderer (three r186), **sin tone mapping**, sRGB, sin sombras. 68 llamadas, 1,44 M triángulos,
  36 pasadas por fotograma.
- **Sin luces ni modelos**: 46 materiales `MeshBasicNodeMaterial` con su `colorNode` (la luz se calcula en nodos). La red
  solo trae una textura (`nightlights.png`) y dos audios: **todo lo demás es procedural**.
- **Escena** (`hublot-mallas.json`): el ala (malla propia de 2 200 vértices con un atributo `paint` para la librea) y sus
  detalles, la góndola del motor (`LatheGeometry`), la luz de punta de ala, la pared de la cabina con la ventanilla
  (`ExtrudeGeometry` de 3,1 M de vértices) y su marco, el cristal (`ShapeGeometry`) y 40 tarjetas de nubes a 10–90 km.
- **Fondo**: un único shader (65 kB de WGSL) con el cielo, el suelo, las ciudades, las nubes y las estrellas, más tablas
  precalculadas en pasadas RTT. El bundle publica sus funciones `wgslFn` **con comentarios**: luces de ciudad
  prefiltradas por la huella del píxel (el jacobiano de la proyección), pueblos con calles, dispersión rural por niveles
  de detalle, estrellas por magnitud, cirros, nubes bajas, destello de lente con fantasmas hexagonales y polvo en el
  cristal.
- **Posprocesado**: RTT → 2 desenfoques gaussianos → 2 blooms → SMAA.
- **Horizonte**: el = −2,49° − 5,03°·sin(acimut) (0,29° de error): unos 6 km de altitud y el morro 5° arriba.
- **Cielo**: una rampa de color por elevación (§3) y un resplandor que depende del acimut, f = 0,08 + 0,92·exp(−½·|Δ/27°|³).
- **Cámara** (§2b).

### 2b. La cámara

| | Medida | Ajuste |
|---|---|---|
| Cabeza (puntero) | guiñada −8°, cabeceo −4,8°, x ±3,9 cm, y ±2,2 cm | seguimiento 0,03 por fotograma en los cuatro ejes, r² 1,000 |
| Dentro | (−1,369, 0, −1,669), guiñada −18°, fov 54 | |
| Fuera | (−1,465, 0,02, −1,995), guiñada +2,4°, cabeceo +3° | la cabeza deja de contar fuera |
| Transición | dolly de 0,33 m a través de la pared y 20° de giro | **acercamiento exponencial**: 0,088 por fotograma a la ida, 0,082 a la vuelta |
| Disparo | arrastre de ~19 % del ancho, o soltar uno corto (> 8 px) | |

## 3. La recreación

El motor se escribió desde la ficha (`lib/porthole`): la rampa medida del cielo en una textura de 1D, el horizonte con su
cabeceo, el suelo proyectado a 6 km con farolas prefiltradas (cada una reparte su luz en el área del píxel y, lejos,
queda la media), ríos y lagos que reflejan el cielo, estrellas por magnitud, un ala con perfil NACA, flecha, diedro y
winglet iluminada por el cielo (por su normal) y con su reflejo con Fresnel, la cabina con la ventanilla como única luz y
la cámara medida.

| Vuelta | Cambio | Cámara | Imagen |
|---|---|---|---|
| 1 | Primera versión desde la ficha | — (a ojo) | — |
| 2 | Signo del cabeceo del mundo (el horizonte se inclinaba al revés), suelo hasta el negro, menos polvo, pared y ala más oscuras | — | — |
| 3 | Ríos y lagos que reflejan el cielo; la pared plana a oscuras (lo que se ilumina es el bisel) | — | — |
| 4 | Reflejo contrastado del ala (solo brilla el canto de ataque); pueblos con su resplandor | 28 % (dirección 1,1°) | 18 % |
| 5 | Fuera, la cabeza no cuenta; umbral del arrastre; halo del bloom más corto; ventanilla en su sitio; nubes bajas y farolas excepcionales | 23 % (0,33°) | 13 % |
| 6 | Núcleo de la escena y dolly por el eje en la herramienta (los planos coinciden) | **3 %** | 10 % |
| 7 | Ventanilla más alta, chapa a oscuras, nubes más grandes y escasas, librea configurable | 3 % | **10 %** (ΔE 1,3) |

El presupuesto técnico queda en el 72 % y no es del concepto: la referencia hace 36 pasadas (tablas de la atmósfera, dos
desenfoques y dos blooms) y su pared tiene 3,1 M de vértices; la nuestra hace una docena con un cielo analítico. Visto a
ojo (`lado.mp4`), lo que más se nota todavía: los pueblos de la referencia son manchas cálidas más intensas, tiene unos
pocos puntos blancos muy brillantes y el bisel de la ventanilla reparte la luz de otra manera.

## 4. Verificación

| Lo que se esperaba | Resultado |
|---|---|
| Descubrir qué mueve la web | **Sí**, explorando gesto a gesto (§1); la captura con scroll sola no lo habría encontrado |
| Medir la técnica sin un código fuente legible | **Sí**: ficha completa desde el gancho, la red y el bundle (sus funciones WGSL comentadas) |
| Vídeo a fotograma exacto con interacción | **Sí**, con `--arrastre` y el reloj virtual: la transición cae en el mismo fotograma en la referencia y en el banco |
| Recrear en WebGPU + TSL | **Sí**: `lib/porthole` en TSL portable (WebGPU y WebGL2), sin modelos ni texturas |
| Ningún eje del concepto por encima del 15 % | **Sí**: cámara 3 %, imagen 10 %, atmósfera 1 %, luz y posprocesado 0 % (el presupuesto, 72 %, no es del concepto) |
| Llevarlo al kit | **Sí**: `Porthole` en el catálogo, con versión plana, subruta `trama-ui/Porthole` y la librea del tema |
| No romper lo calibrado | **Sí**: camera-scroll y Plain Sight dan los mismos movimientos con la herramienta corregida |
| SSIM | 0,933: con la escena recreada desde cero ya dice algo, pero manda la lectura por ejes |

## 5. Lo que el estudio añadió a la herramienta

- **Entradas nuevas en `cine:capture`**: `--clic x,y@s` y `--arrastre a>b@s+d`, en su fotograma exacto con el reloj
  virtual; `--cola` también con `--drive time` y `pointer`.
- **Núcleo de la escena**: el gancho apunta el centro de las mallas ponderado por triángulos, y el análisis lo usa en vez
  del centro de la caja. Con tarjetas de nubes a 90 km, la caja medía 190 km, 0,33 m de dolly no contaban como movimiento
  y la referencia salía «panorámica» mientras el banco (sin esas tarjetas) salía «dolly».
- **`cine:rampa`**: la rampa de color de un cielo o un degradado por elevación (mediana por franjas, en lineal) y el
  resplandor por acimut, desde un fotograma y la cámara de esa muestra.
- **Respuesta al puntero** en `cine:analyze` (`scripts/cine/puntero.mts`): seguimiento y ganancia de cada eje de la
  cámara, con su r².
- **`lib/porthole`**: cielo y suelo en TSL portable (WebGPU y WebGL2), ala procedural y cámara de cabeza con transición.

## 6. Trampas

1. **La captura con scroll no encuentra una web que se arrastra**: antes de capturar, explorar la página (textos, botones
   y cada gesto por separado, en tiempo real).
2. **El clic no es el arrastre**: «click anywhere for sound» activa el audio; lo que mueve la cámara es arrastrar.
3. **Objetos a kilómetros deforman la escala**: con nubes a 90 km, el centro de la caja no es la escena y 0,33 m de dolly
   no cuentan. El análisis usa ya el núcleo ponderado por triángulos.
4. **Dolly es avanzar por la mirada**, no solo acercarse al centro: si la cámara cruza mirando a un lado, la distancia al
   centro apenas cambia y el movimiento salía «fijo».
5. **El tramo empieza con el gesto, no con el disparo**: los fotogramas casi quietos del arrastre antes del disparo hacen
   que una aproximación exponencial parezca `power2.inOut`. Aquí se midió a mano desde el primer fotograma que se mueve
   de verdad (0,088 por fotograma).
6. **Un modelo analítico del cielo no da el cambio de tono**: tres exponenciales dejaban un 37–41 % de error. La rampa
   medida por franjas de elevación lo reproduce (`cine:rampa`).
7. **El halo del bloom ilumina lo que debería estar negro**: un radio grande pinta de gris la pared junto a la
   ventanilla. Se ve en el perfil de una fila, no en la luminancia media.
8. **La respuesta al puntero solo se mide con el barrido**: con arrastres, el puntero existe solo durante ellos y el
   ajuste sale sin sentido; `cine:analyze` la calcula solo con `--drive pointer`.
9. **Editar el motor con una captura del banco en marcha la estropea** (docs/27, trampa 6): las piezas nuevas del kit se
   escriben en archivos que el banco no importa mientras dura la captura.

## 7. El coste: cuánto cuesta estudiar una web 3D y sacar piezas

Tiempos de reloj sacados del registro de la sesión (desde el mensaje que pide la ronda hasta su commit), con un agente y
la GPU de la máquina (RTX 5060):

| Ronda | Qué incluye | Tiempo |
|---|---|---|
| Herramienta (fases 0–2) y 3 vueltas de camera-scroll | captura, análisis, ficha, banco WebGPU, calibración con cinco ejemplos | 1 h 06 |
| Vueltas 4–5 de camera-scroll | scroll real, clips, flotación, materiales que cambian, cámara de autor | 4 h 00 |
| Plain Sight (fase 4) | 3 candidatas, instancias y sombras en la herramienta, 7 vueltas, `TypeField`, `lib/postfx` | 4 h 17 |
| Plain Sight (ronda 16) | ajuste copia a copia, tema oscuro | 0 h 57 |
| Hublot (esta ronda) | exploración, 2 entradas nuevas, 7 vueltas, 3 utilidades, `Porthole`, este documento | 1 h 08 |

Tiempo de máquina por paso (ya no es lo que pesa): una captura de 16 s a 1280 × 720 tarda de 4 a 6,5 min (960
fotogramas); el análisis, 15 s; la comparación, 30 s. Una vuelta completa (cambiar, capturar, comparar, mirar el lado a
lado) son unos 6–8 min.

**Lo que cuesta una web nueva, por partes:**

| Paso | Con la herramienta de hoy |
|---|---|
| Explorar y capturar (descubrir la interacción) | 20–45 min |
| Leer la ficha, la red y el bundle | 10–30 min |
| Primera recreación en el banco | 30 min – 2 h (menos si el código de nodos se lee) |
| Vueltas hasta ≤ 15 % por eje | 5–10 vueltas, 45–90 min |
| Llevarla al kit (componente, versión plana, catálogo, pruebas) | 30–60 min |
| **Total** | **2–5 h**, más 1–3 h si la web destapa algo que la herramienta no mide |

**Por qué baja**: cada estudio deja la herramienta más completa (Plain Sight: instancias, sombras, luz de cielo; Hublot:
gestos, escala, rampas, puntero) y el kit con más motores reutilizables (`lib/postfx`, `lib/typefield`, `lib/porthole`).
La segunda web de un tipo ya visto (otra ventanilla, otro campo tipográfico) cuesta sobre todo las vueltas.

**Cuándo sale a cuenta**: cuando el concepto es reutilizable como pieza (un fondo de portada, un efecto, una coreografía)
y la web expone su escena (three visible). Cuando no la expone (Tidewater), la medida se queda en el vídeo y las
etiquetas de los shaders y la recreación es casi toda a ojo: el coste se dobla y el resultado no se puede verificar por
ejes.

**Criterio de «completado» de un estudio** (el que se ha seguido con Hublot):

1. La interacción descubierta y capturada con su entrada exacta.
2. La ficha medida (render, cámara, luz, posprocesado, escena) con el origen de cada dato.
3. Ningún eje del concepto por encima del 15 % en `cine:compare` (los que no son del concepto, explicados).
4. La pieza en el kit, con versión plana, en el catálogo y con los checks pasando.
5. La herramienta corregida donde falló, sin regresiones en las capturas de calibración.
6. El documento del estudio con sus trampas y lo pendiente.

## 8. Pendiente

- Los pueblos más cálidos e intensos y los pocos puntos blancos muy brillantes de la referencia (§3).
- El reparto de luz del bisel de la ventanilla (se ve en el lado a lado, no mueve los ejes).
- Destello de lente y polvo iluminado para una hora con el sol a la vista (la referencia los tiene en sus funciones; el
  panel de ajustes de la página cambia la hora).
- Medir la curva de los tramos desde el primer fotograma en movimiento (trampa 5), para que el análisis dé la
  aproximación exponencial sin ajuste a mano.
- Tidewater (sin escena) y el componente `PostFX` del kit siguen pendientes de docs/27 §7.
