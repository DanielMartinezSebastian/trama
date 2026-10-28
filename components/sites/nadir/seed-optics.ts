import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
import { COLORS } from "./data";

/** Procedural optical textures, no external image requests. */
function texture(kind: "halo" | "streak" | "ghost") {
  const size = 128, data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = (x - 63.5) / 63.5, v = (y - 63.5) / 63.5, r = Math.hypot(u, v);
    let alpha: number;
    if (kind === "streak") alpha = Math.exp(-Math.abs(v) * 145) * Math.exp(-Math.abs(u) * 2.2) + Math.exp(-r * 19) * .25;
    else if (kind === "ghost") alpha = Math.exp(-Math.pow((r - .62) / .035, 2)) * .42 + Math.max(0, 1 - r) ** 3 * .09;
    else alpha = Math.exp(-r * 5.5) + Math.exp(-r * 28) * 2;
    const i = (y * size + x) * 4; data[i] = data[i + 1] = data[i + 2] = 255;
    data[i + 3] = Math.round(Math.min(1, alpha) * 255);
  }
  const result = new THREE.DataTexture(data, size, size); result.needsUpdate = true;
  result.minFilter = THREE.LinearFilter; result.magFilter = THREE.LinearFilter; return result;
}

/** Three's depth-tested framebuffer occlusion keeps the flare behind closed shells. */
export function createSeedOptics() {
  const textures = [texture("halo"), texture("streak"), texture("ghost")];
  const flare = new Lensflare(); flare.name = "destello-optico"; flare.userData.previewOnly = true;
  flare.position.set(0, .18, .28); flare.visible = false;
  // Preserve canvas alpha: additive ghosts must brighten the CSS atmosphere, not mask it.
  const renderFlare = flare.onBeforeRender;
  flare.onBeforeRender = function (renderer, ...args) {
    const gl = renderer.getContext();
    const mask = gl.getParameter(gl.COLOR_WRITEMASK) as boolean[];
    gl.colorMask(true, true, true, false);
    try { renderFlare.call(this, renderer, ...args); }
    finally { gl.colorMask(mask[0], mask[1], mask[2], mask[3]); }
  };
  const baseColors = [COLORS.ice, COLORS.signal, COLORS.copper, COLORS.signal, COLORS.ice].map(c => new THREE.Color(c));
  const elements = [
    new LensflareElement(textures[0], 230, 0, baseColors[0].clone()),
    new LensflareElement(textures[1], 1000, 0, baseColors[1].clone()),
    new LensflareElement(textures[2], 85, .45, baseColors[2].clone()),
    new LensflareElement(textures[2], 150, .8, baseColors[3].clone()),
    new LensflareElement(textures[0], 35, 1.1, baseColors[4].clone()),
  ];
  elements.forEach(e => flare.addElement(e));
  return {
    flare,
    update(power: number, width: number, height: number, dpr: number) {
      const p = Math.max(0, Math.min(1.5, power));
      flare.visible = p > .025;
      const scale = Math.min(width / 1280, height / 720, 1.25) * dpr;
      const sizes = [240 + p * 100, 930 + p * 270, 75, 125, 32];
      elements.forEach((element, i) => {
        element.size = sizes[i] * scale;
        element.color.copy(baseColors[i]).multiplyScalar(p * (i < 2 ? 1.9 : .34));
      });
      flare.userData.power = p;
    },
    dispose() { flare.removeFromParent(); flare.dispose(); textures.forEach(t => t.dispose()); },
  };
}
