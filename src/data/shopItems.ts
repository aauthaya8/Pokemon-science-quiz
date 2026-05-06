export type ShopItemType = "consumable" | "cosmetic";

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  type: ShopItemType;
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // CONSUMABLES (one-shot battle boost)
  {
    id: "heartPotion",
    name: "Heart Potion",
    emoji: "\uD83D\uDC97",
    price: 50,
    type: "consumable",
    description: "Start your next battle with 4 hearts instead of 3.",
  },
  {
    id: "luckyCharm",
    name: "Lucky Charm",
    emoji: "\uD83C\uDF40",
    price: 80,
    type: "consumable",
    description: "Triples crit chance in your next battle.",
  },
  {
    id: "energyTonic",
    name: "Energy Tonic",
    emoji: "\u26A1",
    price: 100,
    type: "consumable",
    description: "Begin your next battle with a random power pre-armed.",
  },

  // COSMETICS (permanent — equip / unequip via shop)
  {
    id: "topHat",
    name: "Top Hat",
    emoji: "\uD83C\uDFA9",
    price: 150,
    type: "cosmetic",
    description: "Style up with a fancy top hat.",
  },
  {
    id: "crown",
    name: "Royal Crown",
    emoji: "\uD83D\uDC51",
    price: 500,
    type: "cosmetic",
    description: "Crown yourself the Champion of Science.",
  },
  {
    id: "shinyStar",
    name: "Shiny Sticker",
    emoji: "\u2728",
    price: 300,
    type: "cosmetic",
    description: "Sparkly aura around your trainer.",
  },
];
