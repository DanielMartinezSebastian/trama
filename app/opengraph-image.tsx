import { ImageResponse } from "next/og";
import catalog from "@/docs/catalog.json";
import { demos } from "@/lib/demos";

export const alt = "Trama: librería de componentes ASCII, textmode y pixel art para Next.js";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// rejilla de puntos del fondo (el filtro dot matrix de la portada, en estático)
const DOTS = Array.from({ length: 11 * 15 }, (_, i) => {
  const x = i % 15;
  const y = Math.floor(i / 15);
  const d = Math.hypot(x - 7, y - 5);
  return { x, y, o: Math.max(0, 0.55 - d * 0.07) };
});

/** Vista previa al compartir cualquier página: la portada en una imagen (negro, TRAMA enorme, rojo como único acento). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#ededed", padding: "56px 64px", position: "relative", fontFamily: "monospace" }}>
        <div style={{ position: "absolute", right: 40, top: 70, display: "flex", flexWrap: "wrap", width: 15 * 34 }}>
          {DOTS.map((d) => (
            <div key={`${d.x}-${d.y}`} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: "#ededed", opacity: d.o }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 8, color: "#8a8a8a" }}>
          <div style={{ width: 16, height: 16, background: "#ff3b3b" }} />
          LIBRERÍA DE COMPONENTES · NEXT.JS
        </div>
        <div style={{ display: "flex", fontSize: 250, fontWeight: 900, letterSpacing: -18, lineHeight: 0.8, fontFamily: "sans-serif" }}>TRAMA</div>
        <div style={{ display: "flex", gap: 56, fontSize: 24, letterSpacing: 4, color: "#8a8a8a", borderTop: "2px dashed #333", paddingTop: 24 }}>
          <span style={{ color: "#ededed" }}>{catalog.components.length} COMPONENTES</span>
          <span>{catalog.styles.length} ESTILOS</span>
          <span>{demos.length} DEMOS</span>
          <span style={{ color: "#ff3b3b" }}>npm i trama-ui</span>
        </div>
      </div>
    ),
    size,
  );
}
