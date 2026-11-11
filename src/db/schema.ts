import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const participants = sqliteTable('participants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ageBand: text('age_band').notNull(),
  isConfirmed21Plus: integer('is_confirmed_21_plus', { mode: 'boolean' }).notNull().default(true),
  domicile: text('domicile').notNull(),
  occupation: text('occupation').notNull(),
  currentBrand: text('current_brand').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const quizSessions = sqliteTable('quiz_sessions', {
  id: text('id').primaryKey(),
  participantId: text('participant_id')
    .notNull()
    .references(() => participants.id, { onDelete: 'cascade' }),
  totalScore: integer('total_score').notNull().default(0),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  startedAt: text('started_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text('completed_at'),
});

export const quizAnswers = sqliteTable('quiz_answers', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => quizSessions.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull(),
  questionIndex: integer('question_index').notNull(),
  selectedOptionId: text('selected_option_id'),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false),
  elapsedSeconds: real('elapsed_seconds').notNull().default(10.0),
  pointsEarned: integer('points_earned').notNull().default(0),
  answeredAt: text('answered_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
export type QuizSession = typeof quizSessions.$inferSelect;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
