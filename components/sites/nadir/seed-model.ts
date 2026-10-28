import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { COLORS } from "./data";
import { seedMechanism, SEED_MECHANICS } from "./seed-motion";

/** Source of truth shared by the live scene, GLB exporter and construction drawings. */
export const SEED = { petals: 6, height: 5.4, radius: 1.32, thickness: .095, collarRadius: 1.49, segments: 12 } as const;
export type SeedPose = { open: number; explode: number; twist: number; pulse: number; reveal: number; energy?: number; flash?: number };
export type SeedArtifact = ReturnType<typeof createSeedArtifact>;
const TAU = Math.PI * 2;

function noise(x: number, y: number, seed: number) {
  const hash = (a: number, b: number) => { const v = Math.sin(a * 127.1 + b * 311.7 + seed * 37.9) * 43758.5453; return v - Math.floor(v); };
  const ix = Math.floor(x), iy = Math.floor(y);
  const sx = x - ix, sy = y - iy, u = sx * sx * (3 - 2 * sx), v = sy * sy * (3 - 2 * sy);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), u), THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), u), v);
}

/** Deterministic UV maps. Each shell gets its own mineral veins and copper patina. */
function surface(name: string, copper: boolean, seed: number) {
  const size = 256, albedo = new Uint8Array(size * size * 4), packed = new Uint8Array(size * size * 4);
  const base = new THREE.Color(copper ? COLORS.copper : COLORS.mineral);
  // Texture RGB is stored in sRGB; material colours are converted by Three.
  base.convertLinearToSRGB();
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size, i = (y * size + x) * 4;
    const grain = noise(x * .9, y * .9, seed);
    const broad = noise(u * 7, v * 11, seed);
    const vein = Math.pow(Math.max(0, 1 - Math.abs(Math.sin(u * 30 + v * 19 + broad * 7)) * 7), 2);
    const brushed = Math.sin(v * 1300 + grain * 3) * .035;
    const shade = copper ? .52 + broad * .4 + brushed : .44 + broad * .7 + grain * .12;
    const oxide = copper ? Math.max(0, broad - .55) * 1.5 : vein * .48;
    const c = [base.r, base.g, base.b];
    const mineralVein = copper ? [.09, .25, .26] : [.57, .43, .26];
    for (let k = 0; k < 3; k++) albedo[i + k] = Math.min(255, Math.round((c[k] * shade * (1 - oxide) + mineralVein[k] * oxide) * 255));
    albedo[i + 3] = 255;
    // glTF metallic-roughness layout: G roughness, B metalness; R doubles as relief.
    packed[i] = Math.round((.35 + broad * .45 + vein * .15) * 255);
    packed[i + 1] = Math.round((copper ? .3 + broad * .25 : .48 + broad * .25) * 255);
    packed[i + 2] = Math.round((copper ? .85 : .5) * 255);
    packed[i + 3] = 255;
  }
  const color = new THREE.DataTexture(albedo, size, size); color.name = `${name}-color`; color.colorSpace = THREE.SRGBColorSpace; color.needsUpdate = true;
  const relief = new THREE.DataTexture(packed, size, size); relief.name = `${name}-surface`; relief.needsUpdate = true;
  for (const t of [color, relief]) { t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; }
  return new THREE.MeshStandardMaterial({ name, map: color, roughnessMap: relief, metalnessMap: relief, bumpMap: relief, bumpScale: copper ? .012 : .035, metalness: 1, roughness: 1 });
}

function profile(t: number) { return SEED.radius * Math.pow(Math.sin(Math.PI * t), .82) * (.9 + .1 * t); }
function shellPoint(u: number, t: number, inset = 0) {
  const angle = (u - .5) * (TAU / SEED.petals - .045);
  const r = Math.max(.035, profile(t) - inset);
  return new THREE.Vector3(Math.sin(angle) * r, (t - .5) * SEED.height, Math.cos(angle) * r);
}

