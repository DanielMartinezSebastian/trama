"use client";

import { useEffect, useRef, useState } from "react";
import { getEntry } from "@/lib/catalog/catalog";
import { defaultsOf } from "@/lib/catalog/schema";
import { neutralTokens, tokensToStyle } from "@/lib/ui/tokens";
import { getLenis } from "@/lib/motion/lenis";
import PreviewEffects from "./PreviewEffects";
import { previewMode, type PreviewCommand, type PreviewConfig, type PreviewReport } from "./preview-protocol";
import "./playground.css";
import "./preview.css";

export default function CatalogPreviewPage({ id }: { id: string }) {
  const entry = getEntry(id);
  const [config, setConfig] = useState<PreviewConfig | null>(null);
  const [cycle, setCycle] = useState(0);
  const [standalone, setStandalone] = useState(false);
  const main = useRef<HTMLElement>(null);
  const lastReplay = useRef<number | undefined>(undefined);

  useEffect(() => {
    setStandalone(window.parent === window);
    const jump = (top: number) => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo({ top, behavior: "instant" });
    };
    const report = (message: PreviewReport) => window.parent.postMessage(message, window.location.origin);
    const receive = (event: MessageEvent<PreviewCommand>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data = event.data;
      if (data?.type === "trama-preview:config" && data.config?.id === id) {
        if (lastReplay.current !== data.config.replay) {
          jump(0);
          lastReplay.current = data.config.replay;
        }
        setConfig(data.config);
      } else if (data?.type === "trama-preview:seek" && Number.isFinite(data.progress)) {
        jump(Math.min(1, Math.max(0, data.progress)) * Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
      } else if (data?.type === "trama-preview:reset") {
        jump(0);
        setCycle((value) => value + 1);
      }
    };
    let raf = 0;
    const scroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        report({ type: "trama-preview:scroll", progress: max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0 });
      });
    };
    window.addEventListener("message", receive);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    const ro = new ResizeObserver(scroll);
    if (main.current) ro.observe(main.current);
    report({ type: "trama-preview:ready" });
    scroll();
    return () => {
      window.removeEventListener("message", receive);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [id]);

  useEffect(() => {
    if (!config) return;
    const root = document.documentElement;
    const previous = root.getAttribute("style");
    for (const [key, value] of Object.entries(config.theme)) {
      root.style.setProperty(key.startsWith("--") ? key : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), String(value));
    }
    return () => { if (previous === null) root.removeAttribute("style"); else root.setAttribute("style", previous); };
  }, [config?.theme]);

  const values = config?.values ?? (entry ? defaultsOf(entry) : {});
  const mode = config?.mode ?? (entry ? previewMode(entry, values) : undefined);
  const environment = config ?? { theme: tokensToStyle(neutralTokens), iconFamily: "pixel" as const, iconWeight: "regular" as const, enter: false, enterEffect: "ascii-rain" as const, enterDuration: 1.2, hover: false, hoverEffect: "none" as const, hoverStrength: 0.6 };
  return (
    <main ref={main} className="pg-preview" style={environment.theme}>
      {!entry ? <p>Componente no encontrado.</p> : config || standalone ? (
        <div key={`${id}-${config?.replay ?? 0}-${cycle}`}>
          {mode === "inview" && <div className="pg-preview__spacer"><p>Desplaza para descubrir el efecto ↓</p></div>}
          <section className="pg-preview__demo" aria-label={entry.name}>
            <PreviewEffects environment={environment} canWrap={false}>
              {entry.render(values, { replay: config?.replay ?? 0 })}
            </PreviewEffects>
          </section>
          <div className="pg-preview__spacer pg-preview__spacer--end"><p>Fin del recorrido · vuelve arriba para repetir ↑</p></div>
        </div>
      ) : <p className="pg-preview__spacer" role="status">Preparando demo…</p>}
    </main>
  );
}
