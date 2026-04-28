import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PowerBar } from "./PowerBar";
import type { Power } from "../types";

const ALL: Power[] = [
  { id: "beastRoar", name: "Beast Roar", emoji: "🦁", topic: "animals", description: "x" },
  { id: "vineWhip",  name: "Vine Whip",  emoji: "🌿", topic: "life",    description: "x" },
];

test("renders all powers", () => {
  render(<PowerBar all={ALL} unlockedIds={[]} armedPowerId={null} onArm={() => {}} />);
  expect(screen.getAllByRole("button")).toHaveLength(2);
});

test("locked powers are disabled", () => {
  render(<PowerBar all={ALL} unlockedIds={["vineWhip"]} armedPowerId={null} onArm={() => {}} />);
  expect(screen.getByRole("button", { name: /Beast Roar/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: /Vine Whip/ })).not.toBeDisabled();
});

test("unlocked tap calls onArm with id", async () => {
  const user = userEvent.setup();
  const onArm = vi.fn();
  render(<PowerBar all={ALL} unlockedIds={["vineWhip"]} armedPowerId={null} onArm={onArm} />);
  await user.click(screen.getByRole("button", { name: /Vine Whip/ }));
  expect(onArm).toHaveBeenCalledWith("vineWhip");
});

test("tap on armed power disarms (passes null)", async () => {
  const user = userEvent.setup();
  const onArm = vi.fn();
  render(<PowerBar all={ALL} unlockedIds={["vineWhip"]} armedPowerId="vineWhip" onArm={onArm} />);
  await user.click(screen.getByRole("button", { name: /Vine Whip/ }));
  expect(onArm).toHaveBeenCalledWith(null);
});
