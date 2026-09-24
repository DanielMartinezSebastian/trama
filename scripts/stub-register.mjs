// Permite leer el catálogo fuera de Next (scripts de scripts/): el CSS y next/font no existen en Node,
// así que se sustituyen por módulos vacíos, tanto para imports ESM como para los require() que genera tsx.
import Module, { register } from "node:module";

register("./stub-hooks.mjs", import.meta.url);

const fontStub = new Proxy({}, { get: () => () => ({ variable: "", className: "", style: {} }) });
const load = Module._load;
Module._load = function (request, parent, isMain) {
  if (request.startsWith("next/font")) return fontStub;
  if (request.endsWith(".css") || request === "swiper/css" || request.startsWith("swiper/css/")) return {};
  return load.call(this, request, parent, isMain);
};
