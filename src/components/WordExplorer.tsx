"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { VocabWord, LevelSummary } from "../types/vocab";
import { filterWords } from "../lib/searchFilter";
import { LEVEL_LANDMARKS } from "../lib/taiwanLandmarks";
import { WordCard } from "./WordCard";
import { WordDetailModal } from "./WordDetailModal";
import { db } from "../lib/db";
import { Search, Filter, ArrowLeft, ChevronLeft, ChevronRight, BookOpen, MapPin } from "lucide-react";

interface WordExplorerProps {
  levelInfo: LevelSummary;
  initialWords: VocabWord[];
}

const POS_OPTIONS = [
  { label: "Semua POS", value: "ALL" },
  { label: "Nomina (N)", value: "N" },
  { label: "Verba (V)", value: "V" },
  { label: "Verba Aksi (Vp)", value: "Vp" },
  { label: "Verba Status (Vst)", value: "Vst" },
  { label: "Adjektiva (Adj)", value: "Adj" },
  { label: "Adverbia (Adv)", value: "Adv" },
  { label: "Partikel (Ptc)", value: "Ptc" },
  { label: "Konjungsi (Conj)", value: "Conj" },
];

const PAGE_SIZE = 40;

export function WordExplorer({ levelInfo, initialWords }: WordExplorerProps) {
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Load mastered state from IndexedDB
  useEffect(() => {
    db.progress
      .where("level")
      .equals(levelInfo.level)
      .toArray()
      .then((records) => {
        const set = new Set<string>();
        for (const r of records) {
          if (r.state === "mastered") set.add(r.wordId);
        }
        setMasteredIds(set);
      });
  }, [levelInfo.level]);

  // Toggle mastered
  const handleToggleMastered = async (wordId: string) => {
    const isNow = masteredIds.has(wordId);
    const nextSet = new Set(masteredIds);
    if (isNow) {
      nextSet.delete(wordId);
      await db.progress.put({
        wordId,
        level: levelInfo.level,
        state: "learning",
        repetitions: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date().toISOString(),
      });
    } else {
      nextSet.add(wordId);
      await db.progress.put({
        wordId,
        level: levelInfo.level,
        state: "mastered",
        repetitions: 3,
        intervalDays: 7,
        easeFactor: 2.5,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date().toISOString(),
      });
    }
    setMasteredIds(nextSet);
  };

  // Filter words
  const filteredWords = useMemo(() => {
    return filterWords(initialWords, query, pos);
  }, [initialWords, query, pos]);

  // Reset to page 1 on query change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, pos]);

  const totalPages = Math.ceil(filteredWords.length / PAGE_SIZE) || 1;
  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredWords.slice(start, start + PAGE_SIZE);
  }, [filteredWords, currentPage]);

  const landmark = LEVEL_LANDMARKS[levelInfo.level] || {
    image: "/images/taipei-101.jpg",
    name: "Taiwan",
    zh: "臺灣",
    desc: "Pulau Formosa",
    location: "Taiwan",
  };

  return (
    <div className="space-y-6">
      {/* Top navigation & level header with landmark banner */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-zinc-900 shadow-sm">
        {/* Banner image */}
        <div className="absolute inset-0">
          <img
            src={landmark.image}
            alt={landmark.name}
            className="w-full h-full object-cover brightness-[0.4] dark:brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content over banner */}
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-emerald-400 transition mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold font-cjk text-white drop-shadow-sm">
                {levelInfo.titleZh} ({levelInfo.level})
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 text-white font-mono font-semibold shadow-sm">
                {levelInfo.wordCount} Kata
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1 font-sans flex items-center gap-2">
              <span>Kamus Resmi TOCFL {levelInfo.band} · {levelInfo.cefr}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <MapPin className="w-3 h-3" />
                {landmark.name} ({landmark.zh})
              </span>
            </p>
          </div>

          {/* Quick action buttons on banner */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={`/level/${levelInfo.level.toLowerCase()}/flashcards`}
              className="px-4 py-2.5 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition active:scale-95"
            >
              Flashcard SRS
            </Link>
            <Link
              href={`/level/${levelInfo.level.toLowerCase()}/quiz`}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 shadow-sm"
            >
              Kuis Level Ini
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kata Hanzi, Pinyin (mis: wo / wǒ), atau terjemahan..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
          />
        </div>

        {/* POS dropdown */}
        <div className="w-full sm:w-auto">
          <select
            value={pos}
            onChange={(e) => setPos(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
          >
            {POS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count & Mastery indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <span>Menampilkan {filteredWords.length} dari {initialWords.length} kata</span>
        <span>{masteredIds.size} dikuasai</span>
      </div>

      {/* Word Grid */}
      {paginatedWords.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <BookOpen className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Tidak ada kata yang cocok dengan pencarian
          </p>
          <button
            onClick={() => {
              setQuery("");
              setPos("ALL");
            }}
            className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paginatedWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isMastered={masteredIds.has(word.id)}
              onSelect={setSelectedWord}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Sebelumnya
          </button>

          <span className="font-mono text-zinc-500">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Berikutnya
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <WordDetailModal
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        isMastered={selectedWord ? masteredIds.has(selectedWord.id) : false}
        onToggleMastered={handleToggleMastered}
      />
    </div>
  );
}
