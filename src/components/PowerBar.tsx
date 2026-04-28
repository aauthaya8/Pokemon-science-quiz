import type { Power } from "../types";

interface Props {
  all: Power[];
  unlockedIds: string[];
  armedPowerId: string | null;
  onArm: (id: string | null) => void;
}

export function PowerBar({ all, unlockedIds, armedPowerId, onArm }: Props) {
  return (
    <div className="flex gap-3 justify-center">
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
              "rounded-chunky p-3 text-3xl shadow-chunky transition",
              unlocked ? "bg-yellow-100" : "bg-gray-200 opacity-50 grayscale",
              armed ? "ring-4 ring-yellow-400 scale-110" : "",
            ].join(" ")}
          >
            {p.emoji}
          </button>
        );
      })}
    </div>
  );
}
