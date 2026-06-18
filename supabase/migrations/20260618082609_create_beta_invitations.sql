-- P-37B — Beta Invitations Migration
-- Creates the beta_invitations table for managing private beta invitations.

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the status enum type for beta invitations
CREATE TYPE beta_invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- Create the beta_invitations table
CREATE TABLE beta_invitations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT NOT NULL,
  role                user_role NOT NULL DEFAULT 'student',
  token_hash          TEXT NOT NULL UNIQUE,
  token_salt          TEXT NOT NULL,
  status              beta_invitation_status NOT NULL DEFAULT 'pending',
  expires_at          TIMESTAMPTZ,
  accepted_at         TIMESTAMPTZ,
  accepted_user_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes               TEXT
);

-- Indexes for common queries
CREATE INDEX idx_beta_invitations_email ON beta_invitations(email);
CREATE INDEX idx_beta_invitations_status ON beta_invitations(status);
CREATE INDEX idx_beta_invitations_token_hash ON beta_invitations(token_hash);
CREATE INDEX idx_beta_invitations_created_by ON beta_invitations(created_by);
CREATE INDEX idx_beta_invitations_accepted_user_id ON beta_invitations(accepted_user_id);

-- Enable RLS on the beta_invitations table
ALTER TABLE beta_invitations ENABLE ROW LEVEL SECURITY;

-- Force RLS to ensure all queries go through the security layer
ALTER TABLE beta_invitations FORCE ROW LEVEL SECURITY;

-- Note: This table is accessed ONLY via Express with the service role key.
-- The frontend should NEVER access Supabase directly.
-- RLS policies are managed server-side in Express middleware.

-- Add comment for documentation
COMMENT ON TABLE beta_invitations IS
  'Beta invitations for private beta testing. Managed via Express API only.';

COMMENT ON COLUMN beta_invitations.token_hash IS
  'SHA-256 hash of the invitation token (token never stored in plaintext).';

COMMENT ON COLUMN beta_invitations.token_salt IS
  'Random salt used for hashing the invitation token.';

COMMENT ON COLUMN beta_invitations.status IS
  'Invitation status: pending, accepted, expired, or revoked.';

COMMENT ON COLUMN beta_invitations.expires_at IS
  'Optional expiration timestamp. NULL means no expiration.';

COMMENT ON COLUMN beta_invitations.accepted_at IS
  'Timestamp when the invitation was accepted.';

COMMENT ON COLUMN beta_invitations.accepted_user_id IS
  'Reference to the profile that accepted this invitation.';

COMMENT ON COLUMN beta_invitations.created_by IS
  'Reference to the admin profile that created this invitation.';

COMMENT ON COLUMN beta_invitations.notes IS
  'Internal notes for the admin (not visible to invitees).';
