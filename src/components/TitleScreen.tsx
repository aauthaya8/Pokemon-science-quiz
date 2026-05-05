import { useState } from "react";
import type { Grade, Profile } from "../types";
import { defaultProfile } from "../logic/profileStorage";

interface Props {
  profile: Profile | null;
  onStart: (profile: Profile) => void;
}

interface Starter {
  id: number;
  name: string;
}

const STARTERS: Starter[] = [
  { id: 25, name: "Pikachu" },
  { id: 133, name: "Eevee" },
  { id: 1, name: "Bulbasaur" },
  { id: 4, name: "Charmander" },
];

function spriteFor(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function TitleScreen({ profile, onStart }: Props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [starterId, setStarterId] = useState<number | null>(null);

  if (profile) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-5 p-6 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-200">
        <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-6 py-5 max-w-md w-full text-center font-mono">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 uppercase tracking-wider">
            Kids Science Battle
          </h1>
          <div className="mt-1 text-xs sm:text-sm text-slate-600 uppercase tracking-widest">
            Trainer Save File
          </div>
          <div className="border-t-2 border-dashed border-slate-300 my-3" />
          <div className="flex items-center justify-center my-2">
            <img
              src={spriteFor(profile.starterPokemonId)}
              alt="Your starter"
              className="w-24 h-24 object-contain drop-shadow-md"
              draggable={false}
            />
          </div>
          <div className="text-base sm:text-lg text-slate-900 font-bold uppercase tracking-wide">
            {`Welcome back, ${profile.playerName}!`}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Grade {profile.gradeLevel} &middot; {profile.totalPoints} pts
          </div>
        </div>
        <button
          onClick={() => onStart(profile)}
          className="bg-yellow-300 hover:bg-yellow-200 text-slate-900 text-lg font-mono font-bold uppercase tracking-wider py-3 px-10 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]"
        >
          Continue
        </button>
      </div>
    );
  }

  const canPlay = name.trim().length > 0 && grade !== null && starterId !== null;

  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-200">
      <div className="bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-6 py-5 max-w-md w-full font-mono">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 uppercase tracking-wider text-center">
          Kids Science Battle
        </h1>
        <div className="mt-1 text-xs sm:text-sm text-slate-600 uppercase tracking-widest text-center">
          New Game
        </div>
        <div className="border-t-2 border-dashed border-slate-300 my-3" />
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Your Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[3px] border-slate-900 rounded-md p-2 text-lg font-mono bg-kidParchment focus:outline-none focus:bg-yellow-50"
            maxLength={12}
          />
        </label>
        <div className="mt-3">
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
            Difficulty
          </div>
          <div className="flex gap-2">
            {[3, 4].map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g as Grade)}
                aria-pressed={grade === g}
                className={[
                  "flex-1 px-4 py-2 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] font-mono font-bold uppercase tracking-wide",
                  grade === g ? "bg-rose-200 text-slate-900" : "bg-amber-100 text-slate-900 hover:bg-yellow-100",
                  "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
                ].join(" ")}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
            Pick your starter:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STARTERS.map((s) => {
              const selected = starterId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStarterId(s.id)}
                  aria-pressed={selected}
                  aria-label={`Pick ${s.name}`}
                  className={[
                    "flex flex-col items-center gap-1 p-2 border-[3px] rounded-md shadow-[3px_3px_0_#0f172a] font-mono font-bold uppercase tracking-wide bg-amber-50",
                    selected ? "border-kidPrimary ring-2 ring-kidPrimary bg-yellow-100" : "border-slate-900 hover:bg-yellow-50",
                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
                  ].join(" ")}
                >
                  <img
                    src={spriteFor(s.id)}
                    alt={s.name}
                    loading="lazy"
                    draggable={false}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-xs sm:text-sm text-slate-900">{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <button
        disabled={!canPlay}
        onClick={() => onStart(defaultProfile(name.trim(), grade!, starterId!))}
        className="bg-yellow-300 hover:bg-yellow-200 text-slate-900 text-lg font-mono font-bold uppercase tracking-wider py-3 px-10 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0_#0f172a]"
      >
        Play
      </button>
    </div>
  );
}
