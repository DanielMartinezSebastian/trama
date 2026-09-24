"use client";

import { useEffect, useRef, useState } from "react";
import { painters } from "@/lib/asciify/painters";
import { createPointerTracker } from "@/lib/asciify/pointer";
import { asciifyDefs } from "@/lib/asciify/registry";
import { scrollState } from "@/lib/scroll/store";
import { textStore } from "@/lib/text/store";
import type { HoverEffect } from "asciify-engine";
import type { StudioInput } from "asciify-engine/studio";

const SOURCE_WIDTH = 640;

/** Crea el canvas fuente (donde se dibuja la imagen procedural) con la proporción de la ventana. */
function makeSource(width: number) {
  const src = document.createElement("canvas");
  const fit = () => {
    src.width = width;
    src.height = Math.max(2, Math.round((width * window.innerHeight) / window.innerWidth));
  };
  fit();
  return { src, fit };
}

/**
 * Monta un demo de asciify-engine como fondo a pantalla completa.
 * - studio: `mountStudioMedia` con un "medio" propio que pinta un canvas en cada fotograma.
 * - core: bucle propio con `imageToAsciiFrame` + `renderFrameToCanvas`.
 * - webcam: `asciifyWebcam`, tras pulsar el botón (el navegador pide permiso).
 */
