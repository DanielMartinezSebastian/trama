/**
 * Arrastre con inercia para «mover la vista» (no un elemento suelto): ratón, dedo, flechas y, si se pide, la rueda.
 * Lo comparten `DragGrid` (rejilla infinita) y `ExplorableCanvas` (mundo con límites). El componente decide qué
 * significa la posición: aquí solo se calcula y se entrega en `apply(x, y)` en cada fotograma.
 *
 * - El puntero se captura solo cuando el gesto pasa el umbral, así un toque sigue siendo un clic en lo que haya dentro.
 * - Un arrastre no dispara el clic de los enlaces o botones de dentro.
 * - Con `reduced` no hay inercia ni deriva: las flechas saltan en vez de deslizar.
 */
export type DragPanOptions = {
  /** pinta la posición (px) */
  apply: (x: number, y: number) => void;
  /** recorta la posición a los límites del mundo; sin él, la vista es infinita */
  clamp?: (x: number, y: number) => [number, number];
  /** inercia al soltar: 0 = se para en seco · 0,8 = frena rápido · 0,97 = desliza mucho */
  inertia?: number;
  /** recorrido de cada pulsación de flecha (px; Mayús ×3). 0 = sin teclado */
  keyStep?: number;
  /** deriva lenta automática (px por segundo hacia la izquierda); se detiene al tocar */
  drift?: number;
  /** la rueda también desplaza (captura el scroll de la página mientras el puntero está encima) */
  wheel?: boolean;
  /** px que hay que mover antes de que cuente como arrastre */
  threshold?: number;
  /** `prefers-reduced-motion` */
  reduced?: boolean;
  /** posición inicial */
  start?: [number, number];
};

export type DragPan = {
  get: () => { x: number; y: number };
  /** coloca la vista sin animación */
  set: (x: number, y: number) => void;
  /** lleva la vista a una posición con una animación corta (salta si hay movimiento reducido) */
  to: (x: number, y: number, ms?: number) => void;
  destroy: () => void;
};

export function attachDragPan(el: HTMLElement, o: DragPanOptions): DragPan {
  const inertia = o.reduced ? 0 : (o.inertia ?? 0.93);
  const threshold = o.threshold ?? 5;
  const keyStep = o.keyStep ?? 120;
  let [x, y] = o.start ?? [0, 0];
  let vx = 0, vy = 0;
  let dragging = false, captured = false, pid = 0, moved = 0, lastX = 0, lastY = 0;
  let raf = 0, last = 0;
  let drifting = (o.drift ?? 0) > 0 && !o.reduced;
  let tween: { fx: number; fy: number; tx: number; ty: number; t0: number; ms: number } | null = null;

  const put = (nx: number, ny: number) => {
    [x, y] = o.clamp ? o.clamp(nx, ny) : [nx, ny];
    o.apply(x, y);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (tween) {
      const k = Math.min(1, Math.max(0, (now - tween.t0) / tween.ms));
      const e = 1 - Math.pow(1 - k, 3);
      put(tween.fx + (tween.tx - tween.fx) * e, tween.fy + (tween.ty - tween.fy) * e);
      if (k >= 1) tween = null;
    } else if (!dragging) {
      const k = Math.pow(inertia, dt * 60);
      vx *= k;
      vy *= k;
      put(x + vx - (drifting ? (o.drift ?? 0) * dt : 0), y + vy);
    }
    const alive = !!tween || dragging || Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05 || drifting;
    raf = alive ? requestAnimationFrame(frame) : 0;
  };
  const kick = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const halt = () => {
    tween = null;
    drifting = false;
    vx = vy = 0;
  };

  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    halt();
    dragging = true;
    captured = false;
    moved = 0;
    pid = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const move = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (!captured) {
      if (moved < threshold) return;
      // se captura el puntero solo al empezar a arrastrar: antes desviaría el clic de los enlaces de dentro
      captured = true;
      el.setPointerCapture(pid);
      el.setAttribute("data-drag", "");
    }
    vx = dx;
    vy = dy;
    put(x + dx, y + dy);
  };
  const up = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    el.removeAttribute("data-drag");
    if (!captured || !inertia) vx = vy = 0;
    kick();
  };
  // un arrastre no es un clic
  const click = (e: MouseEvent) => {
    if (moved > threshold) {
      e.preventDefault();
      e.stopPropagation();
    }
    moved = 0;
  };
  const wheelH = (e: WheelEvent) => {
    e.preventDefault();
    halt();
    if (!inertia) return put(x - e.deltaX, y - e.deltaY);
    vx -= e.deltaX * 0.08;
    vy -= e.deltaY * 0.08;
    kick();
  };
  const keys = (e: KeyboardEvent) => {
    if (!keyStep || (e.target as HTMLElement).closest("input, textarea, select")) return;
    const s = keyStep * (e.shiftKey ? 3 : 1);
    const d = ({ ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] } as Record<string, [number, number]>)[e.key];
    if (!d) return;
    e.preventDefault();
    halt();
    if (!inertia) return put(x + d[0], y + d[1]);
    // la velocidad que, frenando con la inercia, recorre justo `s`
    vx = d[0] * (1 - inertia);
    vy = d[1] * (1 - inertia);
    kick();
  };

  el.addEventListener("pointerdown", down);
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("click", click, true);
  el.addEventListener("keydown", keys);
  if (o.wheel) el.addEventListener("wheel", wheelH, { passive: false });
  put(x, y);
  if (drifting) kick();

  return {
    get: () => ({ x, y }),
    set: (nx, ny) => {
      halt();
      put(nx, ny);
    },
    to: (tx, ty, ms = 700) => {
      halt();
      if (o.reduced) return put(tx, ty);
      tween = { fx: x, fy: y, tx, ty, t0: performance.now(), ms };
      kick();
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("keydown", keys);
      el.removeEventListener("wheel", wheelH);
    },
  };
}
