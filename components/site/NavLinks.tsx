"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./theme";

/** Enlaces de la cabecera con la sección actual marcada (necesita la ruta del navegador: isla cliente del marco). */
export default function NavLinks() {
  const path = usePathname() ?? "/";
  return NAV.map((n) => {
    const on = path === n.href || path.startsWith(`${n.href}/`);
    return (
      <Link key={n.href} href={n.href} className={`tr-nav__link ${on ? "is-on" : ""}`} aria-current={on ? "page" : undefined}>
        {n.label}
      </Link>
    );
  });
}
