import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BattleScreen } from "./BattleScreen";
import type { Level, Question } from "../types";

const level: Level = {
  id: 1, topic: "animals", creatureName: "Pichu", creaturePokemonId: 172,
  creatureHp: 3, difficultyTier: 1, unlocksPower: null, pokemonType: "electric",
};

const Q = (id: string): Question => ({
  id, grade: 3, topic: "animals", difficulty: 1, type: "tf",
  prompt: id, choices: ["Yes", "No"], answerIndex: 0, explanation: "",
});

test("3 right answers triggers onWin with 3 stars", async () => {
  // shouldAdvanceTime: needed for user-event v14 + Vitest 4 fake-timer compatibility
  // (without it, user.click() hangs because its internal microtask waits never resolve).
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // Force no crits so damage is deterministic (1 per hit) and 3 hits exactly defeats Pichu.
  const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.99);
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

  async function advanceAndFlush(ms: number) {
    // Advance in 200ms chunks so React effects get a chance to re-schedule
    // their timers between ticks (each setDialogue fires a useEffect which
    // schedules the NEXT 1400ms timeout).
    const chunk = 200;
    for (let t = 0; t < ms; t += chunk) {
      await act(async () => { vi.advanceTimersByTime(chunk); });
    }
  }

  // Initial dialogue line ("WILD PICHU APPEARED!") needs to clear before input unlocks.
  await advanceAndFlush(1600);

  for (let i = 0; i < 3; i++) {
    await user.click(screen.getByRole("button", { name: "Yes" }));
    // After each answer the dialogue queue holds 2 lines (or 3 on the killing blow).
    // 1400ms per line + explanation 2500ms; 3*1400 + 2500 = 6700ms worst case.
    await advanceAndFlush(8000);
  }

  await waitFor(() => expect(onWin).toHaveBeenCalledWith({ stars: 3, points: 30 }));
  randomSpy.mockRestore();
  vi.useRealTimers();
});
