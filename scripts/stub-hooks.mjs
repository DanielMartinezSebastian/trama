// Hooks ESM de scripts/stub-register.mjs: CSS y next/font se resuelven a un módulo vacío.
const STUB = "data:text/javascript,export default new Proxy({}, { get: () => () => ({ variable: '', className: '', style: {} }) });";
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("next/font") || specifier.endsWith(".css") || specifier.startsWith("swiper/css")) return { url: STUB, shortCircuit: true };
  return next(specifier, context);
}
