"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import HoverFX, { HOVERFX_EFFECTS, type HoverEffectKind } from "@/components/ui/HoverFX";
import Presence, { PRESENCE_EFFECTS, type PresenceEffect } from "@/components/ui/Presence";
import { VARIANTS } from "@/components/ui/variants";
import { catalog, getEntry } from "@/lib/catalog/catalog";
import { CATEGORIES, STYLES, defaultsOf, snippet, type CatalogEntry, type Category, type PropSpec, type StyleTag, type Values } from "@/lib/catalog/schema";
import { hasScenario, SCENARIOS } from "@/lib/catalog/scenarios";
import { styleGuide } from "@/lib/catalog/styleGuide";
import { getPreset, tokenPresets } from "@/lib/catalog/presets";
import { FONT_PRESETS, applyOverrides, toHex, tokensToStyle, type TokenOverrides } from "@/lib/ui/tokens";
import "./playground.css";

/** Un control por tipo de prop, generado a partir del esquema. */
function Field({ spec, value, onChange }: { spec: PropSpec; value: Values[string]; onChange: (v: string | number | boolean) => void }) {
  const id = `f-${spec.key}`;
  return (
    <div className="pg-field">
      <label htmlFor={id}>
        {spec.label}
        {spec.type === "number" && <output>{String(value)}</output>}
      </label>
      {spec.type === "text" &&
        (spec.multiline ? (
          <textarea id={id} rows={4} value={String(value)} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
        ) : (
          <input id={id} type="text" value={String(value)} onChange={(e) => onChange(e.target.value)} spellCheck={false} autoComplete="off" />
        ))}
      {spec.type === "number" && (
        <input id={id} type="range" min={spec.min} max={spec.max} step={spec.step ?? 1} value={Number(value)} onChange={(e) => onChange(parseFloat(e.target.value))} />
      )}
      {spec.type === "boolean" && (
        <button id={id} type="button" role="switch" aria-checked={Boolean(value)} className={`pg-switch ${value ? "is-on" : ""}`} onClick={() => onChange(!value)}>
          <span />
        </button>
      )}
      {spec.type === "select" && (
        <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {spec.options.map((o) => (
            <option key={o} value={o}>
              {spec.labels?.[o] ?? o}
            </option>
          ))}
        </select>
      )}
      {spec.hint && <small>{spec.hint}</small>}
    </div>
  );
}

const hasVariant = (e: CatalogEntry) => e.props.some((p) => p.key === "variant");

