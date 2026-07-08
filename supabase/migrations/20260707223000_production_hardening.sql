-- Endurece permisos para Vercel/Supabase en produccion.

update public.profiles
set friend_code = upper(substr(replace(id::text, '-', ''), 1, 12))
where friend_code is null or friend_code !~ '^[A-F0-9]{12}$';

alter table public.profiles
  drop constraint if exists profiles_friend_code_format,
  add constraint profiles_friend_code_format check (friend_code ~ '^[A-F0-9]{12}$');

revoke all on public.profiles from anon;
revoke all on public.user_states from anon;
revoke all on public.friendships from anon;
revoke all on public.profiles from authenticated;
revoke all on public.user_states from authenticated;
revoke all on public.friendships from authenticated;

grant select (id, display_name, friend_code, avatar, level, streak_current) on public.profiles to authenticated;
grant insert (id, display_name, friend_code, avatar, onboarding_completed, updated_at) on public.profiles to authenticated;
grant update (display_name, avatar, level, streak_current, onboarding_completed, updated_at) on public.profiles to authenticated;
grant select, insert, update on public.user_states to authenticated;
grant select, insert, delete on public.friendships to authenticated;
grant update (status, updated_at) on public.friendships to authenticated;

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can request friendships" on public.friendships;
create policy "Users can request friendships"
on public.friendships
for insert
to authenticated
with check ((select auth.uid()) = requester_id and status = 'pending');

drop policy if exists "Recipients can accept friendships" on public.friendships;
create policy "Recipients can accept friendships"
on public.friendships
for update
to authenticated
using ((select auth.uid()) = addressee_id and status = 'pending')
with check ((select auth.uid()) = addressee_id and status = 'accepted');
