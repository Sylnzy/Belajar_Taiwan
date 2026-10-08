"use client";

import { VocabWord } from "../types/vocab";
import { AudioPlayerButton } from "./AudioPlayerButton";
import { RotateCw, Volume2 } from "lucide-react";

interface FlipCardProps {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ word, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div
      onClick={onFlip}
      className="relative w-full max-w-md h-80 sm:h-96 cursor-pointer select-none perspective-[1000px] mx-auto"
    >
      <div
        className={`w-full h-full relative duration-500 rounded-3xl transition-transform [transform-style:preserve-3d] shadow-lg ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex flex-col justify-between items-center text-center [backface-visibility:hidden]">
          <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
              {word.level}
            </span>
            <span>{word.id}</span>
          </div>

          {/* Large Character */}
          <div className="my-auto">
            <div className="text-6xl sm:text-7xl font-bold font-cjk text-zinc-900 dark:text-zinc-50 tracking-wide">
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
        <div className="absolute inset-0 w-full h-full rounded-3xl border border-emerald-500/40 dark:border-emerald-600/40 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-cjk text-zinc-900 dark:text-zinc-100">
                {word.trad}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {word.pinyin}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {word.pos}
            </span>
          </div>

          {/* Meaning body */}
          <div className="my-auto overflow-y-auto max-h-44 py-2">
            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Arti & Definisi:
            </h4>
            <div
              className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: word.meaning }}
            />

            {word.simp && word.simp !== word.trad && (
              <div className="mt-3 text-xs text-zinc-500 font-cjk">
                Simplified: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{word.simp}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
            <AudioPlayerButton audioFile={word.audio} size="sm" />
            <span className="text-xs text-zinc-400">Pilih respon di bawah:</span>
          </div>
        </div>
      </div>
    </div>
  );
}
