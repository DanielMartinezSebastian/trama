/** ruta dentro de Ahora: `ahoraHref("cursos")` → `/inspiraciones/ahora/cursos` */
export const ahoraHref = (path = "") => `/inspiraciones/ahora${path ? `/${path.replace(/^\//, "")}` : ""}`;
