/** ruta dentro de Nura: `nuraHref("arte")` → `/inspiraciones/nura/arte` */
export const nuraHref = (path = "") => `/inspiraciones/nura${path ? `/${path.replace(/^\//, "")}` : ""}`;
