import assert from "node:assert/strict";
import test from "node:test";
import { addDays, startOfWeek, toDateKey } from "../lib/dateUtils";
import { weeklyActivityCounts } from "../lib/stats";
import type { ActivityLog } from "../lib/types";

function log(date: Date, id: string): ActivityLog {
  return {
    id,
    activityId: "walk",
    date: toDateKey(date),
    status: "completed",
    xpEarned: 10,
    coinsEarned: 5,
    createdAt: date.toISOString()
  };
}

test("agrupa las actividades completadas por semana", () => {
  const date = new Date(2026, 6, 4, 12);
  const currentStart = startOfWeek(date);
  const previousStart = addDays(currentStart, -7);
  const counts = weeklyActivityCounts([
    log(currentStart, "current-1"),
    log(addDays(currentStart, 2), "current-2"),
    log(previousStart, "previous-1")
  ], date, 2);

  assert.deepEqual(counts.map((week) => week.completed), [1, 2]);
});
