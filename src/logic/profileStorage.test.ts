import { defaultProfile, loadProfile, saveProfile, PROFILE_KEY, DEFAULT_STARTER_POKEMON_ID } from "./profileStorage";

const stubStorage = (): Storage & { __data: Record<string, string> } => {
  const data: Record<string, string> = {};
  return {
    __data: data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = v; },
    removeItem: (k) => { delete data[k]; },
    clear: () => { for (const k of Object.keys(data)) delete data[k]; },
    key: (i) => Object.keys(data)[i] ?? null,
    get length() { return Object.keys(data).length; },
  };
};

describe("defaultProfile", () => {
  test("zeroed values + supplied name + grade", () => {
    const p = defaultProfile("Avi", 3);
    expect(p.playerName).toBe("Avi");
    expect(p.gradeLevel).toBe(3);
    expect(p.totalPoints).toBe(0);
    expect(p.unlockedPowers).toEqual([]);
    expect(p.levelResults).toEqual({});
    expect(p.starterPokemonId).toBe(DEFAULT_STARTER_POKEMON_ID);
    expect(p.inventory).toEqual({});
    expect(p.equippedCosmetics).toEqual([]);
  });

  test("accepts a starter Pokémon dex id", () => {
    const p = defaultProfile("Avi", 4, 133);
    expect(p.starterPokemonId).toBe(133);
  });
});

describe("loadProfile / saveProfile", () => {
  test("returns null when nothing stored", () => {
    expect(loadProfile(stubStorage())).toBeNull();
  });

  test("saves and round-trips", () => {
    const s = stubStorage();
    const p = defaultProfile("Avi", 4);
    p.totalPoints = 50;
    saveProfile(s, p);
    expect(s.__data[PROFILE_KEY]).toBeDefined();
    expect(loadProfile(s)).toEqual(p);
  });

  test("returns null on corrupted JSON", () => {
    const s = stubStorage();
    s.setItem(PROFILE_KEY, "{not valid");
    expect(loadProfile(s)).toBeNull();
  });

  test("legacy save without starterPokemonId defaults to Pikachu (25)", () => {
    const s = stubStorage();
    s.setItem(
      PROFILE_KEY,
      JSON.stringify({
        playerName: "Avi",
        gradeLevel: 3,
        totalPoints: 100,
        unlockedPowers: [],
        levelResults: {},
      }),
    );
    const loaded = loadProfile(s);
    expect(loaded).not.toBeNull();
    expect(loaded!.starterPokemonId).toBe(DEFAULT_STARTER_POKEMON_ID);
    expect(loaded!.playerName).toBe("Avi");
    expect(loaded!.totalPoints).toBe(100);
  });

  test("legacy save without inventory/equippedCosmetics defaults to empty", () => {
    const s = stubStorage();
    s.setItem(
      PROFILE_KEY,
      JSON.stringify({
        playerName: "Avi",
        gradeLevel: 3,
        totalPoints: 100,
        unlockedPowers: [],
        levelResults: {},
        starterPokemonId: 25,
      }),
    );
    const loaded = loadProfile(s);
    expect(loaded).not.toBeNull();
    expect(loaded!.inventory).toEqual({});
    expect(loaded!.equippedCosmetics).toEqual([]);
  });

  test("save swallows storage errors", () => {
    const broken: Storage = {
      ...stubStorage(),
      setItem: () => { throw new Error("QuotaExceeded"); },
    };
    const p = defaultProfile("Avi", 3);
    expect(() => saveProfile(broken, p)).not.toThrow();
  });
});
