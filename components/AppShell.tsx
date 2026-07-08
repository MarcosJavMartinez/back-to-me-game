"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  Cloud,
  CloudOff,
  Code,
  Dumbbell,
  Gamepad2,
  GlassWater,
  GraduationCap,
  House,
  Languages,
  Leaf,
  LogOut,
  Map,
  Pencil,
  Plus,
  RefreshCw,
  ShowerHead,
  Smile,
  Soup,
  Star,
  Trash2,
  Users,
  WashingMachine
} from "lucide-react";
import { shopItems } from "@/data/shopItems";
import { clampToCapacity, getActivityCapacity, nextCapacityProgress } from "@/lib/activityLimits";
import { completedLogsForActivityPeriod, logForActivityPeriod } from "@/lib/activityPeriods";
import { isActivityDueOnDate } from "@/lib/activitySchedule";
import {
  LOCALE_STORAGE_KEY,
  activityUnits,
  categories,
  getActivityName,
  getActivityTargetLabel,
  getCategoryLabel,
  getMaterialLabel,
  getShopItemDescription,
  getShopItemName,
  getUnitLabel,
  getViewLabel,
  getWeekdayHeaders,
  getWorldMessage,
  getWorldZoneDetail,
  getWorldZoneText,
  isSupportedLocale,
  localeNames,
  localeShortNames,
  resolveLocale,
  supportedLocales,
  t,
  toIntlLocale,
  type Locale
} from "@/lib/i18n";
import { addDays, formatLongDate, getMonthDays, getWeekDays, toDateKey } from "@/lib/dateUtils";
import { getEquipmentBonus, getEquippedItems } from "@/lib/equipment";
import { applyPointsReward, applyReward, honestyReward, recomputeStreak, rewardFor } from "@/lib/rewards";
import { logsForWeek } from "@/lib/stats";
import {
  initialState,
  loadRemoteState,
  loadStateRecord,
  RemoteConflictError,
  saveRemoteState,
  saveStateRecord,
  type RemoteStateRecord
} from "@/lib/storage";
import type { Activity, ActivityLog, ActivityType, ActivityUnit, AppState, Avatar, Category } from "@/lib/types";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { BottomNav, type ViewId } from "./BottomNav";
import { CharacterCreator } from "./CharacterCreator";
import { CharacterPreview } from "./CharacterPreview";
import { EmptyState } from "./EmptyState";
import { ProgressBar } from "./ProgressBar";
import { PeriodOverview } from "./PeriodOverview";
import { StatsPanel } from "./StatsPanel";

const icons = { Leaf, Pencil, Code, GlassWater, Soup, Dumbbell, BookOpen, Smile, ShowerHead, House, GraduationCap, WashingMachine, Gamepad2, Languages };

const clickStepUnits: ActivityUnit[] = ["glasses", "healthy_meals", "sets", "reps", "times"];

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: (key: Parameters<typeof t>[1], params?: Parameters<typeof t>[2]) => string;
};

type SyncStatus = "loading" | "saving" | "saved" | "offline" | "conflict";

const syncLabels: Record<Locale, Record<SyncStatus, string>> = {
  es: { loading: "Cargando", saving: "Guardando", saved: "Guardado", offline: "Sin conexion", conflict: "Revisar cambios" },
  en: { loading: "Loading", saving: "Saving", saved: "Saved", offline: "Offline", conflict: "Review changes" },
  pt: { loading: "Carregando", saving: "Salvando", saved: "Salvo", offline: "Sem conexao", conflict: "Revisar alteracoes" },
  ja: { loading: "読み込み中", saving: "保存中", saved: "保存済み", offline: "オフライン", conflict: "変更を確認" },
  ru: { loading: "Загрузка", saving: "Сохранение", saved: "Сохранено", offline: "Нет сети", conflict: "Проверить изменения" },
  tr: { loading: "Yukleniyor", saving: "Kaydediliyor", saved: "Kaydedildi", offline: "Cevrimdisi", conflict: "Degisiklikleri incele" }
};

const I18nContext = createContext<I18nContextValue | null>(null);

function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside AppShell.");
  return value;
}

function formatBonus(locale: Locale, bonus?: Partial<Record<Category, number>>) {
  const entries = Object.entries(bonus ?? {}).filter(([, value]) => value);
  if (!entries.length) return t(locale, "noBonus");
  return entries.map(([category, value]) => `+${value} ${getCategoryLabel(locale, category as Category)}`).join(" - ");
}

const materialTiers = [
  { material: "papel", level: 1 },
  { material: "carton", level: 10 },
  { material: "paja", level: 20 },
  { material: "planta", level: 30 },
  { material: "goma", level: 40 },
  { material: "madera", level: 50 },
  { material: "chapa", level: 60 },
  { material: "metal", level: 70 },
  { material: "oro", level: 80 },
  { material: "rubi", level: 90 }
];

function nextMaterialTier(level: number) {
  return materialTiers.find((tier) => tier.level > level);
}

const worldThresholds = [1, 5, 10, 20, 30];
const worldZoneSymbols: Record<string, string> = {
  lake: "💧",
  path: "🥾",
  creative: "🎨",
  tech: "💻",
  library: "📚",
  gym: "💪",
  garden: "🌱",
  social: "🤝",
  rest: "🎮"
};

const worldZones = [
  {
    id: "lake",
    name: "Lago",
    activityIds: ["agua"],
    category: "Salud",
    color: "#78C7E8",
    details: ["tierra seca", "charquito", "laguito", "lago con flores", "lago con patitos", "lago magico"],
    message: "Cada vaso llena un poco este lugar."
  },
  {
    id: "path",
    name: "Sendero",
    activityIds: ["caminar"],
    category: "Movimiento",
    color: "#B98545",
    details: ["sin camino", "caminito corto", "camino con piedras", "camino con flores", "camino con carteles", "camino hacia la colina"],
    message: "Cada paso que das aparece en tu mundo."
  },
  {
    id: "creative",
    name: "Taller creativo",
    activityIds: ["dibujar"],
    category: "Creatividad",
    color: "#A78BFA",
    details: ["sin taller", "mesa con lapiz", "caballete", "taller pequeno", "taller con cuadros", "casita estudio"],
    message: "Crear tambien es cuidarte."
  },
  {
    id: "tech",
    name: "Taller calido",
    activityIds: ["programar"],
    category: "Foco",
    color: "#6BA7D6",
    details: ["sin mesa", "mesita simple", "mesa con herramientas", "taller artesanal", "casita tecnica", "refugio de ideas"],
    message: "Programar arma una casita de calma."
  },
  {
    id: "library",
    name: "Biblioteca",
    activityIds: ["leer", "estudiar-algo", "aprender-idioma"],
    category: "Aprendizaje",
    color: "#F7C948",
    details: ["sin biblioteca", "estante pequeno", "biblioteca nivel 2", "rincon de estudio", "biblioteca amplia", "biblioteca luminosa"],
    message: "Aprender suma ventanas nuevas."
  },
  {
    id: "gym",
    name: "Gimnasio suave",
    activityIds: ["ejercicio"],
    category: "Energia",
    color: "#F28B82",
    details: ["sin zona", "esterilla", "pesas suaves", "banco de madera", "zona completa", "patio de entrenamiento"],
    message: "Tu cuerpo tambien construye el paisaje."
  },
  {
    id: "garden",
    name: "Huerta",
    activityIds: ["comer-saludable"],
    category: "Nutricion",
    color: "#8BCB77",
    details: ["sin huerta", "brote", "canasta", "huerta pequena", "mesa sana", "huerta abundante"],
    message: "Comer bien hace crecer la tierra."
  },
  {
    id: "social",
    name: "Plaza social",
    activityIds: ["sociabilizar"],
    category: "Vinculos",
    color: "#F4A259",
    details: ["sin plaza", "banquito", "plaza pequena", "fogata tranquila", "plaza con visitas", "plaza de encuentros"],
    message: "Un contacto amable tambien cuenta."
  },
  {
    id: "rest",
    name: "Zona comfy",
    activityIds: ["jugar-un-juego"],
    category: "Descanso",
    color: "#C8B6FF",
    details: ["sin rincon", "almohadon", "mantita", "hamaca", "fogata tranquila", "nube de descanso"],
    message: "Descansar tambien es parte del camino."
  }
] as const;

function levelFromPoints(points: number) {
  return worldThresholds.reduce((level, threshold) => points >= threshold ? level + 1 : level, 0);
}

function nextWorldThreshold(points: number) {
  return worldThresholds.find((threshold) => points < threshold) ?? worldThresholds[worldThresholds.length - 1];
}

function getWorldProgress(state: AppState) {
  const completedLogs = state.logs.filter((log) => log.status === "completed");
  const zones = worldZones.map((zone) => {
    const points = completedLogs.filter((log) => zone.activityIds.includes(log.activityId as never)).length;
    const level = levelFromPoints(points);
    const next = nextWorldThreshold(points);
    return {
      ...zone,
      points,
      level,
      next,
      percent: level >= 5 ? 100 : Math.min(100, (points / next) * 100),
      detail: zone.details[level]
    };
  });
  const unlocked = zones.filter((zone) => zone.level > 0).length;
  const totalLevels = zones.reduce((sum, zone) => sum + zone.level, 0);
  const worldLevel = Math.max(1, Math.floor(totalLevels / 3) + 1);
  return { zones, unlocked, totalLevels, worldLevel };
}

