import type { Grade, Question, Tier, Topic } from "../types";

export interface SelectArgs {
  bank: Question[];
  grade: Grade;
  topic: Topic;
  difficulty: Tier;
  count: number;
  rng?: () => number;
}

export function selectQuestions(args: SelectArgs): Question[] {
  const { bank, grade, topic, difficulty, count, rng = Math.random } = args;
  const filtered = bank.filter(
    (q) => q.grade === grade && q.topic === topic && q.difficulty === difficulty,
  );
  if (filtered.length === 0) {
    throw new Error(
      `no questions matched grade=${grade} topic=${topic} difficulty=${difficulty}`,
    );
  }
  const shuffled = shuffle(filtered, rng);
  return shuffled.slice(0, count);
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
