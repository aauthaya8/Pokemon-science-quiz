import { useState } from "react";
import type { Grade, Level, Profile } from "../types";
import { isLevelUnlocked, nextPlayableLevel } from "../logic/levelUnlock";
import { SettingsPanel } from "./SettingsPanel";

interface Props {
  levels: Level[];
  profile: Profile;
  onSelect: (levelId: number) => void;
  onChangeGrade: (g: Grade) => void;
}

export function LevelSelect({ levels, profile, onSelect, onChangeGrade }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const next = nextPlayableLevel(profile, levels.length);

  return (
    <div className="p-6 relative">
      <button
        aria-label="Settings"
        className="absolute top-4 right-4 text-3xl"
        onClick={() => setShowSettings((v) => !v)}
      >
        ⚙️
      </button>
      {showSettings && (
        <div className="absolute top-16 right-4 z-10">
          <SettingsPanel currentGrade={profile.gradeLevel} onChange={onChangeGrade} />
        </div>
      )}
      <h1 className="text-4xl font-extrabold text-center text-kidPrimary mb-6">
        Hi, {profile.playerName}! Pick a Level
      </h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, profile);
          const result = profile.levelResults[level.id];
          const isNext = next === level.id;
          return (
            <button
              key={level.id}
              aria-label={`Level ${level.id}`}
              disabled={!unlocked}
              onClick={() => onSelect(level.id)}
              className={[
                "p-4 rounded-chunky shadow-chunky bg-white aspect-square flex flex-col items-center justify-center",
                unlocked ? "hover:bg-yellow-50" : "bg-gray-100 opacity-60",
                isNext ? "animate-pulse-glow" : "",
              ].join(" ")}
            >
              <div className="text-4xl">{unlocked ? level.creatureEmoji : "🔒"}</div>
              <div className="font-bold mt-1">Level {level.id}</div>
              {result && (
                <div className="text-yellow-500 text-lg">
                  {"⭐".repeat(result.stars)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