export function AppShell({ initialView = "today" }: { initialView?: ViewId }) {
  const [view, setView] = useState<ViewId>(initialView);
  const [state, setState] = useState<AppState>(initialState);
  const [locale, setLocale] = useState<Locale>("es");
  const [hydrated, setHydrated] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [toast, setToast] = useState("");
  const [selectedDay, setSelectedDay] = useState(toDateKey());
  const [userId, setUserId] = useState("");
  const [account, setAccount] = useState<{ name: string; email: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [syncConflict, setSyncConflict] = useState<RemoteStateRecord | null>(null);
  const [syncRetry, setSyncRetry] = useState(0);
  const remoteUpdatedAtRef = useRef<string | null>(null);
  const suppressNextSyncRef = useRef(false);
  const conflictRef = useRef<RemoteStateRecord | null>(null);
  const saveInFlightRef = useRef(false);
  const pendingSyncRef = useRef(false);
  const stateRef = useRef(state);
  const toastTimerRef = useRef<number | null>(null);
  stateRef.current = state;

  const setPreferredLocale = useCallback((nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const i18n = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale: setPreferredLocale,
    copy: (key, params) => t(locale, key, params)
  }), [locale, setPreferredLocale]);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const detectedLocale = isSupportedLocale(savedLocale)
      ? savedLocale
      : resolveLocale(window.navigator.language);
    setLocale(detectedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    let active = true;
    async function initializeAccount() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        window.location.replace("/login");
        return;
      }

      const displayName = String(user.user_metadata.display_name || user.email?.split("@")[0] || "Amigo");
      const local = loadStateRecord(user.id);
      let selectedState = local.state;
      let remoteUpdatedAt = local.remoteUpdatedAt;
      let needsSync = local.dirty;
      let nextStatus: SyncStatus = local.dirty ? "saving" : "saved";
      let hasRemoteState = false;

      try {
        const remote = await loadRemoteState();
        if (!active) return;
        if (!local.dirty && remote) {
          hasRemoteState = true;
          selectedState = remote.state;
          remoteUpdatedAt = remote.updatedAt;
          needsSync = false;
          nextStatus = "saved";
        } else if (!remote) {
          needsSync = true;
          nextStatus = "saving";
        }
      } catch {
        needsSync = true;
        nextStatus = "offline";
      }

      if (!local.exists && !hasRemoteState) {
        selectedState = {
          ...selectedState,
          avatar: { ...selectedState.avatar, name: displayName }
        };
        needsSync = true;
      }

      remoteUpdatedAtRef.current = remoteUpdatedAt;
      suppressNextSyncRef.current = !needsSync;
      saveStateRecord(selectedState, user.id, {
        remoteUpdatedAt,
        modifiedAt: local.exists ? local.modifiedAt : new Date().toISOString(),
        dirty: needsSync
      });
      setUserId(user.id);
      setAccount({ name: displayName, email: user.email ?? "" });
      setState(selectedState);
      setSyncStatus(nextStatus);
      setHydrated(true);
      setRemoteReady(true);
    }
    initializeAccount();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !userId || !remoteReady) return;
    if (suppressNextSyncRef.current) {
      suppressNextSyncRef.current = false;
      return;
    }

    const modifiedAt = new Date().toISOString();
    saveStateRecord(state, userId, {
      remoteUpdatedAt: remoteUpdatedAtRef.current,
      modifiedAt,
      dirty: true
    });

    if (conflictRef.current) {
      setSyncStatus("conflict");
      return;
    }

    setSyncStatus("saving");
    const timer = window.setTimeout(async () => {
      if (saveInFlightRef.current) {
        pendingSyncRef.current = true;
        return;
      }
      saveInFlightRef.current = true;
      let retryLatestState = false;
      try {
        const result = await saveRemoteState(state, remoteUpdatedAtRef.current);
        remoteUpdatedAtRef.current = result.updatedAt;
        if (stateRef.current !== state) {
          retryLatestState = true;
          return;
        }
        saveStateRecord(state, userId, {
          remoteUpdatedAt: result.updatedAt,
          modifiedAt,
          dirty: false
        });
        setSyncStatus("saved");
      } catch (error) {
        if (error instanceof RemoteConflictError) {
          conflictRef.current = error.remote;
          setSyncConflict(error.remote);
          setSyncStatus("conflict");
          return;
        }
        setSyncStatus("offline");
      } finally {
        saveInFlightRef.current = false;
        if (retryLatestState || pendingSyncRef.current) {
          pendingSyncRef.current = false;
          setSyncRetry((value) => value + 1);
        }
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [hydrated, remoteReady, state, syncRetry, userId]);

  useEffect(() => {
    const retryWhenOnline = () => setSyncRetry((value) => value + 1);
    window.addEventListener("online", retryWhenOnline);
    return () => window.removeEventListener("online", retryWhenOnline);
  }, []);

  useEffect(() => {
    const refreshCurrentDate = () => {
      setCurrentDate((previousDate) => {
        const previousDay = toDateKey(previousDate);
        const nextDate = new Date();
        const nextDay = toDateKey(nextDate);
        if (nextDay !== previousDay) {
          setSelectedDay((selected) => selected === previousDay ? nextDay : selected);
        }
        return nextDate;
      });
    };

    refreshCurrentDate();
    const timer = window.setInterval(refreshCurrentDate, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const currentDay = toDateKey(currentDate);
  const activeActivities = state.activities.filter((activity) => activity.isActive);
  const todayActivities = activeActivities.filter((activity) => isActivityDueOnDate(activity, currentDay));
  const todayLogs = state.logs.filter((log) => log.date === currentDay);

  async function signOut() {
    await createBrowserClient().auth.signOut();
    window.location.replace("/login");
  }

  function useRemoteVersion() {
    const remote = conflictRef.current;
    if (!remote || !userId) return;
    remoteUpdatedAtRef.current = remote.updatedAt;
    conflictRef.current = null;
    setSyncConflict(null);
    suppressNextSyncRef.current = true;
    setState(remote.state);
    saveStateRecord(remote.state, userId, {
      remoteUpdatedAt: remote.updatedAt,
      modifiedAt: new Date().toISOString(),
      dirty: false
    });
    setSyncStatus("saved");
  }

  async function keepLocalVersion() {
    const remote = conflictRef.current;
    if (!remote || !userId) return;
    setSyncStatus("saving");
    try {
      const result = await saveRemoteState(stateRef.current, remote.updatedAt, true);
      remoteUpdatedAtRef.current = result.updatedAt;
      conflictRef.current = null;
      setSyncConflict(null);
      saveStateRecord(stateRef.current, userId, {
        remoteUpdatedAt: result.updatedAt,
        modifiedAt: new Date().toISOString(),
        dirty: false
      });
      setSyncStatus("saved");
    } catch {
      setSyncStatus("offline");
    }
  }

  async function saveCharacter(name: string, appearance: Avatar["appearance"]) {
    const cleanName = name.trim().slice(0, 40);
    if (cleanName.length < 2) return;
    setState((current) => ({
      ...current,
      avatar: { ...current.avatar, name: cleanName, appearance }
    }));
    setAccount((current) => current ? { ...current, name: cleanName } : current);
    await Promise.allSettled([
      createBrowserClient().auth.updateUser({ data: { display_name: cleanName } }),
      fetch("/api/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: cleanName, appearance, equippedItems: stateRef.current.avatar.equippedItems })
      })
    ]);
    show("Tu personaje ya se siente mas tuyo.");
  }

  function show(message: string) {
    setToast(message);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast("");
      toastTimerRef.current = null;
    }, 2600);
  }

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  function upsertLog(activity: Activity, value: number | undefined, status: ActivityLog["status"]) {
    let clampedMessage = "";
    let savedPartial = false;
    let earnedReward = { xp: 0, coins: 0 };
    setState((current) => {
      const limited = status === "completed" ? clampToCapacity(activity, current.logs, value) : { value, capacity: undefined, wasClamped: false };
      if (limited.wasClamped) {
        clampedMessage = t(locale, "paceLimit", { capacity: limited.capacity ?? "", unit: getUnitLabel(locale, activity.unit) });
      }
      const safeValue = limited.value;
      const existing = logForActivityPeriod(activity, current.logs, currentDay);
      const shouldCompletionReward = status === "completed" && existing?.status !== "completed";
      const shouldHonestyReward = status === "not_done" && existing?.status !== "not_done" && existing?.status !== "completed";
      const reward = shouldCompletionReward ? rewardFor(activity, safeValue) : shouldHonestyReward ? honestyReward() : { xp: 0, coins: 0 };
      earnedReward = reward;
      savedPartial = status === "pending";
      const logDate = status === "moved" ? toDateKey(addDays(currentDate, 1)) : existing?.date ?? currentDay;
      const log: ActivityLog = {
        id: status === "moved" || !existing ? `${logDate}-${activity.id}` : existing.id,
        activityId: activity.id,
        date: logDate,
        value: safeValue,
        status,
        xpEarned: reward.xp > 0 ? reward.xp : existing?.xpEarned ?? 0,
        coinsEarned: reward.coins > 0 ? reward.coins : existing?.coinsEarned ?? 0,
        createdAt: existing?.createdAt ?? new Date().toISOString()
      };
      const logs = [...current.logs.filter((item) => item.id !== log.id && item.id !== existing?.id), log];
      const rewarded = shouldCompletionReward
        ? applyReward(current.progress, activity, reward)
        : shouldHonestyReward
          ? applyPointsReward(current.progress, reward)
          : current.progress;
      return { ...current, logs, progress: recomputeStreak(rewarded, logs) };
    });
    if (clampedMessage) show(clampedMessage);
    else if (status === "completed" && earnedReward.xp > 0) show(t(locale, "completedToast", { xp: earnedReward.xp }));
    else if (savedPartial) show(t(locale, "partialToast"));
    if (status === "moved") show(t(locale, "movedToast"));
    if (status === "not_done" && earnedReward.xp > 0) show(t(locale, "notDoneToast", { xp: earnedReward.xp }));
  }

  function completePeriodicOccurrence(activity: Activity) {
    let completed = 0;
    let target = Math.max(1, activity.periodTarget ?? 1);
    let earnedXp = 0;
    setState((current) => {
      const existing = completedLogsForActivityPeriod(activity, current.logs, currentDay);
      completed = existing.length;
      if (completed >= target) return current;

      const reward = rewardFor(activity, activity.targetValue ?? 1);
      earnedXp = reward.xp;
      const log: ActivityLog = {
        id: `${currentDay}-${activity.id}-${crypto.randomUUID()}`,
        activityId: activity.id,
        date: currentDay,
        value: activity.targetValue ?? 1,
        status: "completed",
        xpEarned: reward.xp,
        coinsEarned: reward.coins,
        createdAt: new Date().toISOString()
      };
      completed += 1;
      const logs = [...current.logs, log];
      const rewarded = applyReward(current.progress, activity, reward);
      return { ...current, logs, progress: recomputeStreak(rewarded, logs) };
    });
    window.setTimeout(() => {
      if (completed >= target) show(`${getActivityName(locale, activity)}: ${completed}/${target} completadas${earnedXp ? ` · +${earnedXp} XP` : ""}`);
    }, 0);
  }

  function moveTodayLogsToYesterday() {
    const previousDay = toDateKey(addDays(currentDate, -1));
    moveLogsToPreviousDay(currentDay, previousDay);
    setSelectedDay(previousDay);
    show(t(locale, "movedTodayToast", { date: formatLongDate(previousDay, locale) }));
  }

  function moveSelectedDayLogsToPreviousDay(day: string) {
    const previousDay = toDateKey(addDays(new Date(`${day}T12:00:00`), -1));
    moveLogsToPreviousDay(day, previousDay);
    setSelectedDay(previousDay);
    show(t(locale, "movedDayToast", { from: formatLongDate(day, locale), to: formatLongDate(previousDay, locale) }));
  }

  function moveLogsToPreviousDay(sourceDay: string, targetDay: string) {
    setState((current) => {
      const targetActivityIds = new Set(
        current.logs.filter((log) => log.date === targetDay).map((log) => log.activityId)
      );
      const movedLogs = current.logs.map((log) => {
        if (log.date !== sourceDay) return log;
        if (targetActivityIds.has(log.activityId)) return log;
        return {
          ...log,
          id: `${targetDay}-${log.activityId}`,
          date: targetDay
        };
      });
      return { ...current, logs: movedLogs, progress: recomputeStreak(current.progress, movedLogs) };
    });
  }

  function createActivity(form: FormData) {
    const name = String(form.get("name") || t(locale, "newActivityDefaultName")).trim().slice(0, 80);
    const unit = String(form.get("unit")) as ActivityUnit;
    const type = String(form.get("type")) as ActivityType;
    const category = String(form.get("category")) as Category;
    const requestedTarget = Number(form.get("target") || 1);
    const targetValue = Number.isFinite(requestedTarget) && requestedTarget > 0 ? requestedTarget : 1;
    const requestedPeriodTarget = Number(form.get("periodTarget") || 1);
    const periodTarget = type === "daily" ? 1 : Math.max(1, Math.min(31, Math.round(requestedPeriodTarget)));
    const requestedRepeatDays = Number(form.get("repeatEveryDays") || 1);
    const repeatEveryDays = type === "daily" ? Math.max(1, Math.min(31, Math.round(requestedRepeatDays))) : 1;
    const activity: Activity = {
      id: `${Date.now()}`,
      name,
      type,
      icon: String(form.get("icon") || "Star"),
      color: String(form.get("color") || "#8BCB77"),
      unit,
      targetValue,
      targetLabel: `${targetValue} ${getUnitLabel(locale, unit)}`,
      periodTarget,
      repeatEveryDays,
      createdAt: new Date().toISOString(),
      isActive: true,
      category,
      description: String(form.get("notes") || ""),
      limit: unit === "yes_no" || unit === "text" ? undefined : {
        baseValue: targetValue,
        stepValue: Math.max(1, Math.round(targetValue * 0.2)),
        everyCompletions: 4,
        maxValue: Math.max(targetValue * 3, targetValue + 5)
      }
    };
    setState((current) => ({ ...current, activities: [...current.activities, activity] }));
    setView("today");
    show(t(locale, "newActivityToast"));
  }

  function deleteActivity(activity: Activity) {
    const confirmed = window.confirm(`¿Eliminar "${getActivityName(locale, activity)}"?\n\nDejará de aparecer en tus listas, pero conservaremos su historial en el calendario y las estadísticas.`);
    if (!confirmed) return;
    setState((current) => ({
      ...current,
      activities: current.activities.map((item) => item.id === activity.id ? { ...item, isActive: false } : item)
    }));
    show("Actividad eliminada. Su historial quedó guardado.");
  }

  function buyOrEquip(itemId: string) {
    const item = shopItems.find((entry) => entry.id === itemId);
    if (!item) return;
    let message = t(locale, "itemEquippedToast");
    setState((current) => {
      if (current.progress.level < (item.unlockLevel ?? 1)) {
        message = t(locale, "itemUnlockToast", { level: item.unlockLevel ?? 1 });
        return current;
      }
      const owned = current.avatar.ownedItems.includes(item.id);
      const equipped = current.avatar.equippedItems[item.type] === item.id;
      if (equipped) {
        message = t(locale, "itemAlreadyEquippedToast");
        return current;
      }
      if (!owned && current.progress.coins < item.price) {
        message = t(locale, "notEnoughCoinsToast");
        return current;
      }
      return {
        ...current,
        progress: { ...current.progress, coins: owned ? current.progress.coins : current.progress.coins - item.price },
        avatar: {
          ...current.avatar,
          ownedItems: owned ? current.avatar.ownedItems : [...current.avatar.ownedItems, item.id],
          equippedItems: { ...current.avatar.equippedItems, [item.type]: item.id }
        }
      };
    });
    window.setTimeout(() => show(message), 0);
  }

  function equipAvatarItem(itemId: string) {
    const item = shopItems.find((entry) => entry.id === itemId);
    if (!item) return;
    setState((current) => {
      if (current.progress.level < (item.unlockLevel ?? 1)) return current;
      if (!current.avatar.ownedItems.includes(item.id)) return current;
      return {
        ...current,
        avatar: {
          ...current.avatar,
          equippedItems: { ...current.avatar.equippedItems, [item.type]: item.id }
        }
      };
    });
    show(t(locale, "avatarEquippedToast"));
  }

  function unequipAvatarSlot(itemId: string) {
    const item = shopItems.find((entry) => entry.id === itemId);
    if (!item) return;
    setState((current) => {
      const equippedItems = { ...current.avatar.equippedItems };
      delete equippedItems[item.type];
      return {
        ...current,
        avatar: {
          ...current.avatar,
          equippedItems
        }
      };
    });
    show(t(locale, "inventorySavedToast"));
  }

  return (
    <I18nContext.Provider value={i18n}>
    <main className="min-h-screen pb-28 md:pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-3 py-3 sm:px-4 sm:py-4 md:grid-cols-[9.5rem_minmax(0,1fr)] md:items-start">
        <DesktopMenu current={view} onChange={setView} />
        <div className="grid min-w-0 gap-4">
          <div className="grid gap-2">
            <LandscapeHeader progress={state.progress} avatar={state.avatar} account={account} syncStatus={syncStatus} onRetry={() => setSyncRetry((value) => value + 1)} onSignOut={signOut} />
            <MobileTools onNavigate={setView} />
          </div>
          {syncConflict && (
            <section className="rounded-[24px] border border-sun bg-cream p-4 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-black">Hay cambios en otro dispositivo</h2>
                  <p className="text-sm font-bold text-muted">Elegí qué progreso querés conservar. No vamos a reemplazar nada sin preguntarte.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={useRemoteVersion} className="rounded-2xl bg-watersoft/35 px-4 py-2 text-sm font-black">Usar la nube</button>
                  <button onClick={keepLocalVersion} className="rounded-2xl bg-leaf px-4 py-2 text-sm font-black text-white">Conservar este dispositivo</button>
                </div>
              </div>
            </section>
          )}
          <section>
            {(view === "today" || view === "week" || view === "month") && (
              <PeriodOverview state={state} currentDate={currentDate} current={view} locale={locale} />
            )}
            <div>
              {view === "today" && (
                <TodayPanel activities={todayActivities} logs={todayLogs} allLogs={state.logs} currentDay={currentDay} onAction={upsertLog} onDelete={deleteActivity} onNew={() => setView("new")} onMoveTodayToYesterday={moveTodayLogsToYesterday} />
              )}
              {view === "week" && <WeekPanel state={state} currentDate={currentDate} onPeriodicAction={completePeriodicOccurrence} onDelete={deleteActivity} />}
              {view === "month" && <MonthPanel state={state} currentDate={currentDate} selectedDay={selectedDay} setSelectedDay={setSelectedDay} onMoveSelectedDayToPrevious={moveSelectedDayLogsToPreviousDay} onPeriodicAction={completePeriodicOccurrence} onDelete={deleteActivity} />}
              {view === "world" && <WorldPanel state={state} />}
              {view === "stats" && <StatsPanel state={state} currentDate={currentDate} locale={locale} />}
              {view === "avatar" && <AvatarPanel2 state={state} onEquip={equipAvatarItem} onUnequip={unequipAvatarSlot} onSaveCharacter={saveCharacter} />}
              {view === "shop" && <ShopPanel2 state={state} onBuy={buyOrEquip} />}
              {view === "friends" && <FriendsPanel />}
              {view === "new" && <NewActivityPanel onCreate={createActivity} />}
            </div>
          </section>
        </div>
      </div>
      <BottomNav current={view} locale={locale} onChange={setView} />
      {toast && <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-cream px-5 py-3 text-sm font-extrabold text-forest shadow-soft">{toast}</div>}
    </main>
    </I18nContext.Provider>
  );
}

function LandscapeHeader({ progress, avatar, account, syncStatus, onRetry, onSignOut }: { progress: AppState["progress"]; avatar: AppState["avatar"]; account: { name: string; email: string } | null; syncStatus: SyncStatus; onRetry: () => void; onSignOut: () => void }) {
  const { locale, copy } = useI18n();
  return (
    <header className="rounded-2xl border border-line bg-cream/90 p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <CharacterPreview compact equippedItems={avatar.equippedItems} appearance={avatar.appearance} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-black sm:text-2xl">{copy("greeting", { name: account?.name ?? avatar.name })}</h1>
          <p className="text-sm font-semibold text-muted">{copy("subtitle")}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onRetry} title={syncLabels[locale][syncStatus]} className={`grid h-11 w-11 place-items-center rounded-xl border ${syncStatus === "saved" ? "border-leaf/40 bg-leaf/10 text-forest" : syncStatus === "offline" || syncStatus === "conflict" ? "border-coral/50 bg-coral/10 text-ink" : "border-line bg-white/60 text-muted"}`}>
            {syncStatus === "offline" ? <CloudOff size={18} /> : syncStatus === "saving" || syncStatus === "loading" ? <RefreshCw size={18} className="animate-spin" /> : <Cloud size={18} />}
          </button>
          <LanguageSelector />
          {account && (
            <button onClick={onSignOut} title="Cerrar sesion" className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white/60 text-forest">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-line/70 pt-3">
        <HeaderMetric label={`${copy("level")} ${progress.level}`} value={`${progress.xp}/${progress.xpToNextLevel} XP`} />
        <HeaderMetric label={`${progress.coins} ${copy("coins")}`} />
        <HeaderMetric label={`🔥 ${progress.streakCurrent} ${copy("days")}`} />
        <HeaderMetric label={`🛡️ ${progress.streakFreezes} ${copy("streakProtection")}`} />
      </div>
    </header>
  );
}

function LanguageSelector() {
  const { locale, setLocale, copy } = useI18n();
  return (
    <>
      <label className="sr-only" htmlFor="locale-select">{copy("language")}</label>
      <select
        id="locale-select"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="min-h-11 max-w-20 rounded-xl border border-line bg-white/60 px-2 text-sm font-black text-forest"
        aria-label={copy("language")}
      >
        {supportedLocales.map((item) => (
          <option key={item} value={item}>{localeShortNames[item]} - {localeNames[item]}</option>
        ))}
      </select>
    </>
  );
}

function HeaderMetric({ label, value }: { label: string; value?: string }) {
  return <div className="rounded-full bg-cream2 px-3 py-1.5 text-xs font-black text-forest">{label}{value && <span className="ml-1 font-bold text-muted">{value}</span>}</div>;
}

function MobileTools({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  const { locale } = useI18n();
  const items = [
    { id: "new" as const, icon: Plus },
    { id: "stats" as const, icon: GraduationCap },
    { id: "shop" as const, icon: Star },
    { id: "friends" as const, icon: Users }
  ];
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 md:hidden" aria-label="Herramientas">
      {items.map(({ id, icon: Icon }) => (
        <button key={id} onClick={() => onNavigate(id)} className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-cream/80 px-3 text-xs font-black text-muted">
          <Icon size={16} />
          {getViewLabel(locale, id)}
        </button>
      ))}
    </nav>
  );
}

function DesktopMenu({ current, onChange }: { current: ViewId; onChange: (view: ViewId) => void }) {
  const { locale } = useI18n();
  const primaryItems = [
    { id: "today" as const, icon: House },
    { id: "week" as const, icon: Star },
    { id: "month" as const, icon: CalendarDays },
    { id: "world" as const, icon: Map }
  ];
  const secondaryItems = [
    { id: "new" as const, icon: Plus },
    { id: "stats" as const, icon: GraduationCap },
    { id: "shop" as const, icon: Star },
    { id: "friends" as const, icon: Users }
  ];
  const renderItem = ({ id, icon: Icon }: { id: ViewId; icon: typeof House }) => {
    const active = current === id;
    return (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-sm font-extrabold transition ${active ? "bg-forest text-white" : "text-muted hover:bg-white/70 hover:text-forest"}`}
        aria-current={active ? "page" : undefined}
      >
        <Icon size={18} className="shrink-0" />
        <span className="truncate">{getViewLabel(locale, id)}</span>
      </button>
    );
  };
  return (
    <aside className="sticky top-4 hidden rounded-2xl border border-line bg-cream/90 p-2 shadow-sm md:block">
      <nav className="grid gap-1" aria-label="Navegación principal">
        {primaryItems.map(renderItem)}
        <div className="my-2 border-t border-line" />
        {secondaryItems.map(renderItem)}
        <div className="my-2 border-t border-line" />
        {renderItem({ id: "avatar", icon: Smile })}
      </nav>
    </aside>
  );
}

function TodayPanel({ activities, logs, allLogs, currentDay, onAction, onDelete, onNew, onMoveTodayToYesterday }: { activities: Activity[]; logs: ActivityLog[]; allLogs: ActivityLog[]; currentDay: string; onAction: (activity: Activity, value: number | undefined, status: ActivityLog["status"]) => void; onDelete: (activity: Activity) => void; onNew: () => void; onMoveTodayToYesterday: () => void }) {
  const { locale, copy } = useI18n();
  return (
    <section className="soft-card rounded-[28px] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-black capitalize text-muted">{formatLongDate(currentDay, locale)}</h3>
        {logs.length > 0 && (
          <button onClick={onMoveTodayToYesterday} className="rounded-2xl bg-coral/25 px-3 py-2 text-sm font-black text-ink">
            {copy("moveTodayToYesterday")}
          </button>
        )}
      </div>
      <div className="grid gap-2">
        {activities.length ? activities.map((activity) => <ActivityCard key={activity.id} activity={activity} log={logForActivityPeriod(activity, allLogs, currentDay)} allLogs={allLogs} onAction={onAction} onDelete={onDelete} />) : (
          <div className="rounded-2xl border border-dashed border-line bg-cream/60 p-5 text-center font-bold text-muted">{copy("dailyActivitiesEmpty")}</div>
        )}
      </div>
      <button onClick={onNew} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-cream2 px-4 py-3 font-extrabold"><Plus size={19} /> {copy("addActivity")}</button>
    </section>
  );
}

function ActivityCard({ activity, log, allLogs, onAction, onDelete }: { activity: Activity; log?: ActivityLog; allLogs: ActivityLog[]; onAction: (activity: Activity, value: number | undefined, status: ActivityLog["status"]) => void; onDelete: (activity: Activity) => void }) {
  const { locale, copy } = useI18n();
  const Icon = icons[activity.icon as keyof typeof icons] ?? Star;
  const activityName = getActivityName(locale, activity);
  const value = log?.value ?? 0;
  const percent = activity.targetValue ? (value / activity.targetValue) * 100 : log?.status === "completed" ? 100 : 0;
  const capacity = getActivityCapacity(activity, allLogs);
  const capacityProgress = nextCapacityProgress(activity, allLogs);
  const isStepClick = clickStepUnits.includes(activity.unit);
  const isCompleted = log?.status === "completed";
  const isNotDone = log?.status === "not_done";
  const nextStepValue = Math.min((activity.targetValue ?? value + 1), value + 1);
  const nextStepStatus: ActivityLog["status"] = nextStepValue >= (activity.targetValue ?? 1) ? "completed" : "pending";
  function loadManualValue() {
    const answer = window.prompt(copy("manualAmountPrompt"), String(activity.targetValue ?? 1));
    if (answer === null) return;
    const loadedValue = Number(answer);
    if (!Number.isFinite(loadedValue) || loadedValue < 0) return;
    const loadedStatus: ActivityLog["status"] = loadedValue >= (activity.targetValue ?? 1) ? "completed" : "pending";
    onAction(activity, loadedValue, loadedStatus);
  }
  return (
    <article className={`rounded-2xl border bg-cream/80 p-3 ${isCompleted ? "border-leaf" : "border-line"}`}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${activity.color}40` }}><Icon style={{ color: activity.color }} /></div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black">{activityName}</span>
            {activity.type !== "daily" && <span className="rounded-full bg-cream2 px-2 py-0.5 text-[0.65rem] font-black uppercase text-muted">{copy(activity.type)}</span>}
          </div>
          <div className="text-sm text-muted">{copy("goal")}: {getActivityTargetLabel(locale, activity)}</div>
          {capacity && <div className="text-xs font-bold text-forest">{copy("capacityUnlocked")}: {capacity} {getUnitLabel(locale, activity.unit)}</div>}
          <div className="mt-2"><ProgressBar value={percent} color={activity.color} /></div>
        </div>
        <button
          disabled={isCompleted}
          onClick={() => isStepClick ? onAction(activity, nextStepValue, nextStepStatus) : onAction(activity, activity.targetValue ?? 1, "completed")}
          className={`grid h-12 w-12 place-items-center rounded-2xl font-black disabled:cursor-not-allowed ${isCompleted ? "bg-leaf text-white" : isStepClick ? "bg-watersoft/35 text-ink" : "bg-cream2 text-muted"}`}
          aria-label={isStepClick ? copy("addOneAria", { activity: activityName }) : copy("completeAria", { activity: activityName })}
        >
          {isCompleted ? <Check /> : isStepClick ? "+1" : <Check />}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-bold" style={{ color: activity.color }}>{value || 0} / {activity.targetValue ?? 1} {getUnitLabel(locale, activity.unit)}</span>
        {capacityProgress && !capacityProgress.isMaxed && <span className="text-xs font-bold text-muted">{copy("limitIn", { remaining: capacityProgress.remaining })}</span>}
        <div className="flex flex-wrap justify-end gap-2">
          <button disabled={isCompleted} onClick={loadManualValue} className="rounded-xl bg-watersoft/30 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-50">{copy("load")}</button>
          <button disabled={isCompleted} onClick={() => onAction(activity, value, "moved")} className="rounded-xl bg-sun/35 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-50">{copy("move")}</button>
          <button disabled={isCompleted || isNotDone} onClick={() => onAction(activity, value, "not_done")} className="rounded-xl bg-coral/30 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-50">{copy("couldNot")}</button>
          <button onClick={() => onDelete(activity)} className="grid min-h-8 min-w-8 place-items-center rounded-xl bg-coral/15 px-2 text-coral" aria-label={`Eliminar ${activityName}`} title="Eliminar actividad"><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  );
}

function PeriodActivityCard({ activity, allLogs, currentDay, onComplete, onDelete }: { activity: Activity; allLogs: ActivityLog[]; currentDay: string; onComplete: (activity: Activity) => void; onDelete: (activity: Activity) => void }) {
  const { locale, copy } = useI18n();
  const Icon = icons[activity.icon as keyof typeof icons] ?? Star;
  const activityName = getActivityName(locale, activity);
  const done = completedLogsForActivityPeriod(activity, allLogs, currentDay).length;
  const target = Math.max(1, activity.periodTarget ?? 1);
  const isCompleted = done >= target;
  const periodLabel = copy(activity.type === "weekly" ? "thisWeek" : "thisMonth");

  return (
    <article className={`rounded-2xl border bg-cream/80 p-3 ${isCompleted ? "border-leaf" : "border-line"}`}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${activity.color}40` }}><Icon style={{ color: activity.color }} /></div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black">{activityName}</span>
            <span className="rounded-full bg-cream2 px-2 py-0.5 text-[0.65rem] font-black uppercase text-muted">{copy(activity.type)}</span>
          </div>
          <div className="text-sm font-bold text-muted">{copy("periodProgress", { done, target, period: periodLabel })}</div>
          <div className="mt-2"><ProgressBar value={(done / target) * 100} color={activity.color} /></div>
        </div>
        <button disabled={isCompleted} onClick={() => onComplete(activity)} className={`grid h-12 w-12 place-items-center rounded-2xl font-black ${isCompleted ? "bg-leaf text-white" : "bg-watersoft/35 text-ink"}`} aria-label={`Registrar ${activityName}`}>
          {isCompleted ? <Check /> : "+1"}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold" style={{ color: activity.color }}>{isCompleted ? copy("goalCompleted") : copy("remainingToComplete", { count: target - done })}</span>
        <button onClick={() => onDelete(activity)} className="flex min-h-9 items-center gap-1 rounded-xl bg-coral/15 px-3 font-bold text-coral" aria-label={`${copy("deleteAction")} ${activityName}`}><Trash2 size={16} /> {copy("deleteAction")}</button>
      </div>
    </article>
  );
}

function MonthPanel({ state, currentDate, selectedDay, setSelectedDay, onMoveSelectedDayToPrevious, onPeriodicAction, onDelete, compact = false }: { state: AppState; currentDate: Date; selectedDay: string; setSelectedDay: (day: string) => void; onMoveSelectedDayToPrevious: (day: string) => void; onPeriodicAction?: (activity: Activity) => void; onDelete?: (activity: Activity) => void; compact?: boolean }) {
  const { locale, copy } = useI18n();
  const days = getMonthDays(currentDate);
  const monthTitle = new Intl.DateTimeFormat(toIntlLocale(locale), { month: "long", year: "numeric" }).format(currentDate);
  const selectedLogs = state.logs.filter((log) => log.date === selectedDay && log.status === "completed");
  const monthlyActivities = state.activities.filter((activity) => activity.isActive && activity.type === "monthly");
  const currentDay = toDateKey(currentDate);
  return (
    <section className={`soft-card rounded-[28px] p-4 ${compact ? "" : "mx-auto max-w-4xl"}`}>
      <div className="mb-4 border-b border-line pb-3"><h3 className="text-base font-black capitalize text-muted">{monthTitle}</h3></div>
      {!compact && onPeriodicAction && onDelete && (
        <div className="mb-5 rounded-2xl border border-line bg-skysoft/20 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">{copy("monthlyActivitiesTitle")}</h3>
              <p className="text-sm font-bold text-muted">{copy("monthlyActivitiesDescription")}</p>
            </div>
            <span className="rounded-full bg-violetSoft/25 px-3 py-1 text-sm font-black">{monthlyActivities.length}</span>
          </div>
          <div className="grid gap-2">
            {monthlyActivities.length ? monthlyActivities.map((activity) => (
              <PeriodActivityCard key={activity.id} activity={activity} allLogs={state.logs} currentDay={currentDay} onComplete={onPeriodicAction} onDelete={onDelete} />
            )) : <div className="rounded-2xl border border-dashed border-line bg-cream/60 p-4 text-center font-bold text-muted">{copy("monthlyActivitiesEmpty")}</div>}
          </div>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-bold text-muted">{getWeekdayHeaders(locale).map((d, index) => <span key={`${d}-${index}`}>{d}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const logs = state.logs.filter((log) => log.date === day.key && log.status === "completed").slice(0, 5);
          const active = selectedDay === day.key;
          return (
            <button key={day.key} onClick={() => setSelectedDay(day.key)} className={`min-h-[52px] rounded-2xl p-1 text-sm font-black ${active ? "bg-leaf text-white" : day.isCurrentMonth ? "bg-cream/70" : "text-muted/50"}`}>
              {day.number}
              <div className="mt-1 flex justify-center gap-1">{logs.map((log) => <span key={log.id} className="h-2 w-2 rounded-full" style={{ background: state.activities.find((a) => a.id === log.activityId)?.color ?? "#8BCB77" }} />)}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border border-line bg-cream p-4">
        <div className="font-black capitalize">{formatLongDate(selectedDay, locale)}</div>
        <div className="text-sm font-bold text-forest">{copy("completedActivities", { completed: selectedLogs.length, total: state.activities.filter((activity) => activity.isActive && isActivityDueOnDate(activity, selectedDay)).length })}</div>
        <div className="mt-3 flex flex-wrap gap-2">{selectedLogs.length ? selectedLogs.map((log) => {
          const activity = state.activities.find((a) => a.id === log.activityId);
          return <span key={log.id} className="rounded-full bg-cream2 px-3 py-2 text-sm font-bold">{activity ? getActivityName(locale, activity) : ""}</span>;
        }) : <span className="text-sm text-muted">{copy("noCompletedDay")}</span>}</div>
        {selectedLogs.length > 0 && (
          <button onClick={() => onMoveSelectedDayToPrevious(selectedDay)} className="mt-3 w-full rounded-2xl bg-coral/25 px-3 py-2 text-sm font-black text-ink">
            {copy("moveDayPrevious")}
          </button>
        )}
      </div>
    </section>
  );
}

function WeekPanel({ state, currentDate, onPeriodicAction, onDelete, compact = false }: { state: AppState; currentDate: Date; onPeriodicAction?: (activity: Activity) => void; onDelete?: (activity: Activity) => void; compact?: boolean }) {
  const { locale, copy } = useI18n();
  const weekDays = getWeekDays(currentDate, locale);
  const weekLogs = logsForWeek(state.logs, currentDate);
  const dailyActivities = state.activities.filter((activity) => activity.isActive && activity.type === "daily");
  const weeklyActivities = state.activities.filter((activity) => activity.isActive && activity.type === "weekly");
  const progressActivities = compact ? [...dailyActivities, ...weeklyActivities] : [];
  const currentDay = toDateKey(currentDate);
  const weekTitle = `${formatLongDate(weekDays[0].key, locale)} - ${formatLongDate(weekDays[6].key, locale)}`;
  return (
    <section className={`soft-card rounded-[28px] p-4 ${compact ? "" : "mx-auto max-w-4xl"}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black capitalize text-muted">{weekTitle}</h3>
      </div>
      <div className="mb-4 grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const completed = weekLogs.filter((log) => log.date === day.key && log.status === "completed").length;
          const isToday = day.key === toDateKey(currentDate);
          return (
            <div key={day.key} className={`rounded-2xl p-2 text-center text-xs font-black ${isToday ? "bg-leaf text-white" : "bg-cream/70 text-muted"}`}>
              <div className="capitalize">{day.label}</div>
              <div>{day.number}</div>
              <div>{completed}</div>
            </div>
          );
        })}
      </div>
      {!compact && onPeriodicAction && onDelete && (
        <div className="mb-5 rounded-2xl border border-line bg-skysoft/20 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">{copy("weeklyActivitiesTitle")}</h3>
              <p className="text-sm font-bold text-muted">{copy("weeklyActivitiesDescription")}</p>
            </div>
            <span className="rounded-full bg-watersoft/35 px-3 py-1 text-sm font-black">{weeklyActivities.length}</span>
          </div>
          <div className="grid gap-2">
            {weeklyActivities.length ? weeklyActivities.map((activity) => (
              <PeriodActivityCard key={activity.id} activity={activity} allLogs={state.logs} currentDay={currentDay} onComplete={onPeriodicAction} onDelete={onDelete} />
            )) : <div className="rounded-2xl border border-dashed border-line bg-cream/60 p-4 text-center font-bold text-muted">{copy("weeklyActivitiesEmpty")}</div>}
          </div>
        </div>
      )}
      {compact && <div className="grid gap-4">
        {progressActivities.slice(0, 7).map((activity) => {
          const done = weekLogs.filter((log) => log.activityId === activity.id && log.status === "completed").length;
          const target = activity.type === "weekly"
            ? Math.max(1, activity.periodTarget ?? 1)
            : Math.max(1, weekDays.filter((day) => isActivityDueOnDate(activity, day.key)).length);
          return (
            <div key={activity.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `${activity.color}40` }}>{getActivityName(locale, activity)[0]}</span>
              <div>
                <div className="font-black">{getActivityName(locale, activity)}</div>
                <ProgressBar value={(done / target) * 100} color={activity.color} />
              </div>
              <span className="text-sm font-bold">{done} / {target} {copy("days")}</span>
            </div>
          );
        })}
        {!progressActivities.length && <div className="rounded-2xl border border-dashed border-line bg-cream/60 p-4 text-center font-bold text-muted">No hay actividades para mostrar en esta semana.</div>}
      </div>}
    </section>
  );
}

