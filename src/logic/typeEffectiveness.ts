import type { PokemonType } from "../types";

const SUPER_EFFECTIVE: Record<string, PokemonType[]> = {
  beastRoar: ["psychic"],
  vineWhip: ["rock"],
  meteorStrike: ["bug", "fire"],
  lightningBolt: [],
  cosmicCrush: ["psychic"],
  mastersSpark: ["fire", "psychic"],
};

export function isSuperEffective(powerId: string, opponentType: PokemonType): boolean {
  return (SUPER_EFFECTIVE[powerId] ?? []).includes(opponentType);
}

export function damageMultiplier(powerId: string | null, opponentType: PokemonType): number {
  if (!powerId) return 1;
  return isSuperEffective(powerId, opponentType) ? 1.5 : 1;
}
