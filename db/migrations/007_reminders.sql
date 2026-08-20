create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title varchar not null,
  description text,
  remind_at timestamptz not null,
  recurrence varchar
    check (recurrence in ('daily', 'weekly', 'monthly')),
  status varchar not null default 'pending'
    check (status in ('pending', 'completed', 'dismissed')),
  linked_task_id uuid references tasks(id) on delete set null,
  linked_goal_id uuid references goals(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reminders_user_id_idx on reminders (user_id);

-- Backs the upcoming/overdue/today list queries, which all filter by
-- user_id + status and sort by remind_at.
create index if not exists reminders_user_status_remind_at_idx
  on reminders (user_id, status, remind_at);
