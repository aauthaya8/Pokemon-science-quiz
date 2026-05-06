import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShopPanel } from "./ShopPanel";
import { defaultProfile } from "../logic/profileStorage";
import type { Profile } from "../types";

const richProfile = (): Profile => ({ ...defaultProfile("Avi", 3), totalPoints: 1000 });

test("renders all 6 items + balance", () => {
  render(<ShopPanel profile={richProfile()} onChange={() => {}} onClose={() => {}} />);
  expect(screen.getByTestId("shop-item-heartPotion")).toBeInTheDocument();
  expect(screen.getByTestId("shop-item-luckyCharm")).toBeInTheDocument();
  expect(screen.getByTestId("shop-item-energyTonic")).toBeInTheDocument();
  expect(screen.getByTestId("shop-item-topHat")).toBeInTheDocument();
  expect(screen.getByTestId("shop-item-crown")).toBeInTheDocument();
  expect(screen.getByTestId("shop-item-shinyStar")).toBeInTheDocument();
  expect(screen.getByText(/1000 pts/)).toBeInTheDocument();
});

test("buying a heart potion calls onChange with deducted points and inventory", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<ShopPanel profile={richProfile()} onChange={onChange} onClose={() => {}} />);
  await user.click(screen.getByLabelText(/Buy Heart Potion/i));
  expect(onChange).toHaveBeenCalledTimes(1);
  const next: Profile = onChange.mock.calls[0][0];
  expect(next.totalPoints).toBe(950);
  expect(next.inventory.heartPotion).toBe(1);
});

test("close button calls onClose", async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(<ShopPanel profile={richProfile()} onChange={() => {}} onClose={onClose} />);
  await user.click(screen.getByLabelText(/Close shop/i));
  expect(onClose).toHaveBeenCalled();
});

test("owned cosmetic shows OWNED badge and Equip button", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  const profile: Profile = {
    ...richProfile(),
    inventory: { topHat: 1 },
  };
  render(<ShopPanel profile={profile} onChange={onChange} onClose={() => {}} />);
  expect(screen.getByTestId("owned-topHat")).toHaveTextContent("OWNED");
  await user.click(screen.getByLabelText(/Equip Top Hat/i));
  expect(onChange).toHaveBeenCalled();
  const next: Profile = onChange.mock.calls[0][0];
  expect(next.equippedCosmetics).toContain("topHat");
});

test("buy button disabled when can't afford", () => {
  const profile: Profile = { ...defaultProfile("Avi", 3), totalPoints: 0 };
  render(<ShopPanel profile={profile} onChange={() => {}} onClose={() => {}} />);
  expect(screen.getByLabelText(/Buy Heart Potion/i)).toBeDisabled();
});

test("owned consumable shows count", () => {
  const profile: Profile = {
    ...richProfile(),
    inventory: { heartPotion: 3 },
  };
  render(<ShopPanel profile={profile} onChange={() => {}} onClose={() => {}} />);
  expect(screen.getByTestId("owned-heartPotion")).toHaveTextContent("Owned: 3");
});
