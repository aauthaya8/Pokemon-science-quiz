import type { Grade, Profile } from "../types";

export const PROFILE_KEY = "kidsScienceBattle.profile.v1";

export function defaultProfile(name: string, grade: Grade): Profile {
  return {
    playerName: name,
    gradeLevel: grade,
    totalPoints: 0,
    unlockedPowers: [],
    levelResults: {},
  };
}

export function loadProfile(storage: Storage): Profile | null {
  try {
    const raw = storage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
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
