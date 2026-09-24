"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { vcls, type Variant } from "./variants";

export type NavBarProps = {
  brand?: string;
  /** enlaces separados por comas */
  links?: string;
  cta?: string;
  defaultActive?: number;
  variant?: Variant;
  /** barra flotante con forma de píldora, en lugar de a todo el ancho */
  floating?: boolean;
  className?: string;
};

/** Barra de navegación con marca, enlaces y llamada a la acción. El enlace activo cambia con la variante. */
export default function NavBar({ brand = "Maré", links = "Clases, Tablas, Reservas, Contacto", cta = "Reservar", defaultActive = 0, variant = "glass", floating = false, className = "" }: NavBarProps) {
  const items = useMemo(() => links.split(",").map((s) => s.trim()).filter(Boolean), [links]);
  const [active, setActive] = useState(defaultActive);
  useEffect(() => setActive(defaultActive), [defaultActive]);
  return (
    <nav aria-label="Principal" className={`ui-nav ui-surface ${floating ? "ui-nav--floating" : ""} ${vcls(variant)} ${className}`}>
      <span className="ui-nav__brand">{brand}</span>
      <ul className="ui-nav__links">
        {items.map((l, i) => (
          <li key={l + i}>
            <button className="ui-nav__link" aria-current={i === active} onClick={() => setActive(i)}>
              {l}
            </button>
          </li>
        ))}
      </ul>
      {cta && <Button label={cta} variant={variant} size="sm" />}
    </nav>
  );
}
