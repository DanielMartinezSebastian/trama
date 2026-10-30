import assert from "node:assert/strict";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const origin = process.argv[2] ?? "http://127.0.0.1:3441";
const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.addInitScript("window.__name = (f) => f");
const errors: string[] = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
try {
  await page.goto(origin);
  assert.equal(await page.locator(".demo-tile").count(), 5, "el selector ofrece cinco experiencias distintas");

  await page.getByRole("link", { name: "Entrar en la campaña" }).click();
  await page.getByRole("link", { name: "Descubrir la idea" }).click();
  assert.match(page.url(), /\/campaign\/story$/);
  await page.getByRole("link", { name: "Volver a la campaña" }).click();
  await page.locator("#brief").scrollIntoViewIfNeeded();
  await page.locator("#brief input[name=name]").fill("Alex García");
  await page.locator("#brief input[name=email]").fill("alex@example.com");
  await page.locator("#brief select[name=challenge]").selectOption({ label: "Una herramienta interna difícil de usar" });
  await page.getByRole("button", { name: /Crear un brief local/ }).click();
  await page.getByRole("status").getByText("Brief guardado en esta demo.").waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("rizo-briefs") ?? "[]").length), 1);

  await page.goto(`${origin}/system`);
  await page.getByRole("button", { name: "Campaña", exact: true }).click();
  assert.equal(await page.locator(".work-row").count(), 1, "el filtro limita el portfolio a campaña");
  await page.getByRole("button", { name: /CX-061/ }).click();
  await page.locator(".detail-panel").getByText("Activación interactiva en calle").waitFor();
  await page.getByRole("button", { name: /Guardar vista/ }).click();
  await page.getByText("★ Guardado").waitFor();
  await page.getByLabel("Buscar iniciativa").fill("sin coincidencias");
  await page.getByText("No hay iniciativas con ese filtro.").waitFor();
  await page.locator("#brief input[name=name]").fill("Alex García");
  await page.locator("#brief input[name=email]").fill("alex@example.com");
  await page.locator("#brief select[name=challenge]").selectOption({ label: "Explorar una oportunidad" });
  await page.getByRole("button", { name: /Crear un brief local/ }).click();
  await page.getByRole("status").getByText("Brief guardado en esta demo.").waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("rizo-briefs") ?? "[]").length), 2);

  await page.goto(`${origin}/forum`);
  await page.getByRole("button", { name: /Prototipar sistemas, no pantallas/ }).click();
  await page.getByRole("button", { name: "Añadir a mi recorrido" }).click();
  await page.getByRole("status").getByText("Sesión guardada en este navegador.").waitFor();
  await page.locator("#visita input[name=name]").fill("Alex García");
  await page.locator("#visita input[name=email]").fill("alex@example.com");
  await page.locator("#visita select[name=day]").selectOption({ label: "Viernes 13 de noviembre" });
  await page.getByRole("button", { name: "Reservar visita de prueba" }).click();
  await page.getByRole("status").getByText("Tu visita de prueba está en este navegador.").waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("rizo-forum-visits") ?? "[]").length), 1);

  await page.goto(`${origin}/archive`);
  await page.getByRole("button", { name: "CAMPAÑA", exact: true }).click();
  assert.equal(await page.locator(".archive-card").count(), 1, "el archivo filtra casos por práctica");
  await page.getByRole("button", { name: "TODO", exact: true }).click();
  assert.equal(await page.locator(".archive-card").count(), 4, "el archivo restaura todos los casos");
  await page.getByRole("link", { name: /Señal: la ciudad responde/ }).click();
  await page.waitForURL(/\/campaign$/);

  await page.goto(`${origin}/navigator`);
  await page.getByRole("radio", { name: /Activar una experiencia/ }).check();
  await page.getByRole("radio", { name: /La gente abandona/ }).check();
  await page.getByRole("heading", { name: "Empieza con una idea que se pueda vivir." }).waitFor();
  assert.match(await page.getByRole("link", { name: /Ver una campaña experiencial/ }).getAttribute("href") ?? "", /\/campaign$/);

  assert.deepEqual(errors, [], `errores de navegador: ${errors.join("; ")}`);
  console.log(JSON.stringify({ ok: true, url: origin, flows: ["navegación y caso de campaña", "brief local de campaña", "filtro, detalle, búsqueda y brief de producto", "agenda y reserva de visita de foro", "filtro de archivo y navegación a caso", "diagnóstico y recomendación interactiva"], errors }, null, 2));
} finally { await browser.close(); }
