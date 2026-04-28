import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "../types";

const q: Question = {
  id: "test", grade: 3, topic: "animals", difficulty: 1, type: "mc",
  prompt: "Which is a mammal?",
  choices: ["Snake", "Dolphin", "Lizard", "Frog"],
  answerIndex: 1,
  explanation: "",
};

test("renders prompt", () => {
  render(<QuestionCard question={q} onAnswer={() => {}} />);
  expect(screen.getByText("Which is a mammal?")).toBeInTheDocument();
});

test("renders all choices as buttons", () => {
  render(<QuestionCard question={q} onAnswer={() => {}} />);
  expect(screen.getAllByRole("button")).toHaveLength(4);
});

test("fires onAnswer with index", async () => {
  const user = userEvent.setup();
  const onAnswer = vi.fn();
  render(<QuestionCard question={q} onAnswer={onAnswer} />);
  await user.click(screen.getByRole("button", { name: /Dolphin/ }));
  expect(onAnswer).toHaveBeenCalledWith(1);
});
