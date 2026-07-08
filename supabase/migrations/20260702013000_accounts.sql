-- Cuentas, perfiles y progreso privado por usuario.

do $$
begin
  if to_regclass('public.app_states') is not null then
    execute 'alter table public.app_states enable row level security';
    execute 'revoke all on public.app_states from anon';
    execute 'drop policy if exists "public app state read" on public.app_states';
    execute 'drop policy if exists "public app state write" on public.app_states';
  end if;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_states enable row level security;

revoke all on public.profiles from anon;
revoke all on public.user_states from anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.user_states to authenticated;

drop policy if exists "Users can read their profile" on public.profiles;
drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Users can read their state" on public.user_states;
drop policy if exists "Users can insert their state" on public.user_states;
drop policy if exists "Users can update their state" on public.user_states;

create policy "Users can read their profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can read their state"
on public.user_states
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their state"
on public.user_states
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their state"
on public.user_states
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Amigo'), 40)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
