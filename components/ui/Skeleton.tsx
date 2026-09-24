import { tcls, type Tone } from "./variants";

export type SkeletonProps = {
  kind?: "text" | "card" | "avatar" | "table";
  lines?: number;
  tone?: Tone;
  className?: string;
};

/**
 * Placeholder de carga con barrido animado. Deliberadamente sin `--s-*`: un esqueleto no lleva el
 * estilo de marca del contenido que va a sustituir, solo el tono de color (`tone`).
 */
export default function Skeleton({ kind = "text", lines = 3, tone = "mut", className = "" }: SkeletonProps) {
  if (kind === "avatar") {
    return <div className={`ui-skel ui-skel--avatar ${tcls(tone)} ${className}`} aria-hidden />;
  }
  if (kind === "card") {
    return (
      <div className={`ui-skel-card ${className}`} aria-hidden>
        <div className={`ui-skel ui-skel--block ${tcls(tone)}`} />
        <div className={`ui-skel ui-skel--line ${tcls(tone)}`} style={{ width: "70%" }} />
        <div className={`ui-skel ui-skel--line ${tcls(tone)}`} style={{ width: "45%" }} />
      </div>
    );
  }
  if (kind === "table") {
    return (
      <div className={`ui-skel-table ${className}`} aria-hidden>
        {Array.from({ length: Math.max(2, lines) }, (_, i) => (
          <div key={i} className={`ui-skel ui-skel--row ${tcls(tone)}`} />
        ))}
      </div>
    );
  }
  return (
    <div className={`ui-skel-lines ${className}`} aria-hidden>
      {Array.from({ length: Math.max(1, lines) }, (_, i) => (
        <div key={i} className={`ui-skel ui-skel--line ${tcls(tone)}`} style={{ width: i === Math.max(1, lines) - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}
