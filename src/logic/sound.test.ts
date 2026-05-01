import { isMuted, setMuted, playSound } from "./sound";

beforeEach(() => {
  localStorage.clear();
  setMuted(false);
});

describe("sound", () => {
  test("setMuted persists and toggles isMuted", () => {
    setMuted(true);
    expect(isMuted()).toBe(true);
    expect(localStorage.getItem("kidsScienceBattle.muted")).toBe("true");
    setMuted(false);
    expect(isMuted()).toBe(false);
    expect(localStorage.getItem("kidsScienceBattle.muted")).toBe("false");
  });

  test("playSound never throws when muted", () => {
    setMuted(true);
    expect(() => playSound("attack-basic")).not.toThrow();
  });

  test("playSound never throws when audio is unavailable", () => {
    // jsdom doesn't actually play audio; constructing Audio + play() should be tolerated.
    expect(() => playSound("nonexistent-asset-xyz")).not.toThrow();
  });
});
