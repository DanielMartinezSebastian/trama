import * as THREE from "three";
import { RenderPipeline, type Camera, type Node, type Object3D, type WebGPURenderer } from "three/webgpu";
import { Fn, clamp, distance, dot, float, floor, fract, max, mix, mx_fractal_noise_float, mx_noise_float, pass, sRGBTransferEOTF, sin, sqrt, step, time, uniform, uv, vec2, vec3, vec4, viewportSize } from "three/tsl";

/*
 * Composición del grabado (`lib/gravure`, docs/32 §1), la de chartogne-taillet.com: lee lo que deja el material de
 * lápiz (r normal, g lápiz, b cercanía) y pinta papel y lápiz.
 *   - lápiz sobre papel según g;
 *   - contornos: Sobel 3 × 3 sobre r con un paso que engorda con la cercanía (`anchoLinea` · 0,5 + b píxeles);
 *   - aparición por baldosas (`progreso`, 0–1): ruido más una rejilla de azar que deja entrar el dibujo a trozos, como
 *     la intro de la referencia (frecuencias 2 × 6 y rejilla 3,8 × 10);
 *   - grano, viñeta que se funde con el papel y la fibra del papel (procedural: la referencia usa una textura).
 * Valores medidos: papel #fff5dd, lápiz #8c887d, umbral de contorno 0,5, ancho 0,5, viñeta 1,8 con −0,28, grano 0,123,
 * papel al 25 %.
 */

export type OpcionesGrabado = {
  papel?: string;
  lapiz?: string;
  anchoLinea?: number;
  umbral?: number;
  vineta?: number;
  vinetaDesplazamiento?: number;
  grano?: number;
  fibra?: number;
};

export const GRABADO_CHARTOGNE: Required<OpcionesGrabado> = { papel: "#fff5dd", lapiz: "#8c887d", anchoLinea: 0.5, umbral: 0.5, vineta: 1.8, vinetaDesplazamiento: -0.28, grano: 0.123, fibra: 0.25 };

/** el fondo con el que hay que limpiar la escena: normal neutra, sin lápiz, lejos */
export const FONDO_GRABADO = new THREE.Color(0.5, 0, 0);

type V2 = Node<"vec2">;
const azar = (p: V2) => fract(sin(dot(p, vec2(12.9898, 78.233))).mul(43758.5453));

/**
 * La pila del grabado para un WebGPURenderer. `progreso` (0–1) controla la aparición por baldosas; `colores()` cambia
 * papel y lápiz sin recompilar. En cada fotograma, `pipeline.render()` en lugar de `renderer.render()`.
 */
export function pilaGrabado(renderer: WebGPURenderer, scene: Object3D, camera: Camera, op: OpcionesGrabado = {}) {
  const o = { ...GRABADO_CHARTOGNE, ...op };
  // la referencia compone en el espacio de la pantalla (sin convertir): los colores van tal cual y se pasa a lineal al final
  const crudo = (css: string) => new THREE.Color(css).convertLinearToSRGB();
  const papel = uniform(crudo(o.papel));
  const lapiz = uniform(crudo(o.lapiz));
  const progreso = uniform(1);
  const p = new RenderPipeline(renderer);
  const escena = pass(scene, camera);
  const tex = escena.getTextureNode("output");

  p.outputNode = Fn(() => {
    const u = uv();
    const base = tex.sample(u);
    const paso = vec2(1).div(viewportSize).mul(base.z.add(o.anchoLinea * 0.5));
    const t = (x: number, y: number) => tex.sample(u.add(paso.mul(vec2(x, y)))).x;
    const a = t(-1, -1), b = t(0, -1), c = t(1, -1), d = t(-1, 0), f = t(1, 0), g = t(-1, 1), h = t(0, 1), i = t(1, 1);
    const gx = c.add(f.mul(2)).add(i).sub(a).sub(d.mul(2)).sub(g);
    const gy = g.add(h.mul(2)).add(i).sub(a).sub(b.mul(2)).sub(c);
    const contorno = sqrt(gx.mul(gx).add(gy.mul(gy))).mul(1 + o.umbral).sub(o.umbral);

    // aparición por baldosas: ruido suave más un desfase por celda de una rejilla; el dibujo entra a trozos
    const ruido = mx_noise_float(u.mul(vec2(2, 6)).mul(3)).mul(0.5).add(0.5);
    const celda = azar(floor(u.mul(vec2(3.8, 10))));
    const entra = step(0.5, float(1).add(celda).add(ruido).sub(float(1).sub(progreso).mul(3)));

    const trazo = clamp(base.y, 0, 1).mul(entra);
    const col = mix(papel, lapiz, trazo).toVar();
    col.assign(mix(col, lapiz, clamp(contorno.mul(entra), 0, 1)));
    col.addAssign(azar(u.mul(100).add(time.mod(100))).sub(0.5).mul(o.grano));
    const v = clamp(distance(u, vec2(0.5)).mul(o.vineta).add(o.vinetaDesplazamiento), 0, 1);
    const vs = sin(v.sub(0.5).mul(Math.PI)).mul(0.5).add(0.5);
    col.assign(mix(col, papel, vs));
    // fibra del papel: ruido fractal a escala de píxel (la referencia: textura de 256 px al 25 %)
    const pix = u.mul(viewportSize);
    const fibra = clamp(mx_fractal_noise_float(vec3(pix.div(vec2(9, 3)), 0), 3, 2, 0.5).mul(0.25).add(0.85), 0, 1);
    col.assign(mix(lapiz, col, fibra.mul(o.fibra).add(1 - o.fibra)));
    return (sRGBTransferEOTF(vec4(max(col, vec3(0)), 1)) as Node<"vec4">).xyz;
  })();

  return {
    pipeline: p,
    progreso,
    colores(pap: string, lap: string) {
      papel.value.copy(crudo(pap));
      lapiz.value.copy(crudo(lap));
    },
    render: () => p.render(),
    dispose: () => p.dispose(),
  };
}
