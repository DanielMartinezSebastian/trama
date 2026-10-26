/** Regresión del corte del modelo y de las transiciones: tsx scripts/qa/nadir-transiciones.mts [origen] */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const origin = process.argv[2] ?? "http://localhost:3000";
const out = resolve(".refs3d/nadir/transiciones");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
const measurements: unknown[] = [];
try {
  const page = await browser.newPage({ viewport: { width: 1873, height: 883 } });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.addInitScript({ path: resolve("scripts/cine/hooks/three.js") });
  for (const width of [1873, 1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 883 });
    for (const route of ["", "/descenso"]) {
      await page.goto(`${origin}/sitios/nadir${route}`, { waitUntil: "networkidle" });
      await page.locator(".nd-stage.is-ready canvas").waitFor();
      for (const location of [".nd-opening", "#nd-step-2", ".nd-next", ".nd-footer"]) {
        await page.locator(location).evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
        await page.waitForTimeout(1500);
        const bounds = await page.evaluate(() => {
          // El gancho de cine expone la escena real; proyectamos todos los vértices
          // de los anillos, incluidas las matrices de cada segmento instanciado.
          const state = (window as any).__cine.state;
          const camera = state.lastCamera;
          const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
          state.lastScene.traverse((mesh: any) => {
            if (mesh.geometry?.type !== "TorusGeometry") return;
            const vertices = mesh.geometry.attributes.position;
            const instance = mesh.matrixWorld.clone();
            const vertex = mesh.position.clone();
            for (let k = 0; k < (mesh.isInstancedMesh ? mesh.count : 1); k++) {
              if (mesh.isInstancedMesh) mesh.getMatrixAt(k, instance);
              for (let i = 0; i < vertices.count; i++) {
                vertex.fromBufferAttribute(vertices, i);
                if (mesh.isInstancedMesh) vertex.applyMatrix4(instance);
                vertex.applyMatrix4(mesh.matrixWorld).project(camera);
                bounds.minX = Math.min(bounds.minX, vertex.x); bounds.maxX = Math.max(bounds.maxX, vertex.x);
                bounds.minY = Math.min(bounds.minY, vertex.y); bounds.maxY = Math.max(bounds.maxY, vertex.y);
              }
            }
          });
          return bounds;
        });
        assert.ok(Object.values(bounds).every(Number.isFinite), "se midieron los anillos");
        assert.ok(bounds.minX > -1 && bounds.maxX < 1 && bounds.minY > -1 && bounds.maxY < 1, `anillos completos: ${width} ${route} ${location} ${JSON.stringify(bounds)}`);
        const headerHeight = width === 390 ? 80 : 100;
        assert.ok(bounds.maxY < 1 - 2 * headerHeight / (width === 390 ? 844 : 883), "la cabecera no tapa el modelo");
        measurements.push({ width, route, location, bounds });
        if (location === ".nd-next") {
          const background = await page.locator(location).evaluate((el) => ({ image: getComputedStyle(el).backgroundImage, color: getComputedStyle(el).backgroundColor }));
          assert.deepEqual(background, { image: "none", color: "rgba(0, 0, 0, 0)" }, "la sección no tapa el modelo");
          await page.screenshot({ path: resolve(out, `final-${width}-${route ? "descenso" : "senal"}.png`) });
        }
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/sitios/nadir`, { waitUntil: "networkidle" });
  const canvas = await page.locator(".nd-stage canvas").elementHandle();
  await page.locator("#nd-step-1").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(1500);
  const modelPose = () => page.evaluate(() => {
    const scene = (window as any).__cine.state.lastScene;
    const root = scene.getObjectByName("nadir-orbital");
    const ring = scene.getObjectByName("nadir-ring-0");
    const segments = ring.children.find((object: any) => object.isInstancedMesh && object.geometry.type === "TorusGeometry");
    const matrix = root.matrixWorld.clone(); segments.getMatrixAt(0, matrix);
    return { position: root.position.toArray(), rotation: root.rotation.toArray().slice(0, 3), scale: root.scale.x, separation: ring.position.z, segment: matrix.elements.slice(12, 15) };
  });
  const first = await modelPose();
  await page.locator("#nd-step-2").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(1500);
  const second = await modelPose();
  assert.ok(Math.abs(first.position[0] - second.position[0]) > 2, "el modelo cambia de lado");
  assert.ok(Math.abs(first.scale - second.scale) > .03, "el acercamiento cambia el tama?o del modelo");
  assert.ok(Math.abs(first.separation - second.separation) > .05, "los anillos se separan");
  await page.evaluate(() => {
    const a = document.getElementById("nd-step-1")!.getBoundingClientRect();
    const b = document.getElementById("nd-step-2")!.getBoundingClientRect();
    scrollTo(0, scrollY + (a.top + a.height / 2 + b.top + b.height / 2) / 2 - innerHeight / 2);
  });
  await page.waitForTimeout(1800);
  const exploded = await modelPose();
  assert.ok(Math.hypot(...exploded.segment) > .5, "el despiece tiene un desplazamiento evidente");
  assert.ok(Math.hypot(...first.segment) < .01 && Math.hypot(...second.segment) < .01, "las piezas vuelven a cerrar en reposo");
  await page.screenshot({ path: resolve(out, "despiece-1440.png") });
  await page.locator("#nd-step-2").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.evaluate(() => scrollBy(0, 350));
  await page.waitForTimeout(1500);
  const cardStyle = await page.locator("#nd-step-2 .nd-story-copy").evaluate((el) => ({ opacity: getComputedStyle(el).opacity, filter: getComputedStyle(el).filter }));
  assert.deepEqual(cardStyle, { opacity: "1", filter: "none" }, "los textos no se funden ni desenfocan");
  measurements.push({ first, second, exploded, cardStyle });
  await page.locator(".nd-next a").click();
  await page.waitForURL("**/sitios/nadir/descenso");
  assert.ok(await canvas?.evaluate((el) => el.isConnected), "el canvas persiste en la transición");
  await page.waitForTimeout(700);
  await page.goBack();
  await page.waitForURL("**/sitios/nadir");
  await page.getByRole("heading", { name: "NÁDIR", exact: true }).waitFor();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#nd-step-1").scrollIntoViewIfNeeded();
  assert.equal(await page.locator("#nd-step-1 .nd-story-copy").evaluate((el) => getComputedStyle(el).filter), "none");
  assert.deepEqual(errors, []);
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify({ measurements, errors, checks: ["24 encuadres completos", "finales transparentes", "traslado y zoom del modelo", "despiece visible", "anillos cerrados en reposo", "texto sin fundido", "canvas persistente", "historial", "movimiento reducido"] }, null, 2));
  console.log("24 encuadres completos; traslado, zoom, anillos y segmentos animados; textos sin fundido, canvas persistente, historial y movimiento reducido correctos; sin errores.");
} finally { await browser.close(); }
