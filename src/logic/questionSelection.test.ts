import { selectQuestions } from "./questionSelection";
import type { Question } from "../types";

const q = (id: string, grade: 3 | 4, topic: "animals" | "life" | "earth" | "physical", difficulty: 1 | 2 | 3): Question => ({
  id, grade, topic, difficulty,
  type: "mc",
  prompt: id,
  choices: ["a", "b", "c", "d"],
  answerIndex: 0,
  explanation: "",
});

const bank: Question[] = [
  q("a-3-1-1", 3, "animals", 1),
  q("a-3-1-2", 3, "animals", 1),
  q("a-3-1-3", 3, "animals", 1),
  q("a-4-1-1", 4, "animals", 1),
  q("l-3-1-1", 3, "life", 1),
  q("a-3-2-1", 3, "animals", 2),
];

describe("selectQuestions", () => {
  test("filters by grade, topic, and difficulty", () => {
    const out = selectQuestions({ bank, grade: 3, topic: "animals", difficulty: 1, count: 5, rng: () => 0 });
    expect(out.map(x => x.id).sort()).toEqual(["a-3-1-1", "a-3-1-2", "a-3-1-3"]);
  });

  test("respects count cap", () => {
    const out = selectQuestions({ bank, grade: 3, topic: "animals", difficulty: 1, count: 2, rng: () => 0 });
    expect(out).toHaveLength(2);
  });

  test("shuffle uses provided rng", () => {
    const rng = makeSeededRng([0.9, 0.1, 0.5, 0.0]);
    const a = selectQuestions({ bank, grade: 3, topic: "animals", difficulty: 1, count: 3, rng });
    const rng2 = makeSeededRng([0.9, 0.1, 0.5, 0.0]);
    const b = selectQuestions({ bank, grade: 3, topic: "animals", difficulty: 1, count: 3, rng: rng2 });
    expect(a.map(x => x.id)).toEqual(b.map(x => x.id));
  });

  test("throws if no questions match", () => {
    expect(() => selectQuestions({ bank, grade: 4, topic: "life", difficulty: 3, count: 5, rng: () => 0 }))
      .toThrow(/no questions/i);
  });
});

function makeSeededRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}
