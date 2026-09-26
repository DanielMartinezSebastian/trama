"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import Article from "@/components/ui/Article";
import BlogCard from "@/components/ui/BlogCard";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ui/ContactForm";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/NavBar";
import Pagination from "@/components/ui/Pagination";
import Prose from "@/components/ui/Prose";
import SectionHeader from "@/components/ui/SectionHeader";
import StatsSection from "@/components/ui/StatsSection";
import Table from "@/components/ui/Table";
import TextmodeBackground from "@/components/ui/TextmodeBackground";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import Toast from "@/components/ui/Toast";
import { techCover } from "@/lib/sites/art";
import { tokensToStyle } from "@/lib/ui/tokens";
import { PageHeader, Section, SiteFrame, siteHref, useActiveIndex, useSiteNavigate } from "../shared";
import { ISSUES, POSTS, SLUG, TOPICS, type Post } from "./data";
import "./kernel.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#0a0f1a",
  fg: "#e6edf6",
  mut: "#8b98ad",
  acc: "#5eead4",
  acc2: "#a78bfa",
  card: "rgba(255,255,255,0.04)",
  ln: "rgba(255,255,255,0.12)",
  r: 12,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-space-grotesk), var(--font-inter), sans-serif',
});

const href = (p = "") => siteHref(SLUG, p);
const cover = (p: Post) => techCover(POSTS.indexOf(p) + 3, p.glyph);
const minutes = (p: Post) => `${Math.max(2, Math.round(p.body.split(/\s+/).length / 200))} min`;
const TOAST = "kl-toast";

function subscribe(email?: string) {
  sonnerToast.success("Suscripción hecha", { description: `${email ? `${email}: ` : ""}recibirás el próximo número el viernes. Sin spam, te das de baja en un clic.`, toasterId: TOAST });
}

/** `level`: nivel del título según dónde vaya la tarjeta (2 justo bajo el h1 de la página, 3 bajo una sección). */
function PostCard({ p, layout = "stacked", level = 3 }: { p: Post; layout?: "stacked" | "horizontal" | "overlay" | "minimal"; level?: 2 | 3 }) {
  return <BlogCard headingLevel={level} category={p.topic} title={p.title} excerpt={p.excerpt} author="Ada Ríos" date={p.date} readTime={minutes(p)} image={cover(p)} href={href(`articulos/${p.slug}`)} layout={layout} variant="outline" />;
}

/* ---------- marco: barra y pie en todas las páginas ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const LINKS = [href(), href("articulos"), href("newsletter"), href("sobre-mi")];
  const active = useActiveIndex(LINKS);
  return (
    <SiteFrame tokens={TOKENS} className="kl">
      <div className="st-header">
        <NavBar
          brand="kernel·log"
          links={`Inicio=${LINKS[0]}\nArtículos > ${TOPICS.map((t) => `${t}=${href("articulos")}#${t.toLowerCase()}`).join("; ")}; Todos los artículos=${LINKS[1]}\nNewsletter=${LINKS[2]}\nSobre mí=${LINKS[3]}`}
          defaultActive={active}
          search="command"
          searchPlaceholder="Buscar artículos…"
          searchItems={POSTS.map((p) => `${p.title}=${href(`articulos/${p.slug}`)}`).join("\n")}
          cta="Suscribirme"
          onCta={() => navigate({ href: href("newsletter") })}
          layout="left"
          shape="contained"
          variant="minimal"
          onNavigate={navigate}
        />
      </div>
      <main>{children}</main>
      <div className="st-wrap kl__footer">
        <Footer
          brand="kernel·log"
          tagline="Notas largas sobre infraestructura, rendimiento y lo que aprendo por el camino."
          columns={`Blog: Artículos=${href("articulos")}, Newsletter=${href("newsletter")}, Sobre mí=${href("sobre-mi")}; Temas: ${TOPICS.map((t) => `${t}=${href("articulos")}#${t.toLowerCase()}`).join(", ")}; Otros: RSS, Charlas=${href("sobre-mi")}#charlas`}
          social="icon:github, icon:mastodon, RSS"
          copyright="© 2026 Ada Ríos. Textos bajo CC BY-SA 4.0; el código de ejemplo, MIT."
          variant="minimal"
        />
      </div>
      <Toast id={TOAST} position="bottom-right" variant="outline" intentStyle="icon" showTrigger={false} closeButton />
    </SiteFrame>
  );
}

/**
 * Fondo animado de la parte alta de una página: ocupa la primera pantalla y se funde hacia abajo, con un velo en el lado
 * del texto para que la lectura no compita con la animación. Reacciona al puntero aunque haya contenido encima.
 */
