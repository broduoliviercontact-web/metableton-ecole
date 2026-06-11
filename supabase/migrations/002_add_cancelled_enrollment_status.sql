-- Migration 002: Add cancelled status to enrollment_status enum
-- Allows students to cancel approved enrollments while preserving history

ALTER TYPE enrollment_status ADD VALUE IF NOT EXISTS 'cancelled';
