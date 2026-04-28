interface Props {
  armed?: boolean;
  hitFlash?: boolean;
}

export function PlayerAvatar({ armed, hitFlash }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "rounded-full p-2 transition",
          armed ? "ring-4 ring-yellow-400 animate-pulse bg-yellow-100/60" : "",
        ].join(" ")}
      >
        <div
          className={[
            "text-7xl select-none animate-creature-bounce",
            hitFlash ? "animate-kid-hit-flash" : "",
          ].join(" ")}
          aria-label="Player avatar"
        >
          <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>🧒</span>
        </div>
      </div>
      <div className="font-bold text-lg">You</div>
    </div>
  );
}
