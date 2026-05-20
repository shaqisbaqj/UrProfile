create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  email text,
  tier text,
  body text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

alter table testimonials enable row level security;

create policy "Anyone can submit a testimonial"
  on testimonials for insert
  with check (true);

create policy "Public can read approved testimonials"
  on testimonials for select
  using (approved = true);
