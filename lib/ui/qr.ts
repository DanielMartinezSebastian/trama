/**
 * Codificador QR sin dependencias (ISO/IEC 18004): modo byte (UTF-8), versiones 1–10 y los cuatro niveles de corrección.
 * Da para URLs de hasta ~270 bytes (versión 10, nivel L), que es lo que necesita una carta en mesa, un enlace de reserva o
 * una tarjeta de visita. Devuelve la matriz de módulos; el dibujo (cuadrados, puntos, redondeado) lo hace `QRCode`.
 */

export type QrEcc = "L" | "M" | "Q" | "H";

// por versión (1–10) y nivel: [códigos de corrección por bloque, bloques del grupo 1, datos por bloque del grupo 1, bloques del grupo 2, datos por bloque del grupo 2]
const BLOCKS: Record<QrEcc, number[][]> = {
  L: [[7, 1, 19], [10, 1, 34], [15, 1, 55], [20, 1, 80], [26, 1, 108], [18, 2, 68], [20, 2, 78], [24, 2, 97], [30, 2, 116], [18, 2, 68, 2, 69]],
  M: [[10, 1, 16], [16, 1, 28], [26, 1, 44], [18, 2, 32], [24, 2, 43], [16, 4, 27], [18, 4, 31], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44]],
  Q: [[13, 1, 13], [22, 1, 22], [18, 2, 17], [26, 2, 24], [18, 2, 15, 2, 16], [24, 4, 19], [18, 2, 14, 4, 15], [22, 4, 18, 2, 19], [20, 4, 16, 4, 17], [24, 6, 19, 2, 20]],
  H: [[17, 1, 9], [28, 1, 16], [22, 2, 13], [16, 4, 9], [22, 2, 11, 2, 12], [28, 4, 15], [26, 4, 13, 1, 14], [26, 4, 14, 2, 15], [24, 4, 12, 4, 13], [28, 6, 15, 2, 16]],
};
const ALIGN: number[][] = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
const ECC_BITS: Record<QrEcc, number> = { L: 1, M: 0, Q: 3, H: 2 };

/* ---------- campo de Galois GF(256) y Reed-Solomon ---------- */
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
}
const mul = (a: number, b: number) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);

function generator(n: number) {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= g[j];
      next[j + 1] ^= mul(g[j], EXP[i]);
    }
    g = next;
  }
  return g;
}

function rsRemainder(data: number[], n: number) {
  const g = generator(n);
  const res = new Array(n).fill(0);
  for (const d of data) {
    const factor = d ^ res.shift()!;
    res.push(0);
    for (let i = 0; i < n; i++) res[i] ^= mul(g[i + 1], factor);
  }
  return res;
}

/* ---------- datos → palabras de código ---------- */
const capacity = (v: number, ecc: QrEcc) => {
  const [, b1, d1, b2 = 0, d2 = 0] = BLOCKS[ecc][v - 1];
  return b1 * d1 + b2 * d2;
};

function codewords(bytes: Uint8Array, v: number, ecc: QrEcc) {
  const bits: number[] = [];
  const put = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  put(0b0100, 4); // modo byte
  put(bytes.length, v < 10 ? 8 : 16);
  bytes.forEach((b) => put(b, 8));
  const total = capacity(v, ecc) * 8;
  put(0, Math.min(4, total - bits.length)); // terminador
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  for (let pad = 0; data.length < total / 8; pad++) data.push(pad % 2 ? 0x11 : 0xec);

  // bloques, corrección y entrelazado
  const [ec, b1, d1, b2 = 0, d2 = 0] = BLOCKS[ecc][v - 1];
  const blocks: number[][] = [];
  let k = 0;
  for (let i = 0; i < b1 + b2; i++) {
    const len = i < b1 ? d1 : d2;
    blocks.push(data.slice(k, k + len));
    k += len;
  }
  const ecs = blocks.map((b) => rsRemainder(b, ec));
  const out: number[] = [];
  for (let i = 0; i < Math.max(d1, d2); i++) for (const b of blocks) if (i < b.length) out.push(b[i]);
  for (let i = 0; i < ec; i++) for (const e of ecs) out.push(e[i]);
  return out;
}

/* ---------- matriz ---------- */
type Grid = { size: number; mod: Uint8Array; fixed: Uint8Array };

function bch(value: number, poly: number, polyBits: number) {
  let v = value << (polyBits - 1);
  for (let i = 31 - Math.clz32(v); i >= polyBits - 1; i--) if ((v >>> i) & 1) v ^= poly << (i - (polyBits - 1));
  return (value << (polyBits - 1)) | v;
}

