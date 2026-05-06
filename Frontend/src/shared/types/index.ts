// ── App-wide types shared across all layers ──────────────────

export type Role = 'student' | 'tutor' | 'admin';

export interface Tutor {
  id: number;
  name: string;
  initials: string;
  color: string;
  courses: string[];
  rating: number;
  reviews: number;
  sessions: number;
  online: boolean;
  bio: string;
  hourly: number;
  available: string[];
}

export interface BottomNavLink {
  key: string;
  path: string;
  icon: string;
  label: string;
  badge?: number;
}
