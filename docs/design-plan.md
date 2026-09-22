# Landing "Isi form dulu" — design plan

## Subjek

- **Produk:** agency/studio yang bikin web, aplikasi, dan otomasi. Landing ini
  bertugas mengumpulkan lead — tidak menjual scope, tidak jualan feature.
- **Audiens:** general — semua orang (UMKM, freelancer, founder awal, staf yang
  disuruh cari vendor, individu). Bukan hanya B2B. Bahasa Indonesia, casual,
  bebas jargon.
- **Tugas utama:** satu — isi form. Segala hal di halaman ini menuntun ke sana.
  Kalau ada section yang tidak membantu isi form, buang.

## Copy tone

- Bahasa Indonesia, kalimat pendek, sapaan "kamu".
- Tidak ada "solutions", "empower", "elevate", "unlock", "seamlessly".
- CTA aksi konkret: **"Kirim"**, bukan "Submit" atau "Send message".

---

## Palette

| Nama         | Hex        | Peran                                            |
|--------------|------------|--------------------------------------------------|
| Ink          | `#12131A`  | Teks utama, heading. Dark blue-black, bukan pure black. |
| Paper        | `#EFEEF3`  | Background halaman. Off-white lavender — bukan cream `#F4F1EA`. |
| Card         | `#FFFFFF`  | Permukaan form (kartu putih di atas Paper).     |
| Highlighter  | `#FFDE59`  | Aksen tunggal — CTA button, success sweep, focus dab. |
| Cobalt       | `#2E4A9E`  | Link, focus ring. Biru cetak, bukan corporate blue biasa. |
| Slate        | `#6B6B78`  | Body text sekunder, helper text, placeholder.   |
| Meadow       | `#25B47D`  | Konfirmasi/success saja. Tidak dipakai di area lain. |

**Alasan pilihan:** metafor "kertas + spidol highlighter". Subjek halaman ini
adalah **formulir** — analogi terdekat di dunia fisik: catatan yang di-highlight
supaya user tahu "ini yang harus diisi". Paper lavender menghindari cream default;
Highlighter kuning memberi aksen ceria yang tidak menakutkan untuk audience
general (kuning ≠ corporate). CTA kuning + text ink adalah pola konversi kuat
yang tetap terasa hangat, bukan agresif. Tidak ada terracotta, tidak ada
neutral+acid-green, tidak ada gradient.

**Kontras:** Ink pada Paper > 15:1 (AAA). Ink pada Highlighter > 12:1 (AAA).
Cobalt pada Paper ≈ 8:1 (AA large + normal).

---

## Type

Dua typeface, peran berbeda, kontras jelas.

| Family              | Peran                                        |
|---------------------|----------------------------------------------|
| **Bricolage Grotesque** | Heading, form label, button, angka.       |
| **Newsreader**          | Body paragraph, deskripsi, kalimat panjang. |

**Kenapa bukan Inter:** skill melarang default. Bricolage Grotesque punya
proporsi yang sedikit "handmade" (bukan geometric ketat), cocok untuk vibe
kertas-catatan. Newsreader adalah serif Google yang dirancang untuk teks
running, warm dan mudah dibaca — memberi kontras kuat dengan display sans.
Keduanya open-source dan bisa dimuat via `next/font/google`.

**Type scale (desktop → mobile):**

- H1 display — Bricolage 500, `56/60` → `40/44`, tracking `-0.02em`
- H2 — Bricolage 500, `32/36` → `26/30`
- H3 — Bricolage 500, `20/26`
- Body — Newsreader 400, `17/28` → `16/26` (line-length ≤ 60 karakter)
- Form label — Bricolage 500, `14/20`, tracking normal (bukan uppercase)
- Helper / micro — Newsreader 400 italic, `13/18`
- Button — Bricolage 600, `15/20`

Tidak ada eyebrow ALL-CAPS. Tidak ada mono. Tidak ada satu kata yang dibikin
italic/warna beda di dalam headline.

---

## Layout

