import { selectSessionQuestions } from '../lib/question-selection';
import { calculateQuestionScore, calculateTotalScore } from '../lib/scoring';
import { validateRegistration } from '../lib/validation';
import { QUESTIONS_BANK } from '../data/questions';
import { NUSANTARA_FUN_FACTS } from '../data/fun-facts';
import { BRAND_TRANSITION_MESSAGES } from '../data/brand-messages';
import type { GameStage, ParticipantRegistration, Question, QuestionResult } from '../lib/types';

// ─────────────────────────────────────────
// State
// ─────────────────────────────────────────

type GameState = {
  stage: GameStage;
  registration: ParticipantRegistration | null;
  sessionId: string | null;
  sessionQuestions: Question[];
  currentQuestionIndex: number;
  results: QuestionResult[];
  timerStartedAt: number | null;
  readingTimerId: ReturnType<typeof setTimeout> | null;
  answerTimerId: ReturnType<typeof setInterval> | null;
  answerLocked: boolean;
};

const state: GameState = {
  stage: 'age_gate',
  registration: null,
  sessionId: null,
  sessionQuestions: [],
  currentQuestionIndex: 0,
  results: [],
  timerStartedAt: null,
  readingTimerId: null,
  answerTimerId: null,
  answerLocked: false,
};

// ─────────────────────────────────────────
// DOM helpers
// ─────────────────────────────────────────

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function showStage(stage: GameStage) {
  const stageMap: Record<GameStage, string> = {
    age_gate: 'stage-age-gate',
    age_denied: 'stage-age-denied',
    registration: 'stage-registration',
    brand_intro: 'stage-brand-intro',
    brand_message: 'stage-brand-message',
    instructions: 'stage-instructions',
    quiz: 'stage-quiz',
    transition: 'stage-transition',
    result: 'stage-result',
  };

  // Hide all stages
  Object.values(stageMap).forEach((id) => {
    const el = $(id);
    if (el) el.style.display = 'none';
  });

  // Show target stage
  const target = $(stageMap[stage]);
  if (target) {
    target.style.display = '';
    // Move focus to the stage for accessibility
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: false });
    setTimeout(() => target.removeAttribute('tabindex'), 300);
  }

  state.stage = stage;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─────────────────────────────────────────
// Age Gate
// ─────────────────────────────────────────

function initAgeGate() {
  const btnSubmit = $('btn-submit-age');
  const btnResetDenied = $('btn-reset-denied');
  const errorMsg = $('age-error-msg');

  btnSubmit?.addEventListener('click', () => {
    const selected = document.querySelector<HTMLInputElement>('input[name="age-confirm"]:checked');

    if (!selected) {
      if (errorMsg) errorMsg.style.display = '';
      return;
    }

    if (errorMsg) errorMsg.style.display = 'none';

    if (selected.value === 'yes') {
      showStage('registration');
    } else {
      showStage('age_denied');
    }
  });

  btnResetDenied?.addEventListener('click', () => {
    // Clear selection before returning
    document.querySelectorAll<HTMLInputElement>('input[name="age-confirm"]').forEach((r) => {
      r.checked = false;
    });
    if (errorMsg) errorMsg.style.display = 'none';
    showStage('age_gate');
  });
}

// ─────────────────────────────────────────
// Registration
// ─────────────────────────────────────────

function initRegistration() {
  const form = $('form-registration') as HTMLFormElement | null;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    submitRegistration();
  });

  $('btn-submit-registration')?.addEventListener('click', (e) => {
    e.preventDefault();
    submitRegistration();
  });
}

