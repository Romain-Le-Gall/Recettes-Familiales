-- Extensions pour UUID
create extension if not exists pgcrypto;

-- =========================
-- Table: recipes
-- =========================
create table if not exists public.recipes (
  id text primary key,
  title text not null,
  author text not null,
  prep_time text not null default '',
  cook_time text not null default '',
  ingredients jsonb not null,
  steps jsonb not null,
  category text not null check (category in ('Entrée','Plat','Dessert')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_recipes_category on public.recipes(category);
create index if not exists idx_recipes_updated_at on public.recipes(updated_at desc);

-- Trigger pour updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_recipes_updated_at on public.recipes;
create trigger set_recipes_updated_at
before update on public.recipes
for each row
execute procedure public.set_updated_at();

-- =========================
-- Table: comments
-- =========================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null references public.recipes(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_comments_recipe_id on public.comments(recipe_id);
create index if not exists idx_comments_created_at on public.comments(created_at desc);

-- =========================
-- Table: modifications
-- =========================
create table if not exists public.modifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('creation','update','comment')),
  recipe_id text references public.recipes(id) on delete set null,
  recipe_title text not null default '',
  author text not null default '',
  at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_mods_recipe_id on public.modifications(recipe_id);
create index if not exists idx_mods_at on public.modifications(at desc);

-- =========================
-- RLS (Row-Level Security)
-- =========================
alter table public.recipes enable row level security;
alter table public.comments enable row level security;
alter table public.modifications enable row level security;

-- Politiques: accès complet aux utilisateurs authentifiés
create policy recipes_select_auth on public.recipes
for select using (auth.role() = 'authenticated');

create policy recipes_insert_auth on public.recipes
for insert with check (auth.role() = 'authenticated');

create policy recipes_update_auth on public.recipes
for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy recipes_delete_auth on public.recipes
for delete using (auth.role() = 'authenticated');

create policy comments_select_auth on public.comments
for select using (auth.role() = 'authenticated');

create policy comments_insert_auth on public.comments
for insert with check (auth.role() = 'authenticated');

create policy comments_delete_auth on public.comments
for delete using (auth.role() = 'authenticated');

create policy mods_select_auth on public.modifications
for select using (auth.role() = 'authenticated');

create policy mods_insert_auth on public.modifications
for insert with check (auth.role() = 'authenticated');

-- =========================
-- (Optionnel) Données d'exemple initiales
-- =========================
insert into public.recipes (id, title, author, prep_time, cook_time, ingredients, steps, category)
values
('entree_001','Salade de chèvre chaud','Aline','15 min','10 min',
  '["Chèvre","Pain","Miel","Salade","Tomates"]'::jsonb,
  '[{"title":"Préparer","content":"Préchauffer le four, trancher le pain."},{"title":"Cuire","content":"Déposer le chèvre, arroser de miel, enfourner."}]'::jsonb,
  'Entrée'
),
('plat_001','Boeuf bourguignon','Pascal','30 min','2 h',
  '["Boeuf","Vin rouge","Carottes","Oignons","Lardons"]'::jsonb,
  '[{"title":"Saisir","content":"Saisir la viande avec les lardons et oignons."},{"title":"Mijoter","content":"Ajouter vin et légumes, mijoter longtemps."}]'::jsonb,
  'Plat'
),
('dessert_001','Tarte Tatin','Chantal','20 min','40 min',
  '["Pommes","Sucre","Beurre","Pâte brisée"]'::jsonb,
  '[{"title":"Caraméliser","content":"Caraméliser les pommes au beurre et sucre."},{"title":"Cuire","content":"Couvrir de pâte et cuire au four."}]'::jsonb,
  'Dessert'
);