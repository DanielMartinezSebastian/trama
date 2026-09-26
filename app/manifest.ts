import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trama · librería de componentes para Next.js",
    short_name: "Trama",
    description: "Componentes ASCII, textmode, pixel art y secciones de landing para Next.js.",
    lang: "es",
    start_url: "/",
    display: "browser",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
