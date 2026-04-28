import type { Power } from "../types";

interface Props {
  all: Power[];
  unlockedIds: string[];
  onClose: () => void;
}

export function PowerCodex({ all, unlockedIds, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-white/95 z-20 p-6 overflow-auto">
      <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-3xl">✖️</button>
      <h2 className="text-3xl font-extrabold text-center mb-6">Power Codex</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {all.map((p) => {
          const unlocked = unlockedIds.includes(p.id);
          return (
            <div key={p.id} className={`p-4 rounded-chunky shadow-chunky ${unlocked ? "bg-yellow-50" : "bg-gray-100 opacity-50"}`}>
              <div className="text-4xl">{unlocked ? p.emoji : "🔒"}</div>
              <div className="font-bold text-lg">{unlocked ? p.name : "?????"}</div>
              <div className="text-sm text-gray-700">{unlocked ? p.description : "Locked — keep playing to unlock!"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
