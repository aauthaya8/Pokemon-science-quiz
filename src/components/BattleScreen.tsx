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
  onRun?: () => void;
}

export function BattleScreen({ level, questions, unlockedPowers, allPowers, onWin, onLose, onRun }: Props) {
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
    <div className="flex flex-col items-stretch gap-3 p-3 max-w-xl mx-auto">
      {/* Battle banner */}
      <div className="relative bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-3 py-2 text-center font-mono">
        <span className="text-sm sm:text-base font-bold tracking-wider text-slate-900 uppercase">
          Wild {level.creatureName} appeared!
        </span>
        {onRun && (
          <button
            onClick={onRun}
            aria-label="Run from battle"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-amber-100 hover:bg-yellow-200 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider py-1 px-2 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]"
          >
            🏃 Run
          </button>
        )}
      </div>

      {/* Battlefield */}
      <div className="relative w-full rounded-md border-[3px] border-slate-900 shadow-[3px_3px_0_#0f172a] bg-gradient-to-b from-sky-400 via-sky-200 to-amber-200 overflow-hidden">
        {/* Ground line */}
        <div className="absolute left-0 right-0 bottom-24 h-[3px] bg-slate-900/40 z-0" />
        <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-b from-amber-200 to-amber-300 z-0" />

        {/* Opponent: top-right */}
        <div className="relative z-10 flex justify-end pr-4 pt-4">
          <div className="relative">
            <Creature
              pokemonId={level.creaturePokemonId}
              name={level.creatureName}
              hp={state.creatureHpRemaining}
              maxHp={level.creatureHp}
              hitFlash={hitFlash}
              size="lg"
            />
            {damagePopup && damagePopup.side === "creature" && (
              <DamagePopup key={damagePopup.key} value={damagePopup.value} side="creature" />
            )}
          </div>
        </div>

        {/* Player: bottom-left */}
        <div className="relative z-10 flex justify-start pl-4 pb-4 -mt-4">
          <div className="relative">
            <PlayerAvatar armed={state.armedPowerId !== null} hitFlash={kidHitFlash} />
            {damagePopup && damagePopup.side === "kid" && (
              <DamagePopup key={damagePopup.key} value={damagePopup.value} side="kid" />
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

      {/* Strikes / Lives */}
      <div className="flex justify-end">
        <StrikeCounter strikes={state.strikes} />
      </div>

      {/* Question / dialog box (replaces FIGHT/BAG/PKMN/RUN menu) */}
      {explanation ? (
        <div
          className={`p-4 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] font-mono text-base ${
            explanation.correct ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
          }`}
        >
          <div className="font-bold uppercase tracking-wide">
            {explanation.correct ? "Critical hit!" : "It missed!"}
          </div>
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
