/** Smoke e inspección de páginas afectadas con servidor propio, después del build del sitio. */
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";

const port = 3419, origin = `http://127.0.0.1:${port}`;
try { await fetch(origin, { signal: AbortSignal.timeout(1000) }); throw new Error("Puerto propio ocupado; no se detiene el servidor existente"); }
catch (e) { if (String(e).includes("ocupado")) throw e; }
const out = resolve(".refs3d/agent-site"); mkdirSync(out, { recursive: true });
let log = "";
const server = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: process.cwd(), windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
server.stdout.on("data", (c) => { log += String(c); }); server.stderr.on("data", (c) => { log += String(c); });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  let ready = false;
  for (let n = 0; n < 60 && !ready; n++) { try { ready = (await fetch(origin)).ok; } catch { await new Promise((r) => setTimeout(r, 500)); } }
  assert(ready, log);
  const npm = process.env.npm_execpath;
  if (!npm) throw new Error("Ejecutar desde npm exec -- tsx scripts/validate-agent-site.mts");
  for (const [route, name] of [["/", "home"], ["/docs/agentes", "agentes"], ["/componentes#guide-frame", "guide-frame"]]) {
    execFileSync(process.execPath, [npm, "run", "smoke", "--", origin + route, "--out", join(out, name)], { encoding: "utf8", stdio: "pipe", maxBuffer: 2_000_000 });
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  for (const [route, name] of [["/", "home"], ["/docs/agentes", "agentes"]]) {
    assert.equal((await page.goto(origin + route, { waitUntil: "networkidle" }))?.status(), 200);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Desborde móvil ${route}`);
    await page.screenshot({ path: join(out, `${name}-mobile.png`), fullPage: true });
  }
  const summaries = ["home", "agentes", "guide-frame"].map((name) => JSON.parse(readFileSync(join(out, name, "resultado.json"), "utf8")));
  writeFileSync(join(out, "result.json"), JSON.stringify({ at: new Date().toISOString(), summaries, mobileOverflow: false, visualInspection: "pending" }, null, 2) + "\n");
  console.log("✓ smoke de portada, agentes y GuideFrame; móvil sin desborde. Capturas pendientes de inspección.");
} finally { await browser.close(); server.kill(); writeFileSync(join(out, "server.log"), log); }
