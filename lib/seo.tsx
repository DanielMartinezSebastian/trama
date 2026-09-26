import pkg from "@/package.json";
import { SITE_URL } from "@/lib/site-url";

/**
 * Datos estructurados (schema.org en JSON-LD) de la web de Trama: los leen Google y otros buscadores para entender qué es
 * cada página (resultados enriquecidos, migas de pan). Solo para la web, no para el kit.
 */

const GITHUB = "https://github.com/DanielMartinezSebastian/trama";
const AUTHOR = { "@type": "Person", name: "Daniel Martínez Sebastián" };
const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;

/** `<script type="application/ld+json">` con el `<` escapado: un texto con `</script>` no puede cerrar la etiqueta. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function homeJsonLd(components: number) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#web`, url: `${SITE_URL}/`, name: "Trama", inLanguage: "es" },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${SITE_URL}/#libreria`,
        name: "Trama (trama-ui)",
        description: `Librería de ${components} componentes React para Next.js: fondos ASCII y textmode, efectos de texto, pixel art y secciones de landing.`,
        url: `${SITE_URL}/`,
        codeRepository: GITHUB,
        programmingLanguage: ["TypeScript", "React"],
        runtimePlatform: "Next.js",
        license: "https://opensource.org/licenses/MIT",
        version: pkg.version,
        author: AUTHOR,
        inLanguage: "es",
      },
    ],
  };
}

export function docJsonLd({ title, description, path, section }: { title: string; description: string; path: string; section: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "TechArticle", headline: title, description, url: abs(path), inLanguage: "es", articleSection: section, author: AUTHOR, isPartOf: { "@id": `${SITE_URL}/#web` }, about: { "@id": `${SITE_URL}/#libreria` } },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trama", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Docs", item: abs("/docs") },
          ...(path === "/docs" ? [] : [{ "@type": "ListItem", position: 3, name: title, item: abs(path) }]),
        ],
      },
    ],
  };
}
