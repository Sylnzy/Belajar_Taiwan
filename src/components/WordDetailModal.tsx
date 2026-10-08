"use client";

import { VocabWord } from "../types/vocab";
import { AudioPlayerButton } from "./AudioPlayerButton";
import { X, BookOpen, BookmarkCheck } from "lucide-react";

interface WordDetailModalProps {
  word: VocabWord | null;
  onClose: () => void;
  isMastered?: boolean;
  onToggleMastered?: (wordId: string) => void;
}

export function WordDetailModal({
  word,
  onClose,
  isMastered = false,
  onToggleMastered,
}: WordDetailModalProps) {
  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl transition-all">
        {/* Top header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
              {word.level}
            </span>
            <span>ID: {word.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character showcase */}
        <div className="mt-5 text-center p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70">
          <div className="text-5xl font-bold font-cjk text-zinc-900 dark:text-zinc-50 tracking-wider">
            {word.trad}
          </div>
          <div className="mt-2 text-xl font-medium text-emerald-600 dark:text-emerald-400">
            {word.pinyin}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <AudioPlayerButton audioFile={word.audio} size="lg" />
            <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
              POS: {word.pos}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Arti & Definisi
            </h4>
            <div
              className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: word.meaning }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="text-zinc-400 block mb-0.5">Tradisional (Taiwan)</span>
              <span className="font-semibold text-sm font-cjk text-zinc-900 dark:text-zinc-100">
                {word.trad}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="text-zinc-400 block mb-0.5">Simplified (Daratan)</span>
              <span className="font-semibold text-sm font-cjk text-zinc-900 dark:text-zinc-100">
                {word.simp}
              </span>
            </div>
          </div>

          {word.variants && (
            <div className="text-xs text-zinc-500">
              <span className="font-medium text-zinc-400">Varian: </span>
              {word.variants}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
          {onToggleMastered && (
            <button
              onClick={() => onToggleMastered(word.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition ${
                isMastered
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              {isMastered ? "Sudah Dikuasai" : "Tandai Dikuasai"}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
