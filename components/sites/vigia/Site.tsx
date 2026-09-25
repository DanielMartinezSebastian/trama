"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import Accordion from "@/components/ui/Accordion";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ChatWidget from "@/components/ui/ChatWidget";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import ContactForm from "@/components/ui/ContactForm";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/ui/Hero";
import NavBar from "@/components/ui/NavBar";
import PricingSection from "@/components/ui/PricingSection";
import RadioGroup from "@/components/ui/RadioGroup";
import SectionHeader from "@/components/ui/SectionHeader";
import Select from "@/components/ui/Select";
import StatsSection from "@/components/ui/StatsSection";
import Stepper from "@/components/ui/Stepper";
import Table from "@/components/ui/Table";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import Toast from "@/components/ui/Toast";
import { securityArt } from "@/lib/sites/art";
import { tokensToStyle } from "@/lib/ui/tokens";
import { PageHeader, Section, SiteFrame, euros, siteHref, useActiveIndex, useSiteNavigate } from "../shared";
import { CHAT_RULES, PLANS, SERVICES, SLUG, type Service } from "./data";
import "./vigia.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#06101e",
  fg: "#e8f0fb",
  mut: "#8ea3bf",
  acc: "#38bdf8",
  acc2: "#34d399",
  card: "rgba(255,255,255,0.05)",
  ln: "rgba(148,180,220,0.18)",
  r: 14,
  font: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif',
});

const href = (p = "") => siteHref(SLUG, p);
const TOAST = "vg-toast";
const img = (s: Service) => securityArt(s.seed, s.art);

