import type { Grade, Profile } from "../types";

export const PROFILE_KEY = "kidsScienceBattle.profile.v1";

/** Default starter Pokémon Dex ID for legacy saves missing the field (Pikachu). */
export const DEFAULT_STARTER_POKEMON_ID = 25;

export function defaultProfile(name: string, grade: Grade, starterPokemonId: number = DEFAULT_STARTER_POKEMON_ID): Profile {
  return {
    playerName: name,
    gradeLevel: grade,
    totalPoints: 0,
    unlockedPowers: [],
    levelResults: {},
    starterPokemonId,
    inventory: {},
    equippedCosmetics: [],
  };
}

export function loadProfile(storage: Storage): Profile | null {
  try {
    const raw = storage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    // Backward compat: older saves have no starterPokemonId / inventory / equippedCosmetics.
    return {
      playerName: parsed.playerName ?? "",
      gradeLevel: (parsed.gradeLevel ?? 3) as Grade,
      totalPoints: parsed.totalPoints ?? 0,
      unlockedPowers: parsed.unlockedPowers ?? [],
      levelResults: parsed.levelResults ?? {},
      starterPokemonId: parsed.starterPokemonId ?? DEFAULT_STARTER_POKEMON_ID,
      inventory: parsed.inventory ?? {},
      equippedCosmetics: parsed.equippedCosmetics ?? [],
    };
  } catch {
    return null;
  }
}

export function saveProfile(storage: Storage, profile: Profile): void {
  try {
    storage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn("profileStorage: failed to save profile", err);
  }
}
