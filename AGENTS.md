# AGENTS.md --- Kuis Dedikasi Di Balik Rasa

## Project objective

Build a browser-based demo of **Kuis Dedikasi Di Balik Rasa** for client
review. The demo should communicate the complete participant journey: QR
entry, 21+ age gate, participant registration, brand-content
introduction, quiz instructions, 10-question session, answer feedback,
score calculation, and final result.

This is a **client-experience demo**, not a production participant-data
platform. Keep the experience polished and realistic while making demo
limitations explicit. Do not collect, transmit, or store real sensitive
personal data.

## Technology stack

-   **Package manager and runtime:** Bun.
-   **Frontend:** Astro, using Astro pages and components.
-   **Deployment target:** Cloudflare Pages for the demo.
-   **Language:** TypeScript.
-   **Styling:** CSS or Astro component-scoped styles. Keep dependencies
    lean.
-   **Interactivity:** Astro client-side islands or small vanilla
    TypeScript modules. Do not introduce a separate frontend framework
    unless explicitly requested.
-   **Data for the demo:** local mock data and an
    in-memory/session-based client state. Use `sessionStorage` only
    where refresh continuity materially improves the demo. Never treat
    client-side state as secure or authoritative.

Use Bun commands consistently (`bun install`, `bun run dev`,
`bun run build`). Configure Astro for Cloudflare Pages using the current
supported Astro Cloudflare adapter and deployment conventions. Do not
assume a server API or database exists.

## Product and source-of-truth requirements

The attached brief, *5. Brief Games - Kuis Dedikasi Di Balik Rasa.pdf*,
is the product reference. Preserve these requirements:

1.  The experience starts from a QR-code entry point. For the demo,
    provide a shareable landing URL and a visible QR placeholder or
    generated QR that points to the demo URL.
2.  Show an age confirmation gate before registration. Only participants
    who confirm they are **21 years old or older** may continue.
3.  Registration fields in the brief:
    -   Name / username
    -   Age
    -   City / domicile
    -   Occupation
    -   Current cigarette brand
4.  The brief's age dropdown lists `18–24`, `25–34`, `35–44`, and `45+`.
    Since the access requirement is 21+, the UI and validation must not
    allow an under-21 participant to proceed. Do not infer that
    selecting `18–24` proves the participant is 21+; use a separate age
    confirmation and a clear demo-only disclaimer.
5.  Show a short brand-content introduction. The brief says it can be
    skipped after the first 5 seconds.
6.  Show a brand-message / key-visual introduction before the quiz.
7.  Each game session contains **10 questions** from a bank of **40**:
    -   Alokasi pertanyaan bersifat fleksibel dan dapat dikonfigurasi oleh pengguna/klien (misalnya default 7 pertanyaan umum + 3 pertanyaan brand, atau rasio kombinasi bebas lainnya yang disesuaikan kebutuhan kampanye tanpa harus menjadi rumus kaku).
    -   Soal brand message tetap disediakan untuk menguji ingatan atas video dan narasi kampanye yang ditampilkan di awal.
8.  Each question has a **10-second answer timer** (durasi maksimal dapat dikonfigurasi melalui dashboard). The brief also
    specifies a **3-second reading/preparation interval before the timer
    starts** (peserta diberikan jeda 3 detik untuk membaca pertanyaan sebelum countdown menjawab dimulai).
9.  **Scoring Rules sesuai Brief:**
    -   Semakin cepat peserta menjawab, semakin besar poin yang diperoleh (mengikuti sisa waktu countdown timer di layar saat menjawab: detik ke-10 = 10 poin, detik ke-7 = 7 poin, detik ke-1 = 1 poin).
    -   Contoh eksplisit dalam brief: menjawab pada saat countdown timer menunjukkan detik ke-7 mendapatkan 7 poin.
    -   Jawaban salah menerima 0 poin dan menampilkan penjelasan edukatif.
    -   Timeout (kehabisan waktu) menerima 0 poin.
    -   Maksimal poin per soal adalah 10 poin (total 10 pertanyaan = maksimal 100 poin).
