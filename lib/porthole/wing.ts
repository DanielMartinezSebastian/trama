import * as THREE from "three";
import { MeshBasicNodeMaterial, type Node } from "three/webgpu";
import { attribute, cameraPosition, dot, float, max, mix, normalWorld, normalize, positionWorld, pow, reflect, vec3 } from "three/tsl";

/*
 * Ala de avión procedural (sin modelos): perfil alar con borde de ataque redondeado, flecha, diedro y winglet, y la
 * góndola del motor. Medidas de la caja de la de Hublot (docs/28): raíz bajo la ventanilla (y −2,1, z −1,95), punta a
 * 15,5 m (z −17,4) con 1,8 m de diedro, flecha de 8 m y winglet hasta y 2,3. Un atributo `pintura` marca la librea
 * (0 = gris, 1 = el color de la cola). Sin luces: la ilumina el cielo (por su normal) y lo refleja con Fresnel, así el
 * borde de ataque brilla donde refleja el resplandor del horizonte.
 */

type Seccion = { x: number; y: number; z: number; cuerda: number; espesor: number; pintura: number; giro?: number };

/** perfil NACA de 4 cifras simétrico con un poco de curvatura: puntos (x 0–1 a lo largo de la cuerda, y) en sentido horario */
function perfil(n: number, espesor: number) {
  const pts: [number, number][] = [];
  const yt = (x: number) => 5 * espesor * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
  const yc = (x: number) => 0.02 * (x < 0.4 ? (2 * 0.4 * x - x * x) / 0.16 : (1 - 0.8 + 2 * 0.4 * x - x * x) / 0.36);
  for (let i = 0; i < n; i++) {
    // reparto coseno: más puntos en el borde de ataque (el que brilla)
    const a = (i / n) * Math.PI * 2;
    const x = 0.5 * (1 + Math.cos(a));
    const arriba = a < Math.PI;
    pts.push([x, yc(x) + (arriba ? 1 : -1) * yt(x)]);
  }
  return pts;
}

function loft(secciones: Seccion[], n = 48) {
  const pos: number[] = [];
  const pintura: number[] = [];
  const idx: number[] = [];
  secciones.forEach((s) => {
    const p = perfil(n, s.espesor);
    const g = s.giro ?? 0;
    for (const [u, v] of p) {
      // la cuerda va hacia −x desde el borde de ataque; el espesor, en y (girado con el winglet)
      const cx = -u * s.cuerda;
      const cy = v * s.cuerda;
      pos.push(s.x + cx, s.y + cy * Math.cos(g), s.z + cy * Math.sin(g));
      pintura.push(s.pintura);
    }
  });
  for (let k = 0; k < secciones.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const a = k * n + i;
      const b = k * n + ((i + 1) % n);
      idx.push(a, a + n, b, b, a + n, b + n);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("pintura", new THREE.Float32BufferAttribute(pintura, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** el ala con su winglet: secciones de la raíz a la punta y del codo a lo alto del winglet */
export function geometriaAla() {
  const sec: Seccion[] = [];
  const pasos = 14;
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos;
    sec.push({ x: -8 * t, y: -2.1 + 1.75 * t, z: -1.95 - 15.45 * t, cuerda: 4.6 + (1.5 - 4.6) * t, espesor: 0.13 - 0.03 * t, pintura: 0 });
  }
  // codo del winglet: gira de horizontal a casi vertical (inclinado hacia fuera)
  const codo = 6;
  for (let i = 1; i <= codo; i++) {
    const t = i / codo;
    const a = (t * Math.PI) / 2.25;
    sec.push({ x: -8 - 0.35 * t, y: -0.35 + 0.35 * Math.sin(a), z: -17.4 - 0.35 * (1 - Math.cos(a)), cuerda: 1.5 - 0.15 * t, espesor: 0.1, pintura: t > 0.5 ? 1 : 0, giro: -a });
  }
  for (let i = 1; i <= 6; i++) {
    const t = i / 6;
    const a = Math.PI / 2.25;
    sec.push({ x: -8.35 - 1.6 * t, y: -0.0 + 2.3 * t, z: -17.75 - 0.65 * t, cuerda: 1.35 - 0.75 * t, espesor: 0.09, pintura: 1, giro: -a });
  }
  return loft(sec);
}

/** góndola del motor: un torno a lo largo de x, bajo el ala */
export function geometriaMotor() {
  const perfilMotor: THREE.Vector2[] = [];
  const L = 4.8;
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const r = 0.62 + 0.43 * Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5) - 0.35 * Math.max(0, t - 0.6) ** 2 * 6;
    perfilMotor.push(new THREE.Vector2(Math.max(0.05, r), t * L));
  }
  const g = new THREE.LatheGeometry(perfilMotor, 40);
  // el eje del torno (y) pasa a ser x, con la boca hacia delante (+x)
  g.rotateZ(Math.PI / 2);
  g.translate(0.9, -2.66, -5.75);
  g.setAttribute("pintura", new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count), 1));
  return g;
}

/**
 * Material del ala: albedo de la librea iluminado por el cielo en la dirección de la normal (luz de cielo) más el
 * reflejo del cielo con Fresnel de Schlick (F0 = 0,04, pintura brillante).
 */
export function materialAla(cielo: (d: Node<"vec3">) => Node<"vec3">, librea = new THREE.Color("#c0161b"), gris = new THREE.Color("#2a2d31")) {
  const m = new MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  const N = normalize(normalWorld);
  const V = normalize(cameraPosition.sub(positionWorld));
  const R = reflect(V.negate(), N);
  const albedo = mix(vec3(gris.r, gris.g, gris.b), vec3(librea.r, librea.g, librea.b), attribute("pintura", "float"));
  const fresnel = float(0.04).add(float(0.96).mul(pow(float(1).sub(max(dot(N, V), 0)), 5)));
  // reflejo contrastado: solo brilla de verdad donde refleja el resplandor (el canto de ataque redondeado)
  const reflejado = cielo(R);
  m.colorNode = albedo.mul(cielo(N)).mul(0.25).add(reflejado.mul(fresnel).mul(0.1)).add(reflejado.mul(reflejado).mul(fresnel).mul(0.7));
  return m;
}
