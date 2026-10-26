import * as THREE from "three";

/*
 * La cruz de `CrossCluster` (docs/31 §2): tres cilindros cruzados con los cantos redondeados y un taladro en cada punta,
 * de radio total 1 (como las de lusion.co: brazo de radio 0,29 y taladro de 0,105). Lleva horneado lo que el shader de la
 * referencia lee por vértice: la oclusión ambiental de la propia pieza (`ao`), la visibilidad hacia los seis ejes
 * (`daoP` hacia +x +y +z, `daoN` hacia −x −y −z, de la que sale la sombra propia según venga la luz) y el grosor
 * (`thickness`, 0–1, para el cristal). Se calcula una vez por página (~30 ms) contra la distancia con signo de la cruz.
 */

export const BRAZO = 0.29;
const TALADRO = 0.105;
const HONDO = 0.35;
const CANTO = 0.05;

/** perfil de medio brazo a lo largo de +y (r, y), del centro de la cruz al fondo del taladro */
function perfil() {
  const p: THREE.Vector2[] = [];
  p.push(new THREE.Vector2(0, 1 - HONDO));
  p.push(new THREE.Vector2(TALADRO * 0.6, 1 - HONDO));
  p.push(new THREE.Vector2(TALADRO, 1 - HONDO + 0.03));
  p.push(new THREE.Vector2(TALADRO, 1 - 0.02));
  // canto interior del taladro, redondeado
  for (let i = 1; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2);
    p.push(new THREE.Vector2(TALADRO + 0.02 - Math.cos(a) * 0.02, 1 - 0.02 + Math.sin(a) * 0.02));
  }
  // la cara de la punta y el canto exterior (cuarto de círculo de radio CANTO)
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    p.push(new THREE.Vector2(BRAZO - CANTO + Math.sin(a) * CANTO, 1 - CANTO + Math.cos(a) * CANTO));
  }
  // el costado, hasta el centro; geometriaCruz lo recorta por la curva donde entra en los otros brazos. Sin chaflán en la
  // unión: hecho en el torno, cada brazo deja un aro donde se cruza con el de al lado (docs/31 §6)
  for (const y of [0.8, 0.62, 0.48, 0.38, 0.3, 0.22, 0.15, 0.09, 0.04, 0]) p.push(new THREE.Vector2(BRAZO, y));
  // LatheGeometry orienta las caras según el sentido del perfil: hacia fuera si sube por el costado
  return p.reverse();
}

/** distancia con signo a la cruz (tres cilindros con tapa de radio BRAZO y media longitud 1, sin taladros) */
export function sdCruz(x: number, y: number, z: number) {
  const cil = (r: number, h: number) => {
    const dx = r - BRAZO, dy = Math.abs(h) - 1;
    return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  };
  return Math.min(cil(Math.hypot(y, z), x), cil(Math.hypot(x, z), y), cil(Math.hypot(x, y), z));
}

/** ¿choca el rayo (o, d) con la cruz antes de `lejos`? (avance por esferas) */
function choca(o: THREE.Vector3, d: THREE.Vector3, lejos: number) {
  let t = 0.02;
  for (let i = 0; i < 40 && t < lejos; i++) {
    const h = sdCruz(o.x + d.x * t, o.y + d.y * t, o.z + d.z * t);
    if (h < 0.002) return true;
    t += Math.max(h, 0.01);
  }
  return false;
}

/** direcciones repartidas sobre la esfera (espiral de Fibonacci) */
function fibonacci(n: number) {
  const out: THREE.Vector3[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    out.push(new THREE.Vector3(Math.cos(g * i) * r, y, Math.sin(g * i) * r));
  }
  return out;
}

let cache: THREE.BufferGeometry | null = null;

