import Dexie, { Table } from "dexie";
import { WordProgress, QuizResultRecord } from "../types/vocab";

export class TocflDatabase extends Dexie {
  progress!: Table<WordProgress, string>;
  quizHistory!: Table<QuizResultRecord, number>;

  constructor() {
    super("TocflDatabase");
    this.version(1).stores({
      progress: "wordId, level, state, nextReviewAt, lastReviewedAt",
      quizHistory: "++id, level, date, scorePercentage",
    });
  }
}

export const db = new TocflDatabase();

/**
 * Export all user study data to a JSON string
 */
export async function exportUserData(): Promise<string> {
  const progressList = await db.progress.toArray();
  const quizList = await db.quizHistory.toArray();
  const exportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: progressList,
    quizHistory: quizList,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Import user study data from JSON string
 */
export async function importUserData(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.progress || !Array.isArray(data.progress)) {
      return false;
    }
    await db.transaction("rw", db.progress, db.quizHistory, async () => {
      await db.progress.clear();
      await db.progress.bulkPut(data.progress);
      if (Array.isArray(data.quizHistory)) {
        await db.quizHistory.clear();
        await db.quizHistory.bulkPut(data.quizHistory);
      }
    });
    return true;
  } catch (err) {
    console.error("Failed to import user data:", err);
    return false;
  }
}
