import type { ReactNode } from "react";
import { inline } from "@/lib/ui/markdownInline";
import { renderGlyph } from "./Icon";
import { intentCls, type Intent } from "./intent";
import { vcls, type Variant } from "./variants";

export type CalloutProps = {
  /** color semántico común del kit: info = nota · success = consejo · accent = importante · warning = cuidado · danger = peligro */
  intent?: Intent;
  /** título en negrita ("" = sin título) */
  title?: string;
  /** texto con Markdown de línea (**negrita**, `código`, [enlaces](…)); una línea en blanco separa párrafos. `children` lo sustituye */
  text?: string;
  children?: ReactNode;
  /** bar = barra lateral · soft = fondo teñido · outline = solo borde */
  kind?: "bar" | "soft" | "outline";
  /** glifo o `icon:nombre` ("" = el del intent) */
  icon?: string;
  /** se pliega con un clic en el título */
  collapsible?: boolean;
  /** con collapsible: empieza abierto */
  defaultOpen?: boolean;
  variant?: Variant;
  className?: string;
};

const ICONS: Record<Intent, string> = { accent: "✦", neutral: "·", info: "i", success: "✓", warning: "!", danger: "×" };

/**
 * Aviso de documentación: nota, consejo, importante, cuidado o peligro dentro de un texto largo. A diferencia de `Alert`
 * (estado de la interfaz, se cierra), `Callout` es contenido: lleva párrafos, no se descarta y puede plegarse. En `Prose`
 * se escribe como en GitHub: `> [!NOTE] Título` seguido de las líneas del aviso.
 */
export default function Callout({
  intent = "info",
  title = "Antes de entrar al agua",
  text = "Revisa el **parte de olas** del día y avisa al monitor si es tu primera clase. Tienes la tabla de mareas en [Reservas](#reservas).",
  children,
  kind = "bar",
  icon = "",
  collapsible = false,
  defaultOpen = true,
  variant = "minimal",
  className = "",
}: CalloutProps) {
  const glyph = icon || ICONS[intent];
  const body = children ?? text.split(/\n\s*\n/).map((p, i) => <p key={i}>{inline(p.replace(/\n/g, " "))}</p>);
  const cls = `ui-callout ui-callout--${kind} ${intentCls(intent)} ${vcls(variant)} ${className}`;
  const head = (
    <>
      <span className="ui-callout__icon" aria-hidden>
        {glyph.startsWith("icon:") ? renderGlyph(glyph, 16) : glyph}
      </span>
      {title && <strong className="ui-callout__title">{inline(title)}</strong>}
    </>
  );

  if (collapsible)
    return (
      <details className={cls} open={defaultOpen}>
        <summary className="ui-callout__head">
          {head}
          <span className="ui-callout__chev" aria-hidden>
            {renderGlyph("icon:chevron-down", 14)}
          </span>
        </summary>
        <div className="ui-callout__body">{body}</div>
      </details>
    );

  return (
    <aside className={cls} role="note">
      <div className="ui-callout__head">{head}</div>
      <div className="ui-callout__body">{body}</div>
    </aside>
  );
}
