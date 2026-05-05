import { levelForPoints } from "./playerLevel";

describe("levelForPoints", () => {
  test("0 points → Lv1 Rookie", () => {
    const r = levelForPoints(0);
    expect(r.level).toBe(1);
    expect(r.title).toBe("Rookie");
    expect(r.nextThreshold).toBe(50);
  });

  test("49 points → still Lv1 Rookie", () => {
    const r = levelForPoints(49);
    expect(r.level).toBe(1);
    expect(r.title).toBe("Rookie");
    expect(r.nextThreshold).toBe(50);
  });

  test("50 points → Lv2 Trainer", () => {
    const r = levelForPoints(50);
    expect(r.level).toBe(2);
    expect(r.title).toBe("Trainer");
    expect(r.nextThreshold).toBe(150);
  });

  test("1100 points → Lv7 Ace", () => {
    const r = levelForPoints(1100);
    expect(r.level).toBe(7);
    expect(r.title).toBe("Ace");
    expect(r.nextThreshold).toBe(1500);
  });

  test("3000 points → Lv10 Legend (max, nextThreshold null)", () => {
    const r = levelForPoints(3000);
    expect(r.level).toBe(10);
    expect(r.title).toBe("Legend");
    expect(r.nextThreshold).toBeNull();
  });

  test("exactly at top threshold (2600) → Lv10 Legend", () => {
    const r = levelForPoints(2600);
    expect(r.level).toBe(10);
    expect(r.title).toBe("Legend");
    expect(r.nextThreshold).toBeNull();
  });

  test("negative points clamps to Lv1 Rookie", () => {
    const r = levelForPoints(-50);
    expect(r.level).toBe(1);
    expect(r.title).toBe("Rookie");
  });
});
