import { render, screen } from "@testing-library/react";
import { StrikeCounter } from "./StrikeCounter";

test("renders 3 hearts", () => {
  render(<StrikeCounter strikes={0} />);
  expect(screen.getAllByLabelText(/heart/i)).toHaveLength(3);
});

test("strikes=2 shows 2 broken hearts", () => {
  render(<StrikeCounter strikes={2} />);
  const broken = screen.getAllByLabelText("broken heart");
  const whole = screen.getAllByLabelText("heart");
  expect(broken).toHaveLength(2);
  expect(whole).toHaveLength(1);
});

test("maxHearts=4 (Heart Potion) renders 4 whole hearts at strikes=0", () => {
  render(<StrikeCounter strikes={0} maxHearts={4} />);
  expect(screen.getAllByLabelText("heart")).toHaveLength(4);
});

test("maxHearts=4 with 1 strike shows 3 whole + 1 broken", () => {
  render(<StrikeCounter strikes={1} maxHearts={4} />);
  expect(screen.getAllByLabelText("heart")).toHaveLength(3);
  expect(screen.getAllByLabelText("broken heart")).toHaveLength(1);
});
