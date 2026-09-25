"use client";

import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";
import Button from "./Button";
import { renderGlyph } from "./Icon";
import { vcls, type Variant } from "./variants";

export type NavBarLayout = "classic" | "left" | "right" | "center" | "split" | "stacked" | "minimal";

export type NavBarProps = {
  brand?: string;
  /**
   * Enlaces. Simple: separados por comas ("Clases, Tablas, Precios"). Con submenús o descripciones: una sección por línea.
   * - `Etiqueta=/ruta` o `Etiqueta=#seccion` → enlace real (sin `=`, un botón que solo marca el activo)
   * - `Etiqueta [nuevo]` → insignia
   * - `Sección > Hijo; Hijo|descripción|icon:nombre; Hijo=/ruta` → submenú (hijos por `;`, campos por `|`)
   * - dentro de un submenú, `#Categoría` abre una columna con título: `Tienda > #Tablas; Softboard; Longboard; #Neoprenos; 3/2; 4/3`
   */
  links?: string;
  cta?: string;
  /** segunda llamada a la acción, más discreta ("Entrar") */
  secondaryCta?: string;
  onCta?: () => void;
  onSecondaryCta?: () => void;
  defaultActive?: number;
  /** click = el activo es el último pulsado · scroll = el de la sección visible (enlaces `=#id`) */
  activeOn?: "click" | "scroll";
  variant?: Variant;
  /**
   * disposición: classic = marca · enlaces · acciones · left = enlaces junto a la marca · right = enlaces junto a las acciones ·
   * center = enlaces centrados de verdad · split = marca en el centro · stacked = dos filas (arriba marca, búsqueda y
   * acciones; abajo las secciones) · minimal = marca y menú (siempre plegado)
   */
  layout?: NavBarLayout;
  /**
   * orden libre de las piezas (sustituye a `layout`): `brand links search actions spacer menu`, separadas por espacios.
   * `|` empieza otra fila y `/` separa columnas alineadas a izquierda, centro y derecha. Ej.: "brand / links / search actions"
   */
  slots?: string;
  /** forma de la barra: full = de borde a borde · contained = de borde a borde con el contenido centrado · floating = píldora ·
   * island = tarjeta con el radio de la variante (por defecto) · transparent = sin fondo (lo gana al bajar con sticky) · underline = solo una línea inferior */
  shape?: "full" | "contained" | "floating" | "island" | "transparent" | "underline";
  /** ocupa el ancho de la ventana aunque su contenedor sea más estrecho (para barras de borde a borde dentro de un layout con márgenes) */
  bleed?: boolean;
  /** @deprecated usa `shape="floating"` */
  floating?: boolean;
  /** densidad */
  size?: "sm" | "md" | "lg";
  /** con `layout="classic"`: dónde van los enlaces entre la marca y las acciones */
  linksAlign?: "start" | "center" | "end";
  /** auto = mega si algún hijo lleva descripción, icono o categoría · dropdown = lista · mega = panel ancho */
  menuStyle?: "auto" | "dropdown" | "mega";
  /** hover = se abren al pasar el ratón (y con clic/teclado) · click = solo con clic/teclado */
  openOn?: "hover" | "click";
  /** none · bar = barra de búsqueda ancha · inline = campo compacto · button = icono → paleta · command = botón «Buscar… ⌘K» → paleta */
  search?: "none" | "bar" | "inline" | "button" | "command";
  searchPlaceholder?: string;
  /** entradas extra de la búsqueda, además de los enlaces: "Cambiar contraseña=/cuenta, Estado del servicio=/status" */
  searchItems?: string;
  /** al elegir un resultado o un enlace; si no se pasa, los que tienen ruta navegan */
  onNavigate?: (item: { label: string; href?: string }) => void;
  /** al pulsar Enter en la búsqueda sin resultado elegido */
  onSearch?: (query: string) => void;
  /** ancho (px) del contenedor por debajo del cual se pliega en menú móvil · 0 = nunca */
  collapseAt?: number;
  /** drawer = panel lateral · sheet = hoja bajo la barra */
  mobileMenu?: "drawer" | "sheet";
  /** franja de anuncio sobre la barra ("" = sin franja) */
  announcement?: string;
  /** `position: sticky` arriba del contenedor con scroll */
  sticky?: boolean;
  /** con sticky: elevate = sombra y fondo al bajar · hide = se oculta al bajar y vuelve al subir */
  scrollFx?: "none" | "elevate" | "hide" | "elevate-hide";
  /** acciones propias junto a las llamadas a la acción (selector de tema, avatar…) */
  children?: ReactNode;
  className?: string;
};

