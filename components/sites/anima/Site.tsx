"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import ActionBar from "@/components/ui/ActionBar";
import CookieBanner from "@/components/ui/CookieBanner";
import Countdown from "@/components/ui/Countdown";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Hero from "@/components/ui/Hero";
import IslandNav from "@/components/ui/IslandNav";
import Marquee from "@/components/ui/Marquee";
import OptionPicker from "@/components/ui/OptionPicker";
import QRCode from "@/components/ui/QRCode";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SmoothScroll from "@/components/ui/SmoothScroll";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import { getLenis } from "@/lib/motion/lenis";
import { phosphorLight } from "@/lib/ui/icons-phosphor-light";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useSiteNavigate } from "../shared";
import SkullStage from "./SkullStage";
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

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  return (
    <SiteFrame tokens={TOKENS} className="an" icons={{ set: phosphorLight, weight: "light" }}>
      {/* scroll con inercia larga: la noche se baja despacio */}
      <SmoothScroll lerp={0.045} wheelMultiplier={0.85} syncGsap={false} />
      <a className="an-skip" href="#contenido">Saltar al contenido</a>
      <IslandNav
        className="an-island"
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
        brand={<a className="an-brand" href={href()} aria-label="Ánima, inicio" onClick={toTopIfHome}>Ánima</a>}
        trailing={<a className="an-island__cta" href={href("entradas")}>Entradas <span aria-hidden>→</span></a>}
      />
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
      <p className="an-wrap an-foot__small">{BRAND.legal} · Demo de Trama: el evento no existe y no se cobra nada.</p>
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
  hud?: { r: number; labels: string[] };
};
const BEATS: Beat[] = [
  // portada: la calavera casi a pantalla, con los ojos encendidos
  { kind: "hero", chapter: -1, room: "violeta", pose: P({ zoom: 0.5, eye: 0.95, y: 0.06 }) },
  // prólogo: a la derecha del manifiesto, girada hacia él
  { kind: "intro", chapter: -1, room: "violeta", pose: P({ x: 0.22, zoom: 0.85, yaw: -0.45, eye: 0.5 }) },
  // 01 la puerta: de tres cuartos, despertando → interludio: de frente, la boca entreabierta
  { kind: "card", chapter: 0, room: "calabaza", pose: P({ x: 0.22, yaw: -0.55, eye: 0.6 }), hud: { r: 150, labels: ["Puertas · 21:00", "aforo 1.200", "+16"] } },
  { kind: "interlude", chapter: 0, room: "calabaza", pose: P({ yaw: 0.25, zoom: 0.78, jaw: 0.25, eye: 0.85 }) },
  // 02 el pasaje: la cámara entra en la cuenca → interludio: los ojos se tiñen y la boca se abre
  { kind: "card", chapter: 1, room: "verde", pose: P({ close: 1, eye: 1, x: -0.12 }), hud: { r: 120, labels: ["90 m", "6 personas", "cada 10 min"] } },
  { kind: "interlude", chapter: 1, room: "verde", pose: P({ yaw: -0.3, zoom: 0.8, jaw: 0.55, red: 0.45, eye: 1 }) },
  // 03 la pista: castañetea al ritmo → interludio: baila en el centro
  { kind: "card", chapter: 2, room: "violeta", pose: P({ x: 0.22, yaw: 0.45, talk: 1, jaw: 0.15, eye: 1 }), hud: { r: 150, labels: ["3 DJs", "2 salas", "22:00 – 6:00"] } },
  { kind: "interlude", chapter: 2, room: "violeta", pose: P({ zoom: 0.76, talk: 1, jaw: 0.3, eye: 1, yaw: -0.15 }) },
  // 04 el concurso: de perfil, mirando al público → interludio: el trío de calaveras
  { kind: "card", chapter: 3, room: "sangre", pose: P({ x: -0.2, yaw: 0.6, eye: 0.7 }), hud: { r: 150, labels: ["500 €", "vota el público", "1:00"] } },
  { kind: "interlude", chapter: 3, room: "sangre", pose: P({ trio: 1, zoom: 1.15, talk: 0.5, eye: 0.9 }) },
  // 05 la cena: el cráneo se abre → interludio: abierto, girando
  { kind: "card", chapter: 4, room: "calabaza", pose: P({ x: 0.2, split: 1, yaw: 0.5, eye: 0.6 }), hud: { r: 170, labels: ["4 food trucks", "veganas y sin gluten", "barra hasta las 5:30"] } },
  { kind: "interlude", chapter: 4, room: "calabaza", pose: P({ split: 0.55, yaw: 1.4, zoom: 0.85, eye: 0.7 }) },
  // 06 medianoche: los ojos en rojo → final: de frente, en rojo, riendo
  { kind: "card", chapter: 5, room: "sangre", pose: P({ x: -0.2, red: 1, eye: 1, jaw: 0.45, yaw: -0.3 }), hud: { r: 150, labels: ["0:00", "1 minuto a oscuras", "fuego en el patio"] } },
  { kind: "interlude", chapter: 5, room: "sangre", pose: P({ red: 1, eye: 1, zoom: 0.68, jaw: 0.7, talk: 0.35 }) },
];
const POSE_KEYS = Object.keys(SKULL_REST) as (keyof SkullPose)[];
const cardStep = (c: number) => BEATS.findIndex((b) => b.kind === "card" && b.chapter === c);
const smooth = (t: number) => t * t * (3 - 2 * t);
const MANIFESTO = "Una nave abandonada junto al puerto, dos pistas, un pasaje del terror y mil calaveras encendidas. Ven disfrazado o te disfrazamos en la puerta.";
const MANIFESTO_WORDS = MANIFESTO.split(" ");

