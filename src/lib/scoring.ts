/**
 * Scoring logic based on 'Kuis Dedikasi Di Balik Rasa' brief specification (Page 8 & 9):
 * - Each question has a 10-second answer timer (countdown 10s to 1s).
 * - "Semakin cepat menjawab, semakin besar poin yang didapat."
 * - Point awarded equals the remaining countdown seconds displayed on the timer:
 *   - Answering at start (detik ke-10 timer): 10 points.
 *   - Answering at detik ke-7 countdown (7s left): 7 points (explicit brief example).
 *   - Answering at detik ke-1 countdown (1s left): 1 point.
 * - Incorrect answer: 0 points.
 * - Timeout (waktu habis): 0 points.
 * - Maximum total score for 10 questions: 100 points.
 */

export function calculateQuestionScore(
  isCorrect: boolean,
  elapsedSeconds: number,
  isTimedOut: boolean = false,
  maxDuration: number = 10
): number {
  if (!isCorrect || isTimedOut || elapsedSeconds >= maxDuration) {
    return 0;
  }

  // Calculate points from remaining seconds on the countdown timer (10 to 1)
  const remaining = maxDuration - elapsedSeconds;
  const points = Math.min(maxDuration, Math.max(1, Math.ceil(remaining)));
  return points;
}

export function calculateTotalScore(scores: number[]): number {
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.min(100, Math.max(0, sum));
}
