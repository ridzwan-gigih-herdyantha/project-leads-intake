# Resep motion

Semua contoh pakai `motion` (`npm i motion`). Kalau project masih pakai
`framer-motion`, ganti import `motion/react` → `framer-motion`, API-nya sama.

## Easing yang dipakai di project ini

```ts
// lib/motion.ts
export const ease = {
  out: [0.16, 1, 0.3, 1],      // entrance, reveal
  inOut: [0.65, 0, 0.35, 1],   // elemen yang pindah posisi
  snap: [0.2, 0.9, 0.1, 1],    // state change cepat
} as const;

export const dur = {
  state: 0.16,
  entrance: 0.45,
  slow: 0.7,
} as const;
```

## Reduced motion: satu hook, dipakai di mana-mana

```tsx
import { useReducedMotion } from "motion/react";

export function useMotionSafe() {
  const reduce = useReducedMotion();
  return {
    reduce,
    // pakai untuk mematikan transform tapi tetap boleh fade
    variant: (from: object, to: object) => (reduce ? { opacity: 1 } : from),
  };
}
```

Aturan praktisnya: kalau `reduce` true, hilangkan pergerakan dan skala.
Opacity transition pendek masih boleh.

## Momen orkestrasi hero (satu per halaman)

Ini satu-satunya tempat animasi non-user-triggered dipakai berlapis. Elemen
masuk berurutan sekali, lalu halaman diam.

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { ease, dur } from "@/lib/motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: dur.entrance, ease: ease.out } },
};

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <motion.section
      variants={container}
      initial={reduce ? "show" : "hidden"}
      animate="show"
    >
      <motion.h1 variants={reduce ? undefined : item}>…</motion.h1>
      <motion.p variants={reduce ? undefined : item}>…</motion.p>
      <motion.div variants={reduce ? undefined : item}>…</motion.div>
    </motion.section>
  );
}
```

Catatan: `y: 16`, bukan 40. Pergerakan besar terasa seperti template.

## Reveal saat scroll — pakai hemat

Jangan pasang ke setiap section. Pilih satu atau dua elemen yang memang layak
diperhatikan.

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-15% 0px" }}
  transition={{ duration: 0.5, ease: ease.out }}
/>
```

Alternatif tanpa JS, cukup untuk sebagian besar kasus:

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
  }
  .reveal:where(.is-visible) { opacity: 1; transform: none; }
}
```

## Scroll-linked (parallax, progress)

Gunakan hanya kalau menambah informasi, misalnya progress bar baca.

```tsx
"use client";
import { motion, useScroll, useTransform } from "motion/react";

export function ReadProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0 50%" }}
      className="fixed inset-x-0 top-0 h-0.5 bg-[--accent]"
    />
  );
}
```

Parallax: batasi pergeseran maksimal ~40px. Lebih dari itu bikin pusing dan
memicu layout terasa berat.

```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
```

## Transisi masuk/keluar elemen

```tsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence mode="wait">
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.16, ease: ease.snap }}
    />
  )}
</AnimatePresence>
```

## Layout animation

Untuk elemen yang pindah posisi (tab indicator, kartu yang di-reorder), pakai
`layout` / `layoutId` daripada menganimasikan koordinat manual.

```tsx
{tabs.map((t) => (
  <button key={t.id} className="relative">
    {t.label}
    {active === t.id && (
      <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-px bg-current" />
    )}
  </button>
))}
```

## Hover: satu properti saja

Hover state yang menggeser, membesarkan, mengubah shadow, dan mengubah warna
sekaligus terasa murah. Pilih satu.

```css
.card { transition: border-color 160ms var(--ease-snap); }
.card:hover { border-color: var(--accent); }
```

Untuk perangkat sentuh, hover tidak ada — pastikan tidak ada informasi yang
hanya muncul saat hover.

## Checklist sebelum bilang selesai

- [ ] Hanya `transform` dan `opacity` yang dianimasikan
- [ ] `prefers-reduced-motion: reduce` diuji (DevTools → Rendering → Emulate CSS media)
- [ ] Tidak ada animasi yang menunda teks hero tampil
- [ ] Focus ring masih terlihat di semua state
- [ ] Diuji di 375px
- [ ] Tidak ada dua momen orkestrasi bersaing di satu halaman
