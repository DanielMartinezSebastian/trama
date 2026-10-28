/** Geometry/rig/export regression. Run after gen-nadir-semilla.mts. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { KHRMaterialsTransmission, KHRMaterialsIOR, KHRLightsPunctual, KHRMaterialsEmissiveStrength } from "@gltf-transform/extensions";
import { createSeedArtifact, poseSeed, seedShellGeometry } from "../../components/sites/nadir/seed-model";

const shell = seedShellGeometry(), p = shell.attributes.position;
assert.equal(shell.groups.length, 3, "outer, inner and thickness faces have separate material slots");
assert.ok(shell.attributes.uv.count === p.count, "every vertex has UV coordinates");
const edges = new Map<string, number>();
let volume = 0;
const key = (i: number) => [p.getX(i), p.getY(i), p.getZ(i)].map(n => n.toFixed(6)).join(",");
for (let i = 0; i < shell.index!.count; i += 3) {
  const [a, b, c] = [0, 1, 2].map(k => shell.index!.getX(i + k));
  for (const [x, y] of [[a, b], [b, c], [c, a]]) { const edge = [key(x), key(y)].sort().join("|"); edges.set(edge, (edges.get(edge) ?? 0) + 1); }
  volume += (p.getX(a) * (p.getY(b) * p.getZ(c) - p.getZ(b) * p.getY(c)) + p.getY(a) * (p.getZ(b) * p.getX(c) - p.getX(b) * p.getZ(c)) + p.getZ(a) * (p.getX(b) * p.getY(c) - p.getY(b) * p.getX(c))) / 6;
}
assert.ok([...edges.values()].every(count => count === 2), "shell is manifold and watertight including all cuts");
assert.ok(volume > .01, "closed shell normals face outward");
for (const attribute of Object.values(shell.attributes)) assert.ok(Array.from(attribute.array).every(Number.isFinite));
shell.dispose();
const seed = createSeedArtifact();
assert.equal(seed.petals.length, 6); assert.equal(seed.collars.length, 12);
const closed = seed.petals.map(p => [...p.position.toArray(), ...p.quaternion.toArray()]);
poseSeed(seed, { open: 1, explode: 0, twist: 0, pulse: 0, reveal: 0 });
assert.ok(seed.petals.every((p, i) => Math.hypot(...p.quaternion.toArray().map((v, k) => v - closed[i][3 + k])) > .2), "every shell opens about its own pivot");
const opened = seed.petals.map(p => p.position.clone());
poseSeed(seed, { open: 1, explode: 1, twist: 2, pulse: 1, reveal: 1 });
assert.ok(seed.petals.every((p, i) => p.position.distanceTo(opened[i]) > .8), "explosion is independent of opening");
poseSeed(seed, { open: 0, explode: 0, twist: 0, pulse: 0, reveal: 0 });
assert.deepEqual(seed.petals.map(p => [...p.position.toArray(), ...p.quaternion.toArray()]), closed, "reverse animation restores all transforms exactly");
const exterior = seed.petals.map(p => (p.children[0].children[0] as any).material[0].map.image.data);
assert.ok(exterior.every((data, i) => i === 0 || Buffer.compare(Buffer.from(data), Buffer.from(exterior[0])) !== 0), "shells have independently seeded textures");
const glb = await new NodeIO().registerExtensions([KHRMaterialsTransmission, KHRMaterialsIOR, KHRLightsPunctual, KHRMaterialsEmissiveStrength]).read("public/models/nadir-semilla/semilla.glb");
assert.ok(glb.getRoot().listMeshes().length > 70, "GLB contains geometry, not an empty rig");
assert.equal(glb.getRoot().listTextures().length, 28);
assert.deepEqual(glb.getRoot().listAnimations().map(a => a.getName()), ["Apertura", "Despiece"]);
for (const a of glb.getRoot().listAnimations()) assert.equal(a.listChannels().length, 96, "all movable parts have translation, rotation and scale tracks");
assert.ok(glb.getRoot().listNodes().some(n => n.getExtension("KHR_lights_punctual")), "GLB preserves the interior punctual light");
const manifest = JSON.parse(readFileSync("public/models/nadir-semilla/manifest.json", "utf8"));
assert.equal(manifest.textures.length, 28);
assert.ok(glb.getRoot().listNodes().some(n => n.getName() === "valva-01-pivote"));
seed.dispose();
console.log("Semilla: watertight shells, UVs, individual maps, independent reversible rig, populated GLB and both animation clips verified.");