**Konsep:** *form-first split hero*. Form terlihat di viewport pertama —
tidak ada "scroll dulu untuk isi". Sisi kiri: proposisi singkat + tiga alasan
percaya. Sisi kanan: kartu form (putih di atas Paper, bayangan halus seperti
kertas di atas meja, tanpa rotate/tilt biar tidak norak).

Di bawah hero: **tidak ada** section "What we do" panjang. Cukup satu strip
tipis "Yang kami bantu bangun" (tiga baris teks inline, bukan tiga kartu
identik) — supaya user general tahu ini bisa dipakai untuk apa saja, lalu
kembali fokus ke form.

**ASCII wireframe hero (≥ 900px):**

```
┌────────────────────────────────────────────────────────────────┐
│  studio.                                            Kontak     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Punya ide?                       ┌────────────────────────┐   │
│  Kita bangun bareng.              │  Isi ini, dibalas < 24 │   │
│                                   │  jam kerja.            │   │
│  Web, aplikasi, dan otomasi       │                        │   │
│  untuk siapa saja — bukan hanya   │  Nama                  │   │
│  perusahaan besar.                │  [____________________]│   │
│                                   │                        │   │
│  · Balasan cepat, orang beneran   │  Email                 │   │
│  · Harga terbuka sejak awal       │  [____________________]│   │
│  · Tidak perlu bawa jargon        │                        │   │
│                                   │  Yang kamu butuhkan    │   │
│                                   │  ( ) Web  ( ) Aplikasi │   │
│                                   │  ( ) Otomasi  ( ) Lain │   │
│                                   │                        │   │
│                                   │  Cerita singkat        │   │
│                                   │  [____________________]│   │
│                                   │  [____________________]│   │
│                                   │                        │   │
│                                   │  [    Kirim     ]      │   │
│                                   └────────────────────────┘   │
│                                                                │
│  Yang biasa kami bangun: toko online · sistem booking          │
│  · aplikasi internal · integrasi WhatsApp/Sheets · dashboard.  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  © 2026 studio.                                                │
└────────────────────────────────────────────────────────────────┘
```

**Mobile (< 900px):** single column. Headline 2 baris → tiga alasan
percaya → **form** → strip "yang kami bangun" → footer. Form muncul dalam
scroll pertama.

**Alignment & spacing:**
- Max width halaman `1120px`, gutter `24px` (mobile) / `48px` (desktop).
- Grid hero: 5/7 kolom (kiri copy / kanan form).
- Kartu form: radius `16px` (satu radius untuk form saja — button pakai `10px`,
  input pakai `8px`, jadi ada hierarki radius, bukan semua identik).
- Bayangan kartu: satu lapis lembut `0 12px 32px -18px rgba(18,19,26,.18)`.
- Section spacing vertikal: hero `pt-24 pb-16`, strip bawah `py-10`.

Tidak ada garis pemisah `border-y` besar antar section — pakai spacing saja.

---

## Motion moment

**Satu momen per halaman: highlighter sweep di success screen.**

Ketika form berhasil dikirim, form card di-swap dengan state sukses. Animasi:

1. Kartu form fade + scale halus `0.98 → 1` (state change, 180ms, ease snap).
2. Di dalam kartu sukses, kata "Terima kasih" muncul, lalu **strip Highlighter
   `#FFDE59`** menyapu dari kiri ke kanan **di belakang teks** dengan
   `transform: scaleX(0 → 1); transform-origin: left`. Durasi 380ms, ease out.
   Efeknya seperti kata itu baru saja ditandai spidol.
3. Beriringan (delay 80ms setelah sweep mulai), sebuah **checkmark SVG** di
   samping teks digambar via `stroke-dashoffset` (300ms, ease out).

**Kenapa di sini:** ini payoff dari mengisi form — momen paling bermakna di
halaman. Menghubungkan warna aksen ke tindakan bermakna, bukan dekorasi. Tidak
ada fade-slide-up di section-section lain, tidak ada hover-lift di kartu.

**Motion lain yang tetap ada karena merespons aksi user** (tidak dihitung
sebagai orkestrasi):
- Focus ring input muncul instant (140ms opacity).
- Error field: pesan slide-down 8px + fade, 160ms.
- Button pressed state: `scale: 0.98` while active, 100ms.

