"use client";

import { useId, useMemo, useState } from "react";
import { money } from "@/lib/commerce/money";
import { splitList } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

/** Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011, anexo II), con su abreviatura visible. */
export const ALLERGENS = [
  { id: "gluten", label: "Gluten", short: "Gl" },
  { id: "crustaceos", label: "Crustáceos", short: "Cr" },
  { id: "huevo", label: "Huevo", short: "Hu" },
  { id: "pescado", label: "Pescado", short: "Pe" },
  { id: "cacahuete", label: "Cacahuete", short: "Ca" },
  { id: "soja", label: "Soja", short: "So" },
  { id: "leche", label: "Leche", short: "Le" },
  { id: "frutos-cascara", label: "Frutos de cáscara", short: "Fc" },
  { id: "apio", label: "Apio", short: "Ap" },
  { id: "mostaza", label: "Mostaza", short: "Mo" },
  { id: "sesamo", label: "Sésamo", short: "Se" },
  { id: "sulfitos", label: "Sulfitos", short: "Su" },
  { id: "altramuces", label: "Altramuces", short: "Al" },
  { id: "moluscos", label: "Moluscos", short: "Ml" },
] as const;
export type AllergenId = (typeof ALLERGENS)[number]["id"];

export type MenuItem = {
  id?: string;
  name: string;
  description?: string;
  /** precio; 0 o sin precio = «consultar» */
  price?: number;
  /** precio anterior, segunda medida… se pinta tal cual: «1/2 ración 6 €», «porción» */
  priceNote?: string;
  allergens?: AllergenId[];
  /** etiquetas cortas: «nuevo», «vegano», «sin gluten», «de temporada» */
  tags?: string[];
  /** agotado hoy: se ve, pero no se puede añadir */
  soldOut?: boolean;
  image?: string;
};
export type MenuSection = { id?: string; title: string; note?: string; items: MenuItem[] };

export type MenuListProps = {
  /**
   * La carta. Como texto: `#Sección|nota` abre una sección y cada línea siguiente es un plato,
   * `Nombre|descripción|precio|alérgenos separados por comas|etiquetas`. O como datos (`MenuSection[]`).
   */
  menu?: string | MenuSection[];
  /** list = nombre y precio unidos por puntos guía · columns = dos columnas · cards = tarjetas con foto */
  layout?: "list" | "columns" | "cards";
  /** barra de secciones para saltar (anclas) */
  nav?: boolean;
  /** filtro «Sin…»: oculta los platos que contienen los alérgenos marcados */
  filter?: boolean;
  /** leyenda de los 14 alérgenos al final */
  legend?: boolean;
  /** con `onAdd`, cada plato lleva un botón para añadirlo (pedido en mesa, para recoger) */
  onAdd?: (item: MenuItem, section: MenuSection) => void;
  addLabel?: string;
  currency?: string;
  locale?: string;
  /** nota legal o de servicio al pie («Precios con IVA. Pregunta por las trazas.») */
  footnote?: string;
  variant?: Variant;
  className?: string;
};

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function parseMenu(text: string): MenuSection[] {
  const out: MenuSection[] = [];
  for (const line of splitList(text, "\n")) {
    if (line.startsWith("#")) {
      const [title, note] = line.slice(1).split("|").map((x) => x.trim());
      out.push({ title, note, items: [] });
      continue;
    }
    if (!out.length) out.push({ title: "Carta", items: [] });
    const [name, description = "", price = "", allergens = "", tags = ""] = line.split("|").map((x) => x.trim());
    const n = Number(price.replace(",", ".").replace(/[^\d.]/g, ""));
    out[out.length - 1].items.push({
      name,
      description,
      price: Number.isFinite(n) && n > 0 ? n : undefined,
      priceNote: /[a-zñ]/i.test(price.replace("€", "")) ? price : undefined,
      // por id («frutos-cascara») o por nombre («frutos de cáscara»)
      allergens: splitList(allergens).map((a) => ALLERGENS.find((x) => x.id === slug(a) || slug(x.label) === slug(a))?.id).filter((a): a is AllergenId => !!a),
      tags: splitList(tags),
    });
  }
  return out;
}

const ALG = Object.fromEntries(ALLERGENS.map((a) => [a.id, a]));

/**
 * Carta en HTML (no en PDF) con precios, etiquetas y los 14 alérgenos, filtro «Sin gluten / sin leche…» y botón de añadir
 * para el pedido en mesa o para recoger (R1 en docs/11). Cada alérgeno es una abreviatura con su nombre completo para el
 * lector de pantalla y en la leyenda: no depende de iconos ni de color. Lo que no puedes servir hoy se marca como agotado.
 */