function submitRegistration() {
  const name = ($('reg-name') as HTMLInputElement)?.value.trim() ?? '';
  const ageBand = ($('reg-age') as HTMLSelectElement)?.value as ParticipantRegistration['ageBand'];
  const isConfirmed21Plus = ($('reg-confirm-21') as HTMLInputElement)?.checked ?? false;
  const domicile = ($('reg-domicile') as HTMLSelectElement)?.value ?? '';
  const occupation = ($('reg-occupation') as HTMLSelectElement)?.value ?? '';
  const currentBrand = ($('reg-brand') as HTMLSelectElement)?.value ?? '';

  const payload: Partial<ParticipantRegistration> = {
    name, ageBand, isConfirmed21Plus, domicile, occupation, currentBrand,
  };

  const { isValid, errors } = validateRegistration(payload);

  // Show / clear field errors
  const errorMap: Record<string, string> = {
    name: 'err-name',
    ageBand: 'err-age',
    isConfirmed21Plus: 'err-confirm-21',
    domicile: 'err-domicile',
    occupation: 'err-occupation',
    currentBrand: 'err-brand',
  };

  Object.entries(errorMap).forEach(([field, errorId]) => {
    const el = $(errorId);
    if (!el) return;
    const msg = (errors as Record<string, string | undefined>)[field];
    if (msg) {
      el.textContent = msg;
      el.style.display = '';
    } else {
      el.textContent = '';
      el.style.display = 'none';
    }
  });

  if (!isValid) return;

  state.registration = payload as ParticipantRegistration;

  // Persist demo-only registration to sessionStorage
  try {
    sessionStorage.setItem('sn_demo_registration', JSON.stringify(state.registration));
  } catch {}

  // Sync to Cloudflare D1 (SQLite)
  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.registration),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: any) => {
      if (data?.sessionId) {
        state.sessionId = data.sessionId;
        try {
          sessionStorage.setItem('sn_demo_session_id', data.sessionId);
        } catch {}
      }
    })
    .catch(() => {
      // Graceful fallback for offline / purely static preview
    });

  showStage('brand_intro');
  initBrandIntro();
}

// ─────────────────────────────────────────
// Brand Intro (video + 5 s skip gate)
// ─────────────────────────────────────────

function initBrandIntro() {
  const video = $('brand-intro-video') as HTMLVideoElement | null;
  const btnSkip = $('btn-skip-intro') as HTMLButtonElement | null;
  const skipCountdownEl = $('skip-seconds');
  const countdownPill = $('skip-countdown-pill');

  if (!video || !btnSkip) return;

  let skipUnlocked = false;
  let countdown = 5;

  function unlockSkip() {
    if (skipUnlocked) return;
    skipUnlocked = true;
    btnSkip.disabled = false;
    if (countdownPill) countdownPill.style.display = 'none';
    btnSkip.setAttribute('aria-label', 'Lewati pengenalan kampanye dan lanjutkan ke pesan merek');
  }

  // Start countdown when video starts playing
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  function startSkipCountdown() {
    if (countdownInterval) return; // Don't start twice
    countdownInterval = setInterval(() => {
      countdown -= 1;
      if (skipCountdownEl) skipCountdownEl.textContent = String(Math.max(0, countdown));
      if (countdown <= 0) {
        if (countdownInterval) clearInterval(countdownInterval);
        unlockSkip();
      }
    }, 1000);
  }

  video.addEventListener('play', startSkipCountdown, { once: true });

  // Also start countdown on video error (fallback)
  video.addEventListener('error', () => {
    startSkipCountdown();
  });

  // Auto-start countdown even if video doesn't autoplay (user may not interact)
  setTimeout(startSkipCountdown, 500);

  btnSkip.addEventListener('click', () => {
    if (!skipUnlocked) return;
    video.pause();
    if (countdownInterval) clearInterval(countdownInterval);
    showStage('brand_message');
    initBrandMessage();
  });
}

// ─────────────────────────────────────────
// Brand Message
// ─────────────────────────────────────────

function initBrandMessage() {
  $('btn-to-instructions')?.addEventListener('click', () => {
    showStage('instructions');
    initInstructions();
  });
}

// ─────────────────────────────────────────
// Instructions
// ─────────────────────────────────────────

function initInstructions() {
  $('btn-start-quiz')?.addEventListener('click', () => {
    startQuiz();
  });
}

// ─────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────

function getMaxAnswerDuration(): number {
  try {
    const params = new URLSearchParams(window.location.search);
    const qTimer = params.get('timer') || params.get('duration');
    if (qTimer && !isNaN(Number(qTimer))) {
      const val = Number(qTimer);
      if (val >= 3 && val <= 60) return val;
    }
    const sessionTimer = sessionStorage.getItem('sn_quiz_duration');
    if (sessionTimer && !isNaN(Number(sessionTimer))) {
      const val = Number(sessionTimer);
      if (val >= 3 && val <= 60) return val;
    }
  } catch {}
  return 10;
}

function startQuiz() {
  state.sessionQuestions = selectSessionQuestions(QUESTIONS_BANK);
  state.currentQuestionIndex = 0;
  state.results = [];
  showStage('quiz');
  loadQuestion(0);
}

