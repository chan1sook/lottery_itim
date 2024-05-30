export const states = [
  "NOT_READY",
  "DECLARED",
  "OPENING",
  "EXPIRED",
  "DRAWED",
] as const;
export type LotteryState = (typeof states)[number];
