"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import AsciiBackground from "@/components/ui/AsciiBackground";
import AsciiCard from "@/components/ui/AsciiCard";
import AsciiChart from "@/components/ui/AsciiChart";
import Alert from "@/components/ui/Alert";
import ArticlesSection from "@/components/ui/ArticlesSection";
import Badge from "@/components/ui/Badge";
import BitmapText from "@/components/ui/BitmapText";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import CodeBlock from "@/components/ui/CodeBlock";
import ContactForm from "@/components/ui/ContactForm";
import CTASection from "@/components/ui/CTASection";
import Divider from "@/components/ui/Divider";
import Dropdown from "@/components/ui/Dropdown";
import FAQSection from "@/components/ui/FAQSection";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import GlyphCursor from "@/components/ui/GlyphCursor";
import Hero from "@/components/ui/Hero";
import HoverFX from "@/components/ui/HoverFX";
import LogoCloud from "@/components/ui/LogoCloud";
import MagneticButton from "@/components/ui/MagneticButton";
import Modal from "@/components/ui/Modal";
import NavBar from "@/components/ui/NavBar";
import GridBackground from "@/components/ui/GridBackground";
import NeonSign from "@/components/ui/NeonSign";
import OtpInput from "@/components/ui/OtpInput";
import Pagination from "@/components/ui/Pagination";
import Panel from "@/components/ui/Panel";
import PricingSection from "@/components/ui/PricingSection";
import Progress from "@/components/ui/Progress";
import RadioGroup from "@/components/ui/RadioGroup";
import RangeSlider from "@/components/ui/RangeSlider";
import Reveal from "@/components/ui/Reveal";
import ScrambleText from "@/components/ui/ScrambleText";
import ScrollArea from "@/components/ui/ScrollArea";
import SceneFlash from "@/components/ui/SceneFlash";
import SectionHeader from "@/components/ui/SectionHeader";
import Select from "@/components/ui/Select";
import Skeleton from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import Spotlight from "@/components/ui/Spotlight";
import StatCounter from "@/components/ui/StatCounter";
import StatsSection from "@/components/ui/StatsSection";
import Stepper from "@/components/ui/Stepper";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import TeamSection from "@/components/ui/TeamSection";
import TerminalTyper from "@/components/ui/TerminalTyper";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import TextmodeBackground from "@/components/ui/TextmodeBackground";
import Timeline from "@/components/ui/Timeline";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import Tooltip from "@/components/ui/Tooltip";
import Typewriter from "@/components/ui/Typewriter";
import { toast as sonnerToast } from "sonner";
import "./mycel.css";

/**
 * MYCEL: segunda landing de ejemplo construida enteramente con `components/ui/`, esta vez con un
 * producto de software ficticio de raíz opuesta a CIPHERGRID: en vez de una red de sigilo neón,
 * una red de sensores de campo que se comporta como una red micelar (los hongos que conectan
 * raíces de árboles): crece, se autorrepara y comparte datos entre nodos sin un centro fijo.
 *
 * El fondo es la parte deliberadamente distinta de CIPHERGRID: la escena del héroe ("bloom" de
 * asciify-engine) germina de verdad mientras se hace scroll por el héroe —`progress` sigue la
 * posición de esa sección, no el scroll de toda la página— y el resto alterna una rejilla en CSS
 * puro con dos sketches de textmode.js (`life`, cuadrícula celular — la metáfora literal de una red
 * micelar — y `flow`, un campo de flujo que evoca savia moviéndose). Solo una escena vive montada
 * a la vez (mismo patrón `ACTS` que CIPHERGRID), con opacidad baja y un aclarado radial extra bajo
 * la columna de contenido (`.myc__bg::after` en mycel.css) para que la escena nunca compita con el
 * texto, en vez de compensarlo después con un filtro pesado sobre las tarjetas.
 */

const TOKENS: CSSProperties = {
  "--bg": "#071410",
  "--fg": "#eef7ec",
  "--mut": "#93b399",
  "--acc": "#67e38a",
  "--acc2": "#ffc95c",
  "--card": "rgba(255,255,255,0.045)",
  "--ln": "rgba(103,227,138,0.2)",
  "--r": "10px",
  fontFamily: 'var(--font-jetbrains-mono), ui-monospace, "Cascadia Code", Consolas, monospace',
} as CSSProperties;

