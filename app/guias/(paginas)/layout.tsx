import FontshareLink from "@/components/site/guias/FontshareLink";
import "@/components/site/guias/guias.css";

/** Páginas sueltas de /guias (portadas y relatos a pantalla completa): sin el marco de la web, para verlas como una web real y en las miniaturas. */
export default function GuiasPaginasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FontshareLink />
      {children}
    </>
  );
}
