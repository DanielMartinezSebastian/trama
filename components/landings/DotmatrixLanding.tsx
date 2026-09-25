"use client";

import { useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";
import AsciiCard from "@/components/ui/AsciiCard";
import AsciiChart from "@/components/ui/AsciiChart";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import CodeBlock from "@/components/ui/CodeBlock";
import CTASection from "@/components/ui/CTASection";
import Divider from "@/components/ui/Divider";
import FAQSection from "@/components/ui/FAQSection";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/ui/Hero";
import LogoCloud from "@/components/ui/LogoCloud";
import MagneticButton from "@/components/ui/MagneticButton";
import Marquee from "@/components/ui/Marquee";
import Modal from "@/components/ui/Modal";
import NavBar from "@/components/ui/NavBar";
import PricingSection from "@/components/ui/PricingSection";
import Progress from "@/components/ui/Progress";
import RadioGroup from "@/components/ui/RadioGroup";
import RetroCanvas from "@/components/ui/RetroCanvas";
import RetroShapes, { type RetroShapesProps } from "@/components/ui/RetroShapes";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Reveal from "@/components/ui/Reveal";
import SceneFlash from "@/components/ui/SceneFlash";
import SectionHeader from "@/components/ui/SectionHeader";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import StatsSection from "@/components/ui/StatsSection";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import TerminalTyper from "@/components/ui/TerminalTyper";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import { dotmatrixTokens, tokensToStyle } from "@/lib/ui/tokens";
import "./dotmatrix.css";

/**
 * SIGNAL: landing de referencia del tema `dotmatrixTokens` + variante `dotmatrix` + `RetroCanvas`. Producto ficticio: detección
 * de intrusiones en tiempo real. Monocromo salvo el acento, un rojo de alerta, y el color semántico (`intent`) de avisos y estados.
 *
 * Un solo `RetroCanvas` fijo hace de fondo de toda la página (un motor pesado por vista, guía §22) y cambia de forma con cada
 * acto; el lienzo no se desmonta, solo cambian sus hijos. En el héroe la figura se desplaza a la derecha para dejar el titular
 * libre; en el resto va centrada y atenuada por el velo de `.dmx__bg::after`.
 */

// el tema dot matrix con un único color: rojo de alerta como acento (botones, activo, insignias, selección, lluvia de código)
const TOKENS = tokensToStyle({ ...dotmatrixTokens, acc: "#ff3b3b", acc2: "#b3261e" });

type Act = { shape: NonNullable<RetroShapesProps["shape"]>; label: string; ramp: "dots" | "braille" | "hex" | "circuit"; rain: number };
const ACTS: Act[] = [
  { shape: "chevrons", label: "handshake", ramp: "dots", rain: 0 },
  { shape: "cage", label: "perímetro", ramp: "dots", rain: 0 },
  { shape: "globe", label: "red global", ramp: "braille", rain: 0 },
  { shape: "terrain", label: "tráfico", ramp: "hex", rain: 0.2 },
  { shape: "tunnel", label: "túnel cifrado", ramp: "dots", rain: 0 },
];

export default function DotmatrixLanding({ hud }: { hud: boolean }) {
  const [act, setAct] = useState(0);
  const [wide, setWide] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [plan, setPlan] = useState<{ name: string; price: string; period: string } | null>(null);
  const marks = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const mq = matchMedia("(min-width: 900px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      document.documentElement.classList.remove("scrollable");
      mq.removeEventListener("change", sync);
      window.scrollTo(0, 0);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.act);
          if (!Number.isNaN(i)) setAct(i);
        }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    marks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const mark = (i: number) => (el: HTMLDivElement | null) => {
    marks.current[i] = el;
  };

  const a = ACTS[act];
  // en el héroe (y solo en pantallas anchas) la figura va a la derecha del titular
  const offset: [number, number, number] = act === 0 && wide ? [2.6, 0, 0] : [0, 0, 0];

  // elegir un plan lleva al formulario de acceso con el plan ya indicado
  const choosePlan = (p: { name: string; price: string; period: string; yearly: boolean }) => {
    setPlan(p);
    document.getElementById("acceso")?.scrollIntoView({ behavior: "smooth", block: "center" });
    sonnerToast(`Plan ${p.name}`, { description: `${p.price} ${p.period}${p.yearly ? " · facturación anual" : ""}. Completa el acceso para desplegar.`, toasterId: "dmx-toast" });
  };

  const confirmDeploy = () => {
    setModalOpen(false);
    sonnerToast.success("Sensor desplegado", { description: `${plan ? `Plan ${plan.name}. ` : ""}Primer informe en tu bandeja en menos de 5 minutos.`, toasterId: "dmx-toast" });
  };

  return (
    <div className={`dmx ${hud ? "" : "dmx--hidden"}`} style={TOKENS} data-theme="dotmatrix">
      {/* ---------- Fondo persistente: una sola escena 3D con filtro retro ---------- */}
      <div className={`dmx__bg ${act === 0 ? "dmx__bg--hero" : ""}`} aria-hidden>
        <RetroCanvas mode="ascii" ramp={a.ramp} cellSize={7} cellAspect={1.4} scanlines={0.35} vignette={0.55} glow={0.2} rain={a.rain} flicker={0} fov={35} cameraZ={9}>
          <group position={offset} scale={act === 0 ? 0.9 : 0.8}>
            <RetroShapes shape={a.shape} speed={0.8} />
          </group>
        </RetroCanvas>
      </div>
      <SceneFlash className="dmx__flash" kind="slices" duration={0.5} playKey={act} />
      <div className="dmx__scene-tag" aria-hidden>
        [{String(act + 1).padStart(2, "0")}/{String(ACTS.length).padStart(2, "0")}] {a.label}
      </div>
      <Toast id="dmx-toast" position="bottom-right" variant="dotmatrix" intentStyle="mono" closeButton showTrigger={false} />

      {/* ---------- Cabecera ---------- */}
      <div className="dmx__nav">
        <NavBar
          brand="SIGNAL"
          links={
            "Plataforma > Detección|Firmas y modelo de anomalías en paralelo|icon:shield; Bloqueo en línea|Corta la conexión en el propio sensor|icon:zap; Consola|Todas las detecciones con su evidencia|icon:server; API y webhooks|Cada evento como JSON firmado|icon:code\n" +
            "Soluciones > Salud; Logística; Industria; Banca\n" +
            "Precios=#precios\n" +
            "Docs [nuevo]"
          }
          search="command"
          searchPlaceholder="Buscar en SIGNAL…"
          searchItems="Estado del servicio, Firmas de ataque, Instalar el sensor, Cambiar la clave"
          secondaryCta="Entrar"
          cta="Solicitar acceso"
          activeOn="scroll"
          variant="dotmatrix"
        >
          {/* progreso de lectura dentro de la barra (sticky): siempre a la vista, sin ocupar una esquina */}
          <ScrollProgress placement="inline" kind="ring" showValue variant="dotmatrix" tone="acc" label="Progreso de la página" />
        </NavBar>
      </div>

      <main className="dmx__main">
        {/* ---------- 0. Héroe (handshake) ---------- */}
        <div className="dmx__act-mark" data-act={0} ref={mark(0)} />
        <section className="dmx__section dmx__hero">
          <Hero
            kicker="DETECCIÓN DE INTRUSIONES · TIEMPO REAL"
            title="Ve cada paquete antes de que llegue"
            subtitle="SIGNAL escucha tu red, reconoce patrones de ataque en milisegundos y corta la conexión antes de que nadie abra una alerta."
            primaryCta="Solicitar acceso"
            secondaryCta="Ver la consola"
            badges="4M paquetes/s, latencia < 1 ms, sin agentes"
            align="left"
            backdrop="none"
            variant="dotmatrix"
          />
          <div className="dmx__hero-term">
            <Reveal trigger="inview" kind="blur">
              <TerminalTyper
                variant="dotmatrix"
                chrome
                title="root@signal:~#"
                lines={
                  "$ signal sensor up --iface=eth0\n> cargando 18.402 firmas...\n> modelo de anomalías: calibrado\n> escuchando 4,2M paquetes/s\n> 0 amenazas activas\n" +
                  "$ signal watch --live\n> 12:04:17  port-scan   185.220.x.x  bloqueado\n> 12:04:19  dns-tunnel  10.0.4.17    aviso\n> 12:04:23  brute-ssh   45.9.x.x     bloqueado\n> 3 eventos · 0,8 ms de media\n$ _"
                }
              />
            </Reveal>
          </div>
        </section>

        <div className="dmx__strip">
          <Marquee text="SYN · ACK · FIN · RST · TLS 1.3 · DNS · ICMP · QUIC" variant="dotmatrix" tone="mut" rows={1} fontSize={14} duration={30} separator="   ·   " edgeFade />
        </div>

        {/* ---------- 1. Plataforma (perímetro) ---------- */}
        <div className="dmx__act-mark" data-act={1} ref={mark(1)} />
        <section className="dmx__section">
          <Reveal trigger="inview" kind="fade">
            <StatsSection
              kicker="En cifras"
              title="Rápido donde importa"
              stats={"4|M|Paquetes por segundo por sensor\n18|K|Firmas de ataque actualizadas\n99|%|Falsos positivos descartados solos"}
              tone="acc"
            />
          </Reveal>
        </section>

        <section className="dmx__section dmx__section--tight">
          <Reveal trigger="inview" kind="rise">
            <FeatureGrid
              kicker="Plataforma"
              title="Todo el perímetro, una sola consola"
              items={
                "icon:shield|Bloqueo en línea|Corta la conexión en el propio sensor, sin esperar a un SIEM ni a una persona.\n" +
                "icon:eye|Tráfico cifrado|Detecta patrones en TLS por huella y tiempos, sin descifrar nada.\n" +
                "icon:server|Sin agentes|Un sensor pasivo por segmento de red. Nada que instalar en los equipos.\n" +
                "icon:code|API y webhooks|Cada detección llega a tu flujo como JSON firmado."
              }
              variant="dotmatrix"
            />
          </Reveal>
        </section>

        <section className="dmx__section">
          <Reveal trigger="inview" kind="stagger" className="dmx__grid-3">
            <AsciiCard title="Firmas" text="18.402 reglas de ataque conocidas, actualizadas cada hora desde nuestra red de sensores." meta="v18.4 · activo" variant="dotmatrix" index={1} field="rain" charset="dots" glyph="•" fieldHover="glow" />
            <AsciiCard title="Anomalías" text="Un modelo por segmento aprende lo normal de tu red y marca lo que se sale." meta="calibrado · 14 días" variant="dotmatrix" index={2} field="noise" charset="braille" glyph="•" fieldHover="ripple" />
            <AsciiCard title="Respuesta" text="Bloqueo, cuarentena o solo aviso: tú decides qué hace cada regla." meta="0,8 ms de media" variant="dotmatrix" index={3} field="scan" charset="dots" glyph="•" fieldHover="repel" />
          </Reveal>
        </section>

        {/* ---------- 2. Red global (globo) ---------- */}
        <div className="dmx__act-mark" data-act={2} ref={mark(2)} />
        <section className="dmx__section">
          <Reveal trigger="inview" kind="rise">
            <div className="dmx__center">
              <SectionHeader kicker="Para equipos de seguridad" title="Integración en diez minutos" subtitle="Un binario, una clave y tu red ya está escuchada." align="center" variant="dotmatrix" />
            </div>
            <div className="dmx__tabs">
              <Tabs
                items="Despliegue, Detección, Respuesta"
                content={
                  "El sensor se conecta a un puerto espejo o a un tap de red. No toca el tráfico: solo lo lee.\n" +
                  "Firmas conocidas y un modelo de anomalías trabajan en paralelo; cada detección lleva su evidencia en crudo.\n" +
                  "Cada regla decide: bloquear en el sensor, aislar el equipo por API o solo avisar."
                }
                variant="dotmatrix"
              />
            </div>
            <div className="dmx__grid-2">
              <CodeBlock filename="instalar.sh" variant="dotmatrix" code={"curl -sL https://signal.dev/install | sh\nsignal auth --key=$SIGNAL_KEY\nsignal sensor up --iface=eth0"} />
              <CodeBlock filename="webhook.ts" variant="dotmatrix" code={'app.post("/signal", (req) => {\n  const { rule, src, action } = req.body;\n  if (action === "block") notify(src);\n});'} />
            </div>
          </Reveal>
        </section>

        <section className="dmx__section dmx__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="dmx__center">
              <SectionHeader kicker="Ciclo de una amenaza" title="De paquete a bloqueo" subtitle="Lo que pasa en menos de un milisegundo." align="center" variant="dotmatrix" />
            </div>
            <div className="dmx__row-center">
              <Timeline
                marker="glyph"
                glyph="•"
                variant="dotmatrix"
                steps={
                  "Captura|El sensor lee el paquete del puerto espejo.\n" +
                  "Huella|Se extraen cabeceras, tamaños y tiempos; el contenido no se guarda.\n" +
                  "Veredicto|Firmas y modelo votan. Si coinciden, es una detección.\n" +
                  "Acción|Bloqueo en el sensor y evento firmado a tu webhook."
                }
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 3. Tráfico (relieve) ---------- */}
        <div className="dmx__act-mark" data-act={3} ref={mark(3)} />
        <section className="dmx__section">
          <Reveal trigger="inview" kind="rise">
            <div className="dmx__center">
              <SectionHeader kicker="Consola" title="Lo que ves al abrir SIGNAL" subtitle="Datos reales de tu red, sin gráficos de adorno." align="center" variant="dotmatrix" />
            </div>
            <div className="dmx__dash ui-surface ui-s ui-s--dotmatrix">
              <div className="dmx__dash-col">
                <AsciiChart data="120, 180, 150, 420, 260, 190, 880, 240" labels="00,03,06,09,12,15,18,21" kind="bars" height={8} fillChar="•" variant="dotmatrix" />
                <Progress label="Cobertura de segmentos" value={86} variant="dotmatrix" />
                <div className="dmx__dash-row">
                  <Badge text="Sensor activo" intent="success" variant="dotmatrix" dot />
                  <Badge text="3 bloqueos" intent="danger" variant="dotmatrix" />
                  <Badge text="1 en revisión" intent="warning" variant="dotmatrix" />
                </div>
              </div>
              <div className="dmx__dash-col">
                <Alert intent="danger" title="Escaneo de puertos bloqueado" message="185.220.x.x probó 1.024 puertos en 2 s. Conexión cortada en el sensor eth0." variant="dotmatrix" dismissible={false} />
                <Spinner kind="braille" label="Actualizando firmas…" variant="dotmatrix" />
                <Table csv={"Regla, Origen, Acción\nport-scan, 185.220.x.x, bloqueo\ndns-tunnel, 10.0.4.17, aviso\nbrute-ssh, 45.9.x.x, bloqueo"} variant="dotmatrix" />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="dmx__section" id="precios">
          <Reveal trigger="inview" kind="fade">
            <PricingSection
              kicker="Planes"
              title="Por sensor, sin sorpresas"
              subtitle="Pago mensual o anual. Sin límite de tráfico."
              plans={
                "Laboratorio|0 €|/ siempre|no|1 sensor;Firmas públicas;Retención de 24 h;-Bloqueo en línea|Para probar en un segmento\n" +
                "Equipo|240 €|/ sensor · mes|si|Firmas en tiempo real;Modelo de anomalías;Bloqueo en línea|Para equipos de seguridad|2.400 €\n" +
                "Operaciones|A medida|/ año|no|Todo lo de Equipo;Retención de 1 año;Respuesta 24/7|Para SOC y redes críticas"
              }
              yearlyPeriod="/ sensor · año"
              cta="Elegir plan"
              onSelectPlan={choosePlan}
              variant="dotmatrix"
            />
          </Reveal>
        </section>

        <section className="dmx__section dmx__section--tight" id="acceso">
          <Reveal trigger="inview" kind="rise">
            <form
              className="ui-surface ui-s ui-s--dotmatrix dmx__access"
              onSubmit={(e) => {
                e.preventDefault();
                setModalOpen(true);
              }}
            >
              <SectionHeader
                kicker="Acceso"
                title="Despliega tu primer sensor"
                subtitle={plan ? `Plan ${plan.name} · ${plan.price} ${plan.period}. Te enviamos la clave y el binario por correo.` : "Te enviamos la clave y el binario por correo."}
                align="left"
                variant="dotmatrix"
              />
              <div className="dmx__access-row">
                <TextField label="Organización" placeholder="acme-sec" variant="dotmatrix" prefix="@" />
                <Select label="Tamaño de red" options="Menos de 100 equipos, 100–1.000 equipos, Más de 1.000 equipos" placeholder="Elige un tamaño" variant="dotmatrix" />
              </div>
              <div className="dmx__access-row">
                <CheckboxGroup label="Protocolos a vigilar" options="TCP/UDP, DNS, TLS" defaultValue="TCP/UDP, DNS" variant="dotmatrix" />
                <RadioGroup label="Acción por defecto" options="Solo avisar, Bloquear" defaultValue="Solo avisar" variant="dotmatrix" />
              </div>
              <Toggle label="Enviar resumen diario" defaultChecked variant="dotmatrix" />
              <div className="dmx__access-actions">
                <MagneticButton type="submit" label="Desplegar sensor" variant="dotmatrix" emphasis="primary" glyph="icon:arrow-right" />
              </div>
            </form>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onConfirm={confirmDeploy}
              title="¿Desplegar el sensor?"
              body="Se generará una clave para tu organización. El sensor empieza en modo «solo avisar» hasta que lo cambies."
              confirmLabel="Desplegar"
              cancelLabel="Todavía no"
              variant="dotmatrix"
            />
          </Reveal>
        </section>

        {/* ---------- 4. Cierre (túnel cifrado) ---------- */}
        <div className="dmx__act-mark" data-act={4} ref={mark(4)} />
        <section className="dmx__section">
          <Reveal trigger="inview" kind="rise">
            <TestimonialSection
              kicker="Equipos que ya escuchan"
              title="Menos alertas, más bloqueos"
              items={
                "Pasamos de 400 alertas diarias a 12 que de verdad había que mirar.|Irene Soler|CISO, red hospitalaria|5\n" +
                "El escaneo que antes veíamos al día siguiente ahora se corta en el sensor.|Tomás Vega|SOC, operador logístico|5\n" +
                "Sin agentes: lo desplegamos en toda la planta en una tarde.|Aiko Mori|Infraestructura, fabricante industrial|4"
              }
              variant="dotmatrix"
            />
          </Reveal>
        </section>

        <section className="dmx__section dmx__section--tight">
          <Reveal trigger="inview" kind="fade">
            <LogoCloud label="Protegiendo redes de" brands="NORTE LOGÍSTICA, RED SALUD, PLANTA 7, BANCA MÓVIL, PUERTO SECO, ORBITAL SAT" variant="dotmatrix" />
          </Reveal>
        </section>

        <section className="dmx__section dmx__section--tight">
          <Reveal trigger="inview" kind="fade">
            <FAQSection
              kicker="Preguntas"
              title="Antes de conectar el sensor"
              items={
                "¿SIGNAL descifra mi tráfico?|No. Analiza huellas, tamaños y tiempos; el contenido cifrado nunca se abre.\n" +
                "¿Qué pasa si el sensor se cae?|Es pasivo: la red sigue funcionando igual, solo dejas de ver el tráfico.\n" +
                "¿Dónde se guardan los datos?|En tu región y solo los metadatos; la retención depende del plan.\n" +
                "¿Puedo empezar sin bloquear nada?|Sí, el modo por defecto es «solo avisar»."
              }
              variant="dotmatrix"
            />
          </Reveal>
        </section>

        <section className="dmx__section">
          <Reveal trigger="inview" kind="rise">
            <CTASection title="Tu red ya está hablando. Empieza a escucharla." subtitle="Primer sensor gratis, sin tarjeta." primaryCta="Solicitar acceso" secondaryCta="Hablar con un ingeniero" variant="dotmatrix" />
          </Reveal>
        </section>

        <Divider label="fin de la transmisión" pattern="· " mode="text" variant="dotmatrix" />

        <Footer
          brand="SIGNAL"
          tagline="Detección de intrusiones en tiempo real."
          columns="Producto: Sensores, Precios, Estado; Recursos: Docs, API, Firmas; Legal: Privacidad, Términos, Seguridad"
          social="icon:github, icon:mastodon"
          copyright="© 2026 SIGNAL. Cada paquete cuenta."
          variant="dotmatrix"
        />
      </main>
    </div>
  );
}
