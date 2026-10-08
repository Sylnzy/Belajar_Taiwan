import { VocabWord, QuizQuestion } from "../types/vocab";

function cleanMeaning(str: string): string {
  const plain = str.replace(/<[^>]*>?/gm, "").trim();
  // Return first chunk if multiple definitions
  const parts = plain.split("/");
  return parts[0].trim();
}

export function generateQuiz(
  words: VocabWord[],
  questionCount: number = 10
): QuizQuestion[] {
  if (words.length < 4) return [];

  // Shuffle candidate words
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  const selectedTargets = shuffled.slice(0, Math.min(questionCount, words.length));

  const questionTypes: QuizQuestion["type"][] = [
    "hanzi-to-meaning",
    "meaning-to-hanzi",
    "audio-to-hanzi",
  ];

  return selectedTargets.map((target, idx) => {
    // Pick question type
    // If target has audio, allow audio-to-hanzi, otherwise only hanzi/meaning
    const availableTypes: QuizQuestion["type"][] = target.audio
      ? questionTypes
      : ["hanzi-to-meaning", "meaning-to-hanzi"];
    const type = availableTypes[idx % availableTypes.length];

    // Pick 3 distractors distinct from target
    const distractors: VocabWord[] = [];
    const pool = words.filter((w) => w.id !== target.id);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

    for (const d of shuffledPool) {
      if (distractors.length >= 3) break;
      if (type === "hanzi-to-meaning") {
        const dMeaning = cleanMeaning(d.meaning);
        const tMeaning = cleanMeaning(target.meaning);
        if (dMeaning !== tMeaning && !distractors.some((x) => cleanMeaning(x.meaning) === dMeaning)) {
          distractors.push(d);
        }
      } else {
        if (d.trad !== target.trad && !distractors.some((x) => x.trad === d.trad)) {
          distractors.push(d);
        }
      }
    }

    // Fallback if strict unique distractors couldn't be satisfied
    while (distractors.length < 3) {
      const fallback = pool[distractors.length];
      if (fallback) distractors.push(fallback);
      else break;
    }

    let correctAnswer = "";
    let options: string[] = [];

    if (type === "hanzi-to-meaning") {
      correctAnswer = cleanMeaning(target.meaning);
      options = [correctAnswer, ...distractors.map((d) => cleanMeaning(d.meaning))];
    } else {
      // meaning-to-hanzi or audio-to-hanzi
      correctAnswer = target.trad;
      options = [correctAnswer, ...distractors.map((d) => d.trad)];
    }

    // Shuffle options
    options = options.sort(() => 0.5 - Math.random());

    let prompt = "";
    if (type === "hanzi-to-meaning") {
      prompt = `Apa arti dari karakter "${target.trad}"?`;
    } else if (type === "meaning-to-hanzi") {
      prompt = `Karakter Hanzi untuk "${cleanMeaning(target.meaning)}" (${target.pinyin}):`;
    } else {
      prompt = `Dengarkan audio, pilih karakter yang tepat:`;
    }

    return {
      id: `q-${idx + 1}-${target.id}`,
      type,
      prompt,
      audio: target.audio,
      pinyin: target.pinyin,
      correctAnswer,
      options,
      word: target,
    };
  });
}