/* ---------- marco: barra, pie y el chatbot, presente en todas las páginas ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const L = [href(), href("servicios"), href("planes"), href("contacto")];
  const active = useActiveIndex(L);
  return (
    <SiteFrame tokens={TOKENS} className="vg">
      <div className="st-header">
        <NavBar
          brand="VIGÍA"
          links={`Inicio=${L[0]}\nServicios > ${SERVICES.map((s) => `${s.name}|${s.short}|icon:${s.art === "bullet" ? "video" : s.art === "alarm" ? "bell" : s.art === "access" ? "lock" : "eye"}=${href(`servicios/${s.slug}`)}`).join("; ")}\nPlanes=${L[2]}\nContacto=${L[3]}`}
          defaultActive={active}
          menuStyle="mega"
          cta="Presupuesto gratis"
          onCta={() => navigate({ href: href("presupuesto") })}
          secondaryCta="900 100 200"
          onSecondaryCta={() => location.assign("tel:900100200")}
          layout="classic"
          shape="contained"
          variant="glass"
          onNavigate={navigate}
        />
      </div>
      <main>{children}</main>
      <div className="st-wrap vg__footer">
        <Footer
          brand="VIGÍA Seguridad"
          tagline="Empresa de seguridad privada autorizada por el Ministerio del Interior (n.º 4.321). Ejemplo para una demo."
          columns={`Servicios: ${SERVICES.map((s) => `${s.name}=${href(`servicios/${s.slug}`)}`).join(", ")}; Empresa: Planes=${href("planes")}, Presupuesto=${href("presupuesto")}, Contacto=${href("contacto")}; Legal: Aviso legal, Privacidad, Cookies`}
          social="icon:linkedin, icon:youtube"
          copyright="© 2026 Vigía Seguridad. Web de ejemplo construida con Trama."
          variant="glass"
        />
      </div>
      <ChatWidget
        title="Vera · asistente de Vigía"
        subtitle="En línea · responde al momento"
        greeting="¡Hola! Soy Vera. Te ayudo con **precios**, cómo es la **instalación** o a pedir un **presupuesto gratis**."
        rules={CHAT_RULES}
        fallback="No estoy segura de haberte entendido. Prueba con **precios**, **instalación**, **cámaras** o **alarmas**, o pide hablar con una persona."
        quickReplies="Precios, Pedir presupuesto, ¿Cuánto tarda la instalación?, Hablar con una persona"
        launcherLabel="¿Hablamos?"
        avatar="icon:shield"
        variant="glass"
      />
      <Toast id={TOAST} position="top-center" variant="glass" showTrigger={false} closeButton />
    </SiteFrame>
  );
}

function ServiceCard({ s }: { s: Service }) {
  return (
    <Link href={href(`servicios/${s.slug}`)} className="vg__svc ui-surface ui-s ui-s--glass">
      <img className="st-media st-media--169" src={img(s)} alt="" aria-hidden />
      <div>
        <h3>{s.name}</h3>
        <p className="st-muted">{s.short}</p>
        <span className="vg__more">Ver servicio →</span>
      </div>
    </Link>
  );
}

/* ---------- páginas ---------- */
function Home() {
  return (
    <>
      <Section>
        <div className="st-split">
          <Hero
            kicker="SEGURIDAD PARA HOGARES Y EMPRESAS"
            title="Vemos lo que pasa. Actuamos en 38 segundos."
            subtitle="Cámaras 4K, alarmas conectadas y una central que vigila las 24 horas. Instalación en 48 horas y sin permanencia."
            primaryCta="Pedir presupuesto gratis"
            primaryHref={href("presupuesto")}
            secondaryCta="Ver planes"
            secondaryHref={href("planes")}
            badges="2.300 instalaciones, Central homologada, Sin permanencia"
            align="left"
            backdrop="glow"
            variant="glass"
          />
          <img className="st-media st-media--43 vg__hero-img" src={securityArt(4, "monitor")} alt="Panel de monitorización con cuatro cámaras" />
        </div>
      </Section>
      <Section tight>
        <StatsSection kicker="Vigía en cifras" title="Seguridad que se mide" stats={"38| s|Tiempo medio de respuesta\n2300|+|Instalaciones activas\n99|,9 %|Disponibilidad de la central"} tone="acc" />
      </Section>
      <Section tight>
        <SectionHeader kicker="Servicios" title="Todo lo que protege tu espacio" subtitle="Puedes combinarlos: todo se controla desde la misma app." align="left" variant="glass" />
        <div className="st-grid st-grid--4 vg__svcs">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} s={s} />
          ))}
        </div>
      </Section>
      <Section tight>
        <div className="st-split">
          <div className="st-stack">
            <SectionHeader kicker="Cómo funciona" title="De la llamada a la tranquilidad, en una semana" subtitle="" align="left" variant="glass" />
            <Timeline variant="glass" steps={"Estudio gratuito|Un técnico visita tu espacio y te propone lo necesario, sin compromiso.\nInstalación en 48 h|Una visita de 2 a 4 horas. Sin obras ni cables a la vista.\nConexión a la central|Tus alarmas y cámaras quedan vigiladas las 24 horas.\nControl desde la app|Ves, armas y recibes avisos desde el móvil."} />
          </div>
          <FeatureGrid
            kicker="Para quién"
            title="Pensado para cada espacio"
            items={"icon:home|Hogares|Pisos y casas, con detectores que ignoran a tu mascota.\nicon:shopping-cart|Comercios|Cámaras en caja y almacén, y apertura sin llaves.\nicon:users|Oficinas|Control de accesos por horario y registro de entradas.\nicon:map-pin|Naves e industria|Perímetro, vehículos y vigilante de acuda."}
            variant="glass"
          />
        </div>
      </Section>
      <Section tight>
        <TestimonialSection
          kicker="Clientes"
          title="Lo que dicen quienes ya están protegidos"
          items={"Saltó la alarma a las 3 de la mañana y en un minuto me estaban llamando con la imagen de la cámara. Era el gato del vecino.|Lucía M.|Vivienda en Getafe|5\nNos robaron dos veces antes de Vigía. Desde la instalación, ni un susto, y el seguro nos bajó la prima.|Andrés P.|Ferretería en Valencia|5\nEl control de accesos nos ha ahorrado cambiar cerraduras cada vez que se va alguien.|Carmen R.|Administradora de fincas|4"}
          variant="glass"
        />
      </Section>
      <Section tight>
        <FAQSection
          kicker="Dudas frecuentes"
          title="Antes de contratar"
          items={"¿Hay permanencia?|No en el plan mensual: te das de baja con un mes de aviso. El anual sale dos meses más barato.\n¿Cuánto tarda la instalación?|48 horas desde que aceptas el presupuesto, en una visita de 2 a 4 horas.\n¿Es legal grabar la entrada de mi casa?|Sí, siempre que no grabes la vía pública más de lo imprescindible y señalices la zona. Te lo dejamos todo en regla.\n¿Qué pasa si se va la luz?|Alarma y grabador tienen batería de respaldo; la alarma avisa por 4G si cae el wifi."}
          variant="glass"
        />
      </Section>
      <Section>
        <CTASection title="Un estudio de seguridad gratis, en tu casa o tu negocio" subtitle="Te decimos qué necesitas y cuánto cuesta, sin compromiso." primaryCta="Pedir presupuesto" primaryHref={href("presupuesto")} secondaryCta="Hablar con Vera" onSecondary={() => (document.querySelector(".ui-chat__launcher") as HTMLButtonElement | null)?.click()} variant="glass" />
      </Section>
    </>
  );
}