10. Di setiap pergantian butir soal (soal 1 ke 2, dst.), tampilkan layar transisi/loading dengan animasi spinner elegan, pesan brand (*brand message* narasi dedikasi rasa Surya Nusantara yang tematik dan variatif), serta tombol lanjut (*"Lanjut ke Pertanyaan Berikutnya"*). Setelah soal ke-10 selesai, tampilkan transisi kalkulasi skor akhir sebelum menampilkan *final score*.
11. Capture/reporting requirements in the brief include participant
    data, domicile/city, play date and time (timestamp), final score,
    total participants, score distribution, average score, participant
    city distribution, and session date. The demo may show
    illustrative/mock dashboard data only.
12. The result screen may include a redirect action to a supplied brand
    asset/channel. If no destination URL is provided, use a clearly
    labeled placeholder and do not invent a real destination.

## Important content and compliance boundaries

-   This is a tobacco-brand campaign brief. Keep the experience strictly
    behind the 21+ age gate and do not create youth-oriented content,
    gamification hooks aimed at minors, or imagery/copy that appeals to
    minors.
-   Do not encourage tobacco use, consumption, initiation, or increased
    consumption. The quiz should test recall of the supplied brand story
    and campaign content, not promote use.
-   Do not fabricate product claims, health claims, product superiority
    claims, legal statements, brand facts, or fun facts. Use only
    supplied source material or clearly marked placeholder content
    pending client approval.
-   Do not use real participant personal data in the demo. Use synthetic
    examples only.
-   The client-side age gate is a **demo interaction, not legally robust
    age verification**. State this in the README/demo notes. Production
    deployment requires an approved age-verification approach, privacy
    review, consent/notice, secure backend validation, and
    data-retention rules.
-   Do not expose technical hosting, infrastructure, or database details
    (such as Cloudflare, Cloudflare Pages, D1, SQLite, or internal stack
    names) on any client-facing web pages or dashboard views. The client
    and participants should not see hosting/vendor identifiers in the UI;
    keep all copy focused strictly on the brand narrative and clean
    business/campaign metrics.

## Participant experience and routes

Prefer a single-page guided flow or a small set of Astro routes with a
consistent visual shell. Keep navigation linear and prevent accidental
skipping of required steps.

Suggested stages:

1.  `/` --- Landing / QR entry.
2.  Age gate --- Confirm 21+.
3.  Registration --- Collect demo-only participant fields.
4.  Brand content --- Intro video/story; skip becomes available after 5
    seconds.
5.  Brand message --- Key visual and campaign message.
6.  Instructions --- Explain 10 questions, 10 seconds each, and scoring.
7.  Quiz --- Question, answer options, preparation countdown, answer
    timer, and progress.
8.  Feedback --- Correct/incorrect/timeout state; perolehan skor dan narasi penjelasan edukatif.
9.  Pergantian Soal / Transition --- Layar transisi di setiap pergantian pertanyaan dengan animasi loading, pesan brand kampanye (*brand message* Surya Nusantara), dan tombol lanjut; serta transisi kalkulasi skor akhir setelah butir soal terakhir.
10. Result --- Final score, score summary, play-again/reset action, and
    optional configured redirect.

Use accessible labels, keyboard-operable controls, visible focus states,
semantic HTML, and responsive layouts. Avoid relying on color alone to
communicate correctness or errors.

## Registration behavior

-   Make required fields explicit and validate them before continuing.
-   For the demo, use synthetic-safe inputs. Do not request phone
    number, email, identity number, precise address, or other fields not
    listed in the brief.
-   Age gate must happen before registration.
-   If a participant indicates they are under 21, stop the flow and show
    a neutral access-denied message. Do not expose the quiz.
-   If a participant chooses an age band that could include under-21
    ages (`18–24`), require a separate confirmation that they are
    already 21+. Do not treat the band alone as sufficient.
-   Clearly label any persistence as demo-only. Prefer not to persist
    registration data beyond the current browser session.

## Question Bank vs. Quiz Builder & Distribution Architecture

