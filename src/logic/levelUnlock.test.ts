import { isLevelUnlocked, nextPlayableLevel } from "./levelUnlock";
import type { Profile } from "../types";

const emptyProfile = (): Profile => ({
  playerName: "Test",
  gradeLevel: 3,
  totalPoints: 0,
  unlockedPowers: [],
  levelResults: {},
  starterPokemonId: 25,
});

const completedThrough = (n: number): Profile => {
  const p = emptyProfile();
  for (let i = 1; i <= n; i++) {
    p.levelResults[i] = { stars: 3, bestPoints: 0, completedAt: "x" };
  }
  return p;
};

describe("isLevelUnlocked", () => {
  test("level 1 always unlocked", () => {
    expect(isLevelUnlocked(1, emptyProfile())).toBe(true);
  });
  test("level 2 locked if 1 not completed", () => {
    expect(isLevelUnlocked(2, emptyProfile())).toBe(false);
  });
  test("level N unlocked if N-1 completed", () => {
    expect(isLevelUnlocked(5, completedThrough(4))).toBe(true);
  });
  test("level N+1 locked if N completed but N-1 missing", () => {
    const p = emptyProfile();
    p.levelResults[3] = { stars: 3, bestPoints: 0, completedAt: "x" };
    expect(isLevelUnlocked(4, p)).toBe(true);
    expect(isLevelUnlocked(5, p)).toBe(false);
  });
});

describe("nextPlayableLevel", () => {
  test("returns 1 for empty profile", () => {
    expect(nextPlayableLevel(emptyProfile(), 12)).toBe(1);
  });
  test("returns N+1 if N highest completed", () => {
    expect(nextPlayableLevel(completedThrough(3), 12)).toBe(4);
  });
  test("returns null if all complete", () => {
    expect(nextPlayableLevel(completedThrough(12), 12)).toBe(null);
  });
});
