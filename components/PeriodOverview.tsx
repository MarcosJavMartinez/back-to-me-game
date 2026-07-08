"use client";

import { Target } from "lucide-react";
import { completedLogsForActivityPeriod } from "@/lib/activityPeriods";
import { isActivityDueOnDate } from "@/lib/activitySchedule";
import { toDateKey } from "@/lib/dateUtils";
import { getWeeklyChallenge } from "@/lib/progression";
import { t, type Locale } from "@/lib/i18n";
import type { AppState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";

type PeriodView = "today" | "week" | "month";

type PeriodOverviewProps = {
  state: AppState;
  currentDate: Date;
  current: PeriodView;
  locale: Locale;
};

export function PeriodOverview({ state, currentDate, current, locale }: PeriodOverviewProps) {
  const copy = (key: Parameters<typeof t>[1], params?: Parameters<typeof t>[2]) => t(locale, key, params);
  const dayKey = toDateKey(currentDate);
  const active = state.activities.filter((activity) => activity.isActive);
  const today = active.filter((activity) => isActivityDueOnDate(activity, dayKey));
  const weekly = active.filter((activity) => activity.type === "weekly");
  const monthly = active.filter((activity) => activity.type === "monthly");
  const todayDone = today.filter((activity) => state.logs.some((log) => log.activityId === activity.id && log.date === dayKey && log.status === "completed")).length;
  const weeklyTarget = weekly.reduce((sum, activity) => sum + Math.max(1, activity.periodTarget ?? 1), 0);
  const weeklyDone = weekly.reduce((sum, activity) => sum + Math.min(Math.max(1, activity.periodTarget ?? 1), completedLogsForActivityPeriod(activity, state.logs, dayKey).length), 0);
  const monthlyTarget = monthly.reduce((sum, activity) => sum + Math.max(1, activity.periodTarget ?? 1), 0);
  const monthlyDone = monthly.reduce((sum, activity) => sum + Math.min(Math.max(1, activity.periodTarget ?? 1), completedLogsForActivityPeriod(activity, state.logs, dayKey).length), 0);
  const challenge = getWeeklyChallenge(state, currentDate);
  const periods = [
    { id: "today" as const, title: copy("viewToday"), done: todayDone, total: today.length },
    { id: "week" as const, title: copy("viewWeek"), done: weeklyDone, total: weeklyTarget },
    { id: "month" as const, title: copy("viewMonth"), done: monthlyDone, total: monthlyTarget }
  ];
  const selectedPeriod = periods.find((period) => period.id === current) ?? periods[0];
  const description = current === "today"
    ? copy("todayTitle")
    : copy(current === "week" ? "weeklyActivitiesDescription" : "monthlyActivitiesDescription");

  return (
    <div className="mb-5">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <div>
          <h2 className="text-2xl font-black">{selectedPeriod.title}</h2>
          <p className="mt-1 text-sm font-bold text-muted">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black">{selectedPeriod.done}/{selectedPeriod.total}</div>
          <div className="text-xs font-bold text-muted">
            {selectedPeriod.total - selectedPeriod.done > 0
              ? copy("pendingCount", { count: selectedPeriod.total - selectedPeriod.done })
              : copy("allDone")}
          </div>
        </div>
      </div>

      {current === "today" && (
        <section className="mt-3 flex items-center gap-3 rounded-2xl border border-line/80 bg-white/45 px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sun/25 text-forest"><Target size={19} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-sm font-black">
              <span>{copy("weeklyChallenge")}</span>
              <span>{challenge.progress}/{challenge.target}</span>
            </div>
            <div className="mt-1"><ProgressBar value={(challenge.progress / challenge.target) * 100} color="#F7C948" /></div>
          </div>
        </section>
      )}
    </div>
  );
}
