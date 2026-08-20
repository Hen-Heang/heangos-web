"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createReminder } from "@/lib/api/reminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function defaultRemindAt(): string {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function QuickAddReminder() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState(defaultRemindAt);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      await createReminder({ title, remindAt: new Date(remindAt).toISOString() });
      setTitle("");
      setRemindAt(defaultRemindAt());
      setOpen(false);
      router.refresh();
    } catch {
      setError("Couldn't create the reminder. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus />
        Reminder
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        autoFocus
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="h-8 w-40"
      />
      <input
        type="datetime-local"
        value={remindAt}
        onChange={(e) => setRemindAt(e.target.value)}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
      />
      <Button type="submit" size="sm" disabled={pending || title.trim().length === 0}>
        Add
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </form>
  );
}
