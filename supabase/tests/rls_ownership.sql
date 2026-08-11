begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

insert into auth.users (id, email, raw_user_meta_data)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'rls-a@example.test', '{}'::jsonb),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'rls-b@example.test', '{}'::jsonb);

insert into public.tasks (id, user_id, title)
values
  (
    'aaaaaaaa-0000-4000-8000-000000000001',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'User A task'
  ),
  (
    'bbbbbbbb-0000-4000-8000-000000000001',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'User B task'
  );

select plan(5);

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","role":"authenticated"}';

select is(
  (
    select count(*)
    from public.tasks
    where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  0::bigint,
  'user A cannot select user B tasks'
);

select is(
  (
    with changed as (
      update public.tasks
      set title = 'Cross-user update must not happen'
      where id = 'bbbbbbbb-0000-4000-8000-000000000001'
      returning 1
    )
    select count(*) from changed
  ),
  0::bigint,
  'user A cannot update user B task'
);

select is(
  (
    with removed as (
      delete from public.tasks
      where id = 'bbbbbbbb-0000-4000-8000-000000000001'
      returning 1
    )
    select count(*) from removed
  ),
  0::bigint,
  'user A cannot delete user B task'
);

select throws_ok(
  $rls$
    insert into public.tasks (user_id, title)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Cross-user insert must fail')
  $rls$,
  '42501',
  null,
  'user A cannot insert a task for user B'
);

select is(
  (
    with changed as (
      update public.tasks
      set title = 'User A task updated'
      where id = 'aaaaaaaa-0000-4000-8000-000000000001'
      returning 1
    )
    select count(*) from changed
  ),
  1::bigint,
  'user A can update their own task'
);

select * from finish();
reset role;
rollback;
