interface Props {
  outcome: "win" | "lose";
  stars?: 1 | 2 | 3;
  points?: number;
  leveledUpTo?: { level: number; title: string };
  hasNextLevel: boolean;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export function ResultScreen({ outcome, stars, points, leveledUpTo, hasNextLevel, onNext, onReplay, onHome }: Props) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-200">
      <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-6 py-5 max-w-md w-full font-mono text-center">
        <div className="text-xs uppercase tracking-widest text-slate-600">
          {outcome === "win" ? "Battle Result" : "Battle Result"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 uppercase tracking-wider mt-1">
          {outcome === "win" ? "Victory!" : "Defeated..."}
        </h1>
        <div className="border-t-2 border-dashed border-slate-300 my-3" />
        {outcome === "win" ? (
          <>
            <div className="text-2xl sm:text-3xl text-amber-500 animate-power-pop tracking-widest">
              {"\u2605".repeat(stars ?? 0)}
              <span className="text-slate-300">{"\u2606".repeat(3 - (stars ?? 0))}</span>
            </div>
            <div className="text-base text-slate-900 mt-2">
              <span className="font-bold">+{points}</span> pts earned
            </div>
            {leveledUpTo && (
              <div className="mt-3 bg-yellow-100 border-[3px] border-slate-900 rounded-md px-3 py-2 text-slate-900 font-bold uppercase tracking-wide animate-power-pop">
                <span aria-hidden="true">{"\uD83D\uDCC8"}</span>{" "}
                LEVEL UP! Now Lv {leveledUpTo.level} {leveledUpTo.title}!
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-base text-slate-900">
              Your trainer was knocked out!
            </div>
            {points !== undefined && points > 0 && (
              <div className="text-base text-slate-900 mt-2">
                <span className="font-bold text-rose-600">−{points}</span> pts lost
                <div className="text-xs text-slate-600 mt-1 normal-case tracking-normal">
                  (half of your gold dropped in the panic)
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {outcome === "win" && hasNextLevel && (
          <button
            onClick={onNext}
            className="bg-yellow-300 hover:bg-yellow-200 text-slate-900 font-mono font-bold uppercase tracking-wider py-2 px-5 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]"
          >
            Next Level
          </button>
        )}
        <button
          onClick={onReplay}
          className="bg-amber-100 hover:bg-yellow-100 text-slate-900 font-mono font-bold uppercase tracking-wider py-2 px-5 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]"
        >
          {outcome === "win" ? "Replay" : "Try Again"}
        </button>
        <button
          onClick={onHome}
          className="bg-white hover:bg-slate-50 text-slate-900 font-mono font-bold uppercase tracking-wider py-2 px-5 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]"
        >
          Map
        </button>
      </div>
    </div>
  );
}
