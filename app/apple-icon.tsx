import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icono de pantalla de inicio (iOS): la «T» de app/icon.svg con el cuadrado rojo de la marca. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#000", position: "relative" }}>
        <div style={{ position: "absolute", left: 34, top: 34, width: 112, height: 28, background: "#ededed" }} />
        <div style={{ position: "absolute", left: 76, top: 62, width: 28, height: 84, background: "#ededed" }} />
        <div style={{ position: "absolute", left: 124, top: 118, width: 28, height: 28, background: "#ff3b3b" }} />
      </div>
    ),
    size,
  );
}
