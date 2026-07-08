import { getWeekDays } from "./dateUtils";
import { isActivityDueOnDate } from "./activitySchedule";
import type { Locale } from "./i18n";
import type { AppState } from "./types";

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
};

const achievementText: Record<Locale, Record<string, { title: string; description: string }>> = {
  es: {
    "first-step": { title: "Primer paso", description: "Completá tu primera actividad." },
    "steady-week": { title: "Una semana firme", description: "Alcanzá una racha de 7 días." },
    "active-days": { title: "Presencia", description: "Sumá 7 días activos." },
    "level-five": { title: "En marcha", description: "Llegá al nivel 5." },
    century: { title: "Cien pequeñas victorias", description: "Completá 100 actividades." }
  },
  en: {
    "first-step": { title: "First step", description: "Complete your first activity." },
    "steady-week": { title: "A steady week", description: "Reach a 7-day streak." },
    "active-days": { title: "Showing up", description: "Be active on 7 different days." },
    "level-five": { title: "On your way", description: "Reach level 5." },
    century: { title: "One hundred small wins", description: "Complete 100 activities." }
  },
  pt: {
    "first-step": { title: "Primeiro passo", description: "Conclua sua primeira atividade." },
    "steady-week": { title: "Uma semana firme", description: "Alcance uma sequencia de 7 dias." },
    "active-days": { title: "Presenca", description: "Fique ativo em 7 dias diferentes." },
    "level-five": { title: "Em movimento", description: "Chegue ao nivel 5." },
    century: { title: "Cem pequenas vitorias", description: "Conclua 100 atividades." }
  },
  ja: {
    "first-step": { title: "最初の一歩", description: "最初の習慣を完了する。" },
    "steady-week": { title: "安定した一週間", description: "7日連続を達成する。" },
    "active-days": { title: "積み重ね", description: "7日間活動する。" },
    "level-five": { title: "順調な歩み", description: "レベル5に到達する。" },
    century: { title: "100の小さな勝利", description: "習慣を100回完了する。" }
  },
  ru: {
    "first-step": { title: "Первый шаг", description: "Выполни первую привычку." },
    "steady-week": { title: "Уверенная неделя", description: "Достигни серии в 7 дней." },
    "active-days": { title: "Постоянство", description: "Будь активен 7 разных дней." },
    "level-five": { title: "В движении", description: "Достигни 5 уровня." },
    century: { title: "Сто маленьких побед", description: "Выполни 100 привычек." }
  },
  tr: {
    "first-step": { title: "Ilk adim", description: "Ilk aliskanligini tamamla." },
    "steady-week": { title: "Saglam bir hafta", description: "7 gunluk seri yap." },
    "active-days": { title: "Devamlilik", description: "7 farkli gunde aktif ol." },
    "level-five": { title: "Yola devam", description: "5. seviyeye ulas." },
    century: { title: "Yuz kucuk zafer", description: "100 aliskanlik tamamla." }
  }
};

export function getWeeklyChallenge(state: AppState, date = new Date()) {
  const weekDays = getWeekDays(date);
  const dailyActivities = state.activities.filter((activity) => activity.isActive && activity.type === "daily");
  const scheduled = weekDays.reduce((total, day) =>
    total + dailyActivities.filter((activity) => isActivityDueOnDate(activity, day.key)).length
  , 0);
  const target = Math.max(3, Math.min(15, scheduled || dailyActivities.length * 3 || 3));
  const activityIds = new Set(dailyActivities.map((activity) => activity.id));
  const progress = state.logs.filter((log) =>
    log.status === "completed"
    && activityIds.has(log.activityId)
    && weekDays.some((day) => day.key === log.date)
  ).length;

  return {
    progress: Math.min(progress, target),
    target,
    completed: progress >= target
  };
}

export function getAchievements(state: AppState, locale: Locale = "es"): Achievement[] {
  const completed = state.logs.filter((log) => log.status === "completed");
  const activeDays = new Set(completed.map((log) => log.date)).size;
  const definitions = [
    { id: "first-step", icon: "🌱", unlocked: completed.length >= 1 },
    { id: "steady-week", icon: "🔥", unlocked: state.progress.streakBest >= 7 },
    { id: "active-days", icon: "🗓️", unlocked: activeDays >= 7 },
    { id: "level-five", icon: "⭐", unlocked: state.progress.level >= 5 },
    { id: "century", icon: "🏆", unlocked: completed.length >= 100 }
  ];

  return definitions.map((achievement) => ({
    ...achievement,
    ...achievementText[locale][achievement.id]
  }));
}
