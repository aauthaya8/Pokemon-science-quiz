// Trainer level / XP system. Lifetime totalPoints map to Lv1..Lv10 with rank titles.

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1100, 1500, 2000, 2600];
const TITLES = [
  "Rookie",
  "Trainer",
  "Adept Trainer",
  "Skilled Trainer",
  "Veteran",
  "Elite",
  "Ace",
  "Champion",
  "Master",
  "Legend",
];

export interface LevelInfo {
  level: number;
  title: string;
  nextThreshold: number | null;
}

export function levelForPoints(points: number): LevelInfo {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const title = TITLES[level - 1];
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? null;
  return { level, title, nextThreshold };
}
