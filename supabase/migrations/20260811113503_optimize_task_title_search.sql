drop index if exists public.tasks_title_search_idx;

create index tasks_title_search_idx
  on public.tasks using gin (title extensions.gin_trgm_ops);

comment on index public.tasks_title_search_idx is
  'Supports case-insensitive task title search through ILIKE and pg_trgm.';