/** Closed watertight shell with distinct outer, inner and edge material groups and UVs. */
export function seedShellGeometry() {
  const nu = 18, nv = 52, positions: number[] = [], uv: number[] = [], index: number[] = [];
  for (let layer = 0; layer < 2; layer++) for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const u = i / nu, t = .008 + (j / nv) * .984, p = shellPoint(u, t, layer * SEED.thickness);
    positions.push(...p.toArray()); uv.push(u, j / nv);
  }
  const stride = nu + 1, layerSize = stride * (nv + 1), groups: [number, number, number][] = [];
  for (let layer = 0; layer < 2; layer++) {
    const start = index.length;
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const a = layer * layerSize + j * stride + i, b = a + 1, c = a + stride, d = c + 1;
      index.push(...(layer === 0 ? [a, b, c, b, d, c] : [a, c, b, b, c, d]));
    }
    groups.push([start, index.length - start, layer]);
  }
  const edgeStart = index.length;
  // Stitch the two grids around the entire perimeter.
  const loop = [...Array.from({ length: nu }, (_, i) => i), ...Array.from({ length: nv }, (_, j) => j * stride + nu), ...Array.from({ length: nu }, (_, i) => nv * stride + nu - i), ...Array.from({ length: nv }, (_, j) => (nv - j) * stride)];
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i], b = loop[(i + 1) % loop.length], c = a + layerSize, d = b + layerSize;
    index.push(a, c, b, b, c, d);
  }
  groups.push([edgeStart, index.length - edgeStart, 2]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(index);
  for (const group of groups) geometry.addGroup(...group);
  geometry.computeVertexNormals(); geometry.computeBoundingSphere();
  geometry.name = "Valva maciza con interior y canto";
  return geometry;
}

function tube(points: THREE.Vector3[], radius: number, segments = 36) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 6, false);
}
function merged(parts: THREE.BufferGeometry[]) {
  const result = mergeGeometries(parts.map(p => p.index ? p.toNonIndexed() : p))!;
  parts.forEach(p => p.dispose()); return result;
}
function mesh(name: string, geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]) {
  const object = new THREE.Mesh(geometry, material); object.name = name; return object;
}

