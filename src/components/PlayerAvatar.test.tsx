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
