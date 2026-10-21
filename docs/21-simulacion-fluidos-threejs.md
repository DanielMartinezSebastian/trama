# Tutorial: simulación de fluido/humo con shaders en Three.js

> **Origen:** reconstruido a partir del vídeo *"Fluid/Smoke simulation with Shaders in ThreeJs"* (canal Bandinopla, 11 jul 2025), su descripción, el post del autor en el foro de Three.js y el algoritmo original de Pavel Dobryakov (WebGL-Fluid-Simulation) en el que se basa.
> No es una transcripción literal del vídeo (no se pudo acceder al audio). Conviene contrastar nombres exactos de opciones con el repositorio.

- Vídeo (inglés): https://www.youtube.com/watch?v=tjaH322hQdc
- Vídeo (español): https://www.youtube.com/watch?v=VAl09MrEPxg
- Repositorio: https://github.com/bandinopla/threejs-fluid-simulation (versión WebGPU en `src/FluidMaterialGPU.ts`)
- Original: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- Hilo en el foro: https://discourse.threejs.org/t/fluid-simulation-using-shaders-tutorial/85109

---

## 1. La idea base

El fluido **no** se simula con partículas. Se usan **texturas en la GPU** que actúan como rejillas, y cada píxel guarda un dato:

| Textura      | Qué guarda                                         |
|--------------|----------------------------------------------------|
| `velocity`   | velocidad (x, y) de cada celda                     |
| `dye`        | el color/humo visible (densidad)                   |
| `divergence` | cuánto fluido "entra o sale" de cada celda         |
| `pressure`   | presión (se resuelve iterando)                     |
| `curl`       | rotación local (los remolinos)                     |

Cada paso de la simulación es un **shader de pantalla completa**. Se ejecuta sobre un quad con cámara ortográfica, lee una textura y escribe el resultado en otra.

```js
const simScene  = new THREE.Scene();
const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quad      = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
simScene.add(quad);

function runPass(material, target) {
  quad.material = material;
  renderer.setRenderTarget(target);
  renderer.render(simScene, simCamera);
  renderer.setRenderTarget(null);
}
```

## 2. Ping-pong (doble buffer)

Un shader no puede leer y escribir la misma textura a la vez. Por eso cada campo usa **dos render targets** que se intercambian después de cada pasada:

```js
function createDoubleFBO(w, h) {
  const opts = {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
  };
  let read  = new THREE.WebGLRenderTarget(w, h, opts);
  let write = new THREE.WebGLRenderTarget(w, h, opts);
  return {
    get read()  { return read; },
    get write() { return write; },
    swap() { [read, write] = [write, read]; },
  };
}

const velocity = createDoubleFBO(128, 128);
const dye      = createDoubleFBO(1024, 1024);
const pressure = createDoubleFBO(128, 128);
const divergence = new THREE.WebGLRenderTarget(128, 128, { type: THREE.HalfFloatType });
const curl       = new THREE.WebGLRenderTarget(128, 128, { type: THREE.HalfFloatType });
```

Una pasada consiste en asignar el material del paso, renderizar en `write` y llamar a `swap()`.

## 3. El bucle por frame (en este orden)

### 3.1 Splat (inyectar)
Cuando mueves el ratón, se suma en esa posición una mancha gaussiana:
- en `velocity`, con la dirección del movimiento × fuerza;
- en `dye`, con un color.

```glsl
uniform sampler2D uTarget;
uniform vec2  point;
uniform vec3  color;
uniform float radius;
uniform float aspect;
varying vec2 vUv;
void main() {
  vec2 p = vUv - point;
  p.x *= aspect;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
}
```

### 3.2 Curl
Se calcula la rotación del campo de velocidad usando las celdas vecinas (izquierda/derecha/arriba/abajo).

```glsl
float L = texture2D(uVelocity, vL).y;
float R = texture2D(uVelocity, vR).y;
float T = texture2D(uVelocity, vT).x;
float B = texture2D(uVelocity, vB).x;
float vorticity = R - L - T + B;
gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
```

### 3.3 Vorticity confinement
Se añade una fuerza que refuerza los remolinos a partir del `curl`. Sin este paso el humo queda plano y "difuminado".

