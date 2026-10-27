"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PreviewCommand, PreviewConfig, PreviewReport } from "./preview-protocol";

/** Una ventana real: los componentes conservan window, vh, sticky y sus eventos originales. */
export default function CatalogPreviewFrame({ config, name }: { config: PreviewConfig; name: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const latest = useRef(config);
  latest.current = config;
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const id = useId();
  const send = useCallback((message: PreviewCommand) => frame.current?.contentWindow?.postMessage(message, window.location.origin), []);

  useEffect(() => {
    const receive = (event: MessageEvent<PreviewReport>) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "trama-preview:ready") {
        setReady(true);
        send({ type: "trama-preview:config", config: latest.current });
      } else if (event.data?.type === "trama-preview:scroll") setProgress(event.data.progress);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [send]);

  useEffect(() => { send({ type: "trama-preview:config", config }); }, [config, send]);

  useEffect(() => {
    setCanExpand(document.fullscreenEnabled);
    const change = () => setExpanded(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);

  return (
    <div ref={shell} className="pg-preview-shell">
      <div className="pg-preview-shell__bar">
        <p id={`${id}-hint`}>Desplaza dentro de la demo o usa el recorrido.</p>
        <button type="button" className="chip" disabled={!ready} onClick={() => send({ type: "trama-preview:reset" })}>Reiniciar recorrido</button>
        {canExpand && <button type="button" className="chip" aria-expanded={expanded} onClick={() => {
          const action = expanded ? document.exitFullscreen() : shell.current?.requestFullscreen();
          action?.catch(() => setCanExpand(false));
        }}>{expanded ? "Reducir vista" : "Ampliar vista"}</button>}
      </div>
      <div className="pg-preview-shell__progress">
        <label htmlFor={`${id}-progress`}>Recorrido</label>
        <input id={`${id}-progress`} type="range" min={0} max={100} step={1} value={Math.round(progress * 100)} disabled={!ready} onChange={(event) => send({ type: "trama-preview:seek", progress: Number(event.target.value) / 100 })} />
        <output htmlFor={`${id}-progress`}>{Math.round(progress * 100)} %</output>
      </div>
      <iframe
        ref={frame}
        src={`/componentes/preview/${config.id}`}
        title={`Vista previa con scroll: ${name}`}
        aria-describedby={`${id}-hint`}
        loading="lazy"
        onLoad={() => { setReady(true); send({ type: "trama-preview:config", config: latest.current }); }}
      />
    </div>
  );
}
