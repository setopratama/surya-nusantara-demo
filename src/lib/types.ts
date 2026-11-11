export type AgeBand = '18–24' | '25–34' | '35–44' | '45+';

export interface ParticipantRegistration {
  name: string;
  ageBand: AgeBand;
  isConfirmed21Plus: boolean;
  domicile: string;
  occupation: string;
  currentBrand: string;
}

export interface AnswerOption {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface QuestionBrandMessage {
  pillar: string;
  title: string;
  message: string;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  correctOptionId: string;
  explanation: string;
  category: 'craftsmanship' | 'heritage' | 'process' | 'brand_message';
  isBrandPool: boolean; // false for questions 1-7, true for questions 8-10
  brandMessage?: QuestionBrandMessage;
}

export interface QuestionResult {
  questionId: string;
  selectedOptionId: string | null; // null if timed out
  isCorrect: boolean;
  elapsedSeconds: number; // 1-10
  pointsEarned: number; // 0-10
}

export type GameStage =
  | 'age_gate'
  | 'age_denied'
  | 'registration'
  | 'brand_intro'
  | 'brand_message'
  | 'instructions'
  | 'quiz'
  | 'transition'
  | 'result';

export interface FunFact {
  id: string;
  title: string;
  fact: string;
  origin: string;
}
