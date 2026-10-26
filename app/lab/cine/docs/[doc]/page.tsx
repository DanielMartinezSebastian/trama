import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Prose from "@/components/ui/Prose";
import SiteChrome from "@/components/site/SiteChrome";
import { DOC_PAGES, docHref } from "@/lib/docs";
import { DOCS_CINE } from "@/components/lab/cine/panel/datos";
import { GITHUB } from "@/components/lab/cine/panel/rondas";
import "@/components/lab/cine/panel/panel.css";

/*
 * Los documentos del método de cine (docs/26–34) dentro del laboratorio, solo en local: no están en /docs (que es la
 * documentación pública del kit). Los enlaces a otros documentos del método se quedan aquí; a los de /docs van allí; el
 * resto, a GitHub.
 */

type Props = { params: Promise<{ doc: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

function enlaces(md: string) {
  return md.replace(/\]\((\.{1,2}\/[^)\s#]*)(#[^)\s]*)?\)/g, (_, ruta: string, hash = "") => {
    const archivo = ruta.replace(/^\.\//, "");
    if (DOCS_CINE.includes(archivo)) return `](/lab/cine/docs/${archivo.replace(/\.md$/, "")}${hash})`;
    const publica = DOC_PAGES.find((p) => p.file === archivo);
    if (publica) return `](${docHref(publica.slug)}${hash})`;
    return `](${GITHUB}/blob/main/${ruta.startsWith("../") ? ruta.slice(3) : `docs/${archivo}`}${hash})`;
  });
}

export default async function DocCine({ params }: Props) {
  await connection();
  const { doc } = await params;
  const archivo = `${doc}.md`;
  if (!DOCS_CINE.includes(archivo)) notFound();
  const raw = readFileSync(join(process.cwd(), "docs", archivo), "utf8");
  const titulo = raw.match(/^#\s+(.*)$/m)?.[1] ?? doc;
  const markdown = enlaces(raw.replace(/^\s*# .*\n/, ""));
  const i = DOCS_CINE.indexOf(archivo);
  return (
    // sin `app`, como /docs: el marco de aplicación fija la página y no deja desplazarse
    <SiteChrome>
      <main className="tr-docs">
        <aside className="tr-docs__side" aria-label="Documentos del método">
          <div className="tr-docs__group">
            <p className="tr-label">Laboratorio</p>
            <ul>
              <li>
                <Link href="/lab/cine">← Panel de rondas</Link>
              </li>
            </ul>
          </div>
          <div className="tr-docs__group">
            <p className="tr-label">Método de cine 3D</p>
            <ul>
              {DOCS_CINE.map((d) => (
                <li key={d}>
                  <Link href={`/lab/cine/docs/${d.replace(/\.md$/, "")}`} className={d === archivo ? "is-on" : ""} aria-current={d === archivo ? "page" : undefined}>
                    {d.replace(/\.md$/, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <article className="tr-docs__main">
          <header className="tr-docs__head">
            <p className="tr-label">Laboratorio · solo en local · docs/{archivo}</p>
            <h1>{titulo}</h1>
          </header>
          <Prose markdown={markdown} variant="minimal" codeVariant="minimal" measure="full" anchors className="tr-prose" />
          <nav className="cpl-ronda__pie">
            {i > 0 && <Link href={`/lab/cine/docs/${DOCS_CINE[i - 1].replace(/\.md$/, "")}`}>← {DOCS_CINE[i - 1]}</Link>}
            {i < DOCS_CINE.length - 1 && <Link href={`/lab/cine/docs/${DOCS_CINE[i + 1].replace(/\.md$/, "")}`}>{DOCS_CINE[i + 1]} →</Link>}
          </nav>
        </article>
      </main>
    </SiteChrome>
  );
}
