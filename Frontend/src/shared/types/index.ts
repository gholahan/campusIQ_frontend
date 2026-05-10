// ── App-wide types shared across all layers ──────────────────

import type { LucideIcon } from 'lucide-react';
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

export type BottomNavLink = {
  key: string;
  path: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
};
