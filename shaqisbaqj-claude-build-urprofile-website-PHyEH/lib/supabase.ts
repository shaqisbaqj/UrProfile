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
 */
