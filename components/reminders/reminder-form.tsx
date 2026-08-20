"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createReminder, updateReminder } from "@/lib/api/reminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Reminder, ReminderRecurrence } from "@/types/reminder";

const RECURRENCE_OPTIONS: { label: string; value: ReminderRecurrence }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

// datetime-local has no timezone — the browser interprets the typed value in
// local time, so new Date(value).toISOString() round-trips correctly.
function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ReminderForm({
  mode,
  reminder,
  onDone,
}: {
  mode: "create" | "edit";
  reminder?: Reminder;
  onDone: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(reminder?.title ?? "");
  const [description, setDescription] = useState(reminder?.description ?? "");
  const [remindAt, setRemindAt] = useState(
    reminder ? toDatetimeLocal(reminder.remindAt) : toDatetimeLocal(new Date().toISOString())
  );
  const [recurrence, setRecurrence] = useState<ReminderRecurrence | "">(reminder?.recurrence ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const isoRemindAt = new Date(remindAt).toISOString();

    try {
      if (mode === "create") {
        await createReminder({
          title,
          description: description.trim() || undefined,
          remindAt: isoRemindAt,
          recurrence: recurrence || undefined,
        });
      } else if (reminder) {
        await updateReminder(reminder.id, {
          title,
          description: description.trim() === "" ? null : description.trim(),
          remindAt: isoRemindAt,
          recurrence: recurrence || null,
        });
      }
      router.refresh();
      onDone();
    } catch {
      setError("Couldn't save the reminder. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <Input
        autoFocus
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          required
          className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
        />
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as ReminderRecurrence | "")}
          className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
        >
          <option value="">Doesn&apos;t repeat</option>
          {RECURRENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending || title.trim().length === 0}>
          {mode === "create" ? "Add reminder" : "Save"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
