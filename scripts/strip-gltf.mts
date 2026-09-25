/**
 * Aligera un modelo glTF para `RetroModel`: deja solo la geometría (posiciones, normales e índices) y la jerarquía de nodos,
 * quita texturas, imágenes, UV, tangentes, animaciones y pieles, y lo escribe como un único `.glb`. Tras el filtro retro las
 * texturas no se ven, así que el ahorro es gratis (un modelo de 10 MB suele quedar en unos cientos de KB).
 *
 * Uso: `npx tsx scripts/strip-gltf.mts <entrada.glb|.gltf> <salida.glb>` (un `.gltf` puede tener su `.bin` al lado).
 * No descomprime Draco ni meshopt: exporta el original sin compresión.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type Json = Record<string, any>;
const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Uso: npx tsx scripts/strip-gltf.mts <entrada.glb|.gltf> <salida.glb>");
  process.exit(1);
}

function read(file: string): { json: Json; bin: Buffer } {
  const raw = readFileSync(file);
  if (raw.readUInt32LE(0) === 0x46546c67) {
    let off = 12;
    let json: Json = {};
    let bin = Buffer.alloc(0);
    while (off < raw.length) {
      const len = raw.readUInt32LE(off);
      const type = raw.readUInt32LE(off + 4);
      const data = raw.subarray(off + 8, off + 8 + len);
      if (type === 0x4e4f534a) json = JSON.parse(data.toString("utf8"));
      else if (type === 0x004e4942) bin = Buffer.from(data);
      off += 8 + len;
    }
    return { json, bin };
  }
  const json = JSON.parse(raw.toString("utf8"));
  const uri: string = json.buffers?.[0]?.uri ?? "";
  const bin = uri.startsWith("data:") ? Buffer.from(uri.split(",")[1], "base64") : readFileSync(join(dirname(file), decodeURIComponent(uri)));
  if (json.buffers.length > 1) throw new Error("Solo se admite un búfer");
  return { json, bin };
}

const { json, bin } = read(input);
if ((json.extensionsUsed ?? []).some((e: string) => /draco|meshopt/i.test(e))) throw new Error("Modelo comprimido (Draco/meshopt): exporta el original sin compresión");

const accessors: Json[] = [];
const views: Json[] = [];
const chunks: Buffer[] = [];
let size = 0;
const accMap = new Map<number, number>();
const viewMap = new Map<number, number>();

function copyView(i: number) {
  if (viewMap.has(i)) return viewMap.get(i)!;
  const v = json.bufferViews[i];
  const data = bin.subarray(v.byteOffset ?? 0, (v.byteOffset ?? 0) + v.byteLength);
  const pad = (4 - (size % 4)) % 4;
  if (pad) chunks.push(Buffer.alloc(pad));
  size += pad;
  const nv: Json = { buffer: 0, byteOffset: size, byteLength: v.byteLength };
  if (v.byteStride) nv.byteStride = v.byteStride;
  if (v.target) nv.target = v.target;
  chunks.push(Buffer.from(data));
  size += v.byteLength;
  views.push(nv);
  viewMap.set(i, views.length - 1);
  return views.length - 1;
}
function copyAccessor(i: number) {
  if (accMap.has(i)) return accMap.get(i)!;
  const a = { ...json.accessors[i] };
  if (a.sparse) throw new Error("Accesores dispersos (sparse) no soportados");
  a.bufferView = copyView(a.bufferView);
  accessors.push(a);
  accMap.set(i, accessors.length - 1);
  return accessors.length - 1;
}

const meshes = (json.meshes ?? []).map((m: Json) => ({
  name: m.name,
  primitives: m.primitives
    .filter((p: Json) => (p.mode ?? 4) === 4 && p.attributes.POSITION !== undefined)
    .map((p: Json) => {
      const attributes: Json = { POSITION: copyAccessor(p.attributes.POSITION) };
      if (p.attributes.NORMAL !== undefined) attributes.NORMAL = copyAccessor(p.attributes.NORMAL);
      const out: Json = { attributes, material: 0 };
      if (p.indices !== undefined) out.indices = copyAccessor(p.indices);
      return out;
    }),
}));

const nodes = (json.nodes ?? []).map((n: Json) => {
  const { name, children, mesh, matrix, translation, rotation, scale } = n;
  return Object.fromEntries(Object.entries({ name, children, mesh, matrix, translation, rotation, scale }).filter(([, v]) => v !== undefined));
});

const out: Json = {
  asset: { version: "2.0", generator: "trama strip-gltf", copyright: json.asset?.copyright },
  scene: json.scene ?? 0,
  scenes: json.scenes,
  nodes,
  meshes,
  materials: [{ name: "clay", pbrMetallicRoughness: { baseColorFactor: [0.85, 0.85, 0.85, 1], metallicFactor: 0.1, roughnessFactor: 0.6 } }],
  accessors,
  bufferViews: views,
  buffers: [{ byteLength: size }],
};
if (!out.asset.copyright) delete out.asset.copyright;

const pad4 = (b: Buffer, fill: number) => Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4, fill)]);
const j = pad4(Buffer.from(JSON.stringify(out)), 0x20);
const b = pad4(Buffer.concat(chunks), 0);
const head = Buffer.alloc(12);
head.writeUInt32LE(0x46546c67, 0);
head.writeUInt32LE(2, 4);
head.writeUInt32LE(12 + 8 + j.length + 8 + b.length, 8);
const chunk = (len: number, type: number) => {
  const c = Buffer.alloc(8);
  c.writeUInt32LE(len, 0);
  c.writeUInt32LE(type, 4);
  return c;
};
writeFileSync(output, Buffer.concat([head, chunk(j.length, 0x4e4f534a), j, chunk(b.length, 0x004e4942), b]));
const tris = meshes.reduce((n: number, m: Json) => n + m.primitives.reduce((k: number, p: Json) => k + (p.indices !== undefined ? accessors[p.indices].count : accessors[p.attributes.POSITION].count) / 3, 0), 0);
console.log(`${output}: ${(readFileSync(output).length / 1024).toFixed(0)} KB · ${tris} triángulos`);
