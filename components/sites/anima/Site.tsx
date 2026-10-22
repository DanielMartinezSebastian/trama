"use client";

import { Fragment, Suspense, createContext, lazy, startTransition, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import CookieBanner from "@/components/ui/CookieBanner";
import Countdown from "@/components/ui/Countdown";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import ModelNav from "@/components/ui/ModelNav";
import Marquee from "@/components/ui/Marquee";
import ObjectStage from "@/components/ui/ObjectStage";
import Traveler, { TravelSlot, TravelStage, useTraveler } from "@/components/ui/Traveler";
import { GLBoundary } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import type { ModelNavPointer } from "@/lib/modelnav/pointer";
import OptionPicker from "@/components/ui/OptionPicker";
import QRCode from "@/components/ui/QRCode";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SmoothScroll from "@/components/ui/SmoothScroll";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import { getLenis } from "@/lib/motion/lenis";
import { smooth, useScrollStory } from "@/lib/story/useScrollStory";
import { phosphorLight } from "@/lib/ui/icons-phosphor-light";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useSiteNavigate } from "../shared";
import FireRing, { type FireState } from "./FireRing";
import FluidSmoke, { type SmokeKind, type SmokeState } from "./FluidSmoke";
import SkullStage from "./SkullStage";
import { bustEye } from "./bustEye";
import { SKULL_REST, type SkullPose } from "./skullScene";
import { BRAND, CHAPTERS, EVENT, FAQ, FEE, MAX_TICKETS, PROGRAM, RULES, SLUG, TICKETS, eventJsonLd, type Interlude } from "./data";
import "./anima.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#0b0708",
  fg: "#f2e9df",
  mut: "#a99a8f",
  acc: "#ff7a1a",
  acc2: "#8dffb0",
  card: "#171012",
  ln: "rgba(242,233,223,0.14)",
  r: 14,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-gloock), Georgia, serif',
  accentFont: 'var(--font-jacquard-24), var(--font-gloock), serif',
});

const href = (p = "") => siteHref(SLUG, p);
const NAV = [
  { label: "Programa", path: "programa" },
  { label: "Entradas", path: "entradas" },
  { label: "Info", path: "info" },
];
const money = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

/** La marca en la portada: en vez de recargar la misma página, sube al principio (con Lenis, con su frenada). */
function toTopIfHome(e: { currentTarget: HTMLAnchorElement; preventDefault: () => void }) {
  const u = new URL(e.currentTarget.href, location.href);
  if (u.pathname !== location.pathname || u.search !== location.search || u.hash) return;
  e.preventDefault();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else scrollTo({ top: 0, behavior: "smooth" });
}

// los viajeros (docs/20 §2e): la calavera en busto y la gema del laboratorio. Su 3D se carga aparte (three solo baja
// cuando hace falta) y viven en el Shell: son el mismo nodo, vivo, en todas las páginas, y cada página dice con un
// `TravelSlot` dónde va (el navbar, el laboratorio, el ojo)
const SkullBust = lazy(() => import("./skullBust"));
const GemBit = lazy(() => import("./gemBit"));

/** El estado del laboratorio que sobrevive al navegar: si la gema ya es el ojo de la calavera. */
type LabCtx = { gemSet: boolean; setGemSet: (v: boolean) => void };
const Lab = createContext<LabCtx>({ gemSet: false, setGemSet: () => {} });

