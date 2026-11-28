-- =====================================================================
-- Bitwood database schema for Supabase
-- Run this ONCE: Supabase dashboard → SQL Editor → New query → paste → Run.
-- It is safe to run again (it uses IF NOT EXISTS / OR REPLACE).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Public player profiles (shown on the leaderboard)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null,
  xp          integer not null default 0,
  stars       integer not null default 0,
  levels      integer not null default 0,
  badges      integer not null default 0,
  updated_at  timestamptz not null default now(),
  constraint username_length check (char_length(trim(username)) between 2 and 20),
  constraint username_no_html check (username !~ '[<>"&]'),
  constraint xp_range     check (xp between 0 and 1000000),
  constraint stars_range  check (stars between 0 and 105),
  constraint levels_range check (levels between 0 and 35),
  constraint badges_range check (badges between 0 and 50)
);
create unique index if not exists profiles_username_unique on public.profiles (lower(username));
create index if not exists profiles_xp_idx on public.profiles (xp desc);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public" on public.profiles
  for select to anon, authenticated using (true);

drop policy if exists "Players update their own profile" on public.profiles;
create policy "Players update their own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Players create their own profile" on public.profiles;
create policy "Players create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

-- ---------------------------------------------------------------------
-- 2. Private game progress (only the owner can read or change it)
-- ---------------------------------------------------------------------
create table if not exists public.progress (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint progress_size check (pg_column_size(data) < 500000)
);

alter table public.progress enable row level security;

drop policy if exists "Players read their own progress" on public.progress;
create policy "Players read their own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Players save their own progress" on public.progress;
create policy "Players save their own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Players update their own progress" on public.progress;
create policy "Players update their own progress" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update on public.progress to authenticated;

-- ---------------------------------------------------------------------
-- 3. Contact form messages (anyone can send, nobody can read them through
--    the website — the founder reads them in the Supabase Table Editor)
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  topic       text not null default 'Question',
  message     text not null,
  user_id     uuid references auth.users (id) on delete set null,
  constraint name_length    check (char_length(name) between 1 and 60),
  constraint email_format   check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 120),
  constraint topic_length   check (char_length(topic) between 1 and 40),
  constraint message_length check (char_length(message) between 5 and 2000)
);

alter table public.messages enable row level security;

drop policy if exists "Anyone can send a message" on public.messages;
create policy "Anyone can send a message" on public.messages
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

grant insert on public.messages to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Create a profile automatically when someone signs up.
--    The username comes from the sign-up form; if it is taken or invalid,
--    a safe fallback name is used so sign-up never fails.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  wanted text := trim(coalesce(new.raw_user_meta_data ->> 'username', ''));
  final_name text;
begin
  if char_length(wanted) between 2 and 20 and wanted !~ '[<>"&]' then
    final_name := wanted;
  else
    final_name := 'Player' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;
  if exists (select 1 from public.profiles p where lower(p.username) = lower(final_name)) then
    final_name := left(final_name, 15) || floor(random() * 9000 + 1000)::int;
  end if;
  insert into public.profiles (id, username) values (new.id, final_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 5. Speed leaderboard for timed Academy exams
-- ---------------------------------------------------------------------
  user_id     uuid not null references public.profiles (id) on delete cascade,
  course      text not null,
  score       integer not null,
  seconds     integer not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, course),
  constraint course_name   check (course ~ '^[a-z]{2,20}$'),
  constraint score_range   check (score between 0 and 20),
  constraint seconds_range check (seconds between 1 and 600)
);
create index if not exists exam_records_board_idx on public.exam_records (course, score desc, seconds asc);

alter table public.exam_records enable row level security;

drop policy if exists "Exam records are public" on public.exam_records;
create policy "Exam records are public" on public.exam_records
  for select to anon, authenticated using (true);

drop policy if exists "Players add their own exam record" on public.exam_records;
create policy "Players add their own exam record" on public.exam_records
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Players update their own exam record" on public.exam_records;
create policy "Players update their own exam record" on public.exam_records
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select on public.exam_records to anon, authenticated;
grant insert, update on public.exam_records to authenticated;
