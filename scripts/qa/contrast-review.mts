import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const input = process.argv[2];
if (!input || !/^https?:\/\//.test(input)) throw new Error("Uso: npm run qa:contrast -- http://localhost:3000/ruta [--widths 320,390,768,1024,1440]");
const base = new URL(input);
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("qa:contrast solo admite servidores locales");
const widthsArg = process.argv.indexOf("--widths");
const widths = (widthsArg < 0 ? "320,390,768,1024,1440" : process.argv[widthsArg + 1])?.split(",").map(Number) ?? [];
if (!widths.length || widths.some(width => !Number.isInteger(width) || width < 240 || width > 3000)) throw new Error("Ancho inválido en --widths");

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const out = resolve(`.refs3d/contrast/${base.port || "80"}-${Date.now()}`);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
const reports = [];
try {
  const page = await browser.newPage({ viewport: { width: widths[0], height: 900 } });
  await page.addInitScript("window.__name = (f) => f");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(base.href, { waitUntil: "networkidle", timeout: 60000 });
    if (!response || response.status() >= 400) throw new Error(`${base.href} respondió ${response?.status() ?? "sin respuesta"}`);
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    await page.addScriptTag({ content: axeSource });
    const positions = await page.evaluate(() => {
      const step = Math.max(500, Math.floor(innerHeight * .8));
      const end = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      const points = [];
      for (let y = 0; y < end; y += step) points.push(y);
      points.push(end);
      return [...new Set(points)];
    });
    const violations: any[] = [], incomplete: any[] = [];
    for (const scrollY of positions) {
      await page.evaluate(y => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(40);
      const partial = await page.evaluate(async () => {
        const axeApi = (window as unknown as Window & { axe: { run: (context: Document, options: object) => Promise<any> } }).axe;
        const audit = await axeApi.run(document, { runOnly: { type: "rule", values: ["color-contrast"] } });
        const compact = (item: any) => ({ impact: item.impact, target: item.target, summary: item.failureSummary ?? item.any?.[0]?.message ?? item.summary ?? "" });
        return {
          violations: audit.violations.flatMap((item: any) => item.nodes.map(compact)),
          incomplete: audit.incomplete.flatMap((item: any) => item.nodes.map(compact)).filter((item: any) => !/only non-text characters/i.test(item.summary)),
        };
      });
      violations.push(...partial.violations);
      incomplete.push(...partial.incomplete);
    }
    const unique = (items: any[]) => [...new Map(items.map(item => [`${item.target.join("|")}|${item.summary}`, item])).values()];
    const result = { violations: unique(violations), incomplete: unique(incomplete), scans: positions.length };
    reports.push({ width, document: await page.evaluate(() => document.documentElement.scrollWidth), ...result });
    console.log(JSON.stringify({ width, document: reports.at(-1)?.document, scans: result.scans, violations: result.violations.length, visualReviewRequired: result.incomplete.length, failed: result.violations.slice(0, 8), unresolved: result.incomplete.slice(0, 5) }));
  }
  const report = { url: base.href, widths, criteria: "WCAG 2.1 AA: 4.5:1 para texto normal y 3:1 solo para texto grande; el texto sobre imagen/gradiente figura como revisión visual pendiente.", reports };
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify(report, null, 2) + "\n");
  const violations = reports.reduce((sum, item) => sum + item.violations.length, 0);
  const incomplete = reports.reduce((sum, item) => sum + item.incomplete.length, 0);
  console.log(`Informe: ${out} · incumplimientos ${violations} · requiere revisión visual ${incomplete}`);
  if (violations) process.exitCode = 1;
} finally {
  await browser.close();
}