export default function MenuList({
  menu = "#Desayunos|Hasta las 12:00\nCroissant de mantequilla|Hojaldre de 27 capas, horneado cada mañana|1,90|gluten,huevo,leche|\nTostada de masa madre|Con tomate rallado y aceite de la Sierra|3,20|gluten|vegano\n#Tartas|Por porción\nTarta de queso|Al horno, cremosa por dentro|4,80|leche,huevo,gluten|la más pedida\nTarta de zanahoria|Con nueces y crema de queso|4,50|gluten,huevo,leche,frutos de cáscara|",
  layout = "list",
  nav = true,
  filter = true,
  legend = true,
  onAdd,
  addLabel = "Añadir",
  currency = "EUR",
  locale = "es-ES",
  footnote = "Precios con IVA incluido. Elaboramos en un obrador donde se manipulan todos los alérgenos: pregunta por las trazas.",
  variant = "minimal",
  className = "",
}: MenuListProps) {
  const uid = useId();
  const sections = useMemo(() => (typeof menu === "string" ? parseMenu(menu) : menu).map((s) => ({ ...s, id: s.id ?? slug(s.title) })), [menu]);
  const present = useMemo(() => ALLERGENS.filter((a) => sections.some((s) => s.items.some((i) => i.allergens?.includes(a.id)))), [sections]);
  const [without, setWithout] = useState<AllergenId[]>([]);
  const shown = sections.map((s) => ({ ...s, items: s.items.filter((i) => !without.some((a) => i.allergens?.includes(a))) }));
  const hidden = sections.reduce((n, s) => n + s.items.length, 0) - shown.reduce((n, s) => n + s.items.length, 0);
  const toggle = (a: AllergenId) => setWithout((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  return (
    <div className={`ui-menu ui-menu--${layout} ${vcls(variant)} ${className}`.trim()}>
      {(nav && sections.length > 1) || (filter && present.length > 0) ? (
        <div className="ui-menu__bar">
          {nav && sections.length > 1 && (
            <nav className="ui-menu__nav" aria-label="Secciones de la carta">
              {sections.map((s) => (
                <a key={s.id} href={`#${uid}-${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`${uid}-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                  {s.title}
                </a>
              ))}
            </nav>
          )}
          {filter && present.length > 0 && (
            <fieldset className="ui-menu__filter">
              <legend>Sin…</legend>
              {present.map((a) => (
                <button key={a.id} type="button" aria-pressed={without.includes(a.id)} onClick={() => toggle(a.id)}>
                  {a.label.toLowerCase()}
                </button>
              ))}
              <span className="ui-menu__count" aria-live="polite">{hidden ? `${hidden} ${hidden === 1 ? "plato oculto" : "platos ocultos"}` : ""}</span>
            </fieldset>
          )}
        </div>
      ) : null}

      {shown.map((s, si) => (
        <section key={s.id} id={`${uid}-${s.id}`} className="ui-menu__sec" aria-labelledby={`${uid}-${s.id}-h`}>
          <header className="ui-menu__head">
            <h3 id={`${uid}-${s.id}-h`}>{s.title}</h3>
            {s.note && <p>{s.note}</p>}
          </header>
          {s.items.length === 0 ? (
            <p className="ui-menu__empty">Nada de esta sección encaja con el filtro.</p>
          ) : (
            <ul className="ui-menu__items">
              {s.items.map((it) => (
                <li key={it.id ?? it.name} className="ui-menu__item" data-out={it.soldOut ? "" : undefined}>
                  {layout === "cards" && it.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="ui-menu__img" src={it.image} alt="" loading="lazy" />
                  )}
                  <div className="ui-menu__row">
                    <span className="ui-menu__name">{it.name}</span>
                    {layout === "list" && <span className="ui-menu__lead" aria-hidden />}
                    <span className="ui-menu__price">{it.price ? money(it.price, currency, locale) : it.priceNote || "Consultar"}</span>
                  </div>
                  {it.price && it.priceNote ? <p className="ui-menu__pnote">{it.priceNote}</p> : null}
                  {it.description && <p className="ui-menu__desc">{it.description}</p>}
                  {(!!it.tags?.length || !!it.allergens?.length || it.soldOut) && (
                    <div className="ui-menu__meta">
                      {it.soldOut && <span className="ui-menu__tag ui-menu__tag--out">Agotado hoy</span>}
                      {it.tags?.map((t) => <span key={t} className="ui-menu__tag">{t}</span>)}
                      {!!it.allergens?.length && (
                        <span className="ui-menu__alg">
                          <span className="ui-sr">Contiene: {it.allergens.map((a) => ALG[a]?.label.toLowerCase()).join(", ")}</span>
                          {it.allergens.map((a) => (
                            <abbr key={a} title={ALG[a]?.label} aria-hidden>{ALG[a]?.short}</abbr>
                          ))}
                        </span>
                      )}
                    </div>
                  )}
                  {onAdd && (
                    <button type="button" className="ui-menu__add" disabled={it.soldOut} onClick={() => onAdd(it, sections[si])}>
                      {addLabel}
                      <span className="ui-sr"> {it.name}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {legend && present.length > 0 && (
        <details className="ui-menu__legend">
          <summary>Alérgenos</summary>
          <ul>
            {ALLERGENS.map((a) => (
              <li key={a.id}>
                <abbr aria-hidden>{a.short}</abbr> {a.label}
              </li>
            ))}
          </ul>
        </details>
      )}
      {footnote && <p className="ui-menu__foot">{footnote}</p>}
    </div>
  );
}
