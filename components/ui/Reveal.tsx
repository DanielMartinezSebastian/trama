"use client";

import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export const REVEAL_KINDS = ["fade", "slide", "scale", "blur", "wipe", "flip", "iris"] as const;
export type RevealKind = (typeof REVEAL_KINDS)[number];
export type RevealDirection = "up" | "down" | "left" | "right";
export type RevealEasing = "out" | "in-out" | "back" | "linear";

export type RevealProps = {
  /** efecto; `rise` (= slide hacia arriba) y `stagger` (= slide + escalonado 0,12 s) se mantienen por compatibilidad */
  kind?: RevealKind | "rise" | "stagger";
  /** hacia dónde se mueve el contenido al entrar (slide, wipe, flip) */
  direction?: RevealDirection;
  /** distancia en px de slide (y del ligero desplazamiento de blur) */
  distance?: number;
  duration?: number;
  delay?: number;
  easing?: RevealEasing;
  /** segundos entre hijos directos (0 = todo el bloque a la vez) */
  stagger?: number;
  /** trocea un texto plano en palabras o letras y las escalona (solo si `children` es texto) */
  split?: "none" | "words" | "chars";
  /** `mount`: al montar · `inview`: al entrar en pantalla · `scroll`: el progreso sigue al scroll (scrub) */
  trigger?: "mount" | "inview" | "scroll";
  /** con `inview`: solo la primera vez (true) o cada vez que vuelve a entrar (false) */
  once?: boolean;
  /** con `inview`: fracción visible (0–1) necesaria para disparar */
  threshold?: number;
  /** con `inview`: margen del viewport (rootMargin); el valor por defecto dispara un poco antes del borde inferior */
  margin?: string;
  /** etiqueta del contenedor */
  as?: "div" | "section" | "article" | "header" | "footer" | "ul" | "ol" | "li" | "p" | "span" | "h1" | "h2" | "h3" | "h4";
  /** cambia para volver a lanzar la animación desde fuera */
  playKey?: number;
  onReveal?: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const EASE: Record<RevealEasing, string> = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  back: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  linear: "linear",
};

/** Desplazamiento inicial, lado recortado y giro de cada dirección («up» = entra subiendo). */
const DIR: Record<RevealDirection, { dx: number; dy: number; clip: string; rot: [string, string]; origin: string }> = {
  up: { dx: 0, dy: 1, clip: "--rv-ct", rot: ["--rv-rx", "55deg"], origin: "50% 100%" },
  down: { dx: 0, dy: -1, clip: "--rv-cb", rot: ["--rv-rx", "-55deg"], origin: "50% 0%" },
  left: { dx: 1, dy: 0, clip: "--rv-cl", rot: ["--rv-ry", "-55deg"], origin: "100% 50%" },
  right: { dx: -1, dy: 0, clip: "--rv-cr", rot: ["--rv-ry", "55deg"], origin: "0% 50%" },
};

/** Parte un texto en unidades animables sin tocar el DOM de React (a diferencia de SplitText, guía §10). */
function splitText(text: string, mode: "words" | "chars") {
  return text.split(/(\s+)/).map((part, i) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return part;
    if (mode === "words") return <span key={i} className="ui-rv__u" aria-hidden>{part}</span>;
    return (
      <span key={i} className="ui-rv__word" aria-hidden>
        {Array.from(part).map((c, j) => <span key={j} className="ui-rv__u">{c}</span>)}
      </span>
    );
  });
}

/**
 * Revela su contenido al montar, al entrar en pantalla o siguiendo el scroll. Siete efectos × cuatro direcciones,
 * escalonado de hijos o de palabras/letras, y repetición al volver a entrar.
 *
 * Todo lo mueve una variable CSS registrada (`--rv-p`, 0 → 1, `@property` en ui-kit.css) que cada efecto traduce
 * a opacidad, desplazamiento, recorte… El estado oculto viene ya en el HTML del servidor (sin parpadeo antes de
 * hidratar); la animación es de la Web Animations API sobre `--rv-p` (sin GSAP, y sin tocar el `transition` de los
 * hijos); el modo scroll reutiliza las mismas fórmulas. Sin JS (`<noscript>`) o con movimiento reducido el contenido
 * se ve tal cual. Al terminar, las reglas del efecto dejan de aplicarse: no queda transform/filter/clip-path que
 * atrape a un `Modal`/`Drawer` (position: fixed) de dentro.
 */
