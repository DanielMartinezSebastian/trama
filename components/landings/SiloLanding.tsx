"use client";

import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import type { Group } from "three";
import { toast as sonnerToast } from "sonner";
import AudioPlayer from "@/components/ui/AudioPlayer";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ui/ContactForm";
import Footer from "@/components/ui/Footer";
import Marquee from "@/components/ui/Marquee";
import NavBar from "@/components/ui/NavBar";
import RetroCanvas from "@/components/ui/RetroCanvas";
import RetroModel from "@/components/ui/RetroModel";
import RetroShapes, { type RetroShapesProps } from "@/components/ui/RetroShapes";
import Reveal from "@/components/ui/Reveal";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Table from "@/components/ui/Table";
import Toast from "@/components/ui/Toast";
import { tokensToStyle } from "@/lib/ui/tokens";
import "./silo.css";

/**
 * SILO — landing de un productor de hard techno con minimalismo extremo: negro, blanco y un solo gris; sin superficies ni
 * bordes; tipografía enorme y etiquetas monoespaciadas diminutas; mucho vacío. El único ornamento es el fondo: un
 * `RetroCanvas` fijo (ASCII de puntos invertido con el color de la escena, scanlines de 1 px en barrido y un glitch leve)
 * que cambia de figura en cada sección. Un solo lienzo para toda la página (guía §22).
 */

const TOKENS = tokensToStyle({
  bg: "#000000",
  fg: "#f2f2f2",
  mut: "#7a7a7a",
  acc: "#ffffff",
  acc2: "#7a7a7a",
  card: "transparent",
  ln: "rgba(255,255,255,0.14)",
  r: 0,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
});

// cada sección, una figura; la música gira con una turbina (modelo .obj de public/models, ver RetroModel)
type Act = { shape: NonNullable<RetroShapesProps["shape"]>; model?: string; label: string };
const ACTS: Act[] = [
  { shape: "tunnel", label: "01 — SILO" },
  { shape: "rings", model: "/models/turbina.obj", label: "02 — MÚSICA" },
  { shape: "terrain", label: "03 — FECHAS" },
  { shape: "cage", label: "04 — BOOKING" },
];

const RELEASES = [
  { title: "ACERO", kind: "EP · 4 pistas", label: "Concreto Audio", year: "2026", src: "synth:hardtechno:156:4", length: "3:40" },
  { title: "SIN TREGUA", kind: "Single", label: "RÖHR", year: "2025", src: "synth:hardtechno:162:5", length: "4:05" },
  { title: "BLOQUE 7", kind: "EP · 3 pistas", label: "Concreto Audio", year: "2024", src: "synth:hardtechno:148:14", length: "3:52" },
];
// música sintetizada en el navegador (lib/ui/audio.ts): la demo suena sin archivos
const TRACKS = RELEASES.map((r) => `${r.title}|SILO · ${r.label}|${r.src}|${r.length}`).join("\n");

const DATES = "Fecha, Ciudad, Sala\n03.10, Madrid, Nave 12\n11.10, Berlín, Bunker Süd\n18.10, Lisboa, Hangar 9\n25.10, Rotterdam, Graansilo\n08.11, Bruselas, Dépôt\n22.11, Barcelona, Sala Vapor";

