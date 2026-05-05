interface Props {
  starterPokemonId?: number;
  label?: string;
  armed?: boolean;
  hitFlash?: boolean;
}

const DEFAULT_STARTER_ID = 25; // Pikachu — fallback for legacy saves.

export function PlayerAvatar({ starterPokemonId, label = "You", armed, hitFlash }: Props) {
  const id = starterPokemonId ?? DEFAULT_STARTER_ID;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "p-1 transition",
          armed ? "ring-2 ring-yellow-400 animate-pulse bg-yellow-100/40 rounded-full" : "",
        ].join(" ")}
      >
        <img
          src={spriteUrl}
          alt="Player avatar"
          loading="lazy"
          draggable={false}
          className={[
            "w-28 h-28 sm:w-32 sm:h-32 object-contain select-none animate-creature-bounce drop-shadow-md",
            hitFlash ? "animate-kid-hit-flash" : "",
          ].join(" ")}
          // Mirror so the player faces the opponent (top-right of the field).
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
      <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-3 py-1 font-mono text-slate-900 text-sm font-bold uppercase tracking-wide whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}
