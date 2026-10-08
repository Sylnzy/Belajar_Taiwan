"use client";

import { useEffect, useState } from "react";
import { LevelSummary } from "../types/vocab";
import { LevelCard } from "./LevelCard";
import { BookMarked, Sparkles } from "lucide-react";

interface DashboardProps {
  levels: LevelSummary[];
}

export function Dashboard({ levels }: DashboardProps) {
  const totalWords = levels.reduce((acc, curr) => acc + curr.wordCount, 0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950 p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Standar Resmi SC-TOP Taiwan 2023
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-cjk">
            Kuasai 7.517 Kosakata Mandarin Taiwan
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Belajar aksara Hanzi Tradisional (繁體中文), lafal pinyin autentik, dan rekaman audio asli per kata sesuai kurikulum resmi TOCFL. Pilih level target di bawah untuk mulai.
          </p>
        </div>

        {/* Global badge */}
        <div className="mt-6 pt-6 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <div>
            Total Kata: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalWords.toLocaleString()}</span>
          </div>
          <div>•</div>
          <div>
            Tingkatan: <span className="font-semibold text-zinc-900 dark:text-zinc-100">6 Level (L0 - L5)</span>
          </div>
          <div>•</div>
          <div>
            Audio Asli: <span className="font-semibold text-emerald-600 dark:text-emerald-400">7.133 Audio</span>
          </div>
        </div>
      </div>

      {/* Level Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-emerald-600" />
            Tingkatan TOCFL
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Pilih level untuk belajar kata, flashcard & kuis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {levels.map((lvl) => (
            <LevelCard key={lvl.level} level={lvl} />
          ))}
        </div>
      </div>
    </div>
  );
}
