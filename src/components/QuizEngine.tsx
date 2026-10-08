"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { VocabWord, LevelSummary, QuizQuestion } from "../types/vocab";
import { generateQuiz } from "../lib/quizGenerator";
import { QuizResults } from "./QuizResults";
import { AudioPlayerButton } from "./AudioPlayerButton";
import { db } from "../lib/db";
import { ArrowLeft, Award, Volume2, CheckCircle2, XCircle } from "lucide-react";

interface QuizEngineProps {
  levelInfo: LevelSummary;
  words: VocabWord[];
}

export function QuizEngine({ levelInfo, words }: QuizEngineProps) {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<
    { question: QuizQuestion; userAnswer: string }[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startQuiz = (count: number) => {
    const qList = generateQuiz(words, count);
    setQuestions(qList);
    setQuestionCount(count);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setWrongAnswers([]);
    setIsFinished(false);
    setHasStarted(true);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(opt);
  };

  const currentQ = questions[currentIndex];

  const handleConfirmAnswer = () => {
    if (!selectedOption || !currentQ || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        { question: currentQ, userAnswer: selectedOption },
      ]);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Save to IndexedDB
      const finalScore = selectedOption === currentQ?.correctAnswer ? score + 1 : score;
      await db.quizHistory.add({
        level: levelInfo.level,
        date: new Date().toISOString(),
        totalQuestions: questions.length,
        correctCount: finalScore,
        scorePercentage: Math.round((finalScore / questions.length) * 100),
        mode: `${questionCount}-questions`,
      });
      setIsFinished(true);
    }
  };

  if (!hasStarted) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-cjk text-zinc-900 dark:text-zinc-100">
          Kuis Latihan TOCFL {levelInfo.level}
        </h2>
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Uji pemahaman kosakata {levelInfo.titleZh} ({levelInfo.band}) melalui soal pilihan ganda acak: tebak arti, aksara Hanzi, dan tes pendengaran audio.
        </p>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => startQuiz(10)}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm"
          >
            Mulai Kuis Singkat (10 Soal)
          </button>
          <button
            onClick={() => startQuiz(20)}
            className="w-full py-3 px-4 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
          >
            Mulai Kuis Standar (20 Soal)
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <QuizResults
        score={score}
        total={questions.length}
        level={levelInfo.level}
        wrongAnswers={wrongAnswers}
        onRestart={() => startQuiz(questionCount)}
      />
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Keluar
        </Link>
        <span className="font-mono text-zinc-500">
          Soal {currentIndex + 1} dari {questions.length} · Skor: {score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="h-full bg-emerald-600 transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm text-center">
        <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 mb-3">
          {currentQ.type === "hanzi-to-meaning" && "Tebak Arti Karakter"}
          {currentQ.type === "meaning-to-hanzi" && "Tebak Karakter Hanzi"}
          {currentQ.type === "audio-to-hanzi" && "Tes Pendengaran Audio"}
        </span>

        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          {currentQ.prompt}
        </h3>

        {/* Big character or audio trigger */}
        {currentQ.type === "hanzi-to-meaning" && (
          <div className="my-4">
            <div className="text-5xl font-bold font-cjk text-zinc-900 dark:text-zinc-50">
              {currentQ.word.trad}
            </div>
            <div className="mt-2 text-sm font-mono text-emerald-600 dark:text-emerald-400">
              {currentQ.word.pinyin}
            </div>
            <div className="mt-3">
              <AudioPlayerButton audioFile={currentQ.audio} size="md" />
            </div>
          </div>
        )}

        {currentQ.type === "audio-to-hanzi" && (
          <div className="my-6 flex flex-col items-center justify-center">
            <AudioPlayerButton audioFile={currentQ.audio} size="lg" />
            <span className="mt-2 text-xs text-zinc-400">
              Klik untuk dengarkan pengucapan
            </span>
          </div>
        )}

        {currentQ.type === "meaning-to-hanzi" && (
          <div className="my-3 text-xs text-zinc-400 font-mono">
            Pilih 1 dari 4 karakter berikut
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5 mt-6 text-left">
          {currentQ.options.map((opt, i) => {
            let optionStyle =
              "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/60";

            if (selectedOption === opt) {
              optionStyle =
                "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-600/30";
            }

            if (isAnswerChecked) {
              if (opt === currentQ.correctAnswer) {
                optionStyle =
                  "border-emerald-600 bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100 font-semibold";
              } else if (selectedOption === opt) {
                optionStyle =
                  "border-red-500 bg-red-100/80 dark:bg-red-950/80 text-red-900 dark:text-red-100";
              } else {
                optionStyle = "opacity-50 border-zinc-200 dark:border-zinc-800";
              }
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-cjk transition flex items-center justify-between ${optionStyle}`}
              >
                <span>{opt}</span>
                {isAnswerChecked && opt === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isAnswerChecked &&
                  selectedOption === opt &&
                  opt !== currentQ.correctAnswer && (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action button */}
      <div>
        {!isAnswerChecked ? (
          <button
            type="button"
            disabled={!selectedOption}
            onClick={handleConfirmAnswer}
            className="w-full py-3 rounded-2xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition active:scale-98 shadow-sm"
          >
            Kunci Jawaban
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-2xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition active:scale-98 shadow-sm"
          >
            {currentIndex + 1 < questions.length ? "Soal Berikutnya" : "Lihat Hasil Kuis"}
          </button>
        )}
      </div>
    </div>
  );
}
