"use client";

import { getEquipmentBonus } from "@/lib/equipment";
import { getAchievements } from "@/lib/progression";
import { activeDays, completionPercent, logsForMonth, totalByActivity, weeklyActivityCounts } from "@/lib/stats";
import { getActivityName, getCategoryLabel, getUnitLabel, t, toIntlLocale, type Locale } from "@/lib/i18n";
import type { AppState, Category } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";

export function StatsPanel({ state, currentDate, locale }: { state: AppState; currentDate: Date; locale: Locale }) {
  const copy = (key: Parameters<typeof t>[1], params?: Parameters<typeof t>[2]) => t(locale, key, params);
  const monthLogs = logsForMonth(state.logs, currentDate);
  const equipmentBonus = getEquipmentBonus(state);
  const weeklyCounts = weeklyActivityCounts(state.logs, currentDate);
  const maxWeeklyCount = Math.max(1, ...weeklyCounts.map((week) => week.completed));
  const achievements = getAchievements(state, locale);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="soft-card rounded-[28px] p-5">
        <h2 className="text-xl font-black">{copy("statsTitle")}</h2>
        <div className="mt-4 grid grid-cols-[130px_1fr] gap-4">
          <div className="grid h-32 w-32 place-items-center rounded-full border-[10px] border-leaf text-center">
            <span className="text-3xl font-black">{completionPercent(state.activities, state.logs, currentDate)}%</span>
            <span className="-mt-8 text-xs font-bold">{copy("monthlyCompletion")}</span>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-3 text-sm font-bold">
            <p>{copy("daysCompleted")} <b className="float-right">{monthLogs.filter((log) => log.status === "completed").length}</b></p>
            <p>{copy("activeDays")} <b className="float-right">{activeDays(state.logs, currentDate)}</b></p>
            <p>{copy("bestStreak")} <b className="float-right">{state.progress.streakBest} {copy("days")}</b></p>
            <p>{copy("currentStreak")} <b className="float-right">{state.progress.streakCurrent} {copy("days")}</b></p>
          </div>
        </div>
      </div>
      <div className="soft-card rounded-[28px] p-5">
        <h3 className="mb-3 text-lg font-black">{copy("activitySummary")}</h3>
        {totalByActivity(state.activities, state.logs).filter((entry) => entry.total).slice(0, 8).map(({ activity, total }) => (
          <div key={activity.id} className="flex justify-between border-b border-line py-2 text-sm font-bold">
            <span>{getActivityName(locale, activity)}</span>
            <span>{Math.round(total * 10) / 10} {getUnitLabel(locale, activity.unit)}</span>
          </div>
        ))}
      </div>
      <div className="soft-card rounded-[28px] p-5 md:col-span-2">
        <h3 className="mb-3 text-lg font-black">{copy("categoryProgress")}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(state.progress.stats).map(([key, value]) => {
            const category = key as Category;
            const bonus = equipmentBonus[category];
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-sm font-bold"><span>{getCategoryLabel(locale, category)}</span><span>{value + bonus}</span></div>
                <ProgressBar value={value + bonus} />
                <div className="mt-1 text-xs font-bold text-muted">{value} {copy("base")} {bonus ? `+ ${bonus} ${copy("equipment")}` : `+ 0 ${copy("equipment")}`}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="soft-card rounded-[28px] p-5 md:col-span-2">
        <h3 className="mb-4 text-lg font-black">{copy("weeklyEvolution")}</h3>
        <div className="flex h-44 items-end gap-2 sm:gap-4">
          {weeklyCounts.map((week) => (
            <div key={week.startKey} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-black">{week.completed}</span>
              <div className="w-full rounded-t-xl bg-leaf/75" style={{ height: `${Math.max(6, (week.completed / maxWeeklyCount) * 110)}px` }} />
              <span className="truncate text-[0.65rem] font-bold text-muted">
                {new Intl.DateTimeFormat(toIntlLocale(locale), { day: "numeric", month: "short" }).format(week.start)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="soft-card rounded-[28px] p-5 md:col-span-2">
        <h3 className="mb-4 text-lg font-black">{copy("achievements")}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <article key={achievement.id} className={`rounded-2xl border p-4 ${achievement.unlocked ? "border-sun bg-sun/15" : "border-line bg-cream2/65 opacity-65"}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden>{achievement.icon}</span>
                <div>
                  <h4 className="font-black">{achievement.title}</h4>
                  <p className="text-sm font-bold text-muted">{achievement.description}</p>
                  <span className="mt-2 inline-block rounded-full bg-cream px-2 py-1 text-xs font-black">{copy(achievement.unlocked ? "achievementUnlocked" : "achievementLocked")}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
