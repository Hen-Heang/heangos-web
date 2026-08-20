import { type NextRequest } from "next/server";
import { ensureAppUser } from "@/lib/auth/ensure-app-user";
import { apiError, apiSuccess } from "@/lib/http";
import { snoozeReminder } from "@/lib/services/reminder-service";
import { snoozeReminderSchema } from "@/lib/validation/reminder";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await ensureAppUser();
    const { id } = await params;
    const body = snoozeReminderSchema.parse(await request.json());

    const reminder = await snoozeReminder(appUser.id, id, body.remindAt);
    return apiSuccess(reminder);
  } catch (error) {
    return apiError(error);
  }
}
