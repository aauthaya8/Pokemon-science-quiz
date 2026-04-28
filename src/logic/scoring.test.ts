import { pointsForAnswer, starsForStrikes } from "./scoring";

describe("pointsForAnswer", () => {
  test("basic attack: 10 × difficulty", () => {
    expect(pointsForAnswer({ difficulty: 1, powered: false })).toBe(10);
    expect(pointsForAnswer({ difficulty: 2, powered: false })).toBe(20);
    expect(pointsForAnswer({ difficulty: 3, powered: false })).toBe(30);
  });

  test("powered attack: doubles points", () => {
    expect(pointsForAnswer({ difficulty: 1, powered: true })).toBe(20);
    expect(pointsForAnswer({ difficulty: 3, powered: true })).toBe(60);
  });
});

describe("starsForStrikes", () => {
  test("0 strikes = 3 stars", () => { expect(starsForStrikes(0)).toBe(3); });
  test("1 strike = 2 stars", () => { expect(starsForStrikes(1)).toBe(2); });
  test("2 strikes = 1 star", () => { expect(starsForStrikes(2)).toBe(1); });
});
