import { render, screen } from "@testing-library/react";
import App from "./App";

test("App renders the title", () => {
  render(<App />);
  expect(screen.getByText(/Kids Science Battle/i)).toBeInTheDocument();
});
