/** Recorrido real de Voz de la Tierra, con medios locales y escenas persistentes. */
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const origin = process.argv[2] ?? "http://localhost:3007";
const out = resolve(".refs3d/voz/qa");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
const checks: string[] = [], errors: string[] = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.addInitScript({ path: resolve("scripts/cine/hooks/three.js") });
  const pose = () => page.evaluate(() => {
    const state = (window as any).__cine.state;
    const object = state.lastScene.getObjectByName("voyager-record");
    return object.children.map((mesh: any) => mesh.position.toArray());
  });
  const framing = async () => {
    const bounds = await page.evaluate(() => {
      const state = (window as any).__cine.state, bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
      state.lastScene.getObjectByName("voyager-record").traverse((mesh: any) => {
        if (!mesh.isMesh) return;
        const positions = mesh.geometry.attributes.position, vertex = mesh.position.clone();
        for (let i = 0; i < positions.count; i++) {
          vertex.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld).project(state.lastCamera);
          bounds.minX = Math.min(bounds.minX, vertex.x); bounds.maxX = Math.max(bounds.maxX, vertex.x);
          bounds.minY = Math.min(bounds.minY, vertex.y); bounds.maxY = Math.max(bounds.maxY, vertex.y);
        }
      });
      return bounds;
    });
    assert.ok(bounds.minX > -1 && bounds.maxX < 1 && bounds.minY > -1 && bounds.maxY < 1, `disco y cubierta completos: ${JSON.stringify(bounds)}`);
  };
  await page.goto(`${origin}/sitios/voz-de-la-tierra`, { waitUntil: "networkidle" });
  await page.locator(".vd-record.is-ready canvas").waitFor({ timeout: 45000 });
  await page.locator(".ui-pre").waitFor({ state: "hidden", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const canvas = await page.locator(".vd-record canvas").elementHandle();
  await page.getByRole("button", { name: "La cubierta", exact: false }).click();
  await page.waitForTimeout(160);
  const middle = await pose();
  assert.ok(Math.abs(middle[0][2] - middle[1][2]) > .45, "disco y cubierta mantienen profundidad libre durante la apertura");
  await page.screenshot({ path: resolve(out, "01b-apertura.png") });
  await page.waitForTimeout(1500);
  const after = await pose();
  assert.ok(Math.hypot(after[0][0] - after[1][0], after[0][1] - after[1][1]) > 2.7, "disco y cubierta terminan separados en el plano de inspección");
  assert.ok(Math.abs(after[0][2] - after[1][2]) > .45, "disco y cubierta conservan profundidad para no tocarse");
  await framing();
  await page.screenshot({ path: resolve(out, "01-cubierta.png") });
  await page.getByRole("button", { name: "El disco", exact: false }).click();
  await page.waitForTimeout(1000);
  await framing();
  checks.push("inspección del disco y la cubierta sin recortes");

  const video = page.locator(".vd-film video");
  await page.locator(".vd-film").scrollIntoViewIfNeeded();
  await page.locator(".vd-film").getByRole("button", { name: /^Reproducir:/ }).click();
  await page.waitForFunction(() => { const v = document.querySelector(".vd-film video") as HTMLVideoElement; return !v.paused && v.currentTime > .2 && v.videoWidth === 1280; });
  assert.ok((await video.evaluate((v: HTMLVideoElement) => v.duration)) >= 9);
  await page.screenshot({ path: resolve(out, "02-pelicula.png") });
  await page.locator(".vd-film").getByRole("button", { name: "Pausar", exact: true }).click();
  checks.push("película local reproducible con controles y sin autoplay");

  await page.locator(".vd-index__list a").first().click();
  await page.waitForURL("**/surcos");
  await page.getByRole("heading", { level: 1, name: "Surcos" }).waitFor();
  assert.ok(await canvas?.evaluate((el) => el.isConnected), "canvas persistente al navegar");
  await page.locator(".vd-audio").getByRole("button", { name: "Reproducir", exact: true }).click();
  await page.locator(".vd-audio.is-playing").waitFor();
  await page.waitForTimeout(1300);
  assert.ok(await page.locator(".vd-audio").getByRole("slider", { name: "Posición" }).evaluate((el) => Number((el as HTMLInputElement).value)) > 0);
  await page.locator(".vd-audio").getByRole("button", { name: "Pausa", exact: true }).click();
  await framing();
  await page.screenshot({ path: resolve(out, "03-surcos.png") });
  checks.push("saludos originales reproducibles y canvas persistente entre capítulos");

  await page.locator(".vd-next").click();
  await page.waitForURL("**/viaje");
  await page.waitForTimeout(1200);
  await framing();
  assert.ok(await page.locator(".vd-archive--pale img").evaluate((el: HTMLImageElement) => el.naturalWidth === 453), "archivo histórico sin ampliar la resolución");
  await page.locator(".vd-archive--pale").scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(out, "04-pale-blue-dot.png") });
  checks.push("viaje, fotografía histórica y cuenta atrás accesibles");

  await page.locator(".vd-next").click();
  await page.waitForURL("**/mensaje");
  const field = page.getByRole("textbox", { name: "Tu frase" });
  const message = "Seguimos escuchando. Saludos desde la Tierra.";
  await field.fill(message);
  await page.getByRole("button", { name: "Ponerla en el disco", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "Tu frase está guardada" }).waitFor();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar mi frase" }).click();
  const download = await pending;
  await download.saveAs(resolve(out, download.suggestedFilename()));
  assert.match(readFileSync(resolve(out, download.suggestedFilename()), "utf8"), /Seguimos escuchando/);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText(`«${message}»`, { exact: true }).waitFor();
  await page.getByRole("button", { name: "Escribir otra" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await field.waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem("voz-de-la-tierra-surco")), null);
  await page.locator(".vd-colophon").scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(out, "07-footer.png") });
  checks.push("mensaje guardado, restaurado, descargado y borrado realmente");

  for (const width of [320, 390, 768, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["", "/surcos", "/viaje", "/mensaje"]) {
      await page.goto(`${origin}/sitios/voz-de-la-tierra${route}`, { waitUntil: "networkidle" });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}${route}: sin overflow`);
    }
  }
  checks.push("cuatro rutas sin desbordamiento a 320, 390, 768 y 1920 px");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/sitios/voz-de-la-tierra`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(out, "05-movil.png") });
  await page.getByRole("button", { name: "La cubierta", exact: false }).click();
  await page.waitForTimeout(1500);
  await framing();
  await page.screenshot({ path: resolve(out, "06-cubierta-movil.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".vd-record canvas").count(), 0);
  assert.ok(await page.locator(".vd-record__flat img").isVisible());
  checks.push("movimiento reducido con archivo estático visible");

  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallback.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl")) return null;
      return getContext.apply(this, [type, ...args] as Parameters<typeof getContext>);
    } as typeof getContext;
  });
  await fallback.goto(`${origin}/sitios/voz-de-la-tierra`, { waitUntil: "networkidle" });
  assert.equal(await fallback.locator(".vd-record canvas").count(), 0);
  assert.ok(await fallback.locator(".vd-record__flat img").isVisible());
  await fallback.goto(`${origin}/sitios/voz-de-la-tierra/mensaje`, { waitUntil: "networkidle" });
  await fallback.evaluate(() => localStorage.setItem("voz-de-la-tierra-surco", '{"text":123}'));
  await fallback.reload({ waitUntil: "networkidle" });
  await fallback.getByRole("textbox", { name: "Tu frase" }).waitFor();
  await fallback.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Bloqueado", "SecurityError"); }; });
  await fallback.getByRole("textbox", { name: "Tu frase" }).fill("Un saludo que puedes descargar.");
  await fallback.getByRole("button", { name: "Ponerla en el disco" }).click();
  await fallback.getByRole("status").filter({ hasText: "No se pudo guardar" }).waitFor();
  await fallback.getByRole("button", { name: "Descargar mi frase" }).waitFor();
  await fallback.close();
  checks.push("sin WebGL, datos locales inválidos y almacenamiento bloqueado resueltos");
  assert.deepEqual(errors, []);
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify({ checks, errors }, null, 2));
  console.log(JSON.stringify({ checks, errors, out }, null, 2));
} finally { await browser.close(); }