### 3.4 Divergence
Se mide cuánto se comprime o expande el fluido en cada celda:

```glsl
float div = 0.5 * (R - L + T - B); // R/L = vel.x vecinos, T/B = vel.y vecinos
gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
```

### 3.5 Pressure (iteraciones de Jacobi)
1. Se atenúa la presión anterior (factor `PRESSURE`, ~0.8).
2. Se repite unas **20 veces** (con ping-pong en cada iteración):

```glsl
float p = (pL + pR + pB + pT - divergence) * 0.25;
gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
```

### 3.6 Gradient subtract
Se resta el gradiente de presión a la velocidad. Así el fluido queda **incompresible**, y de aquí sale el comportamiento de fluido "real".

```glsl
vec2 vel = texture2D(uVelocity, vUv).xy;
vel -= vec2(pR - pL, pT - pB);
gl_FragColor = vec4(vel, 0.0, 1.0);
```

### 3.7 Advection
Se transporta la velocidad (y luego el color) siguiendo el propio flujo. El truco es mirar **hacia atrás**: "¿de dónde viene lo que ahora está aquí?" (método semi-lagrangiano).

```glsl
vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
```

- Primero se advecta `velocity` con disipación de velocidad.
- Después se advecta `dye` con disipación de densidad (el humo se desvanece).

### 3.8 Display
Se pinta `dye.read.texture` en pantalla, o se usa como textura (`map`, `emissiveMap`, `alphaMap`…) de cualquier material de la escena.

### Resumen del bucle

```js
function step(dt) {
  applyInputSplats();          // 3.1
  computeCurl();               // 3.2
  applyVorticity(dt);          // 3.3
  computeDivergence();         // 3.4
  solvePressure(20);           // 3.5
  subtractGradient();          // 3.6
  advect(velocity, velocity, VELOCITY_DISSIPATION, dt); // 3.7
  advect(velocity, dye,      DENSITY_DISSIPATION,  dt);
}
```

## 4. Parámetros que controlan el aspecto

Valores por defecto del simulador original de Pavel (el port probablemente expone algo similar):

| Parámetro              | Valor aprox. | Efecto                                          |
|------------------------|--------------|-------------------------------------------------|
| `SIM_RESOLUTION`       | 128          | resolución de velocidad/presión (puede ser baja)|
| `DYE_RESOLUTION`       | 1024         | resolución del color (necesita detalle)         |
| `DENSITY_DISSIPATION`  | 1            | cuánto tarda en desaparecer el humo             |
| `VELOCITY_DISSIPATION` | 0.2          | cuánto tarda en frenarse el movimiento          |
| `PRESSURE`             | 0.8          | cuánto se conserva la presión entre frames      |
| `PRESSURE_ITERATIONS`  | 20           | más = más preciso y más caro                    |
| `CURL`                 | 30           | intensidad de los remolinos                     |
| `SPLAT_RADIUS`         | 0.25         | tamaño del "pincel"                             |
| `SPLAT_FORCE`          | 6000         | fuerza con la que empuja el ratón               |

## 5. WebGL vs WebGPU

- **WebGL:** cada paso es un `THREE.ShaderMaterial` con GLSL, como en los fragmentos de arriba.
- **WebGPU:** los mismos pasos escritos en **TSL** (nodos de Three.js: `Fn`, `texture`, `uv`, `uniform`…). La lógica es idéntica y solo cambia la sintaxis. El resultado se puede conectar como nodo directamente a otros materiales.

## 6. Usarlo en un proyecto

1. Descargar/clonar `bandinopla/threejs-fluid-simulation`.
2. Elegir la versión: WebGL (ShaderMaterial) o WebGPU (`src/FluidMaterialGPU.ts`, TSL).
3. Crear la simulación con el renderer, conectar los eventos del puntero (splats) y llamar al paso de simulación cada frame con `dt`.
4. Usar la textura de `dye` en el material que quieras.
5. Ajustar disipación, curl y radio del splat según el efecto buscado (humo, plasma, polvo…).

> Revisar en el repositorio los nombres exactos de clases y opciones, porque aquí no se han podido verificar.
