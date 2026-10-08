"use client";

import { VocabWord } from "../types/vocab";
import { AudioPlayerButton } from "./AudioPlayerButton";

interface WordCardProps {
  word: VocabWord;
  isMastered?: boolean;
  onSelect: (word: VocabWord) => void;
}

export function WordCard({ word, isMastered = false, onSelect }: WordCardProps) {
  return (
    <div
      onClick={() => onSelect(word)}
      className="group relative rounded-2xl glass-panel p-4 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <AudioPlayerButton audioFile={word.audio} size="sm" />

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-cjk text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              {word.trad}
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 font-mono">
              {word.pinyin}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
              {word.pos}
            </span>
          </div>
          <p
            className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5 max-w-[280px] sm:max-w-md"
            dangerouslySetInnerHTML={{ __html: word.meaning }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isMastered && (
          <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            Dikuasai
          </span>
        )}
      </div>
    </div>
  );
}