function Backdrop({ sketch }: { sketch: "life" | "flow" }) {
  return (
    <div className="kl__backdrop" aria-hidden>
      <TextmodeBackground sketch={sketch} fontSize={14} palette="gradient" tintAmount={0.9} opacity={0.55} frameRate={24} interaction="window" />
    </div>
  );
}

/* ---------- páginas ---------- */
function Home() {
  const [featured, ...rest] = POSTS;
  return (
    <>
      <Backdrop sketch="life" />
      <Section>
        <div className="kl__intro">
          <p className="kl__hi">Hola, soy Ada.</p>
          <h1 className="kl__title">
            Escribo sobre <span>infraestructura</span>, rendimiento y lo que se rompe en producción.
          </h1>
          <p className="st-lead">Ingeniera de plataformas en una empresa de logística. Aquí van las notas largas que me hubiera gustado leer antes: con código, números y los errores incluidos.</p>
          <div className="kl__sub">
            <ContactForm title="" subtitle="" fields="email" layout="inline" submitLabel="Suscribirme" successMessage="Hecho: el viernes te llega el siguiente número." variant="outline" onSubmit={(d) => subscribe(String(d.email ?? ""))} />
            <span className="st-muted">3.200 personas leen la newsletter cada dos semanas.</span>
          </div>
        </div>
      </Section>

      <Section tight>
        <div className="kl__label">Último artículo</div>
        <PostCard p={featured} layout="horizontal" level={2} />
      </Section>

      <Section tight>
        <div className="kl__row-head">
          <SectionHeader kicker="Recientes" title="Más artículos" subtitle="" align="left" variant="minimal" />
          <Button label="Ver todos" href={href("articulos")} variant="outline" emphasis="ghost" glyph="→" glyphPosition="end" />
        </div>
        <div className="st-grid st-grid--3">
          {rest.slice(0, 3).map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </Section>

      <Section tight>
        <div className="kl__label">Temas</div>
        <div className="st-row">
          {TOPICS.map((t) => (
            <Button key={t} label={`${t} · ${POSTS.filter((p) => p.topic === t).length}`} href={`${href("articulos")}#${t.toLowerCase()}`} variant="outline" emphasis="secondary" size="sm" />
          ))}
        </div>
      </Section>

      <Section>
        <div className="kl__cta ui-surface ui-s ui-s--outline">
          <div>
            <h2>Una newsletter cada dos semanas</h2>
            <p className="st-muted">El artículo nuevo, tres enlaces que merecen la pena y una cosa que aprendí esa quincena. Nada más.</p>
          </div>
          <Button label="Ver números anteriores" href={href("newsletter")} variant="outline" emphasis="primary" glyph="→" glyphPosition="end" />
        </div>
      </Section>
    </>
  );
}

const PER_PAGE = 4;
function Articles() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);
  // /articulos#infraestructura (desde la barra, el pie o la portada) abre filtrado por ese tema
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      const t = TOPICS.find((x) => x.toLowerCase() === h);
      if (t) setTopic(t);
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, []);
  useEffect(() => setPage(1), [q, topic]);
  const n = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const found = useMemo(() => POSTS.filter((p) => (!topic || p.topic === topic) && (!q || n(`${p.title} ${p.excerpt} ${p.body}`).includes(n(q)))), [q, topic]);
  const pages = Math.max(1, Math.ceil(found.length / PER_PAGE));
  const shown = found.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <Section>
      <PageHeader crumbs="Inicio, Artículos" title="Artículos" lead={`${POSTS.length} artículos largos, con código y números reales. Filtra por tema o busca una palabra.`} />
      <div className="kl__filters">
        <TextField label="" placeholder="Buscar en los artículos…" prefix="⌕" type="search" value={q} onChange={setQ} variant="outline" />
        <div className="st-row">
          <Button label="Todos" size="sm" variant="outline" emphasis="secondary" active={!topic} onClick={() => setTopic("")} />
          {TOPICS.map((t) => (
            <Button key={t} label={t} size="sm" variant="outline" emphasis="secondary" active={topic === t} onClick={() => setTopic(topic === t ? "" : t)} />
          ))}
        </div>
      </div>
      <p className="st-muted kl__count" role="status">
        {found.length === 0 ? "Ningún artículo coincide. Prueba con otra palabra." : `${found.length} ${found.length === 1 ? "artículo" : "artículos"}${topic ? ` en ${topic}` : ""}${q ? ` con «${q}»` : ""}`}
      </p>
      <div className="kl__list">
        {shown.map((p) => (
          <PostCard key={p.slug} p={p} layout="horizontal" level={2} />
        ))}
      </div>
      {pages > 1 && (
        <div className="kl__pager">
          <Pagination key={`${q}|${topic}`} total={pages} defaultPage={1} onChange={setPage} variant="outline" />
        </div>
      )}
    </Section>
  );
}

