import { LevelSummary, VocabWord } from "../types/vocab";
import { db } from "./db";

export async function loadLevelSummary(): Promise<LevelSummary[]> {
  try {
    const res = await fetch("/data/tocfl-summary.json");
    if (!res.ok) throw new Error("Failed to fetch summary");
    return await res.json();
  } catch (err) {
    console.error("Error loading level summary:", err);
    return [];
  }
}

export async function loadLevelWords(levelId: string): Promise<VocabWord[]> {
  try {
    const res = await fetch(`/data/tocfl-${levelId.toLowerCase()}.json`);
    if (!res.ok) throw new Error(`Failed to fetch words for ${levelId}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading words for ${levelId}:`, err);
    return [];
  }
}

export interface LevelProgressStats {
  mastered: number;
  learning: number;
  total: number;
  percentage: number;
}

export async function getLevelProgressStats(levelId: string, totalWords: number): Promise<LevelProgressStats> {
  try {
    const records = await db.progress.where("level").equals(levelId).toArray();
    let mastered = 0;
    let learning = 0;

    for (const r of records) {
      if (r.state === "mastered") mastered += 1;
      else if (r.state === "learning") learning += 1;
    }

    const percentage = totalWords > 0 ? Math.round((mastered / totalWords) * 100) : 0;

    return {
      mastered,
      learning,
      total: totalWords,
      percentage,
    };
  } catch (err) {
    console.error("Failed to calculate progress stats:", err);
    return {
      mastered: 0,
      learning: 0,
      total: totalWords,
      percentage: 0,
    };
  }
}
