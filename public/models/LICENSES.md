# Modelos de ejemplo

| Archivo | Origen | Licencia |
|---|---|---|
| `asteroide.gltf`, `turbina.obj`, `ciudad.glb` | Geometría propia, generada con `scripts/gen-retro-models.mts` | La del repositorio |
| `suzanne.glb` | *Suzanne*, © 2017 Norbert Nopper (UX3D), de [KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Suzanne) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `farol.glb` | *Lantern*, © 2017 Microsoft (sbtron), de [KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Lantern) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

`suzanne.glb` y `farol.glb` están aligerados con `scripts/strip-gltf.mts`: solo geometría, sin texturas ni UV (tras el
filtro retro no se verían). CC0 no exige atribución; se cita igualmente.

## Maquetas de `ExplorableCanvas model`

| Carpeta | Origen | Licencia |
|---|---|---|
| `clinica/` | BSI (2020) «Medical-Dental Test Files», buildingSMART International: [Community-Sample-Test-Files](https://github.com/buildingsmart-community/Community-Sample-Test-Files/tree/main/IFC%202.3.0.1%20(IFC%202x3)/Medical-Dental%20Clinic) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `eixample/` | © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright) (alturas del Catastro), zona del Eixample de Barcelona | [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |

Cambios en `clinica/`: se juntaron los modelos de arquitectura, estructura y climatización; pilares, vigas, conductos y
ventanas pasan a cajas orientadas; fuera mobiliario, puertas, falsos techos y cimentación; GLB por capas y planta baja en
SVG (`scripts/maqueta/ifc_to_glb.py`). `eixample/` sale de `scripts/maqueta/osm_to_glb.py`. Donde se vea el mapa del
Eixample hay que citar «© OpenStreetMap».

## Piezas de anillo del configurador de Quilate

| Carpeta | Origen | Licencia |
|---|---|---|
| `anillos/` (`aros/`, `cabezas/`, `piedras/`, `manifest.json` y miniaturas) | Geometría propia, generada por script con Blender 5.2 (`bpy` en modo headless) desde un generador paramétrico fuera del repo; no parte de modelos de terceros | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

Las piedras son poliedros convexos y cerrados. El brillante redondo sale de intersecar semiespacios (57 facetas); el
resto, del cierre convexo de anillos de contorno. Unidades en mm; anclajes y ejes, en `anillos/manifest.json`.

## Entorno HDR de la portada de Quilate

| Archivo | Origen | Licencia |
|---|---|---|
| `hdr/aerodynamics_workshop_1k.hdr` | [Aerodynamics Workshop](https://polyhaven.com/a/aerodynamics_workshop), de Oliksiy Yakovlyev, en Poly Haven (1K) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |


## Descargados con `npm run models:fetch`

| Archivo | Origen | Licencia |
|---|---|---|
| `calavera-pirata/calavera-pirata-transformed.glb` | *The Halloween Pirate Skull*, Machin, de [sketchfab](https://sketchfab.com/3d-models/the-halloween-pirate-skull-7743a10d48d74c8e814fa5b6759e1ddb) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `tumba-magica/tumba-magica-transformed.glb` | *halloween magic grave*, vicente betoret ferrero, de [sketchfab](https://sketchfab.com/3d-models/halloween-magic-grave-c75940f5e70c4a7faf4c0d349cdd215a) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `ojo-sangre/ojo-sangre-transformed.glb` | *Blue Eyeball (Free)*, Tom Hodes, de [sketchfab](https://sketchfab.com/3d-models/blue-eyeball-free-18915d2f17a2431fbefeb3eaf4411f16) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `reloj-bolsillo/reloj-bolsillo-transformed.glb` | *Vintage pocket watch*, adsky_pes, de [sketchfab](https://sketchfab.com/3d-models/vintage-pocket-watch-2e60626f61ba43e9b295ec27b4f56180) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `astrolabio/astrolabio-transformed.glb` | *Planispheric astrolabe*, Virtual Museums of Małopolska, de [sketchfab](https://sketchfab.com/3d-models/planispheric-astrolabe-f6dac1748e964711ad4331767317d7b9) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `amonites/amonites-transformed.glb` | *Ammonite Euaspidoceras paucituberkulatum Arkell*, Virtual Museums of Małopolska, de [sketchfab](https://sketchfab.com/3d-models/ammonite-euaspidoceras-paucituberkulatum-arkell-617f27f8364d4c908ec1c4e94967858f) | [CC0 Public Domain](http://creativecommons.org/publicdomain/zero/1.0/) |
| `nautilo/nautilo-transformed.glb` | *Nautilus shell*, Hailey Majewski, de [sketchfab](https://sketchfab.com/3d-models/nautilus-shell-ca29276e0659491eb4c5e6eb9d2ae0fc) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `caballero/caballero-transformed.glb` | *knight of the blood order*, DJMaesen, de [sketchfab](https://sketchfab.com/3d-models/knight-of-the-blood-order-98a655cb943d41d68974848ac2409559) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `doctor-peste/doctor-peste-transformed.glb` | *Plague Doctor*, BeardenInc, de [sketchfab](https://sketchfab.com/3d-models/plague-doctor-41f7a1dfd6984135b876f334908e3ca4) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `exploradora/exploradora-transformed.glb` | *Explorer*, Bento, de [sketchfab](https://sketchfab.com/3d-models/explorer-0c702359f0594f08b2a1e7b8d1f01d67) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `cofre/cofre-transformed.glb` | *Treasure Chest*, Multipainkiller Studio, de [sketchfab](https://sketchfab.com/3d-models/treasure-chest-b124919b7bc3470c82daeef72823f941) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |
| `senor-esqueleto/senor-esqueleto-transformed.glb` | *Skeleton Lord*, DJMaesen, de [sketchfab](https://sketchfab.com/3d-models/skeleton-lord-a3f7b44275cf4c489ad62c535268ac16) | [CC Attribution](http://creativecommons.org/licenses/by/4.0/) |

Los `-transformed.glb` salen de `npm run models:fetch -- bajar sketchfab:<id> <nombre> --partes` (gltfjsx con `--keepmeshes`: las piezas se conservan; texturas WebP y geometría cuantizada, sin Draco por la CSP). CC BY 4.0 exige atribución: se cita en el pie de la web que los usa (Ánima).
