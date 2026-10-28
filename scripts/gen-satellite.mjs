/** Satellite reference model. Own geometry, no remote assets or textures.
 * Run: node scripts/gen-satellite.mjs. Y up, lens faces +Z, wings extend on X.
 * Components are named and merged by material to keep browser draw calls low.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { BoxGeometry, CylinderGeometry, DoubleSide, Group, LatheGeometry, Mesh, MeshStandardMaterial, Quaternion, SphereGeometry, TorusGeometry, Vector2, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// GLTFExporter needs only this browser API when exporting untextured geometry in Node.
globalThis.FileReader = class {
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.();
  }
};

const root = new Group();
root.name = 'Satelite solar';
root.userData = { author: 'Trama', units: 'conceptual metres', axes: 'Y up; front +Z; wings X', solarPanels: 6 };
const material = (name, color, metalness, roughness, extra = {}) => new MeshStandardMaterial({ name, color, metalness, roughness, ...extra });
const gold = material('Aislamiento multicapa dorado', '#bf9238', 0.65, 0.4);
const silver = material('Aluminio estructural', '#b8c6d4', 0.72, 0.32);
const dark = material('Grafito y juntas', '#18212b', 0.35, 0.58);
const blue = material('Silicio fotovoltaico', '#123b83', 0.48, 0.25);
const busbar = material('Contactos de plata', '#6e98c1', 0.65, 0.36);
const lens = material('Optica azul', '#123d58', 0.6, 0.12);
const white = material('Reflector ceramico', '#e3e5e4', 0.35, 0.44, { side: DoubleSide });
const buckets = new Map();
function add(name, geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) {
  geo.rotateX(rot[0]).rotateY(rot[1]).rotateZ(rot[2]).translate(...pos);
  const key = `${name}/${mat.name}`;
  if (!buckets.has(key)) buckets.set(key, { name, mat, gs: [] });
  buckets.get(key).gs.push(geo);
}
const box = (name, size, pos, mat, rot) => add(name, new BoxGeometry(...size), mat, pos, rot);
function rod(name, a, b, radius, mat, sides = 10) {
  const start = new Vector3(...a), end = new Vector3(...b);
  const delta = end.clone().sub(start);
  const geo = new CylinderGeometry(radius, radius, delta.length(), sides);
  geo.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), delta.normalize()));
  add(name, geo, mat, start.add(end).multiplyScalar(0.5).toArray());
}
const frontCylinder = (name, r, depth, pos, mat, sides = 40) => add(name, new CylinderGeometry(r, r, depth, sides), mat, pos, [Math.PI / 2, 0, 0]);

// Bus: a solid core beneath a gently wrinkled physical foil surface.
box('Estructura central', [1.92, 2.12, 1.48], [0, 0, 0], dark);
const foil = new BoxGeometry(1.98, 2.16, 1.54, 22, 24, 18);
const p = foil.attributes.position, n = foil.attributes.normal;
for (let i = 0; i < p.count; i++) {
  const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
  const edge = Math.max(0, Math.min(1, (0.99 - Math.abs(x)) * 12 + Math.abs(n.getX(i)), (1.08 - Math.abs(y)) * 12 + Math.abs(n.getY(i)), (0.77 - Math.abs(z)) * 12 + Math.abs(n.getZ(i))));
  const wrinkle = edge * (Math.sin(x * 39 + y * 23 + z * 17) * 0.013 + Math.sin(x * 13 - y * 31 + z * 49) * 0.009);
  p.setXYZ(i, x + n.getX(i) * wrinkle, y + n.getY(i) * wrinkle, z + n.getZ(i) * wrinkle);
}
foil.computeVertexNormals();
add('Manta termica', foil, gold);
for (const x of [-1.015, 1.015]) for (const z of [-0.8, 0.8]) {
  box('Largueros y tornilleria', [0.065, 2.22, 0.065], [x, 0, z], silver);
  for (const y of [-0.98, -0.5, 0.5, 0.98]) frontCylinder('Largueros y tornilleria', 0.033, 0.025, [x, y, z + Math.sign(z) * 0.035], silver, 6);
}
for (const y of [-1.1, 1.1]) for (const z of [-0.8, 0.8]) box('Largueros y tornilleria', [2.08, 0.055, 0.065], [0, y, z], silver);
// Front optics: stepped barrel, retaining ring, recessed glass and inner aperture.
frontCylinder('Camara frontal', 0.37, 0.13, [0, 0, 0.84], dark);
frontCylinder('Camara frontal', 0.32, 0.17, [0, 0, 0.94], silver);
frontCylinder('Camara frontal', 0.27, 0.19, [0, 0, 0.97], dark);
frontCylinder('Camara frontal', 0.223, 0.014, [0, 0, 1.07], lens);
add('Camara frontal', new TorusGeometry(0.285, 0.025, 10, 48), silver, [0, 0, 1.07]);
frontCylinder('Camara frontal', 0.09, 0.008, [0, 0, 1.081], dark);
box('Registros frontales', [0.3, 0.22, 0.04], [0, -0.83, 0.8], silver);
// Rear heat exchanger and mounting feet.
box('Radiador posterior', [1.16, 1.5, 0.1], [0, 0, -0.84], dark);
for (let i = 0; i < 23; i++) box('Radiador posterior', [0.025, 1.42, 0.105], [-0.53 + i * 0.048, 0, -0.93], silver);
for (const x of [-0.63, 0.63]) box('Radiador posterior', [0.055, 1.62, 0.12], [x, 0, -0.85], silver);
for (const x of [-0.78, 0.78]) for (const z of [-0.59, 0.59]) box('Patas de montaje', [0.2, 0.15, 0.2], [x, -1.17, z], silver);
add('Adaptador inferior', new CylinderGeometry(0.43, 0.5, 0.16, 40), silver, [0, -1.2, 0]);

// Each deployed wing is built in local coordinates then tilted as one rigid assembly.
const wingTilt = -0.24;
for (const sign of [-1, 1]) {
  const side = sign < 0 ? 'izquierda' : 'derecha';
  rod(`Brazo ${side}`, [sign * 0.96, 0, 0], [sign * 1.62, 0, 0], 0.075, silver, 16);
  add(`Brazo ${side}`, new CylinderGeometry(0.14, 0.14, 0.24, 20), dark, [sign * 1.12, 0, 0], [0, 0, Math.PI / 2]);
  for (let panel = 0; panel < 3; panel++) {
    const name = `Panel solar ${side} ${panel + 1}`;
    const cx = sign * (2.2 + panel * 1.37);
    const local = (geo, mat, pos) => {
      geo.translate(...pos).rotateX(wingTilt).translate(cx, 0, 0);
      add(name, geo, mat);
    };
    local(new BoxGeometry(1.29, 0.06, 1.75), dark, [0, 0, 0]);
    for (const x of [-0.658, 0.658]) local(new BoxGeometry(0.038, 0.095, 1.83), silver, [x, 0, 0]);
    for (const z of [-0.9, 0.9]) local(new BoxGeometry(1.35, 0.095, 0.035), silver, [0, 0, z]);
    for (let col = 0; col < 8; col++) for (let row = 0; row < 12; row++) {
      const x = (col - 3.5) * 0.153, z = (row - 5.5) * 0.141;
      local(new BoxGeometry(0.145, 0.009, 0.132), blue, [x, 0.038, z]);
    }
    for (let i = 0; i < 8; i++) local(new BoxGeometry(0.006, 0.004, 1.67), busbar, [(i - 3.5) * 0.153, 0.046, 0]);
    for (const z of [-0.63, 0.63]) {
      local(new BoxGeometry(0.18, 0.1, 0.1), silver, [sign * 0.69, 0, z]);
      local(new BoxGeometry(1.24, 0.025, 0.038), silver, [0, -0.05, z]);
    }
  }
}
// Parabolic dish: actual revolved parabola, raised rim, tripod and feed.
add('Soporte de parabola', new CylinderGeometry(0.1, 0.14, 0.5, 24), silver, [0, 1.36, 0]);
const profile = Array.from({ length: 25 }, (_, i) => {
  const r = i / 24 * 0.73;
  return new Vector2(r, r * r * 0.58);
});
add('Reflector parabolico', new LatheGeometry(profile, 64), white, [0, 1.61, 0]);
add('Borde de parabola', new TorusGeometry(0.73, 0.019, 8, 64), silver, [0, 1.919, 0], [Math.PI / 2, 0, 0]);
for (let i = 0; i < 3; i++) {
  const a = i * Math.PI * 2 / 3;
  rod('Tripode de antena', [Math.cos(a) * 0.65, 1.86, Math.sin(a) * 0.65], [0, 2.43, 0], 0.014, silver);
}
add('Alimentador de antena', new CylinderGeometry(0.06, 0.045, 0.17, 16), silver, [0, 2.43, 0]);
for (const x of [-1, 1]) {
  add('Antenas de telemetria', new CylinderGeometry(0.045, 0.06, 0.22, 12), gold, [x, 1.22, -0.48]);
  rod('Antenas de telemetria', [x, 1.3, -0.48], [x * 1.035, 2.57, -0.48], 0.013, silver);
  add('Antenas de telemetria', new SphereGeometry(0.025, 8, 6), dark, [x * 1.035, 2.57, -0.48]);
}

let triangles = 0;
for (const { name, mat, gs } of buckets.values()) {
  const geo = mergeGeometries(gs.map(g => g.index ? g.toNonIndexed() : g));
  geo.deleteAttribute('uv');
  const mesh = new Mesh(geo, mat);
  mesh.name = name;
  root.add(mesh);
  triangles += geo.attributes.position.count / 3;
}
const binary = await new GLTFExporter().parseAsync(root, { binary: true, onlyVisible: true });
mkdirSync('public/models', { recursive: true });
writeFileSync('public/models/satelite.glb', Buffer.from(binary));
console.log(`satelite.glb: ${triangles} triangles, ${root.children.length} meshes, ${binary.byteLength} bytes`);
