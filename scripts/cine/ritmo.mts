/**
 * Ritmo de una animación ligada al scroll (docs/42, docs/36 A3): cómo responde la escena a la rueda, medido en una
 * captura con `--drive scroll --solo-lienzo` (con golpes espaciados, `--frames-per-step 90`, para ver la cola). La línea
 * de tiempo da la posición del scroll y los golpes de rueda. El movimiento de la escena sale de la cámara de three si se
 * mueve con la pose (exacto). Si no, sale del flujo del vídeo (`cine:flujo`): el lienzo fijo no se desplaza con la
 * página, así que el flujo es solo movimiento de la escena. Por cada golpe de rueda:
 *   - inercia: cuánto sigue avanzando el scroll tras el golpe (hasta que su velocidad cae al 5 % de su pico);
 *   - retraso: cuánto tarda el pico de movimiento de la escena respecto al pico de velocidad del scroll;
 *   - asentamiento: cuánto tarda la escena en quedarse quieta (10 % de su pico) tras el golpe;
 *   - meseta: qué parte del tiempo en que el scroll se mueve la escena está quieta (lo que deja leer);
 *   - temblor: cambios de sentido de la aceleración del movimiento por segundo (0 = curva limpia).
 * Más el acoplamiento global (correlación entre la velocidad del scroll y el movimiento de la escena).
 *
 *   npm run cine:ritmo -- <captura>                        ritmo.json y ritmo.md en la captura
 *   npm run cine:ritmo -- --comparar <referencia> <banco>  las dos, lado a lado
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Fila = { t: number; scroll?: { y: number }; input?: { step?: number }; camera?: { pos: number[]; dir: number[] } };
type Par = { t: number; dx: number; dy: number; escala: number; giro: number; movimiento?: number };

const mediana = (xs: number[]) => {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
};

export function ritmo(dir: string) {
  const tl = readFileSync(join(dir, "timeline.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l) as Fila);
  // movimiento de la escena por segundo. Si la cámara de three se mueve (una cámara que sigue la pose, como en Quilate),
  // se usa la cámara: posición (en tamaños de escena) y giro (grados), exacta. Si no, el flujo del vídeo (cine:flujo)
  const cam = tl.filter((f) => f.camera?.pos && f.camera?.dir);
  const camMueve = cam.length > 10 && cam.some((f) => Math.hypot(...f.camera!.pos.map((v, k) => v - cam[0].camera!.pos[k])) > 1e-3);
  let fuente: "cámara" | "flujo";
  let mov: { t: number; m: number }[];
  if (camMueve) {
    fuente = "cámara";
    const esc = Math.max(1e-3, ...cam.map((f) => Math.hypot(...f.camera!.pos.map((v, k) => v - cam[0].camera!.pos[k]))));
    // diferencia sobre ±3 fotogramas: el gancho redondea la cámara a 4 decimales y, con pasos de diezmilésimas por
    // fotograma, la diferencia entre fotogramas vecinos es sobre todo redondeo (inventaba temblor)
    const V = 3;
    mov = cam.map((f, i) => {
      const i0 = Math.max(0, i - V), i1 = Math.min(cam.length - 1, i + V);
      if (i1 === i0) return { t: f.t, m: 0 };
      const a = cam[i0].camera!, b = cam[i1].camera!;
      const dp = Math.hypot(...b.pos.map((v, k) => v - a.pos[k])) / esc;
      const cos = Math.min(1, Math.max(-1, b.dir.reduce((s, v, k) => s + v * a.dir[k], 0)));
      const dg = (Math.acos(cos) * 180) / Math.PI / 10;
      return { t: f.t, m: (dp + dg) / Math.max(cam[i1].t - cam[i0].t, 1e-3) };
    });
  } else {
    if (!existsSync(join(dir, "flujo.json"))) throw new Error(`la cámara no se mueve y falta ${join(dir, "flujo.json")}: npm run cine:flujo -- ${dir}`);
    fuente = "flujo";
    const pares = (JSON.parse(readFileSync(join(dir, "flujo.json"), "utf8")) as { pares: Par[] }).pares;
    // el de los bloques si está, si no el desplazamiento de la imagen
    mov = pares.map((p, i) => {
      const dt = i ? p.t - pares[i - 1].t : pares[1] ? pares[1].t - p.t : 1 / 30;
      const m = p.movimiento ?? Math.hypot(p.dx, p.dy) * 100 + Math.abs(Math.log(p.escala)) * 100 + Math.abs(p.giro);
      return { t: p.t, m: m / Math.max(dt, 1e-3) };
    });
  }
  const enT = (t: number) => {
    let lo = 0, hi = mov.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (mov[mid].t < t) lo = mid;
      else hi = mid;
    }
    return mov[Math.abs(mov[lo].t - t) < Math.abs(mov[hi].t - t) ? lo : hi].m;
  };
  // velocidad del scroll (px/s) y golpes de rueda (cuando cambia el paso)
  const vel = tl.map((f, i) => ({ t: f.t, v: i ? Math.abs((f.scroll?.y ?? 0) - (tl[i - 1].scroll?.y ?? 0)) / Math.max(f.t - tl[i - 1].t, 1e-3) : 0, m: 0 }));
  for (const x of vel) x.m = enT(x.t);
  const golpes: number[] = [];
  for (let i = 1; i < tl.length; i++) if ((tl[i].input?.step ?? -1) !== (tl[i - 1].input?.step ?? -1) && tl[i].input?.step !== undefined) golpes.push(i);
  const p95 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length * 0.95)] || 1;
  const mRef = p95(vel.map((x) => x.m)), vRef = p95(vel.map((x) => x.v));

  const porGolpe = golpes.map((g, k) => {
    const fin = golpes[k + 1] ?? vel.length;
    const tramo = vel.slice(g, fin);
    if (tramo.length < 4) return null;
    const t0 = vel[g].t;
    const iv = tramo.reduce((a, x, i) => (x.v > tramo[a].v ? i : a), 0);
    const im = tramo.reduce((a, x, i) => (x.m > tramo[a].m ? i : a), 0);
    const vPico = tramo[iv].v, mPico = tramo[im].m;
    const cae = (arr: number[], desde: number, umbral: number) => {
      for (let i = desde; i < arr.length; i++) if (arr[i] < umbral) return i;
      return arr.length - 1;
    };
    const inercia = tramo[cae(tramo.map((x) => x.v), iv, vPico * 0.05)].t - t0;
    const asienta = tramo[cae(tramo.map((x) => x.m), im, mPico * 0.1)].t - t0;
    const moviendo = tramo.filter((x) => x.v > vRef * 0.05);
    const quieta = moviendo.filter((x) => x.m < mRef * 0.05).length / Math.max(1, moviendo.length);
    // temblor: cambios de signo de la segunda diferencia del movimiento, por segundo
    // sobre la serie suavizada (media de 5 fotogramas): cuenta tirones, no ruido de medida
    const sm = tramo.map((_, i) => {
      const v = tramo.slice(Math.max(0, i - 2), i + 3).map((x) => x.m);
      return v.reduce((a2, b2) => a2 + b2, 0) / v.length;
    });
    let cambios = 0;
    for (let i = 2; i < sm.length; i++) {
      const a = sm[i - 1] - sm[i - 2], b = sm[i] - sm[i - 1];
      if (Math.sign(a) !== Math.sign(b) && Math.abs(b) > mRef * 0.03) cambios++;
    }
    const dur = tramo[tramo.length - 1].t - t0 || 1;
    // reposo al final del tramo: cuánto movimiento queda justo antes del golpe siguiente, frente a su pico (0 = se paró)
    const resto = tramo[tramo.length - 1].m / Math.max(mPico, 1e-6);
    return { t0: +t0.toFixed(2), inercia, retraso: tramo[im].t - tramo[iv].t, asienta, quieta, temblor: cambios / dur, pico: mPico, resto, mueve: mPico > mRef * 0.1 };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  // acoplamiento: correlación entre velocidad del scroll y movimiento de la escena
  const xs = vel.map((x) => x.v), ys = vel.map((x) => x.m);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const activos = porGolpe.filter((g) => g.mueve);
  return {
    dir,
    fuente,
    golpes: porGolpe.length,
    activos: activos.length,
    inercia: +mediana(porGolpe.map((g) => g.inercia)).toFixed(3),
    retraso: +mediana(activos.map((g) => g.retraso)).toFixed(3),
    asentamiento: +mediana(activos.map((g) => g.asienta)).toFixed(3),
    meseta: +mediana(porGolpe.map((g) => g.quieta)).toFixed(3),
    rapidez: +mediana(activos.map((g) => g.pico)).toFixed(3),
    reposo: +mediana(activos.map((g) => g.resto)).toFixed(3),
    temblor: +mediana(activos.map((g) => g.temblor)).toFixed(2),
    acoplamiento: +(sxy / Math.sqrt(sxx * syy || 1)).toFixed(3),
    porGolpe,
  };
}

const NOMBRES: [keyof ReturnType<typeof ritmo>, string, string][] = [
  ["inercia", "Inercia del scroll (s)", "cuánto sigue avanzando el scroll tras un golpe de rueda"],
  ["retraso", "Retraso de la escena (s)", "del pico de velocidad del scroll al pico de movimiento de la escena"],
  ["asentamiento", "Asentamiento (s)", "del golpe a que la escena se queda quieta"],
  ["meseta", "Meseta", "parte del scroll en movimiento con la escena quieta"],
  ["rapidez", "Rapidez", "pico de movimiento de la escena por golpe (recorridos de escena por segundo; con la cámara, fracción de su recorrido total)"],
  ["reposo", "Sin parar", "movimiento que queda al llegar el golpe siguiente, frente a su pico (0 = la escena ya se había parado)"],
  ["temblor", "Temblor (/s, experimental)", "cambios de sentido de la aceleración; sensible al redondeo de la captura"],
  ["acoplamiento", "Acoplamiento", "correlación entre la velocidad del scroll y el movimiento de la escena"],
];

const argv = process.argv.slice(2);
if (argv[0] === "--comparar") {
  const a = ritmo(argv[1]), b = ritmo(argv[2]);
  const md = [`# Ritmo · referencia frente a banco`, "", `- Referencia: \`${argv[1]}\` (${a.activos} de ${a.golpes} golpes mueven la escena)`, `- Banco: \`${argv[2]}\` (${b.activos} de ${b.golpes})`, "", "| Medida | Referencia | Banco | Qué es |", "|---|---|---|---|", ...NOMBRES.map(([k, n, d]) => `| ${n} | ${a[k]} | ${b[k]} | ${d} |`)];
  console.log(md.join("\n"));
} else if (argv[0]) {
  const r = ritmo(argv[0]);
  writeFileSync(join(argv[0], "ritmo.json"), JSON.stringify(r, null, 1));
  const md = [`# Ritmo · \`${argv[0]}\``, "", `${r.activos} de ${r.golpes} golpes de rueda mueven la escena (movimiento medido con ${r.fuente === "cámara" ? "la cámara de three" : "el flujo del vídeo"}).`, "", "| Medida | Valor | Qué es |", "|---|---|---|", ...NOMBRES.map(([k, n, d]) => `| ${n} | ${r[k]} | ${d} |`)];
  writeFileSync(join(argv[0], "ritmo.md"), md.join("\n") + "\n");
  console.log(md.join("\n"));
} else {
  console.log("Uso: npm run cine:ritmo -- <captura> · npm run cine:ritmo -- --comparar <referencia> <banco>");
}
