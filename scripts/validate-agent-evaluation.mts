import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";
import { evaluationSuite } from "./agent-evaluation-suites.mts";

const evaluation = resolve(process.argv[2] ?? ".cache/agent-evaluation");
const consumer = resolve(process.argv[3] ?? ".cache/agent-pilot-final");
const manifest = join(evaluation, "cohort.json");
const suite = evaluationSuite(existsSync(manifest) ? JSON.parse(readFileSync(manifest, "utf8")).contract.suite.id : "salon");
if (existsSync(manifest)) assert.deepEqual(JSON.parse(readFileSync(manifest, "utf8")).contract.suite, suite, "El protocolo difiere del contrato congelado");
const runs = JSON.parse(readFileSync(join(evaluation, "runs.json"), "utf8")) as { id: string; task: string; condition: string; repetition: number; elapsedMs: number; usage: unknown }[];
const cases = join(consumer, "app/evaluation/cases"); mkdirSync(cases, { recursive: true });
const records: { id: string; task: string; condition: string; repetition: number; generationMs: number; validationMs: number; status: string; details: string[]; visualReview: string; usage: unknown }[] = [];
const valid: string[] = [];
for (const run of runs) {
  assert(/^[a-z0-9-]+$/.test(run.id), "ID de ensayo no válido");
  const started = performance.now();
  const source = join(evaluation, run.id, "Result.tsx");
  const result = { id: run.id, task: run.task, condition: run.condition, repetition: run.repetition, generationMs: run.elapsedMs, validationMs: 0, usage: run.usage, status: "pending", details: [] as string[], visualReview: "pending" };
  const events = join(evaluation, run.id, "events.jsonl");
  const turnFailure = existsSync(events) ? readFileSync(events, "utf8").split(/\r?\n/).flatMap((line) => { try { const e = JSON.parse(line); // Codex: turn.failed; Claude Code: result con api_error.
      if (e.type === "turn.failed") return [String(e.error?.message ?? "")];
      return e.type === "result" && e.is_error && e.api_error ? [`${e.api_error}: ${e.result ?? ""}`] : []; } catch { return []; } })[0] : undefined;
  // Un turno que el cliente no llega a empezar (límite de uso, red) no mide al agente: se registra aparte, no como fallo.
  if (!existsSync(source) && turnFailure && /usage.limit|rate.limit|session limit/i.test(turnFailure)) { result.status = "not-run-infrastructure"; result.details.push(`Cliente sin turno: ${turnFailure.slice(0, 160)}`); }
  else if (!existsSync(source)) { result.status = "failed"; result.details.push("No entregó Result.tsx"); }
  else {
    const code = readFileSync(source, "utf8");
    const destination = join(cases, `${run.id}.tsx`);
    const options: ts.CompilerOptions = { noEmit: true, strict: true, skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, esModuleInterop: true, types: [] };
    const program = ts.createProgram([source], options);
    const errors = ts.getPreEmitDiagnostics(program);
    const imports = [...code.matchAll(/(?:from\s+|import\s+)["']([^"']+)["']/g)].map((m) => m[1]);
    const privateImport = imports.find((i) => i !== "react" && i !== "trama-ui" && !/^trama-ui\/[A-Za-z][A-Za-z0-9]*$/.test(i) && i !== "trama-ui/styles.css");
    if (errors.length || privateImport) {
      result.status = "failed";
      result.details.push(...errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")), ...(privateImport ? [`Import fuera de contrato: ${privateImport}`] : []));
    } else { writeFileSync(destination, code); valid.push(run.id); }
  }
  result.validationMs = Math.round(performance.now() - started); records.push(result);
}
const route = join(consumer, "app/evaluation/[id]"); mkdirSync(route, { recursive: true });
const loader = `import { Suspense } from "react";\nconst cases = {\n${valid.map((id) => `${JSON.stringify(id)}: () => import(${JSON.stringify(`../cases/${id}`)}),`).join("\n")}\n};\nexport default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{mode?:string}>}){const {id}=await params;const query=await searchParams;const load=cases[id as keyof typeof cases];if(!load)return <h1>Ensayo no disponible</h1>;const {default:Result}=await load();return <div id="evaluation-case"><Suspense fallback={<p>Cargando ensayo</p>}><Result mode={query.mode==='appointments'?'appointments':'book'} bookHref={'/evaluation/'+id+'?mode=book'} appointmentsHref={'/evaluation/'+id+'?mode=appointments'} storageKey={'eval:'+id} artSrc={${JSON.stringify(suite.artSrc)}}/></Suspense></div>;}\n`;
writeFileSync(join(route, "page.tsx"), loader);
const npm = process.env.npm_execpath;
if (!npm) throw new Error("Ejecutar mediante npm run agents:validate-evaluation");
const buildStart = performance.now();
let buildLog = "";
try { buildLog = execFileSync(process.execPath, [npm, "run", "build"], { cwd: consumer, encoding: "utf8", maxBuffer: 3_000_000 }); }
catch (e) {
  const error = e as { stdout?: string; stderr?: string };
  writeFileSync(join(evaluation, "build.log"), String(error.stdout ?? "") + String(error.stderr ?? ""));
  writeFileSync(join(evaluation, "validation.json"), JSON.stringify({ records, sharedBuild: "failed", buildMs: Math.round(performance.now() - buildStart) }, null, 2));
  throw e;
}
writeFileSync(join(evaluation, "build.log"), buildLog);
const sharedBuildMs = Math.round(performance.now() - buildStart);
const origin = "http://127.0.0.1:3421";
try { await fetch(origin, { signal: AbortSignal.timeout(1000) }); throw new Error("Puerto 3421 ocupado"); } catch (e) { if (String(e).includes("ocupado")) throw e; }
const server = spawn(process.execPath, [join(consumer, "node_modules/next/dist/bin/next"), "start", "--port", "3421", "--hostname", "127.0.0.1"], { cwd: consumer, windowsHide: true, stdio: "ignore" });
const browser = await chromium.launch({ executablePath: chromiumPath() });
try {
  let up = false;
  for (let i = 0; i < 40 && !up; i++) { try { up = (await fetch(origin)).ok; } catch { await new Promise((r) => setTimeout(r, 500)); } }
  assert(up);
  for (const result of records.filter((r) => valid.includes(r.id))) {
    const start = performance.now();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-ES", timezoneId: "Europe/Madrid", reducedMotion: "reduce" });
    const page = await ctx.newPage(); const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript("window.__name = f => f");
    await page.clock.setFixedTime(new Date("2026-11-03T12:00:00+01:00"));
    try {
      const url = `${origin}/evaluation/${result.id}`;
      assert.equal((await page.goto(url, { waitUntil: "networkidle" }))?.status(), 200);
      const subject = page.locator("#evaluation-case");
      assert.equal(await subject.locator("h1").count(), 1, "Se exige un h1 por muestra");
      await page.screenshot({ path: join(evaluation, result.id, "desktop.png"), fullPage: true });
      if (result.task === "composition") {
        const text = await subject.innerText();
        for (const expected of suite.compositionContent) assert(text.includes(expected), `Falta ${expected}`);
        assert(await subject.locator('a[href*="mode=book"]').count() > 0, "Falta CTA de reserva");
      }
      if (result.task === "reference") {
        const image = subject.locator("img").first(); await image.waitFor();
        assert(await image.getAttribute("alt"));
        assert(await image.evaluate((img) => (img as HTMLImageElement).naturalWidth > 0));
        const h = await subject.locator("h1").boundingBox(), im = await image.boundingBox();
        assert(h && im && h.x < im.x && im.x - h.x > 100, "Composición de escritorio no transfiere las dos columnas");
      }
      await page.setViewportSize({ width: 390, height: 844 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Desborde móvil");
      await page.screenshot({ path: join(evaluation, result.id, "mobile.png"), fullPage: true });
      if (result.task === "reference") {
        const h = await subject.locator("h1").boundingBox(), im = await subject.locator("img").first().boundingBox();
        assert(h && im && im.y >= h.y + h.height, "Imagen debe seguir al título en móvil");
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.addScriptTag({ path: join(consumer, "node_modules/axe-core/axe.min.js") });
      const audit = await page.evaluate(async () => {
        type Violation = { id: string; nodes: { target: string[]; failureSummary?: string }[] };
        const axe = (window as unknown as { axe: { run: (root: Element, opts: object) => Promise<{ violations: Violation[] }> } }).axe;
        const found = (await axe.run(document.querySelector("#evaluation-case")!, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } })).violations;
        // WCAG 1.4.3 exime la decoración pura: texto de contraste dentro de aria-hidden se anota, no cuenta.
        const decorative = (n: { target: string[] }) => !!document.querySelector(n.target.join(" "))?.closest('[aria-hidden="true"]');
        const text = (n: { target: string[]; failureSummary?: string }) => `${n.target.join(" ")}: ${(n.failureSummary ?? "").replace(/\s+/g, " ").slice(0, 200)}`;
        return found.map((v) => {
          const ignored = v.id === "color-contrast" ? v.nodes.filter(decorative) : [];
          return { id: v.id, nodes: v.nodes.filter((n) => !ignored.includes(n)).map(text), ignored: ignored.map(text) };
        });
      });
      result.details.push(...audit.flatMap((v) => v.ignored.map((n) => `axe ${v.id} ignorado (decorativo, aria-hidden) ${n}`)));
      const violations = audit.filter((v) => v.nodes.length);
      if (violations.length) result.details.push(...violations.flatMap((v) => v.nodes.map((n) => `axe ${v.id} ${n}`)));
      assert.deepEqual(violations.map((v) => v.id), [], "Incumplimientos automáticos de accesibilidad");
      if (result.task === "booking") {
        await subject.getByRole("button", { name: "Elegir día y hora" }).click();
        assert(await subject.getByRole("button", { name: "Continuar", exact: true }).isDisabled());
        await subject.locator('[data-date="2026-11-06"]').click();
        await subject.locator('input[type=radio]:not(:disabled)').first().check();
        await subject.getByRole("button", { name: "Continuar", exact: true }).click();
        await subject.locator('input[autocomplete="given-name"]').fill("A");
        await subject.locator('input[type=email]').fill("incorrecto");
        await subject.getByRole("button", { name: "Confirmar cita", exact: true }).click();
        await subject.locator(".ui-book__error").waitFor();
        await subject.locator('input[autocomplete="given-name"]').fill("Alex");
        await subject.locator('input[type=email]').fill("alex@example.com");
        await subject.getByRole("button", { name: "Confirmar cita", exact: true }).click();
        await subject.locator(".ui-book__ok").waitFor();
        await subject.getByRole("link", { name: "Ver mis citas", exact: true }).click();
        await page.locator(".ui-appts__item").waitFor();
        await page.reload(); await page.locator(".ui-appts__item").waitFor();
        await page.getByRole("button", { name: "Anular", exact: true }).click();
        await page.getByRole("button", { name: "Sí, anular", exact: true }).click();
        assert.equal(await page.locator(".ui-appts__item").count(), 0);
      }
      assert.deepEqual(errors, []);
      assert(existsSync(join(evaluation, result.id, "brief.md")), "Falta brief de límites/decisiones");
      result.status = "passed-automated-pending-visual";
    } catch (error) { result.status = "failed"; result.details.push(String(error)); }
    finally { result.validationMs += Math.round(performance.now() - start); await ctx.close(); }
    console.log(`${result.id}: ${result.status}`);
    writeFileSync(join(evaluation, "validation.json"), JSON.stringify({ records, sharedBuildMs, origin, browser: "Chromium", visualReview: "pending-human" }, null, 2) + "\n");
  }
} finally { await browser.close(); server.kill(); }
