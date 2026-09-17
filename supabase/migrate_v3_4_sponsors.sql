-- =====================================================================
-- DECRETO FC — MIGRAÇÃO V3.4 | GALERIA -> PATROCINADORES
-- Execute UMA VEZ no SQL Editor do Supabase já configurado.
-- Não apaga a tabela/bucket antigos da galeria.
-- =====================================================================

begin;

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
alter table public.sponsors enable row level security;

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

insert into storage.buckets (id, name, public)
values ('sponsors', 'sponsors', true)
on conflict (id) do update set public = excluded.public;

-- Mantém os buckets da versão anterior e acrescenta sponsors.
drop policy if exists "decreto_storage_public_read" on storage.objects;
drop policy if exists "decreto_storage_admin_insert" on storage.objects;
drop policy if exists "decreto_storage_admin_update" on storage.objects;
drop policy if exists "decreto_storage_admin_delete" on storage.objects;

create policy "decreto_storage_public_read" on storage.objects for select to anon, authenticated
using (bucket_id in ('team-logos', 'players', 'gallery', 'sponsors'));
create policy "decreto_storage_admin_insert" on storage.objects for insert to authenticated
with check (bucket_id in ('team-logos', 'players', 'gallery', 'sponsors') and public.is_admin());
create policy "decreto_storage_admin_update" on storage.objects for update to authenticated
using (bucket_id in ('team-logos', 'players', 'gallery', 'sponsors') and public.is_admin())
with check (bucket_id in ('team-logos', 'players', 'gallery', 'sponsors') and public.is_admin());
create policy "decreto_storage_admin_delete" on storage.objects for delete to authenticated
using (bucket_id in ('team-logos', 'players', 'gallery', 'sponsors') and public.is_admin());

commit;
