import type { DayKey, FullDayKey } from "../types"; // ← was importing DayKey twice

export const DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DAY_LABEL: Record<DayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export const DAY_FULL: Record<DayKey, FullDayKey> = {
  mon: "monday",       // ← keys must be DayKey (short), values are FullDayKey (long)
  tue: "tuesday",
  wed: "wednesday",
  thu: "thursday",
  fri: "friday",
  sat: "saturday",
  sun: "sunday",
};

export const STEP_LABELS = ["Bio & rate", "Availability", "Courses", "Review"];