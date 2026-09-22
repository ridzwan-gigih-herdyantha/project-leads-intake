# Integrasi Lottie

```bash
npm i @lottiefiles/dotlottie-react
```

Aset disimpan di `public/animations/`. Format `.lottie` (terkompresi) bukan
`.json`. Setiap aset wajib punya poster statis `public/animations/<nama>.svg`
atau `.webp` untuk kondisi reduced-motion dan saat aset belum ter-load.

## Komponen dasar yang dipakai di project ini

Bungkus satu kali, jangan panggil `DotLottieReact` langsung di mana-mana —
supaya aturan reduced-motion dan lazy load tidak perlu diulang.

```tsx
// components/lottie.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";

type Props = {
  src: string;              // "/animations/foo.lottie"
  poster: string;           // "/animations/foo.svg"
  alt: string;
  loop?: boolean;
  /** "view" = main saat masuk viewport, "hover", "load" */
  trigger?: "view" | "hover" | "load";
  className?: string;
};

export function Lottie({
  src,
  poster,
  alt,
  loop = false,
  trigger = "view",
  className,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(true);   // default aman
  const [visible, setVisible] = useState(false);
  const [dot, setDot] = useState<DotLottie | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // baru mount player saat mendekati viewport
  useEffect(() => {
    if (!wrap.current || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), io.disconnect()),
      { rootMargin: "200px" },
    );
    io.observe(wrap.current);
    return () => io.disconnect();
  }, [reduce]);

  if (reduce) {
    return <img src={poster} alt={alt} className={className} />;
  }

  return (
    <div
      ref={wrap}
      className={className}
      onMouseEnter={() => trigger === "hover" && dot?.play()}
      onMouseLeave={() => trigger === "hover" && dot?.pause()}
      role="img"
      aria-label={alt}
    >
      {visible ? (
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay={trigger !== "hover"}
          dotLottieRefCallback={setDot}
          renderConfig={{ autoResize: true }}
        />
      ) : (
        <img src={poster} alt="" aria-hidden />
      )}
    </div>
  );
}
```

Pemakaian:

```tsx
<Lottie
  src="/animations/data-flow.lottie"
  poster="/animations/data-flow.svg"
  alt="Diagram alur data antar layanan"
  trigger="view"
  className="aspect-[4/3] w-full max-w-md"
/>
```

## Scroll-driven playback

Untuk ilustrasi yang menjelaskan proses bertahap, ikat frame ke posisi scroll.
Jangan dipakai lebih dari sekali per halaman.

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useScroll } from "motion/react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";

export function ScrollLottie({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState<DotLottie | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    if (!dot) return;
    dot.pause();
    return scrollYProgress.on("change", (p) => {
      const total = dot.totalFrames ?? 0;
      dot.setFrame(Math.min(total - 1, Math.max(0, p * (total - 1))));
    });
  }, [dot, scrollYProgress]);

  return (
    <div ref={ref}>
      <DotLottieReact src={src} autoplay={false} loop={false} dotLottieRefCallback={setDot} />
    </div>
  );
}
```

## Mengubah `.json` → `.lottie` dan menekan ukuran

```bash
npx @lottiefiles/dotlottie-cli convert input.json -o output.lottie
```

Kalau ukuran masih di atas 100KB, penyebab yang paling umum:

1. Ada gambar raster ter-embed di dalam animasi → minta ulang versi vektor
2. Jumlah path terlalu banyak (efek "wiggle" atau hasil auto-trace)
3. Durasi terlalu panjang dengan frame rate tinggi → 30fps sudah cukup
4. Ada expression/effect yang tidak didukung dan ikut terbawa

Jangan akali dengan lazy load saja — aset 800KB tetap 800KB saat akhirnya
di-download.

## Kesalahan yang berulang

- **Lottie sebagai spinner/loader.** Pakai CSS. Loader Lottie berarti
  men-download animasi untuk menunggu download lain
- **Autoplay + loop di beberapa tempat sekaligus.** CPU naik terus, baterai
  laptop habis, dan halaman terasa gelisah
- **Tidak ada `aria-label` atau poster.** Screen reader dapat elemen kosong
- **Canvas tanpa ukuran pasti.** Selalu kunci aspect ratio di container supaya
  tidak ada layout shift
- **Render di server.** Player butuh `window`; komponen wajib `"use client"`
- **Animasi pakai warna yang di-hardcode di file.** Warna Lottie tidak ikut
  design token — minta aset dengan warna yang sudah sesuai palette, atau ganti
  warnanya di editor sebelum export
