import type { Power } from "../types";

interface Props {
  all: Power[];
  unlockedIds: string[];
  onClose: () => void;
}

export function PowerCodex({ all, unlockedIds, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 z-20 p-6 overflow-auto">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-10 h-10 flex items-center justify-center font-mono font-bold"
      >
        X
      </button>
      <h2 className="text-2xl sm:text-3xl font-mono font-bold text-center text-slate-900 uppercase tracking-wider mb-5">
        Power Codex
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {all.map((p) => {
          const unlocked = unlockedIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={[
                "p-3 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] font-mono",
                unlocked ? "bg-kidParchment" : "bg-slate-200 opacity-60",
              ].join(" ")}
            >
              <div className="text-3xl">{unlocked ? p.emoji : "?"}</div>
              <div className="font-bold text-base uppercase tracking-wide text-slate-900">
                {unlocked ? p.name : "?????"}
              </div>
              <div className="text-sm text-slate-700">
                {unlocked ? p.description : "Locked - keep playing to unlock!"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
