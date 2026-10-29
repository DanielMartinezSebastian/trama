import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { catalog } from "../lib/catalog/catalog";
import { RECETAS_SECTOR } from "../lib/catalog/sectores";
import { STYLE_GUIDES } from "../lib/ui/guides";
import { defaultsOf, snippet } from "../lib/catalog/schema";
import { knowledgeOutputs, selectPilot } from "./agent-knowledge.mts";
import { resolvePublicExport } from "./package-surface.mts";
import "./agent-evaluation-suites.test.mts";

const { entries, recipe } = selectPilot(catalog, RECETAS_SECTOR, STYLE_GUIDES);
assert.equal(recipe.id, "salon");
assert(entries.some((e) => e.component === "BookingFlow"));
assert.throws(() => selectPilot(catalog, RECETAS_SECTOR, []), /Guía inexistente/);
assert.throws(() => selectPilot(catalog.filter((e) => e.component !== "BookingFlow"), RECETAS_SECTOR, STYLE_GUIDES), /Pieza inexistente/);
assert.throws(() => selectPilot(catalog, [], STYLE_GUIDES), /exactamente una/);
assert.throws(() => selectPilot(catalog.map((e) => e.component === "BookingFlow" ? { ...e, id: "../inválido" } : e), RECETAS_SECTOR, STYLE_GUIDES), /ID de pieza no válido/);
assert.throws(() => selectPilot(catalog.map((e) => e.component === "BookingFlow" ? { ...e, path: "@/components/ui/NoExiste" } : e), RECETAS_SECTOR, STYLE_GUIDES), /Destino inexistente/);
assert.throws(() => selectPilot(catalog, [...RECETAS_SECTOR, recipe], STYLE_GUIDES), /exactamente una/);
assert.throws(() => resolvePublicExport("otra-lib/Button"), /No es un import/);
assert.throws(() => resolvePublicExport("trama-ui/../privado"), /Import no exportado/);
assert.equal(resolvePublicExport("trama-ui/fonts").types, "./dist/lib/ui/fonts.d.ts");
assert.equal(resolvePublicExport("trama-ui/Button").types, "./dist/components/ui/Button.d.ts");

const outputs = knowledgeOutputs(catalog, RECETAS_SECTOR, STYLE_GUIDES);
const booking = outputs.get("docs/agents/types/components/ui/BookingFlow.d.ts")!;
const commerce = outputs.get("docs/agents/types/lib/commerce/booking.d.ts")!;
assert.match(booking, /onBooked\?: \(a: Appointment\) => void/);
assert.match(booking, /services: BookingService\[\]/);
assert.match(commerce, /export type BookingService =/);
assert.match(commerce, /minutes: number/);
assert(!outputs.get("docs/agents/components/guide-frame.json")!.includes('"key": "children"')); // no control del visor; sí existe en la API
assert.match(outputs.get("docs/agents/types/components/ui/GuideFrame.d.ts")!, /children: ReactNode/);
const frame = catalog.find((e) => e.component === "GuideFrame")!;
const frameCode = snippet(frame, defaultsOf(frame));
assert(!frameCode.includes("title="));
assert.match(frameCode, /<h1 className="ui-g-h1">/);
for (const [path, content] of outputs) {
  if (path.endsWith(".md")) {
    for (const [, href] of content.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(href)) continue;
      const target = resolve(dirname(path), href);
      assert([...outputs.keys()].some((p) => resolve(p) === target), `${path} → enlace roto ${href}`);
    }
  }
  if (path.endsWith(".json")) {
    const card = JSON.parse(content);
    for (const source of card.sources) assert(existsSync(source.path), `Procedencia ausente: ${source.path}`);
    assert.equal(card.status, "pilot");
    assert.equal(card.validation.browserFlow, "not-certified-by-generation");
  }
  if (path.endsWith(".tsx.txt")) {
    assert(!content.includes("@/"));
    assert(!content.includes("/img/hebra/"));
  }
}
assert.equal(readFileSync("docs/agents/index.json", "utf8"), outputs.get("docs/agents/index.json"));
console.log("✓ contrato piloto: referencias, fallos de selección, exports, callbacks/objetos y límites de validación correctos");
