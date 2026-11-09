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

/**
 * Selects exactly 10 questions for a game session:
 * - 7 unique questions randomly from the general pool (!isBrandPool).
 * - 3 questions from the brand-message pool (isBrandPool) for positions 8-10.
 * - Never repeats a question in the same session.
 * - Shuffles answer options for each question.
 */
export function selectSessionQuestions(bank: Question[]): Question[] {
  const generalPool = bank.filter((q) => !q.isBrandPool);
  const brandPool = bank.filter((q) => q.isBrandPool);

  if (generalPool.length < 7) {
    throw new Error(
      `Insufficient general questions: expected at least 7, got ${generalPool.length}`
    );
  }

  if (brandPool.length < 3) {
    throw new Error(
      `Insufficient brand-message questions: expected at least 3, got ${brandPool.length}`
    );
  }

  const selectedGeneral = shuffleArray(generalPool).slice(0, 7);
  const selectedBrand = shuffleArray(brandPool).slice(0, 3);

  const rawSessionQuestions = [...selectedGeneral, ...selectedBrand];

  return rawSessionQuestions.map(shuffleQuestionOptions);
}
