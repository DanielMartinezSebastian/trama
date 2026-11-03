/** ruta dentro de Trocha: `trochaHref("moto")` → `/inspiraciones/trocha/moto` */
export const trochaHref = (path = "") => `/inspiraciones/trocha${path ? `/${path.replace(/^\//, "")}` : ""}`;
