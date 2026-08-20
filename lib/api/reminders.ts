import { apiFetch } from "@/lib/api/client";
import type { CreateReminderInput, UpdateReminderInput } from "@/lib/validation/reminder";
import type { Reminder } from "@/types/reminder";

export function createReminder(input: CreateReminderInput): Promise<Reminder> {
  return apiFetch<Reminder>("/api/reminders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateReminder(id: string, input: UpdateReminderInput): Promise<Reminder> {
  return apiFetch<Reminder>(`/api/reminders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteReminder(id: string): Promise<void> {
  await apiFetch<{ id: string }>(`/api/reminders/${id}`, { method: "DELETE" });
}

export function completeReminder(id: string): Promise<Reminder> {
  return apiFetch<Reminder>(`/api/reminders/${id}/complete`, { method: "POST" });
}

export function dismissReminder(id: string): Promise<Reminder> {
  return apiFetch<Reminder>(`/api/reminders/${id}/dismiss`, { method: "POST" });
}

export function snoozeReminder(id: string, remindAt: string): Promise<Reminder> {
  return apiFetch<Reminder>(`/api/reminders/${id}/snooze`, {
    method: "POST",
    body: JSON.stringify({ remindAt }),
  });
}
