"use client";

import { VocabWord } from "../types/vocab";
import { AudioPlayerButton } from "./AudioPlayerButton";
import { formatMeaning } from "../lib/meaningFormatter";
import { X, BookOpen, BookmarkCheck } from "lucide-react";

interface WordDetailModalProps {
  word: VocabWord | null;
  onClose: () => void;
  isMastered?: boolean;
  onToggleMastered?: (wordId: string) => void;
}

function getCharacterSize(trad: string): string {
  const len = trad.length;
  if (len <= 1) return "text-5xl sm:text-6xl";
  if (len <= 2) return "text-4xl sm:text-5xl";
  if (len <= 4) return "text-3xl sm:text-4xl";
  return "text-2xl sm:text-3xl";
}

export function WordDetailModal({
  word,
  onClose,
  isMastered = false,
  onToggleMastered,
}: WordDetailModalProps) {
  if (!word) return null;

  const formatted = formatMeaning(word.meaning);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl transition-all">
        {/* Top header */}
        <div className="flex items-start justify-between shrink-0">
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
        <div className="mt-4 text-center p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 shrink-0">
          <div
            className={`font-bold font-cjk text-zinc-900 dark:text-zinc-50 tracking-wider break-words ${getCharacterSize(
              word.trad
            )}`}
          >
            {word.trad}
          </div>
          <div className="mt-2 text-lg font-medium text-emerald-600 dark:text-emerald-400 font-mono">
            {word.pinyin}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <AudioPlayerButton audioFile={word.audio} size="md" />
            <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
              POS: {word.pos}
            </span>
          </div>
        </div>

        {/* Info Grid with Scrollable Content */}
        <div className="mt-4 space-y-3.5 overflow-y-auto pr-1 flex-1">
          {/* 1. SEKSI ARTI (Terjemahan Utama) */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                Arti
              </span>
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Terjemahan Utama
              </span>
            </div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60">
              {formatted.primaryMeaning}
            </div>
          </div>

          {/* 2. SEKSI DEFINISI & CATATAN KONTEKS */}
          {formatted.sections.length > 1 || formatted.hasNotes ? (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Definisi & Konteks
                </span>
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Varian & Catatan Taiwan
                </span>
              </div>
              <div className="space-y-2">
                {formatted.sections.map((sec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1"
                  >
                    {sec.char && (
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span className="font-cjk text-sm">{sec.char}</span>
                        {sec.pinyin && (
                          <span className="text-emerald-600 font-mono text-[11px]">
                            [{sec.pinyin}]
                          </span>
                        )}
                      </div>
                    )}
                    <p className="leading-relaxed">{sec.meaning}</p>
                    {sec.notes.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {sec.notes.map((n, ni) => (
                          <span
                            key={ni}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="text-zinc-400 block mb-0.5">Tradisional (Taiwan)</span>
              <span className="font-semibold text-sm font-cjk text-zinc-900 dark:text-zinc-100">
                {word.trad}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="text-zinc-400 block mb-0.5">Simplified (Daratan)</span>
              <span className="font-semibold text-sm font-cjk text-zinc-900 dark:text-zinc-100">
                {word.simp}
              </span>
            </div>
          </div>

          {word.variants && (
            <div className="text-xs text-zinc-500 pt-1">
              <span className="font-medium text-zinc-400">Varian: </span>
              {word.variants}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
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
