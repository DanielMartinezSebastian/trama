import { renderGlyph } from "./Icon";
import { vcls, type Variant } from "./variants";

export type FooterProps = {
  brand?: string;
  tagline?: string;
  /** columnas separadas por «;», cada una «Título: enlace1, enlace2=/ruta, enlace3=https://…» (`=` convierte el texto en enlace) */
  columns?: string;
  /** iniciales o siglas de redes, separadas por comas; vacío = ninguna. Cada una puede ser un icono pixel art: `icon:github` (ver Icon) */
  social?: string;
  copyright?: string;
  variant?: Variant;
  className?: string;
};

const DEFAULT_COLUMNS = "Escuela: Clases, Monitores, Ubicación; Ayuda: Reservas, Cancelaciones, FAQ; Legal: Privacidad, Términos, Cookies";

/** Pie de página: marca, columnas de enlaces, redes y línea de copyright. Cierre habitual de cualquier landing. */
export default function Footer({
  brand = "Maré Surf Club",
  tagline = "Del primer remo a tu primera ola verde.",
  columns = DEFAULT_COLUMNS,
  social = "X, IG, YT",
  copyright = "© 2026 Maré Surf Club. Todos los derechos reservados.",
  variant = "minimal",
  className = "",
}: FooterProps) {
  const cols = columns
    .split(";")
    .map((c) => {
      const [head, rest] = c.split(":");
      return { title: head?.trim() ?? "", links: (rest ?? "").split(",").map((l) => l.trim()).filter(Boolean) };
    })
    .filter((c) => c.title);
  const soc = social.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <footer className={`ui-footer ui-surface ${vcls(variant)} ${className}`}>
      <div className="ui-footer__top">
        <div className="ui-footer__brand">
          <strong>{brand}</strong>
          {tagline && <p>{tagline}</p>}
          {soc.length > 0 && (
            <div className="ui-footer__social">
              {soc.map((s) => (
                <span key={s} aria-label={s.startsWith("icon:") ? s.slice(5).replace(/:sharp$/, "") : undefined}>
                  {renderGlyph(s, 18)}
                </span>
              ))}
            </div>
          )}
        </div>
        {cols.length > 0 && (
          <nav className="ui-footer__cols">
            {cols.map((c) => (
              <div key={c.title}>
                <span>{c.title}</span>
                <ul>
                  {c.links.map((l) => {
                    const eq = l.indexOf("=");
                    const label = eq > 0 ? l.slice(0, eq).trim() : l;
                    const href = eq > 0 ? l.slice(eq + 1).trim() : "";
                    return <li key={l}>{href ? <a href={href}>{label}</a> : label}</li>;
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>
      {copyright && <div className="ui-footer__bottom">{copyright}</div>}
    </footer>
  );
}
