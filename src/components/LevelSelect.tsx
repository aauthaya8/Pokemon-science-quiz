import { useState } from "react";
import type { Grade, Level, Profile } from "../types";
import { isLevelUnlocked, nextPlayableLevel } from "../logic/levelUnlock";
import { levelForPoints } from "../logic/playerLevel";
import { regionForTopic } from "../data/regions";
import { SettingsPanel } from "./SettingsPanel";
import { MuteToggle } from "./MuteToggle";
import { AchievementsPanel } from "./AchievementsPanel";
import { ShopPanel } from "./ShopPanel";

interface Props {
  levels: Level[];
  profile: Profile;
  onSelect: (levelId: number) => void;
  onChangeGrade: (g: Grade) => void;
  onProfileChange?: (next: Profile) => void;
}

/**
 * Snake/zigzag layout of the 12 levels on a 4-col grid.
 * Each entry pins the tile to a specific grid cell and remembers which neighbour
 * it connects to for the dashed-path graphics.
 *
 *   Row 1:  L1 -> L2 -> L3 -> L4
 *                                |
 *   Row 3:  L8 <- L7 <- L6 <- L5
 *           |
 *   Row 5:  L9 -> L10 -> L11 -> L12
 *
 * Rows 2 and 4 are pure connector rows (vertical dashes).
 */
type GridSlot = { col: 1 | 2 | 3 | 4; row: 1 | 3 | 5 };
const TILE_SLOTS: Record<number, GridSlot> = {
  1: { col: 1, row: 1 },
  2: { col: 2, row: 1 },
  3: { col: 3, row: 1 },
  4: { col: 4, row: 1 },
  5: { col: 4, row: 3 },
  6: { col: 3, row: 3 },
  7: { col: 2, row: 3 },
  8: { col: 1, row: 3 },
  9: { col: 1, row: 5 },
  10: { col: 2, row: 5 },
  11: { col: 3, row: 5 },
  12: { col: 4, row: 5 },
};

const COL_START: Record<1 | 2 | 3 | 4, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
};
const ROW_START: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
};

interface Connector {
  key: string;
  col: 1 | 2 | 3 | 4;
  row: 1 | 2 | 3 | 4 | 5;
  /** "h" = horizontal dash between two same-row tiles; "v" = vertical dash between two rows. */
  kind: "h" | "v";
}

/**
 * Connector cells laid into the grid between tiles. Horizontal connectors live in tile
 * rows (1, 3, 5) but actually overlay the gap between two adjacent tiles via padding.
 * Vertical connectors take up the connector rows (2, 4) at the column where the snake
 * turns.
 */
const CONNECTORS: Connector[] = [
  // Row 1 horizontals are visually drawn by the tiles' shared row + path overlay below.
  // Verticals at the snake bends:
  { key: "v-c4-r2", col: 4, row: 2, kind: "v" },
  { key: "v-c1-r4", col: 1, row: 4, kind: "v" },
];

