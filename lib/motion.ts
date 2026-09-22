export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.2, 0.9, 0.1, 1],
} as const;

export const dur = {
  state: 0.16,
  entrance: 0.45,
  slow: 0.7,
} as const;
