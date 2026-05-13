import type { Role } from "@/shared/types";

export interface SyncUserPayload {
  role: Role;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: string;
  role: Role;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  email_verified: boolean;
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  last_seen_at: string | null;
}