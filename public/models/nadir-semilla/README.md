# Semilla · artefacto NÁDIR

Modelo propio basado en el concept art «Semilla» aprobado en el chat. La demo utiliza la misma geometría paramétrica que el exportador: no es una imagen ni un volumen fusionado.

## Archivos

- `semilla.glb`: modelo autocontenido con UV, materiales, mapas y clips `Apertura` y `Despiece`; sin Draco ni meshopt. Compatible con Blender y cargadores glTF estándar.
- `01-ortograficas.svg` / `.png`: frontal, lateral, posterior y superior; misma escala y geometría real.
- `02-despiece.svg` / `.png`: construcción abierta y relación de piezas/pivotes.
- `03-apertura.svg` / `.png`: estados y especificación de superficies.
- `texturas/`: 28 PNG originales de 256 × 256, deterministas y sin imágenes de terceros.
- `manifest.json`: dimensiones, ejes, piezas y lista de mapas.

## Construcción y jerarquía

Eje vertical +Y; frontal +Z. Altura de diseño 5,40 unidades; grosor radial de valva 0,095. El collar tiene 12 segmentos y baja 3,08 unidades antes de permitir el giro. Se añaden seis actuadores telescópicos; recorrido máximo comprobado 1,426 unidades. Las cotas son para reconstrucción digital; la escala de la demo la determina su cámara.

| Nodo | Cantidad | Hijos / superficie | Movimiento |
|---|---:|---|---|
| `valva-XX-pivote` | 6 | Casco exterior, interior, cantos, nervaduras y junta | Bisagras radiales a Y −2,75, radio 0,32; extracción antes de girar |
| `valva-N-casco-interior-canto` | 6 | Tres slots: mineral propio, cobre propio, canto común | Sigue el pivote de su valva |
| `valva-N-nervaduras` | 6 | Cobre en relieve, geometría real | Sigue el pivote de su valva |
| `collar-XX` | 12 | Metal, incrustación y terminales | Separación radial y desfase vertical |
| `bastidor-interior` | 1 | Eje y cuatro cunas | Extensión durante el despiece |
| `nucleo-memoria` | 1 | Ampolla, filamentos y 26 puntos de memoria | Pulso, giro y elevación al revelar el mensaje |

Los cascos tienen caras exteriores e interiores y los cuatro bordes cerrados. No dependen de materiales de doble cara para esconder agujeros. Las nervaduras son hijas de cada valva y no se quedan flotando al animar.

## Materiales y UV

Cada valva dispone de dos materiales texturados propios: mineral exterior y cobre interior. El relieve sigue el perfil curvo de la pieza y los UV cubren 0–1. El collar y las nervaduras disponen de sus propias familias de superficies compartidas, y la ampolla usa transmisión e IOR 1,33.

| Archivo | Espacio | Canales |
|---|---|---|
| `*-color.png` | sRGB | RGB albedo, A opacidad |
| `*-surface.png` | Lineal / Non-Color | R altura para bump, G rugosidad, B metalicidad, A 1 |

En Blender: usar Separate Color para conectar G a Roughness y B a Metallic. Conectar R a Height de un nodo Bump para recuperar el relieve de la escena. El GLB incorpora los mapas de color y metallic-roughness automáticamente; el relieve bump no tiene un canal estándar glTF y se suministra en R para configurarlo en el editor.

## Controles y coreografía

El constructor está en `components/sites/nadir/seed-model.ts`. `createSeedArtifact()` devuelve el grupo completo, listas de pivotes, núcleo y un método `dispose()`. `poseSeed(modelo, { open, explode, twist, pulse, reveal })` aplica transformaciones absolutas, sin acumular error al invertir el scroll.

- `open`: 0 protegida, 1 abierta. Cada valva gira hacia fuera sobre X local, con tope de 51,6°.
- `explode`: 0 ensamblada, 1 despiezada. Es independiente de `open` y separa también el collar.
- `twist`: acompaña las orientaciones ya existentes del relato.
- `pulse`: respiración del núcleo; la escena conserva el ciclo narrativo de 38 segundos.
- `reveal`: elevación e intensidad al abrir el mensaje final.

