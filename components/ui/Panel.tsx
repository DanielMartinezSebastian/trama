import { fillProps, type CardFill, type CardPattern, type CardTone } from "./fill";
import { vcls, type Variant } from "./variants";

export type PanelProps = {
  title?: string;
  body?: string;
  footer?: string;
  /** texto de la barra superior; vacío = sin barra */
  bar?: string;
  variant?: Variant;
  /** dibuja un carácter en dos esquinas */
  cornerGlyph?: string;
  /** fondo de la tarjeta: surface · tint · gradient · accent (invertida) · pattern · image (ver fill.ts) */
  fill?: CardFill;
  pattern?: CardPattern;
  tone?: CardTone;
  /** con fill="image": URL/ruta o `gen:N` */
  image?: string;
  className?: string;
};

/** Superficie genérica del sistema: barra opcional, título, cuerpo y pie. Base de cualquier tarjeta simple. */
export default function Panel({ title = "Resumen de reserva", body = "Dos clases de iniciación el sábado por la mañana, con neopreno y tabla incluidos.", footer = "Cancelación gratuita hasta 24 h antes", bar = "reserva.txt", variant = "glass", cornerGlyph = "", fill, pattern, tone, image, className = "" }: PanelProps) {
  const f = fillProps({ fill, pattern, tone, image });
  return (
    <section className={`ui-panel ui-surface ${f.className} ${vcls(variant)} ${className}`} style={f.style} data-corners={cornerGlyph || undefined}>
      {bar && (
        <div className="ui-panel__bar">
          <i style={{ background: "var(--acc)" }} />
          <i style={{ background: "var(--acc2)" }} />
          <i style={{ background: "var(--mut)" }} />
          <span>{bar}</span>
        </div>
      )}
      <div className="ui-panel__body">
        {title && <h4>{title}</h4>}
        {body && <p>{body}</p>}
      </div>
      {footer && <div className="ui-panel__foot">{footer}</div>}
    </section>
  );
}
