import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";
const Skeleton = createRequire(import.meta.url)("../../components/ui/Skeleton.tsx").default as typeof import("../../components/ui/Skeleton").default;

// Uso: npx tsx scripts/qa/skeleton.mts [http://localhost:3000]
const base = process.argv[2] ?? "http://localhost:3000";
const out = ".refs3d/skeleton";
mkdirSync(out, { recursive: true });
const child = createElement("a", { href: "/demos", className: "sample", style: { padding: 12, borderRadius: 16 } }, "Ver demos");
assert.equal(Skeleton({ loading: false, children: child }), child, "El hijo cargado se devuelve intacto");
assert.equal(Skeleton({ loading: false }), null);
const html = renderToStaticMarkup(createElement(Skeleton, { loading: true }, child));
assert(html.startsWith("<a ") && html.includes('aria-hidden="true"') && html.includes('inert=""'));
assert.equal(child.props.className, "sample");
assert.equal(child.props.style.borderRadius, 16);

const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/componentes#skeleton`, { waitUntil: "networkidle", timeout: 60000 });
  const stage = page.locator('[data-entry="skeleton"]');
  const content = stage.locator(".pg-skeleton-demo__content");
  const capture = async (name: string) => {
    await stage.locator(".ui-center").evaluate((el) => el.scrollTo(0, 0));
    await page.locator(".pg__main").evaluate((el) => el.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${name}.png` });
  };
  const measure = () => content.evaluate((root) => {
    const parent = root.getBoundingClientRect();
    return [...root.querySelectorAll("article, h3, p, a, img, th, td, .pg-skeleton-card__image")].map((el) => {
      const r = el.getBoundingClientRect();
      return [r.x - parent.x, r.y - parent.y, r.width, r.height].map((value) => Math.round(value * 100) / 100);
    });
  });
  for (const layout of ["card", "article", "table"]) {
    await page.locator("#f-demo").selectOption(layout);
    await stage.getByRole("button", { name: "Mostrar contenido", exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await content.getAttribute("aria-busy"), "true");
    if (layout === "article") await content.locator("img").evaluate((el) => (el as HTMLImageElement).decode());
    const before = await measure();
    assert(before.length > 0);
    assert(await content.locator(".ui-skel").evaluateAll((els) => els.every((el) => el.getBoundingClientRect().width > 0)));
    if (layout === "card") {
      assert.equal(await stage.getByRole("link", { name: "Explorar demos", exact: false }).count(), 0);
      await stage.getByRole("button", { name: "Mostrar contenido" }).focus();
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute("data-skeleton-action")), false);
    }
    if (layout === "article") await content.locator("img").screenshot({ path: `${out}/image-loading.png` });
    await capture(`${layout}-loading`);
    await stage.getByRole("button", { name: "Mostrar contenido", exact: true }).click();
    assert.equal(await content.getAttribute("aria-busy"), "false");
    assert.equal(await content.locator(".ui-skel").count(), 0);
    const after = await measure();
    assert.equal(after.length, before.length);
    for (let i = 0; i < before.length; i++) for (let j = 0; j < 4; j++) assert(Math.abs(before[i][j] - after[i][j]) < 0.6, `${layout}: la pieza ${i} cambió su geometría (${before[i]} → ${after[i]})`);
    if (layout === "article") await content.locator("img").screenshot({ path: `${out}/image-loaded.png` });
    if (layout === "card") {
      assert.equal(await stage.getByRole("link", { name: "Explorar demos", exact: false }).count(), 1);
      await stage.getByRole("button", { name: "Simular carga" }).focus();
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute("data-skeleton-action")), true);
    }
    await capture(`${layout}-loaded`);
    await stage.getByRole("button", { name: "Simular carga", exact: true }).click();
  }

  const darkBackground = await content.locator(".ui-skel").first().evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.locator(".pg__theme select").first().selectOption("editorial");
  await page.evaluate(() => document.fonts.ready);
  assert.notEqual(await content.locator(".ui-skel").first().evaluate((el) => getComputedStyle(el).backgroundColor), darkBackground);
  await capture("light-theme");
  await page.locator(".pg__theme select").first().selectOption("neutro");

  await page.locator("#f-demo").selectOption("primitives");
  for (const kind of ["text", "card", "avatar", "table", "block"]) {
    await page.locator("#f-kind").selectOption(kind);
    const boxes = await stage.locator(".ui-skel").evaluateAll((els) => els.map((el) => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })));
    assert(boxes.length > 0 && boxes.every((box) => box.width > 0 && box.height > 0), `${kind}: forma sin dimensiones`);
  }
  await page.locator("#f-width").fill("180px");
  await page.locator("#f-height").fill("72px");
  assert.equal((await stage.locator(".ui-skel").boundingBox())!.width, 180);
  assert.equal((await stage.locator(".ui-skel").boundingBox())!.height, 72);
  await page.locator("#f-animation").selectOption("none");
  assert.equal(await stage.locator(".ui-skel").evaluate((el) => getComputedStyle(el).animationName), "none");
  await page.locator("#f-animation").selectOption("pulse");
  assert.equal(await stage.locator(".ui-skel").evaluate((el) => getComputedStyle(el).animationName), "ui-skel-pulse");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await stage.locator(".ui-skel").evaluate((el) => getComputedStyle(el).animationName), "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#f-demo").selectOption("card");
  const mobileBox = await content.locator("article").boundingBox();
  assert(mobileBox && mobileBox.width > 100 && mobileBox.x >= 0 && mobileBox.x + mobileBox.width <= 390);
  await content.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}/mobile.png` });
  assert.deepEqual(errors, []);
  console.log("OK Skeleton: SSR, contenido intacto, geometría estable en tarjeta/artículo/tabla, imagen oculta, foco y aria-busy, cinco formas visibles, dimensiones, animaciones, movimiento reducido y móvil.");
} finally {
  await browser.close();
}
