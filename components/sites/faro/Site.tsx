"use client";

import type { CSSProperties, ReactNode } from "react";
import AppShell from "@/components/ui/AppShell";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FeatureExplorer from "@/components/ui/FeatureExplorer";
import Footer from "@/components/ui/Footer";
import GradientField from "@/components/ui/GradientField";
import Kbd from "@/components/ui/Kbd";
import LogoCloud from "@/components/ui/LogoCloud";
import NavBar from "@/components/ui/NavBar";
import PricingSection from "@/components/ui/PricingSection";
import { nightTokens, tokensToStyle } from "@/lib/ui/tokens";
import { lucide } from "@/lib/ui/icons-lucide";
import { SiteFrame, useSiteNavigate } from "../shared";
import { FEATURES, PLANS, SECTIONS, SHORTCUTS, TICKETS } from "./data";
import "./faro.css";

const TOKENS = { ...tokensToStyle(nightTokens), "--sel-bg": nightTokens.acc, "--sel-fg": "#ffffff" } as CSSProperties;

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  return (
    <SiteFrame tokens={TOKENS} className="fa" icons={{ set: lucide }}>
      <div className="fa-head">
        <NavBar
          brand="Faro"
          links={"Producto=#producto\nAgentes=#agentes\nPrecios=#precios\nAtajos=#atajos"}
          search="button"
          searchPlaceholder="Buscar en Faro…"
          searchItems={SECTIONS.map((s) => `${s.title}=#${s.id}`).join(", ")}
          secondaryCta="Entrar"
          cta="Empezar gratis"
          onCta={() => navigate({ href: "#precios" })}
          layout="classic"
          linksAlign="end"
          shape="full"
          size="sm"
          variant="minimal"
          onNavigate={navigate}
        />
      </div>
      <main id="contenido">{children}</main>
      <div className="fa-wrap fa-foot">
        <Footer
          brand="Faro"
          tagline="Soporte para equipos y agentes"
          columns="Producto: Bandeja=#producto, Agentes=#agentes, Precios=#precios; Empresa: Blog=#, Empleo=#, Contacto=#; Legal: Créditos=/creditos, Privacidad=#"
          social="icon:linkedin, icon:youtube"
          copyright="© 2026 Faro. Producto ficticio: demo construida con Trama."
          variant="minimal"
        />
      </div>
    </SiteFrame>
  );
}

const TONE: Record<string, string> = { acc: "var(--acc)", ok: "#4cc38a", warn: "#f2b84b", mut: "var(--mut)" };

