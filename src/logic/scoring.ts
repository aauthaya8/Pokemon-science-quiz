import type { Tier, Stars } from "../types";

export function pointsForAnswer({
  difficulty,
  powered,
}: { difficulty: Tier; powered: boolean }): number {
  return 10 * difficulty * (powered ? 2 : 1);
}

export function starsForStrikes(strikes: 0 | 1 | 2): Stars {
  return (3 - strikes) as Stars;
}
