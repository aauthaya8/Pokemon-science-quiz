import type { BattleSession, Strikes } from "../types";
import { pointsForAnswer } from "./scoring";

export type BattleAction =
  | { type: "ARM_POWER"; powerId: string | null }
  | { type: "ANSWER_RIGHT" }
  | { type: "ANSWER_RIGHT_CRIT" }
  | { type: "ANSWER_WRONG" };

export function battleReducer(state: BattleSession, action: BattleAction): BattleSession {
  switch (action.type) {
    case "ARM_POWER":
      return { ...state, armedPowerId: action.powerId };

    case "ANSWER_RIGHT": {
      const powered = state.armedPowerId !== null;
      const damage = powered ? 2 : 1;
      const points = pointsForAnswer({ difficulty: state.currentQuestion.difficulty, powered });
      return {
        ...state,
        creatureHpRemaining: Math.max(0, state.creatureHpRemaining - damage),
        pointsEarned: state.pointsEarned + points,
        armedPowerId: null,
        ...advanceQuestion(state),
      };
    }

    case "ANSWER_RIGHT_CRIT": {
      const powered = state.armedPowerId !== null;
      const damage = powered ? 3 : 2;
      // Crit doubles points on top of the (already powered-doubled if armed) base.
      const basePoints = pointsForAnswer({ difficulty: state.currentQuestion.difficulty, powered });
      const points = basePoints * 2;
      return {
        ...state,
        creatureHpRemaining: Math.max(0, state.creatureHpRemaining - damage),
        pointsEarned: state.pointsEarned + points,
        armedPowerId: null,
        ...advanceQuestion(state),
      };
    }

    case "ANSWER_WRONG": {
      const nextStrikes = Math.min(3, state.strikes + 1) as Strikes;
      return {
        ...state,
        // armedPowerId intentionally preserved — wrong answers don't waste a charged power (per spec)
        strikes: nextStrikes,
        ...advanceQuestion(state),
      };
    }
  }
}

// Pool exhaustion is bounded out of practice (creatureHp + 5 buffer >> max possible questions per battle:
// at most creatureHp right answers + 2 wrong answers before win/lose terminates). If somehow exhausted,
// the current question stays put — battle continues toward win/lose, never crashes.
function advanceQuestion(state: BattleSession): Pick<BattleSession, "currentQuestion" | "questionPool"> {
  if (state.questionPool.length === 0) {
    return { currentQuestion: state.currentQuestion, questionPool: [] };
  }
  const [next, ...rest] = state.questionPool;
  return { currentQuestion: next, questionPool: rest };
}
