import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const isOverdue = date < new Date(new Date().toDateString());

  const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return isOverdue ? `Overdue · ${label}` : label;
}

// Reminders carry a time-of-day, unlike task due dates, so "overdue" compares
// against the exact instant rather than the start of today.
export function formatRemindAt(remindAt: string): string {
  const date = new Date(remindAt);
  const isOverdue = date < new Date();

  const label = date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return isOverdue ? `Overdue · ${label}` : label;
}
