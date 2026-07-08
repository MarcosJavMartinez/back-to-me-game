import { toIntlLocale, type Locale } from "./i18n";

export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfWeek(date = new Date()) {
  const start = new Date(date);
  const offset = (start.getDay() + 6) % 7;
  start.setHours(0, 0, 0, 0);
  return addDays(start, -offset);
}

export function getWeekDays(date = new Date(), locale: Locale = "es") {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(start, index);
    return {
      date: day,
      key: toDateKey(day),
      label: new Intl.DateTimeFormat(toIntlLocale(locale), { weekday: "short" }).format(day),
      number: day.getDate()
    };
  });
}

export function monthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function formatLongDate(dateKey: string, locale: Locale = "es") {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date(`${dateKey}T12:00:00`));
}

export function getMonthDays(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = addDays(first, -startOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const day = addDays(start, index);
    return {
      date: day,
      key: toDateKey(day),
      isCurrentMonth: day.getMonth() === month,
      number: day.getDate()
    };
  });
}
