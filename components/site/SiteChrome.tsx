import Link from "next/link";
import type { ReactNode } from "react";
import InstallChip from "./InstallChip";
import NavLinks from "./NavLinks";
import { GITHUB, SITE_STYLE, VERSION } from "./theme";
import "./site.css";

/**
 * Marco de la web de Trama (inicio, docs, catálogo y demos): cabecera fija de texto, pie y tema. `app` = página de aplicación
 * a pantalla completa (el catálogo): sin scroll de página ni pie, el contenido ocupa lo que queda bajo la cabecera. El scroll
 * de la página lo abre site.css (`html:has(.tr)`), no un efecto. Componente de servidor: solo son cliente el enlace activo
 * (NavLinks) y el botón de copiar (InstallChip).
 */
export default function SiteChrome({ children, app = false }: { children: ReactNode; app?: boolean }) {
  return (
    <div className={`tr ${app ? "tr--app" : ""}`} style={SITE_STYLE} data-theme="trama">
      <a href="#contenido" className="tr-skip">
        Saltar al contenido
      </a>
      <header className="tr-nav">
        <Link href="/" className="tr-nav__brand" aria-label="Trama, inicio">
          <span className="tr-nav__mark" aria-hidden />
          TRAMA
        </Link>
        <nav className="tr-nav__links" aria-label="Secciones">
          <NavLinks />
          <a href={GITHUB} className="tr-nav__link" target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden>↗</span>
            <span className="ui-sr-only"> (se abre en otra pestaña)</span>
          </a>
        </nav>
        <InstallChip className="tr-nav__install" />
      </header>

      <div id="contenido" tabIndex={-1} className="tr-content">
        {children}
      </div>

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
                {label} <span aria-hidden>↗</span>
                <span className="ui-sr-only"> (se abre en otra pestaña)</span>
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
