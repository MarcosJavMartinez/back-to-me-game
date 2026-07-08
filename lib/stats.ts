import type { Activity, ActivityLog } from "./types";
import { isActivityDueOnDate } from "./activitySchedule";
import { addDays, monthKey, startOfWeek, toDateKey } from "./dateUtils";

export function logsForMonth(logs: ActivityLog[], date = new Date()) {
  const key = monthKey(date);
  return logs.filter((log) => log.date.startsWith(key));
}

export function logsForWeek(logs: ActivityLog[], date = new Date()) {
  const start = startOfWeek(date);
  const days = new Set(Array.from({ length: 7 }, (_, index) => toDateKey(addDays(start, index))));
  return logs.filter((log) => days.has(log.date));
}

export function completionPercent(activities: Activity[], logs: ActivityLog[], date = new Date()) {
  const activeDaily = activities.filter((activity) => activity.isActive && activity.type === "daily");
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const now = new Date();
  const isCurrentMonth = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  const elapsedDays = isCurrentMonth ? now.getDate() : daysInMonth;
  const expected = Math.max(1, activeDaily.reduce((total, activity) => {
    const scheduledDays = Array.from({ length: elapsedDays }, (_, index) => toDateKey(new Date(date.getFullYear(), date.getMonth(), index + 1)))
      .filter((dayKey) => isActivityDueOnDate(activity, dayKey)).length;
    return total + scheduledDays;
  }, 0));
  const dailyIds = new Set(activeDaily.map((activity) => activity.id));
  const activityById = new Map(activeDaily.map((activity) => [activity.id, activity]));
  const completed = logsForMonth(logs, date).filter((log) => {
    const activity = activityById.get(log.activityId);
    return log.status === "completed" && dailyIds.has(log.activityId) && activity && isActivityDueOnDate(activity, log.date);
  }).length;
  return Math.min(100, Math.round((completed / expected) * 100));
}

export function activeDays(logs: ActivityLog[], date = new Date()) {
  return new Set(logsForMonth(logs, date).filter((log) => log.status === "completed").map((log) => log.date)).size;
}

export function totalByActivity(activities: Activity[], logs: ActivityLog[]) {
  return activities.map((activity) => {
    const related = logs.filter((log) => log.activityId === activity.id && log.status === "completed");
    const total = related.reduce((sum, log) => sum + (log.value ?? 1), 0);
    return { activity, total };
  });
}

export function weeklyActivityCounts(logs: ActivityLog[], date = new Date(), weeks = 6) {
  const currentWeek = startOfWeek(date);
  return Array.from({ length: weeks }, (_, index) => {
    const start = addDays(currentWeek, (index - weeks + 1) * 7);
    const end = addDays(start, 6);
    const startKey = toDateKey(start);
    const endKey = toDateKey(end);
    const completed = logs.filter((log) =>
      log.status === "completed" && log.date >= startKey && log.date <= endKey
    ).length;
    return { start, startKey, endKey, completed };
  });
}
