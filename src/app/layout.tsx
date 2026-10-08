import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "TOCFL Taiwan 2023 - Belajar Kosakata Mandarin Tradisional",
  description: "Platform belajar 7.517 kosakata resmi TOCFL Taiwan (SC-TOP) dengan audio penutur asli dan flashcard SRS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen text-zinc-900 dark:text-zinc-100 antialiased flex flex-col font-sans relative selection:bg-emerald-600 selection:text-white">
        {/* Authentic Taiwan Scenic Background Atmosphere */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <img
            src="/images/taipei-101.jpg"
            alt="Taiwan Scenic Landscape"
            className="w-full h-full object-cover opacity-15 dark:opacity-20 brightness-105 dark:brightness-75 scale-105 transition-all duration-700"
          />
          {/* Subtle gradient veil for pristine contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/85 via-zinc-50/75 to-zinc-50/90 dark:from-zinc-950/90 dark:via-zinc-950/80 dark:to-zinc-950/95 backdrop-blur-[3px]" />
        </div>

        <Header />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <p>TOCFL Taiwan 2023 Vocabulary Learning Platform · Standar SC-TOP Taiwan</p>
        </footer>
      </body>
    </html>
  );
}
