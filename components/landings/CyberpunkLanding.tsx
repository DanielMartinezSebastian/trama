"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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
import CrtOverlay from "@/components/ui/CrtOverlay";
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
import Timeline from "@/components/ui/Timeline";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import Tooltip from "@/components/ui/Tooltip";
import Typewriter from "@/components/ui/Typewriter";
import { toast as sonnerToast } from "sonner";
import "./cyberpunk.css";

/**
 * CIPHERGRID: landing retrowave/cyberpunk de ejemplo para un producto de software inventado,
 * construida enteramente con `components/ui/` (el mismo kit del catálogo `/componentes`) — no
 * reutiliza el sistema bespoke de `ThemedLanding`. Sirve como prueba de que el kit compone bien
 * una página real: prácticamente todos sus componentes aparecen aquí en un uso creíble.
 *
 * Reactividad al scroll: una sola escena de fondo activa a la vez (`ACTS`), no las cinco montadas
 * a un tiempo — más barato y es el mismo patrón ya probado en `ThemedLanding` (fondo se cambia,
 * el "pop" se disimula con una transición `SceneFlash`). Qué escena está activa lo decide un único
 * `IntersectionObserver` sobre marcadores invisibles al principio de cada tramo de la página.
 * El resto del "reacciona al scroll" es el propio `Reveal` (`trigger="inview"`) de cada sección.
 */

// Fondos deliberadamente sencillos: celdas grandes, poca densidad, sin bloom/glitch — el ruido
// visual es justo lo que obligaba antes a un halo pesado sobre el texto. Se alterna GridBackground
// (CSS puro, el más limpio del kit) con AsciiBackground en su estilo más simple ("dots"/"lines",
// nunca "braille"/"cross"/"diagonal"/"mosaic", que son los patrones más densos del catálogo).
const ACTS: { id: string; label: string; node: React.ReactNode }[] = [
  {
    id: "hero",
    label: "enlace",
    node: <GridBackground kind="lines" cellSize={52} opacity={0.3} fade />,
  },
  {
    id: "producto",
    label: "red",
    node: <AsciiBackground scene="galaxy" asciiStyle="dots" cellSize={13} palette="duotone" tintAmount={0.35} opacity={0.5} asciiHover="trail" hoverStrength={0.35} bloom={0} vignette={0.55} />,
  },
  {
    id: "datos",
    label: "núcleo",
    node: <GridBackground kind="cross" cellSize={44} opacity={0.28} fade />,
  },
  {
    id: "acceso",
    label: "puerta",
    node: <AsciiBackground scene="rings" asciiStyle="dots" cellSize={13} palette="tint" tintAmount={0.35} opacity={0.5} asciiHover="water" hoverStrength={0.35} bloom={0} vignette={0.55} />,
  },
  {
    id: "final",
    label: "salida",
    node: <GridBackground kind="dots" cellSize={48} opacity={0.28} fade drift />,
  },
];

const TOKENS: CSSProperties = {
  "--bg": "#08020f",
  "--fg": "#f4ecff",
  "--mut": "#a78bc7",
  "--acc": "#ff2fd0",
  "--acc2": "#22e8ff",
  "--card": "rgba(255,255,255,0.05)",
  "--ln": "rgba(255,47,208,0.22)",
  "--r": "6px",
  fontFamily: 'var(--font-jetbrains-mono), ui-monospace, "Cascadia Code", Consolas, monospace',
} as CSSProperties;

