import type { Profile } from "../types";
import { ACHIEVEMENTS } from "../data/achievements";

interface Props {
  profile: Profile;
  onClose: () => void;
}

export function AchievementsPanel({ profile, onClose }: Props) {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.isUnlocked(profile)).length;
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 z-20 p-6 overflow-auto">
      <button
        onClick={onClose}
        aria-label="Close achievements"
        className="absolute top-4 right-4 bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-10 h-10 flex items-center justify-center font-mono font-bold"
      >
        X
      </button>
      <h2 className="text-2xl sm:text-3xl font-mono font-bold text-center text-slate-900 uppercase tracking-wider mb-1">
        Achievements
      </h2>
      <div className="text-center font-mono text-sm text-slate-700 uppercase tracking-widest mb-5">
        {unlockedCount} / {ACHIEVEMENTS.length} unlocked
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = a.isUnlocked(profile);
          return (
            <div
              key={a.id}
              data-testid={`achievement-${a.id}`}
              data-unlocked={unlocked}
              className={[
                "p-3 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] font-mono flex items-start gap-3",
                unlocked ? "bg-kidParchment" : "bg-slate-200 opacity-60 grayscale",
              ].join(" ")}
            >
              <div className="text-3xl leading-none">
                {unlocked ? a.emoji : "\uD83D\uDD12"}
              </div>
              <div className="flex-1">
                <div className="font-bold text-base uppercase tracking-wide text-slate-900">
                  {unlocked ? a.name : "???"}
                </div>
                <div className="text-sm text-slate-700">
                  {unlocked ? a.description : "Locked - keep playing to unlock!"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
