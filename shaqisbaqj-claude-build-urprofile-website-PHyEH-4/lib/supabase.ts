import { createClient } from "@supabase/supabase-js";
import type { Profile } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server client alias — uses the same anon client for simplicity
// (for server components and route handlers)
export function getSupabaseServerClient() {
  return getSupabaseClient();
}

export interface ProfileEvent {
  id: string;
  profile_id: string;
  event_type: string; // 'view' | 'contact_click'
  device_type?: string; // 'mobile' | 'desktop'
  city?: string;
  country?: string;
  watch_percentage?: number;
  created_at: string;
}

export async function getProfileAnalytics(
  profileId: string
): Promise<ProfileEvent[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profile_events")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return [];
  return data as ProfileEvent[];
}

export async function logProfileEvent(
  profileId: string,
  eventType: string,
  deviceType?: string,
  city?: string,
  country?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  await supabase.from("profile_events").insert({
    profile_id: profileId,
    event_type: eventType,
    device_type: deviceType,
    city,
    country,
  });
}

export async function getProfileBySlug(
  slug: string
): Promise<Profile | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Supabase not configured — returning null for profile fetch.");
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}

/*
 * Supabase Schema:
 *
 * Table: profiles
 * ───────────────────────────────────────────────
 * id                uuid          primary key default gen_random_uuid()
 * slug              text          unique not null
 * name              text
 * headline          text
 * role              text
 * location          text
 * video_playback_id text          (Mux playback ID)
 * contact_email     text
 * created_at        timestamptz   default now()
 * ───────────────────────────────────────────────
 *
 * SQL to create:
 *
 * create table profiles (
 *   id uuid primary key default gen_random_uuid(),
 *   slug text unique not null,
 *   name text,
 *   headline text,
 *   role text,
 *   location text,
 *   video_playback_id text,
 *   contact_email text,
 *   created_at timestamptz default now()
 * );
 *
 * alter table profiles enable row level security;
 * create policy "Public profiles are viewable by everyone."
 *   on profiles for select using (true);
 *
 * ─── Analytics ──────────────────────────────────────────────────────────────
 *
 * -- Add to profiles table:
 * alter table profiles add column if not exists user_id uuid references auth.users(id);
 *
 * -- Analytics events table:
 * create table if not exists profile_events (
 *   id uuid primary key default gen_random_uuid(),
 *   profile_id uuid references profiles(id) on delete cascade,
 *   event_type text not null, -- 'view', 'contact_click'
 *   device_type text, -- 'mobile', 'desktop'
 *   city text,
 *   country text,
 *   watch_percentage integer,
 *   created_at timestamptz default now()
 * );
 *
 * alter table profile_events enable row level security;
 *
 * create policy "Profile owners can view their events"
 *   on profile_events for select
 *   using (profile_id in (select id from profiles where user_id = auth.uid()));
 *
 * create policy "Public can insert events"
 *   on profile_events for insert with check (true);
 */
