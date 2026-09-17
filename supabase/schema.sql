-- =====================================================================
-- DECRETO FC — Schema Supabase / PostgreSQL
-- Execute este arquivo inteiro no SQL Editor de um projeto novo Supabase.
-- Inclui: tabelas, segurança RLS, função de admin, Storage e configurações.
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
-- ENUMS
-- =====================================================================
do $$ begin
  create type player_type as enum ('jogador', 'comissao');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('agendado', 'finalizado', 'adiado', 'cancelado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_phase as enum ('grupos', 'semifinal', 'final', 'outro');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- ADMINISTRADORES
-- Um usuário existir em auth.users NÃO basta para ser admin.
-- Ele também precisa estar nesta tabela.
-- =====================================================================
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_own_read" on public.admin_users;
create policy "admin_users_own_read"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- =====================================================================
-- TABELA: teams
-- =====================================================================
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  group_name text,
  logo_url text,
  is_decreto boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists uniq_decreto_team
  on public.teams (is_decreto)
  where is_decreto = true;

-- =====================================================================
-- TABELA: players (elenco + comissão técnica)
-- =====================================================================
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_name text,
  number integer,
  position text,
  role text,
  photo_url text,
  type player_type not null default 'jogador',
  is_captain boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint number_non_negative check (number is null or number >= 0),
  constraint commission_not_captain check (type = 'jogador' or is_captain = false)
);

create index if not exists idx_players_type_active_order
  on public.players (type, active, display_order);

-- =====================================================================
-- TABELA: matches
-- counts_for_standings permite cadastrar semifinal/final sem contaminar
-- a classificação da fase de grupos.
-- =====================================================================
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  home_team_id uuid not null references public.teams(id) on delete restrict,
  away_team_id uuid not null references public.teams(id) on delete restrict,
  round integer,
  phase match_phase not null default 'grupos',
  counts_for_standings boolean not null default true,
  match_date timestamptz not null,
  venue text,
  status match_status not null default 'agendado',
  home_score integer,
  away_score integer,
  created_at timestamptz not null default now(),
  constraint different_teams check (home_team_id <> away_team_id),
  constraint round_positive check (round is null or round > 0),
  constraint scores_non_negative check (
    (home_score is null or home_score >= 0) and
    (away_score is null or away_score >= 0)
  ),
  constraint finished_has_score check (
    status <> 'finalizado' or (home_score is not null and away_score is not null)
  ),
  constraint unfinished_has_no_score check (
    status = 'finalizado' or (home_score is null and away_score is null)
  )
);

-- Compatibilidade caso o schema seja reaplicado sobre uma versão anterior.
alter table public.matches add column if not exists phase match_phase not null default 'grupos';
alter table public.matches add column if not exists counts_for_standings boolean not null default true;

create index if not exists idx_matches_date on public.matches (match_date);
create index if not exists idx_matches_status on public.matches (status);
create index if not exists idx_matches_home on public.matches (home_team_id);
create index if not exists idx_matches_away on public.matches (away_team_id);
create index if not exists idx_matches_standings on public.matches (counts_for_standings, status);

-- =====================================================================
-- TABELA: match_scorers
-- =====================================================================
create table if not exists public.match_scorers (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete restrict,
  goals integer not null default 1,
  created_at timestamptz not null default now(),
  constraint goals_positive check (goals > 0),
  unique (match_id, player_id)
);

create index if not exists idx_scorers_match on public.match_scorers (match_id);
create index if not exists idx_scorers_player on public.match_scorers (player_id);

-- =====================================================================
-- TABELA: sponsors
-- =====================================================================
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  link_url text,
  tier text not null default 'apoio',
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint sponsors_tier_check check (tier in ('master', 'ouro', 'prata', 'apoio'))
);

create index if not exists idx_sponsors_active_order on public.sponsors (active, display_order, created_at);

-- =====================================================================
-- TABELA: site_settings — exatamente uma linha
-- =====================================================================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique,
  competition_name text not null default '3ª Copa Verão de Futsal Amador de Açucena',
  season text not null default '2026',
  hero_title text not null default 'Decreto FC',
  hero_subtitle text not null default 'Nossa primeira batalha nas quadras.',
  instagram_url text,
  city text not null default 'Açucena — Minas Gerais',
  about_text text not null default 'O Decreto FC nasceu em Açucena/MG em 2017, criado entre amigos, e ficou conhecido pela organização e pela formação de bons elencos nas competições municipais. Tradicionalmente ligado ao futebol de campo, em 2026 o clube inicia um novo capítulo ao disputar pela primeira vez uma competição de futsal: a 3ª Copa Verão de Futsal Amador de Açucena.',
  default_venue text,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (singleton = true)
);

alter table public.site_settings add column if not exists singleton boolean not null default true;
create unique index if not exists uniq_site_settings_singleton on public.site_settings (singleton);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Público: leitura.
-- Escrita: somente usuários explicitamente presentes em admin_users.
-- =====================================================================
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.match_scorers enable row level security;
alter table public.sponsors enable row level security;
alter table public.site_settings enable row level security;

-- TEAMS
drop policy if exists "teams_public_read" on public.teams;
drop policy if exists "teams_admin_write" on public.teams;
drop policy if exists "teams_admin_update" on public.teams;
drop policy if exists "teams_admin_delete" on public.teams;
create policy "teams_public_read" on public.teams for select to anon, authenticated using (true);
create policy "teams_admin_write" on public.teams for insert to authenticated with check (public.is_admin());
create policy "teams_admin_update" on public.teams for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "teams_admin_delete" on public.teams for delete to authenticated using (public.is_admin());

