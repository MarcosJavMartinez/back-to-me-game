import assert from "node:assert/strict";
import test from "node:test";
import { addDays, toDateKey } from "../lib/dateUtils";
import { applyPointsReward, honestyReward, recomputeStreak } from "../lib/rewards";
import type { ActivityLog, UserProgress } from "../lib/types";

const progress: UserProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  coins: 0,
  energy: 100,
  streakCurrent: 0,
  streakBest: 0,
  streakFreezes: 1,
  stats: {
    health: 0,
    creativity: 0,
    intelligence: 0,
    discipline: 0,
    social: 0,
    joy: 0
  }
};

function completedLog(date: Date): ActivityLog {
  const dateKey = toDateKey(date);
  return {
    id: `${dateKey}-walk`,
    activityId: "walk",
    date: dateKey,
    status: "completed",
    xpEarned: 10,
    coinsEarned: 5,
    createdAt: date.toISOString()
  };
}

test("mantiene la racha de ayer durante el dia actual", () => {
  const yesterday = addDays(new Date(), -1);
  const beforeYesterday = addDays(new Date(), -2);
  const result = recomputeStreak(progress, [completedLog(yesterday), completedLog(beforeYesterday)]);

  assert.equal(result.streakCurrent, 2);
  assert.equal(result.streakFreezes, 1);
});

test("consume una proteccion cuando hay un hueco entre dias completados", () => {
  const yesterday = addDays(new Date(), -1);
  const threeDaysAgo = addDays(new Date(), -3);
  const result = recomputeStreak(progress, [completedLog(yesterday), completedLog(threeDaysAgo)]);

  assert.equal(result.streakCurrent, 3);
  assert.equal(result.streakFreezes, 0);
  assert.equal(result.lastStreakFreezeDate, toDateKey(addDays(new Date(), -2)));
});

test("premia honestidad con puntos bajos sin subir estadisticas", () => {
  const reward = honestyReward();
  const result = applyPointsReward(progress, reward);

  assert.deepEqual(reward, { xp: 2, coins: 1 });
  assert.equal(result.xp, 2);
  assert.equal(result.coins, 1);
  assert.deepEqual(result.stats, progress.stats);
});
