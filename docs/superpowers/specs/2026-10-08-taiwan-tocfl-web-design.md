# Taiwan TOCFL 2023 Vocabulary Learning Web Application Specification

## 1. Overview and Goals
- **Objective**: Build a responsive, fast, free-to-host web application deployed on Vercel for learning Taiwanese Mandarin vocabulary aligned with official SC-TOP TOCFL 2023 standards.
- **Source Data**: `Taiwan_TOCFL_2023_wordlist_with_audio_Traditional.apkg` containing 7,517 vocabulary entries across 6 levels (L0 to L5) with 7,133 native audio files.
- **Target Audience**: Students preparing for TOCFL exams, working, or studying abroad in Taiwan.
- **Core Value**: Direct mastery of Taiwanese Traditional Chinese characters (繁體中文), Zhuyin/Pinyin phonetic support, official POS, and pronunciation audio.

## 2. Dataset and Level Standards

Data directly mirrors SC-TOP's official Huayu 8,000 Word List (華語八千詞):

| Band TOCFL | Level | CEFR Equivalence | New Words | Cumulative Words | Suggested Study Hours |
|---|---|---|---|---|---|
| Novice (準備級) | L0 | Pre-A1 | 394 | 394 | 60 - 240 |
| Band A (入門級) | L1 | A1 | 347 | 741 | 240 - 480 |
| Band A (基礎級) | L2 | A2 | 485 | 1,226 | 480 - 720 |
| Band B (進階級) | L3 | B1 | 1,173 | 2,399 | 720 - 960 |
| Band B (高階級) | L4 | B2 | 2,342 | 4,741 | 960 - 1,920 |
| Band C (流利級) | L5 | C1 | 2,776 | 7,517 | 1,920 - 3,840 |

### Data Fields Schema
```ts
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
```

## 3. Technology Stack and Architecture

- **Framework**: Next.js 14/15 (App Router, Static Export compatible).
- **Language**: TypeScript (strict type checking).
- **Styling**: Tailwind CSS v4, custom utility tokens for CJK typography.
- **Icons**: Phosphor Icons (`@phosphor-icons/react`) or Lucide React.
- **Animation**: `motion/react` for card flip, sheet slide, and smooth tab switching.
- **Client Storage**: Dexie.js (IndexedDB wrapper) with localStorage fallback for profile state.
- **Audio Delivery**: Static audio assets served via `public/audio/` (optimized naming).
- **Deployment**: Vercel (static site output or serverless).

## 4. User Experience and Core Features

### 4.1 Simple Profile and Auth (Option A)
- **Zero-Barrier Login**: User enters a display name (e.g., "Maul"). Stored in `localStorage` under `tocfl_user_profile`.
- **Avatar Selection**: Minimalist avatar selection or initials badge.
- **Data Persistence**: All learning sessions, flashcard intervals, and quiz scores persist in browser IndexedDB.
- **Data Export and Import**: One-click "Export Progress" (downloads `.json` backup) and "Import Progress" to restore on another device.

### 4.2 Dashboard and Level Selector
- Visual cards for all 6 TOCFL levels (L0 to L5) displaying:
  - Band and Level name in Traditional Chinese and English.
  - Word count and CEFR level badge.
  - User mastery progress bar: `Mastered`, `Learning`, `New`.
  - Quick action buttons: "Kamus / Word List", "Flashcard SRS", "Kuis".
- Global progress indicator: Total words mastered out of 7,517.

### 4.3 Word Explorer (Kamus Kata)
- Paginated or virtualized list per level with smooth infinite scrolling.
- Instant search filter by:
  - Hanzi (Traditional / Simplified)
  - Pinyin (tone numbers or accented letters)
  - Meaning in English / Indonesian
  - Part of Speech filter dropdown (`All`, `Noun (N)`, `Verb (V/Vp/Vst)`, `Adjective`, etc.).
- Audio button on every entry with click feedback and keyboard shortcuts.
- Detail drawer / modal: Full definition, Taiwan vs Mainland usage differences, variants, audio repetition.

### 4.4 Spaced Repetition Flashcard System (SRS)
- Algorithm: Modified SM-2 / Leitner lightweight spaced repetition.
  - `Again` (1 min / reset interval)
  - `Good` (+1 day interval progression)
  - `Easy` (+3-4 day interval progression)
- Card states:
  - Front: Large Traditional Hanzi character + Audio play trigger.
  - Back: Audio auto-play + Pinyin + POS + Full Meaning + Example usage.
- Keyboard shortcuts: `Space` (flip card / replay audio), `1` (Again), `2` (Good), `3` (Easy).

### 4.5 TOCFL Quiz Mode
- Quick 10-question or 20-question challenge per level.
- Question modes:
  - Hanzi to Meaning: Show Hanzi + audio, choose 1 of 4 meanings.
  - Meaning to Hanzi: Show meaning + Pinyin, choose 1 of 4 Traditional Hanzi.
  - Listening Challenge: Play audio only, choose correct Hanzi.
- Result summary: Score, accuracy percentage, review wrong answers, save to quiz history.

## 5. Visual Design and Aesthetics (Impeccable and Anti-Slop Discipline)

- **Design Read**: Taiwan Clean Study Tool for language learners, restrained editorial language, Emerald accent, dual-theme support.
- **Theme Lock**: Off-white background (`#fcfcfc` / `zinc-50`) in light mode; Off-black background (`#09090b` / `zinc-950`) in dark mode.
- **Accent Color**: Locked to Emerald (`#059669` / `emerald-600`) across all interactive states.
- **Typography**:
  - Chinese text: `"PingFang TC"`, `"Microsoft JhengHei"`, `"Noto Sans TC"`, `sans-serif` for traditional glyph fidelity.
  - Interface Latin text: `Geist` or `system-ui`.
  - Statistics and counts: `font-mono` (`Geist Mono`).
- **Layout Restraint**:
  - No generic centered hero with AI purple gradient.
  - Clean top bar with sticky position and glass blur effect.
  - Clean bento cards with consistent 16px corner radius and 1px border.
  - Strict zero em-dash policy across UI strings.

## 6. Implementation Stages

1. **Data Pipeline**:
   - Python script `scripts/extract_apkg.py` extracts `.apkg` into clean JSON files in `public/data/` and audio files into `public/audio/`.
2. **Project Setup**:
   - Initialize Next.js project with Tailwind CSS, TypeScript, and Dexie.js.
3. **Core Database and Storage Layer**:
   - Dexie IndexedDB schemas: `progress` table, `quiz_history` table.
4. **UI Components & Pages**:
   - `Header` & `ProfileModal`: Simple user profile, export/import.
   - `LevelCard` & `LevelGrid`: Level selector with mastery gauges.
   - `WordExplorer`: Search, filter, audio player, virtualized list.
   - `FlashcardSRS`: Interactive card flip with SM-2 intervals.
   - `QuizEngine`: Multiple choice exam simulator.
5. **Vercel Readiness**:
   - Static builds verified, audio files properly mapped, error boundaries in place.
