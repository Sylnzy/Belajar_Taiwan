import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db } from "../lib/db";
import { getLevelProgressStats } from "../lib/dataLoader";

describe("Dashboard Progress Calculation", () => {
  beforeEach(async () => {
    await db.progress.clear();
  });

  it("calculates zero stats when no words reviewed", async () => {
    const stats = await getLevelProgressStats("L0", 394);
    expect(stats.mastered).toBe(0);
    expect(stats.learning).toBe(0);
    expect(stats.percentage).toBe(0);
  });

  it("calculates correct progress with mixed states", async () => {
    await db.progress.bulkPut([
      {
        wordId: "L0-1",
        level: "L0",
        state: "mastered",
        repetitions: 3,
        intervalDays: 7,
        easeFactor: 2.5,
        lastReviewedAt: "",
        nextReviewAt: "",
      },
      {
        wordId: "L0-2",
        level: "L0",
        state: "mastered",
        repetitions: 3,
        intervalDays: 7,
        easeFactor: 2.5,
        lastReviewedAt: "",
        nextReviewAt: "",
      },
      {
        wordId: "L0-3",
        level: "L0",
        state: "learning",
        repetitions: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: "",
        nextReviewAt: "",
      },
    ]);

    const stats = await getLevelProgressStats("L0", 100);
    expect(stats.mastered).toBe(2);
    expect(stats.learning).toBe(1);
    expect(stats.percentage).toBe(2); // 2 out of 100
  });
});
