-- Client-facing data shown in portal.html (sidebar identity, Home "project in
-- focus", Projects tab, Workspace "Commercial Proposal" card), scoped to the
-- logged-in user via auth.uid(). Clients can only read their own rows; writes
-- are done by Primagops via the Supabase dashboard (no insert/update policy
-- for anon/authenticated).

create table if not exists public.client_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  contact_name text,
  role_label text,
  avatar_initials text,
  created_at timestamptz not null default now()
);

alter table public.client_profiles enable row level security;

create policy "users can read own profile"
on public.client_profiles
for select
to authenticated
using (auth.uid() = user_id);


create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  subtitle text,
  status text,
  progress int,
  deadline date,
  impact_value numeric,
  impact_pct numeric,
  impact_dir text,
  is_focus boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists client_projects_user_id_idx on public.client_projects (user_id);

alter table public.client_projects enable row level security;

create policy "users can read own projects"
on public.client_projects
for select
to authenticated
using (auth.uid() = user_id);


create table if not exists public.client_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  value numeric,
  status text,
  is_pending boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists client_proposals_user_id_idx on public.client_proposals (user_id);

alter table public.client_proposals enable row level security;

create policy "users can read own proposals"
on public.client_proposals
for select
to authenticated
using (auth.uid() = user_id);
