import { render, screen } from "@testing-library/react";
import { PlayerAvatar } from "./PlayerAvatar";

test("renders without cosmetics by default", () => {
  render(<PlayerAvatar starterPokemonId={25} />);
  expect(screen.queryByTestId("cosmetic-topHat")).not.toBeInTheDocument();
  expect(screen.queryByTestId("cosmetic-crown")).not.toBeInTheDocument();
  expect(screen.queryByTestId("cosmetic-shinyStar")).not.toBeInTheDocument();
});

test("renders top hat when equipped", () => {
  render(<PlayerAvatar starterPokemonId={25} cosmetics={["topHat"]} />);
  expect(screen.getByTestId("cosmetic-topHat")).toBeInTheDocument();
});

test("renders crown when equipped", () => {
  render(<PlayerAvatar starterPokemonId={25} cosmetics={["crown"]} />);
  expect(screen.getByTestId("cosmetic-crown")).toBeInTheDocument();
});

test("crown takes precedence over top hat (head slot)", () => {
  render(<PlayerAvatar starterPokemonId={25} cosmetics={["topHat", "crown"]} />);
  expect(screen.getByTestId("cosmetic-crown")).toBeInTheDocument();
  expect(screen.queryByTestId("cosmetic-topHat")).not.toBeInTheDocument();
});

test("renders shiny star when equipped", () => {
  render(<PlayerAvatar starterPokemonId={25} cosmetics={["shinyStar"]} />);
  expect(screen.getByTestId("cosmetic-shinyStar")).toBeInTheDocument();
});

test("renders the starter form name when below evolution threshold", () => {
  render(<PlayerAvatar starterPokemonId={1} trainerLevel={2} />);
  expect(screen.getByTestId("player-avatar-name").textContent).toBe("Bulbasaur");
  const img = screen.getByAltText(/Bulbasaur avatar/i) as HTMLImageElement;
  expect(img.src).toContain("/1.png");
});

test("renders the evolved form name + sprite at the threshold", () => {
  render(<PlayerAvatar starterPokemonId={1} trainerLevel={3} />);
  expect(screen.getByTestId("player-avatar-name").textContent).toBe("Ivysaur");
  const img = screen.getByAltText(/Ivysaur avatar/i) as HTMLImageElement;
  expect(img.src).toContain("/2.png");
});

test("renders the final evolution at high trainer level", () => {
  render(<PlayerAvatar starterPokemonId={4} trainerLevel={9} />);
  expect(screen.getByTestId("player-avatar-name").textContent).toBe("Charizard");
  const img = screen.getByAltText(/Charizard avatar/i) as HTMLImageElement;
  expect(img.src).toContain("/6.png");
});