Cada URL ocupa un rango distinto: «La señal» 0,14–0,43; «El descenso» 0,59–0,83; «El hallazgo» 0,92–1. Son valores del control normalizado, no ángulos ni porcentajes geométricos. El scroll aumenta la apertura de reposo dentro del rango. Un ciclo de 26 s abre lentamente, mantiene la posición seis segundos y retorna suavemente al reposo de ese capítulo. Nunca vuelve a cerrar por completo en las dos últimas URLs. La secuencia mecánica reversible es: bajar collar → extraer 0,30 unidades → girar hasta el tope. Las seis valvas conservan sectores angulares exclusivos; el mínimo margen medido es 0,36° por lado y la holgura del collar 0,138 unidades. Las pruebas recorren 324 estados y comprueban también el volumen afinado del núcleo y los límites de actuadores. Es cinemática guiada que evita interferencias por diseño, sin un solver de cuerpos rígidos.

Los terminales redondeados del collar conservan 0,032 unidades de separación mínima. Los actuadores se sitúan bajo la carcasa y las bielas enlazan las bisagras; sus camisas tienen longitud fija y solo se extienden los vástagos.

El núcleo incorpora una luz puntual real con sombras de las carcasas, filamentos emisivos y halo aditivo con prueba de profundidad. El GLB conserva luz y potencia emisiva mediante KHR_lights_punctual y KHR_materials_emissive_strength; las sombras y el halo se configuran en la escena. Los clips se muestrean a 30 fps para preservar la secuencia de liberación.

El movimiento de cámara, los cambios de lado, zoom y continuidad del canvas siguen siendo responsabilidad de `Scene.tsx`.

## Regeneración y comprobaciones

```sh
npx tsx scripts/gen-nadir-semilla.mts
npx tsx scripts/nadir-semilla-planos.mts http://localhost:3020
npx tsx scripts/qa/nadir-semilla.mts
npx tsx scripts/qa/nadir-mecanica.mts
npx tsx scripts/qa/nadir-apertura.mts http://localhost:3020
npx tsx scripts/qa/nadir-transiciones.mts http://localhost:3020
npx tsx scripts/qa/nadir.mts http://localhost:3020
npm run verify
```

El generador escribe GLB, PNG de textura, SVG y manifiesto. Las versiones PNG de las láminas se obtienen renderizando los SVG a 1600 × 1100. La escena no descarga el GLB: construye el mismo modelo localmente para tener acceso directo a todos los pivotes.

Licencia: la del repositorio. Concepto y geometría propios; sin recursos de terceros.

## Coreografía y óptica de la demo

`seedStory` define cuatro poses por capítulo: cambia el despiece que se mantiene en reposo, la orientación, la elevación del núcleo y su energía. La traslación lateral sigue acompañando la lectura, pero ya no es el único gesto. Las descargas se disparan al entrar en los registros, con un pulso autónomo cada 18 s y uno especial en el mensaje final. `seed-optics.ts` aporta lens flare con oclusión, haz horizontal y reflejos generados mediante texturas procedurales. El efecto se apaga entre descargas y no se monta con movimiento reducido. El GLB mantiene el rig y los clips base; la coreografía narrativa y los efectos ópticos se ejecutan en Scene.tsx.

## Encuadres de la demo

Inspirados en Quilate, los planos alternan lectura con Semilla completa, macros del núcleo e interludios centrales. seed-framing.ts define el foco por capítulo y sección; Scene.tsx mide las cajas de las piezas para los generales y da prioridad al detalle en los macros. Los recortes de valvas son intencionales en los primeros planos. El lienzo se atenúa hacia la columna de lectura; en móvil el núcleo se mantiene en la parte superior con un ángulo más frontal. La mecánica y los efectos de luz continúan funcionando durante el acercamiento. Prueba específica: `npx tsx scripts/qa/nadir-encuadres.mts http://localhost:3020`.