/** El viajero de la calavera: un lienzo, que se inclina hacia el puntero y abre la boca si pasa cerca. */
function SkullTraveler() {
  const { gemSet } = useContext(Lab);
  const at = useTraveler("calavera");
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef<ModelNavPointer>({ x: 0, y: 0, near: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy;
      pointer.current.x = Math.max(-1, Math.min(1, dx / (innerWidth / 2)));
      pointer.current.y = Math.max(-1, Math.min(1, -dy / (innerHeight / 2)));
      pointer.current.near = Math.max(0, Math.min(1, 1 - (Math.hypot(dx, dy) - r.width / 3) / 180));
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={box} className="an-bust" aria-hidden>
      {!reduced && (
        <GLBoundary onError={() => {}}>
          <Suspense fallback={null}>
            <SkullBust pointer={pointer} active={at !== null} gem={gemSet} />
          </Suspense>
        </GLBoundary>
      )}
    </div>
  );
}

function GemTraveler() {
  const at = useTraveler("gema");
  const reduced = useReducedMotion();
  return (
    <div className="an-gem" aria-hidden>
      {!reduced && (
        <GLBoundary onError={() => {}}>
          <Suspense fallback={null}>
            <GemBit active={at !== null} />
          </Suspense>
        </GLBoundary>
      )}
    </div>
  );
}

/** El icono de las entradas: un tique con su troquel. */
const TicketIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
    <path d="M3 7.5V5.8c0-.4.4-.8.8-.8h16.4c.4 0 .8.4.8.8v1.7a2.5 2.5 0 0 0 0 5v1.7c0 .4-.4.8-.8.8H3.8c-.4 0-.8-.4-.8-.8v-1.7a2.5 2.5 0 0 0 0-5Z" transform="translate(0 2)" />
    <path d="M15 7v1.5M15 11v1.5M15 15v1.5" strokeLinecap="round" />
  </svg>
);

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  // en la portada la calavera ya está en el recorrido: el navbar se queda sin ella; en el resto, la calavera con sombrero
  // (el mismo viajero que en el laboratorio)
  const home = usePathname().replace(/\/$/, "") === href();
  const [gemSet, setGemSet] = useState(false);
  useEffect(() => {
    try {
      setGemSet(sessionStorage.getItem("anima-gema") === "1");
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const lab: LabCtx = {
    gemSet,
    setGemSet: (v) => {
      setGemSet(v);
      try {
        sessionStorage.setItem("anima-gema", v ? "1" : "0");
      } catch {
        /* sin almacenamiento */
      }
    },
  };
  return (
    <SiteFrame tokens={TOKENS} className="an" icons={{ set: phosphorLight, weight: "light" }}>
     <Lab.Provider value={lab}>
     <TravelStage className="an-stage-travel">
      {/* scroll con inercia larga: la noche se baja despacio */}
      <SmoothScroll lerp={0.045} wheelMultiplier={0.85} syncGsap={false} />
      <a className="an-skip" href="#contenido">Saltar al contenido</a>
      {/* navbar mínimo: menú, la calavera (su hueco; fuera de la portada) y las entradas. Fija (sin esconderse al bajar):
          la calavera que viaja hasta aquí es `fixed` y no seguiría a una cabecera que se desplaza */}
      <ModelNav
        className="an-island"
        hideOnScroll={false}
        emblem={home ? undefined : <TravelSlot id="calavera" at="nav" className="an-navslot" />}
        emblemSize={78}
        brandAlign="exact"
        leading={
          <FullscreenMenu
            brand="Ánima"
            openLabel="Abrir el menú"
            closeLabel="Cerrar el menú"
            trigger="burger"
            cover
            backdrop="blur"
            align="center"
            links={[{ label: "Inicio", href: href() }, ...NAV.map((n) => ({ label: n.label, href: href(n.path) }))]}
            footer={[{ label: "WhatsApp", href: BRAND.whatsappHref }, { label: BRAND.email, href: `mailto:${BRAND.email}` }]}
            note={`31 de octubre · ${BRAND.venue} · ${BRAND.city}`}
          />
        }
        brand={<a className="an-brand an-brand--sr" href={href()} aria-label="Ánima, inicio" onClick={toTopIfHome}><span aria-hidden>✝</span></a>}
        trailing={<a className="an-island__cta" href={href("entradas")} aria-label="Entradas"><TicketIcon /><span className="an-island__long">Entradas</span></a>}
      />
      <Traveler id="calavera" className="an-trav an-trav--skull" pace="slow" blend="live">
        <SkullTraveler />
      </Traveler>
      <Traveler id="gema" className="an-trav an-trav--gem" pace="slow" blend="live">
        <GemTraveler />
      </Traveler>
      <main id="contenido">{children}</main>
      <Footer />
      <ActionBar
        actions={[
          { label: "Cómo llegar", href: BRAND.map, icon: "map-pin" },
          { label: "WhatsApp", href: BRAND.whatsappHref, icon: "message" },
          { label: "Entradas", href: href("entradas"), icon: "skull", primary: true },
        ]}
        onNavigate={(h) => navigate({ href: h })}
        soft
        variant="minimal"
      />
      <CookieBanner storageKey="anima-cookies" policyHref="#cookies" title="Cookies" text="Solo las necesarias para guardar tus entradas. Las de medición, si nos dejas." variant="minimal" />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(href("entradas"))).replace(/</g, "\\u003c") }} />
     </TravelStage>
     </Lab.Provider>
    </SiteFrame>
  );
}

function Footer() {
  return (
    <footer className="an-foot">
      <div className="an-wrap an-foot__grid">
        <div>
          <p className="an-brand">Ánima</p>
          <p className="an-mut">La fiesta de Halloween de {BRAND.city}. 31 de octubre, de {EVENT.doors} a {EVENT.close}.</p>
        </div>
        <div>
          <p className="an-label">Dónde</p>
          <p className="an-mut">{BRAND.venue}<br />{BRAND.address}<br />{BRAND.zone} · <a href={BRAND.map} target="_blank" rel="noopener noreferrer">Cómo llegar</a></p>
        </div>
        <div>
          <p className="an-label">Contacto</p>
          <p className="an-mut"><a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> · <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
          <button type="button" className="an-link" onClick={() => { try { localStorage.removeItem("anima-cookies"); } catch { /* nada */ } location.reload(); }}>Configurar cookies</button>
        </div>
      </div>
      <p className="an-wrap an-foot__small">
        {BRAND.legal} · Demo de Trama: el evento no existe y no se cobra nada. · Calavera 3D:{" "}
        <a href="https://sketchfab.com/3d-models/the-halloween-pirate-skull-7743a10d48d74c8e814fa5b6759e1ddb" target="_blank" rel="noopener noreferrer">«The Halloween Pirate Skull»</a>, de Machin (
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>), optimizada.
      </p>
    </footer>
  );
}

