/** ruta dentro de Pausa: `pausaHref("consulta")` → `/inspiraciones/pausa/consulta` */
export const pausaHref = (path = "") => `/inspiraciones/pausa${path ? `/${path.replace(/^\//, "")}` : ""}`;
