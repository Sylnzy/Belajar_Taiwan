"use client";

import { useState } from "react";
import { UserProfile } from "../types/vocab";
import { exportUserData, importUserData } from "../lib/db";
import { X, Download, Upload, Volume2, VolumeX, Check } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (partial: Partial<UserProfile>) => void;
}

const AVATAR_OPTIONS = [
  { label: "臺", desc: "Taiwan" },
  { label: "學", desc: "Belajar" },
  { label: "書", desc: "Buku" },
  { label: "華", desc: "Mandarin" },
  { label: "福", desc: "Berkah" },
  { label: "春", desc: "Musim Semi" },
  { label: "龍", desc: "Naga" },
  { label: "志", desc: "Cita-cita" },
];

export function ProfileModal({ isOpen, onClose, profile, onUpdate }: ProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatarSeed);
  const [autoPlay, setAutoPlay] = useState(profile.autoPlayAudio);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate({
      name: name.trim() || "Pelajar",
      avatarSeed: avatar,
      autoPlayAudio: autoPlay,
    });
    onClose();
  };

  const handleExport = async () => {
    try {
      const json = await exportUserData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tocfl-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg("Backup progress berhasil diunduh.");
    } catch {
      setStatusMsg("Gagal mengekspor data.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const success = await importUserData(text);
      if (success) {
        setStatusMsg("Progres berhasil dipulihkan.");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setStatusMsg("Format backup tidak valid.");
      }
    } catch {
      setStatusMsg("Gagal membaca file backup.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl transition-all">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Profil Pembelajar
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Pilih Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setAvatar(item.label)}
                  title={item.desc}
                  className={`w-10 h-10 text-base font-bold font-cjk rounded-xl border flex items-center justify-center transition ${
                    avatar === item.label
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-600/30"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Auto play audio toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="flex items-center gap-2.5">
              {autoPlay ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              )}
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Putar Audio Otomatis
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                autoPlay ? "bg-emerald-600 justify-end" : "bg-zinc-300 dark:bg-zinc-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Backup & Restore */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Penyimpanan Data (Lokal & Gratis)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                Ekspor Backup
              </button>
              <label className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-zinc-500" />
                Impor Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
            {statusMsg && (
              <p className="mt-2 text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium">
                {statusMsg}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition shadow-sm"
            >
              Simpan Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
