import { EVOLUTION_CHAINS } from "../data/evolutions";

/** Returns the Pokémon ID currently visible for this starter at this trainer level. */
export function currentEvolution(
  starterId: number,
  trainerLevel: number,
): { pokemonId: number; name: string; stage: number } {
  const chain = EVOLUTION_CHAINS[starterId];
  if (!chain) return { pokemonId: starterId, name: "Unknown", stage: 0 };
  let stage = 0;
  for (let i = 0; i < chain.length; i++) {
    if (trainerLevel >= chain[i].minTrainerLevel) stage = i;
    else break;
  }
  return { pokemonId: chain[stage].pokemonId, name: chain[stage].name, stage };
}

/** Returns the new evolution stage if `before` and `after` levels would cross an evolution threshold. */
export function didEvolve(
  starterId: number,
  beforeLevel: number,
  afterLevel: number,
): { pokemonId: number; name: string } | null {
  if (afterLevel <= beforeLevel) return null;
  const before = currentEvolution(starterId, beforeLevel);
  const after = currentEvolution(starterId, afterLevel);
  if (after.stage > before.stage) {
    return { pokemonId: after.pokemonId, name: after.name };
  }
  return null;
}
