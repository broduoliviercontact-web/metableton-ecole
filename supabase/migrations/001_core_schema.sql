-- Migration 001: Core schema
-- Creates all enum types, tables, and indexes for the MVP

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE course_status AS ENUM ('draft', 'published');
CREATE TYPE enrollment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'all_levels');

-- Profiles table
-- First user to sign in gets role 'admin' (handled in application logic, not in schema)
-- Subsequent users default to 'student'
CREATE TABLE profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub    TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'student',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Courses table
-- Linked to a teacher profile; Google Classroom fields are nullable
-- (set when the teacher links a Classroom class to the course)
CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  skill_level     skill_level NOT NULL DEFAULT 'all_levels',
  cover_image_url TEXT,
  status          course_status NOT NULL DEFAULT 'draft',
  classroom_id    TEXT,
  classroom_url   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enrollments table
-- Unique constraint on (student_id, course_id) ensures one enrollment per student per course
-- Retryable rejections: INSERT ... ON CONFLICT DO UPDATE resets status to 'pending'
CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status      enrollment_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
