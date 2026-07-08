import { shopItems } from "@/data/shopItems";
import type { AppState, Category } from "./types";

export function getEquippedItems(state: AppState) {
  return shopItems.filter((item) => state.avatar.equippedItems[item.type] === item.id);
}

export function getEquipmentBonus(state: AppState): Record<Category, number> {
  const empty: Record<Category, number> = {
    health: 0,
    creativity: 0,
    intelligence: 0,
    discipline: 0,
    social: 0,
    joy: 0
  };
  return getEquippedItems(state).reduce((bonus, item) => {
    Object.entries(item.bonus ?? {}).forEach(([category, value]) => {
      bonus[category as Category] += value ?? 0;
    });
    return bonus;
  }, empty);
}
