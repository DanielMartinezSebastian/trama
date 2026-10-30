import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const base = process.argv[2] ?? "http://127.0.0.1:3435";
const out = resolve(".refs3d/demo-umbral/recorrido");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
const errors: string[] = [];
const axeViolations: { route: string; id: string; nodes: string[] }[] = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-ES", reducedMotion: "reduce", acceptDownloads: true });
  const page = await context.newPage();
  await page.addInitScript("window.__name = (f) => f");
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  async function audit(route: string) {
    await page.addScriptTag({ path: resolve(".cache/demo-umbral/node_modules/axe-core/axe.min.js") });
    const found = await page.evaluate(async () => {
      const axe = (window as any).axe;
      return await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });
    });
    axeViolations.push(...found.violations.map((v: any) => ({ route, id: v.id, nodes: v.nodes.map((n: any) => `${n.target.join(", ")} ${n.failureSummary ?? ""}`) })));
  }
  const go = async (path: string) => {
    const r = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    assert.equal(r?.status(), 200, path);
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
    if (path.startsWith("/entradas")) await page.locator('[data-testid="order-total"], .pass-receipt, .empty-pass').first().waitFor({ state: "visible", timeout: 15000 });
  };
  await go("/");
  await audit("/");
  assert.equal(await page.locator("h1").count(), 1);
  await page.screenshot({ path: resolve(out, "inicio-desktop.png"), fullPage: true });
  await go("/programa");
  await audit("/programa");
  await page.getByRole("radio", { name: "Sáb 15" }).check();
  assert.equal(await page.getByText("4 sesiones para explorar").count(), 1);
  await page.getByRole("radio", { name: "Patio" }).check();
  assert.equal(await page.getByText("2 sesiones para explorar").count(), 1);
  assert.equal(await page.getByText("Otras formas de estar", { exact: true }).count(), 1);
  await page.screenshot({ path: resolve(out, "programa-movil.png"), fullPage: true });
  await page.getByRole("link", { name: /Elegir pase/ }).first().click();
  await page.getByRole("heading", { name: "Nos vemos al otro lado." }).waitFor();
  await page.getByRole("button", { name: /Un día fuera/ }).click();
  const total = page.locator('[data-testid="order-total"]');
  assert.equal((await total.innerText()).replace(/\u00a0/g, " "), "29 €");
  await page.getByRole("button", { name: "Añadir una unidad de pases" }).click();
  assert.equal((await total.innerText()).replace(/\u00a0/g, " "), "58 €");
  await page.getByRole("button", { name: "Continuar con este pase" }).click();
  await page.getByRole("button", { name: "Crear pase de muestra" }).click();
  assert.equal(await page.locator('input[aria-invalid="true"]').count(), 2);
  await page.getByLabel("Tu nombre").fill("Alex Demo");
  await page.getByLabel("Correo electrónico").fill("no-es-un-correo");
  await page.getByRole("button", { name: "Crear pase de muestra" }).click();
  assert.equal(await page.locator('input[aria-invalid="true"]').count(), 1);
  await page.getByLabel("Correo electrónico").fill("alex@example.test");
  await page.getByRole("button", { name: "Crear pase de muestra" }).click();
  await page.getByRole("heading", { name: "Alex Demo" }).waitFor();
  await page.waitForURL(/ver=pase/, { timeout: 5000 });
  await audit("/entradas?ver=pase");
  assert.equal(await page.getByText("2 pases · Total simulado 58 €").count(), 1);
  await page.screenshot({ path: resolve(out, "pase-desktop.png"), fullPage: true });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar pase de muestra" }).click();
  const download = await downloadPromise;
  const downloadPath = resolve(out, "pase-descargado.txt");
  await download.saveAs(downloadPath);
  const receipt = readFileSync(downloadPath, "utf8");
  assert.match(receipt, /NO VÁLIDO PARA ACCESO/);
  assert.match(receipt, /Alex Demo/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Alex Demo" }).waitFor({ state: "visible" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: resolve(out, "pase-movil.png"), fullPage: true });
  const mobile = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
  assert.ok(mobile.width <= mobile.viewport, `overflow móvil: ${JSON.stringify(mobile)}`);

  const savedOrder = await page.evaluate(() => JSON.parse(localStorage.getItem("umbral:order:v1") ?? "null"));
  assert.equal(savedOrder.total, 58);
  assert.equal(savedOrder.qty, 2);
  await page.getByRole("link", { name: "Programa" }).first().click();
  await page.getByRole("link", { name: "Mi pase" }).first().click();
  await page.getByRole("heading", { name: "Alex Demo" }).waitFor();

  const emptyContext = await browser.newContext();
  const empty = await emptyContext.newPage();
  await empty.goto(`${base}/entradas?ver=pase`, { waitUntil: "domcontentloaded" });
  await empty.getByRole("heading", { name: "Aún no tienes un pase guardado." }).waitFor();
  await emptyContext.close();

  const motionContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const motionPage = await motionContext.newPage();
  await motionPage.addInitScript("window.__name = (f) => f");
  await motionPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await motionPage.locator(".site-header").waitFor();
  assert.equal(await motionPage.locator(".site-header").evaluate((el) => (el as HTMLElement).style.viewTransitionName), "umbral-site-header");
  async function navigateAndRead(selector: string, destination: string, expected: string) {
    const transition = motionPage.evaluate(() => new Promise<string>((resolve, reject) => {
      const root = document.documentElement;
      const timer = setTimeout(() => { observer.disconnect(); reject(new Error("PageTransition no marcó la navegación")); }, 2500);
      const observer = new MutationObserver(() => {
        const value = root.dataset.uiVt;
        if (value) { clearTimeout(timer); observer.disconnect(); resolve(value); }
      });
      observer.observe(root, { attributes: true, attributeFilter: ["data-ui-vt"] });
      if (root.dataset.uiVt) { clearTimeout(timer); observer.disconnect(); resolve(root.dataset.uiVt); }
    }));
    await motionPage.locator(selector).click();
    assert.equal(await transition, expected);
    await motionPage.waitForURL(`${base}${destination}`);
    await motionPage.waitForTimeout(300);
  }
  await navigateAndRead(".hero-action-secondary", "/programa", "wipe-left");
  await navigateAndRead(".header-cta", "/entradas", "wipe-left");
  await navigateAndRead(".desktop-nav a[href='/programa']", "/programa", "wipe-right");
  await motionContext.close();

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/programa", "/entradas"]) {
      await go(path);
      const size = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth, offenders: Array.from(document.querySelectorAll("body *")).map((e) => ({ tag: e.tagName, cls: (e as HTMLElement).className, text: e.textContent?.trim().slice(0, 45), left: Math.round(e.getBoundingClientRect().left), right: Math.round(e.getBoundingClientRect().right) })).filter((e) => e.right > innerWidth + 1 || e.left < -1).slice(0, 8) }));
      assert.ok(size.content <= size.viewport, `${path} overflow ${width}px: ${JSON.stringify(size)}`);
      await page.screenshot({ path: resolve(out, `${path.slice(1) || "inicio"}-${width}.png`), fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(axeViolations, []);
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify({ ok: true, checks: ["3 rutas", "programa por día y espacio", "cantidad y precio", "validación", "pase persistente", "descarga marcada como no válida", "estado vacío", "PageTransition wipe-left / wipe-right", "cabecera persistente", "ancho móvil 320/390/768/1440", "axe wcag2a/wcag2aa", "errores de navegador"], errors, axeViolations }, null, 2) + "\n");
  console.log(`UMBRAL OK: flujo completo; evidencia ${out}`);
} finally {
  await browser.close();
}
