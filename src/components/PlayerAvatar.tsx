interface Props {
  armed?: boolean;
  hitFlash?: boolean;
}

export function PlayerAvatar({ armed, hitFlash }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "p-1 transition",
          armed ? "ring-2 ring-yellow-400 animate-pulse bg-yellow-100/40 rounded-full" : "",
        ].join(" ")}
      >
        <div
          className={[
            "text-7xl select-none animate-creature-bounce drop-shadow-md",
            hitFlash ? "animate-kid-hit-flash" : "",
          ].join(" ")}
          aria-label="Player avatar"
        >
          <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>{"\uD83E\uDDD9"}</span>
        </div>
      </div>
      <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-3 py-1 font-mono text-slate-900 text-sm font-bold uppercase tracking-wide">
        You
      </div>
    </div>
  );
}