function Home() {
  const list = useRef<HTMLOListElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLParagraphElement>(null);
  const pose = useRef<SkullPose>({ ...BEATS[0].pose });
  const focus = useRef<{ x: number; y: number } | null>(null);
  const [step, setStep] = useState(0);

  // la pose, los pesos de las salas, las cintas y los cuadros salen de dónde está la línea media entre los centros de dos pasos
  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    const cards = Array.from(sticky.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!items.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = innerHeight / 2;
      const centers = items.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let j = 0;
      while (j < centers.length - 1 && centers[j + 1] <= mid) j++;
      const raw = j >= centers.length - 1 || mid <= centers[0] ? 0 : Math.min(1, Math.max(0, (mid - centers[j]) / (centers[j + 1] - centers[j])));
      const t = smooth(Math.min(1, Math.max(0, (raw - 0.15) / 0.7)));
      const a = BEATS[j].pose, b = BEATS[Math.min(j + 1, BEATS.length - 1)].pose, p = pose.current;
      for (const k of POSE_KEYS) p[k] = a[k] + (b[k] - a[k]) * t;
      // en móvil la calavera va centrada en la mitad de arriba (los cuadros, debajo), sin trío (no cabe) y sin entrar tanto
      if (innerWidth < 900) {
        p.x = 0;
        p.trio = 0;
        p.close *= 0.7;
        p.zoom *= 1.15;
      }
      const st = sticky.current?.style;
      const span = centers[centers.length - 1] - centers[0];
      st?.setProperty("--story-p", String(Math.min(1, Math.max(0, (mid - centers[0]) / (span || 1)))));
      for (let k = 0; k < BEATS.length; k++) st?.setProperty(`--w${k}`, (k === j ? 1 - t : k === j + 1 ? t : 0).toFixed(3));
      st?.setProperty("--ring-x", p.x.toFixed(3));
      const il = (k: number) => (BEATS[k]?.kind === "interlude" ? 1 : 0);
      st?.setProperty("--ilv", (il(j) * (1 - t) + il(j + 1) * t).toFixed(3));
      for (let k = 0; k < centers.length; k++) {
        const gap = (centers[Math.min(k + 1, centers.length - 1)] - centers[Math.max(k - 1, 0)]) / 2 || innerHeight;
        const r = Math.min(1.2, Math.max(-1.2, (mid - centers[k]) / gap));
        st?.setProperty(`--r${k}`, r.toFixed(4));
        st?.setProperty(`--o${k}`, (1 - smooth(Math.min(1, Math.max(0, (Math.abs(r) - 0.3) / 0.15)))).toFixed(3));
      }
      // cuadros: suben con el scroll, llegan desde abajo desenfocados y se van por arriba, por detrás de la calavera
      for (const el of cards) {
        const k = Number(el.dataset.card);
        const y = centers[k] - mid;
        const d = Math.abs(y) / innerHeight;
        const op = 1 - smooth(Math.min(1, Math.max(0, (d - 0.16) / 0.3)));
        const blur = still ? 0 : 16 * smooth(Math.min(1, Math.max(0, (d - 0.08) / 0.35)));
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = op.toFixed(3);
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "";
        el.style.visibility = op < 0.02 ? "hidden" : "";
        el.style.setProperty("--y", y.toFixed(1));
      }
      st?.setProperty("--story-end", Math.min(1, Math.max(0, (mid - centers[centers.length - 1]) / (innerHeight * 0.5))).toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, []);

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
          <svg className="an-hud" viewBox="-200 -200 400 400" aria-hidden>
            {BEATS.map(({ hud: h, pose: bp }, k) => h && (
              <g key={k} className="an-hud__g" style={{ "--w": `var(--w${k}, 0)` } as CSSProperties}>
                <circle r={h.r} pathLength={1} />
                <circle r={h.r + 14} pathLength={1} className="an-hud__thin" />
                <line x1={-h.r - 40} y1={0} x2={-h.r - 8} y2={0} pathLength={1} />
                <line x1={h.r + 8} y1={0} x2={h.r + 40} y2={0} pathLength={1} />
                <line x1={0} y1={-h.r - 40} x2={0} y2={-h.r - 8} pathLength={1} />
                {h.labels.map((l, i) => (
                  <text key={i} x={bp.x > 0 ? -h.r - 30 : h.r + 30} y={-h.r * 0.5 + i * 15} textAnchor={bp.x > 0 ? "end" : "start"} className={i === 0 ? "an-hud__big" : ""}>{l}</text>
                ))}
              </g>
            ))}
          </svg>
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
            <div className="an-step__hero">
              <Hero
                align="center"
                backdrop="none"
                variant="minimal"
                kicker={`31 de octubre · ${BRAND.city}`}
                title="La fiesta de Halloween más terrorífica de Valencia."
                subtitle={`Pasaje del terror, dos pistas hasta las seis y concurso de disfraces en ${BRAND.venue}. Abrimos a las nueve.`}
                primaryCta="Comprar entradas"
                primaryHref={href("entradas")}
                secondaryCta="Ver el programa"
                secondaryHref={href("programa")}
                badges=""
                className="an-step__herokit"
              />
              <Countdown to={EVENT.start} label="Faltan" done="¡Ya ha empezado! Te esperamos dentro." size="md" variant="minimal" className="an-count" />
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
      <p className="an-kicker">31 de octubre · {BRAND.venue}</p>
      <h1 className="an-h1">Entradas</h1>
      <Countdown to={EVENT.start} label="Faltan" size="sm" variant="minimal" className="an-count" />
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

/* ---------- información práctica ---------- */
function Info() {
  return (
    <div className="an-page an-wrap">
      <p className="an-kicker">Antes de venir</p>
      <h1 className="an-h1">Información</h1>
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
  return <Home />;
}
