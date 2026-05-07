import { useState } from "react";
import levelsData from "./data/levels.json";
import powersData from "./data/powers.json";
import questionsData from "./data/questions.json";
import type { Grade, Level, Power, Profile, Question, Stars } from "./types";
import { useProfile } from "./hooks/useProfile";
import { selectQuestions } from "./logic/questionSelection";
import { TitleScreen } from "./components/TitleScreen";
import { LevelSelect } from "./components/LevelSelect";
import { BattleScreen, type ConsumableEffects } from "./components/BattleScreen";
import { ResultScreen } from "./components/ResultScreen";
import { PowerUnlockCinematic } from "./components/PowerUnlockCinematic";
import { EvolutionCinematic } from "./components/EvolutionCinematic";
import { levelForPoints } from "./logic/playerLevel";
import { currentEvolution, didEvolve } from "./logic/evolution";
import { consumeItem } from "./logic/shop";

const LEVELS = levelsData as Level[];
const POWERS = powersData as Power[];
const QUESTIONS = questionsData as Question[];

type Screen =
  | { name: "title" }
  | { name: "map" }
  | { name: "battle"; levelId: number; questionPool: Question[]; consumableEffects: ConsumableEffects }
  | {
      name: "result";
      outcome: "win" | "lose";
      levelId: number;
      stars?: Stars;
      points?: number;
      leveledUpTo?: { level: number; title: string };
      evolution?: { pokemonId: number; name: string } | null;
    }
  | {
      name: "unlock";
      power: Power;
      nextLevelId: number;
      stars: Stars;
      points: number;
      leveledUpTo?: { level: number; title: string };
      evolution?: { pokemonId: number; name: string } | null;
    }
  | {
      name: "evolution";
      from: { pokemonId: number; name: string };
      to: { pokemonId: number; name: string };
      next: Screen;
    };

const NO_EFFECTS: ConsumableEffects = {
  extraHeart: false,
  critMultiplier: 1,
  preArmedPower: null,
};

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

    // Apply any owned consumables — consume one charge of each at battle start.
    let working = profile;
    const effects: ConsumableEffects = { ...NO_EFFECTS };

    const afterHeart = consumeItem(working, "heartPotion");
    if (afterHeart) {
      working = afterHeart;
      effects.extraHeart = true;
    }
    const afterLuck = consumeItem(working, "luckyCharm");
    if (afterLuck) {
      working = afterLuck;
      effects.critMultiplier = 3;
    }
    const afterTonic = consumeItem(working, "energyTonic");
    if (afterTonic && profile.unlockedPowers.length > 0) {
      working = afterTonic;
      effects.preArmedPower =
        profile.unlockedPowers[Math.floor(Math.random() * profile.unlockedPowers.length)];
    }

    if (working !== profile) setProfile(working);

    setScreen({ name: "battle", levelId: id, questionPool: pool, consumableEffects: effects });
  }

  function handleWin({ stars, points }: { stars: Stars; points: number }) {
    if (!profile || screen.name !== "battle") return;
    const level = LEVELS.find((l) => l.id === screen.levelId)!;
    const newTotal = profile.totalPoints + points;
    const beforeLv = levelForPoints(profile.totalPoints).level;
    const after = levelForPoints(newTotal);
    const leveledUpTo =
      after.level > beforeLv ? { level: after.level, title: after.title } : undefined;
    const evolution = didEvolve(profile.starterPokemonId, beforeLv, after.level);
    const updated: Profile = {
      ...profile,
      totalPoints: newTotal,
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

    const nextScreen: Screen = newPower
      ? {
          name: "unlock",
          power: newPower,
          nextLevelId: level.id,
          stars,
          points,
          leveledUpTo,
          evolution,
        }
      : {
          name: "result",
          outcome: "win",
          levelId: level.id,
          stars,
          points,
          leveledUpTo,
          evolution,
        };

    if (evolution) {
      const fromForm = currentEvolution(profile.starterPokemonId, beforeLv);
      setScreen({
        name: "evolution",
        from: { pokemonId: fromForm.pokemonId, name: fromForm.name },
        to: evolution,
        next: nextScreen,
      });
    } else {
      setScreen(nextScreen);
    }
  }

  function handleLose() {
    if (screen.name !== "battle") return;
    let lostPoints = 0;
    if (profile) {
      lostPoints = Math.floor(profile.totalPoints / 2);
      setProfile({
        ...profile,
        totalPoints: profile.totalPoints - lostPoints,
      });
    }
    setScreen({ name: "result", outcome: "lose", levelId: screen.levelId, points: lostPoints });
  }

  function handleChangeGrade(g: Grade) {
    if (!profile) return;
    if (g === profile.gradeLevel) return;
    const ok = confirm(
      `Switch to Grade ${g}? Your level progress and unlocked powers will reset, but your total points will stay.`,
    );
    if (!ok) return;
    setProfile({
      ...profile,
      gradeLevel: g,
      levelResults: {},
      unlockedPowers: [],
    });
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
        onProfileChange={setProfile}
      />
    );
  }

  if (screen.name === "battle") {
    const level = LEVELS.find((l) => l.id === screen.levelId)!;
    const trainerLevel = levelForPoints(profile.totalPoints).level;
    return (
      <BattleScreen
        level={level}
        questions={screen.questionPool}
        unlockedPowers={profile.unlockedPowers}
        allPowers={POWERS}
        playerName={profile.playerName}
        starterPokemonId={profile.starterPokemonId}
        trainerLevel={trainerLevel}
        cosmetics={profile.equippedCosmetics}
        consumableEffects={screen.consumableEffects}
        onWin={handleWin}
        onLose={handleLose}
        onRun={() => setScreen({ name: "map" })}
      />
    );
  }

  if (screen.name === "evolution") {
    const next = screen.next;
    return (
      <EvolutionCinematic
        fromPokemonId={screen.from.pokemonId}
        toPokemonId={screen.to.pokemonId}
        fromName={screen.from.name}
        toName={screen.to.name}
        onDone={() => setScreen(next)}
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
            leveledUpTo: screen.leveledUpTo,
            evolution: screen.evolution,
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
        leveledUpTo={screen.leveledUpTo}
        evolution={screen.evolution ?? null}
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
