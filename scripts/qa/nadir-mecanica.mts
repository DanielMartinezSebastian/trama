/** Swept mechanical envelopes, chapter ordering and dwell regression. No browser needed. */
import assert from "node:assert/strict";
import * as THREE from "three";
import { createSeedArtifact, poseSeed } from "../../components/sites/nadir/seed-model";
import { seedMechanism, seedOpening, seedDwell, SEED_MECHANICS } from "../../components/sites/nadir/seed-motion";

const seed = createSeedArtifact(), point = new THREE.Vector3();
const samples: { name: string; point: THREE.Vector3 }[] = [];
seed.root.updateMatrixWorld(true);
const pivot = seed.petals[0];
// Cache every vertex in the moving pivot's local space (outer, inner, ribs, hinge, seam).
const inverse = pivot.matrixWorld.clone().invert();
pivot.traverse(object => {
  if (!(object as THREE.Mesh).isMesh) return;
  const mesh = object as THREE.Mesh, positions = mesh.geometry.attributes.position;
  const matrix = new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld);
  for (let i = 0; i < positions.count; i++) samples.push({ name: mesh.name, point: new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(matrix) });
});
let minAngularGap = Infinity, minCollarGap = Infinity, minCapGap = Infinity, maxStroke = 0;
const capA = new THREE.Vector3(), capB = new THREE.Vector3();
for (let o = 0; o <= 80; o++) for (const explode of [0, .25, .65, 1]) {
  const open = o / 80;
  poseSeed(seed, { open, explode, twist: 4, pulse: 0, reveal: 0 });
  seed.root.updateMatrixWorld(true);
  const mechanism = seedMechanism(open, explode);
  for (let i = 0; i < seed.collars.length; i++) {
    const caps = seed.collars[i].children.filter(p => p.name.endsWith("terminal"));
    const next = seed.collars[(i + 1) % seed.collars.length].children.filter(p => p.name.endsWith("terminal"));
    for (const a of caps) for (const b of next) {
      a.getWorldPosition(capA); b.getWorldPosition(capB);
      const gap = capA.distanceTo(capB) - .124; minCapGap = Math.min(minCapGap, gap);
      assert.ok(gap > .025, "rounded collar terminals never overlap neighbouring segments");
    }
  }
  if (mechanism.hinge > 0) {
    assert.equal(mechanism.unlock, 1, "collar fully parked before shell rotation");
    assert.ok(mechanism.radial >= SEED_MECHANICS.extraction - 1e-9, "shell extracted before rotating");
  }
  const matrix = pivot.matrixWorld;
  const ringRadius = 1.49 + mechanism.unlock * .1 + explode * .7;
  for (const sample of samples) {
    point.copy(sample.point).applyMatrix4(matrix).applyAxisAngle(THREE.Object3D.DEFAULT_UP, -SEED_MECHANICS.azimuth);
    const gap = Math.PI / 6 - Math.abs(Math.atan2(point.x, point.z));
    minAngularGap = Math.min(minAngularGap, gap);
    const coreEnvelope = .64 * Math.sqrt(Math.max(0, 1 - ((point.y - .17) / 1.55) ** 2));
    if (coreEnvelope > 0) assert.ok(Math.hypot(point.x, point.z) * Math.cos(Math.PI / 6) > coreEnvelope + .025, "shells and ribs remain outside the tapered core's swept envelope");
    // Each complete shell stays in its own disjoint 60° sector, so shells cannot intersect.
    assert.ok(gap > 0, `neighbouring part envelope: ${sample.name}, open=${open}, split=${explode}, gap=${gap}`);
    if (Math.abs(point.y - mechanism.collarY) < .14) {
      const clearance = Math.abs(Math.hypot(point.x, point.z) - ringRadius) - .08;
      minCollarGap = Math.min(minCollarGap, clearance);
      assert.ok(clearance > .025, `collar clearance at open=${open}`);
    }
  }
  assert.ok(seed.actuators.every(a => a.length > .2 && a.length < 1.9), "pistons stay within finite stroke limits");
  for (const a of seed.actuators) for (const part of [a.barrel, a.rod]) {
    const vertices = part.geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      point.fromBufferAttribute(vertices, i).applyMatrix4(part.matrixWorld);
      assert.ok(point.y < -2.67, "actuators move below the shell instead of piercing it");
    }
  }
  maxStroke = Math.max(maxStroke, ...seed.actuators.map(a => a.length));
}
for (let t = 0; t < 104; t += .13) for (const progress of [0, .3, .7, 1]) {
  const stages = [0, 1, 2].map(c => seedOpening(c, progress, t));
  assert.ok(stages[0] < stages[1] && stages[1] < stages[2]);
  for (let c = 0; c < 3; c++) assert.ok(stages[c] >= SEED_MECHANICS.bands[c][0] - 1e-9 && stages[c] <= SEED_MECHANICS.bands[c][1] + 1e-9);
}
assert.equal(seedDwell(9), 1); assert.equal(seedDwell(12), 1); assert.equal(seedDwell(15), 1);
assert.equal(seedOpening(1, .4, 10), seedOpening(1, .4, 14), "open pose held motionless for six seconds");
assert.equal(seedDwell(0), 0); assert.equal(seedDwell(26), 0);
const start = seedMechanism(0, 0), end = seedMechanism(1, 1);
assert.equal(start.hinge, 0); assert.equal(end.hinge, SEED_MECHANICS.maxAngle);
assert.ok(seed.emitter.castShadow && seed.emitter.intensity > 4, "interior has a real light with occlusion");
seed.dispose();
console.log(JSON.stringify({ states: 324, minimumSectorGapDegrees: minAngularGap * 180 / Math.PI, minimumCollarClearance: minCollarGap, minimumTerminalGap: minCapGap, maximumActuatorLength: maxStroke, dwellSeconds: 6, chapterBands: SEED_MECHANICS.bands }, null, 2));
