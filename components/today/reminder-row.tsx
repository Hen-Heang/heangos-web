import { formatRemindAt } from "@/lib/utils";
import type { Reminder } from "@/types/reminder";

export function ReminderRow({ reminder }: { reminder: Reminder }) {
  const remindLabel = formatRemindAt(reminder.remindAt);
  const isOverdue = remindLabel.startsWith("Overdue");

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm">{reminder.title}</span>
      <span className={isOverdue ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        {remindLabel}
      </span>
    </div>
  );
}
