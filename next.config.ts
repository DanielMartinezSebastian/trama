import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/*
 * CSP sin nonce (Next la documenta así para sitios estáticos): un nonce obligaría a renderizar todas las páginas de
 * forma dinámica. Por eso `script-src` lleva 'unsafe-inline' (la hidratación de Next usa scripts en línea); lo demás
 * sí queda cerrado. En desarrollo no se aplica: el HMR de Turbopack necesita eval y websockets.
 *
 * Lo que necesita esta web y por qué:
 * - img-src: blob:/data: (lienzos WebGL/textmode, ilustraciones SVG generadas) e i.ytimg.com (la miniatura de un
 *   VideoPlayer de YouTube antes de darle a play) y res.cloudinary.com (fotos y vídeo de ejemplo de la landing FACETA y
 *   de las galerías del catálogo).
 * - frame-src: YouTube sin cookies y Vimeo (solo aparecen al pulsar play en un VideoPlayer, EmbedFrame) y 'self': los
 *   mockups de dispositivo (DeviceMockup) muestran las demos de esta misma web en un iframe. Por eso frame-ancestors y
 *   X-Frame-Options permiten el mismo origen y nada más: ninguna otra web puede incrustar esta.
 * - media-src: el <video> de /video, el vídeo de ejemplo de Cloudinary y blob: para los motores de caracteres que leen
 *   el vídeo.
 * - connect-src: 'self' para los modelos de /models; data:/blob: porque three.js carga los buffers embebidos de un
 *   glTF con fetch("data:…").
 * - worker-src blob:: three.js, textmode.js y asciify pueden crear workers desde blobs.
 *
 * Quien copie el kit a otra web y use VideoPlayer o DeviceMockup con otros orígenes tendrá que ampliar frame-src / img-src / media-src.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://i.ytimg.com https://res.cloudinary.com",
  "font-src 'self' data:",
  "media-src 'self' blob: data: https://res.cloudinary.com",
  "connect-src 'self' data: blob:",
  "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: csp }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Rutas antiguas de las landings "minimal": ahora solo viven en /demo/<slug>, junto al resto de la galería.
  async redirects() {
    return [
      { source: "/minimal", destination: "/demo/th-minimal", permanent: true },
      { source: "/faceta", destination: "/demo/th-faceta", permanent: true },
      { source: "/geometria", destination: "/demo/th-geometry", permanent: true },
    ];
  },
};

export default nextConfig;
