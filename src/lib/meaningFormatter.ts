export interface MeaningSection {
  char?: string;
  pinyin?: string;
  meaning: string;
  notes: string[];
}

export interface FormattedMeaning {
  primaryMeaning: string;
  sections: MeaningSection[];
  hasNotes: boolean;
}

export function formatMeaning(rawMeaning: string): FormattedMeaning {
  if (!rawMeaning) {
    return { primaryMeaning: "", sections: [], hasNotes: false };
  }

  // Split lines by <br> or newline
  const lines = rawMeaning
    .split(/<br\s*\/?>|\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const sections: MeaningSection[] = [];
  let hasNotes = false;

  for (const line of lines) {
    // Check if line starts with Char [pinyin]
    const charMatch = line.match(/^([^\s\[\]]+)\s*\[([^\]]+)\]\s*(.*)$/);
    let char: string | undefined = undefined;
    let pinyin: string | undefined = undefined;
    let content = line;

    if (charMatch) {
      char = charMatch[1];
      pinyin = charMatch[2];
      content = charMatch[3];
    }

    // Extract notes in parentheses that contain contextual indicators
    const notes: string[] = [];
    const notePattern = /\((?:Note|CL|bound|literary|informal|courteous|also|variant|used|coll)[^)]*\)/gi;

    let match: RegExpExecArray | null;
    while ((match = notePattern.exec(content)) !== null) {
      notes.push(match[0].slice(1, -1).trim());
    }

    if (notes.length > 0) {
      hasNotes = true;
    }

    // Cleaned gloss
    const cleanGloss = content
      .replace(notePattern, "")
      .replace(/\/\s*\//g, "/")
      .trim()
      .replace(/^[;/ ]+|[;/ ]+$/g, "");

    sections.push({
      char,
      pinyin,
      meaning: cleanGloss || content,
      notes,
    });
  }

  // Primary meaning is the first clean meaning section
  const primaryMeaning = sections.length > 0 ? sections[0].meaning : rawMeaning;

  return {
    primaryMeaning,
    sections,
    hasNotes,
  };
}
