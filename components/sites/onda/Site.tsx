"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import ContactForm from "@/components/ui/ContactForm";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import ImageGallery from "@/components/ui/ImageGallery";
import Marquee from "@/components/ui/Marquee";
import NavBar from "@/components/ui/NavBar";
import SectionHeader from "@/components/ui/SectionHeader";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import Toast from "@/components/ui/Toast";
import { renderGlyph } from "@/components/ui/Icon";
import { gearArt } from "@/lib/sites/art";
import { tokensToStyle } from "@/lib/ui/tokens";
import { PageHeader, Section, SiteFrame, euros, siteHref, useActiveIndex, useSiteNavigate } from "../shared";
import { ARTISTS, CATEGORIES, GEAR, SLUG, SUPPORT_FAQ, type Gear } from "./data";
import "./onda.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#0b0b0c",
  fg: "#f4f4f5",
  mut: "#a1a1aa",
  acc: "#ff6a1a",
  acc2: "#fbbf24",
  card: "rgba(255,255,255,0.04)",
  ln: "rgba(255,255,255,0.12)",
  r: 10,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-syne), var(--font-inter), sans-serif',
});

const href = (p = "") => siteHref(SLUG, p);
const TOAST = "on-toast";
const pic = (g: Gear, i = 0) => gearArt(g.seed + i * 3, g.kind);

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const L = [href("productos"), href("artistas"), href("soporte")];
  const active = useActiveIndex(L);
  return (
    <SiteFrame tokens={TOKENS} className="on">
      <div className="st-header st-header--flat">
        <NavBar
          brand="ONDA"
          links={`Productos > ${CATEGORIES.map((c) => `#${c}; ${GEAR.filter((g) => g.category === c).map((g) => `${g.name}=${href(`productos/${g.slug}`)}`).join("; ")}`).join("; ")}; #Todo; Ver todos los productos=${L[0]}\nArtistas=${L[1]}\nSoporte=${L[2]}`}
          defaultActive={active}
          menuStyle="mega"
          search="inline"
          searchPlaceholder="Buscar productos…"
          searchItems={GEAR.map((g) => `${g.name} · ${g.tagline}=${href(`productos/${g.slug}`)}`).join("\n")}
          cta="Dónde comprar"
          onCta={() => navigate({ href: `${href("soporte")}#distribuidores` })}
          layout="split"
          shape="contained"
          variant="solid"
          onNavigate={navigate}
        />
      </div>
      <main>{children}</main>
      <div className="on__marquee">
        <Marquee text="HECHO PARA TOCAR · SIN MENÚS · CADA MANDO UNA FUNCIÓN · TRES AÑOS DE GARANTÍA" variant="solid" tone="mut" rows={1} fontSize={18} duration={40} separator="   ✦   " />
      </div>
      <div className="st-wrap on__footer">
        <Footer
          brand="ONDA Instruments"
          tagline="Equipos para DJ y músicos diseñados en Barcelona. Cada mando, una función."
          columns={`Productos: ${CATEGORIES.map((c) => `${c}=${href("productos")}#${c.toLowerCase()}`).join(", ")}; Onda: Artistas=${href("artistas")}, Soporte=${href("soporte")}, Registro de producto=${href("soporte")}#registro; Legal: Garantía=${href("soporte")}, Privacidad, Cookies`}
          social="icon:instagram, icon:youtube, icon:discord"
          copyright="© 2026 Onda Instruments. Fabricante ficticio para una demo de Trama."
          variant="solid"
        />
      </div>
      <Toast id={TOAST} position="bottom-right" variant="solid" showTrigger={false} closeButton />
    </SiteFrame>
  );
}

function GearCard({ g }: { g: Gear }) {
  return (
    <Link href={href(`productos/${g.slug}`)} className="on__card">
      <div className="on__card-img">
        <img src={pic(g)} alt={g.name} loading="lazy" />
        {g.isNew && <span className="on__new">Nuevo</span>}
      </div>
      <div className="on__card-body">
        <span className="on__cat">{g.category}</span>
        <h3>{g.name}</h3>
        <p className="st-muted">{g.tagline}</p>
        <strong>{euros(g.price)}</strong>
      </div>
    </Link>
  );
}

/* ---------- páginas ---------- */
function Home() {
  const flagship = GEAR[0];
  return (
    <>
      <section className="on__hero">
        <div className="st-wrap on__hero-in">
          <div className="st-stack">
            <Badge text="Nuevo · Polar 8" variant="solid" intent="accent" />
            <h1>Ocho voces. Cero menús.</h1>
            <p className="st-lead">{flagship.body}</p>
            <div className="st-row">
              <Button label="Descubrir Polar 8" href={href(`productos/${flagship.slug}`)} variant="solid" glyph="→" glyphPosition="end" size="lg" />
              <Button label="Ver todos los productos" href={href("productos")} variant="solid" emphasis="ghost" size="lg" />
            </div>
          </div>
          <img className="on__hero-img" src={pic(flagship)} alt="Sintetizador Polar 8" />
        </div>
      </section>
      <Section tight>
        <div className="on__cats">
          {CATEGORIES.map((c) => {
            const g = GEAR.find((x) => x.category === c)!;
            return (
              <Link key={c} href={`${href("productos")}#${c.toLowerCase()}`} className="on__catcard">
                <img src={gearArt(g.seed + 1, g.kind)} alt="" aria-hidden />
                <span>{c}</span>
              </Link>
            );
          })}
        </div>
      </Section>
      <Section tight>
        <div className="on__row-head">
          <SectionHeader kicker="Catálogo" title="Para la cabina y para el estudio" subtitle="" align="left" variant="solid" />
          <Button label="Todos los productos" href={href("productos")} variant="solid" emphasis="secondary" glyph="→" glyphPosition="end" />
        </div>
        <Carousel perView={4} gap={20} variant="solid" label="Productos destacados" dots="progress">
          {GEAR.slice(1).map((g) => (
            <GearCard key={g.slug} g={g} />
          ))}
        </Carousel>
      </Section>
      <Section tight>
        <FeatureGrid
          kicker="Cómo los hacemos"
          title="Diseñados para tocar, no para configurar"
          items={"icon:settings-cog|Cada mando, una función|Nada de páginas ni combinaciones de teclas: lo que ves es lo que suena.\nicon:shield|Tres años de garantía|Cinco si registras tu equipo. Y recambios para todo.\nicon:reload|Actualizaciones de por vida|Funciones nuevas por firmware, gratis, mientras el equipo exista."}
          variant="solid"
        />
      </Section>
      <Section tight>
        <TestimonialSection kicker="Artistas" title="Lo tocan cada noche" items={ARTISTS.slice(0, 3).map((a) => `${a.quote}|${a.name}|${a.role} · ${a.gear}|5`).join("\n")} variant="solid" />
      </Section>
      <Section>
        <CTASection title="¿Tienes un equipo Onda?" subtitle="Regístralo y amplía la garantía a cinco años. Firmware, manuales y recambios en un solo sitio." primaryCta="Registrar mi equipo" primaryHref={`${href("soporte")}#registro`} secondaryCta="Descargas" secondaryHref={`${href("soporte")}#descargas`} variant="solid" />
      </Section>
    </>
  );
}

function Products() {
  const tabs = ["Todos", ...CATEGORIES];
  const [i, setI] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      const k = CATEGORIES.findIndex((c) => c.toLowerCase() === h);
      if (k >= 0) {
        setI(k + 1);
        setKey((n) => n + 1);
      }
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, []);
  const list = i === 0 ? GEAR : GEAR.filter((g) => g.category === tabs[i]);
  return (
    <Section>
      <PageHeader crumbs="Inicio, Productos" title="Productos" lead="Controladoras, mezcladores, sintetizadores, cajas de ritmos, monitores y auriculares. Todos con tres años de garantía." />
      <div className="on__tabs">
        <Tabs key={key} items={tabs.join(", ")} content={tabs.map((t) => (t === "Todos" ? `${GEAR.length} productos` : `${GEAR.filter((g) => g.category === t).length} productos en ${t}`)).join("\n")} defaultIndex={i} onChange={setI} variant="solid" />
      </div>
      <div className="st-grid st-grid--4">
        {list.map((g) => (
          <GearCard key={g.slug} g={g} />
        ))}
      </div>
    </Section>
  );
}

