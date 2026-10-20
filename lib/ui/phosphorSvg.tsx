import type { IconSetDef } from "@/components/ui/Icon";

type SvgIconProps = { size?: number | string; className?: string } & Record<string, unknown>;

/**
 * Familia de iconos a partir del SVG interior de cada uno (los `lib/ui/icons-phosphor-<peso>.ts` generados por
 * `scripts/build-icon-sets.mjs`). Pinta el mismo `<svg>` que el `SSRBase` de Phosphor (lienzo 256, `currentColor`).
 */
export function phosphorSvg(id: string, svg: Record<string, string>): IconSetDef {
  const icons = Object.fromEntries(
    Object.entries(svg).map(([name, inner]) => {
      const C = ({ size = "1em", ...rest }: SvgIconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" {...rest} dangerouslySetInnerHTML={{ __html: inner }} />
      );
      return [name, C];
    }),
  );
  return { id, icons };
}
