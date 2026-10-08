"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioPlayerButtonProps {
  audioFile?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoPlay?: boolean;
}

export function AudioPlayerButton({
  audioFile,
  size = "md",
  className = "",
  autoPlay = false,
}: AudioPlayerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop previous audio and reset when audioFile changes or component unmounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setHasError(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [audioFile]);

  const playAudio = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!audioFile || hasError) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      const audioUrl = `/audio/${encodeURIComponent(audioFile)}`;
      const audio = new Audio(audioUrl);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setHasError(true);
      };
      audioRef.current = audio;

      audio.play().catch((err) => {
        console.warn("Audio playback interrupted or blocked:", err);
        setIsPlaying(false);
      });
    } catch {
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (!audioFile) {
    return (
      <span
        title="Audio tidak tersedia"
        className={`inline-flex items-center justify-center rounded-lg text-zinc-300 dark:text-zinc-700 cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        <VolumeX className={iconSizes[size]} />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={playAudio}
      disabled={hasError}
      aria-label="Putar audio pengucapan"
      title={hasError ? "Gagal memutar audio" : "Dengarkan audio"}
      className={`inline-flex items-center justify-center rounded-xl border transition active:scale-90 ${
        hasError
          ? "border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
          : isPlaying
          ? "border-emerald-600 bg-emerald-600 text-white animate-pulse shadow-sm"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
      } ${sizeClasses[size]} ${className}`}
    >
      {hasError ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </button>
  );
}
