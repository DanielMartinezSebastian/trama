/**
 * El entorno de las gemas: una caja de luz de estudio de joyería (paneles muy por encima del blanco, que son los destellos
 * de las facetas, y banderas negras, que dan el patrón oscuro), en un cubemap sin PMREM. El material con trazado de rayos
 * (`gemMaterial.ts`) lo muestrea con la dirección exacta de cada rayo que sale de la piedra.
 */
import { Color, CubeCamera, HalfFloatType, Mesh as ThreeMesh, MeshBasicMaterial, PlaneGeometry, Scene, WebGLCubeRenderTarget, type Texture, type WebGLRenderer } from "three";

export function createGemEnvironment(gl: WebGLRenderer): { texture: Texture; dispose: () => void } {
  const scene = new Scene();
  // caja de luz gris (brillo, GIA: la luz difusa da el brillo) con paneles fuertes y banderas negras (el patrón oscuro)
  scene.background = new Color(0.42, 0.42, 0.43);
  const geo = new PlaneGeometry(1, 1);
  // paneles más intensos que el blanco (HDR): son los que se ven como destellos en las facetas
  const mat = new MeshBasicMaterial({ color: new Color(1, 1, 1).multiplyScalar(9) });
  const panels: [number, number, number, number, number][] = [
    [0, 6, 0, 3.2, 3.2],
    [5, 3, 3, 1.4, 2.6],
    [-5, 3, 3, 1.4, 2.6],
    [4, 1, -4, 2.2, 1.2],
    [-4, 3, -4, 1.2, 2.2],
    [0, 0.5, 6, 4.5, 0.7],
    [6, -1, 0, 0.8, 3],
    [-6, -1, 0, 0.8, 3],
    [2.5, 5, 3, 1, 1],
    [-2.5, 5, -3, 1, 1],
  ];
  const flag = new MeshBasicMaterial({ color: 0x000000 });
  const flags: [number, number, number, number, number][] = [
    [0, 1.5, 6, 6, 1.2],
    [6, 1, -2, 1.2, 4],
    [-6, 1, -2, 1.2, 4],
    [0, -4, -5, 7, 2],
    [-4, -2, 4, 2, 1.5],
  ];
  const add = (list: [number, number, number, number, number][], m0: MeshBasicMaterial) =>
    list.forEach(([x, y, z, w, h]) => {
      const m = new ThreeMesh(geo, m0);
      m.position.set(x, y, z);
      m.scale.set(w, h, 1);
      m.lookAt(0, 0, 0);
      scene.add(m);
    });
  add(flags, flag);
  add(panels, mat);
  // cubemap (no PMREM): el shader de la gema lo muestrea con la dirección exacta de cada rayo que sale de la piedra
  const rt = new WebGLCubeRenderTarget(256, { type: HalfFloatType });
  new CubeCamera(0.1, 50, rt).update(gl, scene);
  return { texture: rt.texture as Texture, dispose: () => { rt.dispose(); geo.dispose(); mat.dispose(); flag.dispose(); } };
}
