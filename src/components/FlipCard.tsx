"use client";

import { VocabWord } from "../types/vocab";
import { AudioPlayerButton } from "./AudioPlayerButton";
import { formatMeaning } from "../lib/meaningFormatter";
import { RotateCw, Volume2 } from "lucide-react";

interface FlipCardProps {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
}

function getCharacterSize(trad: string): string {
  const len = trad.length;
  if (len <= 1) return "text-6xl sm:text-7xl";
  if (len <= 2) return "text-5xl sm:text-6xl";
  if (len <= 4) return "text-3xl sm:text-4xl";
  return "text-2xl sm:text-3xl";
}

export function FlipCard({ word, isFlipped, onFlip }: FlipCardProps) {
  const formatted = formatMeaning(word.meaning);

  return (
    <div
      onClick={onFlip}
      className="relative w-full max-w-md h-[440px] sm:h-[480px] cursor-pointer select-none perspective-[1000px] mx-auto"
    >
      <div
        className={`w-full h-full relative duration-500 rounded-3xl transition-transform [transform-style:preserve-3d] shadow-lg ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between items-center text-center [backface-visibility:hidden] shadow-xl">
          <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
              {word.level}
            </span>
            <span>{word.id}</span>
          </div>

          {/* Large Character with dynamic text scaling */}
          <div className="my-auto px-2">
            <div
              className={`font-bold font-cjk text-zinc-900 dark:text-zinc-50 tracking-wide break-words leading-tight ${getCharacterSize(
                word.trad
              )}`}
            >
              {word.trad}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <AudioPlayerButton audioFile={word.audio} size="lg" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Klik kartu atau tekan Spasi untuk membalik</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl glass-panel p-5 sm:p-7 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-zinc-200/60 dark:border-zinc-800 pb-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl font-bold font-cjk text-zinc-900 dark:text-zinc-100 truncate">
                {word.trad}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                {word.pinyin}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
              {word.pos}
            </span>
          </div>

          {/* Meaning body with generous scrollable area and separated Arti vs Definisi */}
          <div className="my-auto overflow-y-auto max-h-[290px] py-2 space-y-3.5 pr-1">
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
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
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
                      className="p-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1"
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

            {word.simp && word.simp !== word.trad && (
              <div className="text-[11px] text-zinc-500 font-cjk pt-1">
                Aksara Simplified: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{word.simp}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 dark:border-zinc-800 shrink-0">
            <AudioPlayerButton audioFile={word.audio} size="sm" />
            <span className="text-xs text-zinc-400">Pilih respon di bawah:</span>
          </div>
        </div>
      </div>
    </div>
  );
}
