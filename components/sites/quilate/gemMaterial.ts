/**
 * Material de gema con trazado de rayos real dentro de la piedra (docs/19 §6). Una talla es un poliedro convexo: el punto
 * por el que un rayo sale de ella es el plano de faceta más cercano en su dirección, sin necesidad de BVH. En cada píxel:
 *
 *   1. reflexión exterior en la faceta (Fresnel de Schlick con el índice de la piedra);
 *   2. refracción hacia dentro (ley de Snell);
 *   3. hasta 6 rebotes: en cada faceta de salida, si el ángulo supera el crítico (24,4° en el diamante) hay reflexión
 *      interna total y el rayo sigue dentro; si no, sale refractado y toma la luz del entorno de la gema;
 *   4. dispersión: el trazado se repite con un índice por canal (rojo 2,407 · verde 2,418 · azul 2,451; dispersión del
 *      diamante B–G ≈ 0,044), que es lo que separa el blanco en colores: el «fuego».
 *
 * Las piedras de color absorben según la distancia recorrida dentro (Beer–Lambert). La luz de la sección (LightScroll) tiñe el
 * entorno y añade el reflejo del foco. Sin React.
 */
import { Color, DataTexture, FloatType, NearestFilter, RGBAFormat, ShaderMaterial, Vector3, type BufferGeometry, type Texture } from "three";

/** Caras planas como máximo por piedra (el cojín y la marquesa de Blender tienen 169). Van en una textura, no en uniforms. */
export const MAX_PLANES = 256;

/** Planos de faceta (normal hacia fuera y distancia) de una geometría convexa, sin repetir los coplanares. */
export function facetPlanes(geo: BufferGeometry): Float32Array {
  const pos = geo.getAttribute("position");
  const idx = geo.getIndex();
  const n = idx ? idx.count : pos.count;
  const v = (i: number) => new Vector3().fromBufferAttribute(pos, idx ? idx.getX(i) : i);
  const center = new Vector3();
  for (let i = 0; i < pos.count; i++) center.add(new Vector3().fromBufferAttribute(pos, i));
  center.divideScalar(pos.count);
  const planes: { n: Vector3; d: number }[] = [];
  for (let i = 0; i + 2 < n; i += 3) {
    const a = v(i);
    const b = v(i + 1);
    const c = v(i + 2);
    const nn = new Vector3().subVectors(b, a).cross(new Vector3().subVectors(c, a));
    if (nn.length() < 1e-9) continue;
    nn.normalize();
    if (nn.dot(new Vector3().subVectors(a, center)) < 0) nn.negate();
    const d = nn.dot(a);
    if (planes.some((p) => p.n.dot(nn) > 0.9995 && Math.abs(p.d - d) < 1e-4)) continue;
    planes.push({ n: nn, d });
    if (planes.length >= MAX_PLANES) break;
  }
  const out = new Float32Array(MAX_PLANES * 4);
  planes.forEach((p, i) => out.set([p.n.x, p.n.y, p.n.z, p.d], i * 4));
  return out;
}

