import { useState } from "react";
import type { Grade, Level, Profile } from "../types";
import { isLevelUnlocked, nextPlayableLevel } from "../logic/levelUnlock";
import { levelForPoints } from "../logic/playerLevel";
import { SettingsPanel } from "./SettingsPanel";
import { MuteToggle } from "./MuteToggle";
import { AchievementsPanel } from "./AchievementsPanel";

interface Props {
  levels: Level[];
  profile: Profile;
  onSelect: (levelId: number) => void;
  onChangeGrade: (g: Grade) => void;
}

export function LevelSelect({ levels, profile, onSelect, onChangeGrade }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const next = nextPlayableLevel(profile, levels.length);
  const { level: trainerLevel, title } = levelForPoints(profile.totalPoints);

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

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, profile);
          const result = profile.levelResults[level.id];
          const isNext = next === level.id;
          const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${level.creaturePokemonId}.png`;
          return (
            <button
              key={level.id}
              aria-label={`Level ${level.id}`}
              disabled={!unlocked}
              onClick={() => onSelect(level.id)}
              className={[
                "border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] aspect-square flex flex-col items-center justify-between p-2 font-mono text-slate-900",
                unlocked ? "bg-white hover:bg-yellow-50" : "bg-slate-200 opacity-70 cursor-not-allowed",
                isNext ? "bg-yellow-300 hover:bg-yellow-300 animate-pulse-glow" : "",
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
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    draggable={false}
                  />
                ) : (
                  <span className="text-3xl text-slate-500" aria-hidden="true">?</span>
                )}
              </div>
              <div className="text-amber-500 text-sm tracking-tight min-h-[1.25rem]" aria-hidden="true">
                {result ? "\u2605".repeat(result.stars) + "\u2606".repeat(3 - result.stars) : "\u2606\u2606\u2606"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
