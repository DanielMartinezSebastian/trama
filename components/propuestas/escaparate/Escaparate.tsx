"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CodeBlock from "@/components/ui/CodeBlock";
import DeviceMockup from "@/components/ui/DeviceMockup";
import Hero from "@/components/ui/Hero";
import MenuList from "@/components/ui/MenuList";
import OpeningHours from "@/components/ui/OpeningHours";
import OptionPicker from "@/components/ui/OptionPicker";
import PricingCard from "@/components/ui/PricingCard";
import type { DemoItem } from "@/components/site/DemosIndex";
import "./escaparate.css";

/*
 * Propuesta «Escaparate» para la portada de Trama: la web como herramienta de decisión. El visitante elige negocio,
 * acabado y bloque, y la vista previa se monta con piezas reales del kit (Hero, OpeningHours, PricingCard, MenuList…).
 * Debajo, las demos ya hechas de ese sector y el código de lo que acaba de montar.
 */

type Sector = { id: string; label: string; items: DemoItem[] };
type Counts = { components: number; categories: number; styles: number; demos: number; sites: number };
type Modulo = "horario" | "cuotas" | "carta" | "lista";

const NEGOCIOS = [
  {
    id: "barberia", grupo: "belleza", label: "Barbería", nombre: "Navaja & Co.", kicker: "BARBERÍA · BARRIO DEL CARMEN",
    lema: "Cortes clásicos, barba a navaja y cita en un minuto.", sub: "Tres sillones, sin esperas y con el café puesto.", cta: "Reservar cita", cta2: "Ver servicios",
    acc: { claro: "#1d6647", oscuro: "#7fd3a8" }, img: "sector-barberia", modulo: "horario" as Modulo,
    lista: ["Corte clásico|18 €", "Corte y barba|26 €", "Afeitado a navaja|20 €", "Arreglo de barba|12 €"],
  },
  {
    id: "gimnasio", grupo: "deporte", label: "Gimnasio", nombre: "Bloque", kicker: "ENTRENAMIENTO EN GRUPO · 8 PERSONAS",
    lema: "Fuerza y técnica en grupos pequeños.", sub: "Un entrenador por cada ocho, programación por bloques y sin espejos.", cta: "Prueba una clase gratis", cta2: "Ver horarios",
    acc: { claro: "#b8460b", oscuro: "#ff9a5c" }, img: "sector-gimnasio", modulo: "cuotas" as Modulo,
    lista: [],
  },
  {
    id: "obrador", grupo: "comida", label: "Obrador", nombre: "Miga Rosa", kicker: "OBRADOR · DESDE LAS 7:30",
    lema: "Tartas de temporada y mantequilla de verdad.", sub: "Bollería cada mañana y tartas por encargo con 48 horas.", cta: "Encargar una tarta", cta2: "Ver la carta",
    acc: { claro: "#a83a68", oscuro: "#f39ac0" }, img: "sector-obrador", modulo: "carta" as Modulo,
    lista: [],
  },
  {
    id: "academia", grupo: "formacion", label: "Academia", nombre: "Entrelenguas", kicker: "IDIOMAS · GRUPOS DE SEIS",
    lema: "Inglés y alemán del A1 al C1, sin libro de texto.", sub: "Prueba de nivel gratis y matrícula abierta todo el año.", cta: "Hacer la prueba de nivel", cta2: "Ver cursos",
    acc: { claro: "#2a52b8", oscuro: "#9db8ff" }, img: "sector-academia", modulo: "cuotas" as Modulo,
    lista: [],
  },
  {
    id: "ceramica", grupo: "tienda", label: "Tienda", nombre: "Terrón", kicker: "CERÁMICA DE USO DIARIO",
    lema: "Cuencos y jarras torneados a mano.", sub: "Series cortas, esmaltes de alta temperatura y envío en 48 horas.", cta: "Ver la tienda", cta2: "Visitar el taller",
    acc: { claro: "#934823", oscuro: "#f0a77c" }, img: "sector-ceramica", modulo: "lista" as Modulo,
    lista: ["Cuenco Ola|24 €", "Jarra Arcilla 1 l|38 €", "Taza Brasa|16 €", "Fuente Tierra|52 €"],
  },
  {
    id: "arquitectura", grupo: "arquitectura", label: "Arquitectura", nombre: "Cota Cero", kicker: "ESTUDIO DE ARQUITECTURA",
    lema: "Vivienda y equipamiento con maqueta desde el primer día.", sub: "Proyecto, licencia y dirección de obra en Valencia y alrededores.", cta: "Ver proyectos", cta2: "Pedir presupuesto",
    acc: { claro: "#3d3d3a", oscuro: "#d8d4c8" }, img: "sector-arquitectura", modulo: "lista" as Modulo,
    lista: ["Casa Patio · Godella|2025", "Escuela Infantil Alba|2024", "Viviendas Turia 12|2023", "Biblioteca de barrio|2022"],
  },
];

