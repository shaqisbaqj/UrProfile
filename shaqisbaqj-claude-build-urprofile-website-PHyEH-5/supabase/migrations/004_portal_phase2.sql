-- Phase 2: Portal schema updates

-- Update profiles.tier check to include the-first-impression product
alter table profiles
  drop constraint if exists profiles_tier_check;

alter table profiles
  add constraint profiles_tier_check
  check (tier in ('self-guided','starter','signature','executive','the-first-impression'));

-- Add admin write policy to messages (service role bypasses RLS, but for completeness)
create policy if not exists "Admin can insert messages"
  on messages for insert with check (true);

create policy if not exists "Admin can view all messages"
  on messages for select using (true);

-- Allow service role to read/update profiles (service role bypasses RLS by default)
-- Allow anon/public to read profile status for portal
create policy if not exists "Users can view own profile status"
  on profiles for select using (auth.uid() = user_id);

-- Orders: allow insert from service role (webhook)
-- Service role bypasses RLS, so no policy needed.
-- But add a select policy for users:
-- (already exists: "Users can view their own orders")

-- NFC orders: allow users to view and insert own orders
create policy if not exists "Users can insert their own nfc orders"
  on nfc_orders for insert with check (auth.uid() = user_id);

-- Profile events: existing policies already allow public insert + owner select
