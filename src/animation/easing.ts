/** Easing functions mapping t in [0, 1] to an eased value in [0, 1]. */
export type Easing = (t: number) => number;

export const linear: Easing = (t) => t;

export const quadIn: Easing = (t) => t * t;
export const quadOut: Easing = (t) => t * (2 - t);
export const quadInOut: Easing = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export const cubicIn: Easing = (t) => t * t * t;
export const cubicOut: Easing = (t) => --t * t * t + 1;
export const cubicInOut: Easing = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

export const sineIn: Easing = (t) => 1 - Math.cos((t * Math.PI) / 2);
export const sineOut: Easing = (t) => Math.sin((t * Math.PI) / 2);
export const sineInOut: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export const backOut: Easing = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const elasticOut: Easing = (t) => {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const bounceOut: Easing = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};
