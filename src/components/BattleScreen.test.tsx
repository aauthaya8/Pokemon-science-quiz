import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BattleScreen } from "./BattleScreen";
import type { Level, Question } from "../types";

const level: Level = {
  id: 1, topic: "animals", creatureName: "Pichu", creaturePokemonId: 172,
  creatureHp: 3, difficultyTier: 1, unlocksPower: null,
};

const Q = (id: string): Question => ({
  id, grade: 3, topic: "animals", difficulty: 1, type: "tf",
  prompt: id, choices: ["Yes", "No"], answerIndex: 0, explanation: "",
});

test("3 right answers triggers onWin with 3 stars", async () => {
  // shouldAdvanceTime: needed for user-event v14 + Vitest 4 fake-timer compatibility
  // (without it, user.click() hangs because its internal microtask waits never resolve).
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
  const onWin = vi.fn();
  render(
    <BattleScreen
      level={level}
      questions={[Q("a"), Q("b"), Q("c"), Q("d")]}
      unlockedPowers={[]}
      allPowers={[]}
      onWin={onWin}
      onLose={() => {}}
    />
  );

  for (let i = 0; i < 3; i++) {
    await user.click(screen.getByRole("button", { name: "Yes" }));
    act(() => { vi.advanceTimersByTime(2500); });
  }

  await waitFor(() => expect(onWin).toHaveBeenCalledWith({ stars: 3, points: 30 }));
  vi.useRealTimers();
});
