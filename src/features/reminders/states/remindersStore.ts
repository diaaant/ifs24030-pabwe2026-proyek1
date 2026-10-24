import { defineStore } from "pinia";
import { runApi } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { reminderApi } from "../api/reminderApi";
import type { Reminder, ReminderStatus } from "../types";

interface RemindersState {
  reminders: Reminder[];
  isRemindersLoading: boolean;
}

export const useRemindersStore = defineStore("reminders", {
  state: (): RemindersState => ({ reminders: [], isRemindersLoading: false }),

  getters: {
    dueReminders: (state) => state.reminders.filter((item) => item.status === "overdue" || item.status === "soon"),
  },

  actions: {
    async fetchReminders(status?: ReminderStatus) {
      this.isRemindersLoading = true;
      const result = await runApi(() => reminderApi.list(status));
      this.isRemindersLoading = false;

      if (result.ok) this.reminders = result.data;
      else notifyResult(result);
      return result;
    },
  },
});
