import "server-only";
import { countTasksCompletedToday, findTodayTasksByUser } from "@/lib/repositories/task-repository";
import { countActiveGoals, listActiveGoalsForToday } from "@/lib/services/goal-service";
import { getReminderSummary } from "@/lib/services/reminder-service";
import type { TodaySummary } from "@/types/today";

const TODAY_GOALS_LIMIT = 5;

// Orchestrates each domain's own service — today-service never queries a
// table directly for a domain that already has one.
export async function getTodaySummary(userId: string): Promise<TodaySummary> {
  const [items, completed, goalItems, activeGoalCount, reminderSummary] = await Promise.all([
    findTodayTasksByUser(userId),
    countTasksCompletedToday(userId),
    listActiveGoalsForToday(userId, TODAY_GOALS_LIMIT),
    countActiveGoals(userId),
    getReminderSummary(userId),
  ]);

  return {
    date: new Date().toISOString().slice(0, 10),
    tasks: {
      total: items.length,
      completed,
      items,
    },
    goals: {
      active: activeGoalCount,
      items: goalItems,
    },
    reminders: {
      overdueCount: reminderSummary.overdueCount,
      dueTodayCount: reminderSummary.dueTodayCount,
      items: reminderSummary.upcoming,
    },
  };
}
