export type ActivityType = "daily" | "weekly" | "monthly";
export type ActivityUnit =
  | "yes_no"
  | "minutes"
  | "hours"
  | "kilometers"
  | "meters"
  | "glasses"
  | "sets"
  | "reps"
  | "times"
  | "pages"
  | "healthy_meals"
  | "text";

export type Category = "health" | "creativity" | "intelligence" | "discipline" | "social" | "joy";

export type Activity = {
  id: string;
  name: string;
  description?: string;
  type: ActivityType;
  icon: string;
  color: string;
  unit: ActivityUnit;
  targetValue?: number;
  targetLabel?: string;
  periodTarget?: number;
  repeatEveryDays?: number;
  createdAt: string;
  isActive: boolean;
  suggestedDays?: number[];
  category: Category;
  limit?: {
    baseValue: number;
    stepValue: number;
    everyCompletions: number;
    maxValue: number;
  };
};

export type ActivityLog = {
  id: string;
  activityId: string;
  date: string;
  value?: number;
  textValue?: string;
  status: "pending" | "completed" | "moved" | "not_done";
  notes?: string;
  xpEarned: number;
  coinsEarned: number;
  createdAt: string;
};

export type UserProgress = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  energy: number;
  streakCurrent: number;
  streakBest: number;
  streakFreezes: number;
  lastStreakFreezeDate?: string;
  stats: Record<Category, number>;
};

export type Avatar = {
  name: string;
  appearance: {
    gender: "woman" | "man" | "unspecified";
    skinTone: string;
    hairStyle: "short" | "curly" | "long" | "ponytail" | "mohawk" | "none";
    hairColor: string;
    shirtColor: string;
    pantsColor: string;
    eyeStyle: "round" | "happy" | "sleepy" | "sparkle";
    facialHair: "none" | "stubble" | "mustache" | "beard";
    height: number;
    bodyBuild: number;
    muscularity: number;
  };
  equippedItems: Partial<Record<ShopItem["type"], string>>;
  ownedItems: string[];
};

export type ShopItem = {
  id: string;
  name: string;
  type: "head" | "body" | "accessory" | "backpack" | "weapon" | "pet" | "background";
  price: number;
  emoji?: string;
  rarity: "common" | "rare" | "epic";
  description: string;
  bonus?: Partial<Record<Category, number>>;
  unlockLevel?: number;
  material?: "papel" | "carton" | "paja" | "planta" | "goma" | "madera" | "chapa" | "metal" | "oro" | "rubi" | "especial";
};

export type AppState = {
  activities: Activity[];
  logs: ActivityLog[];
  progress: UserProgress;
  avatar: Avatar;
};
