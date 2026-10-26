import Accordion from "./Accordion";
import SectionHeader from "./SectionHeader";
import type { Variant } from "./variants";

export type FAQSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** una entrada por línea con el formato «Pregunta|Respuesta» (igual que `Accordion`) */
  items?: string;
  multiple?: boolean;
  align?: "left" | "center";
  /** Cabecera encima o a un lado en escritorio. */
  layout?: "stack" | "split";
  presentation?: "cards" | "lines";
  answerAlign?: "inherit" | "left" | "center";
  /** Índice abierto al inicio; -1 cierra todos. */
  defaultOpen?: number;
  variant?: Variant;
  className?: string;
};

/** Sección de preguntas frecuentes: cabecera + `Accordion`, lista para pegar al final de una landing. */
export default function FAQSection({
  kicker = "Preguntas frecuentes",
  title = "Todo lo que necesitas saber",
  subtitle = "",
  items,
  multiple = true,
  align = "center",
  layout = "stack",
  presentation = "cards",
  answerAlign = "inherit",
  defaultOpen = 0,
  variant = "glass",
  className = "",
}: FAQSectionProps) {
  return (
    <section className={`ui-faqs ui-faqs--${layout} ${align === "left" ? "ui-faqs--left" : ""} ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align={align} rule={layout === "split" ? "none" : "line"} variant="minimal" />
      <div className="ui-faqs__body">
        <Accordion items={items} multiple={multiple} defaultOpen={defaultOpen} presentation={presentation} answerAlign={answerAlign} variant={variant} />
      </div>
    </section>
  );
}
