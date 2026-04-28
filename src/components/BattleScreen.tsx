import { useReducer, useState, useEffect, useRef } from "react";
import type { Level, Power, Question } from "../types";
import { battleReducer } from "../logic/battleReducer";
import { starsForStrikes } from "../logic/scoring";
import { Creature } from "./Creature";
import { StrikeCounter } from "./StrikeCounter";
import { QuestionCard } from "./QuestionCard";
import { PowerBar } from "./PowerBar";
import { PlayerAvatar } from "./PlayerAvatar";
import { AttackProjectile } from "./AttackProjectile";
import { DamagePopup } from "./DamagePopup";

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
  const [kidHitFlash, setKidHitFlash] = useState(false);
  const [projectile, setProjectile] = useState<
    { direction: "right" | "left"; emoji: string; key: number } | null
  >(null);
  const [damagePopup, setDamagePopup] = useState<
    { side: "creature" | "kid"; value: string; key: number } | null
  >(null);
  const animKey = useRef(0);

  function handleAnswer(index: number) {
    if (explanation) return;
    const correct = index === state.currentQuestion.answerIndex;
    setExplanation({ correct, text: state.currentQuestion.explanation });

    animKey.current += 1;
    const key = animKey.current;

    if (correct) {
      const armedPower = allPowers.find((p) => p.id === state.armedPowerId);
      const damage = state.armedPowerId !== null ? 2 : 1;
      const projectileEmoji = armedPower ? armedPower.emoji : "⭐";

      setProjectile({ direction: "right", emoji: projectileEmoji, key });
      setTimeout(() => {
        setHitFlash(true);
        setDamagePopup({ side: "creature", value: `-${damage}`, key });
        setTimeout(() => setHitFlash(false), 400);
      }, 600);

      dispatch({ type: "ANSWER_RIGHT" });
    } else {
      setProjectile({ direction: "left", emoji: "🔥", key });
      setTimeout(() => {
        setKidHitFlash(true);
        setDamagePopup({ side: "kid", value: "-1", key });
        setTimeout(() => setKidHitFlash(false), 400);
      }, 600);

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
      <div className="relative w-full rounded-chunky bg-gradient-to-b from-sky-100 to-green-100 border-b-4 border-amber-300 px-4 py-6 overflow-hidden">
        <div className="flex justify-between items-end gap-4">
          <div className="relative flex-1 flex justify-center">
            <PlayerAvatar armed={state.armedPowerId !== null} hitFlash={kidHitFlash} />
            {damagePopup && damagePopup.side === "kid" && (
              <DamagePopup key={damagePopup.key} value={damagePopup.value} side="kid" />
            )}
          </div>
          <div className="relative flex-1 flex justify-center">
            <Creature
              emoji={level.creatureEmoji}
              name={level.creatureName}
              hp={state.creatureHpRemaining}
              maxHp={level.creatureHp}
              hitFlash={hitFlash}
            />
            {damagePopup && damagePopup.side === "creature" && (
              <DamagePopup key={damagePopup.key} value={damagePopup.value} side="creature" />
            )}
          </div>
        </div>
        {projectile && (
          <AttackProjectile
            key={projectile.key}
            emoji={projectile.emoji}
            direction={projectile.direction}
          />
        )}
      </div>
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