export default function AsciifyCanvas({ slug }: { slug: string }) {
  const host = useRef<HTMLDivElement>(null);
  const def = asciifyDefs[slug];
  const [camOn, setCamOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  useEffect(() => {
    const container = host.current;
    if (!container || !def) return;
    if (def.engine === "webcam" && !camOn) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];
    const canvas = document.createElement("canvas");
    canvas.className = "textmode-canvas";
    container.appendChild(canvas);
    cleanups.push(() => canvas.remove());

    (async () => {
      if (def.engine === "studio") {
        const { mountStudioMedia, normalizeStudioSettings } = await import("asciify-engine/studio");
        if (disposed) return;
        const { src, fit } = makeSource(SOURCE_WIDTH);
        const sctx = src.getContext("2d")!;
        const paint = painters[def.source]();
        const tracker = createPointerTracker(canvas);
        cleanups.push(() => tracker.destroy());

        // Demos con scroll: el progreso cambia ajustes Studio (solo cuando el parche cambia)
        let live: { update: (patch: StudioInput) => void } | undefined;
        let lastPatch = "";

        const media = {
          source: src,
          width: src.width,
          height: src.height,
          duration: 0,
          animated: true,
          seek: async () => {},
          frame: (time: number) => {
            tracker.update(time);
            if (def.scroll && live) {
              const r = def.scroll(scrollState);
              const key = JSON.stringify(r.patch);
              if (key !== lastPatch) {
                lastPatch = key;
                live.update(r.patch);
              }
              if (r.label !== undefined) scrollState.label = r.label;
            }
            paint(sctx, src.width, src.height, time, tracker.pointer);
            return src;
          },
          destroy: () => {},
        };

        const player = mountStudioMedia(canvas, media, {
          settings: normalizeStudioSettings(def.settings),
          width: window.innerWidth,
          height: window.innerHeight,
          fps: 60,
          onError: (e) => console.error("[asciify]", e),
        });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        player.resize(window.innerWidth, window.innerHeight, dpr);
        live = player;
        cleanups.push(() => player.destroy());

        const onResize = () => {
          fit();
          media.width = src.width;
          media.height = src.height;
          player.resize(window.innerWidth, window.innerHeight, dpr);
        };
        window.addEventListener("resize", onResize);
        cleanups.push(() => window.removeEventListener("resize", onResize));
      } else if (def.engine === "core") {
        const { imageToAsciiFrame, renderFrameToCanvas, DEFAULT_OPTIONS, HOVER_PRESETS } = await import(
          "asciify-engine/core"
        );
        if (disposed) return;
        const { src, fit } = makeSource(480);
        const sctx = src.getContext("2d")!;
        const ctx = canvas.getContext("2d")!;
        const paint = painters[def.source]();
        const tracker = createPointerTracker(canvas);
        cleanups.push(() => tracker.destroy());
        const opts = {
          ...DEFAULT_OPTIONS,
          fontSize: def.fontSize,
          ...def.options,
          ...HOVER_PRESETS[def.preset].options,
        };

        let W = 0;
        let H = 0;
        const size = () => {
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = W;
          canvas.height = H;
          fit();
        };
        size();
        window.addEventListener("resize", size);
        cleanups.push(() => window.removeEventListener("resize", size));

        const start = performance.now();
        let last = 0;
        let raf = 0;
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          if (now - last < 1000 / 30) return; // 30 fps bastan y ahorran CPU
          last = now;
          const time = (now - start) / 1000;
          tracker.update(time);
          const p = tracker.pointer;
          paint(sctx, src.width, src.height, time, p);
          const { frame } = imageToAsciiFrame(src, opts, W, H);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, W, H);
          renderFrameToCanvas(ctx, frame, opts, W, H, time, { x: p.x * W, y: p.y * H, intensity: 1 });
        };
        raf = requestAnimationFrame(tick);
        cleanups.push(() => cancelAnimationFrame(raf));
      } else if (def.engine === "tile") {
        const { renderTextBackground } = await import("asciify-engine/core");
        if (disposed) return;
        const ctx = canvas.getContext("2d")!;
        const tracker = createPointerTracker(canvas);
        cleanups.push(() => tracker.destroy());

        let W = 0;
        let H = 0;
        const size = () => {
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = W;
          canvas.height = H;
        };
        size();
        window.addEventListener("resize", size);
        cleanups.push(() => window.removeEventListener("resize", size));

        const start = performance.now();
        let last = 0;
        let raf = 0;
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          if (now - last < 1000 / 40) return;
          last = now;
          tracker.update((now - start) / 1000);
          const p = tracker.pointer;
          const st = textStore.get();
          ctx.fillStyle = "#05060c";
          ctx.fillRect(0, 0, W, H);
          renderTextBackground(
            ctx,
            W,
            H,
            `${textStore.text()} · `,
            {
              fontSize: def.fontSize,
              color: def.color,
              opacity: 150,
              hoverEffect: st.effect as HoverEffect,
              hoverStrength: 0.9,
              hoverRadius: 0.2,
              hoverColor: def.hoverColor,
            },
            { x: p.x, y: p.y, intensity: 1 },
          );
        };
        raf = requestAnimationFrame(tick);
        cleanups.push(() => cancelAnimationFrame(raf));
      } else {
        const { asciifyWebcam } = await import("asciify-engine/core");
        if (disposed) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        try {
          const stop = await asciifyWebcam(canvas, {
            fontSize: def.fontSize,
            mirror: true,
            options: def.options,
            dpr: 1,
          });
          if (disposed) stop();
          else cleanups.push(stop);
        } catch (err) {
          if (!disposed) {
            setCamError(err instanceof Error ? err.message : "No se pudo acceder a la cámara");
            setCamOn(false);
          }
        }
      }
    })().catch((err) => console.error("[asciify] error al iniciar", err));

    return () => {
      disposed = true;
      cleanups.reverse().forEach((fn) => {
        try {
          fn();
        } catch {
          /* ya liberado */
        }
      });
    };
  }, [slug, def, camOn]);

  return (
    <>
      <div ref={host} className="stage" aria-hidden />
      {def?.engine === "webcam" && !camOn && (
        <div className="cam-gate">
          <button
            className="cam-gate__btn"
            onClick={() => {
              setCamError(null);
              setCamOn(true);
            }}
          >
            Activar cámara
          </button>
          <p>La imagen se procesa en tu navegador y no se envía a ningún sitio.</p>
          {camError && <p className="cam-gate__error">{camError}</p>}
        </div>
      )}
    </>
  );
}
