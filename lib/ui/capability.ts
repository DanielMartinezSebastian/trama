/** Comprobaciones de equipo para los componentes con WebGL opcional (`DeviceMockup3D`, `Logo3D`). Solo en el navegador. */

let webgl: boolean | null = null;

/** ¿se puede crear un contexto WebGL2? Se comprueba una vez por página */
export function hasWebGL(): boolean {
  if (webgl !== null) return webgl;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    webgl = Boolean(gl);
  } catch {
    webgl = false;
  }
  return webgl;
}

/** equipo modesto o que pide ahorrar datos: poca memoria, pocos núcleos o `Save-Data` */
export function lowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2;
}
