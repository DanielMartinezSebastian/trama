/**
 * Genera los modelos 3D de ejemplo de `RetroModel` en `public/models/` (uno por formato, para probar los tres cargadores):
 *
 * - `asteroide.gltf`: roca con cráteres y relieve fractal (~19k triángulos, glTF de texto con el búfer embebido).
 * - `turbina.obj`: turbina con 18 álabes torcidos, anillos, radios y tornillos (piezas separadas, muchos bordes vivos).
 * - `ciudad.glb`: bloque de ciudad con torres, antenas y azoteas escalonadas (glTF binario).
 *
 * Son geometría propia (sin licencias de terceros) y deterministas. Uso: `npx tsx scripts/gen-retro-models.mts`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { BoxGeometry, BufferGeometry, CylinderGeometry, Group, IcosahedronGeometry, Mesh, SphereGeometry, TorusGeometry, Vector3 } from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

const OUT = "public/models";
mkdirSync(OUT, { recursive: true });

// azar determinista
let s = 7;
const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

// ruido de valor 3D suavizado + fbm
const hash = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  let v = 0;
  for (let dx = 0; dx < 2; dx++)
    for (let dy = 0; dy < 2; dy++)
      for (let dz = 0; dz < 2; dz++) v += hash(xi + dx, yi + dy, zi + dz) * (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
  return v * 2 - 1;
}
const fbm = (p: Vector3) => {
  let a = 0.5, f = 1.6, v = 0;
  for (let o = 0; o < 5; o++, a *= 0.5, f *= 2.1) v += a * noise(p.x * f, p.y * f, p.z * f);
  return v;
};

/* ---------- asteroide ---------- */
function asteroid(): BufferGeometry {
  const g = mergeVertices(new IcosahedronGeometry(1, 30));
  const craters = Array.from({ length: 14 }, () => ({ c: new Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize(), r: 0.12 + rand() * 0.28, d: 0.05 + rand() * 0.09 }));
  const pos = g.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let h = 1 + fbm(v) * 0.32;
    for (const k of craters) {
      const d = v.distanceTo(k.c) / k.r;
      if (d < 1.25) h += d < 1 ? -k.d * (1 - d * d) : k.d * 0.6 * Math.sin(((d - 1) / 0.25) * Math.PI); // cuenco y borde
    }
    v.multiplyScalar(h);
    v.set(v.x * 1.25, v.y * 0.9, v.z); // alargado, como una roca real
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* ---------- turbina ---------- */
function turbine(): Mesh[] {
  const parts: Mesh[] = [];
  const add = (g: BufferGeometry, name: string) => {
    const m = new Mesh(g);
    m.name = name;
    parts.push(m);
  };
  add(new CylinderGeometry(0.55, 0.62, 0.9, 32).rotateX(Math.PI / 2), "buje");
  add(new SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2).translate(0, 0, 0.45), "cono");
  const blades: BufferGeometry[] = [];
  for (let i = 0; i < 18; i++) {
    const b = new BoxGeometry(0.34, 1.6, 0.05, 2, 10, 1);
    const p = b.attributes.position;
    for (let j = 0; j < p.count; j++) {
      const y = p.getY(j) + 0.8; // 0 en la raíz
      const tw = 0.9 * (y / 1.6); // torsión progresiva
      const x = p.getX(j) * (1 - y * 0.25), z = p.getZ(j);
      p.setXYZ(j, x * Math.cos(tw) - z * Math.sin(tw), y + 0.6, x * Math.sin(tw) + z * Math.cos(tw));
    }
    b.rotateZ((i / 18) * Math.PI * 2);
    blades.push(b);
  }
  add(mergeGeometries(blades.map((b) => b.toNonIndexed()))!, "alabes");
  add(new TorusGeometry(2.3, 0.09, 12, 96), "aro exterior");
  add(new TorusGeometry(2.3, 0.05, 8, 96).translate(0, 0, 0.35), "aro trasero");
  add(new TorusGeometry(0.62, 0.05, 8, 48).translate(0, 0, -0.45), "aro buje");
  const spokes: BufferGeometry[] = [];
  for (let i = 0; i < 6; i++) spokes.push(new BoxGeometry(0.06, 1.7, 0.06).translate(0, 1.45, 0.35).rotateZ((i / 6) * Math.PI * 2 + 0.26).toNonIndexed());
  add(mergeGeometries(spokes)!, "radios");
  const bolts: BufferGeometry[] = [];
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    bolts.push(new CylinderGeometry(0.05, 0.05, 0.08, 8).rotateX(Math.PI / 2).translate(Math.cos(a) * 2.3, Math.sin(a) * 2.3, 0.12).toNonIndexed());
  }
  add(mergeGeometries(bolts)!, "tornillos");
  return parts;
}

