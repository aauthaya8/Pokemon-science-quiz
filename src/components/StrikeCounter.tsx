import type { Strikes } from "../types";

export function StrikeCounter({ strikes }: { strikes: Strikes }) {
  const remaining = 3 - strikes;
  return (
    <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-3 py-1.5 font-mono">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
          Lives
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => {
            const broken = i < strikes;
            return (
              <span
                key={i}
                aria-label={broken ? "broken heart" : "heart"}
                className={`text-base leading-none ${broken ? "text-slate-300" : "text-rose-500"}`}
              >
                {broken ? "\u2661" : "\u2665"}
              </span>
            );
          })}
        </div>
        <span className="text-[10px] font-bold text-slate-700">{remaining}/3</span>
      </div>
    </div>
  );
}
