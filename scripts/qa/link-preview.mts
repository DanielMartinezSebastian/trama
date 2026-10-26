import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

// Uso: npx tsx scripts/qa/link-preview.mts [http://localhost:3000]
const base = process.argv[2] ?? "http://localhost:3000";
const out = ".refs3d/link-preview";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/componentes#link-preview`, { waitUntil: "networkidle", timeout: 60000 });
  const stage = page.locator('[data-entry="link-preview"]');
  const link = stage.locator(".ui-link-preview a");
  const panel = page.locator(".ui-link-preview__panel");
  const hover = async (target = link) => {
    await page.mouse.move(0, 0);
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await target.hover();
  };
  await link.waitFor();
  assert((await page.locator('pre[aria-label="Código de uso"]').innerText()).includes('href="/demo/th-ciphergrid"'));
  assert.equal(await panel.count(), 0);
  await hover();
  await panel.locator("iframe.is-ready").waitFor({ timeout: 60000 });
  assert.equal(await panel.locator("iframe").getAttribute("src"), "/demo/th-ciphergrid");
  assert.equal(await panel.evaluate((el) => getComputedStyle(el).getPropertyValue("--bg")), await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--bg")));
  await page.screenshot({ path: `${out}/live.png` });
  await page.keyboard.press("Escape");
  assert.equal(await panel.count(), 0);

  await page.locator("#f-mode").selectOption("image");
  await page.locator("#f-image").fill("/img/esparta/corte.webp");
  await page.locator("#f-title").fill("Vista de proyecto");
  await page.locator("#f-width").focus();
  await page.keyboard.press("Home");
  for (let n = 0; n < 8; n++) await page.keyboard.press("ArrowRight");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await hover();
  await panel.locator("img.is-ready").waitFor();
  assert.equal(await panel.locator("iframe").count(), 0);
  assert(await panel.locator("img").evaluate((el) => (el as HTMLImageElement).naturalWidth > 0));
  assert.equal(Math.round((await panel.boundingBox())!.width), 320);
  assert.equal(await panel.evaluate((el) => getComputedStyle(el).animationName), "none");
  await page.screenshot({ path: `${out}/image.png` });
  await page.keyboard.press("Escape");

  // Cancelar también antes de que termine el retardo, sin llegar a cargar el recurso.
  await page.locator("#f-delay").focus();
  await page.keyboard.press("End");
  await hover();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1100);
  assert.equal(await panel.count(), 0);
  await page.mouse.move(0, 0);
  await hover();
  await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
  await page.waitForTimeout(1100);
  assert.equal(await panel.count(), 0);

  await page.locator("#f-delay").focus();
  await page.keyboard.press("Home");
  await page.route("**/__missing-preview.webp", (route) => route.fulfill({ status: 404, body: "" }));
  await page.locator("#f-image").fill("/__missing-preview.webp");
  await hover();
  await panel.getByText("Abre el enlace para ver la página").waitFor();
  await page.keyboard.press("Escape");
  await page.locator("#f-image").fill("/img/esparta/corte.webp");

  // El portal sale de los escenarios con transform/overflow y mantiene una sola vista activa.
  await page.getByRole("button", { name: "Comparar los 9 estilos" }).click();
  const links = page.locator(".pg__compare .ui-link-preview a");
  await links.first().focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await panel.waitFor();
  await hover(links.nth(1));
  await page.waitForTimeout(100);
  assert.equal(await panel.count(), 1);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Ver uno solo", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 650 });
  await hover();
  await panel.waitFor();
  const rect = (await panel.boundingBox())!;
  assert(rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= 390 && rect.y + rect.height <= 650);
  await page.screenshot({ path: `${out}/narrow.png` });
  await link.focus();
  await page.keyboard.press("Tab");
  assert.equal(await panel.count(), 0);
  assert.deepEqual(errors, []);
  console.log("OK LinkPreview: live, image, theme, width, reduced motion, cancellation, image error, single preview, viewport bounds, keyboard.");
} finally {
  await browser.close();
}
