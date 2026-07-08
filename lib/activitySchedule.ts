import type { Activity } from "./types";

function utcDayNumber(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

export function isActivityDueOnDate(activity: Activity, dateKey: string) {
  if (activity.type !== "daily") return false;
  const interval = Math.max(1, Math.round(activity.repeatEveryDays ?? 1));
  if (interval === 1) return true;
  const anchor = activity.createdAt.slice(0, 10);
  const elapsedDays = utcDayNumber(dateKey) - utcDayNumber(anchor);
  return elapsedDays >= 0 && elapsedDays % interval === 0;
}
