"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { GITHUB, NAV, SITE_STYLE, VERSION } from "./theme";
import "./site.css";

/**
 * Marco de la web de Trama (inicio, docs, catálogo y demos): cabecera fija de texto, pie y tema. `app` = página de aplicación
 * a pantalla completa (el catálogo): sin scroll de página ni pie, el contenido ocupa lo que queda bajo la cabecera. El scroll
 * de la página lo abre site.css (`html:has(.tr)`), no un efecto.
 */
export default function SiteChrome({ children, app = false }: { children: ReactNode; app?: boolean }) {
  const path = usePathname() ?? "/";

  return (
    <div className={`tr ${app ? "tr--app" : ""}`} style={SITE_STYLE} data-theme="trama">
      <header className="tr-nav">
        <Link href="/" className="tr-nav__brand" aria-label="Trama, inicio">
          <span className="tr-nav__mark" aria-hidden />
          TRAMA
        </Link>
        <nav className="tr-nav__links" aria-label="Secciones">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`tr-nav__link ${path === n.href || path.startsWith(`${n.href}/`) ? "is-on" : ""}`}>
              {n.label}
            </Link>
          ))}
          <a href={GITHUB} className="tr-nav__link" target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </nav>
        <InstallChip className="tr-nav__install" />
      </header>

      {children}

      {!app && (
        <footer className="tr-foot">
          <div className="tr-foot__top">
            <div>
              <p className="tr-foot__brand">TRAMA</p>
              <p className="tr-foot__tag">Componentes ASCII, textmode, pixel art y secciones de landing para Next.js.</p>
            </div>
            <FootCol title="Librería" links={[["Primeros pasos", "/docs/empezar"], ["Documentación", "/docs"], ["Catálogo de props", "/docs/catalogo"], ["Componentes en vivo", "/componentes"]]} />
            <FootCol title="Ejemplos" links={[["Landings", "/demos#landings"], ["Webs completas", "/demos#webs"], ["Fondos y efectos", "/demos#textmode"]]} />
            <FootCol title="Proyecto" links={[["GitHub", GITHUB], ["npm · trama-ui", "https://www.npmjs.com/package/trama-ui"], ["Decisiones", "/docs/decisiones"]]} />
          </div>
          <p className="tr-foot__bottom">
            <span>trama-ui v{VERSION} · MIT</span>
            <span>© 2026 Daniel Martínez Sebastián</span>
          </p>
        </footer>
      )}
    </div>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="tr-foot__col">
      <p className="tr-label">{title}</p>
      <ul>
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("http") ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label} ↗
              </a>
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `npm i trama-ui` que se copia al pulsar. */
export function InstallChip({ className = "", command = "npm i trama-ui" }: { className?: string; command?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* portapapeles no disponible */
    }
  };
  return (
    <button type="button" className={`tr-install ${className}`} onClick={copy} title="Copiar">
      <span aria-hidden>$</span> {command}
      <em>{copied ? "copiado" : "copiar"}</em>
    </button>
  );
}