const ACABADOS = [
  { id: "editorial", label: "Editorial", variant: "editorial" as const, oscuro: false, font: "var(--font-fraunces), Georgia, serif", bg: "#f6f1e8", fg: "#1b1916", mut: "#5d564c", card: "#efe7da", ln: "#d6cbb8", r: "0px" },
  { id: "contundente", label: "Contundente", variant: "solid" as const, oscuro: true, font: "var(--font-archivo), system-ui, sans-serif", bg: "#121211", fg: "#f4f3ee", mut: "#a9a69c", card: "#1d1d1b", ln: "#34332f", r: "4px" },
  { id: "suave", label: "Suave", variant: "minimal" as const, oscuro: false, font: "var(--font-onest), system-ui, sans-serif", bg: "#eef0ec", fg: "#1c211d", mut: "#535b54", card: "#ffffff", ln: "#d3d8d1", r: "18px" },
];

const BLOQUES = [
  { value: "principal", label: "Su bloque" },
  { value: "horario", label: "Horario" },
  { value: "ninguno", label: "Solo portada" },
];

const CARTA = `#Bollería|Cada mañana desde las 7:30
Cruasán de mantequilla|Masa madre y 72 horas de reposo|2,20|gluten,leche,huevo|
Caracola de canela|Con glaseado de naranja|2,60|gluten,leche,huevo|
#Tartas por encargo|Con 48 horas
Tarta de queso|Horneada, sin base|28,00|leche,huevo|para 8
Tarta de frutas de temporada|Crema pastelera y fruta del día|32,00|gluten,leche,huevo|para 8`;

const HORARIO = "L-V|09:30-14:00 16:30-20:30\nS|09:00-14:00\nD|cerrado";

