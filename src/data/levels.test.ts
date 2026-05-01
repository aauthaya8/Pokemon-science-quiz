import levels from "./levels.json";
import type { Level } from "../types";

const data = levels as Level[];

test("12 levels", () => { expect(data).toHaveLength(12); });
test("ids 1..12 in order", () => {
  expect(data.map(l => l.id)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
});
test("HP matches tier (3/5/7)", () => {
  data.forEach(l => {
    if (l.difficultyTier === 1) expect(l.creatureHp).toBe(3);
    if (l.difficultyTier === 2) expect(l.creatureHp).toBe(5);
    if (l.difficultyTier === 3) expect(l.creatureHp).toBe(7);
  });
});
test("6 powers unlocked total", () => {
  const unlocks = data.filter(l => l.unlocksPower !== null).map(l => l.unlocksPower);
  expect(unlocks).toHaveLength(6);
  expect(new Set(unlocks).size).toBe(6);
});
test("all four topics present", () => {
  const topics = new Set(data.map(l => l.topic));
  ["animals","life","earth","physical","mixed"].forEach(t => expect(topics.has(t as Level["topic"])).toBe(true));
});
test("every level has a Pokémon ID", () => {
  data.forEach(l => {
    expect(typeof l.creaturePokemonId).toBe("number");
    expect(l.creaturePokemonId).toBeGreaterThan(0);
  });
});
test("Pokémon IDs are unique per level", () => {
  const ids = data.map(l => l.creaturePokemonId);
  expect(new Set(ids).size).toBe(ids.length);
});
test("every level has a valid pokemonType", () => {
  const valid = new Set(["electric", "normal", "grass", "bug", "rock", "psychic", "fire"]);
  data.forEach(l => {
    expect(valid.has(l.pokemonType)).toBe(true);
  });
});
