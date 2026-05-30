create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'novo' check (
    status in ('novo', 'em_analise', 'diagnostico_agendado', 'proposta_enviada', 'convertido', 'perdido')
  ),
  company_name text not null,
  industry text,
  team_size text,
  revenue_range text,
  pain_point text,
  engagement_type text,
  project_description text not null,
  contact_name text not null,
  whatsapp text not null,
  email text not null,
  source text,
  source_path text,
  internal_notes text
);

alter table public.leads enable row level security;

create policy "service role can manage leads"
on public.leads
for all
to service_role
using (true)
with check (true);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
