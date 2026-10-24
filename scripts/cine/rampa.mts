/**
 * Rampa de color medida (docs/28 §3): el color de un cielo, un degradado o una niebla en función de la elevación del rayo
 * de cada píxel, sacado de un fotograma de una captura de cine:capture. Cuando un modelo analítico no reproduce el cambio
 * de tono (cálido junto al horizonte, azul claro, azul profundo), la mediana por franjas de elevación sí: se lleva tal cual
 * a una textura de 1D (ver `texturaRampa` en lib/porthole/sky.ts).
 *
 *   npm run cine:rampa -- <captura> [--frame 400] [--columnas 560-900] [--horizonte -2.49,-5.03] [--franjas -3,-1,0,1,2,4,8,16,32]
 *
 *   --frame        fotograma (número del PNG en frames/) cuya cámara se usa
 *   --columnas     rango de columnas limpias (sin piezas delante del cielo)
 *   --horizonte    elevación del horizonte en grados, c,k: el = c + k·sin(acimut) (avión que sube o baja); sin él, la
 *                  elevación absoluta
 *   --franjas      bordes de las franjas en grados (por defecto, finas junto al horizonte y anchas arriba)
 *
 * Salida: <captura>/rampa.json ([elevación, r, g, b] lineales, más los sRGB en hex) y el resplandor por acimut (la
 * luminancia de la franja baja, relativa a la del rango de columnas).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const argv = process.argv.slice(2);
const opt = (n: string, d: string) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const dir = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1]?.startsWith("--") !== true);
if (!dir) {
  console.log("Uso: npm run cine:rampa -- <captura> [--frame 400] [--columnas 560-900] [--horizonte c,k] [--franjas …]");
  process.exit(1);
}
const D = resolve(dir);
const meta = JSON.parse(readFileSync(join(D, "meta.json"), "utf8")) as { size: [number, number] };
const [W, H] = meta.size;
const frame = Number(opt("--frame", "1"));
const [x0, x1] = opt("--columnas", `0-${W}`).split("-").map(Number);
const hz = opt("--horizonte", "");
const [hc, hk] = hz ? hz.split(",").map(Number) : [0, 0];
const bordes = opt("--franjas", "-20,-8,-4,-2.5,-2,-1.5,-1,-0.6,-0.3,0,0.3,0.6,1,1.5,2,2.5,3,3.5,4,5,6,7,8,10,12,14,17,20,24,28,33,45").split(",").map(Number);

// la cámara de ese fotograma (la muestra cuyo shot es el fotograma pedido)
const muestras = readFileSync(join(D, "timeline.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const m = muestras.find((x) => x.shot === frame) ?? muestras[frame];
const cam = m.camera as { pos: number[]; quat: number[]; fov: number };
const png = join(D, "frames", `${String(frame).padStart(5, "0")}.png`);
const rgb = execFileSync("ffmpeg", ["-loglevel", "error", "-i", png, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 28 });

// rayo de un píxel en el mundo: dirección en la cámara girada por su cuaternión del mundo
const [qx, qy, qz, qw] = cam.quat;
const rot = (v: number[]) => {
  const [x, y, z] = v;
  const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
  return [ix * qw + iw * -qx + iy * -qz - iz * -qy, iy * qw + iw * -qy + iz * -qx - ix * -qz, iz * qw + iw * -qz + ix * -qy - iy * -qx];
};
const t = Math.tan(((cam.fov * Math.PI) / 180) / 2);
const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const srgb = (v: number) => Math.round(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
const S: { x: number; e: number; az: number; c: number[] }[] = [];
for (let x = 0; x < W; x += 2)
  for (let y = 0; y < H; y += 2) {
    const d = rot([(((x + 0.5) / W) * 2 - 1) * t * (W / H), (1 - ((y + 0.5) / H) * 2) * t, -1]);
    const n = Math.hypot(d[0], d[1], d[2]);
    const az = (Math.atan2(d[0] / n, -d[2] / n) * 180) / Math.PI;
    const el = (Math.asin(d[1] / n) * 180) / Math.PI;
    const i = (y * W + x) * 3;
    S.push({ x, az, e: el - (hc + hk * Math.sin((az * Math.PI) / 180)), c: [lin(rgb[i]), lin(rgb[i + 1]), lin(rgb[i + 2])] });
  }
const med = (a: number[]) => [...a].sort((p, q) => p - q)[a.length >> 1] ?? 0;
const rampa: number[][] = [];
for (let k = 0; k < bordes.length - 1; k++) {
  const P = S.filter((p) => p.x >= x0 && p.x <= x1 && p.e >= bordes[k] && p.e < bordes[k + 1]);
  if (P.length < 5) continue;
  rampa.push([+((bordes[k] + bordes[k + 1]) / 2).toFixed(2), ...[0, 1, 2].map((c) => +med(P.map((p) => p.c[c])).toFixed(5))]);
}
const L = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const ref = med(S.filter((p) => p.x >= x0 && p.x <= x1 && p.e >= 0.6 && p.e < 3).map((p) => L(p.c))) || 1;
const resplandor: number[][] = [];
const azs = S.map((p) => p.az);
const azMin = azs.reduce((a, b) => Math.min(a, b), Infinity);
const azMax = azs.reduce((a, b) => Math.max(a, b), -Infinity);
for (let a = Math.floor(azMin / 6) * 6; a < azMax; a += 6) {
  const P = S.filter((p) => p.az >= a && p.az < a + 6 && p.e >= 0.6 && p.e < 3);
  if (P.length > 5) resplandor.push([a + 3, +(med(P.map((p) => L(p.c))) / ref).toFixed(3)]);
}
const out = { frame, columnas: [x0, x1], horizonte: hz ? { c: hc, k: hk } : null, rampa, hex: rampa.map(([e, r, g, b]) => [e, "#" + [r, g, b].map((v) => srgb(v).toString(16).padStart(2, "0")).join("")]), resplandor };
writeFileSync(join(D, "rampa.json"), JSON.stringify(out, null, 1));
console.log(`  ${rampa.length} franjas · resplandor en ${resplandor.length} acimuts → ${join(D, "rampa.json")}`);
console.log("  " + out.hex.map(([e, h]) => `${e}°:${h}`).join(" "));
