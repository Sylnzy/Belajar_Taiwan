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
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased flex flex-col font-sans relative selection:bg-emerald-600 selection:text-white">
        {/* Atmospheric Taiwan Heritage Background Canvas */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <img
            src="/images/taroko-gorge.jpg"
            alt=""
            className="w-full h-full object-cover opacity-[0.03] dark:opacity-[0.05] filter blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/80 to-zinc-50 dark:via-zinc-950/80 dark:to-zinc-950" />
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
