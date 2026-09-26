"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import Article from "@/components/ui/Article";
import BlogCard from "@/components/ui/BlogCard";
import Button from "@/components/ui/Button";
import FAQSection from "@/components/ui/FAQSection";
import Footer from "@/components/ui/Footer";
import ImageGallery from "@/components/ui/ImageGallery";
import LogoCloud from "@/components/ui/LogoCloud";
import Modal from "@/components/ui/Modal";
import NavBar from "@/components/ui/NavBar";
import Prose from "@/components/ui/Prose";
import RadioGroup from "@/components/ui/RadioGroup";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import Toast from "@/components/ui/Toast";
import { fashionArt, type LookKind } from "@/lib/sites/art";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useActiveIndex, useSiteNavigate } from "../shared";
import { POSTS, SERVICES, SLOTS, SLUG, type Post } from "./data";
import "./clara.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#fbfbfd",
  fg: "#1d1d1f",
  mut: "#6e6e73",
  acc: "#1d1d1f",
  acc2: "#0066cc",
  card: "#ffffff",
  ln: "rgba(0,0,0,0.09)",
  r: 20,
  font: 'var(--font-inter), -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif',
  display: 'var(--font-inter), -apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
});

const href = (p = "") => siteHref(SLUG, p);
const TOAST = "cv-toast";
const LOOKS: { kind: LookKind; seed: number; title: string; note: string }[] = [
  { kind: "coat", seed: 4, title: "Abrigo camel", note: "Otoño · lana 80 %" },
  { kind: "dress", seed: 6, title: "Vestido columna", note: "Noche · crepe" },
  { kind: "shirt", seed: 1, title: "Camisa blanca", note: "Básico · popelín" },
  { kind: "arch", seed: 2, title: "Tonos tierra", note: "Paleta cálida" },
  { kind: "fabric", seed: 5, title: "Punto grueso", note: "Invierno · merino" },
  { kind: "still", seed: 3, title: "Accesorios", note: "Piel natural" },
  { kind: "coat", seed: 9, title: "Gabardina", note: "Entretiempo" },
  { kind: "dress", seed: 12, title: "Vestido midi", note: "Día · lino" },
];

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const L = [href("servicios"), href("lookbook"), href("diario"), href("sobre-mi")];
  const active = useActiveIndex(L);
  return (
    <SiteFrame tokens={TOKENS} className="cv">
      <div className="st-header st-header--flat cv__header">
        <NavBar
          brand="Clara Vidal"
          links={`Servicios=${L[0]}\nLookbook=${L[1]}\nDiario=${L[2]}\nSobre mí=${L[3]}`}
          defaultActive={active}
          cta="Reservar"
          onCta={() => navigate({ href: href("reservar") })}
          layout="center"
          shape="contained"
          size="sm"
          variant="minimal"
          onNavigate={navigate}
        />
      </div>
      <main>{children}</main>
      <div className="cv__footer">
        <div className="st-wrap">
          <Footer
            brand="Clara Vidal"
            tagline="Estilismo personal en Madrid y online."
            columns={`Servicios: ${SERVICES.map((s) => `${s.name}=${href("servicios")}#${s.slug}`).join(", ")}; Estudio: Lookbook=${href("lookbook")}, Diario=${href("diario")}, Sobre mí=${href("sobre-mi")}; Contacto: Reservar cita=${href("reservar")}, hola@claravidal.example`}
            social="icon:instagram"
            copyright="© 2026 Clara Vidal. Web de ejemplo construida con Trama."
            variant="minimal"
          />
        </div>
      </div>
      <Toast id={TOAST} position="top-center" variant="minimal" intentStyle="mono" showTrigger={false} />
    </SiteFrame>
  );
}

/* ---------- piezas ---------- */
/** Titular de página (h1) o de banda dentro de una página (`level={2}`): un solo h1 por página. */
function Headline({ eyebrow, title, lead, children, level = 1 }: { eyebrow?: string; title: ReactNode; lead?: string; children?: ReactNode; level?: 1 | 2 }) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className="cv__headline">
      {eyebrow && <p className="cv__eyebrow">{eyebrow}</p>}
      <H>{title}</H>
      {lead && <p className="cv__lead">{lead}</p>}
      {children && <div className="cv__actions">{children}</div>}
    </div>
  );
}

const MoreLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link href={to} className="cv__more">
    {children} <span aria-hidden>›</span>
  </Link>
);

function PostCard({ p }: { p: Post }) {
  return <BlogCard category="Diario" title={p.title} excerpt={p.excerpt} author="" date={p.date} readTime="" image={fashionArt(p.seed, p.art)} href={href(`diario/${p.slug}`)} layout="stacked" variant="minimal" />;
}

/* ---------- páginas ---------- */
function Home() {
  return (
    <>
      <section className="cv__hero">
        <Headline eyebrow="Estilismo personal" title="Vístete como eres." lead="Asesoría de imagen, armario cápsula y compras con criterio. Para que abrir el armario sea la parte fácil del día.">
          <Button label="Reservar una sesión" href={href("reservar")} variant="glass" size="lg" />
          <MoreLink to={href("servicios")}>Ver servicios</MoreLink>
        </Headline>
        <div className="cv__hero-img">
          <img src={fashionArt(4, "coat")} alt="Abrigo camel" />
          <img src={fashionArt(6, "dress")} alt="Vestido columna" />
          <img src={fashionArt(1, "shirt")} alt="Camisa blanca" />
        </div>
      </section>

      <section className="cv__band cv__band--alt">
        <div className="st-wrap">
          <Headline level={2} title="Tres maneras de empezar." lead="Todas terminan igual: con menos dudas delante del espejo." />
          <div className="cv__tiles">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`${href("servicios")}#${s.slug}`} className="cv__tile">
                <div>
                  <h2>{s.name}</h2>
                  <p>{s.tagline}</p>
                  <span className="cv__more">
                    Desde {s.price.replace(" / h", "")} <span aria-hidden>›</span>
                  </span>
                </div>
                <img src={fashionArt(s.seed, s.art)} alt="" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cv__band">
        <div className="st-wrap">
          <blockquote className="cv__quote">
            «En dos horas entendí por qué la mitad de mi armario no me convencía. Ahora me visto en cinco minutos.»
            <footer>Marta, asesoría de imagen</footer>
          </blockquote>
        </div>
      </section>

      <section className="cv__band cv__band--alt">
        <div className="st-wrap">
          <div className="cv__row-head">
            <Headline level={2} title="Lookbook." />
            <MoreLink to={href("lookbook")}>Ver todo</MoreLink>
          </div>
          <div className="cv__looks">
            {LOOKS.slice(0, 4).map((l) => (
              <figure key={l.title}>
                <img src={fashionArt(l.seed, l.kind)} alt={l.title} loading="lazy" />
                <figcaption>
                  <strong>{l.title}</strong> {l.note}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="cv__band">
        <div className="st-wrap">
          <div className="cv__row-head">
            <Headline level={2} title="Del diario." />
            <MoreLink to={href("diario")}>Todas las entradas</MoreLink>
          </div>
          <div className="st-grid st-grid--3">
            {POSTS.map((p) => (
              <PostCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="cv__band cv__band--alt">
        <div className="st-wrap">
          <LogoCloud label="Han hablado del estudio" brands="VOGUE, ELLE, TELVA, S MODA, HARPER'S BAZAAR" variant="minimal" />
        </div>
      </section>

      <section className="cv__band cv__final">
        <Headline level={2} title="¿Empezamos?" lead="La primera conversación es gratis: quince minutos por videollamada para ver qué necesitas.">
          <Button label="Reservar" href={href("reservar")} variant="glass" size="lg" />
        </Headline>
      </section>
    </>
  );
}

function Services() {
  return (
    <>
      <section className="cv__hero cv__hero--short">
        <Headline eyebrow="Servicios" title="Menos ruido. Más estilo." lead="Tres servicios que se pueden hacer por separado o uno detrás de otro. En el estudio, en tu casa o por videollamada." />
      </section>
      {SERVICES.map((s, i) => (
        <section key={s.slug} id={s.slug} className={`cv__band ${i % 2 === 0 ? "cv__band--alt" : ""}`}>
          <div className={`st-wrap cv__svc ${i % 2 ? "cv__svc--rev" : ""}`}>
            <img src={fashionArt(s.seed + 10, s.art)} alt="" aria-hidden />
            <div className="cv__svc-text">
              <p className="cv__eyebrow">{s.duration}</p>
              <h2>{s.name}</h2>
              <p className="cv__lead">{s.body}</p>
              <p className="cv__price">{s.price}</p>
              <div className="cv__actions">
                <Button label="Reservar" href={`${href("reservar")}?servicio=${s.slug}`} variant="glass" />
                <MoreLink to={href("reservar")}>Consultar disponibilidad</MoreLink>
              </div>
            </div>
          </div>
        </section>
      ))}
      <section className="cv__band">
        <div className="st-wrap cv__narrow">
          <FAQSection
            kicker="Preguntas"
            title="Antes de reservar"
            items={"¿Hacéis sesiones online?|Sí: la asesoría y la primera parte del armario cápsula funcionan muy bien por videollamada.\n¿Tengo que comprar ropa nueva?|No. El objetivo es sacar partido a lo que tienes; solo completamos lo que de verdad falta.\n¿Puedo regalar una sesión?|Sí, con una tarjeta regalo que se puede usar durante un año.\n¿Y si no me convence?|Si al terminar la primera sesión no te ha servido, te devuelvo el importe."}
            variant="minimal"
          />
        </div>
      </section>
    </>
  );
}

function Lookbook() {
  return (
    <>
      <section className="cv__hero cv__hero--short">
        <Headline eyebrow="Lookbook" title="Otoño–invierno." lead="Prendas y combinaciones de la temporada, pensadas para durar más que una temporada." />
      </section>
      <section className="cv__band">
        <div className="st-wrap">
          <ImageGallery layout="mosaic" ratio="3/4" images={LOOKS.map((l) => `${fashionArt(l.seed, l.kind)}|${l.title}|${l.note}`).join("\n")} variant="minimal" />
        </div>
      </section>
    </>
  );
}

function Journal() {
  return (
    <>
      <section className="cv__hero cv__hero--short">
        <Headline eyebrow="Diario" title="Notas sobre vestir bien." lead="Ideas prácticas, sin tendencias de usar y tirar." />
      </section>
      <section className="cv__band">
        <div className="st-wrap st-grid st-grid--3">
          {POSTS.map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function PostPage({ p }: { p: Post }) {
  return (
    <section className="cv__band">
      <div className="st-wrap cv__post">
        <Article kicker="Diario" title={p.title} subtitle={p.excerpt} author="Clara Vidal" authorRole="Estilista" date={p.date} tags="" cover={fashionArt(p.seed + 20, p.art)} markdown={p.body} toc="none" size="lg" measure="narrow" dropCap variant="minimal" />
        <div className="cv__actions cv__post-foot">
          <Button label="Reservar una sesión" href={href("reservar")} variant="glass" />
          <MoreLink to={href("diario")}>Volver al diario</MoreLink>
        </div>
      </div>
    </section>
  );
}

const BIO = `Soy estilista desde hace doce años. Empecé en editoriales de moda y descubrí que lo que más me gustaba no eran las fotos, sino **el momento en el que alguien se ve bien de verdad**.

Hoy trabajo con personas, no con modelos: gente que quiere vestirse sin pensarlo demasiado y sentirse ella misma. Mi método es sencillo: *primero entender, después elegir, al final comprar* (y solo si hace falta).`;

function About() {
  return (
    <>
      <section className="cv__hero cv__hero--short">
        <Headline eyebrow="Sobre mí" title="Hola, soy Clara." />
      </section>
      <section className="cv__band">
        <div className="st-wrap cv__about">
          <img src={fashionArt(7, "still")} alt="Composición de accesorios sobre fondo claro" />
          <div className="st-stack">
            <Prose markdown={BIO} size="lg" measure="narrow" variant="minimal" />
            <dl className="cv__facts">
              <div>
                <dt>12</dt>
                <dd>años de oficio</dd>
              </div>
              <div>
                <dt>900+</dt>
                <dd>personas asesoradas</dd>
              </div>
              <div>
                <dt>4,9</dt>
                <dd>de valoración media</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

const MODES = ["En el estudio (Madrid)", "Por videollamada", "A domicilio"];
/** primera letra en minúscula, para encadenar en una frase («Mié 1 oct» → «mié 1 oct», sin tocar «Madrid») */
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
function Book() {
  const [service, setService] = useState(SERVICES[0].name);
  // ?servicio=… (desde Servicios) preselecciona el servicio; en un efecto para no desajustar la hidratación
  useEffect(() => {
    const s = SERVICES.find((x) => x.slug === new URLSearchParams(location.search).get("servicio"));
    if (s) setService(s.name);
  }, []);
  const [mode, setMode] = useState(MODES[0]);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [booked, setBooked] = useState(false);
  const ok = service && slot && name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (booked)
    return (
      <section className="cv__hero cv__hero--short">
        <Headline eyebrow="Reserva confirmada" title="Nos vemos pronto." lead={`${service}, ${lower(slot)}, ${lower(mode)}. Te he enviado los detalles a ${email}. (Es una web de ejemplo: no se envía nada.)`}>
          <Button label="Volver al inicio" href={href()} variant="glass" />
        </Headline>
      </section>
    );

  return (
    <>
      <section className="cv__hero cv__hero--short">
        <Headline eyebrow="Reservar" title="Elige tu momento." lead="Sesiones de lunes a viernes. La primera conversación, de quince minutos, es gratis." />
      </section>
      <section className="cv__band">
        <div className="st-wrap cv__book">
          <div className="cv__book-step">
            <span className="cv__step">1</span>
            <div className="st-stack">
              <h2>Servicio</h2>
              <Select label="" options={SERVICES.map((s) => s.name).join(", ")} value={service} onChange={setService} variant="minimal" />
              <RadioGroup label="Dónde" options={MODES.join(", ")} defaultValue={mode} onChange={setMode} variant="minimal" />
            </div>
          </div>
          <div className="cv__book-step">
            <span className="cv__step">2</span>
            <div className="st-stack">
              <h2>Día y hora</h2>
              <div className="cv__slots" role="radiogroup" aria-label="Huecos disponibles">
                {SLOTS.map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={slot === s} className="cv__slot" onClick={() => setSlot(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="cv__book-step">
            <span className="cv__step">3</span>
            <div className="st-stack">
              <h2>Tus datos</h2>
              <TextField label="Nombre" placeholder="Marta García" value={name} onChange={setName} variant="minimal" />
              <TextField label="Correo" type="email" placeholder="tu@correo.com" value={email} onChange={setEmail} variant="minimal" />
            </div>
          </div>
          <div className="cv__actions cv__book-foot">
            <Button label="Revisar y confirmar" variant="glass" size="lg" disabled={!ok} onClick={() => setConfirm(true)} />
            {!ok && <span className="cv__hint">Elige un hueco y completa tus datos.</span>}
          </div>
        </div>
      </section>
      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        onConfirm={() => {
          setConfirm(false);
          setBooked(true);
          sonnerToast.success("Reserva confirmada", { description: `${service} · ${slot}`, toasterId: TOAST });
        }}
        title="¿Confirmas la reserva?"
        body={`${service} · ${slot} · ${mode}. Puedes cambiarla o cancelarla sin coste hasta 24 horas antes.`}
        confirmLabel="Confirmar"
        cancelLabel="Cambiar algo"
        variant="glass"
      />
    </>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "servicios") return <Services />;
  if (a === "lookbook") return <Lookbook />;
  if (a === "diario" && !b) return <Journal />;
  if (a === "diario") {
    const p = POSTS.find((x) => x.slug === b);
    if (p) return <PostPage p={p} />;
  }
  if (a === "sobre-mi") return <About />;
  if (a === "reservar") return <Book />;
  return null;
}
