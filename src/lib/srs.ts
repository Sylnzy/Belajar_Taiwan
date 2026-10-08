import { WordLearningState } from "../types/vocab";

export type ReviewGrade = "again" | "good" | "easy";

export interface SrsCalculationInput {
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  grade: ReviewGrade;
}

export interface SrsCalculationOutput {
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  state: WordLearningState;
  nextReviewDate: Date;
}

/**
 * Enhanced SM-2 Spaced Repetition calculation
 */
export function calculateNextReview(input: SrsCalculationInput): SrsCalculationOutput {
  const { intervalDays, repetitions, easeFactor, grade } = input;
  let nextInterval = 1;
  let nextReps = repetitions;
  let nextEase = easeFactor || 2.5;
  let state: WordLearningState = "learning";

  if (grade === "again") {
    nextInterval = 1;
    nextReps = 0;
    nextEase = Math.max(1.3, nextEase - 0.2);
    state = "learning";
  } else if (grade === "good") {
    nextReps += 1;
    if (nextReps === 1) {
      nextInterval = 1;
    } else if (nextReps === 2) {
      nextInterval = 3;
    } else {
      nextInterval = Math.round(intervalDays * nextEase);
    }
    state = nextReps >= 3 ? "mastered" : "learning";
  } else if (grade === "easy") {
    nextReps += 1;
    nextEase = nextEase + 0.15;
    if (nextReps === 1) {
      nextInterval = 4;
    } else if (nextReps === 2) {
      nextInterval = 7;
    } else {
      nextInterval = Math.round(intervalDays * nextEase * 1.3);
    }
    state = "mastered";
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);

  return {
    intervalDays: nextInterval,
    repetitions: nextReps,
    easeFactor: Number(nextEase.toFixed(2)),
    state,
    nextReviewDate: nextDate,
  };
}
