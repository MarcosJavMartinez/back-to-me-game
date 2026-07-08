import { logsForWeek } from "./stats";
import type { Activity, ActivityLog } from "./types";

export function logForActivityPeriod(activity: Activity, logs: ActivityLog[], dayKey: string) {
  if (activity.type === "daily") {
    return logs.find((log) => log.activityId === activity.id && log.date === dayKey);
  }
  if (activity.type === "monthly") {
    const month = dayKey.slice(0, 7);
    return logs.find((log) => log.activityId === activity.id && log.date.startsWith(month) && log.date <= dayKey);
  }
  const day = new Date(`${dayKey}T12:00:00`);
  return logsForWeek(logs, day).find((log) => log.activityId === activity.id && log.date <= dayKey);
}

export function completedLogsForActivityPeriod(activity: Activity, logs: ActivityLog[], dayKey: string) {
  if (activity.type === "daily") {
    return logs.filter((log) => log.activityId === activity.id && log.date === dayKey && log.status === "completed");
  }
  if (activity.type === "monthly") {
    const month = dayKey.slice(0, 7);
    return logs.filter((log) => log.activityId === activity.id && log.date.startsWith(month) && log.date <= dayKey && log.status === "completed");
  }
  const day = new Date(`${dayKey}T12:00:00`);
  return logsForWeek(logs, day).filter((log) => log.activityId === activity.id && log.date <= dayKey && log.status === "completed");
}
