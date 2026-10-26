import * as THREE from "three";
import { MeshBasicNodeMaterial, type Node } from "three/webgpu";
import { dot, exp, float, floor, fract, length, max, mix, normalWorld, normalize, positionWorld, sin, smoothstep, step, uv, vec2, vec3 } from "three/tsl";

/*
 * La cabina: el panel interior con la ventanilla (un hueco redondeado con su marco de 11 cm), la chapa exterior con el
 * hueco del cristal y el cristal con polvo. Medidas de Hublot (docs/28): cristal en z −1,925, hueco de 0,21 × 0,33 m
 * centrado en x −1,455, marco interior hasta z −1,835. Sin luces: la ventanilla es la única fuente (una luz de área con
 * el color del cielo), así el panel se apaga lejos de ella y el marco brilla donde mira al hueco.
 */

export const VENTANILLA = { x: -1.47, y: 0, ancho: 0.21, alto: 0.33, radio: 0.09, cristal: -1.925, interior: -1.835, exterior: -1.971 };

/** rectángulo redondeado centrado en (cx, cy) */
function redondeado(forma: THREE.Shape | THREE.Path, cx: number, cy: number, w: number, h: number, r: number) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  r = Math.min(r, w / 2, h / 2);
  forma.moveTo(x + r, y);
  forma.lineTo(x + w - r, y);
  forma.quadraticCurveTo(x + w, y, x + w, y + r);
  forma.lineTo(x + w, y + h - r);
  forma.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  forma.lineTo(x + r, y + h);
  forma.quadraticCurveTo(x, y + h, x, y + h - r);
  forma.lineTo(x, y + r);
  forma.quadraticCurveTo(x, y, x + r, y);
  return forma;
}

/** panel interior: una pared con el hueco ensanchado hacia dentro (el marco en bisel) */
export function geometriaPanel() {
  const v = VENTANILLA;
  const pared = new THREE.Shape();
  pared.moveTo(-6, -1.2).lineTo(4, -1.2).lineTo(4, 1.2).lineTo(-6, 1.2).lineTo(-6, -1.2);
  // el hueco del lado de la cabina, más grande que el del cristal: el bisel lo une
  pared.holes.push(redondeado(new THREE.Path(), v.x, v.y, v.ancho + 0.07, v.alto + 0.08, v.radio + 0.035));
  const g = new THREE.ExtrudeGeometry(pared, { depth: v.interior - v.exterior - 0.06, bevelEnabled: true, bevelThickness: 0.03, bevelSize: -0.03, bevelSegments: 6, curveSegments: 32 });
  g.translate(0, 0, v.exterior + 0.03);
  return g;
}

/** chapa exterior con el hueco del cristal */
export function geometriaChapa() {
  const v = VENTANILLA;
  const s = new THREE.Shape();
  s.moveTo(-6, -1.2).lineTo(4, -1.2).lineTo(4, 1.2).lineTo(-6, 1.2).lineTo(-6, -1.2);
  s.holes.push(redondeado(new THREE.Path(), v.x, v.y, v.ancho, v.alto, v.radio));
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.022, bevelEnabled: false, curveSegments: 32 });
  g.translate(0, 0, v.exterior);
  return g;
}

/** el cristal */
export function geometriaCristal() {
  const v = VENTANILLA;
  const g = new THREE.ShapeGeometry(redondeado(new THREE.Shape(), v.x, v.y, v.ancho + 0.01, v.alto + 0.01, v.radio) as THREE.Shape, 32);
  g.translate(0, 0, v.cristal);
  // uv en metros alrededor del centro del cristal (para el polvo)
  const p = g.attributes.position;
  const uvs = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uvs[i * 2] = p.getX(i) - v.x;
    uvs[i * 2 + 1] = p.getY(i) - v.y;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return g;
}

/**
 * Material del panel: tela o plástico azul marino iluminado solo por la ventanilla (luz de área con el color medio del
 * cielo que se ve por ella): difuso por la dirección al hueco y caída con la distancia.
 */
export function materialPanel(luzVentana: Node<"vec3">, color = new THREE.Color("#0a1a33")) {
  const v = VENTANILLA;
  const m = new MeshBasicNodeMaterial({ side: THREE.FrontSide });
  const centro = vec3(v.x, v.y, v.cristal);
  const L = centro.sub(positionWorld);
  const d = length(L);
  const difuso = max(dot(normalize(normalWorld), normalize(L)), 0);
  const caida = exp(d.mul(d).div(-0.035));
  m.colorNode = vec3(color.r, color.g, color.b).mul(luzVentana).mul(difuso.mul(0.98).add(0.02)).mul(caida).mul(1.8);
  return m;
}

/** cristal: casi transparente, con motas de polvo que el resplandor ilumina (aditivo) */
export function materialCristal(resplandor: Node<"vec3">) {
  const m = new MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const p = uv().mul(140);
  const c = floor(p);
  const h = fract(sin(vec2(dot(c, vec2(127.1, 311.7)), dot(c, vec2(269.5, 183.3)))).mul(43758.5453));
  const r = float(0.08).add(h.y.mul(0.25));
  const dd = length(fract(p).sub(h.mul(0.5).add(0.25))).div(r);
  const mota = smoothstep(1, 0.3, dd).mul(h.x.add(0.3)).mul(step(0.95, h.x));
  m.colorNode = resplandor.mul(mota).mul(0.006).add(mix(vec3(0), resplandor, 0.004));
  return m;
}
