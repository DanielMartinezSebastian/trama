import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";

const args = process.argv.slice(2);
const input = args[0];
if (!input || !/^https?:\/\//.test(input)) throw new Error("Uso: npm run smoke -- http://localhost:3005/ruta [--out carpeta]");
const url = new URL(input);
if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("smoke solo admite servidores locales");
const outIndex = args.indexOf("--out");
if (outIndex >= 0 && (!args[outIndex + 1] || args[outIndex + 1].startsWith("--"))) throw new Error("Falta la carpeta de --out");
const out = resolve(outIndex >= 0 ? args[outIndex + 1] : `.refs3d/smoke/${Date.now()}`);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const response = await page.goto(url.href, { waitUntil: "networkidle", timeout: 60000 });
  const status = response?.status() ?? 0;
  await page.screenshot({ path: resolve(out, "pagina.png"), fullPage: true });
  const result = { url: url.href, status, title: await page.title(), errors };
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, out }, null, 2));
  process.exitCode = status >= 200 && status < 400 && !errors.length ? 0 : 1;
} finally {
  await browser.close();
}
