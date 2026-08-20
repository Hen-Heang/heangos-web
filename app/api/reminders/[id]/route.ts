import { type NextRequest } from "next/server";
import { ensureAppUser } from "@/lib/auth/ensure-app-user";
import { apiError, apiSuccess } from "@/lib/http";
import { editReminder, removeReminder } from "@/lib/services/reminder-service";
import { updateReminderSchema } from "@/lib/validation/reminder";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await ensureAppUser();
    const { id } = await params;
    const body = updateReminderSchema.parse(await request.json());

    const reminder = await editReminder(appUser.id, id, body);
    return apiSuccess(reminder);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await ensureAppUser();
    const { id } = await params;

    await removeReminder(appUser.id, id);
    return apiSuccess({ id });
  } catch (error) {
    return apiError(error);
  }
}
