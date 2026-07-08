import { defaultActivities } from "@/data/defaultActivities";
import { defaultAvatar } from "./avatar";
import { recomputeStreak } from "./rewards";
import type { AppState } from "./types";

const KEY = "volver-a-mi-state-v3";
const STORAGE_VERSION = 1;

export type LocalStateRecord = {
  state: AppState;
  remoteUpdatedAt: string | null;
  modifiedAt: string;
  dirty: boolean;
  exists: boolean;
};

export type RemoteStateRecord = {
  state: AppState;
  updatedAt: string;
};

type StoredEnvelope = Omit<LocalStateRecord, "exists"> & {
  version: number;
};

export class RemoteConflictError extends Error {
  remote: RemoteStateRecord;

  constructor(remote: RemoteStateRecord) {
    super("El progreso cambio en otro dispositivo.");
    this.name = "RemoteConflictError";
    this.remote = remote;
  }
}

function stateKey(userId: string) {
  return `${KEY}:${userId}`;
}

export const initialState: AppState = {
  activities: defaultActivities,
  logs: [],
  progress: {
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
      intelligence: 0,
      creativity: 0,
      discipline: 0,
      social: 0,
      joy: 0
    }
  },
  avatar: defaultAvatar
};

export function loadStateRecord(userId: string): LocalStateRecord {
  const empty: LocalStateRecord = {
    state: initialState,
    remoteUpdatedAt: null,
    modifiedAt: new Date(0).toISOString(),
    dirty: false,
    exists: false
  };
  if (typeof window === "undefined") return empty;
  try {
    const key = stateKey(userId);
    const stored = window.localStorage.getItem(key) ?? window.localStorage.getItem(KEY);
    if (!stored) return empty;
    const parsed = JSON.parse(stored) as AppState | StoredEnvelope;
    const isEnvelope = "version" in parsed && "state" in parsed;
    const record: LocalStateRecord = isEnvelope ? {
      state: normalizeState(parsed.state),
      remoteUpdatedAt: parsed.remoteUpdatedAt ?? null,
      modifiedAt: parsed.modifiedAt ?? new Date().toISOString(),
      dirty: Boolean(parsed.dirty),
      exists: true
    } : {
      state: normalizeState(parsed),
      remoteUpdatedAt: null,
      modifiedAt: new Date().toISOString(),
      dirty: true,
      exists: true
    };
    if (!window.localStorage.getItem(key)) {
      saveStateRecord(record.state, userId, record);
      window.localStorage.removeItem(KEY);
    }
    return record;
  } catch {
    return empty;
  }
}

export function normalizeState(parsed: Partial<AppState>): AppState {
  const savedActivities = Array.isArray(parsed.activities) ? parsed.activities : [];
  const mergedSavedActivities = savedActivities.map((activity) => {
    const defaults = defaultActivities.find((item) => item.id === activity.id);
    return defaults ? {
      ...activity,
      ...defaults,
      isActive: activity.isActive ?? defaults.isActive,
      createdAt: activity.createdAt ?? defaults.createdAt,
      description: activity.description ?? defaults.description,
      limit: activity.limit ?? defaults.limit
    } : activity;
  });
  const missingDefaultActivities = defaultActivities.filter((activity) => !savedActivities.some((saved) => saved.id === activity.id));
  const activities = [...mergedSavedActivities, ...missingDefaultActivities];
  const logs = Array.isArray(parsed.logs) ? parsed.logs : [];
  const savedProgress = parsed.progress;
  const progress = recomputeStreak({
    ...initialState.progress,
    ...savedProgress,
    stats: {
      ...initialState.progress.stats,
      ...savedProgress?.stats
    }
  }, logs);
  const avatar = {
    ...initialState.avatar,
    ...parsed.avatar,
    appearance: {
      ...initialState.avatar.appearance,
      ...parsed.avatar?.appearance
    },
    equippedItems: {
      ...initialState.avatar.equippedItems,
      ...parsed.avatar?.equippedItems
    },
    ownedItems: Array.isArray(parsed.avatar?.ownedItems) ? parsed.avatar.ownedItems : initialState.avatar.ownedItems
  };
  return { ...initialState, ...parsed, activities, logs, progress, avatar };
}

export function saveStateRecord(
  state: AppState,
  userId: string,
  sync: Pick<LocalStateRecord, "remoteUpdatedAt" | "modifiedAt" | "dirty">
) {
  if (typeof window !== "undefined") {
    try {
      const envelope: StoredEnvelope = {
        version: STORAGE_VERSION,
        state,
        remoteUpdatedAt: sync.remoteUpdatedAt,
        modifiedAt: sync.modifiedAt,
        dirty: sync.dirty
      };
      window.localStorage.setItem(stateKey(userId), JSON.stringify(envelope));
    } catch {
      // Remote sync remains available when browser storage is blocked or full.
    }
  }
}

export async function loadRemoteState() {
  const response = await fetch("/api/state", { cache: "no-store" });
  if (response.status === 503) return null;
  if (!response.ok) throw new Error("No pude cargar la base de datos.");

  const data = await response.json() as { state: AppState | null; updatedAt: string | null };
  return data.state && data.updatedAt ? { state: normalizeState(data.state), updatedAt: data.updatedAt } : null;
}

export async function saveRemoteState(state: AppState, expectedUpdatedAt: string | null, force = false) {
  const response = await fetch("/api/state", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ state, expectedUpdatedAt, force })
  });

  if (response.status === 409) {
    const data = await response.json() as { state: AppState; updatedAt: string };
    throw new RemoteConflictError({ state: normalizeState(data.state), updatedAt: data.updatedAt });
  }
  if (!response.ok) throw new Error("No pude guardar en la base de datos.");
  return await response.json() as { ok: true; updatedAt: string };
}
