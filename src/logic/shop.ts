import type { Profile } from "../types";
import type { ShopItem } from "../data/shopItems";
import { SHOP_ITEMS } from "../data/shopItems";

export interface BuyResult {
  ok: boolean;
  reason?: "insufficient_funds" | "already_owned" | "unknown_item";
  profile: Profile;
}

export function canAfford(profile: Profile, item: ShopItem): boolean {
  return profile.totalPoints >= item.price;
}

export function isOwned(profile: Profile, item: ShopItem): boolean {
  return (profile.inventory[item.id] ?? 0) > 0;
}

export function buyItem(profile: Profile, itemId: string): BuyResult {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return { ok: false, reason: "unknown_item", profile };
  if (item.type === "cosmetic" && isOwned(profile, item)) {
    return { ok: false, reason: "already_owned", profile };
  }
  if (!canAfford(profile, item)) {
    return { ok: false, reason: "insufficient_funds", profile };
  }
  return {
    ok: true,
    profile: {
      ...profile,
      totalPoints: profile.totalPoints - item.price,
      inventory: {
        ...profile.inventory,
        [itemId]: (profile.inventory[itemId] ?? 0) + 1,
      },
    },
  };
}

/** Consume one charge of a consumable. Returns null if not owned. */
export function consumeItem(profile: Profile, itemId: string): Profile | null {
  const owned = profile.inventory[itemId] ?? 0;
  if (owned <= 0) return null;
  return {
    ...profile,
    inventory: { ...profile.inventory, [itemId]: owned - 1 },
  };
}

/** Toggle a cosmetic on/off (no-op if not owned). */
export function toggleCosmetic(profile: Profile, itemId: string): Profile {
  const owned = (profile.inventory[itemId] ?? 0) > 0;
  if (!owned) return profile;
  const equipped = profile.equippedCosmetics.includes(itemId);
  return {
    ...profile,
    equippedCosmetics: equipped
      ? profile.equippedCosmetics.filter((c) => c !== itemId)
      : [...profile.equippedCosmetics, itemId],
  };
}
