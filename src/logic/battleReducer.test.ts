import { battleReducer } from "./battleReducer";
import type { BattleSession, Question } from "../types";

const Q = (id: string, difficulty: 1 | 2 | 3 = 1): Question => ({
  id, grade: 3, topic: "animals", difficulty,
  type: "mc", prompt: id, choices: ["a","b","c","d"], answerIndex: 0, explanation: "",
});

const session = (overrides: Partial<BattleSession> = {}): BattleSession => ({
  levelId: 1,
  creatureHpRemaining: 3,
  strikes: 0,
  pointsEarned: 0,
  currentQuestion: Q("q1"),
  questionPool: [Q("q2"), Q("q3"), Q("q4")],
  armedPowerId: null,
  ...overrides,
});

describe("ARM_POWER", () => {
  test("sets armedPowerId", () => {
    const next = battleReducer(session(), { type: "ARM_POWER", powerId: "vineWhip" });
    expect(next.armedPowerId).toBe("vineWhip");
  });
  test("setting null disarms", () => {
    const s = session({ armedPowerId: "vineWhip" });
    const next = battleReducer(s, { type: "ARM_POWER", powerId: null });
    expect(next.armedPowerId).toBeNull();
  });
});

describe("ANSWER_RIGHT", () => {
  test("basic attack: HP -1, points +10×tier", () => {
    const s = session({ currentQuestion: Q("q1", 2) });
    const next = battleReducer(s, { type: "ANSWER_RIGHT" });
    expect(next.creatureHpRemaining).toBe(2);
    expect(next.pointsEarned).toBe(20);
  });
  test("powered attack: HP -2, double points, power consumed", () => {
    const s = session({ creatureHpRemaining: 3, armedPowerId: "vineWhip", currentQuestion: Q("q1", 1) });
    const next = battleReducer(s, { type: "ANSWER_RIGHT" });
    expect(next.creatureHpRemaining).toBe(1);
    expect(next.pointsEarned).toBe(20);
    expect(next.armedPowerId).toBeNull();
  });
  test("HP cannot go below 0", () => {
    const s = session({ creatureHpRemaining: 1, armedPowerId: "vineWhip" });
    const next = battleReducer(s, { type: "ANSWER_RIGHT" });
    expect(next.creatureHpRemaining).toBe(0);
  });
  test("advances currentQuestion", () => {
    const next = battleReducer(session(), { type: "ANSWER_RIGHT" });
    expect(next.currentQuestion.id).toBe("q2");
    expect(next.questionPool.map(q => q.id)).toEqual(["q3", "q4"]);
  });
});

describe("ANSWER_RIGHT_CRIT", () => {
  test("basic crit: HP -2, double points", () => {
    const s = session({ currentQuestion: Q("q1", 1) });
    const next = battleReducer(s, { type: "ANSWER_RIGHT_CRIT" });
    expect(next.creatureHpRemaining).toBe(1);
    expect(next.pointsEarned).toBe(20);
  });
  test("powered crit: HP -3, quadruple points (powered x2 x crit x2), power consumed", () => {
    const s = session({ creatureHpRemaining: 5, armedPowerId: "vineWhip", currentQuestion: Q("q1", 1) });
    const next = battleReducer(s, { type: "ANSWER_RIGHT_CRIT" });
    expect(next.creatureHpRemaining).toBe(2);
    expect(next.pointsEarned).toBe(40);
    expect(next.armedPowerId).toBeNull();
  });
  test("crit HP cannot go below 0", () => {
    const s = session({ creatureHpRemaining: 1, armedPowerId: "vineWhip" });
    const next = battleReducer(s, { type: "ANSWER_RIGHT_CRIT" });
    expect(next.creatureHpRemaining).toBe(0);
  });
  test("crit advances currentQuestion", () => {
    const next = battleReducer(session(), { type: "ANSWER_RIGHT_CRIT" });
    expect(next.currentQuestion.id).toBe("q2");
  });
});

describe("ANSWER_WRONG", () => {
  test("strikes +1, no points, no HP change", () => {
    const next = battleReducer(session(), { type: "ANSWER_WRONG" });
    expect(next.strikes).toBe(1);
    expect(next.creatureHpRemaining).toBe(3);
    expect(next.pointsEarned).toBe(0);
  });
  test("preserves armedPowerId", () => {
    const s = session({ armedPowerId: "vineWhip" });
    const next = battleReducer(s, { type: "ANSWER_WRONG" });
    expect(next.armedPowerId).toBe("vineWhip");
  });
  test("strikes capped at 3", () => {
    const s = session({ strikes: 3 });
    const next = battleReducer(s, { type: "ANSWER_WRONG" });
    expect(next.strikes).toBe(3);
  });
  test("advances currentQuestion", () => {
    const next = battleReducer(session(), { type: "ANSWER_WRONG" });
    expect(next.currentQuestion.id).toBe("q2");
  });
  test("freezes on current question when pool exhausted (no crash)", () => {
    const s = session({ questionPool: [], currentQuestion: Q("q1") });
    const next = battleReducer(s, { type: "ANSWER_WRONG" });
    expect(next.currentQuestion.id).toBe("q1");
    expect(next.questionPool).toEqual([]);
  });
});
