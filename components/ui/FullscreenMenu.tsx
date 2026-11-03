"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getLenis, lockScroll } from "@/lib/motion/lenis";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";

export type FullscreenMenuLink = {
  label: string;
  href: string;
  /** texto pequeño a un lado (p. ej. «12 proyectos») */
  meta?: string;
  /** con `linkHover="marquee"`: la frase que corre en la banda (por defecto, `meta` o la etiqueta) */
  marquee?: string;
  /** con `linkHover="marquee"`: fotos que aparecen en píldoras entre las frases */
  images?: string[];
};

export type FullscreenMenuProps = {
  links: FullscreenMenuLink[];
  /** nombre de la marca, solo para el texto accesible del menú (y para la fila superior propia si no hay cabecera) */
  brand?: string;
  /** texto del botón cerrado / abierto; los corchetes son parte del estilo editorial */
  openLabel?: string;
  closeLabel?: string;
  /** enlaces secundarios del pie del menú (redes, correo) */
  footer?: { label: string; href: string }[];
  /** texto libre a la izquierda del pie (ciudad, hora…) */
  note?: string;
  /** el botón: label = `[menu]` / `[close]` (editorial) · text = el texto sin corchetes, que rueda hacia arriba al cambiar ·
   * count = el texto con el número de enlaces volado · burger = dos rayas que se cruzan en ✕ al abrir · lines = tres rayas
   * desiguales que se igualan al pasar y se cruzan en ✕ · dots = rejilla de nueve puntos que se queda en ✕ · plus = una
   * cruz que gira a ✕ · ring = dos rayas dentro de un círculo fino · pill = píldora del acento con el texto y dos rayas
   * (en los de icono, los textos quedan como nombre accesible). El cierre de la fila propia del menú usa el mismo botón */
  trigger?: "label" | "text" | "count" | "burger" | "lines" | "dots" | "plus" | "ring" | "pill";
  /** el botón al pasar el ratón: none = cambia de color · fill = un relleno del acento baja desde arriba y el contenido pasa
   * al color del fondo (el botón de K72, medido con `refs:probe --par`: 0,15 s, easeOutCubic; docs/53 §5) */
  triggerHover?: "none" | "fill";
  /** con cabecera: el menú la cubre igualmente hasta arriba (la cabecera sigue encima, clicable) en vez de empezar debajo */
  cover?: boolean;
  /** fondo: solid = el del tema · blur = vidrio (el tema al 55 % y lo de detrás muy desenfocado) */
  backdrop?: "solid" | "blur";
  /** enlaces: start = a la izquierda, grotesca gruesa · center = centrados, en la tipografía de titulares (`--display`) */
  align?: "start" | "center";
  /** filetes entre los enlaces, que se dibujan de izquierda a derecha al abrir (Il Colorista, docs/50 §3.1) */
  rules?: boolean;
  /** al pasar por un enlace: color = cambia al acento · marquee = la fila gira y se vuelve una banda del acento con una
   * marquesina de su `marquee` o su `meta` y sus `images` (K72, docs/50 §3.9) · slide = se desplaza y asoma una flecha ·
   * dim = los demás enlaces se apagan */
  linkHover?: "color" | "marquee" | "slide" | "dim";
  /** cómo se abre: curtain = una cortina que baja · stairs = cinco columnas que bajan en escalera desde la derecha (K72) ·
   * circle = un círculo que crece desde el botón · slide = el panel entra desde su borde · fade = aparece y se asienta */
  reveal?: "curtain" | "stairs" | "circle" | "slide" | "fade";
  /** forma: full = toda la ventana · sheet = panel lateral a la derecha · drop = persiana desde arriba, del alto de los
   * enlaces · island = tarjeta flotante con margen y esquinas (abajo en el móvil) · split = dos columnas, enlaces y `aside`
   * (en el móvil, `aside` va entre los enlaces y el pie). sheet, drop e island velan la ventana entera, cabecera incluida,
   * y traen su propia fila de marca y cierre */
  layout?: "full" | "sheet" | "drop" | "island" | "split";
  /** color del panel: bg = el fondo del tema · acc = el acento, con el texto que mejor se lea encima · fg = invertido */
  tone?: "bg" | "acc" | "fg";
  /** tamaño de los enlaces: lg = gigantes · md = grandes · sm = de lista (por defecto, lg en full y split, sm en el resto) */
  size?: "sm" | "md" | "lg";
  /** número de orden (01, 02…) delante de cada enlace */
  numbered?: boolean;
  /** contenido propio del menú: una foto, una dirección, una llamada a la acción… */
  aside?: ReactNode;
  /** controlado desde fuera (opcional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Luminancia relativa de un color CSS cualquiera (lo resuelve el navegador). */
function luminance(color: string) {
  const el = document.createElement("i");
  el.style.color = color;
  document.body.appendChild(el);
  const m = getComputedStyle(el).color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  el.remove();
  const [r, g, b] = m.slice(0, 3).map((v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** De los candidatos, el que más contrasta con `bg` (tone="acc": el texto sobre el acento). Los primeros son los del
 * tema y ganan salvo que otro contraste claramente más. */
function inkOn(bg: string, candidates: (string | undefined)[]) {
  const lb = luminance(bg);
  let best = "#000", score = 0;
  for (const c of candidates) {
    if (!c) continue;
    const l = luminance(c);
    const r = (Math.max(l, lb) + 0.05) / (Math.min(l, lb) + 0.05);
    if (r > score + (score >= 4.5 ? 3 : 0)) { best = c; score = r; }
  }
  return best;
}

/** El enlace lleva a la página en la que ya estás (sin ancla): en vez de «navegar» a lo mismo, se sube al principio. */
function isHere(href: string) {
  try {
    const u = new URL(href, location.href);
    return u.origin === location.origin && u.pathname === location.pathname && u.search === location.search && !u.hash;
  } catch {
    return false;
  }
}

/** Algún ancestro (o él mismo) atraparía un `position: fixed` (transform, filter, backdrop-filter, contain…). */
function trapsFixed(el: Element | null) {
  for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
    const c = getComputedStyle(n);
    if (c.transform !== "none" || c.filter !== "none" || c.backdropFilter !== "none" || c.perspective !== "none" || /paint|layout|strict|content/.test(c.contain) || /transform|filter/.test(c.willChange)) return true;
  }
  return false;
}

/** Marca como `inert` todo lo que rodea a `keep` (hermanos de él y de sus ancestros), salvo el portal. Devuelve cómo deshacerlo. */
function inertAround(keep: Element, portal: Element | null) {
  const changed: Array<[Element, boolean]> = [];
  for (let node: Element | null = keep; node && node !== document.body; node = node.parentElement) {
    for (const sib of Array.from(node.parentElement?.children ?? [])) {
      if (sib === node || sib === portal || sib.contains(portal) || sib.tagName === "SCRIPT" || sib.tagName === "STYLE") continue;
      changed.push([sib, (sib as HTMLElement).inert]);
      (sib as HTMLElement).inert = true;
    }
  }
  return () => changed.forEach(([el, was]) => ((el as HTMLElement).inert = was));
}

/**
 * Botón `[menu]` que abre un menú a pantalla completa: la cortina baja y los enlaces suben uno a uno.
 *
 * **La cabecera no se mueve.** Si el botón está dentro de un `<header>` (o `role="banner"`), el menú se abre *debajo* de él:
 * la marca, la hora y el propio botón —que pasa de `[menu]` a `[close]` en el mismo sitio— siguen exactamente donde
 * estaban, y siguen siendo clicables. Así el usuario no ve saltar los elementos que ya conocía. Sin cabecera, el menú
 * cubre la ventana y trae su propia fila superior con la marca y `[close]`.
 *
 * Con `cover`, el menú llega hasta arriba aunque haya cabecera (la cabecera queda encima); con `backdrop="blur"` es de
 * vidrio; con `align="center"`, los enlaces van centrados en la tipografía de titulares; con `trigger="burger"`, el botón es
 * un icono (y con `triggerHover="fill"`, se rellena del acento al pasar); con `rules`, filetes que se dibujan; con `linkHover="marquee"`, cada fila gira a una banda con marquesina; con
 * `reveal="stairs"`, se abre en escalera. Un enlace a la página en la que ya estás (p. ej. «Inicio» en la portada) cierra el menú y sube al principio.
 *
 * Cierra con `Esc` y al elegir un enlace, pausa el scroll (sin que salte la página: ver `lockScroll`) y deja inerte el
 * resto de la página para que el teclado no llegue a lo que queda tapado. Se pinta en un portal con los tokens de tu tema.
 */
export default function FullscreenMenu({ links, brand = "", openLabel = "menu", closeLabel = "close", footer = [], note = "", trigger = "label", triggerHover = "none", cover = false, backdrop = "solid", align = "start", rules = false, linkHover = "color", reveal = "curtain", layout = "full", tone = "bg", size, numbered = false, aside, open: controlled, onOpenChange, className = "" }: FullscreenMenuProps) {
  const uid = useId();
  const [inner, setInner] = useState(false);
  const open = controlled ?? inner;
  const [mounted, setMounted] = useState(false);
  // el portal sale de la web: lleva sus tokens y su tipografía; y, si hay cabecera, empieza justo debajo de ella
  const [theme, setTheme] = useState<CSSProperties>();
  const [top, setTop] = useState<number | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  // reveal="circle": centro del botón, relativo al panel (el círculo crece desde ahí)
  const [origin, setOrigin] = useState<string | null>(null);
  // trigger="pill": el texto sobre el acento, el color del tema que mejor se lee
  const [pillInk, setPillInk] = useState<string>();
  useEffect(() => {
    if (trigger !== "pill" || !btn.current) return;
    const cs = getComputedStyle(btn.current);
    const acc = cs.getPropertyValue("--acc").trim();
    if (acc) setPillInk(inkOn(acc, [cs.getPropertyValue("--bg").trim(), cs.getPropertyValue("--fg").trim(), "#fff", "#000"]));
  }, [trigger]);
  // la cabecera se queda por encima del menú también mientras se cierra (la cortina tarda 0,8 s en recogerse): su z-index
  // original se devuelve al terminar, y si se vuelve a abrir antes, se cancela
  const hostZ = useRef<string | null>(null);
  const zTimer = useRef(0);
  const set = useCallback((v: boolean) => { setInner(v); onOpenChange?.(v); }, [onOpenChange]);
  // sheet, drop e island dejan ver la página, velada. El velo cubre la ventana entera, cabecera incluida: si la cabecera
  // quedara fuera, se vería un corte entre lo oscurecido y lo que no. Por eso no se abren debajo de la cabecera, sino
  // por encima de todo, con su propia fila de marca y cierre
  const veiled = layout === "sheet" || layout === "drop" || layout === "island";

  // dónde se pinta: en `document.body`, salvo con `cover` y cabecera: entonces junto a la cabecera, en su mismo contexto de
  // apilamiento (si la cabecera vive dentro de uno, como un contenedor con `isolation`, el menú del body la taparía).
  // Si algo ahí atraparía el `position: fixed`, vuelve al body
  const [target, setTarget] = useState<Element | null>(null);
  useEffect(() => {
    setMounted(true);
    const h = btn.current?.closest<HTMLElement>('header, [role="banner"]') ?? null;
    setTarget(cover && !veiled && h?.parentElement && !trapsFixed(h.parentElement) ? h.parentElement : document.body);
  }, [cover, veiled]);

  useEffect(() => {
    if (!open) return;
    const trigger = btn.current;
    const p = panel.current;
    if (trigger) {
      const t = themeSnapshot(trigger) as Record<string, string>;
      if (tone === "acc" && t["--acc"]) t["--fsm-ink"] = inkOn(t["--acc"], [t["--bg"], t["--fg"], "#fff", "#000"]);
      setTheme(t as CSSProperties);
    }
    const host = veiled ? null : trigger?.closest<HTMLElement>('header, [role="banner"]') ?? null;
    setTop(host ? Math.round(host.getBoundingClientRect().bottom) : null);
    const unlock = lockScroll();
    // aviso a lo fijo de la página (la barra de acciones se aparta mientras el menú está abierto)
    document.documentElement.setAttribute("data-fsm-open", "");

    // con cabecera: sube por encima del menú (que queda debajo) y deja inerte lo demás; sin ella, atrapa el foco en el menú
    clearTimeout(zTimer.current);
    let restoreInert: (() => void) | undefined;
    if (host) {
      if (hostZ.current === null) hostZ.current = host.style.zIndex;
      host.style.zIndex = "9001";
      restoreInert = inertAround(host, root.current ?? p ?? null);
    }
    const t = host ? 0 : window.setTimeout(() => p?.querySelector<HTMLElement>(".ui-fsm__close")?.focus(), 50);

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return set(false);
      if (host || e.key !== "Tab" || !p) return;
      const f = Array.from(p.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      clearTimeout(t);
      restoreInert?.();
      document.documentElement.removeAttribute("data-fsm-open");
      if (host) {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        zTimer.current = window.setTimeout(() => {
          host.style.zIndex = hostZ.current ?? "";
          hostZ.current = null;
        }, reduce ? 0 : 850);
      }
      unlock();
      trigger?.focus({ preventScroll: true });
    };
  }, [open, set, tone, veiled]);

  const hosted = top !== null && !veiled;
  const iconOnly = trigger === "burger" || trigger === "lines" || trigger === "dots" || trigger === "plus" || trigger === "ring";
  const inkStyle = pillInk ? ({ "--fsm-pill-ink": pillInk } as CSSProperties) : undefined;
  // el contenido del botón; el abierto se pinta también en el cierre de la fila propia del menú
  const face = (isOpen: boolean) => {
    // el botón es el mismo abierto y cerrado y no cambia de tamaño: los dos textos ocupan la misma celda y solo se ve uno
    const swap = (a: string, b: string) => (
      <span className="ui-fsm__lbl">
        <span style={{ visibility: isOpen ? "hidden" : "visible" }} aria-hidden={isOpen || undefined}>{a}</span>
        <span style={{ visibility: isOpen ? "visible" : "hidden" }} aria-hidden={!isOpen || undefined}>{b}</span>
      </span>
    );
    switch (trigger) {
      case "burger":
      case "ring":
        return <span className="ui-fsm__burger" aria-hidden><i /><i /></span>;
      case "lines":
        return <span className="ui-fsm__lines" aria-hidden><i /><i /><i /></span>;
      case "dots":
        return <span className="ui-fsm__dots" aria-hidden>{Array.from({ length: 9 }, (_, k) => <i key={k} />)}</span>;
      case "plus":
        return <span className="ui-fsm__plus" aria-hidden><i /><i /></span>;
      case "pill":
        return <>{swap(openLabel, closeLabel)}<span className="ui-fsm__burger" aria-hidden><i /><i /></span></>;
      case "text":
        // los dos textos en una columna que rueda: sube el que se va y entra el otro desde abajo
        return (
          <span className="ui-fsm__roll">
            <span aria-hidden={isOpen || undefined}>{openLabel}</span>
            <span aria-hidden={!isOpen || undefined}>{closeLabel}</span>
          </span>
        );
      case "count":
        return <>{swap(openLabel, closeLabel)}<sup className="ui-fsm__count" aria-hidden>{links.length}</sup></>;
      default:
        return swap(`[${openLabel}]`, `[${closeLabel}]`);
    }
  };
  const linkSize = size ?? (layout === "full" || layout === "split" ? "lg" : "sm");
  const overlay = (
    <div ref={root} className="ui-fsm-root" style={{ ...theme, ...(hosted ? { "--fsm-top": `${top}px` } : null), ...(origin ? { "--fsm-o": origin } : null) } as CSSProperties}>
      {veiled && <div className="ui-fsm__veil" data-open={open ? "" : undefined} aria-hidden onClick={() => set(false)} />}
    <div
      ref={panel}
      id={`${uid}-menu`}
      className={`ui-fsm ${className}`.trim()}
      data-open={open ? "" : undefined}
      data-host={hosted ? "" : undefined}
      data-cover={hosted && cover ? "" : undefined}
      data-backdrop={backdrop}
      data-align={align}
      data-rules={rules ? "" : undefined}
      data-hover={linkHover}
      data-reveal={reveal}
      data-layout={layout}
      data-tone={tone}
      data-size={linkSize}
      data-numbered={numbered ? "" : undefined}
      role="dialog"
      aria-modal={hosted ? undefined : true}
      aria-label={brand ? `Menú de ${brand}` : "Menú"}
      aria-hidden={!open}
      inert={!open}
    >
      {reveal === "stairs" && (
        <span className="ui-fsm__stairs" aria-hidden>
          {[0, 1, 2, 3, 4].map((k) => (
            <i key={k} style={{ "--k": 4 - k } as CSSProperties} />
          ))}
        </span>
      )}
      {!hosted && (
        <div className="ui-fsm__top">
          <span>{brand}</span>
          <button type="button" className={`ui-fsm__btn ui-fsm__btn--${trigger} ui-fsm__close`} style={inkStyle} aria-label={iconOnly ? closeLabel : undefined} onClick={() => set(false)}>
            {face(true)}
          </button>
        </div>
      )}
      <nav className="ui-fsm__nav" aria-label="Principal">
        {links.map((l, i) => (
          <div key={l.href + i} className="ui-fsm__item" style={{ "--i": i } as CSSProperties}>
            <a
              className="ui-fsm__link"
              href={l.href}
              style={{ "--i": i } as CSSProperties}
              onClick={(e) => {
                const here = isHere(l.href);
                if (here) e.preventDefault();
                set(false);
                // al principio, después de cerrar (al cerrar se devuelve el scroll a donde estaba)
                if (here) setTimeout(() => { const lenis = getLenis(); if (lenis) lenis.scrollTo(0, { duration: 1.2 }); else scrollTo({ top: 0, behavior: "smooth" }); }, 80);
              }}
            >
              {numbered && <em className="ui-fsm__num" aria-hidden>{String(i + 1).padStart(2, "0")}</em>}
              <span>{l.label}</span>
              {l.meta && <small>{l.meta}</small>}
            </a>
            {linkHover === "marquee" && (
              <span className="ui-fsm__band" aria-hidden>
                <span className="ui-fsm__track">
                  {Array.from({ length: 8 }, (_, k) => (
                    <span key={k}>
                      {l.marquee || l.meta || l.label}
                      {l.images?.length ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.images[k % l.images.length]} alt="" loading="lazy" />
                      ) : (
                        <b />
                      )}
                    </span>
                  ))}
                </span>
              </span>
            )}
          </div>
        ))}
      </nav>
      {aside != null && <div className="ui-fsm__aside">{aside}</div>}
      <div className="ui-fsm__foot">
        <span>{note}</span>
        <span style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {footer.map((f, i) => (
            <a key={`${f.href}-${i}`} href={f.href}>{f.label}</a>
          ))}
        </span>
      </div>
    </div>
    </div>
  );

  // el centro del botón respecto al panel, para que el círculo crezca desde él (el panel ya tiene su caja aunque esté oculto)
  const aim = () => {
    if (reveal !== "circle") return;
    const b = btn.current?.getBoundingClientRect();
    const p = panel.current?.getBoundingClientRect();
    if (b && p) setOrigin(`${Math.round(b.left + b.width / 2 - p.left)}px ${Math.round(b.top + b.height / 2 - p.top)}px`);
  };

  return (
    <>
      <button ref={btn} type="button" className={`ui-fsm__btn ui-fsm__btn--${trigger}`} style={inkStyle} data-hover={triggerHover === "none" ? undefined : triggerHover} aria-label={iconOnly ? (open ? closeLabel : openLabel) : undefined} aria-expanded={open} aria-controls={`${uid}-menu`} aria-haspopup="dialog" onClick={() => { if (!open) { const h = btn.current?.closest<HTMLElement>('header, [role="banner"]'); setTop(h ? Math.round(h.getBoundingClientRect().bottom) : null); requestAnimationFrame(aim); } else aim(); set(!open); }}>
        {face(open)}
      </button>
      {mounted && target ? createPortal(overlay, target) : null}
    </>
  );
}
