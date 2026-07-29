export interface ScheduledAt {
  day: string;
  start: string;
  end: string;
}

export type SessionStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'completed'
  | 'cancelled'
  | 'in_progress'
  | 'no_show';

export type Session = {
  id: string;
  student_id: string;
  tutor_id: string;
  subject: string;
  duration: number;
  scheduled_at: ScheduledAt | null;
  notes: string;
  status: SessionStatus;
  cost: string;
  meet_link: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

export interface SessionTutor {
  id: string;
  full_name: string;
  profile_picture_url: string | null;
}

export interface SessionRead {
  id: string;
  subject: string;
  duration: number;
  notes: string | null;
  status: SessionStatus;
  cost: number;
  meet_link: string | null;
  started_at: string | null;
  ended_at: string | null;
  tutor: SessionTutor;
  student?: SessionTutor
  scheduled_at: ScheduledAt;
  created_at: string;
}

export type CreateSessionPayload = {
  tutor_id: string;
  subject: string;
  duration: number;
  scheduled_at: ScheduledAt | null;
  notes: string;
};

export type AcceptSessionPayload = {
  meet_link: string;
};

export type ReviewCreate = {
  rating: number;
  comment?: string;
};

export type ReviewRead = {
  id: string;
  session_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};