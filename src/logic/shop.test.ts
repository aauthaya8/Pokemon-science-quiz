import { canAfford, isOwned, buyItem, consumeItem, toggleCosmetic } from "./shop";
import { SHOP_ITEMS } from "../data/shopItems";
import { defaultProfile } from "./profileStorage";
import type { Profile } from "../types";

const HEART_POTION = SHOP_ITEMS.find((i) => i.id === "heartPotion")!;
const CROWN = SHOP_ITEMS.find((i) => i.id === "crown")!;

const richProfile = (): Profile => ({ ...defaultProfile("Avi", 3), totalPoints: 1000 });
const poorProfile = (): Profile => ({ ...defaultProfile("Avi", 3), totalPoints: 10 });

describe("canAfford", () => {
  test("returns true when totalPoints >= price", () => {
    expect(canAfford(richProfile(), HEART_POTION)).toBe(true);
  });
  test("returns true at exact price", () => {
    const p: Profile = { ...defaultProfile("Avi", 3), totalPoints: HEART_POTION.price };
    expect(canAfford(p, HEART_POTION)).toBe(true);
  });
  test("returns false when totalPoints < price", () => {
    expect(canAfford(poorProfile(), HEART_POTION)).toBe(false);
  });
});

describe("isOwned", () => {
  test("false when inventory is empty", () => {
    expect(isOwned(defaultProfile("Avi", 3), HEART_POTION)).toBe(false);
  });
  test("true when count > 0", () => {
    const p: Profile = { ...defaultProfile("Avi", 3), inventory: { heartPotion: 1 } };
    expect(isOwned(p, HEART_POTION)).toBe(true);
  });
  test("false when count is 0 (consumed)", () => {
    const p: Profile = { ...defaultProfile("Avi", 3), inventory: { heartPotion: 0 } };
    expect(isOwned(p, HEART_POTION)).toBe(false);
  });
});

describe("buyItem", () => {
  test("succeeds: deducts points and adds to inventory", () => {
    const before = richProfile();
    const { ok, profile: after } = buyItem(before, "heartPotion");
    expect(ok).toBe(true);
    expect(after.totalPoints).toBe(before.totalPoints - HEART_POTION.price);
    expect(after.inventory.heartPotion).toBe(1);
  });

  test("buying same consumable twice stacks", () => {
    let p = richProfile();
    p = buyItem(p, "heartPotion").profile;
    p = buyItem(p, "heartPotion").profile;
    expect(p.inventory.heartPotion).toBe(2);
  });

  test("fails on insufficient funds", () => {
    const before = poorProfile();
    const result = buyItem(before, "crown");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("insufficient_funds");
    expect(result.profile).toEqual(before);
  });

  test("fails on duplicate cosmetic purchase", () => {
    const owned: Profile = {
      ...richProfile(),
      inventory: { topHat: 1 },
    };
    const result = buyItem(owned, "topHat");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("already_owned");
    expect(result.profile.totalPoints).toBe(owned.totalPoints);
  });

  test("fails on unknown item id", () => {
    const result = buyItem(richProfile(), "noSuchItem");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("unknown_item");
  });
});

describe("consumeItem", () => {
  test("decrements count by 1", () => {
    const p: Profile = { ...defaultProfile("Avi", 3), inventory: { heartPotion: 2 } };
    const after = consumeItem(p, "heartPotion");
    expect(after).not.toBeNull();
    expect(after!.inventory.heartPotion).toBe(1);
  });

  test("returns null when not owned", () => {
    const p = defaultProfile("Avi", 3);
    expect(consumeItem(p, "heartPotion")).toBeNull();
  });

  test("returns null when count already 0", () => {
    const p: Profile = { ...defaultProfile("Avi", 3), inventory: { heartPotion: 0 } };
    expect(consumeItem(p, "heartPotion")).toBeNull();
  });
});

describe("toggleCosmetic", () => {
  test("equips when owned and not equipped", () => {
    const p: Profile = { ...defaultProfile("Avi", 3), inventory: { topHat: 1 } };
    const after = toggleCosmetic(p, "topHat");
    expect(after.equippedCosmetics).toContain("topHat");
  });

  test("unequips when already equipped", () => {
    const p: Profile = {
      ...defaultProfile("Avi", 3),
      inventory: { topHat: 1 },
      equippedCosmetics: ["topHat"],
    };
    const after = toggleCosmetic(p, "topHat");
    expect(after.equippedCosmetics).not.toContain("topHat");
  });

  test("no-op when not owned", () => {
    const p = defaultProfile("Avi", 3);
    const after = toggleCosmetic(p, "topHat");
    expect(after).toEqual(p);
  });

  test("preserves other equipped cosmetics", () => {
    const p: Profile = {
      ...defaultProfile("Avi", 3),
      inventory: { topHat: 1, crown: 1 },
      equippedCosmetics: ["topHat", "crown"],
    };
    const after = toggleCosmetic(p, "topHat");
    expect(after.equippedCosmetics).toEqual(["crown"]);
  });

  test("verify CROWN id resolution still works (sanity)", () => {
    expect(CROWN.id).toBe("crown");
  });
});
