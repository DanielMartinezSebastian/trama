import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
