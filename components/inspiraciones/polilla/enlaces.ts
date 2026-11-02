/** ruta dentro de Polilla: `polillaHref("libros")` → `/inspiraciones/polilla/libros` */
export const polillaHref = (path = "") => `/inspiraciones/polilla${path ? `/${path.replace(/^\//, "")}` : ""}`;
