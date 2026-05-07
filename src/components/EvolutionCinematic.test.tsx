import { render, screen, act } from "@testing-library/react";
import { EvolutionCinematic } from "./EvolutionCinematic";

test("renders both forms and headline, then fires onDone after timeout", () => {
  vi.useFakeTimers();
  const onDone = vi.fn();
  render(
    <EvolutionCinematic
      fromPokemonId={1}
      toPokemonId={2}
      fromName="Bulbasaur"
      toName="Ivysaur"
      onDone={onDone}
    />,
  );

  expect(screen.getByTestId("evolution-cinematic")).toBeInTheDocument();
  expect(screen.getByAltText("Bulbasaur")).toBeInTheDocument();
  expect(screen.getByAltText("Ivysaur")).toBeInTheDocument();
  expect(screen.getByText(/BULBASAUR EVOLVED INTO IVYSAUR!/i)).toBeInTheDocument();

  expect(onDone).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(2600);
  });
  expect(onDone).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});
