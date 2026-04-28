export type Topic = "animals" | "life" | "earth" | "physical";
export type LevelTopic = Topic | "mixed";
export type Grade = 3 | 4;
export type Tier = 1 | 2 | 3;
export type Strikes = 0 | 1 | 2 | 3;
export type Stars = 1 | 2 | 3;
export type QuestionType = "mc" | "tf";

export interface Question {
  id: string;
  grade: Grade;
  topic: Topic;
  difficulty: Tier;
  type: QuestionType;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export interface Level {
  id: number;
  topic: LevelTopic;
  creatureName: string;
  creatureEmoji: string;
  creatureHp: number;
  difficultyTier: Tier;
  unlocksPower: string | null;
}

export interface Power {
  id: string;
  name: string;
  emoji: string;
  topic: Topic | "any";
  description: string;
}

export interface LevelResult {
  stars: Stars;
  bestPoints: number;
  completedAt: string;
}

export interface Profile {
  playerName: string;
  gradeLevel: Grade;
  totalPoints: number;
  unlockedPowers: string[];
  levelResults: Record<number, LevelResult>;
}

export interface BattleSession {
  levelId: number;
  creatureHpRemaining: number;
  strikes: Strikes;
  pointsEarned: number;
  currentQuestion: Question;
  questionPool: Question[];
  armedPowerId: string | null;
}
