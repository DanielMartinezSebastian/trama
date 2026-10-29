import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, symlinkSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const project = resolve(process.argv[2] ?? ".cache/agent-pilot");
const pkgRoot = join(project, "node_modules/trama-ui");
const cli = join(pkgRoot, "bin/trama-ui.mjs");
const invoke = (...args: string[]) => execFileSync(process.execPath, [cli, ...args], { cwd: project, encoding: "utf8", stdio: "pipe" });
const before = existsSync(join(project, "AGENTS.md")) ? readFileSync(join(project, "AGENTS.md")) : null;
for (const client of ["codex", "claude"]) {
  invoke("skills", "install", "--client", client);
  invoke("skills", "install", "--client", client); // Idempotencia real.
  const base = join(project, client === "codex" ? ".agents/skills" : ".claude/skills");
  for (const name of ["trama-build", "trama-style", "trama-research"]) {
    assert(readFileSync(join(base, name, "SKILL.md")).equals(readFileSync(join(pkgRoot, "skills", name, "SKILL.md"))));
    const context = JSON.parse(execFileSync(process.execPath, [join(base, name, "scripts/context.mjs"), "--cwd", project], { encoding: "utf8" }));
    assert.equal(context.version, "0.13.0");
    assert.equal(context.scope, "pilot");
  }
  const custom = join(base, "trama-build/SKILL.md");
  const original = readFileSync(custom);
  try {
    writeFileSync(custom, Buffer.concat([original, Buffer.from("\nAdaptación local de prueba.\n")]));
    assert.throws(() => invoke("skills", "install", "--client", client), /Conflicto de skill/);
    assert(readFileSync(custom, "utf8").includes("Adaptación local de prueba."));
  } finally { writeFileSync(custom, original); }
}
if (before) assert(readFileSync(join(project, "AGENTS.md")).equals(before));
else assert(!existsSync(join(project, "AGENTS.md")));
const scopeFixture = mkdtempSync(join(dirname(project), "install-scope-"));
const outside = join(scopeFixture, "outside"); mkdirSync(outside);
const fakeProject = join(scopeFixture, "project"); mkdirSync(join(fakeProject, "node_modules/trama-ui"), { recursive: true });
writeFileSync(join(fakeProject, "package.json"), '{"private":true}');
writeFileSync(join(fakeProject, "node_modules/trama-ui/package.json"), JSON.stringify({ name: "trama-ui", version: "0.13.0", exports: { "./package.json": "./package.json" } }));
symlinkSync(outside, join(fakeProject, ".agents"), "junction");
assert.throws(() => invoke("skills", "install", "--client", "codex", "--project", fakeProject), /Destino enlazado/);
assert.deepEqual(readdirSync(outside), []);
const digest = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
assert.equal(digest(join(pkgRoot, "knowledge/index.json")), digest("docs/agents/index.json"));
console.log("✓ paquete instalado, knowledge exacto, contexto local, adaptadores Codex/Claude, idempotencia y conservación de cambios/instrucciones");
