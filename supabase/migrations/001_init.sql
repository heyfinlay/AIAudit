-- Company Audit Platform schema (Supabase/Postgres)
create table if not exists users_profile (
  id uuid primary key,
  email text not null unique,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean default true,
  template_checks jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  company_name text not null,
  website text,
  industry_id uuid references industries(id),
  location text,
  size_estimate text,
  inbound_volume text,
  tools text,
  created_at timestamptz default now()
);

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  status text not null check (status in ('Prospecting','In Progress','Ready for Report')),
  stage text not null check (stage in ('Pre-Audit','Full Audit')),
  notes text,
  manual_observations text,
  overall_score numeric(4,2),
  priority_index int default 0,
  assumptions jsonb not null default '{}'::jsonb,
  report_settings_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists audit_scores (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references audits(id) on delete cascade,
  category text not null,
  score numeric(4,2) not null,
  findings text,
  risks text,
  opportunities text,
  estimated_business_impact text,
  recommended_actions text
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references audits(id) on delete cascade,
  title text not null,
  problem text,
  why_it_matters text,
  suggested_fix text,
  estimated_impact text,
  implementation_difficulty text,
  category text,
  priority text,
  ai_help boolean default false,
  automation_help boolean default false,
  impact_tags text[] default '{}'
);

create table if not exists internal_notes (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references audits(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists report_settings (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  agency_name text,
  logo_url text,
  logo_text text,
  primary_color text default '#111827',
  created_at timestamptz default now()
);
