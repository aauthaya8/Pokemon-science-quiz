import questions from "./questions.json";
import type { Question } from "../types";

const data = questions as Question[];

test("file exists and is an array", () => {
  expect(Array.isArray(data)).toBe(true);
});

test("every question conforms to schema", () => {
  data.forEach((q) => {
    expect(typeof q.id).toBe("string");
    expect([3, 4]).toContain(q.grade);
    expect(["animals","life","earth","physical"]).toContain(q.topic);
    expect([1, 2, 3]).toContain(q.difficulty);
    expect(["mc","tf"]).toContain(q.type);
    expect(typeof q.prompt).toBe("string");
    expect(Array.isArray(q.choices)).toBe(true);
    expect(q.choices.length).toBe(q.type === "tf" ? 2 : 4);
    expect(q.answerIndex).toBeGreaterThanOrEqual(0);
    expect(q.answerIndex).toBeLessThan(q.choices.length);
  });
});

test("ids are unique", () => {
  const ids = data.map(q => q.id);
  expect(new Set(ids).size).toBe(ids.length);
});
