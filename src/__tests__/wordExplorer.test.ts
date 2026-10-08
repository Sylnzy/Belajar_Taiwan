import { describe, it, expect } from "vitest";
import { filterWords } from "../lib/searchFilter";
import { VocabWord } from "../types/vocab";

const sampleWords: VocabWord[] = [
  {
    id: "L0-1001",
    level: "L0",
    trad: "我",
    simp: "我",
    pinyin: "wǒ",
    pos: "N",
    meaning: "I; me; my",
    variants: "",
    audio: "tocfl-tts-我.mp3",
  },
  {
    id: "L0-1002",
    level: "L0",
    trad: "你/妳",
    simp: "你",
    pinyin: "nǐ",
    pos: "N",
    meaning: "you (informal)",
    variants: "",
    audio: "tocfl-tts-你.mp3",
  },
  {
    id: "L0-1003",
    level: "L0",
    trad: "吃",
    simp: "吃",
    pinyin: "chī",
    pos: "V",
    meaning: "to eat",
    variants: "",
    audio: "tocfl-tts-吃.mp3",
  },
];

describe("Word Explorer Search & Filter", () => {
  it("filters by Traditional Hanzi", () => {
    const res = filterWords(sampleWords, "我", "ALL");
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("L0-1001");
  });

  it("filters by Pinyin (case and tone insensitive)", () => {
    const res = filterWords(sampleWords, "ni", "ALL");
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("L0-1002");
  });

  it("filters by English meaning", () => {
    const res = filterWords(sampleWords, "eat", "ALL");
    expect(res).toHaveLength(1);
    expect(res[0].trad).toBe("吃");
  });

  it("filters by Part of Speech (POS)", () => {
    const res = filterWords(sampleWords, "", "V");
    expect(res).toHaveLength(1);
    expect(res[0].trad).toBe("吃");
  });
});
