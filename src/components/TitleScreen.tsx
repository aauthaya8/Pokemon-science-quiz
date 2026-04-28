import { useState } from "react";
import type { Grade, Profile } from "../types";
import { defaultProfile } from "../logic/profileStorage";

interface Props {
  profile: Profile | null;
  onStart: (profile: Profile) => void;
}

export function TitleScreen({ profile, onStart }: Props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);

  if (profile) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h1 className="text-5xl font-extrabold text-kidPrimary">Kids Science Battle</h1>
        <p className="text-2xl">Welcome back, {profile.playerName}!</p>
        <button onClick={() => onStart(profile)} className="bg-kidPrimary text-white text-2xl font-bold py-4 px-12 rounded-chunky shadow-chunky">
          Play!
        </button>
      </div>
    );
  }

  const canPlay = name.trim().length > 0 && grade !== null;

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-5xl font-extrabold text-kidPrimary">Kids Science Battle</h1>
      <label className="flex flex-col items-center gap-2">
        <span className="text-xl font-bold">Your Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 border-gray-300 rounded-chunky p-2 text-xl"
        />
      </label>
      <div className="flex gap-3">
        {[3, 4].map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g as Grade)}
            aria-pressed={grade === g}
            className={`px-6 py-3 rounded-chunky font-bold text-lg ${
              grade === g ? "bg-kidPrimary text-white" : "bg-gray-200"
            }`}
          >
            Grade {g}
          </button>
        ))}
      </div>
      <button
        disabled={!canPlay}
        onClick={() => onStart(defaultProfile(name.trim(), grade!))}
        className="bg-kidPrimary text-white text-2xl font-bold py-4 px-12 rounded-chunky shadow-chunky disabled:opacity-50"
      >
        Play!
      </button>
    </div>
  );
}
