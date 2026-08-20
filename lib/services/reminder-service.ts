import "server-only";
import { Errors } from "@/lib/errors";
import { nextRecurrence } from "@/lib/reminders";
import {
  createReminder,
  deleteReminder,
  findReminderById,
  findRemindersByUser,
  updateReminder,
} from "@/lib/repositories/reminder-repository";
import type { CreateReminderInput, ReminderFilters, UpdateReminderInput } from "@/lib/validation/reminder";
import type { Reminder } from "@/types/reminder";

export async function listReminders(userId: string, filters: ReminderFilters): Promise<Reminder[]> {
  return findRemindersByUser(userId, filters);
}

export async function addReminder(userId: string, input: CreateReminderInput): Promise<Reminder> {
  return createReminder(userId, input);
}

export async function editReminder(userId: string, id: string, input: UpdateReminderInput): Promise<Reminder> {
  const reminder = await updateReminder(id, userId, input);
  if (!reminder) throw Errors.notFound("Reminder");
  return reminder;
}

export async function removeReminder(userId: string, id: string): Promise<void> {
  const deleted = await deleteReminder(id, userId);
  if (!deleted) throw Errors.notFound("Reminder");
}

// A recurring reminder advances to its next occurrence and stays pending; a
// one-off reminder is marked completed. Either way there's exactly one row
// per reminder — no generated history, no dispatch engine.
export async function completeReminder(userId: string, id: string): Promise<Reminder> {
  const reminder = await findReminderById(id, userId);
  if (!reminder) throw Errors.notFound("Reminder");

  const updated = await updateReminder(
    id,
    userId,
    reminder.recurrence
      ? { remindAt: nextRecurrence(reminder.remindAt, reminder.recurrence) }
      : { status: "completed" }
  );
  if (!updated) throw Errors.notFound("Reminder");
  return updated;
}

export async function dismissReminder(userId: string, id: string): Promise<Reminder> {
  const reminder = await updateReminder(id, userId, { status: "dismissed" });
  if (!reminder) throw Errors.notFound("Reminder");
  return reminder;
}

export async function snoozeReminder(userId: string, id: string, remindAt: string): Promise<Reminder> {
  const reminder = await updateReminder(id, userId, { remindAt, status: "pending" });
  if (!reminder) throw Errors.notFound("Reminder");
  return reminder;
}

export interface ReminderSummary {
  overdueCount: number;
  dueTodayCount: number;
  upcoming: Reminder[];
}

const SUMMARY_UPCOMING_LIMIT = 5;

// Consumed by today-service so Today can show a compact reminders card
// without knowing anything about the reminders schema.
export async function getReminderSummary(userId: string): Promise<ReminderSummary> {
  const [overdue, dueToday, upcoming] = await Promise.all([
    findRemindersByUser(userId, { scope: "overdue" }),
    findRemindersByUser(userId, { scope: "today" }),
    findRemindersByUser(userId, { scope: "upcoming" }),
  ]);

  return {
    overdueCount: overdue.length,
    dueTodayCount: dueToday.length,
    upcoming: upcoming.slice(0, SUMMARY_UPCOMING_LIMIT),
  };
}
