export type ReminderStatus = "pending" | "completed" | "dismissed";
export type ReminderRecurrence = "daily" | "weekly" | "monthly";

// DTO shape returned by the API — camelCase, no database-specific fields.
export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  remindAt: string;
  recurrence: ReminderRecurrence | null;
  status: ReminderStatus;
  linkedTaskId: string | null;
  linkedGoalId: string | null;
  createdAt: string;
  updatedAt: string;
}
