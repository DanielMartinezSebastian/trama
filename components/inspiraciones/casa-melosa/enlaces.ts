/** ruta dentro de Casa Melosa: `melosaHref("tienda")` → `/inspiraciones/casa-melosa/tienda` */
export const melosaHref = (path = "") => `/inspiraciones/casa-melosa${path ? `/${path.replace(/^\//, "")}` : ""}`;
