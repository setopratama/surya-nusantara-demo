# Kuis Dedikasi Di Balik Rasa — Surya Nusantara

Demo interaktif berbasis web untuk pengalaman kuis kampanye **"Dedikasi Di Balik Rasa"** (Surya Nusantara). Demo ini dirancang mobile-first untuk diakses melalui pemindaian QR code atau tautan langsung di peramban web modern tanpa perlu instalasi aplikasi.

---

## 🛠️ Tech Stack

- **Package Manager & Runtime:** [Bun](https://bun.sh/) (v1.4+)
- **Frontend Framework:** [Astro](https://astro.build/) (v5.x, Static output + Dashboard `/dashboard`)
- **Backend Framework:** [Hono](https://hono.dev/) (`hono/cloudflare-pages` di `functions/api/[[route]].ts`)
- **ORM & Database:** [Drizzle ORM](https://orm.drizzle.team/) + Cloudflare D1 (Serverless SQLite)
- **Bahasa:** TypeScript (Strict mode)
- **Styling:** CSS bertema *Modern Nusantara Craftsmanship* (Brown `#28170F`, Gold `#C49A45`, Cream `#FAF7F0`)
- **Interaktivitas:** Vanilla TypeScript island controller (`src/scripts/game-controller.ts`)
- **Deployment Target:** Cloudflare Pages (`https://surya-nusantara.pages.dev`)

---

## 🚀 Menjalankan Secara Lokal

Pastikan Anda telah memasang **Bun**.

```bash
# 1. Pasang dependensi
bun install

# 2. Jalankan unit test
bun test

# 3. Jalankan server pengembangan lokal
bun run dev

# 4. Bangun untuk produksi
bun run build
```

Hasil build akan berada di direktori `dist/`.

---

## ☁️ Panduan Deploy ke Cloudflare Pages

Demo ini menggunakan output statis Astro yang sangat optimal untuk Cloudflare Pages:

### Opsi A: Deploy Langsung via Wrangler CLI

Pastikan Anda sudah login ke akun Cloudflare di peramban/terminal Anda (`bun x wrangler login`).

```bash
# 1. Preview simulasi lokal Cloudflare Pages runtime
bun run pages:dev

# 2. Build dan deploy langsung ke Cloudflare Pages
bun run deploy
```

Wrangler akan otomatis menggunakan konfigurasi pada `wrangler.jsonc` (project name: `surya-nusantara`, output: `./dist`), dan aplikasi akan ter-deploy ke **`https://surya-nusantara.pages.dev`**.

### Opsi B: Git Integration (Dashboard Cloudflare Pages)

Jika repo terhubung langsung ke Git di dashboard Cloudflare:
1. **Framework Preset:** `None` / `Astro`
2. **Build Command:** `bun run build`
3. **Build Output Directory:** `dist`
4. **Environment Variables:**
   - `BUN_VERSION`: `1.4.4` (atau versi terkini)

---

## 📱 Alur Pengalaman Peserta (User Journey)

1. **Screen 0 & 1 — Entry QR & Age Gate (21+):**
   - Peserta mengonfirmasi apakah berusia 21 tahun atau lebih.
   - Peserta di bawah 21 tahun langsung diarahkan ke layar *Akses Dibatasi* (neutral exit) dan tidak dapat mengakses registrasi atau kuis.
2. **Screen 2 — Registrasi Peserta (Demo-Safe):**
   - Nama / Username
   - Rentang usia (`18–24`, `25–34`, `35–44`, `45+`)
   - Checkbox wajib pernyataan sadar berusia 21+
   - Domisili kota (pilihan kota Indonesia)
   - Bidang pekerjaan
   - Merek rokok yang dikonsumsi saat ini
3. **Screen 3 — Pengenalan Kampanye (Video TVC):**
   - Memutar video kampanye `tvc-surya-nusantara.mp4`.
   - Tombol **Lewati (Skip)** terkunci dan baru dapat ditekan setelah **5 detik pertama**.
4. **Screen 4 — Pesan Kampanye (Key Visual & Value Pillars):**
   - Memaparkan nilai *Dedikasi Di Balik Rasa*: Ketelitian Waktu, Keahlian Tangan, dan Rasa Mantap.
5. **Screen 5 — Panduan Kuis:**
   - Penjelasan aturan 10 soal, jeda membaca 3 detik, timer menjawab 10 detik, dan sistem skor.
6. **Screen 6 & 7 — Sesi Kuis 10 Soal & Feedback:**
   - **Struktur Soal:** 7 soal pertama dipilih acak dari bank soal umum warisan & dedikasi Nusantara; 3 soal terakhir (soal 8–10) khusus pesan kampanye Surya Nusantara.
   - Opsi A, B, C, D diacak urutannya untuk setiap pertanyaan.
   - **Jeda Membaca:** 3 detik persiapan sebelum timer menjawab aktif.
   - **Timer Menjawab:** 10 detik dengan timer monotonik (*anti-freeze/drift*). Pilihan langsung terkunci setelah ditekan untuk mencegah *double submit*.
   - **Feedback Langsung:** Menampilkan status Benar/Salah/Timeout, perolehan poin, dan penjelasan rinci (*explanation*).
7. **Screen 8 — Transisi & Fun Facts Nusantara:**
   - Animasi loading anggun berputar menampilkan fakta menarik seputar tanah dan kekayaan Nusantara.
8. **Screen 9 — Hasil Akhir & Skor:**
   - Tampilan skor akhir mencolok (maksimal 100 poin).
   - Rating bintang dan apresiasi dedikasi.
   - Rincian performa per pertanyaan (S1–S10).
   - Tombol **Main Lagi** (mengacak 10 soal baru dan mereset sesi).
   - Tombol **Kunjungi Surya Nusantara** (placeholder redirect).

---

## 🗄️ Database Cloudflare D1 (SQLite)

Project ini dilengkapi integrasi **Cloudflare D1 (Serverless SQLite)** untuk mencatat data peserta dan performa kuis secara otomatis:

### Tabel Database (`schema.sql`):
1. `participants`: Menyimpan data diri peserta (ID, nama/username, rentang usia, konfirmasi 21+, kota domisili, pekerjaan, preferensi merek, timestamp).
2. `quiz_sessions`: Menyimpan sesi permainan kuis (ID sesi, ID peserta, total skor, status selesai, waktu mulai & selesai).
3. `quiz_answers`: Menyimpan rincian 10 jawaban per sesi (ID pertanyaan, opsi yang dipilih, benar/salah, detik menjawab, perolehan poin).

### API Endpoints (Cloudflare Pages Functions):
- `POST /api/register` : Menerima data pendaftaran dan membuat sesi baru di D1.
- `POST /api/submit-quiz` : Menyimpan 10 rincian jawaban dan memperbarui skor akhir sesi di D1.
- `GET /api/stats` : Mengambil agregasi metrik (total peserta, rata-rata skor, distribusi nilai, kota peserta teratas).

### Perintah Manajemen D1:
```bash
# 1. Inisialisasi skema tabel di D1 lokal
bun run d1:init:local

# 2. Buat database D1 di Cloudflare (remote)
bun x wrangler d1 create surya-nusantara-d1

# 3. Jalankan skema ke database D1 di Cloudflare (remote)
bun run d1:init:remote
```

---

## 🎯 Rumus Penghitungan Skor (Sesuai Brief)

- **Jawaban Benar:** Mendapatkan poin sesuai bucket detik saat menjawab (1 s.d. 10 poin). *Contoh dari brief: menjawab di detik ke-7 = 7 poin.*
- **Jawaban Salah:** 0 poin.
- **Waktu Habis (Timeout):** 0 poin.
- **Skor Maksimal:** 100 poin (dari 10 pertanyaan).

---

## ⚖️ Batasan Demo & Catatan Kepatuhan Regulasi (Compliance)

- **Kepatuhan Usia 21+:** Konten ditujukan secara eksklusif untuk perokok dewasa berusia 21 tahun ke atas. Tidak mengandung ilustrasi kartun, nuansa anak-anak, atau ajakan untuk mulai merokok.
- **Bukan Platform Produksi:** Demo ini murni menggunakan state *in-memory* di sisi peramban dan `sessionStorage` lokal tanpa mengirimkan data pribadi riil ke server eksternal.
- **Age Gate Client-Side:** Verifikasi usia pada demo ini adalah simulasi antarmuka. Implementasi produksi memerlukan mekanisme verifikasi identitas resmi, peninjauan privasi (*privacy notice & consent*), serta validasi backend yang aman.

---

## 📌 Poin yang Memerlukan Konfirmasi Klien Sebelum Produksi

1. **Sinkronisasi Rentang Usia:** Pada brief terdapat opsi rentang `18–24` tahun namun aturan akses adalah `21+`. Saat ini sistem menambahkan checkbox konfirmasi 21+ wajib. Perlu konfirmasi apakah opsi usia akan diubah menjadi `21–24` pada tahap produksi.
2. **Formula Skor Alternatif:** Brief mengilustrasikan "menjawab di detik ke-7 mendapat 7 poin". Klien perlu mengonfirmasi apakah formula ini yang diinginkan, atau sistem countdown konvensional (semakin cepat menjawab / sisa waktu lebih banyak = poin lebih tinggi).
3. **Aset Resmi:** Penempatan logo resmi SVG beresolusi tinggi, visual kampanye final, serta URL destinasi resmi untuk tombol redirect akhir.
