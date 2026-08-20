"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { ReminderItem } from "@/components/reminders/reminder-item";
import type { Reminder } from "@/types/reminder";

export function ReminderList({ reminders }: { reminders: Reminder[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {creating ? (
        <ReminderForm mode="create" onDone={() => setCreating(false)} />
      ) : (
        <Button variant="outline" size="sm" onClick={() => setCreating(true)} className="self-start">
          <Plus />
          New reminder
        </Button>
      )}

      {reminders.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No reminders match this filter.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {reminders.map((reminder) => (
            <ReminderItem key={reminder.id} reminder={reminder} />
          ))}
        </div>
      )}
    </div>
  );
}
