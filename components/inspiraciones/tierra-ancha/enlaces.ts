/** ruta dentro de Tierra Ancha: `anchaHref("planifica")` → `/inspiraciones/tierra-ancha/planifica` */
export const anchaHref = (path = "") => `/inspiraciones/tierra-ancha${path ? `/${path.replace(/^\//, "")}` : ""}`;
