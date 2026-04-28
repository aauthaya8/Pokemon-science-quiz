import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LevelSelect } from "./LevelSelect";
import { defaultProfile } from "../logic/profileStorage";
import levels from "../data/levels.json";
import type { Level } from "../types";

const allLevels = levels as Level[];

test("renders 12 level tiles", () => {
  render(<LevelSelect levels={allLevels} profile={defaultProfile("Avi", 3)} onSelect={() => {}} onChangeGrade={() => {}} />);
  expect(screen.getAllByLabelText(/Level \d+/i)).toHaveLength(12);
});

test("only level 1 enabled for empty profile", () => {
  render(<LevelSelect levels={allLevels} profile={defaultProfile("Avi", 3)} onSelect={() => {}} onChangeGrade={() => {}} />);
  expect(screen.getByLabelText("Level 1")).not.toBeDisabled();
  expect(screen.getByLabelText("Level 2")).toBeDisabled();
});

test("clicking unlocked level calls onSelect", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<LevelSelect levels={allLevels} profile={defaultProfile("Avi", 3)} onSelect={onSelect} onChangeGrade={() => {}} />);
  await user.click(screen.getByLabelText("Level 1"));
  expect(onSelect).toHaveBeenCalledWith(1);
});
