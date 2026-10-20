import { Fragment } from "react";
import { ViewTransition, vtDelayClass, type PageTransitionPace } from "@/lib/ui/viewTransitions";

/*
 * Texto que viaja palabra a palabra entre dos vistas con la View Transitions API (Mario Roudil, Cyd Stumpel: docs/14):
 * el nombre pequeño de una esquina se convierte en el titular gigante de la página siguiente, o el título de un índice en
 * el de su ficha. Cada palabra es un elemento compartido propio, con un retraso escalonado. Sin "use client": funciona en
 * componentes de servidor.
 */

export type SharedTextProps = {
  /** nombre base: cada palabra se llama `${name}-0`, `${name}-1`…; el mismo en las dos vistas y único en cada una */
  name: string;
  /** el texto (plano): se trocea por palabras */
  text: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  /** retraso entre una palabra y la siguiente, en ms (escalonado) */
  stagger?: number;
  /** retraso de la primera palabra, en ms */
  delay?: number;
  /** duración de cada palabra: `fast` ≈ 240 ms, `normal` ≈ 380 ms, `slow` ≈ 560 ms */
  pace?: PageTransitionPace;
  className?: string;
};

/**
 * El mismo `name` y el mismo texto en las dos vistas; el tamaño, la posición y el color los pone el CSS de cada una.
 * Las palabras vuelan por encima de todo (también de un `Traveler`: un titular sobre su vídeo). Lectores de pantalla:
 * leen el texto entero una vez. Cada palabra lleva `ui-stext__w--<n>` (desde 0) para darle estilo propio. Si una vista
 * tiene palabras de más, esas solo aparecen o desaparecen. Sin soporte, el texto cambia sin animar.
 */
export default function SharedText({ name, text, as: Tag = "span", stagger = 50, delay = 0, pace = "slow", className = "" }: SharedTextProps) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={`ui-stext ${className}`.trim()}>
      <span className="ui-stext__sr">{text}</span>
      {words.map((w, i) => {
        const word = (
          <span className={`ui-stext__w ui-stext__w--${i}`} aria-hidden>
            {w}
          </span>
        );
        return (
          <Fragment key={i}>
            {i > 0 && " "}
            {ViewTransition ? (
              // `ui-vt-text`: z-index propio, por encima de los fijos y de los viajeros
              <ViewTransition name={`${name}-${i}`} share={`ui-vt-morph ui-vt-text ui-vt--${pace}${vtDelayClass(delay + i * stagger)}`} enter="none" exit="none" update="none" default="none">
                {word}
              </ViewTransition>
            ) : (
              word
            )}
          </Fragment>
        );
      })}
    </Tag>
  );
}