const vertex = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vCam;
void main() {
  vPos = position;
  vNormal = normal;
  vCam = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
#define MAX_PLANES ${MAX_PLANES}
#define BOUNCES 6
uniform mat4 modelMatrix;
uniform samplerCube uEnv;
uniform sampler2D uPlanes;
uniform int uCount;
uniform vec3 uIor;
uniform float uDispersion;
uniform vec3 uAbsorb;
uniform float uAbsorbK;
uniform vec3 uTint;
uniform float uEnvI;
uniform vec3 uKeyDir;
uniform vec3 uKeyColor;
uniform float uKeyI;
uniform vec3 uFlat;
uniform float uFlatMix;
uniform float uDim;
uniform float uOpacity;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vCam;

// luz que llega desde una dirección (en el espacio de la piedra): el entorno teñido por la toma de luz y el foco principal
vec3 env(vec3 dLocal) {
  vec3 w = normalize(mat3(modelMatrix) * dLocal);
  vec3 c = textureCube(uEnv, w).rgb * uTint * uEnvI;
  c += uKeyColor * uKeyI * pow(max(dot(w, uKeyDir), 0.0), 220.0);
  return c;
}

float schlick(float cosi, float ior) {
  float r0 = (1.0 - ior) / (1.0 + ior);
  r0 *= r0;
  return r0 + (1.0 - r0) * pow(1.0 - clamp(cosi, 0.0, 1.0), 5.0);
}

// un rayo que entra por p con dirección d en la faceta de normal n, para un índice de refracción
vec3 trace(vec3 p, vec3 d, vec3 n, float ior) {
  vec3 rd = refract(d, n, 1.0 / ior);
  vec3 pos = p - n * 1e-4;
  float dist = 0.0;
  vec3 weight = vec3(1.0);
  for (int b = 0; b < BOUNCES; b++) {
    float tmin = 1e9;
    vec3 nh = vec3(0.0, 1.0, 0.0);
    for (int i = 0; i < MAX_PLANES; i++) {
      if (i >= uCount) break;
      vec4 pl = texelFetch(uPlanes, ivec2(i, 0), 0);
      float dn = dot(pl.xyz, rd);
      if (dn > 1e-5) {
        float t = (pl.w - dot(pl.xyz, pos)) / dn;
        if (t < tmin) { tmin = t; nh = pl.xyz; }
      }
    }
    tmin = max(tmin, 0.0);
    pos += rd * tmin;
    dist += tmin;
    vec3 outDir = refract(rd, -nh, ior);
    bool tir = dot(outDir, outDir) < 1e-6;
    if (!tir) {
      // sale: la parte transmitida toma la luz de fuera; la reflejada (Fresnel) sigue dentro
      float F = schlick(dot(outDir, nh), ior);
      vec3 absorb = pow(uAbsorb, vec3(dist * uAbsorbK));
      if (b == BOUNCES - 1) return weight * env(outDir) * absorb;
      vec3 outside = weight * env(outDir) * absorb * (1.0 - F);
      // con poco reflejo interno no merece la pena seguir: se corta (la piedra queda un poco más oscura, nunca más clara)
      if (F < 0.25) return outside;
      weight *= F;
      rd = reflect(rd, -nh);
      pos -= nh * 1e-4;
      return outside + weight * env(rd) * absorb * 0.5;
    }
    // reflexión interna total: el rayo rebota dentro
    rd = reflect(rd, -nh);
    pos -= nh * 1e-4;
  }
  return weight * env(rd) * pow(uAbsorb, vec3(dist * uAbsorbK));
}

void main() {
  // normal de la faceta a partir de las derivadas: plana en cualquier talla, aunque la geometría tenga normales suaves
  vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
  vec3 d = normalize(vPos - vCam);
  if (dot(n, d) > 0.0) n = -n;
  float F = schlick(dot(-d, n), uIor.g);
  vec3 outer = env(reflect(d, n));
  vec3 inner;
  if (uDispersion > 0.5) {
    inner = vec3(trace(vPos, d, n, uIor.r).r, trace(vPos, d, n, uIor.g).g, trace(vPos, d, n, uIor.b).b);
  } else {
    inner = trace(vPos, d, n, uIor.g);
  }
  vec3 color = outer * F + inner * (1.0 - F);
  // cera, boceto, sin limpiar: la piedra pierde su luz
  vec3 nw = normalize(mat3(modelMatrix) * n);
  vec3 flatc = uFlat * (0.35 + 0.65 * max(dot(nw, uKeyDir), 0.0));
  color = mix(color, flatc, uFlatMix);
  color *= 1.0 - uDim * 0.7;
  gl_FragColor = vec4(color, uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export type GemMaterial = ShaderMaterial & {
  uniforms: {
    uEnv: { value: Texture | null };
    uPlanes: { value: DataTexture };
    uCount: { value: number };
    uIor: { value: Vector3 };
    uDispersion: { value: number };
    uAbsorb: { value: Color };
    uAbsorbK: { value: number };
    uTint: { value: Color };
    uEnvI: { value: number };
    uKeyDir: { value: Vector3 };
    uKeyColor: { value: Color };
    uKeyI: { value: number };
    uFlat: { value: Color };
    uFlatMix: { value: number };
    uDim: { value: number };
    uOpacity: { value: number };
  };
};

/** Índices del diamante por canal (rojo, verde, azul): dispersión B–G ≈ 0,044. */
export const DIAMOND_IOR = new Vector3(2.407, 2.418, 2.451);
/** Corindón (rubí y zafiro): ~1,762–1,778, dispersión 0,018. */
export const CORUNDUM_IOR = new Vector3(1.762, 1.77, 1.778);
/** Berilo (esmeralda): ~1,570–1,582, dispersión 0,014. */
export const EMERALD_IOR = new Vector3(1.57, 1.575, 1.582);

export function createGemMaterial(env: Texture | null, geo: BufferGeometry, dispersion: boolean): GemMaterial {
  const mat = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    toneMapped: true,
    uniforms: {
      uEnv: { value: env },
      uPlanes: { value: planeTexture(new Float32Array(MAX_PLANES * 4)) },
      uCount: { value: 0 },
      uIor: { value: DIAMOND_IOR.clone() },
      uDispersion: { value: dispersion ? 1 : 0 },
      uAbsorb: { value: new Color(1, 1, 1) },
      uAbsorbK: { value: 0 },
      uTint: { value: new Color(1, 1, 1) },
      uEnvI: { value: 1 },
      uKeyDir: { value: new Vector3(0, 1, 0) },
      uKeyColor: { value: new Color(1, 1, 1) },
      uKeyI: { value: 0 },
      uFlat: { value: new Color(0.24, 0.48, 0.4) },
      uFlatMix: { value: 0 },
      uDim: { value: 0 },
      uOpacity: { value: 1 },
    },
  }) as GemMaterial;
  setGemGeometry(mat, geo);
  return mat;
}

function planeTexture(data: Float32Array) {
  const t = new DataTexture(data, MAX_PLANES, 1, RGBAFormat, FloatType);
  t.minFilter = t.magFilter = NearestFilter;
  t.needsUpdate = true;
  return t;
}

/** Cambia la talla de un material ya creado (nuevos planos de faceta). */
export function setGemGeometry(mat: GemMaterial, geo: BufferGeometry) {
  const planes = facetPlanes(geo);
  mat.uniforms.uPlanes.value.dispose();
  mat.uniforms.uPlanes.value = planeTexture(planes);
  let count = 0;
  for (let i = 0; i < MAX_PLANES; i++) if (planes[i * 4] || planes[i * 4 + 1] || planes[i * 4 + 2]) count = i + 1;
  mat.uniforms.uCount.value = count;
}
