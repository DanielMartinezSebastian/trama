/** Reading plans / macro core / central interlude, inspired by Quilate. */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";
import { seedFraming } from "../../components/sites/nadir/seed-framing";

assert.ok(seedFraming(1, 2 / 3, false).detail > .99);
assert.ok(seedFraming(1, .5, false).interlude > .99);
assert.ok(seedFraming(0, 1 / 3, false).detail < .01);
const out = ".refs3d/nadir/escala/qa"; mkdirSync(out, { recursive: true });
const origin = process.argv[2] ?? "http://localhost:3020";
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [], shots: any[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.addInitScript({ path: resolve("scripts/cine/hooks/three.js") });
  const measure = () => page.evaluate(() => {
    const state = (window as any).__cine.state, seed = state.lastScene.getObjectByName("nadir-semilla"), core = seed.getObjectByName("ampolla-agua");
    const p = core.geometry.attributes.position, v = core.position.clone();
    const b = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(core.matrixWorld).project(state.lastCamera);
      b.minX = Math.min(b.minX, v.x); b.maxX = Math.max(b.maxX, v.x); b.minY = Math.min(b.minY, v.y); b.maxY = Math.max(b.maxY, v.y);
    }
    return { framing: seed.userData.framing, core: b, mask: getComputedStyle(document.querySelector(".nd-stage canvas")!).maskImage };
  });
  await page.goto(`${origin}/sitios/nadir/descenso`, { waitUntil: "networkidle" });
  await page.locator(".nd-stage.is-ready canvas").waitFor();
  for (const [selector, name] of [["#nd-step-1", "general"], ["#nd-step-2", "macro"]]) {
    await page.locator(selector).evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(1800); shots.push({ name, ...await measure() });
    await page.screenshot({ path: `${out}/${name}.png` });
  }
  assert.ok(shots[1].framing.scale > shots[0].framing.scale * 1.65, "macro materially increases object scale");
  assert.ok(shots[1].core.maxY - shots[1].core.minY > .85, "core occupies more than 42.5% of viewport height");
  assert.ok(shots[1].core.minX > -1 && shots[1].core.maxX < 0, "macro stays on the object side of the reading spread");
  assert.notEqual(shots[1].mask, "none");
  await page.evaluate(() => {
    const a = document.getElementById("nd-step-1")!.getBoundingClientRect(), b = document.getElementById("nd-step-2")!.getBoundingClientRect();
    scrollTo(0, scrollY + (a.top + a.height / 2 + b.top + b.height / 2) / 2 - innerHeight / 2);
  });
  await page.waitForTimeout(1800); const center = await measure(); shots.push({ name: "interlude", ...center });
  assert.ok(center.framing.interlude > .9 && Math.abs(center.framing.x) < .05, "interlude occupies the center instead of switching sides");
  await page.screenshot({ path: `${out}/interludio.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#nd-step-2").evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(1800); const mobile = await measure(); shots.push({ name: "mobile", ...mobile });
  assert.ok(mobile.core.minX > -1 && mobile.core.maxX < 1);
  assert.ok(mobile.core.maxY - mobile.core.minY > .25, "mobile keeps a readable core close-up");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `${out}/movil.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${origin}/sitios/nadir/descenso`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".nd-stage canvas").count(), 0);
  assert.deepEqual(errors, []);
  writeFileSync(`${out}/resultado.json`, JSON.stringify({ shots, errors }, null, 2));
  console.log("Larger general shots, core macro, central interlude, protected reading column, mobile and reduced motion verified.");
} finally { await browser.close(); }
