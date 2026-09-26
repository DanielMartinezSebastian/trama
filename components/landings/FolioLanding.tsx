"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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
import "./folio.css";

/**
 * FOLIO: tercera landing de ejemplo construida enteramente con `components/ui/`. Donde CIPHERGRID
 * es neón oscuro y MYCEL es orgánico oscuro, FOLIO es la pieza que faltaba: un TEMA CLARO — papel,
 * tinta, tipografía — para comprobar que el sistema de legibilidad del kit (`--legibility-ts`, las
 * variantes con `--s-bg` real) no está afinado solo para fondos oscuros. Producto ficticio: una
 * herramienta editorial colaborativa (escritura + revisión + maquetación en la misma página).
 *
 * El fondo es deliberadamente el más tranquilo de las tres landings: casi todo es GridBackground
 * en patrones de papelería real (líneas de cuaderno, trama de puntos, cuadrícula, rayado diagonal
 * de corrección), con un único toque generativo (textmode.js "ripples" — tinta esparciéndose en
 * agua) para la sección de datos. Se evita a propósito la variante "neon" del kit (su `--s-bg` es
 * `rgba(0,0,0,.42)` fijo, pensado para fondos oscuros) y el modo "tube" de `NeonSign` (su color
 * base mezcla con blanco): aquí `NeonSign` usa `mode="pixel"`, que no depende de brillo sobre
 * oscuridad y lee como un sello de imprenta.
 */

const TOKENS: CSSProperties = {
  "--bg": "#f5f1e6",
  "--fg": "#241d14",
  "--mut": "#5a4e3d",
  "--acc": "#a3311f",
  "--acc2": "#1f4d6b",
  "--card": "rgba(255,255,255,0.55)",
  "--ln": "rgba(36,29,20,0.16)",
  "--r": "3px",
  fontFamily: 'var(--font-jetbrains-mono), ui-monospace, "Cascadia Code", Consolas, monospace',
} as CSSProperties;

