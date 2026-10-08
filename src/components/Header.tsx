"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfile } from "../hooks/useProfile";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileModal } from "./ProfileModal";
import { BookOpen, User } from "lucide-react";

interface HeaderProps {
  currentLevel?: string;
}

export function Header({ currentLevel }: HeaderProps) {
  const { profile, updateProfile, mounted } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition">
              臺
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                TOCFL Taiwan
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-medium">
                  2023
                </span>
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Belajar Kosakata Tradisional
              </span>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentLevel && (
              <div className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 font-mono text-zinc-600 dark:text-zinc-300">
                <span>Level:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentLevel}</span>
              </div>
            )}

            <ThemeToggle />

            {/* Profile pill button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition active:scale-95"
            >
              <span className="text-base leading-none">
                {mounted ? profile.avatarSeed : "🇹🇼"}
              </span>
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate">
                {mounted ? profile.name : "Pelajar"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onUpdate={updateProfile}
      />
    </>
  );
}