function WorldPanel({ state }: { state: AppState }) {
  const { locale, copy } = useI18n();
  const world = getWorldProgress(state);
  const visibleZones = world.zones.filter((zone) => zone.level > 0);
  const message = getWorldMessage(locale, world.totalLevels);

  return (
    <section className="grid gap-4">
      <div className="soft-card overflow-hidden rounded-[28px] p-3 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black sm:text-2xl">{copy("worldTitle")}</h2>
            <p className="mt-1 text-base font-bold leading-snug text-muted sm:text-sm">{message}</p>
          </div>
          <div className="flex w-full items-center justify-between rounded-2xl bg-cream px-4 py-3 font-black sm:w-auto sm:block sm:text-right">
            <div>{copy("level")} {world.worldLevel}</div>
            <div className="text-sm text-muted sm:text-xs">{world.unlocked}/{world.zones.length} {copy("zones")}</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-line bg-[#DFF3E6] md:hidden">
          <div className="world-banner-scroll snap-x snap-mandatory overflow-x-auto overscroll-x-contain pastel-scroll">
            <div className="relative flex min-w-max items-stretch gap-3 p-3">
              <div className="pointer-events-none absolute inset-x-0 bottom-3 h-20 rounded-[50%] bg-leaf/35" />
              <div className="pointer-events-none absolute left-10 top-9 h-7 w-24 rounded-[50%] bg-white/80" />
              <div className="relative z-10 w-[270px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-white/70 bg-skysoft/45">
                <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-[50%] bg-leaf/35" />
                <div className="relative pt-1">
                  <CharacterPreview equippedItems={state.avatar.equippedItems} appearance={state.avatar.appearance} />
                </div>
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-cream/95 px-4 py-2 text-center font-black shadow-sm">
                  {state.avatar.name}
                </div>
              </div>
              {world.zones.map((zone) => (
                <article key={zone.id} className={`relative z-10 flex w-[210px] shrink-0 snap-start flex-col rounded-[24px] border p-4 shadow-sm ${zone.level ? "border-line bg-cream/95" : "border-line/70 bg-cream2/90"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-5xl" aria-hidden>{worldZoneSymbols[zone.id]}</span>
                    <span className={`rounded-full px-3 py-1.5 text-sm font-black ${zone.level ? "bg-leaf/20 text-forest" : "bg-cream text-muted"}`}>{copy("levelShort")} {zone.level}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black leading-tight">{getWorldZoneText(locale, zone.id)?.name ?? zone.name}</h3>
                  <p className="mt-1 min-h-10 text-sm font-bold leading-snug text-muted">{getWorldZoneDetail(locale, zone.id, zone.level, zone.detail)}</p>
                  <div className="mt-auto pt-4">
                    <ProgressBar value={zone.percent} color={zone.color} />
                    <div className="mt-2 flex items-center justify-between gap-2 text-sm font-black text-muted">
                      <span>{zone.points} {copy("progressPlural")}</span>
                      <span>{zone.level >= 5 ? copy("special") : `${copy("next")}: ${zone.next}`}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {!visibleZones.length && <div className="m-3 mt-0 rounded-2xl border border-line bg-cream p-4 text-center text-sm font-bold text-muted">{copy("worldEmpty")}</div>}
        </div>

        <div className="relative hidden min-h-[430px] overflow-hidden rounded-[28px] border border-line bg-[#DFF3E6] p-4 md:block">
          <div className="absolute inset-x-0 bottom-0 h-28 rounded-t-[45%] bg-leaf/35" />
          <div className="absolute left-6 top-8 h-8 w-24 rounded-[50%] bg-white/70" />
          <div className="absolute right-12 top-12 h-7 w-28 rounded-[50%] bg-white/80" />
          <div className="absolute left-1/2 top-12 z-20 -translate-x-1/2">
            <CharacterPreview small equippedItems={state.avatar.equippedItems} appearance={state.avatar.appearance} />
          </div>
          {world.zones.map((zone) => <WorldSceneElement key={zone.id} zone={zone} />)}
          {!visibleZones.length && (
            <div className="absolute inset-x-6 bottom-8 rounded-2xl border border-line bg-cream/90 p-4 text-center text-sm font-bold text-muted">
              {copy("worldEmpty")}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {world.zones.map((zone) => (
          <article key={zone.id} className="rounded-2xl border border-line bg-cream/90 p-5 shadow-sm sm:p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="mb-2 text-4xl sm:hidden" aria-hidden>{worldZoneSymbols[zone.id]}</div>
                <h3 className="text-lg font-black sm:text-base">{getWorldZoneText(locale, zone.id)?.name ?? zone.name}</h3>
                <p className="text-sm font-bold text-muted sm:text-xs">{getWorldZoneText(locale, zone.id)?.category ?? zone.category} - {getWorldZoneDetail(locale, zone.id, zone.level, zone.detail)}</p>
              </div>
              <span className="rounded-full bg-leaf/20 px-3 py-1 text-sm font-black text-forest">{copy("levelShort")} {zone.level}</span>
            </div>
            <ProgressBar value={zone.percent} color={zone.color} />
            <div className="mt-3 flex justify-between text-sm font-bold text-muted sm:mt-2 sm:text-xs">
              <span>{zone.points} {copy("progressPlural")}</span>
              <span>{zone.level >= 5 ? copy("special") : `${copy("next")}: ${zone.next}`}</span>
            </div>
            <p className="mt-3 text-base font-bold leading-snug text-muted sm:mt-2 sm:text-sm">{getWorldZoneText(locale, zone.id)?.message ?? zone.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorldSceneElement({ zone }: { zone: ReturnType<typeof getWorldProgress>["zones"][number] }) {
  const { locale, copy } = useI18n();
  if (zone.level === 0) return null;
  const size = 0.85 + zone.level * 0.08;
  const common = "absolute z-10 rounded-2xl border border-line bg-cream/90 p-2 text-center text-xs font-black shadow-soft";
  const style = { transform: `scale(${size})` };
  const sceneLabel = getWorldZoneText(locale, zone.id)?.sceneLabel ?? zone.name;

  if (zone.id === "lake") {
    return <div className="absolute bottom-12 right-8 h-20 w-32 rounded-[50%] border-4 border-white/80 bg-watersoft shadow-soft" style={style}><span className="absolute inset-x-0 top-7 text-xs font-black text-forest">{sceneLabel}</span></div>;
  }
  if (zone.id === "path") {
    return <div className="absolute bottom-8 left-16 h-24 w-48 -rotate-6 rounded-[50%] border-t-[18px] border-[#D8B06A]" style={style}><span className="absolute left-16 top-8 rounded-full bg-cream px-2 py-1 text-xs font-black">{sceneLabel}</span></div>;
  }
  if (zone.id === "garden") return <div className={`${common} bottom-24 left-8`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  if (zone.id === "creative") return <div className={`${common} left-8 top-24`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  if (zone.id === "tech") return <div className={`${common} right-8 top-24`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  if (zone.id === "library") return <div className={`${common} left-1/2 bottom-28 -translate-x-1/2`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  if (zone.id === "gym") return <div className={`${common} bottom-24 right-44`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  if (zone.id === "social") return <div className={`${common} left-1/3 top-28`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  if (zone.id === "rest") return <div className={`${common} right-12 bottom-32`} style={style}>{sceneLabel}<br />{copy("levelShort")} {zone.level}</div>;
  return null;
}

type SocialProfile = {
  id: string;
  display_name: string;
  friend_code: string;
  avatar?: { appearance?: Avatar["appearance"]; equippedItems?: Avatar["equippedItems"] };
  level: number;
  streak_current: number;
};

type FriendshipRelation = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted";
  created_at: string;
};

function FriendsPanel() {
  const [me, setMe] = useState<SocialProfile | null>(null);
  const [userId, setUserId] = useState("");
  const [relations, setRelations] = useState<FriendshipRelation[]>([]);
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadFriends() {
    setLoading(true);
    try {
      const [profileResponse, friendsResponse] = await Promise.all([fetch("/api/profile"), fetch("/api/friends")]);
      if (!profileResponse.ok || !friendsResponse.ok) throw new Error();

      const [profileData, friendsData] = await Promise.all([
        profileResponse.json() as Promise<{ profile: SocialProfile }>,
        friendsResponse.json() as Promise<{ userId: string; relations: FriendshipRelation[]; profiles: SocialProfile[] }>
      ]);
      setMe(profileData.profile);
      setUserId(friendsData.userId);
      setRelations(friendsData.relations);
      setProfiles(friendsData.profiles);
    } catch {
      setMessage("No pudimos cargar tus amistades. Revisá la conexión e intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFriends();
  }, []);

  async function act(action: "request" | "accept" | "reject" | "remove", friendshipId?: string) {
    setMessage("");
    try {
      const response = await fetch("/api/friends", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, code, friendshipId })
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) {
        setMessage(data.error ?? "No pudimos completar la acción.");
        return;
      }
      setCode("");
      setMessage(action === "request" ? "Solicitud enviada." : "Amistades actualizadas.");
      await loadFriends();
    } catch {
      setMessage("No pudimos completar la acción. Revisá la conexión e intentá de nuevo.");
    }
  }

  const profileFor = (relation: FriendshipRelation) => profiles.find((profile) => profile.id === (relation.requester_id === userId ? relation.addressee_id : relation.requester_id));
  const friends = relations.filter((relation) => relation.status === "accepted");
  const incoming = relations.filter((relation) => relation.status === "pending" && relation.addressee_id === userId);
  const outgoing = relations.filter((relation) => relation.status === "pending" && relation.requester_id === userId);

  return (
    <section className="grid gap-4">
      <div className="soft-card rounded-[28px] p-4 sm:p-5">
        <h2 className="text-2xl font-black">Amigos</h2>
        <p className="mt-1 font-bold text-muted">Compartí tu código o ingresá el de otra persona.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-cream p-4">
            <div className="text-sm font-black text-muted">Tu código de amistad</div>
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 rounded-xl bg-cream2 px-3 py-3 text-center text-lg font-black tracking-widest">{me?.friend_code ?? "CARGANDO"}</code>
              <button onClick={() => me && navigator.clipboard.writeText(me.friend_code)} className="rounded-xl bg-watersoft/35 px-4 py-3 font-black">Copiar</button>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-4">
            <label className="text-sm font-black text-muted" htmlFor="friend-code">Agregar por código</label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input id="friend-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} maxLength={12} placeholder="12 caracteres" className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-white px-4 font-black uppercase tracking-wider" />
              <button disabled={code.replace(/\s/g, "").length !== 12} onClick={() => act("request")} className="rounded-xl bg-leaf px-5 py-3 font-black text-white disabled:opacity-50">Enviar</button>
            </div>
          </div>
        </div>
        {message && <div className="mt-3 rounded-2xl bg-sun/20 px-4 py-3 text-sm font-black">{message}</div>}
      </div>

      {incoming.length > 0 && (
        <div className="soft-card rounded-[28px] p-4 sm:p-5">
          <h3 className="text-xl font-black">Solicitudes recibidas</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {incoming.map((relation) => <FriendCard key={relation.id} profile={profileFor(relation)} actions={<><button onClick={() => act("accept", relation.id)} className="rounded-xl bg-leaf px-4 py-2 font-black text-white">Aceptar</button><button onClick={() => act("reject", relation.id)} className="rounded-xl bg-coral/25 px-4 py-2 font-black">Rechazar</button></>} />)}
          </div>
        </div>
      )}

      <div className="soft-card rounded-[28px] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black">Mis amigos</h3><span className="rounded-full bg-leaf/20 px-3 py-1 font-black">{friends.length}</span></div>
        {loading ? <p className="mt-4 font-bold text-muted">Cargando amistades...</p> : friends.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">{friends.map((relation) => <FriendCard key={relation.id} profile={profileFor(relation)} actions={<button onClick={() => act("remove", relation.id)} className="rounded-xl bg-coral/20 px-4 py-2 text-sm font-black">Quitar</button>} />)}</div>
        ) : <EmptyState text="Todavia no agregaste amigos. Compartí tu código para empezar." />}
        {outgoing.length > 0 && <div className="mt-5"><h4 className="font-black text-muted">Solicitudes enviadas</h4><div className="mt-2 grid gap-2 md:grid-cols-2">{outgoing.map((relation) => <FriendCard key={relation.id} profile={profileFor(relation)} actions={<button onClick={() => act("remove", relation.id)} className="rounded-xl bg-cream2 px-4 py-2 text-sm font-black">Cancelar</button>} />)}</div></div>}
      </div>
    </section>
  );
}

function FriendCard({ profile, actions }: { profile?: SocialProfile; actions: React.ReactNode }) {
  if (!profile) return null;
  return (
    <article className="grid grid-cols-[112px_1fr] items-center gap-3 rounded-2xl border border-line bg-cream p-3">
      <div className="h-28 overflow-hidden rounded-2xl bg-skysoft/35">
        <div className="origin-top-left scale-[0.7]">
          <CharacterPreview small appearance={profile.avatar?.appearance} equippedItems={profile.avatar?.equippedItems} />
        </div>
      </div>
      <div className="min-w-0">
        <h4 className="truncate text-lg font-black">{profile.display_name}</h4>
        <div className="mt-1 flex flex-wrap gap-1 text-xs font-black text-muted"><span className="rounded-full bg-leaf/15 px-2 py-1">Nivel {profile.level}</span><span className="rounded-full bg-sun/20 px-2 py-1">🔥 {profile.streak_current}</span></div>
        <div className="mt-3 flex flex-wrap gap-2">{actions}</div>
      </div>
    </article>
  );
}

function AvatarPanel2({ state, onEquip, onUnequip, onSaveCharacter }: { state: AppState; onEquip: (id: string) => void; onUnequip: (id: string) => void; onSaveCharacter: (name: string, appearance: Avatar["appearance"]) => void }) {
  const { locale, copy } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const equipped = getEquippedItems(state);
  const owned = shopItems.filter((item) => state.avatar.ownedItems.includes(item.id));
  const equipmentBonus = getEquipmentBonus(state);
  return (
    <section className="soft-card mx-auto max-w-3xl p-3 sm:p-5">
      <div className="mb-5 flex flex-col items-center gap-4 rounded-2xl border border-line bg-skysoft/20 p-4 text-center sm:flex-row sm:text-left">
        <CharacterPreview small equippedItems={state.avatar.equippedItems} appearance={state.avatar.appearance} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-forest">{copy("character")}</p>
          <h2 className="mt-1 text-2xl font-black">{state.avatar.name}</h2>
          <p className="mt-1 max-w-md text-sm font-bold text-muted">{copy("characterSettingsHelp")}</p>
          <button onClick={() => setIsEditing((value) => !value)} className="mt-3 rounded-xl bg-forest px-4 py-2 text-sm font-black text-white">
            {copy(isEditing ? "closeEditor" : "customizeCharacter")}
          </button>
        </div>
      </div>
      {isEditing && <CharacterCreator avatar={state.avatar} onSave={(name, appearance) => {
        onSaveCharacter(name, appearance);
        setIsEditing(false);
      }} />}
      <div className="mb-4 rounded-2xl border border-line bg-cream p-3">
        <div className="mb-2 text-sm font-black text-muted">{copy("equippedNow")}</div>
        <div className="flex flex-wrap gap-2">
          {equipped.length ? equipped.map((item) => (
            <div key={item.id} className="flex w-full items-center gap-2 rounded-2xl bg-cream2 px-3 py-3 text-sm font-bold sm:w-auto sm:rounded-full sm:py-2">
              <span className="min-w-0 flex-1">{item.emoji} {getShopItemName(locale, item)}</span>
              <span className="rounded-full bg-leaf/20 px-2 py-1 text-xs text-forest">{formatBonus(locale, item.bonus)}</span>
              <button onClick={() => onUnequip(item.id)} className="min-h-0 rounded-full bg-coral/25 px-2 py-1 text-xs font-black">{copy("remove")}</button>
            </div>
          )) : <span className="text-sm text-muted">{copy("noEquippedItems")}</span>}
        </div>
      </div>
      <div className="mb-4 rounded-2xl border border-line bg-cream p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-black">{copy("inventory")}</h3>
            <p className="text-sm text-muted">{copy("inventoryHelp")}</p>
          </div>
          <span className="rounded-full bg-leaf/20 px-3 py-1 text-sm font-black">{copy("itemCount", { count: owned.length })}</span>
        </div>
        {owned.length ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {owned.map((item) => {
              const isEquipped = state.avatar.equippedItems[item.type] === item.id;
              return (
                <article key={item.id} className={`grid grid-cols-[72px_1fr] items-center gap-3 rounded-2xl border p-3 text-left sm:block sm:text-center ${isEquipped ? "border-leaf bg-leaf/10" : "border-line bg-cream2/65"}`}>
                  <div className="grid h-[72px] w-[72px] place-items-center rounded-2xl bg-cream text-5xl sm:mx-auto sm:h-auto sm:w-auto sm:bg-transparent sm:text-3xl">{item.emoji}</div>
                  <div>
                    <div className="text-base font-black sm:mt-1 sm:text-sm">{getShopItemName(locale, item)}</div>
                    <div className="text-xs font-black text-muted sm:text-[0.68rem]">{copy("materialLevel", { material: getMaterialLabel(locale, item.material ?? "especial"), level: item.unlockLevel ?? 1 })}</div>
                    <div className="mt-1 text-sm font-bold text-muted sm:mt-0 sm:text-xs">{formatBonus(locale, item.bonus)}</div>
                  </div>
                  <button onClick={() => isEquipped ? onUnequip(item.id) : onEquip(item.id)} className={`col-span-2 mt-1 w-full rounded-xl px-3 py-3 text-base font-black sm:mt-2 sm:py-2 sm:text-sm ${isEquipped ? "bg-coral/35 text-ink" : "bg-watersoft/45 text-ink"}`}>
                    {isEquipped ? copy("remove") : copy("equip")}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState text={copy("shopEmpty")} />
        )}
      </div>
      <div className="rounded-2xl border border-line bg-cream p-4">
        <div className="flex justify-between font-black"><span>{copy("level")} {state.progress.level}</span><span>{state.progress.xp} / {state.progress.xpToNextLevel} XP</span></div>
        <ProgressBar value={(state.progress.xp / state.progress.xpToNextLevel) * 100} color="#78C7E8" />
      </div>
      <div className="mt-4 grid gap-3 min-[380px]:grid-cols-2 md:grid-cols-3">
        {Object.entries(state.progress.stats).map(([key, value]) => {
          const category = key as Category;
          const bonus = equipmentBonus[category];
          return (
            <div key={key} className="rounded-2xl border border-line bg-cream p-3 text-center">
              <div className="font-black">{getCategoryLabel(locale, category)}</div>
              <div className="text-2xl font-black text-forest">{value + bonus}</div>
              <div className="text-xs font-bold text-muted">{value} {copy("base")} {bonus ? `+ ${bonus} ${copy("equipment")}` : `+ 0 ${copy("equipment")}`}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ShopPanel2({ state, onBuy }: { state: AppState; onBuy: (id: string) => void }) {
  const { locale, copy } = useI18n();
  const nextTier = nextMaterialTier(state.progress.level);
  const sortedItems = [...shopItems].sort((a, b) => (a.unlockLevel ?? 1) - (b.unlockLevel ?? 1) || a.price - b.price);
  return (
    <section className="soft-card rounded-[28px] p-3 sm:p-5">
      <div className="mb-4 grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black sm:text-xl">{copy("shopTitle")}</h2>
          <p className="mt-1 text-base font-bold leading-snug text-muted sm:text-sm">{nextTier ? copy("nextMaterial", { material: getMaterialLabel(locale, nextTier.material), level: nextTier.level }) : copy("allMaterialsUnlocked")}</p>
        </div>
        <span className="flex min-h-12 items-center justify-center rounded-2xl bg-sun/30 px-4 py-2 text-lg font-black sm:min-h-0 sm:text-base">{copy("coinsCount", { coins: state.progress.coins })}</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {materialTiers.map((tier) => <span key={tier.material} className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl px-3 py-2 text-center text-sm font-black sm:flex-none sm:px-4 ${state.progress.level >= tier.level ? "bg-leaf/20 text-forest" : "bg-cream2 text-muted"}`}>{copy("materialLevel", { material: getMaterialLabel(locale, tier.material), level: tier.level })}</span>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {sortedItems.map((item) => {
          const owned = state.avatar.ownedItems.includes(item.id);
          const equipped = state.avatar.equippedItems[item.type] === item.id;
          const locked = state.progress.level < (item.unlockLevel ?? 1);
          return (
            <article key={item.id} className={`grid grid-cols-[80px_1fr] items-center gap-3 rounded-2xl border bg-cream p-3 text-left shadow-sm sm:block sm:text-center ${equipped ? "border-leaf ring-2 ring-leaf/25" : locked ? "border-line opacity-60" : "border-line"}`}>
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-cream2 text-5xl sm:mx-auto sm:h-auto sm:w-auto sm:bg-transparent sm:text-4xl">{item.emoji}</div>
              <div>
              <div className="text-lg font-black leading-tight sm:mt-2 sm:text-sm">{getShopItemName(locale, item)}</div>
              <div className="mt-2 flex justify-start gap-1 text-xs font-black sm:mt-1 sm:justify-center sm:text-[0.68rem]">
                <span className="rounded-full bg-cream2 px-2 py-1 capitalize">{getMaterialLabel(locale, item.material ?? "especial")}</span>
                <span className="rounded-full bg-cream2 px-2 py-1">{copy("levelShort")} {item.unlockLevel ?? 1}</span>
              </div>
              <div className="mt-1 text-sm font-black text-forest sm:text-xs">{formatBonus(locale, item.bonus)}</div>
              </div>
              <div className="col-span-2 text-sm leading-snug text-muted sm:mb-3 sm:mt-1 sm:min-h-8 sm:text-xs">{locked ? copy("lockedLevel", { level: item.unlockLevel ?? 1 }) : owned ? getShopItemDescription(locale, item) : copy("costsCoins", { price: item.price })}</div>
              <button disabled={locked} onClick={() => onBuy(item.id)} className={`col-span-2 w-full rounded-xl px-3 py-3 text-base font-black disabled:cursor-not-allowed sm:py-2 sm:text-sm ${locked ? "bg-cream2 text-muted" : equipped ? "bg-leaf text-white" : owned ? "bg-watersoft/40 text-ink" : "bg-sun/45 text-ink"}`}>
                {locked ? copy("locked") : equipped ? copy("equipped") : owned ? copy("equip") : copy("buy")}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NewActivityPanel({ onCreate }: { onCreate: (form: FormData) => void }) {
  const { locale, copy } = useI18n();
  return (
    <section className="soft-card mx-auto max-w-5xl rounded-[28px] p-5">
      <h2 className="mb-4 text-xl font-black">{copy("newActivityTitle")}</h2>
      <form action={onCreate} className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-bold">{copy("name")}<input name="name" required placeholder={copy("exampleRead")} className="rounded-2xl border border-line bg-cream px-4 py-3" /></label>
        <label className="grid gap-1 text-sm font-bold">{copy("type")}<select name="type" className="rounded-2xl border border-line bg-cream px-4 py-3"><option value="daily">{copy("daily")}</option><option value="weekly">{copy("weekly")}</option><option value="monthly">{copy("monthly")}</option></select></label>
        <label className="grid gap-1 text-sm font-bold">{copy("unit")}<select name="unit" className="rounded-2xl border border-line bg-cream px-4 py-3">{activityUnits.map((unit) => <option key={unit} value={unit}>{getUnitLabel(locale, unit)}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold">{copy("target")}<input name="target" type="number" min={1} step="any" defaultValue={20} className="rounded-2xl border border-line bg-cream px-4 py-3" /></label>
        <label className="grid gap-1 text-sm font-bold">Veces por semana o mes<input name="periodTarget" type="number" min={1} max={31} step={1} defaultValue={1} className="rounded-2xl border border-line bg-cream px-4 py-3" /><span className="text-xs text-muted">Para actividades diarias se ignora. Ejemplo: 3 veces por semana.</span></label>
        <label className="grid gap-1 text-sm font-bold">Repetir cada cuántos días<input name="repeatEveryDays" type="number" min={1} max={31} step={1} defaultValue={1} className="rounded-2xl border border-line bg-cream px-4 py-3" /><span className="text-xs text-muted">Sólo para actividades diarias. Usá 2 para “día por medio”.</span></label>
        <label className="grid gap-1 text-sm font-bold">{copy("category")}<select name="category" className="rounded-2xl border border-line bg-cream px-4 py-3">{categories.map((category) => <option key={category} value={category}>{getCategoryLabel(locale, category)}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold">{copy("icon")}<select name="icon" className="rounded-2xl border border-line bg-cream px-4 py-3">{Object.keys(icons).map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold">{copy("color")}<input name="color" type="color" defaultValue="#8BCB77" className="h-12 rounded-2xl border border-line bg-cream px-4 py-1" /></label>
        <label className="grid gap-1 text-sm font-bold">{copy("notes")}<textarea name="notes" placeholder={copy("optional")} className="min-h-24 rounded-2xl border border-line bg-cream px-4 py-3" /></label>
        <button className="rounded-2xl bg-leaf px-5 py-3 font-black text-white md:col-span-2">{copy("createActivity")}</button>
      </form>
    </section>
  );
}
