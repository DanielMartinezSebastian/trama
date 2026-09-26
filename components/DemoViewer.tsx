"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TextControls from "@/components/TextControls";
import { demos, getDemo } from "@/lib/demos";

/*
 * Cada demo carga solo su código. Con imports estáticos, las 64 demos descargaban las ocho landings, los tres motores de
 * lienzo y three.js (≈ 630 KB comprimidos) aunque mostraran una sola cosa. `next/dynamic` separa cada una en su propio
 * fragmento: se sigue renderizando en el servidor y el navegador solo pide el de la demo abierta.
 */
type LandingProps = { hud: boolean };

/** Landings "kit" (construidas solo con components/ui/): una por slug, todas con la misma forma de props. */
const KIT_LANDINGS: Record<string, React.ComponentType<LandingProps>> = {
  "th-ciphergrid": dynamic<LandingProps>(() => import("@/components/landings/CyberpunkLanding")),
  "th-mycel": dynamic<LandingProps>(() => import("@/components/landings/MycelLanding")),
  "th-folio": dynamic<LandingProps>(() => import("@/components/landings/FolioLanding")),
  "th-dotmatrix": dynamic<LandingProps>(() => import("@/components/landings/DotmatrixLanding")),
  "th-silo": dynamic<LandingProps>(() => import("@/components/landings/SiloLanding")),
  "th-minimal": dynamic<LandingProps>(() => import("@/components/landings/minimal/MinimalLanding")),
  "th-geometry": dynamic<LandingProps>(() => import("@/components/landings/minimal/GeometryLanding")),
  "th-faceta": dynamic<LandingProps>(() => import("@/components/landings/minimal/FacetaLanding")),
};

const AsciifyCanvas = dynamic(() => import("@/components/AsciifyCanvas"));
const LayersCanvas = dynamic(() => import("@/components/LayersCanvas"));
const TextmodeCanvas = dynamic(() => import("@/components/TextmodeCanvas"));
const ThemedLanding = dynamic(() => import("@/components/ThemedLanding"));
const ScrollStage = dynamic(() => import("@/components/ScrollStage"));

export default function DemoViewer({ slug }: { slug: string }) {
  const router = useRouter();
  const [hud, setHud] = useState(true);
  const index = demos.findIndex((d) => d.slug === slug);
  const demo = getDemo(slug);
  const prev = demos[(index - 1 + demos.length) % demos.length];
  const next = demos[(index + 1) % demos.length];
  // Las landings se ven como resultado final: sin HUD ni navegación entre demos
  const bare = demo?.family === "landing";

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    if (bare) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // No secuestrar las teclas mientras se escribe en el cajón de texto
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) return;
      if (e.key === "ArrowRight") router.push(`/demo/${next.slug}`);
      else if (e.key === "ArrowLeft") router.push(`/demo/${prev.slug}`);
      else if (e.key === "h" || e.key === "H") setHud((v) => !v);
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "Escape" && !document.fullscreenElement) router.push("/demos");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bare, router, next.slug, prev.slug, toggleFullscreen]);

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
      {!bare && (
        <>
          <div className={`hud ${hud ? "" : "hud--hidden"}`}>
            <header className="hud__top">
              <Link href="/demos" className="chip">← Demos</Link>
              <h1 className="hud__title" style={{ ["--accent" as string]: demo.accent }}>
                <span className="dot" />
                {demo.title}
                <span className="tag">{tag}</span>
              </h1>
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
      )}
    </>
  );
}
