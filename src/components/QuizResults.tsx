"use client";

import Link from "next/link";
import { QuizQuestion } from "../types/vocab";
import { RotateCcw, ArrowLeft, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { AudioPlayerButton } from "./AudioPlayerButton";

interface QuizResultsProps {
  score: number;
  total: number;
  level: string;
  wrongAnswers: { question: QuizQuestion; userAnswer: string }[];
  onRestart: () => void;
}

export function QuizResults({
  score,
  total,
  level,
  wrongAnswers,
  onRestart,
}: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);

  let badgeColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60";
  let verdict = "Luar Biasa!";
  if (percentage < 60) {
    badgeColor = "text-red-600 bg-red-50 dark:bg-red-950/60";
    verdict = "Perlu Lebih Banyak Latihan!";
  } else if (percentage < 80) {
    badgeColor = "text-amber-600 bg-amber-50 dark:bg-amber-950/60";
    verdict = "Hasil Cukup Baik!";
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-md">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeColor} mb-3`}>
          {verdict}
        </span>
        <h2 className="text-2xl font-bold font-cjk text-zinc-900 dark:text-zinc-100">
          Hasil Kuis TOCFL {level}
        </h2>

        {/* Circular / big score */}
        <div className="my-6">
          <div className="text-6xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {percentage}%
          </div>
          <p className="mt-1 text-xs text-zinc-500 font-mono">
            {score} benar dari {total} soal
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Coba Kuis Lagi
          </button>
          <Link
            href={`/level/${level.toLowerCase()}/words`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Pelajari di Kamus
          </Link>
        </div>
      </div>

      {/* Wrong answers review */}
      {wrongAnswers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Evaluasi Jawaban Salah ({wrongAnswers.length})
          </h3>
          <div className="space-y-2.5">
            {wrongAnswers.map(({ question, userAnswer }, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base font-cjk text-zinc-900 dark:text-zinc-100">
                      {question.word.trad}
                    </span>
                    <span className="text-emerald-600 font-mono font-medium">
                      {question.word.pinyin}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                    {question.prompt}
                  </p>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Kamu: {userAnswer}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Kunci: {question.correctAnswer}
                    </span>
                  </div>
                </div>
                <AudioPlayerButton audioFile={question.audio} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
