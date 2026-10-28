/** Acceptance: the seed opens during chapter two without replacing the canvas. */
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";
import { mkdirSync } from "node:fs";

const origin = process.argv[2] ?? "http://localhost:3020";
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.addInitScript({ path: resolve("scripts/cine/hooks/three.js") });
  await page.addInitScript({ path: resolve("scripts/cine/hooks/clock.js") });
  await page.goto(`${origin}/sitios/nadir`, { waitUntil: "networkidle" });
  await page.locator(".nd-stage.is-ready canvas").waitFor();
  const canvas = await page.locator(".nd-stage canvas").elementHandle();
  const opening = () => page.evaluate(() => (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla").userData.pose.open);
  assert.ok(await opening() >= .14 && await opening() <= .43, "first chapter opening band");
  await page.getByRole("link", { name: "02 El descenso" }).click();
  await page.waitForURL("**/sitios/nadir/descenso");
  await page.locator("#nd-step-2").evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForFunction(() => (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla")?.userData.pose.open > .66);
  assert.ok(await opening() < .84, "second chapter keeps room for the final opening");
  assert.ok(await canvas!.evaluate(el => el.isConnected), "same canvas throughout transition");
  const parts = await page.evaluate(() => {
    const seed = (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla");
    return { shells: seed.children.filter((p: any) => p.name.startsWith("valva-")).length, core: !!seed.getObjectByName("ampolla-agua"), ribs: !!seed.getObjectByName("valva-1-nervaduras") };
  });
  assert.deepEqual(parts, { shells: 6, core: true, ribs: true });
  await page.getByRole("link", { name: "03 El hallazgo" }).click();
  await page.waitForURL("**/sitios/nadir/hallazgo");
  await page.waitForFunction(() => (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla")?.userData.pose.open > .91);
  await page.goBack();
  await page.waitForURL("**/sitios/nadir/descenso");
  await page.goBack();
  await page.waitForURL("**/sitios/nadir");
  await page.waitForFunction(() => (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla")?.userData.pose.open < .44);
  await page.goto(`${origin}/sitios/nadir/descenso`, { waitUntil: "networkidle" });
  await page.locator(".nd-stage.is-ready canvas").waitFor();
  await page.locator("#nd-step-2").evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForFunction(() => (window as any).__cine.state.lastScene.getObjectByName("nadir-semilla")?.userData.pose.open > .66);
  await page.evaluate(async () => {
    const w = window as any; w.__cineClock.control({ fps: 20 });
    await new Promise(r => setTimeout(r, 100));
    const seed = w.__cine.state.lastScene.getObjectByName("nadir-semilla");
    const time = seed.userData.motionTime;
    let target = Math.floor(time / 26) * 26 + 10;
    if (target < time) target += 26;
    await w.__cineClock.step(Math.ceil((target - time) * 20));
  });
  const held = await opening();
  await page.evaluate(async () => (window as any).__cineClock.step(40));
  assert.ok(Math.abs(await opening() - held) < .001, "open dwell holds the same hinge pose");
  const lighting = await page.evaluate(() => {
    const light = (window as any).__cine.state.lastScene.getObjectByName("luz-interior");
    return { intensity: light.intensity, shadow: light.castShadow, halo: !!light.parent.getObjectByName("halo-interior") };
  });
  assert.ok(lighting.intensity > 10 && lighting.shadow && lighting.halo, "interior illuminates other parts with shadows and local glow");
  mkdirSync(".refs3d/nadir/mecanica", { recursive: true });
  await page.screenshot({ path: ".refs3d/nadir/mecanica/pausa-abierta.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${origin}/sitios/nadir`, { waitUntil: "networkidle" });
  const closed = await page.locator(".nd-fallback").innerHTML();
  await page.getByRole("link", { name: "02 El descenso" }).click();
  await page.waitForURL("**/sitios/nadir/descenso");
  assert.notEqual(await page.locator(".nd-fallback").innerHTML(), closed, "static illustration updates on chapter navigation");
  assert.equal(await page.locator(".nd-stage canvas").count(), 0);
  assert.deepEqual(errors, []);
  console.log("Progressive opening on all three routes, open dwell, interior light and shadows, persistent canvas, reverse navigation and static fallback verified.");
} finally { await browser.close(); }
