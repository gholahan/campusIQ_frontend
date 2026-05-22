export interface TutorProfile {
  name: string;
  title: string;
  bio: string;
  hourly_rate: number;
  availability: AvailabilityMap;
  courses: string[];
}

export interface TutorProfileFormValues {
  name: string;
  title: string;
  bio: string;
  hourly_rate: number;
  courses: string[];
  availability: Record<DayKey, DayValue>; // ← Formik owns this shape
}

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type FullDayKey =
  | "monday" | "tuesday" | "wednesday" | "thursday"
  | "friday" | "saturday" | "sunday";

// what lives in Formik values per day
export interface DayValue {
  enabled: boolean;
  start: string;
  end: string;
}

// what gets sent to the API per day
export interface DayWindow {
  start: string;
  end: string;
}

export interface CourseRead {
  id: string;
  name: string;
}

// the final API availability shape
export type AvailabilityMap = Partial<Record<FullDayKey, DayWindow>>;

// the full API payload
export interface TutorProfilePayload {
  name: string;
  title: string;
  bio: string;
  hourly_rate: number;
  availability: AvailabilityMap;
  courses: string[];
}

export interface TutorProfileRead {
  user_id: string;

  full_name: string;

  title: string | null;

  bio: string;

  hourly_rate: string | number | null; // Decimal comes as string from backend

  availability: AvailabilityMap | null;

  is_online: boolean;

  average_rating: string | number; // Decimal

  review_count: number;

  total_sessions: number;

  courses: CourseRead[];
}
