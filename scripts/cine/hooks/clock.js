/*
 * Reloj virtual de `cine:capture --exact` (docs/26). Sustituye `requestAnimationFrame`, `performance.now`, `Date.now` y
 * `new Date()` por un tiempo que solo avanza cuando la captura lo pide: `await __cineClock.step(n)` avanza n fotogramas de
 * 1/fps segundos y ejecuta los callbacks de cada uno. Así el vídeo sale a fotograma exacto aunque cada captura de pantalla
 * tarde 100 ms, y la referencia y el banco se comparan en el mismo instante.
 *
 * Hasta que la captura llama a `__cineClock.control()`, el reloj corre libre (la página carga y hace su intro en tiempo
 * real); con `control()` se congela en el instante actual. Desde el arranque (`__cineClockAuto` o `?cine-clock=start`) la
 * página carga en tiempo real pero su animación no empieza hasta el primer paso: la referencia y el banco arrancan igual.
 *
 * Las animaciones CSS y WAAPI no usan rAF: en cada paso se les pone el `currentTime` que les toca (aproximado: cuenta desde
 * que la captura las ve por primera vez).
 */
(() => {
  if (window.__cineClock) return;
  const realRAF = window.requestAnimationFrame.bind(window);
  const realCancel = window.cancelAnimationFrame.bind(window);
  const realNow = performance.now.bind(performance);
  const RealDate = Date;
  const realDateNow = Date.now;

  let controlled = false;
  let now = 0; // ms, en la escala de performance.now
  let epoch = 0; // Date.now() en el instante now = 0 del reloj virtual
  let fps = 60;
  let nextId = 1;
  let queue = new Map();
  let frames = 0;
  const animStart = new WeakMap();

  window.requestAnimationFrame = (cb) => {
    if (!controlled) return realRAF(cb);
    const id = nextId++;
    queue.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    if (!controlled) return realCancel(id);
    queue.delete(id);
  };
  performance.now = () => (controlled ? now : realNow());
  Date.now = () => (controlled ? epoch + now : realDateNow());
  // new Date() sin argumentos también sigue al reloj
  window.Date = new Proxy(RealDate, {
    construct(target, args) {
      return args.length ? new target(...args) : new target(Date.now());
    },
    apply(target) {
      return new target(Date.now()).toString();
    },
  });

  const syncAnimations = () => {
    if (!document.getAnimations) return;
    for (const a of document.getAnimations()) {
      if (!animStart.has(a)) {
        animStart.set(a, now - (a.currentTime ?? 0));
        a.pause();
      }
      a.currentTime = now - animStart.get(a);
    }
  };

  const nextRealFrame = () => new Promise((r) => realRAF(() => r()));

  window.__cineClock = {
    /** congela el reloj en el instante actual y toma el control */
    control(opts = {}) {
      if (controlled) return now;
      fps = opts.fps || fps;
      now = realNow();
      epoch = realDateNow() - now;
      controlled = true;
      return now;
    },
    /** avanza n fotogramas; espera dos fotogramas reales para que la GPU presente el lienzo antes de la captura */
    async step(n = 1) {
      for (let i = 0; i < n; i++) {
        now += 1000 / fps;
        frames++;
        const cbs = [...queue.values()];
        queue = new Map();
        for (const cb of cbs) {
          try {
            cb(now);
          } catch (e) {
            console.error("[cine] error en un callback de rAF", e);
          }
        }
        syncAnimations();
      }
      await nextRealFrame();
      await nextRealFrame();
      return { now, frames };
    },
    get now() {
      return now;
    },
    get controlled() {
      return controlled;
    },
  };

  // la captura lo pide con `window.__cineClockAuto = true` (otro script de arranque, antes de este) o con ?cine-clock=start
  if (window.__cineClockAuto || new URLSearchParams(location.search).get("cine-clock") === "start") window.__cineClock.control();
})();