/* ---------- inicio: la noche contada en seis actos ---------- */
const P = (p: Partial<SkullPose>): SkullPose => ({ ...SKULL_REST, ...p });
type Beat = {
  pose: SkullPose;
  kind: "hero" | "intro" | "card" | "interlude";
  /** acto del cuadro, o el que cierra el interludio (−1 = portada y prólogo) */
  chapter: number;
  /** la sala de detrás: un color de niebla */
  room: string;
  /** líneas técnicas del cuadro (rotulan lo que enseña la calavera) */
  /** el HUD: radio y su efecto (un humo de fluido por acto, o el eclipse de fuego); sin rótulos */
  hud?: { r: number; fx: SmokeKind | "fuego" };
};
const BEATS: Beat[] = [
  // portada: la calavera casi a pantalla, con los ojos encendidos
  // la pose de la portada (x, y, zoom) la calcula `Home` a partir del hueco de la O del titular
  { kind: "hero", chapter: -1, room: "violeta", pose: P({ zoom: 1.4, eye: 0.95, y: 0.15, jaw: 0.1, yaw: 0.15 }) },
  // prólogo: a la derecha del manifiesto, girada hacia él
  { kind: "intro", chapter: -1, room: "violeta", pose: P({ x: 0.22, zoom: 0.85, yaw: -0.45, eye: 0.5 }) },
  // 01 la puerta: de tres cuartos, despertando → interludio: de frente, la boca entreabierta
  { kind: "card", chapter: 0, room: "calabaza", pose: P({ x: 0.22, yaw: -0.55, eye: 0.6 }), hud: { r: 150, fx: "niebla" } },
  { kind: "interlude", chapter: 0, room: "calabaza", pose: P({ yaw: 0.25, zoom: 0.78, jaw: 0.25, eye: 0.85 }) },
  // 02 el pasaje: la cámara entra en la cuenca → interludio: los ojos se tiñen y la boca se abre
  { kind: "card", chapter: 1, room: "verde", pose: P({ close: 1, eye: 1, x: -0.12 }), hud: { r: 120, fx: "ecto" } },
  { kind: "interlude", chapter: 1, room: "verde", pose: P({ yaw: -0.3, zoom: 0.8, jaw: 0.55, red: 0.45, eye: 1 }) },
  // 03 la pista: castañetea al ritmo → interludio: baila en el centro
  { kind: "card", chapter: 2, room: "violeta", pose: P({ x: 0.22, yaw: 0.45, talk: 1, jaw: 0.15, eye: 1 }), hud: { r: 150, fx: "disco" } },
  { kind: "interlude", chapter: 2, room: "violeta", pose: P({ zoom: 0.76, talk: 1, jaw: 0.3, eye: 1, yaw: -0.15 }) },
  // 04 el concurso: se pone el sombrero pirata (el disfraz) → interludio: el trío de piratas
  { kind: "card", chapter: 3, room: "sangre", pose: P({ x: -0.2, yaw: 0.6, eye: 0.7, hat: 1 }), hud: { r: 150, fx: "bengala" } },
  { kind: "interlude", chapter: 3, room: "sangre", pose: P({ trio: 1, zoom: 1.15, talk: 0.5, eye: 0.9, hat: 1 }) },
  // 05 la cena: la boca abierta, de lado → interludio: masticando, girando
  { kind: "card", chapter: 4, room: "calabaza", pose: P({ x: 0.2, jaw: 0.9, yaw: 0.6, eye: 0.6 }), hud: { r: 170, fx: "vapor" } },
  { kind: "interlude", chapter: 4, room: "calabaza", pose: P({ jaw: 0.3, talk: 0.8, yaw: 1.4, zoom: 0.85, eye: 0.7 }) },
  // 06 medianoche: los ojos en rojo → final: de frente, en rojo, riendo
  { kind: "card", chapter: 5, room: "sangre", pose: P({ x: -0.2, red: 1, eye: 1, jaw: 0.45, yaw: -0.3 }), hud: { r: 150, fx: "fuego" } },
  // final: entera y centrada (cabe con el fundido de abajo), riendo
  { kind: "interlude", chapter: 5, room: "sangre", pose: P({ red: 1, eye: 1, zoom: 1.05, y: 0.04, jaw: 0.55, talk: 0.35 }) },
];
const POSE_KEYS = Object.keys(SKULL_REST) as (keyof SkullPose)[];
/** en móvil el lienzo es alto y estrecho: la cámara se aleja para que la calavera quepa a lo ancho */
const MOBILE_ZOOM = 1.75;
const cardStep = (c: number) => BEATS.findIndex((b) => b.kind === "card" && b.chapter === c);
/** el lienzo del fuego mide esto respecto al HUD (para que quepan rayos, chispas y humo) */
const FIRE_SCALE = 1.9;
const MANIFESTO = "Una nave abandonada junto al puerto, dos pistas, un pasaje del terror y mil calaveras encendidas. Ven disfrazado o te disfrazamos en la puerta.";
const MANIFESTO_WORDS = MANIFESTO.split(" ");

