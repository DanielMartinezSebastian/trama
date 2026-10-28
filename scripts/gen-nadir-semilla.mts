/** Generate the editable GLB, independent PNG maps, rig manifest and actual-geometry drawings.
 * npx tsx scripts/gen-nadir-semilla.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import * as THREE from "three";
import { Document, NodeIO, type Node as GNode, type Material as GMaterial, type Texture as GTexture } from "@gltf-transform/core";
import { KHRMaterialsTransmission, KHRMaterialsIOR, KHRLightsPunctual, KHRMaterialsEmissiveStrength } from "@gltf-transform/extensions";
import { createSeedArtifact, poseSeed, SEED } from "../components/sites/nadir/seed-model";
import { SEED_MECHANICS } from "../components/sites/nadir/seed-motion";

const out = "public/models/nadir-semilla";
mkdirSync(`${out}/texturas`, { recursive: true });
const seed = createSeedArtifact();
const doc = new Document(), buffer = doc.createBuffer();
const scene = doc.createScene("Semilla / NÁDIR");
const transmission = doc.createExtension(KHRMaterialsTransmission);
const ior = doc.createExtension(KHRMaterialsIOR);
const lights = doc.createExtension(KHRLightsPunctual);
const emissive = doc.createExtension(KHRMaterialsEmissiveStrength);
const nodes = new Map<THREE.Object3D, GNode>(), materials = new Map<THREE.Material, GMaterial>(), textures = new Map<THREE.Texture, GTexture>();
const files: string[] = [];
const slug = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
function crc32(data: Uint8Array) {
  let crc = -1;
  for (const byte of data) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); }
  return (crc ^ -1) >>> 0;
}
function png(data: Uint8Array, width: number, height: number) {
  const chunk = (type: string, bytes: Buffer) => {
    const head = Buffer.alloc(4); head.writeUInt32BE(bytes.length);
    const payload = Buffer.concat([Buffer.from(type), bytes]), tail = Buffer.alloc(4); tail.writeUInt32BE(crc32(payload));
    return Buffer.concat([head, payload, tail]);
  };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) rows.set(data.subarray(y * width * 4, (y + 1) * width * 4), y * (width * 4 + 1) + 1);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header), chunk("IDAT", deflateSync(rows)), chunk("IEND", Buffer.alloc(0))]);
}
function texture(t: THREE.Texture) {
  if (textures.has(t)) return textures.get(t)!;
  const image = t.image as { data: Uint8Array; width: number; height: number };
  const bytes = png(image.data, image.width, image.height), filename = `${slug(t.name)}.png`;
  writeFileSync(`${out}/texturas/${filename}`, bytes); files.push(`texturas/${filename}`);
  const result = doc.createTexture(t.name).setImage(bytes).setMimeType("image/png"); textures.set(t, result); return result;
}
function material(m: THREE.Material) {
  if (materials.has(m)) return materials.get(m)!;
  const source = m as THREE.MeshPhysicalMaterial;
  const result = doc.createMaterial(m.name).setBaseColorFactor([source.color.r, source.color.g, source.color.b, source.opacity]).setMetallicFactor(source.metalness).setRoughnessFactor(source.roughness);
  if (source.map) result.setBaseColorTexture(texture(source.map));
  if (source.roughnessMap) result.setMetallicRoughnessTexture(texture(source.roughnessMap));
  if (source.emissive) result.setEmissiveFactor(source.emissive.clone().multiplyScalar(Math.min(1, source.emissiveIntensity)).toArray() as [number, number, number]);
  if (source.emissiveIntensity > 1) result.setExtension("KHR_materials_emissive_strength", emissive.createEmissiveStrength().setEmissiveStrength(source.emissiveIntensity));
  if (source.transparent) result.setAlphaMode("BLEND");
  if (source.side === THREE.DoubleSide) result.setDoubleSided(true);
  if (source.transmission) {
    result.setExtension("KHR_materials_transmission", transmission.createTransmission().setTransmissionFactor(source.transmission));
    result.setExtension("KHR_materials_ior", ior.createIOR().setIOR(source.ior));
  }
  materials.set(m, result); return result;
}
const geometryCache = new Map<THREE.BufferGeometry, Map<string, ReturnType<Document["createAccessor"]>>>();
function attributes(geo: THREE.BufferGeometry) {
  if (geometryCache.has(geo)) return geometryCache.get(geo)!;
  const result = new Map<string, ReturnType<Document["createAccessor"]>>();
  for (const [name, semantic, type] of [["position", "POSITION", "VEC3"], ["normal", "NORMAL", "VEC3"], ["uv", "TEXCOORD_0", "VEC2"]] as const) {
    const a = geo.getAttribute(name); if (a) result.set(semantic, doc.createAccessor().setType(type).setArray(new Float32Array(a.array)).setBuffer(buffer));
  }
  geometryCache.set(geo, result); return result;
}
function isMesh(object: THREE.Object3D): object is THREE.Mesh { return (object as THREE.Mesh).isMesh === true; }
function exportNode(object: THREE.Object3D): GNode {
  const node = doc.createNode(object.name).setTranslation(object.position.toArray()).setRotation(object.quaternion.toArray()).setScale(object.scale.toArray()).setExtras(object.userData);
  nodes.set(object, node);
  if ((object as THREE.PointLight).isPointLight) {
    const source = object as THREE.PointLight;
    node.setExtension("KHR_lights_punctual", lights.createLight(source.name).setType("point").setColor(source.color.toArray() as [number, number, number]).setIntensity(source.intensity).setRange(source.distance));
  }
  if (isMesh(object)) {
    const geo = object.geometry as THREE.BufferGeometry, attrs = attributes(geo);
    const groups = geo.groups.length ? geo.groups : [{ start: 0, count: geo.index?.count ?? geo.attributes.position.count, materialIndex: 0 }];
    const gm = doc.createMesh(object.name);
    for (const group of groups) {
      const sourceMaterial = Array.isArray(object.material) ? object.material[group.materialIndex ?? 0] : object.material;
      const primitive = doc.createPrimitive().setMaterial(material(sourceMaterial));
      attrs.forEach((a, key) => primitive.setAttribute(key, a));
      const indices = geo.index ? Uint32Array.from(geo.index.array.slice(group.start, group.start + group.count)) : Uint32Array.from({ length: group.count }, (_, i) => group.start + i);
      primitive.setIndices(doc.createAccessor().setType("SCALAR").setArray(indices).setBuffer(buffer)); gm.addPrimitive(primitive);
    }
    node.setMesh(gm);
  }
  object.children.filter(child => !child.userData.previewOnly).forEach(child => node.addChild(exportNode(child))); return node;
}
scene.addChild(exportNode(seed.root));
// Both clips use absolute transforms. They can be scrubbed or reversed in any DCC.
for (const [name, explode] of [["Apertura", false], ["Despiece", true]] as const) {
  const animation = doc.createAnimation(name);
  const times = doc.createAccessor().setType("SCALAR").setArray(Float32Array.from({ length: 121 }, (_, i) => i / 30)).setBuffer(buffer);
  const moving = [...seed.petals, ...seed.collars, seed.spine, seed.core, ...seed.actuators.flatMap(a => [a.barrel, a.rod])];
  const tracks = moving.map(object => ({ object, position: [] as number[], rotation: [] as number[], scale: [] as number[] }));
  for (let i = 0; i < 121; i++) {
    poseSeed(seed, { open: explode ? 1 : i / 120, explode: explode ? i / 120 : 0, twist: 0, pulse: 0, reveal: 0 });
    for (const track of tracks) { track.position.push(...track.object.position.toArray()); track.rotation.push(...track.object.quaternion.toArray()); track.scale.push(...track.object.scale.toArray()); }
  }
  for (const track of tracks) for (const [path, values, type] of [["translation", track.position, "VEC3"], ["rotation", track.rotation, "VEC4"], ["scale", track.scale, "VEC3"]] as const) {
    const sampler = doc.createAnimationSampler().setInput(times).setOutput(doc.createAccessor().setType(type).setArray(new Float32Array(values)).setBuffer(buffer)).setInterpolation("LINEAR");
    animation.addSampler(sampler).addChannel(doc.createAnimationChannel().setSampler(sampler).setTargetNode(nodes.get(track.object)!).setTargetPath(path));
  }
}
await new NodeIO().registerExtensions([KHRMaterialsTransmission, KHRMaterialsIOR, KHRLightsPunctual, KHRMaterialsEmissiveStrength]).write(`${out}/semilla.glb`, doc);

// Engineering drawings: project the same meshes, never hand-invent silhouettes.
function projection(position: THREE.Vector3, target: THREE.Vector3, width: number, height: number, scale: number) {
  const camera = new THREE.OrthographicCamera(-width / scale / 2, width / scale / 2, height / scale / 2, -height / scale / 2, .1, 100);
  camera.position.copy(position); camera.lookAt(target); camera.updateMatrixWorld(); return camera;
}
function draw(camera: THREE.Camera, cx: number, cy: number, w: number, h: number) {
  seed.root.updateMatrixWorld(true);
  const faces: { depth: number; points: string; color: string }[] = [];
  const v = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  seed.root.traverse(object => {
    if (!isMesh(object) || /nervaduras|memoria-\d|filamentos|junta-luminosa|incrustacion|terminal/.test(object.name)) return;
    const geo = object.geometry, p = geo.attributes.position;
    for (const group of geo.groups.length ? geo.groups : [{ start: 0, count: geo.index?.count ?? p.count, materialIndex: 0 }]) {
      const mat = (Array.isArray(object.material) ? object.material[group.materialIndex ?? 0] : object.material) as THREE.MeshStandardMaterial;
      const color = /mineral/.test(mat.name) ? "#29434a" : /interior|nervios|cobre/.test(mat.name) ? "#bc9271" : /Agua/.test(mat.name) ? "#b3ddd2" : "#8a9e9c";
      for (let i = group.start; i < group.start + group.count; i += 3) {
        const vertices = [a, b, c];
        for (let k = 0; k < 3; k++) vertices[k].fromBufferAttribute(p, geo.index ? geo.index.getX(i + k) : i + k).applyMatrix4(object.matrixWorld);
        const normal = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));
        if (normal.dot(camera.position.clone().sub(a)) < 0) continue;
        let depth = 0;
        const points = vertices.map(point => { v.copy(point).project(camera); depth += v.z; return `${(cx + v.x * w / 2).toFixed(1)},${(cy - v.y * h / 2).toFixed(1)}`; }).join(" ");
        faces.push({ depth, points, color });
      }
    }
  });
  faces.sort((a, b) => b.depth - a.depth);
  return faces.map(f => `<polygon points="${f.points}" fill="${f.color}" stroke="${f.color}" stroke-width=".22"/>`).join("");
}
const text = (x: number, y: number, content: string, size = 13) => `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="#263c43">${content}</text>`;
const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100"><rect width="1600" height="1100" fill="#f6f3ec"/>${body}</svg>`;
poseSeed(seed, { open: 0, explode: 0, twist: 0, pulse: 0, reveal: 0 });
let sheet = text(55, 48, "NÁDIR / SEMILLA — 01 · VISTAS ORTOGRÁFICAS", 25) + text(55, 76, "Geometría real · unidades de escena en metros · Y vertical · frontal +Z · cota de diseño, no fabricación");
const views: [string, number, number, THREE.Vector3][] = [["FRONTAL +Z", 410, 330, new THREE.Vector3(0, 0, 14)], ["LATERAL +X", 1170, 330, new THREE.Vector3(14, 0, 0)], ["POSTERIOR −Z", 410, 820, new THREE.Vector3(0, 0, -14)], ["SUPERIOR +Y", 1170, 820, new THREE.Vector3(0, 14, 0)]];
for (const [title, x, y, pos] of views) {
  const cam = projection(pos, new THREE.Vector3(), 600, 440, 67);
  sheet += `<path d="M${x - 240} ${y}H${x + 240}M${x} ${y - 200}V${y + 200}" stroke="#c2c5bd" stroke-dasharray="4 6"/>`;
  sheet += draw(cam, x, y, 600, 440) + text(x - 125, y + 218, title);
}
sheet += text(60, 150, "Altura 5,40 m") + text(60, 172, "Ø casco máx. ≈ 2,55 m") + text(60, 194, "Ø collar exterior 3,10 m") + text(60, 216, "Espesor de valva 0,095 m");
writeFileSync(`${out}/01-ortograficas.svg`, svg(sheet));
poseSeed(seed, { open: 1, explode: 1, twist: 0, pulse: 0, reveal: 0 });
const camera = projection(new THREE.Vector3(9, 5, 13), new THREE.Vector3(0, -.2, 0), 1100, 850, 94);
let exploded = text(55, 48, "NÁDIR / SEMILLA — 02 · DESPIECE Y PIVOTES", 25) + text(55, 76, "Las piezas se exportan por separado y las nervaduras acompañan a cada valva.");
exploded += draw(camera, 665, 575, 1100, 850);
const labels = ["A · 6 valvas macizas / mineral exterior", "B · 6 interiores de cobre / UV propios", "C · Nervios y juntas / hijos de cada valva", "D · Collar: bajar 3,08 m antes de abrir", "E · Bastidor, bisagras y 6 actuadores", "F · Ampolla / luz interior con sombras", "G · Filamentos y memorias luminosas", "Bisagras: Y −2,75 / radio 0,32 m", "Eje local X · tope de giro 51,6°", "Extraer 0,30 m antes de girar"];
labels.forEach((label, i) => { exploded += text(1160, 220 + i * 37, label, 14); });
writeFileSync(`${out}/02-despiece.svg`, svg(exploded));
let phases = text(55, 48, "NÁDIR / SEMILLA — 03 · APERTURA Y SUPERFICIES", 25);
for (let i = 0; i < 3; i++) {
  poseSeed(seed, { open: i / 2, explode: 0, twist: 0, pulse: 0, reveal: 0 });
  phases += draw(projection(new THREE.Vector3(5, 2, 14), new THREE.Vector3(0, -.2, 0), 480, 650, 64), 290 + i * 510, 440, 480, 650);
  phases += text(130 + i * 510, 810, ["01 SEÑAL · protegida", "02 DESCENSO · apertura", "03 HALLAZGO · memoria"][i], 19);
}
phases += text(65, 910, "Mineral: 6 mapas color y 6 mapas de superficie independientes. Cobre: 6 mapas propios para las caras interiores.", 17);
phases += text(65, 945, "Superficie PNG: R relieve · G rugosidad · B metalicidad. Color sRGB; superficie lineal. UV 0–1 por pieza.", 17);
phases += text(65, 980, "Orden reversible: liberar collar → extraer valvas → girar. Tres rangos por capítulo y pausas abiertas de 6 s.", 17);
writeFileSync(`${out}/03-apertura.svg`, svg(phases));
writeFileSync(`${out}/manifest.json`, JSON.stringify({ name: "Semilla", version: 2, units: "metres", dimensions: SEED, mechanics: SEED_MECHANICS, source: "components/sites/nadir/seed-model.ts", coordinates: { up: "+Y", front: "+Z" }, animations: ["Apertura", "Despiece"], textures: files, parts: seed.root.children.map(p => ({ name: p.name, ...p.userData })), maps: { color: "sRGB RGBA", surface: "linear; R height, G roughness, B metallic" }, note: "Kinematic clearances, 30 fps sampled clips, telescopic actuators, interior punctual light and emissive strength. Bump maps supplied separately; additive halo and dynamic shadow settings are live-scene features." }, null, 2));
console.log(JSON.stringify({ output: out, nodes: nodes.size, materials: materials.size, textures: textures.size, clips: 2, drawings: 3 }, null, 2));
seed.dispose();