export default function FolioLanding({ hud }: { hud: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const marks = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove("scrollable");
      window.scrollTo(0, 0);
    };
  }, []);

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

  // Patrones de papelería real en vez de escenas cargadas: es la landing más tranquila de las
  // tres a propósito, un tema claro perdona mucho menos el ruido visual que uno oscuro.
  const ACTS = useMemo<{ id: string; label: string; node: React.ReactNode }[]>(
    () => [
      { id: "cuaderno", label: "cuaderno", node: <GridBackground kind="lines" cellSize={34} opacity={0.5} fade /> },
      { id: "puntos", label: "puntos", node: <GridBackground kind="dots" cellSize={26} opacity={0.45} fade /> },
      { id: "tinta", label: "tinta", node: <TextmodeBackground sketch="ripples" fontSize={16} palette="tint" tintAmount={0.22} opacity={0.3} /> },
      { id: "corrección", label: "corrección", node: <GridBackground kind="diagonal" cellSize={30} opacity={0.4} fade /> },
      { id: "cuadrícula", label: "cuadrícula", node: <GridBackground kind="cross" cellSize={40} opacity={0.4} fade drift /> },
    ],
    [],
  );

  const requestManuscript = () => setModalOpen(true);
  const confirmManuscript = () => {
    setModalOpen(false);
    sonnerToast.success("Manuscrito creado", { description: "Ya puedes empezar a escribir — el historial arranca en la primera palabra.", toasterId: "fol-toast" });
  };

  return (
    <div ref={root} className={`fol ${hud ? "" : "fol--hidden"}`} style={TOKENS} data-theme="folio">
      {/* ---------- Fondo persistente ---------- */}
      <div className="fol__bg" aria-hidden>
        {ACTS[act].node}
      </div>
      <SceneFlash className="fol__flash" kind="sweep" duration={0.7} playKey={act} />
      <div className="fol__cursor-scope">
        <GlyphCursor mode="glyph" glyph="¶" tone="acc" cursorSize={16} lag={0.4} spin={false} glow={false} />
      </div>
      <Toast id="fol-toast" position="bottom-right" variant="solid" showTrigger={false} />

      {/* ---------- Cabecera ---------- */}
      <div className="fol__nav">
        <NavBar brand="FOLIO" links="Editorial, Precios, Documentación, Revista" cta="Empezar a escribir" variant="solid" />
      </div>

      <main className="fol__main">
        {/* ---------- 0. Hero (cuaderno) ---------- */}
        <div className="fol__act-mark" data-act={0} ref={mark(0)} />
        <section className="fol__section fol__section--tight">
          <Hero
            kicker="TIRADA EN VIVO · 3.204 MANUSCRITOS EN CURSO"
            title="FOLIO"
            subtitle="Un lugar para escribir, revisar y maquetar sin salir de la misma página — con historial completo de cada frase que cambia."
            primaryCta="Empezar a escribir"
            secondaryCta="Ver una maqueta"
            badges="3.204 manuscritos activos, 18M palabras revisadas, guardado cada 2s"
            align="center"
            backdrop="none"
            variant="solid"
          />
        </section>

        <div className="fol__boot">
          <Reveal trigger="inview" kind="blur">
            <TerminalTyper
              variant="terminal"
              chrome
              title="editor@folio:~#"
              lines={"$ folio draft --nuevo=capitulo-12\n> abriendo editor colaborativo...\n> sincronizando con 3 revisores...\n> guardado automático activo...\n> LISTO PARA ESCRIBIR\n$ _"}
            />
          </Reveal>
        </div>

        <div className="fol__marquee-strip">
          <Typewriter
            phrases={"cada cambio queda escrito, nunca se pierde\nrevisa, corrige, publica — sin salir de la página\n3.204 manuscritos y cero versiones perdidas"}
            prefix=""
            variant="terminal"
            fontSize={16}
            cursor="block"
          />
        </div>

        {/* ---------- 1. Producto (puntos) ---------- */}
        <div className="fol__act-mark" data-act={1} ref={mark(1)} />

        <section className="fol__section">
          <Reveal trigger="inview" kind="fade">
            <StatsSection
              kicker="En cifras"
              title="Se escribe más de lo que parece"
              stats={"3204|+|Manuscritos activos\n18|M|Palabras revisadas este mes\n99912||Guardados sin fallos (de cada 100.000)"}
              tone="acc"
            />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="rise">
            <FeatureGrid
              kicker="Arquitectura"
              title="Escrito para no perder ni una palabra"
              items={
                "icon:hourglass:sharp|Historial completo|Cada frase que cambia queda guardada — vuelve a cualquier versión sin miedo.\n" +
                "icon:message:sharp|Revisión en vivo|Comentarios y sugerencias al margen, como en papel, pero sin papel.\n" +
                "icon:file-text:sharp|Maquetación integrada|El mismo texto se convierte en PDF, ePub o web sin tocar otra herramienta.\n" +
                "icon:code|API abierta|Conecta tu propio flujo editorial: nada queda encerrado en Folio."
              }
              variant="glass"
            />
          </Reveal>
        </section>

        <section className="fol__section">
          <div className="fol__center">
            <BitmapText text="SECCIONES" tone="acc" align="center" glow={false} />
          </div>
          <Reveal trigger="inview" kind="stagger" className="fol__grid-3">
            <Spotlight variant="minimal" tone="acc" border={false}>
              <AsciiCard
                title="Corrector de estilo"
                text="Detecta repeticiones, muletillas y frases que se leen mal en voz alta."
                meta="v2.3 · activo"
                variant="solid"
                index={1} field="topo" charset="detailed"
                glyph="¶"
                fieldHover="ripple"
              />
            </Spotlight>
            <AsciiCard title="Historial de cambios" text="Cada versión queda a un clic — compara, restaura o combina sin miedo." meta="0 pérdidas · 4 años" variant="solid" index={2} field="grid" charset="detailed" glyph="§" fieldHover="glow" />
            <AsciiCard title="Exportación instantánea" text="De borrador a PDF maquetado en segundos, con la tipografía ya decidida." meta="12 formatos" variant="solid" index={3} field="halftone" charset="dots" glyph="»" fieldHover="repel" />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="fol__center">
              <SectionHeader kicker="Conoce el sistema" title="Tres formas de mirar el mismo manuscrito" subtitle="Resumen, flujo editorial y exportación, sin folleto de por medio." align="center" variant="minimal" rule="ascii" />
            </div>
            <div className="fol__dev-tabs">
              <Tabs
                items="Resumen, Flujo editorial, Exportación"
                content={
                  "Folio junta la escritura, la revisión y la maquetación en la misma página: nada se exporta a otra herramienta a medio camino.\n" +
                  "Cada manuscrito pasa por boceto, revisión por pares y edición final, con comentarios al margen y control de versiones en cada paso.\n" +
                  "El mismo documento se convierte en PDF, ePub o página web con un clic, sin perder la tipografía ni las notas al pie."
                }
                variant="outline"
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 2. Datos (tinta) ---------- */}
        <div className="fol__act-mark" data-act={2} ref={mark(2)} />

        <section className="fol__section">
          <Reveal trigger="inview" kind="rise">
            <div className="fol__center">
              <SectionHeader kicker="Para integradores" title="Conecta tu propio flujo en minutos" subtitle="Una CLI, un SDK y una API — elige tu forma de entrar." align="center" variant="minimal" />
            </div>
            <div className="fol__grid-2">
              <CodeBlock
                filename="instalación.sh"
                variant="terminal"
                code={"curl -sL https://folio.dev/install | sh\nfolio auth --key=$FOLIO_KEY\nfolio draft up --manuscrito=auto"}
              />
              <CodeBlock
                filename="cliente.ts"
                variant="terminal"
                code={'import { folio } from "@folio/sdk";\n\nconst doc = await folio.open({ manuscrito: "cap-12" });\nawait doc.save({ autor: "elena.reyes" });'}
              />
            </div>
            <div style={{ maxWidth: 640, margin: "24px auto 0" }}>
              <Table csv={"Formato, Documentos, Última exportación\nPDF, 1.204, hace 3 min\nePub, 862, hace 12 min\nWeb, 3.140, hace 40 s"} variant="terminal" />
            </div>
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="fol__center">
              <SectionHeader kicker="Hoja de ruta" title="De un boceto a un libro en la mesa" subtitle="Cinco fases, sin fecha de caducidad." align="center" variant="minimal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Timeline
                marker="glyph"
                glyph="¶"
                variant="outline"
                steps={
                  "Fase 0 · Boceto|La primera idea se escribe sin miedo a equivocarse.\n" +
                  "Fase 1 · Revisión por pares|Tres lectores dejan notas al margen, sin tocar el texto original.\n" +
                  "Fase 2 · Edición|Se cierra cada frase, se ajusta el ritmo, se corta lo que sobra.\n" +
                  "Fase 3 · Maquetación|El texto se convierte en páginas, con tipografía y numeración.\n" +
                  "Fase 4 · Publicado|El libro sale al mundo, con su historial completo guardado."
                }
              />
            </div>
          </Reveal>
        </section>

        <section className="fol__section">
          <Reveal trigger="inview" kind="rise">
            <div className="fol__center">
              <SectionHeader kicker="Panel de edición" title="Lo que ve un editor al abrir un manuscrito" subtitle="Métricas reales, sin dashboards de mentira." align="center" variant="minimal" />
            </div>
            <HoverFX effect="glow" tone="acc">
              <div className="fol__dash ui-surface ui-s ui-s--terminal" style={{ padding: 24 }}>
                <div className="fol__dash-col">
                  <AsciiChart data="820, 1140, 990, 1400, 1260, 1580, 1720, 1490" labels="L,M,X,J,V,S,D" kind="bars" height={8} fillChar="█" variant="terminal" />
                  <Progress label="Revisión completada" value={68} striped variant="terminal" />
                  <div className="fol__dash-row">
                    <Badge text="Guardado" intent="success" variant="solid" dot />
                    <Badge text="3 comentarios" intent="accent" variant="solid" />
                    <Badge text="En revisión" intent="warning" variant="solid" />
                  </div>
                </div>
                <div className="fol__dash-col">
                  <Alert intent="warning" title="Conflicto de edición en el capítulo 7" message="Dos revisores cambiaron el mismo párrafo — Folio guardó ambas versiones." variant="terminal" dismissible={false} />
                  <div className="fol__dash-row">
                    <Spinner kind="braille" label="Sincronizando cambios de 2 revisores…" variant="terminal" />
                  </div>
                  <div>
                    <span className="ui-hint" style={{ display: "block", marginBottom: 8 }}>
                      cargando historial del manuscrito…
                    </span>
                    <Skeleton kind="card" tone="acc" />
                  </div>
                  <StatCounter value={48230} format="compact" prefix="" suffix=" palabras" label="ESCRITAS ESTE MES" tone="acc2" align="left" />
                </div>
              </div>
            </HoverFX>
          </Reveal>
        </section>

        {/* ---------- 3. Acceso (corrección) ---------- */}
        <div className="fol__act-mark" data-act={3} ref={mark(3)} />

        <section className="fol__section">
          <Reveal trigger="inview" kind="fade">
            <PricingSection
              ctaHref="#acceso"
              kicker="Planes"
              title="Elige cómo quieres escribir"
              subtitle="Cambia o cancela cuando quieras, sin permanencia."
              plans={
                "Borrador|0 €|/ para siempre|no|1 manuscrito activo;Historial de 30 días;Comunidad de escritura\n" +
                "Redacción|19 €|/ mes|si|Manuscritos ilimitados;Historial completo;Revisión colaborativa\n" +
                "Editorial|89 €|/ mes|no|Todo lo de Redacción;Maquetación avanzada;Editor humano asignado"
              }
              variant="solid"
            />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="rise">
            <div className="fol__center">
              <NeonSign text="EMPEZAR A ESCRIBIR" mode="pixel" tone="acc" fontSize={30} flicker={false} />
              <p className="fol__lead">Cuéntanos qué estás escribiendo. Tu primer borrador estará listo en menos de un minuto.</p>
            </div>
            <form
              id="acceso"
              className="ui-surface ui-s ui-s--solid fol__access"
              onSubmit={(e) => {
                e.preventDefault();
                requestManuscript();
              }}
            >
              <Stepper steps="Manuscrito, Colaboradores, Confirmación" current={1} variant="solid" />
              <div className="fol__access-row fol__access-row--2">
                <TextField label="Título del manuscrito" placeholder="el-ultimo-verano" variant="solid" prefix="#" />
                <Select label="Género" options="Novela, Ensayo, Poesía, No ficción" placeholder="Elige un género" variant="solid" />
              </div>
              <div className="fol__access-row fol__access-row--2">
                <CheckboxGroup label="Herramientas activas" options="Corrector de estilo, Control de versiones, Comentarios al margen" defaultValue="Corrector de estilo, Control de versiones" variant="solid" />
                <RadioGroup label="Visibilidad" options="Privado, Solo revisores, Público" defaultValue="Solo revisores" variant="solid" />
              </div>
              <RangeSlider label="Revisores simultáneos" min={1} max={10} defaultValue={3} unit=" personas" variant="solid" />
              <Toggle label="Guardar automáticamente cada 2 segundos" defaultChecked variant="solid" />
              <div>
                <span className="ui-field__label" style={{ display: "block", marginBottom: 8 }}>
                  Código de editorial (opcional)
                </span>
                <OtpInput length={6} variant="solid" />
              </div>
              <div className="fol__access-actions">
                <Tooltip label="¿Por qué lo pedimos?" content="El código conecta tu manuscrito con la editorial que te invitó." side="top" variant="solid" />
                <MagneticButton type="submit" label="Crear manuscrito" variant="solid" emphasis="primary" glyph="icon:pencil" />
              </div>
            </form>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onConfirm={confirmManuscript}
              title="¿Confirmas la creación de tu manuscrito?"
              body="Se creará un espacio nuevo con guardado automático e historial desde la primera palabra."
              confirmLabel="Sí, crear"
              cancelLabel="Todavía no"
              variant="solid"
            />
          </Reveal>
        </section>

        <section className="fol__section">
          <Reveal trigger="inview" kind="fade">
            <div className="fol__docs">
              <Breadcrumbs items="Docs, SDK, Exportación" variant="outline" />
              <div className="fol__docs-list">
                {[
                  { t: "Configurar el corrector de estilo", d: "Cómo ajustar las reglas según tu propia voz.", f: "estilo.md" },
                  { t: "Resolver conflictos de edición", d: "Qué pasa cuando dos revisores cambian el mismo párrafo.", f: "conflictos.md" },
                  { t: "Exportar con tipografía propia", d: "Cómo subir tu propia fuente para la maquetación final.", f: "tipografia.md" },
                ].map((doc) => (
                  <div key={doc.t} className="fol__doc-card">
                    <Panel bar={doc.f} title={doc.t} body={doc.d} footer="" variant="outline" />
                    <div className="fol__doc-card__menu">
                      <Dropdown label="⋮" items="Editar, Archivar, Compartir" align="right" variant="outline" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="fol__docs-foot">
                <Pagination total={6} defaultPage={1} variant="outline" />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="fol__center">
              <SectionHeader kicker="Registro" title="Últimos cambios de Folio" subtitle="Todo lo que ha cambiado, sin notas de prensa." align="center" variant="minimal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ScrollArea
                variant="terminal"
                height={200}
                content={
                  "Registro de cambios\n" +
                  "v7.4.0 — Comparación de versiones lado a lado, no solo en línea.\n" +
                  "v7.3.0 — API abierta para flujos editoriales propios.\n" +
                  "v7.2.0 — Corrector de estilo entrenado con 40.000 manuscritos reales.\n" +
                  "v7.1.0 — Exportación a ePub con tipografía personalizada.\n" +
                  "v7.0.0 — Primera versión pública de Folio."
                }
              />
            </div>
          </Reveal>
        </section>

        {/* ---------- 4. Cierre (cuadrícula) ---------- */}
        <div className="fol__act-mark" data-act={4} ref={mark(4)} />

        <section className="fol__section">
          <Reveal trigger="inview" kind="rise">
            <TestimonialSection
              kicker="Lo que dicen"
              title="Manuscritos que ya salieron al mundo"
              items={
                "Terminé mi primera novela sin perder ni un borrador antiguo — todo seguía ahí cuando lo necesité.|Elena Reyes|Autora, «El ruido del agua»|5\n" +
                "Revisamos 40 capítulos entre tres editores sin un solo correo perdido en el camino.|Marc Vidal|Editor jefe, Cuadernos del Sur|5\n" +
                "Por fin una herramienta que entiende que escribir y maquetar son la misma tarea.|Noor Haddad|Autora independiente|4"
              }
              variant="solid"
            />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <TeamSection
              kicker="El equipo editorial"
              title="Quién construye Folio"
              people={"Águeda Ibarra|Fundadora y editora jefe\nSimón Roca|Director de producto\nLucía Ferrán|Jefa de tipografía"}
              variant="outline"
            />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <LogoCloud label="Con la confianza de" brands="CUADERNOS DEL SUR, EDITORIAL NÓMADA, REVISTA PLIEGO, IMPRENTA CENTRAL, LIBRERÍA DEL FARO, TALLER DE LETRAS" variant="minimal" />
          </Reveal>
        </section>

        <section className="fol__section">
          <Reveal trigger="inview" kind="rise">
            <ArticlesSection
              kicker="Revista"
              title="Últimas notas desde la redacción"
              articles={
                "Escritura|Cómo estructuramos el corrector de estilo sin sonar todos igual|Un vistazo a las reglas que se pueden desactivar y las que no.|9 sep 2026|6 min\n" +
                "Proceso editorial|Dentro de una revisión de 40 capítulos entre tres editores|Qué aprendimos sobre comentarios al margen y plazos reales.|1 sep 2026|8 min\n" +
                "Comunidad|Lo que aprendimos de 300 manuscritos publicados este año|Métricas, plazos y una maquetación que tuvimos que rehacer dos veces.|20 ago 2026|5 min"
              }
              variant="solid"
            />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <FAQSection
              kicker="Preguntas frecuentes"
              title="Antes de escribir tu primer capítulo"
              items={
                "¿Puedo exportar mi manuscrito a otra herramienta?|Sí, en Markdown, DOCX o el formato que necesites — tu texto es tuyo.\n" +
                "¿Cuántos revisores puedo invitar?|Depende del plan: desde 1 en Borrador hasta ilimitados en Editorial.\n" +
                "¿Qué pasa si dos personas editan el mismo párrafo?|Folio guarda ambas versiones y te deja elegir o combinar, nunca pierde ninguna.\n" +
                "¿Necesito instalar algo?|No, todo funciona en el navegador; el SDK es solo para quien quiera automatizar su propio flujo."
              }
            />
          </Reveal>
        </section>

        <section className="fol__section fol__section--tight">
          <Reveal trigger="inview" kind="fade">
            <div className="fol__newsletter">
              <ScrambleText text="RECIBE LA REVISTA" as="h3" tone="gradient" uppercase fontSize={22} />
              <ContactForm title="" subtitle="Una nota al mes sobre escritura y edición, sin spam." fields="email" layout="inline" submitLabel="Suscribirme" variant="outline" />
            </div>
          </Reveal>
        </section>

        <section className="fol__section">
          <Reveal trigger="inview" kind="rise">
            <CTASection
              title="Empieza el capítulo que llevas tiempo posponiendo."
              subtitle="3.204 manuscritos ya están en marcha. El siguiente puede ser el tuyo."
              primaryCta="Empezar a escribir"
              secondaryCta="Hablar con un editor"
              variant="solid"
            />
          </Reveal>
        </section>

        <Divider label="fin del pliego" pattern="//" mode="text" variant="minimal" />

        <Footer
          brand="FOLIO"
          tagline="Se escribe, se revisa, se publica — en la misma página."
          columns="Producto: Precios, Seguridad, Estado del servicio; Recursos: Documentación, SDK, Comunidad; Legal: Privacidad, Términos, Datos abiertos"
          social="icon:github, icon:bluesky, icon:mastodon"
          copyright="© 2026 FOLIO. Cada palabra queda guardada."
          variant="minimal"
        />
      </main>
    </div>
  );
}
