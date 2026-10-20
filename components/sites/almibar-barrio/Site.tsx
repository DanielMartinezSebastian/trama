"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import ActionBar from "@/components/ui/ActionBar";
import CookieBanner from "@/components/ui/CookieBanner";
import MenuList, { type MenuItem } from "@/components/ui/MenuList";
import OpeningHours from "@/components/ui/OpeningHours";
import QRCode from "@/components/ui/QRCode";
import QuantityStepper from "@/components/ui/QuantityStepper";
import TextField from "@/components/ui/TextField";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { money } from "@/lib/commerce/money";
import { BRAND, FAQ, LEGAL, PRODUCTS, REVIEWS, STORES, bakeryJsonLd, menuSections } from "@/lib/sites/almibar";
import { photo } from "@/lib/sites/photos";
import { video } from "@/lib/sites/videos";
import { JsonLd } from "@/lib/seo";
import { dotmatrixTokens, tokensToStyle } from "@/lib/ui/tokens";
import { phosphor } from "@/lib/ui/icons-phosphor";
import { SiteFrame, siteHref, useActiveIndex } from "../shared";
import { ACCESS, CLUB, GETTING, QR_STEPS, SHOWCASE, SLUG, TABLES, TABLE_STORE } from "./data";
import "./barrio.css";

// dot matrix en claro: papel crema, tinta casi negra y un solo acento naranja tostado. glow=false: el halo de la variante
// (`--s-ts`, brillo de --fg) oscurecería el texto oscuro sobre el papel (guía §8.0).
const TOKENS: CSSProperties = tokensToStyle({
  ...dotmatrixTokens,
  bg: "#f3eee4",
  fg: "#1d1a17",
  mut: "#5b5148",
  acc: "#b9501d",
  acc2: "#1d1a17",
  card: "#ebe4d6",
  ln: "rgba(29,26,23,0.24)",
  r: 0,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  glow: false,
});

const href = (p = "") => siteHref(SLUG, p);
const TOAST = "bb-toast";
const centro = STORES.find((s) => s.id === TABLE_STORE)!;
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

/** Origen real en el cliente (los QR apuntan a esta misma web); en el servidor, un dominio de ejemplo. */
function useOrigin() {
  const [o, setO] = useState("https://almibar.example");
  useEffect(() => setO(location.origin), []);
  return o;
}

/* ---------- marco ---------- */
const NAV = [
  { label: "Carta", path: "carta" },
  { label: "Club", path: "club" },
  { label: "Visítanos", path: "visitanos" },
];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const atTable = path.startsWith(href("mesa/"));
  const active = useActiveIndex(NAV.map((n) => href(n.path)));
  const [cookieKey, setCookieKey] = useState(0);
  const reopenCookies = () => {
    try {
      localStorage.removeItem("almibar-barrio-cookies");
    } catch {
      /* sin almacenamiento */
    }
    setCookieKey((k) => k + 1);
  };
  return (
    <SiteFrame tokens={TOKENS} className="bb" icons={{ set: phosphor, weight: "regular" }}>
        {!atTable && (
          <header className="bb-head">
            <a className="bb-brand" href={href()} aria-label="Almíbar, inicio">
              almíbar<span aria-hidden>·</span>
            </a>
            <nav className="bb-nav" aria-label="Principal">
              {NAV.map((n, i) => (
                <a key={n.path} href={href(n.path)} aria-current={i === active ? "page" : undefined}>
                  {n.label}
                </a>
              ))}
            </nav>
            <OpeningHours hours={centro.hours} exceptions={centro.exceptions} layout="badge" variant="dotmatrix" className="bb-head__hours" />
          </header>
        )}
        <main id="contenido">{children}</main>
        {!atTable && <SiteFooter onCookies={reopenCookies} />}
        {!atTable && (
          <ActionBar
            variant="dotmatrix"
            onNavigate={(h) => router.push(h)}
            actions={[
              { label: "Llamar", href: BRAND.phoneHref, icon: "phone" },
              { label: "WhatsApp", href: BRAND.whatsappHref, icon: "message" },
              { label: "Cómo llegar", href: centro.map, icon: "map-pin" },
              { label: "Carta", href: href("carta"), icon: "coffee", primary: true },
            ]}
          />
        )}
        <Toast id={TOAST} position={atTable ? "top-center" : "bottom-center"} variant="dotmatrix" intentStyle="mono" showTrigger={false} />
        <CookieBanner key={cookieKey} storageKey="almibar-barrio-cookies" variant="dotmatrix" policyHref="#cookies" title="Cookies de las de verdad, no" text="Solo usamos las imprescindibles para que el pedido funcione. Las de medición, si tú quieres." />
    </SiteFrame>
  );
}

