import { describe, expect, it } from 'bun:test';
import { calculateQuestionScore, calculateTotalScore } from '../src/lib/scoring';

describe('Scoring Logic', () => {
  it('awards points matching countdown seconds (faster answer = higher points)', () => {
    // When 10s timer starts (elapsed < 1s): 10 points
    expect(calculateQuestionScore(true, 0.4)).toBe(10);
    expect(calculateQuestionScore(true, 0.9)).toBe(10);

    // Brief explicit example: answer at 7th second (3s elapsed) earns 7 points
    expect(calculateQuestionScore(true, 3.0)).toBe(7);
    expect(calculateQuestionScore(true, 3.2)).toBe(7);

    // Answer with 1s remaining (9.5s elapsed): 1 point
    expect(calculateQuestionScore(true, 9.5)).toBe(1);
    expect(calculateQuestionScore(true, 9.9)).toBe(1);
  });

  it('clamps points between 1 and 10 for valid answers within timer', () => {
    expect(calculateQuestionScore(true, 0)).toBe(10);
    expect(calculateQuestionScore(true, 5.5)).toBe(5);
    expect(calculateQuestionScore(true, 8.2)).toBe(2);
  });

  it('awards 0 points for answers after 10 seconds or timeout', () => {
    expect(calculateQuestionScore(true, 10.0)).toBe(0);
    expect(calculateQuestionScore(true, 11.5)).toBe(0);
    expect(calculateQuestionScore(true, 5.0, true)).toBe(0);
  });

  it('awards 0 points for incorrect answers', () => {
    expect(calculateQuestionScore(false, 0.5)).toBe(0);
    expect(calculateQuestionScore(false, 3.0)).toBe(0);
    expect(calculateQuestionScore(false, 9.0)).toBe(0);
  });

  it('calculates total score accurately and caps at 100', () => {
    const perfectScores = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    expect(calculateTotalScore(perfectScores)).toBe(100);

    const mixedScores = [10, 7, 0, 5, 10, 0, 6, 9, 8, 7];
    expect(calculateTotalScore(mixedScores)).toBe(62);

    const overflowScores = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
    expect(calculateTotalScore(overflowScores)).toBe(100);
  });
});
