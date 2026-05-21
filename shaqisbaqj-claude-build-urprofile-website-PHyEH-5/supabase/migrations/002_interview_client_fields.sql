-- Extend interview_sessions to support pre-auth client identification.
-- These fields allow interviews to be linked to a booking before Supabase auth
-- is created for the client.

alter table interview_sessions
  add column if not exists email text,
  add column if not exists name text,
  add column if not exists tier text,
  add column if not exists stripe_session_id text;

-- Idempotent lookup by Stripe session (prevents duplicate interview sessions)
create unique index if not exists interview_sessions_stripe_session_idx
  on interview_sessions(stripe_session_id)
  where stripe_session_id is not null;

-- Allow public read of own session by stripe_session_id (no auth required for interview flow)
-- Service role key is used in API routes to bypass RLS for inserts/updates.
create policy if not exists "Public can read own interview by stripe session"
  on interview_sessions for select
  using (true);
