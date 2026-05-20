-- UrProfile Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ──────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  headline text,
  role text,
  location text,
  film_playback_id text,         -- Mux playback ID
  film_thumbnail_url text,
  tier text check (tier in ('self-guided','starter','signature','executive')),
  status text default 'order-received' check (status in (
    'order-received','shoot-scheduled','shoot-complete',
    'in-editing','review-ready','live','nfc-shipped'
  )),
  preview_link text,             -- filled at review-ready stage
  tracking_number text,          -- filled at nfc-shipped stage
  custom_url text,
  contact_email text,
  logo_url text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view their own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = user_id);
create policy "Public can view published profiles" on profiles for select using (is_published = true);

-- ─── Analytics Events ───────────────────────────────────────────────────────
create table if not exists profile_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  user_id uuid references auth.users(id),
  event_type text not null check (event_type in ('view','contact-click','nfc-tap','share')),
  device_type text check (device_type in ('mobile','desktop','tablet')),
  country text,
  city text,
  watch_duration_seconds integer,
  created_at timestamptz default now()
);

alter table profile_events enable row level security;
create policy "Profile owners can view their events" on profile_events for select
  using (profile_id in (select id from profiles where user_id = auth.uid()));
create policy "Anyone can insert events" on profile_events for insert with check (true);

-- ─── Orders ─────────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  tier text not null,
  amount_paid integer not null,  -- in cents
  stripe_payment_intent_id text,
  stripe_session_id text,
  payment_status text default 'pending' check (payment_status in ('pending','paid','refunded')),
  fulfillment_status text default 'pending' check (fulfillment_status in ('pending','in-production','delivered')),
  contract_signed boolean default false,
  contract_signed_at timestamptz,
  contract_ip_address text,
  client_name text,
  client_email text,
  client_phone text,
  client_industry text,
  client_message text,
  created_at timestamptz default now()
);

alter table orders enable row level security;
create policy "Users can view their own orders" on orders for select using (auth.uid() = user_id);

-- ─── Contracts ──────────────────────────────────────────────────────────────
create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  order_id uuid references orders(id),
  contract_version text default '1.0',
  contract_text text not null,
  signed_at timestamptz not null,
  ip_address text,
  user_agent text,
  signature_name text not null,
  created_at timestamptz default now()
);

alter table contracts enable row level security;
create policy "Users can view their own contracts" on contracts for select using (auth.uid() = user_id);

-- ─── NFC Card Orders ────────────────────────────────────────────────────────
create table if not exists nfc_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  profile_id uuid references profiles(id),
  quantity integer not null default 1,
  amount_paid integer not null,
  stripe_payment_intent_id text,
  status text default 'pending' check (status in ('pending','paid','shipped')),
  tracking_number text,
  created_at timestamptz default now()
);

alter table nfc_orders enable row level security;
create policy "Users can view their own nfc orders" on nfc_orders for select using (auth.uid() = user_id);

-- ─── Messages ───────────────────────────────────────────────────────────────
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  profile_id uuid references profiles(id),
  sender_type text not null check (sender_type in ('client','admin')),
  subject text,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Users can view their own messages" on messages for select using (auth.uid() = user_id);
create policy "Users can insert their own messages" on messages for insert with check (auth.uid() = user_id);

-- ─── Interview Sessions (Self Guided) ───────────────────────────────────────
create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  messages jsonb default '[]'::jsonb,
  story_brief text,
  shot_list text,
  b_roll_list text,
  script_framework text,
  status text default 'in-progress' check (status in ('in-progress','complete')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table interview_sessions enable row level security;
create policy "Users can manage their own interview sessions" on interview_sessions
  for all using (auth.uid() = user_id);

-- ─── Admin role helper ───────────────────────────────────────────────────────
-- In Supabase, create a custom claim or use a separate admin_users table:
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id),
  created_at timestamptz default now()
);

-- To make someone an admin: INSERT INTO admin_users (user_id) VALUES ('their-uuid');