export default function MycelLanding({ hud }: { hud: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const marks = useRef<Array<HTMLDivElement | null>>([]);

  // Igual que ThemedLanding/CyberpunkLanding: convierte la página en un documento normal que scrollea.
  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove("scrollable");
      window.scrollTo(0, 0);
    };
  }, []);

  // Un único IntersectionObserver decide qué escena de fondo está activa.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = Number((entry.target as HTMLElement).dataset.act);
          if (!Number.isNaN(i)) setAct(i);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    marks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // El brote de la escena del héroe crece con la posición de esa sección, no con el scroll global:
  // 0 al entrar por debajo del viewport, 1 al salir por completo por arriba.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = (vh - r.top) / (vh + r.height);
      setHeroProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const mark = (i: number) => (el: HTMLDivElement | null) => {
    marks.current[i] = el;
  };

  // Fondos sencillos y de baja densidad — la lección de CIPHERGRID aplicada desde el primer
  // borrador: se alterna GridBackground (CSS puro) con sketches calmos de textmode.js, nunca los
  // dos a la vez, y todos con opacidad baja.
  const ACTS = useMemo<{ id: string; label: string; node: React.ReactNode }[]>(
    () => [
      {
        id: "semilla",
        label: "semilla",
        node: (
          <AsciiBackground
            scene="bloom"
            asciiStyle="dots"
            cellSize={14}
            palette="tint"
            tintAmount={0.3}
            asciiHover="none"
            bloom={0}
            vignette={0.5}
            opacity={0.4}
            progress={heroProgress}
          />
        ),
      },
      {
        id: "raiz",
        label: "raíz",
        node: <GridBackground kind="cross" cellSize={44} opacity={0.22} fade />,
      },
      {
        id: "micelio",
        label: "micelio",
        node: <TextmodeBackground sketch="life" fontSize={17} palette="tint" tintAmount={0.3} opacity={0.32} />,
      },
      {
        id: "savia",
        label: "savia",
        node: <TextmodeBackground sketch="flow" fontSize={16} palette="duotone" tintAmount={0.3} opacity={0.32} />,
      },
      {
        id: "bosque",
        label: "bosque",
        node: <GridBackground kind="dots" cellSize={46} opacity={0.26} fade drift />,
      },
    ],
    [heroProgress],
  );

  const requestGraft = () => setModalOpen(true);
  const confirmGraft = () => {
    setModalOpen(false);
    sonnerToast.success("Solicitud enviada", { description: "Un agrónomo de la red revisa tu parcela en 24–48 h.", toasterId: "myc-toast" });
  };

  return (
    <div ref={root} className={`myc ${hud ? "" : "myc--hidden"}`} style={TOKENS} data-theme="mycel">
      {/* ---------- Fondo persistente ---------- */}
      <div className="myc__bg" aria-hidden>
        {ACTS[act].node}
      </div>
      <SceneFlash className="myc__flash" kind="iris" duration={0.8} playKey={act} />
      <div className="myc__cursor-scope">
        <GlyphCursor mode="glyph" glyph="❀" tone="acc2" cursorSize={16} lag={0.4} spin={false} glow />
      </div>
      <Toast id="myc-toast" position="bottom-right" variant="glass" showTrigger={false} />

      {/* ---------- Cabecera ---------- */}
      <div className="myc__nav">
        <NavBar brand="MYCEL" links="Red, Precios, Documentación, Diario de campo" cta="Unirse al vivero" variant="glass" />
      </div>

      <main className="myc__main">
        {/* ---------- 0. Hero (semilla) ---------- */}
        <div className="myc__act-mark" data-act={0} ref={mark(0)} />
        <div ref={heroRef}>
          <section className="myc__section myc__section--tight">
            <Hero
              kicker="TELEMETRÍA VIVA · 8.140 NODOS BROTANDO"
              title="MYCEL"
              subtitle="Una red de sensores que crece como un bosque: comparte agua, nutrientes y datos de clima entre parcelas, sin un solo servidor central que pueda morir."
              primaryCta="Unirse al vivero"
              secondaryCta="Ver el mapa de la red"
              badges="8.140 nodos vivos, 412 hectáreas cubiertas, autonomía solar 100%"
              align="center"
              backdrop="none"
              variant="glass"
            />
          </section>

          <div className="myc__boot">
            <Reveal trigger="inview" kind="blur">
              <TerminalTyper
                variant="terminal"
                chrome
                title="campo@mycel:~#"
                lines={"$ mycel graft --parcela=B7\n> midiendo humedad del suelo...\n> injertando en la red micelar...\n> sincronizando con nodos vecinos...\n> NODO INJERTADO\n$ _"}
              />
            </Reveal>
          </div>

          <div className="myc__marquee-strip">
            <Typewriter
              phrases={"una red que cicatriza sola\nsin nube, sin servidor, sin punto único de fallo\n8.140 nodos y ni una parcela a ciegas"}
              prefix=""
              variant="terminal"
              fontSize={16}
              cursor="block"
            />
          </div>
        </div>

        {/* ---------- 1. Producto (raíz) ---------- */}
        <div className="myc__act-mark" data-act={1} ref={mark(1)} />

        <section className="myc__section">
          <Reveal trigger="inview" kind="fade">
            <StatsSection
              kicker="En cifras"
              title="El bosque no deja de crecer"
              stats={"8140|+|Nodos vivos\n412|ha|Hectáreas cubiertas\n99987||Disponibilidad (de cada 100.000)"}
              tone="acc"
            />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="rise">
            <FeatureGrid
              kicker="Arquitectura"
              title="Construida como crece un bosque"
              items={
                "◆|Simbiosis de datos|Cada nodo comparte lo que mide con sus vecinos, igual que las raíces intercambian nutrientes por la micorriza.\n" +
                "▲|Autorreparación|Si un nodo se apaga, la red reenruta alrededor de él en segundos — nadie se queda a ciegas.\n" +
                "■|Cero nube obligatoria|Cada parcela puede operar sin conexión y sincronizar cuando vuelva a haber enlace.\n" +
                "●|API abierta|Conecta riego, alertas o tu propio panel: los datos son tuyos, no de nuestro servidor."
              }
              variant="glass"
            />
          </Reveal>
        </section>

        <section className="myc__section">
          <div className="myc__center">
            <BitmapText text="MODULOS DE CAMPO" tone="acc" align="center" glow />
          </div>
          <Reveal trigger="inview" kind="stagger" className="myc__grid-3">
            <Spotlight variant="minimal" tone="acc" border={false}>
              <AsciiCard
                title="Sensor de humedad"
                text="Mide el agua del suelo cada 10 minutos y avisa antes de que la planta lo note."
                meta="v3.1 · activo"
                variant="solid"
                index={1} field="waves" charset="braille"
                glyph="~"
                fieldHover="ripple"
              />
            </Spotlight>
            <AsciiCard title="Enlace raíz" text="Malla de radio de largo alcance entre nodos vecinos, sin torres ni cableado." meta="0 caídas · 260 días" variant="solid" index={2} field="rings" charset="braille" glyph="≈" fieldHover="glow" />
            <AsciiCard title="Nodo solar" text="Autonomía completa: capta su propia energía y dura toda la temporada." meta="carga 96%" variant="solid" index={3} field="noise" charset="dots" glyph="*" fieldHover="repel" />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="myc__center">
              <SectionHeader kicker="Conoce el sistema" title="Tres formas de mirar la misma red" subtitle="Resumen, arquitectura y sostenibilidad, sin folleto de por medio." align="center" variant="minimal" rule="ascii" />
            </div>
            <div className="myc__dev-tabs">
              <Tabs
                items="Resumen, Arquitectura, Sostenibilidad"
                content={
                  "MYCEL conecta sensores de campo en una malla que se reorganiza sola cuando un nodo falla o se añade uno nuevo.\n" +
                  "Cada nodo mide, guarda localmente y retransmite; no existe un servidor central que apagar ni que hackear.\n" +
                  "Nodos solares, carcasa biodegradable en el 80% de sus piezas y cero minería de datos personales."
                }
                variant="outline"
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 2. Datos / panel de campo (micelio) ---------- */}
        <div className="myc__act-mark" data-act={2} ref={mark(2)} />

        <section className="myc__section">
          <Reveal trigger="inview" kind="rise">
            <div className="myc__center">
              <SectionHeader kicker="Para integradores" title="Conecta tu parcela en minutos" subtitle="Una CLI, un SDK y una API — elige tu forma de entrar." align="center" variant="minimal" />
            </div>
            <div className="myc__grid-2">
              <CodeBlock
                filename="instalación.sh"
                variant="terminal"
                code={"curl -sL https://mycel.dev/install | sh\nmycel auth --key=$MYCEL_KEY\nmycel node up --parcela=auto"}
              />
              <CodeBlock
                filename="cliente.ts"
                variant="terminal"
                code={'import { mesh } from "@mycel/sdk";\n\nconst nodo = await mesh.connect({ parcela: "B7" });\nawait nodo.report({ humedad: 42, temp: 18.4 });'}
              />
            </div>
            <div style={{ maxWidth: 640, margin: "24px auto 0" }}>
              <Table csv={"Zona, Nodos, Humedad media\nLadera norte, 2.940, 38%\nValle bajo, 3.210, 51%\nCresta seca, 1.990, 22%"} variant="terminal" />
            </div>
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="myc__center">
              <SectionHeader kicker="Hoja de ruta" title="De una semilla a un bosque maduro" subtitle="Cinco fases, sin fecha de caducidad." align="center" variant="minimal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Timeline
                marker="glyph"
                glyph="❀"
                variant="outline"
                steps={
                  "Fase 0 · Semilla|El primer nodo se enraíza en un huerto de prueba.\n" +
                  "Fase 1 · Brote|30 parcelas piloto validan la malla de radio.\n" +
                  "Fase 2 · Raíz|Acceso abierto con lista de espera para nuevas regiones.\n" +
                  "Fase 3 · Dosel|Cobertura continua en 12 comarcas, sin huecos.\n" +
                  "Fase 4 · Bosque maduro|Red autosuficiente que ya no necesita nuestra intervención."
                }
              />
            </div>
          </Reveal>
        </section>

        <section className="myc__section">
          <Reveal trigger="inview" kind="rise">
            <div className="myc__center">
              <SectionHeader kicker="Panel de campo" title="Lo que ve un agrónomo al conectar" subtitle="Métricas en vivo, sin dashboards de mentira." align="center" variant="minimal" />
            </div>
            <HoverFX effect="glow" tone="acc">
              <div className="myc__dash ui-surface ui-s ui-s--terminal" style={{ padding: 24 }}>
                <div className="myc__dash-col">
                  <AsciiChart data="18, 24, 31, 22, 40, 36, 28, 19" labels="00,03,06,09,12,15,18,21" kind="bars" height={8} fillChar="█" variant="terminal" />
                  <Progress label="Sincronización de nodos" value={82} striped variant="terminal" />
                  <div className="myc__dash-row">
                    <Badge text="En línea" intent="success" variant="solid" dot />
                    <Badge text="Riego activo" intent="accent" variant="solid" />
                    <Badge text="1 alerta" intent="warning" variant="solid" />
                  </div>
                </div>
                <div className="myc__dash-col">
                  <Alert intent="warning" title="Sequía detectada en Cresta seca" message="Riego autónomo activado por el nodo 0x2C hace 4 minutos." variant="terminal" dismissible={false} />
                  <div className="myc__dash-row">
                    <Spinner kind="braille" label="Sincronizando nodos vecinos…" variant="terminal" />
                  </div>
                  <div>
                    <span className="ui-hint" style={{ display: "block", marginBottom: 8 }}>
                      cargando historial de la parcela…
                    </span>
                    <Skeleton kind="card" tone="acc" />
                  </div>
                  <StatCounter value={184320} format="compact" prefix="" suffix=" L" label="AGUA AHORRADA ESTE MES" tone="acc2" align="left" />
                </div>
              </div>
            </HoverFX>
          </Reveal>
        </section>

        {/* ---------- 3. Acceso (savia) ---------- */}
        <div className="myc__act-mark" data-act={3} ref={mark(3)} />

        <section className="myc__section">
          <Reveal trigger="inview" kind="fade">
            <PricingSection
              ctaHref="#acceso"
              kicker="Planes"
              title="Elige cuánto quieres crecer"
              subtitle="Cambia o cancela cuando quieras, sin permanencia."
              plans={
                "Semilla|0 €|/ para siempre|no|1 nodo de prueba;Datos de la última semana;Comunidad en Discord\n" +
                "Brote|29 €|/ mes|si|Nodos ilimitados por parcela;Histórico completo;Alertas en tiempo real\n" +
                "Bosque|129 €|/ mes|no|Todo lo de Brote;Integración con riego automático;Soporte agronómico dedicado"
              }
              variant="glass"
            />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="rise">
            <div className="myc__center">
              <NeonSign text="INJERTAR NODO" mode="outline" tone="acc2" fontSize={32} flicker={false} />
              <p className="myc__lead">Rellena tu parcela. Un agrónomo de la red revisa cada solicitud en menos de 48 horas.</p>
            </div>
            <form
              id="acceso"
              className="ui-surface ui-s ui-s--glass myc__access"
              onSubmit={(e) => {
                e.preventDefault();
                requestGraft();
              }}
            >
              <Stepper steps="Parcela, Sensores, Confirmación" current={1} variant="glass" />
              <div className="myc__access-row myc__access-row--2">
                <TextField label="Alias de la parcela" placeholder="ladera_norte_04" variant="glass" prefix="#" />
                <Select label="Tipo de cultivo" options="Viñedo, Olivar, Bosque mixto, Huerto urbano" placeholder="Elige un cultivo" variant="glass" />
              </div>
              <div className="myc__access-row myc__access-row--2">
                <CheckboxGroup label="Sensores a instalar" options="Humedad, Temperatura, Luz, pH" defaultValue="Humedad, Temperatura" variant="glass" />
                <RadioGroup label="Fuente de energía" options="Solar, Batería, Red eléctrica" defaultValue="Solar" variant="glass" />
              </div>
              <RangeSlider label="Densidad de nodos por hectárea" min={1} max={20} defaultValue={6} unit=" / ha" variant="glass" />
              <Toggle label="Activar riego autónomo al detectar sequía" defaultChecked variant="glass" />
              <div>
                <span className="ui-field__label" style={{ display: "block", marginBottom: 8 }}>
                  Código de vivero
                </span>
                <OtpInput length={6} variant="glass" />
              </div>
              <div className="myc__access-actions">
                <Tooltip label="¿Por qué lo pedimos?" content="El código confirma que un vivero de la red ya avala tu parcela." side="top" variant="glass" />
                <MagneticButton type="submit" label="Enviar solicitud" variant="glass" emphasis="primary" glyph="→" />
              </div>
            </form>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onConfirm={confirmGraft}
              title="¿Confirmas tu solicitud de injerto?"
              body="Se enviará tu parcela al vivero. Un agrónomo revisa cada solicitud a mano antes de enviarte los nodos."
              confirmLabel="Sí, enviar"
              cancelLabel="Todavía no"
              variant="glass"
            />
          </Reveal>
        </section>

        <section className="myc__section">
          <Reveal trigger="inview" kind="fade">
            <div className="myc__docs">
              <Breadcrumbs items="Docs, SDK, Sensores" variant="outline" />
              <div className="myc__docs-list">
                {[
                  { t: "Calibrar un sensor de humedad", d: "Cómo ajustar la curva de lectura a tu tipo de suelo.", f: "calibrado.md" },
                  { t: "Protocolo de malla", d: "Cómo se reorganizan los nodos cuando uno deja de responder.", f: "malla.md" },
                  { t: "Sincronización sin conexión", d: "Qué pasa con los datos mientras la parcela está aislada.", f: "offline.md" },
                ].map((doc) => (
                  <div key={doc.t} className="myc__doc-card">
                    <Panel bar={doc.f} title={doc.t} body={doc.d} footer="" variant="outline" />
                    <div className="myc__doc-card__menu">
                      <Dropdown label="⋮" items="Editar, Archivar, Compartir" align="right" variant="outline" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="myc__docs-foot">
                <Pagination total={5} defaultPage={1} variant="outline" />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="myc__center">
              <SectionHeader kicker="Registro" title="Últimos cambios de la red" subtitle="Todo lo que ha cambiado, sin notas de prensa." align="center" variant="minimal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ScrollArea
                variant="glass"
                height={200}
                content={
                  "Registro de crecimiento\n" +
                  "v5.4.0 — Reenrutado de nodos vecinos en menos de 3 s (antes 11 s).\n" +
                  "v5.3.0 — API abierta para conectar riego automático de terceros.\n" +
                  "v5.2.0 — Sincronización offline: hasta 30 días sin conexión.\n" +
                  "v5.1.0 — Carcasa biodegradable en el 80% de sus piezas.\n" +
                  "v5.0.0 — Primera versión pública de MYCEL."
                }
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 4. Cierre (bosque) ---------- */}
        <div className="myc__act-mark" data-act={4} ref={mark(4)} />

        <section className="myc__section">
          <Reveal trigger="inview" kind="rise">
            <TestimonialSection
              kicker="Lo que dicen"
              title="Parcelas que ya están conectadas"
              items={
                "La primera sequía que capeamos sin perder ni una fila de viña fue con MYCEL avisando tres días antes.|Inés Salaverri|Viticultora, Bodegas Altomonte|5\n" +
                "Conectamos 40 hectáreas en un fin de semana. Sin torres, sin cableado, sin dolores de cabeza.|Tomás Herranz|Ingeniero agrónomo, Cooperativa Els Ports|5\n" +
                "Por fin un panel que entiendo sin ser ingeniero de datos.|Marta Coll|Gestora de huertos urbanos, Ayuntamiento de Vic|4"
              }
              variant="glass"
            />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <TeamSection
              kicker="El vivero"
              title="Quién construye la red"
              people={"Noa Ferreiro|Fundadora e ingeniera de sistemas\nDaniel Prats|Director de agronomía\nYara Kessler|Jefa de hardware de campo"}
              variant="outline"
            />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <LogoCloud label="Con la confianza de" brands="BODEGAS ALTOMONTE, COOPERATIVA ELS PORTS, RAÍZ VERDE, REFORESTA AHORA, HUERTOS DEL VALLE, AYUNTAMIENTO DE VIC" variant="minimal" />
          </Reveal>
        </section>

        <section className="myc__section">
          <Reveal trigger="inview" kind="rise">
            <ArticlesSection
              kicker="Diario de campo"
              title="Últimas notas desde el vivero"
              articles={
                "Sostenibilidad|Cómo ahorramos 1,2 millones de litros de agua en una temporada|Un vistazo a las alertas de sequía y las decisiones que toman sin intervención humana.|11 sep 2026|6 min\n" +
                "Infraestructura|Dentro de la malla: 8.140 nodos y ni un solo punto de fallo|Arquitectura distribuida explicada para quien no quiere depender de una nube.|3 sep 2026|8 min\n" +
                "Comunidad|Lo que aprendimos de 30 parcelas piloto|Métricas, fallos y una plaga que detectamos tres días antes de verla.|22 ago 2026|5 min"
              }
              variant="glass"
            />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <FAQSection
              kicker="Preguntas frecuentes"
              title="Antes de injertar tu primer nodo"
              variant="outline"
              items={
                "¿Necesito cobertura móvil?|No. Los nodos forman su propia malla de radio; solo un punto de la parcela necesita conexión para sincronizar con tu panel.\n" +
                "¿Funciona en invierno?|Sí, los nodos son solares con batería de respaldo para hasta 12 días sin sol.\n" +
                "¿Dónde viven mis datos?|En el nodo local primero, y en tu propia cuenta después — nunca los usamos para nada que no sea tu panel.\n" +
                "¿Puedo montar mi propia malla sin el plan de pago?|Sí, el plan Semilla incluye un nodo de prueba y el protocolo es abierto."
              }
            />
          </Reveal>
        </section>

        <section className="myc__section myc__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="myc__newsletter">
              <ScrambleText text="RECIBE EL DIARIO DE CAMPO" as="h3" tone="gradient" uppercase fontSize={22} />
              <ContactForm title="" subtitle="Una nota al mes, sin spam, cancelable en un clic." fields="email" layout="inline" submitLabel="Suscribirme" variant="outline" />
            </div>
          </Reveal>
        </section>

        <section className="myc__section">
          <Reveal trigger="inview" kind="rise">
            <CTASection
              title="Injerta tu primer nodo antes de la próxima sequía."
              subtitle="8.140 nodos ya están en la red. El siguiente puede vivir en tu parcela."
              primaryCta="Unirse al vivero"
              secondaryCta="Hablar con un agrónomo"
              variant="glass"
            />
          </Reveal>
        </section>

        <Divider label="fin del diario de campo" pattern="//" mode="text" variant="minimal" />

        <Footer
          brand="MYCEL"
          tagline="Infraestructura que crece, no que se construye."
          columns="Producto: Precios, Sostenibilidad, Estado de la red; Recursos: Documentación, SDK, Comunidad; Legal: Privacidad, Términos, Datos abiertos"
          social="://, @, #"
          copyright="© 2026 MYCEL. Cultivado, no fabricado."
          variant="minimal"
        />
      </main>
    </div>
  );
}
