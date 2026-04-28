import { defaultProfile, loadProfile, saveProfile, PROFILE_KEY } from "./profileStorage";

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

  test("save swallows storage errors", () => {
    const broken: Storage = {
      ...stubStorage(),
      setItem: () => { throw new Error("QuotaExceeded"); },
    };
    const p = defaultProfile("Avi", 3);
    expect(() => saveProfile(broken, p)).not.toThrow();
  });
});