function ProductPage({ g }: { g: Gear }) {
  const related = GEAR.filter((x) => x !== g && x.category === g.category).concat(GEAR.filter((x) => x !== g && x.category !== g.category)).slice(0, 4);
  return (
    <>
      <section className="on__phero">
        <div className="st-wrap on__phero-in">
          <ImageGallery layout="fade" ratio="4/3" captions={false} images={[0, 1, 2].map((k) => `${pic(g, k)}|${g.name}|Vista ${k + 1}`).join("\n")} variant="solid" />
          <div className="st-stack">
            <PageHeader crumbs={`Inicio, Productos, ${g.category}, ${g.name}`} title={g.name} lead={g.tagline} />
            <p className="on__body">{g.body}</p>
            <div className="on__buy">
              <strong>{euros(g.price)}</strong>
              <span className="st-muted">PVP recomendado · IVA incluido</span>
            </div>
            <div className="st-row">
              <Button label="Dónde comprar" href={`${href("soporte")}#distribuidores`} variant="solid" glyph="icon:map-pin" size="lg" />
              <Button
                label="Avisarme de novedades"
                variant="solid"
                emphasis="ghost"
                size="lg"
                onClick={() => sonnerToast.success(`Te avisaremos de novedades de ${g.name}`, { description: "Firmware nuevo, sonidos y ofertas. Nada más.", toasterId: TOAST })}
              />
            </div>
          </div>
        </div>
      </section>
      <Section tight>
        <FeatureGrid kicker="Lo esencial" title={`Por qué ${g.name}`} items={g.highlights} variant="solid" />
      </Section>
      <Section tight>
        <div className="st-grid st-grid--2">
          <div className="on__box">
            <h2>Especificaciones</h2>
            <Table csv={g.specs} variant="solid" striped />
          </div>
          <div className="st-stack">
            <div className="on__box" id="descargas">
              <h2>Descargas</h2>
              <ul className="on__dl">
                {g.downloads.map((d) => (
                  <li key={d}>
                    <span>
                      {renderGlyph("icon:download", 16)} {d}
                    </span>
                    <Button label="Descargar" size="sm" variant="solid" emphasis="secondary" onClick={() => sonnerToast(`${d}`, { description: "Descarga de ejemplo: esta web no tiene archivos reales.", toasterId: TOAST })} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="on__box">
              <h2>En la caja</h2>
              <ul className="on__inbox">
                {g.box.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
      <Section tight>
        <SectionHeader kicker="Combina con" title="Completa tu equipo" subtitle="" align="left" variant="solid" />
        <div className="st-grid st-grid--4">
          {related.map((r) => (
            <GearCard key={r.slug} g={r} />
          ))}
        </div>
      </Section>
    </>
  );
}

function Artists() {
  return (
    <>
      <Section>
        <PageHeader crumbs="Inicio, Artistas" title="Artistas" lead="DJs, productores y músicos de directo que tocan con Onda cada noche. Y lo que les pedimos a cambio: que nos digan qué mejorar." />
        <div className="st-grid st-grid--2 on__artists">
          {ARTISTS.map((a, i) => (
            <article key={a.name} className="on__artist">
              <img src={gearArt(i * 7 + 2, (["mixer", "synth", "drum", "monitor"] as const)[i])} alt="" aria-hidden />
              <div>
                <span className="on__cat">{a.role}</span>
                <h2>{a.name}</h2>
                <blockquote>«{a.quote}»</blockquote>
                <p className="st-muted">Toca con {a.gear}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section tight>
        <SectionHeader kicker="En directo" title="Onda en la cabina" subtitle="" align="left" variant="solid" />
        <ImageGallery layout="filmstrip" ratio="16/9" images={GEAR.slice(0, 6).map((g, k) => `${gearArt(g.seed + 9, g.kind)}|${g.name}|${ARTISTS[k % ARTISTS.length].name}`).join("\n")} variant="solid" />
      </Section>
      <Section>
        <CTASection title="¿Tocas con Onda?" subtitle="Escríbenos: buscamos artistas para probar prototipos y compartir sonidos." primaryCta="Contactar" primaryHref={`${href("soporte")}#contacto`} variant="solid" />
      </Section>
    </>
  );
}

function Support() {
  return (
    <>
      <Section>
        <PageHeader crumbs="Inicio, Soporte" title="Soporte" lead="Manuales, firmware, garantía y registro de producto. Si algo no funciona, te respondemos en 24 horas laborables." />
      </Section>
      <Section tight id="descargas">
        <SectionHeader kicker="Descargas" title="Firmware y manuales" subtitle="" align="left" variant="solid" />
        <Table csv={["Producto, Firmware, Manual", ...GEAR.map((g) => `${g.name}, ${g.downloads.find((d) => d.startsWith("Firmware"))?.replace("Firmware ", "v") ?? "—"}, ${g.downloads[0].replace(/\s*\(.*\)/, "")}`)].join("\n")} variant="solid" striped />
      </Section>
      <Section tight>
        <FAQSection kicker="Preguntas" title="Garantía y actualizaciones" items={SUPPORT_FAQ} variant="solid" />
      </Section>
      <Section tight id="registro">
        <div className="st-split on__register">
          <div className="st-stack">
            <SectionHeader kicker="Registro" title="Registra tu equipo" subtitle="Amplía la garantía a cinco años y recibe los avisos de firmware." align="left" variant="solid" />
          </div>
          <RegisterForm />
        </div>
      </Section>
      <Section tight id="distribuidores">
        <SectionHeader kicker="Dónde comprar" title="Distribuidores oficiales" subtitle="" align="left" variant="solid" />
        <Table csv={"Tienda, Ciudad, Prueba en tienda\nSonido Norte, Bilbao, Sí\nRitmo Store, Madrid, Sí\nCabina 33, Barcelona, Sí\nAudio Sur, Sevilla, Solo DJ\nDisco Lusa, Lisboa, Sí"} variant="solid" />
      </Section>
      <Section id="contacto">
        <div className="on__contact">
          <ContactForm title="Contacta con soporte" subtitle="Cuéntanos qué equipo tienes y qué ocurre. Respondemos en 24 horas laborables." fields="name,email,message" submitLabel="Enviar" successMessage="Recibido: te respondemos en 24 horas laborables." variant="solid" />
        </div>
      </Section>
    </>
  );
}

function RegisterForm() {
  const [product, setProduct] = useState("");
  const [serial, setSerial] = useState("");
  const [email, setEmail] = useState("");
  const serialOk = /^ON-[A-Z0-9]{4}-\d{4}$/i.test(serial.trim());
  const ok = product && serialOk && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <form
      className="on__box on__regform"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        sonnerToast.success(`${product} registrado`, { description: `Garantía ampliada a cinco años. Número de serie ${serial.toUpperCase()}.`, toasterId: TOAST });
        setSerial("");
      }}
    >
      <Select label="Producto" options={GEAR.map((g) => g.name).join(", ")} placeholder="Elige tu equipo" value={product} onChange={setProduct} variant="solid" />
      <TextField label="Número de serie" placeholder="ON-P8X2-0042" hint="En la etiqueta de la base: ON-XXXX-0000." value={serial} onChange={setSerial} intent={serial && !serialOk ? "danger" : undefined} variant="solid" />
      <TextField label="Correo" type="email" placeholder="tu@correo.com" value={email} onChange={setEmail} variant="solid" />
      <Button label="Registrar" type="submit" variant="solid" disabled={!ok} />
    </form>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "productos" && !b) return <Products />;
  if (a === "productos") {
    const g = GEAR.find((x) => x.slug === b);
    if (g) return <ProductPage g={g} />;
  }
  if (a === "artistas") return <Artists />;
  if (a === "soporte") return <Support />;
  return null;
}
