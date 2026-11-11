import { describe, expect, it } from 'bun:test';
import { QUESTIONS_BANK } from '../src/data/questions';
import {
  selectSessionQuestions,
  shuffleQuestionOptions,
} from '../src/lib/question-selection';

describe('Question Selection and Shuffling', () => {
  it('selects exactly 10 questions', () => {
    const sessionQuestions = selectSessionQuestions(QUESTIONS_BANK);
    expect(sessionQuestions).toHaveLength(10);
  });

  it('ensures no question is repeated in a session', () => {
    const sessionQuestions = selectSessionQuestions(QUESTIONS_BANK);
    const ids = sessionQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);
  });

  it('selects positions 1-7 from general pool and positions 8-10 from brand pool', () => {
    const sessionQuestions = selectSessionQuestions(QUESTIONS_BANK);

    // Questions 1-7 (indexes 0 to 6) must not be brand pool
    const firstSeven = sessionQuestions.slice(0, 7);
    firstSeven.forEach((q, idx) => {
      expect(q.isBrandPool).toBe(
        false,
        `Question at index ${idx} (${q.id}) should be from general pool`
      );
    });

    // Questions 8-10 (indexes 7 to 9) must be brand pool
    const lastThree = sessionQuestions.slice(7, 10);
    lastThree.forEach((q, idx) => {
      expect(q.isBrandPool).toBe(
        true,
        `Question at index ${idx + 7} (${q.id}) should be from brand pool`
      );
    });
  });

  it('correctly maps correctOptionId after shuffling options', () => {
    const originalQuestion = QUESTIONS_BANK[0];
    const originalCorrectText = originalQuestion.options.find(
      (opt) => opt.id === originalQuestion.correctOptionId
    )?.text;

    const shuffled = shuffleQuestionOptions(originalQuestion);
    const shuffledCorrectOption = shuffled.options.find(
      (opt) => opt.id === shuffled.correctOptionId
    );

    expect(shuffledCorrectOption).toBeDefined();
    expect(shuffledCorrectOption?.text).toBe(originalCorrectText);
  });

  it('supports custom user-configured pool allocation (e.g. 5 general + 5 brand)', () => {
    const sessionQuestions = selectSessionQuestions(QUESTIONS_BANK, {
      generalCount: 5,
      brandCount: 5,
    });
    expect(sessionQuestions).toHaveLength(10);

    const generalQuestions = sessionQuestions.slice(0, 5);
    const brandQuestions = sessionQuestions.slice(5, 10);

    generalQuestions.forEach((q) => expect(q.isBrandPool).toBe(false));
    brandQuestions.forEach((q) => expect(q.isBrandPool).toBe(true));
  });
});
