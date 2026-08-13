create extension if not exists pg_trgm with schema extensions;

create schema if not exists private;
revoke all on schema private from public;
revoke usage on schema private from anon, authenticated;

create type public.task_status as enum ('pending', 'in_progress', 'completed');
create type public.task_priority as enum ('low', 'medium', 'high');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null
    or char_length(btrim(display_name)) between 1 and 80
  )
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  status public.task_status not null default 'pending',
  priority public.task_priority not null default 'medium',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_length check (char_length(btrim(title)) between 1 and 160),
  constraint tasks_description_length check (char_length(description) <= 5000),
  constraint tasks_completed_at_consistency check (
    status = 'completed'
    or completed_at is null
  )
);

create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_user_status_due_date_idx
  on public.tasks (user_id, status, due_date, id);
create index tasks_user_priority_due_date_idx
  on public.tasks (user_id, priority, due_date, id);
create index tasks_user_due_date_idx
  on public.tasks (user_id, due_date, id)
  where due_date is not null;
create index tasks_title_search_idx
  on public.tasks using gin (lower(title) extensions.gin_trgm_ops);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.sync_task_completed_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'completed' and new.completed_at is null then
    new.completed_at = now();
  elsif new.status <> 'completed' then
    new.completed_at = null;
  end if;

  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 80), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function private.set_updated_at();

create trigger tasks_sync_completed_at
before insert or update of status on public.tasks
for each row execute function private.sync_task_completed_at();

create trigger auth_user_created_create_profile
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

create policy profiles_select_own
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy profiles_update_own
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy tasks_select_own
on public.tasks for select to authenticated
using (user_id = (select auth.uid()));

create policy tasks_insert_own
on public.tasks for insert to authenticated
with check (user_id = (select auth.uid()));

create policy tasks_update_own
on public.tasks for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy tasks_delete_own
on public.tasks for delete to authenticated
using (user_id = (select auth.uid()));

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;

revoke all on table public.profiles, public.tasks from anon, authenticated, service_role;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.tasks to authenticated;
grant select, insert, update, delete on table public.profiles, public.tasks to service_role;

revoke all on type public.task_status, public.task_priority from public;
grant usage on type public.task_status, public.task_priority to authenticated, service_role;

revoke execute on function private.set_updated_at() from public, anon, authenticated;
revoke execute on function private.sync_task_completed_at() from public, anon, authenticated;
revoke execute on function private.handle_new_user() from public, anon, authenticated;

comment on table public.profiles is 'Private profile data owned by one Supabase Auth user.';
comment on table public.tasks is 'Private tasks isolated by user_id through row level security.';
comment on function private.handle_new_user() is 'Creates a profile after a Supabase Auth user is inserted.';
