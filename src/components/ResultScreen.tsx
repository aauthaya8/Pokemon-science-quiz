interface Props {
  outcome: "win" | "lose";
  stars?: 1 | 2 | 3;
  points?: number;
  hasNextLevel: boolean;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export function ResultScreen({ outcome, stars, points, hasNextLevel, onNext, onReplay, onHome }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-5xl font-extrabold">{outcome === "win" ? "Victory!" : "Try Again!"}</h1>
      {outcome === "win" && (
        <>
          <div className="text-6xl text-yellow-400 animate-power-pop">{"⭐".repeat(stars ?? 0)}</div>
          <div className="text-2xl">+{points} points</div>
        </>
      )}
      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        {outcome === "win" && hasNextLevel && (
          <button onClick={onNext} className="bg-kidPrimary text-white text-xl font-bold py-3 px-6 rounded-chunky shadow-chunky">
            Next Level
          </button>
        )}
        <button onClick={onReplay} className="bg-kidAccent text-white text-xl font-bold py-3 px-6 rounded-chunky shadow-chunky">
          {outcome === "win" ? "Replay" : "Try Again"}
        </button>
        <button onClick={onHome} className="bg-gray-300 text-gray-800 text-xl font-bold py-3 px-6 rounded-chunky shadow-chunky">
          Map
        </button>
      </div>
    </div>
  );
}
