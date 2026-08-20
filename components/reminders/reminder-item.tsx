"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { completeReminder, deleteReminder, dismissReminder, snoozeReminder } from "@/lib/api/reminders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { cn, formatRemindAt } from "@/lib/utils";
import type { Reminder } from "@/types/reminder";

const RECURRENCE_LABEL: Record<NonNullable<Reminder["recurrence"]>, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

function snoozeUntil(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function ReminderItem({ reminder }: { reminder: Reminder }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, setPending] = useState(false);

  const isPending = reminder.status === "pending";

  async function withPending(action: () => Promise<unknown>) {
    setPending(true);
    try {
      await action();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (editing) {
    return (
      <div className="p-3">
        <ReminderForm mode="edit" reminder={reminder} onDone={() => setEditing(false)} />
      </div>
    );
  }

  const remindLabel = formatRemindAt(reminder.remindAt);
  const isOverdue = isPending && remindLabel.startsWith("Overdue");

  return (
    <div className="flex items-center justify-between gap-3 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => withPending(() => completeReminder(reminder.id))}
          disabled={pending || !isPending}
          aria-label={reminder.recurrence ? "Complete this occurrence" : "Complete reminder"}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border",
            !isPending ? "border-primary bg-primary text-primary-foreground" : "border-input"
          )}
        >
          {!isPending && <Check className="size-3" />}
        </button>
        <div className="min-w-0">
          <p className={cn("truncate text-sm", !isPending && "text-muted-foreground line-through")}>
            {reminder.title}
          </p>
          {reminder.description && (
            <p className="truncate text-xs text-muted-foreground">{reminder.description}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={isOverdue ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
          {remindLabel}
        </span>
        {reminder.recurrence && <Badge variant="outline">{RECURRENCE_LABEL[reminder.recurrence]}</Badge>}
        {reminder.status === "dismissed" && <Badge variant="default">Dismissed</Badge>}

        {isPending && (
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => withPending(() => snoozeReminder(reminder.id, snoozeUntil(1)))}
            >
              +1h
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => withPending(() => snoozeReminder(reminder.id, snoozeUntil(24)))}
            >
              +1d
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={pending}
              aria-label="Dismiss reminder"
              onClick={() => withPending(() => dismissReminder(reminder.id))}
            >
              <X className="size-4" />
            </Button>
          </>
        )}

        <Button variant="ghost" size="icon" onClick={() => setEditing(true)} aria-label="Edit reminder">
          <Pencil className="size-4" />
        </Button>

        {confirmingDelete ? (
          <div className="flex items-center gap-1">
            <Button
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={() => withPending(() => deleteReminder(reminder.id))}
            >
              Confirm
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setConfirmingDelete(true)} aria-label="Delete reminder">
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