function Home() {
  const list = useRef<HTMLOListElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLParagraphElement>(null);
  const pose = useRef<SkullPose>({ ...BEATS[0].pose });
  const focus = useRef<{ x: number; y: number } | null>(null);
  // el eclipse de fuego (HUD): radio e intensidad, del mismo progreso que las salas
  const fire = useRef<FireState>({ r: 0.4, a: 0, red: 0 });
  const smoke = useRef<SmokeState>({ kind: "niebla", a: 0, cx: 0, cy: 0, r: 100 });
  const [step, setStep] = useState(0);
  // el hueco de la O del titular: de su caja salen la posición y el tamaño de la calavera en la portada
  const heroGap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = heroGap.current;
    if (!el) return;
    const title = el.parentElement!;
    const fit = () => {
      // el titular, lo más grande que quepa a lo ancho (92 %) y sin pasar del 34 % del alto
      title.style.fontSize = "100px";
      const k = (innerWidth * 0.92) / title.scrollWidth;
      title.style.fontSize = `${Math.min(100 * k, innerHeight * 0.34)}px`;
      // el tamaño de la calavera sale del hueco: la cámara mira a 3,9·zoom y la calavera mide ~1,15
      const r = el.getBoundingClientRect();
      BEATS[0].pose.zoom = (1.15 * innerHeight) / (2 * Math.tan((16 * Math.PI) / 180) * 3.9 * r.height * 1.1);
      dispatchEvent(new Event("resize"));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  // el motor de recorrido del kit (lib/story): tramo, pesos, cintas y cuadros; aquí, lo propio de Ánima (la pose de la
  // calavera, el fuego y el humo del HUD, y lo que va a CSS)
  useScrollStory(list, sticky, {
    onFrame: ({ j, t }) => {
      // la portada: la calavera va donde esté ahora el hueco de la O (sube con el texto) hasta que el tramo la suelta
      const gap = heroGap.current;
      if (gap && j === 0) {
        const r = gap.getBoundingClientRect();
        BEATS[0].pose.x = (r.left + r.width / 2) / innerWidth - 0.5;
        BEATS[0].pose.y = 0.5 - (r.top + r.height / 2) / innerHeight;
      }
      const a = BEATS[j].pose, b = BEATS[Math.min(j + 1, BEATS.length - 1)].pose, p = pose.current;
      for (const k of POSE_KEYS) p[k] = a[k] + (b[k] - a[k]) * t;
      // cuánto «interludio» hay ahora (0 en un cuadro, 1 en un interludio)
      const il = (k: number) => (BEATS[k]?.kind === "interlude" ? 1 : 0);
      const ilv = il(j) * (1 - t) + il(j + 1) * t;
      // en móvil el lienzo ocupa toda la pantalla: con cuadro, la calavera sube a la mitad de arriba (el cuadro va debajo);
      // en los interludios baja al centro, entera, y así acaba el recorrido antes de fundirse. Sin trío (no cabe)
      if (innerWidth < 900) {
        // cuánto pesa la portada (1 en ella, 0 al llegar al prólogo): ahí manda el hueco de la O del titular
        const hw = j === 0 ? 1 - t : 0;
        p.x *= hw;
        p.trio = 0;
        p.close *= 0.7;
        p.zoom *= 1 + (MOBILE_ZOOM - 1) * (1 - hw);
        p.y = p.y * hw + (p.y * 0.5 + 0.22 * (1 - ilv)) * (1 - hw);
      }
      // fuego: pesos de los dos pasos en juego; el radio, el del paso con HUD (en unidades del lienzo del fuego, que mide
      // 1,9 veces el HUD: r/200 del medio ancho del HUD)
      {
        const ha = BEATS[j].hud, hb = BEATS[Math.min(j + 1, BEATS.length - 1)].hud;
        const wa = ha ? 1 - t : 0, wb = hb ? t : 0;
        // el radio, del paso que pesa más (los dos con HUD: se interpola)
        const ra = ha?.r ?? hb?.r ?? 150, rb = hb?.r ?? ra;
        const r = ha && hb ? ra + (rb - ra) * t : wa >= wb ? ra : rb;
        // el fuego, solo en los pasos que lo piden (medianoche); el resto, humo de fluido del paso que pesa más
        const fa = ha?.fx === "fuego" ? wa : 0, fb = hb?.fx === "fuego" ? wb : 0;
        fire.current = { r: r / 200 / FIRE_SCALE, a: smooth(Math.min(1, fa + fb)), red: p.red };
        const sa = ha && ha.fx !== "fuego" ? wa : 0, sb = hb && hb.fx !== "fuego" ? wb : 0;
        // el humo del paso que pesa más (el fuego no es un humo: si no hay ninguno, se queda el anterior)
        const pick = sa >= sb ? ha?.fx : hb?.fx;
        const kind = pick && pick !== "fuego" ? pick : (sa ? ha?.fx : sb ? hb?.fx : undefined) as SmokeKind | undefined;
        // centro y radio del HUD en px del escenario (en móvil, sobre lo que enseña la cámara)
        const W = innerWidth, H = innerHeight, mob = W < 900;
        const hudW = mob ? 0.7 * W : Math.min(0.62 * H, 0.52 * W);
        const f = focus.current;
        smoke.current = {
          kind: kind ?? smoke.current.kind,
          a: smooth(Math.min(1, sa + sb)),
          // en escritorio, el centro del HUD (donde cae la calavera); en móvil y con la cámara en la cuenca, lo que enseña
          // la cámara (`focus`, el ojo). `focus` se mide sin el desplazamiento lateral: solo vale con x ≈ 0 o de cerca
          cx: f && (mob || p.close > 0.3) ? f.x * W : W * (0.5 + p.x),
          cy: f && (mob || p.close > 0.3) ? f.y * H : H / 2,
          r: (r / 200) * (hudW / 2),
        };
      }
      const st = sticky.current?.style;
      st?.setProperty("--ring-x", p.x.toFixed(3));
      st?.setProperty("--ilv", ilv.toFixed(3));
    },
  });

  // el paso activo (para el índice)
  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setStep(Number(e.target.getAttribute("data-step")))), { rootMargin: "-50% 0px -50% 0px" });
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  // en móvil, las líneas técnicas se centran en lo que enseña la cámara
  useEffect(() => {
    if (!matchMedia("(max-width: 899px)").matches) return;
    let raf = 0, fx = -1, fy = -1;
    const tick = () => {
      const f = focus.current, st = sticky.current?.style;
      if (f && st && (Math.abs(f.x - fx) > 0.002 || Math.abs(f.y - fy) > 0.002)) {
        fx = f.x;
        fy = f.y;
        st.setProperty("--fx", fx.toFixed(4));
        st.setProperty("--fy", fy.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // el manifiesto, lo más grande que quepa en su caja
  useEffect(() => {
    const el = intro.current;
    if (!el) return;
    const fit = () => {
      let lo = 16, hi = 400;
      while (hi - lo > 1) {
        const m = (lo + hi) / 2;
        el.style.fontSize = `${m}px`;
        if (el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth) lo = m;
        else hi = m;
      }
      el.style.fontSize = `${lo}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  const go = (i: number) => {
    const el = list.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
    if (!el) return;
    const y = scrollY + el.getBoundingClientRect().top + el.offsetHeight / 2 - innerHeight / 2;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else scrollTo({ top: y, behavior: "smooth" });
  };
  const beat = BEATS[step];

  const ribbons = (layer: keyof Omit<Interlude, "flip">) => (
    <div className={`an-ribbons an-ribbons--${layer}`} aria-hidden>
      {BEATS.map((b, k) => {
        if (b.kind !== "interlude") return null;
        const it = CHAPTERS[b.chapter].interlude;
        const top = (layer === "back") !== !!it.flip;
        return (
          <p key={k} className="an-ribbon" data-pos={top ? "top" : "bottom"} style={{ "--r": `var(--r${k}, -1)`, "--o": `var(--o${k}, 0)`, "--dir": top ? 1 : -1 } as CSSProperties}>
            {[0, 1, 2].map((n) => (
              <span key={n}>{it[layer]}<i> ✝ </i></span>
            ))}
          </p>
        );
      })}
    </div>
  );

  return (
    <>
      <section className="an-story" aria-label="La noche, en seis actos">
        <div className="an-story__sticky" ref={sticky}>
          <div className="an-rooms" aria-hidden>
            {BEATS.map((b, k) => (
              <div key={k} className={`an-room an-room--${b.room}`} style={{ "--w": `var(--w${k}, ${k === 0 ? 1 : 0})` } as CSSProperties} />
            ))}
          </div>
          <FluidSmoke state={smoke} />
          <FireRing state={fire} />
          {ribbons("back")}
          <p className="an-intro" ref={intro} aria-hidden style={{ "--n": MANIFESTO_WORDS.length } as CSSProperties}>
            {MANIFESTO_WORDS.map((w, i) => (
              <Fragment key={i}>
                <span style={{ "--i": i } as CSSProperties}>{w}</span>{" "}
              </Fragment>
            ))}
          </p>
          {/* los cuadros: por debajo de la calavera y por encima de las líneas técnicas */}
          <div className="an-cards">
            {BEATS.map((b, k) => {
              if (b.kind !== "card") return null;
              const c = CHAPTERS[b.chapter];
              return (
                <div key={k} className="an-card" data-card={k} data-side={b.pose.x > 0 ? "left" : "right"}>
                  <div className="an-card__box">
                    <span className="an-card__num" aria-hidden>{c.k}</span>
                    <p className="an-card__k">
                      <span className="ui-sr">Acto {c.k} · </span>
                      {c.title}
                      <span className="an-card__time">{c.time}</span>
                    </p>
                    <h2 className="an-h2 an-card__thesis">{c.thesis}</h2>
                    <p className="ui-sr">{c.how}</p>
                    <p className="an-card__what">{c.what}</p>
                    <a className="an-link an-card__cta" href={href(c.cta.href)}>{c.cta.label} →</a>
                  </div>
                </div>
              );
            })}
          </div>
          <SkullStage pose={pose} focus={focus} alt={step === 0 ? "Una calavera con los ojos encendidos, entre niebla" : `La calavera en el acto «${CHAPTERS[Math.max(0, beat.chapter)].title}»`} className="an-story__skull" />
          {ribbons("front")}
          <nav className="an-rail" aria-label="Actos">
            {CHAPTERS.map((c, i) => (
              <button key={c.id} type="button" aria-current={beat.chapter === i ? "step" : undefined} onClick={() => go(cardStep(i))}>
                <span>{c.k}</span> <b>{c.title}</b>
              </button>
            ))}
          </nav>
          <span className="an-story__bar" aria-hidden />
        </div>
        <ol className="an-steps" ref={list}>
          <li data-step={0} className="an-step an-step--hero">
            {/* la portada: «HALLOWEEN» gigante con la calavera 3D en el sitio de la primera O (el hueco se mide y la pose de
                la portada la encaja ahí); al bajar, sale del texto hacia su siguiente posición */}
            <div className="an-hero">
              <p className="an-kicker an-hero__kicker">31 de octubre · {BRAND.city} · 21:00 – 6:00</p>
              <h1 className="an-hero__title">
                <span aria-hidden>Hall</span>
                <span className="an-hero__o" ref={heroGap} aria-hidden />
                <span aria-hidden>ween</span>
                <span className="ui-sr">Halloween en Ánima</span>
              </h1>
              <p className="an-hero__sub">La fiesta más terrorífica de Valencia: pasaje del terror, dos pistas hasta las seis y concurso de disfraces en {BRAND.venue}.</p>
              <div className="an-hero__cta">
                <a className="an-btn" href={href("entradas")}>Comprar entradas</a>
                <a className="an-link" href={href("programa")}>Ver el programa →</a>
              </div>
              <Countdown to={EVENT.start} label="Faltan" done="¡Ya ha empezado! Te esperamos dentro." size="sm" variant="minimal" className="an-count" />
            </div>
          </li>
          <li data-step={1} className="an-step an-step--intro">
            <p className="ui-sr">{MANIFESTO}</p>
          </li>
          {BEATS.map((b, k) => {
            if (b.kind === "interlude") return <li key={k} data-step={k} className="an-step an-step--interlude" aria-hidden />;
            if (b.kind !== "card") return null;
            const c = CHAPTERS[b.chapter];
            return <li key={c.id} id={c.id} data-step={k} className="an-step an-step--card" aria-hidden />;
          })}
        </ol>
      </section>

      <div className="an-band" aria-hidden>
        <Marquee text="31 de octubre · Pasaje del terror · Concurso de disfraces · Dos pistas hasta las 6:00 · Ven disfrazado" separator="✝" rows={1} duration={46} fontSize={44} variant="minimal" tone="fg" edgeFade pauseOnHover={false} className="an-band__m" />
      </div>

      <section className="an-wrap an-sec">
        <div className="an-sechead">
          <p className="an-kicker">Entradas</p>
          <h2 className="an-h2">Elige cómo quieres pasar la noche.</h2>
          <p className="an-mut">Precio final por persona; los gastos de gestión ({money(FEE)} por entrada) se suman al pagar.</p>
        </div>
        <div className="an-tickets">
          {TICKETS.map((t) => (
            <a key={t.id} className="an-ticket" href={href(`entradas?tipo=${t.id}`)} data-sold={t.soldOut ? "" : undefined} aria-disabled={t.soldOut || undefined}>
              <span className="an-ticket__name">{t.name}</span>
              <b className="an-ticket__price">{money(t.price)}</b>
              <span className="an-ticket__note">{t.soldOut ? "Agotadas" : t.note}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="an-wrap an-sec an-split">
        <div className="an-sechead">
          <p className="an-kicker">Programa</p>
          <h2 className="an-h2">De las nueve al amanecer.</h2>
          <a className="an-link" href={href("programa")}>Ver el programa completo →</a>
        </div>
        <Timeline steps={PROGRAM} marker="dot" variant="minimal" className="an-timeline" />
      </section>

      <section className="an-wrap an-sec">
        <FAQSection kicker="Antes de venir" title="Preguntas frecuentes" subtitle="" items={FAQ} variant="minimal" />
      </section>

      <section className="an-wrap an-sec an-cta">
        <h2 className="an-h2">Nos vemos en la oscuridad.</h2>
        <p className="an-lead">31 de octubre, de 21:00 a 6:00, en {BRAND.venue}. Aforo de {EVENT.capacity.toLocaleString("es-ES")} personas.</p>
        <a className="an-btn" href={href("entradas")}>Comprar entradas</a>
      </section>
    </>
  );
}

/* ---------- programa ---------- */
function Program() {
  return (
    <div className="an-page an-wrap">
      <p className="an-kicker">31 de octubre · {EVENT.doors} – {EVENT.close}</p>
      <h1 className="an-h1">Programa</h1>
      <p className="an-lead">Seis actos, una noche. Las horas son aproximadas: la medianoche, no.</p>
      <div className="an-split">
        <Timeline steps={PROGRAM} marker="number" variant="minimal" className="an-timeline" />
        <div className="an-acts">
          {CHAPTERS.map((c) => (
            <article key={c.id} className="an-act">
              <span className="an-act__k">{c.k} · {c.time}</span>
              <h2 className="an-h3">{c.title}</h2>
              <p>{c.thesis}</p>
              <p className="an-mut">{c.how}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- entradas: tipo, cantidad y resumen (demo: no se cobra nada) ---------- */
function Tickets() {
  const [type, setType] = useState("general");
  const [qty, setQty] = useState(2);
  const [name, setName] = useState("");
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("tipo");
    if (t && TICKETS.some((x) => x.id === t && !x.soldOut)) setType(t);
  }, []);
  const t = TICKETS.find((x) => x.id === type)!;
  const sub = t.price * qty, fees = FEE * qty;
  return (
    <div className="an-page an-wrap">
      <div className="an-pagehead">
        <div>
          <p className="an-kicker">31 de octubre · {BRAND.venue}</p>
          <h1 className="an-h1">Entradas</h1>
          <Countdown to={EVENT.start} label="Faltan" size="sm" variant="minimal" className="an-count" />
        </div>
        {/* la tumba de la runa (modelo de Sketchfab, CC BY): se gira un poco hacia el puntero */}
        <ObjectStage src="/models/tumba-magica/tumba-magica-transformed.glb" motion="pointer" follow={0.35} glow="acc" env="none" height={340} alt="Una lápida vieja con una runa que brilla en rojo" className="an-pagehead__obj" />
      </div>
      <div className="an-buy">
        <div className="an-buy__form">
          <OptionPicker kind="chip" label="Tipo de entrada" value={type} onChange={setType} options={TICKETS.map((x) => ({ value: x.id, label: `${x.name} · ${money(x.price)}`, disabled: x.soldOut }))} />
          <p className="an-mut">{t.note}</p>
          <div className="an-buy__row">
            <span>Cuántas</span>
            <QuantityStepper value={qty} onChange={setQty} min={1} max={MAX_TICKETS} label={`entrada ${t.name}`} />
          </div>
          <TextField label="Nombre en las entradas" value={name} onChange={setName} placeholder="Como en tu DNI" autoComplete="name" variant="minimal" />
        </div>
        <aside className="an-buy__sum" aria-live="polite">
          <p className="an-label">Resumen</p>
          <dl>
            <div><dt>{qty} × {t.name}</dt><dd>{money(sub)}</dd></div>
            <div><dt>Gastos de gestión</dt><dd>{money(fees)}</dd></div>
            <div className="an-buy__total"><dt>Total</dt><dd>{money(sub + fees)}</dd></div>
          </dl>
          <button type="button" className="an-btn" disabled={!name.trim()} onClick={() => setDone(`ANIMA-${t.id.toUpperCase()}-${qty}-${name.trim().slice(0, 12).toUpperCase().replace(/\s+/g, "")}`)}>
            Reservar
          </button>
          <p className="an-mut an-small">Esto es una demo: no se cobra nada ni se piden datos de pago.</p>
          {done && (
            <div className="an-buy__ok">
              <QRCode value={done} codeSize={120} caption="" />
              <p>Reservado (de mentira). Enseña este código en la puerta.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------- laboratorio: contar una historia moviendo cosas entre sitios y entre rutas ---------- */
/**
 * Tres gestos (docs/20 §2e), con dos `Traveler` que viven en el Shell:
 * 1. una gema sin dueño, en una vitrina;
 * 2. al pulsarla, viaja hasta la cuenca de la calavera (otro hueco en la misma página, dentro de `startTransition`) y,
 *    al llegar, la calavera la toma como ojo (el estado vive en el Shell: dura al navegar);
 * 3. «Que vigile la noche»: se navega al programa y la calavera, la misma, vuela del laboratorio al navbar.
 */
function Laboratory() {
  const { gemSet, setGemSet } = useContext(Lab);
  const [placing, setPlacing] = useState(false);
  // dónde está la cuenca del busto al pulsar (el busto la mide en cada fotograma)
  const [eyeAt, setEyeAt] = useState({ x: bustEye.x, y: bustEye.y });
  const gemAt = useTraveler("gema");
  // al llegar al ojo, la calavera la incorpora y el viajero se va (su hueco desaparece)
  useEffect(() => {
    if (gemAt !== "ojo") return;
    const t = setTimeout(() => {
      setGemSet(true);
      setPlacing(false);
    }, 950);
    return () => clearTimeout(t);
  }, [gemAt, setGemSet]);
  const step = gemSet ? 3 : placing ? 2 : 1;
  return (
    <div className="an-page an-wrap an-lab">
      <p className="an-kicker">Laboratorio · historias que se mueven</p>
      <h1 className="an-h1">El ojo de la calavera</h1>
      <ol className="an-lab__steps">
        <li data-on={step === 1 ? "" : undefined}><b>Una gema sin dueño.</b> Lleva siglos en esta vitrina esperando a alguien.</li>
        <li data-on={step === 2 ? "" : undefined}><b>Devuélvele el ojo.</b> Pulsa la gema: volará hasta la cuenca vacía.</li>
        <li data-on={step === 3 ? "" : undefined}><b>Que vigile la noche.</b> La calavera se va al navbar y te acompaña por la web.</li>
      </ol>
      <div className="an-lab__scene">
        <div className="an-lab__skull">
          <TravelSlot id="calavera" at="lab" priority={1} className="an-lab__skullslot" />
          {/* el hueco del ojo, sobre la cuenca del busto (su sitio, en % del hueco de la calavera) */}
          {placing && !gemSet && <TravelSlot key="ojo" id="gema" at="ojo" className="an-lab__eye" style={{ left: `${eyeAt.x * 100}%`, top: `${eyeAt.y * 100}%` }} />}
        </div>
        <div className="an-lab__case">
          {!placing && !gemSet && (
            <>
              <TravelSlot key="vitrina" id="gema" at="vitrina" className="an-lab__gemslot" />
              <button type="button" className="an-lab__take" onClick={() => {
                setEyeAt({ x: bustEye.x, y: bustEye.y });
                startTransition(() => setPlacing(true));
              }}>
                Coger la gema
              </button>
            </>
          )}
          {gemSet && <p className="an-mut">La vitrina está vacía.</p>}
        </div>
      </div>
      <div className="an-lab__actions">
        {gemSet ? (
          <a className="an-btn" href={href("programa")}>Que vigile la noche →</a>
        ) : (
          <p className="an-mut">Primero, la gema.</p>
        )}
        {gemSet && (
          <button type="button" className="an-link" onClick={() => setGemSet(false)}>
            Devolver la gema a la vitrina
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- información práctica ---------- */
function Info() {
  return (
    <div className="an-page an-wrap">
      <div className="an-pagehead">
        <div>
          <p className="an-kicker">Antes de venir</p>
          <h1 className="an-h1">Información</h1>
        </div>
        {/* un ojo que te sigue con la mirada (modelo de Sketchfab, CC BY) */}
        <ObjectStage src="/models/ojo-sangre/ojo-sangre-transformed.glb" motion="pointer" follow={1.2} height={260} alt="Un ojo que sigue al puntero con la mirada" className="an-pagehead__obj" />
      </div>
      <div className="an-split">
        <div>
          <h2 className="an-h3">Dónde</h2>
          <p className="an-lead">{BRAND.venue}<br />{BRAND.address}</p>
          <p className="an-mut">{BRAND.zone}. <a className="an-link" href={BRAND.map} target="_blank" rel="noopener noreferrer">Abrir el mapa →</a></p>
          <dl className="an-rules">
            {RULES.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>
        <FAQSection kicker="" title="Preguntas frecuentes" subtitle="" items={FAQ} variant="minimal" />
      </div>
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const p = path[0] ?? "";
  if (p === "programa") return <Program />;
  if (p === "entradas") return <Tickets />;
  if (p === "info") return <Info />;
  if (p === "laboratorio") return <Laboratory />;
  return <Home />;
}
