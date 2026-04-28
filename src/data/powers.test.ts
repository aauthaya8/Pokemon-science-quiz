import powers from "./powers.json";
import type { Power } from "../types";

const data = powers as Power[];

test("6 powers", () => expect(data).toHaveLength(6));
test("ids match levels.json unlocks", () => {
  const ids = data.map(p => p.id).sort();
  expect(ids).toEqual(
    ["beastRoar","cosmicCrush","lightningBolt","mastersSpark","meteorStrike","vineWhip"]
  );
});
test("each power has emoji + description", () => {
  data.forEach(p => {
    expect(p.emoji.length).toBeGreaterThan(0);
    expect(p.description.length).toBeGreaterThan(10);
  });
});
