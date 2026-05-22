import { DAYS, DAY_FULL } from "../constants/days";
import type { AvailabilityMap, DayKey, DayValue, TutorProfilePayload } from "../types";

interface BuildPayloadArgs {
  name: string;
  title: string;
  bio: string;
  rate: number | string;
  availability: Record<DayKey, DayValue>;
  courses: string[];
}

export function buildPayload({
  name,
  title,
  bio,
  rate,
  availability,
  courses,
}: BuildPayloadArgs): TutorProfilePayload {
  const result = {} as AvailabilityMap;

  DAYS.forEach((d) => {
    const day = availability?.[d];
    if (day?.enabled && day.start && day.end && day.end > day.start) {
      result[DAY_FULL[d]] = { start: day.start, end: day.end };
    }
  });

  return {
    name,
    title,
    bio,
    hourly_rate: Number(rate) || 0,
    availability: result,
    courses,
  };
}