import { apiRequest } from "~/helpers/apiHelper";
import type { Reminder, ReminderStatus } from "../types";

export const reminderApi = {
  list: (status?: ReminderStatus) => apiRequest<Reminder[]>("/reminders", { query: { status } }),
};
