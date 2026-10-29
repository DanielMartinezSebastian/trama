import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { EVALUATION_SUITES, evaluationSuite } from "./agent-evaluation-suites.mts";

// Compatibilidad con el protocolo histórico, sin reescribir las respuestas ni sus encargos.
const historical = execFileSync("git", ["show", "5abd496:scripts/evaluate-agents.mts"], { encoding: "utf8" });
const oldTasks = [...historical.matchAll(/\{ id: "(composition|reference|booking)", prompt: ("(?:[^"\\]|\\.)*") \}/g)].map((m) => ({ id: m[1], prompt: JSON.parse(m[2]) }));
assert.equal(oldTasks.length, 3);
assert.deepEqual(evaluationSuite("salon").tasks, oldTasks, "P4 conserva exactamente sus encargos");
for (const id of ["desconocida", "__proto__", "toString"]) assert.throws(() => evaluationSuite(id), /desconocida/);
for (const suite of Object.values(EVALUATION_SUITES)) {
  assert.deepEqual(suite.tasks.map((t) => t.id), ["composition", "reference", "booking"]);
  assert(suite.tasks.every((task) => task.prompt.includes(`Guía ${suite.guide}`)));
  assert(suite.compositionContent.every((word) => suite.tasks[0].prompt.includes(word)));
  assert.match(suite.reference, /^\.refs3d\//);
  assert.match(suite.artSrc, /^\/images\/[a-z-]+\.svg$/);
}
console.log("✓ suites de evaluación: encargos P4 conservados, selección estricta y criterios completos");
