"use client";

import { CalendarDays, Home, Map, Smile, Sparkles } from "lucide-react";
import { getViewLabel, type Locale } from "@/lib/i18n";

const items = [
  { id: "today", icon: Home },
  { id: "week", icon: Sparkles },
  { id: "month", icon: CalendarDays },
  { id: "world", icon: Map },
  { id: "avatar", icon: Smile }
] as const;

export type ViewId = (typeof items)[number]["id"] | "stats" | "shop" | "new" | "friends";

export function BottomNav({ current, locale, onChange }: { current: ViewId; locale: Locale; onChange: (view: ViewId) => void }) {
  return (
    <nav className="fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-xl rounded-[26px] border border-line bg-cream/95 p-1.5 shadow-soft backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[0.72rem] font-extrabold leading-none ${active ? "bg-leaf text-white" : "text-muted"}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={2.4} />
              {getViewLabel(locale, item.id)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