export function createSeedArtifact() {
  const root = new THREE.Group(); root.name = "nadir-semilla";
  root.userData = { version: 2, units: "metres", concept: "Semilla", height: SEED.height, rig: "collar lock; 6 extractable hinged shells; telescopic actuators; luminous memory core" };
  const trim = surface("Cantos y nervios de cobre", true, 92);
  const collarMaterial = surface("Collar de cobre patinado", true, 73);
  const light = new THREE.MeshStandardMaterial({ name: "Incrustaciones de señal", color: COLORS.signal, emissive: COLORS.signal, emissiveIntensity: 1.8, roughness: .25, metalness: .25 });
  const filament = new THREE.MeshStandardMaterial({ name: "Memoria incandescente", color: COLORS.ice, emissive: COLORS.signal, emissiveIntensity: 4, roughness: .3, metalness: 0, toneMapped: false });
  const glass = new THREE.MeshPhysicalMaterial({ name: "Agua de memoria", color: COLORS.signal, metalness: 0, roughness: .08, transmission: .78, thickness: .35, ior: 1.33, transparent: true, depthWrite: false, opacity: .48, clearcoat: .45, emissive: COLORS.signal, emissiveIntensity: .35 });
  const shellGeometry = seedShellGeometry();
  const petals: THREE.Group[] = [], collars: THREE.Group[] = [];
  // Ribs follow the exact inner shell profile, including the edge rails.
  const ribs: THREE.BufferGeometry[] = [];
  for (const u of [.035, .5, .965]) ribs.push(tube(Array.from({ length: 35 }, (_, i) => shellPoint(u, .1 + i / 34 * .8, SEED.thickness + .009)), u === .5 ? .022 : .016));
  for (let j = 0; j < 20; j++) {
    const t = .1 + j * .04;
    for (const direction of [-1, 1]) ribs.push(tube(Array.from({ length: 12 }, (_, k) => {
      const s = k / 11; return shellPoint(.5 + direction * s * .43, t + Math.sin(s * Math.PI / 2) * .055, SEED.thickness + .012);
    }), .009, 12));
  }
  const ribGeometry = merged(ribs);
  for (let i = 0; i < SEED.petals; i++) {
    const pivot = new THREE.Group(); pivot.name = `valva-${String(i + 1).padStart(2, "0")}-pivote`;
    pivot.userData = { part: "valva", index: i, axis: "local X", hinge: [0, SEED_MECHANICS.hingeY, 0], removable: true, maxAngle: SEED_MECHANICS.maxAngle };
    // Local pivot at the lower pole; child geometry is translated above it.
    const body = new THREE.Group(); body.position.set(0, -SEED_MECHANICS.hingeY, -SEED_MECHANICS.hingeRadius); body.name = `valva-${i + 1}-conjunto`;
    body.add(mesh(`valva-${i + 1}-casco-interior-canto`, shellGeometry, [surface(`Valva ${i + 1} mineral`, false, i + 1), surface(`Valva ${i + 1} interior`, true, i + 21), trim]));
    body.add(mesh(`valva-${i + 1}-nervaduras`, ribGeometry, trim));
    const seam = tube(Array.from({ length: 25 }, (_, k) => shellPoint(.99, .06 + k / 24 * .88, -.009)), .009, 32);
    body.add(mesh(`valva-${i + 1}-junta-luminosa`, seam, light));
    const joint = mesh(`valva-${i + 1}-bisagra`, new THREE.CylinderGeometry(.075, .075, .22, 16).rotateZ(Math.PI / 2), trim);
    const bracket = mesh(`valva-${i + 1}-biela`, new THREE.CylinderGeometry(.025, .025, Math.hypot(.12, .25), 10).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(THREE.Object3D.DEFAULT_UP, new THREE.Vector3(0, .12, -.25).normalize())).translate(0, .06, -.125), trim);
    pivot.add(body, joint, bracket); petals.push(pivot); root.add(pivot);
  }
  // Each equatorial segment owns its pivot and can translate independently.
  for (let i = 0; i < SEED.segments; i++) {
    const pivot = new THREE.Group(); pivot.name = `collar-${String(i + 1).padStart(2, "0")}`;
    const arc = new THREE.TorusGeometry(SEED.collarRadius, .062, 8, 14, TAU / SEED.segments - .105).rotateX(Math.PI / 2);
    pivot.add(mesh(`collar-${i + 1}-metal`, arc, collarMaterial));
    const inlay = new THREE.TorusGeometry(SEED.collarRadius + .065, .013, 6, 12, TAU / SEED.segments - .135).rotateX(Math.PI / 2);
    pivot.add(mesh(`collar-${i + 1}-incrustacion`, inlay, light));
    // Torus endpoints are closed with fitted spheres, no exposed tube cuts.
    for (const a of [0, TAU / SEED.segments - .105]) {
      const cap = mesh(`collar-${i + 1}-terminal`, new THREE.SphereGeometry(.062, 8, 6), collarMaterial);
      cap.position.set(Math.cos(a) * SEED.collarRadius, 0, -Math.sin(a) * SEED.collarRadius); pivot.add(cap);
    }
    collars.push(pivot); root.add(pivot);
  }
  const spine = new THREE.Group(); spine.name = "bastidor-interior";
  const central = mesh("eje-de-memoria", new THREE.CylinderGeometry(.034, .034, 4.95, 12), trim); spine.add(central);
  for (const y of [-2.48, -1.6, 1.6, 2.48]) {
    const radius = Math.abs(y) > 2 ? .07 : .14;
    const hub = mesh(`cuna-${y}`, new THREE.CylinderGeometry(radius, radius, .14, 20), trim); hub.position.y = y; spine.add(hub);
  }
  root.add(spine);
  const extension = mesh("bastidor-extension-inferior", new THREE.CylinderGeometry(.032, .032, .46, 12), trim);
  extension.position.y = -2.71; spine.add(extension);
  const crown = mesh("bastidor-corona-actuadores", new THREE.TorusGeometry(.17, .025, 8, 36).rotateX(Math.PI / 2), trim);
  crown.position.y = -2.94; spine.add(crown);
  for (let i = 0; i < SEED.petals; i++) {
    const angle = i / SEED.petals * TAU + SEED_MECHANICS.azimuth;
    const spoke = mesh(`bastidor-radio-${i + 1}`, new THREE.CylinderGeometry(.016, .016, .17, 8).rotateX(Math.PI / 2).rotateY(angle), trim);
    spoke.position.set(Math.sin(angle) * .085, -2.94, Math.cos(angle) * .085); spine.add(spoke);
  }
  const core = new THREE.Group(); core.name = "nucleo-memoria";
  const dropPoints = Array.from({ length: 49 }, (_, i) => {
    const t = i / 48; return new THREE.Vector2(Math.sin(Math.PI * t) ** .95 * .53 * (1.25 - .62 * t), -1.34 + t * 2.68);
  });
  const drop = mesh("ampolla-agua", new THREE.LatheGeometry(dropPoints, 48), glass); core.add(drop);
  const branches: THREE.BufferGeometry[] = [tube([new THREE.Vector3(0, -1.12, 0), new THREE.Vector3(-.06, -.2, 0), new THREE.Vector3(.035, .9, 0)], .016, 32)];
  for (let i = 0; i < 26; i++) {
    const y = -1 + i / 26 * 1.7, a = i * 2.39996, length = .18 + .15 * Math.sin((y + 1) / 1.7 * Math.PI);
    const end = new THREE.Vector3(Math.cos(a) * length, y + .25, Math.sin(a) * length);
    branches.push(tube([new THREE.Vector3(0, y, 0), end.clone().multiply(new THREE.Vector3(.6, 1, .6)), end], .006, 12));
    const bead = mesh(`memoria-${i + 1}`, new THREE.SphereGeometry(.021, 8, 6), filament); bead.position.copy(end); core.add(bead);
  }
  core.add(mesh("filamentos-vivos", merged(branches), filament)); root.add(core);
  const emitter = new THREE.PointLight(COLORS.signal, 6, 8, 2); emitter.name = "luz-interior";
  emitter.position.set(0, .3, .25); emitter.castShadow = true;
  emitter.shadow.mapSize.set(512, 512); emitter.shadow.bias = -.001; emitter.shadow.normalBias = .025;
  emitter.shadow.camera.near = .1; emitter.shadow.camera.far = 9;
  core.add(emitter);
  // Depth-tested additive glow: the closed shells occlude it instead of leaking light.
  const glowData = new Uint8Array(64 * 64 * 4), glowColor = new THREE.Color(COLORS.signal).convertLinearToSRGB();
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const i = (y * 64 + x) * 4, r = Math.hypot((x - 31.5) / 31.5, (y - 31.5) / 31.5);
    glowData[i] = glowColor.r * 255; glowData[i + 1] = glowColor.g * 255; glowData[i + 2] = glowColor.b * 255;
    glowData[i + 3] = Math.pow(Math.max(0, 1 - r), 2.5) * 255;
  }
  const glowTexture = new THREE.DataTexture(glowData, 64, 64); glowTexture.colorSpace = THREE.SRGBColorSpace; glowTexture.needsUpdate = true;
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .5, toneMapped: false }));
  glow.name = "halo-interior"; glow.userData.previewOnly = true; glow.scale.set(2.2, 3.6, 1); core.add(glow);
  // Ball-jointed telescopic actuators connect the frame to each sliding hinge.
  const actuators = petals.map((_, i) => {
    const barrel = mesh(`actuador-${i + 1}-camisa`, new THREE.CylinderGeometry(.047, .047, 1, 10), trim);
    const rod = mesh(`actuador-${i + 1}-vastago`, new THREE.CylinderGeometry(.022, .022, 1, 10), collarMaterial);
    root.add(barrel, rod); return { barrel, rod, anchor: new THREE.Vector3(), end: new THREE.Vector3(), direction: new THREE.Vector3(), length: 0 };
  });
  root.traverse(object => {
    if ((object as THREE.Mesh).isMesh) {
      const part = object as THREE.Mesh; part.receiveShadow = true;
      part.castShadow = /casco-interior-canto|eje-de-memoria|cuna-/.test(part.name);
    }
  });
  const artifact = { root, petals, collars, spine, core, glass, light, filament, emitter, glow, actuators, dispose: () => disposeSeed(root) };
  poseSeed(artifact, { open: 0, explode: 0, twist: 0, pulse: 0, reveal: 0 });
  return artifact;
}

