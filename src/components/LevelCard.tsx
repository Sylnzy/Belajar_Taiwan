"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelSummary } from "../types/vocab";
import { getLevelProgressStats, LevelProgressStats } from "../lib/dataLoader";
import { BookOpen, Layers, Award, ArrowRight } from "lucide-react";

interface LevelCardProps {
  level: LevelSummary;
}

export function LevelCard({ level }: LevelCardProps) {
  const [stats, setStats] = useState<LevelProgressStats>({
    mastered: 0,
    learning: 0,
    total: level.wordCount,
    percentage: 0,
  });

  useEffect(() => {
    getLevelProgressStats(level.level, level.wordCount).then(setStats);
  }, [level.level, level.wordCount]);

  return (
    <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-emerald-500/60 transition shadow-sm hover:shadow-md">
      {/* Header card */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-cjk text-zinc-900 dark:text-zinc-100">
              {level.titleZh}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
              {level.level}
            </span>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {level.cefr}
          </span>
        </div>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {level.band} ({level.titleEn}) · Estimasi studi: {level.studyHoursAbroad} jam
        </p>

        {/* Word count stats */}
        <div className="mt-4 flex items-baseline justify-between text-xs">
          <span className="text-zinc-600 dark:text-zinc-400">
            Kata level ini: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{level.wordCount}</strong>
          </span>
          <span className="text-zinc-500 font-mono text-[11px]">
            Kumulatif: {level.cumulativeCount}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
          <div
            style={{ width: `${stats.percentage}%` }}
            className="h-full bg-emerald-600 transition-all duration-500"
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>{stats.mastered} dikuasai ({stats.percentage}%)</span>
          <span>{stats.learning} dipelajari</span>
        </div>
      </div>

      {/* Action links */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-3 gap-2">
        <Link
          href={`/level/${level.level.toLowerCase()}/words`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-zinc-50 dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200/60 dark:border-zinc-800 transition text-zinc-700 dark:text-zinc-300 group"
        >
          <BookOpen className="w-4 h-4 mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-medium">Kamus</span>
        </Link>

        <Link
          href={`/level/${level.level.toLowerCase()}/flashcards`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-zinc-50 dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200/60 dark:border-zinc-800 transition text-zinc-700 dark:text-zinc-300 group"
        >
          <Layers className="w-4 h-4 mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-medium">Flashcard</span>
        </Link>

        <Link
          href={`/level/${level.level.toLowerCase()}/quiz`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm group"
        >
          <Award className="w-4 h-4 mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-medium">Kuis</span>
        </Link>
      </div>
    </div>
  );
}
