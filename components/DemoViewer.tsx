"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AsciifyCanvas from "@/components/AsciifyCanvas";
import CyberpunkLanding from "@/components/landings/CyberpunkLanding";
import DotmatrixLanding from "@/components/landings/DotmatrixLanding";
import FolioLanding from "@/components/landings/FolioLanding";
import FacetaLanding from "@/components/landings/minimal/FacetaLanding";
import GeometryLanding from "@/components/landings/minimal/GeometryLanding";
import MinimalLanding from "@/components/landings/minimal/MinimalLanding";
import MycelLanding from "@/components/landings/MycelLanding";
import LayersCanvas from "@/components/LayersCanvas";
import ScrollStage from "@/components/ScrollStage";
import TextControls from "@/components/TextControls";
import ThemedLanding from "@/components/ThemedLanding";
import TextmodeCanvas from "@/components/TextmodeCanvas";
import { demos, getDemo } from "@/lib/demos";

/** Landings "kit" (construidas solo con components/ui/): una por slug, todas con la misma forma de props. */
const KIT_LANDINGS: Record<string, (props: { hud: boolean }) => React.JSX.Element> = {
  "th-ciphergrid": CyberpunkLanding,
  "th-mycel": MycelLanding,
  "th-folio": FolioLanding,
  "th-dotmatrix": DotmatrixLanding,
  "th-minimal": MinimalLanding,
  "th-geometry": GeometryLanding,
  "th-faceta": FacetaLanding,
};

export default function DemoViewer({ slug }: { slug: string }) {
  const router = useRouter();
  const [hud, setHud] = useState(true);
  const index = demos.findIndex((d) => d.slug === slug);
  const demo = getDemo(slug);
  const prev = demos[(index - 1 + demos.length) % demos.length];
  const next = demos[(index + 1) % demos.length];

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // No secuestrar las teclas mientras se escribe en el cajón de texto
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) return;
      if (e.key === "ArrowRight") router.push(`/demo/${next.slug}`);
      else if (e.key === "ArrowLeft") router.push(`/demo/${prev.slug}`);
      else if (e.key === "h" || e.key === "H") setHud((v) => !v);
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "Escape" && !document.fullscreenElement) router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, next.slug, prev.slug, toggleFullscreen]);

  if (!demo) return null;

  const render = demo.render ?? (demo.family === "asciify" ? "asciify" : "textmode");
  const tag = [demo.lib, demo.reactive ? "reactivo" : "ambiente"].filter(Boolean).join(" · ");
  const KitLanding = render === "kit" ? KIT_LANDINGS[slug] : undefined;

  return (
    <>
      {KitLanding ? (
        <KitLanding key={`kit-${slug}`} hud={hud} />
      ) : render === "asciify" ? (
        <AsciifyCanvas key={`canvas-${slug}`} slug={slug} />
      ) : render === "layers" ? (
        <LayersCanvas key={`canvas-${slug}`} slug={slug} />
      ) : (
        <TextmodeCanvas key={`canvas-${slug}`} slug={slug} />
      )}
      {demo.family === "landing" && demo.theme && (
        <ThemedLanding key={`landing-${slug}`} themeId={demo.theme} hud={hud} />
      )}
      {demo.family === "scroll" && <ScrollStage key={`scroll-${slug}`} demo={demo} hud={hud} />}
      <div className={`hud ${hud ? "" : "hud--hidden"}`}>
        <header className="hud__top">
          <Link href="/" className="chip">← Galería</Link>
          <div className="hud__title" style={{ ["--accent" as string]: demo.accent }}>
            <span className="dot" />
            {demo.title}
            <span className="tag">{tag}</span>
          </div>
          <button className="chip" onClick={toggleFullscreen} title="Pantalla completa (F)">⛶</button>
        </header>
        {(demo.family === "text" || demo.text) && <TextControls controls={demo.controls ?? []} />}
        <footer className="hud__bottom">
          <Link href={`/demo/${prev.slug}`} className="chip" title="Anterior (←)">← {prev.title}</Link>
          <p className="hud__hint">{demo.hint}</p>
          <Link href={`/demo/${next.slug}`} className="chip" title="Siguiente (→)">{next.title} →</Link>
        </footer>
      </div>
      <button className="hud-toggle" onClick={() => setHud((v) => !v)} title="Mostrar u ocultar interfaz (H)">
        {hud ? "ocultar" : "mostrar"}
      </button>
    </>
  );
}
