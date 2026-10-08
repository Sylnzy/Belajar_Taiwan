import { describe, it, expect } from "vitest";
import { generateQuiz } from "../lib/quizGenerator";
import { VocabWord } from "../types/vocab";

const sampleWords: VocabWord[] = [
  { id: "1", level: "L0", trad: "我", simp: "我", pinyin: "wǒ", pos: "N", meaning: "I; me", variants: "", audio: "wo.mp3" },
  { id: "2", level: "L0", trad: "你", simp: "你", pinyin: "nǐ", pos: "N", meaning: "you", variants: "", audio: "ni.mp3" },
  { id: "3", level: "L0", trad: "他", simp: "他", pinyin: "tā", pos: "N", meaning: "he; him", variants: "", audio: "ta.mp3" },
  { id: "4", level: "L0", trad: "她", simp: "她", pinyin: "tā", pos: "N", meaning: "she; her", variants: "", audio: "ta2.mp3" },
  { id: "5", level: "L0", trad: "吃", simp: "吃", pinyin: "chī", pos: "V", meaning: "to eat", variants: "", audio: "chi.mp3" },
];

describe("TOCFL Quiz Generator", () => {
  it("generates correct number of questions with 4 distinct options each", () => {
    const questions = generateQuiz(sampleWords, 3);
    expect(questions).toHaveLength(3);

    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      // Correct answer must be among options
      expect(q.options).toContain(q.correctAnswer);
      // Options must be unique
      const uniqueOpts = new Set(q.options);
      expect(uniqueOpts.size).toBe(4);
    }
  });

  it("assigns valid question types", () => {
    const questions = generateQuiz(sampleWords, 2);
    const validTypes = ["hanzi-to-meaning", "meaning-to-hanzi", "audio-to-hanzi"];
    for (const q of questions) {
      expect(validTypes).toContain(q.type);
    }
  });
});