function SiteFooter({ onCookies }: { onCookies: () => void }) {
  return (
    <footer className="bb-foot">
      <div className="bb-wrap bb-foot__grid">
        <div>
          <p className="bb-foot__brand">almíbar·</p>
          <p>{BRAND.tagline} · {BRAND.city}</p>
          <p>
            <a href={BRAND.phoneHref}>{BRAND.phone}</a> · <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> · {BRAND.instagram}
          </p>
        </div>
        <div>
          {STORES.map((s) => (
            <p key={s.id}>
              <b>{s.name}</b>
              <br />
              {s.address}
            </p>
          ))}
        </div>
        <nav aria-label="Legal" className="bb-foot__legal">
          {LEGAL.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
          <button type="button" onClick={onCookies}>Configurar cookies</button>
          <a href="/creditos">Créditos de fotos y vídeo</a>
        </nav>
      </div>
      <p className="bb-wrap bb-foot__demo">
        {BRAND.legal}. Demo de Trama: no se envía ningún pedido ni se guarda ningún dato. {BRAND.sanitary}.
      </p>
    </footer>
  );
}

/* ---------- piezas ---------- */
function Stars({ n }: { n: number }) {
  return (
    <span className="bb-stars" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} data-on={i < n ? "" : undefined} />
      ))}
    </span>
  );
}

function StampCard({ stamps, goal }: { stamps: number; goal: number }) {
  return (
    <div className="bb-card" role="img" aria-label={`Tarjeta de sellos: ${stamps} de ${goal} cafés. Te faltan ${goal - stamps} para el gratis.`}>
      <div className="bb-card__top">
        <span>almíbar· club</span>
        <span>{stamps}/{goal}</span>
      </div>
      <div className="bb-card__stamps">
        {Array.from({ length: goal }, (_, i) => (
          <i key={i} data-on={i < stamps ? "" : undefined} data-gift={i === goal - 1 ? "" : undefined} />
        ))}
      </div>
      <p className="bb-card__note">{goal - stamps > 0 ? `Te faltan ${goal - stamps} para el café gratis` : "¡El próximo café es nuestro!"}</p>
    </div>
  );
}

function Stores() {
  return (
    <div className="bb-stores">
      {STORES.map((s) => (
        <article key={s.id} className="bb-store">
          <h3>{s.name}</h3>
          <p className="bb-mut">{s.address} · {s.zone}</p>
          <OpeningHours hours={s.hours} exceptions={s.exceptions} layout="compact" title="" variant="dotmatrix" />
          <p className="bb-links">
            <a href={s.map} target="_blank" rel="noopener noreferrer">Cómo llegar ↗</a>
            <a href={BRAND.phoneHref}>Llamar</a>
          </p>
        </article>
      ))}
    </div>
  );
}

