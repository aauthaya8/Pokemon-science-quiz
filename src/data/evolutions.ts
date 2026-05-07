// Evolution chains for the four starter Pokémon offered on the title screen.
// Each chain is keyed by the starter's PokéAPI Dex ID (the original choice).
// `minTrainerLevel` is the inclusive trainer level at which a stage becomes
// the active form. Stage 0 is always the starter at Lv 1.

export interface EvolutionStage {
  pokemonId: number;
  name: string;
  minTrainerLevel: number;
}

export const EVOLUTION_CHAINS: Record<number, EvolutionStage[]> = {
  // Pikachu line (2 stages)
  25: [
    { pokemonId: 25, name: "Pikachu", minTrainerLevel: 1 },
    { pokemonId: 26, name: "Raichu", minTrainerLevel: 4 },
  ],
  // Eevee line (2 stages — picking Sylveon as a kid-friendly Eeveelution)
  133: [
    { pokemonId: 133, name: "Eevee", minTrainerLevel: 1 },
    { pokemonId: 700, name: "Sylveon", minTrainerLevel: 4 },
  ],
  // Bulbasaur line (3 stages, full canon)
  1: [
    { pokemonId: 1, name: "Bulbasaur", minTrainerLevel: 1 },
    { pokemonId: 2, name: "Ivysaur", minTrainerLevel: 3 },
    { pokemonId: 3, name: "Venusaur", minTrainerLevel: 7 },
  ],
  // Charmander line (3 stages, full canon)
  4: [
    { pokemonId: 4, name: "Charmander", minTrainerLevel: 1 },
    { pokemonId: 5, name: "Charmeleon", minTrainerLevel: 3 },
    { pokemonId: 6, name: "Charizard", minTrainerLevel: 7 },
  ],
};
