create or replace function public.get_task_metrics(p_today date)
returns table (
  total bigint,
  completed bigint,
  pending bigint,
  overdue bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    count(*) as total,
    count(*) filter (where status = 'completed') as completed,
    count(*) filter (where status <> 'completed') as pending,
    count(*) filter (
      where status <> 'completed'
        and due_date < p_today
    ) as overdue
  from public.tasks
  where user_id = (select auth.uid());
$$;

revoke all on function public.get_task_metrics(date) from public;
revoke all on function public.get_task_metrics(date) from anon;
grant execute on function public.get_task_metrics(date) to authenticated;

comment on function public.get_task_metrics(date) is
  'Returns one RLS-scoped task summary row for the authenticated user.';
