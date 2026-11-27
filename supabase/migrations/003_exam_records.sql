-- Bitwood: speed leaderboard for timed Academy exams.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
create table if not exists public.exam_records (
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
