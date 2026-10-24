/*
 * Gancho de three.js para `cine:capture` (docs/26). Se inyecta antes que cualquier script de la página
 * (`page.addInitScript`). Define `__THREE_DEVTOOLS__`, al que three avisa (`register` con la revisión, `observe` con cada
 * renderer, escena, mezclador de animaciones y cargador que se crea), aunque three vaya empaquetado y minificado.
 *
 * Sobre cada renderer envuelve `render` y `setRenderTarget`: así se sabe con qué cámara se pinta la escena y cuántas
 * pasadas hay por fotograma (el posprocesado son pasadas a render targets y un cuadrado final). Lo lee la captura con
 * `__cine.snapshot()` (estado ligero: cámara y pasadas) y `__cine.inventory()` (escena completa: luces, materiales…).
 * Sin dependencias: nada de clases de three (se reconoce cada objeto por sus banderas `isMesh`, `isLight`…).
 */
(() => {
  if (window.__cine) return;
  const TONE = ["none", "linear", "reinhard", "cineon", "aces", "custom", "agx", "neutral"];
  const SHADOW = ["basic", "pcf", "pcf-soft", "vsm"];
  const SIDE = ["front", "back", "double"];
  const BLEND = ["none", "normal", "additive", "subtractive", "multiply", "custom"];

  const state = { revision: null, renderers: [], scenes: [], mixers: [], loaders: [], log: [], frame: 0, lastScene: null, lastCamera: null, acc: new Map() };
  const round = (n, d = 4) => (typeof n === "number" && isFinite(n) ? Math.round(n * 10 ** d) / 10 ** d : n);
  const v3 = (v) => (v ? [round(v.x), round(v.y), round(v.z)] : null);
  const hex = (c) => (c && c.isColor ? "#" + c.getHexString() : null);
  const uuid = (o) => (o && o.uuid ? o.uuid.slice(0, 8) : null);
  // los render targets no tienen uuid: se numeran por identidad
  const ids = new WeakMap();
  let nextId = 1;
  const idOf = (o) => {
    if (!o) return null;
    if (!ids.has(o)) ids.set(o, "rt" + nextId++);
    return ids.get(o);
  };
  // materiales de los cuadrados de posprocesado, por nombre, para leer sus parámetros (passParams)
  const passMats = new Map();

  // contador de fotogramas propio: el reloj virtual lo sustituye por el suyo (clock.js) y sigue funcionando
  const tick = () => {
    state.frame++;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const wrap = (r) => {
    if (r.__cineWrapped) return;
    r.__cineWrapped = true;
    const render = r.render;
    r.render = function (scene, camera) {
      const target = typeof this.getRenderTarget === "function" ? this.getRenderTarget() : null;
      const isScene = !!(scene && scene.isScene);
      if (isScene && camera && !camera.isOrthographicCamera) {
        state.lastScene = scene;
        state.lastCamera = camera;
      } else if (isScene && camera) {
        state.lastScene = state.lastScene || scene;
        state.lastCamera = state.lastCamera || camera;
      }
      state.log.push({
        f: state.frame,
        kind: isScene ? "scene" : scene && scene.isMesh ? "quad" : scene ? scene.type : "?",
        cam: camera ? camera.type : null,
        target: idOf(target),
        size: target ? [target.width, target.height] : null,
        // el cuadrado y su material: en TSL delatan el pase («Bloom [ High Pass ]», «Bloom_highPass»)
        name: !isScene && scene ? scene.name || null : null,
        mat: !isScene && scene && scene.material ? scene.material.name || scene.material.type : null,
      });
      if (!isScene && scene && scene.material && !passMats.has(scene.material)) passMats.set(scene.material, scene.name || scene.material.name || scene.material.type);
      if (state.log.length > 4000) state.log.splice(0, 2000);
      const result = render.apply(this, arguments);
      // WebGLRenderer reinicia `info` en cada render() (autoReset): se suman todas las del fotograma
      if (this.isWebGLRenderer && this.info && this.info.render) {
        const a = state.acc.get(state.frame) || { calls: 0, triangles: 0, points: 0, lines: 0 };
        a.calls += this.info.render.calls || 0;
        a.triangles += this.info.render.triangles || 0;
        a.points += this.info.render.points || 0;
        a.lines += this.info.render.lines || 0;
        state.acc.set(state.frame, a);
        if (state.acc.size > 120) state.acc.delete(state.acc.keys().next().value);
      }
      return result;
    };
  };

  const devtools = new EventTarget();
  devtools.addEventListener("register", (e) => (state.revision = e.detail && e.detail.revision));
  devtools.addEventListener("observe", (e) => {
    const o = e.detail;
    if (!o) return;
    if (o.isWebGLRenderer || o.isWebGPURenderer || (o.render && o.setRenderTarget && o.domElement)) {
      state.renderers.push(o);
      wrap(o);
    } else if (o.isScene) state.scenes.push(o);
    else if (o.isAnimationMixer || (o._actions && o.clipAction)) state.mixers.push(o);
    else if (o.manager !== undefined && o.load) state.loaders.push(o.constructor && o.constructor.name);
  });
  Object.defineProperty(window, "__THREE_DEVTOOLS__", { value: devtools, configurable: true });

  const rendererInfo = (r) => {
    const backend = r.backend ? (r.backend.isWebGPUBackend ? "webgpu" : "webgl2") : null;
    const info = r.info || {};
    const ren = info.render || {};
    const canvas = r.domElement;
    return {
      type: r.isWebGPURenderer ? "WebGPURenderer" : r.isWebGLRenderer ? "WebGLRenderer" : r.constructor && r.constructor.name,
      backend: backend || (r.isWebGLRenderer ? (r.capabilities && r.capabilities.isWebGL2 === false ? "webgl1" : "webgl2") : null),
      toneMapping: TONE[r.toneMapping] ?? r.toneMapping,
      exposure: round(r.toneMappingExposure, 3),
      outputColorSpace: r.outputColorSpace,
      pixelRatio: typeof r.getPixelRatio === "function" ? round(r.getPixelRatio(), 2) : null,
      canvas: canvas ? [canvas.width, canvas.height] : null,
      shadows: r.shadowMap ? { enabled: !!r.shadowMap.enabled, type: SHADOW[r.shadowMap.type] ?? r.shadowMap.type } : null,
      // drawCalls es por fotograma (WebGPURenderer); calls, en WebGLRenderer, también (se reinicia en cada render)
      calls: ren.drawCalls ?? ren.calls ?? null,
      triangles: ren.triangles ?? null,
      points: ren.points ?? null,
      lines: ren.lines ?? null,
      geometries: info.memory ? info.memory.geometries : null,
      textures: info.memory ? info.memory.textures : null,
      programs: Array.isArray(info.programs) ? info.programs.length : null,
    };
  };
  /** llamadas del último fotograma completo (WebGL: suma de todos los render(); WebGPU: drawCalls ya es por fotograma) */
  const frameTotals = (r) => {
    if (!r.isWebGLRenderer) return null;
    const keys = [...state.acc.keys()].filter((k) => k < state.frame).sort((a, b) => b - a);
    return keys.length ? state.acc.get(keys[0]) : null;
  };

  const cameraInfo = (c) => {
    if (!c) return null;
    c.updateMatrixWorld && c.updateMatrixWorld();
    const e = c.matrixWorld.elements;
    const pos = [round(e[12]), round(e[13]), round(e[14])];
    // dirección y orientación del mundo: la cámara puede colgar de un nodo animado (la cámara de un GLB de Blender lleva
    // −90° en X en local y lo que gira es el padre), así que nada de quaternion local
    const zl = Math.hypot(e[8], e[9], e[10]) || 1;
    const dir = [round(-e[8] / zl), round(-e[9] / zl), round(-e[10] / zl)];
    const q = c.getWorldQuaternion ? c.getWorldQuaternion(c.quaternion.clone()) : c.quaternion;
    return {
      type: c.type,
      fov: round(c.fov, 3),
      // distancia focal equivalente en mm (sensor de 35 mm, filmGauge 35)
      focalMM: typeof c.getFocalLength === "function" && c.isPerspectiveCamera ? round(c.getFocalLength(), 2) : null,
      zoom: round(c.zoom, 3),
      near: round(c.near, 4),
      far: round(c.far, 2),
      aspect: round(c.aspect, 4),
      pos,
      dir,
      quat: q ? [round(q.x), round(q.y), round(q.z), round(q.w)] : null,
      up: v3(c.up),
    };
  };

  const pick = (m, keys) => {
    const out = {};
    for (const k of keys) {
      const v = m[k];
      if (v === undefined || v === null) continue;
      if (typeof v === "number") out[k] = round(v, 3);
      else if (typeof v === "boolean") out[k] = v;
      else if (v.isColor) out[k] = hex(v);
      else if (v.isVector2) out[k] = [round(v.x, 3), round(v.y, 3)];
    }
    return out;
  };

  const MAT_KEYS = ["color", "emissive", "emissiveIntensity", "roughness", "metalness", "envMapIntensity", "transmission", "thickness", "ior", "attenuationColor", "attenuationDistance", "clearcoat", "clearcoatRoughness", "sheen", "sheenColor", "sheenRoughness", "iridescence", "iridescenceIOR", "dispersion", "anisotropy", "specularIntensity", "opacity", "alphaTest", "transparent", "depthWrite", "depthTest", "flatShading", "wireframe", "toneMapped", "size", "sizeAttenuation", "fog", "vertexColors", "steps"];

  const materialInfo = (m) => {
    const maps = Object.keys(m).filter((k) => /map$/i.test(k) && m[k] && m[k].isTexture);
    const nodes = m.isNodeMaterial ? Object.keys(m).filter((k) => /Node$/.test(k) && m[k]) : [];
    return {
      id: uuid(m),
      type: m.type,
      name: m.name || undefined,
      side: SIDE[m.side],
      blending: BLEND[m.blending],
      ...pick(m, MAT_KEYS),
      maps: maps.length ? maps : undefined,
      // el mapa de entorno propio del material manda sobre el de la escena: hay que saber cuál es
      envMapInfo: m.envMap ? textureInfo(m.envMap) : undefined,
      nodes: nodes.length ? nodes : undefined,
      uniforms: m.uniforms ? Object.keys(m.uniforms).length : undefined,
      users: 0,
    };
  };

  const textureInfo = (t) => {
    if (!t) return null;
    if (t.isColor) return { kind: "color", value: hex(t) };
    if (!t.isTexture) return { kind: typeof t };
    const img = t.image || (t.source && t.source.data);
    const size = img ? (Array.isArray(img) ? [img[0] && img[0].width, img[0] && img[0].height] : [img.width, img.height]) : null;
    return { kind: t.isCubeTexture ? "cube" : t.isDataTexture ? "data" : t.isVideoTexture ? "video" : t.isRenderTargetTexture ? "render-target" : "texture", mapping: t.mapping, colorSpace: t.colorSpace, size, name: t.name || undefined, id: uuid(t) };
  };

  /** Inventario completo de la escena (más caro: se pide en los momentos clave, no en cada fotograma). */
  const inventory = () => {
    const scene = state.lastScene || state.scenes[state.scenes.length - 1];
    if (!scene) return null;
    const counts = {};
    const lights = [];
    const mats = new Map();
    let instances = 0;
    let skinned = 0;
    let animated = 0;
    const box = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
    const piezas = [];
    const instanciadas = [];
    scene.traverse((o) => {
      if (o.visible === false) return;
      counts[o.type] = (counts[o.type] || 0) + 1;
      if (o.isInstancedMesh) {
        instances += o.count;
        if (instanciadas.length < 40) {
          const g = o.geometry;
          if (g && !g.boundingBox && g.computeBoundingBox) g.computeBoundingBox();
          const size = g && g.boundingBox ? g.boundingBox.getSize(o.position.clone()) : null;
          // paleta de instanceColor: colores distintos (redondeados) y cuántas copias llevan cada uno
          const pal = new Map();
          const ic = o.instanceColor && o.instanceColor.array;
          if (ic) for (let k = 0; k < o.count; k++) {
            const key = "#" + [0, 1, 2].map((j) => Math.round(Math.min(1, Math.max(0, ic[k * 3 + j])) * 255).toString(16).padStart(2, "0")).join("");
            pal.set(key, (pal.get(key) || 0) + 1);
          }
          instanciadas.push({ id: instIndex(o), name: o.name || null, count: o.count, size: size ? v3(size) : null, colores: [...pal].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => ({ c, n })) });
        }
      }
      if (o.isSkinnedMesh) skinned++;
      if (o.morphTargetInfluences && o.morphTargetInfluences.length) animated++;
      if (o.isLight) {
        lights.push({
          type: o.type,
          color: hex(o.color),
          groundColor: hex(o.groundColor),
          intensity: round(o.intensity, 3),
          pos: v3(o.getWorldPosition ? o.getWorldPosition(o.position.clone()) : o.position),
          distance: round(o.distance, 2),
          decay: round(o.decay, 2),
          angle: round(o.angle, 3),
          penumbra: round(o.penumbra, 3),
          castShadow: !!o.castShadow,
          // colgada de la cámara (camera.add(light)): la sigue
          onCamera: !!(o.parent && o.parent.isCamera),
          local: o.parent && o.parent.isCamera ? v3(o.position) : undefined,
          // direccionales y focos apuntan a su objetivo: dónde está (y si también va con la cámara) decide la dirección
          target: o.target ? v3(o.target.getWorldPosition(o.position.clone())) : undefined,
          targetEnEscena: o.target ? !!o.target.parent : undefined,
          targetOnCamera: o.target ? !!(o.target.parent && o.target.parent.isCamera) : undefined,
          targetLocal: o.target && o.target.parent && o.target.parent.isCamera ? v3(o.target.position) : undefined,
          shadowMap: o.castShadow && o.shadow ? (o.shadow.mapSize ? [o.shadow.mapSize.x, o.shadow.mapSize.y] : null) : undefined,
          // la caja de la cámara de sombras (direccional) y el sesgo: con la caja por defecto (±5) las sombras se cortan
          shadowCam: o.castShadow && o.shadow && o.shadow.camera && o.shadow.camera.isOrthographicCamera ? [o.shadow.camera.left, o.shadow.camera.right, o.shadow.camera.top, o.shadow.camera.bottom, o.shadow.camera.near, o.shadow.camera.far].map((n) => round(n, 3)) : undefined,
          shadowBias: o.castShadow && o.shadow ? [round(o.shadow.bias, 6), round(o.shadow.normalBias, 6), round(o.shadow.radius, 3)] : undefined,
        });
      }
      const list = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of list) {
        if (!mats.has(m.uuid)) mats.set(m.uuid, materialInfo(m));
        mats.get(m.uuid).users++;
      }
      if ((o.isMesh || o.isPoints) && o.geometry) {
        // pose de cada pieza en el mundo: si la página la mueve (flotación, animación propia) aquí se ve
        if (piezas.length < 40) {
          o.updateWorldMatrix(true, false);
          const me = o.matrixWorld.elements;
          const wq = o.getWorldQuaternion(o.quaternion.clone());
          const sx = Math.hypot(me[0], me[1], me[2]);
          piezas.push({ name: o.name || null, pos: [round(me[12], 3), round(me[13], 3), round(me[14], 3)], quat: [round(wq.x), round(wq.y), round(wq.z), round(wq.w)], escala: round(sx, 3), castShadow: !!o.castShadow, receiveShadow: !!o.receiveShadow });
        }
        const g = o.geometry;
        if (!g.boundingBox && g.computeBoundingBox && g.attributes && g.attributes.position) g.computeBoundingBox();
        if (g.boundingBox && o.matrixWorld) {
          const b = g.boundingBox.clone().applyMatrix4(o.matrixWorld);
          for (let i = 0; i < 3; i++) {
            const k = "xyz"[i];
            if (isFinite(b.min[k])) box.min[i] = Math.min(box.min[i], b.min[k]);
            if (isFinite(b.max[k])) box.max[i] = Math.max(box.max[i], b.max[k]);
          }
        }
      }
    });
    const fog = scene.fog ? { type: scene.fog.isFogExp2 ? "exp2" : "linear", color: hex(scene.fog.color), near: round(scene.fog.near, 2), far: round(scene.fog.far, 2), density: round(scene.fog.density, 5) } : scene.fogNode ? { type: "node" } : null;
    return {
      counts,
      instances,
      skinned,
      morphs: animated,
      piezas,
      instanciadas,
      bounds: isFinite(box.min[0]) ? { min: box.min.map((n) => round(n, 3)), max: box.max.map((n) => round(n, 3)) } : null,
      background: textureInfo(scene.background) || (scene.backgroundNode ? { kind: "node" } : null),
      backgroundBlurriness: round(scene.backgroundBlurriness, 3),
      backgroundIntensity: round(scene.backgroundIntensity, 3),
      environment: textureInfo(scene.environment) || (scene.environmentNode ? { kind: "node" } : null),
      environmentIntensity: round(scene.environmentIntensity, 3),
      fog,
      lights,
      materials: [...mats.values()].sort((a, b) => b.users - a.users).slice(0, 60),
      materialCount: mats.size,
      post: passParams(),
      // de quién cuelga la cámara y qué nodos animan los clips: si un clip mueve un padre de la cámara, es cámara de autor
      camaraCadena: (() => {
        const out = [];
        for (let o = state.lastCamera; o && out.length < 8; o = o.parent) out.push(o.name || "");
        return out;
      })(),
      clips: state.mixers.flatMap((mx) => (mx._actions || []).map((a) => ({ clip: a._clip && a._clip.name, nodos: [...new Set((a._clip ? a._clip.tracks : []).map((t) => t.name.split(".")[0]))] }))).slice(0, 12),
      mixers: state.mixers.length,
      loaders: [...new Set(state.loaders)],
    };
  };

  /*
   * Parámetros de los pases TSL: se recorre el grafo de nodos del material de cada cuadrado y se guardan los uniforms
   * con el nombre de la propiedad o del parámetro por el que se llega a ellos (BloomNode: threshold, strength, radius…).
   */
  const nodeValue = (v) => {
    if (typeof v === "number") return round(v, 4);
    if (typeof v === "boolean") return v;
    if (v && v.isColor) return hex(v);
    if (v && (v.isVector2 || v.isVector3 || v.isVector4)) return ["x", "y", "z", "w"].filter((k) => k in v).map((k) => round(v[k], 4));
    if (v && v.isTexture) return "texture" + (v.name ? ":" + v.name : "");
    return undefined;
  };
  const walk = (node, name, out, seen, depth) => {
    if (!node || typeof node !== "object" || seen.has(node) || depth > 9 || out.length > 40) return;
    seen.add(node);
    if (node.isUniformNode) {
      const val = nodeValue(node.value);
      if (val !== undefined) out.push({ name: node.name || name, value: val });
      return;
    }
    for (const k of Object.keys(node)) {
      if (k.startsWith("_") || k === "parent" || k === "global") continue;
      const v = node[k];
      if (v && typeof v === "object") {
        // el nombre sin el sufijo «Node» (focusDistanceNode → focusDistance)
        if (v.isNode) walk(v, k === "node" || k === "value" || /^\d+$/.test(k) ? name : k.replace(/Node$/, ""), out, seen, depth + 1);
        else if (Array.isArray(v)) v.forEach((x) => x && x.isNode && walk(x, name, out, seen, depth + 1));
        else if (k === "parameters" || k === "inputs") for (const [pk, pv] of Object.entries(v)) if (pv && pv.isNode) walk(pv, pk.replace(/Node$/, ""), out, seen, depth + 1);
      }
    }
  };
  const passParams = () => {
    const out = [];
    for (const [m, label] of passMats) {
      const params = [];
      for (const k of ["fragmentNode", "colorNode", "outputNode"]) if (m[k]) walk(m[k], k, params, new Set(), 0);
      const uniq = [];
      const seenNames = new Set();
      for (const p of params) if (!seenNames.has(p.name + JSON.stringify(p.value))) (seenNames.add(p.name + JSON.stringify(p.value)), uniq.push(p));
      out.push({ pass: label, material: m.name || m.type, params: uniq.slice(0, 24) });
    }
    return out;
  };

  let lastFrame = 0;
  /*
   * Pose en el mundo de las piezas con nombre (hasta 16 mallas), en cada muestra: con ella se ve si la página mueve las
   * piezas por su cuenta (flotación, giros, animaciones propias) y con qué ritmo. La lista se rehace cada 60 fotogramas.
   */
  let piezasCache = [];
  let piezasFrame = -1;
  const poses = () => {
    const scene = state.lastScene;
    if (!scene) return [];
    if (state.frame - piezasFrame > 60 || !piezasCache.length) {
      piezasCache = [];
      scene.traverse((o) => {
        if (o.isMesh && o.name && o.visible !== false && piezasCache.length < 16) piezasCache.push(o);
      });
      piezasFrame = state.frame;
    }
    return piezasCache.map((o) => {
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      const q = o.getWorldQuaternion(o.quaternion.clone());
      // centro de la caja de la geometría en el mundo: dónde se ve la pieza (el origen depende de cómo se montó)
      const g = o.geometry;
      if (g && !g.boundingBox && g.computeBoundingBox) g.computeBoundingBox();
      const c = g && g.boundingBox ? g.boundingBox.getCenter(o.position.clone()).applyMatrix4(o.matrixWorld) : null;
      return { n: o.name, p: [round(e[12], 4), round(e[13], 4), round(e[14], 4)], q: [round(q.x, 5), round(q.y, 5), round(q.z, 5), round(q.w, 5)], c: c ? [round(c.x, 4), round(c.y, 4), round(c.z, 4)] : null };
    });
  };

  /*
   * Color, emisivo y opacidad de los materiales con nombre (hasta 16), en cada muestra: las páginas también los animan
   * (un resaltado al pasar el ratón, un fundido de entrada). La lista se rehace cada 60 fotogramas.
   */
  let matsCache = [];
  let matsFrame = -1;
  const matColors = () => {
    const scene = state.lastScene;
    if (!scene) return [];
    if (state.frame - matsFrame > 60 || !matsCache.length) {
      const seen = new Set();
      matsCache = [];
      scene.traverse((o) => {
        const list = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        for (const m of list) if (m.name && !seen.has(m) && matsCache.length < 16) (seen.add(m), matsCache.push(m));
      });
      matsFrame = state.frame;
    }
    return matsCache.map((m) => ({ n: m.name, c: hex(m.color), e: hex(m.emissive), o: round(m.opacity, 3) }));
  };

  /*
   * Movimiento de las instancias, en cada muestra: cuántas copias se han desplazado respecto a su posición inicial (la
   * primera vez que se ven), cuánto como mucho y en qué dirección media. Así se ve un campo de piezas que se levanta, se
   * dispersa o se recoloca, sin saber qué eje es «arriba».
   */
  const instBase = new WeakMap();
  const instIds = new WeakMap();
  let instNext = 0;
  function instIndex(o) {
    if (!instIds.has(o)) instIds.set(o, instNext++);
    return instIds.get(o);
  }
  let instCache = [];
  let instFrame = -1;
  const instancias = () => {
    const scene = state.lastScene;
    if (!scene) return [];
    if (state.frame - instFrame > 60 || !instCache.length) {
      instCache = [];
      scene.traverse((o) => o.isInstancedMesh && instCache.length < 40 && instCache.push(o));
      instFrame = state.frame;
    }
    return instCache.map((o) => {
      const a = o.instanceMatrix.array;
      if (!instBase.has(o)) instBase.set(o, Float32Array.from(a));
      const b = instBase.get(o);
      let movidas = 0, max = 0, dx = 0, dy = 0, dz = 0;
      for (let k = 0; k < o.count; k++) {
        const x = a[k * 16 + 12] - b[k * 16 + 12], y = a[k * 16 + 13] - b[k * 16 + 13], z = a[k * 16 + 14] - b[k * 16 + 14];
        const d = Math.hypot(x, y, z);
        if (d > 1e-3) (movidas++, (dx += x), (dy += y), (dz += z));
        if (d > max) max = d;
      }
      return { i: instIndex(o), movidas, max: round(max, 4), dir: movidas ? [round(dx / movidas, 4), round(dy / movidas, 4), round(dz / movidas, 4)] : null };
    });
  };

  /** Estado ligero de este momento: cámara, renderer y las pasadas desde la muestra anterior. */
  const snapshot = () => {
    const r = state.renderers[state.renderers.length - 1];
    const since = state.log.filter((l) => l.f > lastFrame);
    const frames = Math.max(1, state.frame - lastFrame);
    lastFrame = state.frame;
    // las pasadas de un fotograma típico: las del último fotograma completo con alguna pasada
    const byFrame = new Map();
    for (const l of since) byFrame.set(l.f, (byFrame.get(l.f) || []).concat(l));
    const frameKeys = [...byFrame.keys()].sort((a, b) => a - b);
    const typical = frameKeys.length > 1 ? byFrame.get(frameKeys[frameKeys.length - 2]) : byFrame.get(frameKeys[0]) || [];
    return {
      frame: state.frame,
      revision: state.revision,
      renderers: state.renderers.length,
      scenes: state.scenes.length,
      renderer: r ? Object.assign(rendererInfo(r), frameTotals(r) || {}) : null,
      camera: cameraInfo(state.lastCamera),
      passes: typical.map((l) => ({ kind: l.kind, cam: l.cam, target: l.target, size: l.size, name: l.name, mat: l.mat, scale: l.size && r && r.domElement ? Math.round((l.size[0] / r.domElement.width) * 100) / 100 : null })),
      rendersPerFrame: round(since.length / frames, 2),
      scroll: { y: Math.round(scrollY), max: Math.max(0, document.documentElement.scrollHeight - innerHeight) },
      // acciones de animación (clips de un GLB): su tiempo dice si las mueve el reloj, el scroll o nada
      piezas: poses(),
      mats: matColors(),
      inst: instancias(),
      acciones: state.mixers.flatMap((mx) => (mx._actions || []).map((a) => ({ clip: a._clip && a._clip.name, t: round(a.time, 4), dur: a._clip ? round(a._clip.duration, 3) : null, paused: !!a.paused, peso: round(a.getEffectiveWeight ? a.getEffectiveWeight() : a.weight, 3) }))).slice(0, 12),
    };
  };

  /*
   * Mallas visibles en las escenas creadas (la mayor). No hace falta pintar para contarlas: la captura espera a que haya
   * alguna y a que el recuento se estabilice sin avanzar el reloj, y la animación arranca con el primer paso.
   */
  const meshes = () => {
    let best = 0;
    for (const scene of state.scenes) {
      let n = 0;
      scene.traverse((o) => {
        if ((o.isMesh || o.isPoints || o.isLine) && o.visible !== false) n++;
      });
      best = Math.max(best, n);
    }
    return best;
  };

  window.__cine = { state, snapshot, inventory, meshes };
})();
