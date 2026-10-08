"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelSummary } from "../types/vocab";
import { getLevelProgressStats, LevelProgressStats } from "../lib/dataLoader";
import { LEVEL_LANDMARKS } from "../lib/taiwanLandmarks";
import { BookOpen, Layers, Award, MapPin } from "lucide-react";

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

  const landmark = LEVEL_LANDMARKS[level.level] || {
    image: "/images/taipei-101.jpg",
    name: "Taiwan",
    zh: "臺灣",
    desc: "Pulau Formosa",
    location: "Taiwan",
  };

  useEffect(() => {
    getLevelProgressStats(level.level, level.wordCount).then(setStats);
  }, [level.level, level.wordCount]);

  return (
    <div className="group relative rounded-3xl glass-panel overflow-hidden flex flex-col justify-between hover:border-emerald-500/60 dark:hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
      {/* Photo Banner with Landmark info */}
      <div className="relative h-40 w-full overflow-hidden bg-zinc-900">
        <img
          src={landmark.image}
          alt={landmark.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.9] dark:brightness-[0.8]"
        />
        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Location pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/40 backdrop-blur-md text-white/90 border border-white/15">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{landmark.zh}</span>
        </div>

        {/* Level badge and Title on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-cjk text-white drop-shadow-sm">
                {level.titleZh}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md font-mono font-semibold bg-emerald-600 text-white shadow-sm">
                {level.level}
              </span>
            </div>
            <p className="text-[11px] text-white/80 font-medium drop-shadow-sm mt-0.5">
              {level.band} ({level.titleEn})
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-medium border border-white/20">
            {level.cefr}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Landmark subtitle quote */}
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic line-clamp-1">
            "{landmark.desc}"
          </p>

          {/* Word count stats */}
          <div className="mt-4 flex items-baseline justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">
              Kata Level Ini: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{level.wordCount}</strong>
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

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            <span>{stats.mastered} dikuasai ({stats.percentage}%)</span>
            <span>{stats.learning} dipelajari</span>
          </div>
        </div>

        {/* Action links */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-3 gap-2">
          <Link
            href={`/level/${level.level.toLowerCase()}/words`}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-zinc-50 dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200/60 dark:border-zinc-800 transition text-zinc-700 dark:text-zinc-300 group/btn"
          >
            <BookOpen className="w-4 h-4 mb-1 group-hover/btn:scale-110 transition" />
            <span className="text-[11px] font-medium">Kamus</span>
          </Link>

          <Link
            href={`/level/${level.level.toLowerCase()}/flashcards`}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-zinc-50 dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200/60 dark:border-zinc-800 transition text-zinc-700 dark:text-zinc-300 group/btn"
          >
            <Layers className="w-4 h-4 mb-1 group-hover/btn:scale-110 transition" />
            <span className="text-[11px] font-medium">Flashcard</span>
          </Link>

          <Link
            href={`/level/${level.level.toLowerCase()}/quiz`}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm group/btn"
          >
            <Award className="w-4 h-4 mb-1 group-hover/btn:scale-110 transition" />
            <span className="text-[11px] font-medium">Kuis</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
