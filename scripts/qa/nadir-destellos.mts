/** Narrative poses and optical pulse regression. */
import assert from "node:assert/strict";
import { seedStory, seedFlash, seedSignalFlash } from "../../components/sites/nadir/seed-motion";
import { createSeedArtifact, poseSeed } from "../../components/sites/nadir/seed-model";
import { createSeedOptics } from "../../components/sites/nadir/seed-optics";

for (let chapter = 0; chapter < 3; chapter++) {
  const held = [0, 1 / 3, 2 / 3, 1].map(p => seedStory(chapter, p));
  assert.ok(Math.max(...held.map(p => p.explode)) - Math.min(...held.map(p => p.explode)) > .3, "sections retain visibly different assembly states");
  assert.ok(new Set(held.map(p => p.energy)).size >= 3, "each chapter has distinct energy states");
  for (let p = 0; p <= 1; p += .005) {
    const story = seedStory(chapter, p);
    assert.ok(story.explode >= 0 && story.explode <= 1 && story.reveal >= 0 && story.reveal <= 1);
    assert.ok(Object.values(story).every(Number.isFinite));
  }
}
assert.equal(seedFlash(-1), 0); assert.equal(seedFlash(.4), 1); assert.equal(seedFlash(3), 0);
assert.equal(seedSignalFlash(0), 0); assert.ok(seedSignalFlash(5.4) > .99); assert.equal(seedSignalFlash(10), 0);
const seed = createSeedArtifact();
const pose = { open: .7, explode: .82, twist: 0, pulse: 0, reveal: .5, energy: 1.1 };
poseSeed(seed, pose); const baseline = seed.emitter.intensity;
poseSeed(seed, { ...pose, flash: 1.13 });
assert.ok(seed.emitter.intensity > baseline * 4 && seed.emitter.intensity > 100, "interior burst is materially stronger than the held light");
assert.ok(seed.filament.emissiveIntensity > 25);
const optics = createSeedOptics();
optics.update(0, 1440, 1000, 1); assert.equal(optics.flare.visible, false);
optics.update(1.13, 1440, 1000, 1); assert.equal(optics.flare.visible, true);
optics.update(0, 390, 844, 1); assert.equal(optics.flare.visible, false, "flare disappears completely between pulses");
optics.dispose(); seed.dispose();
console.log("Distinct held poses, bounded mechanical controls, non-strobing pulses, >100-unit emission and optical lifecycle verified.");
