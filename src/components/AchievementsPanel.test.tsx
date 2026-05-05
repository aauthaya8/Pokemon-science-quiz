import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AchievementsPanel } from "./AchievementsPanel";
import { defaultProfile } from "../logic/profileStorage";
import type { Profile } from "../types";

test("fresh profile shows all achievements locked", () => {
  const p = defaultProfile("Avi", 3);
  render(<AchievementsPanel profile={p} onClose={() => {}} />);
  expect(screen.getByText(/0 \/ 7 unlocked/i)).toBeInTheDocument();
  // No achievements should be flagged unlocked.
  for (const node of screen.getAllByTestId(/^achievement-/)) {
    expect(node).toHaveAttribute("data-unlocked", "false");
  }
});

test("First Win unlocks after one level result", () => {
  const p: Profile = {
    ...defaultProfile("Avi", 3),
    levelResults: { 1: { stars: 2, bestPoints: 10, completedAt: "2026-04-27T00:00:00Z" } },
  };
  render(<AchievementsPanel profile={p} onClose={() => {}} />);
  expect(screen.getByTestId("achievement-firstWin")).toHaveAttribute("data-unlocked", "true");
  expect(screen.getByText("First Win!")).toBeInTheDocument();
});

test("Big Spender unlocks at 1000 points", () => {
  const p: Profile = { ...defaultProfile("Avi", 3), totalPoints: 1000 };
  render(<AchievementsPanel profile={p} onClose={() => {}} />);
  expect(screen.getByTestId("achievement-millionaire")).toHaveAttribute("data-unlocked", "true");
});

test("Veteran Trainer unlocks at Lv 5 (≥500 pts)", () => {
  const p: Profile = { ...defaultProfile("Avi", 3), totalPoints: 500 };
  render(<AchievementsPanel profile={p} onClose={() => {}} />);
  expect(screen.getByTestId("achievement-trainerLv5")).toHaveAttribute("data-unlocked", "true");
});

test("close button calls onClose", async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(<AchievementsPanel profile={defaultProfile("Avi", 3)} onClose={onClose} />);
  await user.click(screen.getByLabelText(/Close achievements/i));
  expect(onClose).toHaveBeenCalled();
});
