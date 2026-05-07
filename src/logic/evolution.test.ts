import { currentEvolution, didEvolve } from "./evolution";

describe("currentEvolution", () => {
  test("Pikachu at Lv 1 is Pikachu (stage 0)", () => {
    expect(currentEvolution(25, 1)).toEqual({ pokemonId: 25, name: "Pikachu", stage: 0 });
  });

  test("Pikachu at Lv 4 is Raichu (stage 1)", () => {
    expect(currentEvolution(25, 4)).toEqual({ pokemonId: 26, name: "Raichu", stage: 1 });
  });

  test("Pikachu at Lv 7 is still Raichu (no further evolution)", () => {
    expect(currentEvolution(25, 7)).toEqual({ pokemonId: 26, name: "Raichu", stage: 1 });
  });

  test("Bulbasaur at Lv 2 is Bulbasaur (stage 0)", () => {
    expect(currentEvolution(1, 2)).toEqual({ pokemonId: 1, name: "Bulbasaur", stage: 0 });
  });

  test("Bulbasaur at Lv 3 is Ivysaur (stage 1)", () => {
    expect(currentEvolution(1, 3)).toEqual({ pokemonId: 2, name: "Ivysaur", stage: 1 });
  });

  test("Bulbasaur at Lv 7 is Venusaur (stage 2)", () => {
    expect(currentEvolution(1, 7)).toEqual({ pokemonId: 3, name: "Venusaur", stage: 2 });
  });

  test("Eevee at Lv 4 is Sylveon", () => {
    expect(currentEvolution(133, 4)).toEqual({ pokemonId: 700, name: "Sylveon", stage: 1 });
  });

  test("Charmander at Lv 7 is Charizard (stage 2)", () => {
    expect(currentEvolution(4, 7)).toEqual({ pokemonId: 6, name: "Charizard", stage: 2 });
  });

  test("Unknown starter id falls back gracefully", () => {
    expect(currentEvolution(999, 5)).toEqual({ pokemonId: 999, name: "Unknown", stage: 0 });
  });
});

describe("didEvolve", () => {
  test("Bulbasaur leveling 2 -> 3 returns Ivysaur", () => {
    expect(didEvolve(1, 2, 3)).toEqual({ pokemonId: 2, name: "Ivysaur" });
  });

  test("Pikachu leveling 4 -> 5 returns null (already at max)", () => {
    expect(didEvolve(25, 4, 5)).toBeNull();
  });

  test("Anyone leveling 1 -> 2 returns null (no threshold crossed)", () => {
    expect(didEvolve(25, 1, 2)).toBeNull();
    expect(didEvolve(1, 1, 2)).toBeNull();
    expect(didEvolve(133, 1, 2)).toBeNull();
    expect(didEvolve(4, 1, 2)).toBeNull();
  });

  test("returns null if afterLevel is not greater than beforeLevel", () => {
    expect(didEvolve(1, 5, 5)).toBeNull();
    expect(didEvolve(1, 5, 3)).toBeNull();
  });

  test("Bulbasaur leveling 6 -> 7 returns Venusaur (final stage)", () => {
    expect(didEvolve(1, 6, 7)).toEqual({ pokemonId: 3, name: "Venusaur" });
  });

  test("Bulbasaur leveling 2 -> 7 jumps multiple stages and returns Venusaur (the final form)", () => {
    expect(didEvolve(1, 2, 7)).toEqual({ pokemonId: 3, name: "Venusaur" });
  });

  test("Unknown starter id never evolves", () => {
    expect(didEvolve(999, 1, 7)).toBeNull();
  });
});
