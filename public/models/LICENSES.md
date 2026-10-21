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

Los `-transformed.glb` salen de `npm run models:fetch -- bajar sketchfab:<id> <nombre> --partes` (gltfjsx con `--keepmeshes`: las piezas se conservan; Draco y texturas WebP). CC BY 4.0 exige atribución: se cita en el pie de la web que los usa (Ánima).