The system clearly separates question authoring from session composition and campaign distribution:

-   **Question Bank:** Tempat menyimpan seluruh butir soal kuis (katalog bank soal, status `Active`/`Draft`, kategori/pilar, tingkat kesulitan, 4 opsi pilihan ganda, kunci jawaban benar, narasi penjelasan edukatif, dan konfigurasi pesan brand opsional untuk slide transisi antar soal).
-   **Kategori Soal (Rancangan MVP Sederhana):** Entitas taksonomi untuk mengelompokkan topik butir soal tanpa *over-engineering* di sisi backend:
    -   Hanya memiliki 3 field esensial:
        1.  **Nama Kategori** (`name`, string, wajib) --- Contoh: *Warisan & Asal Usul*, *Keahlian & Ketelitian*, *Kearifan Petani Lokal*.
        2.  **Deskripsi** (`description`, text, opsional) --- Catatan singkat cakupan materi/topik butir soal.
        3.  **Status** (`status`, enum: `Active` / `Inactive`, default `Active`) --- Menentukan apakah kategori aktif digunakan saat kurasi soal.
    -   *Prinsip Desain Backend (BE):* Tidak membebani skema kategori dengan slug manual (cukup ID internal BE), warna UI, rekomendasi kuota sesi, atau penempatan slot (Q1–Q7 vs Q8–Q10), karena urusan komposisi sesi sepenuhnya didelegasikan secara fleksibel ke **Quiz Builder & Distribusi Soal**.
-   **Quiz Builder & Distribusi Soal:** Tempat mengatur bagaimana soal-soal tersebut dimainkan dan didistribusikan ke peserta. Sistem mendukung pembuatan **banyak distribusi kuis (*multiple distributions*)**, di mana setiap distribusi memiliki:
    -   **QR Code Unik & URL Akses:** Tautan dan QR code khusus untuk melacak titik masuk (entry point) per event, booth offline, roadshow, atau channel kampanye yang berbeda-beda.
    -   **Waktu Berlaku Distribusi (*Validity Period / Active Window*):** Pengaturan tanggal dan jam mulai (*start date/time*) serta tanggal dan jam berakhir (*end date/time*), memungkinkan admin membuat banyak distribusi dengan waktu aktivasi yang beragam dan terjadwal.
    -   **Status Distribusi:** `Draft`, `Scheduled`, `Active`, `Expired`, atau `Archived`.

### Flow Pembuatan Quiz & Distribusi Soal (8 Langkah)

1.  **Create New Quiz:**
    Admin memasukkan metadata quiz: nama quiz, nama campaign, deskripsi/tujuan, dan status awal.
2.  **Pilih Sumber Soal:**
    Sistem mengambil butir-butir soal dari **Question Bank** yang berstatus `Active`.
3.  **Tentukan Jumlah Soal per Set:**
    Menentukan total pertanyaan dalam satu sesi kuis (default sesuai brief: **10 pertanyaan**, dapat disesuaikan).
4.  **Atur Random Question (Pool Umum):**
    Posisi 1–7 (atau rentang yang ditentukan) dipilih secara acak. Admin dapat memilih dan menyaring kumpulan soal mana dari bank soal yang akan diikutsertakan dalam alokasi acak ini.
5.  **Atur Mandatory Question (Pool Khusus Brand Message / Konten Nusantara):**
    Posisi 8–10 (atau slot yang ditentukan) wajib menggunakan soal terkait *brand message* atau konten video/narasi kampanye. Di-setup langsung di flow pembuatan quiz dengan memilih soal mana yang mau digunakan.
6.  **Atur Timer dan Scoring:**
    -   *Preparation countdown (jeda membaca)*: 3 detik sebelum timer menjawab berjalan agar peserta dapat membaca pertanyaan secara saksama.
    -   *Answer duration (durasi maksimal menjawab)*: 10 detik per pertanyaan (dapat diatur / dikonfigurasi melalui dashboard admin).
    -   *Maximum score*: 10 poin per soal (maksimal 100 poin total untuk 10 pertanyaan).
    -   *Scoring model (sesuai brief)*: Semakin cepat peserta menjawab, semakin besar poin yang diperoleh sesuai nilai detik pada countdown timer di layar saat menjawab (detik 10 = 10 poin, detik 7 = 7 poin, detik 1 = 1 poin).
    -   *Wrong answer*: 0 poin (menampilkan penjelasan edukatif).
    -   *Timeout*: 0 poin jika peserta tidak memilih jawaban hingga durasi 10 detik habis.