export default function Reveal({
  kind = "slide",
  direction = "up",
  distance = 40,
  duration = 0.8,
  delay = 0,
  easing = "out",
  stagger,
  split = "none",
  trigger = "inview",
  once = true,
  threshold = 0.2,
  margin = "0px 0px -10% 0px",
  as: Tag = "div",
  playKey = 0,
  onReveal,
  children,
  className = "",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  const effect: RevealKind = kind === "rise" || kind === "stagger" ? "slide" : kind;
  const step = stagger ?? (kind === "stagger" ? 0.12 : split !== "none" ? (split === "chars" ? 0.03 : 0.08) : 0);
  const text = typeof children === "string" ? children : Children.toArray(children).every((c) => typeof c === "string" || typeof c === "number") ? Children.toArray(children).join("") : null;
  const splitMode = split !== "none" && text !== null ? split : "none";
  const mode = splitMode === "chars" ? "chars" : splitMode === "words" || step > 0 ? "each" : "self";
  const d = DIR[direction];
  const count = Children.count(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Unidades animadas: el propio contenedor, sus hijos directos o las palabras/letras
    const units = (): HTMLElement[] =>
      mode === "self" ? [el] : Array.from(el.querySelectorAll<HTMLElement>(mode === "chars" ? ":scope > .ui-rv__word > .ui-rv__u" : ":scope > :not(.ui-rv__sr)"));
    const items = units();
    items.forEach((it, i) => it.style.setProperty("--rv-i", String(i)));
    el.style.setProperty("--rv-n", String(items.length));
    // En modo scroll el escalonado se reparte dentro del recorrido: la última unidad empieza al 40 %
    el.style.setProperty("--rv-k", trigger === "scroll" && step > 0 && items.length > 1 ? String(0.6 / (items.length - 1)) : "0");

    let fired = false;
    let anims: Animation[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = () => {
      if (fired) return;
      fired = true;
      onRevealRef.current?.();
    };
    const stop = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
    };
    // Estado final estático (data-rv="1") + una animación de --rv-p 0 → 1 por unidad con su retardo; `fill:
    // backwards` mantiene el 0 durante el retardo. Al acabar todas, data-rv-done retira las reglas del efecto.
    const show = () => {
      stop();
      el.removeAttribute("data-rv-done");
      el.dataset.rv = "1";
      reveal();
      if (reduced || typeof el.animate !== "function") return el.setAttribute("data-rv-done", "");
      anims = items.map((it, i) =>
        it.animate([{ "--rv-p": "0" }, { "--rv-p": "1" }] as Keyframe[], {
          duration: duration * 1000,
          delay: (delay + i * step) * 1000,
          easing: EASE[easing],
          fill: "backwards",
        }),
      );
      const current = anims;
      Promise.all(current.map((a) => a.finished)).then(
        () => current === anims && el.setAttribute("data-rv-done", ""),
        () => {}, // cancelada: la sustituye otra
      );
    };
    const hide = () => {
      stop();
      el.removeAttribute("data-rv-done");
      el.dataset.rv = "0";
    };

    const cleanups: Array<() => void> = [stop];
    if (trigger === "scroll") {
      stop();
      el.removeAttribute("data-rv-done");
      el.dataset.rv = "scroll";
      let raf = 0;
      const update = () => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 cuando el borde superior asoma por abajo, 1 cuando llega al 25 % superior de la pantalla
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
        el.style.setProperty("--rv-t", p.toFixed(4));
        if (p >= 1) reveal();
      };
      const onScroll = () => (raf ||= requestAnimationFrame(update));
      update();
      // captura: también los scroll de contenedores internos (p. ej. el escenario del catálogo)
      window.addEventListener("scroll", onScroll, { capture: true, passive: true });
      window.addEventListener("resize", onScroll);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll, { capture: true });
        window.removeEventListener("resize", onScroll);
        el.style.removeProperty("--rv-t");
      });
    } else if (trigger === "inview") {
      hide();
      const showNow = () => {
        stop();
        el.dataset.rv = "1";
        el.setAttribute("data-rv-done", "");
        reveal();
      };
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            show();
            if (once) disconnect();
          } else if (!once && el.dataset.rv === "1") hide();
        },
        { threshold, rootMargin: margin },
      );
      // Si queda por encima sin haberse visto (recarga a mitad de página, enlace con #ancla, salto de scroll), el
      // observer principal no avisa: no cruza ningún umbral. Este segundo, con el viewport extendido hacia arriba,
      // sí; se muestra sin animación para no encontrarse huecos vacíos al subir.
      const above = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && e.boundingClientRect.bottom <= 0 && el.dataset.rv !== "1") {
          showNow();
          if (once) disconnect();
        }
      }, { rootMargin: "100000px 0px 0px 0px" });
      const disconnect = () => {
        io.disconnect();
        above.disconnect();
      };
      io.observe(el);
      above.observe(el);
      cleanups.push(disconnect);
    } else {
      show();
    }
    return () => cleanups.forEach((f) => f());
  }, [effect, direction, distance, mode, trigger, once, threshold, margin, step, delay, duration, easing, playKey, text, count]);

  const vars = {
    "--rv-dur": `${duration}s`,
    "--rv-delay": `${delay}s`,
    "--rv-stagger": `${step}s`,
    "--rv-ease": EASE[easing],
    "--rv-dx": `${d.dx * distance}px`,
    "--rv-dy": `${d.dy * distance}px`,
    [d.clip]: "100%",
    [d.rot[0]]: d.rot[1],
    "--rv-origin": d.origin,
    ...style,
  } as CSSProperties;

  const content =
    splitMode !== "none" && text !== null ? (
      <>
        <span className="ui-rv__sr">{text}</span>
        {splitText(text, splitMode)}
      </>
    ) : (
      children
    );

  return (
    <>
      {/* Sin JS no hay quien quite el estado oculto que viene del servidor */}
      <noscript dangerouslySetInnerHTML={{ __html: "<style>.ui-rv{--rv-t:1!important}</style>" }} />
      <Tag
        ref={ref as never}
        data-rv="0"
        className={`ui-rv ui-rv--${effect} ui-rv--${mode} ${className}`}
        style={vars}
      >
        {content}
      </Tag>
    </>
  );
}
