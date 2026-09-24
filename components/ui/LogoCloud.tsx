import Carousel from "./Carousel";
import { vcls, type Variant } from "./variants";

export type LogoCloudProps = {
  label?: string;
  /** nombres de marca separados por comas (sin imágenes: son "logos" tipográficos) */
  brands?: string;
  /** row = fila que salta de línea · ticker = cinta continua que se desplaza sola (Swiper) */
  layout?: "row" | "ticker";
  variant?: Variant;
  className?: string;
};

/** Tira de marcas en texto — "con la confianza de…" — sin depender de imágenes que el kit no tiene. */
export default function LogoCloud({ label = "Con la confianza de", brands = "Nautilus, Costa Brava FM, Surfrider, Deporte Norte, Vela & Mar", layout = "row", variant = "minimal", className = "" }: LogoCloudProps) {
  const list = brands.split(",").map((s) => s.trim()).filter(Boolean);
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
    </section>
  );
}
