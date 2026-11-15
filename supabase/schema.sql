-- =====================================================================
-- Portfólio gastronômico — esquema do banco (Supabase)
-- Cole tudo no Supabase > SQL Editor > New query > Run.
-- =====================================================================

create extension if not exists "pgcrypto";

-- Configurações gerais (linha única, id = 1)
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  name text default '',
  role text default '',
  tagline text default '',
  about_title text default '',
  about_html text default '',
  about_photo_url text,
  about_photo_path text,
  education text default '',
  experience text default '',
  specialties text default '',
  email text default '',
  whatsapp text default '',
  instagram text default '',
  facebook text default '',
  tiktok text default '',
  youtube text default '',
  linkedin text default '',
  website text default '',
  updated_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  description text default '',
  category_id uuid references public.categories(id) on delete set null,
  url text not null,
  thumb_url text,
  path text,
  thumb_path text,
  width int,
  height int,
  position int not null default 0,
  created_at timestamptz default now()
);
create index if not exists photos_position_idx on public.photos(position);

-- Reordenação em lote
create or replace function public.reorder_photos(ids uuid[]) returns void
language sql security invoker as $$
  update public.photos p set position = t.ord - 1
  from unnest(ids) with ordinality as t(id, ord) where p.id = t.id;
$$;
create or replace function public.reorder_categories(ids uuid[]) returns void
language sql security invoker as $$
  update public.categories c set position = t.ord - 1
  from unnest(ids) with ordinality as t(id, ord) where c.id = t.id;
$$;

-- Segurança: leitura pública, escrita apenas para usuários logados
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.photos enable row level security;

drop policy if exists "leitura publica" on public.settings;
drop policy if exists "leitura publica" on public.categories;
drop policy if exists "leitura publica" on public.photos;
drop policy if exists "admin escreve" on public.settings;
drop policy if exists "admin escreve" on public.categories;
drop policy if exists "admin escreve" on public.photos;

create policy "leitura publica" on public.settings for select using (true);
create policy "leitura publica" on public.categories for select using (true);
create policy "leitura publica" on public.photos for select using (true);
create policy "admin escreve" on public.settings for all to authenticated using (true) with check (true);
create policy "admin escreve" on public.categories for all to authenticated using (true) with check (true);
create policy "admin escreve" on public.photos for all to authenticated using (true) with check (true);

-- Armazenamento de imagens (bucket público "photos")
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos leitura publica" on storage.objects;
drop policy if exists "fotos admin envia" on storage.objects;
drop policy if exists "fotos admin altera" on storage.objects;
drop policy if exists "fotos admin apaga" on storage.objects;
create policy "fotos leitura publica" on storage.objects for select using (bucket_id = 'photos');
create policy "fotos admin envia" on storage.objects for insert to authenticated with check (bucket_id = 'photos');
create policy "fotos admin altera" on storage.objects for update to authenticated using (bucket_id = 'photos');
create policy "fotos admin apaga" on storage.objects for delete to authenticated using (bucket_id = 'photos');
