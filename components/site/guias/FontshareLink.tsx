import { GUIDE_FONTSHARE_CSS } from "@/lib/ui/guides";

/** Hoja oficial de Fontshare (Switzer, General Sans) para las páginas de /guias; React la sube al <head> y no la repite. */
export default function FontshareLink() {
  return <link rel="stylesheet" href={GUIDE_FONTSHARE_CSS} precedence="default" />;
}
