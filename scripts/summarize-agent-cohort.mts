/** Resume una cohorte congelada sin reescribir ensayos ni imputar tokens ausentes. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type Usage = { input_tokens: number; cached_input_tokens: number; output_tokens: number; reasoning_output_tokens?: number };
type Run = { id: string; task: string; condition: string; repetition: number; elapsedMs: number; exitCode: number | null; usage: Usage[] | null; configuration: object; contractSha256: string };
type Validation = { id: string; status: string; details: string[]; validationMs: number };
const dir = resolve(process.argv[2] ?? ".cache/agent-evaluation-boutique");
const consumer = resolve(process.argv[3] ?? ".cache/agent-pilot-boutique");
const output = resolve(process.argv[4] ?? "docs/evolucion-agentes/evaluacion-boutique-evidencia.json");
const read = (file: string) => JSON.parse(readFileSync(file, "utf8"));
const sha = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const path = (file: string) => relative(process.cwd(), file).replace(/\\/g, "/");
const manifest = read(join(dir, "cohort.json"));
const runs = read(join(dir, "runs.json")) as Run[];
const validation = read(join(dir, "validation.json"));
const install = read(join(consumer, "pilot-install.json"));
const visualFile = join(dir, "visual-review.json");
const visual = existsSync(visualFile) ? read(visualFile) : null;
const records = runs.map((run) => {
  assert.equal(run.contractSha256, manifest.contractSha256, `Contrato distinto en ${run.id}`);
  const adjudication = (validation.records as Validation[]).find((v) => v.id === run.id);
  assert(adjudication, `Falta adjudicación de ${run.id}`);
  const tokens = run.usage?.length ? run.usage.reduce((sum, u) => ({ input: sum.input + u.input_tokens, cachedInput: sum.cachedInput + u.cached_input_tokens, output: sum.output + u.output_tokens, reasoning: sum.reasoning + (u.reasoning_output_tokens ?? 0) }), { input: 0, cachedInput: 0, output: 0, reasoning: 0 }) : null;
  const files = ["Result.tsx", "brief.md", "events.jsonl", "run.json"].filter((name) => existsSync(join(dir, run.id, name))).map((name) => ({ path: path(join(dir, run.id, name)), sha256: sha(join(dir, run.id, name)) }));
  return { id: run.id, task: run.task, condition: run.condition, repetition: run.repetition, generationMs: run.elapsedMs,
    cliExit: run.exitCode, configuration: run.configuration, tokens, adjudication,
    visual: visual?.records?.find((v: { id: string }) => v.id === run.id) ?? { status: "pending" }, files };
});
const conditionNames: Record<string, string> = { docs: "current_documentation", updated: "updated_documentation", pilot: "proposed_skills" };
const summary = (manifest.contract.conditions as string[]).map((name) => {
  const condition = conditionNames[name];
  const all = records.filter((r) => r.condition === condition);
  const executed = all.filter((r) => r.adjudication.status !== "not-run-infrastructure");
  const withTokens = executed.filter((r) => r.tokens !== null);
  const mean = <T,>(items: T[], get: (item: T) => number) => items.length ? items.reduce((sum, item) => sum + get(item), 0) / items.length : null;
  return { condition, planned: manifest.contract.suite.tasks.length * 2, registered: all.length, executed: executed.length,
    passed: executed.filter((r) => r.adjudication.status.startsWith("passed-")).length,
    failed: executed.filter((r) => r.adjudication.status === "failed").length,
    pendingValidation: executed.filter((r) => !r.adjudication.status.startsWith("passed-") && r.adjudication.status !== "failed").length,
    infrastructure: all.length - executed.length, tokenSamples: withTokens.length,
    mean: { generationMs: mean(executed, (r) => r.generationMs), input: mean(withTokens, (r) => r.tokens!.input),
      uncachedInput: mean(withTokens, (r) => r.tokens!.input - r.tokens!.cachedInput), output: mean(withTokens, (r) => r.tokens!.output) } };
});
const evidence = { schemaVersion: 1, generatedAt: new Date().toISOString(), cohort: manifest, package: install,
  inputs: [join(dir, "cohort.json"), join(dir, "runs.json"), join(dir, "validation.json"), join(consumer, "pilot-install.json"), ...(existsSync(visualFile) ? [visualFile] : [])].map((file) => ({ path: path(file), sha256: sha(file) })),
  sharedBuildMs: validation.sharedBuildMs ?? validation.buildMs ?? null, browser: validation.browser ?? null,
  humanReview: visual?.humanReview ?? "pending", summary, records };
writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