/* ---------- ciudad ---------- */
function city(): BufferGeometry {
  const gs: BufferGeometry[] = [new BoxGeometry(7.4, 0.12, 7.4).translate(0, -0.06, 0)];
  const N = 12, step = 0.6;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      if (i === 5 || j === 7) continue; // avenidas
      const x = (i - (N - 1) / 2) * step, z = (j - (N - 1) / 2) * step;
      const center = 1 - Math.hypot(x, z) / 5;
      const h = 0.2 + Math.pow(rand(), 2) * 2.6 * Math.max(0.25, center);
      const w = 0.3 + rand() * 0.16, d = 0.3 + rand() * 0.16;
      gs.push(new BoxGeometry(w, h, d).translate(x, h / 2, z));
      if (h > 1.2 && rand() > 0.35) gs.push(new BoxGeometry(w * 0.62, h * 0.18, d * 0.62).translate(x, h + h * 0.09, z)); // azotea escalonada
      if (h > 1.8 && rand() > 0.4) gs.push(new CylinderGeometry(0.015, 0.015, 0.6, 6).translate(x, h * 1.18 + 0.3, z)); // antena
    }
  return mergeGeometries(gs.map((g) => g.toNonIndexed()))!;
}

/* ---------- escritura glTF (texto con búfer embebido o binario) ---------- */
function gltfParts(g: BufferGeometry) {
  const geo = g.index ? g : mergeVertices(g, 1e-4);
  geo.computeVertexNormals();
  const pos = geo.attributes.position.array as Float32Array;
  const nor = geo.attributes.normal.array as Float32Array;
  const idx = Uint32Array.from(geo.index!.array as ArrayLike<number>);
  const bin = Buffer.concat([Buffer.from(pos.buffer, pos.byteOffset, pos.byteLength), Buffer.from(nor.buffer, nor.byteOffset, nor.byteLength), Buffer.from(idx.buffer)]);
  geo.computeBoundingBox();
  const { min, max } = geo.boundingBox!;
  const json = {
    asset: { version: "2.0", generator: "trama gen-retro-models" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2 }] }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: pos.length / 3, type: "VEC3", min: [min.x, min.y, min.z], max: [max.x, max.y, max.z] },
      { bufferView: 1, componentType: 5126, count: nor.length / 3, type: "VEC3" },
      { bufferView: 2, componentType: 5125, count: idx.length, type: "SCALAR" },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: pos.byteLength, target: 34962 },
      { buffer: 0, byteOffset: pos.byteLength, byteLength: nor.byteLength, target: 34962 },
      { buffer: 0, byteOffset: pos.byteLength + nor.byteLength, byteLength: idx.byteLength, target: 34963 },
    ],
    buffers: [{ byteLength: bin.length }] as Array<{ byteLength: number; uri?: string }>,
  };
  return { json, bin, tris: idx.length / 3 };
}
function writeGltf(file: string, g: BufferGeometry) {
  const { json, bin, tris } = gltfParts(g);
  json.buffers[0].uri = `data:application/octet-stream;base64,${bin.toString("base64")}`;
  writeFileSync(file, JSON.stringify(json));
  return tris;
}
function writeGlb(file: string, g: BufferGeometry) {
  const { json, bin, tris } = gltfParts(g);
  const pad = (b: Buffer, fill: number) => Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4, fill)]);
  const j = pad(Buffer.from(JSON.stringify(json)), 0x20);
  const b = pad(bin, 0);
  const head = Buffer.alloc(12);
  head.writeUInt32LE(0x46546c67, 0); // «glTF»
  head.writeUInt32LE(2, 4);
  head.writeUInt32LE(12 + 8 + j.length + 8 + b.length, 8);
  const chunk = (len: number, type: number) => {
    const c = Buffer.alloc(8);
    c.writeUInt32LE(len, 0);
    c.writeUInt32LE(type, 4);
    return c;
  };
  writeFileSync(file, Buffer.concat([head, chunk(j.length, 0x4e4f534a), j, chunk(b.length, 0x004e4942), b]));
  return tris;
}

const a = writeGltf(`${OUT}/asteroide.gltf`, asteroid());
const parts = turbine();
const group = new Group();
parts.forEach((m) => group.add(m));
writeFileSync(`${OUT}/turbina.obj`, `# Turbina de ejemplo para RetroModel (trama)\n${new OBJExporter().parse(group)}`);
const t = parts.reduce((n, m) => n + (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3, 0);
const c = writeGlb(`${OUT}/ciudad.glb`, city());
console.log(`asteroide.gltf ${a} triángulos · turbina.obj ${t} · ciudad.glb ${c}`);
