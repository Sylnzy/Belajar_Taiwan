"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { VocabWord, LevelSummary, WordProgress } from "../types/vocab";
import { FlipCard } from "./FlipCard";
import { calculateNextReview, ReviewGrade } from "../lib/srs";
import { buildReviewQueue } from "../lib/flashcardQueue";
import { db } from "../lib/db";
import { ArrowLeft, RotateCcw, CheckCircle2, Sparkles, Layers } from "lucide-react";

interface FlashcardSRSProps {
  levelInfo: LevelSummary;
  words: VocabWord[];
}

export function FlashcardSRS({ levelInfo, words }: FlashcardSRSProps) {
  const [queue, setQueue] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Initialize review queue from Dexie
  const initQueue = useCallback(async () => {
    setIsLoading(true);
    setSessionCompleted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);

    const progressRecords = await db.progress
      .where("level")
      .equals(levelInfo.level)
      .toArray();

    const sessionWords = buildReviewQueue(words, progressRecords, 20);
    setQueue(sessionWords);
    setIsLoading(false);
  }, [levelInfo.level, words]);

  useEffect(() => {
    initQueue();
  }, [initQueue]);

  const currentWord = queue[currentIndex];

  // Process user rating
  const handleRate = async (grade: ReviewGrade) => {
    if (!currentWord) return;

    // Get current progress or default
    const existing = await db.progress.get(currentWord.id);
    const prevInterval = existing?.intervalDays || 0;
    const prevReps = existing?.repetitions || 0;
    const prevEase = existing?.easeFactor || 2.5;

    const srsResult = calculateNextReview({
      intervalDays: prevInterval,
      repetitions: prevReps,
      easeFactor: prevEase,
      grade,
    });

    // Save to IndexedDB
    await db.progress.put({
      wordId: currentWord.id,
      level: currentWord.level,
      state: srsResult.state,
      repetitions: srsResult.repetitions,
      intervalDays: srsResult.intervalDays,
      easeFactor: srsResult.easeFactor,
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: srsResult.nextReviewDate.toISOString(),
    });

    setReviewedCount((prev) => prev + 1);

    // If 'again', optionally re-append to end of queue
    if (grade === "again") {
      setQueue((prev) => [...prev, currentWord]);
    }

    // Advance to next card
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionCompleted(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted || !currentWord) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (isFlipped) {
        if (e.key === "1") {
          e.preventDefault();
          handleRate("again");
        } else if (e.key === "2") {
          e.preventDefault();
          handleRate("good");
        } else if (e.key === "3") {
          e.preventDefault();
          handleRate("easy");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, sessionCompleted, currentWord]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-zinc-500">
        Menyiapkan sesi flashcard...
      </div>
    );
  }

  if (sessionCompleted || queue.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-cjk text-zinc-900 dark:text-zinc-100">
          Sesi Flashcard Selesai!
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Kamu telah meninjau {reviewedCount} kata di level {levelInfo.titleZh} ({levelInfo.level}).
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={initQueue}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Lanjut Belajar Batch Baru
          </button>
          <Link
            href={`/level/${levelInfo.level.toLowerCase()}/words`}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
          >
            Lihat Kamus Lengkap
          </Link>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-emerald-600 pt-2 transition"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Keluar Sesi
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Kartu {currentIndex + 1} / {queue.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
          className="h-full bg-emerald-600 transition-all duration-300"
        />
      </div>

      {/* 3D Flip Card */}
      <FlipCard
        word={currentWord}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
      />

      {/* Response Controls */}
      <div className="pt-2">
        {!isFlipped ? (
          <button
            type="button"
            onClick={() => setIsFlipped(true)}
            className="w-full max-w-md mx-auto block py-3 rounded-2xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition active:scale-98 shadow-sm"
          >
            Buka Arti (Spasi)
          </button>
        ) : (
          <div className="max-w-md mx-auto grid grid-cols-3 gap-3 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => handleRate("again")}
              className="py-3 px-2 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/70 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-95 transition flex flex-col items-center justify-center gap-0.5"
            >
              <span className="text-xs font-bold">Lupa</span>
              <span className="text-[10px] opacity-75 font-mono">1 · Ulang</span>
            </button>

            <button
              type="button"
              onClick={() => handleRate("good")}
              className="py-3 px-2 rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/70 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50 active:scale-95 transition flex flex-col items-center justify-center gap-0.5"
            >
              <span className="text-xs font-bold">Ingat</span>
              <span className="text-[10px] opacity-75 font-mono">2 · 1-3 hari</span>
            </button>

            <button
              type="button"
              onClick={() => handleRate("easy")}
              className="py-3 px-2 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 active:scale-95 transition flex flex-col items-center justify-center gap-0.5"
            >
              <span className="text-xs font-bold">Mudah</span>
              <span className="text-[10px] opacity-75 font-mono">3 · 4+ hari</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