/** Absolute transforms, so reverse scrolling and direct chapter entry never accumulate drift. */
export function poseSeed(seed: Omit<SeedArtifact, "dispose">, pose: SeedPose) {
  const open = THREE.MathUtils.clamp(pose.open, 0, 1), split = THREE.MathUtils.clamp(pose.explode, 0, 1);
  const energy = THREE.MathUtils.clamp(pose.energy ?? 0, 0, 2), flash = THREE.MathUtils.clamp(pose.flash ?? 0, 0, 1.5);
  const mechanism = seedMechanism(open, split);
  seed.petals.forEach((pivot, i) => {
    const angle = i / SEED.petals * TAU + SEED_MECHANICS.azimuth;
    // Identical radial sectors prevent neighbouring shells sweeping into one another.
    const radius = SEED_MECHANICS.hingeRadius + mechanism.radial;
    pivot.position.set(Math.sin(angle) * radius, SEED_MECHANICS.hingeY, Math.cos(angle) * radius);
    pivot.rotation.set(0, angle, 0); pivot.rotateX(mechanism.hinge);
    const actuator = seed.actuators[i];
    actuator.anchor.set(Math.sin(angle) * .17, -2.94, Math.cos(angle) * .17);
    actuator.end.set(0, -.02, .065).applyQuaternion(pivot.quaternion).add(pivot.position);
    actuator.direction.copy(actuator.end).sub(actuator.anchor);
    actuator.length = actuator.direction.length(); actuator.direction.normalize();
    for (const part of [actuator.barrel, actuator.rod]) part.quaternion.setFromUnitVectors(THREE.Object3D.DEFAULT_UP, actuator.direction);
    const barrelLength = .16, rodLength = actuator.length - barrelLength;
    actuator.barrel.scale.y = barrelLength;
    actuator.barrel.position.copy(actuator.anchor).addScaledVector(actuator.direction, barrelLength / 2);
    actuator.rod.scale.y = rodLength;
    actuator.rod.position.copy(actuator.anchor).addScaledVector(actuator.direction, barrelLength + rodLength / 2);
  });
  seed.collars.forEach((pivot, i) => {
    const angle = -i / SEED.segments * TAU;
    const radial = mechanism.unlock * .1 + split * .7;
    pivot.rotation.set(0, angle, 0);
    pivot.position.set(Math.cos(angle) * radial, mechanism.collarY, -Math.sin(angle) * radial);
  });
  seed.spine.scale.y = 1;
  seed.core.position.y = pose.reveal * .18;
  seed.core.rotation.y = pose.twist * .05;
  seed.core.scale.setScalar(1 + pose.reveal * .12 + pose.pulse * .015);
  seed.glass.emissiveIntensity = .28 + open * .45 + pose.reveal * .25 + pose.pulse * .16 + energy * .2 + flash * 2.8;
  seed.light.emissiveIntensity = 1 + open * .5 + pose.reveal * .5;
  seed.filament.emissiveIntensity = 3 + open * 2 + pose.pulse * .8 + energy * 3 + flash * 24;
  seed.emitter.intensity = (4 + open * 10 + pose.reveal * 3 + pose.pulse * 2) * (1 + energy * .8) + flash * 90;
  seed.glow.material.opacity = .25 + open * .35 + pose.pulse * .1 + energy * .15 + flash * .75;
  seed.glow.scale.set(2.2 + flash * 2.2, 3.6 + flash * 2.8, 1);
  seed.root.userData.pose = { ...pose, open, explode: split };
  seed.root.userData.mechanism = mechanism;
}

export function disposeSeed(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if ((object as THREE.Light).isLight) (object as THREE.Light & { dispose?: () => void }).dispose?.();
    if ((object as THREE.Sprite).isSprite) materials.add((object as THREE.Sprite).material);
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
  });
  for (const m of materials) for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value);
  geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
}
