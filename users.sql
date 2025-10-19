-- Extension pour le hashage (bcrypt via pgcrypto)
create extension if not exists pgcrypto;

-- Table minimale: login + password_hash (hashé, pas de stockage en clair)
create table if not exists public.users (
  login text primary key,
  password_hash text not null
);

-- Insertion des utilisateurs avec le mot de passe "jeveuxmanger!"
insert into public.users (login, password_hash) values
('Aline',   crypt('jeveuxmanger!', gen_salt('bf'))),
('Grégory', crypt('jeveuxmanger!', gen_salt('bf'))),
('Joris',   crypt('jeveuxmanger!', gen_salt('bf'))),
('Enola',   crypt('jeveuxmanger!', gen_salt('bf'))),
('Pascal',  crypt('jeveuxmanger!', gen_salt('bf'))),
('Chantal', crypt('jeveuxmanger!', gen_salt('bf'))),
('Romain',  crypt('jeveuxmanger!', gen_salt('bf')));