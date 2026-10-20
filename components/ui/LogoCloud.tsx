import Carousel from "./CarouselLazy";
import { splitList } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type LogoCloudProps = {
  label?: string;
  /** nombres de marca separados por comas (sin imágenes: son "logos" tipográficos) */
  brands?: string;
  /** row = fila que salta de línea · ticker = cinta continua que se desplaza sola (Swiper) */
  layout?: "row" | "ticker";
  /** premios con laureles bajo las marcas (prueba de agencias y corporativos): "Webby 2026 | Mejor web corporativa, Red Dot | Marca"
   * — premio y, tras `|`, la categoría */
  awards?: string;
  variant?: Variant;
  className?: string;
};

/** rama de laurel en línea (SVG propio, hereda el color) */
const Laurel = ({ flip = false }: { flip?: boolean }) => (
  <svg className="ui-logos__laurel" viewBox="0 0 20 44" width="14" height="32" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M15 42C6 36 3 26 5 14 6 9 9 5 12 2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    {[8, 15, 22, 29, 36].map((y, i) => (
      <ellipse key={y} cx={i % 2 ? 9 : 5} cy={y} rx="2.2" ry="4.4" transform={`rotate(${i % 2 ? 35 : -30} ${i % 2 ? 9 : 5} ${y})`} fill="currentColor" opacity="0.85" />
    ))}
  </svg>
);

/** Tira de marcas en texto — "con la confianza de…" — sin depender de imágenes que el kit no tiene. */
export default function LogoCloud({ label = "Con la confianza de", brands = "Nautilus, Costa Brava FM, Surfrider, Deporte Norte, Vela & Mar", layout = "row", awards = "", variant = "minimal", className = "" }: LogoCloudProps) {
  const list = splitList(brands);
  const brandEls = list.map((b) => (
    <span key={b} className="ui-logos__brand">
      {b}
    </span>
  ));
  return (
    <section className={`ui-logos ${className}`}>
      {label && <span className="ui-logos__label">{label}</span>}
      {layout === "ticker" ? (
        <Carousel ticker variant={variant} label={label || "Marcas"} className="ui-logos__ticker">
          {brandEls}
        </Carousel>
      ) : (
        <div className={`ui-logos__row ${vcls(variant)}`}>{brandEls}</div>
      )}
      {awards && (
        <ul className="ui-logos__awards" aria-label="Premios">
          {splitList(awards).map((a) => {
            const [name, cat] = a.split("|").map((x) => x.trim());
            return (
              <li key={a} className="ui-logos__award">
                <Laurel />
                <span>
                  <b>{name}</b>
                  {cat && <small>{cat}</small>}
                </span>
                <Laurel flip />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