type NavChild = { label: string; href?: string; desc?: string; icon?: string; badge?: string };
type NavGroup = { title?: string; items: NavChild[] };
type NavItem = NavChild & { groups: NavGroup[] };
type Token = "brand" | "links" | "search" | "actions" | "spacer" | "menu";

const LAYOUTS: Record<NavBarLayout, string> = {
  classic: "brand links search actions",
  left: "brand links spacer search actions",
  right: "brand spacer links search actions",
  center: "brand / links / search actions",
  split: "links / brand / search actions",
  stacked: "brand / search / actions | links",
  minimal: "brand spacer search menu",
};
const TOKENS = new Set<Token>(["brand", "links", "search", "actions", "spacer", "menu"]);

/** "brand / links | search" → filas → columnas → piezas */
function parseSlots(slots: string): Token[][][] {
  return slots
    .split("|")
    .map((row) =>
      row
        .split("/")
        .map((col) => col.trim().split(/\s+/).filter((t): t is Token => TOKENS.has(t as Token)))
        .filter((c) => c.length),
    )
    .filter((r) => r.length);
}

/** "Etiqueta [nuevo]=/ruta" → { label, badge, href } */
function parseLabel(raw: string): NavChild {
  let s = raw.trim();
  let href: string | undefined;
  const eq = s.indexOf("=");
  if (eq > 0) {
    href = s.slice(eq + 1).trim() || undefined;
    s = s.slice(0, eq).trim();
  }
  let badge: string | undefined;
  const m = s.match(/\s*\[([^\]]+)\]\s*$/);
  if (m) {
    badge = m[1];
    s = s.slice(0, m.index).trim();
  }
  return { label: s, href, badge };
}

