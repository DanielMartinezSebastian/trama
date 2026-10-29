/** Recorrido real del consumidor instalado. El servidor y navegador se crean y cierran aquí. */
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";
import { sombrasOscuras } from "./sombras-navegador.mts";

const consumer = resolve(process.argv[2] ?? ".cache/agent-pilot");
const port = Number(process.argv[3] ?? "3417");
const origin = `http://127.0.0.1:${port}`;
const out = resolve(".refs3d/agent-pilot");
mkdirSync(out, { recursive: true });
const evidence: { id: string; status: string; detail?: unknown }[] = [];
const errors: string[] = [];
let log = "";
// Fallar si hay otro servidor, sin detenerlo.
try { await fetch(origin, { signal: AbortSignal.timeout(1000) }); throw new Error(`Puerto ${port} ocupado`); }
catch (e) { if (e instanceof Error && e.message.includes("ocupado")) throw e; }
const server = spawn(process.execPath, [join(consumer, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: consumer, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
server.stdout.on("data", (c) => { log += String(c); });
server.stderr.on("data", (c) => { log += String(c); });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    if (server.exitCode !== null) throw new Error(`Servidor terminó: ${log}`);
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok; } catch { /* arrancando */ }
    if (!ready) await new Promise((r) => setTimeout(r, 1000));
  }
  assert(ready, "Servidor de consumidor no disponible");
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, timezoneId: "Europe/Madrid", locale: "es-ES", reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.addInitScript("window.__name = f => f");
  await page.clock.setFixedTime(new Date("2026-11-03T12:00:00+01:00"));
  for (const route of ["/", "/reservar", "/mis-citas"]) {
    const response = await page.goto(origin + route, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 700) { await page.evaluate((n) => scrollTo(0, n), y); await page.waitForTimeout(35); }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.addScriptTag({ path: join(consumer, "node_modules/axe-core/axe.min.js") });
    const audit = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (root: Document, config: object) => Promise<{ violations: { id: string; nodes: unknown[] }[]; incomplete: { id: string }[] }> } }).axe;
      const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });
      return { violations: result.violations, incomplete: result.incomplete.map((r) => r.id) };
    });
    evidence.push({ id: `axe-${route}`, status: audit.violations.length ? "failed" : "passed", detail: audit });
    assert.deepEqual(audit.violations, [], `Accesibilidad de ${route}`);
    assert.equal(await page.locator("h1").count(), 1);
    assert(!(await page.locator("body").innerText()).includes("NaN"), "Formato de horario inválido");
    assert.deepEqual(await sombrasOscuras(page), []);
    await page.screenshot({ path: join(out, `${route.replaceAll("/", "") || "home"}-desktop.png`), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Desborde móvil ${route}`);
    await page.screenshot({ path: join(out, `${route.replaceAll("/", "") || "home"}-mobile.png`), fullPage: true });
    await page.screenshot({ path: join(out, `${route.replaceAll("/", "") || "home"}-mobile-viewport.png`) });
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  evidence.push({ id: "routes-mobile-desktop", status: "passed", detail: "Tres rutas HTTP200, h1 único, sin desborde ni sombras oscuras; capturas pendientes de inspección humana" });
  await page.goto(origin + "/");
  await page.screenshot({ path: join(out, "reference-hero.png") });
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return { body: getComputedStyle(document.querySelector(".linde")!).fontFamily, loaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family) };
  });
  assert(fonts.loaded.some((f) => /Manrope/i.test(f)), "Manrope no cargó desde trama-ui/fonts");
  assert(fonts.loaded.some((f) => /Cormorant/i.test(f)), "Cormorant no cargó desde trama-ui/fonts");
  evidence.push({ id: "package-fonts", status: "passed", detail: fonts });
  await page.goto(origin + "/mis-citas");
  await page.getByText("Aún no hay citas de prueba").waitFor();
  await page.goto(origin + "/reservar?servicio=corte&profesional=Alba");
  assert.equal(await page.getByRole("button", { name: /Corte.*45 min/ }).getAttribute("aria-pressed"), "true");
  await page.getByRole("button", { name: "Elegir día y hora" }).click();
  assert(await page.getByRole("button", { name: "Continuar", exact: true }).isDisabled());
  await page.locator('[data-date="2026-11-08"]').waitFor();
  assert.equal(await page.locator('[data-date="2026-11-08"]').getAttribute("aria-disabled"), "true");
  assert.equal(await page.locator('[data-date="2026-11-09"]').getAttribute("aria-disabled"), "true");
  await page.locator('[data-date="2026-11-07"]').click();
  assert.equal(await page.locator('input[type=radio][value="16:00"]').count(), 0);
  await page.locator('[data-date="2026-11-06"]').click();
  const slot = page.locator('input[type=radio]:not(:disabled)').first();
  const originalTime = await slot.inputValue();
  await slot.check();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Tu nombre", { exact: true }).fill("A");
  await page.getByLabel("Correo", { exact: true }).fill("incorrecto");
  await page.getByRole("button", { name: "Confirmar cita", exact: true }).click();
  await page.locator(".ui-book__error").waitFor();
  await page.getByLabel("Tu nombre", { exact: true }).fill("Alex");
  await page.getByRole("button", { name: "Confirmar cita", exact: true }).click();
  assert.match(await page.locator(".ui-book__error").innerText(), /correo/);
  await page.getByLabel("Correo", { exact: true }).fill("alex@example.com");
  await page.getByRole("button", { name: "Confirmar cita", exact: true }).click();
  await page.locator(".ui-book__ok").waitFor();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("linde:pilot:v1")!));
  assert.equal(saved.length, 1); assert.equal(saved[0].service, "corte"); assert.equal(saved[0].staff, "Alba"); assert(!("email" in saved[0]));
  const downloadWait = page.waitForEvent("download");
  await page.getByRole("button", { name: "Añadir al calendario", exact: true }).click();
  const download = await downloadWait;
  await download.saveAs(join(out, "cita.ics"));
  assert.match(readFileSync(join(out, "cita.ics"), "utf8"), /Linde.*Corte/);
  await page.getByRole("link", { name: "Ver mis citas", exact: true }).click();
  await page.locator(".ui-appts__item").waitFor();
  await page.reload(); await page.locator(".ui-appts__item").waitFor();
  evidence.push({ id: "reserve-errors-persistence-ics", status: "passed", detail: { date: saved[0].date, time: originalTime, emailStored: false } });
  await page.getByRole("link", { name: "Cambiar", exact: true }).click();
  await page.getByRole("button", { name: "Elegir día y hora" }).click();
  await page.locator('[data-date="2026-11-10"]').click();
  const nextSlot = page.locator('input[type=radio]:not(:disabled)').first();
  const nextTime = await nextSlot.inputValue(); await nextSlot.check();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  assert.equal(await page.getByLabel("Tu nombre", { exact: true }).inputValue(), "Alex");
  await page.getByLabel("Correo", { exact: true }).fill("alex@example.com");
  await page.getByRole("button", { name: "Cambiar mi cita", exact: true }).click();
  await page.getByText("Cita cambiada", { exact: false }).waitFor();
  const changed = await page.evaluate(() => JSON.parse(localStorage.getItem("linde:pilot:v1")!));
  assert.equal(changed.length, 1); assert.equal(changed[0].id, saved[0].id); assert.equal(changed[0].date, "2026-11-10");
  await page.goto(origin + "/reservar?servicio=corte&profesional=Alba");
  await page.getByRole("button", { name: "Elegir día y hora" }).click();
  await page.locator('[data-date="2026-11-10"]').click();
  assert(await page.locator(`input[type=radio][value="${nextTime}"]`).isDisabled());
  await page.goto(origin + "/mis-citas");
  await page.getByRole("button", { name: "Anular", exact: true }).click();
  await page.getByRole("button", { name: "Conservarla", exact: true }).click();
  assert.equal(await page.locator(".ui-appts__item").count(), 1);
  await page.getByRole("button", { name: "Anular", exact: true }).click();
  await page.getByRole("button", { name: "Sí, anular", exact: true }).click();
  await page.getByText("Aún no hay citas de prueba").waitFor();
  evidence.push({ id: "reschedule-collision-cancel", status: "passed" });
  await page.evaluate(() => localStorage.setItem("linde:pilot:v1", JSON.stringify([{ id: "near", service: "corte", staff: "Alba", date: "2026-11-03", time: "15:00", name: "Alex" }])));
  await page.reload(); await page.locator(".ui-appts__item").waitFor();
  assert.equal(await page.getByRole("link", { name: "Cambiar", exact: true }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "Anular", exact: true }).count(), 0);
  await page.goto(origin + "/reservar?servicio=no-existe&profesional=no-existe&editar=no-existe");
  await page.getByText(/El enlace no contiene una selección válida/).waitFor();
  await page.goto(origin + "/"); await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").innerText(), "Saltar al contenido");
  evidence.push({ id: "cutoff-query-keyboard-reduced-motion", status: "passed" });
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error("Almacenamiento bloqueado por prueba"); }; });
  const denied = await blocked.newPage();
  await denied.goto(origin + "/reservar");
  await denied.getByText(/Sin almacenamiento: esta cita durará solo esta pantalla/).waitFor();
  evidence.push({ id: "storage-denied", status: "passed", detail: "Aviso de persistencia limitada visible; no se afirma supervivencia entre rutas" });
  assert.deepEqual(errors, []);
  evidence.push({ id: "browser-errors", status: "passed", detail: errors });
  if (process.argv.includes("--research")) {
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    const measured = await page.evaluate(() => {
      const title = document.querySelector("h1")!, image = document.querySelector(".intro-art")!, intro = document.querySelector(".intro")!;
      return { viewport: { width: innerWidth, height: innerHeight }, title: { text: title.textContent, font: getComputedStyle(title).fontFamily, size: getComputedStyle(title).fontSize, weight: getComputedStyle(title).fontWeight, rect: title.getBoundingClientRect().toJSON() }, image: image.getBoundingClientRect().toJSON(), columns: getComputedStyle(intro).gridTemplateColumns, guide: document.querySelector("[data-guide]")?.getAttribute("data-guide") };
    });
    const research = resolve(".refs3d/agent-research"); mkdirSync(research, { recursive: true });
    writeFileSync(join(research, "url-evidence.json"), JSON.stringify({ url: origin, at: new Date().toISOString(), measured }, null, 2) + "\n");
    execFileSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), "scripts/probe-refs.mts", origin, "--out", ".refs3d/agent-research/probe", "--no-hover", "--wait", "500", "--limite", "60"], { cwd: process.cwd(), stdio: "pipe", maxBuffer: 2_000_000 });
    evidence.push({ id: "research-url-probe", status: "passed", detail: measured });
  }
  await context.close(); await blocked.close();
} catch (error) {
  evidence.push({ id: "execution", status: "failed", detail: String(error) });
  process.exitCode = 1;
} finally {
  await browser.close(); server.kill();
  writeFileSync(join(out, "server.log"), log);
  const install = JSON.parse(readFileSync(join(consumer, "pilot-install.json"), "utf8"));
  const result = { at: new Date().toISOString(), origin, install, fixedClock: "2026-11-03T12:00:00+01:00", evidence, errors, screenshotsRequireInspection: true, templateSha256: createHash("sha256").update(readFileSync("examples/agent-pilot/app/page.tsx.txt")).digest("hex") };
  writeFileSync(join(out, "result.json"), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
}