/* ---------- inicio ---------- */
function Home() {
  const v = video("obrador", 0);
  return (
    <>
      <section className="bb-hero" aria-labelledby="bb-hero-t">
        <div className="bb-hero__bg" aria-hidden>
          <VideoPlayer src={v.src} poster={v.posterSrc} title={v.alt} background ascii asciiStyle="dots" asciiCell={7} asciiColor="accent" asciiHover="none" />
        </div>
        <div className="bb-wrap bb-hero__in">
          <div className="bb-panel bb-hero__panel">
            <p className="bb-eyebrow">Café y obrador · {BRAND.city} · desde {BRAND.since}</p>
            <h1 id="bb-hero-t" className="bb-h1">El café de tu barrio, con el horno a la vista.</h1>
            <p className="bb-lead">Bollería de madrugada, tartas por porción y café de Huesca. Pide desde la mesa con el QR o pásate a por pan.</p>
            <OpeningHours hours={centro.hours} exceptions={centro.exceptions} layout="badge" variant="dotmatrix" />
            <div className="bb-cta">
              <a className="bb-btn bb-btn--pri" href={href("carta")}>Ver la carta</a>
              <a className="bb-btn" href={href("visitanos")}>Cómo llegar</a>
            </div>
          </div>
        </div>
        <p className="bb-hero__cap">{v.alt}, pintadas en puntos.</p>
      </section>

      <section className="bb-wrap bb-sec" aria-labelledby="bb-vit">
        <div className="bb-row">
          <h2 id="bb-vit" className="bb-h2">Hoy en la vitrina</h2>
          <p className="bb-mut">Actualizado a las 11:40 · Centro</p>
        </div>
        <ul className="bb-vitrina">
          {SHOWCASE.map(({ id, left }) => {
            const p = byId[id];
            return (
              <li key={id} data-out={left === 0 ? "" : undefined}>
                <span className="bb-vitrina__n">{p.name}</span>
                <span className="bb-vitrina__p">{money(p.price)}</span>
                <span className="bb-vitrina__left" data-low={left > 0 && left <= 4 ? "" : undefined}>
                  {left === 0 ? "agotado hasta mañana" : `quedan ${left}`}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="bb-mut">¿Lo quieres seguro? Te lo guardamos: escríbenos por <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
      </section>

      <section className="bb-band" aria-labelledby="bb-qr">
        <div className="bb-wrap bb-sec bb-qrhow">
          <div>
            <h2 id="bb-qr" className="bb-h2">Pide desde tu mesa</h2>
            <ol className="bb-steps">
              {QR_STEPS.map((s) => (
                <li key={s.n}>
                  <span className="bb-steps__n" aria-hidden>{s.n}</span>
                  <div>
                    <b>{s.t}</b>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="bb-btn" href={href("mesa/7")}>Probar con la mesa 7 →</a>
          </div>
          <TableQR n={7} size={220} />
        </div>
      </section>

      <section className="bb-wrap bb-sec bb-split" aria-labelledby="bb-club">
        <div>
          <h2 id="bb-club" className="bb-h2">Diez cafés, uno es nuestro</h2>
          <p className="bb-lead">El club no tiene app ni cuota: tu tarjeta es un código en el móvil que enseñas en barra.</p>
          <a className="bb-btn bb-btn--pri" href={href("club")}>Hacerme socio</a>
        </div>
        <StampCard stamps={CLUB.demoStamps} goal={CLUB.goal} />
      </section>

      <section className="bb-wrap bb-sec" aria-labelledby="bb-donde">
        <div className="bb-row">
          <h2 id="bb-donde" className="bb-h2">Dónde estamos</h2>
          <a href={href("visitanos")}>Horario completo y accesibilidad →</a>
        </div>
        <Stores />
      </section>

      <section className="bb-wrap bb-sec" aria-labelledby="bb-res">
        <div className="bb-row">
          <h2 id="bb-res" className="bb-h2">Lo que dicen</h2>
          <p className="bb-score">
            <b>{BRAND.rating.value.toLocaleString("es-ES")}</b> <Stars n={5} /> {BRAND.rating.count} reseñas en {BRAND.rating.source}
          </p>
        </div>
        <div className="bb-reviews">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="bb-review">
              <Stars n={r.rating} />
              <blockquote>«{r.quote}»</blockquote>
              <figcaption>{r.name} · {r.role}</figcaption>
            </figure>
          ))}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bb-photo" src={photo("pasteleria", 11).src} alt="Un café con leche y una porción de tarta de chocolate sobre una mesa de madera de la terraza" loading="lazy" />
      </section>
    </>
  );
}

/* ---------- QR de mesa ---------- */
function TableQR({ n, size = 200 }: { n: number; size?: number }) {
  const origin = useOrigin();
  return (
    <div className="bb-qrcard">
      <p className="bb-qrcard__t">Mesa {n}</p>
      <QRCode value={`${origin}${href(`mesa/${n}`)}`} shape="dots" codeSize={size} ecc="M" label={`Código QR de la mesa ${n}: abre la carta para pedir desde la mesa`} />
      <p className="bb-qrcard__c">Escanea para ver la carta y pedir · almíbar·</p>
    </div>
  );
}

/* ---------- carta ---------- */
function Carta() {
  const sections = useMemo(() => menuSections(), []);
  return (
    <>
      <section className="bb-wrap bb-sec bb-carta">
        <p className="bb-eyebrow">Carta · las dos tiendas</p>
        <h1 className="bb-h1 bb-h1--sm">Carta</h1>
        <p className="bb-lead">Precios con IVA. Junto a cada plato van sus alérgenos; usa «Sin…» para ocultar lo que no puedes tomar.</p>
        <MenuList menu={sections} variant="dotmatrix" layout="columns" />
      </section>
      <section className="bb-band bb-print" aria-labelledby="bb-qrs">
        <div className="bb-wrap bb-sec">
          <div className="bb-row bb-noprint">
            <div>
              <h2 id="bb-qrs" className="bb-h2">Para el local: QR de las mesas</h2>
              <p className="bb-mut">Cada código abre la carta de su mesa con el pedido a barra. Imprime en A4, recorta y pon uno en cada servilletero.</p>
            </div>
            <button type="button" className="bb-btn bb-btn--pri" onClick={() => window.print()}>Imprimir los 12</button>
          </div>
          <div className="bb-qrgrid">
            {TABLES.map((n) => (
              <TableQR key={n} n={n} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- mesa ---------- */
type Line = { id: string; name: string; price: number; qty: number };

function Mesa({ n }: { n: number }) {
  const key = `almibar-barrio:mesa-${n}`;
  const [lines, setLines] = useState<Line[]>([]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<Line[] | null>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const sections = useMemo(() => menuSections({ exclude: ["Panes"] }), []);

  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(key) ?? "[]");
      if (Array.isArray(s)) setLines(s);
    } catch {
      /* nada */
    }
  }, [key]);
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(lines));
    } catch {
      /* nada */
    }
  }, [key, lines]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const add = (it: MenuItem) => {
    setLines((cur) => {
      const i = cur.findIndex((l) => l.id === it.id);
      if (i >= 0) return cur.map((l, k) => (k === i ? { ...l, qty: l.qty + 1 } : l));
      return [...cur, { id: it.id ?? it.name, name: it.name, price: it.price ?? 0, qty: 1 }];
    });
    sonnerToast(`${it.name} · añadido`, { toasterId: TOAST, duration: 1600 });
  };
  const setQty = (id: string, q: number) => setLines((cur) => (q <= 0 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, qty: q } : l))));
  const send = () => {
    setSent(lines);
    setLines([]);
    setNote("");
    sheet.current?.close();
    sonnerToast.success("En marcha · te lo llevamos", { description: `Mesa ${n}: el pedido ya está en la barra.`, toasterId: TOAST });
  };

  return (
    <div className="bb-mesa">
      <header className="bb-mesa__head">
        <a className="bb-brand" href={href()}>almíbar<span aria-hidden>·</span></a>
        <div>
          <h1 className="bb-mesa__t">Mesa {n}</h1>
          <p className="bb-mut">{centro.name}</p>
        </div>
      </header>
      {sent && (
        <div className="bb-panel bb-sent" role="status">
          <b>En marcha · te lo llevamos</b>
          <p>{sent.map((l) => `${l.qty} × ${l.name}`).join(", ")}. Pagas al final, en barra o en la mesa.</p>
          <button type="button" className="bb-linkbtn" onClick={() => setSent(null)}>Cerrar</button>
        </div>
      )}
      <p className="bb-mut bb-mesa__lead">Añade lo que quieras y envíalo a barra. Sin registrarte; pagas como siempre.</p>
      <MenuList menu={sections} variant="dotmatrix" onAdd={add} addLabel="Añadir" legend footnote="Precios con IVA. Si tienes una alergia, díselo también a quien te atienda: en el obrador se manipulan los 14 alérgenos." />

      <dialog ref={sheet} className="bb-sheet" aria-labelledby="bb-sheet-t" onClick={(e) => e.target === sheet.current && sheet.current?.close()}>
        <div className="bb-sheet__in">
          <div className="bb-row">
            <h2 id="bb-sheet-t" className="bb-h3">Tu pedido · mesa {n}</h2>
            <button type="button" className="bb-linkbtn" onClick={() => sheet.current?.close()}>Cerrar</button>
          </div>
          {lines.length === 0 ? (
            <p className="bb-mut">Aún no has añadido nada.</p>
          ) : (
            <>
              <ul className="bb-lines">
                {lines.map((l) => (
                  <li key={l.id}>
                    <span>{l.name}<small>{money(l.price)}</small></span>
                    <QuantityStepper value={l.qty} onChange={(q) => setQty(l.id, q)} min={0} max={20} label={l.name} size="sm" />
                  </li>
                ))}
              </ul>
              <TextField label="Nota para barra" placeholder="Sin azúcar, para compartir…" value={note} onChange={setNote} variant="dotmatrix" name="nota" />
              <p className="bb-total"><span>Total</span><b>{money(total)}</b></p>
              <button type="button" className="bb-btn bb-btn--pri bb-btn--block" onClick={send}>Enviar a barra · {count} {count === 1 ? "cosa" : "cosas"}</button>
            </>
          )}
        </div>
      </dialog>

      <ActionBar
        show="always"
        variant="dotmatrix"
        label={`Acciones de la mesa ${n}`}
        actions={[
          { label: "Llamar al camarero", icon: "bell", onClick: () => sonnerToast(`Avisado: vamos a la mesa ${n}`, { toasterId: TOAST }) },
          { label: "Pedir la cuenta", icon: "file-text", onClick: () => sonnerToast(`Te llevamos la cuenta a la mesa ${n}`, { toasterId: TOAST }) },
          { label: `Ver pedido (${count})`, icon: "shopping-cart", primary: true, onClick: () => sheet.current?.showModal() },
        ]}
      />
    </div>
  );
}

