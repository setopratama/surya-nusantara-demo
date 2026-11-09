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
    -   Questions 1--7: randomly selected from the question bank.
    -   Questions 8--10: must relate to the brand message or the content
        shown at the beginning.
8.  Each question has a **10-second answer timer**. The brief also
    specifies a **3-second reading/preparation interval before the timer
    starts**.
9.  Correct answers receive points based on response time. Incorrect
    answers receive 0 points and show an explanation. Timeout receives 0
    points.
10. After the quiz, show a loading / transition state with local
    Nusantara fun-fact placeholder content, then show the final score.
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
8.  Feedback --- Correct/incorrect state; show explanation for incorrect
    answers.
9.  Transition --- Brief loading state with approved or placeholder fun
    fact.
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
-   Whether it is eligible for the random first-seven pool or reserved
    for the final-three brand-message pool

Selection rules:

-   Select 7 unique questions randomly from the eligible general bank.
-   Select 3 questions from the brand-message pool for positions 8--10.
-   Never repeat a question in the same session.
-   Shuffle answer-option order per question while preserving the
    correct option mapping.
-   If the demo content bank is incomplete, provide clearly marked
    sample questions for client review. Never present invented sample
    copy as approved campaign content.

Timer rules:

-   Show the 3-second preparation interval before starting each
    10-second answer timer.
-   Lock answer selection immediately after a choice or timeout.
-   A question can be answered only once.
-   On timeout, record an unanswered result with 0 points and continue.
-   Prevent double submission and stale timer callbacks when moving
    between questions.
-   Keep timer behavior consistent when the browser tab loses focus; do
    not silently grant extra time. For the demo, use a monotonic client
    timer and document that it is not tamper-proof.

## Scoring rules

The brief states that each question is worth up to 10 points, that
faster answers earn more points, that an answer at the 7th second earns
7 points, and that wrong answers earn 0 points. It gives a maximum of
100 points across 10 questions.

Implement the demo scoring as follows, matching the brief's example:

-   Correct answer: points equal the elapsed answer-second bucket, from
    1 to 10.
-   Incorrect answer: 0 points.
-   Timeout: 0 points.
-   Maximum possible score: 100.

Use the answer timer's elapsed time to determine the bucket. Clamp valid
correct-answer scores to 1--10. Keep the scoring function isolated and
unit-testable.

**Scoring clarification for client approval:** The brief's wording can
be interpreted differently from a conventional countdown bonus (where
more remaining time means more points). The explicit example says an
answer at second 7 receives 7 points. Follow that example for the demo
and flag the scoring interpretation for confirmation before production.

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
-   A session contains exactly 10 questions with the required 7 + 3
    selection structure.
-   Each question has a 3-second preparation interval and a 10-second
    answer timer.
-   Correct, incorrect, and timeout paths work and cannot submit twice.
-   The final score is calculated from the 10 question results and
    cannot exceed 100.
-   The result screen displays the score and a reset/replay action.
-   The UI is responsive, accessible, and consistent with the supplied
    visual direction.
-   The app builds successfully with Bun and is ready for Cloudflare
    Pages demo deployment.
-   Demo limitations and production requirements are documented clearly.
