import { isSuperEffective, damageMultiplier } from "./typeEffectiveness";

describe("isSuperEffective", () => {
  test("vineWhip is super effective vs rock", () => {
    expect(isSuperEffective("vineWhip", "rock")).toBe(true);
  });
  test("meteorStrike is super effective vs bug and fire", () => {
    expect(isSuperEffective("meteorStrike", "bug")).toBe(true);
    expect(isSuperEffective("meteorStrike", "fire")).toBe(true);
  });
  test("beastRoar is super effective vs psychic", () => {
    expect(isSuperEffective("beastRoar", "psychic")).toBe(true);
  });
  test("lightningBolt has no super-effective targets in our roster", () => {
    expect(isSuperEffective("lightningBolt", "electric")).toBe(false);
    expect(isSuperEffective("lightningBolt", "rock")).toBe(false);
    expect(isSuperEffective("lightningBolt", "fire")).toBe(false);
  });
  test("unknown power id returns false", () => {
    expect(isSuperEffective("nopeNotReal", "rock")).toBe(false);
  });
  test("non-effective combos return false", () => {
    expect(isSuperEffective("vineWhip", "psychic")).toBe(false);
    expect(isSuperEffective("beastRoar", "rock")).toBe(false);
  });
});

describe("damageMultiplier", () => {
  test("returns 1 when no powerId", () => {
    expect(damageMultiplier(null, "rock")).toBe(1);
  });
  test("returns 1.5 for super-effective combos", () => {
    expect(damageMultiplier("vineWhip", "rock")).toBe(1.5);
    expect(damageMultiplier("mastersSpark", "fire")).toBe(1.5);
  });
  test("returns 1 for non-super-effective combos", () => {
    expect(damageMultiplier("beastRoar", "rock")).toBe(1);
    expect(damageMultiplier("vineWhip", "electric")).toBe(1);
  });
});
