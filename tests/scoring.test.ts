import { describe, expect, it } from 'bun:test';
import { calculateQuestionScore, calculateTotalScore } from '../src/lib/scoring';

describe('Scoring Logic', () => {
  it('awards points matching elapsed second bucket for correct answer', () => {
    // Brief explicit example: answer at 7th second earns 7 points
    expect(calculateQuestionScore(true, 7)).toBe(7);
    expect(calculateQuestionScore(true, 1)).toBe(1);
    expect(calculateQuestionScore(true, 10)).toBe(10);
  });

  it('clamps elapsed seconds between 1 and 10', () => {
    expect(calculateQuestionScore(true, 0.4)).toBe(1);
    expect(calculateQuestionScore(true, 12)).toBe(10);
    expect(calculateQuestionScore(true, 4.2)).toBe(5);
  });

  it('awards 0 points for incorrect answers', () => {
    expect(calculateQuestionScore(false, 3)).toBe(0);
    expect(calculateQuestionScore(false, 7)).toBe(0);
  });

  it('awards 0 points for timed out questions', () => {
    expect(calculateQuestionScore(true, 10, true)).toBe(0);
    expect(calculateQuestionScore(false, 10, true)).toBe(0);
  });

  it('calculates total score accurately and caps at 100', () => {
    const perfectScores = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    expect(calculateTotalScore(perfectScores)).toBe(100);

    const mixedScores = [7, 8, 0, 5, 10, 0, 6, 9, 8, 7];
    expect(calculateTotalScore(mixedScores)).toBe(60);

    const overflowScores = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
    expect(calculateTotalScore(overflowScores)).toBe(100);
  });
});
