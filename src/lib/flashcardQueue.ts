import { VocabWord, WordProgress } from "../types/vocab";

export function buildReviewQueue(
  allWords: VocabWord[],
  progressList: WordProgress[],
  batchLimit: number = 20
): VocabWord[] {
  const now = new Date();
  const progressMap = new Map<string, WordProgress>();
  for (const p of progressList) {
    progressMap.set(p.wordId, p);
  }

  const dueWords: VocabWord[] = [];
  const newWords: VocabWord[] = [];
  const futureWords: VocabWord[] = [];

  for (const w of allWords) {
    const prog = progressMap.get(w.id);
    if (!prog) {
      newWords.push(w);
    } else {
      const nextReview = new Date(prog.nextReviewAt);
      if (nextReview <= now) {
        dueWords.push(w);
      } else {
        futureWords.push(w);
      }
    }
  }

  // Shuffle new words slightly for variety
  const shuffledNew = [...newWords].sort(() => 0.5 - Math.random());

  // Priority order:
  // 1. Due words (cards scheduled for today or overdue)
  // 2. New words (never studied)
  // 3. Fallback to all words if user wants to keep practicing
  const combined = [...dueWords, ...shuffledNew, ...futureWords];
  return combined.slice(0, batchLimit);
}
