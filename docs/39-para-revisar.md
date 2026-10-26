# 39 · Para revisar: lo que necesito de ti

> Lista viva (desde el 25-10-2026). La mantengo al día mientras sigo por mi cuenta el plan de docs/36 §7. Cada punto
> dice qué te pido, dónde se ve y qué hago mientras tanto. Lo más urgente va arriba.
>
> También está en el panel: http://localhost:3005/lab/cine/docs/39-para-revisar. Todo funciona solo en local, con el
> `next dev` del worktree en el puerto 3005.

## 1. Mira las piezas nuevas y dime si se sienten como su referencia (10 min)

| Pieza | Dónde verla | Qué comparar | Referencia |
|---|---|---|---|
| **Banco del relato de Meer Mohsin**: emblema, llamas con manos, relato y papel rasgado | http://localhost:3005/lab/cine/relato (baja con la rueda) | ¿Se siente como la portada y el relato de la referencia? Sensación, profundidad, ritmo del scroll | https://www.meermohsin.me/ |
| `ThornEmblem`: emblema 3D de púas | http://localhost:3005/componentes#thorn-emblem | ¿El emblema de púas te vale como pieza de la librería? Prueba otras semillas | El logotipo 3D de la portada de Meer Mohsin |
| `FlameHorizon`: llamas con manos | http://localhost:3005/componentes#flame-horizon (mueve «Progreso») y http://localhost:3005/lab/cine/llamas | Las manos y las lenguas de fuego | Meer Mohsin, entre la portada y el relato |
| `ProjectReel`: reel de proyectos con fondo desenfocado | http://localhost:3005/componentes#project-reel y el final del banco del relato | El paso de un proyecto a otro y el fondo | Meer Mohsin, sección de proyectos |
| `TornPaper`: franja de papel rasgado | http://localhost:3005/componentes#torn-paper | El corte y el canto blanco | Meer Mohsin, «The fall was always part of the path» |
| `GravureCanvas`: grabado a lápiz para cualquier escena | http://localhost:3005/componentes#gravure-canvas | ¿Te sirve el grabado fuera del paisaje? | El grabado de Chartogne-Taillet |
| **Bruno**: intro y decorado de juguete | http://localhost:3005/lab/cine/bruno (haz clic y conduce con las flechas) | La intro (vacío morado, isla, clic), la hierba, los árboles, el agua | https://bruno-simon.com/ |
| **Chartogne**: el paisaje más denso | http://localhost:3005/lab/cine/chartogne | Cepas en trazos, árboles sin tronco, casas pequeñas | https://chartogne-taillet.com/en |

Puntúalo en el panel (http://localhost:3005/lab/cine): cada ficha con demo tiene el bloque «Tu puntuación», con
sensación y profundidad de 1 a 5 y una nota. Desde la ronda 24, esa puntuación cuenta para dar una demo por terminada
(docs/36 A9).

## 2. Puntúa las demos ya cerradas

Chartogne, Hublot y Plain Sight son las que las cifras dan por buenas. Si para ti no lo son, el método tiene un hueco y
quiero saberlo antes que nada.

## 3. Decisiones que tomo yo si no dices otra cosa

| Decisión | Lo que haré |
|---|---|
| Orden del plan | El de docs/36 §7, con lo de Meer Mohsin primero porque era la demo más lejana |
| Piezas nuevas en el kit (`GravureCanvas`, `ThornEmblem`, `FlameHorizon`, `TornPaper`, `ProjectReel`) | Entran en el catálogo `/componentes`; las quito si no te convencen |
| Chartogne: la profundidad se queda en el 16 % (objetivo: 15 %) | Lo dejo así. El punto que falta está en el desenfoque y costaría varias vueltas más |
| La portada de Meer Mohsin lleva la foto de una persona | **Hecho** (me lo pediste): `npm run images:fetch -- retratos` (tema nuevo, fotos CC0 de Unsplash en Commons con sus créditos). En la portada del banco va `public/img/retratos/01-a-friend-unsplash.jpg`, virada a rojo. Si prefieres otra de las 8, dime el número (hoja: `public/img/retratos/`) |
| Nada se fusiona en `main` | Todo sigue en `feat/cine-captura` hasta que lo pidas |

## 3b. Lo que hice con tus notas del 26-10-2026

- **Las piezas se quedan en el kit** (lo confirmaste).
- **Meer Mohsin**: la portada, rehecha desde un inventario completo de la web (docs/41).
  - Cinta de texto por encima de la cara, humo con el ratón (`FluidCursor`), máscara tribal y retrato nuevo.
  - Lo que falta del resto de la web está en docs/41 §4.
- **Lusion**: las cruces de cristal ya son una pieza cerrada, sin tubos por dentro.
- **Pendiente**: que Lusion y Chartogne tengan el contenido del original, no solo el componente.

## 3c. Lo que hice con tus notas del 26-10-2026 (segunda tanda)

- **Un solo `trackScroll`** (lo aprobaste si no rompía nada): sin GSAP, comprobado en las landings temáticas.
- **La máscara de Meer Mohsin, rehecha tras estudiarla a fondo** (docs/41 §5):
  - dos alas tribales góticas en punta, con la luz roja de la referencia;
  - sale de los ojos dando vueltas en 3D y, al llegar al relato, se encoge y se queda pequeña y oscura arriba hasta el
    papel rasgado, como en la original.
- **Lusion entera**: http://localhost:3000/lab/cine/lusion-web (docs/43).
  - Cabecera con menú, portada con las cruces, cintas 3D, reel que crece, rejilla de proyectos y la tableta que se
    convierte en la escena del astronauta.
  - Al kit van `ScrollExpand` (nueva) y `LineDraw tube`.
- **Para ti**: mira la máscara del relato y la réplica de Lusion. Lo pendiente de Lusion está en docs/43 §4: el reel
  curvado de verdad, el astronauta en 3D y la transición de proyecto.

## 3d. Lusion: cintas, play y vídeo flotante (tercera tanda)

- **Cintas de LineDraw**: no se dibujaban bien porque la caja del SVG tenía otra proporción que su dibujo y lo encogía a
  un tercio con el grosor intacto. Ahora son tubos finos que cruzan la página como en la original (docs/43 §2b). Mira
  `/lab/cine/lusion-web` entre «Bold Ideas» y el reel, y entre «See all projects» y la tableta.
- **Play del reel**: centrado (triángulo SVG en vez del glifo).
- **Segundo vídeo**: `FloatingVideo` (nueva en el kit) en «Featured Work»; púlsalo para que crezca.

## 3e. Estudios por sector (pendiente, 26-10)

Plan en docs/50: Il Colorista, Surfing Academy, Future London Academy, Honhar, Peppa Sauce y K72 (navegación y
transiciones), más búsqueda de webs de gimnasio y de peluquería en Awwwards. Salen guías de estilo, modelos por sector
y piezas. Si tienes más ejemplos, añádelos allí.

## 4. Bloqueos

_Ninguno por ahora._
