import { useEffect } from "react";
import type { Power } from "../types";

interface Props {
  power: Power;
  onDone: () => void;
}

export function PowerUnlockCinematic({ power, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-yellow-300 flex flex-col items-center justify-center animate-fade-in">
      <div className="text-9xl animate-power-pop">{power.emoji}</div>
      <div className="text-4xl font-extrabold mt-4">{power.name} Unlocked!</div>
      <div className="text-xl mt-2 text-gray-700">{power.description}</div>
    </div>
  );
}
