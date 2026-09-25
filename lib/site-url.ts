/**
 * URL pública de la web (para metadataBase, sitemap y robots). Orden: `NEXT_PUBLIC_SITE_URL` (p. ej.
 * https://trama.dev), el dominio de producción que da Vercel, y en local http://localhost:3000.
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/$/, "");
