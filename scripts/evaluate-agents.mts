/** Doce ejecuciones independientes de CLI, secuenciales. No publica ni toca otros worktrees. */
import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const source = resolve(process.argv[2] ?? ".cache/agent-pilot/node_modules/trama-ui");
const out = resolve(process.argv[3] ?? ".cache/agent-evaluation");
if (!out.startsWith(resolve(".cache") + "/") && !out.startsWith(resolve(".cache") + "\\")) throw new Error("Evaluaciones solo dentro de .cache/");
const cli = process.env.TRAMA_CODEX_CLI ?? join(process.env.APPDATA ?? "", "npm/node_modules/@openai/codex/bin/codex.js");
if (!existsSync(cli)) throw new Error("Indica TRAMA_CODEX_CLI con la ruta local a codex.js");
const reference = resolve(".refs3d/agent-pilot/reference-hero.png");
if (!existsSync(reference)) throw new Error("Falta referencia: ejecuta agents:test-pilot");
mkdirSync(out, { recursive: true });
const legacy = execFileSync("git", ["show", "2263365bc6b9485028ae7ce769fcf1fb5ba619ec:docs/CATALOG.md"], { encoding: "utf8", maxBuffer: 2_000_000 }).replace(/@\/components\/ui\/styles\/kit\.css/g, "trama-ui/styles.css").replace(/@\/components\/ui\//g, "trama-ui/");
const digest = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const tasks = [
  { id: "composition", prompt: "Construye una sección comercial conocida para Linde, salón ficticio. Un h1 'Linde — Corte y color', introducción breve, tres servicios (Consulta inicial gratis/15 min; Corte 35 €/45 min; Color desde 65 €/90 min), y enlaces claros para reservar usando bookHref. Guía salon, contraste legible, disposición responsive y copy propio. Usar piezas del kit que encajen. Sin imágenes ni servicios conectados." },
  { id: "reference", prompt: "Adapta la captura adjunta al hero de Linde. Mantén jerarquía editorial con el titular 'Un corte. Un color. Tu manera.', texto breve y CTA usando bookHref. En escritorio texto a la izquierda e ilustración a la derecha; en móvil apilar texto antes de imagen sin desborde. La ilustración propia se recibe como artSrc, con alt descriptivo. Guía salon, tono cálido y contraste legible. No afirmes conocer tipografías/CSS exactos de la imagen; registra observado/inferido/decidido en brief.md. Se pide adaptación, no igualdad de píxeles." },
  { id: "booking", prompt: "Implementa un flujo de reserva local con Trama. Si mode='book': servicio/profesional, día/hueco, datos inválidos y confirmación con enlace appointmentsHref. Si mode='appointments': vacío/citas persistidas, enlace bookHref, anulación con confirmación. Servicios: consulta (15min/0€), corte (45min/35€), color (90min/65€/from); Alba hace todos y Dani consulta/corte. Usa la storageKey recibida para ambas vistas; textos explícitos de demostración sin correos/agenda conectados. Cerrado 0,1; sábado cierre14; times 10,11,12,13,16,17,18 en formato HH:mm, min1 max45, cutoff24h. Un h1 propio por vista. Guía salon. No implementes un servidor de reservas." },
];
const results: Record<string, unknown>[] = [];
const schema = join(out, "response-schema.json");
writeFileSync(schema, JSON.stringify({ type: "object", properties: { tsx: { type: "string" }, brief: { type: "string" } }, required: ["tsx", "brief"], additionalProperties: false }, null, 2));
for (let repetition = 1; repetition <= 2; repetition++) {
  for (const task of tasks) {
    const conditions = repetition === 1 ? ["current_documentation", "proposed_skills"] : ["proposed_skills", "current_documentation"];
    for (const condition of conditions) {
      const id = `${task.id}-${condition === "proposed_skills" ? "pilot" : "docs"}-${repetition}`;
      const dir = join(out, id);
      if (existsSync(join(dir, "run.json"))) { results.push(JSON.parse(readFileSync(join(dir, "run.json"), "utf8"))); continue; }
      if (existsSync(dir)) throw new Error(`Ensayo parcial existente: ${dir}; conservarlo y elegir otra salida`);
      mkdirSync(join(dir, "node_modules/trama-ui"), { recursive: true });
      writeFileSync(join(dir, "package.json"), JSON.stringify({ name: id, private: true, dependencies: { "trama-ui": "0.13.0", react: "19.3.0", next: "16.3.5" } }, null, 2));
      execFileSync("git", ["init", "--quiet"], { cwd: dir });
      if (condition === "proposed_skills") {
        cpSync(source, join(dir, "node_modules/trama-ui"), { recursive: true });
        execFileSync(process.execPath, [join(dir, "node_modules/trama-ui/bin/trama-ui.mjs"), "skills", "install", "--client", "codex"], { cwd: dir, stdio: "pipe" });
      } else {
        for (const name of ["dist", "assets", "bin", "package.json", "README.md", "LICENSE"]) cpSync(join(source, name), join(dir, "node_modules/trama-ui", name), { recursive: true });
        writeFileSync(join(dir, "node_modules/trama-ui/CATALOG.md"), legacy);
      }
      const prompt = `Encargo de evaluación independiente. Consulta solo ${dir}; no leas otros ensayos ni el repo padre. No instales dependencias, no uses red ni escribas archivos. El evaluador guardará tu respuesta y compilará/renderizará tu fuente con dependencias fijas.\n${condition === "proposed_skills" ? "Usa las skills Trama disponibles y las referencias de tu versión instalada, consultando solo lo necesario." : "Usa la documentación actual de node_modules/trama-ui/CATALOG.md y sus declaraciones públicas, buscando solo piezas relevantes."}\n\n${task.prompt}\n\nDevuelve únicamente un JSON con tsx (código para Result.tsx) y brief (Markdown de decisiones/límites). Export default un componente React con props {mode:'book'|'appointments';bookHref:string;appointmentsHref:string;storageKey:string;artSrc:string}. No crees rutas Next; el evaluador adapta estas props. Solo imports públicos de trama-ui y React; estilos inline y clases del kit, sin archivos CSS. Si necesitas interacción usa 'use client'. Pasa textos propios, usa CSS/GuideFrame del paquete y no copies assets internos de demos. Debe renderizar en 1440x900 y 390x844. Conserva fuentes conocidas (Cormorant/Manrope) de la guía; ya se cargan en el evaluador. Verifica tu fuente lo que permitan las herramientas de lectura, declara lo que no hayas probado y termina con ese JSON.`;
      writeFileSync(join(dir, "prompt.txt"), prompt);
      const response = join(dir, "response.json");
      const args = [cli, "exec", "--sandbox", "read-only", "--config", 'approval_policy="never"', "--json", "--ephemeral", "--skip-git-repo-check", "--cd", dir, "--output-schema", schema, "--output-last-message", response];
      if (task.id === "reference") args.push("--image", reference);
      args.push("--", prompt);
      const started = new Date().toISOString(); const clock = performance.now();
      const child = spawn(process.execPath, args, { cwd: dir, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
      let stdout = "", stderr = "";
      child.stdout.on("data", (chunk) => { stdout += String(chunk); appendFileSync(join(dir, "events.jsonl"), chunk); });
      child.stderr.on("data", (chunk) => { stderr += String(chunk); appendFileSync(join(dir, "stderr.log"), chunk); });
      const exitCode = await new Promise<number | null>((done, reject) => { child.on("error", reject); child.on("close", done); });
      writeFileSync(join(dir, "events.jsonl"), stdout); writeFileSync(join(dir, "stderr.log"), stderr);
      const events = stdout.split(/\r?\n/).filter(Boolean).flatMap((line) => { try { return [JSON.parse(line)]; } catch { return []; } });
      const usage = events.filter((e) => e.type === "turn.completed").map((e) => e.usage);
      if (existsSync(response)) {
        try { const result = JSON.parse(readFileSync(response, "utf8")); if (typeof result.tsx === "string" && typeof result.brief === "string") { writeFileSync(join(dir, "Result.tsx"), result.tsx); writeFileSync(join(dir, "brief.md"), result.brief); } }
        catch { /* Queda como fallo de entrega con respuesta cruda conservada. */ }
      }
      const record = { id, task: task.id, condition, repetition, startedAt: started, finishedAt: new Date().toISOString(), elapsedMs: Math.round(performance.now() - clock), exitCode,
        usage: usage.length ? usage : null, sourceManifestSha256: digest(join(source, "package.json")), referenceSha256: task.id === "reference" ? digest(reference) : null,
        artifacts: { source: existsSync(join(dir, "Result.tsx")), brief: existsSync(join(dir, "brief.md")) }, terminalState: "pending-validation",
        configuration: { client: "codex-cli", version: "0.165.0", model: "default-inherited-unreported", modelOverride: false, sandbox: "read-only", output: "json-schema", approval: "never", order: results.length + 1 },
      };
      writeFileSync(join(dir, "run.json"), JSON.stringify(record, null, 2) + "\n"); results.push(record);
      writeFileSync(join(out, "runs.json"), JSON.stringify(results, null, 2) + "\n");
      console.log(`${record.id}: CLI ${exitCode}; fuente=${record.artifacts.source}; ${Math.round(record.elapsedMs / 1000)}s (${results.length}/12)`);
    }
  }
}
console.log(`Finalizadas ${results.length} ejecuciones; falta adjudicación de tipos, navegador y revisión visual.`);
