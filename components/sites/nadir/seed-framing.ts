import { ease } from "./seed-motion";

// Like Quilate: alternate full-object reading shots, detail shots and central interludes.
// Channels: amount of core close-up / focus height in the seed's local coordinates.
const SHOTS = [
  [[.05, .15], [0, .05], [.58, .35], [.08, .15]],
  [[.12, .15], [.2, .1], [1, .35], [.6, .65]],
  [[.3, .25], [.72, .35], [1, .6], [.12, .35]],
] as const;

export function seedFraming(chapter: number, progress: number, mobile: boolean) {
  const c = Math.max(0, Math.min(2, chapter)), ci = Math.min(1, Math.floor(c));
  const p = Math.max(0, Math.min(1, progress)) * 3, i = Math.min(2, Math.floor(p)), raw = p - i;
  const sample = (ch: number, axis: number) => SHOTS[ch][i][axis] + (SHOTS[ch][i + 1][axis] - SHOTS[ch][i][axis]) * ease(raw);
  const channel = (axis: number) => sample(ci, axis) + (sample(ci + 1, axis) - sample(ci, axis)) * (c - ci);
  const interlude = i > 0 ? Math.sin(raw * Math.PI) ** 8 : 0;
  const detail = Math.max(channel(0), interlude * .55);
  return { detail: mobile ? detail * .72 : detail, focusY: channel(1), interlude, cropped: detail > .28 };
}
