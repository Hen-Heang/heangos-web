import { z } from "zod";

export const reminderRecurrenceSchema = z.enum(["daily", "weekly", "monthly"]);
export const reminderStatusSchema = z.enum(["pending", "completed", "dismissed"]);

export const createReminderSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  remindAt: z.string().datetime(),
  recurrence: reminderRecurrenceSchema.optional(),
  linkedTaskId: z.string().uuid().optional(),
  linkedGoalId: z.string().uuid().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;

export const updateReminderSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    remindAt: z.string().datetime().optional(),
    recurrence: reminderRecurrenceSchema.nullable().optional(),
    status: reminderStatusSchema.optional(),
    linkedTaskId: z.string().uuid().nullable().optional(),
    linkedGoalId: z.string().uuid().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;

export const snoozeReminderSchema = z.object({
  remindAt: z.string().datetime(),
});

export type SnoozeReminderInput = z.infer<typeof snoozeReminderSchema>;

export const reminderFiltersSchema = z.object({
  status: reminderStatusSchema.optional(),
  scope: z.enum(["upcoming", "overdue", "today"]).optional(),
});

export type ReminderFilters = z.infer<typeof reminderFiltersSchema>;
