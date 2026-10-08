export interface VocabWord {
  id: string;          // e.g. "L0-1001", "L1-0001"
  level: string;       // "L0", "L1", "L2", "L3", "L4", "L5"
  trad: string;        // Traditional Chinese (e.g. "我", "你/妳")
  simp: string;        // Simplified Chinese
  pinyin: string;      // Hanyu Pinyin with tone marks (e.g. "wǒ", "nǐ")
  pos: string;         // Part of Speech ("N", "V", "Vp", "Adj", etc.)
  meaning: string;     // Definition and Taiwan contextual usage notes
  variants: string;    // Alternative forms
  audio: string;       // MP3 filename (e.g. "tocfl-tts-我.mp3")
}

export interface LevelSummary {
  level: string;
  band: string;
  titleZh: string;
  titleEn: string;
  cefr: string;
  wordCount: number;
  cumulativeCount: number;
  studyHoursAbroad: string;
}

export type WordLearningState = "new" | "learning" | "mastered";

export interface WordProgress {
  wordId: string;
  level: string;
  state: WordLearningState;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewedAt: string; // ISO date
  nextReviewAt: string;   // ISO date
}

export interface QuizQuestion {
  id: string;
  type: "hanzi-to-meaning" | "meaning-to-hanzi" | "audio-to-hanzi";
  prompt: string;
  audio?: string;
  pinyin?: string;
  correctAnswer: string;
  options: string[];
  word: VocabWord;
}

export interface QuizResultRecord {
  id?: number;
  level: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  mode: string;
}

export interface UserProfile {
  name: string;
  avatarSeed: string;
  autoPlayAudio: boolean;
  activeLevel: string;
}
