/** Prueba real de los tres capítulos: npm exec -- tsx scripts/qa/nadir.mts http://localhost:3006 */
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const origin = process.argv[2] ?? "http://localhost:3006";
const out = resolve(process.argv[3] ?? ".refs3d/nadir/qa");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--ignore-gpu-blocklist"] });
const checks: string[] = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const response = await page.goto(`${origin}/sitios/nadir`, { waitUntil: "networkidle", timeout: 120000 });
  assert.equal(response?.status(), 200);
  await page.locator(".nd-stage.is-ready canvas").waitFor({ timeout: 45000 });
  await page.waitForTimeout(1800);
  assert.equal(await page.locator("h1").innerText(), "NÁDIR");
  const canvas = await page.locator(".nd-stage canvas").elementHandle();
  await page.screenshot({ path: resolve(out, "01-senal.png") });
  await page.getByRole("button", { name: "Activar sonido ambiental" }).click();
  await page.getByRole("button", { name: "Desactivar sonido ambiental" }).waitFor();
  await page.getByRole("button", { name: "Desactivar sonido ambiental" }).click();
  checks.push("audio ambiental activado y desactivado");
  await page.locator(".nd-enter").click();
  await page.waitForTimeout(1600);
  assert.ok(await page.evaluate(() => scrollY > 300));
  await page.locator("#nd-step-2").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  assert.notEqual(await page.locator(".nd-readout > span:last-child").innerText(), "000%");
  await page.screenshot({ path: resolve(out, "02-relato.png") });
  checks.push("scroll nativo y motor de relato avanzan");
  await page.locator(".nd-next a").click();
  await page.waitForURL("**/sitios/nadir/descenso");
  await page.getByRole("heading", { level: 1, name: "UMBRAL" }).waitFor();
  assert.ok(await canvas?.evaluate((element) => element.isConnected), "la escena persiste al navegar");
  assert.ok(await page.evaluate(() => scrollY < 100), "el nuevo capítulo empieza arriba");
  await page.waitForTimeout(1600);
  await page.screenshot({ path: resolve(out, "03-descenso.png") });
  checks.push("navegación a descenso sin desmontar el canvas");
  await page.locator(".nd-next a").click();
  await page.waitForURL("**/sitios/nadir/hallazgo");
  await page.getByRole("heading", { level: 1, name: "ORIGEN" }).waitFor();
  await page.locator("#nd-step-2").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  assert.notEqual(await page.locator(".nd-readout > span:last-child").innerText(), "100%", "el último registro no completa el mensaje");
  await page.locator(".nd-message").evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".nd-readout > span:last-child").innerText(), "099%", "el mensaje espera su apertura");
  await page.getByRole("button", { name: "Abrir el mensaje" }).click();
  await page.getByText("Mientras haya alguien capaz de asombrarse", { exact: false }).waitFor();
  assert.equal(await page.locator(".nd-readout > span:last-child").innerText(), "100%", "abrir el mensaje completa la transmisión");
  checks.push("progreso del hallazgo: 99% antes de abrir y 100% al revelar");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve(out, "04-mensaje.png") });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Guardar el diario de expedición" }).click();
  const download = await downloadPromise;
  const path = resolve(out, download.suggestedFilename());
  await download.saveAs(path);
  assert.match(readFileSync(path, "utf8"), /Mientras haya alguien capaz de asombrarse/);
  checks.push("mensaje revelado y diario descargado con contenido");
  for (const route of ["", "/descenso", "/hallazgo"]) {
    const result = await page.goto(`${origin}/sitios/nadir${route}`, { waitUntil: "networkidle" });
    assert.equal(result?.status(), 200);
  }
  checks.push("las tres rutas admiten entrada directa");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/sitios/nadir`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "sin overflow horizontal en móvil");
  await page.screenshot({ path: resolve(out, "05-movil.png") });
  await page.locator("#nd-step-1").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(out, "06-movil-relato.png") });
  checks.push("móvil 390px sin desbordamiento horizontal");
  for (const route of ["descenso", "hallazgo"]) {
    await page.goto(`${origin}/sitios/nadir/${route}`, { waitUntil: "networkidle" });
    await page.locator(".nd-stage.is-ready canvas").waitFor();
    await page.locator("#nd-step-2").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `móvil ${route} sin desbordamiento`);
    await page.screenshot({ path: resolve(out, `movil-${route}.png`) });
  }
  checks.push("descenso y hallazgo revisables en móvil con WebGL");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${origin}/sitios/nadir/hallazgo`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".nd-stage canvas").count(), 0);
  await page.getByRole("button", { name: "Abrir el mensaje" }).click();
  await page.getByRole("button", { name: "Guardar el diario de expedición" }).waitFor();
  await page.screenshot({ path: resolve(out, "07-movimiento-reducido.png") });
  checks.push("movimiento reducido: sin canvas y relato completo utilizable");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [320, 768, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/sitios/nadir/descenso`, { waitUntil: "networkidle" });
    await page.locator(".nd-stage.is-ready canvas").waitFor();
    await page.locator("#nd-step-2").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `sin overflow a ${width}px`);
    await page.screenshot({ path: resolve(out, `descenso-${width}.png`) });
  }
  checks.push("sin desbordamiento a 320, 768 y 1920px");
  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallback.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.startsWith("webgl") || type === "experimental-webgl") return null;
      return getContext.apply(this, [type, ...args] as Parameters<typeof getContext>);
    } as typeof getContext;
  });
  await fallback.goto(`${origin}/sitios/nadir`, { waitUntil: "networkidle" });
  assert.equal(await fallback.locator(".nd-stage canvas").count(), 0);
  assert.ok(await fallback.locator(".nd-fallback").isVisible());
  await fallback.screenshot({ path: resolve(out, "08-sin-webgl.png") });
  await fallback.close();
  checks.push("sin WebGL: ilustración de reserva visible");
  assert.deepEqual(errors, [], "sin errores JS ni de consola");
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify({ checks, errors }, null, 2));
  console.log(JSON.stringify({ checks, errors, out }, null, 2));
} finally { await browser.close(); }
