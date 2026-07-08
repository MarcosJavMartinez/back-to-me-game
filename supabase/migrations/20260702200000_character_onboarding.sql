-- El personaje debe crearse antes de entrar por primera vez.

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object('onboarding_completed', false)
where not (coalesce(raw_user_meta_data, '{}'::jsonb) ? 'onboarding_completed');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, friend_code, onboarding_completed)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Amigo'), 40),
    upper(substr(replace(new.id::text, '-', ''), 1, 12)),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
