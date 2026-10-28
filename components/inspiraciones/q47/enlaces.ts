/** ruta dentro de Q47: `q47Href("trabajo")` → `/inspiraciones/q47/trabajo` */
export const q47Href = (path = "") => `/inspiraciones/q47${path ? `/${path.replace(/^\//, "")}` : ""}`;
