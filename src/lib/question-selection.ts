import type { AnswerOption, Question } from './types';

/**
 * Fisher-Yates array shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles the answer options of a question and re-assigns
 * standard letter IDs (A, B, C, D) in display order,
 * updating correctOptionId accordingly.
 */
export function shuffleQuestionOptions(question: Question): Question {
  const correctText = question.options.find(
    (opt) => opt.id === question.correctOptionId
  )?.text;

  const shuffledOptionsRaw = shuffleArray(question.options);
  const letterIds = ['A', 'B', 'C', 'D'];

  let newCorrectOptionId = 'A';
  const newOptions: AnswerOption[] = shuffledOptionsRaw.map((opt, index) => {
    const assignedId = letterIds[index] || opt.id;
    if (opt.text === correctText) {
      newCorrectOptionId = assignedId;
    }
    return {
      id: assignedId,
      text: opt.text,
    };
  });

  return {
    ...question,
    options: newOptions,
    correctOptionId: newCorrectOptionId,
  };
}

export interface SessionSelectionConfig {
  generalCount?: number;
  brandCount?: number;
}

/**
 * Selects questions for a game session:
 * - General pool and brand pool counts are configurable (default: 7 general + 3 brand).
 * - Allocation is flexible and user-customizable.
 * - Never repeats a question in the same session.
 * - Shuffles answer options for each question.
 */
export function selectSessionQuestions(
  bank: Question[],
  config: SessionSelectionConfig = {}
): Question[] {
  const generalCount = config.generalCount !== undefined ? config.generalCount : 7;
  const brandCount = config.brandCount !== undefined ? config.brandCount : 3;

  const generalPool = bank.filter((q) => !q.isBrandPool);
  const brandPool = bank.filter((q) => q.isBrandPool);

  if (generalPool.length < generalCount) {
    throw new Error(
      `Insufficient general questions: expected at least ${generalCount}, got ${generalPool.length}`
    );
  }

  if (brandPool.length < brandCount) {
    throw new Error(
      `Insufficient brand-message questions: expected at least ${brandCount}, got ${brandPool.length}`
    );
  }

  const selectedGeneral = shuffleArray(generalPool).slice(0, generalCount);
  const selectedBrand = shuffleArray(brandPool).slice(0, brandCount);

  const rawSessionQuestions = [...selectedGeneral, ...selectedBrand];

  return rawSessionQuestions.map(shuffleQuestionOptions);
}