/* ---------- club ---------- */
function Club() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [news, setNews] = useState(false);
  const [bday, setBday] = useState(false);
  const [done, setDone] = useState(false);
  const valid = name.trim().length > 1 && (/^\S+@\S+\.\S+$/.test(contact) || /^\+?\d[\d\s]{8,}$/.test(contact.trim()));
  return (
    <section className="bb-wrap bb-sec">
      <p className="bb-eyebrow">Club de sellos</p>
      <h1 className="bb-h1 bb-h1--sm">Diez cafés, uno es nuestro.</h1>
      <div className="bb-split bb-split--top">
        <div className="bb-stack">
          <StampCard stamps={done ? 0 : CLUB.demoStamps} goal={CLUB.goal} />
          <ul className="bb-perks">
            {CLUB.perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="bb-mut bb-small">{CLUB.terms}</p>
        </div>
        <div className="bb-panel bb-stack">
          {!done ? (
            <form
              className="bb-stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) setDone(true);
              }}
            >
              <h2 className="bb-h3">Hazte socio en 20 segundos</h2>
              <TextField label="Nombre" placeholder="Lucía" value={name} onChange={setName} variant="dotmatrix" name="name" required />
              <TextField label="Correo o móvil" placeholder="lucia@correo.com o 600 000 000" value={contact} onChange={setContact} variant="dotmatrix" name="contact" required hint="Solo para tu tarjeta y, si lo marcas abajo, los avisos. Demo: no se guarda." />
              <Toggle label="Avísame de los dulces de temporada (1 correo al mes como mucho)" checked={news} onChange={setNews} variant="editorial" size="sm" onText="Sí" offText="No" className="bb-toggle" />
              <Toggle label="Quiero la porción de cumpleaños (te pediremos el día, no el año)" checked={bday} onChange={setBday} variant="editorial" size="sm" onText="Sí" offText="No" className="bb-toggle" />
              <p className="bb-mut bb-small">Tratamos tus datos para gestionar la tarjeta de sellos. Puedes darte de baja cuando quieras. <a href="#privacidad">Privacidad</a>.</p>
              <button type="submit" className="bb-btn bb-btn--pri" disabled={!valid}>Crear mi tarjeta</button>
            </form>
          ) : (
            <div className="bb-stack bb-center" role="status">
              <h2 className="bb-h3">¡Hola, {name.split(" ")[0]}! Ya eres del club</h2>
              <p className="bb-mut">Enseña este código en barra con cada café. Guárdalo en favoritos o haz una captura.</p>
              <QRCode value={`${CLUB.code}`} shape="dots" codeSize={200} label={`Tu código de socio: ${CLUB.code}`} caption={CLUB.code} />
            </div>
          )}
          {!done && (
            <div className="bb-mine">
              <QRCode value={CLUB.code} shape="dots" codeSize={120} label={`Código de socio de ejemplo: ${CLUB.code}`} />
              <p className="bb-small bb-mut">Así será tu código: lo escaneamos en barra y suma el sello. Sin app.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- visítanos ---------- */
function Visit() {
  const [url, setUrl] = useState("https://almibar.example" + href("visitanos"));
  useEffect(() => setUrl(location.href), []);
  return (
    <>
      <JsonLd data={bakeryJsonLd(url)} />
      <section className="bb-wrap bb-sec">
        <p className="bb-eyebrow">Visítanos</p>
        <h1 className="bb-h1 bb-h1--sm">Dos tiendas, un obrador.</h1>
        <div className="bb-visit">
          {STORES.map((s) => (
            <article key={s.id} className="bb-panel bb-stack">
              <h2 className="bb-h3">{s.name}</h2>
              <p>{s.address}<br /><span className="bb-mut">{s.zone}</span></p>
              <OpeningHours hours={s.hours} exceptions={s.exceptions} layout="full" variant="dotmatrix" />
              <p className="bb-small"><b>Cómo llegar.</b> {GETTING.find((g) => g.store === s.id)?.how}</p>
              <ul className="bb-tags">
                {s.services.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="bb-links">
                <a href={s.map} target="_blank" rel="noopener noreferrer">Abrir en el mapa ↗</a>
                <a href={BRAND.phoneHref}>{BRAND.phone}</a>
                <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="bb-band" aria-labelledby="bb-acc">
        <div className="bb-wrap bb-sec">
          <h2 id="bb-acc" className="bb-h2">Accesibilidad y comodidades</h2>
          <ul className="bb-access">
            {ACCESS.map((a) => (
              <li key={a.t}>
                <b>{a.t}</b>
                <p>{a.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bb-wrap bb-sec" aria-labelledby="bb-faq">
        <h2 id="bb-faq" className="bb-h2">Preguntas frecuentes</h2>
        <div className="bb-faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "carta") return <Carta />;
  if (a === "mesa" && b && TABLES.includes(Number(b))) return <Mesa key={b} n={Number(b)} />;
  if (a === "club") return <Club />;
  if (a === "visitanos") return <Visit />;
  return null;
}

