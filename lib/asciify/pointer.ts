import type { Pointer } from "./painters";

/**
 * Sigue el puntero sobre un elemento (coordenadas normalizadas 0..1).
 * Si no hay puntero real, se mueve sola en piloto automático para que los
 * fondos sigan vivos en móviles o antes de tocar nada.
 */
export function createPointerTracker(el: HTMLElement) {
  const pointer: Pointer = { x: 0.5, y: 0.5, down: false, active: false };
  let tx = 0.5;
  let ty = 0.5;
  let inside = false;

  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width;
    ty = (e.clientY - r.top) / r.height;
    inside = true;
  };
  const leave = () => {
    inside = false;
    pointer.down = false;
  };
  const down = (e: PointerEvent) => {
    move(e);
    pointer.down = true;
  };
  const up = () => {
    pointer.down = false;
  };

  el.addEventListener("pointermove", move);
  el.addEventListener("pointerdown", down);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointerleave", leave);
  el.addEventListener("pointercancel", leave);

  return {
    pointer,
    /** Actualiza la posición suavizada; llamar una vez por fotograma. */
    update(time: number) {
      pointer.active = inside;
      if (!inside) {
        tx = 0.5 + Math.sin(time * 0.37) * 0.32;
        ty = 0.5 + Math.sin(time * 0.53 + 1.3) * 0.28;
      }
      const k = inside ? 0.3 : 0.05;
      pointer.x += (tx - pointer.x) * k;
      pointer.y += (ty - pointer.y) * k;
    },
    destroy() {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
    },
  };
}
