-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  app_slug text not null,
  app_name text not null,
  category text not null,
  email text,
  message text not null,
  submitted_at timestamptz not null,
  page_url text,
  screenshots jsonb,
  created_at timestamptz not null default now()
);

-- Optional: if the table already exists without screenshots:
-- alter table public.feedback add column if not exists screenshots jsonb;

alter table public.feedback enable row level security;

-- Allow anonymous inserts from the static site (anon key in browser).
create policy "feedback_insert_anon"
  on public.feedback
  for insert
  to anon
  with check (true);

-- No public read; view rows in Supabase Table Editor or service role only.
