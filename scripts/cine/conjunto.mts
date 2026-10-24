/**
 * Dinámica de un conjunto de cuerpos (docs/31 §3): racimos, enjambres, montones de piezas que se empujan y siguen al
 * puntero. Lo que no ve el eje de dinámica de una pieza (docs/29 §2): cómo se mueve el grupo y cómo responde al puntero.
 *
 *   npm run cine:conjunto -- <url> [--size 1280x720] [--recorte x,y,w,h] [--espera 12] [--out archivo.json]
 *   npm run cine:conjunto -- --comparar <referencia.json> <banco.json>
 *
 * Los cuerpos son las mallas de la escena más poblada con la misma geometría (mismo número de vértices: el grupo mayor; las
 * que repiten posición, como las pasadas de profundidad de Lusion, cuentan una vez) o las instancias de los InstancedMesh
 * que la comparten. En tiempo real, a ~10 Hz: reposo (puntero fuera), barrido horizontal por el centro del
 * recorte (ida y vuelta, 3 s cada una) y cola (puntero fuera otra vez). Mide, por fase, la velocidad y el giro medios
 * (en radios de cuerpo por segundo, sin depender de la escala), la dispersión alrededor del centro, y del barrido, cuánto
 * sigue el centro del grupo al puntero en pantalla (ganancia) y con qué retraso, y en la cola cuánto tarda en volver
 * (constante de tiempo). Con --comparar, el alejamiento de cada medida y el total.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

type Muestra = { t: number; fase: string; p: [number, number] | null; cs: number[][]; centro: [number, number] | null };
type Resultado = { url: string; radio: number; cuerpos: number; fases: Record<string, { v: number; w: number; disp: number }>; ganancia: number; retraso: number; tau: number; serie: Muestra[] };

if (argv.includes("--comparar")) {
  const [a, b] = argv.filter((x) => !x.startsWith("--"));
  const A = JSON.parse(readFileSync(a, "utf8")) as Resultado;
  const B = JSON.parse(readFileSync(b, "utf8")) as Resultado;
  // relativo a la referencia, con un suelo para las medidas que pueden valer 0 (un retraso de 0 s no hace infinito
  // cualquier retraso): medio segundo para los tiempos, 0,05 para lo demás
  const rel = (x: number, y: number, suelo = 0.05) => Math.min(1, Math.abs(x - y) / Math.max(Math.abs(x), suelo));
  const filas: [string, number, number][] = [];
  for (const f of Object.keys(A.fases)) {
    filas.push([`${f}: velocidad (radios/s)`, A.fases[f].v, B.fases[f]?.v ?? NaN]);
    filas.push([`${f}: giro (rad/s)`, A.fases[f].w, B.fases[f]?.w ?? NaN]);
    filas.push([`${f}: dispersión (radios)`, A.fases[f].disp, B.fases[f]?.disp ?? NaN]);
  }
  filas.push(["ganancia del centro tras el puntero", A.ganancia, B.ganancia]);
  filas.push(["retraso (s)", A.retraso, B.retraso]);
  filas.push(["vuelta al centro, τ (s)", A.tau, B.tau]);
  let suma = 0;
  console.log("| medida | referencia | banco | alejamiento |\n|---|---|---|---|");
  for (const [n, x, y] of filas) {
    const d = rel(x, y, n.includes("(s)") ? 0.5 : 0.05);
    suma += d;
    console.log(`| ${n} | ${x.toFixed(3)} | ${y.toFixed(3)} | ${(d * 100).toFixed(0)} % |`);
  }
  console.log(`\nAlejamiento del conjunto: ${((suma / filas.length) * 100).toFixed(1)} %`);
  process.exit(0);
}

const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.log("Uso: npm run cine:conjunto -- <url> [--size 1280x720] [--recorte x,y,w,h] [--espera 12] [--out archivo.json]");
  process.exit(1);
}
const [W, H] = opt("--size", "1280x720").split("x").map(Number);
const [RX, RY, RW, RH] = opt("--recorte", `0,0,${W},${H}`).split(",").map(Number);
const OUT = opt("--out", "conjunto.json");

const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist"] });
const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, bypassCSP: true })).newPage();
// tsx envuelve las funciones con __name: en la página no existe
await page.addInitScript("window.__name = (f) => f;");
await page.addInitScript({ path: "scripts/cine/hooks/three.js" });
await page.goto(url, { waitUntil: "load" });
await page.mouse.move(RX + RW / 2, RY >= 25 ? RY - 20 : -10);
await page.waitForTimeout(Number(opt("--espera", "12")) * 1000);

// elige el conjunto y engancha la cámara que pinta su escena
const elegido = await page.evaluate(() => {
  type O = { isMesh?: boolean; isInstancedMesh?: boolean; geometry?: { uuid: string; attributes: { position: { count: number } }; boundingSphere: { radius: number } | null; computeBoundingSphere(): void }; visible?: boolean; traverse(f: (o: O) => void): void; count?: number };
  const w = window as unknown as { __cine: { state: { scenes: O[]; renderers: { render: (...a: unknown[]) => unknown }[] } }; __conj: unknown; __conjCam: unknown };
  let mejor: { scene: O; geo: string; n: number } | null = null;
  for (const s of w.__cine.state.scenes) {
    const grupos = new Map<string, number>();
    s.traverse((o) => {
      if (!o.isMesh || !o.geometry || o.visible === false) return;
      const n = o.isInstancedMesh ? o.count ?? 0 : 1;
      const k = String(o.geometry.attributes.position.count);
      grupos.set(k, (grupos.get(k) ?? 0) + n);
    });
    for (const [geo, n] of grupos) if (!mejor || n > mejor.n) mejor = { scene: s, geo, n };
  }
  if (!mejor) return null;
  w.__conj = mejor;
  const r = w.__cine.state.renderers[0];
  const orig = r.render;
  r.render = function (scene: unknown, cam: unknown) {
    if (scene === mejor!.scene) w.__conjCam = cam;
    return orig.apply(this, [scene, cam]);
  };
  let radio = 1;
  mejor.scene.traverse((o) => {
    if (o.geometry && String(o.geometry.attributes.position.count) === mejor!.geo) {
      if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      radio = o.geometry.boundingSphere!.radius;
    }
  });
  return { n: mejor.n, radio };
});
if (!elegido) {
  console.log("  no hay ningún conjunto de mallas");
  process.exit(1);
}
console.log(`  ${elegido.n} cuerpos (radio ${elegido.radio.toFixed(3)})`);

const muestra = () =>
  page.evaluate(() => {
    type V = { x: number; y: number; z: number; clone(): V; project(c: unknown): V; setFromMatrixPosition(m: unknown): V; applyMatrix4(m: unknown): V };
    type Obj = { isMesh?: boolean; isInstancedMesh?: boolean; geometry?: { attributes: { position: { count: number } } }; count: number; matrixWorld: { clone(): { multiply(m: unknown): unknown } }; getMatrixAt(i: number, m: unknown): void; updateMatrixWorld(): void; position: V; getWorldPosition(v: V): V; getWorldQuaternion(q: unknown): { x: number; y: number; z: number; w: number }; quaternion: { clone(): unknown } };
    const w = window as unknown as { __conj: { scene: { traverse(f: (o: Obj) => void): void }; geo: string }; __conjCam: { updateMatrixWorld?(): void } | undefined };
    const { scene, geo } = w.__conj;
    const cs: number[][] = [];
    let base: Obj | null = null;
    scene.traverse((o) => {
      if (!o.isMesh || !o.geometry || String(o.geometry.attributes.position.count) !== geo) return;
      o.updateMatrixWorld();
      base = base || o;
      if (o.isInstancedMesh) {
        // matriz de cada instancia en el mundo: se descompone con las clases de three que lleva el propio objeto
        const M = o.matrixWorld.clone() as unknown as { constructor: new () => { decompose(p: V, q: unknown, s: V): void; multiplyMatrices(a: unknown, b: unknown): unknown } };
        const Mat = M.constructor;
        const P = o.position.clone(), S = o.position.clone();
        const Q = o.quaternion.clone() as { x: number; y: number; z: number; w: number };
        for (let i = 0; i < o.count; i++) {
          const mi = new Mat();
          o.getMatrixAt(i, mi);
          const mw = new Mat();
          mw.multiplyMatrices(o.matrixWorld, mi);
          mw.decompose(P, Q, S);
          if (!cs.some((c) => Math.abs(c[0] - P.x) + Math.abs(c[1] - P.y) + Math.abs(c[2] - P.z) < 1e-5)) cs.push([P.x, P.y, P.z, Q.x, Q.y, Q.z, Q.w]);
        }
      } else {
        const p = o.getWorldPosition(o.position.clone());
        const q = o.getWorldQuaternion(o.quaternion.clone());
        if (!cs.some((c) => Math.abs(c[0] - p.x) + Math.abs(c[1] - p.y) + Math.abs(c[2] - p.z) < 1e-5)) cs.push([p.x, p.y, p.z, q.x, q.y, q.z, q.w]);
      }
    });
    // centro del grupo en pantalla (0–1 sobre el lienzo de la cámara)
    let centro: [number, number] | null = null;
    const cam = w.__conjCam;
    if (cam && base && cs.length) {
      const v = (base as Obj).position.clone();
      v.x = cs.reduce((s, c) => s + c[0], 0) / cs.length;
      v.y = cs.reduce((s, c) => s + c[1], 0) / cs.length;
      v.z = cs.reduce((s, c) => s + c[2], 0) / cs.length;
      const pr = v.project(cam);
      centro = [(pr.x + 1) / 2, (1 - pr.y) / 2];
    }
    return { t: performance.now() / 1000, cs, centro };
  });

const serie: Muestra[] = [];
// fuera del recorte; si el recorte llega arriba (un lienzo a toda ventana, el banco), fuera de la ventana: Chromium
// lanza pointerleave igual que cuando el ratón sale de la página
const fuera = () => page.mouse.move(RX + RW / 2, RY >= 25 ? RY - 20 : -10);
await fuera();
for (let i = 0; i < 40; i++) {
  serie.push({ fase: "reposo", p: null, ...(await muestra()) });
  await page.waitForTimeout(100);
}
for (let i = 0; i < 60; i++) {
  const u = i < 30 ? i / 29 : (59 - i) / 29;
  const x = RX + RW * (0.15 + 0.7 * u), y = RY + RH / 2;
  await page.mouse.move(x, y, { steps: 3 });
  serie.push({ fase: "barrido", p: [(x - RX) / RW, (y - RY) / RH], ...(await muestra()) });
  await page.waitForTimeout(70);
}
await fuera();
for (let i = 0; i < 40; i++) {
  serie.push({ fase: "cola", p: null, ...(await muestra()) });
  await page.waitForTimeout(100);
}
await browser.close();

// ---------------------------------------------------------------- medidas
const R = elegido.radio;
const ang = (p: number[], q: number[]) => 2 * Math.acos(Math.min(1, Math.abs(p[3] * q[3] + p[4] * q[4] + p[5] * q[5] + p[6] * q[6])));
const fases: Resultado["fases"] = {};
const acc: Record<string, { v: number[]; w: number[]; d: number[] }> = {};
for (let i = 1; i < serie.length; i++) {
  const a = serie[i - 1], b = serie[i];
  const dt = b.t - a.t;
  if (dt <= 0 || a.cs.length !== b.cs.length) continue;
  const f = (acc[b.fase] ??= { v: [], w: [], d: [] });
  let v = 0, w = 0;
  const c = [0, 1, 2].map((k) => b.cs.reduce((s, x) => s + x[k], 0) / b.cs.length);
  let d = 0;
  for (let k = 0; k < b.cs.length; k++) {
    const p = a.cs[k], q = b.cs[k];
    v += Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) / dt;
    w += ang(p, q) / dt;
    d += Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]);
  }
  f.v.push(v / b.cs.length / R);
  f.w.push(w / b.cs.length);
  f.d.push(d / b.cs.length / R);
}
const media = (x: number[]) => x.reduce((s, y) => s + y, 0) / Math.max(1, x.length);
for (const [k, f] of Object.entries(acc)) fases[k] = { v: media(f.v), w: media(f.w), disp: media(f.d) };

// ganancia y retraso: el centro en pantalla contra el puntero, con el desfase que mejor los alinea
const barrido = serie.filter((s) => s.fase === "barrido" && s.centro && s.p);
let mejor = { r: -Infinity, lag: 0, g: 0 };
const dtm = media(barrido.slice(1).map((s, i) => s.t - barrido[i].t));
for (let lag = 0; lag <= 12; lag++) {
  const xs: number[] = [], ys: number[] = [];
  for (let i = lag; i < barrido.length; i++) (xs.push(barrido[i - lag].p![0] - 0.5), ys.push(barrido[i].centro![0] - 0.5));
  const mx = media(xs), my = media(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < xs.length; i++) (sxy += (xs[i] - mx) * (ys[i] - my), sxx += (xs[i] - mx) ** 2, syy += (ys[i] - my) ** 2);
  const r = sxy / Math.sqrt(sxx * syy || 1);
  if (r > mejor.r) mejor = { r, lag, g: sxy / (sxx || 1) };
}
// vuelta al centro: el centro en pantalla en la cola, ajuste exponencial hacia el valor del final del reposo
const cola = serie.filter((s) => s.fase === "cola" && s.centro);
const reposo = serie.filter((s) => s.fase === "reposo" && s.centro);
const fin = reposo.length ? reposo[reposo.length - 1].centro![0] : 0.5;
const d0 = cola.length ? cola[0].centro![0] - fin : 0;
let tau = 0;
if (cola.length && Math.abs(d0) > 0.01) {
  const k = cola.findIndex((s) => Math.abs(s.centro![0] - fin) < Math.abs(d0) / Math.E);
  tau = k > 0 ? cola[k].t - cola[0].t : cola[cola.length - 1].t - cola[0].t;
}
const res: Resultado = { url, radio: R, cuerpos: elegido.n, fases, ganancia: mejor.g, retraso: mejor.lag * dtm, tau, serie };
writeFileSync(OUT, JSON.stringify(res));
for (const [k, f] of Object.entries(fases)) console.log(`  ${k}: velocidad ${f.v.toFixed(3)} radios/s · giro ${f.w.toFixed(3)} rad/s · dispersión ${f.disp.toFixed(2)} radios`);
console.log(`  el centro sigue al puntero con ganancia ${mejor.g.toFixed(2)} y ${(mejor.lag * dtm).toFixed(2)} s de retraso (r ${mejor.r.toFixed(2)}); vuelve con τ ${tau.toFixed(2)} s`);
console.log(`  ${OUT}`);
