import type { Grade } from "../types";

interface Props {
  currentGrade: Grade;
  onChange: (grade: Grade) => void;
}

export function SettingsPanel({ currentGrade, onChange }: Props) {
  return (
    <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] p-3 font-mono">
      <p className="font-bold text-sm uppercase tracking-wide mb-2 text-slate-900">
        Difficulty
      </p>
      <div className="flex gap-2">
        {[3, 4].map((g) => {
          const active = currentGrade === g;
          return (
            <button
              key={g}
              aria-pressed={active}
              onClick={() => onChange(g as Grade)}
              className={[
                "px-3 py-1.5 border-[3px] border-slate-900 rounded-md shadow-[2px_2px_0_#0f172a] font-mono font-bold uppercase tracking-wide text-sm",
                active ? "bg-rose-200 text-slate-900" : "bg-amber-100 text-slate-900",
                "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
              ].join(" ")}
            >
              Grade {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
