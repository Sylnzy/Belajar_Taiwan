# Taiwan TOCFL 2023 Vocabulary Learning Web Application Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a performant, responsive web application deployed to Vercel for learning Taiwanese Mandarin vocabulary across all 6 official SC-TOP TOCFL levels (7,517 words) with 7,133 native audio clips, flashcards, quizzes, and local profile storage.

**Architecture:** Next.js App Router with TypeScript, Tailwind CSS, and Dexie.js (IndexedDB). Static data modularized into JSON chunks per TOCFL level with native audio served statically. Zero backend costs, full offline-capable persistence.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Dexie.js, Vitest, `@phosphor-icons/react` or `lucide-react`, `motion/react`.

**Spec:** `docs/superpowers/specs/2026-10-08-taiwan-tocfl-web-design.md`

## Global Constraints

- No em-dash characters (`—` or `–`) in user-facing UI copy or markdown docs.
- Single accent color locked to Emerald (`#059669`).
- Dual-mode support (Light and Dark) with seamless contrast (WCAG AA).
- Proper Traditional Chinese CJK font fallbacks (`PingFang TC`, `Microsoft JhengHei`, `Noto Sans TC`).
- Fully typed data schemas matching the official SC-TOP 2023 dataset.

## Review Focus

1. Missing audio handling: Some words might have missing audio files; player must gracefully disable or fall back without throwing errors.
2. Large list performance: Level 4 (2,342 words) and Level 5 (2,776 words) must render smoothly without UI lag or memory blowup.
3. Mobile viewport stability: Flashcard and Quiz layouts must fit `min-h-[100dvh]` without jumping on mobile browsers.
4. IndexedDB storage quota or privacy mode: Handle quota errors or private browsing gracefully with in-memory or localStorage fallback.
5. Audio playback autoplay policy: Modern browsers block autoplay without user interaction; audio must trigger on explicit gesture or fail silently.

---

### Task 1: Data Extraction Pipeline (`.apkg` to JSON and Audio)

**Files:**
- Create: `scripts/extract_apkg.py`
- Create: `public/data/tocfl-summary.json`
- Create: `public/data/tocfl-l0.json` ... `public/data/tocfl-l5.json`
- Create: `public/audio/` (extracted mp3 files)
- Test: `scripts/test_extracted_data.py`

**Interfaces:**
- Produces: `VocabWord[]` in JSON files matching the spec interface, plus `LevelSummary[]` in `tocfl-summary.json`.

- [ ] **Step 1: Write test script to verify extracted JSON integrity and level counts**

```python
# scripts/test_extracted_data.py
import json, os

def test_data():
    summary_path = "public/data/tocfl-summary.json"
    assert os.path.exists(summary_path), "summary missing"
    with open(summary_path, "r", encoding="utf-8") as f:
        summary = json.load(f)
    assert len(summary) == 6, f"Expected 6 levels, got {len(summary)}"
    
    expected_counts = {"L0": 394, "L1": 347, "L2": 485, "L3": 1173, "L4": 2342, "L5": 2776}
    total_words = 0
    for lvl, count in expected_counts.items():
        lvl_file = f"public/data/tocfl-{lvl.lower()}.json"
        assert os.path.exists(lvl_file), f"Missing {lvl_file}"
        with open(lvl_file, "r", encoding="utf-8") as f:
            words = json.load(f)
        assert len(words) == count, f"Level {lvl} expected {count}, got {len(words)}"
        total_words += len(words)
        assert words[0]["trad"], "Word must have trad character"
    assert total_words == 7517, f"Total expected 7517, got {total_words}"
    print("ALL DATA TESTS PASSED!")

if __name__ == "__main__":
    test_data()
```

- [ ] **Step 2: Run test to verify it fails before extraction**

Run: `python scripts/test_extracted_data.py`
Expected: FAIL with `AssertionError: summary missing`

- [ ] **Step 3: Implement extraction script `scripts/extract_apkg.py`**

Extract `collection.anki21` and `media` mapping from `Taiwan_TOCFL_2023_wordlist_with_audio_Traditional.apkg`.
Save vocabulary to `public/data/tocfl-l{0..5}.json` and MP3 audio files to `public/audio/`.

- [ ] **Step 4: Execute extraction and verify test passes**

Run: `python scripts/extract_apkg.py && python scripts/test_extracted_data.py`
Expected: PASS with "ALL DATA TESTS PASSED!"