export default function SiloLanding({ hud }: { hud: boolean }) {
  // la sección activa vive en SiloStage: cambiarla solo repinta el fondo, no la página entera (guía §22.1)
  const stage = useRef<((i: number) => void) | null>(null);
  const marks = useRef<Array<HTMLElement | null>>([]);
  // disco elegido en la lista: `playKey` sube en cada clic para que el reproductor lo cargue y lo haga sonar
  const [track, setTrack] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const listen = (i: number) => {
    setTrack(i);
    setPlayKey((k) => k + 1);
  };

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
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.act);
          if (!Number.isNaN(i)) stage.current?.(i);
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    marks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const mark = (i: number) => (el: HTMLElement | null) => {
    marks.current[i] = el;
  };

  const go = (item: { href?: string }) => {
    if (item.href?.startsWith("#")) document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`slo ${hud ? "" : "slo--hidden"}`} style={TOKENS} data-theme="silo">
      <SiloStage api={stage} />
      <ScrollProgress placement="top" size="sm" variant="minimal" tone="fg" smooth label="Progreso de la página" />
      <Toast id="slo-toast" position="bottom-center" variant="minimal" intentStyle="mono" icons="none" showTrigger={false} />

      <header className="slo__nav">
        <NavBar brand="SILO" links="Música=#musica, Fechas=#fechas, Booking=#booking" cta="" layout="right" shape="transparent" size="sm" variant="minimal" collapseAt={620} mobileMenu="sheet" onNavigate={go} defaultActive={-1} />
      </header>

      <main className="slo__main">
        {/* ---------- 01 · portada ---------- */}
        <section className="slo__hero" data-act={0} ref={mark(0)}>
          <p className="slo__label">Hard techno · Madrid</p>
          <h1 className="slo__name">SILO</h1>
          <div className="slo__hero-foot">
            <p className="slo__label">156 BPM</p>
            <p className="slo__label">
              Próxima fecha — <span>03.10 · Madrid · Nave 12</span>
            </p>
          </div>
        </section>

        <div className="slo__strip">
          <Marquee text="156 BPM · 156 BPM · 156 BPM · 156 BPM" variant="minimal" tone="mut" rows={1} fontSize={12} duration={60} separator="          " />
        </div>

        {/* ---------- 02 · música ---------- */}
        <section id="musica" className="slo__section" data-act={1} ref={mark(1)}>
          <p className="slo__label">Música</p>
          <ol className="slo__releases">
            {RELEASES.map((r, i) => (
              <li key={r.title}>
                <Reveal trigger="inview" kind="fade">
                  <div className={`slo__release ${i === track ? "is-current" : ""}`}>
                    <span className="slo__n">{String(i + 1).padStart(2, "0")}</span>
                    <h2>{r.title}</h2>
                    <span className="slo__meta">
                      {r.kind} · {r.label} · {r.year}
                    </span>
                    <Button label="Escuchar" variant="minimal" emphasis="link" size="sm" onClick={() => listen(i)} />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="slo__player">
            <AudioPlayer tracks={TRACKS} layout="minimal" visualizer="dots" variant="minimal" repeat="all" track={track} playKey={playKey} onTrackChange={setTrack} dock="bottom" dockOffset={hud ? 64 : 0} dockClassName="slo-dock" dockDraggable />
          </div>
        </section>

        {/* ---------- 03 · fechas ---------- */}
        <section id="fechas" className="slo__section" data-act={2} ref={mark(2)}>
          <p className="slo__label">Fechas · Otoño 2026</p>
          <Reveal trigger="inview" kind="fade">
            <Table csv={DATES} striped={false} width="full" variant="minimal" className="slo__dates" />
          </Reveal>
        </section>

        {/* ---------- 04 · booking ---------- */}
        <section id="booking" className="slo__section slo__section--last" data-act={3} ref={mark(3)}>
          <p className="slo__label">Booking</p>
          <p className="slo__statement">Salas, festivales, sin concesiones.</p>
          <div className="slo__form">
            <ContactForm title="" subtitle="" fields="name,email,message" submitLabel="Enviar" successMessage="Recibido. Respondemos en 48 horas." variant="minimal" onSubmit={() => sonnerToast("Mensaje enviado", { description: "Respuesta en 48 horas.", toasterId: "slo-toast" })} />
          </div>
        </section>
      </main>

      <div className="slo__footer">
        <Footer brand="SILO" tagline="" columns="" social="icon:instagram, icon:youtube" copyright="© 2026 SILO · Artista ficticio para una demo de Trama" variant="minimal" />
      </div>
    </div>
  );
}

/** Fondo, corte y etiqueta de sección: el único trozo de la página que cambia con la sección activa. */
function SiloStage({ api }: { api: { current: ((i: number) => void) | null } }) {
  const [act, setAct] = useState(0);
  // cuántas veces ha cambiado de sección: el corte a negro solo aparece en los cambios, no al cargar
  const [cuts, setCuts] = useState(0);
  const lastAct = useRef(0);
  useEffect(() => {
    api.current = setAct;
    return () => {
      api.current = null;
    };
  }, [api]);
  useEffect(() => {
    if (act !== lastAct.current) setCuts((n) => n + 1);
    lastAct.current = act;
  }, [act]);

  return (
    <>
      {/* ---------- fondo: un solo lienzo, una figura por sección ---------- */}
      <div className="slo__bg" aria-hidden>
        <RetroCanvas tint="scene" cellSize={3} cellAspect={1} dither={0.65} invert scanlines={0.6} scanlineSize={1} scanlineRoll={0.65} vignette={0} flicker={0} glitch={0.05} cameraZ={9} pointerFx="parallax" pointerStrength={0.7} interaction="window">
          <SiloScenes act={act} />
        </RetroCanvas>
        {/* corte al cambiar de sección: una capa negra que se desvanece a saltos; el lienzo (y su contexto WebGL) no se remonta */}
        {cuts > 0 && <div key={cuts} className="slo__bg-cut" />}
      </div>
      <div className="slo__tag" aria-hidden>
        {ACTS[act].label}
      </div>
    </>
  );
}

/**
 * Las cuatro figuras montadas desde el principio y solo la activa visible (lo invisible no se dibuja). Así el modelo se descarga
 * al cargar y los shaders se compilan una vez al montar, figura a figura; si no, la GPU compila en mitad del scroll y el fondo
 * da un tirón justo al cambiar de sección.
 */
function SiloScenes({ act }: { act: number }) {
  const groups = useRef<Array<Group | null>>([]);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const g = groups.current;
    const shown = g.map((x) => x?.visible ?? false);
    // una figura cada vez: cada una trae sus luces y el número de luces forma parte del shader
    g.forEach((_, i) => {
      g.forEach((x, j) => x && (x.visible = i === j));
      gl.compile(scene, camera);
    });
    g.forEach((x, i) => x && (x.visible = shown[i]));
  }, [gl, scene, camera]);

  return ACTS.map((a, i) => (
    <group
      key={a.label}
      visible={i === act}
      ref={(el) => {
        groups.current[i] = el;
      }}
    >
      {a.model ? <RetroModel src={a.model} extent={5.2} spin={14} spinAxis="z" rotation="-24,28,0" /> : <RetroShapes shape={a.shape} speed={0.7} />}
    </group>
  ));
}
