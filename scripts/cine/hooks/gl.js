/*
 * Gancho de la API gráfica de `cine:capture` (docs/34 §1): cuenta, fotograma a fotograma, lo que la página le pide a la
 * GPU, sin depender del motor (three, un motor propio o ninguno). `renderer.info` de three no basta: los motores propios
 * lo reinician a su manera o pintan con varios renderers, y una web sin three no lo tiene.
 *   WebGL: llamadas de dibujo (drawArrays/drawElements y sus versiones instanciadas), instancias, triángulos (según la
 *          primitiva), puntos y líneas; y las pasadas: cada cambio de framebuffer abre una, con el tamaño del viewport.
 *   WebGPU: cada render pass es una pasada (con el tamaño de su primer adjunto) y cada draw/drawIndexed una llamada.
 * `__cineGL.frame()` devuelve el último fotograma completo.
 */
(() => {
  if (window.__cineGL) return;
  let actual = null;
  let ultimo = null;
  const nuevo = () => ({ calls: 0, tris: 0, instancias: 0, puntos: 0, lineas: 0, pasadas: [] });
  const pasada = (destino, w, h) => {
    if (!actual) actual = nuevo();
    const p = { destino, w, h, calls: 0, tris: 0 };
    actual.pasadas.push(p);
    return p;
  };
  let abierta = null;
  const cuenta = (modo, n, inst, gl) => {
    if (!actual) actual = nuevo();
    if (!abierta) abierta = pasada("?", gl ? gl.drawingBufferWidth : 0, gl ? gl.drawingBufferHeight : 0);
    const i = inst || 1;
    actual.calls++;
    abierta.calls++;
    actual.instancias += i;
    // 4 TRIANGLES, 5 TRIANGLE_STRIP, 6 TRIANGLE_FAN, 0 POINTS, 1 LINES, 2 LINE_LOOP, 3 LINE_STRIP
    let t = 0;
    if (modo === 4) t = Math.floor(n / 3) * i;
    else if (modo === 5 || modo === 6) t = Math.max(0, n - 2) * i;
    else if (modo === 0) actual.puntos += n * i;
    else actual.lineas += n * i;
    actual.tris += t;
    abierta.tris += t;
  };
  // fotograma: se cierra en cada vuelta de requestAnimationFrame (también con el reloj virtual, que lo sustituye)
  const tick = () => {
    if (actual) ultimo = actual;
    actual = null;
    abierta = null;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  for (const Ctx of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!Ctx) continue;
    const p = Ctx.prototype;
    const da = p.drawArrays, de = p.drawElements;
    p.drawArrays = function (m, f, n) {
      cuenta(m, n, 1, this);
      return da.apply(this, arguments);
    };
    p.drawElements = function (m, n) {
      cuenta(m, n, 1, this);
      return de.apply(this, arguments);
    };
    if (p.drawArraysInstanced) {
      const dai = p.drawArraysInstanced, dei = p.drawElementsInstanced;
      p.drawArraysInstanced = function (m, f, n, inst) {
        cuenta(m, n, inst, this);
        return dai.apply(this, arguments);
      };
      p.drawElementsInstanced = function (m, n, t, o, inst) {
        cuenta(m, n, inst, this);
        return dei.apply(this, arguments);
      };
    }
    // las pasadas: cada framebuffer que se enlaza; el tamaño, el del viewport que se fija después
    const bf = p.bindFramebuffer, vp = p.viewport;
    const ids = new WeakMap();
    let siguiente = 1;
    p.bindFramebuffer = function (target, fb) {
      if (target !== this.READ_FRAMEBUFFER) {
        const id = fb ? (ids.has(fb) ? ids.get(fb) : (ids.set(fb, "fb" + siguiente), "fb" + siguiente++)) : "pantalla";
        abierta = pasada(id, this.drawingBufferWidth, this.drawingBufferHeight);
      }
      return bf.apply(this, arguments);
    };
    p.viewport = function (x, y, w, h) {
      if (abierta && abierta.calls === 0) (abierta.w = w), (abierta.h = h);
      return vp.apply(this, arguments);
    };
    // ANGLE_instanced_arrays (WebGL1): la extensión trae sus propias funciones
    const ext = p.getExtension;
    p.getExtension = function (nombre) {
      const e = ext.apply(this, arguments);
      if (e && nombre === "ANGLE_instanced_arrays" && !e.__cine) {
        e.__cine = true;
        const a = e.drawArraysInstancedANGLE.bind(e), b = e.drawElementsInstancedANGLE.bind(e);
        const gl = this;
        e.drawArraysInstancedANGLE = (m, f, n, inst) => (cuenta(m, n, inst, gl), a(m, f, n, inst));
        e.drawElementsInstancedANGLE = (m, n, t, o, inst) => (cuenta(m, n, inst, gl), b(m, n, t, o, inst));
      }
      return e;
    };
  }

  if (window.GPUCommandEncoder) {
    const tamanos = new WeakMap();
    const cv = GPUTexture.prototype.createView;
    GPUTexture.prototype.createView = function () {
      const v = cv.apply(this, arguments);
      tamanos.set(v, [this.width, this.height]);
      return v;
    };
    // cada dibujo va a la pasada de SU codificador: three abre las pasadas de un fotograma antes de grabar los dibujos
    // (docs/34 §1), así que «la última pasada abierta» las juntaría todas
    const dePasada = new WeakMap();
    const brp = GPUCommandEncoder.prototype.beginRenderPass;
    GPUCommandEncoder.prototype.beginRenderPass = function (desc) {
      const c = desc && desc.colorAttachments && desc.colorAttachments[0];
      const s = (c && tamanos.get(c.view)) || [0, 0];
      const p = pasada(c && c.view && c.view.label ? c.view.label : "gpu", s[0], s[1]);
      const enc = brp.apply(this, arguments);
      dePasada.set(enc, p);
      return enc;
    };
    const RP = GPURenderPassEncoder.prototype;
    const conPasada = (enc, f) => {
      const antes = abierta;
      abierta = dePasada.get(enc) || abierta;
      f();
      abierta = antes;
    };
    const d = RP.draw, di = RP.drawIndexed;
    RP.draw = function (n, inst) {
      conPasada(this, () => cuenta(4, n, inst || 1, null));
      return d.apply(this, arguments);
    };
    RP.drawIndexed = function (n, inst) {
      conPasada(this, () => cuenta(4, n, inst || 1, null));
      return di.apply(this, arguments);
    };
  }

  window.__cineGL = {
    /** el último fotograma completo: totales y pasadas (destino, tamaño, llamadas y triángulos de cada una) */
    frame: () => (ultimo ? { calls: ultimo.calls, tris: ultimo.tris, instancias: ultimo.instancias, puntos: ultimo.puntos, lineas: ultimo.lineas, pasadas: ultimo.pasadas.filter((p) => p.calls > 0).map((p) => ({ destino: p.destino, w: p.w, h: p.h, calls: p.calls, tris: p.tris })) } : null),
  };
})();
