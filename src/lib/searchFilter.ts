import { VocabWord } from "../types/vocab";

function normalizePinyin(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterWords(
  words: VocabWord[],
  query: string,
  posFilter: string = "ALL"
): VocabWord[] {
  const cleanQ = query.trim().toLowerCase();
  const normalizedQ = normalizePinyin(cleanQ);

  return words.filter((w) => {
    // POS filter
    if (posFilter !== "ALL") {
      const posParts = w.pos.split("/").map((p) => p.trim());
      if (!posParts.includes(posFilter) && w.pos !== posFilter) {
        return false;
      }
    }

    if (!cleanQ) return true;

    // 1. Hanzi match
    if (w.trad.includes(cleanQ) || w.simp.includes(cleanQ)) return true;

    // 2. Meaning match
    if (w.meaning.toLowerCase().includes(cleanQ)) return true;

    // 3. Pinyin match (raw and tone-stripped)
    const rawPinyin = w.pinyin.toLowerCase();
    const strippedPinyin = normalizePinyin(w.pinyin);

    if (rawPinyin.includes(cleanQ) || strippedPinyin.includes(normalizedQ)) {
      return true;
    }

    return false;
  });
}
