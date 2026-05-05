import type { Profile } from "../types";
import { levelForPoints } from "../logic/playerLevel";

export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
  isUnlocked: (profile: Profile) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "firstWin",
    emoji: "\uD83C\uDF1F",
    name: "First Win!",
    description: "Defeat your first creature.",
    isUnlocked: (p) => Object.keys(p.levelResults).length >= 1,
  },
  {
    id: "fivePerfect",
    emoji: "\uD83D\uDC8E",
    name: "Perfectionist",
    description: "Get 3 stars on 5 levels.",
    isUnlocked: (p) => Object.values(p.levelResults).filter((r) => r.stars === 3).length >= 5,
  },
  {
    id: "halfWay",
    emoji: "\uD83D\uDEA9",
    name: "Halfway There",
    description: "Complete 6 levels.",
    isUnlocked: (p) => Object.keys(p.levelResults).length >= 6,
  },
  {
    id: "powerCollector",
    emoji: "\uD83E\uDD81",
    name: "Power Collector",
    description: "Unlock all 6 powers.",
    isUnlocked: (p) => p.unlockedPowers.length >= 6,
  },
  {
    id: "championship",
    emoji: "\uD83D\uDC51",
    name: "Champion",
    description: "Defeat the Final Boss (L12).",
    isUnlocked: (p) => !!p.levelResults[12],
  },
  {
    id: "millionaire",
    emoji: "\uD83D\uDCB0",
    name: "Big Spender",
    description: "Earn 1000+ total points.",
    isUnlocked: (p) => p.totalPoints >= 1000,
  },
  {
    id: "trainerLv5",
    emoji: "\uD83C\uDF96\uFE0F",
    name: "Veteran Trainer",
    description: "Reach Trainer Lv. 5.",
    isUnlocked: (p) => levelForPoints(p.totalPoints).level >= 5,
  },
];
