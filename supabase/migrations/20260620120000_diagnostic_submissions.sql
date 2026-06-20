-- Stores each diagnostico.html submission (object `B` in the page script) as a lead.
create extension if not exists "pgcrypto";

create table if not exists public.diagnostic_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text,
  sector text,
  sector_other text,
  size text,
  areas text[] not null default '{}',
  bottlenecks text[] not null default '{}',
  erp text,
  erp_other text,
  crm text,
  crm_other text,
  tools text[] not null default '{}',
  integration text,
  centralization text,
  indicators text,
  cadence text,
  outcome text[] not null default '{}',
  priority text,
  horizon text,
  budget text,
  timeline text,
  notes text
);

create index if not exists diagnostic_submissions_created_at_idx
  on public.diagnostic_submissions (created_at desc);

alter table public.diagnostic_submissions enable row level security;

-- Public insert (the diagnostic form has no login). No select/update/delete
-- policy is defined for anon/authenticated, so RLS blocks all public reads.
create policy "anon can submit diagnostics"
on public.diagnostic_submissions
for insert
to anon
with check (true);