7.  **Atur Feedback, Transisi Antar Soal, dan Hasil:**
    -   Jawaban salah atau waktu habis memunculkan penjelasan (*explanation*) edukatif.
    -   Di setiap pergantian soal (soal 1 ke 2, dst.), tampilkan layar transisi loading yang memuat *brand message* (nilai dedikasi rasa) dan tombol lanjut sebelum memulai jeda membaca soal berikutnya.
    -   Setelah sesi berakhir, tampilkan transisi loading kalkulasi skor lalu *final score*.
8.  **Preview dan Publish:**
    -   Admin mencoba simulasi 10 soal sebelum quiz dapat digunakan oleh peserta.
    -   Setelah di-publish, sistem otomatis menghasilkan **QR Code unik**, URL distribusi, dan menetapkan jendela waktu berlaku distribusi kuis.

## Quiz logic

Represent questions as typed data, not hard-coded markup. Each question
should include:

-   Stable question ID
-   Question text
-   Four answer options (unless the approved content specifies
    otherwise)
-   Correct option ID
-   Explanation for an incorrect answer
-   Category / pillar
-   Whether it belongs to the general bank pool or the brand-message pool
-   Brand message (opsional: pilar, judul, dan narasi pesan brand yang ditampilkan pada slide transisi saat soal ini dimainkan)

Selection rules:

-   Select unique questions according to user configuration (default: 7 general + 3 brand message, or customizable by the user/admin without rigid constraints).
-   Never repeat a question in the same session.
-   Shuffle answer-option order per question while preserving the
    correct option mapping.
-   If the demo content bank is incomplete, provide clearly marked
    sample questions for client review. Never present invented sample
    copy as approved campaign content.

Timer rules:

-   **Jeda Membaca 3 Detik:** Tampilkan *preparation/reading countdown* selama 3 detik sebelum timer menjawab dimulai agar peserta memiliki jeda yang cukup untuk membaca teks pertanyaan dan opsi jawaban dengan tenang.
-   **Durasi Menjawab Maksimal 10 Detik:** Setiap butir pertanyaan memiliki durasi maksimal 10 detik. Parameter durasi ini dapat diatur dan dikonfigurasi melalui antarmuka dashboard.
-   Kunci opsi jawaban segera setelah peserta memilih opsi atau ketika timer 10 detik habis (*timeout*).
-   Setiap pertanyaan hanya dapat dijawab satu kali (*no multiple submissions*).
-   Pada saat *timeout*, sistem mencatat jawaban tidak terjawab dengan perolehan 0 poin, lalu mengarahkan ke feedback/soal berikutnya.
-   Cegah double submission dan pastikan callback timer dibersihkan (*cleared*) saat beralih antar pertanyaan.
-   Pertahankan konsistensi timer meskipun tab browser beralih fokus (gunakan timer berbasis waktu sistem monotonik).

Pergantian Soal & Layar Transisi Brand:

-   Setelah peserta melihat feedback jawaban pada butir pertanyaan saat ini dan menekan tombol lanjut, sistem tidak langsung meloncat tiba-tiba ke butir soal berikutnya.
-   Sistem menampilkan layar jeda/transisi (*Question Transition Stage*) yang memuat:
    1.  **Animasi Loading Ring:** Indikator visual loading bernuansa emas elegan khas Surya Nusantara.
    2.  **Pesan Brand (*Brand Message*):** Narasi tematik yang mengomunikasikan pilar dedikasi, keahlian peracik, cengkih Maluku pilihan, tanah vulkanik Nusantara, dan komitmen rasa mantap. Pesan berganti secara dinamis pada tiap pergantian soal.
    3.  **Tombol Lanjut:** Tombol aksi (*"Lanjut ke Pertanyaan [X]"*) yang memberikan kendali penuh kepada peserta untuk melangkah ke pertanyaan berikutnya saat sudah siap.
