import assert from "node:assert/strict";
import { bancoUrl } from "./base-url.mts";

const original = "http://localhost:3005/lab/cine/plain-sight?modo=1#escena";
assert.equal(bancoUrl(original), original);
assert.equal(bancoUrl(original, "http://127.0.0.1:3006"), "http://127.0.0.1:3006/lab/cine/plain-sight?modo=1#escena");
assert.equal(bancoUrl(original, "https://localhost:3006/"), "https://localhost:3006/lab/cine/plain-sight?modo=1#escena");
for (const base of ["", "no-url", "file:///tmp", "http://localhost:3006/ruta", "http://localhost:3006/?x=1", "http://localhost:3006/#x", "http://user:pass@localhost:3006"]) {
  assert.throws(() => bancoUrl(original, base));
}
console.log("base-url: valores por defecto, cambio de origen y rechazo de bases inválidas correctos");
