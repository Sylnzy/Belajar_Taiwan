"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelSummary } from "../types/vocab";
import { LevelCard } from "./LevelCard";
import { BookMarked, Sparkles, MapPin, Compass, ArrowRight } from "lucide-react";

interface DashboardProps {
  levels: LevelSummary[];
}

export function Dashboard({ levels }: DashboardProps) {
  const totalWords = levels.reduce((acc, curr) => acc + curr.wordCount, 0);

  return (
    <div className="space-y-10">
      {/* Asymmetric Split Hero Section with Real Taiwan Photography */}
      <div className="relative rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & Value Prop */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-cjk leading-tight">
              Kuasai 7.517 Kosakata Mandarin Taiwan
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Kurikulum resmi SC-TOP Taiwan 2023. Pelajari aksara Hanzi Tradisional (繁體中文), lafal pinyin autentik, dan 7.133 rekaman audio asli untuk persiapan studi atau bekerja di Taiwan.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/level/l0/flashcards"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm"
              >
                Mulai Belajar Level 0 (Novice)
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/level/l0/words"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
              >
                Buka Kamus Kosakata
              </Link>
            </div>

            {/* Global Stats bar */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <div>
                Total: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalWords.toLocaleString()} Kata</span>
              </div>
              <div>•</div>
              <div>
                Tingkat: <span className="font-semibold text-zinc-900 dark:text-zinc-100">L0 sampai L5</span>
              </div>
              <div>•</div>
              <div>
                Audio Asli: <span className="font-semibold text-emerald-600 dark:text-emerald-400">7.133 Audio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Authentic Taiwan Photo Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-md group">
              <img
                src="/images/taipei-101.jpg"
                alt="Taipei 101 Skyline"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92] dark:brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-black/40 backdrop-blur-md text-white border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>臺北 · Taipei 101</span>
              </div>

              {/* Bottom Quote & Subtitle */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-cjk text-base font-bold tracking-wide drop-shadow-sm">
                  千里之行，始於足下
                </div>
                <p className="text-[11px] text-white/80 font-sans mt-0.5 drop-shadow-sm">
                  Perjalanan ribuan mil selalu dimulai dari langkah pertama.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Pilih Tingkatan TOCFL
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Jelajahi kosakata dari tingkat pemula (Novice) hingga fasih (Band C)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((lvl) => (
            <LevelCard key={lvl.level} level={lvl} />
          ))}
        </div>
      </div>
    </div>
  );
}