-   Setelah peserta menekan tombol lanjut di layar transisi, sistem beralih ke soal berikutnya dan memulai jeda membaca 3 detik sebelum timer menjawab aktif.
-   Pada butir soal ke-10 (terakhir), transisi menampilkan kalkulasi skor akhir dengan pesan penutup dan tombol *"Lihat Hasil Akhir"*.

## Scoring rules & Frontend Game Specification

Sesuai ketentuan eksplisit dalam brief:

-   **Ketentuan Perolehan Poin:**
    -   **Semakin cepat peserta menjawab, semakin besar poin yang diperoleh** (mengikuti nilai detik pada countdown timer saat tombol jawaban ditekan).
    -   **Contoh perhitungan dalam brief:** Menjawab dengan benar pada saat countdown menunjukkan detik ke-7 menghasilkan **7 poin**.
    -   Tabel kalkulasi skor jawaban benar (pada durasi maksimal 10 detik):
        -   Countdown detik ke-10 (elapsed 0.00 – 1.00s / saat waktu 10 detik mulai): **10 poin**
        -   Countdown detik ke-9 (elapsed 1.01 – 2.00s): **9 poin**
        -   Countdown detik ke-8 (elapsed 2.01 – 3.00s): **8 poin**
        -   Countdown detik ke-7 (elapsed 3.01 – 4.00s): **7 poin**
        -   Countdown detik ke-6 (elapsed 4.01 – 5.00s): **6 poin**
        -   Countdown detik ke-5 (elapsed 5.01 – 6.00s): **5 poin**
        -   Countdown detik ke-4 (elapsed 6.01 – 7.00s): **4 poin**
        -   Countdown detik ke-3 (elapsed 7.01 – 8.00s): **3 poin**
        -   Countdown detik ke-2 (elapsed 8.01 – 9.00s): **2 poin**
        -   Countdown detik ke-1 (elapsed 9.01 – 10.00s): **1 poin**
-   **Jawaban Salah:** Mendapatkan **0 poin** dan menampilkan penjelasan edukatif (*educational explanation*).
-   **Timeout (Waktu Habis):** Mendapatkan **0 poin**.
-   **Skor Maksimal Total:** 10 butir pertanyaan × maksimal 10 poin = **100 poin**.

Kalkulasi skor menggunakan sisa waktu (`maxDuration - elapsedSeconds`) yang dibulatkan ke atas (`Math.ceil`), sehingga angka poin selalu selaras dengan angka countdown detik di antarmuka kuis. Jaga fungsi penilaian (`calculateQuestionScore`) tetap terisolasi dan teruji unit test secara ketat.

## Visual direction

Follow the supplied brief's visual direction:

-   Primary palette: dark brown, gold, and cream accents.
-   Mood: craftsmanship, competence, dedication, and expertise.
-   Visual treatment: warm, clean, premium, and restrained.
-   Typography: bold, clear, readable.
-   Use supplied approved campaign assets where available. Do not
    recreate or alter logos, pack imagery, warning labels, or regulated
    product assets.
-   Keep the interface mobile-first because the primary entry is QR
    scanning on a phone.
-   Ensure sufficient contrast and comfortable touch targets.

Avoid youth-coded visual language, cartoonish characters, school-like
motifs, or playful mechanics that could appeal to minors.

## Cloudflare demo deployment

-   Target **Cloudflare Pages**.
-   Use Astro's supported Cloudflare adapter and static output where
    possible. Do not add Workers APIs or server-side functionality
    unless the project genuinely needs them and the deployment
    configuration is updated deliberately.
-   Keep the demo deployable from a clean checkout using Bun.
-   Document required Cloudflare build settings in `README.md`,
    including the Bun install/build commands and the generated output
    directory appropriate to the chosen Astro adapter.