export function LevelSelect({ levels, profile, onSelect, onChangeGrade, onProfileChange }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const next = nextPlayableLevel(profile, levels.length);
  const { level: trainerLevel, title } = levelForPoints(profile.totalPoints);

  // Trainer parks next to the next playable tile, or at L12 if everything is done.
  const trainerLevelId = next ?? levels.length;
  const trainerSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${profile.starterPokemonId}.png`;

  return (
    <div className="p-4 sm:p-6 relative min-h-full bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100">
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <MuteToggle />
      </div>
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
        <button
          aria-label="Achievements"
          className="text-2xl bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-11 h-11 flex items-center justify-center"
          onClick={() => setShowAchievements((v) => !v)}
        >
          <span aria-hidden="true">{"\uD83C\uDFC6"}</span>
        </button>
        {onProfileChange && (
          <button
            aria-label="Shop"
            className="text-2xl bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-11 h-11 flex items-center justify-center"
            onClick={() => setShowShop((v) => !v)}
          >
            <span aria-hidden="true">{"\uD83D\uDED2"}</span>
          </button>
        )}
        <button
          aria-label="Settings"
          className="text-2xl bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-11 h-11 flex items-center justify-center"
          onClick={() => setShowSettings((v) => !v)}
        >
          <span aria-hidden="true">{"\u2699"}</span>
        </button>
      </div>
      {showSettings && (
        <div className="absolute top-16 right-3 sm:right-4 z-10">
          <SettingsPanel currentGrade={profile.gradeLevel} onChange={onChangeGrade} />
        </div>
      )}
      {showAchievements && (
        <AchievementsPanel profile={profile} onClose={() => setShowAchievements(false)} />
      )}
      {showShop && onProfileChange && (
        <ShopPanel
          profile={profile}
          onChange={onProfileChange}
          onClose={() => setShowShop(false)}
        />
      )}

      <div className="max-w-3xl mx-auto bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-4 py-3 mb-5 mt-2">
        <div className="font-mono text-slate-900 flex items-baseline justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-600">Trainer</div>
            <div className="text-xl sm:text-2xl font-bold uppercase">{profile.playerName}</div>
            <div className="text-xs sm:text-sm text-slate-700 font-bold uppercase tracking-wide mt-0.5">
              Lv {trainerLevel} {title}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-slate-600">Score</div>
            <div className="text-lg font-bold">{profile.totalPoints} pts</div>
          </div>
        </div>
        <div className="border-t-2 border-dashed border-slate-300 mt-2 pt-2 text-center font-mono text-sm text-slate-700 uppercase tracking-wide">
          Choose your route
        </div>
      </div>

      {/*
        The route map: a 4-col x 5-row grid. Tile rows (1, 3, 5) hold the level tiles;
        connector rows (2, 4) hold the vertical dashes at the snake bends. Horizontal
        path lines between same-row tiles are drawn via the grid gap and a dashed
        underline overlay on each non-rightmost tile.
      */}
      <div className="relative grid grid-cols-4 grid-rows-[auto_1.5rem_auto_1.5rem_auto] gap-x-2 sm:gap-x-3 gap-y-1 max-w-3xl mx-auto">
        {/* Vertical connectors at the bends */}
        {CONNECTORS.map((c) => (
          <div
            key={c.key}
            aria-hidden="true"
            className={[
              COL_START[c.col],
              ROW_START[c.row],
              "flex items-center justify-center",
            ].join(" ")}
          >
            <div className="w-0 h-full border-l-4 border-dashed border-amber-700" />
          </div>
        ))}

        {/* Level tiles (rendered in numeric order so screen-reader order matches play order). */}
        {levels.map((level) => {
          const slot = TILE_SLOTS[level.id];
          if (!slot) return null;
          const unlocked = isLevelUnlocked(level.id, profile);
          const result = profile.levelResults[level.id];
          const isNext = next === level.id;
          const region = regionForTopic(level.topic);
          const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${level.creaturePokemonId}.png`;

          // Draw a horizontal dashed link to the next tile in the same row, where the
          // snake actually flows: row 1 = L1->L2->L3->L4 (rightward), row 3 =
          // L5->L6->L7->L8 (leftward, drawn from L6/L7/L8 toward higher cols since L5
          // is rightmost), row 5 = L9->L10->L11->L12 (rightward). We draw the link on
          // the LEFT-NEIGHBOUR side of each tile that has a path coming from the left,
          // by overlaying a dashed line in the column gap.
          // To keep this simple: every tile in row 1 except col 4, and every tile in
          // row 3 except col 1, and every tile in row 5 except col 4, gets a right-side
          // path connector. (Row 3 flows right->left so the connector points left from
          // each tile except the leftmost. Visually it's the same dashed line.)
          const drawPathRight =
            (slot.row === 1 && slot.col < 4) ||
            (slot.row === 3 && slot.col > 1) ||
            (slot.row === 5 && slot.col < 4);

          return (
            <div
              key={level.id}
              className={[COL_START[slot.col], ROW_START[slot.row], "relative"].join(" ")}
            >
              <button
                aria-label={`Level ${level.id}`}
                disabled={!unlocked}
                onClick={() => onSelect(level.id)}
                className={[
                  "w-full border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] aspect-square flex flex-col items-center justify-between p-1.5 font-mono text-slate-900",
                  unlocked ? `${region.tileGradient} hover:brightness-105` : "bg-slate-200 opacity-70 cursor-not-allowed",
                  isNext ? "animate-pulse-glow ring-2 ring-yellow-400" : "",
                  "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
                ].join(" ")}
              >
                <div className="self-stretch flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase">
                  <span>LV {level.id}</span>
                  {!unlocked && <span aria-hidden="true">{"\uD83D\uDD12"}</span>}
                </div>
                <div className="flex-1 flex items-center justify-center w-full">
                  {unlocked ? (
                    <img
                      src={sprite}
                      alt={level.creatureName}
                      loading="lazy"
                      className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl text-slate-500" aria-hidden="true">?</span>
                  )}
                </div>
                <div
                  className={[
                    "text-[8px] sm:text-[9px] font-bold uppercase tracking-widest leading-none px-1 py-0.5 rounded-sm",
                    region.badgeBg,
                    region.badgeText,
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {region.tag}
                </div>
                <div className="text-amber-500 text-xs sm:text-sm tracking-tight min-h-[1rem]" aria-hidden="true">
                  {result ? "\u2605".repeat(result.stars) + "\u2606".repeat(3 - result.stars) : "\u2606\u2606\u2606"}
                </div>
              </button>

              {/* Horizontal dashed connector to the neighbouring tile in the same row */}
              {drawPathRight && (
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 w-3 sm:w-4 border-t-4 border-dashed border-amber-700"
                />
              )}

              {/* Walking trainer sprite anchored to the next-playable tile */}
              {level.id === trainerLevelId && unlocked && (
                <div
                  aria-label={`Trainer ${profile.playerName} on the map`}
                  className="absolute -top-2 -left-2 z-10 pointer-events-none"
                >
                  <img
                    src={trainerSprite}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain animate-trainer-bob drop-shadow-[2px_2px_0_#0f172a]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
