"use client";

import GuideFrame from "@/components/ui/GuideFrame";
import { STYLE_GUIDES } from "@/lib/ui/guides";
import type { CatalogEntry } from "../schema";

/** Guías de estilo sacadas de las webs premiadas (docs/16-guias-de-estilo-plan.md). La herramienta completa está en /guias. */
export const guias: CatalogEntry[] = [
  {
    id: "guide-frame",
    component: "GuideFrame",
    path: "@/components/ui/GuideFrame",
    name: "Guía de estilo (sistema completo de una web premiada)",
    category: "secciones",
    styles: ["editorial", "minimal", "outline", "retro"],
    description:
      "Aplica una de las quince guías de estilo (las ocho de las webs premiadas —lujo tranquilo, monocromo de agencia, técnico de producto, producto nocturno, acento eléctrico, rótulo cinético, editorial cálido, lúdico— y las siete de los estudios por sector —salón editorial claro, barbería de carácter, club de alto contraste, estudio boutique, academia de autor, escuela amarilla, producto de marca—) a un contenedor: tema, par tipográfico, escala en dos escalones (marca y titular), margen y rejilla, superficies y movimiento, con los valores medidos en las webs premiadas. Dentro, las clases ui-g-* y cualquier componente del kit siguen la guía. Compara guías, portadas y relatos en /guias.",
    stageHeight: 460,
    notes: [
      "Clases: ui-g-brand, ui-g-h1, ui-g-h2 (titulares), ui-g-body, ui-g-label, ui-g-mono, ui-g-btn (+ --ghost), ui-g-grid, ui-g-wrap, ui-g-section, ui-g-header, ui-g-card, ui-g-line y ui-g-rise (entrada escalonada; cada hijo lleva --i).",
      "Variables: --g-fs-*, --g-margin, --g-gutter, --g-cols, --g-section, --g-dur-*, --g-ease, --g-ease-reveal, --g-stagger (guideToStyle de lib/ui/guides).",
      "Switzer y General Sans (guía técnica) vienen de Fontshare: carga GUIDE_FONTSHARE_CSS o caen a Inter y Onest.",
    ],
    props: [
      { key: "guide", label: "Guía", type: "select", default: "lujo", options: STYLE_GUIDES.map((g) => g.id), labels: Object.fromEntries(STYLE_GUIDES.map((g) => [g.id, g.label])) },
      { key: "title", label: "Titular", type: "text", default: "Luz que llega lejos" },
      { key: "lead", label: "Entradilla", type: "text", default: "Diseñamos lámparas y espacios que aprovechan la luz del día." },
    ],
    render: (p, { replay }) => (
      <GuideFrame guide={p.guide as string} key={`${p.guide}-${replay}`} style={{ width: "100%", minHeight: 440 }}>
        <header className="ui-g-header ui-g-line" style={{ borderTop: 0, borderBottom: "1px solid var(--ln)" }}>
          <strong style={{ fontFamily: "var(--g-font-display)" }}>Albor</strong>
          <span className="ui-g-label ui-g-muted">Colección · Estudio · Contacto</span>
        </header>
        <div className="ui-g-wrap ui-g-rise" style={{ display: "grid", gap: 18, paddingBlock: 32 }}>
          <p className="ui-g-label ui-g-muted" style={{ "--i": 0 } as React.CSSProperties}>
            Luz natural · desde 2014
          </p>
          <h2 className="ui-g-h1" style={{ "--i": 1, fontSize: "min(var(--g-fs-h1), 4.5rem)" } as React.CSSProperties}>
            {p.title as string}
          </h2>
          {p.lead ? (
            <p className="ui-g-body ui-g-muted" style={{ "--i": 2 } as React.CSSProperties}>
              {p.lead as string}
            </p>
          ) : null}
          <div style={{ "--i": 3, display: "flex", gap: 10, flexWrap: "wrap" } as React.CSSProperties}>
            <a href="#" className="ui-g-btn">Ver colección</a>
            <a href="#" className="ui-g-btn ui-g-btn--ghost">Hablar con el estudio</a>
          </div>
          <div className="ui-g-grid" style={{ "--i": 4, marginTop: 12 } as React.CSSProperties}>
            {["Orientación", "Materiales", "Mantenimiento"].map((t, n) => (
              <div key={t} className="ui-g-line" style={{ gridColumn: "span 4", paddingTop: 10 }}>
                <p className="ui-g-mono ui-g-muted">{String(n + 1).padStart(2, "0")}</p>
                <p style={{ margin: "4px 0 0", fontFamily: "var(--g-font-display)", fontWeight: "var(--g-fw-display)" as never }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </GuideFrame>
    ),
  },
];