-   Use environment variables only for non-secret demo configuration.
    Never put secrets in `PUBLIC_*` variables or client bundles.
-   If a redirect URL or campaign asset URL is configurable, provide a
    safe placeholder default and explain how to replace it.
-   Test the production build locally before declaring the Cloudflare
    demo ready.

## Quality requirements

-   TypeScript types for registration data, question data, answers,
    session state, and score results.
-   Keep game state transitions explicit and predictable.
-   Separate content data, scoring logic, and UI components.
-   Add tests for question selection, no-repeat behavior, scoring,
    timeout, and age-gate validation where a test setup is available.
-   Handle refresh, back navigation, and repeated clicks without
    duplicate submissions or score inflation.
-   Include empty, loading, error, denied-age, and completed states.
-   Check mobile viewport behavior and keyboard accessibility.
-   Do not claim production security, identity verification, analytics,
    or persistent reporting when the demo only uses browser-side mock
    data.

## Suggested project structure

``` text
.
├── AGENTS.md
├── README.md
├── astro.config.mjs
├── package.json
├── bun.lock
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── AppShell.astro
│   │   ├── AgeGate.astro
│   │   ├── RegistrationForm.astro
│   │   ├── BrandIntro.astro
│   │   ├── QuizInstructions.astro
│   │   ├── QuizQuestion.astro
│   │   ├── AnswerFeedback.astro
│   │   └── FinalScore.astro
│   ├── data/
│   │   ├── questions.ts
│   │   └── fun-facts.ts
│   ├── lib/
│   │   ├── game-session.ts
│   │   ├── question-selection.ts
│   │   ├── scoring.ts
│   │   └── validation.ts
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/
│   │   └── game-controller.ts
│   └── styles/
│       └── global.css
└── tests/
    ├── scoring.test.ts
    └── question-selection.test.ts
```

This structure is a starting point, not a requirement to create every
file if a simpler implementation is more appropriate.

## Agent workflow

When implementing:

1.  Inspect the existing repository before changing files.
2.  Preserve existing project conventions if they do not conflict with
    this brief.
3.  Confirm the Bun + Astro + Cloudflare Pages setup and avoid adding
    unnecessary dependencies.
4.  Implement the complete happy path first, then denied-age,
    validation, timeout, refresh, and error states.
5.  Use mock content clearly labeled for review wherever approved
    campaign content is unavailable.
6.  Run formatting, tests, and `bun run build` where scripts exist.
7.  Fix build and type errors before reporting completion.
8.  Summarize what was implemented, how to run it locally, how to deploy
    it to Cloudflare Pages, and what still requires client approval.

## Acceptance criteria

The demo is ready for client review when:

-   A user can open the landing page on mobile and desktop.
-   A user under 21 cannot proceed past the age gate.
-   A 21+ user can complete the registration flow with the brief's
    fields.
-   Brand content and the brand-message step appear before the quiz.
-   The content skip control appears only after 5 seconds.
-   A session contains 10 questions with flexible, user-configurable pool allocation (default: 7 general + 3 brand message, customizable).
-   Each question has a 3-second reading/preparation interval and a 10-second answer timer (durasi maksimal dapat diatur dari dashboard).
-   Di setiap pergantian butir soal kuis terdapat layar transisi loading yang memuat animasi spinner, pesan brand Surya Nusantara, dan tombol lanjut ke soal berikutnya.
-   Scoring mengikuti ketentuan brief: semakin cepat menjawab semakin besar poin yang diperoleh sesuai countdown timer (countdown 10s: detik ke-10 = 10 poin, detik ke-7 = 7 poin, detik ke-1 = 1 poin); jawaban salah atau timeout = 0 poin.
-   Correct, incorrect, and timeout paths work and cannot submit twice.
-   The final score is calculated from the 10 question results and
    cannot exceed 100.
-   The result screen displays the score and a reset/replay action.
-   The UI is responsive, accessible, and consistent with the supplied
    visual direction.
-   The app builds successfully with Bun and is ready for Cloudflare
    Pages demo deployment.
-   Demo limitations and production requirements are documented clearly.
