import { useState } from "react";
import levelsData from "./data/levels.json";
import powersData from "./data/powers.json";
import questionsData from "./data/questions.json";
import type { Grade, Level, Power, Profile, Question, Stars } from "./types";
import { useProfile } from "./hooks/useProfile";
import { selectQuestions } from "./logic/questionSelection";
import { TitleScreen } from "./components/TitleScreen";
import { LevelSelect } from "./components/LevelSelect";
import { BattleScreen } from "./components/BattleScreen";
import { ResultScreen } from "./components/ResultScreen";
import { PowerUnlockCinematic } from "./components/PowerUnlockCinematic";

const LEVELS = levelsData as Level[];
const POWERS = powersData as Power[];
const QUESTIONS = questionsData as Question[];

type Screen =
  | { name: "title" }
  | { name: "map" }
  | { name: "battle"; levelId: number; questionPool: Question[] }
  | { name: "result"; outcome: "win" | "lose"; levelId: number; stars?: Stars; points?: number }
  | { name: "unlock"; power: Power; nextLevelId: number; stars: Stars; points: number };

export default function App() {
  const { profile, setProfile } = useProfile();
  const [screen, setScreen] = useState<Screen>({ name: "title" });

  function handleStart(p: Profile) {
    setProfile(p);
    setScreen({ name: "map" });
  }

  function handleSelectLevel(id: number) {
    if (!profile) return;
    const level = LEVELS.find((l) => l.id === id)!;
    const topic = level.topic === "mixed" ? randomTopic() : level.topic;
    const pool = selectQuestions({
      bank: QUESTIONS,
      grade: profile.gradeLevel,
      topic,
      difficulty: level.difficultyTier,
      count: level.creatureHp + 5,
    });
    setScreen({ name: "battle", levelId: id, questionPool: pool });
  }

  function handleWin({ stars, points }: { stars: Stars; points: number }) {
    if (!profile || screen.name !== "battle") return;
    const level = LEVELS.find((l) => l.id === screen.levelId)!;
    const updated: Profile = {
      ...profile,
      totalPoints: profile.totalPoints + points,
      levelResults: {
        ...profile.levelResults,
        [level.id]: {
          stars: maxStars(profile.levelResults[level.id]?.stars, stars),
          bestPoints: Math.max(profile.levelResults[level.id]?.bestPoints ?? 0, points),
          completedAt: new Date().toISOString(),
        },
      },
      unlockedPowers:
        level.unlocksPower && !profile.unlockedPowers.includes(level.unlocksPower)
          ? [...profile.unlockedPowers, level.unlocksPower]
          : profile.unlockedPowers,
    };
    setProfile(updated);

    const newPower =
      level.unlocksPower && !profile.unlockedPowers.includes(level.unlocksPower)
        ? POWERS.find((p) => p.id === level.unlocksPower)
        : undefined;

    if (newPower) {
      setScreen({ name: "unlock", power: newPower, nextLevelId: level.id, stars, points });
    } else {
      setScreen({ name: "result", outcome: "win", levelId: level.id, stars, points });
    }
  }

  function handleLose() {
    if (screen.name !== "battle") return;
    setScreen({ name: "result", outcome: "lose", levelId: screen.levelId });
  }

  function handleChangeGrade(g: Grade) {
    if (!profile) return;
    setProfile({ ...profile, gradeLevel: g });
  }

  if (!profile || screen.name === "title") {
    return <TitleScreen profile={profile} onStart={handleStart} />;
  }

  if (screen.name === "map") {
    return (
      <LevelSelect
        levels={LEVELS}
        profile={profile}
        onSelect={handleSelectLevel}
        onChangeGrade={handleChangeGrade}
      />
    );
  }

  if (screen.name === "battle") {
    const level = LEVELS.find((l) => l.id === screen.levelId)!;
    return (
      <BattleScreen
        level={level}
        questions={screen.questionPool}
        unlockedPowers={profile.unlockedPowers}
        allPowers={POWERS}
        onWin={handleWin}
        onLose={handleLose}
      />
    );
  }

  if (screen.name === "unlock") {
    return (
      <PowerUnlockCinematic
        power={screen.power}
        onDone={() =>
          setScreen({
            name: "result",
            outcome: "win",
            levelId: screen.nextLevelId,
            stars: screen.stars,
            points: screen.points,
          })
        }
      />
    );
  }

  if (screen.name === "result") {
    const hasNext = screen.outcome === "win" && screen.levelId < LEVELS.length;
    return (
      <ResultScreen
        outcome={screen.outcome}
        stars={screen.stars}
        points={screen.points}
        hasNextLevel={hasNext}
        onNext={() => handleSelectLevel(screen.levelId + 1)}
        onReplay={() => handleSelectLevel(screen.levelId)}
        onHome={() => setScreen({ name: "map" })}
      />
    );
  }

  return null;
}

function randomTopic(): "animals" | "life" | "earth" | "physical" {
  const topics = ["animals", "life", "earth", "physical"] as const;
  return topics[Math.floor(Math.random() * topics.length)];
}

function maxStars(prev: Stars | undefined, next: Stars): Stars {
  if (prev === undefined) return next;
  return (Math.max(prev, next)) as Stars;
}