-- PLAYERS
drop policy if exists "players_public_read" on public.players;
drop policy if exists "players_admin_write" on public.players;
drop policy if exists "players_admin_update" on public.players;
drop policy if exists "players_admin_delete" on public.players;
create policy "players_public_read" on public.players for select to anon, authenticated using (true);
create policy "players_admin_write" on public.players for insert to authenticated with check (public.is_admin());
create policy "players_admin_update" on public.players for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "players_admin_delete" on public.players for delete to authenticated using (public.is_admin());

-- MATCHES
drop policy if exists "matches_public_read" on public.matches;
drop policy if exists "matches_admin_write" on public.matches;
drop policy if exists "matches_admin_update" on public.matches;
drop policy if exists "matches_admin_delete" on public.matches;
create policy "matches_public_read" on public.matches for select to anon, authenticated using (true);
create policy "matches_admin_write" on public.matches for insert to authenticated with check (public.is_admin());
create policy "matches_admin_update" on public.matches for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "matches_admin_delete" on public.matches for delete to authenticated using (public.is_admin());

-- MATCH_SCORERS
drop policy if exists "scorers_public_read" on public.match_scorers;
drop policy if exists "scorers_admin_write" on public.match_scorers;
drop policy if exists "scorers_admin_update" on public.match_scorers;
drop policy if exists "scorers_admin_delete" on public.match_scorers;
create policy "scorers_public_read" on public.match_scorers for select to anon, authenticated using (true);
create policy "scorers_admin_write" on public.match_scorers for insert to authenticated with check (public.is_admin());
create policy "scorers_admin_update" on public.match_scorers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "scorers_admin_delete" on public.match_scorers for delete to authenticated using (public.is_admin());

-- SPONSORS
drop policy if exists "sponsors_public_read" on public.sponsors;
drop policy if exists "sponsors_authenticated_read" on public.sponsors;
drop policy if exists "sponsors_admin_write" on public.sponsors;
drop policy if exists "sponsors_admin_update" on public.sponsors;
drop policy if exists "sponsors_admin_delete" on public.sponsors;
create policy "sponsors_public_read" on public.sponsors for select to anon using (active = true);
create policy "sponsors_authenticated_read" on public.sponsors for select to authenticated using (active = true or public.is_admin());
create policy "sponsors_admin_write" on public.sponsors for insert to authenticated with check (public.is_admin());
create policy "sponsors_admin_update" on public.sponsors for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "sponsors_admin_delete" on public.sponsors for delete to authenticated using (public.is_admin());

-- SITE_SETTINGS
drop policy if exists "settings_public_read" on public.site_settings;
drop policy if exists "settings_admin_write" on public.site_settings;
drop policy if exists "settings_admin_update" on public.site_settings;
create policy "settings_public_read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings_admin_write" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "settings_admin_update" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- SUPABASE STORAGE
-- Os buckets são públicos para leitura das imagens do site.
-- Upload/update/delete somente para admins autorizados.
-- =====================================================================
insert into storage.buckets (id, name, public)
values
  ('team-logos', 'team-logos', true),
  ('players', 'players', true),
  ('sponsors', 'sponsors', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "decreto_storage_public_read" on storage.objects;
drop policy if exists "decreto_storage_admin_insert" on storage.objects;
drop policy if exists "decreto_storage_admin_update" on storage.objects;
drop policy if exists "decreto_storage_admin_delete" on storage.objects;

create policy "decreto_storage_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('team-logos', 'players', 'sponsors'));

create policy "decreto_storage_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id in ('team-logos', 'players', 'sponsors') and public.is_admin());

create policy "decreto_storage_admin_update"
on storage.objects for update
to authenticated
using (bucket_id in ('team-logos', 'players', 'sponsors') and public.is_admin())
with check (bucket_id in ('team-logos', 'players', 'sponsors') and public.is_admin());

create policy "decreto_storage_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id in ('team-logos', 'players', 'sponsors') and public.is_admin());

-- =====================================================================
-- CONFIGURAÇÃO INICIAL
-- =====================================================================
insert into public.site_settings (competition_name, season, hero_title, hero_subtitle, city, about_text)
select
  '3ª Copa Verão de Futsal Amador de Açucena',
  '2026',
  'Decreto FC',
  'Nossa primeira batalha nas quadras.',
  'Açucena — Minas Gerais',
  'O Decreto FC nasceu em Açucena/MG em 2017, criado entre amigos, e ficou conhecido pela organização e pela formação de bons elencos nas competições municipais. Tradicionalmente ligado ao futebol de campo, em 2026 o clube inicia um novo capítulo ao disputar pela primeira vez uma competição de futsal: a 3ª Copa Verão de Futsal Amador de Açucena.'
where not exists (select 1 from public.site_settings);

-- =====================================================================
-- IMPORTANTE — AUTORIZAR O PRIMEIRO ADMINISTRADOR
-- 1) Crie o usuário em Authentication > Users no painel do Supabase.
-- 2) Depois execute, trocando o e-mail:
--
-- insert into public.admin_users (user_id, display_name)
-- select id, 'Administrador Decreto FC'
-- from auth.users
-- where email = 'SEU_EMAIL_AQUI';
--
-- Repita para os outros cofundadores que terão acesso ao painel.
-- =====================================================================
