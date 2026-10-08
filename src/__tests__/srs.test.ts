import { describe, it, expect } from "vitest";
import { calculateNextReview, ReviewGrade } from "../lib/srs";

describe("SRS Spaced Repetition Logic", () => {
  it("resets interval and repetitions when grade is 'again'", () => {
    const result = calculateNextReview({
      intervalDays: 10,
      repetitions: 4,
      easeFactor: 2.5,
      grade: "again",
    });

    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.state).toBe("learning");
  });

  it("increases interval on 'good'", () => {
    // first good
    const r1 = calculateNextReview({
      intervalDays: 0,
      repetitions: 0,
      easeFactor: 2.5,
      grade: "good",
    });
    expect(r1.intervalDays).toBe(1);
    expect(r1.repetitions).toBe(1);

    // second good
    const r2 = calculateNextReview({
      intervalDays: r1.intervalDays,
      repetitions: r1.repetitions,
      easeFactor: r1.easeFactor,
      grade: "good",
    });
    expect(r2.intervalDays).toBe(3);
    expect(r2.repetitions).toBe(2);

    // third good
    const r3 = calculateNextReview({
      intervalDays: r2.intervalDays,
      repetitions: r2.repetitions,
      easeFactor: r2.easeFactor,
      grade: "good",
    });
    expect(r3.intervalDays).toBeGreaterThan(5);
    expect(r3.state).toBe("mastered");
  });

  it("gives higher interval on 'easy'", () => {
    const rEasy = calculateNextReview({
      intervalDays: 1,
      repetitions: 1,
      easeFactor: 2.5,
      grade: "easy",
    });

    expect(rEasy.intervalDays).toBeGreaterThanOrEqual(4);
    expect(rEasy.easeFactor).toBeGreaterThan(2.5);
  });
});
