/**
 * Ejecuciones independientes de un cliente de agentes, secuenciales. No publica ni toca otros worktrees.
 *   npm run agents:evaluate -- [paquete] [salida] [--client codex|claude] [--conditions docs,pilot,updated]
 * Codex (por defecto): 3 tareas × docs/pilot × 2 repeticiones, como la cohorte P4. Claude: los ensayos corren fuera del
 * repo (Claude Code sube buscando CLAUDE.md) y se copian a la salida; solo Read/Glob/Grep (+Skill en pilot) y modelo fijo.
 */
import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { evaluationSuite } from "./agent-evaluation-suites.mts";

const flags = new Map<string, string>();
const positional: string[] = [];
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith("--")) flags.set(arg.slice(2), process.argv[++i] ?? "");
  else positional.push(arg);
}
const client = flags.get("client") ?? "codex";
if (client !== "codex" && client !== "claude") throw new Error(`Cliente no soportado: ${client}`);
const conditionIds = (flags.get("conditions") ?? "docs,pilot").split(",");
const CONDITIONS: Record<string, string> = { docs: "current_documentation", pilot: "proposed_skills", updated: "updated_documentation" };
for (const c of conditionIds) if (!CONDITIONS[c]) throw new Error(`Condición desconocida: ${c}`);
const claudeModel = flags.get("model") ?? "opus";
const suite = evaluationSuite(flags.get("suite") ?? "salon");

const source = resolve(positional[0] ?? ".cache/agent-pilot/node_modules/trama-ui");
const out = resolve(positional[1] ?? ".cache/agent-evaluation");
if (!out.startsWith(resolve(".cache") + "/") && !out.startsWith(resolve(".cache") + "\\")) throw new Error("Evaluaciones solo dentro de .cache/");
const cli = client === "codex"
  ? process.env.TRAMA_CODEX_CLI ?? join(process.env.APPDATA ?? "", "npm/node_modules/@openai/codex/bin/codex.js")
  : process.env.TRAMA_CLAUDE_CLI ?? join(process.env.APPDATA ?? "", "npm/node_modules/@anthropic-ai/claude-code/bin/claude.exe");
