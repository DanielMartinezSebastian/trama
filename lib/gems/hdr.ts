/**
 * El HDR de estudio de las gemas: «Aerodynamics Workshop» (Poly Haven, CC0) como cubemap. Es lo que hace que una piedra
 * trazada (`gemMaterial.ts`) parezca de verdad: las facetas devuelven ventanas, lámparas y sombras reales en vez de una caja
 * de luz plana (`environment.ts`, el respaldo mientras carga).
 */
import { EquirectangularReflectionMapping, HalfFloatType, Vector3, WebGLCubeRenderTarget, type Texture, type WebGLRenderer } from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

export const GEM_HDR = "/models/hdr/aerodynamics_workshop_1k.hdr";

/** Diamante «de escaparate»: índice alto y canales separados (como el ior 2,75 del ejemplo de pmndrs) para que el fuego se
 * vea. Más reflexión interna total y más dispersión que el real (2,407–2,451). */
export const SHOW_DIAMOND_IOR = new Vector3(2.65, 2.75, 2.88);

/** Carga el HDR como cubemap y lo entrega a `done`. Devuelve la limpieza (para un `useEffect`). */
export function loadGemHdr(gl: WebGLRenderer, done: (t: Texture) => void): () => void {
  let rt: WebGLCubeRenderTarget | null = null;
  let live = true;
  new HDRLoader().load(GEM_HDR, (tex) => {
    if (!live) return tex.dispose();
    tex.mapping = EquirectangularReflectionMapping;
    rt = new WebGLCubeRenderTarget(512, { type: HalfFloatType }).fromEquirectangularTexture(gl, tex);
    tex.dispose();
    done(rt.texture);
  });
  return () => {
    live = false;
    rt?.dispose();
  };
}
