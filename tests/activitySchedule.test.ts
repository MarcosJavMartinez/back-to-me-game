import assert from "node:assert/strict";
import test from "node:test";
import { isActivityDueOnDate } from "../lib/activitySchedule";
import type { Activity } from "../lib/types";

const activity: Activity = {
  id: "walk",
  name: "Caminar",
  type: "daily",
  icon: "Leaf",
  color: "#8BCB77",
  unit: "minutes",
  targetValue: 20,
  repeatEveryDays: 2,
  createdAt: "2026-07-01T12:00:00.000Z",
  isActive: true,
  category: "health"
};

test("respeta la frecuencia de una actividad diaria", () => {
  assert.equal(isActivityDueOnDate(activity, "2026-07-01"), true);
  assert.equal(isActivityDueOnDate(activity, "2026-07-02"), false);
  assert.equal(isActivityDueOnDate(activity, "2026-07-03"), true);
});

test("no trata objetivos semanales como actividades diarias", () => {
  assert.equal(isActivityDueOnDate({ ...activity, type: "weekly" }, "2026-07-01"), false);
});
