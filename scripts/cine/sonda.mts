/**
 * Volcado de la escena de una web (docs/33 §2): lo que cine:capture resume, entero. Sustituye a las sondas de un uso de
 * Lusion (racimo, cámaras) y Chartogne-Taillet (uniforms del lápiz y del papel).
 *
 *   npm run cine:sonda -- <url> [--antes "avisos;rueda:400x8;espera:5"] [--size 1280x720] [--movil] [--out carpeta]
 *
 * Durante 90 fotogramas envuelve `render` y anota cada pasada (escena, cámara, destino y tamaño) y cada material que se
 * pinta. Después, por escena: las cámaras que la pintan (fov, posición, dirección, desplazamiento de la vista), las
 * mallas agrupadas por geometría y material (cuántas, instancias, atributos, defines y los valores de sus uniforms
 * propios: los de un ShaderMaterial que no son de three), las luces, la niebla y el fondo. Los cuadrados a pantalla
 * completa del posprocesado salen con sus uniforms (colores, intensidades, texturas con su tamaño y su archivo).
 * Salida: sonda.json y sonda.md.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { abrir, esperarEscena, pasos } from "./navegador.mts";

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.log('Uso: npm run cine:sonda -- <url> [--antes "avisos;rueda:400x8;espera:5"] [--size 1280x720] [--movil] [--out carpeta]');
  process.exit(1);
}
const slug = url.replace(/^https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 50);
const OUT = resolve(opt("--out", join(".refs3d", "sonda", slug)));
mkdirSync(OUT, { recursive: true });

const { browser, page, errores } = await abrir({ size: opt("--size", "1280x720").split("x").map(Number) as [number, number], movil: argv.includes("--movil") });
await page.goto(url, { waitUntil: "load", timeout: 120_000 });
await page.waitForTimeout(4000);
await esperarEscena(page, 20_000);
const hechos = opt("--antes", "") ? await pasos(page, opt("--antes", "")) : [];
await esperarEscena(page, 10_000);

// envoltorio de render: pasadas y materiales durante 90 fotogramas
await page.evaluate(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type W = { __cine: { state: { renderers: { render: (...a: any[]) => unknown; getRenderTarget?: () => { width: number; height: number } | null }[] } }; __sonda: unknown };
  const w = window as unknown as W;
  const s = { pasadas: [] as unknown[], escenas: new Map<object, { camaras: Set<object>; n: number }>(), quads: new Map<object, number>(), frame: 0, ids: new Map<object, number>() };
  w.__sonda = s;
  const id = (o: object) => (s.ids.has(o) ? s.ids.get(o)! : (s.ids.set(o, s.ids.size + 1), s.ids.size));
  for (const r of w.__cine.state.renderers) {
    const orig = r.render;
    r.render = function (scene: { isScene?: boolean; isMesh?: boolean; material?: object }, cam: { type: string }) {
      const t = this.getRenderTarget ? this.getRenderTarget() : null;
      if (s.pasadas.length < 400) s.pasadas.push({ f: s.frame, escena: scene.isScene ? id(scene) : null, quad: scene.isMesh ? id(scene) : null, cam: cam?.type, destino: t ? [t.width, t.height] : null });
      if (scene.isScene) {
        const e = s.escenas.get(scene) ?? { camaras: new Set(), n: 0 };
        e.camaras.add(cam);
        e.n++;
        s.escenas.set(scene, e);
      } else if (scene.isMesh) s.quads.set(scene, (s.quads.get(scene) ?? 0) + 1);
      return orig.apply(this, [scene, cam]);
    };
  }
  const tick = () => {
    s.frame++;
    if (s.frame < 200) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await page.waitForTimeout(2500);

const datos = await page.evaluate(() => {
  type Any = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const s = (window as unknown as { __sonda: Any }).__sonda;
  const r = (v: number) => Math.round(v * 10000) / 10000;
  const val = (x: Any): unknown => {
    if (x == null) return null;
    if (typeof x === "number") return r(x);
    if (typeof x === "boolean" || typeof x === "string") return x;
    if (x.isColor) return "#" + x.getHexString();
    if (x.isTexture) {
      const img = x.image || (x.source && x.source.data);
      return { textura: img && img.width ? [img.width, img.height] : null, archivo: img && img.src ? String(img.src).split("/").pop()!.slice(0, 60) : x.isRenderTargetTexture ? "(render target)" : null };
    }
    if (x.isMatrix4 || x.isMatrix3) return "matriz";
    if (x.toArray) return x.toArray().map(r);
    if (Array.isArray(x)) return x.length > 8 ? `lista de ${x.length}` : x.map(val);
    return typeof x;
  };
  // uniforms que pone three en todos los ShaderMaterial (luces, niebla, mapas estándar): no dicen nada del estilo
  const DE_THREE = /^(diffuse|emissive|specular|shininess|opacity|map|mapTransform|alphaMap|alphaMapTransform|alphaTest|aoMap|aoMapIntensity|lightMap|lightMapIntensity|emissiveMap|bumpMap|bumpScale|normalMap|normalScale|displacementMap|displacementScale|displacementBias|specularMap|envMap|envMapRotation|flipEnvMap|reflectivity|ior|refractionRatio|gradientMap|fogDensity|fogNear|fogFar|fogColor|ambientLightColor|lightProbe|directionalLights|directionalLightShadows|directionalShadowMap|directionalShadowMatrix|spotLights|spotLightShadows|spotShadowMap|spotLightMatrix|spotLightMap|pointLights|pointLightShadows|pointShadowMap|pointShadowMatrix|hemisphereLights|rectAreaLights|ltc_1|ltc_2|clippingPlanes|uvTransform|uv2Transform|roughness|metalness|roughnessMap|metalnessMap|envMapIntensity|logDepthBufFC|morphTargetBaseInfluence|morphTargetInfluences|morphTargetsTexture|morphTargetsTextureSize|boneTexture|bindMatrix|bindMatrixInverse|matcap|referencePosition|nearDistance|farDistance|maxMipLevel|spotShadowMatrix|cameraNear|cameraFar)$/;
  const PARAMS = ["color", "emissive", "roughness", "metalness", "transmission", "thickness", "ior", "clearcoat", "sheen", "iridescence", "opacity", "transparent", "side", "blending", "depthWrite", "vertexColors", "flatShading", "wireframe", "toneMapped"];
  const material = (m: Any) => {
    const u: Any = {};
    if (m.uniforms) for (const k of Object.keys(m.uniforms)) if (!DE_THREE.test(k)) u[k] = val(m.uniforms[k].value);
    const p: Any = {};
    for (const k of PARAMS) if (m[k] !== undefined && typeof m[k] !== "object") p[k] = val(m[k]);
    else if (m[k] && m[k].isColor) p[k] = val(m[k]);
    const nodos = m.isNodeMaterial ? Object.keys(m).filter((k) => /Node$/.test(k) && m[k]) : undefined;
    return { tipo: m.type, nombre: m.name || undefined, defines: m.defines && Object.keys(m.defines).length ? m.defines : undefined, params: p, uniforms: Object.keys(u).length ? u : undefined, nodos };
  };
  const camara = (c: Any) => {
    c.updateMatrixWorld();
    const e = c.matrixWorld.elements;
    const l = Math.hypot(e[8], e[9], e[10]) || 1;
    return { tipo: c.type, fov: c.fov !== undefined ? r(c.fov) : undefined, cerca: r(c.near), lejos: r(c.far), pos: [r(e[12]), r(e[13]), r(e[14])], dir: [r(-e[8] / l), r(-e[9] / l), r(-e[10] / l)], vista: c.view && c.view.enabled ? { completa: [c.view.fullWidth, c.view.fullHeight], desplazamiento: [r(c.view.offsetX), r(c.view.offsetY)], tamano: [c.view.width, c.view.height] } : undefined };
  };
  const escenas = [...s.escenas.entries()].map(([sc, e]: [Any, Any]) => {
    const grupos = new Map<string, Any>();
    const luces: Any[] = [];
    sc.traverse((o: Any) => {
      if (o.isLight) luces.push({ tipo: o.type, color: val(o.color), intensidad: r(o.intensity), pos: o.position.toArray().map(r) });
      if (!(o.isMesh || o.isPoints || o.isLine) || o.visible === false || !o.geometry || !o.geometry.attributes || !o.material) return;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of ms) {
        const g = o.geometry;
        const clave = `${o.type}|${g.attributes.position?.count}|${m.type}|${JSON.stringify(m.defines || {})}|${m.uniforms ? JSON.stringify(Object.keys(m.uniforms)) : ""}`;
        const x = grupos.get(clave) ?? { objeto: o.type, vertices: g.attributes.position?.count, atributos: Object.keys(g.attributes), mallas: 0, instancias: 0, nombres: new Set<string>(), material: material(m) };
        x.mallas++;
        if (o.isInstancedMesh) x.instancias += o.count;
        if (o.name) x.nombres.add(o.name);
        grupos.set(clave, x);
      }
    });
    return {
      id: s.ids.get(sc),
      pintadas: e.n,
      camaras: [...e.camaras].map(camara),
      fondo: sc.background ? val(sc.background) : null,
      niebla: sc.fog ? { color: val(sc.fog.color), cerca: sc.fog.near, lejos: sc.fog.far, densidad: sc.fog.density } : null,
      luces,
      grupos: [...grupos.values()].map((x) => ({ ...x, nombres: [...x.nombres].slice(0, 6) }) as Any).sort((a, b) => b.mallas + b.instancias - (a.mallas + a.instancias)),
    };
  });
  const quads = [...s.quads.keys()].map((q: Any) => ({ id: s.ids.get(q), material: material(q.material) }));
  // las pasadas de un fotograma típico (el 60)
  const pasadas = s.pasadas.filter((p: Any) => p.f === 60);
  return { escenas, quads, pasadas };
});
await browser.close();

const md: string[] = [`# Sonda · ${url}`, "", hechos.length ? `Pasos previos: ${hechos.join(" · ")}` : "", "", `## Pasadas de un fotograma (${datos.pasadas.length})`, ""];
for (const p of datos.pasadas as { escena: number | null; quad: number | null; cam: string; destino: number[] | null }[]) md.push(`- ${p.escena ? `escena ${p.escena}` : `cuadrado ${p.quad}`} · ${p.cam} → ${p.destino ? p.destino.join("×") : "pantalla"}`);
for (const e of datos.escenas) {
  md.push("", `## Escena ${e.id} (pintada ${e.pintadas} veces en 90 fotogramas)`, "");
  for (const c of e.camaras) md.push(`- cámara ${c.tipo}${c.fov ? ` fov ${c.fov}` : ""} en ${c.pos.join(", ")} mirando a ${c.dir.join(", ")}${c.vista ? ` · vista desplazada ${c.vista.desplazamiento.join(", ")} de ${c.vista.completa.join("×")}` : ""}`);
  if (e.fondo) md.push(`- fondo ${JSON.stringify(e.fondo)}`);
  if (e.niebla) md.push(`- niebla ${JSON.stringify(e.niebla)}`);
  for (const l of e.luces) md.push(`- luz ${l.tipo} ${l.color} × ${l.intensidad} en ${l.pos.join(", ")}`);
  for (const g of e.grupos.slice(0, 25)) md.push(`- **${g.mallas} ${g.objeto}${g.instancias ? ` (${g.instancias} instancias)` : ""}** · ${g.vertices} vértices · ${g.material.tipo}${g.material.defines ? ` ${JSON.stringify(g.material.defines)}` : ""} · ${JSON.stringify(g.material.params)}${g.material.uniforms ? `\n  - uniforms: \`${JSON.stringify(g.material.uniforms).slice(0, 1200)}\`` : ""}`);
}
if (datos.quads.length) {
  md.push("", "## Cuadrados (posprocesado y composición)", "");
  for (const q of datos.quads.slice(0, 30)) md.push(`- cuadrado ${q.id} · ${q.material.tipo}${q.material.nombre ? ` «${q.material.nombre}»` : ""}${q.material.uniforms ? ` · \`${JSON.stringify(q.material.uniforms).slice(0, 900)}\`` : ""}`);
}
if (errores.length) md.push("", `Errores de la página: ${errores.slice(0, 5).join(" · ")}`);
writeFileSync(join(OUT, "sonda.json"), JSON.stringify({ url, hechos, ...datos }, null, 1));
writeFileSync(join(OUT, "sonda.md"), md.join("\n") + "\n");
console.log(`  ${datos.escenas.length} escenas, ${datos.quads.length} cuadrados, ${datos.pasadas.length} pasadas por fotograma\n  ${join(OUT, "sonda.md")}`);
