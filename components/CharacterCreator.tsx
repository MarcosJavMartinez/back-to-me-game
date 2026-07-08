"use client";

import { useEffect, useState } from "react";
import type { Avatar } from "@/lib/types";
import { CharacterPreview } from "./CharacterPreview";

const skinTones = ["#FFD6B0", "#E8B98D", "#C98C62", "#9B633F", "#6E432D"];
const hairColors = ["#2F241F", "#5B3A29", "#A75B35", "#E1B866", "#6C4A8A"];
const shirtColors = ["#8BCB77", "#78C7E8", "#F28B82", "#A78BFA", "#F7C948", "#2F2F2F"];
const pantsColors = ["#4194D0", "#315B7D", "#59483D", "#6C4A8A", "#387C55", "#2F2F2F"];

type CharacterCreatorProps = {
  avatar: Avatar;
  onSave: (name: string, appearance: Avatar["appearance"]) => void;
  submitLabel?: string;
  disabled?: boolean;
};

export function CharacterCreator({
  avatar,
  onSave,
  submitLabel = "Guardar personaje",
  disabled = false
}: CharacterCreatorProps) {
  const [name, setName] = useState(avatar.name);
  const [appearance, setAppearance] = useState(avatar.appearance);

  useEffect(() => {
    setName(avatar.name);
    setAppearance(avatar.appearance);
  }, [avatar.appearance, avatar.name]);

  function setColor(key: "skinTone" | "hairColor" | "shirtColor" | "pantsColor", value: string) {
    setAppearance((current) => ({ ...current, [key]: value }));
  }

  function setSlider(key: "height" | "bodyBuild" | "muscularity", value: number) {
    setAppearance((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mb-5 grid gap-4 rounded-[24px] border border-line bg-skysoft/35 p-4 md:grid-cols-[280px_1fr] md:items-center">
      <CharacterPreview equippedItems={avatar.equippedItems} appearance={appearance} />
      <div className="grid min-w-0 gap-5">
        <label className="grid gap-1 text-sm font-black">
          Nombre de tu personaje
          <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={40} className="rounded-2xl border border-line bg-cream px-4 py-3 text-base" />
        </label>
        <div>
          <div className="mb-2 text-sm font-black">Género</div>
          <div className="grid grid-cols-3 gap-2">
            {(["woman", "man", "unspecified"] as const).map((gender) => (
              <button type="button" key={gender} onClick={() => setAppearance((current) => ({ ...current, gender }))} className={`min-h-11 rounded-xl px-2 py-2 text-sm font-black ${appearance.gender === gender ? "bg-forest text-white" : "bg-cream"}`}>
                {{ woman: "Mujer", man: "Hombre", unspecified: "Sin mencionar" }[gender]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 rounded-2xl bg-cream p-4">
          {([
            ["height", "Altura", "Bajo", "Alto"],
            ["bodyBuild", "Contextura", "Flaquito", "Gordito"],
            ["muscularity", "Físico", "Suave", "Fuerte"]
          ] as const).map(([key, label, low, high]) => (
            <label key={key} className="grid gap-2">
              <span className="flex justify-between gap-3 text-sm font-black"><span>{label}</span><span className="text-muted">{appearance[key]}%</span></span>
              <input type="range" min="0" max="100" value={appearance[key]} onChange={(event) => setSlider(key, Number(event.target.value))} className="h-3 w-full cursor-pointer accent-forest" />
              <span className="flex justify-between text-xs font-bold text-muted"><span>{low}</span><span>{high}</span></span>
            </label>
          ))}
        </div>
        <div>
          <div className="mb-2 text-sm font-black">Tono de piel</div>
          <div className="flex flex-wrap gap-2">{skinTones.map((color) => <button type="button" key={color} onClick={() => setColor("skinTone", color)} aria-label={`Piel ${color}`} className={`h-11 w-11 rounded-full border-4 ${appearance.skinTone === color ? "border-forest" : "border-white"}`} style={{ backgroundColor: color }} />)}</div>
        </div>
        <div>
          <div className="mb-2 text-sm font-black">Forma del pelo</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(["short", "curly", "long", "ponytail", "mohawk", "none"] as const).map((style) => (
              <button type="button" key={style} onClick={() => setAppearance((current) => ({ ...current, hairStyle: style }))} className={`min-h-10 rounded-xl px-3 py-2 text-sm font-black ${appearance.hairStyle === style ? "bg-forest text-white" : "bg-cream"}`}>
                {{ short: "Corto", curly: "Rulos", long: "Largo", ponytail: "Colita", mohawk: "Cresta", none: "Sin pelo" }[style]}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">{hairColors.map((color) => <button type="button" key={color} onClick={() => setColor("hairColor", color)} aria-label={`Pelo ${color}`} className={`h-10 w-10 rounded-full border-4 ${appearance.hairColor === color ? "border-forest" : "border-white"}`} style={{ backgroundColor: color }} />)}</div>
        </div>
        <div>
          <div className="mb-2 text-sm font-black">Forma de ojos</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["round", "happy", "sleepy", "sparkle"] as const).map((style) => (
              <button type="button" key={style} onClick={() => setAppearance((current) => ({ ...current, eyeStyle: style }))} className={`min-h-10 rounded-xl px-2 py-2 text-sm font-black ${appearance.eyeStyle === style ? "bg-forest text-white" : "bg-cream"}`}>
                {{ round: "Redondos", happy: "Alegres", sleepy: "Dormidos", sparkle: "Brillantes" }[style]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-black">Pelo facial</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["none", "stubble", "mustache", "beard"] as const).map((style) => (
              <button type="button" key={style} onClick={() => setAppearance((current) => ({ ...current, facialHair: style }))} className={`min-h-10 rounded-xl px-2 py-2 text-sm font-black ${appearance.facialHair === style ? "bg-forest text-white" : "bg-cream"}`}>
                {{ none: "Sin barba", stubble: "Sombra", mustache: "Bigote", beard: "Barba" }[style]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-black">Color de remera</div>
          <div className="flex flex-wrap gap-2">{shirtColors.map((color) => <button type="button" key={color} onClick={() => setColor("shirtColor", color)} aria-label={`Remera ${color}`} className={`h-10 w-10 rounded-xl border-4 ${appearance.shirtColor === color ? "border-forest" : "border-white"}`} style={{ backgroundColor: color }} />)}</div>
        </div>
        <div>
          <div className="mb-2 text-sm font-black">Color de pantalón</div>
          <div className="flex flex-wrap gap-2">{pantsColors.map((color) => <button type="button" key={color} onClick={() => setColor("pantsColor", color)} aria-label={`Pantalón ${color}`} className={`h-10 w-10 rounded-xl border-4 ${appearance.pantsColor === color ? "border-forest" : "border-white"}`} style={{ backgroundColor: color }} />)}</div>
        </div>
        <button type="button" disabled={disabled || name.trim().length < 2} onClick={() => onSave(name.trim(), appearance)} className="rounded-2xl bg-leaf px-5 py-3 font-black text-white disabled:opacity-50">{submitLabel}</button>
      </div>
    </div>
  );
}