/** La aplicación como imagen principal: el mismo AppShell del kit con datos, luz desde arriba y fundido hacia el suelo. */
function ProductShot() {
  return (
    <div className="fa-shot" aria-label="Vista de la bandeja de Faro" role="img">
      <div className="fa-shot__frame" aria-hidden>
        <AppShell
          brand={<><span className="fa-dot" />Faro</>}
          title="Bandeja · Soporte"
          height="560px"
          collapsible={false}
          variant="editorial"
          groups={[
            { items: [{ label: "Bandeja", href: "#producto", icon: "◧", badge: "12", active: true }, { label: "Mías", href: "#producto", icon: "◉" }, { label: "Agentes", href: "#agentes", icon: "✦", badge: "3" }] },
            { label: "Equipos", items: [{ label: "Facturación", href: "#producto", icon: "◌" }, { label: "Producto", href: "#producto", icon: "◌" }, { label: "Cuentas", href: "#producto", icon: "◌" }] },
          ]}
          actions={<span className="fa-kbdhint"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>}
        >
          <ul className="fa-tickets">
            {TICKETS.map((t) => (
              <li key={t.id}>
                <span className="fa-tickets__id">{t.id}</span>
                <span className="fa-tickets__t">{t.title}</span>
                <span className="fa-tickets__tag" style={{ "--c": TONE[t.tone] } as CSSProperties}>{t.tag}</span>
                <span className="fa-tickets__who">{t.who}</span>
                <span className="fa-tickets__st">{t.state}</span>
                <span className="fa-tickets__time">{t.time}</span>
              </li>
            ))}
          </ul>
        </AppShell>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="fa-hero">
      <GradientField kind="beams" speed={0.6} className="fa-hero__beams" />
      <div className="fa-wrap fa-hero__in">
        <a className="fa-news" href="#agentes">
          <Badge text="Nuevo" variant="minimal" />
          <span>Faro Agentes ya responde en 31 idiomas</span>
          <span aria-hidden>→</span>
        </a>
        <h1 className="fa-h1">El soporte que se ordena solo, para equipos y agentes</h1>
        <p className="fa-sub">Una bandeja para todos los canales, agentes que resuelven lo repetido y cifras que se leen de un vistazo.</p>
        <div className="fa-ctas">
          <Button label="Empezar gratis" href="#precios" variant="solid" />
          <Button label="Hablar con ventas" href="#precios" variant="solid" intent="neutral" emphasis="ghost" glyph="→" />
        </div>
      </div>
      <div className="fa-wrap">
        <ProductShot />
      </div>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  if (path.length) return null;
  return (
    <>
      <Hero />
      <section className="fa-wrap fa-logos">
        <LogoCloud label="Lo usan equipos de soporte en" brands="Nébula, Cobalto, Mareta, Ibis Pagos, Sendero, Lumen" layout="row" variant="minimal" />
      </section>

      <section className="fa-wrap fa-lead" id="producto">
        <p>
          <b>Una herramienta de soporte nueva.</b> Pensada para equipos que trabajan con agentes desde el primer día, Faro pone orden en
          la entrada, responde lo que ya sabe y te deja el resto con el contexto hecho.
        </p>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="fa-wrap fa-split">
          <h2 className="fa-h2">{s.title}</h2>
          <div>
            <p>{s.text}</p>
            <a className="fa-more" href="#precios">Saber más <span aria-hidden>→</span></a>
          </div>
        </section>
      ))}

      <section className="fa-wrap fa-explore" aria-labelledby="fa-explore-t">
        <p className="fa-eyebrow">Funciones</p>
        <h2 id="fa-explore-t" className="fa-h2">Todo en un sitio. <span>Elige una y mira cómo funciona.</span></h2>
        <FeatureExplorer items={FEATURES.map((f) => `${f.title}|${f.text}|${f.image}|${f.alt}`).join("\n")} variant="minimal" ratio="4 / 3" />
      </section>

      <section className="fa-wrap fa-keys" id="atajos" aria-labelledby="fa-keys-t">
        <h2 id="fa-keys-t" className="fa-h2">Pensado para el teclado. <span>Cada acción tiene su atajo.</span></h2>
        <ul>
          {SHORTCUTS.map((k) => (
            <li key={k.label}>
              <span className="fa-keys__k">{k.keys.map((x) => <Kbd key={x}>{x}</Kbd>)}</span>
              <span>{k.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fa-wrap fa-pricing" id="precios">
        <p className="fa-eyebrow">Precios</p>
        <h2 className="fa-h2">Empieza gratis. <span>Paga cuando el equipo crezca.</span></h2>
        {/* fórmula de producto (docs/13): una pieza con columnas, el plan destacado iluminado desde arriba y checks grises */}
        <PricingSection
          kicker=""
          title=""
          subtitle=""
          plans={PLANS}
          layout="joined"
          highlight="lift"
          planCase="none"
          marker="check"
          toggle="neutral"
          badge="Recomendado"
          cta="Empezar"
          ctaHref="#precios"
          yearlyPeriod="/ persona y año"
          yearlyNote="2 meses gratis"
          variant="editorial"
        />
        <p className="fa-pricing__note">Precios sin IVA. Los agentes no cuentan como personas. Cancela cuando quieras.</p>
      </section>

      <section className="fa-close">
        <GradientField kind="mesh" speed={0.5} intensity={0.4} />
        <div className="fa-wrap fa-close__in">
          <h2 className="fa-h2">Ordena el soporte esta tarde.</h2>
          <Button label="Empezar gratis" href="#precios" variant="solid" size="lg" />
        </div>
      </section>
    </>
  );
}
