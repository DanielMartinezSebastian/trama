import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// Artefactos sintéticos aislados y conservados para inspección; nunca tocan una cohorte real.
const root = resolve(".cache/cohort-summary-tests");
mkdirSync(root, { recursive: true });
const dir = mkdtempSync(join(root, "fixture-"));
const consumer = join(dir, "consumer");
mkdirSync(consumer);
const write = (name: string, data: unknown) => writeFileSync(join(dir, name), JSON.stringify(data));
write("cohort.json", { contractSha256: "synthetic-fixture", contract: { conditions: ["updated", "pilot"], suite: { tasks: ["composition", "reference", "booking"] } } });
writeFileSync(join(consumer, "pilot-install.json"), JSON.stringify({ syntheticFixture: true }));
const cases = [
  { id: "passed", condition: "updated_documentation", status: "passed-automated-pending-visual", time: 1000, usage: [{ input_tokens: 100, cached_input_tokens: 30, output_tokens: 10 }] },
  { id: "quota", condition: "updated_documentation", status: "not-run-infrastructure", time: 3000, usage: null },
  { id: "failed-without-usage", condition: "proposed_skills", status: "failed", time: 2000, usage: null },
];
write("runs.json", cases.map((c) => ({ id: c.id, task: "composition", condition: c.condition, repetition: 1, elapsedMs: c.time, exitCode: 0, usage: c.usage, configuration: {}, contractSha256: "synthetic-fixture" })));
write("validation.json", { records: cases.map((c) => ({ id: c.id, status: c.status, details: [], validationMs: 1 })) });
const output = join(dir, "summary.json");
execFileSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), "scripts/summarize-agent-cohort.mts", dir, consumer, output], { stdio: "pipe", windowsHide: true });
const summary = JSON.parse(readFileSync(output, "utf8")).summary;
assert.equal(summary[0].executed, 1);
assert.equal(summary[0].infrastructure, 1);
assert.equal(summary[0].mean.generationMs, 1000, "No promedia el intento sin turno");
assert.equal(summary[0].mean.uncachedInput, 70);
assert.equal(summary[1].failed, 1, "El fallo sin datos de uso sí cuenta");
assert.equal(summary[1].tokenSamples, 0);
assert.equal(summary[1].mean.input, null, "No inventa cero tokens para datos ausentes");
assert.equal(summary[1].mean.generationMs, 2000);
console.log("✓ resumen de cohortes: cuota excluida, fallos conservados y tokens ausentes sin imputación");
