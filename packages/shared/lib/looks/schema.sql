-- Vercel Postgres (Neon) schema for RAW Clinic shared looks.
-- Run once in the Neon SQL editor (or `psql $DATABASE_URL -f schema.sql`).

create table if not exists shared_looks (
  code           text primary key,         -- short link code (/l/<code>)
  payload        jsonb       not null,      -- full SharedLookPayload (recipe + card)
  title          text        not null default '',
  schema_version integer     not null default 1,
  views          integer     not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists shared_looks_created_at_idx on shared_looks (created_at desc);