function loadQuestion(index: number) {
  const q = state.sessionQuestions[index];
  if (!q) return;

  // Lock answering during the 3-second reading/preparation interval
  state.answerLocked = true;
  state.timerStartedAt = null;

  // Clear any stale timers
  clearTimers();

  // Update progress
  const numEl = $('quiz-current-num');
  const progressFill = $('quiz-progress-fill');
  const progressTrack = progressFill?.parentElement;
  if (numEl) numEl.textContent = String(index + 1);
  if (progressFill) progressFill.style.width = `${((index + 1) / 10) * 100}%`;
  if (progressTrack) {
    progressTrack.setAttribute('aria-valuenow', String(index + 1));
  }

  // Show/hide brand pool tag
  const poolTag = $('brand-pool-tag');
  if (poolTag) poolTag.style.display = q.isBrandPool ? '' : 'none';

  // Set question text
  const qText = $('quiz-question-text');
  if (qText) qText.textContent = q.text;

  // Render answer options (initially in reading-phase locked state)
  renderOptions(q, true);

  // Hide feedback panel
  const feedbackPanel = $('quiz-feedback-panel');
  if (feedbackPanel) feedbackPanel.style.display = 'none';

  // Show reading timer, hide answer timer
  const readingIndicator = $('timer-reading-indicator');
  const activeIndicator = $('timer-active-indicator');
  if (readingIndicator) {
    readingIndicator.style.display = '';
    const readingCountdown = $('reading-countdown');
    if (readingCountdown) readingCountdown.textContent = '3s';
  }
  if (activeIndicator) activeIndicator.style.display = 'none';

  // 3-second reading phase
  let readingLeft = 3;
  state.readingTimerId = setInterval(() => {
    readingLeft -= 1;
    const readingCountdown = $('reading-countdown');
    if (readingCountdown) readingCountdown.textContent = `${Math.max(0, readingLeft)}s`;

    if (readingLeft <= 0) {
      clearInterval(state.readingTimerId!);
      state.readingTimerId = null;
      startAnswerTimer(q);
    }
  }, 1000);
}

