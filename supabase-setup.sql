-- ============================================================
-- QuizForge — Supabase Database Setup
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tables ────────────────────────────────────────────────────

-- Quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  question_count INTEGER DEFAULT 0,
  is_public     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE IF NOT EXISTS public.questions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id           UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question          TEXT NOT NULL,
  correct_answer    TEXT NOT NULL,
  incorrect_answers TEXT[] NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id     UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score       INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  time_taken  INTEGER DEFAULT 0,  -- seconds
  answers     JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_quizzes_user_id     ON public.quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_public   ON public.quizzes(is_public);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id   ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id    ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id    ON public.quiz_attempts(user_id);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.quizzes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes: users see their own + public ones
CREATE POLICY "Users see own quizzes" ON public.quizzes
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users create own quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own quizzes" ON public.quizzes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own quizzes" ON public.quizzes
  FOR DELETE USING (auth.uid() = user_id);

-- Questions: accessible if parent quiz is accessible
CREATE POLICY "Questions visible with quiz" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND (q.user_id = auth.uid() OR q.is_public = true)
    )
  );

CREATE POLICY "Users create questions in own quizzes" ON public.questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users delete questions in own quizzes" ON public.questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND q.user_id = auth.uid()
    )
  );

-- Attempts: users manage their own
CREATE POLICY "Users see own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Auto-update updated_at ────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Done ──────────────────────────────────────────────────────
-- Your QuizForge database is ready!
