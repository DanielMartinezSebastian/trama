import * as THREE from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { Fn, attribute, cameraPosition, clamp, distance, float, min, positionLocal, positionView, positionWorld, sin, time, vec3, vec4 } from "three/tsl";

/*
 * Los pájaros de `EngravedMap` (docs/33 §4): una bandada de uves que vuela en círculos sobre el pueblo, dibujada con el
 * lápiz (canal g lleno, como una línea). Medido con cine:sonda en Chartogne-Taillet: 100 instancias de una uve de 16
 * vértices que aletea con `sin(t · 5 − d · 2) · 0,01 · d` (d, la distancia del vértice al cuerpo: unos 0,8 Hz), y que
 * se borra cerca de la cámara (0,45–0,65 m) y lejos del centro (3–3,5 m).
 */

/** una uve: dos alas de dos triángulos, con la distancia al cuerpo de cada vértice para el aleteo */
export function geometriaPajaro() {
  const pos: number[] = [];
  const d: number[] = [];
  for (const s of [-1, 1]) {
    // ala: del cuerpo (0) a la punta (1), un poco echada hacia atrás
    const v = [
      [0, 0, 0.012, 0],
      [0, 0, -0.008, 0],
      [s * 0.5, 0, -0.18, 0.5],
      [s * 1, 0, -0.32, 1],
    ];
    for (const [a, b, c] of [
      [0, 1, 2],
      [0, 2, 3],
    ]) {
      for (const k of s > 0 ? [a, b, c] : [a, c, b]) {
        pos.push(v[k][0] * 0.1, v[k][1], v[k][2] * 0.1);
        d.push(v[k][3]);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("wingDistance", new THREE.Float32BufferAttribute(d, 1));
  g.computeVertexNormals();
  return g;
}

export function materialPajaro() {
  const m = new MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  const d = attribute<"float">("wingDistance", "float");
  m.positionNode = positionLocal.add(vec3(0, sin(time.mul(5).sub(d.mul(2))).mul(0.01).mul(d), 0));
  m.colorNode = Fn(() => {
    const lejos = float(1).sub(clamp(distance(positionWorld.xz, vec3(0).xz).sub(3).div(0.5), 0, 1));
    const cerca = clamp(distance(positionWorld, cameraPosition).sub(0.45).div(0.2), 0, 1);
    const cercania = float(1).sub(clamp(positionView.z.negate().mul(0.4), 0, 1));
    return vec4(0.5, min(lejos, cerca).mul(0.9), cercania, 1);
  })();
  return m;
}

/** la bandada: cada pájaro da vueltas a un centro con su radio, altura, velocidad y fase */
export function crearBandada(n: number, centro: [number, number], azar: () => number) {
  const aves = Array.from({ length: n }, () => {
    const grupo = Math.floor(azar() * 4);
    return {
      cx: centro[0] + (grupo - 1.5) * 0.6 + (azar() - 0.5) * 0.3,
      cz: centro[1] + (azar() - 0.5) * 0.8,
      r: 0.9 + azar() * 1.6,
      h: 0.45 + azar() * 0.45,
      w: (0.1 + azar() * 0.08) * (grupo % 2 ? 1 : -1),
      f: azar() * Math.PI * 2,
      s: 0.18 + azar() * 0.1,
    };
  });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), e = new THREE.Vector3(), eje = new THREE.Vector3(0, 1, 0);
  return {
    /** escribe las matrices del instante t (s) */
    mover(malla: THREE.InstancedMesh, t: number) {
      aves.forEach((a, i) => {
        const ang = a.f + t * a.w;
        p.set(a.cx + Math.cos(ang) * a.r, a.h + Math.sin(t * 0.7 + a.f) * 0.03, a.cz + Math.sin(ang) * a.r);
        // mira hacia donde vuela (tangente a la vuelta)
        q.setFromAxisAngle(eje, -ang + (a.w > 0 ? 0 : Math.PI));
        e.setScalar(a.s);
        malla.setMatrixAt(i, m.compose(p, q, e));
      });
      malla.instanceMatrix.needsUpdate = true;
    },
  };
}
