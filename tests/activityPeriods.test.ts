import assert from "node:assert/strict";
import test from "node:test";
import { completedLogsForActivityPeriod } from "../lib/activityPeriods";
import type { Activity, ActivityLog } from "../lib/types";

const baseActivity: Activity = {
  id: "activity",
  name: "Actividad",
  type: "weekly",
  icon: "Star",
  color: "#8BCB77",
  unit: "yes_no",
  periodTarget: 2,
  createdAt: "2026-07-01T12:00:00.000Z",
  isActive: true,
  category: "discipline"
};

const logs: ActivityLog[] = [
  {
    id: "one",
    activityId: "activity",
    date: "2026-06-29",
    status: "completed",
    xpEarned: 10,
    coinsEarned: 5,
    createdAt: "2026-06-29T12:00:00.000Z"
  },
  {
    id: "two",
    activityId: "activity",
    date: "2026-07-01",
    status: "completed",
    xpEarned: 10,
    coinsEarned: 5,
    createdAt: "2026-07-01T12:00:00.000Z"
  },
  {
    id: "old",
    activityId: "activity",
    date: "2026-06-20",
    status: "completed",
    xpEarned: 10,
    coinsEarned: 5,
    createdAt: "2026-06-20T12:00:00.000Z"
  }
];

test("una actividad semanal solo cuenta registros de su semana", () => {
  assert.equal(completedLogsForActivityPeriod(baseActivity, logs, "2026-07-04").length, 2);
});

test("una actividad mensual solo cuenta registros de su mes", () => {
  assert.equal(completedLogsForActivityPeriod({ ...baseActivity, type: "monthly" }, logs, "2026-07-04").length, 1);
});
