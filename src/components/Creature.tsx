interface Props {
  pokemonId: number;
  name: string;
  hp: number;
  maxHp: number;
  hitFlash?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-36 h-36",
};

export function Creature({ pokemonId, name, hp, maxHp, hitFlash, size = "lg" }: Props) {
  const pct = (hp / maxHp) * 100;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={spriteUrl}
        alt={name}
        loading="lazy"
        className={`${SIZE_CLASS[size]} object-contain select-none animate-creature-bounce drop-shadow-md ${
          hitFlash ? "animate-hit-flash" : ""
        }`}
        draggable={false}
      />
      <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-3 py-2 w-44 font-mono text-slate-900">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-bold uppercase tracking-wide truncate">{name}</span>
          <span className="text-xs font-bold">Lv{Math.max(1, Math.ceil(maxHp / 2))}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-amber-700">HP</span>
          <div className="flex-1 h-2 bg-slate-200 border border-slate-900 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-yellow-400" : "bg-rose-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="text-right text-[11px] font-bold mt-0.5">
          {hp}/{maxHp}
        </div>
      </div>
    </div>
  );
}