export default function Playground() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [sty, setSty] = useState<StyleTag | "all">("all");
  const [preset, setPreset] = useState("neutro");
  const [ov, setOv] = useState<TokenOverrides>({});
  const [showTokens, setShowTokens] = useState(false);
  const [showFx, setShowFx] = useState(false);
  const [animOn, setAnimOn] = useState(false);
  const [animEffect, setAnimEffect] = useState<PresenceEffect>("ascii-rain");
  const [animDuration, setAnimDuration] = useState(1.2);
  const [hoverOn, setHoverOn] = useState(false);
  const [hoverEffect, setHoverEffect] = useState<HoverEffectKind>("glow");
  const [hoverStrength, setHoverStrength] = useState(0.6);
  const [compare, setCompare] = useState(false);
  const [scenario, setScenario] = useState(false);
  const [sel, setSel] = useState(catalog[0].id);
  const [store, setStore] = useState<Record<string, Values>>({});
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState(false);

  // Componente abierto desde el hash de la URL (#ascii-card), también si cambia con la página abierta (enlaces, atrás/adelante)
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (h && getEntry(h)) setSel(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return catalog.filter(
      (e) =>
        (cat === "all" || e.category === cat) &&
        (sty === "all" || e.styles.includes(sty)) &&
        (!term || `${e.name} ${e.component} ${e.description} ${e.category}`.toLowerCase().includes(term)),
    );
  }, [q, cat, sty]);

  const countBy = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = catalog.filter((e) => (sty === "all" || e.styles.includes(sty)) && (!term || `${e.name} ${e.component} ${e.description}`.toLowerCase().includes(term)));
    return Object.fromEntries(CATEGORIES.map((c) => [c.id, base.filter((e) => e.category === c.id).length])) as Record<Category, number>;
  }, [q, sty]);

  const entry: CatalogEntry | undefined = filtered.find((e) => e.id === sel) ?? filtered[0];

  // Con un estilo filtrado, los componentes con variante se muestran en ese estilo (salvo que se elija otro)
  const values: Values = useMemo(() => {
    if (!entry) return {};
    const v = { ...defaultsOf(entry), ...store[entry.id] };
    if (sty !== "all" && hasVariant(entry) && store[entry.id]?.variant === undefined) {
      const spec = entry.props.find((p) => p.key === "variant");
      if (spec?.type === "select" && spec.options.includes(sty)) v.variant = sty;
    }
    return v;
  }, [entry, store, sty]);

  const base = getPreset(preset).tokens;
  const tokens = applyOverrides(base, ov);
  const stageStyle = tokensToStyle(tokens);

  const select = (id: string) => {
    setSel(id);
    setReplay(0);
    window.history.replaceState(null, "", `#${id}`);
    document.querySelector(".pg__main")?.scrollTo({ top: 0 });
  };
  const setValue = (key: string, v: string | number | boolean) => entry && setStore((s) => ({ ...s, [entry.id]: { ...s[entry.id], [key]: v } }));
  const reset = () => entry && setStore((s) => ({ ...s, [entry.id]: {} }));
  const applyStyle = (s: StyleTag | "all") => {
    setSty(s);
    if (s !== "all") {
      setPreset(styleGuide[s].preset);
      setOv({});
    }
  };
  const setToken = <K extends keyof TokenOverrides>(k: K, v: TokenOverrides[K]) => setOv((o) => ({ ...o, [k]: v }));

  const code = entry ? snippet(entry, values) : "";
  const tokenCode = `<div style={{\n  "--bg": "${tokens.bg}",\n  "--fg": "${tokens.fg}",\n  "--acc": "${tokens.acc}",\n  "--acc2": "${tokens.acc2}",\n  "--card": "${tokens.card}",\n  "--ln": "${tokens.ln}",\n  "--r": "${tokens.r}px",\n}}>\n  …\n</div>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* portapapeles no disponible */
    }
  };

  const total = catalog.length;

  // Los fondos ocupan todo el escenario: envolverlos en Presence/HoverFX (que se ajustan al
  // contenido salvo en modo `fill`) rompería su tamaño, así que el panel FX no se aplica a ellos.
  const canWrapFx = entry ? entry.category !== "fondos" : false;
  const wrapFx = (node: ReactNode) => {
    if (!canWrapFx) return node;
    let out = node;
    if (hoverOn) out = <HoverFX effect={hoverEffect} strength={hoverStrength} fill>{out}</HoverFX>;
    if (animOn) out = <Presence effect={animEffect} loop duration={animDuration} hold={1.4} fill>{out}</Presence>;
    return out;
  };

  return (
    <div className="pg">
      <header className="pg__top">
        <Link href="/" className="chip">← Galería</Link>
        <h1>Componentes</h1>
        <input className="pg__search" type="search" placeholder={`Buscar entre ${total} componentes…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
        <label className="pg__theme">
          Tema
          <select value={preset} onChange={(e) => { setPreset(e.target.value); setOv({}); }}>
            {tokenPresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="pg__color" title="Sobrescribe --acc">
          acc
          <input type="color" value={toHex(tokens.acc, "#7cc4ff")} onChange={(e) => setToken("acc", e.target.value)} />
        </label>
        <label className="pg__color" title="Sobrescribe --acc2">
          acc2
          <input type="color" value={toHex(tokens.acc2, "#c084fc")} onChange={(e) => setToken("acc2", e.target.value)} />
        </label>
        <button className={`pg-chip ${showTokens ? "is-on" : ""}`} onClick={() => setShowTokens((v) => !v)}>
          Tokens {showTokens ? "▴" : "▾"}
        </button>
        <button className={`pg-chip ${showFx ? "is-on" : ""} ${animOn || hoverOn ? "pg-chip--active" : ""}`} onClick={() => setShowFx((v) => !v)}>
          FX {showFx ? "▴" : "▾"}
        </button>
      </header>

      {showFx && (
        <section className="pg-fx" aria-label="Animaciones de entrada, salida y hover">
          <div className="pg-fx__group">
            <label className="pg-fx__switch">
              <button type="button" role="switch" aria-checked={animOn} className={`pg-switch ${animOn ? "is-on" : ""}`} onClick={() => setAnimOn((v) => !v)}>
                <span />
              </button>
              Entrada / salida
            </label>
            <select value={animEffect} onChange={(e) => setAnimEffect(e.target.value as PresenceEffect)} disabled={!animOn}>
              {PRESENCE_EFFECTS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
            <label className="pg-fx__range">
              Duración <output>{animDuration.toFixed(1)}s</output>
              <input type="range" min={0.4} max={3} step={0.1} value={animDuration} disabled={!animOn} onChange={(e) => setAnimDuration(parseFloat(e.target.value))} />
            </label>
          </div>
          <div className="pg-fx__group">
            <label className="pg-fx__switch">
              <button type="button" role="switch" aria-checked={hoverOn} className={`pg-switch ${hoverOn ? "is-on" : ""}`} onClick={() => setHoverOn((v) => !v)}>
                <span />
              </button>
              Hover
            </label>
            <select value={hoverEffect} onChange={(e) => setHoverEffect(e.target.value as HoverEffectKind)} disabled={!hoverOn}>
              {HOVERFX_EFFECTS.filter((e) => e.id !== "none").map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
            <label className="pg-fx__range">
              Fuerza <output>{hoverStrength.toFixed(2)}</output>
              <input type="range" min={0.1} max={1} step={0.05} value={hoverStrength} disabled={!hoverOn} onChange={(e) => setHoverStrength(parseFloat(e.target.value))} />
            </label>
          </div>
          <p className="pg-fx__hint">
            {canWrapFx
              ? "Se aplican por encima de este componente, sin tocar su código: es la forma recomendada de dar entrada/salida y hover a cualquier pieza del catálogo."
              : "Los fondos ocupan todo el escenario y no admiten este envoltorio (verás la escena sin cambios)."}
          </p>
        </section>
      )}

      {showTokens && (
        <section className="pg-tokens" aria-label="Tokens de diseño">
          {(
            [
              ["bg", "Fondo (--bg)", "#07080f"],
              ["fg", "Texto (--fg)", "#e8ecf4"],
              ["mut", "Secundario (--mut)", "#9aa3b5"],
              ["acc", "Acento (--acc)", "#7cc4ff"],
              ["acc2", "Acento 2 (--acc2)", "#c084fc"],
            ] as const
          ).map(([k, label, fb]) => (
            <label key={k}>
              <span>{label}</span>
              <input type="color" value={toHex(tokens[k], fb)} onChange={(e) => setToken(k, e.target.value)} />
            </label>
          ))}
          <label>
            <span>
              Radio (--r) <output>{tokens.r}px</output>
            </span>
            <input type="range" min={0} max={32} step={1} value={tokens.r} onChange={(e) => setToken("r", parseFloat(e.target.value))} />
          </label>
          <label>
            <span>Tipografía</span>
            <select value={FONT_PRESETS.find((f) => f.stack === tokens.font)?.id ?? "custom"} onChange={(e) => setToken("font", FONT_PRESETS.find((f) => f.id === e.target.value)?.stack)}>
              {!FONT_PRESETS.some((f) => f.stack === tokens.font) && <option value="custom">Del tema</option>}
              {FONT_PRESETS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <button className="chip pg-tokens__reset" onClick={() => setOv({})}>
            Restablecer tema
          </button>
        </section>
      )}

      <div className="pg__body">
        <aside className="pg__side">
          <h2>Categoría</h2>
          <div className="pg__chips">
            <button className={`pg-chip ${cat === "all" ? "is-on" : ""}`} onClick={() => setCat("all")}>
              Todas
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`pg-chip ${cat === c.id ? "is-on" : ""}`} onClick={() => setCat(c.id)} title={c.blurb}>
                {c.label}
                <small>{countBy[c.id]}</small>
              </button>
            ))}
          </div>
          <h2>Estilo</h2>
          <div className="pg__chips">
            <button className={`pg-chip ${sty === "all" ? "is-on" : ""}`} onClick={() => applyStyle("all")}>
              Todos
            </button>
            {STYLES.map((s) => (
              <button key={s.id} className={`pg-chip ${sty === s.id ? "is-on" : ""}`} onClick={() => applyStyle(s.id)}>
                {s.label}
                <small>{catalog.filter((e) => e.styles.includes(s.id)).length}</small>
              </button>
            ))}
          </div>

          {sty !== "all" && (
            <div className="pg-guide">
              <strong>Receta · {STYLES.find((s) => s.id === sty)?.label}</strong>
              <dl>
                <dt>Cuándo</dt>
                <dd>{styleGuide[sty].when}</dd>
                <dt>Superficie</dt>
                <dd>{styleGuide[sty].surface}</dd>
                <dt>Tipografía</dt>
                <dd>{styleGuide[sty].type}</dd>
                <dt>ASCII</dt>
                <dd>{styleGuide[sty].ascii}</dd>
                <dt>Evitar</dt>
                <dd>{styleGuide[sty].avoid}</dd>
              </dl>
              <small>Se aplicó el tema «{styleGuide[sty].preset}» y la variante «{sty}» a los componentes que la admiten.</small>
            </div>
          )}

          <h2>
            {filtered.length} componente{filtered.length === 1 ? "" : "s"}
          </h2>
          <ul className="pg__list">
            {filtered.map((e) => (
              <li key={e.id}>
                <button className={`pg-item ${entry?.id === e.id ? "is-on" : ""}`} onClick={() => select(e.id)}>
                  <span className="pg-item__name">{e.name}</span>
                  <span className="pg-item__tags">
                    <em>{CATEGORIES.find((c) => c.id === e.category)?.label}</em>
                    {e.styles.length === VARIANTS.length ? <i>7 estilos</i> : e.styles.map((s) => <i key={s}>{s}</i>)}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="pg__empty">Ningún componente coincide con los filtros.</li>}
          </ul>
        </aside>

        <main className="pg__main">
          {entry ? (
            <>
              <div className="pg__head">
                <div>
                  <h2>{entry.name}</h2>
                  <p>{entry.description}</p>
                  <code>
                    {entry.component} · {entry.path}
                  </code>
                </div>
                <div className="pg__actions">
                  {hasScenario(entry.category) && (
                    <button
                      className={`chip ${scenario ? "chip--on" : ""}`}
                      onClick={() => setScenario((v) => { const next = !v; if (next) setCompare(false); return next; })}
                    >
                      {scenario ? "Ver aislado" : "Ver en caso real"}
                    </button>
                  )}
                  {hasVariant(entry) && (
                    <button
                      className={`chip ${compare ? "chip--on" : ""}`}
                      onClick={() => setCompare((v) => { const next = !v; if (next) setScenario(false); return next; })}
                    >
                      {compare ? "Ver uno solo" : "Comparar los 7 estilos"}
                    </button>
                  )}
                  {entry.replayable && (
                    <button className="chip" onClick={() => setReplay((n) => n + 1)}>
                      ↻ Repetir animación
                    </button>
                  )}
                  <button className="chip" onClick={reset}>
                    Restablecer props
                  </button>
                </div>
              </div>

              {compare && hasVariant(entry) ? (
                <div className="pg__compare">
                  {VARIANTS.map((v) => (
                    <div key={v} className="pg__cell" style={stageStyle}>
                      <span className="pg__cellname">{v}</span>
                      <div className="pg__cellstage" style={{ minHeight: entry.stageHeight ?? 260 }}>
                        {wrapFx(entry.render({ ...values, variant: v }, { replay }))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : scenario && SCENARIOS[entry.category] ? (
                <div className="pg__stage ui-stage pg__stage--scenario" style={{ ...stageStyle, minHeight: 320 }} data-entry={entry.id}>
                  {wrapFx(SCENARIOS[entry.category]!({ entry, values, replay }))}
                </div>
              ) : (
                <div className="pg__stage ui-stage" style={{ ...stageStyle, minHeight: entry.stageHeight ?? 320 }} data-entry={entry.id}>
                  {wrapFx(entry.render(values, { replay }))}
                </div>
              )}

              <div className="pg__cols">
                <section className="pg__panel">
                  <h3>Props</h3>
                  <div className="pg__fields">
                    {entry.props
                      .filter((s) => !s.when || s.when(values))
                      .map((s) => (
                        <Field key={s.key} spec={s} value={values[s.key]} onChange={(v) => setValue(s.key, v)} />
                      ))}
                  </div>
                </section>
                <section className="pg__panel">
                  <div className="pg__panelhead">
                    <h3>Código</h3>
                    <button className="chip" onClick={copy}>
                      {copied ? "Copiado ✓" : "Copiar"}
                    </button>
                  </div>
                  <pre className="pg__code">{code}</pre>
                  <h3>Tokens del escenario</h3>
                  <pre className="pg__code">{tokenCode}</pre>
                  {entry.notes && (
                    <>
                      <h3>Notas</h3>
                      <ul className="pg__notes">
                        {entry.notes.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              </div>
            </>
          ) : (
            <p className="pg__empty">Sin resultados. Quita algún filtro.</p>
          )}
        </main>
      </div>
    </div>
  );
}
