import type { ReminderRecurrence } from "@/types/reminder";

// Pure logic for the Reminders module — no React, no DB. V1 recurrence is
// deliberately simple: advance the same row to its next occurrence instead
// of generating a row per occurrence or running a dispatch engine.
export function nextRecurrence(remindAt: string, recurrence: ReminderRecurrence): string {
  const date = new Date(remindAt);

  switch (recurrence) {
    case "daily":
      date.setUTCDate(date.getUTCDate() + 1);
      break;
    case "weekly":
      date.setUTCDate(date.getUTCDate() + 7);
      break;
    case "monthly":
      date.setUTCMonth(date.getUTCMonth() + 1);
      break;
  }

  return date.toISOString();
}
