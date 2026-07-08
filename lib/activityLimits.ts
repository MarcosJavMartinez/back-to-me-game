import type { Activity, ActivityLog } from "./types";

export function getActivityCapacity(activity: Activity, logs: ActivityLog[]) {
  if (!activity.limit) return undefined;
  const completions = logs.filter((log) => log.activityId === activity.id && log.status === "completed").length;
  const unlocks = Math.floor(completions / activity.limit.everyCompletions);
  const value = activity.limit.baseValue + unlocks * activity.limit.stepValue;
  return Math.min(activity.limit.maxValue, Number(value.toFixed(2)));
}

export function clampToCapacity(activity: Activity, logs: ActivityLog[], value?: number) {
  const capacity = getActivityCapacity(activity, logs);
  if (!capacity || value === undefined || value <= capacity) {
    return { value, capacity, wasClamped: false };
  }
  return { value: capacity, capacity, wasClamped: true };
}

export function nextCapacityProgress(activity: Activity, logs: ActivityLog[]) {
  if (!activity.limit) return undefined;
  const completions = logs.filter((log) => log.activityId === activity.id && log.status === "completed").length;
  const currentStep = completions % activity.limit.everyCompletions;
  const remaining = activity.limit.everyCompletions - currentStep;
  const capacity = getActivityCapacity(activity, logs) ?? activity.limit.baseValue;
  const isMaxed = capacity >= activity.limit.maxValue;
  return { completions, remaining, capacity, isMaxed };
}
