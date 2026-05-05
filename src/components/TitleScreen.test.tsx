import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TitleScreen } from "./TitleScreen";
import { defaultProfile } from "../logic/profileStorage";

test("returning profile shows welcome back", () => {
  const p = defaultProfile("Avi", 3);
  render(<TitleScreen profile={p} onStart={() => {}} />);
  expect(screen.getByText(/Welcome back, Avi/i)).toBeInTheDocument();
});

test("first-run requires name, grade, and starter then enables Play", async () => {
  const user = userEvent.setup();
  const onStart = vi.fn();
  render(<TitleScreen profile={null} onStart={onStart} />);
  expect(screen.getByRole("button", { name: /^Play$/i })).toBeDisabled();
  await user.type(screen.getByLabelText(/Your Name/i), "Avi");
  await user.click(screen.getByRole("button", { name: /Grade 4/i }));
  // Still disabled until starter is picked.
  expect(screen.getByRole("button", { name: /^Play$/i })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: /Pick Eevee/i }));
  expect(screen.getByRole("button", { name: /^Play$/i })).not.toBeDisabled();
  await user.click(screen.getByRole("button", { name: /^Play$/i }));
  expect(onStart).toHaveBeenCalledWith(
    expect.objectContaining({ playerName: "Avi", gradeLevel: 4, starterPokemonId: 133 }),
  );
});
