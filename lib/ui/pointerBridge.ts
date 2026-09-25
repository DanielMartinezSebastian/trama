/**
 * Puente de puntero para fondos con lienzo (textmode.js y asciify-engine).
 *
 * Ambos motores escuchan el puntero en SU lienzo. Cuando el fondo queda detrás del contenido (la situación normal de un fondo
 * de página), el lienzo no es el elemento bajo el puntero y nunca recibe nada. Este puente escucha en la ventana y reenvía al
 * lienzo lo que ocurre sobre él, con las mismas coordenadas de pantalla, de modo que el fondo reacciona aunque haya botones,
 * tarjetas o texto encima y sin bloquear ninguno: el lienzo puede llevar `pointer-events: none`.
 *
 * Se reenvía cada evento en sus dos formas — `pointer*` (asciify-engine) y `mouse*` (textmode.js escucha estos) — con
 * `bubbles: false`, para que no vuelvan a la ventana ni disparen manejadores de React. Solo se reenvía lo que cae dentro del
 * lienzo; al salir se envía un único `pointerleave`/`mouseleave`, como haría el navegador con un lienzo real.
 *
 * Devuelve la función que quita los listeners (llamarla al desmontar).
 */
export function bridgePointer(canvas: HTMLCanvasElement): () => void {
  let inside = false;

  const inCanvas = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };

  const fire = (pointerType: "pointermove" | "pointerdown" | "pointerup" | "pointerleave" | "pointercancel", src: PointerEvent) => {
    const init = { clientX: src.clientX, clientY: src.clientY, screenX: src.screenX, screenY: src.screenY, button: src.button, buttons: src.buttons, view: window, bubbles: false, cancelable: false };
    canvas.dispatchEvent(new PointerEvent(pointerType, { ...init, pointerId: src.pointerId, pointerType: src.pointerType, isPrimary: src.isPrimary, pressure: src.pressure, width: src.width, height: src.height }));
    const mouse = { pointermove: "mousemove", pointerdown: "mousedown", pointerup: "mouseup", pointerleave: "mouseleave" }[pointerType as string];
    if (mouse) canvas.dispatchEvent(new MouseEvent(mouse, init));
  };

  const leave = (src: PointerEvent) => {
    if (!inside) return;
    inside = false;
    fire("pointerleave", src);
  };

  const onMove = (e: PointerEvent) => {
    if (!e.isTrusted) return; // ignora los eventos sintéticos, incluidos los que este mismo puente crea
    if (inCanvas(e)) {
      inside = true;
      fire("pointermove", e);
    } else leave(e);
  };
  const onDown = (e: PointerEvent) => {
    if (e.isTrusted && inCanvas(e)) {
      inside = true;
      fire("pointerdown", e);
    }
  };
  // Soltar o cancelar se reenvía aunque haya salido del lienzo: así el motor no se queda con el botón «pulsado»
  const onUp = (e: PointerEvent) => {
    if (e.isTrusted && inside) fire("pointerup", e);
  };
  const onCancel = (e: PointerEvent) => {
    if (e.isTrusted) leave(e);
  };
  // El puntero sale de la ventana: no llega ningún pointermove más, hay que avisar al lienzo
  const onWindowOut = (e: MouseEvent) => {
    if (e.isTrusted && e.relatedTarget === null) leave(e as unknown as PointerEvent);
  };

  const opts = { passive: true } as const;
  window.addEventListener("pointermove", onMove, opts);
  window.addEventListener("pointerdown", onDown, opts);
  window.addEventListener("pointerup", onUp, opts);
  window.addEventListener("pointercancel", onCancel, opts);
  document.documentElement.addEventListener("mouseleave", onWindowOut, opts);
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onCancel);
    document.documentElement.removeEventListener("mouseleave", onWindowOut);
  };
}

/** Cómo recibe el puntero un fondo con lienzo. */
export type BackgroundInteraction = "canvas" | "window";
/** Cómo se coloca un fondo respecto a su contenedor. */
export type BackgroundPosition = "absolute" | "fixed";
