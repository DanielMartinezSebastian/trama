import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";

const cine = process.argv.includes("--cine");
let failures = 0;
function report(ok: boolean, label: string, detail: string, required = true) {
  console.log(`${ok ? "OK" : required ? "ERROR" : "AVISO"} ${label}: ${detail}`);
  if (!ok && required) failures++;
}

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
console.log(`Entorno: ${process.platform} · Node ${process.version}`);
for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
  report(existsSync(`node_modules/${name}/package.json`), name, "paquete instalado (npm ci para restaurar el lockfile)");
}
const executable = chromiumPath() ?? chromium.executablePath();
report(existsSync(executable), "Chromium", executable, cine);
try {
  const version = execFileSync("ffmpeg", ["-version"], { encoding: "utf8", timeout: 10000 }).split(/\r?\n/)[0];
  report(true, "ffmpeg", version);
} catch {
  report(false, "ffmpeg", "no disponible en PATH; necesario para cine", cine);
}
for (const path of [".refs3d", "public/lab-assets", ".env.scripts"]) {
  report(existsSync(path), path, existsSync(path) ? "presente; contenido no inspeccionado" : "ausente; ver docs/flujo-agentes.md", false);
}
if (cine) {
  const recipes = JSON.parse(readFileSync("scripts/cine/recetas.json", "utf8")) as Record<string, { ref?: string }>;
  for (const [id, recipe] of Object.entries(recipes)) {
    if (recipe.ref) report(existsSync(`${recipe.ref}/timeline.jsonl`), `referencia ${id}`, recipe.ref, false);
  }
}
if (process.argv.includes("--browser")) {
  try {
    const browser = await chromium.launch({ executablePath: chromiumPath() });
    try {
      const page = await browser.newPage();
      await page.setContent("<title>Trama doctor</title><p>Chromium operativo</p>");
      report((await page.title()) === "Trama doctor", "arranque Chromium", "navegación local correcta");
    } finally {
      await browser.close();
    }
  } catch (error) {
    report(false, "arranque Chromium", (error as Error).message);
  }
}
process.exitCode = failures ? 1 : 0;
