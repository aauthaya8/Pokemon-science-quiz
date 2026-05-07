import { useEffect } from "react";

interface Props {
  fromPokemonId: number;
  toPokemonId: number;
  fromName: string;
  toName: string;
  onDone: () => void;
}

const ART = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export function EvolutionCinematic({ fromPokemonId, toPokemonId, fromName, toName, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      data-testid="evolution-cinematic"
      className="fixed inset-0 bg-fuchsia-200 flex flex-col items-center justify-center animate-fade-in"
    >
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        {/* Old form fades out */}
        <img
          src={ART(fromPokemonId)}
          alt={fromName}
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain animate-evolve-out drop-shadow-md"
        />
        {/* New form fades + scales in */}
        <img
          src={ART(toPokemonId)}
          alt={toName}
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain animate-evolve-in drop-shadow-lg"
        />
      </div>
      <div className="mt-6 text-3xl sm:text-4xl font-mono font-extrabold uppercase tracking-wider text-slate-900 text-center px-4 animate-power-pop">
        {fromName.toUpperCase()} EVOLVED INTO {toName.toUpperCase()}!
      </div>
    </div>
  );
}
