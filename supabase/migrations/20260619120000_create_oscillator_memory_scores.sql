-- P-37E — Oscillator Memory Global Leaderboard Migration
-- Creates a public, anonymous leaderboard table for the 404 Oscillator Memory mini-game.
-- No Google Auth, no email, no userId, no IP: only a player-chosen pseudo + score.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE oscillator_memory_scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pseudo      TEXT NOT NULL,
  score       INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT oscillator_memory_scores_pseudo_length
    CHECK (length(pseudo) >= 2 AND length(pseudo) <= 20),

  CONSTRAINT oscillator_memory_scores_score_range
    CHECK (score >= 0 AND score <= 100)
);

-- Indexes for the two leaderboard views:
-- 1. Top scores first, ties broken by earliest submission.
CREATE INDEX idx_oscillator_memory_scores_score_desc
  ON oscillator_memory_scores(score DESC, created_at ASC);

-- 2. Recent entries for future "latest submissions" view.
CREATE INDEX idx_oscillator_memory_scores_created_at_desc
  ON oscillator_memory_scores(created_at DESC);

COMMENT ON TABLE oscillator_memory_scores IS
  'Anonymous leaderboard scores for the 404 Oscillator Memory mini-game. Accessed only via Express API.';

COMMENT ON COLUMN oscillator_memory_scores.pseudo IS
  'Player-chosen display name. No link to Google account or user profile.';

COMMENT ON COLUMN oscillator_memory_scores.score IS
  'Number of successfully reproduced rounds (0-100). Submitted by the player, not verified server-side.';
