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

test("renders region badges keyed off each level's topic", () => {
  render(<LevelSelect levels={allLevels} profile={defaultProfile("Avi", 3)} onSelect={() => {}} onChangeGrade={() => {}} />);
  // Topics in levels.json span all 5 regions; each must appear at least once.
  expect(screen.getAllByText("WILDWOOD").length).toBeGreaterThan(0);
  expect(screen.getAllByText("BOTANY").length).toBeGreaterThan(0);
  expect(screen.getAllByText("STARGAZER").length).toBeGreaterThan(0);
  expect(screen.getAllByText("VOLT LAB").length).toBeGreaterThan(0);
  expect(screen.getAllByText("CHAMPION").length).toBeGreaterThan(0);
});

test("walking trainer sprite parks at the next playable level", () => {
  // Fresh profile with starter Bulbasaur (id 1) -> next playable is L1.
  const profile = { ...defaultProfile("Avi", 3), starterPokemonId: 1 };
  render(<LevelSelect levels={allLevels} profile={profile} onSelect={() => {}} onChangeGrade={() => {}} />);
  const trainer = screen.getByLabelText(/Trainer Avi on the map/i);
  expect(trainer).toBeInTheDocument();
  // Anchored inside the L1 tile container.
  const l1Button = screen.getByLabelText("Level 1");
  // Walk up to the shared parent (the slot wrapper) and confirm the trainer is a sibling-descendant.
  expect(l1Button.parentElement?.contains(trainer)).toBe(true);
});