function renderOptions(q: Question, isReadingPhase = false) {
  const container = $('quiz-options-list');
  if (!container) return;

  container.innerHTML = '';

  q.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quiz-option-btn${isReadingPhase ? ' reading-phase' : ''}`;
    btn.setAttribute('data-option-id', opt.id);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.setAttribute('aria-label', `Pilihan ${opt.id}: ${opt.text}`);
    if (isReadingPhase) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
    }

    const badge = document.createElement('span');
    badge.className = 'quiz-option-badge';
    badge.textContent = opt.id;
    badge.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'quiz-option-text';
    text.textContent = opt.text;

    btn.appendChild(badge);
    btn.appendChild(text);

    btn.addEventListener('click', () => handleAnswer(opt.id, q));

    container.appendChild(btn);
  });
}

function startAnswerTimer(q: Question) {
  const readingIndicator = $('timer-reading-indicator');
  const activeIndicator = $('timer-active-indicator');
  const countdownEl = $('answer-countdown');

  if (readingIndicator) readingIndicator.style.display = 'none';
  if (activeIndicator) activeIndicator.style.display = '';

  // Unlock options for participant selection
  state.answerLocked = false;
  const container = $('quiz-options-list');
  if (container) {
    container.querySelectorAll<HTMLButtonElement>('.quiz-option-btn').forEach((btn) => {
      btn.classList.remove('reading-phase');
      btn.disabled = false;
      btn.setAttribute('aria-disabled', 'false');
    });
  }

  state.timerStartedAt = performance.now();
  const maxDuration = getMaxAnswerDuration();
  let secondsLeft = maxDuration;

  if (countdownEl) countdownEl.textContent = `${secondsLeft}s`;

  state.answerTimerId = setInterval(() => {
    secondsLeft -= 1;
    if (countdownEl) countdownEl.textContent = `${Math.max(0, secondsLeft)}s`;

    // Apply urgency styling at ≤ 3 seconds
    if (secondsLeft <= 3 && activeIndicator) {
      activeIndicator.classList.add('urgent');
    }

    if (secondsLeft <= 0) {
      clearTimers();
      handleTimeout(q);
    }
  }, 1000);
}

function handleAnswer(selectedOptionId: string, q: Question) {
  if (state.answerLocked) return;
  state.answerLocked = true;
  clearTimers();

  const maxDuration = getMaxAnswerDuration();
  const elapsed = state.timerStartedAt
    ? (performance.now() - state.timerStartedAt) / 1000
    : maxDuration;

  const isCorrect = selectedOptionId === q.correctOptionId;
  const points = calculateQuestionScore(isCorrect, elapsed, false, maxDuration);

  const result: QuestionResult = {
    questionId: q.id,
    selectedOptionId,
    isCorrect,
    elapsedSeconds: elapsed,
    pointsEarned: points,
  };

  state.results.push(result);
  lockOptions(selectedOptionId, q.correctOptionId, isCorrect);
  showFeedback(isCorrect, false, points, q.explanation, elapsed);
}

function handleTimeout(q: Question) {
  if (state.answerLocked) return;
  state.answerLocked = true;

  const maxDuration = getMaxAnswerDuration();
  const result: QuestionResult = {
    questionId: q.id,
    selectedOptionId: null,
    isCorrect: false,
    elapsedSeconds: maxDuration,
    pointsEarned: 0,
  };

  state.results.push(result);
  lockOptions(null, q.correctOptionId, false);
  showFeedback(false, true, 0, q.explanation);
}

function lockOptions(selectedId: string | null, correctId: string, isCorrect: boolean) {
  const container = $('quiz-options-list');
  if (!container) return;

  container.querySelectorAll<HTMLButtonElement>('.quiz-option-btn').forEach((btn) => {
    const optId = btn.getAttribute('data-option-id');
    btn.disabled = true;
    btn.setAttribute('aria-checked', optId === selectedId ? 'true' : 'false');

    if (optId === correctId) {
      btn.classList.add('state-correct');
    } else if (optId === selectedId && !isCorrect) {
      btn.classList.add('state-wrong');
    }
  });

  // Remove urgency timer styling
  $('timer-active-indicator')?.classList.remove('urgent');
}

function showFeedback(
  isCorrect: boolean,
  isTimeout: boolean,
  points: number,
  explanation: string,
  elapsedSeconds?: number
) {
  const panel = $('quiz-feedback-panel');
  const iconBox = $('feedback-icon');
  const title = $('feedback-title');
  const scoreGain = $('feedback-score-gain');
  const explanationEl = $('feedback-explanation');
  const nextBtn = $('btn-next-question');
  const nextBtnLabel = $('btn-next-label');

  if (!panel || !iconBox || !title || !scoreGain || !explanationEl || !nextBtn) return;

  if (isTimeout) {
    iconBox.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8a80" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    title.textContent = 'Waktu Habis!';
    title.style.color = '#ff8a80';
    scoreGain.textContent = '+0 poin (Waktu menjawab habis)';
    scoreGain.style.color = '#ff8a80';
  } else if (isCorrect) {
    iconBox.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
    title.textContent = 'Jawaban Benar!';
    title.style.color = '#6ee7b7';
    scoreGain.textContent = `+${points} poin (Menjawab di detik ke-${points})`;
    scoreGain.style.color = '#6ee7b7';
  } else {
    iconBox.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8a80" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    title.textContent = 'Jawaban Belum Tepat';
    title.style.color = '#ff8a80';
    scoreGain.textContent = '+0 poin';
    scoreGain.style.color = '#ff8a80';
  }

  // Show explanation for incorrect or timeout
  if (!isCorrect || isTimeout) {
    explanationEl.textContent = explanation;
    explanationEl.style.display = '';
  } else {
    explanationEl.style.display = 'none';
  }

  const isLast = state.currentQuestionIndex >= 9;
  if (nextBtnLabel) {
    nextBtnLabel.textContent = isLast ? 'Lihat Hasil Akhir' : 'Lanjut ke Pertanyaan Berikutnya';
  }

  panel.style.display = '';

  // Set up next-question button (replace to remove old listeners)
  const newBtn = nextBtn.cloneNode(true) as HTMLButtonElement;
  if (nextBtnLabel) {
    (newBtn.querySelector('#btn-next-label') as HTMLElement).textContent = isLast
      ? 'Lihat Hasil Akhir'
      : 'Lanjut ke Pertanyaan Berikutnya';
  }
  nextBtn.replaceWith(newBtn);
  newBtn.addEventListener('click', () => {
    if (isLast) {
      showFinalTransition();
    } else {
      showQuestionTransition(state.currentQuestionIndex + 1);
    }
  });

  // Move focus to feedback panel
  panel.setAttribute('tabindex', '-1');
  panel.focus({ preventScroll: false });
}

function clearTimers() {
  if (state.readingTimerId) {
    clearInterval(state.readingTimerId);
    state.readingTimerId = null;
  }
  if (state.answerTimerId) {
    clearInterval(state.answerTimerId);
    state.answerTimerId = null;
  }
}

// ─────────────────────────────────────────
// Inter-Question Transition (Loading + Pesan Brand + Tombol Lanjut)
// ─────────────────────────────────────────

function showQuestionTransition(nextQuestionIndex: number) {
  clearTimers();
  showStage('transition');

  // Cek apakah soal saat ini atau soal berikutnya memiliki custom brandMessage dari Bank Soal
  const currentQ = state.sessionQuestions[state.currentQuestionIndex];
  const nextQ = state.sessionQuestions[nextQuestionIndex];
  const customMsg =
    (currentQ?.brandMessage?.title && currentQ?.brandMessage?.message ? currentQ.brandMessage : null) ||
    (nextQ?.brandMessage?.title && nextQ?.brandMessage?.message ? nextQ.brandMessage : null);

  const brandMsg =
    customMsg ||
    BRAND_TRANSITION_MESSAGES[(nextQuestionIndex - 1) % BRAND_TRANSITION_MESSAGES.length] ||
    BRAND_TRANSITION_MESSAGES[0];

  const badgeEl = $('transition-badge');
  const titleEl = $('transition-title');
  const subEl = $('transition-sub');
  const pillarEl = $('bm-pillar');
  const msgTitleEl = $('bm-title');
  const msgTextEl = $('bm-text');
  const nextBtn = $('btn-transition-next');

  if (badgeEl) badgeEl.textContent = `Menuju Pertanyaan ${nextQuestionIndex + 1} dari 10`;
  if (titleEl) titleEl.textContent = `Memuat Pertanyaan ${nextQuestionIndex + 1}...`;
  if (subEl) subEl.textContent = 'Sembari bersiap, resapi dedikasi di balik rasa Surya Nusantara';

  if (pillarEl) pillarEl.textContent = brandMsg.pillar;
  if (msgTitleEl) msgTitleEl.textContent = brandMsg.title;
  if (msgTextEl) msgTextEl.textContent = brandMsg.message;

  if (nextBtn) {
    const freshBtn = nextBtn.cloneNode(true) as HTMLButtonElement;
    const freshLabel = freshBtn.querySelector('#btn-transition-next-label') as HTMLElement | null;
    if (freshLabel) {
      freshLabel.textContent = `Lanjut ke Pertanyaan ${nextQuestionIndex + 1}`;
    }
    nextBtn.replaceWith(freshBtn);

    freshBtn.addEventListener('click', () => {
      state.currentQuestionIndex = nextQuestionIndex;
      showStage('quiz');
      loadQuestion(state.currentQuestionIndex);
    });

    freshBtn.focus({ preventScroll: false });
  }
}

// ─────────────────────────────────────────
// Final Transition (Loading + Pesan Penutup + Tombol Lanjut)
// ─────────────────────────────────────────

function showFinalTransition() {
  clearTimers();
  showStage('transition');

  const badgeEl = $('transition-badge');
  const titleEl = $('transition-title');
  const subEl = $('transition-sub');
  const pillarEl = $('bm-pillar');
  const msgTitleEl = $('bm-title');
  const msgTextEl = $('bm-text');
  const nextBtn = $('btn-transition-next');

  if (badgeEl) badgeEl.textContent = 'Kuis Selesai • Menghitung Skor';
  if (titleEl) titleEl.textContent = 'Menghitung Hasil Anda...';
  if (subEl) subEl.textContent = 'Sebuah dedikasi rasa untuk penikmat cita rasa mantap sejati';

  const brandMsg =
    BRAND_TRANSITION_MESSAGES[BRAND_TRANSITION_MESSAGES.length - 1] || BRAND_TRANSITION_MESSAGES[0];
  if (pillarEl) pillarEl.textContent = brandMsg.pillar;
  if (msgTitleEl) msgTitleEl.textContent = brandMsg.title;
  if (msgTextEl) msgTextEl.textContent = brandMsg.message;

  let autoTimer: ReturnType<typeof setTimeout> | null = null;

  if (nextBtn) {
    const freshBtn = nextBtn.cloneNode(true) as HTMLButtonElement;
    const freshLabel = freshBtn.querySelector('#btn-transition-next-label') as HTMLElement | null;
    if (freshLabel) {
      freshLabel.textContent = 'Lihat Hasil Akhir';
    }
    nextBtn.replaceWith(freshBtn);

    const proceedToResult = () => {
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }
      showResult();
    };

    freshBtn.addEventListener('click', proceedToResult);
    freshBtn.focus({ preventScroll: false });

    // Otomatis lanjut setelah 3.5 detik jika tidak diklik langsung
    autoTimer = setTimeout(proceedToResult, 3500);
  } else {
    setTimeout(() => {
      showResult();
    }, 2500);
  }
}

// ─────────────────────────────────────────
// Final Result
// ─────────────────────────────────────────

function showResult() {
  showStage('result');

  const scores = state.results.map((r) => r.pointsEarned);
  const totalScore = calculateTotalScore(scores);

  const scoreEl = $('score-number');
  if (scoreEl) scoreEl.textContent = String(totalScore);

  // Stars
  const starsEl = $('score-stars');
  if (starsEl) {
    const stars = totalScore >= 80 ? 5 : totalScore >= 60 ? 4 : totalScore >= 40 ? 3 : totalScore >= 20 ? 2 : 1;
    starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    starsEl.style.color = stars >= 4 ? '#c49a45' : '#a87e2b';
  }

  // Message
  const msgEl = $('score-message');
  if (msgEl) {
    if (totalScore >= 80) {
      msgEl.textContent = 'Luar biasa! Pengetahuan dan kecepatan Anda sangat impresif.';
    } else if (totalScore >= 60) {
      msgEl.textContent = 'Bagus! Pemahaman Anda tentang dedikasi Nusantara sudah baik.';
    } else if (totalScore >= 40) {
      msgEl.textContent = 'Cukup baik! Tetap semangat menggali lebih dalam warisan Nusantara.';
    } else {
      msgEl.textContent = 'Terus belajar! Kekayaan Nusantara selalu menarik untuk dijelajahi.';
    }
  }

  // Breakdown list
  renderBreakdown();

  // Sync answers & score to Cloudflare D1 (SQLite)
  const activeSessionId =
    state.sessionId ||
    (function () {
      try {
        return sessionStorage.getItem('sn_demo_session_id');
      } catch {
        return null;
      }
    })();

  if (activeSessionId && state.results.length > 0) {
    fetch('/api/submit-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: activeSessionId,
        results: state.results,
      }),
    }).catch(() => {
      // Graceful degradation
    });
  }

  // Play again
  const playAgainBtn = $('btn-play-again');
  const newBtn = playAgainBtn?.cloneNode(true) as HTMLButtonElement | null;
  if (playAgainBtn && newBtn) {
    playAgainBtn.replaceWith(newBtn);
    newBtn.addEventListener('click', () => resetGame());
  }
}

function renderBreakdown() {
  const list = $('breakdown-list');
  if (!list) return;
  list.innerHTML = '';

  state.results.forEach((r, idx) => {
    const row = document.createElement('div');
    row.setAttribute('role', 'listitem');
    row.className = `breakdown-row ${r.isCorrect ? 'correct' : r.selectedOptionId === null ? 'timeout' : 'incorrect'}`;

    const qnum = document.createElement('span');
    qnum.className = 'breakdown-qnum';
    qnum.textContent = `S${idx + 1}`;

    const status = document.createElement('span');
    status.className = 'breakdown-status';
    if (r.isCorrect) {
      status.textContent = '✓ Benar';
      status.style.color = '#6ee7b7';
    } else if (r.selectedOptionId === null) {
      status.textContent = '⏱ Timeout';
      status.style.color = '#a0a0a0';
    } else {
      status.textContent = '✗ Salah';
      status.style.color = '#ff8a80';
    }

    const scoreEl = document.createElement('span');
    scoreEl.className = 'breakdown-score';
    scoreEl.textContent = `${r.pointsEarned} poin`;
    scoreEl.style.color = r.pointsEarned > 0 ? '#c49a45' : '#777';

    row.appendChild(qnum);
    row.appendChild(status);
    row.appendChild(scoreEl);
    list.appendChild(row);
  });
}

// ─────────────────────────────────────────
// Reset
// ─────────────────────────────────────────

function resetGame() {
  clearTimers();
  state.stage = 'age_gate';
  state.registration = null;
  state.sessionId = null;
  state.sessionQuestions = [];
  state.currentQuestionIndex = 0;
  state.results = [];
  state.timerStartedAt = null;
  state.answerLocked = false;

  // Clear radio buttons
  document.querySelectorAll<HTMLInputElement>('input[name="age-confirm"]').forEach((r) => {
    r.checked = false;
  });

  try {
    sessionStorage.removeItem('sn_demo_registration');
    sessionStorage.removeItem('sn_demo_session_id');
  } catch {}

  showStage('age_gate');
}

// ─────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────

function init() {
  initAgeGate();
  initRegistration();
  showStage('age_gate');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
