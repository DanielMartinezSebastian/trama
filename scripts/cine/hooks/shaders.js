/*
 * Gancho de shaders de `cine:capture` (docs/26): guarda el código final de cada shader que compila la página, sin duplicados.
 * WebGL: `shaderSource` (GLSL, con los #include de three ya expandidos). WebGPU: `GPUDevice.createShaderModule` (WGSL; si
 * la escena usa TSL, es el WGSL que genera). Es el código generado, no el de autor: sirve para reconocer técnicas (ruido,
 * trazado de rayos, número de muestras de un desenfoque), no para copiarlo.
 */
(() => {
  if (window.__cineShaders) return;
  const list = [];
  const seen = new Set();
  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return (h >>> 0).toString(16).padStart(8, "0");
  };
  const add = (lang, stage, code, label) => {
    if (typeof code !== "string") return;
    const id = hash(code);
    if (seen.has(id)) return;
    seen.add(id);
    list.push({ id, lang, stage, label: label || null, length: code.length, code });
  };

  for (const Ctx of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!Ctx) continue;
    const proto = Ctx.prototype;
    const create = proto.createShader;
    const source = proto.shaderSource;
    const stages = new WeakMap();
    proto.createShader = function (type) {
      const s = create.call(this, type);
      if (s) stages.set(s, type === this.VERTEX_SHADER ? "vertex" : "fragment");
      return s;
    };
    proto.shaderSource = function (shader, code) {
      add("glsl", stages.get(shader) || "?", code);
      return source.call(this, shader, code);
    };
  }

  if (window.GPUDevice) {
    const createModule = GPUDevice.prototype.createShaderModule;
    GPUDevice.prototype.createShaderModule = function (desc) {
      const code = desc && desc.code;
      const stage = typeof code === "string" ? (/@compute/.test(code) ? "compute" : /@vertex/.test(code) && /@fragment/.test(code) ? "vertex+fragment" : /@vertex/.test(code) ? "vertex" : /@fragment/.test(code) ? "fragment" : "?") : "?";
      add("wgsl", stage, code, desc && desc.label);
      return createModule.call(this, desc);
    };
  }

  window.__cineShaders = { list, count: () => list.length };
})();