function PostPage({ p }: { p: Post }) {
  const related = POSTS.filter((x) => x !== p && x.topic === p.topic).concat(POSTS.filter((x) => x !== p && x.topic !== p.topic)).slice(0, 3);
  return (
    <>
      <Section>
        <Article
          kicker={p.topic}
          title={p.title}
          subtitle={p.excerpt}
          author="Ada Ríos"
          authorRole="Ingeniera de plataformas"
          date={p.date}
          tags={`${p.topic}, Producción`}
          cover={cover(p)}
          markdown={p.body}
          toc="right"
          tocKind="rail"
          progress
          variant="minimal"
          codeVariant="terminal"
        />
      </Section>
      <Section tight>
        <div className="kl__cta ui-surface ui-s ui-s--outline">
          <div>
            <h2>¿Te ha servido?</h2>
            <p className="st-muted">Cada dos semanas, un artículo como este en tu correo. Sin spam.</p>
          </div>
          <ContactForm title="" subtitle="" fields="email" layout="inline" submitLabel="Suscribirme" variant="outline" onSubmit={(d) => subscribe(String(d.email ?? ""))} />
        </div>
      </Section>
      <Section tight>
        <SectionHeader kicker="Sigue leyendo" title="Artículos relacionados" subtitle="" align="left" variant="minimal" />
        <div className="st-grid st-grid--3">
          {related.map((r) => (
            <PostCard key={r.slug} p={r} />
          ))}
        </div>
      </Section>
    </>
  );
}