function Services() {
  return (
    <Section>
      <PageHeader crumbs="Inicio, Servicios" title="Servicios" lead="Cuatro servicios que se combinan entre sí y se controlan desde la misma app. Todos con instalación incluida." />
      <div className="vg__svclist">
        {SERVICES.map((s, i) => (
          <article key={s.slug} className={`vg__svcrow ${i % 2 ? "vg__svcrow--rev" : ""}`}>
            <img className="st-media st-media--43" src={img(s)} alt="" aria-hidden />
            <div className="st-stack">
              <h2>{s.name}</h2>
              <p className="st-lead">{s.body}</p>
              <ul className="vg__checks">
                {s.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="st-row">
                <Button label="Ver detalle" href={href(`servicios/${s.slug}`)} variant="glass" emphasis="secondary" />
                <Button label="Presupuesto" href={`${href("presupuesto")}?servicio=${s.slug}`} variant="glass" emphasis="ghost" glyph="→" glyphPosition="end" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ServicePage({ s }: { s: Service }) {
  const others = SERVICES.filter((x) => x !== s);
  return (
    <>
      <Section>
        <div className="st-split">
          <PageHeader crumbs={`Inicio, Servicios, ${s.name}`} title={s.name} lead={s.body}>
            <div className="st-row">
              <Button label="Pedir presupuesto" href={`${href("presupuesto")}?servicio=${s.slug}`} variant="glass" glyph="→" glyphPosition="end" />
              <Button label="Ver planes" href={href("planes")} variant="glass" emphasis="secondary" />
            </div>
          </PageHeader>
          <img className="st-media st-media--43" src={img(s)} alt="" aria-hidden />
        </div>
      </Section>
      <Section tight>
        <div className="st-grid st-grid--2">
          <div className="vg__box ui-surface ui-s ui-s--glass">
            <h2>Qué incluye</h2>
            <ul className="vg__checks">
              {s.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="vg__box ui-surface ui-s ui-s--glass">
            <h2>Especificaciones</h2>
            <Table csv={s.specs} variant="glass" striped />
          </div>
        </div>
      </Section>
      <Section tight>
        <SectionHeader kicker="Preguntas" title={`Sobre ${s.name.toLowerCase()}`} subtitle="" align="left" variant="glass" />
        <Accordion items={s.faq} variant="glass" />
      </Section>
      <Section tight>
        <SectionHeader kicker="Combínalo con" title="Otros servicios" subtitle="" align="left" variant="glass" />
        <div className="st-grid st-grid--3">
          {others.map((o) => (
            <ServiceCard key={o.slug} s={o} />
          ))}
        </div>
      </Section>
    </>
  );
}

function Plans() {
  return (
    <>
      <Section>
        <PageHeader crumbs="Inicio, Planes" title="Planes y precios" lead="Instalación incluida, sin permanencia en el mensual y con la central 24 horas en todos los planes." align="center" />
        <PricingSection kicker="" title="" subtitle="" plans={PLANS} yearlyNote="2 meses gratis" cta="Elegir este plan" ctaHref={href("presupuesto")} variant="glass" />
      </Section>
      <Section tight>
        <SectionHeader kicker="Comparativa" title="Qué incluye cada plan" subtitle="" align="left" variant="glass" />
        <Table csv={"Incluye, Hogar, Negocio, Empresa\nDetectores de alarma, 3, 6, Sin límite\nCámaras, 2 interiores, 4 × 4K, Sin límite\nCentral 24 h, Sí, Con verificación, Con verificación\nControl de accesos, —, Básico, Completo\nServicio de acuda, —, Incluido, Prioritario\nGestor de cuenta, —, —, Sí"} variant="glass" striped />
      </Section>
    </>
  );
}

const TYPES = ["Vivienda", "Comercio", "Oficina", "Nave industrial", "Comunidad de vecinos"];
const SIZES = ["Menos de 100 m²", "100–300 m²", "300–1.000 m²", "Más de 1.000 m²"];
const STEPS = ["Espacio", "Servicios", "Tus datos", "Resumen"];
function Quote() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState(TYPES[0]);
  const [size, setSize] = useState(SIZES[0]);
  const [services, setServices] = useState<string[]>([SERVICES[1].name]);
  const [plan, setPlan] = useState("");
  const [c, setC] = useState({ name: "", phone: "", email: "", cp: "" });
  const [sent, setSent] = useState<string | null>(null);
  // ?servicio=… (desde las fichas) y ?plan=…&billing=… (desde Planes) rellenan el formulario
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const s = SERVICES.find((x) => x.slug === q.get("servicio"));
    if (s) setServices([s.name]);
    const p = q.get("plan");
    if (p) setPlan(`${p}${q.get("billing") === "yearly" ? " (anual)" : " (mensual)"}`);
  }, []);
  const base = { Vivienda: 25, Comercio: 45, Oficina: 50, "Nave industrial": 90, "Comunidad de vecinos": 60 }[type] ?? 40;
  const monthly = Math.round(base * (1 + SIZES.indexOf(size) * 0.45) + services.length * 12);
  const ok = [true, services.length > 0, c.name.trim() && /^[0-9 +]{9,}$/.test(c.phone.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) && /^\d{5}$/.test(c.cp), true][step];

  if (sent)
    return (
      <Section>
        <div className="vg__done ui-surface ui-s ui-s--glass">
          <Stepper steps={STEPS.join(", ")} current={4} variant="glass" />
          <h1>Solicitud {sent} recibida</h1>
          <p className="st-lead">Gracias, {c.name.split(" ")[0]}. Un técnico te llamará al {c.phone} en menos de 24 horas para concertar la visita gratuita. (Es una web de ejemplo: no se envía nada.)</p>
          <Button label="Volver al inicio" href={href()} variant="glass" />
        </div>
      </Section>
    );

  return (
    <Section>
      <PageHeader crumbs="Inicio, Presupuesto" title="Pide tu presupuesto gratis" lead="Cuatro pasos y un minuto. Te llamamos en menos de 24 horas para concertar la visita del técnico." />
      <div className="vg__quote">
        <div className="vg__quote-main ui-surface ui-s ui-s--glass">
          <Stepper steps={STEPS.join(", ")} current={step} variant="glass" />
          {plan && <Alert intent="info" title={`Plan ${plan}`} message="Lo tendremos en cuenta en el presupuesto." variant="glass" dismissible={false} />}
          {step === 0 && (
            <div className="vg__fields">
              <RadioGroup label="¿Qué quieres proteger?" options={TYPES.join(", ")} defaultValue={type} onChange={setType} variant="glass" />
              <Select label="Superficie aproximada" options={SIZES.join(", ")} value={size} onChange={setSize} variant="glass" />
            </div>
          )}
          {step === 1 && (
            <div className="vg__fields">
              <CheckboxGroup label="Servicios que te interesan" options={SERVICES.map((s) => s.name).join(", ")} defaultValue={services.join(", ")} onChange={setServices} variant="glass" />
              {services.length === 0 && <p className="st-muted">Elige al menos uno.</p>}
            </div>
          )}
          {step === 2 && (
            <div className="vg__fields vg__fields--2">
              <TextField label="Nombre" placeholder="Lucía Martín" value={c.name} onChange={(v) => setC((x) => ({ ...x, name: v }))} variant="glass" />
              <TextField label="Teléfono" placeholder="600 000 000" value={c.phone} onChange={(v) => setC((x) => ({ ...x, phone: v }))} variant="glass" />
              <TextField label="Correo" type="email" placeholder="tu@correo.com" value={c.email} onChange={(v) => setC((x) => ({ ...x, email: v }))} variant="glass" />
              <TextField label="Código postal" placeholder="28001" value={c.cp} onChange={(v) => setC((x) => ({ ...x, cp: v }))} hint="Para asignarte el técnico más cercano." variant="glass" />
            </div>
          )}
          {step === 3 && (
            <dl className="vg__summary">
              <div>
                <dt>Espacio</dt>
                <dd>
                  {type} · {size}
                </dd>
              </div>
              <div>
                <dt>Servicios</dt>
                <dd>{services.join(", ")}</dd>
              </div>
              <div>
                <dt>Contacto</dt>
                <dd>
                  {c.name} · {c.phone} · {c.email}
                </dd>
              </div>
            </dl>
          )}
          <div className="st-row vg__quote-nav">
            {step > 0 && <Button label="Atrás" variant="glass" emphasis="ghost" onClick={() => setStep((s) => s - 1)} />}
            {step < 3 ? (
              <Button label="Continuar" variant="glass" disabled={!ok} onClick={() => setStep((s) => s + 1)} />
            ) : (
              <Button
                label="Enviar solicitud"
                variant="glass"
                onClick={() => {
                  const ref = `VG-${Math.floor(1000 + Math.random() * 8999)}`;
                  setSent(ref);
                  sonnerToast.success("Solicitud enviada", { description: `Referencia ${ref}. Te llamamos en menos de 24 h.`, toasterId: TOAST });
                }}
              />
            )}
          </div>
        </div>
        <aside className="vg__estimate ui-surface ui-s ui-s--glass" aria-live="polite">
          <span className="st-muted">Estimación orientativa</span>
          <strong>{euros(monthly)}<small> / mes</small></strong>
          <p className="st-muted">Instalación incluida. El precio final lo confirma el técnico tras la visita.</p>
        </aside>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section>
      <PageHeader crumbs="Inicio, Contacto" title="Contacto" lead="Para urgencias o si tu alarma está saltando, llama al 900 100 200: te atendemos las 24 horas." />
      <div className="st-split vg__contact">
        <ContactForm title="Escríbenos" subtitle="Te respondemos en horario de oficina, de 8 a 20 h." fields="name,email,message" submitLabel="Enviar" successMessage="Gracias. Te contestamos hoy mismo." variant="glass" />
        <div className="st-stack">
          {[
            ["Teléfono 24 h", "900 100 200 · gratuito"],
            ["Correo", "hola@vigia.example"],
            ["Oficina central", "Calle de la Vigilancia 12, 28001 Madrid"],
            ["Delegaciones", "Madrid · Barcelona · Valencia · Sevilla · Bilbao"],
          ].map(([k, v]) => (
            <div key={k} className="vg__info ui-surface ui-s ui-s--glass">
              <span className="st-muted">{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
          <img className="st-media st-media--169" src={securityArt(9, "map")} alt="Mapa de las delegaciones" />
        </div>
      </div>
    </Section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "servicios" && !b) return <Services />;
  if (a === "servicios") {
    const s = SERVICES.find((x) => x.slug === b);
    if (s) return <ServicePage s={s} />;
  }
  if (a === "planes") return <Plans />;
  if (a === "presupuesto") return <Quote />;
  if (a === "contacto") return <Contact />;
  return null;
}
