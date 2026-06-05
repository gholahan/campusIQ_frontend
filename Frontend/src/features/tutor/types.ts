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

export interface TutorProfileRead {
  user_id: string;
  full_name: string;
  title: string | null;
  bio: string;
  hourly_rate: string | number | null;
  availability: AvailabilityMap | null;
  is_online: boolean;
  average_rating: string | number;
  review_count: number;
  total_sessions: number;
  courses: CourseRead[];

  profile_picture_url: string | null;
}

//payload 
export interface TutorProfilePayload {
  name: string;
  title: string;
  bio: string;
  hourly_rate: number;
  availability: AvailabilityMap;
  courses: string[];
}

export type TutorSearchParams = {
  q?: string; // global search

  name?: string;
  course?: string;

  is_online?: boolean;

  min_rate?: number;
  max_rate?: number;
  min_rating?: number;

  order_by?: "average_rating" | "hourly_rate";
  order_dir?: "asc" | "desc";

  offset?: number;
  limit?: number;
};

export type TutorSearchResult = {
  total: number;
  tutors: TutorProfileRead[];
};

export interface TutorProfileUpdatePayload {
  profile_picture_url?: string;
  title?: string;
  bio?: string;
  hourly_rate?: number;
  availability?: AvailabilityMap;
  courses?: string[];
}

export type ScheduledAt = {
  day: string;
  start: string;
  end: string;
};

export type Session = {
  id: string;
  student_id: string;
  tutor_id: string;
  subject: string;
  duration: number;
  scheduled_at: ScheduledAt | null;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  cost: string; // backend sends big decimal as string
  created_at: string;
  updated_at: string;
};

export type CreateSessionPayload = {
  tutor_id: string;
  subject: string;
  duration: number;
  cost: number;
  scheduled_at: ScheduledAt | null;
  notes: string;
};