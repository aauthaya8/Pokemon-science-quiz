import type { Profile } from "../types";

export function isLevelUnlocked(levelId: number, profile: Profile): boolean {
  if (levelId === 1) return true;
  return Boolean(profile.levelResults[levelId - 1]);
}

export function nextPlayableLevel(profile: Profile, totalLevels: number): number | null {
  for (let id = 1; id <= totalLevels; id++) {
    if (!profile.levelResults[id]) return id;
  }
  return null;
}
