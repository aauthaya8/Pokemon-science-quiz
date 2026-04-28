interface Props {
  emoji: string;
  name: string;
  hp: number;
  maxHp: number;
  hitFlash?: boolean;
}

export function Creature({ emoji, name, hp, maxHp, hitFlash }: Props) {
  const pct = (hp / maxHp) * 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-8xl select-none animate-creature-bounce ${hitFlash ? "animate-hit-flash" : ""}`}>
        {emoji}
      </div>
      <div className="font-bold text-lg">{name}</div>
      <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
