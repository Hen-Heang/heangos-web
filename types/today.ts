import type { Task } from "@/types/task";
import type { Goal } from "@/types/goal";
import type { Reminder } from "@/types/reminder";

export interface TodaySummary {
  date: string;
  tasks: {
    total: number;
    completed: number;
    items: Task[];
  };
  goals: {
    active: number;
    items: Goal[];
  };
  reminders: {
    overdueCount: number;
    dueTodayCount: number;
    items: Reminder[];
  };
}
