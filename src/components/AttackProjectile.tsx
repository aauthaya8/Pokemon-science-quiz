interface Props {
  emoji: string;
  direction: "right" | "left";
}

export function AttackProjectile({ emoji, direction }: Props) {
  const animClass = direction === "right" ? "animate-attack-fly-right" : "animate-attack-fly-left";
  return (
    <div
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-5xl select-none ${animClass} ${
        direction === "right" ? "left-24" : "right-24"
      }`}
      aria-hidden="true"
    >
      {emoji}
    </div>
  );
}
