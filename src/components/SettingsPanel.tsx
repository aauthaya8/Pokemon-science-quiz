import type { Grade } from "../types";

interface Props {
  currentGrade: Grade;
  onChange: (grade: Grade) => void;
}

export function SettingsPanel({ currentGrade, onChange }: Props) {
  return (
    <div className="bg-white rounded-chunky p-4 shadow-chunky">
      <p className="font-bold mb-2">Question Difficulty</p>
      <div className="flex gap-2">
        {[3, 4].map((g) => {
          const active = currentGrade === g;
          return (
            <button
              key={g}
              aria-pressed={active}
              onClick={() => onChange(g as Grade)}
              className={`px-4 py-2 rounded-chunky font-bold ${
                active ? "bg-kidPrimary text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Grade {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