**Reduced motion:** highlighter langsung tampil penuh (opacity fade in 120ms
saja), checkmark tampil tanpa stroke-draw. Kartu tidak di-scale. Fokus ring
tidak berubah.

---

## Lottie

**Tidak dipakai di halaman ini.**

Alasan: satu-satunya momen ilustrasi yang layak adalah success confirmation,
dan itu lebih tepat dilakukan dengan `motion` + inline SVG (highlighter sweep
+ checkmark stroke) karena bagian dari UI feedback, bukan ilustrasi bercerita.
Menambah Lottie di hero landing form akan menambah berat dan mengganggu fokus
user ke form. Skill juga melarang Lottie untuk micro-interaction — dan ini
persis kasusnya.

Kalau nanti kita mau ilustrasi hero, aku minta file `.lottie` yang menampilkan
tangan menulis di formulir (loop halus, < 100KB), dipasang di kiri hero
sebagai poster + lazy — tapi ini bukan bagian dari plan sekarang.

---

## Self-review (skill step 3)

Untuk tiap bagian: pilihan khusus brief ini, atau default?

- **Palette lavender-paper + highlighter yellow** → khusus. Default agency
  bakal keluar dengan indigo/blue accent atau cream+terracotta. Highlighter
  yellow dipilih karena metafor form/kertas, bukan karena "warm and friendly".
- **Bricolage Grotesque + Newsreader** → khusus. Default bakal Inter atau
  Geist. Newsreader untuk body memberi karakter "surat pendek" yang cocok
  audience general.
- **Form-first split hero + strip pendek** → khusus. Default landing agency:
  hero besar → 3 kartu service identik → testimonial → CTA di bawah. Di sini
  form justru YANG hero.
- **Highlighter sweep pada success** → khusus. Default: fade-and-slide-up di
  setiap section. Momen ini terikat pada aksi user dan warna aksen — bukan
  "animasi supaya kelihatan hidup".
- **Copy Indonesian, sapa "kamu"** → khusus. Copy existing English "B2B
  partner" jelas mismatch dengan brief audience general.

---

## Yang akan diubah di kode (setelah plan di-approve)

1. `tailwind.config.ts` — extend token warna Ink/Paper/Card/Highlighter/Cobalt/
   Slate/Meadow, radius scale, shadow token.
2. `app/globals.css` — CSS variables + base body background Paper + font stack.
3. `app/layout.tsx` — load `Bricolage Grotesque` + `Newsreader` via
   `next/font/google`, expose sebagai CSS var.
4. `app/page.tsx` — rewrite jadi form-first split hero + strip bawah, copy
   Indonesian.
5. `components/ContactForm.tsx` — label Indonesian, tambah radio "Yang kamu
   butuhkan" (Web/Aplikasi/Otomasi/Lain), success screen dengan highlighter
   sweep + checkmark, error/focus states pakai palette baru.
6. `lib/lead-schema.ts` — tambah field `needs` optional enum, pesan error
   Indonesian.
7. `lib/motion.ts` — file baru untuk ease/dur token dari skill.

Tidak akan menyentuh: `app/api/**` (kecuali kalau schema berubah wajib
menyesuaikan parsing di sana — akan diperiksa saat implementasi).

---

**STOP — minta approval sebelum coding.**

Pertanyaan konkret buat kamu:

1. Nama placeholder `[NAMA AGENCY]` mau diganti apa? Kalau belum diputuskan,
   aku pakai `studio.` (lowercase, dengan titik) sebagai brand mark sementara.
2. Radio "Yang kamu butuhkan" — sudah cukup dengan 4 opsi (Web / Aplikasi /
   Otomasi / Lain)? Atau ada kategori lain yang mau kamu tampilkan?
3. Field `company` dan `website` di form existing — pertahankan atau buang?
   Rekomendasi: **buang keduanya** karena audience general banyak yang bukan
   perusahaan, dan lebih sedikit field = lebih tinggi konversi. Kalau ada
   info company, sudah bisa ditulis di "Cerita singkat".
