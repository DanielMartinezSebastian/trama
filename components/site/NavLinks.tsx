"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./theme";

/** Enlaces de la cabecera con la sección actual marcada (necesita la ruta del navegador: isla cliente del marco). */
export default function NavLinks() {
  const path = usePathname() ?? "/";
  // el laboratorio (/lab) solo existe en local: en producción el enlace ni se compila (NODE_ENV se sustituye en el build)
  const nav = process.env.NODE_ENV === "development" ? [...NAV, { href: "/lab/cine", label: "Lab" }] : NAV;
  return nav.map((n) => {
    const on = path === n.href || path.startsWith(`${n.href}/`);
    return (
      <Link key={n.href} href={n.href} className={`tr-nav__link ${on ? "is-on" : ""}`} aria-current={on ? "page" : undefined}>
        {n.label}
      </Link>
    );
  });
}