function Newsletter() {
  return (
    <>
      <Section>
        <PageHeader crumbs="Inicio, Newsletter" title="La newsletter de kernel·log" lead="Cada dos viernes: el artículo nuevo, tres enlaces que merecen la pena y una cosa que aprendí esa quincena. 3.200 lectores, cero spam." />
        <div className="kl__signup ui-surface ui-s ui-s--outline">
          <ContactForm title="Suscríbete" subtitle="Te llega el próximo número este viernes." fields="email" layout="inline" submitLabel="Suscribirme" successMessage="Listo. Revisa tu correo para confirmar la suscripción." variant="outline" onSubmit={(d) => subscribe(String(d.email ?? ""))} />
        </div>
      </Section>
      <Section tight>
        <FeatureGrid
          kicker="Qué incluye"
          title="Lo que te llega cada número"
          items={"icon:file-text|El artículo nuevo|Antes que en la web y con una nota de lo que no cupo.\nicon:link|Tres enlaces|Lo mejor que leí esas dos semanas, con una línea de por qué.\nicon:lightbulb|Una cosa aprendida|Un truco, un comando o un error que no volveré a cometer."}
          variant="outline"
        />
      </Section>
      <Section tight>
        <SectionHeader kicker="Archivo" title="Números anteriores" subtitle="" align="left" variant="minimal" />
        <Table csv={["Nº, Fecha, Tema", ...ISSUES.map((i) => `#${i.n}, ${i.date}, ${i.title.replace(/,/g, " ·")}`)].join("\n")} variant="outline" />
      </Section>
    </>
  );
}

const BIO = `Soy ingeniera de plataformas en una empresa de logística de 400 personas. Mi trabajo es que los demás equipos puedan desplegar **sin pedir permiso y sin miedo**.

Antes pasé cinco años haciendo *frontend*, lo que explica mi obsesión con el rendimiento en móviles de gama media. Escribo este blog desde 2021: empezó como notas para mí y acabó siendo lo que más me ha enseñado a explicar las cosas.

Fuera del trabajo, doy charlas cuando me invitan y mantengo un par de herramientas de código abierto para medir despliegues.`;

function About() {
  return (
    <>
      <Backdrop sketch="flow" />
      <Section>
        <div className="st-split">
          <div className="st-stack">
            <PageHeader crumbs="Inicio, Sobre mí" title="Sobre mí" />
            <Prose markdown={BIO} size="lg" measure="normal" variant="minimal" />
          </div>
          <img className="st-media st-media--45 kl__portrait" src={techCover(11, "AR")} alt="Ilustración con las iniciales de Ada Ríos" />
        </div>
      </Section>
      <Section tight>
        <StatsSection kicker="En números" title="Cinco años escribiendo" stats={"6|+|Artículos largos al año\n48||Números de la newsletter\n3200||Lectores"} tone="acc" />
      </Section>
      <Section tight>
        <SectionHeader kicker="Trayectoria" title="De dónde vengo" subtitle="" align="left" variant="minimal" />
        <Timeline
          variant="minimal"
          steps={"2016 · Frontend|Aplicaciones de reparto: rendimiento en móviles lentos.\n2020 · SRE|Guardias, incidentes y la primera migración a contenedores.\n2023 · Plataforma|Un equipo de cuatro para que 30 equipos desplieguen solos.\n2026 · Hoy|Plataforma, observabilidad y este blog."}
        />
      </Section>
      <Section tight id="charlas">
        <SectionHeader kicker="Charlas" title="Donde he hablado" subtitle="" align="left" variant="minimal" />
        <Table csv={"Evento, Año, Charla\nCommit Conf, 2026, Cuarenta servicios y un clúster\nPyConES, 2025, SQLite en producción sin pedir perdón\nJSDay, 2024, Seis segundos en un Android de gama media"} variant="outline" />
      </Section>
      <Section>
        <div className="kl__contact">
          <ContactForm title="Escríbeme" subtitle="Charlas, colaboraciones o una corrección en un artículo. Respondo en unos días." fields="name,email,message" submitLabel="Enviar" successMessage="Recibido. Te contesto en unos días." variant="outline" />
        </div>
      </Section>
    </>
  );
}

/** Página según la ruta (`path` sin el prefijo /sitios/kernel-log). */
export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "articulos" && !b) return <Articles />;
  if (a === "articulos" && b) {
    const p = POSTS.find((x) => x.slug === b);
    if (p) return <PostPage p={p} />;
  }
  if (a === "newsletter") return <Newsletter />;
  if (a === "sobre-mi") return <About />;
  return null;
}
