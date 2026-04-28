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