export default function CyberpunkLanding({ hud }: { hud: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const marks = useRef<Array<HTMLDivElement | null>>([]);

  // Igual que ThemedLanding: convierte la página en un documento normal que scrollea.
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

  const mark = (i: number) => (el: HTMLDivElement | null) => {
    marks.current[i] = el;
  };

  const requestAccess = () => setModalOpen(true);
  const confirmAccess = () => {
    setModalOpen(false);
    sonnerToast.success("Solicitud enviada", { description: "Revisa tu bandeja cifrada en las próximas horas.", toasterId: "cg-toast" });
  };

  return (
    <div ref={root} className={`cg ${hud ? "" : "cg--hidden"}`} style={TOKENS} data-theme="ciphergrid">
      {/* ---------- Fondo persistente ---------- */}
      <div className="cg__bg" aria-hidden>
        {ACTS[act].node}
      </div>
      <SceneFlash className="cg__flash" kind="slices" duration={0.7} playKey={act} />
      <CrtOverlay className="cg__crt" scanlines={0.14} vignette={0.5} flicker={0.06} sweep={false} />
      <div className="cg__cursor-scope">
        <GlyphCursor mode="glyph" glyph="▮" tone="acc" cursorSize={16} lag={0.35} spin={false} glow />
      </div>
      <Toast id="cg-toast" position="bottom-right" variant="neon" showTrigger={false} />

      {/* ---------- Cabecera ---------- */}
      <div className="cg__nav">
        <NavBar brand="CIPHERGRID" links="Producto, Precios, Docs, Blog" cta="Solicitar acceso" variant="neon" />
      </div>

      <main className="cg__main">
        {/* ---------- 0. Hero ---------- */}
        <div className="cg__act-mark" data-act={0} ref={mark(0)} />
        <section className="cg__section cg__section--tight">
          <Hero
            kicker="AVISO DE SISTEMA · NODO 0x7F EN LÍNEA"
            title="CIPHERGRID"
            subtitle="Infraestructura autónoma, cifrado cuántico y control total de tu red — antes de que alguien más lo tenga."
            primaryCta="Solicitar acceso"
            secondaryCta="Ver documentación"
            badges="12.482 nodos activos, cifrado AES-512-Q, uptime 99.994%"
            align="center"
            backdrop="none"
            variant="neon"
          />
        </section>

        <div className="cg__boot">
          <Reveal trigger="inview" kind="blur">
            <TerminalTyper
              variant="terminal"
              chrome
              title="root@ciphergrid:~#"
              lines={"$ ciphergrid connect --node=0x7F\n> verificando huella biométrica...\n> estableciendo túnel cuántico...\n> sincronizando con la red fantasma...\n> ACCESO CONCEDIDO\n$ _"}
            />
          </Reveal>
        </div>

        <div className="cg__marquee-strip">
          <Typewriter
            phrases={"desconecta antes de que te desconecten\ncifrado de extremo a extremo, sin excusas\n12.482 nodos y ni un punto de fallo"}
            prefix=""
            variant="terminal"
            fontSize={16}
            cursor="block"
          />
        </div>

        {/* ---------- 1. Producto ---------- */}
        <div className="cg__act-mark" data-act={1} ref={mark(1)} />

        <section className="cg__section">
          <Reveal trigger="inview" kind="fade">
            <StatsSection
              kicker="En números"
              title="La red no duerme"
              stats={"12482|+|Nodos activos\n4|ms|Latencia media\n99994||Uptime (de cada 100.000)"}
              tone="acc"
            />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="rise">
            <FeatureGrid
              kicker="Arquitectura"
              title="Construido para operar en la sombra"
              items={
                "icon:lock:sharp|Cifrado cuántico|Cada paquete se cifra con claves de un solo uso generadas por ruido cuántico real.\n" +
                "icon:globe|Red fantasma|Tu tráfico rebota por nodos anónimos que rotan cada 400 milisegundos.\n" +
                "icon:eye-off|Modo sigiloso|Ningún proceso deja rastro: memoria volátil, cero logs, cero excusas.\n" +
                "icon:terminal:sharp|API abierta|Automatiza cualquier cosa desde tu propio stack, sin depender de nuestra consola."
              }
              variant="outline"
            />
          </Reveal>
        </section>

        <section className="cg__section">
          <div className="cg__center">
            <BitmapText text="MODULOS" tone="acc" align="center" glow />
          </div>
          <Reveal trigger="inview" kind="stagger" className="cg__grid-3">
            <Spotlight variant="minimal" tone="acc" border={false}>
              <AsciiCard
                title="Firewall neuronal"
                text="Aprende de cada intento de intrusión y cierra la puerta antes de que la toquen."
                meta="v4.2 · activo"
                variant="neon"
                index={1} field="rain" charset="detailed"
                glyph="#"
                fieldHover="ripple"
              />
            </Spotlight>
            <AsciiCard title="Motor de cifrado" text="AES-512 cuántico con rotación de claves cada 400 ms." meta="0 brechas · 900 días" variant="neon" index={2} field="binary" charset="binary" glyph="$" fieldHover="glow" />
            <AsciiCard title="Enlace fantasma" text="Proxy distribuido en 12.482 nodos que nunca duermen." meta="latencia 4 ms" variant="neon" index={3} field="maze" charset="detailed" glyph="@" fieldHover="repel" />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="cg__center">
              <SectionHeader kicker="Conoce el sistema" title="Tres formas de mirar la misma red" subtitle="Resumen, arquitectura y seguridad, explicados sin marketing." align="center" variant="minimal" rule="ascii" />
            </div>
            <div className="cg__dev-tabs">
              <Tabs
                items="Resumen, Arquitectura, Seguridad"
                content={
                  "CIPHERGRID enruta tu tráfico por una red de nodos anónimos que rotan constantemente, sin punto único de fallo.\n" +
                  "Cada nodo es independiente: recibe, cifra, reenvía y olvida. No existe un servidor central que apagar.\n" +
                  "Ni una sola clave persiste más de 400 ms. Auditorías externas cada trimestre, publicadas sin editar."
                }
                variant="outline"
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 2. Datos / panel de control ---------- */}
        <div className="cg__act-mark" data-act={2} ref={mark(2)} />

        <section className="cg__section">
          <Reveal trigger="inview" kind="rise">
            <div className="cg__center">
              <SectionHeader kicker="Para desarrolladores" title="Conecta en menos de un minuto" subtitle="Una CLI, un SDK y una API — elige tu forma de entrar." align="center" variant="minimal" />
            </div>
            <div className="cg__grid-2">
              <CodeBlock
                filename="instalación.sh"
                variant="terminal"
                code={"curl -sL https://ciphergrid.dev/install | sh\nciphergrid auth --key=$CIPHERGRID_KEY\nciphergrid node up --region=auto"}
              />
              <CodeBlock
                filename="cliente.ts"
                variant="terminal"
                code={'import { grid } from "@ciphergrid/sdk";\n\nconst node = await grid.connect({ mode: "fantasma" });\nawait node.send(payload, { cifrado: "aes-512-q" });'}
              />
            </div>
            <div style={{ maxWidth: 640, margin: "24px auto 0" }}>
              <Table csv={"Región, Nodos, Latencia\nEU-Oeste, 3.402, 3 ms\nNA-Este, 2.918, 4 ms\nAPAC, 1.774, 6 ms"} variant="terminal" />
            </div>
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="cg__center">
              <SectionHeader kicker="Hoja de ruta" title="De un servidor sin nombre a la órbita baja" subtitle="Cinco fases, sin fecha de caducidad." align="center" variant="minimal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Timeline
                marker="glyph"
                glyph="icon:zap"
                variant="outline"
                steps={
                  "Fase 0 · Génesis|El núcleo de cifrado nace en un servidor sin nombre.\n" +
                  "Fase 1 · Alfa cerrada|300 operativos de confianza prueban la red fantasma.\n" +
                  "Fase 2 · Beta pública|Acceso abierto con lista de espera y código de invitación.\n" +
                  "Fase 3 · Lanzamiento global|Disponible en 40 regiones, sin fronteras.\n" +
                  "Fase 4 · Expansión orbital|Nodos en órbita baja para latencia cero."
                }
              />
            </div>
          </Reveal>
        </section>

        <section className="cg__section">
          <Reveal trigger="inview" kind="rise">
            <div className="cg__center">
              <SectionHeader kicker="Panel de control" title="Lo que ve un operativo al conectar" subtitle="Métricas en vivo, sin dashboards de mentira." align="center" variant="minimal" />
            </div>
            <HoverFX effect="scanline" tone="acc">
              <div className="cg__dash ui-surface ui-s ui-s--terminal" style={{ padding: 24 }}>
                <div className="cg__dash-col">
                  <AsciiChart data="18, 24, 31, 22, 40, 36, 28, 19" labels="00,03,06,09,12,15,18,21" kind="bars" height={8} fillChar="█" variant="terminal" />
                  <Progress label="Sincronización de nodos" value={82} striped variant="terminal" />
                  <div className="cg__dash-row">
                    <Badge text="En línea" intent="success" variant="neon" dot />
                    <Badge text="Cifrado activo" intent="accent" variant="neon" />
                    <Badge text="3 alertas" intent="warning" variant="neon" />
                  </div>
                </div>
                <div className="cg__dash-col">
                  <Alert intent="warning" title="Intento de intrusión detectado" message="Neutralizado por el firewall neuronal en 12 ms." variant="terminal" dismissible={false} />
                  <div className="cg__dash-row">
                    <Spinner kind="braille" label="Escaneando puertos abiertos…" variant="terminal" />
                  </div>
                  <div>
                    <span className="ui-hint" style={{ display: "block", marginBottom: 8 }}>
                      sincronizando panel enemigo…
                    </span>
                    <Skeleton kind="card" tone="acc" />
                  </div>
                  <StatCounter value={2456789} format="compact" prefix="" suffix="" label="PAQUETES CIFRADOS HOY" tone="acc2" align="left" />
                </div>
              </div>
            </HoverFX>
          </Reveal>
        </section>

        {/* ---------- 3. Acceso ---------- */}
        <div className="cg__act-mark" data-act={3} ref={mark(3)} />

        <section className="cg__section">
          <Reveal trigger="inview" kind="fade">
            <PricingSection
              kicker="Acceso"
              title="Elige tu nivel de acceso"
              subtitle="Cambia o revoca el acceso cuando quieras."
              plans={
                "Runner|0 €|/ para siempre|no|1 nodo personal;Cifrado estándar;Comunidad Discord\n" +
                "Operative|39 €|/ mes|si|Nodos ilimitados;Red fantasma completa;Soporte prioritario 24/7\n" +
                "Syndicate|149 €|/ mes|no|Todo lo de Operative;Nodo autoalojado;Acceso root a la API"
              }
              variant="neon"
            />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="rise">
            <div className="cg__center">
              <NeonSign text="SOLICITAR ACCESO" mode="tube" tone="acc" fontSize={34} />
              <p className="cg__lead">Rellena tu perfil operativo. Revisamos cada solicitud manualmente en menos de 24 horas.</p>
            </div>
            <form
              className="ui-surface ui-s ui-s--neon cg__access"
              onSubmit={(e) => {
                e.preventDefault();
                requestAccess();
              }}
            >
              <Stepper steps="Identidad, Acceso, Confirmación" current={1} variant="neon" />
              <div className="cg__access-row cg__access-row--2">
                <TextField label="Alias / handle" placeholder="ghost_runner" variant="neon" prefix="@" />
                <Select label="Rol" options="Desarrollador, Red Team, Operaciones, Investigador" placeholder="Elige un rol" variant="neon" />
              </div>
              <div className="cg__access-row cg__access-row--2">
                <CheckboxGroup label="Áreas de interés" options="Cifrado, Redes, IA ofensiva, Forense digital" defaultValue="Cifrado, Redes" variant="neon" />
                <RadioGroup label="Nivel de acceso solicitado" options="Básico, Elevado, Root" defaultValue="Elevado" variant="neon" />
              </div>
              <RangeSlider label="Nivel de paranoia" min={0} max={100} defaultValue={70} unit="%" variant="neon" />
              <Toggle label="Activar modo fantasma al conectar" defaultChecked variant="neon" />
              <div>
                <span className="ui-field__label" style={{ display: "block", marginBottom: 8 }}>
                  Código de invitación
                </span>
                <OtpInput length={6} variant="neon" />
              </div>
              <div className="cg__access-actions">
                <Tooltip label="¿Por qué lo pedimos?" content="El código confirma que alguien de la red ya confía en ti." side="top" variant="neon" />
                <MagneticButton type="submit" label="Enviar solicitud" variant="neon" emphasis="primary" glyph="icon:arrow-right" />
              </div>
            </form>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onConfirm={confirmAccess}
              title="¿Confirmas tu solicitud de acceso?"
              body="Se enviará tu perfil operativo al colectivo. Revisamos cada solicitud a mano — no hay bots al otro lado."
              confirmLabel="Sí, enviar"
              cancelLabel="Todavía no"
              variant="neon"
            />
          </Reveal>
        </section>

        <section className="cg__section">
          <Reveal trigger="inview" kind="fade">
            <div className="cg__docs">
              <Breadcrumbs items="Docs, API, Autenticación" variant="outline" />
              <div className="cg__docs-list">
                {[
                  { t: "Autenticación con claves de sesión", d: "Cómo emitir y rotar credenciales sin tocar la consola.", f: "auth.md" },
                  { t: "Webhooks cifrados", d: "Recibe eventos de red firmados con tu clave pública.", f: "webhooks.md" },
                  { t: "Límites y cuotas", d: "Qué pasa cuando un nodo satura su ancho de banda.", f: "limites.md" },
                ].map((doc) => (
                  <div key={doc.t} className="cg__doc-card">
                    <Panel bar={doc.f} title={doc.t} body={doc.d} footer="" variant="outline" />
                    <div className="cg__doc-card__menu">
                      <Dropdown label="⋮" items="Editar, Archivar, Compartir" align="right" variant="outline" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="cg__docs-foot">
                <Pagination total={6} defaultPage={1} variant="outline" />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="cg__center">
              <SectionHeader kicker="Registro" title="Últimos cambios del sistema" subtitle="Todo lo que ha cambiado, sin notas de prensa." align="center" variant="minimal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ScrollArea
                variant="neon"
                height={200}
                content={
                  "Registro de cambios\n" +
                  "v9.4.0 — Rotación de nodos cada 400 ms (antes 1.2 s).\n" +
                  "v9.3.0 — API abierta para automatizar el enrutado fantasma.\n" +
                  "v9.2.0 — Firewall neuronal: aprende de cada intento de intrusión.\n" +
                  "v9.1.0 — Soporte para nodos autoalojados (plan Syndicate).\n" +
                  "v9.0.0 — Primera versión pública de CIPHERGRID."
                }
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 4. Cierre ---------- */}
        <div className="cg__act-mark" data-act={4} ref={mark(4)} />

        <section className="cg__section">
          <Reveal trigger="inview" kind="rise">
            <TestimonialSection
              kicker="Lo que dicen"
              title="Operativos que ya están dentro"
              items={
                "La primera vez que vi caer un firewall corporativo con CIPHERGRID entendí que el juego había cambiado.|Kira Voss|Red Team Lead, Nullwire|5\n" +
                "Migramos toda nuestra infraestructura fantasma en un fin de semana. Cero downtime, cero preguntas.|Dmitri Kessler|Arquitecto de sistemas, Blackout Media|5\n" +
                "Es lo más cerca que he estado de tener superpoderes de verdad.|Rae Okonkwo|Investigadora independiente|4"
              }
              variant="neon"
            />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <TeamSection
              kicker="El colectivo"
              title="Quién construye la red"
              people={"Cero|Fundador y arquitecto jefe\nMara Ilić|Directora de criptografía\nTobin Reyes|Jefe de operaciones fantasma"}
              variant="outline"
            />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <LogoCloud label="Con la confianza de" brands="VOIDCORP, REDLINE LOGISTICS, GHOSTWIRE NETWORKS, OMNISYS, BLACKOUT MEDIA, NULLWIRE" variant="minimal" />
          </Reveal>
        </section>

        <section className="cg__section">
          <Reveal trigger="inview" kind="rise">
            <ArticlesSection
              kicker="Transmisiones"
              title="Últimas señales interceptadas"
              articles={
                "Seguridad|Cómo detectamos 40.000 intentos de intrusión en un solo día|Un vistazo al firewall neuronal y las decisiones que toma sin intervención humana.|14 jul 2049|6 min\n" +
                "Infraestructura|Dentro de la red fantasma: 12.482 nodos y ni un solo punto de fallo|Arquitectura distribuida explicada para quien no confía en nadie.|2 jul 2049|8 min\n" +
                "Comunidad|Lo que aprendimos de la beta cerrada con 300 operativos|Métricas, fallos y una brecha que nunca llegó a producción.|20 jun 2049|5 min"
              }
              variant="neon"
            />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <FAQSection
              kicker="Preguntas frecuentes"
              title="Antes de conectar"
              variant="outline"
              items={
                "¿Es legal usar CIPHERGRID?|Sí. Es una plataforma de cifrado e infraestructura de red — lo que hagas con ella es tu responsabilidad, como con cualquier herramienta.\n" +
                "¿Funciona sin conexión?|El núcleo de cifrado sí; la red fantasma necesita al menos un nodo activo para enrutar tráfico.\n" +
                "¿Dónde viven mis datos?|En ningún sitio fijo: rotan entre nodos cada 400 ms y se descartan tras cada sesión.\n" +
                "¿Puedo autoalojar mi propio nodo?|Sí, el plan Syndicate incluye el binario del nodo y las claves de red."
              }
            />
          </Reveal>
        </section>

        <section className="cg__section cg__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="cg__newsletter">
              <ScrambleText text="RECIBE ALERTAS DEL SISTEMA" as="h3" tone="gradient" uppercase fontSize={22} />
              <ContactForm title="" subtitle="Boletín cifrado, sin spam, cancelable en un clic." fields="email" layout="inline" submitLabel="Suscribirme" variant="outline" />
            </div>
          </Reveal>
        </section>

        <section className="cg__section">
          <Reveal trigger="inview" kind="rise">
            <CTASection
              title="Conecta antes de que te desconecten."
              subtitle="12.482 nodos ya están en línea. El siguiente puede ser el tuyo."
              primaryCta="Solicitar acceso"
              secondaryCta="Hablar con el colectivo"
              variant="neon"
            />
          </Reveal>
        </section>

        <Divider label="fin de la transmisión" pattern="//" mode="text" variant="minimal" />

        <Footer
          brand="CIPHERGRID"
          tagline="El sistema operativo para asaltar el futuro."
          columns="Producto: Precios, Seguridad, Estado de la red; Recursos: Documentación, API, Comunidad; Legal: Privacidad, Términos, Divulgación responsable"
          social="icon:github, icon:discord, icon:mastodon"
          copyright="© 2049 CIPHERGRID. Transmisión cifrada de extremo a extremo."
          variant="minimal"
        />
      </main>
    </div>
  );
}
