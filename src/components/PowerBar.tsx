import type { Power } from "../types";

interface Props {
  all: Power[];
  unlockedIds: string[];
  armedPowerId: string | null;
  onArm: (id: string | null) => void;
}

export function PowerBar({ all, unlockedIds, armedPowerId, onArm }: Props) {
  return (
    <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-3 py-2 font-mono">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1 text-center">
        Power Slots
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {all.map((p) => {
          const unlocked = unlockedIds.includes(p.id);
          const armed = armedPowerId === p.id;
          return (
            <button
              key={p.id}
              disabled={!unlocked}
              onClick={() => onArm(armed ? null : p.id)}
              aria-label={p.name}
              className={[
                "border-[3px] border-slate-900 rounded-md shadow-[2px_2px_0_#0f172a] w-12 h-12 flex items-center justify-center text-2xl",
                unlocked ? "bg-amber-100 hover:bg-yellow-200" : "bg-slate-200 opacity-50 grayscale cursor-not-allowed",
                armed ? "bg-rose-200 ring-2 ring-rose-500" : "",
                "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
              ].join(" ")}
            >
              {p.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