function base(v: number): Grid {
  const size = v * 4 + 17;
  const g: Grid = { size, mod: new Uint8Array(size * size), fixed: new Uint8Array(size * size) };
  const set = (x: number, y: number, on: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    g.mod[y * size + x] = on ? 1 : 0;
    g.fixed[y * size + x] = 1;
  };
  // buscadores con su separador
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(cx + dx, cy + dy, d !== 2 && d !== 4);
      }
  }
  // patrones de sincronización
  for (let i = 8; i < size - 8; i++) {
    set(i, 6, i % 2 === 0);
    set(6, i, i % 2 === 0);
  }
  // alineación (sin pisar los buscadores)
  const pos = ALIGN[v - 1];
  for (const ay of pos)
    for (const ax of pos) {
      if ((ax === 6 && ay === 6) || (ax === 6 && ay === pos[pos.length - 1]) || (ax === pos[pos.length - 1] && ay === 6)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  // reserva de formato (se escribe después) y módulo oscuro
  for (let i = 0; i < 9; i++) {
    if (i === 6) continue; // (8, 6) y (6, 8) son de la sincronización
    set(8, i, false);
    set(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    set(size - 1 - i, 8, false);
    set(8, size - 1 - i, false);
  }
  set(8, size - 8, true);
  // información de versión (7+)
  if (v >= 7) {
    const bits = bch(v, 0x1f25, 13);
    for (let i = 0; i < 18; i++) {
      const on = ((bits >>> i) & 1) === 1;
      const a = Math.floor(i / 3);
      const b = size - 11 + (i % 3);
      set(a, b, on);
      set(b, a, on);
    }
  }
  return g;
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function placeData(g: Grid, words: number[]) {
  const { size, mod, fixed } = g;
  let bit = 0;
  const total = words.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // la columna de sincronización no cuenta
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (fixed[y * size + x]) continue;
        const on = bit < total ? (words[bit >>> 3] >>> (7 - (bit & 7))) & 1 : 0;
        mod[y * size + x] = on;
        bit++;
      }
    }
  }
}

function writeFormat(g: Grid, ecc: QrEcc, mask: number) {
  const { size, mod } = g;
  const bits = bch((ECC_BITS[ecc] << 3) | mask, 0x537, 11) ^ 0x5412;
  const b = (i: number) => (bits >>> i) & 1;
  for (let i = 0; i <= 5; i++) mod[i * size + 8] = b(i);
  mod[7 * size + 8] = b(6);
  mod[8 * size + 8] = b(7);
  mod[8 * size + 7] = b(8);
  for (let i = 9; i < 15; i++) mod[8 * size + (14 - i)] = b(i);
  for (let i = 0; i < 8; i++) mod[8 * size + (size - 1 - i)] = b(i);
  for (let i = 8; i < 15; i++) mod[(size - 15 + i) * size + 8] = b(i);
  mod[(size - 8) * size + 8] = 1;
}

function penalty({ size, mod }: Grid) {
  let p = 0;
  const at = (x: number, y: number) => mod[y * size + x];
  // filas y columnas: tramos de 5+ del mismo color y patrones parecidos a un buscador
  for (const horiz of [true, false]) {
    for (let a = 0; a < size; a++) {
      let run = 1;
      const line: number[] = [];
      for (let b = 0; b < size; b++) line.push(horiz ? at(b, a) : at(a, b));
      for (let b = 1; b < size; b++) {
        if (line[b] === line[b - 1]) run++;
        else {
          if (run >= 5) p += run - 2;
          run = 1;
        }
      }
      if (run >= 5) p += run - 2;
      const s = line.join("");
      for (const pat of ["10111010000", "00001011101"]) for (let i = s.indexOf(pat); i !== -1; i = s.indexOf(pat, i + 1)) p += 40;
    }
  }
  // bloques 2×2
  for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = at(x, y); if (c === at(x + 1, y) && c === at(x, y + 1) && c === at(x + 1, y + 1)) p += 3; }
  // equilibrio de oscuros
  const dark = mod.reduce((a, b) => a + b, 0);
  p += Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
  return p;
}

export type QrMatrix = { size: number; version: number; ecc: QrEcc; mask: number; /** `get(x, y)` = módulo oscuro */ get: (x: number, y: number) => boolean; /** módulo de un patrón de función (buscadores, alineación…) */ isFixed: (x: number, y: number) => boolean };

/**
 * Codifica `text` (UTF-8) en la versión más pequeña que quepa. `mask` fuerza una máscara (0–7); sin ella se elige la de
 * menor penalización, como manda la norma. Lanza un error si no cabe en la versión 10.
 */
export function encodeQr(text: string, ecc: QrEcc = "M", mask?: number): QrMatrix {
  const bytes = new TextEncoder().encode(text);
  let v = 1;
  // modo byte: 4 bits de modo + 8 o 16 de longitud
  while (v <= 10 && capacity(v, ecc) * 8 < 4 + (v < 10 ? 8 : 16) + bytes.length * 8) v++;
  if (v > 10) throw new Error(`QR: el texto ocupa ${bytes.length} bytes y no cabe en la versión 10 (${ecc})`);
  const words = codewords(bytes, v, ecc);
  let best: Grid | null = null;
  let bestMask = 0;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    if (mask !== undefined && m !== mask) continue;
    const g = base(v);
    placeData(g, words);
    for (let y = 0; y < g.size; y++) for (let x = 0; x < g.size; x++) if (!g.fixed[y * g.size + x] && MASKS[m](x, y)) g.mod[y * g.size + x] ^= 1;
    writeFormat(g, ecc, m);
    const score = mask !== undefined ? 0 : penalty(g);
    if (score < bestScore) {
      best = g;
      bestMask = m;
      bestScore = score;
    }
  }
  const g = best!;
  return { size: g.size, version: v, ecc, mask: bestMask, get: (x, y) => g.mod[y * g.size + x] === 1, isFixed: (x, y) => g.fixed[y * g.size + x] === 1 };
}
