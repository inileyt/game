-- Bitwood: allow up to 20 levels and 60 stars (JavaScript + Go + PHP tracks).
-- Run once in Supabase: SQL Editor → New query → paste → Run.
alter table public.profiles drop constraint if exists stars_range;
alter table public.profiles add constraint stars_range check (stars between 0 and 60);
alter table public.profiles drop constraint if exists levels_range;
alter table public.profiles add constraint levels_range check (levels between 0 and 20);
