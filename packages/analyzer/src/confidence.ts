export const DETERMINISTIC_CONFIDENCE = 1;
export const STRONG_HEURISTIC_CONFIDENCE = 0.8;
export const WEAK_HEURISTIC_CONFIDENCE = 0.55;

export function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, value));
}
