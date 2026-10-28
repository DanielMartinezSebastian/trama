/** Check actual rendered flare, narrative poses and mobile/reduced-motion lifecycle. */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";
const origin = process.argv[2] ?? "http://localhost:3020", out = ".refs3d/nadir/destellos/qa";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  for (const file of ["three.js", "clock.js"]) await page.addInitScript({ path: resolve(`scripts/cine/hooks/${file}`) });
  await page.goto(`${origin}/sitios/nadir/descenso`, { waitUntil: "networkidle" });
  await page.locator(".nd-stage.is-ready canvas").waitFor();
  await page.waitForTimeout(800);
  await page.evaluate(async () => { const clock = (window as any).__cineClock; clock.control({ fps: 20 }); await new Promise(r => setTimeout(r, 100)); await clock.step(2); });
  await page.locator("#nd-step-2").evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
  const read = () => page.evaluate(() => {
    const seed = (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla");
    return { ...seed.userData.story, intensity: seed.getObjectByName("luz-interior").intensity, visible: seed.getObjectByName("destello-optico").visible };
  });
  const frames: any[] = [];
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => (window as any).__cineClock.step(8));
    frames.push(await read());
    await page.screenshot({ path: `${out}/pulso-${i}.png` });
  }
  assert.ok(frames.some(f => f.flash > 1 && f.intensity > 100 && f.visible), "strong flash and lens flare render together");
  assert.ok(frames.at(-1).explode > .8, "section holds its own exploded configuration");
  for (let i = 0; i < 8 && (await read()).flash > .001; i++) await page.evaluate(() => (window as any).__cineClock.step(20));
  assert.equal((await read()).visible, false, "flare switches off after the event");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.evaluate(() => (window as any).__cineClock.step(4));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `${out}/movil.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${origin}/sitios/nadir/descenso`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".nd-stage canvas").count(), 0);
  assert.deepEqual(errors, []);
  writeFileSync(`${out}/resultado.json`, JSON.stringify({ frames, errors }, null, 2));
  console.log("Rendered flare >100 intensity, held exploded pose, effect shutdown, mobile and reduced motion verified.");
} finally { await browser.close(); }
