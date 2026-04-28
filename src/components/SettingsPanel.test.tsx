import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsPanel } from "./SettingsPanel";

test("highlights current grade", () => {
  render(<SettingsPanel currentGrade={3} onChange={() => {}} />);
  expect(screen.getByRole("button", { name: /Grade 3/ })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: /Grade 4/ })).toHaveAttribute("aria-pressed", "false");
});

test("clicking other grade fires onChange", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<SettingsPanel currentGrade={3} onChange={onChange} />);
  await user.click(screen.getByRole("button", { name: /Grade 4/ }));
  expect(onChange).toHaveBeenCalledWith(4);
});
