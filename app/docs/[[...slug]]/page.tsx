import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Prose from "@/components/ui/Prose";
import TableOfContents from "@/components/ui/TableOfContents";
import { DOC_GROUPS, DOC_PAGES, docHref, getDoc, loadDoc } from "@/lib/docs";

type Props = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug ? [p.slug] : [] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getDoc((await params).slug?.join("/") ?? "");
  return { title: page ? `${page.title} · Docs · Trama` : "Docs · Trama", description: page?.blurb };
}

export default async function DocPage({ params }: Props) {
  const slug = (await params).slug?.join("/") ?? "";
  const page = getDoc(slug);
  if (!page) notFound();
  const { markdown, headings } = loadDoc(page);
  const group = DOC_GROUPS.find((g) => g.pages.includes(page));
  const i = DOC_PAGES.indexOf(page);
  const prev = DOC_PAGES[i - 1];
  const next = DOC_PAGES[i + 1];

  return (
    <main className="tr-docs">
      <aside className="tr-docs__side" aria-label="Documentación">
        {DOC_GROUPS.map((g) => (
          <div key={g.label} className="tr-docs__group">
            <p className="tr-label">{g.label}</p>
            <ul>
              {g.pages.map((p) => (
                <li key={p.slug}>
                  <Link href={docHref(p.slug)} className={p === page ? "is-on" : ""} aria-current={p === page ? "page" : undefined}>
                    {p.title}
                  </Link>
                </li>
              ))}
              {g.label === "Referencia" && (
                <li>
                  <Link href="/componentes">Componentes en vivo →</Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </aside>

      <article className="tr-docs__main">
        <header className="tr-docs__head">
          <p className="tr-label">Docs · {group?.label}</p>
          <h1>{page.title}</h1>
          <p>{page.blurb}</p>
        </header>
        <Prose markdown={markdown} variant="minimal" codeVariant="minimal" measure="full" anchors className="tr-prose" />
        <nav className="tr-docs__pager" aria-label="Páginas">
          {prev ? (
            <Link href={docHref(prev.slug)}>
              <span className="tr-label">← Anterior</span>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={docHref(next.slug)} className="is-next">
              <span className="tr-label">Siguiente →</span>
              {next.title}
            </Link>
          )}
        </nav>
      </article>

      {headings.length > 1 && (
        <aside className="tr-docs__toc">
          <TableOfContents items={headings.map((h) => `## ${h.text}=#${h.id}`).join("\n")} title="En esta página" depth={2} kind="rail" sticky variant="minimal" />
        </aside>
      )}
    </main>
  );
}