/** la geometría de la cruz con sus atributos horneados (compartida: no la deseches) */
export function geometriaCruz(segmentos = 48): THREE.BufferGeometry {
  if (cache) return cache;
  const brazo = new THREE.LatheGeometry(perfil(), segmentos);
  /*
   * Una sola superficie cerrada: el costado de cada medio brazo empieza donde sale de los otros dos, no en el centro. En
   * su eje local (+y), el brazo está dentro del de x cuando |y| < |x| y dentro del de z cuando |y| < |z| (dos cilindros
   * del mismo radio se cortan en esa curva). Así el cristal no deja ver los tubos de dentro (docs/40, nota del usuario).
   * Los anillos del costado (radio BRAZO, hasta y = 0,8) se reparten entre esa curva y 0,8.
   */
  const P0 = brazo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < P0.count; i++) {
    const x = P0.getX(i), y = P0.getY(i), z = P0.getZ(i);
    if (Math.abs(Math.hypot(x, z) - BRAZO) > 1e-4 || y > 0.8 + 1e-4) continue;
    // un poco por dentro (0,02): las costuras de dos brazos se solapan en vez de dejar rendijas entre sus cuerdas
    const y0 = Math.max(Math.abs(x), Math.abs(z)) - 0.02;
    P0.setY(i, y0 + (y / 0.8) * (0.8 - y0));
  }
  const giros = [
    new THREE.Euler(0, 0, 0),
    new THREE.Euler(Math.PI, 0, 0),
    new THREE.Euler(0, 0, -Math.PI / 2),
    new THREE.Euler(0, 0, Math.PI / 2),
    new THREE.Euler(Math.PI / 2, 0, 0),
    new THREE.Euler(-Math.PI / 2, 0, 0),
  ];
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const m = new THREE.Matrix4();
  const nm = new THREE.Matrix3();
  const v = new THREE.Vector3();
  for (const e of giros) {
    m.makeRotationFromEuler(e);
    nm.getNormalMatrix(m);
    const base = pos.length / 3;
    const P = brazo.attributes.position, N = brazo.attributes.normal;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(m);
      pos.push(v.x, v.y, v.z);
      v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize();
      nor.push(v.x, v.y, v.z);
    }
    const I = brazo.index!;
    for (let i = 0; i < I.count; i++) idx.push(base + I.getX(i));
  }
  brazo.dispose();

  const n = pos.length / 3;
  const ao = new Float32Array(n);
  const daoP = new Float32Array(n * 3);
  const daoN = new Float32Array(n * 3);
  const grosor = new Float32Array(n);
  const hemis = fibonacci(48);
  const ejes = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
  const p = new THREE.Vector3(), nn = new THREE.Vector3(), o = new THREE.Vector3(), d = new THREE.Vector3();
  // visibilidad en un cono de 30° alrededor de una dirección (la luz no es un punto: la sombra propia es suave)
  const cono = fibonacci(64).filter((x) => x.z > Math.cos(Math.PI / 6));
  const base = new THREE.Quaternion();
  const visibleHacia = (dir: THREE.Vector3) => {
    base.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    let vis = 0;
    for (const c of cono) {
      d.copy(c).applyQuaternion(base);
      const cos = d.dot(nn);
      if (cos <= 0) continue;
      if (!choca(o, d, 2.5)) vis += 1;
    }
    return vis / cono.length;
  };
  for (let i = 0; i < n; i++) {
    p.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    nn.set(nor[i * 3], nor[i * 3 + 1], nor[i * 3 + 2]);
    o.copy(p).addScaledVector(nn, 0.01);
    let vis = 0, peso = 0;
    for (const h of hemis) {
      const c = h.dot(nn);
      if (c <= 0) continue;
      peso += c;
      if (!choca(o, h, 1.2)) vis += c;
    }
    ao[i] = peso ? vis / peso : 1;
    for (let k = 0; k < 3; k++) {
      daoP[i * 3 + k] = visibleHacia(ejes[k]);
      daoN[i * 3 + k] = visibleHacia(ejes[k].clone().negate());
    }
    // grosor: lo que se recorre hacia dentro hasta salir, en diámetros de brazo
    let t = 0.01;
    while (t < 2 && sdCruz(p.x - nn.x * t, p.y - nn.y * t, p.z - nn.z * t) < 0) t += 0.02;
    grosor[i] = Math.min(1, t / (2 * BRAZO));
  }

  const g = new THREE.BufferGeometry();
  g.setIndex(idx);
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("ao", new THREE.BufferAttribute(ao, 1));
  g.setAttribute("daoP", new THREE.BufferAttribute(daoP, 3));
  g.setAttribute("daoN", new THREE.BufferAttribute(daoN, 3));
  g.setAttribute("thickness", new THREE.BufferAttribute(grosor, 1));
  g.computeBoundingSphere();
  cache = g;
  return g;
}
