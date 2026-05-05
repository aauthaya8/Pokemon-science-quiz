import type { LevelTopic } from "../types";

export interface Region {
  /** Internal id; matches the level topic. */
  id: LevelTopic;
  /** Display name shown on the level tile badge / map UI. */
  name: string;
  /** Short uppercase tag rendered as a region badge under the level number. */
  tag: string;
  /** Tailwind gradient classes applied to the level tile background. */
  tileGradient: string;
  /** Tailwind text color for the region badge. */
  badgeText: string;
  /** Tailwind background tone for the region badge chip. */
  badgeBg: string;
  /** Decorative emoji used to ornament the region (purely cosmetic). */
  decoEmoji: string;
}

/**
 * Topic -> Region map. Drives Pokemon-style biome theming on the LevelSelect map.
 *
 * Note: the region tone is a *tint*; the dominant tile palette is still kidParchment +
 * kidInk hard borders. Gradients lean from a faint top color into white at the bottom
 * so they don't fight the sprite or the star row.
 */
export const REGIONS: Record<LevelTopic, Region> = {
  animals: {
    id: "animals",
    name: "Wildwood",
    tag: "WILDWOOD",
    tileGradient: "bg-gradient-to-b from-green-200 to-white",
    badgeText: "text-green-900",
    badgeBg: "bg-green-200",
    decoEmoji: "\uD83C\uDF32", // pine tree
  },
  life: {
    id: "life",
    name: "Botany Garden",
    tag: "BOTANY",
    tileGradient: "bg-gradient-to-b from-pink-200 to-white",
    badgeText: "text-pink-900",
    badgeBg: "bg-pink-200",
    decoEmoji: "\uD83C\uDF37", // tulip
  },
  earth: {
    id: "earth",
    name: "Stargazer's Peak",
    tag: "STARGAZER",
    tileGradient: "bg-gradient-to-b from-indigo-300 to-white",
    badgeText: "text-indigo-900",
    badgeBg: "bg-indigo-200",
    decoEmoji: "\uD83C\uDF0C", // milky way
  },
  physical: {
    id: "physical",
    name: "Volt Lab",
    tag: "VOLT LAB",
    tileGradient: "bg-gradient-to-b from-yellow-200 to-white",
    badgeText: "text-yellow-900",
    badgeBg: "bg-yellow-200",
    decoEmoji: "\u26A1", // high voltage
  },
  mixed: {
    id: "mixed",
    name: "Champion's Plateau",
    tag: "CHAMPION",
    tileGradient: "bg-gradient-to-b from-amber-300 to-white",
    badgeText: "text-amber-900",
    badgeBg: "bg-amber-200",
    decoEmoji: "\uD83D\uDC51", // crown
  },
};

export function regionForTopic(topic: LevelTopic): Region {
  return REGIONS[topic];
}