export default function Escaparate({ sectores, counts }: { sectores: Sector[]; counts: Counts }) {
  const [negocioId, setNegocio] = useState(NEGOCIOS[0].id);
  const [acabadoId, setAcabado] = useState(ACABADOS[0].id);
  const [bloque, setBloque] = useState("principal");
  const [sectorLista, setSectorLista] = useState<string | null>(null);

  const negocio = NEGOCIOS.find((n) => n.id === negocioId)!;
  const acabado = ACABADOS.find((a) => a.id === acabadoId)!;
  const acc = acabado.oscuro ? negocio.acc.oscuro : negocio.acc.claro;
  const modulo: Modulo | null = bloque === "ninguno" ? null : bloque === "horario" ? "horario" : negocio.modulo;
  const grupo = sectorLista ?? negocio.grupo;
  const sector = sectores.find((s) => s.id === grupo);

  const tokens = {
    "--bg": acabado.bg, "--fg": acabado.fg, "--mut": acabado.mut, "--acc": acc, "--acc2": acc,
    "--card": acabado.card, "--ln": acabado.ln, "--r": acabado.r, fontFamily: acabado.font,
  } as CSSProperties;

  const codigo = useMemo(() => {
    const t = `{ "--bg": "${acabado.bg}", "--fg": "${acabado.fg}", "--acc": "${acc}", "--r": "${acabado.r}" }`;
    const pieza =
      modulo === "horario" ? `\n  <OpeningHours hours={HORARIO} variant="${acabado.variant}" />`
      : modulo === "cuotas" ? `\n  <PricingCard plan="Mensual" price="59 €" variant="${acabado.variant}" />`
      : modulo === "carta" ? `\n  <MenuList menu={CARTA} variant="${acabado.variant}" />`
      : modulo === "lista" ? `\n  {/* lista propia con Badge */}`
      : "";
    return `<div style={${t}}>
  <Hero
    kicker="${negocio.kicker}"
    title="${negocio.lema}"
    primaryCta="${negocio.cta}"
    variant="${acabado.variant}"
  />${pieza}
</div>`;
  }, [acabado, acc, modulo, negocio]);

  return (
    <div className="esc" data-scrollable>
      <header className="esc-top">
        <a className="esc-brand" href="/">trama</a>
        <nav aria-label="Secciones">
          <a href="/componentes">Componentes</a>
          <a href="/demos">Demos</a>
          <a href="/guias">Guías</a>
          <a href="/docs">Docs</a>
        </nav>
        <code className="esc-install">npm i trama-ui</code>
      </header>

      <main>
        <section className="esc-hero" aria-labelledby="esc-titulo">
          <div className="esc-panel">
            <p className="esc-kicker">Librería de componentes para Next.js</p>
            <h1 id="esc-titulo">Mira tu negocio montado con Trama antes de escribir una línea.</h1>
            <p className="esc-lead">Elige qué negocio tienes y un acabado. La vista previa se monta con {counts.components} piezas reales del kit, las mismas que instalarás.</p>

            <fieldset className="esc-step">
              <legend><span>1</span> ¿Qué negocio tienes?</legend>
              <div className="esc-negocios">
                {NEGOCIOS.map((n) => (
                  <button key={n.id} type="button" aria-pressed={n.id === negocioId} className="esc-negocio" onClick={() => { setNegocio(n.id); setSectorLista(null); }}>
                    <img src={`/propuestas/escaparate/${n.img}.webp`} alt="" />
                    <span>{n.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="esc-step">
              <p className="esc-legend"><span>2</span> ¿Con qué acabado?</p>
              <OptionPicker label="Acabado" hideLabel options={ACABADOS.map((a) => ({ value: a.id, label: a.label }))} value={acabadoId} onChange={setAcabado} />
            </div>

            <div className="esc-step">
              <p className="esc-legend"><span>3</span> ¿Qué enseñas debajo?</p>
              <OptionPicker label="Bloque" hideLabel options={BLOQUES} value={bloque} onChange={setBloque} />
            </div>
          </div>

          <div className="esc-stage">
            <DeviceMockup device="browser" urlLabel={`${negocio.nombre.toLowerCase().replace(/[^a-z]+/g, "")}.es`} motion="none" shadow={false} glare={false} finish="silver" viewportWidth={1180} interactive>
              <div className={`esc-site ${acabado.oscuro ? "is-dark" : ""}`} style={tokens}>
                <div className="esc-site__nav">
                  <strong>{negocio.nombre}</strong>
                  <span>Servicios · Equipo · Contacto</span>
                </div>
                <div className="esc-site__hero">
                  <Hero kicker={negocio.kicker} title={negocio.lema} subtitle={negocio.sub} primaryCta={negocio.cta} secondaryCta={negocio.cta2} badges="" align="left" backdrop="none" variant={acabado.variant} />
                  <img src={`/propuestas/escaparate/${negocio.img}.webp`} alt="" />
                </div>
                {modulo && (
                  <div className="esc-site__mod">
                    {modulo === "horario" && <OpeningHours hours={HORARIO} exceptions="" title="Horario" variant={acabado.variant} />}
                    {modulo === "cuotas" && (
                      <div className="esc-site__plans">
                        <PricingCard plan="Bono 8" description="Dos sesiones por semana" price={negocio.id === "academia" ? "95 €" : "59 €"} period="/ mes" features={"Grupos reducidos\nSeguimiento mensual\n-Sesiones individuales"} cta="Elegir" highlighted={false} badge="" variant={acabado.variant} />
                        <PricingCard plan="Ilimitado" description="Ven cuando quieras" price={negocio.id === "academia" ? "140 €" : "79 €"} period="/ mes" features={"Grupos reducidos\nSeguimiento mensual\nUna sesión individual"} cta="Elegir" highlighted badge="El más elegido" variant={acabado.variant} />
                      </div>
                    )}
                    {modulo === "carta" && <MenuList menu={CARTA} filter={false} variant={acabado.variant} />}
                    {modulo === "lista" && (
                      <ul className="esc-site__list">
                        {negocio.lista.map((l, i) => {
                          const [a, b] = l.split("|");
                          return (
                            <li key={a}>
                              <span>{a}</span>
                              {i === 0 && <Badge text="Nuevo" intent="accent" variant={acabado.variant} />}
                              <em>{b}</em>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </DeviceMockup>
            <p className="esc-note">Negocio ficticio; la foto es una visualización generada para esta propuesta.</p>
          </div>
        </section>

        <section className="esc-ready" aria-labelledby="esc-ready-t">
          <header>
            <h2 id="esc-ready-t">Ya hecho para tu sector</h2>
            <p>Webs completas, landings y réplicas de webs premiadas, listas para abrir y copiar su estructura.</p>
          </header>
          <div className="esc-sectores" role="group" aria-label="Sector">
            {sectores.map((s) => (
              <button key={s.id} type="button" aria-pressed={s.id === grupo} onClick={() => setSectorLista(s.id)}>
                {s.label} <small>{s.items.length}</small>
              </button>
            ))}
          </div>
          <ol className="esc-cards">
            {sector?.items.slice(0, 9).map((d) => (
              <li key={d.href}>
                <a href={d.href} style={{ ["--a" as string]: d.accent }}>
                  <span className="esc-card__meta">{d.meta}</span>
                  <strong>{d.title}</strong>
                  <span>{d.blurb}</span>
                </a>
              </li>
            ))}
          </ol>
          {sector && sector.items.length > 9 && <a className="esc-more" href={`/demos#${sector.id}`}>Ver las {sector.items.length} de {sector.label.toLowerCase()} →</a>}
        </section>

        <section className="esc-code" aria-labelledby="esc-code-t">
          <div>
            <h2 id="esc-code-t">Esto es todo el código.</h2>
            <p>Lo que acabas de montar arriba son unas pocas líneas: un tema en ocho variables CSS, la prop <code>variant</code> para el acabado y tus textos. Cambia de negocio o de acabado y el código cambia contigo.</p>
            <dl className="esc-counts">
              <div><dt>piezas</dt><dd>{counts.components}</dd></div>
              <div><dt>acabados</dt><dd>{counts.styles}</dd></div>
              <div><dt>demos</dt><dd>{counts.demos}</dd></div>
              <div><dt>webs completas</dt><dd>{counts.sites}</dd></div>
            </dl>
            <div className="esc-ctas">
              <Button label="Empezar" href="/docs/empezar" variant="solid" intent="neutral" />
              <Button label="Ver todas las piezas" href="/componentes" variant="solid" intent="neutral" emphasis="outline" />
            </div>
          </div>
          <CodeBlock code={codigo} language="tsx" filename="app/page.tsx" showLineNumbers={false} variant="minimal" />
        </section>
      </main>

      <footer className="esc-foot">
        <span>trama · componentes, guías y recetas para webs con carácter</span>
        <a href="/docs/agentes">Para agentes</a>
      </footer>
    </div>
  );
}
