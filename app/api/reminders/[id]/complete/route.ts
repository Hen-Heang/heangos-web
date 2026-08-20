import { type NextRequest } from "next/server";
import { ensureAppUser } from "@/lib/auth/ensure-app-user";
import { apiError, apiSuccess } from "@/lib/http";
import { completeReminder } from "@/lib/services/reminder-service";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await ensureAppUser();
    const { id } = await params;

    const reminder = await completeReminder(appUser.id, id);
    return apiSuccess(reminder);
  } catch (error) {
    return apiError(error);
  }
}
