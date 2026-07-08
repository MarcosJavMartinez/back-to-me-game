import type { Activity, ActivityLog, UserProgress } from "./types";
import { toDateKey } from "./dateUtils";

export function rewardFor(activity: Activity, value?: number) {
  if (activity.unit === "yes_no") return { xp: 10, coins: 5 };
  if (!activity.targetValue || value === undefined) return { xp: 5, coins: 2 };
  if (value > activity.targetValue) return { xp: 25, coins: 15 };
  if (value === activity.targetValue) return { xp: 20, coins: 10 };
  return { xp: 5, coins: 2 };
}

export function honestyReward() {
  return { xp: 2, coins: 1 };
}

export function applyPointsReward(progress: UserProgress, reward: { xp: number; coins: number }) {
  let xp = progress.xp + reward.xp;
  let level = progress.level;
  let xpToNextLevel = progress.xpToNextLevel;
  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level += 1;
    xpToNextLevel += 120;
  }

  return {
    ...progress,
    level,
    xp,
    xpToNextLevel,
    coins: progress.coins + reward.coins
  };
}

export function applyReward(progress: UserProgress, activity: Activity, reward: { xp: number; coins: number }) {
  const rewarded = applyPointsReward(progress, reward);

  return {
    ...rewarded,
    energy: Math.min(100, rewarded.energy + 1),
    stats: {
      ...rewarded.stats,
      [activity.category]: rewarded.stats[activity.category] + 1
    }
  };
}

export function recomputeStreak(progress: UserProgress, logs: ActivityLog[]) {
  const completedDays = new Set(logs.filter((log) => log.status === "completed").map((log) => log.date));
  let cursor = new Date();
  const todayKey = toDateKey(cursor);
  if (!completedDays.has(todayKey)) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  let streakFreezes = progress.streakFreezes ?? 0;
  let lastStreakFreezeDate = progress.lastStreakFreezeDate;
  let freezeUsed = false;

  while (true) {
    const dateKey = toDateKey(cursor);
    if (completedDays.has(dateKey)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (lastStreakFreezeDate === dateKey) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    const hasEarlierCompletion = [...completedDays].some((day) => day < dateKey);
    if (!freezeUsed && streak > 0 && streakFreezes > 0 && hasEarlierCompletion) {
      freezeUsed = true;
      streakFreezes -= 1;
      lastStreakFreezeDate = dateKey;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    break;
  }

  return {
    ...progress,
    streakCurrent: streak,
    streakBest: Math.max(progress.streakBest, streak),
    streakFreezes,
    lastStreakFreezeDate
  };
}
