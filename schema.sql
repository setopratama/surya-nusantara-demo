-- Cloudflare D1 (SQLite) Schema for Kuis Dedikasi Di Balik Rasa — Surya Nusantara

CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age_band TEXT NOT NULL,
  is_confirmed_21_plus INTEGER NOT NULL DEFAULT 1,
  domicile TEXT NOT NULL,
  occupation TEXT NOT NULL,
  current_brand TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL DEFAULT 0,
  is_completed INTEGER NOT NULL DEFAULT 0,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  selected_option_id TEXT, -- NULL if timeout
  is_correct INTEGER NOT NULL DEFAULT 0,
  elapsed_seconds REAL NOT NULL DEFAULT 10.0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performant filtering and reporting queries
CREATE INDEX IF NOT EXISTS idx_participants_domicile ON participants(domicile);
CREATE INDEX IF NOT EXISTS idx_participants_age_band ON participants(age_band);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_score ON quiz_sessions(total_score);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_started ON quiz_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session ON quiz_answers(session_id);
