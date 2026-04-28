import { renderHook, act } from "@testing-library/react";
import { useProfile } from "./useProfile";
import { defaultProfile, PROFILE_KEY } from "../logic/profileStorage";

beforeEach(() => localStorage.clear());

test("returns null on first run", () => {
  const { result } = renderHook(() => useProfile());
  expect(result.current.profile).toBeNull();
});

test("saving persists to localStorage", () => {
  const { result } = renderHook(() => useProfile());
  act(() => result.current.setProfile(defaultProfile("Avi", 3)));
  expect(JSON.parse(localStorage.getItem(PROFILE_KEY)!).playerName).toBe("Avi");
});

test("functional update works", () => {
  const { result } = renderHook(() => useProfile());
  act(() => result.current.setProfile(defaultProfile("Avi", 3)));
  act(() => result.current.setProfile((p) => ({ ...p!, totalPoints: 100 })));
  expect(result.current.profile?.totalPoints).toBe(100);
});
