interface Props {
  starterPokemonId?: number;
  label?: string;
  armed?: boolean;
  hitFlash?: boolean;
  cosmetics?: string[];
}

const DEFAULT_STARTER_ID = 25; // Pikachu — fallback for legacy saves.

export function PlayerAvatar({ starterPokemonId, label = "You", armed, hitFlash, cosmetics = [] }: Props) {
  const id = starterPokemonId ?? DEFAULT_STARTER_ID;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const hasTopHat = cosmetics.includes("topHat");
  const hasCrown = cosmetics.includes("crown");
  const hasShinyStar = cosmetics.includes("shinyStar");
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "p-1 transition relative",
          armed ? "ring-2 ring-yellow-400 animate-pulse bg-yellow-100/40 rounded-full" : "",
          hasShinyStar ? "drop-shadow-[0_0_12px_rgba(253,224,71,0.85)]" : "",
        ].join(" ")}
        data-testid="player-avatar"
      >
        {hasShinyStar && (
          <span
            aria-hidden="true"
            data-testid="cosmetic-shinyStar"
            className="absolute -top-1 -right-1 text-2xl animate-pulse z-10 pointer-events-none"
          >
            {"\u2728"}
          </span>
        )}
        {hasCrown && (
          <span
            aria-hidden="true"
            data-testid="cosmetic-crown"
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl z-10 pointer-events-none"
          >
            {"\uD83D\uDC51"}
          </span>
        )}
        {hasTopHat && !hasCrown && (
          <span
            aria-hidden="true"
            data-testid="cosmetic-topHat"
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl z-10 pointer-events-none"
          >
            {"\uD83C\uDFA9"}
          </span>
        )}
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
