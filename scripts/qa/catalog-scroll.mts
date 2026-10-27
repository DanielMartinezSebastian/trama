import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium, type FrameLocator } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

// Uso: npx tsx scripts/qa/catalog-scroll.mts [http://localhost:3000]
const base = process.argv[2] ?? "http://localhost:3000";
const out = ".refs3d/catalog-scroll";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const shell = page.locator(".pg-preview-shell").first();
  const iframe = shell.locator("iframe");
  const frame = iframe.contentFrame();
  const open = async (id: string) => {
    await page.goto(`${base}/componentes#${id}`, { waitUntil: "networkidle", timeout: 60000 });
    await frame.locator(".pg-preview__demo").waitFor();
    await shell.getByRole("slider", { name: "Recorrido", exact: true }).waitFor();
  };
  const scroll = async (target: FrameLocator, fraction: number) => {
    await target.locator("html").evaluate((el, value) => window.scrollTo({ top: value * (el.scrollHeight - innerHeight), behavior: "instant" }), fraction);
    await page.waitForTimeout(650);
  };
  const prop = async (selector: string, key: string) => Number(await frame.locator(selector).first().evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), key));

  await open("pinned-section");
  assert.equal(await prop(".ui-pin", "--pin-p"), 0);
  const parentScroll = await page.locator(".pg__main").evaluate((el) => el.scrollTop);
  await iframe.hover();
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(650);
  assert(await prop(".ui-pin", "--pin-p") > 0.2);
  assert.equal(await page.locator(".pg__main").evaluate((el) => el.scrollTop), parentScroll);
  assert(Math.abs(await frame.locator(".ui-pin__in").evaluate((el) => el.getBoundingClientRect().top)) < 2);
  await page.screenshot({ path: `${out}/pinned.png` });
  await shell.getByRole("button", { name: "Reiniciar recorrido" }).click();
  await page.waitForTimeout(200);
  assert.equal(await prop(".ui-pin", "--pin-p"), 0);
  const range = shell.getByRole("slider", { name: "Recorrido", exact: true });
  await range.press("End");
  await page.waitForTimeout(650);
  assert(await prop(".ui-pin", "--pin-p") > 0.99);
  assert.equal(await range.inputValue(), "100");
  const beforeLength = await frame.locator(".ui-pin").evaluate((el) => el.getBoundingClientRect().height);
  await page.locator("#f-length").press("End");
  await page.waitForTimeout(200);
  assert(await frame.locator(".ui-pin").evaluate((el) => el.getBoundingClientRect().height) > beforeLength * 2);
  const expand = shell.getByRole("button", { name: "Ampliar vista" });
  if (await expand.count()) {
    await expand.click();
    assert(await page.evaluate(() => document.fullscreenElement !== null));
    await shell.getByRole("button", { name: "Reducir vista" }).click();
  }

  await open("scrub-text");
  assert.equal(await prop(".ui-scrub__w", "--w"), 0);
  await scroll(frame, 0.65);
  const lit = await frame.locator(".ui-scrub__w").evaluateAll((els) => els.filter((el) => Number((el as HTMLElement).style.getPropertyValue("--w")) > 0.9).length);
  assert(lit > 5, "El texto debe encender palabras durante el recorrido");

  await open("horizontal-scroll");
  assert.equal(await frame.locator(".ui-hs").getAttribute("data-native"), null);
  const transform = await frame.locator(".ui-hs__track").evaluate((el) => getComputedStyle(el).transform);
  await scroll(frame, 0.5);
  assert.notEqual(await frame.locator(".ui-hs__track").evaluate((el) => getComputedStyle(el).transform), transform);
  assert(await prop(".ui-hs", "--hs-p") > 0.2);
  await page.screenshot({ path: `${out}/horizontal.png` });

  await open("hide-on-scroll");
  await scroll(frame, 0.5);
  assert.notEqual(await frame.locator(".ui-hos").getAttribute("data-hidden"), null);
  await scroll(frame, 0.3);
  assert.equal(await frame.locator(".ui-hos").getAttribute("data-hidden"), null);

  await open("section-index");
  await scroll(frame, 0.55);
  assert((await frame.locator(".ui-sidx").innerText()).includes("SERVICIOS"));

  await open("parallax");
  const initial = await frame.locator(".ui-par").getAttribute("style");
  await scroll(frame, 0.55);
  assert.notEqual(await frame.locator(".ui-par").getAttribute("style"), initial);

  await open("reveal");
  const hidden = await frame.locator(".ui-rv").first().getAttribute("data-rv");
  await scroll(frame, 0.45);
  await page.waitForTimeout(1000);
  assert.equal(hidden, "0");
  assert.equal(await frame.locator(".ui-rv").first().getAttribute("data-rv"), "1");
  await page.screenshot({ path: `${out}/reveal.png` });
  await page.locator("#f-trigger").selectOption("mount");
  assert.equal(await page.locator(".pg-preview-shell").count(), 0);
  await page.locator("#f-trigger").selectOption("scroll");
  await frame.locator(".ui-rv").first().waitFor();

  await open("theme-scroll");
  const theme = await frame.locator("[data-theme]").first().evaluate((el) => getComputedStyle(el.parentElement!).getPropertyValue("--bg"));
  await scroll(frame, 0.5);
  await page.waitForTimeout(800);
  assert.notEqual(await frame.locator("[data-theme]").first().evaluate((el) => getComputedStyle(el.parentElement!).getPropertyValue("--bg")), theme);

  await open("scroll-expand");
  const start = await prop(".ui-sxp", "--se-t");
  await scroll(frame, 0.55);
  assert(await prop(".ui-sxp", "--se-t") > start + 0.3);

  for (const id of ["project-reel", "chapter-stage"]) {
    await open(id);
    assert(await frame.locator(".ui-pin").count());
    const active = frame.locator(id === "project-reel" ? ".ui-reel__counter" : ".ui-chs__bar .is-on");
    const first = await active.innerText();
    await scroll(frame, 0.5);
    assert.notEqual(await active.innerText(), first);
    await page.locator("#f-playback").selectOption("manual");
    assert.equal(await page.locator(".pg-preview-shell").count(), 0);
    assert(await page.locator("#f-progress").count());
  }

  // Comparación: cada variante conserva su ventana y recibe sus props.
  await open("reveal");
  await page.locator("#f-trigger").selectOption("scroll");
  await page.getByRole("button", { name: "Comparar los 9 estilos" }).click();
  assert.equal(await page.locator(".pg-preview-shell iframe").count(), 9);
  await page.getByRole("button", { name: "Ver uno solo", exact: true }).click();

  // Cualquier otro componente puede probarse en una página sin modificar el componente del kit.
  await page.goto(`${base}/componentes#badge`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".pg-preview-shell").count(), 0);
  await page.getByRole("button", { name: "Probar con scroll", exact: true }).click();
  await frame.locator(".pg-preview__demo").waitFor();
  await page.locator("#f-text").fill("Etiqueta de prueba");
  await frame.getByText("Etiqueta de prueba", { exact: true }).waitFor();
  const parentTheme = await page.locator(".pg__stage").evaluate((el) => getComputedStyle(el).getPropertyValue("--bg"));
  assert.equal(await frame.locator(".pg-preview").evaluate((el) => getComputedStyle(el).getPropertyValue("--bg")), parentTheme);
  await page.getByRole("button", { name: "Vista compacta", exact: true }).click();
  assert.equal(await page.locator(".pg-preview-shell").count(), 0);

  for (const id of ["stacked-cards", "scatter-text"]) {
    await open(id);
    assert(await frame.locator("html").evaluate((el) => el.scrollHeight > innerHeight));
    await scroll(frame, 0.5);
  }

  const optional: [string, string, string][] = [
    ["line-draw", "#f-trigger", "scroll"],
    ["split-text", "#f-elastic", "scroll"],
    ["type-field", "#f-trigger", "scroll"],
    ["light-scroll", "#f-cue", ""],
    ["audio-player", "#f-dock", "bottom"],
  ];
  for (const [id, selector, option] of optional) {
    await page.goto(`${base}/componentes#${id}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator(selector).selectOption(option);
    await frame.locator(".pg-preview__demo").waitFor();
    assert(await frame.locator("html").evaluate((el) => el.scrollHeight > innerHeight));
    await scroll(frame, 0.5);
  }
  for (const [id, selector] of [["island-nav", "#f-hideOnScroll"], ["expanding-panels", "#f-mobileScroll"]]) {
    await page.goto(`${base}/componentes#${id}`, { waitUntil: "networkidle" });
    await page.locator(selector).click();
    await frame.locator(".pg-preview__demo").waitFor();
    await scroll(frame, 0.5);
  }

  await open("smooth-scroll");
  await iframe.hover();
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1000);
  assert(await frame.locator("html").evaluate(() => scrollY > 100));
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains("lenis")), false);
  await shell.getByRole("slider", { name: "Recorrido", exact: true }).press("End");
  await page.waitForTimeout(300);
  assert(await frame.locator("html").evaluate((el) => Math.abs(scrollY - (el.scrollHeight - innerHeight)) < 2));
  await shell.getByRole("button", { name: "Reiniciar recorrido" }).click();
  await page.waitForTimeout(500);
  assert.equal(await frame.locator("html").evaluate(() => scrollY), 0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await open("horizontal-scroll");
  assert.notEqual(await frame.locator(".ui-hs").getAttribute("data-native"), null);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(`${base}/componentes#horizontal-scroll`, { waitUntil: "networkidle", timeout: 60000 });
  const mf = mobile.locator(".pg-preview-shell iframe").contentFrame();
  await mf.locator(".ui-hs[data-native]").waitFor();
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mobile.locator(".pg-preview-shell").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: `${out}/mobile.png` });
  assert.deepEqual(errors, []);
  console.log("OK catálogo: scroll real aislado, sticky, props, reinicio, recorrido, ampliación, texto, horizontal, cabecera, índice, parallax, reveal, tema, expansión, reel/capítulos, comparador, Lenis, movimiento reducido y móvil.");
} finally {
  await browser.close();
}
