# Kuis Dedikasi Di Balik Rasa — Surya Nusantara

Demo interaktif berbasis web untuk pengalaman kuis kampanye **"Dedikasi Di Balik Rasa"** (Surya Nusantara). Demo ini dirancang mobile-first untuk diakses melalui pemindaian QR code atau tautan langsung di peramban web modern tanpa perlu instalasi aplikasi.

---

## 🛠️ Tech Stack

- **Package Manager & Runtime:** [Bun](https://bun.sh/) (v1.4+)
- **Frontend Framework:** [Astro](https://astro.build/) (v5.x, Static output)
- **Bahasa:** TypeScript (Strict mode)
- **Styling:** CSS bertema *Modern Nusantara Craftsmanship* (Brown `#28170F`, Gold `#C49A45`, Cream `#FAF7F0`)
- **Interaktivitas:** Vanilla TypeScript island controller (`src/scripts/game-controller.ts`)
- **Deployment Target:** Cloudflare Pages (Static Output)

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
