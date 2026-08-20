import "server-only";
import { sql } from "@/lib/db";
import type { Reminder } from "@/types/reminder";
import type { CreateReminderInput, ReminderFilters, UpdateReminderInput } from "@/lib/validation/reminder";

interface ReminderRow {
  id: string;
  title: string;
  description: string | null;
  remind_at: string;
  recurrence: string | null;
  status: string;
  linked_task_id: string | null;
  linked_goal_id: string | null;
  created_at: string;
  updated_at: string;
}

function toReminder(row: ReminderRow): Reminder {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    remindAt: row.remind_at,
    recurrence: row.recurrence as Reminder["recurrence"],
    status: row.status as Reminder["status"],
    linkedTaskId: row.linked_task_id,
    linkedGoalId: row.linked_goal_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const REMINDER_COLUMNS = `id, title, description, remind_at, recurrence, status, linked_task_id, linked_goal_id, created_at, updated_at`;

export async function findRemindersByUser(userId: string, filters: ReminderFilters): Promise<Reminder[]> {
  const conditions = ["user_id = $1"];
  const params: string[] = [userId];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}`);
  }

  if (filters.scope === "overdue") {
    conditions.push(`status = 'pending' and remind_at < now()`);
  } else if (filters.scope === "upcoming") {
    conditions.push(`status = 'pending' and remind_at >= now()`);
  } else if (filters.scope === "today") {
    conditions.push(`status = 'pending' and remind_at::date = current_date`);
  }

  const rows = (await sql.query(
    `select ${REMINDER_COLUMNS} from reminders
     where ${conditions.join(" and ")}
     order by remind_at asc`,
    params
  )) as ReminderRow[];

  return rows.map(toReminder);
}

export async function findReminderById(id: string, userId: string): Promise<Reminder | null> {
  const rows = (await sql`
    select ${sql.unsafe(REMINDER_COLUMNS)} from reminders
    where id = ${id} and user_id = ${userId}
  `) as ReminderRow[];

  return rows[0] ? toReminder(rows[0]) : null;
}

export async function createReminder(userId: string, input: CreateReminderInput): Promise<Reminder> {
  const rows = (await sql`
    insert into reminders (user_id, title, description, remind_at, recurrence, linked_task_id, linked_goal_id)
    values (
      ${userId},
      ${input.title},
      ${input.description ?? null},
      ${input.remindAt},
      ${input.recurrence ?? null},
      ${input.linkedTaskId ?? null},
      ${input.linkedGoalId ?? null}
    )
    returning ${sql.unsafe(REMINDER_COLUMNS)}
  `) as ReminderRow[];

  return toReminder(rows[0]);
}

// Returns null when no row matched id + user_id (not found or not owned) —
// the caller (reminder-service) is responsible for turning that into a 404.
export async function updateReminder(
  id: string,
  userId: string,
  input: UpdateReminderInput
): Promise<Reminder | null> {
  const sets: string[] = [];
  const params: unknown[] = [id, userId];

  const set = (column: string, value: unknown) => {
    params.push(value);
    sets.push(`${column} = $${params.length}`);
  };

  if (input.title !== undefined) set("title", input.title);
  if (input.description !== undefined) set("description", input.description);
  if (input.remindAt !== undefined) set("remind_at", input.remindAt);
  if (input.recurrence !== undefined) set("recurrence", input.recurrence);
  if (input.status !== undefined) set("status", input.status);
  if (input.linkedTaskId !== undefined) set("linked_task_id", input.linkedTaskId);
  if (input.linkedGoalId !== undefined) set("linked_goal_id", input.linkedGoalId);
  sets.push("updated_at = now()");

  const rows = (await sql.query(
    `update reminders set ${sets.join(", ")}
     where id = $1 and user_id = $2
     returning ${REMINDER_COLUMNS}`,
    params
  )) as ReminderRow[];

  return rows[0] ? toReminder(rows[0]) : null;
}

export async function deleteReminder(id: string, userId: string): Promise<boolean> {
  const rows = (await sql`
    delete from reminders where id = ${id} and user_id = ${userId} returning id
  `) as { id: string }[];

  return rows.length > 0;
}
