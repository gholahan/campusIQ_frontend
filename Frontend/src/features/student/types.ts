export interface StudentDashboardStats {
  sessions: { this_week: number; delta: number };
  learning: { hours_this_week: number };
  tutors: { active_this_week: number };
  ai: { questions_this_week: number };
}

export type StatCardData = {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  delta?: number;
};