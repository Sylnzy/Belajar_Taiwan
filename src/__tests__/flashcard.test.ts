import { describe, it, expect } from "vitest";
import { buildReviewQueue } from "../lib/flashcardQueue";
import { VocabWord, WordProgress } from "../types/vocab";

const mockWords: VocabWord[] = [
  { id: "L0-1", level: "L0", trad: "一", simp: "一", pinyin: "yī", pos: "N", meaning: "one", variants: "", audio: "1.mp3" },
  { id: "L0-2", level: "L0", trad: "二", simp: "二", pinyin: "èr", pos: "N", meaning: "two", variants: "", audio: "2.mp3" },
  { id: "L0-3", level: "L0", trad: "三", simp: "三", pinyin: "sān", pos: "N", meaning: "three", variants: "", audio: "3.mp3" },
];

describe("Flashcard Review Queue", () => {
  it("prioritizes due words before new words", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString();

    const progress: WordProgress[] = [
      {
        wordId: "L0-2",
        level: "L0",
        state: "learning",
        repetitions: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: yesterday,
        nextReviewAt: yesterday, // DUE!
      },
      {
        wordId: "L0-3",
        level: "L0",
        state: "mastered",
        repetitions: 4,
        intervalDays: 14,
        easeFactor: 2.6,
        lastReviewedAt: yesterday,
        nextReviewAt: nextWeek, // NOT DUE
      },
    ];

    const queue = buildReviewQueue(mockWords, progress, 10);
    // Due word "L0-2" should come first, then new word "L0-1"
    expect(queue.length).toBeGreaterThanOrEqual(2);
    expect(queue[0].id).toBe("L0-2");
    expect(queue[1].id).toBe("L0-1");
  });
});
