import type { Avatar } from "./types";

export const defaultAppearance: Avatar["appearance"] = {
  gender: "unspecified",
  skinTone: "#FFD6B0",
  hairStyle: "short",
  hairColor: "#5B3A29",
  shirtColor: "#8BCB77",
  pantsColor: "#4194D0",
  eyeStyle: "round",
  facialHair: "none",
  height: 50,
  bodyBuild: 45,
  muscularity: 35
};

export const defaultAvatar: Avatar = {
  name: "Aventurero",
  appearance: defaultAppearance,
  equippedItems: {},
  ownedItems: []
};
