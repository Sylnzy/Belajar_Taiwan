import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db, exportUserData, importUserData } from "../lib/db";

describe("Database Export & Import", () => {
  beforeEach(async () => {
    await db.progress.clear();
    await db.quizHistory.clear();
  });

  it("exports and imports user progress data correctly", async () => {
    await db.progress.put({
      wordId: "L0-1001",
      level: "L0",
      state: "mastered",
      repetitions: 4,
      intervalDays: 12,
      easeFactor: 2.6,
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: new Date().toISOString(),
    });

    const exported = await exportUserData();
    expect(exported).toContain("L0-1001");
    expect(exported).toContain("mastered");

    // Clear db
    await db.progress.clear();
    const countBefore = await db.progress.count();
    expect(countBefore).toBe(0);

    // Import back
    const success = await importUserData(exported);
    expect(success).toBe(true);

    const record = await db.progress.get("L0-1001");
    expect(record).toBeDefined();
    expect(record?.state).toBe("mastered");
  });
});
