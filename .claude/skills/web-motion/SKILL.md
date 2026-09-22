---
name: web-motion
description: Design direction, motion system, dan integrasi Lottie untuk website ini. Pakai setiap kali membuat atau mengubah halaman, komponen UI, styling, layout, animasi, transisi, atau menambahkan aset Lottie.
paths:
  - "app/**"
  - "src/**"
  - "components/**"
  - "styles/**"
  - "**/*.css"
---

# Web design & motion

Kerjakan ini sebagai design lead, bukan sebagai code generator. Setiap halaman
harus punya identitas visual yang spesifik untuk subjeknya, bukan layout umum
yang bisa dipasang ke produk apa pun.

## Stack

- Next.js (App Router) + Tailwind
- `motion` (Framer Motion baru) untuk animasi UI — `import { motion } from "motion/react"`
- `@lottiefiles/dotlottie-react` untuk Lottie
- Aset Lottie ada di `public/animations/*.lottie`

Kalau salah satu belum terpasang, pasang dulu dan sebutkan apa yang dipasang.

## Alur kerja wajib: rencana dulu, kode belakangan

Jangan langsung menulis komponen. Untuk halaman atau section baru:

**1. Pastikan subjeknya jelas.** Produk apa, audiensnya siapa, tugas utama
halaman ini apa. Kalau brief-nya belum menyebut, ajukan satu proposal konkret
dan tunggu konfirmasi.

**2. Tulis design plan ke `docs/design-plan.md`, lalu STOP dan minta approval.**
Isi plan:

- **Palette** — 4–6 hex bernama, dengan alasan kenapa warna itu cocok untuk
  subjeknya
- **Type** — 1 atau 2 typeface dan perannya, plus type scale konkret. Kalau dua,
  harus jelas bedanya. Jangan Inter kecuali diminta
- **Layout** — satu kalimat konsep + ASCII wireframe hero, plus alignment
- **Motion moment** — satu momen animasi utama halaman ini, dan kenapa di situ
- **Lottie** — aset apa yang dibutuhkan (deskripsi, bukan file), dipakai di mana

**3. Review plan itu sendiri sebelum lanjut.** Untuk tiap bagian tanya: ini
pilihan untuk brief ini, atau default yang akan keluar untuk brief apa pun?
Kalau default, ganti dan sebutkan apa yang diganti.

**4. Baru kode.** Ikuti plan yang sudah di-approve.

**5. Screenshot dan kritik sendiri.** Kalau ada browser tool, buka halamannya,
ambil screenshot, lihat sendiri hasilnya sebelum bilang selesai. Cek juga di
lebar 375px.

## Yang harus dihindari (tanda paling jelas halaman generate)

Ini bukan selera, ini pola yang muncul di mana-mana:

- Cream `#F4F1EA` + display serif + accent terracotta `#D97757`
- Near-black + satu accent acid green / vermilion
- Semua konten dipotong jadi kartu rounded identik dengan shadow
  `rgba(0,0,0,.1)` yang sama, satu border-radius untuk semua hierarki
- Eyebrow ALL-CAPS di atas setiap heading
- Satu kata di headline dibikin beda warna / italic untuk "aksen"
- Meta string disambung middle dot: `A · B · C`
- Label pola `WORD — fragmen` dengan em dash berspasi
- `→` ditempel di akhir teks link dan button
- Monospace untuk label data kecil
- Penanda urut `01 / 02 / 03` padahal kontennya bukan urutan
- Gradient sebagai dekorasi tanpa fungsi

Kalau brief secara eksplisit minta salah satu di atas, ikuti brief. Kalau
brief-nya bebas, jangan pakai kebebasan itu untuk default.

## Aturan motion

**Budget: satu momen orkestrasi per halaman.** Satu page-load sequence atau satu
reveal yang dirancang, bukan efek yang disebar. Fade-and-slide-up di setiap
section plus hover transition di setiap kartu adalah default generik — jangan.

**Motion yang merespons aksi user selalu boleh** — buka, expand, confirm, drag,
toggle. Motion itu menjelaskan apa yang berubah, jadi pakai sebanyak yang
dibutuhkan.

**Teknis, tidak bisa dinegosiasi:**

- Animasikan `transform` dan `opacity` saja. Jangan `width`, `height`, `top`,
  `left`, `margin`
- Durasi: 120–200ms untuk state change, 300–500ms untuk entrance. Di atas 600ms
  terasa lambat
- Jangan pakai `ease-in` untuk sesuatu yang masuk ke layar
- `prefers-reduced-motion` wajib dihormati di setiap animasi, tanpa kecuali
- Fokus keyboard harus tetap terlihat; animasi tidak boleh menyembunyikan
  focus ring
- Tidak ada animasi yang menunda LCP atau membuat layout shift

Resep dan kode konkret: [references/motion.md](references/motion.md)

## Aturan Lottie

- **Maksimal 2 Lottie per halaman.** Lebih dari itu hampir selalu tanda animasi
  dipakai sebagai dekorasi
- **Budget ukuran: < 100KB per aset.** Pakai format `.lottie`, bukan `.json`
  mentah
- **Jangan pernah generate Lottie JSON sendiri.** Hasil keyframe buatan model
  selalu jelek. Kalau butuh aset baru, deskripsikan animasi yang dibutuhkan dan
  minta saya sediakan filenya
- **Jangan di above-the-fold secara blocking.** Hero boleh pakai Lottie, tapi
  harus lazy + ada poster statis yang tampil dulu
- **`prefers-reduced-motion` → tampilkan frame statis**, bukan animasi yang
  diperlambat
- **Autoplay hanya untuk loop halus tanpa suara.** Animasi bercerita dipicu
  scroll atau hover
- Untuk micro-interaction (button, toast, checkmark, spinner, page transition)
  pakai `motion` atau CSS. Lottie untuk ilustrasi, bukan untuk UI feedback

Resep integrasi, lazy load, dan scroll-driven playback:
[references/lottie.md](references/lottie.md)

## Quality floor

Bangun ini tanpa perlu diminta, dan jangan diumumkan sebagai fitur:

- Responsif sampai 375px
- Focus state terlihat untuk semua elemen interaktif
- Kontras teks memenuhi WCAG AA
- Line length body text di bawah 80 karakter
- Reduced motion dihormati
- Tidak ada layout shift saat aset selesai load
