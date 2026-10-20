"use client";

import { useEffect, useRef, useState } from "react";
import CodeBlock from "@/components/ui/CodeBlock";
import GuideFrame from "@/components/ui/GuideFrame";
import { STYLE_GUIDES, guide as getGuide, type GuideHero, type GuideStory } from "@/lib/ui/guides";
import { HEROES, STORIES } from "./content";
import { GuideHeroView } from "./heroes";
import { GuideStoryView } from "./stories";

type Mode = "portada" | "relato" | "guias" | "relatos";

const MODES: { id: Mode; label: string }[] = [
  { id: "portada", label: "Portada" },
  { id: "relato", label: "Página completa" },
  { id: "guias", label: "Comparar guías" },
  { id: "relatos", label: "Comparar relatos" },
];

/** Miniatura: una página de 1440×900 en un iframe escalado al ancho de la tarjeta (mismo origen, sin interacción). */
function Thumb({ href, title, meta }: { href: string; title: string; meta: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1440));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <a className="gl-thumb" href={href} target="_blank" rel="noopener">
      <div ref={box} className="gl-thumb__frame" style={{ "--gl-scale": scale } as React.CSSProperties}>
        <iframe src={href} title={title} loading="lazy" tabIndex={-1} aria-hidden />
      </div>
      <span className="gl-thumb__meta">
        <strong>{title}</strong>
        <span>{meta} ↗</span>
      </span>
    </a>
  );
}

function Chips<T extends string>({ label, items, value, onChange, fit = [] }: { label: string; items: { id: T; label: string; code?: string }[]; value: T; onChange: (v: T) => void; fit?: T[] }) {
  return (
    <div className="gl-row" role="group" aria-label={label}>
      <span className="gl-row__label">{label}</span>
      {items.map((it) => (
        <button key={it.id} type="button" className={`gl-chip ${fit.includes(it.id) ? "is-fit" : ""}`} aria-pressed={value === it.id} onClick={() => onChange(it.id)} title={fit.includes(it.id) ? "Recomendada para esta guía" : undefined}>
          {it.code ? `${it.code} · ` : ""}
          {it.label}
        </button>
      ))}
    </div>
  );
}

function code(g: string, h: GuideHero, s: GuideStory, withStory: boolean) {
  return `import GuideFrame from "@/components/ui/GuideFrame";
import { GuideHeroView } from "@/components/site/guias/heroes";${withStory ? `\nimport { GuideStoryView } from "@/components/site/guias/stories";` : ""}

// Guía «${getGuide(g).label}» · ${HEROES.find((x) => x.id === h)?.code}${withStory ? ` · ${STORIES.find((x) => x.id === s)?.code}` : ""}
export default function Page() {
  return (
    <GuideFrame guide="${g}" as="main">
      <GuideHeroView id="${h}" />${withStory ? `\n      <GuideStoryView id="${s}" />` : ""}
    </GuideFrame>
  );
}

// Con tu propio contenido: <GuideHeroView id="${h}" content={{ ...CONTENT, title: "…" }} />
// O solo la guía, con tu marcado: <GuideFrame guide="${g}"><h1 className="ui-g-h1">…</h1><p className="ui-g-body">…</p></GuideFrame>`;
}

/**
 * Laboratorio de /guias: elige guía, composición y relato y mira el resultado en vivo, o compara la misma composición en las
 * ocho guías y el mismo relato en sus diez estructuras (miniaturas de las páginas /guias/ver y /guias/relato).
 */
export default function GuideLab() {
  const [g, setG] = useState(STYLE_GUIDES[0].id);
  const def = getGuide(g);
  const [h, setH] = useState<GuideHero>(def.heroes[0]);
  const [s, setS] = useState<GuideStory>(def.stories[0]);
  const [mode, setMode] = useState<Mode>("portada");

  const pickGuide = (id: string) => {
    setG(id);
    const next = getGuide(id);
    setH(next.heroes[0]);
    setS(next.stories[0]);
  };

  return (
    <div className="gl">
      <div className="gl-controls">
        <Chips label="Guía" items={STYLE_GUIDES.map((x) => ({ id: x.id, label: x.label }))} value={g} onChange={pickGuide} />
        <Chips label="Composición" items={HEROES} value={h} onChange={setH} fit={def.heroes} />
        <Chips label="Relato" items={STORIES} value={s} onChange={setS} fit={def.stories} />
        <Chips label="Vista" items={MODES} value={mode} onChange={setMode} />
      </div>

      <section className="gl-card" aria-label="Ficha de la guía">
        <div>
          <h2 style={{ margin: "0 0 6px" }}>{def.label}</h2>
          <p style={{ margin: "0 0 6px" }}>{def.note}</p>
          <p style={{ margin: 0, color: "var(--mut)" }}>
            Para: {def.sectors}. Sale de: {def.refs.join(", ")}.
          </p>
        </div>
        <dl>
          <dt>Titular</dt>
          <dd>
            {def.type.h1.replace(/clamp\((.+)\)/, "$1")} · peso {def.type.weight} · interlineado {def.type.lineHeight} · {def.type.tracking}em{def.type.upper ? " · mayúsculas" : ""}
          </dd>
          <dt>Espacio</dt>
          <dd>
            margen {def.space.margin} · {def.space.cols} col × {def.space.gutter}
          </dd>
          <dt>Movimiento</dt>
          <dd>
            {def.motion.fast}s / {def.motion.reveal}s / página {def.motion.page}s · stagger {def.motion.stagger}s
          </dd>
          <dt>Variante</dt>
          <dd>{def.variant}</dd>
        </dl>
      </section>

      {mode === "portada" && (
        <div className="gl-preview">
          <GuideFrame guide={g} key={`${g}-${h}`}>
            <GuideHeroView id={h} />
          </GuideFrame>
        </div>
      )}

      {mode === "relato" && (
        <div className="gl-preview">
          <GuideFrame guide={g} key={`${g}-${h}-${s}`}>
            <GuideHeroView id={h} />
            <GuideStoryView id={s} />
          </GuideFrame>
        </div>
      )}

      {mode === "guias" && (
        <div className="gl-compare">
          {STYLE_GUIDES.map((x) => (
            <Thumb key={x.id} href={`/guias/ver/${x.id}/${h}`} title={x.label} meta={HEROES.find((y) => y.id === h)?.code ?? ""} />
          ))}
        </div>
      )}

      {mode === "relatos" && (
        <div className="gl-compare">
          {STORIES.map((x) => (
            <Thumb key={x.id} href={`/guias/relato/${g}/${x.id}`} title={`${x.code} · ${x.label}`} meta={def.label} />
          ))}
        </div>
      )}

      <div className="gl-code">
        <CodeBlock code={code(g, h, s, mode === "relato" || mode === "relatos")} language="tsx" filename="app/page.tsx" variant="minimal" />
      </div>
    </div>
  );
}
