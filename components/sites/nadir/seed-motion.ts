/** Absolute, reversible kinematics. No random forces or accumulated rotations. */
export const SEED_MECHANICS = {
  hingeY: -2.75,
  hingeRadius: .32,
  azimuth: Math.PI / 6,
  collarTravel: 3.08,
  extraction: .3,
  maxAngle: .9,
  cycleSeconds: 26,
  bands: [[.14, .43], [.59, .83], [.92, 1]] as const,
} as const;

function clamp(v: number) { return Math.max(0, Math.min(1, v)); }
/** Quintic interpolation: zero velocity and acceleration at each end stop. */
export function ease(v: number, start = 0, end = 1) {
  const t = clamp((v - start) / (end - start));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Quiet 6-second open dwell; no snapping or continuous flapping while reading. */
export function seedDwell(seconds: number) {
  const t = ((seconds % SEED_MECHANICS.cycleSeconds) + SEED_MECHANICS.cycleSeconds) % SEED_MECHANICS.cycleSeconds;
  if (t < 5) return 0;
  if (t < 9) return ease(t, 5, 9);
  if (t <= 15) return 1;
  if (t < 20) return 1 - ease(t, 15, 20);
  return 0;
}

/** Non-overlapping chapter bands, including when navigating directly or backwards. */
export function seedOpening(chapter: number, progress: number, seconds: number) {
  const c = Math.max(0, Math.min(2, chapter)), index = Math.min(1, Math.floor(c));
  const dwell = seedDwell(seconds), p = ease(progress, .04, .72);
  const value = (i: number) => {
    const [min, max] = SEED_MECHANICS.bands[i];
    const resting = min + (max - min) * p * .42;
    return resting + (max - resting) * dwell;
  };
  return value(index) + (value(index + 1) - value(index)) * (c - index);
}

export function seedMechanism(open: number, explode: number) {
  const o = clamp(open), e = clamp(explode), release = Math.max(o, e);
  // Collar clears the bottom of the shell BEFORE extraction or rotation begins.
  const unlock = ease(release, 0, .1);
  const extraction = ease(release, .1, .24) * SEED_MECHANICS.extraction;
  const hinge = ease(o, .24, 1) * SEED_MECHANICS.maxAngle;
  return { unlock, collarY: -unlock * SEED_MECHANICS.collarTravel, radial: extraction + e * .9 * ease(release, .1, .24), hinge, explode: e };
}

const STORY = [
  // intro / noise / answer / departure
  [[.02, .12, .00, -.12, .04], [.16, .5, .10, .08, -.05], [.5, .95, .28, -.3, .16], [.12, .65, .12, .2, -.08]],
  // arrival / architecture / opening / contact
  [[.12, .45, .10, .16, .04], [.35, .8, .24, -.2, -.1], [.82, 1.1, .5, .28, .2], [.28, 1.25, .65, -.14, -.14]],
  // archive / memory / invitation / final message
  [[.22, .7, .35, -.1, .04], [.5, 1.1, .6, .22, -.1], [.9, 1.4, .82, -.26, .2], [.2, 1.6, 1, .08, 0]],
] as const;

/** Individual held poses, not only a sine-wave excursion between identical endpoints. */
export function seedStory(chapter: number, progress: number) {
  const c = Math.max(0, Math.min(2, chapter)), ci = Math.min(1, Math.floor(c));
  const p = Math.max(0, Math.min(1, progress)) * 3, i = Math.min(2, Math.floor(p)), t = ease(p - i);
  const sample = (ch: number, axis: number) => STORY[ch][i][axis] + (STORY[ch][i + 1][axis] - STORY[ch][i][axis]) * t;
  const channel = (axis: number) => sample(ci, axis) + (sample(ci + 1, axis) - sample(ci, axis)) * (c - ci);
  const transit = Math.sin((p - i) * Math.PI) ** 2;
  return { explode: clamp(channel(0) + transit * .13), energy: channel(1), reveal: channel(2), yaw: channel(3), pitch: channel(4), transit };
}

/** One cinematic flare with fast attack and a long tail, rather than repeated strobing. */
export function seedFlash(age: number) {
  if (age < 0 || age > 2.4) return 0;
  if (age < .24) return ease(age, 0, .24);
  if (age < .64) return 1;
  return 1 - ease(age, .64, 2.4);
}

/** A quiet interval between autonomous signal emissions. */
export function seedSignalFlash(seconds: number) {
  return seedFlash(((seconds % 18) + 18) % 18 - 5);
}