function parseLinks(links: string): NavItem[] {
  const rows = (links.includes("\n") ? links.split("\n") : links.split(",")).map((r) => r.trim()).filter(Boolean);
  return rows.map((row) => {
    const gt = row.indexOf(">");
    const head = parseLabel(gt >= 0 ? row.slice(0, gt) : row);
    const groups: NavGroup[] = [];
    if (gt >= 0) {
      let cur: NavGroup = { items: [] };
      groups.push(cur);
      for (const raw of row.slice(gt + 1).split(";").map((c) => c.trim()).filter(Boolean)) {
        if (raw.startsWith("#") && !raw.includes("=")) {
          cur = { title: raw.slice(1).trim(), items: [] };
          groups.push(cur);
          continue;
        }
        const [title, ...rest] = raw.split("|").map((x) => x.trim());
        const child = parseLabel(title);
        for (const f of rest) {
          if (/^icon:/.test(f)) child.icon = f;
          else if (f) child.desc = f;
        }
        cur.items.push(child);
      }
    }
    return { ...head, groups: groups.filter((g) => g.items.length) };
  });
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type SearchEntry = { label: string; href?: string; path?: string };

/**
 * Barra de navegación: marca, enlaces con submenús (desplegable o mega menú, con categorías), búsqueda (barra, campo o paleta
 * ⌘K), menú móvil propio, anuncio, llamadas a la acción y comportamiento al hacer scroll. La disposición sale de `layout` o,
 * pieza a pieza, de `slots`; la forma, de `shape`; el aspecto, de la variante y del tema.
 * Los overlays (paleta, cajón móvil) salen a `document.body` con los tokens copiados: un ancestro con `backdrop-filter`
 * (la propia variante glass, una cabecera con blur) atraparía su `position: fixed`.
 */
export default function NavBar({
  brand = "Maré",
  links = "Clases > Iniciación|Grupos de seis y espuma blanda|icon:users; Perfeccionamiento|Vídeo-análisis de tus olas|icon:video; Privadas|Un monitor solo para ti|icon:user\nTienda > #Tablas; Softboard; Longboard; Shortboard; #Neoprenos; Primavera 3/2; Invierno 4/3; #Accesorios; Quillas; Leash; Parafina\nReservas=#reservas\nContacto [nuevo]",
  cta = "Reservar",
  secondaryCta = "",
  onCta,
  onSecondaryCta,
  defaultActive = 0,
  activeOn = "click",
  variant = "glass",
  layout = "classic",
  slots = "",
  shape,
  bleed = false,
  floating = false,
  size = "md",
  linksAlign = "center",
  menuStyle = "auto",
  openOn = "hover",
  search = "none",
  searchPlaceholder = "Buscar…",
  searchItems = "",
  onNavigate,
  onSearch,
  collapseAt = 760,
  mobileMenu = "drawer",
  announcement = "",
  sticky = false,
  scrollFx = "none",
  children,
  className = "",
}: NavBarProps) {
  const items = useMemo(() => parseLinks(links), [links]);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(defaultActive);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [announceOn, setAnnounceOn] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [portalStyle, setPortalStyle] = useState<CSSProperties>({});
  const closeTimer = useRef<number>(0);

  const barShape = shape ?? (floating ? "floating" : "island");
  const collapsed = narrow || layout === "minimal";
  const rows = useMemo(() => {
    if (collapsed) return parseSlots("brand spacer search menu");
    const r = parseSlots(slots || LAYOUTS[layout]);
    return r.length ? r : parseSlots(LAYOUTS.classic);
  }, [collapsed, slots, layout]);
  const hasSpacerRow = (row: Token[][]) => row.length > 1 || row[0].includes("spacer");

  useEffect(() => setActive(defaultActive), [defaultActive]);

  // plegado por ancho disponible (el del contenedor, no el de la ventana: vale igual dentro de una columna o una tarjeta)
  useEffect(() => {
    const parent = root.current?.parentElement;
    if (!parent || collapseAt <= 0) {
      setNarrow(false);
      return;
    }
    // medida inmediata al montar (sin esperar al primer aviso del observador, que en móvil dejaba ver un instante la
    // barra de escritorio) y después, a cada cambio de tamaño
    setNarrow(parent.getBoundingClientRect().width < collapseAt);
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < collapseAt));
    ro.observe(parent);
    return () => ro.disconnect();
  }, [collapseAt]);
  useEffect(() => {
    if (!collapsed) setMobileOpen(false);
    setOpenIdx(null);
  }, [collapsed]);

  // cerrar submenús al hacer clic fuera
  useEffect(() => {
    if (openIdx === null) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpenIdx(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openIdx]);

  // resaltar según la sección visible
  useEffect(() => {
    if (activeOn !== "scroll") return;
    const targets = items.map((it, i) => ({ i, el: it.href?.startsWith("#") ? document.getElementById(it.href.slice(1)) : null })).filter((t) => t.el);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = targets.find((x) => x.el === e.target);
            if (t) setActive(t.i);
          }
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t.el!));
    return () => io.disconnect();
  }, [activeOn, items]);

  // efectos de scroll: elevate/hide con sticky; transparent recupera el fondo al bajar
  useEffect(() => {
    const fx = sticky && scrollFx !== "none";
    if (!fx && barShape !== "transparent") return;
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 8);
      if (fx && (scrollFx === "hide" || scrollFx === "elevate-hide")) setHidden(y > last && y > 120);
      last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [sticky, scrollFx, barShape]);

  // paleta: ⌘K / Ctrl+K y «/» (fuera de campos de texto). En plegado, cualquier búsqueda abre la paleta.
  const usesPalette = search === "button" || search === "command" || (collapsed && search !== "none");
  const openPalette = useCallback(() => {
    if (root.current) setPortalStyle(themeSnapshot(root.current));
    setMobileOpen(false);
    setPaletteOpen(true);
  }, []);
  useEffect(() => {
    if (!usesPalette) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openPalette();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openPalette();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [usesPalette, openPalette]);

  const entries = useMemo<SearchEntry[]>(() => {
    const out: SearchEntry[] = [];
    for (const it of items) {
      out.push({ label: it.label, href: it.href });
      for (const g of it.groups) for (const c of g.items) out.push({ label: c.label, href: c.href, path: g.title ? `${it.label} › ${g.title}` : it.label });
    }
    for (const raw of (searchItems.includes("\n") ? searchItems.split("\n") : searchItems.split(",")).filter((s) => s.trim())) {
      const { label, href } = parseLabel(raw);
      out.push({ label, href });
    }
    return out;
  }, [items, searchItems]);

  const navigate = (item: { label: string; href?: string }, index?: number) => {
    if (index !== undefined) setActive(index);
    setOpenIdx(null);
    setMobileOpen(false);
    setPaletteOpen(false);
    if (onNavigate) onNavigate(item);
    else if (item.href) {
      if (item.href.startsWith("#")) document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
      else location.assign(item.href);
    }
  };

  const toggleMobile = () => {
    if (root.current) setPortalStyle(themeSnapshot(root.current));
    setMobileOpen((v) => !v);
  };

  const isMega = (it: NavItem) =>
    menuStyle === "mega" || (menuStyle === "auto" && (it.groups.length > 1 || it.groups.some((g) => g.title || g.items.some((c) => c.desc || c.icon))));
  const hasSub = (it: NavItem) => it.groups.length > 0;

  // teclado en un disparador de submenú: flecha abajo abre y entra; Escape cierra
  const onTriggerKey = (i: number) => (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenIdx(i);
      requestAnimationFrame(() => (document.getElementById(`${uid}-m${i}`)?.querySelector("a, button") as HTMLElement | null)?.focus());
    } else if (e.key === "Escape") setOpenIdx(null);
  };
  const onMenuKey = (i: number) => (e: ReactKeyboardEvent<HTMLElement>) => {
    const list = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a, button"));
    const at = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      list[(at + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
    } else if (e.key === "Escape") {
      setOpenIdx(null);
      document.getElementById(`${uid}-t${i}`)?.focus();
    }
  };

  const hoverOpen = (i: number) => () => {
    if (openOn !== "hover") return;
    window.clearTimeout(closeTimer.current);
    setOpenIdx(i);
  };
  const hoverClose = () => {
    if (openOn !== "hover") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenIdx(null), 160);
  };

  const inner = (c: NavChild, extra?: ReactNode) => (
    <>
      {extra}
      <span className="ui-nav__label">{c.label}</span>
      {c.badge && <span className="ui-nav__badge">{c.badge}</span>}
    </>
  );
  const linkEl = (c: NavChild, onPick: () => void, cls: string, current?: boolean, extra?: ReactNode) =>
    c.href ? (
      <a
        className={cls}
        href={c.href}
        aria-current={current ? "page" : undefined}
        data-current={current || undefined}
        onClick={(e) => {
          if (onNavigate || c.href!.startsWith("#")) e.preventDefault();
          onPick();
        }}
      >
        {inner(c, extra)}
      </a>
    ) : (
      <button type="button" className={cls} data-current={current || undefined} onClick={onPick}>
        {inner(c, extra)}
      </button>
    );

  const menuPanel = (it: NavItem, i: number) => {
    const mega = isMega(it);
    return (
      <div id={`${uid}-m${i}`} className={`ui-nav__menu ${mega ? "ui-nav__menu--mega" : "ui-nav__menu--list"} ui-surface ${vcls(variant)}`} onKeyDown={onMenuKey(i)}>
        <div className={`ui-nav__groups ${it.groups.some((g) => g.title) ? "ui-nav__groups--cols" : ""}`}>
          {it.groups.map((g, gi) => (
            <div key={gi} className="ui-nav__group">
              {g.title && <p className="ui-nav__gtitle">{g.title}</p>}
              <ul>
                {g.items.map((c, k) => (
                  <li key={c.label + k} className={mega && (c.desc || c.icon) ? "ui-nav__rich" : undefined}>
                    {linkEl(c, () => navigate(c, i), "ui-nav__mitem", false, mega && c.icon ? <span className="ui-nav__micon">{renderGlyph(c.icon, 18)}</span> : undefined)}
                    {mega && c.desc && <span className="ui-nav__mdesc">{c.desc}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const linksEl = (row: Token[][]) => (
    <ul className={`ui-nav__links ${hasSpacerRow(row) ? "" : `ui-nav__links--grow ui-nav__links--${linksAlign}`}`}>
      {items.map((it, i) =>
        hasSub(it) ? (
          <li key={it.label + i} className={`ui-nav__item ${isMega(it) ? "ui-nav__item--mega" : ""}`} onMouseEnter={hoverOpen(i)} onMouseLeave={hoverClose}>
            <button
              type="button"
              id={`${uid}-t${i}`}
              className="ui-nav__link ui-nav__trigger"
              aria-expanded={openIdx === i}
              aria-controls={`${uid}-m${i}`}
              data-current={i === active || undefined}
              onClick={() => setOpenIdx((v) => (v === i ? null : i))}
              onKeyDown={onTriggerKey(i)}
            >
              {inner(it)}
              <span className="ui-nav__chev" aria-hidden>
                {renderGlyph("icon:chevron-down", 14)}
              </span>
            </button>
            {openIdx === i && menuPanel(it, i)}
          </li>
        ) : (
          <li key={it.label + i} className="ui-nav__item">
            {linkEl(it, () => navigate(it, i), "ui-nav__link", i === active)}
          </li>
        ),
      )}
    </ul>
  );

  const searchEl =
    search === "none" ? null : usesPalette ? (
      search === "command" && !collapsed ? (
        <button type="button" className="ui-nav__search-btn" onClick={openPalette} aria-label={`${searchPlaceholder} (Ctrl+K)`}>
          {renderGlyph("icon:search", 16)}
          <span className="ui-nav__search-ph">{searchPlaceholder}</span>
          <kbd className="ui-nav__kbd">⌘K</kbd>
        </button>
      ) : (
        <button type="button" className="ui-nav__icon-btn" onClick={openPalette} aria-label={searchPlaceholder}>
          {renderGlyph("icon:search", 18)}
        </button>
      )
    ) : (
      <SearchField entries={entries} placeholder={searchPlaceholder} variant={variant} wide={search === "bar"} onPick={(e) => navigate(e)} onSearch={onSearch} />
    );

  const actionsEl = (mobile = false) =>
    children || secondaryCta || cta ? (
      <div className={mobile ? "ui-nav__mactions" : "ui-nav__actions"}>
        {children}
        {secondaryCta && <Button label={secondaryCta} variant={variant} emphasis={mobile ? "outline" : "ghost"} size={mobile ? "md" : "sm"} fullWidth={mobile} onClick={onSecondaryCta} />}
        {cta && <Button label={cta} variant={variant} size={mobile ? "md" : "sm"} fullWidth={mobile} onClick={onCta} />}
      </div>
    ) : null;

  const burger = (
    <button type="button" className="ui-nav__icon-btn ui-nav__burger" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen} aria-controls={`${uid}-mobile`} onClick={toggleMobile}>
      {renderGlyph(mobileOpen ? "icon:close" : "icon:menu", 20)}
    </button>
  );

  const piece = (t: Token, row: Token[][], key: string) => {
    switch (t) {
      case "brand":
        return (
          <span key={key} className="ui-nav__brand">
            {brand}
          </span>
        );
      case "links":
        return collapsed ? null : <Fragment key={key}>{linksEl(row)}</Fragment>;
      case "search":
        return searchEl ? <Fragment key={key}>{searchEl}</Fragment> : null;
      case "actions":
        return collapsed ? null : <Fragment key={key}>{actionsEl()}</Fragment>;
      case "spacer":
        return <span key={key} className="ui-nav__spacer" aria-hidden />;
      case "menu":
        return collapsed ? <Fragment key={key}>{burger}</Fragment> : null;
    }
  };

  // menú móvil: búsqueda arriba, secciones (con sus categorías) en acordeón, acciones a todo el ancho abajo
  const mobileBody = (
    <>
      {search !== "none" && (
        <div className="ui-nav__msearch">
          <SearchField entries={entries} placeholder={searchPlaceholder} variant={variant} wide onPick={(e) => navigate(e)} onSearch={onSearch} />
        </div>
      )}
      <ul className="ui-nav__mlinks">
        {items.map((it, i) =>
          hasSub(it) ? (
            <li key={it.label + i}>
              <details className="ui-nav__acc">
                <summary className="ui-nav__link" data-current={i === active || undefined}>
                  {inner(it)}
                  <span className="ui-nav__chev" aria-hidden>
                    {renderGlyph("icon:chevron-down", 14)}
                  </span>
                </summary>
                {it.groups.map((g, gi) => (
                  <div key={gi} className="ui-nav__mgroup">
                    {g.title && <p className="ui-nav__gtitle">{g.title}</p>}
                    <ul>
                      {g.items.map((c, k) => (
                        <li key={c.label + k}>{linkEl(c, () => navigate(c, i), "ui-nav__mitem")}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </details>
            </li>
          ) : (
            <li key={it.label + i}>{linkEl(it, () => navigate(it, i), "ui-nav__link", i === active)}</li>
          ),
        )}
      </ul>
      {actionsEl(true)}
    </>
  );

  const rootCls = [
    "ui-nav",
    `ui-nav--${barShape}`,
    `ui-nav--${size}`,
    bleed && "ui-nav--bleed",
    collapsed && "ui-nav--collapsed",
    sticky && "ui-nav--sticky",
    scrolled && "ui-nav--scrolled",
    hidden && "ui-nav--hidden",
    vcls(variant),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav ref={root} aria-label="Principal" className={rootCls}>
      {announcement && announceOn && (
        <div className="ui-nav__announce">
          <span>{announcement}</span>
          <button type="button" className="ui-nav__announce-x" aria-label="Cerrar anuncio" onClick={() => setAnnounceOn(false)}>
            ×
          </button>
        </div>
      )}
      <div className="ui-nav__bar ui-surface">
        <div className="ui-nav__inner">
          {rows.map((row, ri) => (
            <div key={ri} className={`ui-nav__row ${row.length > 1 ? `ui-nav__row--cols ui-nav__row--c${Math.min(row.length, 3)}` : ""} ${ri > 0 ? "ui-nav__row--sub" : ""}`}>
              {row.map((col, ci) =>
                row.length > 1 ? (
                  <div key={ci} className="ui-nav__col">
                    {col.map((t, ti) => piece(t, row, `${ri}-${ci}-${ti}`))}
                  </div>
                ) : (
                  col.map((t, ti) => piece(t, row, `${ri}-${ci}-${ti}`))
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {collapsed && mobileMenu === "sheet" && mobileOpen && (
        <div id={`${uid}-mobile`} className={`ui-nav__sheet ui-surface ${vcls(variant)}`}>
          {mobileBody}
        </div>
      )}

      {collapsed &&
        mobileMenu === "drawer" &&
        mobileOpen &&
        createPortal(
          <div className="ui-nav-portal" style={portalStyle}>
            <div className="ui-nav__scrim" onClick={() => setMobileOpen(false)} />
            <div id={`${uid}-mobile`} role="dialog" aria-modal="true" aria-label={brand} className={`ui-nav__drawer ui-surface ${vcls(variant)}`} onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}>
              <div className="ui-nav__drawer-head">
                <span className="ui-nav__brand">{brand}</span>
                <button type="button" className="ui-nav__icon-btn" aria-label="Cerrar menú" autoFocus onClick={() => setMobileOpen(false)}>
                  {renderGlyph("icon:close", 20)}
                </button>
              </div>
              {mobileBody}
            </div>
          </div>,
          document.body,
        )}

      {paletteOpen &&
        createPortal(
          <div className="ui-nav-portal" style={portalStyle}>
            <CommandPalette entries={entries} placeholder={searchPlaceholder} variant={variant} onClose={() => setPaletteOpen(false)} onPick={(e) => navigate(e)} onSearch={onSearch} />
          </div>,
          document.body,
        )}
    </nav>
  );
}

/** Filtra y ordena: primero lo que empieza por la consulta, luego lo que la contiene. */
function filterEntries(entries: SearchEntry[], q: string): SearchEntry[] {
  const n = norm(q.trim());
  if (!n) return entries.slice(0, 8);
  const starts: SearchEntry[] = [];
  const has: SearchEntry[] = [];
  for (const e of entries) {
    const l = norm(e.label);
    if (l.startsWith(n)) starts.push(e);
    else if (l.includes(n) || (e.path && norm(e.path).includes(n))) has.push(e);
  }
  return [...starts, ...has].slice(0, 8);
}

type SearchUIProps = { entries: SearchEntry[]; placeholder: string; variant: Variant; onPick: (e: SearchEntry) => void; onSearch?: (q: string) => void };

function ResultList({ id, results, at, onPick, onHover }: { id: string; results: SearchEntry[]; at: number; onPick: (e: SearchEntry) => void; onHover: (i: number) => void }) {
  if (!results.length) return <p className="ui-nav__empty">Sin resultados</p>;
  return (
    <ul id={id} role="listbox" className="ui-nav__results">
      {results.map((r, i) => (
        <li
          key={r.label + (r.path ?? "") + i}
          id={`${id}-${i}`}
          role="option"
          aria-selected={i === at}
          className="ui-nav__result"
          onMouseDown={(e) => e.preventDefault()}
          onMouseEnter={() => onHover(i)}
          onClick={() => onPick(r)}
        >
          <span>{r.label}</span>
          {r.path && <span className="ui-nav__rpath">{r.path}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Teclado común de los buscadores: flechas eligen, Enter abre, Escape cierra. */
function useSearchKeys(results: SearchEntry[], onPick: (e: SearchEntry) => void, onSearch: ((q: string) => void) | undefined, query: string, onEscape: () => void) {
  const [at, setAt] = useState(0);
  useEffect(() => setAt(0), [query]);
  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setAt((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[at]) onPick(results[at]);
      else onSearch?.(query);
    } else if (e.key === "Escape") onEscape();
  };
  return { at, setAt, onKeyDown };
}

function CommandPalette({ entries, placeholder, variant, onClose, onPick, onSearch }: SearchUIProps & { onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => filterEntries(entries, q), [entries, q]);
  const { at, setAt, onKeyDown } = useSearchKeys(results, onPick, onSearch, q, onClose);
  const id = "ui-nav-palette";
  return (
    <>
      <div className="ui-nav__scrim" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={placeholder} className={`ui-nav__palette ui-surface ${vcls(variant)}`}>
        <div className="ui-nav__pfield">
          {renderGlyph("icon:search", 18)}
          <input
            autoFocus
            value={q}
            placeholder={placeholder}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded
            aria-controls={id}
            aria-activedescendant={results[at] ? `${id}-${at}` : undefined}
          />
          <kbd className="ui-nav__kbd">Esc</kbd>
        </div>
        <ResultList id={id} results={results} at={at} onPick={onPick} onHover={setAt} />
      </div>
    </>
  );
}

/** Campo de búsqueda en la barra (compacto o `wide`), con resultados desplegados debajo. */
function SearchField({ entries, placeholder, variant, wide, onPick, onSearch }: SearchUIProps & { wide?: boolean }) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const results = useMemo(() => filterEntries(entries, q), [entries, q]);
  const pick = (e: SearchEntry) => {
    setQ("");
    setFocus(false);
    onPick(e);
  };
  const { at, setAt, onKeyDown } = useSearchKeys(results, pick, onSearch, q, () => setFocus(false));
  const id = `ui-nav-field-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const open = focus && q.trim().length > 0;
  return (
    <div className={`ui-nav__field ${wide ? "ui-nav__field--wide" : ""}`}>
      <span className="ui-nav__field-icon" aria-hidden>
        {renderGlyph("icon:search", 16)}
      </span>
      <input
        type="search"
        value={q}
        placeholder={placeholder}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open && results[at] ? `${id}-${at}` : undefined}
        aria-label={placeholder}
      />
      {open && (
        <div className={`ui-nav__menu ui-nav__menu--search ui-surface ${vcls(variant)}`}>
          <ResultList id={id} results={results} at={at} onPick={pick} onHover={setAt} />
        </div>
      )}
    </div>
  );
}
