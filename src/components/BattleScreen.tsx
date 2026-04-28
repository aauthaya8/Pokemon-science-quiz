import { useReducer, useState, useEffect } from "react";
import type { Level, Power, Question } from "../types";
import { battleReducer } from "../logic/battleReducer";
import { starsForStrikes } from "../logic/scoring";
import { Creature } from "./Creature";
import { StrikeCounter } from "./StrikeCounter";
import { QuestionCard } from "./QuestionCard";
import { PowerBar } from "./PowerBar";

interface Props {
  level: Level;
  questions: Question[];
  unlockedPowers: string[];
  allPowers: Power[];
  onWin: (result: { stars: 1 | 2 | 3; points: number }) => void;
  onLose: () => void;
}

export function BattleScreen({ level, questions, unlockedPowers, allPowers, onWin, onLose }: Props) {
  const [first, ...rest] = questions;
  const [state, dispatch] = useReducer(battleReducer, {
    levelId: level.id,
    creatureHpRemaining: level.creatureHp,
    strikes: 0,
    pointsEarned: 0,
    currentQuestion: first,
    questionPool: rest,
    armedPowerId: null,
  });
  const [explanation, setExplanation] = useState<{ correct: boolean; text: string } | null>(null);
  const [hitFlash, setHitFlash] = useState(false);

  function handleAnswer(index: number) {
    if (explanation) return;
    const correct = index === state.currentQuestion.answerIndex;
    setExplanation({ correct, text: state.currentQuestion.explanation });
    if (correct) {
      setHitFlash(true);
      setTimeout(() => setHitFlash(false), 400);
      dispatch({ type: "ANSWER_RIGHT" });
    } else {
      dispatch({ type: "ANSWER_WRONG" });
    }
    setTimeout(() => setExplanation(null), 2500);
  }

  useEffect(() => {
    if (state.creatureHpRemaining === 0) {
      const strikes = state.strikes;
      onWin({ stars: starsForStrikes(strikes as 0 | 1 | 2), points: state.pointsEarned });
    } else if (state.strikes === 3) {
      onLose();
    }
  }, [state.creatureHpRemaining, state.strikes]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-xl mx-auto">
      <Creature
        emoji={level.creatureEmoji}
        name={level.creatureName}
        hp={state.creatureHpRemaining}
        maxHp={level.creatureHp}
        hitFlash={hitFlash}
      />
      <StrikeCounter strikes={state.strikes} />
      {explanation ? (
        <div className={`p-4 rounded-chunky text-center font-bold ${
          explanation.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {explanation.correct ? "✅ Right!" : "❌ Not quite."}
          {explanation.text && <div className="text-sm font-normal mt-1">{explanation.text}</div>}
        </div>
      ) : (
        <QuestionCard question={state.currentQuestion} onAnswer={handleAnswer} />
      )}
      <PowerBar
        all={allPowers}
        unlockedIds={unlockedPowers}
        armedPowerId={state.armedPowerId}
        onArm={(id) => dispatch({ type: "ARM_POWER", powerId: id })}
      />
    </div>
  );
}