- [ ] **Step 5: Commit**

```bash
git add scripts/ public/data/
git commit -m "feat(data): extract TOCFL 2023 vocabulary and audio from apkg"
```

---

### Task 2: Project Setup and Base Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts` or `app/globals.css`
- Create: `vitest.config.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: Working Next.js project with TypeScript, Tailwind CSS, and Vitest test runner.

- [ ] **Step 1: Configure `.gitignore` and initialize Next.js dependencies**

Ensure `node_modules`, `.next`, `public/audio/*.mp3` (or keep audio tracked/untracked based on git size) are handled cleanly.

- [ ] **Step 2: Install dependencies**

Run: `npm install next react react-dom dexie lucide-react clsx tailwindmerge motion`
Dev: `npm install -D typescript @types/react @types/node @types/react-dom tailwindcss postcss autoprefixer vitest @vitejs/plugin-react jsdom @testing-library/react`

- [ ] **Step 3: Create base Next.js layout and test runner verification**

Write sample unit test in `src/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("smoke test", () => {
  it("runs correctly", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run test to verify test harness**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts app/ src/
git commit -m "chore: setup Next.js project with Tailwind CSS and Vitest"
```

---

### Task 3: Data Layer and IndexedDB Storage (Dexie.js)

**Files:**
- Create: `src/types/vocab.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/srs.ts`
- Test: `src/__tests__/db.test.ts`
- Test: `src/__tests__/srs.test.ts`

**Interfaces:**
- Produces:
  - `VocabWord`, `LevelSummary`, `WordProgress`, `QuizResult` types.
  - `db`: Dexie database instance with `progress` and `quizHistory` tables.
  - `calculateNextReview(currentInterval: number, quality: 'again' | 'good' | 'easy'): { nextInterval: number, dueDate: Date }`.
  - `exportUserData(): Promise<string>` and `importUserData(jsonStr: string): Promise<boolean>`.

- [ ] **Step 1: Write unit tests for SRS algorithm and DB export/import**

In `src/__tests__/srs.test.ts`:
- Test that 'again' resets interval to 0.
- Test that 'good' progresses interval (e.g. 1 -> 3 -> 7 days).
- Test that 'easy' gives higher interval bonus.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/srs.test.ts`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement `src/types/vocab.ts`, `src/lib/srs.ts`, and `src/lib/db.ts`**

Implement SM-2 interval calculations and Dexie table declarations.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/srs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/ src/lib/ src/__tests__/
git commit -m "feat(storage): implement IndexedDB and SM-2 spaced repetition logic"
```

---

### Task 4: Layout, Top Navigation, and Profile Auth

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/ProfileModal.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/hooks/useProfile.ts`
- Test: `src/__tests__/profile.test.ts`

**Interfaces:**
- Produces:
  - `useProfile()` hook managing user name, avatar, audio auto-play preferences.
  - Responsive header displaying app logo ("臺灣TOCFL 2023"), active level indicator, profile badge, and theme switcher.

- [ ] **Step 1: Write test for profile hook and storage**

Test profile name initialization, updating, and persistence in `localStorage`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/profile.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `Header.tsx`, `ProfileModal.tsx`, and `useProfile.ts`**

Adhere to Impeccable guidelines: clean CJK typography, Emerald accent, no em-dash, responsive layout.

- [ ] **Step 4: Run tests and verify components render**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/hooks/
git commit -m "feat(ui): add responsive header, theme toggle, and profile modal"
```

---

### Task 5: Level Selector Dashboard

**Files:**
- Create: `src/components/LevelCard.tsx`
- Create: `src/components/Dashboard.tsx`
- Create: `src/lib/dataLoader.ts`
- Modify: `app/page.tsx`
- Test: `src/__tests__/dashboard.test.ts`

**Interfaces:**
- Produces:
  - `loadLevelSummary(): Promise<LevelSummary[]>`
  - Dashboard displaying 6 level cards (L0 to L5) with mastery progress bar, total words, CEFR rating, and navigation to Word List, Flashcards, or Quiz.

- [ ] **Step 1: Write test for `dataLoader.ts` and LevelCard stats calculation**

Test that level metadata correctly loads and progress calculation aggregates mastered/learning/new words.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/dashboard.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `LevelCard.tsx` and `Dashboard.tsx`**

Style with Bento-inspired subtle elevation, clear hierarchy, Taiwan Emerald progress bars, and zero AI slop.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/dashboard.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/LevelCard.tsx src/components/Dashboard.tsx src/lib/dataLoader.ts app/page.tsx
git commit -m "feat(ui): implement TOCFL level selector dashboard"
```

---

### Task 6: Word Explorer and Audio Player

**Files:**
- Create: `src/components/WordExplorer.tsx`
- Create: `src/components/WordCard.tsx`
- Create: `src/components/AudioPlayerButton.tsx`
- Create: `src/components/WordDetailModal.tsx`
- Modify: `app/level/[id]/words/page.tsx`
- Test: `src/__tests__/wordExplorer.test.ts`

**Interfaces:**
- Produces:
  - Instant search across Hanzi, Pinyin, and English meanings.
  - POS tag filtering.
  - Audio playback with visual pulse feedback and graceful error fallback.
  - Detail modal with full Taiwan vs Mainland usage notes.

- [ ] **Step 1: Write test for word search and filter logic**

Test filtering by Chinese character, pinyin without tones, and POS category.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/wordExplorer.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `WordExplorer.tsx`, `AudioPlayerButton.tsx`, and `WordDetailModal.tsx`**

Include pagination or virtual scroll to support smooth 2,000+ words navigation in L4 and L5.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/wordExplorer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/WordExplorer.tsx src/components/AudioPlayerButton.tsx app/level/
git commit -m "feat(vocab): add word explorer with instant search, POS filter, and audio"
```

---

### Task 7: Spaced Repetition (SRS) Flashcard Mode

**Files:**
- Create: `src/components/FlashcardSRS.tsx`
- Create: `src/components/FlipCard.tsx`
- Modify: `app/level/[id]/flashcards/page.tsx`
- Test: `src/__tests__/flashcard.test.ts`

**Interfaces:**
- Produces:
  - Interactive 3D flip card with Traditional Hanzi on front, audio + pinyin + meaning on back.
  - Response actions (`Again`, `Good`, `Easy`) recording updates to IndexedDB.
  - Keyboard shortcuts (`Space` to flip/replay, `1`/`2`/`3` to rate).

- [ ] **Step 1: Write test for flashcard session queue management**

Test that due cards are prioritized, and 'Again' cards loop back into the active review session.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/flashcard.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `FlashcardSRS.tsx` and `FlipCard.tsx`**

Integrate `motion/react` card flip animations and keyboard accessibility.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/flashcard.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/FlashcardSRS.tsx src/components/FlipCard.tsx app/level/
git commit -m "feat(srs): implement interactive 3D flashcard spaced repetition mode"
```

---

### Task 8: TOCFL Practice Quiz Engine

**Files:**
- Create: `src/components/QuizEngine.tsx`
- Create: `src/components/QuizResults.tsx`
- Create: `src/lib/quizGenerator.ts`
- Modify: `app/level/[id]/quiz/page.tsx`
- Test: `src/__tests__/quiz.test.ts`

**Interfaces:**
- Produces:
  - `generateQuiz(words: VocabWord[], questionCount: number): QuizQuestion[]`
  - Modes: Hanzi-to-Meaning, Meaning-to-Hanzi, and Listening (Audio-to-Hanzi).
  - Score summary, accuracy calculation, and wrong answers review.

- [ ] **Step 1: Write test for quiz generation logic**

Test that questions have exactly 1 correct answer and 3 random distinct distractors from the same level.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/quiz.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `quizGenerator.ts`, `QuizEngine.tsx`, and `QuizResults.tsx`**

Provide clean countdown/timer, audio replay, option selection feedback, and score persistence.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/quiz.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/quizGenerator.ts src/components/QuizEngine.tsx app/level/
git commit -m "feat(quiz): implement TOCFL multiple-choice practice quiz engine"
```

---

### Task 9: Vercel Production Build and End-to-End Verification

**Files:**
- Modify: `next.config.mjs`
- Test: Full build command (`npm run build`)

**Interfaces:**
- Produces: Clean, zero-warning production build ready for 1-click deployment on Vercel.

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 2: Run production Next.js build**

Run: `npm run build`
Expected: Build succeeds with static pages generated without error.

- [ ] **Step 3: Verify Pre-Flight Design checklist**

Run checks: Zero em-dashes, consistent Emerald accent `#059669`, valid light/dark theme tokens, proper audio links.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify production build and deployment configuration"
```
