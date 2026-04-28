import type { Strikes } from "../types";

export function StrikeCounter({ strikes }: { strikes: Strikes }) {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => {
        const broken = i < strikes;
        return (
          <span
            key={i}
            aria-label={broken ? "broken heart" : "heart"}
            className="text-3xl"
          >
            {broken ? "💔" : "❤️"}
          </span>
        );
      })}
    </div>
  );
}
