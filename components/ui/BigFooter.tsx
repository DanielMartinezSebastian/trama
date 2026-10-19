"use client";

import FitText from "./FitText";
import LocalTime from "./LocalTime";
import RollLink from "./RollLink";

export type BigFooterProps = {
  /** titular que llena el ancho */
  heading?: string;
  /** frase sobre el correo */
  lead?: string;
  email?: string;
  links?: { label: string; href: string }[];
  /** texto izquierdo de la línea final (copyright) */
  note?: string;
  /** texto derecho de la línea final */
  credit?: string;
  /** convierte el texto derecho en un enlace (p. ej. «Créditos de las imágenes») */
  creditHref?: string;
  /** muestra la hora local de esta ciudad en la línea final (vacío = no) */
  city?: string;
  timeZone?: string;
  className?: string;
};

/**
 * Pie de página «de estudio»: correo grande, enlaces que ruedan y un titular que llena el ancho. Invierte los colores del
 * tema (fondo `--fg`, texto `--bg`), así contrasta con el resto de la página. Compone `FitText`, `RollLink` y `LocalTime`.
 */
export default function BigFooter({ heading = "Hablemos.", lead = "¿Tienes un proyecto?", email = "hola@estudio.example", links = [], note = "", credit = "", creditHref, city = "", timeZone = "Europe/Madrid", className = "" }: BigFooterProps) {
  return (
    <footer className={`ui-bigfoot ${className}`.trim()}>
      <div className="ui-bigfoot__in">
        <div className="ui-bigfoot__top">
          <div>
            {lead && <p className="ui-bigfoot__lead">{lead}</p>}
            <a className="ui-bigfoot__mail" href={`mailto:${email}`} data-cursor="Escribir">{email}</a>
          </div>
          {links.length > 0 && (
            <nav aria-label="Pie" className="ui-bigfoot__nav">
              {links.map((l, i) => <RollLink key={`${l.href}-${i}`} label={l.label} href={l.href} />)}
            </nav>
          )}
        </div>
        <div className="ui-bigfoot__fit" aria-hidden={!heading}>
          <FitText>{heading || " "}</FitText>
        </div>
        <div className="ui-bigfoot__bot">
          <span>{note}</span>
          {city ? <LocalTime city={city} timeZone={timeZone} /> : <span />}
          {creditHref ? <a href={creditHref}>{credit}</a> : <span>{credit}</span>}
        </div>
      </div>
    </footer>
  );
}
