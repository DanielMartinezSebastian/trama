import { getLenis } from "./lenis";
import { CURVAS } from "./scroll-feel";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

/**
 * Salto a una sección de la misma página (`<a href="#precios">`) con un desplazamiento animado, también en el móvil y sin
 * Lenis (el scroll nativo `smooth` no deja elegir curva ni duración, y en muchos móviles ni anima). Descuenta la cabecera
 * fija o pegada, escribe el `#ancla` en la dirección sin saltar y pasa el foco a la sección para el teclado y los lectores.
 * Con «reducir movimiento», salta sin animar. Lo usa `SmoothScroll` (prop `anchors`).
 */
export type AnchorScrollOptions = {
  /** píxeles que se descuentan arriba, o "auto": la altura de la cabecera fija o pegada que haya arriba del todo */
  offset?: number | "auto";
  /** duración en segundos (por defecto, según la distancia: de 0,6 a 1,4 s) */
  duration?: number;
  /** curva (por defecto, expo.out: arranca rápido y se posa) */
  easing?: (t: number) => number;
};

/**
 * La cabecera fija o pegada arriba: la más baja de las que tocan el borde superior. Mira lo que hay en ese borde y,
 * además, las `header` y `[role=banner]` (con `pointer-events: none`, una cabecera transparente no sale en el punto).
 */
export function headerOffset(): number {
  let h = 0;
  const vistos = new Set<Element>();
  const mide = (el: Element | null) => {
    for (let e = el; e && e !== document.body && !vistos.has(e); e = e.parentElement) {
      vistos.add(e);
      const cs = getComputedStyle(e);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      const r = e.getBoundingClientRect();
      // una capa a pantalla completa (fondo fijo, menú abierto) no es una cabecera
      if (r.top <= 2 && r.bottom > 0 && r.height < window.innerHeight * 0.4 && cs.visibility !== "hidden") h = Math.max(h, r.bottom);
      return;
    }
  };
  document.elementsFromPoint(window.innerWidth / 2, 2).forEach(mide);
  document.querySelectorAll("header, [role='banner']").forEach(mide);
  return Math.round(h);
}

let tween = 0;

/** desplaza la página hasta `target` (elemento o `#id`) con la curva y la duración dadas */
export function scrollToAnchor(target: Element | string, opts: AnchorScrollOptions = {}): boolean {
  const el = typeof target === "string" ? document.getElementById(decodeURIComponent(target.replace(/^#/, ""))) : target;
  if (!el) return false;
  const offset = opts.offset === undefined || opts.offset === "auto" ? headerOffset() + 12 : opts.offset;
  const easing = opts.easing ?? CURVAS["expo.out"];
  const from = window.scrollY;
  const to = Math.max(0, Math.min(el.getBoundingClientRect().top + from - offset, document.documentElement.scrollHeight - window.innerHeight));
  const dist = Math.abs(to - from);
  const duration = opts.duration ?? Math.min(1.4, 0.6 + dist / 4000);
  const lenis = getLenis();
  cancelAnimationFrame(tween);
  if (prefersReducedMotion() || dist < 2) {
    if (lenis) lenis.scrollTo(to, { immediate: true });
    else window.scrollTo(0, to);
  } else if (lenis) {
    lenis.scrollTo(to, { duration, easing });
  } else {
    const t0 = performance.now();
    const paso = (now: number) => {
      const t = Math.min(1, (now - t0) / (duration * 1000));
      window.scrollTo(0, from + (to - from) * easing(t));
      if (t < 1) tween = requestAnimationFrame(paso);
    };
    tween = requestAnimationFrame(paso);
  }
  // foco para el teclado y los lectores de pantalla, sin otro salto
  if (!el.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute("tabindex", "-1");
  (el as HTMLElement).focus({ preventScroll: true });
  return true;
}

/** intercepta los clics en enlaces a una sección de la misma página; devuelve la función que lo quita */
export function installAnchorScroll(opts: AnchorScrollOptions = {}): () => void {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (!url.hash || url.hash === "#" || url.pathname !== location.pathname || url.search !== location.search) return;
    if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
    e.preventDefault();
    scrollToAnchor(url.hash, opts);
    history.replaceState(history.state, "", url.hash);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
