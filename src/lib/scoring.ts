/**
 * Scoring logic based on 'Kuis Dedikasi Di Balik Rasa' brief specification:
 * - Each question is worth up to 10 points.
 * - For a correct answer: points equal the elapsed answer-second bucket (1 to 10).
 *   Example from brief: answering at second 7 earns 7 points.
 * - Incorrect answer: 0 points.
 * - Timeout: 0 points.
 * - Maximum total score for 10 questions: 100 points.
 */

export function calculateQuestionScore(
  isCorrect: boolean,
  elapsedSeconds: number,
  isTimedOut: boolean = false
): number {
  if (!isCorrect || isTimedOut) {
    return 0;
  }

  // Elapsed seconds clamped between 1 and 10
  const clampedElapsed = Math.min(10, Math.max(1, Math.ceil(elapsedSeconds)));
  return clampedElapsed;
}

export function calculateTotalScore(scores: number[]): number {
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.min(100, Math.max(0, sum));
}
