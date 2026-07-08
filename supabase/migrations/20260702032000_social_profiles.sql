-- Identidad visual y amistades entre cuentas.

alter table public.profiles
  add column if not exists friend_code text,
  add column if not exists avatar jsonb not null default '{}'::jsonb,
  add column if not exists level integer not null default 1 check (level > 0),
  add column if not exists streak_current integer not null default 0 check (streak_current >= 0);

update public.profiles
set friend_code = upper(substr(replace(id::text, '-', ''), 1, 12))
where friend_code is null;

alter table public.profiles alter column friend_code set not null;
create unique index if not exists profiles_friend_code_key on public.profiles(friend_code);

insert into public.profiles (id, display_name, friend_code)
select
  users.id,
  left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'display_name'), ''), split_part(users.email, '@', 1), 'Amigo'), 40),
  upper(substr(replace(users.id::text, '-', ''), 1, 12))
from auth.users as users
on conflict (id) do nothing;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Authenticated users can find profiles"
on public.profiles
for select
to authenticated
using ((select auth.uid()) is not null);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> addressee_id)
);

create unique index if not exists friendships_unique_pair
on public.friendships (
  least(requester_id, addressee_id),
  greatest(requester_id, addressee_id)
);

alter table public.friendships enable row level security;
grant select, insert, update, delete on public.friendships to authenticated;

drop policy if exists "Users can read their friendships" on public.friendships;
drop policy if exists "Users can request friendships" on public.friendships;
drop policy if exists "Recipients can accept friendships" on public.friendships;
drop policy if exists "Users can remove their friendships" on public.friendships;

create policy "Users can read their friendships"
on public.friendships
for select
to authenticated
using ((select auth.uid()) in (requester_id, addressee_id));

create policy "Users can request friendships"
on public.friendships
for insert
to authenticated
with check ((select auth.uid()) = requester_id);

create policy "Recipients can accept friendships"
on public.friendships
for update
to authenticated
using ((select auth.uid()) = addressee_id)
with check ((select auth.uid()) = addressee_id);

create policy "Users can remove their friendships"
on public.friendships
for delete
to authenticated
using ((select auth.uid()) in (requester_id, addressee_id));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, friend_code)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Amigo'), 40),
    upper(substr(replace(new.id::text, '-', ''), 1, 12))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
