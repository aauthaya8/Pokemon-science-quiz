import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => localStorage.clear());

test("first run shows TitleScreen", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /Kids Science Battle/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
});
