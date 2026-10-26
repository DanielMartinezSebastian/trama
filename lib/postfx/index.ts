import { RenderPipeline, type Camera, type Object3D, type WebGPURenderer } from "three/webgpu";
import { float, pass, smoothstep, uniform, uv } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { dof } from "three/addons/tsl/display/DepthOfFieldNode.js";
import { chromaticAberration } from "three/addons/tsl/display/ChromaticAberrationNode.js";
import { film } from "three/addons/tsl/display/FilmNode.js";
import { fxaa } from "three/addons/tsl/display/FXAANode.js";
import { smaa } from "three/addons/tsl/display/SMAANode.js";
import type { Pase } from "../cine/schema";

/**
 * Pila de posprocesado en TSL para un WebGPURenderer (también con su reserva WebGL2), sin dependencias y sin WebAssembly:
 * la de la ficha de escena (`Pase[]` de lib/cine/schema), en su orden. Validada en el banco de cine contra el ejemplo de
 * bloom de three (SSIM 0,996, docs/26 §6). Pases: bloom, dof, aberración cromática, grano, viñeta, FXAA y SMAA; el resto
 * se avisa y se salta.
 *
 *   const pipeline = pilaTSL(renderer, scene, camera, [{ tipo: "bloom", fuerza: 1, radio: 0.2, umbral: 0.8 }]);
 *   // en cada fotograma, en lugar de renderer.render(scene, camera):
 *   pipeline.render();
 */
export function pilaTSL(renderer: WebGPURenderer, scene: Object3D, camera: Camera, pases: Pase[]): RenderPipeline {
  const p = new RenderPipeline(renderer);
  const escena = pass(scene, camera);
  const color = escena.getTextureNode("output");
  // cualquier nodo de TSL vale como salida; el tipado de cada paso cambia, así que se lleva como el de `color`
  let out = color as typeof color;
  for (const x of pases) {
    if (x.tipo === "bloom") out = out.add(bloom(color, x.fuerza, x.radio, x.umbral)) as typeof color;
    else if (x.tipo === "dof") out = dof(out, escena.getViewZNode(), uniform(x.foco), uniform(x.focal), uniform(x.bokeh)) as unknown as typeof color;
    else if (x.tipo === "aberracion") out = chromaticAberration(out, uniform(x.fuerza)) as unknown as typeof color;
    else if (x.tipo === "grano") out = film(out, float(x.intensidad)) as unknown as typeof color;
    else if (x.tipo === "vineta") {
      // oscurece hacia los bordes: `fuerza` estira el radio, `suavidad` ensancha la transición
      const d = uv().sub(0.5).length();
      out = out.mul(float(1).sub(smoothstep(float(0.5 - x.suavidad * 0.5), float(0.5 + x.suavidad * 0.5), d.mul(x.fuerza * 2)))) as typeof color;
    } else if (x.tipo === "aa" && x.metodo === "fxaa") out = fxaa(out) as unknown as typeof color;
    else if (x.tipo === "aa" && x.metodo === "smaa") out = smaa(out) as unknown as typeof color;
    else console.warn(`[postfx] pase aún no soportado: ${x.tipo}`);
  }
  p.outputNode = out;
  return p;
}
