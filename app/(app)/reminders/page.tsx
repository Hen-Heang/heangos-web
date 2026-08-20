import Link from "next/link";
import { cn } from "@/lib/utils";
import { ensureAppUser } from "@/lib/auth/ensure-app-user";
import { listReminders } from "@/lib/services/reminder-service";
import { reminderFiltersSchema } from "@/lib/validation/reminder";
import type { ReminderFilters } from "@/lib/validation/reminder";
import { ReminderList } from "@/components/reminders/reminder-list";

const SCOPE_TABS: { label: string; value: ReminderFilters["scope"] }[] = [
  { label: "All", value: undefined },
  { label: "Upcoming", value: "upcoming" },
  { label: "Overdue", value: "overdue" },
  { label: "Today", value: "today" },
];

export default async function RemindersPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const params = await searchParams;
  const filters = reminderFiltersSchema.parse({
    scope: params.scope || undefined,
  });

  const appUser = await ensureAppUser();
  const reminders = await listReminders(appUser.id, filters);

  function hrefFor(scope: ReminderFilters["scope"]): string {
    return scope ? `/reminders?scope=${scope}` : "/reminders";
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Reminders</h1>

      <div className="flex flex-wrap gap-1">
        {SCOPE_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={hrefFor(tab.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              filters.scope === tab.value ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <ReminderList reminders={reminders} />
    </div>
  );
}
