/** Regenera P4 desde runs.json y ambas adjudicaciones; conserva las anotaciones visuales y hashes históricos. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [original = ".cache/agent-evaluation-json", fixed = ".cache/agent-evaluation-json-glyph", output = "docs/evolucion-agentes/evaluacion-evidencia.json"] = process.argv.slice(2);
const read = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const evidence = read(output);
const runs = read(join(original, "runs.json"));
const validations = [original, fixed].map((dir) => read(join(dir, "validation.json")));
const byId = (records: { id: string }[], id: string) => {
  const record = records.find((r) => r.id === id);
  if (!record) throw new Error(`Falta adjudicación de ${id}`);
  return record;
};
evidence.generatedAt = new Date().toISOString();
evidence.validation.sharedBuildMs = { original: validations[0].sharedBuildMs, fixed: validations[1].sharedBuildMs };
evidence.validation.sources = [original, fixed].map((dir) => `${dir}/validation.json`);
evidence.runs = runs.map((run: { id: string; task: string; condition: string; repetition: number; elapsedMs: number; exitCode: number; configuration: { order: number }; usage: { input_tokens: number; cached_input_tokens: number; output_tokens: number; reasoning_output_tokens: number }[] | null }) => {
  const previous = evidence.runs.find((r: { id: string }) => r.id === run.id);
  const usage = run.usage?.[0];
  const adjudication = validations.map((v) => {
    const r = byId(v.records, run.id) as { id: string; status: string; details: string[] };
    return { status: r.status, details: r.details };
  });
  return { id: run.id, task: run.task, condition: run.condition, repetition: run.repetition, order: run.configuration.order,
    generationMs: run.elapsedMs, cliExit: run.exitCode,
    tokens: usage ? { input: usage.input_tokens, cachedInput: usage.cached_input_tokens, output: usage.output_tokens, reasoning: usage.reasoning_output_tokens } : "no disponible",
    fonts: previous?.fonts ?? null, originalPackage: adjudication[0], fixedPackage: adjudication[1] };
});
const passed = (record: { status: string }) => record.status.startsWith("passed-");
evidence.summary = ["current_documentation", "proposed_skills"].map((condition) => {
  const records = evidence.runs.filter((r: { condition: string; tokens: unknown }) => r.condition === condition && typeof r.tokens === "object");
  const mean = (get: (r: typeof records[number]) => number) => records.reduce((s: number, r: typeof records[number]) => s + get(r), 0) / records.length;
  return { condition, executed: records.length, passedOriginal: records.filter((r: typeof records[number]) => passed(r.originalPackage)).length,
    passedFixed: records.filter((r: typeof records[number]) => passed(r.fixedPackage)).length,
    generationMs: mean((r) => r.generationMs), input: mean((r) => r.tokens.input), uncachedInput: mean((r) => r.tokens.input - r.tokens.cachedInput), output: mean((r) => r.tokens.output) };
});
writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence.summary, null, 2));
