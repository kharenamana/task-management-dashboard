-- Local development only. `supabase db reset` applies this file after migrations.
-- These placeholder Auth rows have no password and cannot sign in.

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'local-alex@example.test',
    '{"full_name":"Alex Rivera"}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'local-sam@example.test',
    '{"full_name":"Sam Chen"}'::jsonb
  );

insert into public.tasks (id, user_id, title, description, status, priority, due_date)
values
  (
    '10000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'Polish portfolio case study',
    'Prepare the final TaskFlow walkthrough and architecture notes.',
    'in_progress',
    'high',
    '2030-08-14'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '11111111-1111-4111-8111-111111111111',
    'Review dashboard accessibility',
    'Check landmarks, focus order, labels, and reduced motion.',
    'pending',
    'medium',
    '2030-08-16'
  ),
  (
    '20000000-0000-4000-8000-000000000001',
    '22222222-2222-4222-8222-222222222222',
    'Plan launch announcement',
    'Draft the private-beta announcement.',
    'completed',
    'low',
    '2030-08-18'
  );