if (!existsSync(cli)) throw new Error(`Indica TRAMA_${client.toUpperCase()}_CLI con la ruta local al cliente`);
const clientVersion = client === "codex" ? execFileSync(process.execPath, [cli, "--version"], { encoding: "utf8" }).trim().replace(/^codex-cli\s+/, "") : JSON.parse(readFileSync(join(cli, "../../package.json"), "utf8")).version as string;
const reference = resolve(flags.get("reference") ?? suite.reference);
if (!existsSync(reference)) throw new Error("Falta referencia: ejecuta agents:test-pilot");
mkdirSync(out, { recursive: true });
// Claude Code carga CLAUDE.md de los directorios padre: sus ensayos corren en una carpeta temporal ajena al repo.
const workRoot = client === "claude" ? join(tmpdir(), "trama-eval", basename(out)) : out;
const legacy = execFileSync("git", ["show", "2263365bc6b9485028ae7ce769fcf1fb5ba619ec:docs/CATALOG.md"], { encoding: "utf8", maxBuffer: 2_000_000 }).replace(/@\/components\/ui\/styles\/kit\.css/g, "trama-ui/styles.css").replace(/@\/components\/ui\//g, "trama-ui/");
const digest = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const tasks = suite.tasks;
// Congela encargo, paquete y referencia antes del primer ensayo; rechaza reanudaciones mezcladas.
const tree = (dir: string, prefix = ""): string[] => readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
  const key = prefix + entry.name;
  return entry.isDirectory() ? tree(join(dir, entry.name), key + "/") : [`${key}\0${digest(join(dir, entry.name))}`];
});
const sourceTreeSha256 = createHash("sha256").update(tree(source).join("\n")).digest("hex");
const contract = { suite, conditions: conditionIds, client, clientVersion, model: client === "claude" ? claudeModel : "default-inherited-unreported", sourceTreeSha256, referenceSha256: digest(reference), legacyCatalogSha256: conditionIds.includes("docs") ? createHash("sha256").update(legacy).digest("hex") : null };
const contractSha256 = createHash("sha256").update(JSON.stringify(contract)).digest("hex");
const manifest = join(out, "cohort.json");
if (existsSync(manifest)) {
  if (JSON.parse(readFileSync(manifest, "utf8")).contractSha256 !== contractSha256) throw new Error("La suite, el paquete o la configuración difieren de la cohorte existente; elegir otra salida");
} else if (suite.id !== "salon" && existsSync(join(out, "runs.json"))) throw new Error("Cohorte existente sin contrato: conservarla y elegir otra salida");
else if (!existsSync(join(out, "runs.json"))) writeFileSync(manifest, JSON.stringify({ createdAt: new Date().toISOString(), contractSha256, contract }, null, 2) + "\n");
const results: Record<string, unknown>[] = [];
const schemaObject = { type: "object", properties: { tsx: { type: "string" }, brief: { type: "string" } }, required: ["tsx", "brief"], additionalProperties: false };
const schema = join(out, "response-schema.json");
writeFileSync(schema, JSON.stringify(schemaObject, null, 2));
const suffix = (condition: string) => (condition === "proposed_skills" ? "pilot" : condition === "updated_documentation" ? "updated" : "docs");
const total = tasks.length * conditionIds.length * 2;
cohort: for (let repetition = 1; repetition <= 2; repetition++) {
  for (const task of tasks) {
    // Orden rotado por repetición para no favorecer a una condición por caché.
    const ordered = conditionIds.map((c) => CONDITIONS[c]);
    const conditions = repetition === 1 ? ordered : [...ordered].reverse();
    for (const condition of conditions) {
      const id = `${task.id}-${suffix(condition)}-${repetition}`;
      const record_dir = join(out, id);
      if (existsSync(join(record_dir, "run.json"))) { results.push(JSON.parse(readFileSync(join(record_dir, "run.json"), "utf8"))); continue; }
      if (existsSync(record_dir)) throw new Error(`Ensayo parcial existente: ${record_dir}; conservarlo y elegir otra salida`);
      const dir = join(workRoot, id);
      if (existsSync(dir)) throw new Error(`Carpeta de trabajo existente: ${dir}; conservarla y elegir otra salida`);
      mkdirSync(join(dir, "node_modules/trama-ui"), { recursive: true });
      writeFileSync(join(dir, "package.json"), JSON.stringify({ name: id, private: true, dependencies: { "trama-ui": "0.13.0", react: "19.3.0", next: "16.3.5" } }, null, 2));
      execFileSync("git", ["init", "--quiet"], { cwd: dir });
      if (condition === "proposed_skills") {
        cpSync(source, join(dir, "node_modules/trama-ui"), { recursive: true });
        execFileSync(process.execPath, [join(dir, "node_modules/trama-ui/bin/trama-ui.mjs"), "skills", "install", "--client", client], { cwd: dir, stdio: "pipe" });
      } else {
        for (const name of ["dist", "assets", "bin", "package.json", "README.md", "LICENSE"]) cpSync(join(source, name), join(dir, "node_modules/trama-ui", name), { recursive: true });
        writeFileSync(join(dir, "node_modules/trama-ui/CATALOG.md"), condition === "updated_documentation" ? readFileSync(join(source, "CATALOG.md"), "utf8") : legacy);
      }
      const imageNote = task.id === "reference" && client === "claude" ? " La captura adjunta está en ./reference.png; léela con la herramienta de lectura." : "";
      if (imageNote) cpSync(reference, join(dir, "reference.png"));
      const prompt = `Encargo de evaluación independiente. Consulta solo ${dir}; no leas otros ensayos ni el repo padre. No instales dependencias, no uses red ni escribas archivos. El evaluador guardará tu respuesta y compilará/renderizará tu fuente con dependencias fijas.\n${condition === "proposed_skills" ? "Usa las skills Trama disponibles y las referencias de tu versión instalada, consultando solo lo necesario." : "Usa la documentación actual de node_modules/trama-ui/CATALOG.md y sus declaraciones públicas, buscando solo piezas relevantes."}${imageNote}\n\n${task.prompt}\n\nDevuelve únicamente un JSON con tsx (código para Result.tsx) y brief (Markdown de decisiones/límites). Export default un componente React con props {mode:'book'|'appointments';bookHref:string;appointmentsHref:string;storageKey:string;artSrc:string}. No crees rutas Next; el evaluador adapta estas props. Solo imports públicos de trama-ui y React; estilos inline y clases del kit, sin archivos CSS. Si necesitas interacción usa 'use client'. Pasa textos propios, usa CSS/GuideFrame del paquete y no copies assets internos de demos. Debe renderizar en 1440x900 y 390x844. Conserva fuentes conocidas (${suite.fonts}) de la guía; ya se cargan en el evaluador. Verifica tu fuente lo que permitan las herramientas de lectura, declara lo que no hayas probado y termina con ese JSON.`;
      writeFileSync(join(dir, "prompt.txt"), prompt);
      const response = join(dir, "response.json");
      let args: string[];
      if (client === "codex") {
        args = [cli, "exec", "--sandbox", "read-only", "--config", 'approval_policy="never"', "--json", "--ephemeral", "--skip-git-repo-check", "--cd", dir, "--output-schema", schema, "--output-last-message", response];
        if (task.id === "reference") args.push("--image", reference);
        args.push("--", prompt);
      } else {
        const tools = condition === "proposed_skills" ? ["Read", "Glob", "Grep", "Skill"] : ["Read", "Glob", "Grep"];
        args = ["-p", "--model", claudeModel, "--output-format", "stream-json", "--verbose", "--json-schema", JSON.stringify(schemaObject),
          "--setting-sources", "project,local", "--strict-mcp-config", "--no-session-persistence", "--permission-mode", "dontAsk", "--tools", ...tools];
      }
      const started = new Date().toISOString(); const clock = performance.now();
      const child = spawn(client === "codex" ? process.execPath : cli, args, { cwd: dir, windowsHide: true, stdio: [client === "claude" ? "pipe" : "ignore", "pipe", "pipe"] });
      if (client === "claude") child.stdin!.end(prompt);
      let stdout = "", stderr = "";
      child.stdout!.on("data", (chunk) => { stdout += String(chunk); appendFileSync(join(dir, "events.jsonl"), chunk); });
      child.stderr!.on("data", (chunk) => { stderr += String(chunk); appendFileSync(join(dir, "stderr.log"), chunk); });
      const exitCode = await new Promise<number | null>((done, reject) => { child.on("error", reject); child.on("close", done); });
      writeFileSync(join(dir, "events.jsonl"), stdout); writeFileSync(join(dir, "stderr.log"), stderr);
      const events = stdout.split(/\r?\n/).filter(Boolean).flatMap((line) => { try { return [JSON.parse(line)]; } catch { return []; } });
      let usage: unknown[] | null = null, model = "default-inherited-unreported", turns: number | null = null, costUsd: number | null = null;
      if (client === "codex") {
        const completed = events.filter((e) => e.type === "turn.completed").map((e) => e.usage);
        usage = completed.length ? completed : null;
      } else {
        const final = events.findLast((e) => e.type === "result");
        if (final) {
          const u = final.usage ?? {};
          // Mismos campos que Codex: input incluye lo leído de caché; cache_write aparte.
          usage = [{ input_tokens: (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0), cached_input_tokens: u.cache_read_input_tokens ?? 0,
            cache_write_input_tokens: u.cache_creation_input_tokens ?? 0, output_tokens: u.output_tokens ?? 0, reasoning_output_tokens: u.output_tokens_details?.thinking_tokens ?? 0 }];
          model = Object.keys(final.modelUsage ?? {}).join("+") || model;
          turns = final.num_turns ?? null; costUsd = final.total_cost_usd ?? null;
          if (final.structured_output) writeFileSync(response, JSON.stringify(final.structured_output));
          else if (typeof final.result === "string") { try { JSON.parse(final.result); writeFileSync(response, final.result); } catch { writeFileSync(join(dir, "raw-result.txt"), final.result); } }
        }
      }
      if (existsSync(response)) {
        try { const result = JSON.parse(readFileSync(response, "utf8")); if (typeof result.tsx === "string" && typeof result.brief === "string") { writeFileSync(join(dir, "Result.tsx"), result.tsx); writeFileSync(join(dir, "brief.md"), result.brief); } }
        catch { /* Queda como fallo de entrega con respuesta cruda conservada. */ }
      }
      const toolCalls = client === "claude" ? events.flatMap((e) => e.type === "assistant" ? (e.message?.content ?? []).filter((c: { type: string }) => c.type === "tool_use").map((c: { name: string }) => c.name) : []) : null;
      const record = { id, task: task.id, condition, repetition, startedAt: started, finishedAt: new Date().toISOString(), elapsedMs: Math.round(performance.now() - clock), exitCode,
        usage, sourceManifestSha256: digest(join(source, "package.json")), sourceTreeSha256, suite: suite.id, contractSha256, referenceSha256: task.id === "reference" ? digest(reference) : null,
        artifacts: { source: existsSync(join(dir, "Result.tsx")), brief: existsSync(join(dir, "brief.md")) }, terminalState: "pending-validation",
        ...(client === "claude" ? { turns, costUsd, toolCalls } : {}),
        configuration: { client: `${client}-cli`, version: clientVersion, model, modelOverride: client === "claude", sandbox: client === "codex" ? "read-only" : "tools-read-only", output: "json-schema", approval: client === "codex" ? "never" : "dontAsk", order: results.length + 1 },
      };
      writeFileSync(join(dir, "run.json"), JSON.stringify(record, null, 2) + "\n");
      if (dir !== record_dir) cpSync(dir, record_dir, { recursive: true });
      results.push(record);
      writeFileSync(join(out, "runs.json"), JSON.stringify(results, null, 2) + "\n");
      console.log(`${record.id}: CLI ${exitCode}; fuente=${record.artifacts.source}; ${Math.round(record.elapsedMs / 1000)}s (${results.length}/${total})`);
      const limit = events.some((event) => event.type === "turn.failed" ? /usage.limit|rate.limit|session limit/i.test(String(event.error?.message)) : event.type === "result" && event.is_error && /usage.limit|rate.limit|session limit/i.test(`${event.api_error} ${event.result}`));
      if (suite.id !== "salon" && !record.artifacts.source && limit) {
        console.log("Cliente sin cuota: se conserva el intento y se detiene la cohorte sin generar más ensayos vacíos.");
        break cohort;
      }
    }
  }
}
console.log(`Registradas ${results.length} de ${total} ejecuciones; falta adjudicación de tipos, navegador y revisión visual.`);
