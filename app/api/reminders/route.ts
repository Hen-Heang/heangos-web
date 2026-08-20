import { type NextRequest } from "next/server";
import { ensureAppUser } from "@/lib/auth/ensure-app-user";
import { apiError, apiSuccess } from "@/lib/http";
import { addReminder, listReminders } from "@/lib/services/reminder-service";
import { createReminderSchema, reminderFiltersSchema } from "@/lib/validation/reminder";

export async function GET(request: NextRequest) {
  try {
    const appUser = await ensureAppUser();
    const { searchParams } = request.nextUrl;

    const filters = reminderFiltersSchema.parse({
      status: searchParams.get("status") ?? undefined,
      scope: searchParams.get("scope") ?? undefined,
    });

    const reminders = await listReminders(appUser.id, filters);
    return apiSuccess(reminders);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const appUser = await ensureAppUser();
    const body = createReminderSchema.parse(await request.json());

    const reminder = await addReminder(appUser.id, body);
    return apiSuccess(reminder, 201);
  } catch (error) {
    return apiError(error);
  }
}
