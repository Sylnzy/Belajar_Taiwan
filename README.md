# TOCFL Taiwan 2023 Vocabulary Learning Web Application

Platform web interaktif untuk mempelajari 7.517 kosakata resmi bahasa Mandarin Taiwan standar **TOCFL (SC-TOP)** 2023 dari level L0 hingga L5, dilengkapi 7.133 audio pelafalan asli.

## Fitur Utama

- **Level Selector TOCFL (L0 - L5)**: Menampilkan 6 tingkatan resmi SC-TOP (Novice Pre-A1 hingga Band C C1) lengkap dengan kuota kata dan indikator penguasaan materi.
- **Kamus / Word Explorer**: Pencarian instan (Hanzi, Pinyin, atau terjemahan), filter POS (Nomina, Verba, Partikel, dll.), pemutar audio, serta modal rincian perbedaan penggunaan Taiwan vs Daratan.
- **Flashcard Spaced Repetition (SRS)**: Kartu 3D interaktif berbasis algoritma SM-2 dengan shortcut keyboard (`Spasi` buka arti, `1` Lupa, `2` Ingat, `3` Mudah).
- **Kuis Pilihan Ganda**: Latihan 10 atau 20 soal (Tebak Arti, Tebak Hanzi, dan Tes Pendengaran Audio) dengan evaluasi jawaban salah.
- **Penyimpanan Lokal Gratis & Aman**: Progres tersimpan di browser via IndexedDB (Dexie.js), tanpa biaya backend / server. Mendukung Ekspor & Impor file backup JSON.
- **Desain Modern & Ringan**: Dibangun dengan Next.js App Router, Tailwind CSS, dan tema konsisten (Light & Dark mode).

## Menjalankan di Lokal

```bash
# Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Menjalankan Pengujian (Tests)

```bash
npx vitest run
```

## Build & Deploy ke Vercel

```bash
# Build produksi
npm run build
```

Aplikasi ini 100% kompatibel dengan Vercel:
1. Push repositori ini ke GitHub.
2. Hubungkan repository ke [Vercel](https://vercel.com).
3. Vercel akan otomatis mendeteksi konfigurasi Next.js dan melakukan build static SSG tanpa konfigurasi tambahan.
